import FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import fs from 'fs';
import path from 'path';

const user = process.argv[2];

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

    const caURL =
      networkConfiguration.certificateAuthorities['ca.medicaldata.com'].url;
    const ca = new FabricCAServices(caURL);

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(user);
    if (userIdentity) {
      console.log(
        `An identity for the user "${user}" already exists in the wallet.`
      );
      return;
    }

    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet.'
      );
      console.log('Run the enrollAdmin.js application before retrying.');
      return;
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    const secret = await ca.register(
      {
        affiliation: 'org1.department1',
        enrollmentID: user,
        role: 'client',
      },
      adminUser
    );

    const enrollment = await ca.enroll({
      enrollmentID: user,
      enrollmentSecret: secret,
    });

    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };

    await wallet.put(user, x509Identity);
    console.log(
      `Successfully registered and enrolled admin user "${user}" and imported it into the wallet.`
    );
  } catch (error) {
    console.error(`Failed to register user "${user}": ${error}.`);
    process.exit(1);
  }
};

main();
