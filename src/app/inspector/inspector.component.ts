import { Component, OnInit } from '@angular/core';
import { ObjectType, SelectionReference, SelectorService } from '../selector.service';
import { Graph, ReferenceByIndex, Subsystem, System } from '../../models';
import { GraphUpdaterService } from '../graph-updater.service';

@Component({
    selector: 'app-inspector',
    templateUrl: './inspector.component.html',
    styleUrls: ['./inspector.component.scss']
})
export class InspectorComponent implements OnInit {
    // The current "database" of systems
    graph: Graph = {
        subsystems: [],
        systems: []
    };

    private selectedSystem: System;
    private selectedSubsystem: Subsystem;

    constructor(private graphUpdater: GraphUpdaterService, private selector: SelectorService) {
    }

    ngOnInit() {
        this.graphUpdater.graph.subscribe(graph => this.graph = graph);

        this.selector.selected.subscribe(selected => {
            if (!selected) {
                this.selectedSystem = null;
                this.selectedSubsystem = null;
            } else {
                // Analyse the selection
                switch (selected.type) {
                    case ObjectType.System:
                        this.selectedSystem = this.graph.systems.find(s => s.id == selected.id);
                        this.selectedSubsystem = null;
                        break;
                    case ObjectType.Subsystem:
                        this.selectedSystem = null;
                        this.selectedSubsystem = this.graph.subsystems.find(s => s.id == selected.id);
                        break;
                }
            }
        });
    }

    public selectSubsystem(id: string) {
        this.selector.selectSubsystem(id)
    }

    public selectSystem(id: string) {
        this.selector.selectSystem(id)
    }

    getSubsystem(subsystem: ReferenceByIndex<Subsystem>): Subsystem {
        return this.graph.subsystems[subsystem.index];
    }
}
