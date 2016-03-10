var FS = require('./fs-promise');
var Promise = require('montage/core/promise').Promise;
var Path = require('path');
var Service = require('./backend/service');

require('json.sortify');

exports.generateServices = function generateServices (options) {
    return Service.findMethodsForServices(options).then(function (methodsForServices) {
        var servicesTree = new ServicesTree(),
            readMethodCounter,
            methodsForService,
            serviceName,
            node,
            method;

        for (var i = 0, l = methodsForServices.length; i < l; i++) {
            methodsForService = methodsForServices[i];
            readMethodCounter = 0;

            for (var ii = 0, ll = methodsForService.length; ii < ll; ii++) {
                method = methodsForService[ii];

                if (method && !method.private) {
                    serviceName = methodsForService._meta_data.service_name_camel_case;

                    if ((method.name === "query" || method.name === "get_config")) {
                        if (method.name === "get_config" && method["params-schema"] &&
                            method["params-schema"].items && method["params-schema"].items.length) {
                            continue;
                        }

                        if (++readMethodCounter > 1) {
                            throw new Error ("service with query and get_config rpc call");
                        }

                        node = servicesTree.getReadCrudNode();
                        node.method = methodsForService._meta_data.service_name + "." + method.name;

                        servicesTree.addInstanceMethodNodeToService(node, serviceName);

                    } else {
                        node = servicesTree.getTaskNode(method.name.toLowerCamelCase());
                        node.method = methodsForService._meta_data.service_name + "." + method.name;

                        servicesTree.addClassMethodNodeToService(node, serviceName);
                    }
                }
            }
        }

        return Service.findTaskDescriptors(options).then(function (taskDescriptors) {
            var taskDescriptor;

            for (var i = 0, l = taskDescriptors.length; i < l; i++) {
                taskDescriptor = taskDescriptors[i];

                if (taskDescriptor.taskType === "update" || taskDescriptor.taskType === "configure") {
                    node = servicesTree.getTaskNode("update");

                    if (taskDescriptor.taskType === "configure") {
                        node._meta_data = {
                            isConfigure: true
                        };
                    }

                    _applyRestrictionsOnServiceNodeWithTaskDescriptor(node, taskDescriptor);

                } else {
                    node = servicesTree.getTaskNode(taskDescriptor.taskType.toLowerCamelCase());

                    if (taskDescriptor.taskType === "create") {
                        _applyRestrictionsOnServiceNodeWithTaskDescriptor(node, taskDescriptor);
                    }
                }

                node.task = taskDescriptor.task;
                servicesTree.addInstanceMethodNodeToService(node, taskDescriptor.name);
            }

            if (options.save) {
                return FS.getAbsolutePath(options.target).then(function (absoluteTarget) {
                    return FS.isDirectoryAtPath(absoluteTarget).then(function (isDirectoryAtPath) {
                        if (isDirectoryAtPath) {
                            var targetPath = Path.join(absoluteTarget, "services.mjson");

                            return FS.writeFileAtPathWithData(targetPath, servicesTree.toJSON());
                        } else {
                            throw new Error("not a directory");
                        }
                    });
                });
            }

            if (options.verbose) {
                console.log(servicesTree.toJSON());
            }

            return Promise.resolve();
        });
    });
};


function _applyRestrictionsOnServiceNodeWithTaskDescriptor (node, taskDescriptor) {
    if (taskDescriptor.schema && taskDescriptor.schema.length) {
        var i = 0, length = taskDescriptor.schema.length, argumentDescriptors;

        while (!argumentDescriptors && i < length) {
            argumentDescriptors = taskDescriptor.schema[i++].allOf;
        }

        if (argumentDescriptors) {
            var argumentDescriptor, forbiddenFields,
                restrictions = Object.create(null);

            for (var ii = 0, ll = argumentDescriptors.length; ii < ll; ii++) {
                argumentDescriptor = argumentDescriptors[ii];

                if (argumentDescriptor["required"]) {
                    restrictions.requiredFields = argumentDescriptor["required"];

                } else if (argumentDescriptor["not"]) {
                    forbiddenFields = argumentDescriptor["not"]["required"];

                    if (forbiddenFields) {
                        restrictions.forbiddenFields = forbiddenFields;
                    }
                }
            }

            if (Object.keys(restrictions).length) {
                node.restrictions = restrictions;
            }
        }
    }
}


function ServicesTree () {
    this.crudTree = Object.create(null);
}


ServicesTree.prototype.getReadCrudNode = function () {
    return new APINode("read", "rpc", "call");
};


ServicesTree.prototype.getTaskNode = function (type) {
    return new APINode(type, "rpc", "call", "task.submit");
};


ServicesTree.prototype.addServiceWithName = function (name) {
    return (this.crudTree[name] = new ServiceNode());
};


ServicesTree.prototype.addInstanceMethodNodeToService = function (node, serviceName) {
    var service = this.crudTree[serviceName];

    if (!service) {
        service = this.addServiceWithName(serviceName);
    }

    service.addInstanceMethodNode(node);
};


ServicesTree.prototype.addClassMethodNodeToService = function (node, serviceName) {
    var service = this.crudTree[serviceName];

    if (!service) {
        service = this.addServiceWithName(serviceName);
    }

    service.addClassMethodNode(node);
};

ServicesTree.prototype.toJSON = function () {
    return JSON.sortify(this.crudTree, null, 4);
};


function ServiceNode () {}


ServiceNode.prototype.addInstanceMethodNode = function (node) {
    if (!this.instance) {
        this.instance = Object.create(null);
    }
    this.instance[node.type] = node;
};


ServiceNode.prototype.addClassMethodNode = function (node) {
    if (!this.class) {
        this.class = Object.create(null);
    }
    this.class[node.type] = node;
};


function APINode (type, namespace, name, method, arguments) {
    Object.defineProperty(this, "type", {
        value: type,
        enumerable: false
    });

    this.namespace = namespace;
    this.name = name;
    this.method = method;
    this.arguments = arguments;
}


APINode.prototype.task = null;
