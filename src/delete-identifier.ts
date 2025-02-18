import { agent } from './veramo/setup.js'

async function main() {
  const identifier = process.argv[2]

  if (!identifier) {
    console.error('identifier is required')
    process.exit(1)
  }

  const result = await agent.didManagerDelete({ did: identifier })
  if (result) {
    console.log(`Identifier deleted`)
  } else {
    console.log(`Identifier not found`)
  }
}

main().catch(console.log)