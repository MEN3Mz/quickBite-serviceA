export class Address {
  id: number;
  userId: number;
  label: string;
  country: string;
  city: string;
  street: string;
  building: string;
  apartment: string;
  type: string;
  lat: number;
  lng: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  constructor(data: Partial<Address>) {
    const now = new Date();
    this.id = data.id!;
    this.userId = data.userId!;
    this.label = data.label!;
    this.country = data.country!;
    this.city = data.city!;
    this.street = data.street!;
    this.building = data.building!;
    this.apartment = data.apartment!;
    this.type = data.type!;
    this.lat = data.lat!;
    this.lng = data.lng!;
    this.isDefault = data.isDefault!;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.deletedAt = data.deletedAt ?? null;
  }
}
