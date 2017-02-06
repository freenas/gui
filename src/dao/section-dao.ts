import {AbstractDao} from './abstract-dao';
import {Section} from '../model/Section';

export class SectionDao extends AbstractDao<Section> {

    public constructor() {
        super(Section.getClassName());
    }

}
