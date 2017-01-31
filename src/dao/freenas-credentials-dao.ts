import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {FreenasCredentials} from '../model/FreenasCredentials';
export class FreenasCredentialsDao extends AbstractDao<FreenasCredentials> {
    public constructor() {
        super(Model.FreenasCredentials);
    }
}
