/**
 * Clientes Service
 *
 * Serviço para operações de clientes
 */

import type { Customer, CustomerFormData, CustomerFilters, CustomerStats } from '../types'
import type { PaginatedResponse, PaginationParams } from '~/types'

export function useCustomersService() {
  const { client } = useSupabase()

  /**
   * Lista clientes com paginação e filtros
   */
  const list = async (
    params: PaginationParams & CustomerFilters = {}
  ): Promise<PaginatedResponse<Customer>> => {
    // TODO: Implementar quando o schema do banco estiver pronto
    throw new Error('Not implemented')
  }

  /**
   * Busca um cliente por ID
   */
  const getById = async (id: string): Promise<Customer> => {
    // TODO: Implementar
    throw new Error('Not implemented')
  }

  /**
   * Cria um novo cliente
   */
  const create = async (data: CustomerFormData): Promise<Customer> => {
    // TODO: Implementar
    throw new Error('Not implemented')
  }

  /**
   * Atualiza um cliente
   */
  const update = async (id: string, data: Partial<CustomerFormData>): Promise<Customer> => {
    // TODO: Implementar
    throw new Error('Not implemented')
  }

  /**
   * Remove um cliente
   */
  const remove = async (id: string): Promise<void> => {
    // TODO: Implementar
    throw new Error('Not implemented')
  }

  /**
   * Busca estatísticas de clientes
   */
  const getStats = async (): Promise<CustomerStats> => {
    // TODO: Implementar
    throw new Error('Not implemented')
  }

  return {
    list,
    getById,
    create,
    update,
    remove,
    getStats,
  }
}
