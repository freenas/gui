import {Map} from 'immutable';
import * as _ from 'lodash';

export class DataObjectChangeService {
    public handleDataChange(uiObjects: Array<any>, state: Map<string, Map<string, any>>, objectType?: string): Array<any> {
        uiObjects = uiObjects || [];
        state.forEach(function(volume) {
            let entry = _.find(uiObjects, {id: volume.get('id')});
            if (entry) {
                Object.assign(entry, volume.toJS());
            } else {
                entry = volume.toJS();
                uiObjects.push(entry);
            }
        });
        if (uiObjects) {
            for (let i = uiObjects.length - 1; i >= 0; i--) {
                let uiObject = uiObjects[i];
                if (!state.has((uiObject as any).id) && (!objectType || objectType === uiObject._objectType)) {
                    uiObjects.splice(i, 1);
                }
            }
        }
        return uiObjects;
    }
}
