export interface EmployeesResponse {
  success: boolean
  message: string
  data: DataEmployee
  status: number
}

export interface DataEmployee {
  totalEmployees: number
  totalActive: number
  totalInactive: number
  totalSuspended: number
  totalDeleted: number
  totalManager: number
  totalStaff: number
  totalAdmin: number
  employees: Employee[]
}

export interface Employee {
  id: string
  employeeId: string
  name: string
  username: string
  phone: string
  role: string
  status: string
  shift: any
  address: Address
  createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
}


export interface EmployeeDetailResponse {
  success: boolean
  message: string
  data: Employee
  status: number
}

export interface Address {
  id: number
  village: string
  commun: string
  city_or_province: string
  country: string
}
