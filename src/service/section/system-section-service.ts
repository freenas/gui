import {AbstractSectionService} from './abstract-section-service-ng';
import {SystemRepository} from '../../repository/system-repository';
import {NtpServerRepository} from '../../repository/ntp-server-repository';
import {VmRepository} from '../../repository/vm-repository';
import {NetworkRepository} from '../../repository/network-repository';
import {CryptoCertificateRepository} from '../../repository/crypto-certificate-repository';
import {TunableRepository} from '../../repository/tunable-repository';
import {VolumeRepository} from '../../repository/volume-repository';
import {ShareRepository} from '../../repository/share-repository';
import {PeerRepository} from '../../repository/peer-repository';
import {ReplicationRepository} from '../../repository/replication-repository';
import {DiskRepository} from '../../repository/disk-repository';
import {AlertFilterRepository} from '../../repository/alert-filter-repository';
import {BootPoolRepository} from '../../repository/boot-pool-repository';
import {AlertEmitterPushBulletRepository} from '../../repository/alert-emitter-push-bullet-repository';
import {AlertEmitterRepository} from '../../repository/alert-emitter-repository';
import {ModelEventName} from '../../model-event-name';
import * as _ from 'lodash';
import {DockerContainerRepository} from '../../repository/docker-container-repository';
import {BootEnvironment} from '../../model/BootEnvironment';
import {SubmittedTask} from '../../model/SubmittedTask';
import {AlertFilter} from '../../model/AlertFilter';

export class SystemSectionService extends AbstractSectionService {
    private systemRepository: SystemRepository;
    private ntpServerRepository: NtpServerRepository;
    private vmRepository: VmRepository;
    private dockerContainerRepository: DockerContainerRepository;
    private networkRepository: NetworkRepository;
    private cryptoCertificateRepository: CryptoCertificateRepository;
    private tunableRepository: TunableRepository;
    private volumeRepository: VolumeRepository;
    private shareRepository: ShareRepository;
    private peerRepository: PeerRepository;
    private replicationRepository: ReplicationRepository;
    private diskRepository: DiskRepository;
    private bootPoolRepository: BootPoolRepository;
    private alertFilterRepository: AlertFilterRepository;
    private initialDiskAllocationPromise: Promise<any>;
    private alertEmitterPushBulletRepository: AlertEmitterPushBulletRepository;
    private alertEmitterRepository: AlertEmitterRepository;
    public readonly SELF_SIGNED = CryptoCertificateRepository.SELF_SIGNED;

    public readonly CREATION = CryptoCertificateRepository.CREATION;
    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.ntpServerRepository = NtpServerRepository.getInstance();
        this.vmRepository = VmRepository.getInstance();
        this.dockerContainerRepository = DockerContainerRepository.getInstance();
        this.networkRepository = NetworkRepository.getInstance();
        this.cryptoCertificateRepository = CryptoCertificateRepository.getInstance();
        this.tunableRepository = TunableRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
        this.shareRepository = ShareRepository.getInstance();
        this.peerRepository = PeerRepository.getInstance();
        this.replicationRepository = ReplicationRepository.getInstance();
        this.diskRepository = DiskRepository.getInstance();
        this.bootPoolRepository = BootPoolRepository.getInstance();
        this.alertFilterRepository = AlertFilterRepository.getInstance();
        this.alertEmitterPushBulletRepository = AlertEmitterPushBulletRepository.getInstance();
        this.alertEmitterRepository = AlertEmitterRepository.getInstance();


        this.eventDispatcherService.addEventListener(
            ModelEventName.Disk.listChange,
            this.handleDisksChange.bind(this)
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

    public saveSystemGeneral(systemGeneral) {
        return this.systemRepository.saveGeneral(systemGeneral);
    }

    public getSystemTime() {
        return this.systemRepository.getTime();
    }

    public getSystemVersion() {
        return this.systemRepository.getVersion();
    }

    public getSystemDataset() {
        return this.systemRepository.getDataset();
    }

    public getSystemAdvanced() {
        return this.systemRepository.getAdvanced();
    }

    public saveSystemAdvanced(systemAdvanced) {
        return this.systemRepository.saveAdvanced(systemAdvanced);
    }

    public listNtpServers() {
        return this.ntpServerRepository.listNtpServers();
    }

    public saveNtpServer(ntpServer, force) {
        return this.ntpServerRepository.saveNtpServer(ntpServer, force);
    }

    public listVms() {
        return this.vmRepository.listVms();
    }

    public listContainers() {
        return this.dockerContainerRepository.list();
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
        return this.bootPoolRepository.loadBootEnvironments().then(() => this.bootPoolRepository.listBootEnvironments());
    }

    public saveBootEnvironment(bootEnvironment: BootEnvironment): Promise<SubmittedTask> {
        return this.bootPoolRepository.saveBootEnvironment(bootEnvironment);
    }

    public keepBootEnvironment(bootEnvironment: BootEnvironment): Promise<SubmittedTask> {
        return this.setKeepBootEnvironment(bootEnvironment, true);
    }

    public dontKeepBootEnvironment(bootEnvironment: BootEnvironment): Promise<SubmittedTask> {
        return this.setKeepBootEnvironment(bootEnvironment, false);
    }

    public cloneBootEnvironment(bootEnvironment: BootEnvironment): Promise<SubmittedTask> {
        return this.bootPoolRepository.cloneBootEnvironment(bootEnvironment);
    }

    public deleteBootEnvironment(bootEnvironment: BootEnvironment): Promise<SubmittedTask> {
        return this.bootPoolRepository.deleteBootEnvironment(bootEnvironment);
    }

    public activateBootEnvironment(bootEnvironment: BootEnvironment): Promise<SubmittedTask> {
        return this.bootPoolRepository.activateBootEnvironment(bootEnvironment);
    }

    public getBootVolumeConfig () {
        return this.bootPoolRepository.getBootPoolConfig();
    }

    public scrubBootPool(): Promise<SubmittedTask> {
        return this.bootPoolRepository.scrubBootPool();
    }

    public saveAlertEmitter(alertEmitter: any) {
        return this.alertEmitterRepository.save(alertEmitter);
    }

    public saveCertificate(certificate: any) {
        return this.cryptoCertificateRepository.saveCryptoCertificate(certificate);
    }

    public listVolumes() {
        return this.volumeRepository.listVolumes();
    }

    public listDisks() {
        if (!this.initialDiskAllocationPromise || this.initialDiskAllocationPromise.isRejected()) {
            this.initialDiskAllocationPromise = this.diskRepository.listDisks()
                .tap(disks => this.volumeRepository.initializeDisksAllocations((_.map(disks, 'path') as Array<string>)));
        }
        return this.initialDiskAllocationPromise;
    }

    public listAvailableDisks() {
        return this.diskRepository.listAvailableDisks();
    }

    public listBootDisks() {
        return this.diskRepository.listBootDisks();
    }

    public listVolumeSnapshots() {
        return this.volumeRepository.listSnapshots();
    }

    public listVolumeDatasets() {
        return this.volumeRepository.listDatasets();
    }

    public listShares() {
        return this.shareRepository.listShares();
    }

    public listPeers() {
        return this.peerRepository.listPeers();
    }

    public listReplications() {
        return this.replicationRepository.listReplications();
    }

    public listDevicesWithClass(deviceClass: string) {
        return this.systemRepository.getDevices(deviceClass);
    }

    public saveAlertFilters(alertFilters: Array<AlertFilter>) {
        return _.map(alertFilters, alertFilter => this.alertFilterRepository.save(alertFilter));
    }

    public deleteAlertFilters(alertFilters: Array<AlertFilter>) {
        return _.map(alertFilters, alertFilter => this.alertFilterRepository.delete(alertFilter));
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

    private handleDisksChange(disks: Map<string, Map<string, any>>) {
    }

    private setKeepBootEnvironment(bootEnvironment: BootEnvironment, keep: boolean): Promise<SubmittedTask> {
        bootEnvironment.keep = keep;
        return this.bootPoolRepository.saveBootEnvironment(bootEnvironment);
    }

    public getNextSequenceForStream(streamId: string) {}
}
