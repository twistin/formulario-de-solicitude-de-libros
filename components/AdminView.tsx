import React, { useState } from 'react';
import type { BookRequest, RequestStatus } from '../types';
import * as backendService from '@/services/backendService';
import { TrashIcon, QrCodeIcon, DownloadIcon } from '@/constants.tsx';
import Modal from '@/components/Modal';
import QRCodeModal from '@/components/QRCodeModal';

interface AdminViewProps {
  requests: BookRequest[];
  setRequests: React.Dispatch<React.SetStateAction<BookRequest[]>>;
}

const statusColors: Record<RequestStatus, string> = {
  Pendente: 'bg-yellow-100 text-yellow-800',
  Aprobado: 'bg-blue-100 text-blue-800',
  Mercado: 'bg-green-100 text-green-800',
  Rexeitado: 'bg-red-100 text-red-800',
};

const statusOptions: RequestStatus[] = ['Pendente', 'Aprobado', 'Mercado', 'Rexeitado'];

const AdminView: React.FC<AdminViewProps> = ({ requests, setRequests }) => {
  const [requestToDelete, setRequestToDelete] = useState<BookRequest | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    const updatedRequests = backendService.updateRequestStatus(id, newStatus);
    setRequests(updatedRequests);
  };

  const handleDeleteRequest = () => {
    if (requestToDelete) {
      const updatedRequests = backendService.deleteRequest(requestToDelete.id);
      setRequests(updatedRequests);
      setRequestToDelete(null);
    }
  };

  const handleExport = () => {
    const convertToCSV = (data: BookRequest[]) => {
      const headers = ["Nome", "Correo", "Libro", "Data", "Estado"];
      const rows = data.map(req => 
        [req.name, req.email, req.book, req.date, req.status].map(field => {
          const str = String(field);
          // Escapar comiñas dobres duplicándoas e rodear o campo con comiñas se contén comas, comiñas dobres ou saltos de liña
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    };

    const csvContent = convertToCSV(requests);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "solicitudes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aínda non hai ningunha solicitude de libros.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 duration-300"
          aria-label="Exportar a CSV"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Exportar a CSV</span>
        </button>
        <button
          onClick={() => setIsQrModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 duration-300"
          aria-label="Xerar código QR para acceso de alumnos"
        >
          <QrCodeIcon className="w-5 h-5" />
          <span>Xerar QR para Alumnos</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alumno/a
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libro Solicitado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accións
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{req.name}</div>
                    <div className="text-sm text-gray-500">{req.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">{req.book}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value as RequestStatus)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-indigo-500 ${statusColors[req.status]}`}
                    aria-label={`Estado de ${req.book}`}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setRequestToDelete(req)}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`Eliminar solicitude de ${req.book}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={!!requestToDelete}
        onClose={() => setRequestToDelete(null)}
        onConfirm={handleDeleteRequest}
        title="Confirmar Eliminación"
      >
        <p className="text-gray-600">
          Tes a certeza de que queres eliminar a solicitude do libro <strong className="font-semibold text-gray-800">"{requestToDelete?.book}"</strong>? Esta acción non se pode desfacer.
        </p>
      </Modal>
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={`${window.location.origin}?view=form`}
      />
    </div>
  );
};

export default AdminView;