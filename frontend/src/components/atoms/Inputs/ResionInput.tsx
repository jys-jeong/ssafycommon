import type { InputHTMLAttributes } from 'react';
import { regionInputClass } from '@/utils/inputClassName';

interface RegionInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: string;
}

export default function RegionInput(props: RegionInputProps) {
  return (
    <input
      {...props}
      className={`${regionInputClass} ${props.className || ''}`}
    />
  );
}
