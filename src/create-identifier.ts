import { agent } from './veramo/setup.js'

async function main() {
  const identifier = await agent.didManagerCreate({ alias: 'default', provider: 'did:ethr:morph-holesky' })
  console.log(`New identifier created`)
  console.log(JSON.stringify(identifier, null, 2))
}

main().catch(console.log)