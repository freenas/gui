import {TreeController} from './TreeController';
import {Entry} from './Entry';
import * as _ from 'lodash';

export class StaticTreeController implements TreeController {
    public entry: Entry;
    public type: string;
    public parent: Entry;
    public root: string;

    public entries: Array<Entry>;

    public open(selectedPath?: string) {
        this.parent = {
            name: '/',
            path: '/',
            children: this.entries
        };
        if (selectedPath) {
            this.entry = _.find(this.entries, {path: selectedPath}) || this.parent;
        }
        if (this. entry && this.entry.path === this.parent.path) {
            this.parent = null;
        }
    }
}
