import * as _ from 'lodash';

function makeList(values: Array<string>, power: number) {
    return _.map(
        _.range(0, values.length),
        function(i) {
            return {
                label: values[i],
                value: Math.pow(power, i)
            };
        }
    );
}

let kb = 1024;
let seconds = 60;

const BYTE_SIZES = makeList(['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], kb);
export {BYTE_SIZES};

const TRANSFER_SPEED = makeList(['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'], kb);
export {TRANSFER_SPEED};

const SECONDS = makeList(['secs', 'mins', 'hrs'], seconds);
export {SECONDS};
