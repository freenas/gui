import {SystemGeneralDao} from '../dao/system-general-dao';
import {SystemTimeDao} from '../dao/system-time-dao';
import {SystemDatasetDao} from '../dao/system-dataset-dao';
import {SystemDeviceDao} from '../dao/system-device-dao';
import {SystemSectionDao} from '../dao/system-section-dao';
import {DatabaseDao} from '../dao/database-dao';
import {SystemAdvancedDao} from '../dao/system-advanced-dao';
import {SystemUiDao} from '../dao/system-ui-dao';
import {DebugDao} from '../dao/debug-dao';
import {SystemInfoDao} from '../dao/system-info-dao';
import {CryptoCertificateDao} from '../dao/crypto-certificate-dao';
import * as moment from 'moment-timezone';
import {AbstractRepository} from './abstract-repository';
import {SystemGeneral} from '../model/SystemGeneral';
import {SystemTime} from '../model/SystemTime';
import {SystemAdvanced} from '../model/SystemAdvanced';
import {SystemUi} from '../model/SystemUi';
import {ModelEventName} from '../model-event-name';

export class SystemRepository extends AbstractRepository {
    private static instance: SystemRepository;
    private systemGeneral: Map<string, any>;
    private systemTime: Map<string, any>;
    private systemAdvanced: Map<string, any>;
    private systemUi: Map<string, any>;

    private constructor(
        private systemGeneralDao: SystemGeneralDao,
        private systemTimeDao: SystemTimeDao,
        private systemDatasetDao: SystemDatasetDao,
        private systemDeviceDao: SystemDeviceDao,
        private systemSectionDao: SystemSectionDao,
        private databaseDao: DatabaseDao,
        private debugDao: DebugDao,
        private systemAdvancedDao: SystemAdvancedDao,
        private systemUiDao: SystemUiDao,
        private systemInfoDao: SystemInfoDao,
        private cryptoCertificateDao: CryptoCertificateDao
    ) {
        super([
            SystemGeneral.getClassName(),
            SystemTime.getClassName(),
            SystemAdvanced.getClassName(),
            SystemUi.getClassName()
        ]);
    }
    public static getInstance() {
        if (!SystemRepository.instance) {
            SystemRepository.instance = new SystemRepository(
                new SystemGeneralDao(),
                new SystemTimeDao(),
                new SystemDatasetDao(),
                new SystemDeviceDao(),
                new SystemSectionDao(),
                new DatabaseDao(),
                new DebugDao(),
                new SystemAdvancedDao(),
                new SystemUiDao(),
                new SystemInfoDao(),
                new CryptoCertificateDao()
            );
        }
        return SystemRepository.instance;
    }

    public getGeneral(): Object {
        return this.systemGeneralDao.get();
    }

    public getTime(): Object {
        return this.systemTimeDao.get();
    }

    public getGmtOffset() {
        return Promise.all([
            this.getTime(),
            this.getGeneral()
        ]).spread((time, general) => {
            return moment.tz(time.system_time.$date, general.timezone).format('Z');
        });
    }

    public getVersion() {
        return this.systemInfoDao.version();
    }

    public getDataset(): Promise<any> {
        return this.systemDatasetDao.get();
    }

    public getDevices(deviceClass: string): Promise<any> {
        return this.systemDeviceDao.getDevices(deviceClass);
    }

    public listSystemSections() {
        return this.systemSectionDao.list();
    }

    public listTimezones(): Promise<Array<string>> {
        return this.systemGeneralDao.listTimezones();
    }

    public listKeymaps(): Promise<Array<Array<string>>> {
        return this.systemGeneralDao.listKeymaps();
    }

    public getConfigFileAddress() {
        return this.databaseDao.dump('freenas10.db');
    }

    public restoreFactorySettings() {
        return this.databaseDao.factoryRestore();
    }

    public restoreDatabase(file: File) {
        return this.databaseDao.restore(file);
    }

    public getAdvanced() {
        return this.systemAdvancedDao.get();
    }

    public saveGeneral(general: any) {
        return this.systemGeneralDao.save(general);
    }

    public saveAdvanced(advanced: any) {
        return this.systemAdvancedDao.save(advanced);
    }

    public getTimezones() {
        return this.systemGeneralDao.listTimezones();
    }

    public getKeymaps() {
        return this.systemGeneralDao.listKeymaps();
    }

    public getUi() {
        return this.systemUiDao.get();
    }

    public saveUi(ui: any) {
        return this.systemUiDao.save(ui);
    }

    public getDebugFileAddress() {
        return this.debugDao.collect('freenasdebug.tar.gz');
    }

    public getCertificateFileAddress(id: string, certTarFileName: string) {
        return this.cryptoCertificateDao.collect(id, certTarFileName);
    }

    protected handleStateChange(name: string, state: Map<string, Map<string, any>>, overlay?: Map<string, Map<string, any>>) {
        switch (name) {
            case SystemGeneral.getClassName():
                this.systemGeneral = this.dispatchModelEvents(this.systemGeneral, ModelEventName.SystemGeneral, state);
                break;
            case SystemTime.getClassName():
                this.systemTime = this.dispatchModelEvents(this.systemTime, ModelEventName.SystemTime, state);
                break;
            case SystemAdvanced.getClassName():
                this.systemAdvanced = this.dispatchModelEvents(this.systemAdvanced, ModelEventName.SystemAdvanced, state);
                break;
            case SystemUi.getClassName():
                this.systemUi = this.dispatchModelEvents(this.systemUi, ModelEventName.SystemUi, state);
                break;
        }
    }

    protected handleEvent(name: string, data: any) {}
}

