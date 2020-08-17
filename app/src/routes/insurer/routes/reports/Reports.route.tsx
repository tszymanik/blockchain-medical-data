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
import { ReportData } from 'types/report/Report.types';

type State = {
  reportsData: ReportData[];
  isAddReportModalShown: boolean;
  addReportForm: {
    [key: string]: FormElement;
    hospitalKey: FormElement;
    doctorKey: FormElement;
    patientKey: FormElement;
    content: FormElement;
  };
  isAddReportFormValid: boolean;
  isAddReportFormSubmitted: boolean;
};

class ReportsRoute extends Component<any, State> {
  static contextType = UserContext;

  state: State = {
    reportsData: [],
    isAddReportModalShown: false,
    addReportForm: {
      key: { ...formElement },
      hospitalKey: { ...formElement },
      doctorKey: { ...formElement },
      patientKey: { ...formElement },
      content: { ...formElement },
    },
    isAddReportFormValid: false,
    isAddReportFormSubmitted: false,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const reportsData: ReportData[] = (
      await axios.get('/reports', {
        params: {
          organizationName: process.env.REACT_APP_INSURER_ORG,
          userName: this.context.userName,
          startKey: 'REPORT_0',
          endKey: 'REPORT_999',
        },
      })
    ).data;

    const addReportForm = cloneDeep(this.state.addReportForm);
    addReportForm.key.value = `REPORT_${reportsData.length}`;
    addReportForm.key.isValid = true;

    this.setState({
      reportsData,
      addReportForm,
    });
  };

  onHideAddReportModal = () => this.setState({ isAddReportModalShown: false });

  onChangeAddReportForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const addReportForm = cloneDeep(this.state.addReportForm);
    addReportForm[formElement].value = e.target.value;
    addReportForm[formElement].isValid = validate(e.target.value);

    let isFormValid = true;

    Object.keys(addReportForm).forEach((key) => {
      isFormValid = addReportForm[key].isValid && isFormValid;
    });

    this.setState({
      addReportForm,
      isAddReportFormValid: isFormValid,
    });
  };

  onSubmitAddReportForm = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({ isAddReportFormSubmitted: true });

    try {
      const { addReportForm } = this.state;

      const data = {
        organizationName: process.env.REACT_APP_INSURER_ORG,
        userName: this.context.userName,
        key: addReportForm.key.value,
        hospitalKey: addReportForm.hospitalKey.value,
        doctorKey: addReportForm.doctorKey.value,
        patientKey: addReportForm.patientKey.value,
        content: addReportForm.content.value,
      };

      await axios.post('/Reports', data);

      const newAddReportForm = cloneDeep(addReportForm);
      Object.keys(newAddReportForm).forEach((key) => {
        newAddReportForm[key].value = '';
        newAddReportForm[key].isValid = false;
      });

      await this.fetchData();

      this.setState({
        addReportForm: newAddReportForm,
        isAddReportFormSubmitted: false,
      });

      this.onHideAddReportModal();
    } catch (error) {
      console.log(error);
      this.setState({ isAddReportFormSubmitted: false });
    }
  };

  render() {
    const {
      reportsData,
      isAddReportModalShown,
      addReportForm,
      isAddReportFormValid,
      isAddReportFormSubmitted,
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
                  onClick={() => this.setState({ isAddReportModalShown: true })}
                >
                  Dodaj raport
                </Button>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Klucz</th>
                    <th>Szpital</th>
                    <th>Lekarz</th>
                    <th>Pacjent</th>
                    <th>Zawartość</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.map((reportData) => (
                    <tr key={reportData.Key}>
                      <td>{reportData.Key}</td>
                      <td>{reportData.Record.hospitalKey}</td>
                      <td>{reportData.Record.doctorKey}</td>
                      <td>{reportData.Record.patientKey}</td>
                      <td>{reportData.Record.content}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>

        {isAddReportModalShown && (
          <Modal
            show={true}
            onHide={this.onHideAddReportModal}
            animation={false}
            size="lg"
          >
            <Form onSubmit={this.onSubmitAddReportForm}>
              <Modal.Header closeButton>
                <Modal.Title>Dodaj raport</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="key">
                  <Form.Label>Klucz</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Klucz"
                    value={addReportForm.key.value}
                    onChange={this.onChangeAddReportForm('key')}
                  />
                </Form.Group>
                <Form.Group controlId="hospitalKey">
                  <Form.Label>Szpital</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Szpital"
                    value={addReportForm.hospitalKey.value}
                    onChange={this.onChangeAddReportForm('hospitalKey')}
                  />
                </Form.Group>
                <Form.Group controlId="doctorKey">
                  <Form.Label>Lekarz</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Lekarz"
                    value={addReportForm.doctorKey.value}
                    onChange={this.onChangeAddReportForm('doctorKey')}
                  />
                </Form.Group>
                <Form.Group controlId="patientKey">
                  <Form.Label>Pacjent</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pacjent"
                    value={addReportForm.patientKey.value}
                    onChange={this.onChangeAddReportForm('patientKey')}
                  />
                </Form.Group>
                <Form.Group controlId="content">
                  <Form.Label>Zawartość</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Zawartość"
                    value={addReportForm.content.value}
                    onChange={this.onChangeAddReportForm('content')}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.onHideAddReportModal}>
                  Anuluj
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isAddReportFormSubmitted || !isAddReportFormValid}
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

export default ReportsRoute;
