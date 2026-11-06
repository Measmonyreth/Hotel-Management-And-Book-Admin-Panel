export interface Floors {
  message: string
  success: boolean
  status: number 
  data: DataFloors
}

export interface DataFloors {
   floors: Floor[]
  totalfloors: number
  openfloors: number
  closefloors: number
  reservedfloors: number
  maintenancefloors: number
}

export interface Floor {
  id: string
  floorName: string
  floorNumber: string
  description: string
  statusFloor: string
  action: string
  totalRooms: number
  availableRooms: number
  createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
  rooms: Room[]
}

export interface Room {
  id: string
  roomName: string
  roomNumber: string
  description: string
  action: string
  statusRoom: string
  images: Image[]
  roomType: string
  rating: number
  discountPercentage: number
  discountPrice: number
  price: number
  createdDate: string
  lastModifiedDate: any
  deletedDate: any
  createBy: string
  lastModifiedBy: any
  deletedBy: any
  floor: Floor2
}

export interface Image {
  id: string
  fileName: string
  filePath: string
  imageUrl: string
}

export interface Floor2 {
  id: string
  floorNumber: string
}

export interface FloorDetail {
  message: string
  success: boolean
  status: number 
  data: Floor
}