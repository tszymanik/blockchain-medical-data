export interface IReport {
  hospitalId: string;
  doctorId: string;
  patientId: string;
  content: string;
}

export class Report implements IReport {
  hospitalId: string;
  doctorId: string;
  patientId: string;
  content: string;

  constructor(hospitalId: string, doctorId: string, patientId: string, content: string) {
    this.hospitalId = hospitalId;
    this.doctorId = doctorId;
    this.patientId = patientId;
    this.content = content;
  }

  toString() {
    return JSON.stringify(this);
  }

  toBuffer() {
    return Buffer.from(this.toString());
  }
}
