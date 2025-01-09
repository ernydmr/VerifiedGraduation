// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GraduationCertificate {
    struct Certificate {
        string studentName;           // Name of the student
        string certificateHash;       // Unique hash of the certificate
        uint256 timestamp;            // Time when the certificate was added
    }

    mapping(string => Certificate) public certificates;          
    
    // Event Works when new certificate added
    event CertificateAdded(string studentName, string certificateHash, uint256 timestamp);

    function addCertificate(string memory _studentName, string memory _certificateHash) public {

        // Ensure that the certificate hash does not already exist
        require(bytes(certificates[_certificateHash].certificateHash).length == 0, "Certificate already exists");
        
        // Add the certificate details to the mapping
        certificates[_certificateHash] = Certificate(_studentName, _certificateHash, block.timestamp);
        
        // Emit an event to notify listeners that a certificate has been added
        emit CertificateAdded(_studentName, _certificateHash, block.timestamp);
    }

    function verifyCertificate(string memory _certificateHash) public view returns (string memory, uint256) {

        // Retrieve the certificate from the mapping
        Certificate memory cert = certificates[_certificateHash];

        // Ensure that the certificate exists
        require(bytes(cert.certificateHash).length > 0, "Certificate not found");

        // Return the student's name and the timestamp of the certificate
        return (cert.studentName, cert.timestamp);
    }
}
