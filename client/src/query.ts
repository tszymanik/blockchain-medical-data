import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';

const organizationName = process.argv[2];
const userName = process.argv[3];
const contractName = process.argv[4];
const transactionName = process.argv[5];
const transactionArgument = process.argv[6];

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

    const walletPath = path.join(process.cwd(), 'wallet', organizationName);
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
    
    let result;

    if (transactionArgument) {
      result = await contract.evaluateTransaction(transactionName, transactionArgument);
    } else {
      result = await contract.evaluateTransaction(transactionName);
    }

    console.log(
      `Transaction ${transactionName} has been evaluated, result is: ${result.toString()}.`
    );
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}.`);
    process.exit(1);
  }
};

main();
