import { isDevMode } from '@angular/core';

// En producción, si el API está en el mismo dominio o gestionado por el mismo host
// podemos usar una URL relativa o la URL específica de EasyPanel.
// Por defecto, asumimos que en producción el API estará en el subdominio 'api'
// o simplemente cambiamos localhost por el host actual.

const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return 'http://localhost:5000';
  
  const host = window.location.hostname;
  let result = '';
  
  if (host === 'localhost' || host === '127.0.0.1') {
    result = 'http://localhost:5000';
  } else if (host.includes('.easypanel.host')) {
    result = 'https://' + host.replace('-frontend', '-api');
  } else if (host.includes('nominusve.com')) {
    if (host === 'medicus.nominusve.com') {
      result = 'https://medicus-api.nominusve.com';
    } else {
      result = 'https://' + host.replace('medicus.', 'medicus-api.');
    }
  }

  if (!result) {
    console.warn('⚠️ No se detectó entorno de producción. Usando rutas relativas.');
  } else {
    console.log(`🚀 Medicus API detectada: ${result}`);
  }

  return result;
};

export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;
export const SOCKET_URL = BASE_URL || 'http://localhost:5000';
