import { Context, Contract } from 'fabric-contract-api';
import { IReport, Report } from '../models/Report';
import { DATA, ANONYMIZED_DATA } from '../shared';

export class ReportContract extends Contract {
  constructor() {
    super('medicaldata.report');
  }

  async initLedger(context: Context) {
    const reports: Report[] = [
      new Report(
        'HOSPITAL_0',
        'DOCTOR_0',
        'PATIENT_0',
        'Przykładowa zawartość raportu.',
      ),
      new Report(
        'HOSPITAL_2',
        'DOCTOR_1',
        'PATIENT_1',
        'Przykładowa zawartość raportu.',
      ),
      new Report(
        'HOSPITAL_1',
        'DOCTOR_2',
        'PATIENT_2',
        'Przykładowa zawartość raportu.',
      ),
    ];

    await Promise.all(
      reports.map(async (report, index) => {
        await context.stub.putPrivateData(
          DATA,
          `REPORT_${index}`,
          report.toBuffer(),
        );

        await context.stub.putPrivateData(
          ANONYMIZED_DATA,
          `REPORT_${index}`,
          Buffer.from(JSON.stringify(report.getAnonymizedData())),
        );
      }),
    );
  }

  async getReports(context: Context, startKey: string, endKey: string) {
    const reports = [];

    for await (const state of context.stub.getPrivateDataByRange(
      DATA,
      startKey,
      endKey,
    )) {
      const value = Buffer.from(state.value).toString('utf8');
      const record: IReport = JSON.parse(value);

      reports.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(reports);
  }

  async getAnonymizedReports(
    context: Context,
    startKey: string,
    endKey: string,
  ) {
    const reports = [];

    for await (const state of context.stub.getPrivateDataByRange(
      ANONYMIZED_DATA,
      startKey,
      endKey,
    )) {
      const value = Buffer.from(state.value).toString('utf8');
      const record: IReport = JSON.parse(value);

      reports.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(reports);
  }

  async getReport(context: Context, key: string) {
    const hospitalBytes = await context.stub.getPrivateData(DATA, key);

    if (!hospitalBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    return hospitalBytes.toString();
  }

  async getAnonymizedReport(context: Context, key: string) {
    const hospitalBytes = await context.stub.getPrivateData(
      ANONYMIZED_DATA,
      key,
    );

    if (!hospitalBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    return hospitalBytes.toString();
  }

  async addReport(
    context: Context,
    key: string,
    hospitalKey: string,
    doctorKey: string,
    patientKey: string,
    content: string,
  ) {
    const report = new Report(hospitalKey, doctorKey, patientKey, content);

    await context.stub.putPrivateData(DATA, key, report.toBuffer());
    await context.stub.putPrivateData(
      ANONYMIZED_DATA,
      key,
      Buffer.from(JSON.stringify(report.getAnonymizedData())),
    );
  }
}
