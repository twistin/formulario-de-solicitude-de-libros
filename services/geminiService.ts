import type { BookRequest } from '../types';

// Usar variable de entorno de Vite
const API_KEY = import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

export const generateCertificate = async (formData: BookRequest): Promise<string> => {
  const { name, email, book, date, id } = formData;

  // Convertir id a string e tomar os últimos 6 caracteres
  const certNumber = String(id).padStart(6, '0').slice(-6).toUpperCase();

  const template = `-----------------------------------------
**Certificado de Solicitude de Libro**

**Certificado Nro:** ${certNumber}

Estimado/a **${name}**, 

Recibimos con éxito a túa solicitude para adquirir o libro:
**"${book}"**.

**Detalles da Solicitude:**
- **Data:** ${date}
- **Email de Contacto:** ${email}

Agradecemos enormemente o teu interés en enriquecer a nosa colección. O noso equipo avaliará a proposta e notificarémosche por correo electrónico sobre o estado da túa petición e cando o libro estea dispoñible no noso catálogo.

Grazas por axudarnos a medrar!

Atentamente,
O equipo da Biblioteca Dixital
-----------------------------------------`;

  // Si non hai clave de API, devolve o template local como fallback (útil para dev local)
  if (!API_KEY) {
    console.warn('VITE_API_KEY / API_KEY not set — returning local certificate template');
    return template;
  }

  try {
    // Import dinámico para evitar incluir a librería en builds onde non se usa
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = template; // usamos o mesmo template como prompt base

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return (response && (response as any).text) ? (response as any).text : template;
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    // En caso de erro, devolvemos el template local para no bloquear la UX
    return template;
  }
};
