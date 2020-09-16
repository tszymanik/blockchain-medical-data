import { Context, Contract } from 'fabric-contract-api';
import { IHospital, Hospital } from '../models/Hospital';
import { DATA } from '../shared';

export class HospitalContract extends Contract {
  constructor() {
    super('medicaldata.hospital');
  }

  async initLedger(context: Context) {
    const hospitals: Hospital[] = [
      new Hospital('Szpital Uniwersytecki w Krakowie', 'Kraków'),
      new Hospital(
        'Uniwersyteckie Centrum Kliniczne im. prof. K. Gibińskiego Śląskiego Uniwersytetu Medycznego w Katowicach',
        'Katowice',
      ),
      new Hospital(
        'Samodzielny Publiczny Centralny Szpital Kliniczny w Warszawie',
        'Warszawa',
      ),
    ];

    await Promise.all(
      hospitals.map(
        async (hospital, index) =>
          await context.stub.putPrivateData(
            DATA,
            `HOSPITAL_${index}`,
            hospital.toBuffer(),
          ),
      ),
    );
  }

  async getHospitals(context: Context, startKey: string, endKey: string) {
    const mspId = context.clientIdentity.getMSPID();
    if (mspId !== process.env.INSURER_MSP) {
      throw new Error(
        `${mspId} doesn't have sufficient privileges for this resource.`,
      );
    }

    const hospitals = [];

    for await (const state of context.stub.getPrivateDataByRange(
      DATA,
      startKey,
      endKey,
    )) {
      const value = Buffer.from(state.value).toString('utf8');
      const record: IHospital = JSON.parse(value);

      hospitals.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(hospitals);
  }

  async getHospital(context: Context, key: string) {
    const mspId = context.clientIdentity.getMSPID();
    if (mspId !== process.env.INSURER_MSP) {
      throw new Error(
        `${mspId} doesn't have sufficient privileges for this resource.`,
      );
    }

    const hospitalBytes = await context.stub.getPrivateData(DATA, key);

    if (!hospitalBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    return hospitalBytes.toString();
  }

  async addHospital(context: Context, key: string, name: string, city: string) {
    const mspId = context.clientIdentity.getMSPID();
    if (mspId !== process.env.INSURER_MSP) {
      throw new Error(
        `${mspId} doesn't have sufficient privileges for this resource.`,
      );
    }
    
    await context.stub.putPrivateData(
      DATA,
      key,
      new Hospital(name, city).toBuffer(),
    );
  }
}
