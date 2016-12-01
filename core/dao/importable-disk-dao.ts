import { AbstractDao } from './abstract-dao-ng';

export class ImportableDiskDao extends AbstractDao {
    private static instance: ImportableDiskDao;

    private constructor() {
        super(AbstractDao.Model.ImportableDisk, {
            queryMethod: 'volume.find_media'
        });
    }

    public static getInstance() {
        if (!ImportableDiskDao.instance) {
            ImportableDiskDao.instance = new ImportableDiskDao();
        }
        return ImportableDiskDao.instance;
    }
}

