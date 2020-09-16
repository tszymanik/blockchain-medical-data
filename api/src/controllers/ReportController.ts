import { Router } from 'express';
import {
  addReport,
  getReport,
  getAnonymizedReport,
  getReports,
  getAnonymizedReports,
} from '../models/Report';

export const reportController = Router();

reportController.get('/', async (req, res, next) => {
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
          await getReports(organizationName, userName, startKey, endKey)
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

reportController.get('/:key', async (req, res, next) => {
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
      res.send((await getReport(organizationName, userName, key)).toString());
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

reportController.post('/', async (req, res, next) => {
  const {
    organizationName,
    userName,
    key,
    hospitalKey,
    doctorKey,
    patientKey,
    content,
  } = req.body;

  if (
    organizationName &&
    userName &&
    key &&
    hospitalKey &&
    doctorKey &&
    patientKey &&
    content
  ) {
    try {
      res.send(
        await addReport(
          organizationName,
          userName,
          key,
          hospitalKey,
          doctorKey,
          patientKey,
          content
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
