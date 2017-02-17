import {AbstractRepository} from './abstract-repository';
import {Model} from '../model';
import {Map} from 'immutable';
import {ModelEventName} from '../model-event-name';
import {VmDao} from '../dao/vm-dao';
import {VmConfigDao} from '../dao/vm-config-dao';
import {VmTemplateDao} from '../dao/vm-template-dao';
import {VmReadmeDao} from '../dao/vm-readme-dao';
import {VmGuestInfoDao} from '../dao/vm-guest-info-dao';
import {VmDeviceType} from '../model/enumerations/VmDeviceType';
import {VmDeviceVolumeType} from '../model/enumerations/VmDeviceVolumeType';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import {VmDeviceDao} from '../dao/vm-device-dao';
import {VmVolumeDao} from '../dao/vm-volume-dao';
import {VmCloneDao} from '../dao/vm-clone-dao';
import {Vm} from '../model/Vm';

export class VmRepository extends AbstractRepository<Vm> {
    private static instance: VmRepository;
    private vms: Map<string, Map<string, any>>;
    private vmDatastores: Map<string, Map<string, any>>;
    private vmTemplates: Map<string, Map<string, any>>;
    private vmGuestInfo: Map<string, Map<string, any>>;
    private vmConfig: Map<string, any>;

    public readonly DEVICE_TYPE: VmDeviceType = (_.omit(VmDeviceType, '_montage_metadata') as VmDeviceType);

    public DATASTORE_TYPE = {
        NFS: 'nfs'
    };

    public BOOTABLE_DEVICE_TYPES = [
        'VOLUME',
        'CDROM',
        'DISK'
    ];

    public DEFAULT_CLONE_DEVICE_ID = 'TEMPLATE_DEVICE_ID';

    public DEFAULT_VM_CONFIG = {
        ncpus: '',
        bootloader: 'GRUB'
    };

    public DEFAULT_DEVICE_PROPERTIES = {
        CDROM: {
        },
        DISK: {
            mode: 'AHCI'
        },
        GRAPHICS: {
            resolution: '1024x768'
        },
        NIC: {
            mode: 'NAT',
            device: 'VIRTIO'
        },
        USB: {
            device: 'tablet'
        }
    };


    private constructor(private vmDao: VmDao,
                        private vmConfigDao: VmConfigDao,
                        private vmTemplateDao: VmTemplateDao,
                        private vmReadmeDao: VmReadmeDao,
                        private vmGuestInfoDao: VmGuestInfoDao,
                        private vmDeviceDao: VmDeviceDao,
                        private vmVolumeDao: VmVolumeDao,
                        private vmCloneDao: VmCloneDao) {
        super([
            Model.Vm,
            Model.VmDatastore,
            Model.VmConfig,
            Model.VmTemplate,
            Model.VmGuestInfo
        ]);
    }

    public static getInstance(): VmRepository {
        if (!VmRepository.instance) {
            VmRepository.instance = new VmRepository(
                new VmDao(),
                new VmConfigDao(),
                new VmTemplateDao(),
                new VmReadmeDao(),
                new VmGuestInfoDao(),
                new VmDeviceDao(),
                new VmVolumeDao(),
                new VmCloneDao()
            );
        }
        return VmRepository.instance;
    }

    public listVms() {
        var self = this;
        let promise = this.vms ? Promise.resolve(this.vms.valueSeq().toJS()) : this.vmDao.list();
        return promise.then((vms) => {
            for (let vm of vms) {
                vm._hasGraphicDevice = _.get(vm, 'devices').some(function (x) {
                    return x.type === self.DEVICE_TYPE.GRAPHICS;
                });
            }
            return vms;
        });
    }

    public getVmSettings() {
        let promise = this.vmConfig ? Promise.resolve(this.vmConfig.toJS()) : this.vmConfigDao.get();
        return promise.then((vmConfig) => {
            this.eventDispatcherService.addEventListener(ModelEventName.VmConfig.contentChange, (state) => {
                _.assign(vmConfig, state.toJS());
            });
            return {
                config: vmConfig
            };
        });
    }

    public getVmReadme(vm: any) {
        return this.vmReadmeDao.getNewInstance().then((vmReadme) => {
            vmReadme.text = vm.config && vm.config.readme;
            return vmReadme;
        });
    }

    public getNewVmClone() {
        return this.vmCloneDao.getNewInstance();
    }

    public getGuestInfo(vm: any) {
        return this.vmGuestInfoDao.getGuestInfo(vm);
    }

    public getNewVm() {
        return this.vmDao.getNewInstance();
    }

    public saveVm(vm: any) {
        let vmPlain: any = _.toPlainObject(vm);
        vmPlain.devices = _.map(vmPlain.devices, (device) => _.omitBy(_.toPlainObject(device), _.isNull));
        return this.vmDao.save(vmPlain);
    }

    public cloneVmToName(vmId: string, name: string) {
        return this.vmCloneDao.clone(vmId, name);
    }

    public getNewVmDeviceForType(type: string) {
        return type !== VmDeviceType.VOLUME &&
            this.vmDeviceDao.getNewInstance().then((device) => VmRepository.setDeviceDefaults(device, type));
    }

    public cloneVmDevice(device: any) {
        return this.vmDeviceDao.getNewInstance().then((clone) =>
            _.assignWith(
                clone,
                device,
                {_isNew: false},
                (cloneValue, deviceValue, key) => key === 'id' ? cloneValue : deviceValue)
        );
    }

    public getNewVmVolume() {
        return this.vmVolumeDao.getNewInstance().then((vmVolume) => _.assign(vmVolume, {
            id: uuid.v4(),
            type: VmDeviceType.VOLUME
        }));
    }

    public flushTemplateCache() {
        return this.vmDao.flushTemplateCache();
    }

    public static initializeNewVmDevice(device: any) {
        if (device.type === VmDeviceType.VOLUME) {
            device.properties.type = VmDeviceVolumeType.VT9P;
        }
    }

    public startVm(vm: any) {
        return this.vmDao.start(vm);
    }

    public stopVm(vm: any, force: boolean = false) {
        return this.vmDao.stop(vm, force);
    }

    public rebootVm(vm: any) {
        return this.vmDao.reboot(vm);
    }

    public getSerialToken(vm: any) {
        return this.vmDao.requestSerialConsole(vm);
    }

    public getWebVncConsoleUrl(vm: any) {
        return this.vmDao.requestWebvncConsole(vm);
    }

    private static setDeviceDefaults(device: any, type: string) {
        return _.assign(
            device,
            {
                _tmpId: type,
                type: type,
                properties: _.assign(
                    device.properties,
                    VmRepository.getDefaultPropertiesForDeviceType(type)
                )
            }
        );
    }

    private static getDefaultPropertiesForDeviceType(type: string) {
        let properties: any = {};
        switch (type) {
            case VmDeviceType.CDROM:
                break;
            case VmDeviceType.DISK:
                properties.mode = 'AHCI';
                properties.target_type = 'FILE';
                break;
            case VmDeviceType.GRAPHICS:
                properties.resolution = '1024x768';
                break;
            case VmDeviceType.NIC:
                properties.device = 'VIRTIO';
                properties.mode = 'NAT';
                break;
            case VmDeviceType.USB:
                properties.device = 'tablet';
                break;
        }
        return properties;
    }

    public listTemplates() {
        return this.vmTemplates ? Promise.resolve(this.vmTemplates.valueSeq().toJS()) : this.vmTemplateDao.list();
    }

    public getHardwareCapabilities() {
        return this.vmDao.getHardwareCapabilities();
    }

    public saveVmSettings(vmSettings: any) {
        return this.vmConfigDao.save(vmSettings.config);
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case Model.Vm:
                this.vms = this.dispatchModelEvents(this.vms, ModelEventName.Vm, state);
                break;
            case Model.VmDatastore:
                this.vmDatastores = this.dispatchModelEvents(this.vmDatastores, ModelEventName.VmDatastore, state);
                break;
            case Model.VmConfig:
                this.vmConfig = this.dispatchSingleObjectChange(this.vmConfig, ModelEventName.VmConfig, state);
                break;
            case Model.VmTemplate:
                this.vmTemplates = this.dispatchModelEvents(this.vmTemplates, ModelEventName.VmTemplate, state);
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }

}
