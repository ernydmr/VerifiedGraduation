// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GraduationCertificate {
    struct Certificate {
        string studentName;
        string certificateHash;
        uint256 timestamp;
    }

    mapping(string => Certificate) public certificates;

    event CertificateAdded(string studentName, string certificateHash, uint256 timestamp);

    function addCertificate(string memory _studentName, string memory _certificateHash) public {
        require(bytes(certificates[_certificateHash].certificateHash).length == 0, "Certificate already exists");
        certificates[_certificateHash] = Certificate(_studentName, _certificateHash, block.timestamp);
        emit CertificateAdded(_studentName, _certificateHash, block.timestamp);
    }

    function verifyCertificate(string memory _certificateHash) public view returns (string memory, uint256) {
        Certificate memory cert = certificates[_certificateHash];
        require(bytes(cert.certificateHash).length > 0, "Certificate not found");
        return (cert.studentName, cert.timestamp);
    }
}
