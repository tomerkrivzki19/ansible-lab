// /api/ping
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);

const ANSIBLE_BIN = "/home/tomeriko19/.local/bin/ansible";

const INVENTORY_PATH = "/mnt/c/Projects/ansible/ansible/ansible/inventory.ini";

/**
 * Converts Ansible's output into structured server results.
 */
function parsePingOutput(output = "") {
  const servers = {};

  const regex = /^(\S+)\s*\|\s*(SUCCESS|UNREACHABLE|FAILED)!?\s*=>\s*(.+)$/gm;

  let match;

  while ((match = regex.exec(output)) !== null) {
    const serverName = match[1];
    const ansibleStatus = match[2];
    const responseText = match[3];

    let response = {};

    try {
      response = JSON.parse(responseText);
    } catch {
      response = {
        msg: responseText,
      };
    }

    servers[serverName] = {
      status: ansibleStatus === "SUCCESS" ? "online" : "offline",

      ansibleStatus,

      ping: response.ping || null,

      error:
        ansibleStatus === "SUCCESS"
          ? null
          : response.msg || "Ansible ping failed",
    };
  }

  return servers;
}

export async function GET() {
  const password = process.env.ANSIBLE_SSH_PASSWORD;

  if (!password) {
    return Response.json(
      {
        success: false,
        status: "configuration-error",
        error: "ANSIBLE_SSH_PASSWORD is missing from .env.local",
      },
      { status: 500 },
    );
  }

  let stdout = "";
  let stderr = "";
  let commandError = null;

  try {
    const result = await execFileAsync(
      "wsl.exe",
      [
        "--exec",
        ANSIBLE_BIN,
        "all",
        "-i",
        INVENTORY_PATH,
        "-m",
        "ping",
        "-o",

        // Sends the password without an interactive prompt.
        "--extra-vars",
        `ansible_password=${password}`,
      ],
      {
        timeout: 30000,
        maxBuffer: 1024 * 1024,
      },
    );

    stdout = result.stdout?.toString() || "";
    stderr = result.stderr?.toString() || "";
  } catch (error) {
    stdout = error.stdout?.toString() || "";
    stderr = error.stderr?.toString() || "";
    commandError = error.message;
  }

  const servers = parsePingOutput(stdout);
  const serverList = Object.values(servers);

  if (serverList.length === 0) {
    return Response.json(
      {
        success: false,
        status: "ansible-error",
        error: commandError || stderr || "No response from Ansible",

        // Included here to help diagnose command errors.
        rawOutput: stdout || null,
        warnings: stderr || null,
      },
      { status: 500 },
    );
  }

  const allOnline = serverList.every((server) => server.status === "online");

  return Response.json(
    {
      success: allOnline,

      status: allOnline ? "all-online" : "some-servers-offline",

      servers,
    },
    { status: 200 },
  );
}
// funciton status: ready,ping,online
// function error: a function that explains the ping failed
