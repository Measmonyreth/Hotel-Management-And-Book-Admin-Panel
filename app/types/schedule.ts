export interface Shifts {
  success: boolean
  message: string
  data: DataShift
  status: number
}

export interface DataShift {
  totalShifts: number
  totalWorkFromMondayToFriday: number
  totalWorkFromMondayToSaturday: number
  totalWorkFromSundayToFriday: number
  totalTimeFrom8AMTo5PM: number
  totalTimeFrom9AMTo6PM: number
  totalFullTime: number
  totalPartTime: number
  shifts: Shift[]
}

export interface Shift {
  id: string
  dayWork: string
  dayOff: string
  startingTime: string
  endingTime: string
  shift: string
  createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
}


export interface ShiftDetail {
  success: boolean
  message: string
  data: Shift
  status: number
}