import * as React from 'react';

export type InputProps = {
  title: string;
  id: string;
  innerRef?: React.Ref<HTMLInputElement>;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export class Input extends React.PureComponent<InputProps> {
  public render() {
    const { title, id, innerRef, ...rest } = this.props;

    return (
      <div className="input-item">
        <label htmlFor={id}>{title}</label>
        <input placeholder="Email" id={id} {...rest} ref={innerRef} />
      </div>
    );
  }
}
