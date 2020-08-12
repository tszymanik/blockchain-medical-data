import { Router } from 'express';
import { addDoctor, getDoctor, getDoctors } from '../models/Doctor';

export const doctorController = Router();

doctorController.get('/', async (req, res, next) => {
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
          await getDoctors(organizationName, userName, startKey, endKey)
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

doctorController.get('/:key', async (req, res, next) => {
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
      res.send((await getDoctor(organizationName, userName, key)).toString());
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

doctorController.post('/', async (req, res, next) => {
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
    placeOfBirth
  ) {
    try {
      res.send(
        await addDoctor(
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
          placeOfBirth
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
