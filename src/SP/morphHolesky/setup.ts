import { ethers} from "ethers";

export const provider = new ethers.JsonRpcProvider("https://rpc-holesky.morphl2.io");
export const privateKey = "PRIVATE_KEY";
export const wallet = new ethers.Wallet(privateKey, provider);