import _ = require("lodash");
import Promise = require("bluebird");
import {ModelEventName} from "../model-event-name";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {AccountRepository} from "../repository/account-repository";
import {DataObjectChangeService} from "../service/data-object-change-service";
import {AbstractRoute} from "./abstract-route";
import {KerberosRepository} from "../repository/kerberos-repository";

export class AccountsRoute extends AbstractRoute {
    private static instance: AccountsRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private dataObjectChangeService: DataObjectChangeService,
                        private accountRepository: AccountRepository,
                        private kerberosRepository: KerberosRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!AccountsRoute.instance) {
            AccountsRoute.instance = new AccountsRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                new DataObjectChangeService(),
                AccountRepository.getInstance(),
                KerberosRepository.getInstance()
            );
        }
        return AccountsRoute.instance;
    }

    public listUsers(stack: Array<any>) {
        let self = this,
            objectType = 'User',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/user'
            };
        return Promise.all([
            this.accountRepository.listUsers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(users, uiDescriptor) {
            let filteredUsers = _.filter(users, {builtin: false});
            context.object = filteredUsers;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(filteredUsers, state);
                for (let i = filteredUsers.length - 1; i >= 0; i--) {
                    if (filteredUsers[i].builtin) {
                        filteredUsers.splice(i, 1);
                    }
                }
            });
            return self.updateStackWithContext(stack, context);
        });
    }

    public getUser(userId: string, stack: Array<any>) {
        let self = this,
            objectType = 'User',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(userId)
            };
        return Promise.all([
            this.accountRepository.listUsers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(users, uiDescriptor) {
            context.object = _.find(users, {id: userId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createUser(stack: Array<any>) {
        let self = this,
            objectType = 'User',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
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
            objectType = 'Group',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/group'
            };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(groups, uiDescriptor) {
            let filteredGroups = _.filter(groups, {builtin: false});
            context.object = filteredGroups;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(filteredGroups, state);
                for (let i = filteredGroups.length - 1; i >= 0; i--) {
                    if (filteredGroups[i].builtin) {
                        filteredGroups.splice(i, 1);
                    }
                }
            });
            return self.updateStackWithContext(stack, context);
        });
    }

    public getGroup(groupId: string, stack: Array<any>) {
        let self = this,
            objectType = 'Group',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(groupId)
            };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(groups, uiDescriptor) {
            context.object = _.find(groups, {id: groupId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createGroup(stack: Array<any>) {
        let self = this,
            objectType = 'Group',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
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
            objectType = 'AccountSystem',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/account-system'
            };
        return Promise.all([
            this.listSystemUsersAndGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(accountSystems, uiDescriptor) {
            context.object = accountSystems;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = [
                self.eventDispatcherService.addEventListener(ModelEventName.User.listChange, function(state) {
                    self.dataObjectChangeService.handleDataChange(accountSystems, state, 'User');
                    for (let i = accountSystems.length - 1; i >= 0; i--) {
                        if (!accountSystems[i].builtin) {
                            accountSystems.splice(i, 1);
                        }
                    }
                }),
                self.eventDispatcherService.addEventListener(ModelEventName.Group.listChange, function(state) {
                    self.dataObjectChangeService.handleDataChange(accountSystems, state, 'Group');
                    for (let i = accountSystems.length - 1; i >= 0; i--) {
                        if (!accountSystems[i].builtin) {
                            accountSystems.splice(i, 1);
                        }
                    }
                })
            ];
            return self.updateStackWithContext(stack, context);
        });
    }

    public getDirectoryServices(stack: Array<any>) {
        let self = this,
            objectType = 'DirectoryServices',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
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
            objectType = 'Directory',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(directoryId)
            };
        return Promise.all([
            this.accountRepository.listDirectories(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(directories, uiDescriptor) {
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
            objectType = 'KerberosRealm',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/kerberos-realm'
            };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosRealms, uiDescriptor) {
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
            objectType = 'KerberosRealm',
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(kerberosRealmId)
            };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosRealms, uiDescriptor) {
            context.object = _.find(kerberosRealms, {id: kerberosRealmId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createKerberosRealm(stack: Array<any>) {
        let self = this,
            objectType = 'KerberosRealm',
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
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
            objectType = 'KerberosKeytab',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/kerberos-keytab'
            };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosTabs, uiDescriptor) {
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
            objectType = 'KerberosKeytab',
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(kerberosKeytabId)
            };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(kerberosKeytabs, uiDescriptor) {
            context.object = _.find(kerberosKeytabs, {id: kerberosKeytabId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createKerberosKeytab(stack: Array<any>) {
        let self = this,
            objectType = 'KerberosKeytab',
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
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
        ]).spread(function(users, groups) {
            let accountSystems = _.concat(
                _.filter(users, {builtin: true}),
                _.filter(groups, {builtin: true})
            );
            accountSystems._objectType = 'AccountSystem';
            return accountSystems;
        })
    }
}
