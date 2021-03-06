import { query, invoke } from '../shared';

export const getReports = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  query(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'getReports',
    [startKey, endKey]
  );

export const getReport = (
  organizationName: string,
  userName: string,
  key: string
) =>
  query(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'getReport',
    [key]
  );

export const addReport = (
  organizationName: string,
  userName: string,
  key: string,
  hospitalKey: string,
  doctorKey: string,
  patientKey: string,
  content: string
) =>
  invoke(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'addReport',
    [key, hospitalKey, doctorKey, patientKey, content]
  );
