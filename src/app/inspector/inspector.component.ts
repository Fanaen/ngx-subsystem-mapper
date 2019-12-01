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

    // -- To diplay --
    // 1. for the current system
    public selectedSystem: System;
    public selectedSystemSystems: System[];
    public selectedSystemSubsystems: System[];
    // 2. for the current subsystem
    public selectedSubsystem: Subsystem;

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
                        const { system, index } =  this.findSystem(selected.id);
                        this.selectedSystem = system;
                        this.selectedSystemSystems = this.getSystemsWithParent(index);
                        this.selectedSystemSubsystems = this.getSubsystemsWithParent(index);
                        this.selectedSubsystem = null;
                        break;
                    case ObjectType.Subsystem:
                        this.selectedSystem = null;
                        this.selectedSystemSystems = null;
                        this.selectedSystemSubsystems = null;
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

    getSystemsWithParent(index: number | undefined): System[] {
        if (typeof index == 'number') {
            return this.graph.systems.filter(s => s.parent_system && s.parent_system.index == index);
        }
        else {
            return this.graph.systems.filter(s => !s.parent_system);
        }
    }

    getSubsystemsWithParent(index: number | undefined): System[] {
        if (typeof index == 'number') {
            return this.graph.subsystems.filter(s => s.parent_system && s.parent_system.index == index);
        }
        else {
            return this.graph.subsystems.filter(s => !s.parent_system);
        }
    }

    private findSystem(id: string) {
        const list =  this.graph.systems;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return { system: list[i], index: i };
            }
        }
        return { system: null, index: -1 };
    }
}
