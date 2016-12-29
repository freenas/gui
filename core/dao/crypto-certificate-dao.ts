import {AbstractDao} from "./abstract-dao-ng";
import Promise = require("bluebird");

export class CryptoCertificateDao extends AbstractDao {
    public constructor() {
        super('CryptoCertificate');
    }

    public listCountryCodes(): Promise<Array<Object>> {
        return this.middlewareClient.callRpcMethod('crypto.certificate.get_country_codes');
    }
}
