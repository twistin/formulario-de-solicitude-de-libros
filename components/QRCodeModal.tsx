import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-xs mx-auto transform transition-all duration-300 scale-100 opacity-100 text-center p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="qr-modal-title" className="text-lg font-bold text-gray-900">Código QR para Alumnos</h3>
        <p className="mt-2 text-sm text-gray-600">Escanea este código para acceder ao formulario de solicitude de libros.</p>
        
        <div className="my-6 flex justify-center">
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <QRCodeSVG value={url} size={200} includeMargin={true} />
            </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2 bg-indigo-600 text-sm font-medium text-white border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Pechar
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
