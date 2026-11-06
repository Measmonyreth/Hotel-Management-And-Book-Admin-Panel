export interface Rooms {
  success: boolean;
  message: string;
  data: DataRooms;
}

export interface DataRooms {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  outOfServiceRooms: number;
  pendingRooms: number;
  cleaningRooms: number;
  singleRooms: number;
  doubleRooms: number;
  suiteRooms: number;
  twinRooms: number;
  familyRooms: number;
  closeRooms: number;
  deletedRooms: number;
  rooms: Room[];
}

export interface Room {
  id: string;
  roomName: string;
  roomNumber: string;
  description: string;
  action: string;
  statusRoom: string;
  images: Image[];
  roomType: string;
  rating: number;
  discountPercentage: number;
  discountPrice: number;
  price: number;
  createdDate: string;
  lastModifiedDate: any;
  deletedDate: any;
  createBy: string;
  lastModifiedBy: any;
  deletedBy: any;
  floor: Floor;
}

export interface Image {
  id: string;
  fileName: string;
  filePath: string;
  imageUrl: string;
}

export interface Floor {
  floorNumber: string;
  id: string;
}
