import * as _ from 'lodash';
import {ModelEventName} from '../model-event-name';
import {AccountRepository} from '../repository/account-repository';
import {AbstractRoute, Route} from './abstract-route';
import {KerberosRepository} from '../repository/kerberos-repository';
import {Model} from '../model';

export class AccountsRoute extends AbstractRoute {
    private static instance: AccountsRoute;

    public constructor(private accountRepository: AccountRepository,
                       private kerberosRepository: KerberosRepository) {
        super();
    }

    public static getInstance() {
        if (!AccountsRoute.instance) {
            AccountsRoute.instance = new AccountsRoute(
                AccountRepository.getInstance(),
                KerberosRepository.getInstance()
            );
        }
        return AccountsRoute.instance;
    }

    @Route('/accounts')
    public loadSection() {
        this.enterSection('accounts');
    }

    @Route('/accounts/user')
    public listUsers() {
        let self = this,
            objectType = Model.User,
            columnIndex = 1,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/user'
            };
        return Promise.all([
            this.accountRepository.listUsers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((users: Array<any>, uiDescriptor) => {
            let filter = {builtin: false},
                sort = 'username';
            let filteredUsers = _.sortBy(_.filter(users, filter), sort);
            (filteredUsers as any)._objectType = objectType;
            context.object = filteredUsers;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(filteredUsers, state, {filter: filter, sort: sort});
            });
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/user/_/{userId}')
    @Route('/accounts/account-system/user/_/{userId}')
    public getUser(userId: string) {
        let objectType = Model.User,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(userId)
            };
        return Promise.all([
            this.accountRepository.listUsers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((users: Array<any>, uiDescriptor) => {
            context.object = _.find(users, {id: userId});
            context.userInterfaceDescriptor = uiDescriptor;
            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/user/create')
    public createUser() {
        let self = this,
            objectType = Model.User,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.accountRepository.getNewUser(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((user, uiDescriptor) => {
            context.object = user;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/group')
    public listGroups() {
        let self = this,
            objectType = Model.Group,
            columnIndex = 1,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/group'
            };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((groups: Array<any>, uiDescriptor) => {
            let filter = {builtin: false},
                sort = 'name';
            let filteredGroups = _.sortBy(_.filter(groups, filter), sort);
            (filteredGroups as any)._objectType = objectType;
            (filteredGroups as any)._stream = (groups as any)._stream;
            context.object = filteredGroups;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(filteredGroups, state, {filter: filter, sort: sort});
            });
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/group/_/{groupId}')
    @Route('/accounts/account-system/group/_/{groupId}')
    public getGroup(groupId: string) {
        let self = this,
            objectType = Model.Group,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(groupId)
            };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((groups: Array<any>, uiDescriptor) => {
            context.object = _.find(groups, {id: groupId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/group/create')
    public createGroup() {
        let self = this,
            objectType = Model.Group,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.accountRepository.getNewGroup(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((group, uiDescriptor) => {
            context.object = group;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/account-system')
    public listAccountSystems() {
        let self = this,
            objectType = Model.AccountSystem,
            columnIndex = 1,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/account-system'
            };
        return Promise.all([
            this.listSystemUsersAndGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((accountSystems: Array<any>, uiDescriptor) => {
            let filter = {builtin: true},
                sort = ['username', 'name'];
            context.object = _.sortBy(_.filter(accountSystems, filter), sort);
            context.object._objectType = context.objectType = Model.AccountSystem;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = [
                self.eventDispatcherService.addEventListener(ModelEventName.User.listChange, function(state) {
                    self.dataObjectChangeService.handleDataChange(accountSystems, state, Model.User, {filter: filter, sort: sort});
                }),
                self.eventDispatcherService.addEventListener(ModelEventName.Group.listChange, function(state) {
                    self.dataObjectChangeService.handleDataChange(accountSystems, state, Model.Group, {filter: filter, sort: sort});
                })
            ];
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/directory-services')
    public getDirectoryServices() {
        let self = this,
            objectType = Model.DirectoryServices,
            columnIndex = 1,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/directory-services'
            };
        return Promise.all([
            this.accountRepository.getNewDirectoryServices(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((directoryServices, uiDescriptor) => {
            context.object = directoryServices;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/directory-services/directory/_/{directoryId}')
    public getDirectory(directoryId: string) {
        let self = this,
            objectType = Model.Directory,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(directoryId)
            };
        return Promise.all([
            this.accountRepository.listDirectories(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((directories: Array<any>, uiDescriptor) => {
            context.userInterfaceDescriptor = uiDescriptor;
            let directory = _.find(directories, {id: directoryId}),
                promise;
            if (directory) {
                promise = Promise.resolve(directory);
            } else {
                promise = self.accountRepository.getNewDirectoryForType(directoryId);
            }
            return promise;
        }).then(directory => {
            context.object = directory;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/directory-services/kerberos-realm')
    public listKerberosRealms() {
        let self = this,
            objectType = Model.KerberosRealm,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/kerberos-realm'
            };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((kerberosRealms: Array<any>, uiDescriptor) => {
            context.object = kerberosRealms;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(kerberosRealms, state);
            });
            return self.updateStackWithContext(this.stack, context);
        });
    }
    @Route('/accounts/directory-services/kerberos-realm/_/{kerberosRealmId}')
    public getKerberosRealm(kerberosRealmId: string) {
        let self = this,
            objectType = Model.KerberosRealm,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(kerberosRealmId)
            };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((kerberosRealms: Array<any>, uiDescriptor) => {
            context.object = _.find(kerberosRealms, {id: kerberosRealmId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/directory-services/kerberos-realm/create')
    public createKerberosRealm() {
        let self = this,
            objectType = Model.KerberosRealm,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.kerberosRepository.getNewKerberosRealm(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((kerberosRealm, uiDescriptor) => {
            context.object = kerberosRealm;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/directory-services/kerberos-keytab')
    public listKerberosKeytabs() {
        let self = this,
            objectType = Model.KerberosKeytab,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/kerberos-keytab'
            };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((kerberosTabs: Array<any>, uiDescriptor) => {
            context.object = kerberosTabs;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(kerberosTabs, state);
            });
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/directory-services/kerberos-keytab/_/{kerberosKeytabId}')
    public getKerberosKeytab(kerberosKeytabId: string) {
        let self = this,
            objectType = Model.KerberosKeytab,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(kerberosKeytabId)
            };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((kerberosKeytabs: Array<any>, uiDescriptor) => {
            context.object = _.find(kerberosKeytabs, {id: kerberosKeytabId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/accounts/directory-services/kerberos-keytab/create')
    public createKerberosKeytab() {
        let self = this,
            objectType = Model.KerberosKeytab,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.kerberosRepository.getNewKerberosKeytab(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((kerberosKeytab, uiDescriptor) => {
            context.object = kerberosKeytab;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(this.stack, context);
        });
    }

    private listSystemUsersAndGroups() {
        return Promise.all([
            this.accountRepository.listUsers(),
            this.accountRepository.listGroups()
        ]).spread((users: Array<any>, groups: Array<any>) => _.concat(users, groups));
    }
}
