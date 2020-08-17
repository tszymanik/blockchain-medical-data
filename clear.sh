#!/bin/sh

set -e

rm -f ~/.hfc-key-store/*
rm -r config
rm -r crypto-config
rm -r api/wallet
rm -r organizations/peerOrganizations/org1.medicaldata.com/connection-org1.json
rm -r organizations/peerOrganizations/org2.medicaldata.com/connection-org2.json
