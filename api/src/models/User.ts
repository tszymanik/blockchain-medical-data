import { Wallets } from 'fabric-network';
import path from 'path';
import { getCa, getX509Identity } from '../shared';

export const addAdmin = (organizationName: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const ca = getCa(organizationName);
      const walletPath = path.join(process.cwd(), 'wallet', organizationName);
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      const identity = await wallet.get('admin');
      if (identity) {
        throw new Error(
          'An identity for the admin user "admin" already exists in the wallet.'
        );
      }

      const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw',
      });

      const x509Identity = getX509Identity(organizationName, enrollment);
      await wallet.put('admin', x509Identity);

      resolve(
        'Successfully enrolled admin user "admin" and imported it into the wallet.'
      );
    } catch (error) {
      reject(error);
    }
  });

export const addUser = (organizationName: string, userName: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const ca = getCa(organizationName);

      const walletPath = path.join(process.cwd(), 'wallet', organizationName);
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      const userIdentity = await wallet.get(userName);
      if (userIdentity) {
        throw new Error(
          `An identity for the user "${userName}" already exists in the wallet.`
        );
      }

      const adminIdentity = await wallet.get('admin');
      if (!adminIdentity) {
        throw new Error(
          'An identity for the admin user "admin" does not exist in the wallet.'
        );
      }

      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, 'admin');

      const secret = await ca.register(
        {
          affiliation: `${organizationName}.department1`,
          enrollmentID: userName,
          role: 'client',
        },
        adminUser
      );

      const enrollment = await ca.enroll({
        enrollmentID: userName,
        enrollmentSecret: secret,
      });

      const x509Identity = getX509Identity(organizationName, enrollment);
      await wallet.put(userName, x509Identity);

      resolve(
        `Successfully registered and enrolled admin user "${userName}" and imported it into the wallet.`
      );
    } catch (error) {
      reject(error);
    }
  });

export const checkUser = (organizationName: string, userName: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const walletPath = path.join(process.cwd(), 'wallet', organizationName);
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      const userIdentity = await wallet.get(userName);
      if (!userIdentity) {
        throw new Error(
          `An identity for the user "${userName}" does not exist in the wallet.`
        );
      }

      resolve(userIdentity);
    } catch (error) {
      reject(error);
    }
  });
