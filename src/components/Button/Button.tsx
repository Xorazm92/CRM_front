import { FC, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  onFilterClick?: () => void;
  showAdd?: boolean;
}

const Button: FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  onFilterClick,
  showAdd = true,
  ...props 
}) => {
  return (
    <button 
      className={`w-[132px] h-9 rounded border border-gray-200 bg-transparent flex gap-2 items-center px-5 py-1.5 justify-between cursor-pointer shadow-md font-medium text-base text-primary-600 ${variant === 'secondary' ? 'bg-gray-100' : ''}`}
      onClick={onFilterClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
