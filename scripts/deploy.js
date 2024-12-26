async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with account:", deployer.address);

    const GraduationCertificate = await ethers.getContractFactory("GraduationCertificate");
    const graduationCertificate = await GraduationCertificate.deploy();

    console.log("GraduationCertificate deployed to:", graduationCertificate.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
