import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import Promise = require("bluebird");

export class CryptoCertificateDao extends AbstractDao {
    public constructor() {
        super(Model.CryptoCertificate);
    }

    public listCountryCodes(): Promise<Array<Object>> {
        return this.middlewareClient.callRpcMethod('crypto.certificate.get_country_codes');
    }
}
