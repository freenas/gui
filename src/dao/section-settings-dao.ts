import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import * as Promise from "bluebird";

export class SectionSettingsDao extends AbstractDao {
    private static entries = [];
    public constructor() {
        super(Model.SectionSettings);
    }

    public list(): Promise<Array<any>> {
        return Promise.resolve(SectionSettingsDao.entries);
    }

    public getNewInstance(): Promise<any> {
        return AbstractDao.prototype.getNewInstance.call(this).then(function(instance) {
            SectionSettingsDao.entries.push(instance);
            return instance;
        });
    }
}
