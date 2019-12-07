import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FuseResultWithMatches, FuseResultWithScore } from 'fuse.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Graph } from '../models';
import { GraphUpdaterService } from './graph-updater.service';
import * as Fuse from 'fuse.js';
import { ObjectType } from './selector.service';

interface InternalSearchableObject {
    type?: ObjectType;
    id?: string;
    name?: string;
    description?: string;
}

export interface SearchableObject {
    type?: ObjectType;
    id?: string;
    name?: SafeHtml;
    description?: SafeHtml;
}
interface SearchOption extends Fuse.FuseOptions<InternalSearchableObject> {}

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private fuse: Fuse<InternalSearchableObject, SearchOption> = null;
    private readonly options: SearchOption = {
        keys: [ 'id', 'name', 'description'],
        includeMatches: true,
        threshold: 0.3
    };

    private searchStringSubject = new BehaviorSubject<string>('');
    private searchResultSubject = new BehaviorSubject<SearchableObject[]>([]);

    constructor(graphUpdater: GraphUpdaterService, private sanitizer: DomSanitizer) {
        graphUpdater.graph.subscribe(graph => {
            this.fuse = new Fuse(this.graphToIndex(graph), this.options);
            this.updateSearch(this.searchStringSubject.getValue());
        });

        this.searchStringSubject
            .pipe(debounceTime(200))
            .subscribe(q => this.updateSearch(q));
    }

    // -- External API --
    public get isSearching(): Observable<boolean> {
        return this.searchStringSubject
            .pipe(map(q => q.length > 0));
    }

    public get searchResults(): Observable<SearchableObject[]> {
        return this.searchResultSubject.asObservable();
    }

    public search(q: string) {
        this.searchStringSubject.next(q);
    }

    private updateSearch(q: string) {
        const results = this.fuse ? this.fuse.search(q) : [];
        const output: InternalSearchableObject[] = [];

        // The result may or may not have matches and scores
        // We have to handle the cases to make the Typescript compiler happy
        // It also may comes in handy to revert to simpler or to go further down
        // the rabbit hole of search highlight.
        for (const r of results) {
            if ((r as FuseResultWithMatches<InternalSearchableObject> | FuseResultWithScore<InternalSearchableObject>).item) {
                // We have matches and or scores
                const result = (r as FuseResultWithMatches<InternalSearchableObject> | FuseResultWithScore<InternalSearchableObject>);
                const item = {
                    ...result.item
                };

                if ((r as FuseResultWithMatches<InternalSearchableObject>).matches) {
                    const matches = (r as FuseResultWithMatches<InternalSearchableObject>).matches;

                    // Process matches
                    for (const m of matches) {
                        if (m.key === 'name' || m.key === 'description') {
                            let field = item[m.key];

                            // There may be more than one by field
                            // We proceed by revers order to avoid index invalidation
                            // when we edit the string
                            for (const indices of m.indices.reverse()) {
                                const start = indices[0];
                                const end = indices[1] + 1;

                                // Insert span with .hl css class to get the highlight effect
                                field = `${field.slice(0, start)}<span class="hl">${field.slice(start, end)}</span>${field.slice(end)}`;
                            }

                            item[m.key] = field;
                        }
                    }
                }

                output.push(item);
            } else {
                // There is just the result. Use as is.
                output.push(r as InternalSearchableObject);
            }
        }

        this.searchResultSubject.next(output.map(o => ({
            type: o.type,
            id: o.id,
            name: this.sanitizer.bypassSecurityTrustHtml(o.name),
            description: this.sanitizer.bypassSecurityTrustHtml(o.description),
        })));
    }

    // -- Internals --

    private graphToIndex(graph: Graph) {
        return [
            ...graph.subsystems.map(subsystem => ({
                type: ObjectType.Subsystem,
                id: subsystem.id,
                name: subsystem.name,
                description: subsystem.description,
            })),
            ...graph.systems.map(system => ({
                type: ObjectType.System,
                id: system.id,
                name: system.name,
                description: system.description,
            }))
        ];
    }
}
