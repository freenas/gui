import {Map} from "immutable";
import _ = require("lodash");
export class DataObjectChangeService {
    public handleDataChange(uiObjects: Array<any>, state: Map<string, Map<string, any>>) {
        state.forEach(function(volume) {
            let entry = _.find(uiObjects, {id: volume.get('id')});
            if (entry) {
                Object.assign(entry, volume.toJS());
            } else {
                entry = volume.toJS();
                (entry as any)._objectType = 'Volume';
                uiObjects.push(entry);
            }
        });
        if (uiObjects) {
            for (let i = uiObjects.length - 1; i >= 0; i--) {
                if (!state.has((uiObjects[i] as any).id)) {
                    uiObjects.splice(i, 1);
                }
            }
        }
    }
}
