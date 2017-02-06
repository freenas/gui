const VolumePropertyfailmodeValue = {
    wait: 'wait' as 'wait',
    continue: 'continue' as 'continue',
    panic: 'panic' as 'panic'
};
type VolumePropertyfailmodeValue = (typeof VolumePropertyfailmodeValue)[keyof typeof VolumePropertyfailmodeValue];
export {VolumePropertyfailmodeValue};
