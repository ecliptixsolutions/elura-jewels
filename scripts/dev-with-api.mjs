import { spawn } from 'node:child_process'
import process from 'node:process'

const withNodeMemory = {
  ...process.env,
  DOTENV_CONFIG_QUIET: 'true',
  NODE_OPTIONS: process.env.NODE_OPTIONS?.includes('--max-old-space-size')
    ? process.env.NODE_OPTIONS
    : `${process.env.NODE_OPTIONS ?? ''} --max-old-space-size=4096`.trim(),
}

const commands = [
  {
    name: 'api',
    command: process.execPath,
    args: ['backend/server.js'],
    env: {
      ...withNodeMemory,
      PORT: process.env.PORT || '5000',
    },
  },
  {
    name: 'vite',
    command: process.execPath,
    args: ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0', '--port', '5173', '--strictPort'],
    env: withNodeMemory,
  },
]

const children = commands.map(({ name, command, args, env }) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env,
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      return
    }

    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`)
      shutdown(code)
    }
  })

  return child
})

let isShuttingDown = false

function shutdown(code = 0) {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true

  children.forEach((child) => {
    if (!child.killed) {
      child.kill()
    }
  })

  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
