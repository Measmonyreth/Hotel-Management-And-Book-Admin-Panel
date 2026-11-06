export interface Customers {
  success: boolean
  message: string
  data: Data
  status: number
}

export interface Data {
  totalCustomers: number
  totalActiveCustomers: number
  totalInacitveCustomers: number
  totalDeletedCustomers: number
  loginWithGoogle: number
  loginWithSystem: number
  customers: Customer[]
}

export interface Customer {
  id: string
  customerId: string
  firstName: string
  lastName: string
  email: string
  picture?: string
  provider: string
  providerId?: string
  phone?: string
  emailVerified: boolean
  role: string
  status: string
  nationality?: string
  city_or_province?: string
  country?: string
  createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
  vipCustomer: any
}

export interface CustomerDetailResponse {
  success: boolean
  message: string
  data: Customer
  status: number
}
