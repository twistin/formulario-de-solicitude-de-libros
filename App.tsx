import React, { useState, useCallback, useEffect } from 'react';
import type { BookRequest, User } from './types';
import { generateCertificate } from './services/geminiService';
import * as backendService from './services/backendService';
import { ADMIN_PASSWORD } from './config';
import Input from './components/Input';
import Button from './components/Button';
import Spinner from './components/Spinner';
import CertificateCard from './components/CertificateCard';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import logo from './images/eoi.png';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    book: '',
  });
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [view, setView] = useState<'form' | 'admin' | 'login'>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Cargar solicitudes iniciais do backend ao montar o compoñente
    setRequests(backendService.getRequests());
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  }, []);
  
  const handleAddRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.book) {
      setError('Por favor, encha todos os campos.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setCertificate(null);

    const newRequestData = {
      ...formData,
      date: new Date().toLocaleDateString('gl-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    try {
      // 1. Gardar a solicitude no backend
      const savedRequest = backendService.addRequest(newRequestData);
      setRequests(prev => [...prev, savedRequest]);

      // 2. Xerar o certificado con Gemini
      const generatedText = await generateCertificate(savedRequest);
      setCertificate(generatedText);

      // 3. Limpar o formulario
      setFormData({ name: '', email: '', book: '' });

    } catch (err) {
      setError('Houbo un erro ao procesar a solicitude. Por favor, téntao de novo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setCertificate(null);
    setError(null);
  };
  
  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setCurrentUser({ name: 'Admin', role: 'admin' });
      setView('admin');
      setError(null);
    } else {
      setError('Contrasinal incorrecta.');
    }
  };

  const toggleView = () => {
    if (view === 'form') {
      setView('login');
    } else if (view === 'admin') {
      setView('form');
    } else {
      setView('form');
    }
    handleResetForm();
  };

  const MemoizedAdminView = React.memo(AdminView);

  const getTitle = () => {
    if (view === 'login') return 'Acceso de Administrador';
    if (view === 'admin') return 'Panel de Administración';
    return 'Solicitude de Libros';
  };

  const getDescription = () => {
    if (view === 'login') return 'Introduce a túa contrasinal para xestionar as solicitudes.';
    if (view === 'admin') return 'Xestiona as solicitudes de libros dos alumnos.';
    return 'Pide un novo libro para a nosa biblioteca.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-200/50 p-6 sm:p-8 transition-all duration-500">
          <div className="flex flex-col items-center text-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 mb-4 rounded-full bg-white/30 backdrop-blur-md shadow-lg border-2 border-white/50" />
            <div className="bg-white/30 backdrop-blur-md shadow-lg p-4 rounded-xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {getTitle()}
              </h1>
            </div>
            <p className="text-gray-600 mt-2">
              {getDescription()}
            </p>
          </div>
          
          {isLoading && <Spinner />}

          {error && !isLoading && view !== 'login' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {view === 'form' ? (
            <>
              {!isLoading && !certificate && (
                <form onSubmit={handleAddRequest} className="space-y-4">
                  <Input
                    id="name"
                    label="Nome do Alumno/a"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Ana García"
                  />
                  <Input
                    id="email"
                    label="Correo Electrónico"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: ana.garcia@email.com"
                  />
                  <Input
                    id="book"
                    label="Libro e Autor Desexado"
                    value={formData.book}
                    onChange={handleChange}
                    placeholder="Ex: 'Cen anos de soidade' de Gabriel García Márquez"
                  />
                  <Input
                    id="date"
                    label="Data da Petición"
                    value={new Date().toLocaleDateString('gl-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    readOnly
                  />
                  <Button type="submit" disabled={isLoading}>
                    Enviar Solicitude
                  </Button>
                </form>
              )}
              {certificate && !isLoading && (
                <CertificateCard certificate={certificate} onReset={handleResetForm} />
              )}
            </>
          ) : view === 'login' ? (
            <LoginView onLogin={handleLogin} error={error} />
          ) : (
            currentUser?.role === 'admin' && (
              <MemoizedAdminView 
                requests={requests}
                setRequests={setRequests}
              />
            )
          )}

        </div>
        <footer className="text-center mt-6 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Biblioteca Dixital. Tódolos dereitos reservados.</p>
          <button onClick={toggleView} className="mt-2 text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none focus:underline">
            {view === 'form' ? 'Ir ao Panel de Administración' : 'Volver ao Formulario'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default App;
