import {AbstractRepository} from './abstract-repository';
import {CryptoCertificateDao} from '../dao/crypto-certificate-dao';
import {ModelEventName} from '../model-event-name';
import {CryptoCertificateType} from '../model/enumerations/CryptoCertificateType';
import {Model} from '../model';
import {Map} from 'immutable';
import * as _ from 'lodash';
import {CryptoCertificate} from '../model/CryptoCertificate';

export class CryptoCertificateRepository extends AbstractRepository<CryptoCertificate> {
    private static instance: CryptoCertificateRepository;
    private cryptoCertificates: Map<string, Map<string, any>>;

    public  static readonly SELF_SIGNED = 'Self Signed';
    public  static readonly IMPORT = 'import';
    public  static readonly CREATION = 'creation';

    private TYPE_TO_LABEL: Map<string, string>;
    private static readonly SELF_SIGNED_TYPES = [CryptoCertificateType.CA_INTERNAL, CryptoCertificateType.CERT_INTERNAL];


    private constructor(private cryptoCertificateDao: CryptoCertificateDao) {
        super([Model.CryptoCertificate]);
        this.TYPE_TO_LABEL = Map<string, string>()
            .set(CryptoCertificateType.CERT_INTERNAL, 'Create Internal Certificate')
            .set(CryptoCertificateType.CERT_CSR, 'Create Signing Request')
            .set(CryptoCertificateType.CERT_EXISTING, 'Import Certificate')
            .set(CryptoCertificateType.CA_INTERNAL, 'Create Internal CA')
            .set(CryptoCertificateType.CA_INTERMEDIATE, 'Create Intermediate CA')
            .set(CryptoCertificateType.CA_EXISTING, 'Import CA');
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
            action =    cryptoCertificateType === CryptoCertificateType.CA_EXISTING ||
                        cryptoCertificateType === CryptoCertificateType.CERT_EXISTING ?
                            CryptoCertificateRepository.IMPORT :
                            CryptoCertificateRepository.CREATION;
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

    public saveCryptoCertificate(certificate: any) {
        let promise;
        if (certificate._action === CryptoCertificateRepository.IMPORT) {
            promise = this.cryptoCertificateDao.import(certificate);
        } else {
            certificate.selfsigned =    (!certificate.signing_ca_name || CryptoCertificateRepository.SELF_SIGNED === certificate.signing_ca_name) &&
                                        _.includes(CryptoCertificateRepository.SELF_SIGNED_TYPES, certificate.type);
            promise = this.cryptoCertificateDao.save(certificate);
        }

        return promise;
    }

    protected handleStateChange(name: string, state: any) {
        this.cryptoCertificates = this.dispatchModelEvents(this.cryptoCertificates, ModelEventName.CryptoCertificate, state);
    }



    protected handleEvent(name: string, data: any) {}
}
