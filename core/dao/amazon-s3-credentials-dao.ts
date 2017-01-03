import {AbstractDao} from "./abstract-dao";
export class AmazonS3CredentialsDao extends AbstractDao {
    public constructor() {
        super('AmazonS3Credentials');
    }
}
