# Veramo Agent with Sign Protocol Integration

This project demonstrates a Veramo agent implementation with Sign Protocol (SP) integration for managing decentralized identifiers (DIDs) and verifiable credentials on Morph.

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

