import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as SvgPanZoom from "svg-pan-zoom";

/// We want the <svg> to take all the space available.
const SVGElementStyle = 'width:100%;height:100%;position:absolute;top:0;left:0;bottom:0;right:0;';

@Component({
    selector: 'app-map-display',
    templateUrl: './map-display.component.html',
    styleUrls: ['./map-display.component.scss']
})
export class MapDisplayComponent implements AfterViewInit {

    @ViewChild('svgContainer', { static: true })
    svgContainer: ElementRef;
    svgElement: SVGSVGElement;

    svgPanZoom: SvgPanZoom.Instance;

    isReady = false;

    @Input()
    public set svg(value: string) {
        // Replace the container content with the new SVG
        this.svgContainer.nativeElement.innerHTML = value;

        // Init svg-pan-zoom. There is a safety to avoid svg-pan-zoom to be loaded before the UI.
        this.update();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (this.svgPanZoom) {
            this.svgPanZoom.resize();
        }
    }

    public ngAfterViewInit() {
        this.isReady = true;

        // Init svg-pan-zoom. This is in the case the UI is slower than the SVG request
        this.update();
    }

    public onClick(event: any) {
        MapDisplayComponent.searchPathForSubsystem(event.path);
    }

    private update() {
        if (this.isReady && this.svgContainer) {
            this.svgElement = this.svgContainer.nativeElement.querySelector('svg');

            // The element may not be ready yet. Ignore if this is the case
            if (this.svgElement) {
                /// We want the <svg> to take all the space available.
                this.svgElement.setAttribute('style', SVGElementStyle);
                this.svgPanZoom = SvgPanZoom(this.svgElement, {
                    contain: true,
                    controlIconsEnabled: true,
                });
            }
        }
    }

    private static searchPathForSubsystem(path: HTMLElement[]) {
        for (const el of path) {
            const id = el.id;
            if (!id) {
                // Ignore this
            } else if (id.startsWith("system_")) {
                console.log(`Found system '${id.substr(7)}'`);
                return;
            } else if (id.startsWith("subsystem_")) {
                console.log(`Found subsystem '${id.substr(10)}'`);
                return;
            }
        }
    }
}
