export enum DeliveryStatus {
  CREATED = "CREATED",
  EN_ROUTE = "EN_ROUTE",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
}

export interface Delivery {
  id: string;
  status: DeliveryStatus;
  courierEmail: string;
  customerEmail: string;
  boxId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryWithTrackingUrl {
  delivery: Delivery;
  trackUrl: string;
}

export interface CreateDeliveryResponse {
  delivery: Delivery;
  trackUrl: string;
}

export interface DeliveryUpdate {
  id: string;
  courierEmail: string;
  customerEmail: string;
  boxId: string;
}

export interface DeliveryInput {
  courierEmail?: string;
  customerEmail?: string;
  boxId?: string;
}
