import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {SshCredentials} from '../model/SshCredentials';
export class SshCredentialsDao extends AbstractDao<SshCredentials> {
    public constructor() {
        super(Model.SshCredentials);
    }
}
