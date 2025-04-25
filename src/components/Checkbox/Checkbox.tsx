// Migratsiya: TypeScript, professional props, Ant Design integratsiyasi
import React from 'react';
import './Checkbox.css';
import { Checkbox as AntCheckbox } from 'antd';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled, style }) => {
  return (
    <div className="checkbox-container" style={style}>
      <label>
        <AntCheckbox
          checked={checked}
          onChange={e => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
