# Wykorzystanie technologii Blockchain do przechowywania danych medycznych
Tomasz Szymanik

## Organizations
1. Org1 - insurer
2. Org2 - university (anonymized data)

# Network

## Start the main machine
```shell
docker-compose build dev
```
```shell
docker-compose up -d dev
```

## Download binaries
```shell
docker exec -it dev ./bootstrap.sh -s
```

## Generate the certificates
```shell
docker exec -it dev ./generate.sh
```

## Start the network
```shell
docker-compose up -d
```
```shell
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.medicaldata.com/msp" peer0.org1.medicaldata.com peer channel create -o orderer.medicaldata.com:7050 --tls --cafile /etc/hyperledger/fabric/orderer/orderer-ca.crt -c mychannel -f /etc/hyperledger/configtx/channel.tx --outputBlock /etc/hyperledger/configtx/mychannel.block
```
```shell
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.medicaldata.com/msp" peer0.org1.medicaldata.com peer channel join --tls --cafile /etc/hyperledger/fabric/orderer/orderer-ca.crt -b /etc/hyperledger/configtx/mychannel.block
```
```shell
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.medicaldata.com/msp" peer0.org2.medicaldata.com peer channel join --tls --cafile /etc/hyperledger/fabric/orderer/orderer-ca.crt -b /etc/hyperledger/configtx/mychannel.block
```
```shell
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.medicaldata.com/msp" peer0.org1.medicaldata.com peer channel update -o orderer.medicaldata.com:7050 -c mychannel -f /etc/hyperledger/configtx/Org1MSPanchors.tx --tls --cafile /etc/hyperledger/fabric/orderer/orderer-ca.crt
```
```shell
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.medicaldata.com/msp" peer0.org2.medicaldata.com peer channel update -o orderer.medicaldata.com:7050 -c mychannel -f /etc/hyperledger/configtx/Org2MSPanchors.tx --tls --cafile /etc/hyperledger/fabric/orderer/orderer-ca.crt
```

## Install the chaincode
```shell
docker exec -it dev bash -c "cd chaincode && npm install"
```
```shell
docker exec -it dev bash -c "cd chaincode && npm run build"
```

```shell
docker exec -it cliOrg1 peer lifecycle chaincode package medicaldata.tar.gz --path /opt/gopath/src/github.com/chaincode --lang node --label medicaldata
```
```shell
docker exec -it cliOrg1 peer lifecycle chaincode install medicaldata.tar.gz
```
```shell
docker exec -it cliOrg1 peer lifecycle chaincode queryinstalled
```
```shell
docker exec -it cliOrg1 peer lifecycle chaincode approveformyorg --channelID mychannel --name medicaldata --version 1 --sequence 1 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/medicaldata.com/orderers/orderer.medicaldata.com/tls/ca.crt --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json --package-id <org1-package-id>
```
```shell
docker exec -it cliOrg1 peer lifecycle chaincode checkcommitreadiness -C mychannel -n medicaldata -v 1 --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json
```
```shell
docker exec -it cliOrg2 peer lifecycle chaincode package medicaldata.tar.gz --path /opt/gopath/src/github.com/chaincode --lang node --label medicaldata
```
```shell
docker exec -it cliOrg2 peer lifecycle chaincode install medicaldata.tar.gz
```
```shell
docker exec -it cliOrg2 peer lifecycle chaincode queryinstalled
```
```shell
docker exec -it cliOrg2 peer lifecycle chaincode approveformyorg --channelID mychannel --name medicaldata --version 1 --sequence 1 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/medicaldata.com/orderers/orderer.medicaldata.com/tls/ca.crt --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json --package-id <org2-package-id>
```
```shell
docker exec -it cliOrg2 peer lifecycle chaincode checkcommitreadiness -C mychannel -n medicaldata -v 1 --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json
```
```shell
docker exec -it cliOrg1 peer lifecycle chaincode commit -C mychannel -n medicaldata -v 1 --sequence 1 --tls -o orderer.medicaldata.com:7050 --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/medicaldata.com/orderers/orderer.medicaldata.com/tls/ca.crt --peerAddresses peer0.org1.medicaldata.com:7051 --peerAddresses peer0.org2.medicaldata.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.medicaldata.com/peers/peer0.org1.medicaldata.com/tls/ca.crt --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.medicaldata.com/peers/peer0.org2.medicaldata.com/tls/ca.crt --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json
```
```shell
docker exec -it cliOrg1 peer lifecycle chaincode querycommitted -C mychannel
```

# Client
```shell
docker exec -it dev bash -c "cd client && npm install"
```
```shell
docker exec -it dev bash -c "cd client && npm run build"
```

## Enroll admin
```shell
docker exec -it dev bash -c "node client/dist/enrollAdmin.js org1"
```

## Register user
```shell
docker exec -it dev bash -c "node client/dist/registerUser.js org1 <user-name>"
```
```shell
docker exec -it dev bash -c "node client/dist/registerUser.js org1 user1"
```

## Initialize the ledger
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.hospital initLedger"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.patient initLedger"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.doctor initLedger"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.report initLedger"
```


## Query example
```shell
docker exec -it dev bash -c "node client/dist/query.js <organization-name> <user-name> <contract-name> <transaction-name> <transaction-argument>"
```

## Invoke example
```shell
docker exec -it dev bash -c "node client/dist/invoke.js <organization-name> <user-name> <contract-name> <transaction-name> <transaction-argument>"
```

## Use the Hospital contract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.hospital getHospitals HOSPITAL_0 HOSPITAL_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.hospital getHospital HOSPITAL_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.hospital addHospital HOSPITAL_5 TestHospital5 TestCity1"
```

## Use the Patient contract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getPatients PATIENT_0 PATIENT_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getAnonymizedPatients PATIENT_0 PATIENT_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getPatient PATIENT_0"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getAnonymizedPatient PATIENT_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.patient addPatient PATIENT_2 jan.kowalski@email.com 000000000 Jan Kowalski 94021106010 1994-03-11T00:00:00.000Z M Kraków 'Łojasiewicza 11' Kraków 30-348 małopolskie"
```

## Use the Doctor contract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.doctor getDoctors DOCTOR_0 DOCTOR_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.doctor getDoctor DOCTOR_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.doctor addDoctor DOCTOR_1 jan.kowalski@email.com 000000000 Jan Kowalski 94021106010 1994-03-11T00:00:00.000Z M HOSPITAL_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.doctor transferDoctor DOCTOR_1 HOSPITAL_1"
```

## Use the Report contract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.report getReports REPORT_0 REPORT_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.report getReport REPORT_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.report addReport REPORT_1 HOSPITAL_0 DOCTOR_0 PATIENT_0 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'"
```

# Remove the network
```shell
docker exec -it dev ./clear.sh
```
```shell
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down
```