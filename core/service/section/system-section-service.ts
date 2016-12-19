import {AbstractSectionService} from "./abstract-section-service-ng";
import {SystemRepository} from "../../repository/system-repository";
import {NtpServerRepository} from "../../repository/ntp-server-repository";
import {VmRepository} from "core/repository/vm-repository";
import {ContainerRepository} from "core/repository/container-repository";
import {NetworkRepository} from "core/repository/network-repository";

export class SystemSectionService extends AbstractSectionService {
    private systemRepository: SystemRepository;
    private ntpServerRepository: NtpServerRepository;
    private vmRepository: VmRepository;
    private containerRepository: ContainerRepository;
    private networkRepository: NetworkRepository;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.ntpServerRepository = NtpServerRepository.getInstance();
        this.vmRepository = VmRepository.instance;
        this.containerRepository = ContainerRepository.instance;
        this.networkRepository = NetworkRepository.instance;
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

    protected loadExtraEntries() {
    }

    protected loadSettings() {
    }

    protected loadOverview() {
    }
}
