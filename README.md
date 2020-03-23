# Wykorzystanie technologii Blockchain do przechowywania danych medycznych
Tomasz Szymanik

# Network

## Start the main machine
```shell
docker-compose up -d ubuntu
```

## Download binaries
```shell
docker exec -it ubuntu ./bootstrap.sh -s
```

## Generate the certificates
```shell
docker exec -it ubuntu ./generate.sh
```

## Start the network
```shell
docker-compose up -d orderer.medicaldata.com peer0.org1.medicaldata.com couchdb cli ca.medicaldata.com
```
```shell
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.medicaldata.com/msp" peer0.org1.medicaldata.com peer channel create -o orderer.medicaldata.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
```
```shell
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.medicaldata.com/msp" peer0.org1.medicaldata.com peer channel join -b mychannel.block
```

## Install the chaincode
```shell
docker exec -it ubuntu bash -c "cd chaincode && npm install"
```
```shell
docker exec -it ubuntu bash -c "cd chaincode && npm run build"
```
```shell
docker exec -it cli peer lifecycle chaincode package medicaldata.tar.gz --path /opt/gopath/src/github.com/chaincode --lang node --label medicaldata
```
```shell
docker exec -it cli peer lifecycle chaincode install medicaldata.tar.gz
```
```shell
docker exec -it cli peer lifecycle chaincode queryinstalled
```
```shell
docker exec -it cli peer lifecycle chaincode approveformyorg --channelID mychannel --name medicaldata --version 1 --sequence 1 --package-id <package-id>
```
```shell
docker exec -it cli peer lifecycle chaincode checkcommitreadiness -C mychannel -n medicaldata -v 1
```
```shell
docker exec -it cli peer lifecycle chaincode commit -C mychannel -n medicaldata -v 1 --sequence 1
```

# Client
```shell
cd client
```
```shell
npm install
```
```shell
npm run build
```

## Initialize the ledger
```shell
node dist/invoke.js user1 org1.medicaldata.hospital initLedger
```
```shell
node dist/invoke.js user1 org1.medicaldata.patient initLedger
```
```shell
node dist/invoke.js user1 org1.medicaldata.doctor initLedger
```
```shell
node dist/invoke.js user1 org1.medicaldata.report initLedger
```

## Enroll admin
```shell
node dist/enrollAdmin.js
```

## Register user
```shell
node dist/registerUser.js <user-name>
```
```shell
node dist/registerUser.js user1
```

## Query example
```shell
node dist/query.js <user-name> <contract-name> <transaction-name>
```

## Invoke example
```shell
node dist/invoke.js <user-name> <contract-name> <transaction-name> <transaction-argument>
```

## Use the Hospital contract
```shell
node dist/query.js user1 org1.medicaldata.hospital getHospitals
```
```shell
node dist/query.js user1 org1.medicaldata.hospital getHospital HOSPITAL_0
```
```shell
node dist/invoke.js user1 org1.medicaldata.hospital addHospital HOSPITAL_5 TestHospital5 TestCity1
```

## Use the Patient contract
```shell
node dist/query.js user1 org1.medicaldata.patient getPatients
```
```shell
node dist/query.js user1 org1.medicaldata.patient getPatient PATIENT_0
```
```shell
node dist/invoke.js user1 org1.medicaldata.patient addPatient PATIENT_2 jan.kowalski@email.com 000000000 Jan Kowalski 94021106010 1994-03-11T00:00:00.000Z M Kraków 'Łojasiewicza 11' Kraków 30-348 małopolskie
```

## Use the Doctor contract
```shell
node dist/query.js user1 org1.medicaldata.doctor getDoctors
```
```shell
node dist/query.js user1 org1.medicaldata.doctor getDoctor DOCTOR_0
```
```shell
node dist/invoke.js user1 org1.medicaldata.patient addDoctor DOCTOR_1 jan.kowalski@email.com 000000000 Jan Kowalski 94021106010 1994-03-11T00:00:00.000Z M HOSPITAL_0
```
```shell
node dist/invoke.js user1 org1.medicaldata.patient transferDoctor DOCTOR_1 HOSPITAL_1
```

## Use the Report contract
```shell
node dist/query.js user1 org1.medicaldata.report getReports
```
```shell
node dist/query.js user1 org1.medicaldata.report getReport REPORT_0
```
```shell
node dist/invoke.js user1 org1.medicaldata.report addReport REPORT_1 HOSPITAL_0 DOCTOR_0 PATIENT_0 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
```

# Remove the network
```shell
docker exec -it ubuntu ./clear.sh
```
```shell
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down
```
```shell
docker rm $(docker ps -aq)
```
