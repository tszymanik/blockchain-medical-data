import moment from 'moment';
import { Context, Contract } from 'fabric-contract-api';
import { IDoctor, Doctor } from '../models/Doctor';
import { DATA } from '../shared';

export class DoctorContract extends Contract {
  constructor() {
    super('medicaldata.doctor');
  }

  async initLedger(context: Context) {
    const doctors: Doctor[] = [
      new Doctor(
        'jan.kowalski@medicaldata.com',
        '000000000',
        'Jan',
        'Kowalski',
        '80022354118',
        moment('1980-02-23').toDate(),
        'M',
        'HOSPITAL_0',
      ),
      new Doctor(
        'stanislaw.michalski@medicaldata.com',
        '000000000',
        'Stanisław',
        'Michalski',
        '75062831756',
        moment('1975-06-28').toDate(),
        'M',
        'HOSPITAL_2',
      ),
      new Doctor(
        'alicja.zielinska@medicaldata.com',
        '000000000',
        'Alicja',
        'Zielińska',
        '82070931792',
        moment('1982-07-09').toDate(),
        'K',
        'HOSPITAL_1',
      ),
    ];

    await Promise.all(
      doctors.map(
        async (doctor, index) =>
          await context.stub.putPrivateData(
            DATA,
            `DOCTOR_${index}`,
            doctor.toBuffer(),
          ),
      ),
    );
  }

  async getDoctors(context: Context, startKey: string, endKey: string) {
    const doctors = [];

    for await (const state of context.stub.getPrivateDataByRange(
      DATA,
      startKey,
      endKey,
    )) {
      const value = Buffer.from(state.value).toString('utf8');
      const record: IDoctor = JSON.parse(value);

      doctors.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(doctors);
  }

  async getDoctor(context: Context, key: string) {
    const doctorBytes = await context.stub.getPrivateData(DATA, key);

    if (!doctorBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    return doctorBytes.toString();
  }

  async addDoctor(
    context: Context,
    key: string,
    email: string,
    phoneNumer: string,
    firstName: string,
    lastName: string,
    personalIdentificationNumber: string,
    dateOfBirth: string,
    gender: string,
    hospitalKey: string,
  ) {
    await context.stub.putPrivateData(
      DATA,
      key,
      new Doctor(
        email,
        phoneNumer,
        firstName,
        lastName,
        personalIdentificationNumber,
        moment(dateOfBirth).toDate(),
        gender,
        hospitalKey,
      ).toBuffer(),
    );
  }

  async transferDoctor(context: Context, key: string, hospitalKey: string) {
    const doctorBytes = await context.stub.getPrivateData(DATA, key);

    if (!doctorBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    const record: IDoctor = JSON.parse(doctorBytes.toString());
    const doctor = new Doctor(
      record.email,
      record.phoneNumer,
      record.firstName,
      record.lastName,
      record.personalIdentificationNumber,
      record.dateOfBirth,
      record.gender,
      hospitalKey,
    );

    await context.stub.putPrivateData(DATA, key, doctor.toBuffer());
  }
}
