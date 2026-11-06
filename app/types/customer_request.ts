export interface CustomerRequest {
  message: string
  success: boolean
  status: number
  data: DataCustomerRequest[]
}

export interface DataCustomerRequest {
  id: number
  bookId: Book
  reason: string
  calculatedPenaltyFee: number
  calculatedRefundAmount: number
  status: string
  reviewedBy: any
  rejectionReason: any
  reviewedDate: string
   createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
}
export interface Book {
  code: string
  id: number
}

export interface CustomerRequestByID {
  message: string
  success: boolean
  status: number
  data: DataCustomerRequest
}
