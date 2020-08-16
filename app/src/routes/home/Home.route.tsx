import React, { Component, ChangeEvent } from 'react';
import styles from './Home.module.scss';
import Header from '../../components/header/Header';
import { Button, Jumbotron, Form } from 'react-bootstrap';
import { UserContext } from 'contexts';

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
  organization: string;
  user: string;
};

class HomeRoute extends Component<any, State> {
  state: State = {
    organization: '',
    user: '',
  };

  onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ organization: e.target.value });
  };

  render() {
    return (
      <UserContext.Consumer>
        {({ user, setUser }) => (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Jumbotron className={styles.root}>
                <Header isCentered />
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const { organization } = this.state;

                    setUser(this.state.user);

                    if (organization === 'org1') {
                      this.props.history.push('/insurer');
                    } else if (organization === 'org2') {
                      this.props.history.push('/university');
                    }
                  }}
                >
                  <Form.Group controlId="organization">
                    <Form.Label>Organizacja</Form.Label>
                    <Form.Control
                      as="select"
                      placeholder="Organizacja"
                      onChange={(e) =>
                        this.setState({ organization: e.target.value })
                      }
                    >
                      <option key="" value=""></option>
                      {organizations.map((organization) => (
                        <option
                          key={organization.value}
                          value={organization.value}
                        >
                          {organization.label}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="user">
                    <Form.Label>Użytkownik</Form.Label>
                    <Form.Control
                      placeholder="Użytkownik"
                      onChange={(e) => this.setState({ user: e.target.value })}
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button variant="primary" type="submit">
                      Zaloguj się
                    </Button>
                  </div>
                </Form>
              </Jumbotron>
            </div>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}

export default HomeRoute;
