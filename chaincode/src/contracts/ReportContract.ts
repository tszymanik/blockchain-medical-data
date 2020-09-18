import { Context, Contract } from 'fabric-contract-api';
import { IReport, Report } from '../models/Report';
import { DATA } from '../shared';

export class ReportContract extends Contract {
  constructor() {
    super('medicaldata.report');
  }

  async initLedger(context: Context) {
    const mspId = context.clientIdentity.getMSPID();
    if (mspId !== process.env.INSURER_MSP) {
      throw new Error(
        `${mspId} doesn't have sufficient privileges for this resource.`,
      );
    }
    
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
      const reportData: IReport = JSON.parse(
        Buffer.from(state.value).toString('utf8'),
      );

      const report = new Report(
        reportData.hospitalKey,
        reportData.doctorKey,
        reportData.patientKey,
        reportData.content,
      );

      const mspId = context.clientIdentity.getMSPID();
      if (mspId === process.env.INSURER_MSP) {
        reports.push({ Key: state.key, Record: report.getData() });
      } else {
        reports.push({ Key: state.key, Record: report.getAnonymizedData() });
      }
    }

    return JSON.stringify(reports);
  }

  async getReport(context: Context, key: string) {
    const hospitalBytes = await context.stub.getPrivateData(DATA, key);
    if (!hospitalBytes) {
      throw new Error(`${key} doesn't exist.`);
    }

    const reportData: IReport = JSON.parse(hospitalBytes.toString());
    const report = new Report(
      reportData.hospitalKey,
      reportData.doctorKey,
      reportData.patientKey,
      reportData.content,
    );

    const mspId = context.clientIdentity.getMSPID();
    if (mspId === process.env.INSURER_MSP) {
      return JSON.stringify(report.getData());
    }

    return JSON.stringify(report.getAnonymizedData());
  }

  async addReport(
    context: Context,
    key: string,
    hospitalKey: string,
    doctorKey: string,
    patientKey: string,
    content: string,
  ) {
    const mspId = context.clientIdentity.getMSPID();
    if (mspId !== process.env.INSURER_MSP) {
      throw new Error(
        `${mspId} doesn't have sufficient privileges for this resource.`,
      );
    }

    const report = new Report(hospitalKey, doctorKey, patientKey, content);

    await context.stub.putPrivateData(DATA, key, report.toBuffer());
  }
}
