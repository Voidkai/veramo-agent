import { getAttestation } from './SP/attestation.js'
import { agent } from './veramo/setup.js'

async function main() {
  const credentialOnchain = await getAttestation(2)
  const result = await agent.verifyCredential({
    credential: credentialOnchain,
  })
  console.log(`CredentialOnchain`, credentialOnchain)
  console.log(`Credential verified`, result.verified)
}

main().catch(console.log)