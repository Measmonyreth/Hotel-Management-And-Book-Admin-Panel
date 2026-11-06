export interface NotificationResponse {
  message: string;
  success: boolean;
  status: number;
  data: Data;
}

export interface NotificationDetailResponse {
  message: string;
  success: boolean;
  status: number;
  data: Notification;
}

export interface Data {
  totalNotification: number;
  totalUnreadNotification: number;
  totalReadNotification: number;
  totalPersonalNotification: number;
  totalGeneralNotification: number;
  notificationResponses: Notification[];
}

export interface Notification {
  id: string;
  scope: string;
  type: string;
  title: string;
  body: string;
  entityType: any;
  entityId: any;
  paidStatus: any;
  actionUrl: any;
  data: any;
  createdDate: string;
  lastModifiedDate: any;
  deletedDate: any;
  createBy: string;
  lastModifiedBy: any;
  deletedBy: any;
  customer_notificationResponse: CustomerNotificationResponse[];
  notificationImageResponses: NotificationImageResponse[];
  customer?: Customer;
  readAt?: string;
}

export interface CustomerNotificationResponse {
  id: number;
  customer?: Customer;
  readAt?: string;
}

export interface Customer {
  name?: string;
  fullName?: string;
  id: number;
  email: string;
}

export interface NotificationImageResponse {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  type: string;
  notification_url: string;
}
