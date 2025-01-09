async function main() {
    const { ethers } = require("hardhat"); // Import ethers from Hardhat

    const latestBlock = await ethers.provider.getBlockNumber(); // Get the latest block number
    console.log(`Latest Block Number: ${latestBlock}`);

    for (let i = 0; i <= latestBlock; i++) {
        const block = await ethers.provider.getBlock(i); // Get transaction hashes in the block
        console.log(`Block ${i} contains ${block.transactions.length} transactions`);

        for (const txHash of block.transactions) {
            const tx = await ethers.provider.getTransaction(txHash); // Get transaction details
            console.log(`
            📝 Transaction Hash: ${tx.hash}
            👤 Sender: ${tx.from}
            📥 Recipient: ${tx.to}
            💰 Amount: ${tx.value ? ethers.utils.formatEther(tx.value) : "0"} ETH
            ⛽ Gas Usage: ${tx.gasLimit ? tx.gasLimit.toString() : "N/A"}
            `);
        }
    }
}

// Execute the main function and handle errors
main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
