export interface Entry {
    name: string;
    path: string;
    children: Array<Entry>;
    type?: string;
    volume?: any;
    parent?: Entry;
    original?: any;
}
