export interface ReferenceByIndex<T> {
    id: string,
    index: number,
}

export interface System {
    id: string,
    name: string,
    repo_name: string,
    path: string,
    description?: string,

    parent_system?: ReferenceByIndex<System>,
}

export interface Subsystem {
    id: string,
    name: string,
    repo_name: string,
    path: string,
    description?: string,

    parent_system?: ReferenceByIndex<System>,

    dependencies: SubsystemDependency[],
}

export interface SubsystemDependency {
    subsystem: ReferenceByIndex<Subsystem>,
    why?: string,
}

export interface Graph {
    systems: System[],
    subsystems: Subsystem[],
}
