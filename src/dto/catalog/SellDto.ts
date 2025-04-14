export class SellDto {
  id: string;
  userId: string;
  productName: string;
  description: string;
  price: number;
  sellDateTime: string;
  sold: boolean;
  productImageIds: Array<string>;

}