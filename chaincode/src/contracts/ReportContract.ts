import { Context, Contract } from 'fabric-contract-api';
import { IReport, Report } from '../models/Report';

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
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ),
    ];

    await Promise.all(
      reports.map(
        async (report, index) =>
          await context.stub.putState(`REPORT_${index}`, report.toBuffer()),
      ),
    );
  }

  async getReports(context: Context, startKey: string, endKey: string) {
    const reports = [];

    for await (const state of context.stub.getStateByRange(startKey, endKey)) {
      const value = Buffer.from(state.value).toString('utf8');
      const record: IReport = JSON.parse(value);

      reports.push({ Key: state.key, Record: record });
    }

    return JSON.stringify(reports);
  }

  async getReport(context: Context, key: string) {
    const hospitalBytes = await context.stub.getState(key);

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
    await context.stub.putState(
      key,
      new Report(hospitalKey, doctorKey, patientKey, content).toBuffer(),
    );
  }
}
