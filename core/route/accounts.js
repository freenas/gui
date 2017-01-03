"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var Promise = require("bluebird");
var model_event_name_1 = require("../model-event-name");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var account_repository_1 = require("../repository/account-repository");
var data_object_change_service_1 = require("../service/data-object-change-service");
var abstract_route_1 = require("./abstract-route");
var kerberos_repository_1 = require("../repository/kerberos-repository");
var AccountsRoute = (function (_super) {
    __extends(AccountsRoute, _super);
    function AccountsRoute(modelDescriptorService, eventDispatcherService, dataObjectChangeService, accountRepository, kerberosRepository) {
        _super.call(this, eventDispatcherService);
        this.modelDescriptorService = modelDescriptorService;
        this.dataObjectChangeService = dataObjectChangeService;
        this.accountRepository = accountRepository;
        this.kerberosRepository = kerberosRepository;
    }
    AccountsRoute.getInstance = function () {
        if (!AccountsRoute.instance) {
            AccountsRoute.instance = new AccountsRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), new data_object_change_service_1.DataObjectChangeService(), account_repository_1.AccountRepository.getInstance(), kerberos_repository_1.KerberosRepository.getInstance());
        }
        return AccountsRoute.instance;
    };
    AccountsRoute.prototype.listUsers = function (stack) {
        var self = this, objectType = 'User', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/user'
        };
        return Promise.all([
            this.accountRepository.listUsers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (users, uiDescriptor) {
            var filteredUsers = _.filter(users, { builtin: false });
            context.object = filteredUsers;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName[objectType].listChange, function (state) {
                self.dataObjectChangeService.handleDataChange(filteredUsers, state);
                for (var i = filteredUsers.length - 1; i >= 0; i--) {
                    if (filteredUsers[i].builtin) {
                        filteredUsers.splice(i, 1);
                    }
                }
            });
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.getUser = function (userId, stack) {
        var self = this, objectType = 'User', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + encodeURIComponent(userId)
        };
        return Promise.all([
            this.accountRepository.listUsers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (users, uiDescriptor) {
            context.object = _.find(users, { id: userId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.createUser = function (stack) {
        var self = this, objectType = 'User', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.accountRepository.getNewUser(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (user, uiDescriptor) {
            context.object = user;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.listGroups = function (stack) {
        var self = this, objectType = 'Group', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/group'
        };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (groups, uiDescriptor) {
            var filteredGroups = _.filter(groups, { builtin: false });
            context.object = filteredGroups;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName[objectType].listChange, function (state) {
                self.dataObjectChangeService.handleDataChange(filteredGroups, state);
                for (var i = filteredGroups.length - 1; i >= 0; i--) {
                    if (filteredGroups[i].builtin) {
                        filteredGroups.splice(i, 1);
                    }
                }
            });
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.getGroup = function (groupId, stack) {
        var self = this, objectType = 'Group', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + encodeURIComponent(groupId)
        };
        return Promise.all([
            this.accountRepository.listGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (groups, uiDescriptor) {
            context.object = _.find(groups, { id: groupId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.createGroup = function (stack) {
        var self = this, objectType = 'Group', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.accountRepository.getNewGroup(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (group, uiDescriptor) {
            context.object = group;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.listAccountSystems = function (stack) {
        var self = this, objectType = 'AccountSystem', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/account-system'
        };
        return Promise.all([
            this.listSystemUsersAndGroups(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (accountSystems, uiDescriptor) {
            context.object = accountSystems;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = [
                self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.User.listChange, function (state) {
                    self.dataObjectChangeService.handleDataChange(accountSystems, state, 'User');
                    for (var i = accountSystems.length - 1; i >= 0; i--) {
                        if (!accountSystems[i].builtin) {
                            accountSystems.splice(i, 1);
                        }
                    }
                }),
                self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Group.listChange, function (state) {
                    self.dataObjectChangeService.handleDataChange(accountSystems, state, 'Group');
                    for (var i = accountSystems.length - 1; i >= 0; i--) {
                        if (!accountSystems[i].builtin) {
                            accountSystems.splice(i, 1);
                        }
                    }
                })
            ];
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.getDirectoryServices = function (stack) {
        var self = this, objectType = 'DirectoryServices', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/directory-services'
        };
        return Promise.all([
            this.accountRepository.getNewDirectoryServices(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (directoryServices, uiDescriptor) {
            context.object = directoryServices;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.getDirectory = function (directoryId, stack) {
        var self = this, objectType = 'Directory', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + encodeURIComponent(directoryId)
        };
        return Promise.all([
            this.accountRepository.listDirectories(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (directories, uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            var directory = _.find(directories, { id: directoryId }), promise;
            if (directory) {
                promise = Promise.resolve(directory);
            }
            else {
                promise = self.accountRepository.getNewDirectoryForType(directoryId);
            }
            return promise;
        }).then(function (directory) {
            context.object = directory;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.listKerberosRealms = function (stack) {
        var self = this, objectType = 'KerberosRealm', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/kerberos-realm'
        };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (kerberosRealms, uiDescriptor) {
            context.object = kerberosRealms;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName[objectType].listChange, function (state) {
                self.dataObjectChangeService.handleDataChange(kerberosRealms, state);
            });
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.getKerberosRealm = function (kerberosRealmId, stack) {
        var self = this, objectType = 'KerberosRealm', columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + encodeURIComponent(kerberosRealmId)
        };
        return Promise.all([
            this.kerberosRepository.listKerberosRealms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (kerberosRealms, uiDescriptor) {
            context.object = _.find(kerberosRealms, { id: kerberosRealmId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.createKerberosRealm = function (stack) {
        var self = this, objectType = 'KerberosRealm', columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.kerberosRepository.getNewKerberosRealm(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (kerberosRealm, uiDescriptor) {
            context.object = kerberosRealm;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.listKerberosKeytabs = function (stack) {
        var self = this, objectType = 'KerberosKeytab', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/kerberos-keytab'
        };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (kerberosTabs, uiDescriptor) {
            context.object = kerberosTabs;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName[objectType].listChange, function (state) {
                self.dataObjectChangeService.handleDataChange(kerberosTabs, state);
            });
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.getKerberosKeytab = function (kerberosKeytabId, stack) {
        var self = this, objectType = 'KerberosKeytab', columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + encodeURIComponent(kerberosKeytabId)
        };
        return Promise.all([
            this.kerberosRepository.listKerberosKeytabs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (kerberosKeytabs, uiDescriptor) {
            context.object = _.find(kerberosKeytabs, { id: kerberosKeytabId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.createKerberosKeytab = function (stack) {
        var self = this, objectType = 'KerberosKeytab', columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.kerberosRepository.getNewKerberosKeytab(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (kerberosKeytab, uiDescriptor) {
            context.object = kerberosKeytab;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    AccountsRoute.prototype.listSystemUsersAndGroups = function () {
        return Promise.all([
            this.accountRepository.listUsers(),
            this.accountRepository.listGroups()
        ]).spread(function (users, groups) {
            var accountSystems = _.concat(_.filter(users, { builtin: true }), _.filter(groups, { builtin: true }));
            accountSystems._objectType = 'AccountSystem';
            return accountSystems;
        });
    };
    return AccountsRoute;
}(abstract_route_1.AbstractRoute));
exports.AccountsRoute = AccountsRoute;
