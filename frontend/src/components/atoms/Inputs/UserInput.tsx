import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import {
  inputWrapperClass,
  inputBaseClass,
  floatingLabelBaseClass,
  floatingLabelActiveClass,
  floatingLabelInactiveClass,
} from '@/utils/inputClassName';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function UserInput(props: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || (props.value && String(props.value).length > 0);

  return (
    <div className={inputWrapperClass}>
      <input
        {...props}
        className={inputBaseClass}
        placeholder={props.placeholder}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
      />
      <span
        className={`
          ${floatingLabelBaseClass}
          ${isActive ? floatingLabelActiveClass : floatingLabelInactiveClass}
        `}
      >
        {props.placeholder}
      </span>
    </div>
  );
}
