const PowerChangedOperation = {
    SHUTDOWN: 'SHUTDOWN' as 'SHUTDOWN',
    REBOOT: 'REBOOT' as 'REBOOT'
};
type PowerChangedOperation = (typeof PowerChangedOperation)[keyof typeof PowerChangedOperation];
export {PowerChangedOperation};
