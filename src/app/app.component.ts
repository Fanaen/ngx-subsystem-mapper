import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Graph } from '../models';
import { GraphUpdaterService } from './graph-updater.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ngx-subsystem-mapper';
    graph: Graph = {
        subsystems: [],
        systems: []
    };
    svg: string;

    constructor(graphUpdater: GraphUpdaterService) {
        graphUpdater.graph.subscribe(graph => this.graph = graph);
        graphUpdater.svg.subscribe(svg => this.svg = svg);
    }
}
