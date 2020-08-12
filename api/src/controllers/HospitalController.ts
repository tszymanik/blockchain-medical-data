import { Router } from 'express';
import { getHospitals, getHospital, addHospital } from '../models/Hospital';

export const hospitalController = Router();

hospitalController.get('/', async (req, res, next) => {
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
          await getHospitals(organizationName, userName, startKey, endKey)
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

hospitalController.get('/:key', async (req, res, next) => {
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
      res.send((await getHospital(organizationName, userName, key)).toString());
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

hospitalController.post('/', async (req, res, next) => {
  const { organizationName, userName, key, name, city } = req.body;

  if (organizationName && userName && key && name && city) {
    try {
      res.send(await addHospital(organizationName, userName, key, name, city));
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});
