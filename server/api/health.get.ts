/**
 * Health Check Endpoint
 *
 * Endpoint para verificar se a API está funcionando
 */

export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  }
})
