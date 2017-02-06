const DockerVolumeHostPathSource = {
    HOST: 'HOST' as 'HOST',
    VM: 'VM' as 'VM'
};
type DockerVolumeHostPathSource = (typeof DockerVolumeHostPathSource)[keyof typeof DockerVolumeHostPathSource];
export {DockerVolumeHostPathSource};
