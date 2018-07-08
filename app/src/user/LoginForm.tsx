import Axios, { AxiosError } from 'axios';
import * as React from 'react';
import { Alert } from '../Alert';
import { DecodedJwt, decodeToken, isTokenValid, saveToken } from '../authStorage';
import { Input } from '../Input';

type LoginFormProps = {
  onLoggedIn?: (jwt: DecodedJwt) => void;
};
type LoginFormState = { jwt: null; errorMessage: string | null };
export class LoginForm extends React.PureComponent<LoginFormProps, LoginFormState> {
  private emailInput: React.RefObject<HTMLInputElement>;
  private passwordInput: React.RefObject<HTMLInputElement>;

  public constructor(props: LoginFormProps) {
    super(props);

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();

    this.state = {
      errorMessage: null,
      jwt: null,
    };
  }

  public render() {
    return (
      <form className="form" id="login-form">
        {this.state.jwt && <Alert id="login-message" type="success">Logged in!</Alert>}
        {this.state.errorMessage && <Alert id="login-message" type="error">Could not login: {this.state.errorMessage}</Alert>}
        <Input id="login-email-input" title="Email" placeholder="Email" type="email" innerRef={this.emailInput} />
        <Input id="login-password-input" title="Password" placeholder="Password" type="password" innerRef={this.passwordInput} />
        <button type="button" className="primary" onClick={this.onLoginClick}>Login</button>
      </form>
    );
  }

  private onLoginClick = async () => {
    const emailInput = this.emailInput.current;
    const passwordInput = this.passwordInput.current;
    if (!emailInput || !passwordInput) {
      return;
    }
    try {
      const res = await Axios.post('http://localhost:3001/api/users/login', { email: emailInput.value, password: passwordInput.value });

      this.setState({
        errorMessage: null,
        jwt: res.data.jwt,
      });

      emailInput.value = '';
      passwordInput.value = '';

      const decoded = decodeToken(res.data.jwt);
      if (isTokenValid(decoded)) {
        saveToken(res.data.jwt);
        Axios.defaults.headers.authorization = `Bearer ${res.data.jwt}`;
        if (this.props.onLoggedIn) {
          this.props.onLoggedIn(decoded);
        }
      }
    } catch (e) {
      const error = e as AxiosError;

      if (error.response && error.response.data) {
        const validation = error.response.data as { message: string };

        this.setState({
          errorMessage: validation.message,
          jwt: null,
        });
      } else {
        this.setState({
          errorMessage: 'An unknown error occured',
          jwt: null,
        });
      }
    }

  }
}
