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
import { PatientData } from 'types/patient/Patient.types';

type State = {
  patientsData: PatientData[];
  isAddPatientModalShown: boolean;
  addPatientForm: {
    [key: string]: FormElement;
    email: FormElement;
    phoneNumer: FormElement;
    firstName: FormElement;
    lastName: FormElement;
    personalIdentificationNumber: FormElement;
    dateOfBirth: FormElement;
    gender: FormElement;
    placeOfBirth: FormElement;
    address: FormElement;
    city: FormElement;
    zipCode: FormElement;
    voivodeship: FormElement;
  };
  isAddPatientFormValid: boolean;
  isAddPatientFormSubmitted: boolean;
};

class PatientsRoute extends Component<any, State> {
  static contextType = UserContext;

  state: State = {
    patientsData: [],
    isAddPatientModalShown: false,
    addPatientForm: {
      key: { ...formElement },
      email: { ...formElement },
      phoneNumer: { ...formElement },
      firstName: { ...formElement },
      lastName: { ...formElement },
      personalIdentificationNumber: { ...formElement },
      dateOfBirth: { ...formElement },
      gender: { ...formElement },
      placeOfBirth: { ...formElement },
      address: { ...formElement },
      city: { ...formElement },
      zipCode: { ...formElement },
      voivodeship: { ...formElement },
    },
    isAddPatientFormValid: false,
    isAddPatientFormSubmitted: false,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const patientsData: PatientData[] = (
      await axios.get('/patients', {
        params: {
          organizationName: process.env.REACT_APP_INSURER_ORG,
          userName: this.context.userName,
          startKey: 'PATIENT_0',
          endKey: 'PATIENT_999',
        },
      })
    ).data;

    const addPatientForm = cloneDeep(this.state.addPatientForm);
    addPatientForm.key.value = `PATIENT_${patientsData.length}`;
    addPatientForm.key.isValid = true;

    this.setState({
      patientsData,
      addPatientForm,
    });
  };

  onHideAddPatientModal = () =>
    this.setState({ isAddPatientModalShown: false });

  onChangeAddPatientForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const addPatientForm = cloneDeep(this.state.addPatientForm);
    addPatientForm[formElement].value = e.target.value;
    addPatientForm[formElement].isValid = validate(e.target.value);

    let isFormValid = true;

    Object.keys(addPatientForm).forEach((key) => {
      isFormValid = addPatientForm[key].isValid && isFormValid;
    });

    this.setState({
      addPatientForm,
      isAddPatientFormValid: isFormValid,
    });
  };

  onSubmitAddPatientForm = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({ isAddPatientFormSubmitted: true });

    try {
      const { addPatientForm } = this.state;

      const data = {
        organizationName: process.env.REACT_APP_INSURER_ORG,
        userName: this.context.userName,
        key: addPatientForm.key.value,
        email: addPatientForm.email.value,
        phoneNumer: addPatientForm.phoneNumer.value,
        firstName: addPatientForm.firstName.value,
        lastName: addPatientForm.lastName.value,
        personalIdentificationNumber:
          addPatientForm.personalIdentificationNumber.value,
        dateOfBirth: moment(addPatientForm.dateOfBirth.value).toString(),
        gender: addPatientForm.gender.value,
        placeOfBirth: addPatientForm.placeOfBirth.value,
        address: addPatientForm.address.value,
        city: addPatientForm.city.value,
        zipCode: addPatientForm.zipCode.value,
        voivodeship: addPatientForm.voivodeship.value,
      };

      await axios.post('/patients', data);

      const newAddPatientForm = cloneDeep(addPatientForm);

      Object.keys(newAddPatientForm).forEach((key) => {
        addPatientForm[key].value = '';
        addPatientForm[key].isValid = false;
      });

      await this.fetchData();

      this.setState({
        addPatientForm: newAddPatientForm,
        isAddPatientFormSubmitted: false,
      });

      this.onHideAddPatientModal();
    } catch (error) {
      console.log(error);
      this.setState({ isAddPatientFormSubmitted: false });
    }
  };

  render() {
    const {
      patientsData,
      isAddPatientModalShown,
      addPatientForm,
      isAddPatientFormValid,
      isAddPatientFormSubmitted,
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
                  onClick={() =>
                    this.setState({ isAddPatientModalShown: true })
                  }
                >
                  Dodaj pacjenta
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
                    <th>Miejsce urodzenia</th>
                    <th>Adres</th>
                    <th>Miasto</th>
                    <th>Kod pocztowy</th>
                    <th>Województwo</th>
                  </tr>
                </thead>
                <tbody>
                  {patientsData.map((patientData) => (
                    <tr key={patientData.Key}>
                      <td>{patientData.Key}</td>
                      <td>{patientData.Record.email}</td>
                      <td>{patientData.Record.firstName}</td>
                      <td>{patientData.Record.lastName}</td>
                      <td>{patientData.Record.phoneNumer}</td>
                      <td>{patientData.Record.personalIdentificationNumber}</td>
                      <td>
                        {moment(patientData.Record.dateOfBirth).format(
                          'DD.MM.YYYY'
                        )}
                      </td>
                      <td>{patientData.Record.gender}</td>
                      <td>{patientData.Record.placeOfBirth}</td>
                      <td>{patientData.Record.address}</td>
                      <td>{patientData.Record.city}</td>
                      <td>{patientData.Record.zipCode}</td>
                      <td>{patientData.Record.voivodeship}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>

        {isAddPatientModalShown && (
          <Modal
            show={true}
            onHide={this.onHideAddPatientModal}
            animation={false}
            size="lg"
          >
            <Form onSubmit={this.onSubmitAddPatientForm}>
              <Modal.Header closeButton>
                <Modal.Title>Dodaj pacjenta</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="key">
                  <Form.Label>Klucz</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Klucz"
                    value={addPatientForm.key.value}
                    onChange={this.onChangeAddPatientForm('key')}
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={addPatientForm.email.value}
                    onChange={this.onChangeAddPatientForm('email')}
                  />
                </Form.Group>
                <Form.Group controlId="firstName">
                  <Form.Label>Imię</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Imię"
                    value={addPatientForm.firstName.value}
                    onChange={this.onChangeAddPatientForm('firstName')}
                  />
                </Form.Group>
                <Form.Group controlId="lastName">
                  <Form.Label>Nazwisko</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nazwisko"
                    value={addPatientForm.lastName.value}
                    onChange={this.onChangeAddPatientForm('lastName')}
                  />
                </Form.Group>
                <Form.Group controlId="phoneNumer">
                  <Form.Label>Numer telefonu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Numer telefonu"
                    value={addPatientForm.phoneNumer.value}
                    onChange={this.onChangeAddPatientForm('phoneNumer')}
                  />
                </Form.Group>
                <Form.Group controlId="personalIdentificationNumber">
                  <Form.Label>PESEL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="PESEL"
                    value={addPatientForm.personalIdentificationNumber.value}
                    onChange={this.onChangeAddPatientForm(
                      'personalIdentificationNumber'
                    )}
                  />
                </Form.Group>
                <Form.Group controlId="dateOfBirth">
                  <Form.Label>Data urodzenia</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Data urodzenia"
                    value={addPatientForm.dateOfBirth.value}
                    onChange={this.onChangeAddPatientForm('dateOfBirth')}
                  />
                </Form.Group>
                <Form.Group controlId="gender">
                  <Form.Label>Płeć</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Płeć"
                    value={addPatientForm.gender.value}
                    onChange={this.onChangeAddPatientForm('gender')}
                  />
                </Form.Group>
                <Form.Group controlId="placeOfBirth">
                  <Form.Label>Miejsce urodzenia</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Miejsce urodzenia"
                    value={addPatientForm.placeOfBirth.value}
                    onChange={this.onChangeAddPatientForm('placeOfBirth')}
                  />
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label>Adres</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Adres"
                    value={addPatientForm.address.value}
                    onChange={this.onChangeAddPatientForm('address')}
                  />
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>Miasto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Miasto"
                    value={addPatientForm.city.value}
                    onChange={this.onChangeAddPatientForm('city')}
                  />
                </Form.Group>
                <Form.Group controlId="zipCode">
                  <Form.Label>Kod pocztowy</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kod pocztowy"
                    value={addPatientForm.zipCode.value}
                    onChange={this.onChangeAddPatientForm('zipCode')}
                  />
                </Form.Group>
                <Form.Group controlId="voivodeship">
                  <Form.Label>Województwo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Województwo"
                    value={addPatientForm.voivodeship.value}
                    onChange={this.onChangeAddPatientForm('voivodeship')}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.onHideAddPatientModal}
                >
                  Anuluj
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isAddPatientFormSubmitted || !isAddPatientFormValid}
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

export default PatientsRoute;
