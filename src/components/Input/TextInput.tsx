import * as React from 'react';
import './Input.css';
import { Eye } from '../../assets/icons/eye';

interface IInputProps {
  type: React.HTMLInputTypeAttribute | undefined;
  value: string;
  placeholder?: string;
  name?: string;
  className?: string;
  isError?: boolean;
  required?: boolean;
  icon?: React.ReactElement;

  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const Input = (props: IInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {props.icon && <div className="input-icon">{props.icon}</div>}
      <input
        style={{
          padding: props.icon ? '10px 20px 10px 40px' : undefined,
        }}
        {...props}
        className={`${props.className} input ${props.isError && 'error'}`}
        type={props.type === 'password' && showPassword ? 'text' : props.type}
      />
      {props.type === 'password' && (
        <button
          className="showPassword"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye show={true} /> : <Eye show={false} />}
        </button>
      )}
    </div>
  );
};
