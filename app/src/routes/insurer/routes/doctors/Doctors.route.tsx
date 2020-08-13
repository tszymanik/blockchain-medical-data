import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Doctor, DoctorData } from 'types/doctor/Doctor.types';
import styles from './Doctors.module.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';

type State = {
  doctors: DoctorData[];
  modalShown: boolean;
  newDoctor: { [key: string]: string } & Doctor;
};

class DoctorsRoute extends Component<any, State> {
  state: State = {
    doctors: [],
    modalShown: false,
    newDoctor: {
      email: '',
      phoneNumer: '',
      firstName: '',
      lastName: '',
      personalIdentificationNumber: '',
      dateOfBirth: '',
      gender: '',
      hospitalKey: '',
    },
  };

  async componentDidMount() {
    const doctors: DoctorData[] = (
      await axios.get('/doctors', {
        params: {
          organizationName: 'org1',
          userName: 'user1',
          startKey: 'DOCTOR_0',
          endKey: 'DOCTOR_999',
        },
      })
    ).data;
    console.log(doctors);

    this.setState({
      doctors,
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
    const newDoctor = cloneDeep(this.state.newDoctor);
    newDoctor[formElement] = e.target.value;

    this.setState({ newDoctor });
  };

  onSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const { doctors, newDoctor } = this.state;

    const data = {
      organizationName: 'org1',
      userName: 'user1',
      key: doctors.length,
      email: newDoctor.email,
      phoneNumer: newDoctor.phoneNumer,
      firstName: newDoctor.firstName,
      lastName: newDoctor.lastName,
      personalIdentificationNumber: newDoctor.personalIdentificationNumber,
      dateOfBirth: moment(newDoctor.dateOfBirth).toDate(),
      gender: newDoctor.gender,
      hospitalKey: newDoctor.hospitalKey,
    };

    await axios.post('/doctors', data);

    console.log(this.state.newDoctor);
  };

  render() {
    const { doctors, modalShown, newDoctor } = this.state;

    return (
      <>
        <div className="container">
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
          <div className="row">
            <div className="col-lg-auto d-flex">
              <ul className={styles.nav}>
                <li className={styles.navItem}>
                  <Link to="/insurer/doctors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className={styles.navIcon}
                    >
                      <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zM104 424c0 13.3 10.7 24 24 24s24-10.7 24-24-10.7-24-24-24-24 10.7-24 24zm216-135.4v49c36.5 7.4 64 39.8 64 78.4v41.7c0 7.6-5.4 14.2-12.9 15.7l-32.2 6.4c-4.3.9-8.5-1.9-9.4-6.3l-3.1-15.7c-.9-4.3 1.9-8.6 6.3-9.4l19.3-3.9V416c0-62.8-96-65.1-96 1.9v26.7l19.3 3.9c4.3.9 7.1 5.1 6.3 9.4l-3.1 15.7c-.9 4.3-5.1 7.1-9.4 6.3l-31.2-4.2c-7.9-1.1-13.8-7.8-13.8-15.9V416c0-38.6 27.5-70.9 64-78.4v-45.2c-2.2.7-4.4 1.1-6.6 1.9-18 6.3-37.3 9.8-57.4 9.8s-39.4-3.5-57.4-9.8c-7.4-2.6-14.9-4.2-22.6-5.2v81.6c23.1 6.9 40 28.1 40 53.4 0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.3 16.9-46.5 40-53.4v-80.4C48.5 301 0 355.8 0 422.4v44.8C0 491.9 20.1 512 44.8 512h358.4c24.7 0 44.8-20.1 44.8-44.8v-44.8c0-72-56.8-130.3-128-133.8z" />
                    </svg>
                    Lekarze
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/insurer/hospitals">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className={styles.navIcon}
                    >
                      <path d="M448 492v20H0v-20c0-6.627 5.373-12 12-12h20V120c0-13.255 10.745-24 24-24h88V24c0-13.255 10.745-24 24-24h112c13.255 0 24 10.745 24 24v72h88c13.255 0 24 10.745 24 24v360h20c6.627 0 12 5.373 12 12zM308 192h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12zm-168 64h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12zm104 128h-40c-6.627 0-12 5.373-12 12v84h64v-84c0-6.627-5.373-12-12-12zm64-96h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12zm-116 12c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40zM182 96h26v26a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V96h26a6 6 0 0 0 6-6V70a6 6 0 0 0-6-6h-26V38a6 6 0 0 0-6-6h-20a6 6 0 0 0-6 6v26h-26a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6z" />
                    </svg>
                    Szpitale
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/insurer/patients">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className={styles.navIcon}
                    >
                      <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
                    </svg>
                    Pacjenci
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/insurer/reports">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className={styles.navIcon}
                    >
                      <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
                    </svg>
                    Raporty
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-10">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Klucz</th>
                      <th>Email</th>
                      <th>Imię</th>
                      <th>Nazwisko</th>
                      <th>Numer telefonu</th>
                      <th>PESEL</th>
                      <th>Data urodzenia</th>
                      <th>Płeć</th>
                      <th>Szpital</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.Key}>
                        <td>{doctor.Key}</td>
                        <td>{doctor.Record.email}</td>
                        <td>{doctor.Record.firstName}</td>
                        <td>{doctor.Record.lastName}</td>
                        <td>{doctor.Record.phoneNumer}</td>
                        <td>{doctor.Record.personalIdentificationNumber}</td>
                        <td>
                          {moment(doctor.Record.dateOfBirth).format(
                            'DD.MM.YYYY'
                          )}
                        </td>
                        <td>{doctor.Record.gender}</td>
                        <td>{doctor.Record.hospitalKey}</td>
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
              <Modal.Title>Dodaj lekarza</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={newDoctor.email}
                  onChange={this.onChange('email')}
                />
              </Form.Group>
              <Form.Group controlId="firstName">
                <Form.Label>Imię</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Imię"
                  value={newDoctor.firstName}
                  onChange={this.onChange('firstName')}
                />
              </Form.Group>
              <Form.Group controlId="lastName">
                <Form.Label>Nazwisko</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nazwisko"
                  value={newDoctor.lastName}
                  onChange={this.onChange('lastName')}
                />
              </Form.Group>
              <Form.Group controlId="phoneNumer">
                <Form.Label>Numer telefonu</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Numer telefonu"
                  value={newDoctor.phoneNumer}
                  onChange={this.onChange('phoneNumer')}
                />
              </Form.Group>
              <Form.Group controlId="personalIdentificationNumber">
                <Form.Label>PESEL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="PESEL"
                  value={newDoctor.personalIdentificationNumber}
                  onChange={this.onChange('personalIdentificationNumber')}
                />
              </Form.Group>
              <Form.Group controlId="dateOfBirth">
                <Form.Label>Data urodzenia</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Data urodzenia"
                  value={newDoctor.dateOfBirth}
                  onChange={this.onChange('dateOfBirth')}
                />
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.Label>Płeć</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Płeć"
                  value={newDoctor.gender}
                  onChange={this.onChange('gender')}
                />
              </Form.Group>
              <Form.Group controlId="hospitalKey">
                <Form.Label>Szpital</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Szpital"
                  value={newDoctor.hospitalKey}
                  onChange={this.onChange('hospitalKey')}
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

export default DoctorsRoute;
