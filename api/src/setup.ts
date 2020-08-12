import 'dotenv/config';
import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import { addAdmin, addUser } from './models/User';
import { getNetworkConfiguration } from './shared';

export const initLedger = async (userName: string, contractName) =>
  new Promise(async (resolve, reject) => {
    try {
      const networkConfiguration = getNetworkConfiguration(
        process.env.INSURER_ORG
      );
      const walletPath = path.join(
        process.cwd(),
        'wallet',
        process.env.INSURER_ORG
      );
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

      const result = await contract.submitTransaction('initLedger');

      gateway.disconnect();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

const setup = async () => {
  try {
    await addAdmin(process.env.INSURER_ORG);
    await addUser(process.env.INSURER_ORG, 'user1');

    await initLedger('user1', process.env.PATIENT_CONTRACT_NAME);
    await initLedger('user1', process.env.HOSPITAL_CONTRACT_NAME);
    await initLedger('user1', process.env.DOCTOR_CONTRACT_NAME);
    await initLedger('user1', process.env.REPORT_CONTRACT_NAME);

    await addAdmin(process.env.UNIVERSITY_ORG);
    await addUser(process.env.UNIVERSITY_ORG, 'user1');
  } catch (error) {
    console.log(error);
  }
};

setup();
