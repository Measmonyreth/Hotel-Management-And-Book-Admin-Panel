export interface VipCustomers {
  success: boolean
  message: string
  data: DataVip
  status: number
}

export interface DataVip {
  totalVipCustomers: number
  activeVipCustomers: number
  deletedVipCustomers: number
  silver: number
  gold: number
  platinum: number
  diamond: number
  vipCustomerResponses: VipCustomerResponse[]
  expiredVipCustomers: number
}

export interface VipCustomerResponse {
  id: string
  code: string
  type_vip: string
  points: number
  totalSpent: number
  validFrom: string
  validUntil: string
  status: string
  percentage_discount: number
  customer: Customer
  createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
}

export interface Customer {
  id: string
  name: string
}

export interface VipCustomerDetail {
  success: boolean
  message: string
  data: VipCustomerResponse
  status: number
}
