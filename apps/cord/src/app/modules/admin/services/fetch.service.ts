import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IDateRange } from './date-range';

export abstract class FetchService {
  abstract get(query: string): FetchBatch;
}

@Injectable()
export class PrometheusFetchService extends FetchService {
  constructor(private http: HttpClient) {
    super();
  }

  get(query: string): FetchBatch {
    return new FetchBatch(this.http, query);
  }
}

class FetchBatch {
  private endpoint = 'http://localhost:9090/api/v1';
  private dateRange?: IDateRange;

  constructor(private http: HttpClient, private query: string) {}

  setRange(dateRange: IDateRange) {
    this.dateRange = dateRange;
    return this;
  }

  async fetch(): Promise<any[]> {
    if (!this.dateRange) {
      throw new Error('dateRange not set');
    }

    const params = new HttpParams().append('query', this.query).append('start', this.dateRange.start.toMillis() * 1000);

    const response = await lastValueFrom(this.http.get<any>(`${this.endpoint}/query`, { params }));
    return response.data.result[0].values; // TODO: check this
  }

  async fetchRange(): Promise<any[]> {
    if (!this.dateRange) {
      throw new Error('dateRange not set');
    }

    const params = new HttpParams()
      .append('query', this.query)
      .append('start', this.dateRange.start.toMillis() * 1000)
      .append('end', this.dateRange.end.toMillis() * 1000)
      .append('step', this.dateRange.calculateStep());

    const response = await lastValueFrom(this.http.get<any>(`${this.endpoint}/query_range`, { params }));
    return response.data.result[0].values;
  }
}
