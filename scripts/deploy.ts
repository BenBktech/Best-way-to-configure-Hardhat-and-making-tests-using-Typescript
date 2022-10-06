//require("dotenv").config();

import { Verify } from "crypto";
// const { ethers, run, network } = require("hardhat")
import { ethers, run, network } from "hardhat"
import "dotenv/config";


async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract address : ${simpleStorage.address}`)
  //But if we deploy on local network ?
  if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    //We wait 6 blocks then verify
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, [])
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is ${currentValue}`);

  const transactionReponse = await simpleStorage.store(7);
  await transactionReponse.wait(1);

  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated value is ${updatedValue}`);

}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying the smart contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    });
  }
  catch(e: any) {
    if(e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })