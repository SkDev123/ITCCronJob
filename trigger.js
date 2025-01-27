console.log("Trigger.js loaded. Cron job scheduler starting...");

require("dotenv").config();
const cron = require("node-cron");
const { ethers } = require("ethers");

// Fetch the private key, RPC URL, and contract address from environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!PRIVATE_KEY || !RPC_URL || !CONTRACT_ADDRESS) {
  console.error(
    "Error: Missing environment variables. Check PRIVATE_KEY, RPC_URL, or CONTRACT_ADDRESS."
  );
  process.exit(1);
}

// Initialize ethers.js provider, wallet, and contract
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contractAbi = require("./contractABI.json"); // Ensure ABI is correct
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, wallet);

const automatedMonthlyRabDistribution = async () => {
  try {
    console.log("Starting automatedMonthlyRabDistribution process...");

    // Call the contract function
    console.log("Triggering automatedMonthlyRabDistribution...");
    const tx = await contract.automatedMonthlyRabDistribution({
      gasLimit: ethers.utils.hexlify(3000000), // Set gas limit
    });
    console.log("Transaction sent. Waiting for confirmation...");

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed. Details:");
    console.log(`Transaction Hash: ${receipt.transactionHash}`);
    console.log(`Block Number: ${receipt.blockNumber}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}`);

    // Log event details from the receipt
    if (receipt.events && receipt.events.length > 0) {
      console.log("Events emitted by the transaction:");
      receipt.events.forEach((event) => {
        console.log(`Event Name: ${event.event}`);
        console.log(`Event Args: ${JSON.stringify(event.args)}`);
      });
    } else {
      console.log("No events emitted.");
    }
  } catch (error) {
    console.error("Error during automatedMonthlyRabDistribution:", error);
  }
};

// Schedule the job to run every hour
cron.schedule("2 * * *", () => {
  console.log(
    `Running cron job to trigger automatedMonthlyRabDistribution at ${new Date().toISOString()}`
  );
  automatedMonthlyRabDistribution();
});
