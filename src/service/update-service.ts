import {UpdateRepository} from '../repository/update-repository';
export class UpdateService {
    private static instance: UpdateService;

    public constructor(private updateRepository: UpdateRepository
    ) {}

    public static getInstance() {
        if (!UpdateService.instance) {
            UpdateService.instance = new UpdateService(
                UpdateRepository.getInstance()
            );
        }
        return UpdateService.instance;
    }

    public getConfig() {
        return this.updateRepository.getConfig();
    }

    public saveConfig(config: any) {
        return this.updateRepository.saveConfig(config);
    }

    public getTrains() {
        return this.updateRepository.getTrains();
    }

    public getInfo() {
        return this.updateRepository.getInfo();
    }

    public check() {
        return this.updateRepository.check();
    }

    public checkAndDownload() {
        return this.updateRepository.checkAndDownload();
    }

    public updateNow(reboot: boolean) {
        return this.updateRepository.updateNow(reboot);
    }

    public apply(reboot: boolean) {
        return this.updateRepository.apply(reboot);
    }
}
