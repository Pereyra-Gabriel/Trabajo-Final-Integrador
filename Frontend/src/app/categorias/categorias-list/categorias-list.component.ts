import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriasService } from '../categorias.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { ICategoria } from '../categoria.model';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMinus, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './categorias-list.component.html',
  styleUrl: './categorias-list.component.css'
})
export class CategoriasListComponent implements OnInit {
  categorias?: Array<ICategoria>;
  isAdmin = false;
  private subscription?: Subscription;

  faMinus = faMinus;
  faPencil = faPen;
  faPlus = faPlus;

  constructor(
    private categoriaService: CategoriasService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.cargarCategorias();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cargarCategorias(): void {
    this.subscription = this.categoriaService.listar().subscribe({
      next: (data: Array<ICategoria>) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al cargar las categorías:', err);
      },
    });
  }

  crearCategoria(): void {
    const nombre = prompt('Introduce el nombre de la nueva categoría:');
    if (nombre) {
      this.categoriaService.crear({ name: nombre }).subscribe({
        next: () => {
          alert('Categoría creada con éxito');
          this.cargarCategorias(); // Recargar categorías después de crear
        },
        error: (err) => {
          console.error('Error al crear la categoría:', err);
        },
      });
    }
  }

  editarCategoria(categoria: ICategoria): void {
    const nuevoNombre = prompt('Editar Categoria', categoria.name);
    if (nuevoNombre && nuevoNombre.trim() !== '') {
      const categoriaActualizada = { ...categoria, name: nuevoNombre.trim() };
      this.categoriaService.actualizar(categoriaActualizada).subscribe({
        next: () => {
          alert('Categoria actualizada con exito');
          this.cargarCategorias();
        },
        error: (err) => {
          console.error('Error al actualizar la categoria;', err);
        },
      });
    }
  }

  eliminarCategoria(id: number | undefined): void {
    if (id !== undefined) {
      if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        this.categoriaService.eliminar(id).subscribe({
          next: () => {
            alert('Categoría eliminada con éxito');
            this.cargarCategorias();
          },
          error: (err) => {
            console.error('Error al eliminar la categoría:', err);
          },
        });
      }
    }
  }
}