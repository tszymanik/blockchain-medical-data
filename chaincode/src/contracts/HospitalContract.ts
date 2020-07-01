import { Context, Contract } from 'fabric-contract-api';
import { IHospital, Hospital } from '../models/Hospital';

export class HospitalContract extends Contract {
  constructor() {
    super('medicaldata.hospital');
  }

  async initLedger(context: Context) {
    const hospitals: Hospital[] = [
      new Hospital('TestHospital1', 'TestCity1'),
      new Hospital('TestHospital2', 'TestCity2'),
      new Hospital('TestHospital3', 'TestCity1'),
      new Hospital('TestHospital4', 'TestCity1'),
      new Hospital('TestHospital5', 'TestCity2'),
    ];

    await Promise.all(
      hospitals.map(
        async (hospital, index) =>
          await context.stub.putState(`HOSPITAL_${index}`, hospital.toBuffer()),
      ),
    );
  }

  async getHospital(context: Context, key: string) {
    const hospitalBytes = await context.stub.getState(key);

    if (!hospitalBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    return hospitalBytes.toString();
  }

  async getHospitals(context: Context, startKey: string, endKey: string) {
    const hospitals = [];

    for await (const state of context.stub.getStateByRange(startKey, endKey)) {
      const value = Buffer.from(state.value).toString('utf8');
      const record: IHospital = JSON.parse(value);

      hospitals.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(hospitals);
  }

  async addHospital(context: Context, key: string, name: string, city: string) {
    await context.stub.putState(key, new Hospital(name, city).toBuffer());
  }
}
