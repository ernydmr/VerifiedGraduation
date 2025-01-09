# VerifiedGraduation
Başlangıç için :

Terminalde >
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost


Bu 2 komuttan sonra blockchain local nodesi kurulur ve GraduationCertificate deployed to: "Hash adresss" çıktısı verir, Hash'ı backend klasöründeki server.js dosyasının const contractAddress ="" variablesine yazdığımızda backend smart contrate bağlanacaktır.

Tekrar terminalde >
cd backend     > npm start
cd frontend    > npm start

komutlarını yazdığımızda backend hem mongodb'ye hem smart contracte bağlı bir şekilde çalışmaya başlar ve frontend projesi de ayağa kalkar.


Bilgisayarı her yeniden başlatmada local networkdeki hashler ve txler sıfırlanacağı için her yeniden başlatmada blockchain sıfırlanır.
Verileri aynı zamanda databaseye kaydettiği için yeniden başlatmadan sonra veriler databasede kalır bunun için her yeniden başlatmada databasedeki verilerin silinmesi daha doğru olacaktır.
Databasedeki verileri silmek için :
Terminal >
mongosh
use graduation
db.certificates.deleteMany({})
db.pdfdocuments.deleteMany({})









MONGO DATABASE KOMUTLARI :
TERMİNAL >
mongosh
use graduation
show collections

db.certificates.find().pretty()    // Databasedeki tüm sertifikaları gösterir
db.pdfdocuments.find().pretty()    // Databasedeki tüm pdfleri gösterir

db.pdfdocuments.deleteMany({})  // Databasedeki tüm pdfleri siler
db.certificates.deleteMany({})  // Databasedeki tüm sertifikaları siler


db.certificates.deleteOne({ certificateHash: "hash123" })     //Hashı verilmis sertifikayı siler
db.pdfdocuments.deleteOne({ hashId: "12345" })                //Hashı verilmis pdfi siler

# eren
# eren
# eren
# eren
