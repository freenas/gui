const SystemUiWebuiprotocolItems = {
    HTTP: 'HTTP' as 'HTTP',
    HTTPS: 'HTTPS' as 'HTTPS'
};
type SystemUiWebuiprotocolItems = (typeof SystemUiWebuiprotocolItems)[keyof typeof SystemUiWebuiprotocolItems];
export {SystemUiWebuiprotocolItems};
