export interface Payments {
  success: boolean
  message: string
  data: DataPayment
  status: number
}

export interface DataPayment {
  totalPayment: number
  totalRevenue: number
  totalRefund: number
  payments: Payment[]
  numberUnpaid: number
  numberRefund: number
  numberPaid: number
  numberPartialy_paid: number
  numberPartialy_refund: number
}

export interface Payment {
  id: string
  bookId: string
  code: string
  description: string
  email: string
  paidAmount: number
  currency: string
  refundedAmount: any
  paymentStatus: string
  paymentType: string
  paymentMethod: string
  paymentTiming: string
  paymentGetway: string
  getwayTransactionId: string
  paymentDate: string
  note: string
  book: Book
  paymentHistory: PaymentHistory[]
  createdBy: string
  createdDate: string
  lastModifiedBy: any
  lastModifiedDate: any
  deletedBy: any
  deletedDate: any
}

export interface PaymentHistory {
  id: number
  payment: Payment2
  paymentType: string
  paymentMethod: string
  paymentTiming: string
  currency: string
  amount: number
  paymentGetway: any
  getwayTransactionId: any
  paymentDate: string
  notes: string
  createdBy: string
  createdDate: string
  lastModifiedBy: any
  lastModifiedDate: any
  deletedBy: any
  deletedDate: any
}

export interface Payment2 {
  id: number
  code: string
}
export interface Book {
  bookId: number
  code: string
}


export interface PaymentDetail {
  success: boolean
  message: string
  data: Payment
  status: number
}