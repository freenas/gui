export interface Entry {
    name: string;
    path: string;
    children: Array<Entry>;
    volume?: any;
}
