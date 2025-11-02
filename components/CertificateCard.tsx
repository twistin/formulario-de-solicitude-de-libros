import React from 'react';
import Button from './Button';
import { CheckCircleIcon } from '../constants';

interface CertificateCardProps {
  certificate: string;
  onReset: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onReset }) => {
  return (
    <div className="animate-fade-in text-center">
      <div className="flex flex-col items-center justify-center mb-4">
        <CheckCircleIcon className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Solicitude Enviada!</h2>
        <p className="text-gray-600">Xeramos o teu certificado de solicitude.</p>
      </div>

      <div className="bg-gray-50/70 p-4 rounded-lg border border-gray-200 text-left my-6">
        <p className="whitespace-pre-wrap font-mono text-sm text-gray-700">
          {certificate}
        </p>
      </div>

      <Button onClick={onReset}>
        Solicitar Outro Libro
      </Button>
    </div>
  );
};

export default CertificateCard;