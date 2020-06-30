import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';

const organizationName = process.argv[2];
const userName = process.argv[3];
const contractName = process.argv[4];
const transactionName = process.argv[5];

const main = async () => {
  try {
    const networkConfigurationPath = path.resolve(
      __dirname,
      '..',
      '..',
      'organizations',
      'peerOrganizations',
      `${organizationName}.medicaldata.com`,
      `connection-${organizationName}.json`
    );
    const networkConfiguration = JSON.parse(
      fs.readFileSync(networkConfigurationPath, 'utf8')
    );

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const identity = await wallet.get(userName);
    if (!identity) {
      console.log(
        `An identity for the user "${userName}" does not exist in the wallet.`
      );
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(networkConfiguration, {
      wallet,
      identity: userName,
      discovery: { enabled: true, asLocalhost: false },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('medicaldata', contractName);

    const transactionArguments: string[] = [];

    process.argv.forEach((arg, index) => {
      if (index > 5) {
        transactionArguments.push(arg);
      }
    });

    if (transactionArguments) {
      await contract.submitTransaction(transactionName, ...transactionArguments);
    } else {
      await contract.submitTransaction(transactionName);
    }
    
    console.log('Transaction has been submitted.');

    gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}.`);
    process.exit(1);
  }
};

main();
