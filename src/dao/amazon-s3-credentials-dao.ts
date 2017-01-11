import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
export class AmazonS3CredentialsDao extends AbstractDao {
    public constructor() {
        super(Model.AmazonS3Credentials);
    }
}
