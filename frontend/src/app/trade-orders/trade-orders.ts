import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TradeOrdersService, TradeOrder, PaginationInfo } from './trade-orders.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trade-orders',
  imports: [
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './trade-orders.html',
  styleUrl: './trade-orders.scss'
})
export class TradeOrdersComponent implements OnInit {
  tradeOrders: TradeOrder[] = [];
  pagination: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false
  };
  displayedColumns: string[] = ['side', 'type'];
  isLoading = false;

  // Opções para itens por página
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  // Exposição do Math para o template
  Math = Math;

  constructor(
    private tradeOrdersService: TradeOrdersService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTradeOrders();
  }

  private loadTradeOrders() {
    this.isLoading = true;

    this.tradeOrdersService.list(this.pagination.currentPage, this.pagination.pageSize).subscribe({
      next: (response) => {
        this.tradeOrders = response.tradeOrders;
        this.pagination = response.pagination;
        console.log('Trade orders loaded:', this.tradeOrders);
        console.log('Pagination info:', this.pagination);
      },
      error: (error: any) => {
        console.error('Error loading trade orders:', error);
        this.snackBar.open('Error loading trade orders', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }

    });
  }

  getSideClass(side: string): string {
    return side === 'buy' ? 'side-buy' : 'side-sell';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'status-open';
      case 'executed': return 'status-executed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'market': return 'flash_on';
      case 'limit': return 'trending_flat';
      case 'stop': return 'stop';
      default: return 'help_outline';
    }
  }

  getOpenOrdersCount(): number {
    return this.tradeOrders.filter(order => order.status === 'open').length;
  }

  getExecutedOrdersCount(): number {
    return this.tradeOrders.filter(order => order.status === 'executed').length;
  }

  getCancelledOrdersCount(): number {
    return this.tradeOrders.filter(order => order.status === 'cancelled').length;
  }

  deleteOrder(order: TradeOrder) {
    if (confirm(`Are you sure you want to delete this ${order.side} ${order.type} order for ${order.pair}?`)) {
      this.tradeOrdersService.delete(order.id).subscribe({
        next: () => {
          this.snackBar.open('Order deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadTradeOrders();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.snackBar.open('Error deleting order', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  refreshOrders() {
    this.loadTradeOrders();
  }

  // Métodos de paginação
  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.loadTradeOrders();
    }
  }

  nextPage() {
    if (this.pagination.hasNextPage) {
      this.goToPage(this.pagination.currentPage + 1);
    }
  }

  previousPage() {
    if (this.pagination.hasPreviousPage) {
      this.goToPage(this.pagination.currentPage - 1);
    }
  }

  changePageSize(newSize: number) {
    this.pagination.pageSize = newSize;
    this.pagination.currentPage = 1; // Reset para primeira página
    this.loadTradeOrders();
  }

  // Método para obter array de páginas para exibir na paginação
  getPageNumbers(): number[] {
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.currentPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      // Se há 7 ou menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com ellipsis
      if (currentPage <= 4) {
        // Primeiras páginas: 1, 2, 3, 4, 5, ..., last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Representa "..."
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Últimas páginas: 1, ..., last-4, last-3, last-2, last-1, last
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas do meio: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  }
}
