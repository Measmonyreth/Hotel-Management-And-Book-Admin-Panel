
export interface EmployeeResponse {
  message: string
  success: boolean
  status: number
  data: DataEmployee
}

export interface DataEmployee {
  address: Address
  createBy: string
  createdDate: string
  deletedBy: any
  deletedDate: any
  employeeId: string
  id: number
  lastModifiedBy: any
  lastModifiedDate: any
  name: string
  phone: string
  role: string
  shift: Shift
  status: string
  username: string
}

export interface Address {
  id: number
  village: string
  commun: string
  city_or_province: string
  country: string
}

export interface Shift {
  id: number
  dayWork: string
  dayOff: string
  startingTime: string
  endingTime: string
  shift: string
  createdDate: string
  lastModifiedDate: string
  deletedDate: any
  createBy: string
  lastModifiedBy: string
  deletedBy: any
}
