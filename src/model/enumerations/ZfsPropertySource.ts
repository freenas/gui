const ZfsPropertySource = {
    NONE: 'NONE' as 'NONE',
    DEFAULT: 'DEFAULT' as 'DEFAULT',
    LOCAL: 'LOCAL' as 'LOCAL',
    INHERITED: 'INHERITED' as 'INHERITED',
    RECEIVED: 'RECEIVED' as 'RECEIVED'
};
type ZfsPropertySource = (typeof ZfsPropertySource)[keyof typeof ZfsPropertySource];
export {ZfsPropertySource};
