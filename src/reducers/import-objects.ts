import * as immutable from 'immutable';
import * as _ from 'lodash';

export function importObjects(previousState, action): immutable.Map<string, any> {
    let type = action.meta.type,
        idPath = action.meta.idPath,
        typeState = previousState.has(type) ? previousState.get(type) : immutable.Map<string, any>();

    for (let object of action.payload) {
        let id = _.get(object, idPath);
        typeState = typeState.set(id, immutable.fromJS(object)
        	.set('_stableId', id)
        	.set('_objectType', type));
    }

    return previousState.set(type, typeState);
}

