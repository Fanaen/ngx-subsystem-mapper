import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Graph } from '../models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ngx-subsystem-mapper';
    graph: Graph;

    constructor(private http: HttpClient) {
        this.getGraph();
    }

    getGraph() {
        return this.http.get('http://localhost:4300/graph/json')
            .subscribe(response => {
                this.graph = response as Graph;
            });
    }
}
