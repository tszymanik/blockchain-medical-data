docker exec -it cliOrg1 bash -c 'peer lifecycle chaincode package medicaldata.tar.gz --path /opt/gopath/src/github.com/chaincode --lang node --label medicaldata &&
peer lifecycle chaincode install medicaldata.tar.gz &&
peer lifecycle chaincode queryinstalled > log.txt &&
peer lifecycle chaincode approveformyorg --channelID mychannel --name medicaldata --version 1 --sequence 1 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/medicaldata.com/orderers/orderer.medicaldata.com/tls/ca.crt --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json --package-id "$(sed -n "/medicaldata/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)" &&
peer lifecycle chaincode checkcommitreadiness -C mychannel -n medicaldata -v 1 --sequence 1 --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json'

sleep 2

docker exec -it cliOrg2 bash -c 'peer lifecycle chaincode package medicaldata.tar.gz --path /opt/gopath/src/github.com/chaincode --lang node --label medicaldata &&
peer lifecycle chaincode install medicaldata.tar.gz &&
peer lifecycle chaincode queryinstalled > log.txt &&
peer lifecycle chaincode approveformyorg --channelID mychannel --name medicaldata --version 1 --sequence 1 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/medicaldata.com/orderers/orderer.medicaldata.com/tls/ca.crt --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json --package-id "$(sed -n "/medicaldata/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)" &&
peer lifecycle chaincode checkcommitreadiness -C mychannel -n medicaldata -v 1 --sequence 1 --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json'

sleep 2

docker exec -it cliOrg1 bash -c 'peer lifecycle chaincode commit -C mychannel -n medicaldata -v 1 --sequence 1 --tls -o orderer.medicaldata.com:7050 --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/medicaldata.com/orderers/orderer.medicaldata.com/tls/ca.crt --peerAddresses peer0.org1.medicaldata.com:7051 --peerAddresses peer0.org2.medicaldata.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.medicaldata.com/peers/peer0.org1.medicaldata.com/tls/ca.crt --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.medicaldata.com/peers/peer0.org2.medicaldata.com/tls/ca.crt --collections-config /opt/gopath/src/github.com/chaincode/collections_config.json &&
peer lifecycle chaincode querycommitted -C mychannel'
