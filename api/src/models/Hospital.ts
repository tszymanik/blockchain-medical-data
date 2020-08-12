import { evaluateTransaction, submitTransaction } from '../shared';

export const getHospitals = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.HOSPITAL_CONTRACT_NAME,
    'getHospitals',
    [startKey, endKey]
  );

export const getHospital = (
  organizationName: string,
  userName: string,
  key: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.HOSPITAL_CONTRACT_NAME,
    'getHospital',
    [key]
  );

export const addHospital = (
  organizationName: string,
  userName: string,
  key: string,
  name: string,
  city: string
) =>
  submitTransaction(
    organizationName,
    userName,
    process.env.HOSPITAL_CONTRACT_NAME,
    'addHospital',
    [key, name, city]
  );
