import {PushBulletDao} from '../dao/push-bullet-dao';

export class PushBulletRepository {
    private static instance: PushBullet;

    private constructor(
        private pushBulletDao: PushBulletDao
    ) {}

    public static getInstance() {
        if (!PushBullet.instance) {
            PushBullet.instance = new PushBulletRepository(
                new PushBulletDao()
            );
        }
        return PushBulletRepository.instance;
    }

    public getConfig(): Promise<any> {
        return this.pushBulletDao.get();
    }

    public saveConfig(config) {
        return this.pushBulletDao.save(config);
    }
}

