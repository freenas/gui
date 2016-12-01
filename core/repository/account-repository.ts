import { UserDao } from 'core/dao/user-dao';
import { GroupDao } from 'core/dao/group-dao';
import {DirectoryServicesDao} from "../dao/directory-services-dao";
import {DirectoryserviceConfigDao} from "../dao/directoryservice-config-dao";
import {AbstractRepository} from "./abstract-repository-ng";
import {ShellDao} from "../dao/shell-dao";

export class AccountRepository extends AbstractRepository{
    private static instance: AccountRepository;

    private users: Map<string, Map<string, any>>;
    private groups: Map<string, Map<string, any>>;
    private directoryServices: Map<string, Map<string, any>>;

    private constructor(
        private userDao: UserDao,
        private groupDao: GroupDao,
        private directoryServiceDao: DirectoryServicesDao,
        private directoryserviceConfigDao: DirectoryserviceConfigDao,
        private shellDao: ShellDao
    ) {
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
                ShellDao.getInstance()
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

    public listDirectoryServices(): Promise<Array<Object>> {
        return this.directoryServiceDao.list();
    }

    public getNewDirectoryServices(): Promise<Object> {
        return this.directoryServiceDao.getNewInstance();
    }

    public getDirectoryServiceConfig() {
        return this.directoryserviceConfigDao.get();
    }

    public listShells() {
        return this.shellDao.list();
    }

    protected handleStateChange(name: string, state: any) {
        let self = this;
        switch (name) {
            case 'User':
                this.eventDispatcherService.dispatch('usersChange', state);
                state.forEach(function(user, id){
                    if (!self.users || !self.users.has(id)) {
                        self.eventDispatcherService.dispatch('userAdd.' + id, user);
                    } else if (self.users.get(id) !== user) {
                        self.eventDispatcherService.dispatch('userChange.' + id, user);
                    }
                });
                if (this.users) {
                    this.users.forEach(function(user, id){
                        if (!state.has(id) || state.get(id) !== user) {
                            self.eventDispatcherService.dispatch('userRemove.' + id, user);
                        }
                    });
                }
                this.users = state;
                break;
            case 'Group':
                this.eventDispatcherService.dispatch('groupsChange', state);
                state.forEach(function(group, id){
                    if (!self.groups || !self.groups.has(id)) {
                        self.eventDispatcherService.dispatch('groupAdd.' + id, group);
                    } else if (self.groups.get(id) !== group) {
                        self.eventDispatcherService.dispatch('groupChange.' + id, group);
                    }
                });
                if (this.groups) {
                    this.groups.forEach(function(group, id){
                        if (!state.has(id) || state.get(id) !== group) {
                            self.eventDispatcherService.dispatch('groupRemove.' + id, group);
                        }
                    });
                }
                this.groups = state;
                break;
            case 'Directory':
                this.eventDispatcherService.dispatch('directoriesChange', state);
                state.forEach(function(directory, id){
                    if (!self.directorys || !self.directorys.has(id)) {
                        self.eventDispatcherService.dispatch('directoryAdd.' + id, directory);
                    } else if (self.directorys.get(id) !== directory) {
                        self.eventDispatcherService.dispatch('directoryChange.' + id, directory);
                    }
                });
                if (this.directorys) {
                    this.directorys.forEach(function(directory, id){
                        if (!state.has(id) || state.get(id) !== directory) {
                            self.eventDispatcherService.dispatch('directoryRemove.' + id, directory);
                        }
                    });
                }
                this.directorys = state;
                break;
            default:
                break;
        }
    }
}


