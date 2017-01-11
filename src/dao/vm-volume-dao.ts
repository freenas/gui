import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VmVolumeDao extends AbstractDao {
    public constructor() {
        super(Model.VmVolume);
    }
}
