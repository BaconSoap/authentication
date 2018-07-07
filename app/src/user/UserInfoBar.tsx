import * as React from 'react';
import { DecodedJwt } from '../authStorage';

export type UserInfoBarProps = {
  jwt: DecodedJwt | null;
};

export class UserInfoBar extends React.PureComponent<UserInfoBarProps> {
  public render() {
    return (
      <div className="user-info-bar">
        <div className="user-info-bar-text">
          {this.props.jwt ? `Logged in as ${this.props.jwt.payload.email}` : 'Not logged in'}
        </div>
      </div>
    );
  }
}
