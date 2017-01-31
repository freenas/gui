import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {VmwareDataset} from '../model/VmwareDataset';

export class VmwareDatasetDao extends AbstractDao<VmwareDataset> {

    public constructor() {
        super(Model.VmwareDataset);
    }

}
