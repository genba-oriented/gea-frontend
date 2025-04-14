import { ProductImageDto } from "./ProductImageDto";

export class SellDto {
  id: string;
  userId: string;
  productName: string;
  description: string;
  price: number;
  sellDateTime: string;
  editDateTime: string;
  shippedDateTime: string;
  completedDateTime: string;
  status: string;
  productImages: Array<ProductImageDto>;
}