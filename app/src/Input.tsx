import * as React from 'react';

export type InputProps = {
  title: string;
  id: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export class Input extends React.PureComponent<InputProps> {
  public render() {
    const { title, id, ...rest } = this.props;

    return (
      <div className="input-item">
        <label htmlFor={id}>{title}</label>
        <input placeholder="Email" id={id} {...rest} />
      </div>
    );
  }
}
