import {AbstractRepository} from './abstract-repository';
import {UpdateDao} from '../dao/update-dao';
import {Model} from '../model';
export class UpdateRepository extends AbstractRepository {
    private static instance: UpdateRepository;
    private constructor(private updateDao: UpdateDao) {
        super([Model.Update])
    }

    public static getInstance() {
        if (!UpdateRepository.instance) {
            UpdateRepository.instance = new UpdateRepository(
                new UpdateDao()
            );
        }
        return UpdateRepository.instance;
    }

    public getConfig() {
        return this.updateDao.get();
    }

    public saveConfig(config: any) {
        return this.updateDao.save(config);
    }

    public getTrains() {
        return this.updateDao.trains();
    }

    public getInfo() {
        return this.updateDao.updateInfo();
    }

    public verify() {
        return this.updateDao.verify();
    }

    public check() {
        return this.updateDao.check();
    }

    public checkAndDownload() {
        return this.updateDao.checkfetch();
    }

    public updateNow(reboot: boolean) {
        return this.updateDao.updatenow(reboot);
    }

    public apply(reboot: boolean) {
        return this.updateDao.apply(reboot);
    }

    protected handleStateChange(name: string, data: any) {}

    protected handleEvent(name: string, data: any) {}
}
