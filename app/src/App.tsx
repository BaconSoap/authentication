import * as React from 'react';
import './App.css';

import { DecodedJwt, decodeToken, isTokenValid, loadToken } from './authStorage';
import { LoginForm } from './user/LoginForm';
import { RegisterForm } from './user/RegisterForm';
import { UserInfoBar } from './user/UserInfoBar';

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
      this.setState({ jwt: decoded });
    }
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Auth Playground</h1>
        </header>
        <UserInfoBar jwt={this.state.jwt} />
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <RegisterForm />
        <LoginForm onLoggedIn={this.onLoggedIn} />
      </div>
    );
  }

  private onLoggedIn = (jwt: DecodedJwt) => {
    this.setState({ jwt });
  }
}

export default App;
