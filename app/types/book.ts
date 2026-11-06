export interface Booking {
  success: boolean;
  message: string;
  data: Data;
  status: number;
}

export interface Data {
  totalBooking: number;
  totalCancel: number;
  totalPaid: number;
  totalPartially_paid: number;
  totalUnpaid: number;
  totalPartially_refund: number;
  totalRefund: number;
  bookResponses: BookResponse[];
}

export interface BookResponse {
  id: number;
  code: string;
  customer: Customer;
  employee: any;
  book_status: string;
  totalBooking: number;
  payment_status: string;
  remainingAmount: number;
  sub_totalAmount: number;
  discountAmount: number;
  quantity_night: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  paidAmount: number;
  createdDate: string;
  lastModifiedDate: any;
  deletedDate: any;
  createBy: string;
  lastModifiedBy: any;
  deletedBy: any;
  totalBookitem: number;
  bookItems: BookItem[];
  payments: Payment[];
}

export interface Customer {
  id: string;
  name: string;
  customerId: string;
}

export interface BookItem {
  id: string;
  room: Room;
  book: string;
  booking_type: string;
  status: string;
  unit_price: number;
  discount_amount: number;
  total_amount: number;
  discount: Discount;
  createdDate: string;
  lastModifiedDate: any;
  deletedDate: any;
  createBy: string;
  lastModifiedBy: any;
  deletedBy: any;
}

export interface Payment {
  id: string;
  bookId: string;
  code: string;
  description: string;
  email: string;
  paidAmount: number;
  currency: string;
  refundedAmount: any;
  paymentStatus: string;
  paymentType: string;
  paymentMethod: string;
  paymentTiming: string;
  paymentGetway: string;
  getwayTransactionId: string;
  paymentDate: string;
  note: string;
  book: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: any;
  lastModifiedDate: any;
  deletedBy: any;
  deletedDate: any;
}

export interface Room {
  id: string;
  name: string;
}

export interface Discount {
  code: string;
  id: string;
}

export interface BookingDetail {
  success: boolean;
  message: string;
  data: BookResponse;
  status: number;
}
