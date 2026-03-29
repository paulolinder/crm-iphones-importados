import type { FinancialTransaction } from '../types'

export function useFinance() {
  const service = useFinanceService()
  const { data, isLoading, error, setData, setLoading, setError, addItem } = useCrudState<FinancialTransaction>()
  const pagination = usePagination()

  const loadTransactions = async () => {
    setLoading(true, 'read')

    try {
      const response = await service.listTransactions({
        page: pagination.currentPage.value,
        per_page: pagination.perPage.value,
      })

      setData(response.data)
      pagination.setTotal(response.meta.total)
    }
    catch (e) {
      setError(e as Error)
    }
  }

  const createTransaction = async (payload: Parameters<typeof service.registerTransaction>[0]) => {
    setLoading(true, 'create')

    try {
      const transaction = await service.registerTransaction(payload)
      addItem(transaction)
      return transaction
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
    finally {
      setLoading(false)
    }
  }

  return {
    transactions: data,
    loading: isLoading,
    error,
    pagination,
    loadTransactions,
    createTransaction,
    getSummary: service.getSummary,
    listReceivables: service.listReceivables,
    listPayables: service.listPayables,
    listCashAccounts: service.listCashAccounts,
    registerPayable: service.registerPayable,
    registerReceivable: service.registerReceivable,
  }
}
