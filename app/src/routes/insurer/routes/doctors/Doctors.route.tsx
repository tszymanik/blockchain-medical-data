import React, { Component } from 'react';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Doctor, DoctorData } from 'types/doctor/Doctor.types';
import styles from './Doctors.module.scss';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import moment from 'moment';
import Nav from 'components/nav/Nav';
import { UserContext } from 'contexts';

type State = {
  doctors: DoctorData[];
  clickedDoctorKey: string;
  addDoctorModalShown: boolean;
  addDoctorForm: { [key: string]: string } & Doctor;
  editHospitalModalShown: boolean;
  editHospitalForm: {
    [key: string]: string
    hospitalKey: string;
  };
};

class DoctorsRoute extends Component<any, State> {
  static contextType = UserContext;

  tableInstance: HTMLTableSectionElement | null = null;
  state: State = {
    doctors: [],
    clickedDoctorKey: '',
    addDoctorModalShown: false,
    addDoctorForm: {
      email: '',
      phoneNumer: '',
      firstName: '',
      lastName: '',
      personalIdentificationNumber: '',
      dateOfBirth: '',
      gender: '',
      hospitalKey: '',
    },
    editHospitalModalShown: false,
    editHospitalForm: {
      key: '',
      hospitalKey: '',
    },
  };

  onWindowClick = (e: MouseEvent) => {
    if (this.tableInstance?.contains(e.target as Node)) {
      return false;
    }

    this.setState({ clickedDoctorKey: '' });
  };

  async componentDidMount() {
    document.addEventListener('click', this.onWindowClick);

    const doctors: DoctorData[] = (
      await axios.get('/doctors', {
        params: {
          organizationName: 'org1',
          userName: this.context.user,
          startKey: 'DOCTOR_0',
          endKey: 'DOCTOR_999',
        },
      })
    ).data;

    const addDoctorForm = cloneDeep(this.state.addDoctorForm);
    addDoctorForm.key = `DOCTOR_${doctors.length}`;

    this.setState({
      doctors,
      addDoctorForm,
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onWindowClick);
  }

  onHideModal = () => {
    this.setState({ addDoctorModalShown: false });
  };

  onChangeAddDoctorForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const addDoctorForm = cloneDeep(this.state.addDoctorForm);
    addDoctorForm[formElement] = e.target.value;

    this.setState({ addDoctorForm });
  };

  onChangeEditHospitalForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const editHospitalForm = cloneDeep(this.state.editHospitalForm);
    editHospitalForm[formElement] = e.target.value;

    this.setState({ editHospitalForm });
  };

  onSubmitAddDoctorForm = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      const { addDoctorForm } = this.state;

      const data = {
        organizationName: 'org1',
        userName: 'user1',
        key: addDoctorForm.key,
        email: addDoctorForm.email,
        phoneNumer: addDoctorForm.phoneNumer,
        firstName: addDoctorForm.firstName,
        lastName: addDoctorForm.lastName,
        personalIdentificationNumber:
          addDoctorForm.personalIdentificationNumber,
        dateOfBirth: moment(addDoctorForm.dateOfBirth).toDate(),
        gender: addDoctorForm.gender,
        hospitalKey: addDoctorForm.hospitalKey,
      };

      await axios.post('/doctors', data);

      this.onHideModal();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      doctors,
      clickedDoctorKey,
      addDoctorModalShown,
      addDoctorForm,
      editHospitalModalShown,
      editHospitalForm,
    } = this.state;

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
                  className="mr-3"
                  onClick={() => this.setState({ addDoctorModalShown: true })}
                >
                  Dodaj lekarza
                </Button>
                <Button
                  variant="primary"
                  disabled={clickedDoctorKey === ''}
                  onClick={() => {
                    const newEditHospitalForm = cloneDeep(editHospitalForm);
                    newEditHospitalForm.key = clickedDoctorKey;
                    const clickedDoctor = doctors.find(doctor => doctor.Key === clickedDoctorKey);

                    if (clickedDoctor) newEditHospitalForm.hospitalKey = clickedDoctor.Record.hospitalKey;
                  
                    this.setState({
                      editHospitalModalShown: true,
                      editHospitalForm: newEditHospitalForm,
                    });
                  }}
                >
                  Zmień szpital
                </Button>
              </div>
              <Table responsive>
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
                <tbody
                  ref={(instance: HTMLTableSectionElement) =>
                    (this.tableInstance = instance)
                  }
                >
                  {doctors.map((doctor) => {
                    const rowStyles = [styles.row];

                    if (doctor.Key === clickedDoctorKey) {
                      rowStyles.push(styles.clicked);
                    }

                    return (
                      <tr
                        key={doctor.Key}
                        className={rowStyles.join(' ')}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ clickedDoctorKey: doctor.Key });
                        }}
                      >
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
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        {editHospitalModalShown && (
          <Modal
            show={true}
            onHide={this.onHideModal}
            animation={false}
            size="lg"
          >
            <Form onSubmit={this.onSubmitAddDoctorForm}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Zmień szpital dla lekarza {editHospitalForm.key}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="hospitalKey">
                  <Form.Label>Szpital</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Szpital"
                    value={editHospitalForm.hospitalKey}
                    onChange={this.onChangeEditHospitalForm('hospitalKey')}
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
        )}

        {addDoctorModalShown && (
          <Modal
            show={true}
            onHide={this.onHideModal}
            animation={false}
            size="lg"
          >
            <Form onSubmit={this.onSubmitAddDoctorForm}>
              <Modal.Header closeButton>
                <Modal.Title>Dodaj lekarza</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="key">
                  <Form.Label>Klucz</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Klucz"
                    value={addDoctorForm.key}
                    onChange={this.onChangeAddDoctorForm('key')}
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={addDoctorForm.email}
                    onChange={this.onChangeAddDoctorForm('email')}
                  />
                </Form.Group>
                <Form.Group controlId="firstName">
                  <Form.Label>Imię</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Imię"
                    value={addDoctorForm.firstName}
                    onChange={this.onChangeAddDoctorForm('firstName')}
                  />
                </Form.Group>
                <Form.Group controlId="lastName">
                  <Form.Label>Nazwisko</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nazwisko"
                    value={addDoctorForm.lastName}
                    onChange={this.onChangeAddDoctorForm('lastName')}
                  />
                </Form.Group>
                <Form.Group controlId="phoneNumer">
                  <Form.Label>Numer telefonu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Numer telefonu"
                    value={addDoctorForm.phoneNumer}
                    onChange={this.onChangeAddDoctorForm('phoneNumer')}
                  />
                </Form.Group>
                <Form.Group controlId="personalIdentificationNumber">
                  <Form.Label>PESEL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="PESEL"
                    value={addDoctorForm.personalIdentificationNumber}
                    onChange={this.onChangeAddDoctorForm('personalIdentificationNumber')}
                  />
                </Form.Group>
                <Form.Group controlId="dateOfBirth">
                  <Form.Label>Data urodzenia</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Data urodzenia"
                    value={addDoctorForm.dateOfBirth}
                    onChange={this.onChangeAddDoctorForm('dateOfBirth')}
                  />
                </Form.Group>
                <Form.Group controlId="gender">
                  <Form.Label>Płeć</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Płeć"
                    value={addDoctorForm.gender}
                    onChange={this.onChangeAddDoctorForm('gender')}
                  />
                </Form.Group>
                <Form.Group controlId="hospitalKey">
                  <Form.Label>Szpital</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Szpital"
                    value={addDoctorForm.hospitalKey}
                    onChange={this.onChangeAddDoctorForm('hospitalKey')}
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
        )}
      </>
    );
  }
}

export default DoctorsRoute;
