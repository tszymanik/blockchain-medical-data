import axios from 'axios';
import { UserContext } from 'contexts';
import { cloneDeep } from 'lodash';
import React, { Component } from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Jumbotron,
  Modal,
  Row,
} from 'react-bootstrap';
import { validate, FormElement, formElement } from 'shared';
import Header from '../../components/header/Header';
import styles from './Home.module.scss';

const organizations = [
  {
    label: 'Ubezpieczyciel',
    value: process.env.REACT_APP_INSURER_ORG,
  },
  {
    label: 'Uniwersytet',
    value: process.env.REACT_APP_UNIVERSITY_ORG,
  },
];

type State = {
  loginUserForm: {
    [key: string]: FormElement;
    organizationName: FormElement;
    userName: FormElement;
  };
  isLoginUserFormValid: boolean;
  registerUserForm: {
    [key: string]: FormElement;
    organizationName: FormElement;
    userName: FormElement;
  };
  isRegisterUserFormValid: boolean;
  isRegisterUserModalShown: boolean;
  isRegisterUserFormSubmitted: boolean;
};

class HomeRoute extends Component<any, State> {
  state: State = {
    loginUserForm: {
      organizationName: { ...formElement },
      userName: { ...formElement },
    },
    isLoginUserFormValid: false,
    isRegisterUserModalShown: false,
    registerUserForm: {
      organizationName: { ...formElement },
      userName: { ...formElement },
    },
    isRegisterUserFormValid: false,
    isRegisterUserFormSubmitted: false,
  };

  onChangeLoginUserForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const loginUserForm = cloneDeep(this.state.loginUserForm);
    loginUserForm[formElement].value = e.target.value;
    loginUserForm[formElement].isValid = validate(e.target.value);

    let isFormValid = true;

    Object.keys(loginUserForm).forEach((key) => {
      isFormValid = loginUserForm[key].isValid && isFormValid;
    });

    this.setState({
      loginUserForm,
      isLoginUserFormValid: isFormValid,
    });
  };

  onSubmitLoginUserForm = (setUserName: (userName: string) => void) => async (
    e: React.FormEvent<HTMLElement>
  ) => {
    e.preventDefault();
    const { loginUserForm } = this.state;

    const data = {
      organizationName: loginUserForm.organizationName.value,
      userName: loginUserForm.userName.value,
    };

    await axios.post('/users/check', data);

    setUserName(loginUserForm.userName.value);

    if (
      loginUserForm.organizationName.value === process.env.REACT_APP_INSURER_ORG
    ) {
      this.props.history.push('/insurer');
    } else if (
      loginUserForm.organizationName.value ===
      process.env.REACT_APP_UNIVERSITY_ORG
    ) {
      this.props.history.push('/university');
    }
  };

  onChangeRegisterUserForm = (formElement: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const registerUserForm = cloneDeep(this.state.registerUserForm);
    registerUserForm[formElement].value = e.target.value;
    registerUserForm[formElement].isValid = validate(e.target.value);

    let isFormValid = true;

    Object.keys(registerUserForm).forEach((key) => {
      isFormValid = registerUserForm[key].isValid && isFormValid;
    });

    this.setState({
      registerUserForm,
      isRegisterUserFormValid: isFormValid,
    });
  };

  onHideRegisterUserModal = () =>
    this.setState({ isRegisterUserModalShown: false });

  onSubmitRegisterUserForm = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({ isRegisterUserFormSubmitted: true });

    try {
      const { registerUserForm } = this.state;

      if (
        registerUserForm.organizationName.value &&
        registerUserForm.userName.value
      ) {
        const data = {
          organizationName: registerUserForm.organizationName.value,
          userName: registerUserForm.userName.value,
        };

        await axios.post('/users', data);

        const newRegisterUserForm = cloneDeep(registerUserForm);
        newRegisterUserForm.organizationName.value = '';
        newRegisterUserForm.organizationName.isValid = false;
        newRegisterUserForm.userName.value = '';
        newRegisterUserForm.userName.isValid = false;

        this.setState({
          registerUserForm: newRegisterUserForm,
          isRegisterUserFormSubmitted: false,
        });

        this.onHideRegisterUserModal();
      }
    } catch (error) {
      console.log(error);
      this.setState({ isRegisterUserFormSubmitted: false });
    }
  };

  render() {
    const {
      loginUserForm,
      isLoginUserFormValid,
      registerUserForm,
      isRegisterUserFormValid,
      isRegisterUserModalShown,
      isRegisterUserFormSubmitted,
    } = this.state;

    return (
      <>
        <UserContext.Consumer>
          {({ userName, setUserName }) => (
            <Container>
              <Row className="justify-content-center">
                <Col lg={8}>
                  <Jumbotron className={styles.root}>
                    <Header isCentered />
                    <Form onSubmit={this.onSubmitLoginUserForm(setUserName)}>
                      <Form.Group controlId="organizationName">
                        <Form.Label>Nazwa organizacji</Form.Label>
                        <Form.Control
                          as="select"
                          placeholder="Nazwa organizacji"
                          value={loginUserForm.organizationName.value}
                          onChange={this.onChangeLoginUserForm(
                            'organizationName'
                          )}
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
                      <Form.Group controlId="userName">
                        <Form.Label>Użytkownik</Form.Label>
                        <Form.Control
                          placeholder="Użytkownik"
                          value={loginUserForm.userName.value}
                          onChange={this.onChangeLoginUserForm('userName')}
                        />
                      </Form.Group>
                      <div className="text-center">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={!isLoginUserFormValid}
                        >
                          Zaloguj się
                        </Button>
                      </div>
                      <div className="text-center mt-3">
                        <Button
                          variant="link"
                          type="button"
                          onClick={() =>
                            this.setState({ isRegisterUserModalShown: true })
                          }
                        >
                          Zarejestruj się
                        </Button>
                      </div>
                    </Form>
                  </Jumbotron>
                </Col>
              </Row>
            </Container>
          )}
        </UserContext.Consumer>
        {isRegisterUserModalShown && (
          <Modal
            show={true}
            onHide={this.onHideRegisterUserModal}
            animation={false}
            size="lg"
          >
            <Form onSubmit={this.onSubmitRegisterUserForm}>
              <Modal.Header closeButton>
                <Modal.Title>Rejestracja użytkownika</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="organizationName">
                  <Form.Label>Nazwa organizacji</Form.Label>
                  <Form.Control
                    as="select"
                    placeholder="Nazwa organizacji"
                    value={registerUserForm.organizationName.value}
                    onChange={this.onChangeRegisterUserForm('organizationName')}
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
                <Form.Group controlId="userName">
                  <Form.Label>Użytkownik</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Użytkownik"
                    value={registerUserForm.userName.value}
                    onChange={this.onChangeRegisterUserForm('userName')}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.onHideRegisterUserModal}
                >
                  Anuluj
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    isRegisterUserFormSubmitted || !isRegisterUserFormValid
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

export default HomeRoute;
