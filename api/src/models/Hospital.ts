import { query, invoke } from '../shared';

export const getHospitals = (
  organizationName: string,
  userName: string,
  startKey: string,
  endKey: string
) =>
  query(
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
  query(
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
  invoke(
    organizationName,
    userName,
    process.env.HOSPITAL_CONTRACT_NAME,
    'addHospital',
    [key, name, city]
  );
