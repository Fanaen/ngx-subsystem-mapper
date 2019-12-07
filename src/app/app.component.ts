import { Component } from '@angular/core';
import { GraphUpdaterService } from './graph-updater.service';
import { SearchService } from './search.service';
import { SelectorService } from './selector.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public toolVersion: string;
    constructor(private searchService: SearchService, private selector: SelectorService, graphUpdater: GraphUpdaterService) {
        // Get the version of the tool to display
        graphUpdater.graph.subscribe(g => this.toolVersion = g.tool_version);
    }

    search($event: Event) {
        const q = ($event.target as HTMLInputElement).value;
        this.searchService.search(q);

        // If we start a new search, unselect everything
        if (q && q.length) {
            this.selector.unselect();
        }
    }
}
