import {AbstractSectionService} from "./abstract-section-service-ng";
import {SystemRepository} from "../../repository/system-repository";
import {NtpServerRepository} from "../../repository/ntp-server-repository";
import {VmRepository} from "../../repository/vm-repository";
import {ContainerRepository} from "../../repository/container-repository";
import {NetworkRepository} from "../../repository/network-repository";
import {CryptoCertificateRepository} from "../../repository/crypto-certificate-repository";
import Promise = require("bluebird");
import {TunableRepository} from "../../repository/tunable-repository";
import {BootPoolRepository} from "../../repository/boot-pool-repository";
import {ModelEventName} from "../../model-event-name";
import {DataObjectChangeService} from "../data-object-change-service";
import * as Immutable from "immutable";
import * as _ from "lodash";


export class SystemSectionService extends AbstractSectionService {
    private systemRepository: SystemRepository;
    private ntpServerRepository: NtpServerRepository;
    private vmRepository: VmRepository;
    private containerRepository: ContainerRepository;
    private networkRepository: NetworkRepository;
    private cryptoCertificateRepository: CryptoCertificateRepository;
    private tunableRepository: TunableRepository;
    private bootPoolRepository: BootPoolRepository;
    private bootEnvironments: Array<any> = [];
    private dataObjectChangeService: DataObjectChangeService;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.ntpServerRepository = NtpServerRepository.getInstance();
        this.vmRepository = VmRepository.instance;
        this.containerRepository = ContainerRepository.instance;
        this.networkRepository = NetworkRepository.getInstance();
        this.cryptoCertificateRepository = CryptoCertificateRepository.getInstance();
        this.tunableRepository = TunableRepository.getInstance();
        this.bootPoolRepository = BootPoolRepository.getInstance();
        this.dataObjectChangeService = new DataObjectChangeService();

        this.eventDispatcherService.addEventListener(
            ModelEventName.BootEnvironment.listChange,
            this.handleBootPoolChange.bind(this)
        );
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

    public listBootEnvironments () {
        return this.bootPoolRepository.listBootEnvironments().then((bootEnvironments) => {
            return _.assign(this.bootEnvironments, bootEnvironments);
        });
    }

    public getBootVolumeConfig () {
        return this.bootPoolRepository.getBootPoolConfig().then((bootVolumeConfig) => {
            return (bootVolumeConfig as any).data;
        });
    }

    private handleBootPoolChange (bootEnvironments: Immutable.Map<string, Immutable.Map<string, any>>) {
        this.dataObjectChangeService.handleDataChange(this.bootEnvironments, bootEnvironments);
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
