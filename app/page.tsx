"use client";

import ServerCard from "@/components/serverCard";
import { useState } from "react";

const servers = [
  { name: "server-one", os: "Ubuntu" },
  { name: "server-two", os: "Ubuntu" },
  { name: "server-three", os: "Ubuntu" },
];

export default function Home() {
  const [status, setStatus] = useState("ready");

  function pingServers() {
    setStatus("pinging");

    // Simulating a network request delay to show the "online" state
    setTimeout(() => {
      setStatus("online");
    }, 2000);
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto p-6 md:p-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Ansible Lab
        </h1>
        <p className="text-slate-600 text-lg">
          Manage your servers from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {servers.map((server) => (
          <ServerCard
            key={server.name}
            name={server.name}
            os={server.os}
            status={status}
          />
        ))}
      </div>

      <div className="flex border-t border-slate-200 pt-6">
        <button
          disabled={status == "pinging"}
          onClick={pingServers}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {status === "pinging" ? "Pinging..." : "Ping Servers"}
        </button>
      </div>
    </main>
  );
}
