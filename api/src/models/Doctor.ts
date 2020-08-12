import { evaluateTransaction, submitTransaction } from '../shared';

export const getDoctors = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.DOCTOR_CONTRACT_NAME,
    'getDoctors',
    [startKey, endKey]
  );

export const getDoctor = (
  organizationName: string,
  userName: string,
  key: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.DOCTOR_CONTRACT_NAME,
    'getDoctor',
    [key]
  );

export const addDoctor = (
  organizationName: string,
  userName: string,
  key: string,
  email: string,
  phoneNumer: string,
  firstName: string,
  lastName: string,
  personalIdentificationNumber: number,
  dateOfBirth: Date,
  gender: string,
  hospitalKey: string
) =>
  submitTransaction(
    organizationName,
    userName,
    process.env.DOCTOR_CONTRACT_NAME,
    'addDoctor',
    [
      key,
      email,
      phoneNumer,
      firstName,
      lastName,
      personalIdentificationNumber.toString(),
      dateOfBirth.toString(),
      gender,
      hospitalKey,
    ]
  );
