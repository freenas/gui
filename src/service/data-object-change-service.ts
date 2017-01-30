import {Map} from 'immutable';
import * as _ from 'lodash';

export class DataObjectChangeService {
    public handleDataChange(uiObjects: Array<any>, state: Map<string, Map<string, any>>, objectType?: string|Object, options?: any): Array<any> {
        if (_.isObject(objectType)) {
            options = objectType;
            objectType = null;
        }
        options = options || {};

        let newObjects = _.sortBy(
            _.filter(
                state.valueSeq().toJS(),
                options.filter || _.identity
            ),
            options.sort || 'id'
        );
        if (!uiObjects) {
            uiObjects = newObjects;
        } else {
            _.forEach(newObjects, (newObject: any) => {
                let uiObject = _.find(uiObjects, {id: newObject.id});
                if (uiObject) {
                    Object.assign(uiObject, newObject);
                } else {
                    uiObjects.splice(_.sortedIndexBy(uiObjects, newObject, options.sort || 'id'), 0, newObject);
                }
            });
            _.forEachRight(uiObjects, uiObject => {
                if (!state.has(uiObject.id) && (!objectType || objectType === uiObject._objectType)) {
                    uiObjects.splice(_.indexOf(uiObjects, uiObject), 1);
                }
            });
        }
        return uiObjects;
    }
}
