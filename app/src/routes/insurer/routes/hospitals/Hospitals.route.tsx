import axios from 'axios';
import Nav from 'components/nav/InsurerNav';
import { UserContext } from 'contexts';
import { cloneDeep } from 'lodash';
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
import { HospitalData } from 'types/hospital/Hospital.types';

type State = {
  hospitalsData: HospitalData[];
  isAddHospitalModalShown: boolean;
  addHospitalForm: {
    [key: string]: FormElement;
    name: FormElement;
    city: FormElement;
  };
  isAddHospitalFormValid: boolean;
  isAddHospitalFormSubmitted: boolean;
};

class HospitalsRoute extends Component<any, State> {
  static contextType = UserContext;

  state: State = {
    hospitalsData: [],
    isAddHospitalModalShown: false,
    addHospitalForm: {
      key: { ...formElement },
      name: { ...formElement },
      city: { ...formElement },
    },
    isAddHospitalFormValid: false,
    isAddHospitalFormSubmitted: false,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const hospitalsData: HospitalData[] = (
      await axios.get('/hospitals', {
        params: {
          organizationName: process.env.REACT_APP_INSURER_ORG,
          userName: this.context.userName,
          startKey: 'HOSPITAL_0',
          endKey: 'HOSPITAL_999',
        },
      })
    ).data;

    const addHospitalForm = cloneDeep(this.state.addHospitalForm);
    addHospitalForm.key.value = `HOSPITAL_${hospitalsData.length}`;
    addHospitalForm.key.isValid = true;

    this.setState({
      hospitalsData,
      addHospitalForm,
    });
  };

  onHideAddHospitalModal = () =>
    this.setState({ isAddHospitalModalShown: false });

  onChangeAddHospitalForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const addHospitalForm = cloneDeep(this.state.addHospitalForm);
    addHospitalForm[formElement].value = e.target.value;
    addHospitalForm[formElement].isValid = validate(e.target.value);

    let isFormValid = true;

    Object.keys(addHospitalForm).forEach((key) => {
      isFormValid = addHospitalForm[key].isValid && isFormValid;
    });

    this.setState({
      addHospitalForm,
      isAddHospitalFormValid: isFormValid,
    });
  };

  onSubmitAddHospitalForm = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({ isAddHospitalFormSubmitted: true });

    try {
      const { addHospitalForm } = this.state;

      const data = {
        organizationName: process.env.REACT_APP_INSURER_ORG,
        userName: this.context.userName,
        key: addHospitalForm.key.value,
        name: addHospitalForm.name.value,
        city: addHospitalForm.city.value,
      };

      await axios.post('/hospitals', data);

      const newAddHospitalForm = cloneDeep(addHospitalForm);
      Object.keys(newAddHospitalForm).forEach((key) => {
        newAddHospitalForm[key].value = '';
        newAddHospitalForm[key].isValid = false;
      });

      await this.fetchData();

      this.setState({
        addHospitalForm: newAddHospitalForm,
        isAddHospitalFormSubmitted: false,
      });

      this.onHideAddHospitalModal();
    } catch (error) {
      console.log(error);
      this.setState({ isAddHospitalFormSubmitted: false });
    }
  };

  render() {
    const {
      hospitalsData,
      isAddHospitalModalShown,
      addHospitalForm,
      isAddHospitalFormValid,
      isAddHospitalFormSubmitted,
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
                    this.setState({ isAddHospitalModalShown: true })
                  }
                >
                  Dodaj szpital
                </Button>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Klucz</th>
                    <th>Nazwa</th>
                    <th>Miasto</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalsData.map((hospitalData) => (
                    <tr key={hospitalData.Key}>
                      <td>{hospitalData.Key}</td>
                      <td>{hospitalData.Record.name}</td>
                      <td>{hospitalData.Record.city}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>

        {isAddHospitalModalShown && (
          <Modal
            show={true}
            onHide={this.onHideAddHospitalModal}
            animation={false}
            size="lg"
          >
            <Form onSubmit={this.onSubmitAddHospitalForm}>
              <Modal.Header closeButton>
                <Modal.Title>Dodaj szpital</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="key">
                  <Form.Label>Klucz</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Klucz"
                    value={addHospitalForm.key.value}
                    onChange={this.onChangeAddHospitalForm('key')}
                  />
                </Form.Group>
                <Form.Group controlId="name">
                  <Form.Label>Nazwa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nazwa"
                    value={addHospitalForm.name.value}
                    onChange={this.onChangeAddHospitalForm('name')}
                  />
                </Form.Group>
                <Form.Group controlId="firstName">
                  <Form.Label>Miasto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Miasto"
                    value={addHospitalForm.city.value}
                    onChange={this.onChangeAddHospitalForm('city')}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.onHideAddHospitalModal}
                >
                  Anuluj
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    isAddHospitalFormSubmitted || !isAddHospitalFormValid
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

export default HospitalsRoute;
