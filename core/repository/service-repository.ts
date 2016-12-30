import {AbstractRepository} from "./abstract-repository-ng";
import {ServiceDao} from "../dao/service-dao";
import {ServicesCategoryDao} from "../dao/services-category-dao";
import {ServiceDyndnsDao} from "../dao/service-dyndns-dao";
import {ServiceUpsDao} from "../dao/service-ups-dao";
import * as Promise from "bluebird";
import * as _ from "lodash";
import {RsyncdModuleDao} from "../dao/rsyncd-module-dao";
import {Map} from "immutable";
import {ModelEventName} from "../model-event-name";

export class ServiceRepository extends AbstractRepository {
    private static instance: ServiceRepository;
    private rsyncdModules: Map<string, Map<string, any>>;

    private constructor(private serviceDao: ServiceDao,
                        private serviceDyndnsDao: ServiceDyndnsDao,
                        private servicesCategoryDao: ServicesCategoryDao,
                        private rsyncdModuleDao: RsyncdModuleDao,
                        private serviceUpsDao: ServiceUpsDao) {
        super([
            'Service',
            'RsyncdModule'
        ]);
    }

    public static getInstance() {
        if (!ServiceRepository.instance) {
            ServiceRepository.instance = new ServiceRepository(
                new ServiceDao(),
                new ServiceDyndnsDao,
                new ServicesCategoryDao(),
                new RsyncdModuleDao(),
                new ServiceUpsDao()
            );
        }
        return ServiceRepository.instance;
    }

    public listServices(): Promise<Array<any>> {
        return this.serviceDao.list();
    }

    public saveService(service: any) {
        return this.serviceDao.save(service);
    }

    public listRsyncdModules() {
        let promise = this.rsyncdModules ? Promise.resolve(this.rsyncdModules.toSet().toJS()) : this.rsyncdModuleDao.list();
        return promise.then((rsyncdModules) => {
            rsyncdModules._objectType = 'RsyncdModule';
            return rsyncdModules;
        });
    }

    public getNewRsyncdModule() {
        return this.rsyncdModuleDao.getNewInstance();
    }

    public listServicesCategories(): Promise<Array<any>> {
        let self = this;
        return this.listServices().then(function (services) {
            return Promise.all([
                self.getServicesCategory('Sharing', services, [
                    'smb',
                    'nfs',
                    'afp',
                    'webdav',
                    'iscsi'
                ]),
                self.getServicesCategory('Management', services, [
                    'sshd',
                    'smartd',
                    'dyndns',
                    'snmp',
                    'lldp',
                    'ups',
                    'dc'
                ]),
                self.getServicesCategory('File Transfer', services, [
                    'ftp',
                    'rsyncd',
                    'tftpd'
                ])
            ]);
        }).then(function(categories) {
            categories._objectType = 'ServicesCategory';
            return categories;
        });
    }

    private getServicesCategory(name: string, services: Array<any>, selectedIds: Array<string>): Promise<any> {
        return this.servicesCategoryDao.getNewInstance().then(function(category) {
            category._isNew = false;
            category.id = _.kebabCase(name);
            category.name = name;
            category.services = services;
            category.types = selectedIds.map(function(x) { return 'service-' + x; });
            return category;
        });

    }

    public listDyndnsProviders(): Promise<Array<any>> {
        return this.serviceDyndnsDao.getProviders();
    }

    public listUpsDrivers(): Promise<Array<any>> {
        return this.serviceUpsDao.getDrivers();
    }

    public listUpsUsbDevices(): Promise<Array<any>> {
        return this.serviceUpsDao.getUsbDevices();
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'RsyncdModule':
                this.rsyncdModules = this.dispatchModelEvents(this.rsyncdModules, ModelEventName.RsyncdModule, state);
                break;
        }
    }
    protected handleEvent(name: string, data: any) {}
}
