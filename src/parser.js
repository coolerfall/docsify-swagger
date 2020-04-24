let defReg = new RegExp("#\\/definitions\\/(\\S*)");

export function parse(docJson) {
    let swaggerJson = JSON.parse(docJson)

    let fixedSwaggerJson = {
        info: swaggerJson.info,
        tags: swaggerJson.tags,
        apis: [],
    };

    let paths = swaggerJson.paths;
    let definitions = swaggerJson.definitions;

    for (let pk in paths) {
        let apis = paths[pk];
        for (let rk in apis) {
            let api = apis[rk];
            let requestParams = api.parameters;
            let responseParams = api.responses[200];
            if (responseParams) {
                responseParams.description = undefined;
            }

            fixedSwaggerJson.apis.push({
                tag: api.tags[0],
                method: rk.toUpperCase(),
                path: pk,
                summary: api.summary,
                description: api.description,
                deprecated: api.deprecated,
                request: parseParams(requestParams, definitions),
                response: parseSchemaParam(responseParams, definitions, true)
            });
        }
    }

    return fixedSwaggerJson;
}

function parseParams(params, definitions) {
    let fixedParams = [];
    if (!params) {
        return fixedParams;
    }

    for (let index = 0; index < params.length; index++) {
        let param = params[index];
        let schema = param.schema;
        if (!schema) {
            let fixedParam = parseNormalParam(param);
            if (param.in == "path") {
                fixedParams = [fixedParam].concat(fixedParams);
            } else {
                fixedParams.push(fixedParam);
            }
            continue;
        }

        fixedParams = fixedParams.concat(parseSchemaParam(param, definitions));
    }

    return fixedParams;
}

function parseNormalParam(param) {
    return {
        name: param.name,
        type: capitalize(resolveType(param.type, param.format)),
        required: param.required == true,
        description: param.description,
        example: param["x-example"]
    };
}

function parseSchemaParam(param, definitions, expand = false) {
    if (!param) {
        return [];
    }

    let schema = param.schema;
    if (!schema) {
        return [];
    }

    let type = schema.type;
    if (type == "string") {
        return [{
            name: param.name,
            type: capitalize(type),
            required: param.required == true,
            description: param.description,
            example: param["x-example"]
        }];
    }

    if (type == "object" && schema.additionalProperties) {
        return [{
            name: param.name,
            type: capitalize(type),
            required: param.required = true,
            description: param.description
        }];
    }

    if (type == "array") {
        let refType = "";
        let items = schema.items;
        if (items.type) {
            refType = capitalize(resolve(items.type, items.format));
        } else {
            refType = refParamName(schema.items.$ref);
        }
        return [{
            name: param.name,
            type: escape(`Array<${refType}>`),
            refType: refType,
            description: param.description,
            required: param.required == true,
            refParam: parseRefParam(refType, definitions)
        }];
    } else {
        let refType = refParamName(schema.$ref);
        if (expand || param.in == "body") {
            return parseRefParam(refType, definitions);
        }

        return [{
            name: param.name,
            type: escape(`${refType}`),
            refType: refType,
            description: param.description,
            required: param.required == true,
            refParam: parseRefParam(refType, definitions)
        }];
    }
}

function parseRefParam(refType, definitions, refChain = []) {
    let param = definitions[refType];
    if (!param) {
        return [];
    }

    let fixedParams = [];
    let properties = param.properties;
    let requireds = param.required;
    requireds = requireds ? requireds : [];

    for (let key in properties) {
        let prop = properties[key];
        let ref = prop.$ref;
        if (!ref && prop.type != "array") {
            fixedParams.push({
                name: key,
                type: escape(capitalize(resolveType(prop.type, prop.format))),
                required: requireds.includes(key),
                description: prop.description,
                example: prop.example
            });
            continue;
        }

        let type = "";
        let nestedRefType = "";
        if (prop.type == "array") {
            let items = prop.items;
            if (items.type) {
                nestedRefType = capitalize(resolveType(items.type, items.format));
            } else {
                nestedRefType = refParamName(items.$ref);
            }
            type = `Array<${nestedRefType}>`;
        } else {
            nestedRefType = refParamName(ref);
            if (prop.type) {
                type = resolveType(prop.type, prop.format);
            } else {
                type = nestedRefType;
            }
        }

        if (refChain.includes(nestedRefType)) {
            fixedParams.pop();
            continue;
        }

        refChain.push(nestedRefType);
        fixedParams.push({
            name: key,
            type: escape(capitalize(type)),
            refType: nestedRefType,
            required: requireds.includes(key),
            description: prop.description,
            refParam: parseRefParam(nestedRefType, definitions, refChain)
        });
    }

    return fixedParams;
}

function resolveType(type, format) {
    switch (type) {
        case "integer":
            return format == "int64" ? "long" : "integer";

        case "number":
            return "double";

        case "string":
            return format == "date-time" ? "date" : "string";

        default:
            return type;
    }
}

function refParamName(ref) {
    let group = ref.match(defReg);
    if (!group || !group[1]) {
        return "";
    }

    return group[1];
}

function capitalize(origin) {
    if (typeof origin !== "string") {
        return origin
    }
    return origin.charAt(0).toUpperCase() + origin.slice(1)
}

function escape(origin) {
    if (!origin) {
        return;
    }

    origin = origin.replace(/</g, "\\<");
    return origin.replace(/>/g, "\\>");
}