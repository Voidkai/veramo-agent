// filepath: /Users/wangkaixuan/Projects/SmartContract/sign-protocol-evm/scripts/register.ts
import { ethers } from "ethers";
import {provider, privateKey, wallet} from "./morphHolesky/setup.js"
// import * as dotenv from "dotenv";
// dotenv.config();
const registrant = wallet.address;
const contractAddress = "0x48045E251965c422095E5F9B721317f7d0bC30D6"; // 替换为您的合约地址
const abi = [ {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "registrant",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "revocable",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum DataLocation",
                        "name": "dataLocation",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint64",
                        "name": "maxValidFor",
                        "type": "uint64"
                    },
                    {
                        "internalType": "contract ISPHook",
                        "name": "hook",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "timestamp",
                        "type": "uint64"
                    },
                    {
                        "internalType": "string",
                        "name": "data",
                        "type": "string"
                    }
                ],
                "internalType": "struct Schema",
                "name": "schema",
                "type": "tuple"
            },
            {
                "internalType": "bytes",
                "name": "delegateSignature",
                "type": "bytes"
            }
        ],
        "name": "register",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "schemaId",
                "type": "uint64"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

enum DataLocation {
    ONCHAIN = 0,
    ARWEAVE = 1,
    IPFS = 2,
    CUSTOM = 3
}

const schemaJson = {
    name: "credential", 
    type: "string",
}

async function registerSchema() {
  const schema = {
    registrant: registrant,
    revocable: false,
    dataLocation: DataLocation.ONCHAIN,
    maxValidFor: 0,
    hook: "0x0000000000000000000000000000000000000000",
    timestamp: Math.floor(Date.now() / 1000),
    data: JSON.stringify(schemaJson),};

  const delegateSignature = "0x"; // 如果不需要委托签名，可以使用空字符串

  try {
    const tx = await contract.register(schema, delegateSignature);
    await tx.wait();
    console.log("Schema registered:", tx);
  } catch (error) {
    console.error("Error registering schema:", error);
  }
}

registerSchema();