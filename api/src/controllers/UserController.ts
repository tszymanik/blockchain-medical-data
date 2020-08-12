import { Router } from 'express';
import { addUser } from '../models/User';

export const userController = Router();

userController.post('/', async (req, res, next) => {
  const { organizationName, userName } = req.body;

  if (organizationName && userName) {
    try {
      res.send(await addUser(organizationName, userName));
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});
