/**
 * Configuração de Ambiente
 *
 * Para alternar entre local e remoto:
 *
 * LOCAL (Desenvolvimento):
 *   - API_URL=http://localhost:3001
 *   - USE_REMOTE_API=false
 *
 * REMOTO (Produção):
 *   - API_URL=https://ascesa.onrender.com
 *   - USE_REMOTE_API=true
 *
 * Alternativamente, você pode usar apenas NEXT_PUBLIC_API_URL
 * que terá prioridade sobre USE_REMOTE_API
 */

export type ApiMode = 'local' | 'remote';

export interface ApiConfig {
  mode: ApiMode;
  apiUrl: string;
  isLocal: boolean;
}

/**
 * Retorna a configuração da API com base nas variáveis de ambiente
 */
export function getApiConfig(): ApiConfig {
  // Verificar se deve usar API remota
  const useRemote = process.env.NEXT_PUBLIC_USE_REMOTE_API === 'true';

  // URL da API - prioritária se definida
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || (
    useRemote
      ? 'https://ascesa.onrender.com'
      : 'http://localhost:3001'
  );

  return {
    mode: useRemote ? 'remote' : 'local',
    apiUrl,
    isLocal: !useRemote,
  };
}

/**
 * Helper para verificar se está usando API local
 */
export const isLocalApi = () => getApiConfig().isLocal;

/**
 * Helper para obter a URL da API
 */
export const getApiUrl = () => getApiConfig().apiUrl;
