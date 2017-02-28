import * as _ from 'lodash';

export class EnumerationsService {
    // DTM
    public static cleanupMontageMetadata(enumeration) {
        return _.reject(_.keys(enumeration), function(value) { return value !== '_montage_metadata' })
    }
}
