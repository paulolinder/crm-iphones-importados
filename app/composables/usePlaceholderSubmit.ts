/**
 * Feedback para formulários admin ainda não persistidos no backend.
 */
export function usePlaceholderSubmit() {
  const { info } = useToast()

  return () => {
    info('Em breve', 'Este formulário será salvo no Supabase em uma próxima etapa.')
  }
}
