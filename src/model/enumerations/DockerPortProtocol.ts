const DockerPortProtocol = {
    TCP: 'TCP' as 'TCP',
    UDP: 'UDP' as 'UDP'
};
type DockerPortProtocol = (typeof DockerPortProtocol)[keyof typeof DockerPortProtocol];
export {DockerPortProtocol};
