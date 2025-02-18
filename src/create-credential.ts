import { agent } from './veramo/setup.js'
import { attestCredential } from './SP/attestation.js'
async function main() {
  const identifier = await agent.didManagerGetByAlias({ alias: 'default' })

  const verifiableCredential = await agent.createVerifiableCredential({
    credential: {
      issuer: { id: identifier.did },
      credentialSubject: {
        id: 'did:web:xxx.com',
        you: 'Rock',
      },
    },
    proofFormat: 'jwt',
  })
  console.log(`New credential created`)
  console.log(JSON.stringify(verifiableCredential, null, 2))
  attestCredential(verifiableCredential)
}

main().catch(console.log)