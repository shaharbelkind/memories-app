import * as React from 'react';
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => (
  <button {...props} style={{padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', background: 'white'}}>{children}</button>
);
