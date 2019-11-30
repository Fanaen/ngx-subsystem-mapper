import { Injectable } from '@angular/core';
import { Subsystem, System } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ObjectType {
    System,
    Subsystem
}

export interface SelectionReference {
    id: string,
    type: ObjectType,
}

@Injectable({
    providedIn: 'root'
})
export class SelectorService {
    private selectedSubject: BehaviorSubject<SelectionReference> = new BehaviorSubject<SelectionReference>(null);

    constructor() {
    }

    public get currentlySelected() {
        return this.selectedSubject.getValue();
    }

    public get selected(): Observable<SelectionReference> {
        return this.selectedSubject;
    }

    select(selection: SelectionReference) {
        this.selectedSubject.next(selection);
    }

    public selectSystem(id: string) {
        this.selectedSubject.next({
            type: ObjectType.System,
            id: id,
        });
    }

    public selectSubsystem(id: string) {
        this.selectedSubject.next({
            type: ObjectType.Subsystem,
            id: id,
        });
    }

    public unselect() {
        this.selectedSubject.next(null);
    }

    public isSelected(analysedSelection: SelectionReference) {
        const currentSelection = this.selectedSubject.getValue();

        // Neither should be null, same type and id
        return analysedSelection && currentSelection
            && analysedSelection.type == currentSelection.type
            && analysedSelection.id == currentSelection.id;

    }
}
