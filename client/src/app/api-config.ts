import { isDevMode } from '@angular/core';

// En producción, si el API está en el mismo dominio o gestionado por el mismo host
// podemos usar una URL relativa o la URL específica de EasyPanel.
// Por defecto, asumimos que en producción el API estará en el subdominio 'api'
// o simplemente cambiamos localhost por el host actual.

const getBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5000/api';
  
  const host = window.location.hostname;
  
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Si estás en EasyPanel y el API tiene su propio dominio, 
  // podrías ponerlo aquí. Si el API está en el mismo dominio (detrás de un proxy),
  // simplemente devuelve '/api'.
  
  // Por ahora, para Medicus en producción, detectamos si estamos en nominusve
  if (host.includes('nominusve.com')) {
    return 'https://medicus-api.nominusve.com'; 
  }

  return '';
};

export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;
export const SOCKET_URL = BASE_URL || 'http://localhost:5000';
