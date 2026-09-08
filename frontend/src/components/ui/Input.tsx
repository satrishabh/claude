import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'w-full rounded-md border px-3 py-2 text-sm shadow-sm',
          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className,
        ].join(' ')}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
