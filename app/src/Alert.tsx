import * as React from 'react';

export type AlertProps = {
  type: 'success' | 'error';
  id?: string;
};

export class Alert extends React.PureComponent<AlertProps> {
  public render() {
    return (
      <div className={`alert alert-${this.props.type}`} id={this.props.id}>
        {this.props.children}
      </div>
    )
  }
}
