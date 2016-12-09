import {SystemGeneralDao} from "../dao/system-general-dao";
import {SystemTimeDao} from "../dao/system-time-dao";
import {SystemDatasetDao} from "../dao/system-dataset-dao";
import {SystemDeviceDao} from "../dao/system-device-dao";
import {SystemSectionDao} from "../dao/system-section-dao";

export class SystemRepository {
    private static instance: SystemRepository;

    private constructor(
        private systemGeneralDao: SystemGeneralDao,
        private systemTimeDao: SystemTimeDao,
        private systemDatasetDao: SystemDatasetDao,
        private systemDeviceDao: SystemDeviceDao,
        private systemSectionDao: SystemSectionDao
    ) {}

    public static getInstance() {
        if (!SystemRepository.instance) {
            SystemRepository.instance = new SystemRepository(
                SystemGeneralDao.getInstance(),
                SystemTimeDao.getInstance(),
                SystemDatasetDao.getInstance(),
                SystemDeviceDao.getInstance(),
                SystemSectionDao.getInstance()
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

    public getDataset(): Promise<Object> {
        return this.systemDatasetDao.list();
    }

    public getDevices(deviceClass: string): Promise<Object> {
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
}

