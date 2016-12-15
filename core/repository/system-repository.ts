import {SystemGeneralDao} from "../dao/system-general-dao";
import {SystemTimeDao} from "../dao/system-time-dao";
import {SystemDatasetDao} from "../dao/system-dataset-dao";
import {SystemDeviceDao} from "../dao/system-device-dao";
import {SystemSectionDao} from "../dao/system-section-dao";
import * as Promise from "bluebird";
import {DatabaseDao} from "../dao/database-dao";
import {SystemAdvancedDao} from "../dao/system-advanced-dao";
import {SystemUiDao} from "../dao/system-ui-dao";

export class SystemRepository {
    private static instance: SystemRepository;

    private constructor(
        private systemGeneralDao: SystemGeneralDao,
        private systemTimeDao: SystemTimeDao,
        private systemDatasetDao: SystemDatasetDao,
        private systemDeviceDao: SystemDeviceDao,
        private systemSectionDao: SystemSectionDao,
        private databaseDao: DatabaseDao,
        private systemAdvancedDao: SystemAdvancedDao,
        private systemUiDao: SystemUiDao
    ) {}

    public static getInstance() {
        if (!SystemRepository.instance) {
            SystemRepository.instance = new SystemRepository(
                new SystemGeneralDao(),
                new SystemTimeDao(),
                new SystemDatasetDao(),
                new SystemDeviceDao(),
                new SystemSectionDao(),
                new DatabaseDao(),
                new SystemAdvancedDao(),
                new SystemUiDao()
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
        return this.systemGeneralDao.listKeymaps()
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
}

