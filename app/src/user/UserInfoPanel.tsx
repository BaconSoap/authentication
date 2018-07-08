import Axios, { AxiosError } from 'axios';
import * as React from 'react';
import { DecodedJwt } from '../authStorage';

export type UserInfoPanelProps = {
  jwt: DecodedJwt,
};

type UserInfoPanelState = {
  userInfo?: {
    email: string,
    id: number,
  },
};

export class UserInfoPanel extends React.PureComponent<UserInfoPanelProps, UserInfoPanelState> {
  public constructor(props: UserInfoPanelProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div id="user-info" className="panel">
        <button className="primary" id="load-user-info" onClick={this.onLoadUserInfoClick}>Load User Info</button>
        {this.state.userInfo && (
          <>
            <p>User ID: {this.state.userInfo.id}</p>
            <p>Email: {this.state.userInfo.email}</p>
          </>
        )}
      </div>
    );
  }

  private onLoadUserInfoClick = async () => {
    try {
      const res = await Axios.get('http://localhost:3001/api/users/me');
      const { email, id } = res.data as { email: string, id: number };
      this.setState({ userInfo: { email, id } });
    } catch (e) {
      const err = e as AxiosError;
      console.error(err);
    }

  }
}
