const ServiceUpsMode = {
    MASTER: 'MASTER' as 'MASTER',
    SLAVE: 'SLAVE' as 'SLAVE'
};
type ServiceUpsMode = (typeof ServiceUpsMode)[keyof typeof ServiceUpsMode];
export {ServiceUpsMode};
