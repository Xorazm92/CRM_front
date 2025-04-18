
import { FC, ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  onFilterClick?: () => void;
}

const Button: FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  onFilterClick,
  ...props 
}) => {
  return (
    <button 
      className={`button ${variant}`}
      onClick={onFilterClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
