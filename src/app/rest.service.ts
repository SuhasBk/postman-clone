import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  performProxyRequest(body) {
    return this.http.post('http://localhost:5000/perform', body);
  }
}
