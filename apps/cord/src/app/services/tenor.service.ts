import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TenorService {
  get key() {
    return 'LR72TKFF15AZ';
  }

  get url() {
    return 'https://g.tenor.com/v1';
  }

  constructor(private http: HttpClient) {}

  // getTrending() {
  //   return lastValueFrom(this.http.get(`${this.url}/trending?key=${this.key}`));
  // }

  async getCategories() {
    const response = await lastValueFrom(this.http.get<any>(`${this.url}/categories?key=${this.key}`));
    return response.tags;
  }

  async search(query: string, limit = 20) {
    const response = await lastValueFrom(
      this.http.get<any>(`${this.url}/search?q=${query}&key=${this.key}&limit=${limit}`)
    );
    return response.results;
  }
}
