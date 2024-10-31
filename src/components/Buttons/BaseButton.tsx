import React, { FC, ButtonHTMLAttributes } from 'react'

interface IBaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
}

/**
 * Componente para el botón base 🇲🇽
 * @param {string} variant - Variante del botón
 * @param {boolean} isLoading - Indicador de carga
 * @param {ReactNode} children - Contenido del botón
 * @param {string} className - Clase del botón
 * @param {object} props - Propiedades del botón
 * @returns {JSX.Element} - Retorna el componente
 */
const BaseButton: FC<IBaseButtonProps> = ({ variant = 'primary', isLoading = false, children, className, ...props }) => {
  const baseStyle = 'px-4 rounded font-semibold focus:outline-none focus:ring-2 transition duration-300 flex items-center justify-center'
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary-light text-text-primary hover:bg-secondary focus:ring-secondary',
    danger: 'bg-accent-dark text-white hover:bg-accent focus:ring-accent',
  }

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  )
}

export default BaseButton
