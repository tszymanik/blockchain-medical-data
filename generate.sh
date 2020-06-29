#!/bin/sh

set -e

export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=mychannel

rm -fr config/*
rm -fr crypto-config/*

cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

mv crypto-config/peerOrganizations/org1.medicaldata.com/ca/*_sk crypto-config/peerOrganizations/org1.medicaldata.com/ca/ca.org1.medicaldata.com_sk
mv crypto-config/peerOrganizations/org2.medicaldata.com/ca/*_sk crypto-config/peerOrganizations/org2.medicaldata.com/ca/ca.org2.medicaldata.com_sk

configtxgen -profile TwoOrgsOrdererGenesis -channelID ordererchannel -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi

configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./config/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org2MSP..."
  exit 1
fi

echo "Generate CCP files for Org1 and Org2"
./organizations/ccp-generate.sh