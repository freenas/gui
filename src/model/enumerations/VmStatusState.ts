const VmStatusState = {
    STOPPED: 'STOPPED' as 'STOPPED',
    BOOTLOADER: 'BOOTLOADER' as 'BOOTLOADER',
    RUNNING: 'RUNNING' as 'RUNNING',
    PAUSED: 'PAUSED' as 'PAUSED'
};
type VmStatusState = (typeof VmStatusState)[keyof typeof VmStatusState];
export {VmStatusState};
