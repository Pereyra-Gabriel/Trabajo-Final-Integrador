export interface IProducto {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  score: number;
  imageUrl?: string | undefined;
}
