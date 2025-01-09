async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with account:", deployer.address);

    const GraduationCertificate = await ethers.getContractFactory("GraduationCertificate");
    const graduationCertificate = await GraduationCertificate.deploy();

    await graduationCertificate.waitForDeployment();

    console.log("GraduationCertificate deployed to:", await graduationCertificate.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
