const RsyncCopyRsyncdirection = {
    PUSH: 'PUSH' as 'PUSH',
    PULL: 'PULL' as 'PULL'
};
type RsyncCopyRsyncdirection = (typeof RsyncCopyRsyncdirection)[keyof typeof RsyncCopyRsyncdirection];
export {RsyncCopyRsyncdirection};
