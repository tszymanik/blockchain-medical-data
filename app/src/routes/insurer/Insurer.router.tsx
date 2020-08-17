import Header from 'components/header/Header';
import { UserContext } from 'contexts';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import InsurerRoute from './Insurer.route';
import DoctorsRoute from './routes/doctors/Doctors.route';
import HospitalsRoute from './routes/hospitals/Hospitals.route';
import PatientsRoute from './routes/patients/Patients.route';
import ReportsRoute from './routes/reports/Reports.route';

class InsurerRouter extends Component {
  static contextType = UserContext;

  render() {
    if (!this.context.userName) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <Header userName={this.context.userName} organizationName="Ubezpieczyciel" />
        <Switch>
          <Route exact path="/insurer" component={InsurerRoute} />
          <Route path="/insurer/doctors" component={DoctorsRoute} />
          <Route path="/insurer/hospitals" component={HospitalsRoute} />
          <Route path="/insurer/patients" component={PatientsRoute} />
          <Route path="/insurer/reports" component={ReportsRoute} />
        </Switch>
      </>
    );
  }
}

export default InsurerRouter;
