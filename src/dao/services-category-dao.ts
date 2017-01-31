import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {ServiceRepository} from "../repository/service-repository";
import {ServicesCategory} from '../model/ServicesCategory';

export class ServicesCategoryDao extends AbstractDao<ServicesCategory> {
    public constructor() {
        super(Model.ServicesCategory);
    }

    public list(): Promise<Array<any>> {
        return ServiceRepository.getInstance().listServicesCategories();
    }
}
