import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { ICarritoItem } from './carrito-item.model';
import { CarritoService } from './carrito.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IProducto } from '../productos/producto.model';
import { IVenta } from '../venta.model';
import { VentasService } from '../ventas.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CurrencyPipe],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit {
  faCreditCard = faCreditCard;

  items: ICarritoItem[] = [];

  constructor(private carritoService: CarritoService,
              private ventasService: VentasService,
              private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  getTotal(): number {
    return this.carritoService.getTotal();
  }

  incrementarCantidad(item: ICarritoItem) {
    this.carritoService.agregarProducto(item.producto, 1);
  }

  disminuirCantidad(item: ICarritoItem) {
    if (item.cantidad > 1) {
      this.carritoService.agregarProducto(item.producto, -1);
    } else {
      const confirmacion = confirm(
        '¿Deseas eliminar este producto del carrito?'
      );
      if (confirmacion) {
        this.eliminarProducto(item.producto);
      }
    }
  }

  eliminarProducto(producto: IProducto){
    this.carritoService.eliminarProducto(producto);
  }

  comprar() {
    const venta: IVenta = {
      id: 0, 
      fecha: new Date(),
      comprador: this.authService.currentUser.username || '',
      total: this.getTotal(),
      detalles: this.items.map(item => ({
        id: 0, 
        ventaId: 0, 
        productoId: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.price,
        subtotal: item.cantidad * item.producto.price
      }))
    };
  
    this.ventasService.registrar(venta)
  .subscribe({
    next: (respuesta: IVenta) => {
      alert(`Hemos registrado tu venta con el ID ${respuesta.id} y te contactaremos a la brevedad. Podrás utilizar este código para realizar el seguimiento de tu compra.`);
      this.carritoService.vaciarCarrito();
    },
    error: (error) => {
      console.error('Error al registrar la venta:', error);
      alert('Ocurrió un error al procesar tu compra. Por favor, intenta nuevamente más tarde.');
    }
  });
  }
}
