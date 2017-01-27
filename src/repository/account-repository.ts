import {UserDao} from '../dao/user-dao';
import {GroupDao} from '../dao/group-dao';
import {DirectoryServicesDao} from '../dao/directory-services-dao';
import {DirectoryserviceConfigDao} from '../dao/directoryservice-config-dao';
import {AbstractRepository} from './abstract-repository-ng';
import {DirectoryDao} from '../dao/directory-dao';
import {Map} from 'immutable';
import {ModelEventName} from '../model-event-name';
import {Model} from '../model';

export class AccountRepository extends AbstractRepository {
    private static instance: AccountRepository;

    private users: Map<string, Map<string, any>>;
    private groups: Map<string, Map<string, any>>;
    private directories: Map<string, Map<string, any>>;

    public static readonly DIRECTORY_TYPES_LABELS = {
        winbind: 'Active Directory',
        freeipa: 'FreeIPA',
        ldap: 'LDAP',
        nis: 'NIS'
    };

    private constructor(private userDao: UserDao,
                        private groupDao: GroupDao,
                        private directoryServiceDao: DirectoryServicesDao,
                        private directoryserviceConfigDao: DirectoryserviceConfigDao,
                        private directoryDao: DirectoryDao) {
        super([
            Model.User,
            Model.Group,
            Model.Directory
        ]);
    }

    public static getInstance() {
        if (!AccountRepository.instance) {
            AccountRepository.instance = new AccountRepository(
                new UserDao(),
                new GroupDao(),
                new DirectoryServicesDao(),
                new DirectoryserviceConfigDao(),
                new DirectoryDao()
            );
        }
        return AccountRepository.instance;
    }

    public loadUsers(): Promise<Array<any>> {
        return this.userDao.list();
    }

    public loadGroups(): Promise<Array<any>> {
        return this.groupDao.list();
    }

    public listUsers(): Promise<Array<any>> {
        return this.users ? Promise.resolve(this.users.toSet().toJS()) : this.userDao.list();
    }

    public findUserWithName(name: string): Promise<Object> {
        return this.userDao.findSingleEntry({username: name});
    }

    public saveUser(user: Object): Promise<Object> {
        return this.userDao.save(user);
    }

    public listGroups(): Promise<Array<Object>> {
        return this.groups ? Promise.resolve(this.groups.toSet().toJS()) : this.groupDao.list();
    }

    public getNextUid() {
        return this.userDao.getNextUid();
    }

    public getNewUser() {
        return this.userDao.getNewInstance();
    }

    public getNewGroup() {
        return this.groupDao.getNewInstance();
    }

    public getNewDirectoryServices(): Promise<Object> {
        return this.directoryServiceDao.getNewInstance();
    }

    public getDirectoryServiceConfig(): Promise<Object> {
        return this.directoryserviceConfigDao.get();
    }

    public listDirectories(): Promise<Array<any>> {
        return this.directories ? Promise.resolve(this.directories.valueSeq().toJS()) : this.directoryDao.list();
    }

    public getNewDirectoryForType(type: string) {
        return this.directoryDao.getNewInstance().then(function (directory) {
            directory.type = type;
            directory._tmpId = type;
            directory.parameters = {'%type': type + '-directory-params'};
            directory.label = AccountRepository.DIRECTORY_TYPES_LABELS[type];

            return directory;
        });
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case Model.User:
                this.users = this.dispatchModelEvents(this.users, ModelEventName.User, state);
                break;
            case Model.Group:
                this.groups = this.dispatchModelEvents(this.groups, ModelEventName.Group, state);
                break;
            case Model.Directory:
                this.directories = this.dispatchModelEvents(this.directories, ModelEventName.Directory, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }
}


