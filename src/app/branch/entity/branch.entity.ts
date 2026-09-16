import { Currency } from "../enums.ts";
export class BranchEntity {
  id: number;
  restaurantId: number;
  countryCode: string;
  addressText: string;
  label: string;
  lat: number;
  lng: number;
  isActive: boolean;
  opensAt: string;
  closesAt: string;
  acceptingOrders: boolean;
  createdAt: Date;
  updatedAt: Date;
  deliveryRadius: number;
  currency: Currency;
  comission: number;

  constructor(data: Partial<BranchEntity>) {
    const now = new Date();
    this.id = data.id!;
    this.restaurantId = data.restaurantId!;
    this.countryCode = data.countryCode!;
    this.addressText = data.addressText!;
    this.label = data.label!;
    this.lat = data.lat!;
    this.lng = data.lng!;
    this.isActive = data.isActive ?? true;
    this.opensAt = data.opensAt!;
    this.closesAt = data.closesAt!;
    this.acceptingOrders = data.acceptingOrders ?? true;
    this.createdAt = data.createdAt ?? now;
    this.updatedAt = data.updatedAt ?? now;
    this.deliveryRadius = data.deliveryRadius!;
    this.currency = data.currency!;
    this.comission = data.comission!;
  }
}
