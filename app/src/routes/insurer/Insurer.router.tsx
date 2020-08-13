import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DoctorData } from 'types/doctor/Doctor.types';
import DoctorsRoute from './routes/doctors/Doctors.route';
import Header from 'components/header/Header';

const InsurerRouter = () => (
  <>
    <Header organizationName="Ubezpieczyciel" />
    <Switch>
      {/* <Route exact path="/insurer" /> */}
      <Route path="/insurer/doctors" component={DoctorsRoute} />
    </Switch>
  </>
);

export default InsurerRouter;
