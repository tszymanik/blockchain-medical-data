import FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import fs from 'fs';
import path from 'path';

const main = async () => {
  try {
    const networkConfigurationPath = path.resolve(
      __dirname,
      '..',
      '..',
      'connection.json'
    );
    const networkConfiguration = JSON.parse(
      fs.readFileSync(networkConfigurationPath, 'utf8')
    );

    const caInfo =
      networkConfiguration.certificateAuthorities['ca.medicaldata.com'];
    const caTlsCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTlsCACerts, verify: false },
      caInfo.caName
    );

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const identity = await wallet.get('admin');
    if (identity) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet.'
      );
      return;
    }

    const enrollment = await ca.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw',
    });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };
    await wallet.put('admin', x509Identity);
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet.'
    );
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}.`);
    process.exit(1);
  }
};

main();
