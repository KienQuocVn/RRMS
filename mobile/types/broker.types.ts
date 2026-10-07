export interface Broker {
  brokerId: string;
  motelId: string;
  name: string;
  phone: string;
  source: string;
  status?: string | null;
  commissionRate: number;
}

export interface BrokerRequest {
  name: string;
  phone: string;
  source: string;
  motelId: string;
  commissionRate: number;
  createAccount: boolean;
}
