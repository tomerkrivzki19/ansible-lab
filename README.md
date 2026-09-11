# Ansible Server Monitoring Dashboard

A Next.js dashboard that uses Ansible through WSL to check the connection status of multiple Ubuntu servers.

The application runs the Ansible `ping` module and displays whether each configured server is online or offline.

## Features

- Ping multiple servers from a Next.js dashboard
- Run Ansible commands through Windows Subsystem for Linux
- Display individual server status
- Loading state while Ansible is running
- Error information when a server cannot be reached
- SSH password stored securely in environment variables
- Responsive interface built with Tailwind CSS

## Technologies

- Next.js
- React
- Tailwind CSS
- Node.js
- Ansible
- WSL
- SSH

## Requirements

Before running the project, install:

- Node.js
- WSL with Ubuntu
- Ansible inside WSL
- `sshpass` inside WSL
- Python 3 on each managed server
- SSH access to each managed server

Install Ansible and `sshpass` inside WSL:

```bash
sudo apt update
sudo apt install ansible sshpass -y
```

Confirm the installation:

```bash
ansible --version
sshpass -V
```

## Installation

Clone the repository:

```bash
git clone https://github.com/tomerkrivzki19/ansible-lab.git
cd ansible-lab
```

Install the project dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
ANSIBLE_SSH_PASSWORD=your_ssh_password
```

Do not commit `.env.local` to GitHub.

Make sure `.gitignore` contains:

```gitignore
.env*
```

## Ansible Inventory

Create an `inventory.ini` file:

```ini
[servers]
server-one ansible_host=SERVER_ONE_IP ansible_user=SSH_USERNAME
server-two ansible_host=SERVER_TWO_IP ansible_user=SSH_USERNAME
server-three ansible_host=SERVER_THREE_IP ansible_user=SSH_USERNAME

[servers:vars]
ansible_python_interpreter=/usr/bin/python3.12
```

Replace the server IP addresses and SSH username with your own values.

Do not add the SSH password to `inventory.ini`.

## Configuration

Update the paths in the Next.js API route if your local paths are different:

```js
const ANSIBLE_BIN = "/home/YOUR_WSL_USERNAME/.local/bin/ansible";

const INVENTORY_PATH = "/mnt/c/path/to/your/inventory.ini";
```

Find the Ansible executable path with:

```bash
which ansible
```

Find the inventory’s complete path with:

```bash
realpath inventory.ini
```

## Test Ansible

Before starting Next.js, test the connection from WSL:

```bash
ansible all -i inventory.ini -m ping --ask-pass
```

A successful result should include:

```text
server-one | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

The Next.js API supplies the password automatically, so it does not use the interactive `--ask-pass` option.

## Run the Application

Start the development server:

```bash
npm run dev
```

Open the dashboard:

```text
http://localhost:3000
```

Test the API directly:

```text
http://localhost:3000/api/ping
```

## API Response

A successful response looks like:

```json
{
  "success": true,
  "status": "all-online",
  "servers": {
    "server-one": {
      "status": "online",
      "ansibleStatus": "SUCCESS",
      "ping": "pong",
      "error": null
    },
    "server-two": {
      "status": "online",
      "ansibleStatus": "SUCCESS",
      "ping": "pong",
      "error": null
    },
    "server-three": {
      "status": "online",
      "ansibleStatus": "SUCCESS",
      "ping": "pong",
      "error": null
    }
  }
}
```

## Status Flow

The dashboard uses the following status flow:

```text
ready → pinging → online/offline
```

- `ready`: The server has not been checked yet.
- `pinging`: Ansible is currently checking the server.
- `online`: The server returned `pong`.
- `offline`: Ansible failed to connect to the server.

## Security

This project currently uses SSH password authentication for local development.

For production use:

- Use SSH key authentication
- Protect the API route with authentication
- Do not expose the API publicly without access control
- Never commit `.env.local` or SSH credentials
- Avoid returning sensitive Ansible output to the browser

## Author

Created by [Tomer Krivizki](https://github.com/tomerkrivzki19).
