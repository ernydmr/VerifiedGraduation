# VerifiedGraduation
---

### Step 1: General Overview of the Graduation Certificate System

The **Graduation Certificate System** provides a secure and efficient interface for managing and verifying graduation certificates using blockchain technology.

#### Features:
- **Add Certificate**: Input a student's name and a unique certificate hash to securely add it to the blockchain.
- **Verify Certificate**: Verify a certificate by entering its hash. If valid, the system retrieves and displays its details.
- **Upload PDF**: Upload certificate files and link them to their respective hash IDs.
- **PDF List**: View and manage a list of uploaded certificates.
- **View Blockchain Transactions**: Access a detailed list of blockchain transactions associated with the system.

This interface serves as a foundation for seamless interaction between the blockchain and the system’s database.

![Step 1](https://github.com/user-attachments/assets/d226586b-87cb-4990-9bb5-2d7f6d21ab6e)

---

### Step 2: Adding a Certificate to the Blockchain

This step demonstrates how to securely add a certificate to the blockchain.

#### Process:
1. **Enter Student Information**:
   - Fill in the `Student Name` field (e.g., "Eren").
   - Provide a unique `Certificate Hash` (e.g., "005").
2. **Add Certificate**:
   - Click the `Add Certificate` button.
   - A notification appears confirming: **"Certificate successfully added to the blockchain!"**

#### Outcome:
- The certificate details are securely stored on the blockchain, ensuring its tamper-proof authenticity.

![Step 2](https://github.com/user-attachments/assets/e503e7b2-dd70-4bce-b13d-a760a949e73f)

---

### Step 3: Verifying a Certificate on the Blockchain

Verify a certificate's authenticity quickly and securely.

#### Process:
1. **Enter Certificate Hash**:
   - Input the unique hash (e.g., "005") into the `Certificate Hash` field.
2. **Verify Certificate**:
   - Click the `Verify Certificate` button.
   - The system checks the blockchain for the certificate hash.
3. **Verification Result**:
   - If found, the system displays:
     - **Student Name**: e.g., "Eren".
     - **Timestamp**: The date and time when the certificate was added.

#### Outcome:
- Successful verification confirms the certificate’s authenticity, with details retrieved directly from the blockchain.

![Step 3](https://github.com/user-attachments/assets/e1b97acb-ca11-44a7-87d3-e0ac5afa66c2)

---

### Step 4: Handling Verification Errors

Understand the system's response to invalid certificate queries.

#### Scenario:
- If a user queries the hash of a **non-existent certificate**, the system returns an error.

#### Error Message:
- **"Certificate not found"**: Indicates that the hash does not exist in the blockchain.

#### Possible Causes:
1. The hash was entered incorrectly.
2. The certificate was never added to the system.

#### Solution:
- Double-check the hash or ensure the certificate is added using the `Add Certificate` function.

![Step 4](https://github.com/user-attachments/assets/15c69d5c-c9de-48d7-a8bc-4a5ffdb97e56)

---

### Step 5: Viewing All Blockchain Transactions

Access and review all blockchain activities within the system.

#### Overview:
The **All Blockchain Transactions** page displays a detailed table of transactions related to the system.

#### Table Columns:
- **Hash**: Unique transaction hash on the blockchain.
- **Sender**: Wallet address of the sender.
- **Recipient**: Wallet address of the recipient.
- **Amount (ETH)**: Ether transferred during the transaction (if applicable).
- **Time**: Exact timestamp of the transaction.
- **Block No**: Block number in which the transaction was recorded.
- **Student Name**: Name of the student associated with the transaction.
- **Certificate Hash**: Certificate hash linked to the transaction.

![Step 5](https://github.com/user-attachments/assets/3e71e7fa-103d-4ae2-9cd9-870fdeed8995)


## Getting Started

### Initialize Blockchain Local Node
To set up the local blockchain environment, run the following commands in the terminal:

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

After executing these commands, the local blockchain node will be initialized, and the output will display:

```
GraduationCertificate deployed to: "<Contract Address>"
```

Copy the provided contract address and paste it into the `const contractAddress` variable inside the `backend/server.js` file to link the backend to the smart contract.

### Starting Backend and Frontend
Run the following commands to start the backend and frontend services:

```bash
cd backend
npm start

cd frontend
npm start
```

This will start the backend server connected to MongoDB and the smart contract, as well as launch the frontend application.

### Important Note on Local Blockchain
Since the blockchain local network resets its hashes and transactions after every system reboot, the blockchain will be reinitialized. While data is saved in the database, it is recommended to clear the database manually after each restart to maintain consistency.

To clear the database, execute the following commands:

```bash
mongosh
use graduation
db.certificates.deleteMany({})
db.pdfdocuments.deleteMany({})
```

---

## MongoDB Commands

### Accessing the Database
In the terminal, run:

```bash
mongosh
use graduation
show collections
```

### Viewing Data
To display all stored data:

- Certificates:

```bash
db.certificates.find().pretty()
```

- PDFs:

```bash
db.pdfdocuments.find().pretty()
```

### Deleting Data

- Delete all PDFs:

```bash
db.pdfdocuments.deleteMany({})
```

- Delete all certificates:

```bash
db.certificates.deleteMany({})
```

- Delete a specific certificate by hash:

```bash
db.certificates.deleteOne({ certificateHash: "hash123" })
```

- Delete a specific PDF by hash:

```bash
db.pdfdocuments.deleteOne({ hashId: "12345" })
```


