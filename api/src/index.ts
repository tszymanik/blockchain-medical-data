import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { doctorController } from './controllers/DoctorController';
import { hospitalController } from './controllers/HospitalController';
import { patientController } from './controllers/PatientController';
import { reportController } from './controllers/ReportController';
import { userController } from './controllers/UserController';

const app = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.use('/doctors', doctorController);
app.use('/hospitals', hospitalController);
app.use('/patients', patientController);
app.use('/reports', reportController);
app.use('/users', userController);
app.use((req, res, next) => res.sendStatus(404));

app.listen(process.env.API_PORT, () => {
  console.log(`App listening at http://localhost:${process.env.API_PORT}`);
});
