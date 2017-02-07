import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {AmazonS3Credentials} from '../model/AmazonS3Credentials';

export class AmazonS3CredentialsDao extends AbstractDao<AmazonS3Credentials> {
    public constructor() {
        super(Model.AmazonS3Credentials);
    }
}
