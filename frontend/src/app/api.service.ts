import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
  ) {}

  get(endpoint: string): Observable<any> {
    return this.httpClient.put(`${environment.apiURL}${endpoint}`,{});
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}${endpoint}`, data);
  }

  put(endpoint: string, data: any): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}${endpoint}`, data);
  }

  patch(endpoint: string, data: any): Observable<any> {
    return this.httpClient.patch(`${environment.apiURL}${endpoint}`, data);
  }

  delete(endpoint: string) {
    return this.httpClient.delete(`${environment.apiURL}${endpoint}`);
  }

}
