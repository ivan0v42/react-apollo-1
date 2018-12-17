import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types';
import gql from 'graphql-tag'
import logo from '../logo.png'
import warning from '../warning.png'
import * as EmailValidator from 'email-validator'
import { FormErrors } from './FormErrors';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {

    static propTypes = {

        error: PropTypes.bool
    };
  // state = {
  //   login: true, // switch between Login and SignUp
  //   email: '',
  //   password: '',
  //   name: '',
  //     error:false,
  // }

    constructor(props) {
        super(props);

        this.state = {
            login:true,
            email: '',
            password: '',
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false
        }
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.state.error=false;
        this.setState({[name]: value},
            () => { this.validateField(name, value)});
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'заполнено некорректно';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' слишком короткий';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }

  render() {
    const { login, email, password, name } = this.state
      const {error} = this.props;
      if (EmailValidator.validate(email)===false){
          console.log('Error!');


      }
    return (
      <div>
        {/*<h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>*/}
          <div className="wrapper">
              <div className="logo">
              <img src={logo} alt="Logo" />
              </div>
                  <div id="login-form">
          <div className="flex flex-column">
              <FormErrors formErrors={this.state.formErrors} />
          {!login && (
              <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
            <input
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"

            />
              </div>
          )}
              <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleUserInput}
          />
              </div>


          <input

            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleUserInput}
          />
        </div>
          <div>
        <div className="button-login">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
            onError={({ graphQLErrors, networkError }) => {

                console.log('graphQLErrors!', graphQLErrors[0].message);


               // //return(<div>Error!</div>);
               //   this.state.email='Email address is invalid';
              this.setState({error:!error});
               //   console.log(this.state.email);
             //   console.log(this.state.error);
            }}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>

                {login ? 'Войти в систему' : 'Создать аккаунт'}
              </div>
            )}
          </Mutation>

        </div>
      </div>
          <div
              className="button-login"
              onClick={() => this.setState({ login: !login })}
          >
              {login ? 'Регистрация' : 'Уже есть аккаунт?'}
          </div>

                      <div className='error-message' hidden={!this.state.error}>
                         <div className="warning_logo"> <img src={warning} alt="Warning" /></div>
                          <div className="warning">{'Неправильная почта или пароль'}</div>
                      </div>
      </div>
      </div>
      </div>
    )
  }

  _confirm = async data => {
    const { token } = this.state.login ? data.login : data.signup
    this._saveUserData(token)
    this.props.history.push(`/top`)
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}


export default Login
