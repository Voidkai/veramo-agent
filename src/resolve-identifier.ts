import { agent } from './veramo/setup.js'
import { DIDResolutionResult } from '@veramo/core'

async function main() {
    const result = await agent.resolveDid({ didUrl: 'did:ethr:morph-holesky:0x...' })
    console.log('..................')
    if (result.didDocument) {
        console.log('DID Document')
        console.log(JSON.stringify(result.didDocument, null, 2))
    }
}

main().catch(console.log)