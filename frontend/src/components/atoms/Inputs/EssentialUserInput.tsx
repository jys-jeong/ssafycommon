import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import {
  inputWrapperClass,
  inputBaseClass,
  floatingLabelBaseClass,
  floatingLabelActiveClass,
  floatingLabelInactiveClass,
} from '@/utils/inputClassName';

interface EssentialInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode; // string이 아니라 ReactNode
}

export default function EssentialUserInput({ label, ...props }: EssentialInputProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || (props.value && String(props.value).length > 0);

  return (
    <div className={inputWrapperClass}>
      <input
        {...props}
        className={inputBaseClass}
        placeholder={typeof label === 'string' ? label : ''}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
      />
      <span
        className={`${floatingLabelBaseClass} ${
          isActive ? floatingLabelActiveClass : floatingLabelInactiveClass
        }`}
      >
        {label}
      </span>
    </div>
  );
}
