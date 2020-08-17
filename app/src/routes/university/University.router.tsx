import Header from 'components/header/Header';
import { UserContext } from 'contexts';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import UniversityRoute from './University.route';
import PatientsRoute from './routes/patients/Patients.route';
import ReportsRoute from './routes/reports/Reports.route';

class UniversityRouter extends Component {
  static contextType = UserContext;

  render() {
    if (!this.context.userName) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <Header userName={this.context.userName} organizationName="Uniwersytet" />
        <Switch>
          <Route exact path="/university" component={UniversityRoute} />
          <Route path="/university/patients" component={PatientsRoute} />
          <Route path="/university/reports" component={ReportsRoute} />
        </Switch>
      </>
    );
  }
}

export default UniversityRouter;
