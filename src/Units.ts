import * as _ from 'lodash';

function makeList(values: Array<string>, power: number, start = 0) {
    return _.map(
        _.range(start, values.length + start),
        function(i) {
            return {
                label: values[i - start],
                value: Math.pow(power, i)
            };
        }
    );
}

const kb = 1024;
const seconds = 60;

const BYTE_SIZES = makeList(['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], kb);
export {BYTE_SIZES};

const MEGABYTE_SIZES = makeList(['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], kb);
export {MEGABYTE_SIZES};

const GIGABYTE_SIZES = makeList(['GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], kb);
export {GIGABYTE_SIZES};

const TRANSFER_SPEED = makeList(['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'], kb);
export {TRANSFER_SPEED};

const SECONDS = makeList(['secs', 'mins', 'hrs'], seconds);
export {SECONDS};
