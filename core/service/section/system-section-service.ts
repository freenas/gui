import {AbstractSectionService} from "./abstract-section-service-ng";
import {SystemRepository} from "../../repository/system-repository";
import {NtpServerRepository} from "../../repository/ntp-server-repository";
import {VmRepository} from "../../repository/vm-repository";
import {ContainerRepository} from "../../repository/container-repository";
import {NetworkRepository} from "../../repository/network-repository";
import {CryptoCertificateRepository} from "../../repository/crypto-certificate-repository";
import Promise = require("bluebird");
import {TunableRepository} from "../../repository/tunable-repository";

export class SystemSectionService extends AbstractSectionService {
    private systemRepository: SystemRepository;
    private ntpServerRepository: NtpServerRepository;
    private vmRepository: VmRepository;
    private containerRepository: ContainerRepository;
    private networkRepository: NetworkRepository;
    private cryptoCertificateRepository: CryptoCertificateRepository;
    private tunableRepository: TunableRepository;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.ntpServerRepository = NtpServerRepository.getInstance();
        this.vmRepository = VmRepository.instance;
        this.containerRepository = ContainerRepository.instance;
        this.networkRepository = NetworkRepository.getInstance();
        this.cryptoCertificateRepository = CryptoCertificateRepository.getInstance();
        this.tunableRepository = TunableRepository.getInstance();
    }

    protected loadEntries() {
        return this.systemRepository.listSystemSections();
    }

    public getTimezoneOptions() {
        return this.systemRepository.getTimezones();
    }

    public getKeymapOptions() {
        return this.systemRepository.getKeymaps();
    }

    public getSystemGeneral() {
        return this.systemRepository.getGeneral();
    }

    public listNtpServers() {
        return this.ntpServerRepository.listNtpServers();
    }

    public saveNtpServer(ntpServer) {
        return this.ntpServerRepository.saveNtpServer(ntpServer);
    }

    public listVms() {
        return this.vmRepository.listVms();
    }

    public listContainers() {
        return this.containerRepository.listDockerContainers();
    }

    public listNetworkInterfaces() {
        return this.networkRepository.listNetworkInterfaces();
    }

    public listCertificates() {
        return this.cryptoCertificateRepository.listCryptoCertificates();
    }

    public listCountryCodes() {
        return this.cryptoCertificateRepository.listCountryCodes();
    }

    public listTunables() {
        return this.tunableRepository.listTunables();
    }

    protected loadExtraEntries() {
        return undefined;
    }

    protected loadSettings() {
        return undefined;
    }

    protected loadOverview() {
        return undefined;
    }
}
