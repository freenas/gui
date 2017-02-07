const AlertType = {
    SYSTEM: 'SYSTEM' as 'SYSTEM',
    VOLUME: 'VOLUME' as 'VOLUME',
    DISK: 'DISK' as 'DISK'
};
type AlertType = (typeof AlertType)[keyof typeof AlertType];
export {AlertType};
