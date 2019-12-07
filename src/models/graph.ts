export interface ReferenceByIndex {
    id: string;
    index: number;
}

interface HowTo {
    url: string;
    text: string;
}

export interface System {
    id: string;
    name: string;
    repo_name: string;
    path: string;
    description?: string;

    parent_system?: ReferenceByIndex; // <System>

    how_to: HowTo[];
}

export interface Subsystem {
    id: string;
    name: string;
    repo_name: string;
    path: string;
    description?: string;

    parent_system?: ReferenceByIndex; // <System>

    dependencies: SubsystemDependency[];
    how_to: HowTo[];
}

export interface SubsystemDependency {
    subsystem: ReferenceByIndex; // <Subsystem>
    why?: string;
}

export interface Graph {
    systems: System[];
    subsystems: Subsystem[];
    tool_version?: string;
}
