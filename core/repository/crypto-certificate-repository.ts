import {AbstractRepository} from "./abstract-repository-ng";
import {CryptoCertificateDao} from "../dao/crypto-certificate-dao";
import {ModelEventName} from "../model-event-name";
import {CryptoCertificateType} from "core/model/enumerations/crypto-certificate-type";
import {Map} from "immutable";
import Promise = require("bluebird");
import _ = require("lodash");
import {Model} from "../model";

export class CryptoCertificateRepository extends AbstractRepository {
    private static instance: CryptoCertificateRepository;
    private cryptoCertificates: Map<string, Map<string, any>>;
    private TYPE_TO_LABEL: Map<string, string>;


    private constructor(private cryptoCertificateDao: CryptoCertificateDao) {
        super([Model.CryptoCertificate]);
        this.TYPE_TO_LABEL = Map<string, string>()
            .set(CryptoCertificateType.CERT_INTERNAL, "Create Internal Certificate")
            .set(CryptoCertificateType.CERT_CSR, "Create Signing Request")
            .set(CryptoCertificateType.CERT_EXISTING, "Import Certificate")
            .set(CryptoCertificateType.CA_INTERNAL, "Create Internal CA")
            .set(CryptoCertificateType.CA_INTERMEDIATE, "Create Intermediate CA")
            .set(CryptoCertificateType.CA_EXISTING, "Import CA");
    }

    public static getInstance() {
        if (!CryptoCertificateRepository.instance) {
            CryptoCertificateRepository.instance = new CryptoCertificateRepository(
                new CryptoCertificateDao()            );
        }
        return CryptoCertificateRepository.instance;
    }

    public listCryptoCertificates(): Promise<Array<Object>> {
        return this.cryptoCertificates ? Promise.resolve(this.cryptoCertificates.valueSeq().toJS()) : this.cryptoCertificateDao.list();
    }

    public listCountryCodes() {
        return this.cryptoCertificateDao.listCountryCodes();
    }

    public getNewCryptoCertificate(cryptoCertificateType: string) {
        let label = this.TYPE_TO_LABEL.get(cryptoCertificateType),
            action = cryptoCertificateType === CryptoCertificateType.CA_EXISTING ||
                        cryptoCertificateType === CryptoCertificateType.CERT_EXISTING ? "import" : "creation";
        if (label) {
            return this.cryptoCertificateDao.getNewInstance().then(function(cryptoCertificate) {
                cryptoCertificate._isNewObject = true;
                cryptoCertificate._tmpId = _.kebabCase(cryptoCertificateType);
                cryptoCertificate.type = cryptoCertificateType;
                cryptoCertificate._action = action;
                cryptoCertificate._label = label;

                return cryptoCertificate;
            });
        }
    }

    public saveCryptoCertificate(object: any, isServiceEnabled: boolean) {
        return this.cryptoCertificateDao.save(object, object._isNew ? [null, isServiceEnabled] : [isServiceEnabled]);
    }

    protected handleStateChange(name: string, state: any) {
        this.cryptoCertificates = this.dispatchModelEvents(this.cryptoCertificates, ModelEventName.CryptoCertificate, state);
    }

    protected handleEvent(name: string, data: any) {}
}
