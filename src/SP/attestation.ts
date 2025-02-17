// filepath: /Users/wangkaixuan/Projects/SmartContract/sign-protocol-evm/scripts/register.ts
import { ethers } from "ethers";
import {provider, privateKey, wallet} from "./morphHolesky/setup.js"
import { VerifiableCredential } from "@veramo/core";
// import * as dotenv from "dotenv";
// dotenv.config();
const registrant = wallet.address;
const contractAddress = "0x48045E251965c422095E5F9B721317f7d0bC30D6"; // 替换为您的合约地址
const abi = [ {
    "inputs": [
        {
            "components": [
                {
                    "internalType": "uint64",
                    "name": "schemaId",
                    "type": "uint64"
                },
                {
                    "internalType": "uint64",
                    "name": "linkedAttestationId",
                    "type": "uint64"
                },
                {
                    "internalType": "uint64",
                    "name": "attestTimestamp",
                    "type": "uint64"
                },
                {
                    "internalType": "uint64",
                    "name": "revokeTimestamp",
                    "type": "uint64"
                },
                {
                    "internalType": "address",
                    "name": "attester",
                    "type": "address"
                },
                {
                    "internalType": "uint64",
                    "name": "validUntil",
                    "type": "uint64"
                },
                {
                    "internalType": "enum DataLocation",
                    "name": "dataLocation",
                    "type": "uint8"
                },
                {
                    "internalType": "bool",
                    "name": "revoked",
                    "type": "bool"
                },
                {
                    "internalType": "bytes[]",
                    "name": "recipients",
                    "type": "bytes[]"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "internalType": "struct Attestation",
            "name": "attestation",
            "type": "tuple"
        },
        {
            "internalType": "string",
            "name": "indexingKey",
            "type": "string"
        },
        {
            "internalType": "bytes",
            "name": "delegateSignature",
            "type": "bytes"
        },
        {
            "internalType": "bytes",
            "name": "extraData",
            "type": "bytes"
        }
    ],
    "name": "attest",
    "outputs": [
        {
            "internalType": "uint64",
            "name": "",
            "type": "uint64"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint64",
            "name": "attestationId",
            "type": "uint64"
        }
    ],
    "name": "getAttestation",
    "outputs": [
        {
            "components": [
                {
                    "internalType": "uint64",
                    "name": "schemaId",
                    "type": "uint64"
                },
                {
                    "internalType": "uint64",
                    "name": "linkedAttestationId",
                    "type": "uint64"
                },
                {
                    "internalType": "uint64",
                    "name": "attestTimestamp",
                    "type": "uint64"
                },
                {
                    "internalType": "uint64",
                    "name": "revokeTimestamp",
                    "type": "uint64"
                },
                {
                    "internalType": "address",
                    "name": "attester",
                    "type": "address"
                },
                {
                    "internalType": "uint64",
                    "name": "validUntil",
                    "type": "uint64"
                },
                {
                    "internalType": "enum DataLocation",
                    "name": "dataLocation",
                    "type": "uint8"
                },
                {
                    "internalType": "bool",
                    "name": "revoked",
                    "type": "bool"
                },
                {
                    "internalType": "bytes[]",
                    "name": "recipients",
                    "type": "bytes[]"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "internalType": "struct Attestation",
            "name": "",
            "type": "tuple"
        }
    ],
    "stateMutability": "view",
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

export async function attestCredential(credential: VerifiableCredential) {

    // 将 JSON 转换为字符串
    const credentialJson = JSON.stringify(credential);

    // 使用 TextEncoder 转换为字节数组
    const encoder = new TextEncoder();
    const credentialBytesArray: Uint8Array = encoder.encode(credentialJson);

    // 将字节数组转换为十六进制字符串
    let credentialBytes = '0x';
    for (let i = 0; i < credentialBytesArray.length; i++) {
        credentialBytes += credentialBytesArray[i].toString(16).padStart(2, '0'); // 将每个字节转换为 2 位十六进制
    }
      // 计算一个月后的时间戳
    const currentDate = new Date();
    const validUntilDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    const validUntilTimestamp = Math.floor(validUntilDate.getTime() / 1000);

    const attestation = {
        schemaId: 4,
        linkedAttestationId: 0,
        attestTimestamp: Math.floor(Date.now() / 1000),
        revokeTimestamp: 0,
        attester: wallet.address,
        validUntil: validUntilTimestamp,
        dataLocation: DataLocation.ONCHAIN,
        revoked: false,
        recipients: [],
        data: credentialBytes,
    }
  const indexingKey = wallet.address;
  const delegateSignature = "0x"; 
  const extraData = "0x";
    console.log("Attesting credential...",attestation, indexingKey, delegateSignature, extraData);
  try {
    const tx = await contract.attest(attestation,indexingKey, delegateSignature,extraData);
    await tx.wait();
    console.log("Attestation Success:", tx);
  } catch (error) {
    console.error("Attestation Error:", error);
  }
}

export async function getAttestation(attestationId: any) {
    const attestation = await contract.getAttestation(attestationId);
    const credentialString = Buffer.from(attestation.data).toString();
    // 1. 移除 "0x" 前缀
    const credentialHex = credentialString.slice(2);

    // 2. 将十六进制字符串转换为字节数组
    const credentialbyteArray = new Uint8Array(credentialHex.length / 2);
    for (let i = 0; i < credentialHex.length; i += 2) {
        credentialbyteArray[i / 2] = parseInt(credentialHex.substr(i, 2), 16);
    }

    // 3. 使用 TextDecoder 解码为字符串
    const decoder = new TextDecoder();
    const credentialRawString = decoder.decode(credentialbyteArray);

    // 4. 解析为 JSON 对象
    const jsonObjectFromHex = JSON.parse(credentialRawString);

    console.log("Credential:", jsonObjectFromHex);
    return jsonObjectFromHex;
}

getAttestation(2);
