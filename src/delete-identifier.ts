import { agent } from './veramo/setup.js'

async function main() {
  const result = await agent.didManagerDelete({  did: 'did:ethr:morph-holesky:0x...'})
  if (result) {
    console.log(`Identifier deleted`)
  } else {
    console.log(`Identifier not found`)
  }
}

main().catch(console.log)