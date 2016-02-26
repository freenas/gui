var FS = require('./fs-promise');
var Promise = require('montage/core/promise').Promise;
var Path = require('path');
var Service = require('./backend/service');

require('json.sortify');

exports.generateServices = function generateServices (options) {
    return Service.findMethodsForServices(options).then(function (methodsForServices) {
        var servicesTree = new ServicesTree(),
            methodForService,
            serviceName,
            node,
            method;

        for (var i = 0, l = methodsForServices.length; i < l; i++) {
            methodForService = methodsForServices[i];

            for (var ii = 0, ll = methodForService.length; ii < ll; ii++) {
                method = methodForService[ii];

                if (method && method.name === "query" && !method.private) {
                    serviceName = methodForService._meta_data.service_name_camel_case;

                    node = servicesTree.getReadCrudNode();
                    node.method = methodForService._meta_data.service_name + ".query";

                    servicesTree.addAPINodeToService(node, serviceName);

                    break;
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
                    node = servicesTree.getTaskNode(taskDescriptor.taskType);

                    if (taskDescriptor.taskType === "create") {
                        _applyRestrictionsOnServiceNodeWithTaskDescriptor(node, taskDescriptor);
                    }
                }

                node.task = taskDescriptor.task;
                servicesTree.addAPINodeToService(node, taskDescriptor.name);
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


ServicesTree.prototype.addAPINodeToService = function (node, serviceName) {
    var service = this.crudTree[serviceName];

    if (!service) {
        service = this.addServiceWithName(serviceName);
    }

    service.addAPINode(node);
};


ServicesTree.prototype.toJSON = function () {
    return JSON.sortify(this.crudTree, null, 4);
};


function ServiceNode () {}


ServiceNode.prototype.addAPINode = function (node) {
    this[node.type] = node;
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
