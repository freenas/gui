const DockerHostState = {
    UP: 'UP' as 'UP',
    DOWN: 'DOWN' as 'DOWN'
};
type DockerHostState = (typeof DockerHostState)[keyof typeof DockerHostState];
export {DockerHostState};
