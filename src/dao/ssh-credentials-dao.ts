import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
export class SshCredentialsDao extends AbstractDao {
    public constructor() {
        super(Model.SshCredentials);
    }
}
