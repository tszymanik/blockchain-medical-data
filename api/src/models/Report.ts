import { evaluateTransaction, submitTransaction } from '../shared';

export const getReports = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'getReports',
    [startKey, endKey]
  );

export const getAnonymizedReports = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'getAnonymizedReports',
    [startKey, endKey]
  );

export const getReport = (
  organizationName: string,
  userName: string,
  key: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'getReport',
    [key]
  );

export const getAnonymizedReport = (
  organizationName: string,
  userName: string,
  key: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'getAnonymizedReport',
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
  submitTransaction(
    organizationName,
    userName,
    process.env.REPORT_CONTRACT_NAME,
    'addReport',
    [key, hospitalKey, doctorKey, patientKey, content]
  );
