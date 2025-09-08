import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  constructor() { }

  objectToQueryParams(params: any): string {

    if (!params || typeof params !== 'object') return '';

    return '?'+Object.entries(params)
      .filter(([_, value]:any) => value !== null && value !== undefined && value !== '')
      .map(([key, value]:any) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}
