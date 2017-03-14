import {TreeController} from './TreeController';
import {Entry} from './Entry';
import {VmDatastoreDao} from '../../dao/vm-datastore-dao';
import * as _ from 'lodash';

export class VmDatastoreTreeController implements TreeController {
    public entry: Entry;
    public type: string;
    public parent: Entry;
    public root: string;
    public datastoreId: string;

    private ancestors: Array<Entry>;
    private vmDatastoreDao: VmDatastoreDao;

    public constructor() {
        this.ancestors = [];
        this.vmDatastoreDao = new VmDatastoreDao();
    }

    public open(selectedPath?: string) {
        selectedPath = selectedPath || '/';
        let promise;
        if  (!this.entry || (
                selectedPath !== this.entry.path && (
                    !_.find(this.entry.children, {path: selectedPath}) ||
                    _.find(this.entry.children, {path: selectedPath}).type === 'DIRECTORY'))) {
            promise = this.vmDatastoreDao.listDiskTargetsWithType(this.type, this.datastoreId, selectedPath).then(
                entries => Promise.all(_.map(entries,
                    (entry: any) => {
                        return entry.type === 'DIRECTORY' ?
                            this.vmDatastoreDao.listDiskTargetsWithType(this.type, this.datastoreId, entry.path)
                                .then(children => ([entry, children])) :
                            [entry, []];
                    }
                ))
            ).then(entries => {
                if (this.parent && selectedPath === this.parent.path) {
                    this.entry = (_.assign(this.ancestors.pop(), {children: this.getChildrenFromEntries(entries)}) as Entry);
                } else {
                    let parent = this.entry,
                        child = parent && _.find(parent.children, {path: selectedPath}),
                        type = child ? child.type : 'DIRECTORY';
                    this.ancestors.push(parent);
                    this.entry = {
                        name: _.last(_.split(selectedPath, '/')) + (type === 'DIRECTORY' ? '/' : ''),
                        path: selectedPath,
                        children: this.getChildrenFromEntries(entries),
                        parent: parent,
                        type: type
                    };
                }
                this.parent = _.last(this.ancestors);
            });
        }
        return (promise || Promise.resolve()).then(x => this.entry);
    }

    private getChildrenFromEntries(entries) {
        return _.map(entries, (entry: any) => ({
            name: _.last(_.split(entry[0].path, '/')),
            path: entry[0].path,
            type: entry[0].type,
            original: entry[0],
            children: entry[1]
        }));
    }
}
