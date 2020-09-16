import moment from 'moment';
import { Context, Contract } from 'fabric-contract-api';
import { IPatient, Patient } from '../models/Patient';
import { DATA } from '../shared';

export class PatientContract extends Contract {
  constructor() {
    super('medicaldata.patient');
  }

  async initLedger(context: Context) {
    const patients: Patient[] = [
      new Patient(
        'tomasz.nowak@medicaldata.com',
        '000000000',
        'Tomasz',
        'Nowak',
        '90022294174',
        moment('1990-02-22').toDate(),
        'M',
        'Kraków',
        'Łojasiewicza 11',
        'Kraków',
        '30-348',
        'małopolskie',
      ),
      new Patient(
        'emil.kozlowski@medicaldata.com',
        '000000000',
        'Emil',
        'Kozłowski',
        '97011861272',
        moment('1997-01-18').toDate(),
        'M',
        'Kraków',
        'Łojasiewicza 11',
        'Kraków',
        '30-348',
        'małopolskie',
      ),
      new Patient(
        'agnieszka.kowalska@medicaldata.com',
        '000000000',
        'Agnieszka',
        'Kowalska',
        '84022164313',
        moment('1984-02-21').toDate(),
        'M',
        'Kraków',
        'Łojasiewicza 11',
        'Kraków',
        '30-348',
        'małopolskie',
      ),
    ];

    await Promise.all(
      patients.map(async (patient, index) => {
        await context.stub.putPrivateData(
          DATA,
          `PATIENT_${index}`,
          patient.toBuffer(),
        );
      }),
    );
  }

  async getPatients(context: Context, startKey: string, endKey: string) {
    const patients = [];

    for await (const state of context.stub.getPrivateDataByRange(
      DATA,
      startKey,
      endKey,
    )) {
      const patientData: IPatient = JSON.parse(
        Buffer.from(state.value).toString('utf8'),
      );

      const patient = new Patient(
        patientData.email,
        patientData.phoneNumer,
        patientData.firstName,
        patientData.lastName,
        patientData.personalIdentificationNumber,
        patientData.dateOfBirth,
        patientData.gender,
        patientData.placeOfBirth,
        patientData.address,
        patientData.city,
        patientData.zipCode,
        patientData.voivodeship,
      );

      const mspId = context.clientIdentity.getMSPID();
      if (mspId === process.env.INSURER_MSP) {
        patients.push({ Key: state.key, Record: patient.getData() });
      } else if (mspId === process.env.UNIVERSITY_MSP) {
        patients.push({ Key: state.key, Record: patient.getAnonymizedData() });
      }
    }

    return JSON.stringify(patients);
  }

  async getPatient(context: Context, key: string) {
    const patientBytes = await context.stub.getPrivateData(DATA, key);
    if (!patientBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    const patientData: IPatient = JSON.parse(patientBytes.toString());
    const patient = new Patient(
      patientData.email,
      patientData.phoneNumer,
      patientData.firstName,
      patientData.lastName,
      patientData.personalIdentificationNumber,
      patientData.dateOfBirth,
      patientData.gender,
      patientData.placeOfBirth,
      patientData.address,
      patientData.city,
      patientData.zipCode,
      patientData.voivodeship,
    );

    const mspId = context.clientIdentity.getMSPID();
    if (mspId === process.env.INSURER_MSP) {
      return JSON.stringify(patient.getData());
    }

    return JSON.stringify(patient.getAnonymizedData());
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
    const mspId = context.clientIdentity.getMSPID();
    if (mspId !== process.env.INSURER_MSP) {
      throw new Error(
        `${mspId} doesn't have sufficient privileges for this resource.`,
      );
    }

    const patient = new Patient(
      email,
      phoneNumer,
      firstName,
      lastName,
      personalIdentificationNumber,
      moment(dateOfBirth).toDate(),
      gender,
      placeOfBirth,
      address,
      city,
      zipCode,
      voivodeship,
    );

    await context.stub.putPrivateData(DATA, key, patient.toBuffer());
  }
}
