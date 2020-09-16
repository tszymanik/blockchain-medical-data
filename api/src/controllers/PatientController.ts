import { Router } from 'express';
import {
  addPatient,
  getAnonymizedPatient,
  getAnonymizedPatients,
  getPatient,
  getPatients,
} from '../models/Patient';

export const patientController = Router();

patientController.get('/', async (req, res, next) => {
  const { organizationName, userName, startKey, endKey } = req.query;

  if (
    organizationName &&
    typeof organizationName === 'string' &&
    userName &&
    typeof userName === 'string' &&
    startKey &&
    typeof startKey === 'string' &&
    endKey &&
    typeof endKey === 'string'
  ) {
    try {
      res.send(
        (
          await getPatients(organizationName, userName, startKey, endKey)
        ).toString()
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

patientController.get('/:key', async (req, res, next) => {
  const { organizationName, userName } = req.query;
  const { key } = req.params;

  if (
    organizationName &&
    typeof organizationName === 'string' &&
    userName &&
    typeof userName === 'string' &&
    key
  ) {
    try {
      res.send((await getPatient(organizationName, userName, key)).toString());
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

patientController.post('/', async (req, res, next) => {
  const {
    organizationName,
    userName,
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
  } = req.body;

  if (
    organizationName &&
    userName &&
    key &&
    email &&
    phoneNumer &&
    firstName &&
    lastName &&
    personalIdentificationNumber &&
    dateOfBirth &&
    gender &&
    placeOfBirth &&
    address &&
    city &&
    zipCode &&
    voivodeship
  ) {
    try {
      res.send(
        await addPatient(
          organizationName,
          userName,
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
          voivodeship
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});
