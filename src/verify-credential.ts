import { getAttestation } from './SP/attestation.js'
import { agent } from './veramo/setup.js'

async function main() {
  const attestationId = process.argv[2]

  if (!attestationId) {
    console.error('Attestation ID is required')
    process.exit(1)
  }

  const credentialOnchain = await getAttestation(attestationId)
  const result = await agent.verifyCredential({
    credential: credentialOnchain,
  })
  console.log(`CredentialOnchain`, credentialOnchain)
  console.log(`Credential verified`, result.verified)
}

main().catch(console.log)