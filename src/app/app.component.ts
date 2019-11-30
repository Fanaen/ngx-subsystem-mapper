import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Graph } from '../models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as SvgPanZoom from 'svg-pan-zoom';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    title = 'ngx-subsystem-mapper';
    graph: Graph = {
        subsystems: [],
        systems: []
    };

    @ViewChild('svgContainer', { static: true })
    svgContainer: ElementRef;
    svgElement: SVGSVGElement;

    isReady = false;

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
        this.getGraph();
        this.getSvg();
    }

    getGraph() {
        return this.http.get('http://localhost:4300/graph/json')
            .subscribe(response => {
                this.graph = response as Graph;
            });
    }

    getSvg() {
        const headers = new HttpHeaders();
        headers.set('Accept', 'image/svg+xml');
        return this.http.get('http://localhost:4300/graph/svg', {headers, responseType: 'text'})
            .subscribe(response => {
                this.svgContainer.nativeElement.innerHTML = response;
                this.update();
            })
    }

    ngAfterViewInit() {
        this.isReady = true;
        if (this.svgContainer) {
            this.update();
        }
    }

    private update() {
        if (this.isReady && !this.svgElement) {
            this.svgElement = document.querySelector('#svg-container').querySelector('svg');

            if (this.svgElement) {
                this.svgElement.setAttribute('style', 'width:100%;height:100%;position:absolute;top:0;left:0;bottom:0;right:0;');
                let svgPanZoom: SvgPanZoom.Instance = SvgPanZoom(this.svgElement, {
                    contain: true,
                    controlIconsEnabled: true,
                });
            }
        }
    }
}
