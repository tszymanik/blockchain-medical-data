import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styles from './App.module.scss';
import HomeRoute from './routes/home/Home.route';
import InsurerRouter from './routes/insurer/Insurer.router';
import UniversityRoute from './routes/university/University.route';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/insurer" component={InsurerRouter} />
          <Route path="/university" component={UniversityRoute} />
          <Route exact path="/" component={HomeRoute} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
