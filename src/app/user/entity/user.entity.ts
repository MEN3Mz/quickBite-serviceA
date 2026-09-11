import { SystemRole, UserStatus } from "../enums.ts";
export class User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  passwordHash: string;
  systemRole: SystemRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  status: UserStatus;

  constructor(data: Partial<User>) {
    this.id = data.id!;
    this.name = data.name!;
    this.email = data.email!;
    this.phoneNumber = data.phoneNumber!;
    this.passwordHash = data.passwordHash!;
    this.systemRole = data.systemRole!;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.deletedAt = data.deletedAt ?? null;
    this.status = data.status!;
  }
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }
}
