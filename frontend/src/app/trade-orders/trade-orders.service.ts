import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

export interface TradeOrder {
  id: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop'
  amount: number
  price: number
  status: "open" | "cancelled" | "executed"
  pair: string
  createdAt: Date
  updatedAt: Date
  isDeleted?: boolean
  deletedAt?: Date
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse {
  tradeOrders: TradeOrder[];
  pagination: PaginationInfo;
}

@Injectable({
  providedIn: 'root'
})
export class TradeOrdersService {
  endpoint = 'trade-orders';
  pairs = ['BTCUSD', 'EURUSD', 'ETHUSD'];

  constructor(
    private apiService: ApiService
  ) {}

  create(data: TradeOrder): Observable<TradeOrder> {
    return this.apiService.post(`${this.endpoint}`, data);
  }

  get(id: string): Observable<TradeOrder> {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }

  list(page: number = 1, limit: number = 10): Observable<PaginatedResponse> {
    return new Observable<PaginatedResponse>(
      observer => {
        this.apiService.get(`${this.endpoint}?page=${page}&limit=${limit}`).subscribe({
          next: (response: any) => {
            observer.next({
              tradeOrders: response.data.tradeOrders,
              pagination: response.pagination
            });
            observer.complete();
          },
          error: (error: any) => {
            observer.error(error);
          }
        });
      }
    )
  }

  // Método para backward compatibility
  listWithOffset(init: number = 0, limit: number = 10): Observable<{tradeOrders: TradeOrder[], totalCount: number}> {
    return new Observable<{tradeOrders: TradeOrder[], totalCount: number}>(
      observer => {
        this.apiService.get(`${this.endpoint}?init=${init}&limit=${limit}`).subscribe({
          next: (response: any) => {
            observer.next({
              tradeOrders: response.data.tradeOrders,
              totalCount: response.pagination?.totalCount || 0
            });
            observer.complete();
          },
          error: (error: any) => {
            observer.error(error);
          }
        });
      }
    )
  }

  delete(id: string): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

}
