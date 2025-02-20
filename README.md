# Veramo Agent with Sign Protocol Integration

This project demonstrates a Veramo agent implementation with Sign Protocol (SP) integration for managing decentralized identifiers (DIDs) and verifiable credentials on Morph.

## Introduction
In this project, we integrated DID/VC and the Sign Protocol by uploading the VC as a field within a Schema on-chain. First, we need to register a Schema on the Sign Protocol, which serves as a standardized data structure for subsequent Attestation transactions. Depending on the specific application scenario, this Schema can be modified. However, one key field in the Schema is Credential, which refers to the Verifiable Credential (VC) generated via the Veramo agent.

Since the VC is in JSON format, we first encode it and then interact with the on-chain Sign Protocol smart contract using Ether.js-provided APIs. This allows us to send a contract transaction that uploads the encoded VC to the blockchain for storage. Later, when we need to retrieve and verify the VC, we can call the methods provided by the Sign Protocol contract to obtain the on-chain VC and then verify its validity off-chain.

By integrating the Veramo agent-generated VC with the Sign Protocol's attestation method, we enable on-chain VC storage and off-chain VC verification, thereby achieving trusted VC transmission. The specific attestation content can be attested through the Sign Protocol, in which case the Issuer is the user sending the transaction. Alternatively, if the attestation content is attested via a VC, then the Issuer is the DID that issued the Credential.

By the way, under the did:ethr DID method, an on-chain address can serve as a DID identifier simply by adding the appropriate prefix. This allows us to use blockchain addresses to represent DIDs, thereby establishing a one-to-one mapping between on-chain addresses and DIDs.

### Example of VC in Sign Protocol
Credential Subject:
```json
credentialSubject: {
   "id": "did:web:xxx.com",
   "you": "Rock",
}
```
Verifiable Credential:
```json
{
  "credentialSubject": {
    "you": "Rock",
    "id": "did:web:xxx.com"
  },
  "issuer": {
    "id": "did:ethr:morph-holesky:0x0203c8e0572fdba1e561d91b8a3372cd1dedb90e5c6438f16317f3173c9dede26a"
  },
  "type": [
    "VerifiableCredential"
  ],
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "issuanceDate": "2025-02-20T03:18:12.000Z",
  "proof": {
    "type": "JwtProof2020",
    "jwt": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2sifX0sInN1YiI6ImRpZDp3ZWI6eHh4LmNvbSIsIm5iZiI6MTc0MDAyMTQ5MiwiaXNzIjoiZGlkOmV0aHI6bW9ycGgtaG9sZXNreToweDAyMDNjOGUwNTcyZmRiYTFlNTYxZDkxYjhhMzM3MmNkMWRlZGI5MGU1YzY0MzhmMTYzMTdmMzE3M2M5ZGVkZTI2YSJ9.T11ywu4tvR7iEANxMPodWooxqAOzI-2OplgDV7i9lR1Mq_x9OgLNXXM5yevsxmH98VK99TZd3N9d7xP2vu4FOw"
  }
}
```

The corresponding transaction (Transaction hash: 0x2ddfb350f753bb0bbf9377d9917a1cf43e34755c52ef37de9e63a18bb86ea438) in morph holesky network:
```js
struct Attestation {
  schemaId (uint64) : 4
  linkedAttestationId (uint64) : 0
  attestTimestamp (uint64) : 1740021495
  revokeTimestamp (uint64) : 0
  attester (address) : 0x00cFA1D825B9cEf1e2548Bf56D85fcd8F9bB7BAE
  validUntil (uint64) : 1742440692
  dataLocation (uint8) : 0
  revoked (bool) : false
  recipients (bytes[]) : [ ]
  data (bytes) : 0x7b2263726564656e7469616c5375626a656374223a7b22796f75223a22526f636b222c226964223a226469643a7765623a7878782e636f6d227d2c22697373756572223a7b226964223a226469643a657468723a6d6f7270682d686f6c65736b793a3078303230336338653035373266646261316535363164393162386133333732636431646564623930653563363433386631363331376633313733633964656465323661227d2c2274797065223a5b2256657269666961626c6543726564656e7469616c225d2c2240636f6e74657874223a5b2268747470733a2f2f7777772e77332e6f72672f323031382f63726564656e7469616c732f7631225d2c2269737375616e636544617465223a22323032352d30322d32305430333a31383a31322e3030305a222c2270726f6f66223a7b2274797065223a224a777450726f6f6632303230222c226a7774223a2265794a68624763694f694a46557a49314e6b73694c434a30655841694f694a4b5631516966512e65794a325979493665794a4159323975644756346443493657794a6f64485277637a6f764c336433647935334d793576636d63764d6a41784f43396a636d566b5a57353061574673637939324d534a644c434a306558426c496a7062496c5a6c636d6c6d6157466962475644636d566b5a57353061574673496c3073496d4e795a57526c626e52705957785464574a715a574e30496a7037496e6c7664534936496c4a765932736966583073496e4e3159694936496d52705a4470335a574936654868344c6d4e7662534973496d35695a6949364d5463304d4441794d5451354d69776961584e7a496a6f695a476c6b4f6d5630614849366257397963476774614739735a584e7265546f77654441794d444e6a4f4755774e5463795a6d52695954466c4e5459785a446b78596a68684d7a4d334d6d4e6b4d57526c5a4749354d475531597a59304d7a686d4d54597a4d54646d4d7a45334d324d355a47566b5a54493259534a392e54313179777534747652376945414e784d506f64576f6f7871414f7a492d324f706c6744563769396c52314d715f78394f674c4e58584d3579657673786d483938564b3939545a64334e396437785032767534464f77227d7d
}
```

## Features

- Create and manage DIDs using Veramo
- Delete identifiers
- List and resolve DIDs
- Issue verifiable credentials
- Attest credentials on Morph using Sign Protocol
- Verify credentials

## Prerequisites

- Node.js
- Yarn or npm
- An Infura account for Morph network access
- Access to Morph network

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
## Configuration

Configure Sign Protocol settings in `src/SP/morphHolesky/setup.ts`:
   - Update the `PRIVATE_KEY` with your wallet's private key

## Available Scripts

1. Create a new identifier: 
   ```bash
   yarn create-identifier
   ```
2. List identifiers:
   ```bash
   yarn list-identifiers
   ```
3. Delete an specific identifier:
   ```bash
   yarn delete-identifier [identifier]
   ```
4. Resolve an identifier:
   ```bash
   yarn resolve-identifier
   ```
5. Create a new credential:
   ```bash
   yarn create-credential
   ```
6. Verify a credential with attestationID:
   ```bash
   yarn verify-credential [attestationID]
   ```


## Mainly Workflow 
We assume that you have already set up your Morph account and have access to the network.

then you can run the following commands to interact with the agent as the following steps:
- Step 1: Create a new identifier using veramo agent API `agent.didMangerCreate()`, and the identifier will be stored in the agent's database.
- step 2: Create a new credential using veramo agent API `agent.createVerifiableCredential()`, and the credential will be stored in the agent's database.
- Step 3: Attest the credential on the Morph network using the Sign Protocol API `attestCredential()`. The attestation will be uploaded to the Morph network by interacting with the smart contract. The credential JSON will be encoded into the data structure used by the Sign Protocol and signed with the wallet's private key.
- Step 4: Verify the credential using the Sign Protocol. This involves fetching the attestation from the Morph network using the `attestationID` and verifying the credential against it.


## Other Commands
- The operations of identifier also include listing identifiers, deleting an identifier, and resolving an identifier. all are done using the veramo agent API.
- The operation for Sign protocol includes a register method, which can register a attestation schema on the Morph network.

