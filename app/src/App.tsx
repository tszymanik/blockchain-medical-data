import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import styles from './App.module.scss';
import HomeRoute from './routes/home/Home.route';
import InsurerRouter from './routes/insurer/Insurer.router';
import UniversityRouter from './routes/university/University.router';
import { UserContext } from 'contexts';

type State = {
  userName: string;
  setUserName: (userName: string) => void;
};

class App extends Component<any, State> {
  state: State = {
    userName: 'user1',
    setUserName: (userName: string) => this.setState({ userName }),
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <Router>
          <div>
            <Switch>
              <Route path="/insurer" component={InsurerRouter} />
              <Route path="/university" component={UniversityRouter} />
              <Route exact path="/" component={HomeRoute} />
            </Switch>
          </div>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
