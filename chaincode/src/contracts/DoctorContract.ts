import { Context, Contract } from "fabric-contract-api";
import { IDoctor, Doctor } from "../models/Doctor";

export class DoctorContract extends Contract {
  constructor() {
    super("org1.medicaldata.doctor");
  }

  async initLedger(context: Context) {
    const doctors: Doctor[] = [
      new Doctor(
        "jan.kowalski@email.com",
        "696936374",
        "Jan",
        "Kowalski",
        94021106010,
        new Date(1994, 2, 11),
        "M",
        "HOSPITAL_0"
      ),
      new Doctor(
        "jan.kowalski@email.com",
        "696936374",
        "Jan",
        "Kowalski",
        94021106010,
        new Date(1994, 2, 11),
        "M",
        "HOSPITAL_0"
      )
    ];

    await Promise.all(
      doctors.map(
        async (doctor, index) =>
          await context.stub.putState(`DOCTOR_${index}`, doctor.toBuffer())
      )
    );
  }

  async getDoctor(context: Context, key: string) {
    const doctorBytes = await context.stub.getState(key);

    if (!doctorBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    return doctorBytes.toString();
  }

  async getDoctors(context: Context) {
    const startKey = "DOCTOR_0";
    const endKey = "DOCTOR_999";
    const doctors = [];

    for await (const state of context.stub.getStateByRange(startKey, endKey)) {
      const value = Buffer.from(state.value).toString("utf8");
      const record: IDoctor = JSON.parse(value);

      doctors.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(doctors);
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
    hospitalId: string
  ) {
    await context.stub.putState(
      key,
      new Doctor(
        email,
        phoneNumer,
        firstName,
        lastName,
        Number.parseInt(personalIdentificationNumber),
        new Date(dateOfBirth),
        gender,
        hospitalId
      ).toBuffer()
    );
  }

  async transferDoctor(context: Context, doctorId: string, hospitalId: string) {
    const doctorBytes = await context.stub.getState(doctorId);

    if (!doctorBytes) {
      throw new Error(`${doctorId} doesn't exist.`);
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
      hospitalId
    );

    await context.stub.putState(doctorId, doctor.toBuffer());
  }
}
