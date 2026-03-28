import type { BaseEntity } from '~/types'

export interface AuthUserProfile extends BaseEntity {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  phone: string | null
  status: 'active' | 'inactive' | 'blocked'
  roles: string[]
  permissions: string[]
}
