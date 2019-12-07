import { Component } from '@angular/core';
import { SearchService } from './search.service';
import { SelectorService } from './selector.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private searchService: SearchService, private selector: SelectorService) {}

    search($event: Event) {
        const q = ($event.target as HTMLInputElement).value;
        this.searchService.search(q);

        // If we start a new search, unselect everything
        if (q && q.length) {
            this.selector.unselect();
        }
    }
}
