import * as React from 'react';
import { Input } from '../Input';

export class LoginForm extends React.PureComponent {
  public render() {
    return (
      <form className="form" id="login-form">
        <Input id="email-input" title="Email" placeholder="Email" type="email" />
        <Input id="password-input" title="Password" placeholder="Password" type="password" />
        <button type="button" className="primary" onClick={() => null}>Login</button>
      </form>
    );
  }
}
