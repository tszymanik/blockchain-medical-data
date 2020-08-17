import axios from 'axios';
import Nav from 'components/nav/UniversityNav';
import { UserContext } from 'contexts';
import React, { Component } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { ReportData } from 'types/report/Report.types';

type State = {
  reportsData: ReportData[];
};

class ReportsRoute extends Component<any, State> {
  static contextType = UserContext;

  state: State = {
    reportsData: [],
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const reportsData: ReportData[] = (
      await axios.get('/reports', {
        params: {
          organizationName: process.env.REACT_APP_UNIVERSITY_ORG,
          userName: this.context.userName,
          startKey: 'REPORT_0',
          endKey: 'REPORT_999',
        },
      })
    ).data;

    this.setState({ reportsData });
  };

  render() {
    const { reportsData } = this.state;

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
                  <th>Pacjent</th>
                  <th>Zawartość</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.map((reportData) => (
                  <tr key={reportData.Key}>
                    <td>{reportData.Key}</td>
                    <td>{reportData.Record.patientKey}</td>
                    <td>{reportData.Record.content}</td>
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

export default ReportsRoute;
