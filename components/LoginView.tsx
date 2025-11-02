import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

interface LoginViewProps {
  onLogin: (password: string) => void;
  error: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="password"
          label="Contrasinal de Administrador"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Introduce a contrasinal"
        />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Button type="submit">
          Acceder
        </Button>
      </form>
    </div>
  );
};

export default LoginView;
