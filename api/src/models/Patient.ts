import { evaluateTransaction, submitTransaction } from '../shared';

export const getPatients = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.PATIENT_CONTRACT_NAME,
    'getPatients',
    [startKey, endKey]
  );

export const getPatient = (
  organizationName: string,
  userName: string,
  key: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.PATIENT_CONTRACT_NAME,
    'getPatient',
    [key]
  );

export const getAnonymizedPatients = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.PATIENT_CONTRACT_NAME,
    'getAnonymizedPatients',
    [startKey, endKey]
  );

export const getAnonymizedPatient = (
  organizationName: string,
  userName: string,
  key: string
) =>
  evaluateTransaction(
    organizationName,
    userName,
    process.env.PATIENT_CONTRACT_NAME,
    'getAnonymizedPatient',
    [key]
  );

export const addPatient = (
  organizationName: string,
  userName: string,
  key: string,
  email: string,
  phoneNumer: string,
  firstName: string,
  lastName: string,
  personalIdentificationNumber: string,
  dateOfBirth: string,
  gender: string,
  placeOfBirth: string,
  address: string,
  city: string,
  zipCode: string,
  voivodeship: string
) =>
  submitTransaction(
    organizationName,
    userName,
    process.env.PATIENT_CONTRACT_NAME,
    'addPatient',
    [
      key,
      email,
      phoneNumer,
      firstName,
      lastName,
      personalIdentificationNumber,
      dateOfBirth,
      gender,
      placeOfBirth,
      address,
      city,
      zipCode,
      voivodeship,
    ]
  );
