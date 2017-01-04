import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VmwareDatasetDao extends AbstractDao {

    public constructor() {
        super(Model.VmwareDataset);
    }

}
