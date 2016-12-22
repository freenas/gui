import * as Immutable from 'immutable';

export function initialize(state, action) {
    if (action.type === '@@INIT') {
        return Immutable.Map<string, any>();
    }
}
