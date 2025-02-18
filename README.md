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

1. Create a new identifier
2. List identifiers
3. Delete an identifier
4. Resolve an identifier
5. Create a new credential
6. Verify a credential


