import * as React from 'react';
import { DecodedJwt } from '../authStorage';

export type UserInfoBarProps = {
  jwt: DecodedJwt | null;
  onLogOut?: () => void;
};

export class UserInfoBar extends React.PureComponent<UserInfoBarProps> {
  public render() {
    return (
      <div className="user-info-bar">
        <div className="user-info-bar-text">
          {this.props.jwt ? `Logged in as ${this.props.jwt.payload.email}` : 'Not logged in'}
        </div>
        {this.props.jwt && (
          <div className="user-info-bar-text">
            <a href="#" onClick={this.onLogOutClick} id="logout">Log Out</a>
          </div>
        )}
      </div>
    );
  }

  // @ts-ignore
  private onLogOutClick = () => {
    if (this.props.onLogOut) {
      this.props.onLogOut();
    }
  }
}
