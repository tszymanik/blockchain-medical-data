export type Report = {
  hospitalKey: string;
  doctorKey: string;
  patientKey: string;
  content: string;
};

export type ReportData = {
  Key: string;
  Record: Report;
};
