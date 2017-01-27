import * as _ from 'lodash';
import {ModelEventName} from '../model-event-name';
import {AccountRepository} from '../repository/account-repository';
import {AbstractRoute} from './abstract-route';
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

    public listUsers(stack: Array<any>) {
        let self = this,
            objectType = Model.User,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
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
            return self.updateStackWithContext(stack, context);
        });
    }

    public getUser(userId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.User,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(userId)
            };
        return Promise.all([
            this.accountRepository.listUsers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(users: Array<any>, uiDescriptor) {
            context.object = _.find(users, {id: userId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createUser(stack: Array<any>) {
        let self = this,
            objectType = Model.User,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.accountRepository.getNewUser(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(user, uiDescriptor) {
            context.object = user;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public listGroups(stack: Array<any>) {
        let self = this,
            objectType = Model.Group,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/group'
            };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(groups: Array<any>, uiDescriptor) {
            let filter = {builtin: false},
                sort = 'name';
            let filteredGroups = _.sortBy(_.filter(groups, filter), sort);
            (filteredGroups as any)._objectType = objectType;
            context.object = filteredGroups;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(filteredGroups, state, {filter: filter, sort: sort});
            });
            return self.updateStackWithContext(stack, context);
        });
    }

    public getGroup(groupId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Group,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(groupId)
            };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(groups: Array<any>, uiDescriptor) {
            context.object = _.find(groups, {id: groupId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createGroup(stack: Array<any>) {
        let self = this,
            objectType = Model.Group,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.accountRepository.getNewGroup(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(group, uiDescriptor) {
            context.object = group;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public listAccountSystems(stack: Array<any>) {
        let self = this,
            objectType = Model.AccountSystem,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/account-system'
            };
        return Promise.all([
            this.listSystemUsersAndGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(accountSystems: Array<any>, uiDescriptor) {
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
            return self.updateStackWithContext(stack, context);
        });
    }

    public getDirectoryServices(stack: Array<any>) {
        let self = this,
            objectType = Model.DirectoryServices,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/directory-services'
            };
        return Promise.all([
            this.accountRepository.getNewDirectoryServices(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(directoryServices, uiDescriptor) {
            context.object = directoryServices;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getDirectory(directoryId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Directory,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
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
        }).then(function(directory) {
            context.object = directory;
            return self.updateStackWithContext(stack, context);
        });
    }

    public listKerberosRealms(stack: Array<any>) {
        let self = this,
            objectType = Model.KerberosRealm,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/kerberos-realm'
            };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosRealms: Array<any>, uiDescriptor) {
            context.object = kerberosRealms;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(kerberosRealms, state);
            });
            return self.updateStackWithContext(stack, context);
        });
    }

    public getKerberosRealm(kerberosRealmId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.KerberosRealm,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(kerberosRealmId)
            };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosRealms: Array<any>, uiDescriptor) {
            context.object = _.find(kerberosRealms, {id: kerberosRealmId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createKerberosRealm(stack: Array<any>) {
        let self = this,
            objectType = Model.KerberosRealm,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.kerberosRepository.getNewKerberosRealm(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosRealm, uiDescriptor) {
            context.object = kerberosRealm;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public listKerberosKeytabs(stack: Array<any>) {
        let self = this,
            objectType = Model.KerberosKeytab,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/kerberos-keytab'
            };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosTabs: Array<any>, uiDescriptor) {
            context.object = kerberosTabs;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(kerberosTabs, state);
            });
            return self.updateStackWithContext(stack, context);
        });
    }

    public getKerberosKeytab(kerberosKeytabId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.KerberosKeytab,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(kerberosKeytabId)
            };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosKeytabs: Array<any>, uiDescriptor) {
            context.object = _.find(kerberosKeytabs, {id: kerberosKeytabId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createKerberosKeytab(stack: Array<any>) {
        let self = this,
            objectType = Model.KerberosKeytab,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.kerberosRepository.getNewKerberosKeytab(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosKeytab, uiDescriptor) {
            context.object = kerberosKeytab;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    private listSystemUsersAndGroups() {
        return Promise.all([
            this.accountRepository.listUsers(),
            this.accountRepository.listGroups()
        ]).spread((users: Array<any>, groups: Array<any>) => _.concat(users, groups));
    }
}
