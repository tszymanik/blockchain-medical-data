import React, { Component, ChangeEvent } from 'react';
import styles from './Home.module.scss';
import Header from '../../components/header/Header';

const organizations = [
  {
    label: 'Ubezpieczyciel',
    value: 'org1',
  },
  {
    label: 'Uniwersytet',
    value: 'org2',
  },
];

type State = {
  value: string;
};

class HomeRoute extends Component<any, State> {
  state: State = {
    value: '',
  };

  handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ value: e.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.state.value === 'org1') {
      this.props.history.push('/insurer');
    } else if (this.state.value === 'org2') {
      this.props.history.push('/university');
    }
  };

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className={['jumbotron', styles.root].join(' ')}>
            <Header isCentered />
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="organizationSelect">Organizacja</label>
                <select
                  value={this.state.value}
                  onChange={this.handleChange}
                  className="form-control"
                  id="organizationSelect"
                >
                  <option key="" value=""></option>
                  {organizations.map((organization) => (
                    <option key={organization.value} value={organization.value}>
                      {organization.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Zaloguj się
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeRoute;
