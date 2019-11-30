import { Injectable } from '@angular/core';
import { Graph } from '../models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GraphUpdaterService {
    constructor(private http: HttpClient) {
    }

    public get svg(): Observable<string> {
        const headers = new HttpHeaders();
        headers.set('Accept', 'image/svg+xml');
        return this.http.get(`${environment.serverUrl}/graph/svg`, {headers, responseType: 'text'})
    }

    public get graph(): Observable<Graph> {
        return this.http.get(`${environment.serverUrl}/graph/json`) as Observable<Graph>;
    }
}
