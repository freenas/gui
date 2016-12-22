import {AbstractRepository} from "./abstract-repository-ng";
import {ServiceDao} from "../dao/service-dao";
import {ServicesCategoryDao} from "../dao/services-category-dao";
import * as Promise from "bluebird";
import * as _ from "lodash";

export class ServiceRepository extends AbstractRepository {
    private static instance: ServiceRepository;
    private constructor(private serviceDao: ServiceDao,
                        private servicesCategoryDao: ServicesCategoryDao) {
        super(['Service']);
    }

    public static getInstance() {
        if (!ServiceRepository.instance) {
            ServiceRepository.instance = new ServiceRepository(
                new ServiceDao(),
                new ServicesCategoryDao()
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

    protected handleStateChange(name: string, data: any) {}
    protected handleEvent(name: string, data: any) {}
}
