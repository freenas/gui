import {AlertEmitterPushBulletDao} from '../dao/AlertEmitterPushBulletDao';

export class AlertEmitterPushBulletRepository {
    private static instance: AlertEmitterPushBulletRepository;

    private constructor(
        private pushBulletDao: AlertEmitterPushBulletDao
    ) {}

    public static getInstance() {
        if (!AlertEmitterPushBulletRepository.instance) {
            AlertEmitterPushBulletRepository.instance = new AlertEmitterPushBulletRepository(
                new AlertEmitterPushBulletDao()
            );
        }
        return AlertEmitterPushBulletRepository.instance;
    }

    public getConfig(): Promise<any> {
        return this.pushBulletDao.get();
    }

    public saveConfig(config: any) {
        return this.pushBulletDao.save(config);
    }
}

