import { SellDto } from "../sell/SellDto";

export class BuyDto {
  id: string;
  sellId: string;
  userId: string;
  buyDateTime: string;
  reviewed: boolean;
  sell: SellDto;
}