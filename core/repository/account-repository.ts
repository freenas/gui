import {UserDao} from "core/dao/user-dao";
import {GroupDao} from "core/dao/group-dao";
import {DirectoryServicesDao} from "../dao/directory-services-dao";
import {DirectoryserviceConfigDao} from "../dao/directoryservice-config-dao";
import {AbstractRepository} from "./abstract-repository-ng";
import * as Promise from "bluebird";
import {DirectoryDao} from "../dao/directory-dao";
import {Map} from "immutable";
import {ModelEventName} from "../model-event-name";

export class AccountRepository extends AbstractRepository {
    private static instance: AccountRepository;

    private users: Map<string, Map<string, any>>;
    private groups: Map<string, Map<string, any>>;
    private directoryServices: Map<string, Map<string, any>>;
    private directories: Map<string, Map<string, any>>;

    private DIRECTORY_TYPES_LABELS = {
        winbind: "Active Directory",
        freeipa: "FreeIPA",
        ldap: "LDAP",
        nis: "NIS"
    }

    private constructor(private userDao: UserDao,
                        private groupDao: GroupDao,
                        private directoryServiceDao: DirectoryServicesDao,
                        private directoryserviceConfigDao: DirectoryserviceConfigDao,
                        private directoryDao: DirectoryDao) {
        super([
            'User',
            'Group',
            'Directory'
        ]);
    }

    public static getInstance() {
        if (!AccountRepository.instance) {
            AccountRepository.instance = new AccountRepository(
                UserDao.getInstance(),
                GroupDao.getInstance(),
                DirectoryServicesDao.getInstance(),
                DirectoryserviceConfigDao.getInstance(),
                DirectoryDao.getInstance()
            );
        }
        return AccountRepository.instance;
    }

    public listUsers(): Promise<Array<Object>> {
        return this.userDao.list();
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

    public getNewDirectoryServices(): Promise<Object> {
        return this.directoryServiceDao.getNewInstance();
    }

    public getDirectoryServiceConfig(): Promise<Object> {
        return this.directoryserviceConfigDao.get();
    }

    public getNewDirectoryForType(type: string) {
        return this.directoryDao.getNewInstance().then(function (directory) {
            directory.type = type;
            directory.parameters = {"%type": type + "-directory-params"};
            directory.label = this.DIRECTORY_TYPES_LABELS[type];

            return directory;
        });
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'User':
                this.users = this.dispatchModelEvents(this.users, ModelEventName.User, state);
                break;
            case 'Group':
                this.groups = this.dispatchModelEvents(this.groups, ModelEventName.Group, state);
                break;
            case 'Directory':
                this.directories = this.dispatchModelEvents(this.directories, ModelEventName.Directory, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }
}


