import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import styles from './App.module.scss';
import HomeRoute from './routes/home/Home.route';
import InsurerRouter from './routes/insurer/Insurer.router';
import UniversityRoute from './routes/university/University.route';
import { UserContext } from 'contexts';

type State = {
  user: string;
  setUser: (user: string) => void;
};

class App extends Component<any, State> {
  state: State = {
    user: 'user1',
    setUser: (user: string) => this.setState({ user }),
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <Router>
          <div>
            <Switch>
              <Route path="/insurer" component={InsurerRouter} />
              <Route path="/university" component={UniversityRoute} />
              <Route exact path="/" component={HomeRoute} />
            </Switch>
          </div>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
