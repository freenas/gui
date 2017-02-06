const UpdateOpsOperation = {
    delete: 'delete' as 'delete',
    install: 'install' as 'install',
    upgrade: 'upgrade' as 'upgrade'
};
type UpdateOpsOperation = (typeof UpdateOpsOperation)[keyof typeof UpdateOpsOperation];
export {UpdateOpsOperation};
