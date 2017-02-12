import {AbstractDataObject} from './AbstractDataObject';
import {Service} from './Service';

export class ServicesCategory extends AbstractDataObject {
    name: string;
    services: Array<Service>;
    types: Array<string>;
    isLoading: boolean;
}
