
export interface IVenta {
    id: number;
  fecha: Date;
  comprador: string;
  total: number;
  detalles: Array<IDetalleVenta>;
}

export interface IDetalleVenta {
    id: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}