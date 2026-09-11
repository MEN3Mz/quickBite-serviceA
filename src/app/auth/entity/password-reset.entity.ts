export class PasswordReset {
  id: number;
  userId: number;
  otpHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
  constructor(data: Partial<PasswordReset>) {
    const now = new Date();
    this.id = data.id!;
    this.userId = data.userId!;
    this.otpHash = data.otpHash!;
    this.expiresAt = data.expiresAt ?? now;
    this.consumedAt = data.consumedAt ?? null;
    this.createdAt = data.createdAt ?? now;
  }
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
