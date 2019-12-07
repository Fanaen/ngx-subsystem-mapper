import { Injectable } from '@angular/core';
import { Graph, Subsystem, System } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ObjectType, SelectionReference } from './selector.service';

@Injectable({
    providedIn: 'root'
})
export class GraphUpdaterService {
    private graphSubject: BehaviorSubject<Graph> = new BehaviorSubject<Graph>({
        systems: [],
        subsystems: []
    });
    private svgSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private http: HttpClient) {
        // SVG
        const headers = new HttpHeaders();
        headers.set('Accept', 'image/svg+xml');
        this.http.get(`${environment.serverUrl}/graph/svg`, {headers, responseType: 'text'})
            .subscribe(svg => this.svgSubject.next(svg));

        // JSON
        this.http.get(`${environment.serverUrl}/graph/json`)
            .subscribe(graph => this.graphSubject.next(graph as Graph));
    }

    public get svg(): Observable<string> {
        return this.svgSubject.asObservable();
    }

    public get graph(): Observable<Graph> {
        return this.graphSubject.asObservable();
    }

    public getFromSelection(selection: SelectionReference): System | Subsystem | undefined {
        if (!selection) {
            return undefined;
        } else {
            switch (selection.type) {
                case ObjectType.System:
                    return this.graphSubject.getValue().systems.find(s => s.id === selection.id);
                case ObjectType.Subsystem:
                    return this.graphSubject.getValue().subsystems.find(s => s.id === selection.id);
                default:
                    return undefined;
            }
        }
    }
}
