import {SystemRepository} from "../repository/system-repository";
import {ModelEventName} from "../model-event-name";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {CryptoCertificateType} from "core/model/enumerations/crypto-certificate-type";
import _ = require("lodash");
import Promise = require("bluebird");
import {CryptoCertificateRepository} from "../repository/crypto-certificate-repository";
import {AlertFilterRepository} from "core/repository/alert-filter-repository";
import {MailRepository} from "../repository/mail-repository";
import {TunableRepository} from "../repository/tunable-repository";
import {NtpServerRepository} from "../repository/ntp-server-repository";
import {AbstractRoute} from "./abstract-route";

export class SystemRoute extends AbstractRoute {
    private static instance: SystemRoute;
    private objectType: string;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private systemRepository: SystemRepository,
                        private cryptoCertificateRepository: CryptoCertificateRepository,
                        private alertFilterRepository: AlertFilterRepository,
                        private mailRepository: MailRepository,
                        private tunableRepository: TunableRepository,
                        private ntpServerRepository: NtpServerRepository) {
        super(eventDispatcherService);
        this.objectType = 'SystemSection';
    }

    public static getInstance() {
        if (!SystemRoute.instance) {
            SystemRoute.instance = new SystemRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                SystemRepository.getInstance(),
                CryptoCertificateRepository.getInstance(),
                AlertFilterRepository.instance,
                MailRepository.getInstance(),
                TunableRepository.getInstance(),
                NtpServerRepository.getInstance()
            );
        }
        return SystemRoute.instance;
    }

    public get(systemSectionId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/system-section/_/' + systemSectionId
            };
        return Promise.all([
            this.systemRepository.listSystemSections(),
            this.modelDescriptorService.getUiDescriptorForType(this.objectType)
        ]).spread(function(systemSections, uiDescriptor) {
            context.object = _.find(systemSections, {id: systemSectionId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getCertificate(certificateId: string, stack: Array<any>) {
        let self = this,
            objectType = 'CryptoCertificate',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/crypto-certificate/_/' + certificateId
            };
        return Promise.all([
            this.cryptoCertificateRepository.listCryptoCertificates(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(certificates, uiDescriptor) {
            context.object = _.find(certificates, {id: certificateId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public selectNewCertificateType(stack: Array<any>) {
        let self = this,
            objectType = 'CryptoCertificate',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.keys(CryptoCertificateType), (type) => this.cryptoCertificateRepository.getNewCryptoCertificate(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(cryptoCertificates, uiDescriptor) {
            cryptoCertificates._objectType = objectType;
            context.object = _.compact(cryptoCertificates);
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createCertificate(certificateType: string, stack: Array<any>) {
        let self = this,
            objectType = 'CryptoCertificate',
            columnIndex = 2,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + certificateType
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            let share = _.find(parentContext.object, {_tmpId: certificateType});
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getAlertFilter(filterId: string, stack: Array<any>) {
        let self = this,
            objectType = 'AlertFilter',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/alert-filter/_/' + filterId
            };
        return Promise.all([
            this.alertFilterRepository.listAlertFilters(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(alterFilters, uiDescriptor) {
            context.object = _.find(alterFilters, {id: filterId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createAlertFilter(stack: Array<any>) {
        let self = this,
            objectType = 'AlertFilter',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.alertFilterRepository.getNewAlertFilter(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(alterFilter, uiDescriptor) {
            context.object = alterFilter;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getAlertSettings(stack: Array<any>) {
        let self = this,
            objectType = 'Mail',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/settings'
            };
        return Promise.all([
            this.mailRepository.getConfig(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(mailConfig, uiDescriptor) {
            context.object = mailConfig;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createTunable(stack: Array<any>) {
        let self = this,
            objectType = 'Tunable',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.tunableRepository.getNewTunable(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(tunable, uiDescriptor) {
            context.object = tunable;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getTunable(tunableId: string, stack: Array<any>) {
        let self = this,
            objectType = 'Tunable',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/tunable/_/' + tunableId
            };
        return Promise.all([
            this.tunableRepository.listTunables(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(tunables, uiDescriptor) {
            context.object = _.find(tunables, {id: tunableId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createNtpServer(stack: Array<any>) {
        let self = this,
            objectType = 'NtpServer',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.ntpServerRepository.getNewNtpServer(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(ntpServer, uiDescriptor) {
            context.object = ntpServer;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getNtpServer(ntpServerId: string, stack: Array<any>) {
        let self = this,
            objectType = 'NtpServer',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/ntp-server/_/' + ntpServerId
            };
        return Promise.all([
            this.ntpServerRepository.listNtpServers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(ntpServers, uiDescriptor) {
            context.object = _.find(ntpServers, {id: ntpServerId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

}

