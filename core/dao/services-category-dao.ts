import {AbstractDao} from "./abstract-dao";
import * as Promise from "bluebird";
import {ServiceRepository} from "../repository/service-repository";

export class ServicesCategoryDao extends AbstractDao {
    public constructor() {
        super('ServicesCategory');
    }

    public list(): Promise<Array<any>> {
        return ServiceRepository.getInstance().listServicesCategories();
    }
}
