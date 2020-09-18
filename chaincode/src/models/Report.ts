export interface IReport {
  hospitalKey: string;
  doctorKey: string;
  patientKey: string;
  content: string;
}

export type AnonymizedReport = {
  patientKey: string;
  content: string;
};

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

  getData(): IReport {
    return {
      hospitalKey: this.hospitalKey,
      doctorKey: this.doctorKey,
      patientKey: this.patientKey,
      content: this.content,
    };
  }

  getAnonymizedData(): AnonymizedReport {
    return {
      patientKey: this.patientKey,
      content: this.content,
    };
  }

  toString() {
    return JSON.stringify(this);
  }

  toBuffer() {
    return Buffer.from(this.toString());
  }
}
