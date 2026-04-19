/**
 * Contract Type Definitions
 */

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  PENDING = 'PENDING',
}

export interface Contract {
  contractId: string;
  moveinDate: string;
  leaseTerm: string;
  closeContract: string;
  description: string;
  debt: number;
  price: number;
  actualPrice: number;
  deposit: number;
  collectioncycle: string;
  createdate: string;
  signcontract: string;
  status: ContractStatus;
}
