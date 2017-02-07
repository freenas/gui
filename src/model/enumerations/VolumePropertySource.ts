const VolumePropertySource = {
    NONE: 'NONE' as 'NONE',
    DEFAULT: 'DEFAULT' as 'DEFAULT',
    LOCAL: 'LOCAL' as 'LOCAL',
    INHERITED: 'INHERITED' as 'INHERITED'
};
type VolumePropertySource = (typeof VolumePropertySource)[keyof typeof VolumePropertySource];
export {VolumePropertySource};
