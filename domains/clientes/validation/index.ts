import { z } from 'zod'
import { validateCNPJ, validateCPF } from '~/lib/helpers'

const optionalTrimmedString = z.string().trim().optional().transform(value => value || undefined)

export const customerAddressSchema = z.object({
  street: z.string().trim().min(2, 'Rua é obrigatória'),
  number: optionalTrimmedString,
  complement: optionalTrimmedString,
  neighborhood: optionalTrimmedString,
  city: z.string().trim().min(2, 'Cidade é obrigatória'),
  state: z.string().trim().min(2, 'Estado é obrigatório'),
  postal_code: optionalTrimmedString,
  country: optionalTrimmedString,
})

const customerFormSchemaBase = z.object({
  name: z.string().trim().min(3, 'Nome é obrigatório'),
  email: z.string().trim().email('Email inválido').optional().or(z.literal('')),
  phone: optionalTrimmedString,
  mobile: optionalTrimmedString,
  whatsapp: optionalTrimmedString,
  document: optionalTrimmedString,
  document_type: z.enum(['cpf', 'cnpj', 'rg', 'passport', 'other']).optional(),
  birth_date: optionalTrimmedString,
  gender: z.enum(['M', 'F']).optional(),
  address: customerAddressSchema.partial().optional(),
  notes: optionalTrimmedString,
  tags: z.array(z.string().trim()).optional(),
  status: z.enum(['lead', 'active', 'inactive', 'vip', 'blocked']).optional(),
})

export const customerFormSchema = customerFormSchemaBase.superRefine((data, ctx) => {
  if (!data.document || !data.document_type) {
    return
  }

  if (data.document_type === 'cpf' && !validateCPF(data.document)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['document'],
      message: 'CPF inválido',
    })
  }

  if (data.document_type === 'cnpj' && !validateCNPJ(data.document)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['document'],
      message: 'CNPJ inválido',
    })
  }
})

export const customerUpdateSchema = customerFormSchemaBase.partial().superRefine((data, ctx) => {
  if (!data.document || !data.document_type) {
    return
  }

  if (data.document_type === 'cpf' && !validateCPF(data.document)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['document'],
      message: 'CPF inválido',
    })
  }

  if (data.document_type === 'cnpj' && !validateCNPJ(data.document)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['document'],
      message: 'CNPJ inválido',
    })
  }
})

export type CustomerFormSchema = z.infer<typeof customerFormSchema>
