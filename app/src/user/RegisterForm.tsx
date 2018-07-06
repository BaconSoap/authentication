import Axios, { AxiosError } from 'axios';
import * as React from 'react';
import { ValidationErrorItem } from '../../node_modules/@types/joi';
import { Alert } from '../Alert';
import { Input } from '../Input';

type RegisterFormState = {
  succeeded: boolean;
  errored: boolean;
  validationErrors: string[];
}

export class RegisterForm extends React.PureComponent<{}, RegisterFormState> {
  private emailInput: React.RefObject<HTMLInputElement>;
  private passwordInput: React.RefObject<HTMLInputElement>;

  public constructor(props: {}) {
    super(props);

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.state = {
      errored: false,
      succeeded: false,
      validationErrors: [],
    };
  }

  public render() {
    return (
      <form className="form" id="registration-form">
        {this.state.succeeded && <Alert type="success" id="message">Registered</Alert>}
        {this.state.errored && <Alert type="error" id="message">Failed to register: <br /> {this.state.validationErrors.map(v => (
          <>
            {v}
            <br />
          </>
        ))}</Alert>}
        <Input id="register-email-input" title="Email" placeholder="Email" type="email" innerRef={this.emailInput} />
        <Input id="register-password-input" title="Password" placeholder="Password" type="password" innerRef={this.passwordInput} />
        <button type="button" className="primary" onClick={this.onRegister}>Register</button>
      </form>
    );
  }

  private onRegister = async () => {
    const emailInput = this.emailInput.current;
    const passwordInput = this.passwordInput.current;
    if (!emailInput || !passwordInput) {
      return;
    }
    try {
      await Axios.post('http://localhost:3001/api/users', { email: emailInput.value, password: passwordInput.value });

      this.setState({
        errored: false,
        succeeded: true
      });
    } catch (e) {
      const error = e as AxiosError;

      if (error.response && error.response.status === 400 && error.response.data && error.response.data.isValidationError) {
        const validation = error.response.data as ApiValidationError;

        this.setState({
          errored: true,
          succeeded: false,
          validationErrors: validation.details.map(v => v.message)
        });
      } else {
        this.setState({
          errored: true,
          succeeded: false,
          validationErrors: []
        })
      }
    }

  }
}


export type ApiValidationError = {
  isValidationError: true;
  details: ValidationErrorItem[];
}
