import {Entry} from './Entry';
export interface TreeController {
    entry: Entry;
    type: string;
    parent: Entry;
    root: string;

    open(selectedPath: string);
}
