import axios from 'axios';
import Nav from 'components/nav/UniversityNav';
import { UserContext } from 'contexts';
import moment from 'moment';
import React, { Component } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { PatientData } from 'types/patient/Patient.types';

type State = {
  patientsData: PatientData[];
};

class PatientsRoute extends Component<any, State> {
  static contextType = UserContext;

  state: State = {
    patientsData: [],
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const patientsData: PatientData[] = (
      await axios.get('/patients', {
        params: {
          organizationName: process.env.REACT_APP_UNIVERSITY_ORG,
          userName: this.context.userName,
          startKey: 'PATIENT_0',
          endKey: 'PATIENT_999',
        },
      })
    ).data;

    this.setState({ patientsData });
  };

  render() {
    const { patientsData } = this.state;

    return (
      <Container>
        <Row>
          <Col md={3} lg={2} className="d-flex">
            <Nav />
          </Col>
          <Col md={9} lg={10}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Klucz</th>
                  <th>Data urodzenia</th>
                  <th>Płeć</th>
                </tr>
              </thead>
              <tbody>
                {patientsData.map((patientData) => (
                  <tr key={patientData.Key}>
                    <td>{patientData.Key}</td>
                    <td>
                      {moment(patientData.Record.dateOfBirth).format(
                        'DD.MM.YYYY'
                      )}
                    </td>
                    <td>{patientData.Record.gender}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PatientsRoute;
