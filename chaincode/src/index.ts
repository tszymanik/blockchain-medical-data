import { HospitalContract } from './contracts/HospitalContract';
import { PatientContract } from './contracts/PatientContract';
import { DoctorContract } from './contracts/DoctorContract';
import { ReportContract } from './contracts/ReportContract';

export { HospitalContract, PatientContract, DoctorContract, ReportContract };

export const contracts: any[] = [
  HospitalContract,
  PatientContract,
  DoctorContract,
  ReportContract,
];
