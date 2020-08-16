import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DoctorData } from 'types/doctor/Doctor.types';
import DoctorsRoute from './routes/doctors/Doctors.route';
import Header from 'components/header/Header';
import InsurerRoute from './Insurer.route';
import HospitalsRoute from './routes/hospitals/Hospitals.route';
import { UserContext } from 'contexts';

class InsurerRouter extends Component {
  static contextType = UserContext;

  render() {
    if (!this.context.user) {
      return <Redirect to="/" />
    }

    return (
      <>
        <Header organizationName="Ubezpieczyciel" />
        <Switch>
          <Route exact path="/insurer" component={InsurerRoute} />
          <Route path="/insurer/doctors" component={DoctorsRoute} />
          <Route path="/insurer/hospitals" component={HospitalsRoute} />
        </Switch>
      </>
    );
  }
}

export default InsurerRouter;
