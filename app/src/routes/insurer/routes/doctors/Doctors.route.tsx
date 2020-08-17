import axios from 'axios';
import Nav from 'components/nav/InsurerNav';
import { UserContext } from 'contexts';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';
import { FormElement, formElement, validate } from 'shared';
import { DoctorData } from 'types/doctor/Doctor.types';
import styles from './Doctors.module.scss';

type State = {
  doctorsData: DoctorData[];
  clickedDoctorKey: string;
  addDoctorModalShown: boolean;
  addDoctorForm: {
    [key: string]: FormElement;
    email: FormElement;
    phoneNumer: FormElement;
    firstName: FormElement;
    lastName: FormElement;
    personalIdentificationNumber: FormElement;
    dateOfBirth: FormElement;
    gender: FormElement;
    hospitalKey: FormElement;
  };
  isAddDoctorFormValid: boolean;
  isAddDoctorFormSubmitted: boolean;
  editHospitalModalShown: boolean;
  editHospitalForm: {
    [key: string]: FormElement;
    hospitalKey: FormElement;
  };
  isEditHospitalFormValid: boolean;
  isEditHospitalFormSubmitted: boolean;
};

class DoctorsRoute extends Component<any, State> {
  static contextType = UserContext;

  tableInstance: HTMLTableSectionElement | null = null;
  state: State = {
    doctorsData: [],
    clickedDoctorKey: '',
    addDoctorModalShown: false,
    addDoctorForm: {
      key: { ...formElement },
      email: { ...formElement },
      phoneNumer: { ...formElement },
      firstName: { ...formElement },
      lastName: { ...formElement },
      personalIdentificationNumber: { ...formElement },
      dateOfBirth: { ...formElement },
      gender: { ...formElement },
      hospitalKey: { ...formElement },
    },
    isAddDoctorFormValid: false,
    isAddDoctorFormSubmitted: false,
    editHospitalModalShown: false,
    editHospitalForm: {
      key: { ...formElement },
      hospitalKey: { ...formElement },
    },
    isEditHospitalFormValid: false,
    isEditHospitalFormSubmitted: false,
  };

  async componentDidMount() {
    document.addEventListener('click', this.onWindowClick);

    await this.fetchData();
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = (e: MouseEvent) => {
    if (this.tableInstance?.contains(e.target as Node)) {
      return false;
    }

    this.setState({ clickedDoctorKey: '' });
  };

  fetchData = async () => {
    const doctorsData: DoctorData[] = (
      await axios.get('/doctors', {
        params: {
          organizationName: process.env.REACT_APP_INSURER_ORG,
          userName: this.context.userName,
          startKey: 'DOCTOR_0',
          endKey: 'DOCTOR_999',
        },
      })
    ).data;

    const addDoctorForm = cloneDeep(this.state.addDoctorForm);
    addDoctorForm.key.value = `DOCTOR_${doctorsData.length}`;
    addDoctorForm.key.isValid = true;

    this.setState({
      doctorsData,
      addDoctorForm,
    });
  };

  onHideAddDoctorModal = () => this.setState({ addDoctorModalShown: false });

  onHideEditHospitalModal = () =>
    this.setState({ editHospitalModalShown: false });

  onChangeAddDoctorForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const addDoctorForm = cloneDeep(this.state.addDoctorForm);
    addDoctorForm[formElement].value = e.target.value;
    addDoctorForm[formElement].isValid = validate(e.target.value);

    let isFormValid = true;

    Object.keys(addDoctorForm).forEach((key) => {
      isFormValid = addDoctorForm[key].isValid && isFormValid;
    });

    this.setState({
      addDoctorForm,
      isAddDoctorFormValid: isFormValid,
    });
  };

  onChangeEditHospitalForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const editHospitalForm = cloneDeep(this.state.editHospitalForm);
    editHospitalForm[formElement].value = e.target.value;
    editHospitalForm[formElement].isValid = validate(e.target.value);

    let isFormValid = true;

    Object.keys(editHospitalForm).forEach((key) => {
      isFormValid = editHospitalForm[key].isValid && isFormValid;
    });

    this.setState({
      editHospitalForm,
      isEditHospitalFormValid: isFormValid,
    });
  };

  onSubmitAddDoctorForm = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({ isAddDoctorFormSubmitted: true });

    try {
      const { addDoctorForm } = this.state;

      const data = {
        organizationName: process.env.REACT_APP_INSURER_ORG,
        userName: this.context.userName,
        key: addDoctorForm.key.value,
        email: addDoctorForm.email.value,
        phoneNumer: addDoctorForm.phoneNumer.value,
        firstName: addDoctorForm.firstName.value,
        lastName: addDoctorForm.lastName.value,
        personalIdentificationNumber:
          addDoctorForm.personalIdentificationNumber.value,
        dateOfBirth: moment(addDoctorForm.dateOfBirth.value).toString(),
        gender: addDoctorForm.gender.value,
        hospitalKey: addDoctorForm.hospitalKey.value,
      };

      await axios.post('/doctors', data);

      const newAddDoctorForm = cloneDeep(addDoctorForm);
      Object.keys(newAddDoctorForm).forEach((key) => {
        newAddDoctorForm[key].value = '';
        newAddDoctorForm[key].isValid = false;
      });

      await this.fetchData();

      this.setState({
        addDoctorForm: newAddDoctorForm,
        isAddDoctorFormSubmitted: false,
      });

      this.onHideAddDoctorModal();
    } catch (error) {
      console.log(error);
    }
  };

  onSubmitEditHospitalForm = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({ isEditHospitalFormSubmitted: true });

    try {
      const { editHospitalForm } = this.state;

      const data = {
        organizationName: process.env.REACT_APP_INSURER_ORG,
        userName: this.context.userName,
        key: editHospitalForm.key.value,
        hospitalKey: editHospitalForm.hospitalKey.value,
      };

      await axios.patch('/doctors', data);

      const newEditHospitalForm = cloneDeep(editHospitalForm);
      Object.keys(newEditHospitalForm).forEach((key) => {
        newEditHospitalForm[key].value = '';
        newEditHospitalForm[key].isValid = false;
      });

      await this.fetchData();

      this.setState({
        editHospitalForm: newEditHospitalForm,
        isEditHospitalFormSubmitted: false,
      });

      this.onHideEditHospitalModal();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      doctorsData,
      clickedDoctorKey,
      addDoctorModalShown,
      addDoctorForm,
      isAddDoctorFormValid,
      isAddDoctorFormSubmitted,
      editHospitalModalShown,
      editHospitalForm,
      isEditHospitalFormValid,
      isEditHospitalFormSubmitted,
    } = this.state;

    return (
      <>
        <Container>
          <Row>
            <Col md={3} lg={2} className="d-flex">
              <Nav />
            </Col>
            <Col md={9} lg={10}>
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
                    newEditHospitalForm.key.value = clickedDoctorKey;
                    newEditHospitalForm.key.isValid = true;
                    const clickedDoctor = doctorsData.find(
                      (doctorData) => doctorData.Key === clickedDoctorKey
                    );

                    if (clickedDoctor) {
                      newEditHospitalForm.hospitalKey.value =
                        clickedDoctor.Record.hospitalKey;
                      newEditHospitalForm.hospitalKey.isValid = true;
                    }

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
                  {doctorsData.map((doctorData) => {
                    const rowStyles = [styles.row];

                    if (doctorData.Key === clickedDoctorKey) {
                      rowStyles.push(styles.clicked);
                    }

                    return (
                      <tr
                        key={doctorData.Key}
                        className={rowStyles.join(' ')}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ clickedDoctorKey: doctorData.Key });
                        }}
                      >
                        <td>{doctorData.Key}</td>
                        <td>{doctorData.Record.email}</td>
                        <td>{doctorData.Record.firstName}</td>
                        <td>{doctorData.Record.lastName}</td>
                        <td>{doctorData.Record.phoneNumer}</td>
                        <td>
                          {doctorData.Record.personalIdentificationNumber}
                        </td>
                        <td>
                          {moment(doctorData.Record.dateOfBirth).format(
                            'DD.MM.YYYY'
                          )}
                        </td>
                        <td>{doctorData.Record.gender}</td>
                        <td>{doctorData.Record.hospitalKey}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>

        {addDoctorModalShown && (
          <Modal
            show={true}
            onHide={this.onHideAddDoctorModal}
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
                    value={addDoctorForm.key.value}
                    onChange={this.onChangeAddDoctorForm('key')}
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={addDoctorForm.email.value}
                    onChange={this.onChangeAddDoctorForm('email')}
                  />
                </Form.Group>
                <Form.Group controlId="firstName">
                  <Form.Label>Imię</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Imię"
                    value={addDoctorForm.firstName.value}
                    onChange={this.onChangeAddDoctorForm('firstName')}
                  />
                </Form.Group>
                <Form.Group controlId="lastName">
                  <Form.Label>Nazwisko</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nazwisko"
                    value={addDoctorForm.lastName.value}
                    onChange={this.onChangeAddDoctorForm('lastName')}
                  />
                </Form.Group>
                <Form.Group controlId="phoneNumer">
                  <Form.Label>Numer telefonu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Numer telefonu"
                    value={addDoctorForm.phoneNumer.value}
                    onChange={this.onChangeAddDoctorForm('phoneNumer')}
                  />
                </Form.Group>
                <Form.Group controlId="personalIdentificationNumber">
                  <Form.Label>PESEL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="PESEL"
                    value={addDoctorForm.personalIdentificationNumber.value}
                    onChange={this.onChangeAddDoctorForm(
                      'personalIdentificationNumber'
                    )}
                  />
                </Form.Group>
                <Form.Group controlId="dateOfBirth">
                  <Form.Label>Data urodzenia</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Data urodzenia"
                    value={addDoctorForm.dateOfBirth.value}
                    onChange={this.onChangeAddDoctorForm('dateOfBirth')}
                  />
                </Form.Group>
                <Form.Group controlId="gender">
                  <Form.Label>Płeć</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Płeć"
                    value={addDoctorForm.gender.value}
                    onChange={this.onChangeAddDoctorForm('gender')}
                  />
                </Form.Group>
                <Form.Group controlId="hospitalKey">
                  <Form.Label>Szpital</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Szpital"
                    value={addDoctorForm.hospitalKey.value}
                    onChange={this.onChangeAddDoctorForm('hospitalKey')}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.onHideAddDoctorModal}>
                  Anuluj
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isAddDoctorFormSubmitted || !isAddDoctorFormValid}
                >
                  Wyślij
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}

        {editHospitalModalShown && (
          <Modal
            show={true}
            onHide={this.onHideEditHospitalModal}
            animation={false}
            size="lg"
          >
            <Form onSubmit={this.onSubmitEditHospitalForm}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Zmień szpital dla lekarza {editHospitalForm.key.value}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="hospitalKey">
                  <Form.Label>Szpital</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Szpital"
                    value={editHospitalForm.hospitalKey.value}
                    onChange={this.onChangeEditHospitalForm('hospitalKey')}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.onHideEditHospitalModal}
                >
                  Anuluj
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    isEditHospitalFormSubmitted || !isEditHospitalFormValid
                  }
                >
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
