import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import * as Promise from "bluebird";
import {ServiceRepository} from "../repository/service-repository";

export class ServicesCategoryDao extends AbstractDao {
    public constructor() {
        super(Model.ServicesCategory);
    }

    public list(): Promise<Array<any>> {
        return ServiceRepository.getInstance().listServicesCategories();
    }
}
