import { Context, Contract } from 'fabric-contract-api';
import { IPatient, Patient } from '../models/Patient';

export class PatientContract extends Contract {
  constructor() {
    super('org1.medicaldata.patient');
  }

  async initLedger(context: Context) {
    const patients: Patient[] = [
      new Patient(
        'jan.kowalski@email.com',
        '000000000',
        'Jan',
        'Kowalski',
        94021106010,
        new Date(1994, 2, 11),
        'M',
        'Kraków',
        'Łojasiewicza 11',
        'Kraków',
        '30-348',
        'małopolskie',
      ),
      new Patient(
        'jan.kowalski@email.com',
        '000000000',
        'Jan',
        'Kowalski',
        94021106010,
        new Date(1994, 2, 11),
        'M',
        'Kraków',
        'Łojasiewicza 11',
        'Kraków',
        '30-348',
        'małopolskie',
      ),
    ];

    await Promise.all(
      patients.map(
        async (patient, index) =>
          await context.stub.putState(`PATIENT_${index}`, patient.toBuffer()),
      ),
    );
  }

  async getPatients(context: Context) {
    const startKey = 'PATIENT_0';
    const endKey = 'PATIENT_999';
    const patients = [];

    for await (const state of context.stub.getStateByRange(startKey, endKey)) {
      const value = Buffer.from(state.value).toString('utf8');
      const record: IPatient = JSON.parse(value);

      patients.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(patients);
  }

  async getPatient(context: Context, key: string) {
    const patientBytes = await context.stub.getState(key);

    if (!patientBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    return patientBytes.toString();
  }

  async addPatient(
    context: Context,
    key: string,
    email: string,
    phoneNumer: string,
    firstName: string,
    lastName: string,
    personalIdentificationNumber: string,
    dateOfBirth: string,
    gender: string,
    placeOfBirth: string,
    address: string,
    city: string,
    zipCode: string,
    voivodeship: string,
  ) {
    await context.stub.putState(
      key,
      new Patient(
        email,
        phoneNumer,
        firstName,
        lastName,
        Number.parseInt(personalIdentificationNumber),
        new Date(dateOfBirth),
        gender,
        placeOfBirth,
        address,
        city,
        zipCode,
        voivodeship,
      ).toBuffer(),
    );
  }
}
