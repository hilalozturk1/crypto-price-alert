export enum AlertType {
  ABOVE = "above",
  BELOW = "below",
}

export interface IAlert {
  userId: string;
  symbol: string;
  targetPrice: number;
  alertType: AlertType;
  isActive: boolean;
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
