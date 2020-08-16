import React, { Component } from 'react';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Hospital, HospitalData } from 'types/hospital/Hospital.types';
import styles from './Doctors.module.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';
import Nav from 'components/nav/Nav';
import { UserContext } from 'contexts';

type State = {
  hospitals: HospitalData[];
  modalShown: boolean;
  newHospital: { [key: string]: string } & Hospital;
};

class HospitalsRoute extends Component<any, State> {
  static contextType = UserContext;

  state: State = {
    hospitals: [],
    modalShown: false,
    newHospital: {
      name: '',
      city: '',
    },
  };

  async componentDidMount() {
    const hospitals: HospitalData[] = (
      await axios.get('/hospitals', {
        params: {
          organizationName: 'org1',
          userName: 'user1',
          startKey: 'HOSPITAL_0',
          endKey: 'HOSPITAL_999',
        },
      })
    ).data;

    const newHospital = cloneDeep(this.state.newHospital);
    newHospital.key = `HOSPITAL_${hospitals.length}`;

    this.setState({
      hospitals,
      newHospital,
    });
  }

  onHideModal = () => {
    this.setState({
      modalShown: false,
    });
  };

  onChange = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newHospital = cloneDeep(this.state.newHospital);
    newHospital[formElement] = e.target.value;

    this.setState({ newHospital });
  };

  onSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      const { newHospital } = this.state;

      const data = {
        organizationName: 'org1',
        userName: 'user1',
        key: newHospital.key,
        name: newHospital.name,
        city: newHospital.city,
      };

      await axios.post('/hospitals', data);

      this.onHideModal();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { hospitals, modalShown, newHospital } = this.state;

    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-lg-auto d-flex">
              <Nav />
            </div>
            <div className="col-lg-10">
              <div className="text-right mb-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    this.setState({
                      modalShown: true,
                    });
                  }}
                >
                  Dodaj
                </Button>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Klucz</th>
                      <th>Nazwa</th>
                      <th>Miasto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((hospital) => (
                      <tr key={hospital.Key}>
                        <td>{hospital.Key}</td>
                        <td>{hospital.Record.name}</td>
                        <td>{hospital.Record.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={modalShown}
          onHide={this.onHideModal}
          animation={false}
          size="lg"
        >
          <Form onSubmit={this.onSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Dodaj szpital</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="key">
                <Form.Label>Klucz</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Klucz"
                  value={newHospital.key}
                  onChange={this.onChange('key')}
                />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Nazwa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nazwa"
                  value={newHospital.name}
                  onChange={this.onChange('name')}
                />
              </Form.Group>
              <Form.Group controlId="firstName">
                <Form.Label>Miasto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Miasto"
                  value={newHospital.city}
                  onChange={this.onChange('city')}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.onHideModal}>
                Anuluj
              </Button>
              <Button variant="primary" type="submit">
                Wyślij
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}

export default HospitalsRoute;
