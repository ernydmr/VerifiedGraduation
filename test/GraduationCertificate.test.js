const { expect } = require("chai");

describe("GraduationCertificate", function () {
  it("Should add and verify a certificate", async function () {
    const GraduationCertificate = await ethers.getContractFactory("GraduationCertificate");
    const graduationCertificate = await GraduationCertificate.deploy();

    await graduationCertificate.addCertificate("Ali", "hash123");

    const result = await graduationCertificate.verifyCertificate("hash123");
    expect(result[0]).to.equal("Ali");
  });
});
