export interface TaskResponse {
  success: boolean
  message: string
  data: DataTask
  status: number
}

export interface DataTask {
  totalTasks: number
  totalInProgress: number
  totalCompleted: number
  totalPending: number
  totalCancelled: number
  tasks: Task[]
}

export interface Task {
  id: number
  room?: Room
  employee?: Employee
  task_type: string
  task_status: string
  description: string
  createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
}
export interface Room {
  id: number
  roomNumber: string
  roomName: string
}

export interface Employee {
  id: number
  employeeId: string
  name: string
}

export interface TaskDetailResponse {
  success: boolean
  message: string
  data: Task
  status: number
}