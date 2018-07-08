import * as React from 'react';
import './App.css';

import Axios from '../node_modules/axios';
import { clearToken, DecodedJwt, decodeToken, isTokenValid, loadToken } from './authStorage';
import { LoginForm } from './user/LoginForm';
import { RegisterForm } from './user/RegisterForm';
import { UserInfoBar } from './user/UserInfoBar';
import { UserInfoPanel } from './user/UserInfoPanel';

type AppState = {
  jwt: DecodedJwt | null;
};
class App extends React.Component<{}, AppState> {
  public constructor(props: {}) {
    super(props);

    this.state = { jwt: null };
  }

  public componentDidMount() {
    const token = loadToken();
    const decoded = decodeToken(token);
    if (isTokenValid(decoded)) {
      Axios.defaults.headers.authorization = `Bearer ${token}`;
      this.setState({ jwt: decoded });
    }
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Auth Playground</h1>
        </header>
        <UserInfoBar jwt={this.state.jwt} onLogOut={this.onLogOut} />
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <RegisterForm />
        <LoginForm onLoggedIn={this.onLoggedIn} />
        {this.state.jwt && <UserInfoPanel jwt={this.state.jwt} />}
      </div>
    );
  }

  private onLoggedIn = (jwt: DecodedJwt) => {
    this.setState({ jwt });
  }

  private onLogOut = () => {
    clearToken();
    Axios.defaults.headers.authorization = undefined;
    this.setState({ jwt: null });
  }
}

export default App;
