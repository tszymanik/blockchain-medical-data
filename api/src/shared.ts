import FabricCAServices from 'fabric-ca-client';
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';

export const getNetworkConfiguration = (organizationName: string) => {
  const networkConfigurationPath = path.resolve(
    __dirname,
    '..',
    '..',
    'organizations',
    'peerOrganizations',
    `${organizationName}.medicaldata.com`,
    `connection-${organizationName}.json`
  );

  return JSON.parse(fs.readFileSync(networkConfigurationPath, 'utf8'));
};

export const getCa = (organizationName: string) => {
  const networkConfiguration = getNetworkConfiguration(organizationName);

  const caInfo =
    networkConfiguration.certificateAuthorities[
      `ca.${organizationName}.medicaldata.com`
    ];
  const caTlsCACerts = caInfo.tlsCACerts.pem;

  const ca = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTlsCACerts, verify: false },
    caInfo.caName
  );

  return ca;
};

export const getX509Identity = (
  organizationName: string,
  enrollment: FabricCAServices.IEnrollResponse
) => {
  return {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: `${
      organizationName.charAt(0).toUpperCase() + organizationName.slice(1)
    }MSP`,
    type: 'X.509',
  };
};

export const query = (
  organizationName: string,
  userName: string,
  contractName: string,
  transactionName: string,
  transactionArguments: string[]
) =>
  new Promise(async (resolve, reject) => {
    try {
      const networkConfiguration = getNetworkConfiguration(organizationName);
      const walletPath = path.join(process.cwd(), 'wallet', organizationName);
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      const identity = await wallet.get(userName);
      if (!identity) {
        throw new Error(
          `An identity for the user "${userName}" does not exist in the wallet.`
        );
      }

      const gateway = new Gateway();
      await gateway.connect(networkConfiguration, {
        wallet,
        identity: userName,
        discovery: { enabled: true, asLocalhost: false },
      });

      const network = await gateway.getNetwork(process.env.NETWORK_NAME);
      const contract = network.getContract(
        process.env.CHAINCODE_ID,
        contractName
      );

      const result = await contract.evaluateTransaction(
        transactionName,
        ...transactionArguments
      );

      gateway.disconnect();

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

export const invoke = (
  organizationName: string,
  userName: string,
  contractName: string,
  transactionName: string,
  transactionArguments: string[]
) =>
  new Promise(async (resolve, reject) => {
    try {
      const networkConfiguration = getNetworkConfiguration(organizationName);
      const walletPath = path.join(process.cwd(), 'wallet', organizationName);
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      const identity = await wallet.get(userName);
      if (!identity) {
        throw new Error(
          `An identity for the user "${userName}" does not exist in the wallet.`
        );
      }

      const gateway = new Gateway();
      await gateway.connect(networkConfiguration, {
        wallet,
        identity: userName,
        discovery: { enabled: true, asLocalhost: false },
      });

      const network = await gateway.getNetwork(process.env.NETWORK_NAME);
      const contract = network.getContract(
        process.env.CHAINCODE_ID,
        contractName
      );

      await contract.submitTransaction(
        transactionName,
        ...transactionArguments
      );

      gateway.disconnect();

      resolve('Transaction has been submitted.');
    } catch (error) {
      reject(error);
    }
  });
