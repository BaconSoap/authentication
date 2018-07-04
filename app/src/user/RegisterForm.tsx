import * as React from 'react';
import { Input } from '../Input';

export class RegisterForm extends React.PureComponent {
  public render() {
    return (
      <form className="form" id="registration-form">
        <Input id="email-input" title="Email" placeholder="Email" type="email" />
        <Input id="password-input" title="Password" placeholder="Password" type="password" />
        <button type="button" className="primary" onClick={() => null}>Register</button>
      </form>
    );
  }
}
