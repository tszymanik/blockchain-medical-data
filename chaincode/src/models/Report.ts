export interface IReport {
  hospitalKey: string;
  doctorKey: string;
  patientKey: string;
  content: string;
}

export class Report implements IReport {
  hospitalKey: string;
  doctorKey: string;
  patientKey: string;
  content: string;

  constructor(
    hospitalKey: string,
    doctorKey: string,
    patientKey: string,
    content: string,
  ) {
    this.hospitalKey = hospitalKey;
    this.doctorKey = doctorKey;
    this.patientKey = patientKey;
    this.content = content;
  }

  toString() {
    return JSON.stringify(this);
  }

  toBuffer() {
    return Buffer.from(this.toString());
  }
}
