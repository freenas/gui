const VolumeDatasetPermissionsType = {
    PERM: 'PERM' as 'PERM',
    ACL: 'ACL' as 'ACL'
};
type VolumeDatasetPermissionsType = (typeof VolumeDatasetPermissionsType)[keyof typeof VolumeDatasetPermissionsType];
export {VolumeDatasetPermissionsType};
