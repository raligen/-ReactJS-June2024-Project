(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http'), require('fs'), require('crypto')) :
    typeof define === 'function' && define.amd ? define(['http', 'fs', 'crypto'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Server = factory(global.http, global.fs, global.crypto));
}(this, (function (http, fs, crypto) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
    var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

    class ServiceError extends Error {
        constructor(message = 'Service Error') {
            super(message);
            this.name = 'ServiceError'; 
        }
    }

    class NotFoundError extends ServiceError {
        constructor(message = 'Resource not found') {
            super(message);
            this.name = 'NotFoundError'; 
            this.status = 404;
        }
    }

    class RequestError extends ServiceError {
        constructor(message = 'Request error') {
            super(message);
            this.name = 'RequestError'; 
            this.status = 400;
        }
    }

    class ConflictError extends ServiceError {
        constructor(message = 'Resource conflict') {
            super(message);
            this.name = 'ConflictError'; 
            this.status = 409;
        }
    }

    class AuthorizationError extends ServiceError {
        constructor(message = 'Unauthorized') {
            super(message);
            this.name = 'AuthorizationError'; 
            this.status = 401;
        }
    }

    class CredentialError extends ServiceError {
        constructor(message = 'Forbidden') {
            super(message);
            this.name = 'CredentialError'; 
            this.status = 403;
        }
    }

    var errors = {
        ServiceError,
        NotFoundError,
        RequestError,
        ConflictError,
        AuthorizationError,
        CredentialError
    };

    const { ServiceError: ServiceError$1 } = errors;


    function createHandler(plugins, services) {
        return async function handler(req, res) {
            const method = req.method;
            console.info(`<< ${req.method} ${req.url}`);

            // Redirect fix for admin panel relative paths
            if (req.url.slice(-6) == '/admin') {
                res.writeHead(302, {
                    'Location': `http://${req.headers.host}/admin/`
                });
                return res.end();
            }

            let status = 200;
            let headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            };
            let result = '';
            let context;

            // NOTE: the OPTIONS method results in undefined result and also it never processes plugins - keep this in mind
            if (method == 'OPTIONS') {
                Object.assign(headers, {
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Credentials': false,
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Authorization, X-Admin'
                });
            } else {
                try {
                    context = processPlugins();
                    await handle(context);
                } catch (err) {
                    if (err instanceof ServiceError$1) {
                        status = err.status || 400;
                        result = composeErrorObject(err.code || status, err.message);
                    } else {
                        // Unhandled exception, this is due to an error in the service code - REST consumers should never have to encounter this;
                        // If it happens, it must be debugged in a future version of the server
                        console.error(err);
                        status = 500;
                        result = composeErrorObject(500, 'Server Error');
                    }
                }
            }

            res.writeHead(status, headers);
            if (context != undefined && context.util != undefined && context.util.throttle) {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
            }
            res.end(result);

            function processPlugins() {
                const context = { params: {} };
                plugins.forEach(decorate => decorate(context, req));
                return context;
            }

            async function handle(context) {
                const { serviceName, tokens, query, body } = await parseRequest(req);
                if (serviceName == 'admin') {
                    return ({ headers, result } = services['admin'](method, tokens, query, body));
                } else if (serviceName == 'favicon.ico') {
                    return ({ headers, result } = services['favicon'](method, tokens, query, body));
                }

                const service = services[serviceName];

                if (service === undefined) {
                    status = 400;
                    result = composeErrorObject(400, `Service "${serviceName}" is not supported`);
                    console.error('Missing service ' + serviceName);
                } else {
                    result = await service(context, { method, tokens, query, body });
                }

                // NOTE: logout does not return a result
                // in this case the content type header should be omitted, to allow checks on the client
                if (result !== undefined) {
                    result = JSON.stringify(result);
                } else {
                    status = 204;
                    delete headers['Content-Type'];
                }
            }
        };
    }



    function composeErrorObject(code, message) {
        return JSON.stringify({
            code,
            message
        });
    }

    async function parseRequest(req) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const tokens = url.pathname.split('/').filter(x => x.length > 0);
        const serviceName = tokens.shift();
        const queryString = url.search.split('?')[1] || '';
        const query = queryString
            .split('&')
            .filter(s => s != '')
            .map(x => x.split('='))
            .reduce((p, [k, v]) => Object.assign(p, { [k]: decodeURIComponent(v) }), {});
        const body = await parseBody(req);

        return {
            serviceName,
            tokens,
            query,
            body
        };
    }

    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => body += chunk.toString());
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    resolve(body);
                }
            });
        });
    }

    var requestHandler = createHandler;

    class Service {
        constructor() {
            this._actions = [];
            this.parseRequest = this.parseRequest.bind(this);
        }

        /**
         * Handle service request, after it has been processed by a request handler
         * @param {*} context Execution context, contains result of middleware processing
         * @param {{method: string, tokens: string[], query: *, body: *}} request Request parameters
         */
        async parseRequest(context, request) {
            for (let { method, name, handler } of this._actions) {
                if (method === request.method && matchAndAssignParams(context, request.tokens[0], name)) {
                    return await handler(context, request.tokens.slice(1), request.query, request.body);
                }
            }
        }

        /**
         * Register service action
         * @param {string} method HTTP method
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        registerAction(method, name, handler) {
            this._actions.push({ method, name, handler });
        }

        /**
         * Register GET action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        get(name, handler) {
            this.registerAction('GET', name, handler);
        }

        /**
         * Register POST action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        post(name, handler) {
            this.registerAction('POST', name, handler);
        }

        /**
         * Register PUT action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        put(name, handler) {
            this.registerAction('PUT', name, handler);
        }

        /**
         * Register PATCH action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        patch(name, handler) {
            this.registerAction('PATCH', name, handler);
        }

        /**
         * Register DELETE action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        delete(name, handler) {
            this.registerAction('DELETE', name, handler);
        }
    }

    function matchAndAssignParams(context, name, pattern) {
        if (pattern == '*') {
            return true;
        } else if (pattern[0] == ':') {
            context.params[pattern.slice(1)] = name;
            return true;
        } else if (name == pattern) {
            return true;
        } else {
            return false;
        }
    }

    var Service_1 = Service;

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var util = {
        uuid
    };

    const uuid$1 = util.uuid;


    const data = fs__default['default'].existsSync('./data') ? fs__default['default'].readdirSync('./data').reduce((p, c) => {
        const content = JSON.parse(fs__default['default'].readFileSync('./data/' + c));
        const collection = c.slice(0, -5);
        p[collection] = {};
        for (let endpoint in content) {
            p[collection][endpoint] = content[endpoint];
        }
        return p;
    }, {}) : {};

    const actions = {
        get: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            return responseData;
        },
        post: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            // TODO handle collisions, replacement
            let responseData = data;
            for (let token of tokens) {
                if (responseData.hasOwnProperty(token) == false) {
                    responseData[token] = {};
                }
                responseData = responseData[token];
            }

            const newId = uuid$1();
            responseData[newId] = Object.assign({}, body, { _id: newId });
            return responseData[newId];
        },
        put: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens.slice(0, -1)) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined && responseData[tokens.slice(-1)] !== undefined) {
                responseData[tokens.slice(-1)] = body;
            }
            return responseData[tokens.slice(-1)];
        },
        patch: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined) {
                Object.assign(responseData, body);
            }
            return responseData;
        },
        delete: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (responseData.hasOwnProperty(token) == false) {
                    return null;
                }
                if (i == tokens.length - 1) {
                    const body = responseData[token];
                    delete responseData[token];
                    return body;
                } else {
                    responseData = responseData[token];
                }
            }
        }
    };

    const dataService = new Service_1();
    dataService.get(':collection', actions.get);
    dataService.post(':collection', actions.post);
    dataService.put(':collection', actions.put);
    dataService.patch(':collection', actions.patch);
    dataService.delete(':collection', actions.delete);


    var jsonstore = dataService.parseRequest;

    /*
     * This service requires storage and auth plugins
     */

    const { AuthorizationError: AuthorizationError$1 } = errors;



    const userService = new Service_1();

    userService.get('me', getSelf);
    userService.post('register', onRegister);
    userService.post('login', onLogin);
    userService.get('logout', onLogout);


    function getSelf(context, tokens, query, body) {
        if (context.user) {
            const result = Object.assign({}, context.user);
            delete result.hashedPassword;
            return result;
        } else {
            throw new AuthorizationError$1();
        }
    }

    function onRegister(context, tokens, query, body) {
        return context.auth.register(body);
    }

    function onLogin(context, tokens, query, body) {
        return context.auth.login(body);
    }

    function onLogout(context, tokens, query, body) {
        return context.auth.logout();
    }

    var users = userService.parseRequest;

    const { NotFoundError: NotFoundError$1, RequestError: RequestError$1 } = errors;


    var crud = {
        get,
        post,
        put,
        patch,
        delete: del
    };


    function validateRequest(context, tokens, query) {
        /*
        if (context.params.collection == undefined) {
            throw new RequestError('Please, specify collection name');
        }
        */
        if (tokens.length > 1) {
            throw new RequestError$1();
        }
    }

    function parseWhere(query) {
        const operators = {
            '<=': (prop, value) => record => record[prop] <= JSON.parse(value),
            '<': (prop, value) => record => record[prop] < JSON.parse(value),
            '>=': (prop, value) => record => record[prop] >= JSON.parse(value),
            '>': (prop, value) => record => record[prop] > JSON.parse(value),
            '=': (prop, value) => record => record[prop] == JSON.parse(value),
            ' like ': (prop, value) => record => record[prop].toLowerCase().includes(JSON.parse(value).toLowerCase()),
            ' in ': (prop, value) => record => JSON.parse(`[${/\((.+?)\)/.exec(value)[1]}]`).includes(record[prop]),
        };
        const pattern = new RegExp(`^(.+?)(${Object.keys(operators).join('|')})(.+?)$`, 'i');

        try {
            let clauses = [query.trim()];
            let check = (a, b) => b;
            let acc = true;
            if (query.match(/ and /gi)) {
                // inclusive
                clauses = query.split(/ and /gi);
                check = (a, b) => a && b;
                acc = true;
            } else if (query.match(/ or /gi)) {
                // optional
                clauses = query.split(/ or /gi);
                check = (a, b) => a || b;
                acc = false;
            }
            clauses = clauses.map(createChecker);

            return (record) => clauses
                .map(c => c(record))
                .reduce(check, acc);
        } catch (err) {
            throw new Error('Could not parse WHERE clause, check your syntax.');
        }

        function createChecker(clause) {
            let [match, prop, operator, value] = pattern.exec(clause);
            [prop, value] = [prop.trim(), value.trim()];

            return operators[operator.toLowerCase()](prop, value);
        }
    }


    function get(context, tokens, query, body) {
        validateRequest(context, tokens);

        let responseData;

        try {
            if (query.where) {
                responseData = context.storage.get(context.params.collection).filter(parseWhere(query.where));
            } else if (context.params.collection) {
                responseData = context.storage.get(context.params.collection, tokens[0]);
            } else {
                // Get list of collections
                return context.storage.get();
            }

            if (query.sortBy) {
                const props = query.sortBy
                    .split(',')
                    .filter(p => p != '')
                    .map(p => p.split(' ').filter(p => p != ''))
                    .map(([p, desc]) => ({ prop: p, desc: desc ? true : false }));

                // Sorting priority is from first to last, therefore we sort from last to first
                for (let i = props.length - 1; i >= 0; i--) {
                    let { prop, desc } = props[i];
                    responseData.sort(({ [prop]: propA }, { [prop]: propB }) => {
                        if (typeof propA == 'number' && typeof propB == 'number') {
                            return (propA - propB) * (desc ? -1 : 1);
                        } else {
                            return propA.localeCompare(propB) * (desc ? -1 : 1);
                        }
                    });
                }
            }

            if (query.offset) {
                responseData = responseData.slice(Number(query.offset) || 0);
            }
            const pageSize = Number(query.pageSize) || 10;
            if (query.pageSize) {
                responseData = responseData.slice(0, pageSize);
            }
    		
    		if (query.distinct) {
                const props = query.distinct.split(',').filter(p => p != '');
                responseData = Object.values(responseData.reduce((distinct, c) => {
                    const key = props.map(p => c[p]).join('::');
                    if (distinct.hasOwnProperty(key) == false) {
                        distinct[key] = c;
                    }
                    return distinct;
                }, {}));
            }

            if (query.count) {
                return responseData.length;
            }

            if (query.select) {
                const props = query.select.split(',').filter(p => p != '');
                responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                function transform(r) {
                    const result = {};
                    props.forEach(p => result[p] = r[p]);
                    return result;
                }
            }

            if (query.load) {
                const props = query.load.split(',').filter(p => p != '');
                props.map(prop => {
                    const [propName, relationTokens] = prop.split('=');
                    const [idSource, collection] = relationTokens.split(':');
                    console.log(`Loading related records from "${collection}" into "${propName}", joined on "_id"="${idSource}"`);
                    const storageSource = collection == 'users' ? context.protectedStorage : context.storage;
                    responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                    function transform(r) {
                        const seekId = r[idSource];
                        const related = storageSource.get(collection, seekId);
                        delete related.hashedPassword;
                        r[propName] = related;
                        return r;
                    }
                });
            }

        } catch (err) {
            console.error(err);
            if (err.message.includes('does not exist')) {
                throw new NotFoundError$1();
            } else {
                throw new RequestError$1(err.message);
            }
        }

        context.canAccess(responseData);

        return responseData;
    }

    function post(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length > 0) {
            throw new RequestError$1('Use PUT to update records');
        }
        context.canAccess(undefined, body);

        body._ownerId = context.user._id;
        let responseData;

        try {
            responseData = context.storage.add(context.params.collection, body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function put(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.set(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function patch(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.merge(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function del(context, tokens, query, body) {
        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing);

        try {
            responseData = context.storage.delete(context.params.collection, tokens[0]);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    /*
     * This service requires storage and auth plugins
     */

    const dataService$1 = new Service_1();
    dataService$1.get(':collection', crud.get);
    dataService$1.post(':collection', crud.post);
    dataService$1.put(':collection', crud.put);
    dataService$1.patch(':collection', crud.patch);
    dataService$1.delete(':collection', crud.delete);

    var data$1 = dataService$1.parseRequest;

    const imgdata = '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Td4DLneAwSddMiRH8tMU8nng/Yy+KQsM3AKBNbe35j5OH4A0dbV8AxwcAqMFyl73eHd3e2//nmn29wOGi3Kv+RixSgAAEkxpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjdjZDM3NWM3LTcwNmItNDlkMy1hOWRkLWNmM2Q3MmMwY2I4ZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGY2YTJlYy04ZjA5LTRkZTMtOTY3ZC05MTUyY2U5NjYxNTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMmE1NzI5Mi1kNmJkLTRlYjQtOGUxNi1hODEzYjMwZjU0NWYiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjEzMzAwNzI5NTMwNjQzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTQ2M2MxMC05OWE4LTQ1NDQtYmRlOS1mNzY0ZjdhODJlZDkiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDItMTRUMTM6MDU6MjkiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgcGx1czpMaWNlbnNvclVSTD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xMTUwMzQ1MzQxLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIvPgogICAgPC9yZGY6U2VxPgogICA8L3BsdXM6TGljZW5zb3I+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5WbGFkeXNsYXYgU2VyZWRhPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TZXJ2aWNlIHRvb2xzIGljb24gb24gd2hpdGUgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi48L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpkZXNjcmlwdGlvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmWJCnkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAg4LBR0CZnO/AAAARHRFWHRDb21tZW50AFNlcnZpY2UgdG9vbHMgaWNvbiBvbiB3aGl0ZSBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLlwvEeIAAAMxSURBVHja7Z1bcuQwCEX7qrLQXlp2ynxNVWbK7dgWj3sl9JvYRhxACD369erW7UMzx/cYaychonAQvXM5ABYkpynoYIiEGdoQog6AYfywBrCxF4zNrX/7McBbuXJe8rXx/KBDULcGsMREzCbeZ4J6ME/9wVH5d95rogZp3npEgPLP3m2iUSGqXBJS5Dr6hmLm8kRuZABYti5TMaailV8LodNQwTTUWk4/WZk75l0kM0aZQdaZjMqkrQDAuyMVJWFjMB4GANXr0lbZBxQKr7IjI7QvVWkok/Jn5UHVh61CYPs+/i7eL9j3y/Au8WqoAIC34k8/9k7N8miLcaGWHwgjZXE/awyYX7h41wKMCskZM2HXAddDkTdglpSjz5bcKPbcCEKwT3+DhxtVpJvkEC7rZSgq32NMSBoXaCdiahDCKrND0fpX8oQlVsQ8IFQZ1VARdIF5wroekAjB07gsAgDUIbQHFENIDEX4CQANIVe8Iw/ASiACLXl28eaf579OPuBa9/mrELUYHQ1t3KHlZZnRcXb2/c7ygXIQZqjDMEzeSrOgCAhqYMvTUE+FKXoVxTxgk3DEPREjGzj3nAk/VaKyB9GVIu4oMyOlrQZgrBBEFG9PAZTfs3amYDGrP9Wl964IeFvtz9JFluIvlEvcdoXDOdxggbDxGwTXcxFRi/LdirKgZUBm7SUdJG69IwSUzAMWgOAq/4hyrZVaJISSNWHFVbEoCFEhyBrCtXS9L+so9oTy8wGqxbQDD350WTjNESVFEB5hdKzUGcV5QtYxVWR2Ssl4Mg9qI9u6FCBInJRXgfEEgtS9Cgrg7kKouq4mdcDNBnEHQvWFTdgdgsqP+MiluVeBM13ahx09AYSWi50gsF+I6vn7BmCEoHR3NBzkpIOw4+XdVBBGQUioblaZHbGlodtB+N/jxqwLX/x/NARfD8ADxTOCKIcwE4Lw0OIbguMYcGTlymEpHYLXIKx8zQEqIfS2lGJPaADFEBR/PMH79ErqtpnZmTBlvM4wgihPWDEEhXn1LISj50crNgfCp+dWHYQRCfb2zgfnBZmKGAyi914anK9Coi4LOMhoAn3uVtn+AGnLKxPUZnCuAAAAAElFTkSuQmCC';
    const img = Buffer.from(imgdata, 'base64');

    var favicon = (method, tokens, query, body) => {
        console.log('serving favicon...');
        const headers = {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        };
        let result = img;

        return {
            headers,
            result
        };
    };

    var require$$0 = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>SUPS Admin Panel</title>\r\n    <style>\r\n        * {\r\n            padding: 0;\r\n            margin: 0;\r\n        }\r\n\r\n        body {\r\n            padding: 32px;\r\n            font-size: 16px;\r\n        }\r\n\r\n        .layout::after {\r\n            content: '';\r\n            clear: both;\r\n            display: table;\r\n        }\r\n\r\n        .col {\r\n            display: block;\r\n            float: left;\r\n        }\r\n\r\n        p {\r\n            padding: 8px 16px;\r\n        }\r\n\r\n        table {\r\n            border-collapse: collapse;\r\n        }\r\n\r\n        caption {\r\n            font-size: 120%;\r\n            text-align: left;\r\n            padding: 4px 8px;\r\n            font-weight: bold;\r\n            background-color: #ddd;\r\n        }\r\n\r\n        table, tr, th, td {\r\n            border: 1px solid #ddd;\r\n        }\r\n\r\n        th, td {\r\n            padding: 4px 8px;\r\n        }\r\n\r\n        ul {\r\n            list-style: none;\r\n        }\r\n\r\n        .collection-list a {\r\n            display: block;\r\n            width: 120px;\r\n            padding: 4px 8px;\r\n            text-decoration: none;\r\n            color: black;\r\n            background-color: #ccc;\r\n        }\r\n        .collection-list a:hover {\r\n            background-color: #ddd;\r\n        }\r\n        .collection-list a:visited {\r\n            color: black;\r\n        }\r\n    </style>\r\n    <script type=\"module\">\nimport { html, render } from 'https://unpkg.com/lit-html@1.3.0?module';\nimport { until } from 'https://unpkg.com/lit-html@1.3.0/directives/until?module';\n\nconst api = {\r\n    async get(url) {\r\n        return json(url);\r\n    },\r\n    async post(url, body) {\r\n        return json(url, {\r\n            method: 'POST',\r\n            headers: { 'Content-Type': 'application/json' },\r\n            body: JSON.stringify(body)\r\n        });\r\n    }\r\n};\r\n\r\nasync function json(url, options) {\r\n    return await (await fetch('/' + url, options)).json();\r\n}\r\n\r\nasync function getCollections() {\r\n    return api.get('data');\r\n}\r\n\r\nasync function getRecords(collection) {\r\n    return api.get('data/' + collection);\r\n}\r\n\r\nasync function getThrottling() {\r\n    return api.get('util/throttle');\r\n}\r\n\r\nasync function setThrottling(throttle) {\r\n    return api.post('util', { throttle });\r\n}\n\nasync function collectionList(onSelect) {\r\n    const collections = await getCollections();\r\n\r\n    return html`\r\n    <ul class=\"collection-list\">\r\n        ${collections.map(collectionLi)}\r\n    </ul>`;\r\n\r\n    function collectionLi(name) {\r\n        return html`<li><a href=\"javascript:void(0)\" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;\r\n    }\r\n}\n\nasync function recordTable(collectionName) {\r\n    const records = await getRecords(collectionName);\r\n    const layout = getLayout(records);\r\n\r\n    return html`\r\n    <table>\r\n        <caption>${collectionName}</caption>\r\n        <thead>\r\n            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>\r\n        </thead>\r\n        <tbody>\r\n            ${records.map(r => recordRow(r, layout))}\r\n        </tbody>\r\n    </table>`;\r\n}\r\n\r\nfunction getLayout(records) {\r\n    const result = new Set(['_id']);\r\n    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));\r\n\r\n    return [...result.keys()];\r\n}\r\n\r\nfunction recordRow(record, layout) {\r\n    return html`\r\n    <tr>\r\n        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}\r\n    </tr>`;\r\n}\n\nasync function throttlePanel(display) {\r\n    const active = await getThrottling();\r\n\r\n    return html`\r\n    <p>\r\n        Request throttling: </span>${active}</span>\r\n        <button @click=${(ev) => set(ev, true)}>Enable</button>\r\n        <button @click=${(ev) => set(ev, false)}>Disable</button>\r\n    </p>`;\r\n\r\n    async function set(ev, state) {\r\n        ev.target.disabled = true;\r\n        await setThrottling(state);\r\n        display();\r\n    }\r\n}\n\n//import page from '//unpkg.com/page/page.mjs';\r\n\r\n\r\nfunction start() {\r\n    const main = document.querySelector('main');\r\n    editor(main);\r\n}\r\n\r\nasync function editor(main) {\r\n    let list = html`<div class=\"col\">Loading&hellip;</div>`;\r\n    let viewer = html`<div class=\"col\">\r\n    <p>Select collection to view records</p>\r\n</div>`;\r\n    display();\r\n\r\n    list = html`<div class=\"col\">${await collectionList(onSelect)}</div>`;\r\n    display();\r\n\r\n    async function display() {\r\n        render(html`\r\n        <section class=\"layout\">\r\n            ${until(throttlePanel(display), html`<p>Loading</p>`)}\r\n        </section>\r\n        <section class=\"layout\">\r\n            ${list}\r\n            ${viewer}\r\n        </section>`, main);\r\n    }\r\n\r\n    async function onSelect(ev, name) {\r\n        ev.preventDefault();\r\n        viewer = html`<div class=\"col\">${await recordTable(name)}</div>`;\r\n        display();\r\n    }\r\n}\r\n\r\nstart();\n\n</script>\r\n</head>\r\n<body>\r\n    <main>\r\n        Loading&hellip;\r\n    </main>\r\n</body>\r\n</html>";

    const mode = process.argv[2] == '-dev' ? 'dev' : 'prod';

    const files = {
        index: mode == 'prod' ? require$$0 : fs__default['default'].readFileSync('./client/index.html', 'utf-8')
    };

    var admin = (method, tokens, query, body) => {
        const headers = {
            'Content-Type': 'text/html'
        };
        let result = '';

        const resource = tokens.join('/');
        if (resource && resource.split('.').pop() == 'js') {
            headers['Content-Type'] = 'application/javascript';

            files[resource] = files[resource] || fs__default['default'].readFileSync('./client/' + resource, 'utf-8');
            result = files[resource];
        } else {
            result = files.index;
        }

        return {
            headers,
            result
        };
    };

    /*
     * This service requires util plugin
     */

    const utilService = new Service_1();

    utilService.post('*', onRequest);
    utilService.get(':service', getStatus);

    function getStatus(context, tokens, query, body) {
        return context.util[context.params.service];
    }

    function onRequest(context, tokens, query, body) {
        Object.entries(body).forEach(([k,v]) => {
            console.log(`${k} ${v ? 'enabled' : 'disabled'}`);
            context.util[k] = v;
        });
        return '';
    }

    var util$1 = utilService.parseRequest;

    var services = {
        jsonstore,
        users,
        data: data$1,
        favicon,
        admin,
        util: util$1
    };

    const { uuid: uuid$2 } = util;


    function initPlugin(settings) {
        const storage = createInstance(settings.seedData);
        const protectedStorage = createInstance(settings.protectedData);

        return function decoreateContext(context, request) {
            context.storage = storage;
            context.protectedStorage = protectedStorage;
        };
    }


    /**
     * Create storage instance and populate with seed data
     * @param {Object=} seedData Associative array with data. Each property is an object with properties in format {key: value}
     */
    function createInstance(seedData = {}) {
        const collections = new Map();

        // Initialize seed data from file    
        for (let collectionName in seedData) {
            if (seedData.hasOwnProperty(collectionName)) {
                const collection = new Map();
                for (let recordId in seedData[collectionName]) {
                    if (seedData.hasOwnProperty(collectionName)) {
                        collection.set(recordId, seedData[collectionName][recordId]);
                    }
                }
                collections.set(collectionName, collection);
            }
        }


        // Manipulation

        /**
         * Get entry by ID or list of all entries from collection or list of all collections
         * @param {string=} collection Name of collection to access. Throws error if not found. If omitted, returns list of all collections.
         * @param {number|string=} id ID of requested entry. Throws error if not found. If omitted, returns of list all entries in collection.
         * @return {Object} Matching entry.
         */
        function get(collection, id) {
            if (!collection) {
                return [...collections.keys()];
            }
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!id) {
                const entries = [...targetCollection.entries()];
                let result = entries.map(([k, v]) => {
                    return Object.assign(deepCopy(v), { _id: k });
                });
                return result;
            }
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            const entry = targetCollection.get(id);
            return Object.assign(deepCopy(entry), { _id: id });
        }

        /**
         * Add new entry to collection. ID will be auto-generated
         * @param {string} collection Name of collection to access. If the collection does not exist, it will be created.
         * @param {Object} data Value to store.
         * @return {Object} Original value with resulting ID under _id property.
         */
        function add(collection, data) {
            const record = assignClean({ _ownerId: data._ownerId }, data);

            let targetCollection = collections.get(collection);
            if (!targetCollection) {
                targetCollection = new Map();
                collections.set(collection, targetCollection);
            }
            let id = uuid$2();
            // Make sure new ID does not match existing value
            while (targetCollection.has(id)) {
                id = uuid$2();
            }

            record._createdOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Replace entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Record will be replaced!
         * @return {Object} Updated entry.
         */
        function set(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = targetCollection.get(id);
            const record = assignSystemProps(deepCopy(data), existing);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Modify entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Shallow merge will be performed!
         * @return {Object} Updated entry.
         */
         function merge(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = deepCopy(targetCollection.get(id));
            const record = assignClean(existing, data);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Delete entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @return {{_deletedOn: number}} Server time of deletion.
         */
        function del(collection, id) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            targetCollection.delete(id);

            return { _deletedOn: Date.now() };
        }

        /**
         * Search in collection by query object
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {Object} query Query object. Format {prop: value}.
         * @return {Object[]} Array of matching entries.
         */
        function query(collection, query) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            const result = [];
            // Iterate entries of target collection and compare each property with the given query
            for (let [key, entry] of [...targetCollection.entries()]) {
                let match = true;
                for (let prop in entry) {
                    if (query.hasOwnProperty(prop)) {
                        const targetValue = query[prop];
                        // Perform lowercase search, if value is string
                        if (typeof targetValue === 'string' && typeof entry[prop] === 'string') {
                            if (targetValue.toLocaleLowerCase() !== entry[prop].toLocaleLowerCase()) {
                                match = false;
                                break;
                            }
                        } else if (targetValue != entry[prop]) {
                            match = false;
                            break;
                        }
                    }
                }

                if (match) {
                    result.push(Object.assign(deepCopy(entry), { _id: key }));
                }
            }

            return result;
        }

        return { get, add, set, merge, delete: del, query };
    }


    function assignSystemProps(target, entry, ...rest) {
        const whitelist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let prop of whitelist) {
            if (entry.hasOwnProperty(prop)) {
                target[prop] = deepCopy(entry[prop]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }


    function assignClean(target, entry, ...rest) {
        const blacklist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let key in entry) {
            if (blacklist.includes(key) == false) {
                target[key] = deepCopy(entry[key]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }

    function deepCopy(value) {
        if (Array.isArray(value)) {
            return value.map(deepCopy);
        } else if (typeof value == 'object') {
            return [...Object.entries(value)].reduce((p, [k, v]) => Object.assign(p, { [k]: deepCopy(v) }), {});
        } else {
            return value;
        }
    }

    var storage = initPlugin;

    const { ConflictError: ConflictError$1, CredentialError: CredentialError$1, RequestError: RequestError$2 } = errors;

    function initPlugin$1(settings) {
        const identity = settings.identity;

        return function decorateContext(context, request) {
            context.auth = {
                register,
                login,
                logout
            };

            const userToken = request.headers['x-authorization'];
            if (userToken !== undefined) {
                let user;
                const session = findSessionByToken(userToken);
                if (session !== undefined) {
                    const userData = context.protectedStorage.get('users', session.userId);
                    if (userData !== undefined) {
                        console.log('Authorized as ' + userData[identity]);
                        user = userData;
                    }
                }
                if (user !== undefined) {
                    context.user = user;
                } else {
                    throw new CredentialError$1('Invalid access token');
                }
            }

            function register(body) {
                if (body.hasOwnProperty(identity) === false ||
                    body.hasOwnProperty('password') === false ||
                    body[identity].length == 0 ||
                    body.password.length == 0) {
                    throw new RequestError$2('Missing fields');
                } else if (context.protectedStorage.query('users', { [identity]: body[identity] }).length !== 0) {
                    throw new ConflictError$1(`A user with the same ${identity} already exists`);
                } else {
                    const newUser = Object.assign({}, body, {
                        [identity]: body[identity],
                        hashedPassword: hash(body.password)
                    });
                    const result = context.protectedStorage.add('users', newUser);
                    delete result.hashedPassword;

                    const session = saveSession(result._id);
                    result.accessToken = session.accessToken;

                    return result;
                }
            }

            function login(body) {
                const targetUser = context.protectedStorage.query('users', { [identity]: body[identity] });
                if (targetUser.length == 1) {
                    if (hash(body.password) === targetUser[0].hashedPassword) {
                        const result = targetUser[0];
                        delete result.hashedPassword;

                        const session = saveSession(result._id);
                        result.accessToken = session.accessToken;

                        return result;
                    } else {
                        throw new CredentialError$1('Login or password don\'t match');
                    }
                } else {
                    throw new CredentialError$1('Login or password don\'t match');
                }
            }

            function logout() {
                if (context.user !== undefined) {
                    const session = findSessionByUserId(context.user._id);
                    if (session !== undefined) {
                        context.protectedStorage.delete('sessions', session._id);
                    }
                } else {
                    throw new CredentialError$1('User session does not exist');
                }
            }

            function saveSession(userId) {
                let session = context.protectedStorage.add('sessions', { userId });
                const accessToken = hash(session._id);
                session = context.protectedStorage.set('sessions', session._id, Object.assign({ accessToken }, session));
                return session;
            }

            function findSessionByToken(userToken) {
                return context.protectedStorage.query('sessions', { accessToken: userToken })[0];
            }

            function findSessionByUserId(userId) {
                return context.protectedStorage.query('sessions', { userId })[0];
            }
        };
    }


    const secret = 'This is not a production server';

    function hash(string) {
        const hash = crypto__default['default'].createHmac('sha256', secret);
        hash.update(string);
        return hash.digest('hex');
    }

    var auth = initPlugin$1;

    function initPlugin$2(settings) {
        const util = {
            throttle: false
        };

        return function decoreateContext(context, request) {
            context.util = util;
        };
    }

    var util$2 = initPlugin$2;

    /*
     * This plugin requires auth and storage plugins
     */

    const { RequestError: RequestError$3, ConflictError: ConflictError$2, CredentialError: CredentialError$2, AuthorizationError: AuthorizationError$2 } = errors;

    function initPlugin$3(settings) {
        const actions = {
            'GET': '.read',
            'POST': '.create',
            'PUT': '.update',
            'PATCH': '.update',
            'DELETE': '.delete'
        };
        const rules = Object.assign({
            '*': {
                '.create': ['User'],
                '.update': ['Owner'],
                '.delete': ['Owner']
            }
        }, settings.rules);

        return function decorateContext(context, request) {
            // special rules (evaluated at run-time)
            const get = (collectionName, id) => {
                return context.storage.get(collectionName, id);
            };
            const isOwner = (user, object) => {
                return user._id == object._ownerId;
            };
            context.rules = {
                get,
                isOwner
            };
            const isAdmin = request.headers.hasOwnProperty('x-admin');

            context.canAccess = canAccess;

            function canAccess(data, newData) {
                const user = context.user;
                const action = actions[request.method];
                let { rule, propRules } = getRule(action, context.params.collection, data);

                if (Array.isArray(rule)) {
                    rule = checkRoles(rule, data);
                } else if (typeof rule == 'string') {
                    rule = !!(eval(rule));
                }
                if (!rule && !isAdmin) {
                    throw new CredentialError$2();
                }
                propRules.map(r => applyPropRule(action, r, user, data, newData));
            }

            function applyPropRule(action, [prop, rule], user, data, newData) {
                // NOTE: user needs to be in scope for eval to work on certain rules
                if (typeof rule == 'string') {
                    rule = !!eval(rule);
                }

                if (rule == false) {
                    if (action == '.create' || action == '.update') {
                        delete newData[prop];
                    } else if (action == '.read') {
                        delete data[prop];
                    }
                }
            }

            function checkRoles(roles, data, newData) {
                if (roles.includes('Guest')) {
                    return true;
                } else if (!context.user && !isAdmin) {
                    throw new AuthorizationError$2();
                } else if (roles.includes('User')) {
                    return true;
                } else if (context.user && roles.includes('Owner')) {
                    return context.user._id == data._ownerId;
                } else {
                    return false;
                }
            }
        };



        function getRule(action, collection, data = {}) {
            let currentRule = ruleOrDefault(true, rules['*'][action]);
            let propRules = [];

            // Top-level rules for the collection
            const collectionRules = rules[collection];
            if (collectionRules !== undefined) {
                // Top-level rule for the specific action for the collection
                currentRule = ruleOrDefault(currentRule, collectionRules[action]);

                // Prop rules
                const allPropRules = collectionRules['*'];
                if (allPropRules !== undefined) {
                    propRules = ruleOrDefault(propRules, getPropRule(allPropRules, action));
                }

                // Rules by record id 
                const recordRules = collectionRules[data._id];
                if (recordRules !== undefined) {
                    currentRule = ruleOrDefault(currentRule, recordRules[action]);
                    propRules = ruleOrDefault(propRules, getPropRule(recordRules, action));
                }
            }

            return {
                rule: currentRule,
                propRules
            };
        }

        function ruleOrDefault(current, rule) {
            return (rule === undefined || rule.length === 0) ? current : rule;
        }

        function getPropRule(record, action) {
            const props = Object
                .entries(record)
                .filter(([k]) => k[0] != '.')
                .filter(([k, v]) => v.hasOwnProperty(action))
                .map(([k, v]) => [k, v[action]]);

            return props;
        }
    }

    var rules = initPlugin$3;

    var identity = "email";
    var protectedData = {
    	users: {
    		"35c62d76-8152-4626-8712-eeb96381bea8": {
    			email: "peter@abv.bg",
    			username: "Peter",
    			hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
    		},
    		"847ec027-f659-4086-8032-5173e2f9c93a": {
    			email: "george@abv.bg",
    			username: "George",
    			hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
    		},
    		"60f0cf0b-34b0-4abd-9769-8c42f830dffc": {
    			email: "admin@abv.bg",
    			username: "Admin",
    			hashedPassword: "fac7060c3e17e6f151f247eacb2cd5ae80b8c36aedb8764e18a41bbdc16aa302"
    		}
    	},
    	sessions: {
    	}
    };
    var seedData = {
    	articles: {
            article_id: "e114870d8bd92f11bd3d8a88fe8cfbf6",
            title: "Baerbock calls US missiles in Germany a 'credible deterrent'",
            link: "https://www.dw.com/en/baerbock-calls-us-missiles-in-germany-a-credible-deterrent/a-69851255?maca=en-rss-en-top-1022-rdf",
            keywords: null,
            creator: null,
            video_url: null,
            description: "Germany's foreign minister emphasized the need to deploy long-range US weapons systems on German soil. Weapons like the SM-6, Tomahawk and developmental hypersonic weapons would deter Russia, she said.",
            content: "German Foreign Minister Annalena Baerbock defended an agreement with Washington on the stationing of long-range US missiles in Germany, citing the threat Russia poses to European security. \r\n\r\n\"Making foreign policy today means recognizing that the principle of hope will not protect us from [Russian President Vladimir] Putin's Russia,\" Baerbock wrote in an opinion piece for the German weekly Bild am Sonntag newspaper. \r\n\r\n\"What protects us now is that we invest in our own security and strength — in the EU, in NATO and in Germany. And this includes the decision to deploy long-range American weapons systems,\" she added. The minister emphasized that Germany needs \"a credible deterrent\" against Russia, \"which also protects the Poles, the Baltic peoples and the Finns — our partners who share a direct border with Russia and have experienced how it is using hybrid measures at the border in recent months.\"\r\n\r\nBaerbock accused Putin of responding to every peace initiative with escalation, writing that he wants only for \"Ukraine to submit to him.\"\r\n\r\nWhat weapon systems will US move to Germany?\r\nOn the sidelines of a NATO summit in July, the United States and Germany agreed to the deployment of long-range fire capabilities on German soil starting in 2026. The move will see a return of long-range US cruise missiles to Germany for the first time since the late 1990s, likely including SM-6, Tomahawk and developmental hypersonic weapons with a longer range than those currently in the armories of European militaries.\r\n\r\nThe decision received a mixed reaction in Berlin, with some greeting and others criticizing it.\r\n\r\nSeveral parties, including German Chancellor Olaf Scholz's own center-left Social Democrats, have criticized the plan and called for it to be referred to parliament for debate.\r\n\r\nsri/sms (AFP, Reuters, dpa),
            pubDate: "2024-08-04 05:51:00",
            image_url: "https://static.dw.com/image/69557766_6.jpg",
            source_id: "dw",
            source_priority: 2734,
            source_name: "Dw Akademie",
            source_url: "https://www.dw.com",
            source_icon: "https://i.bytvi.com/domain_icons/dw.png",
            language: "english",
            country: [
              "germany"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: false
          },
          {
            article_id: "428f58285a9b6c5ff12d7a2c1ee7fd7e",
            title: "War in Gaza: An alternative voice for peace from Israel",
            link: "https://www.dw.com/en/war-in-gaza-an-alternative-voice-for-peace-from-israel/a-69833772?maca=en-rss-en-top-1022-rdf",
            keywords: null,
            creator: null,
            video_url: null,
            description: "Neither \"pro-Israel\" nor \"pro-Palestine\": Two young activists who identify as Palestinian-Israeli have started a podcast to seek alternatives to violence and polarization. They want their identity to be recognized.,
            content: "Maoz Inon's parents were among the first victims of the Hamas attacks in Israel on the morning of October 7. Yet two days after the tragedy, despite his pain, it was very clear to him that he didn't want revenge.\r\n\r\n\"Revenge won't bring my parents back. Nor will it bring back any of the other Israelis and Palestinians who have been killed,\" he wrote.\r\n\r\nThat night, Inon, an Israeli entrepreneur and peace activist, had a dream. He describes it in an interview for the podcast \"Unapologetic: The Third Narrative.\" The ground before him was thick with blood, and he was weeping — along with the whole of humanity, all wounded by the war.\r\n\r\n\"We were crying, we were all crying. And our tears went down our face and to our bodies, and washed our bodies, and healed us… And then our tears went down to the ground and washed the blood.\"\r\n\r\nIt wasn't a nightmare, said Inon. It was a vision of a better future without bloodshed.\r\n\r\nHamze Awawde has also dreamt about the conflict. On the same podcast, the Palestinian author and peace activist spoke of dreaming that Israeli soldiers have come to kill him and his family, just as they killed his cousin. Awawde said he became a peace activist because he believes hope is not a feeling but something that you do. \"Waiting for two states feels like waiting for the Messiah,\" he wrote in one of his recent essays.\r\n\r\nFighting for a political identity\r\nWhat Awade and Inon have in common is their hope for an end to the current war in Gaza, which has claimed the lives of nearly 40,000 civilians according to recent death tolls. That is why they were invited onto the podcast. The format was established in October 2023, after the Hamas-led attack in Israel. Germany, the US, the EU and others designate Hamas as a terrorist group.\r\n\r\nThe two founders, Amira Mohammed and Ibrahim Abu Ahmad, are among the many Arabs in Israel who have Israeli citizenship. According to Israel's Central Bureau of Statistics, this group constitutes around 17% of the population. In total, at least 21% of people living on Israeli territory are Arab.\r\n\r\nMohammed and Abu Ahmad define themselves as Palestinian Israelis, and surveys show that the majority of their community does the same. On a political level, though, it's an identity they have to fight for, as the state of Israel has rejected the possibility of Palestinian identity for its citizens. Instead, it refers to them as \"Arab Israelis.\" In an interview with DW, Mohammed explained that she is convinced Palestinian Israelis like her could, and should, play a key role in the Middle East conflict precisely because of their identity.\r\n\"Whether it's about if you want to call what's going on a war or genocide, or what exactly happened on October 7, or on the number of the people dying in Gaza — we're not going to agree. But we have to agree on the future,\" she said.\r\nOpposing black-and-white thinking\r\nMohammed and Abu Ahmad envision a future beyond the current polarization. \"What we want to create here, with this initiative, is a third narrative in the West,\" explained Abu Ahmad. This is why they are primarily addressing a Western audience.\r\n\r\n\"What the West created is a sense of a black-and-white. You're either pro-Israeli, or you're pro-Palestinian,\" Abu Ahmad comments in the first episode.\r\n\r\n\"Instead of using it like a football match, cheering for Messi or Ronaldo, you guys [in the West] should use your platform to criticize all parties equally,\" added Mohammed.\r\n\r\nTheir approach has proved to be successful. The podcast has as many as 180,000 listeners per episode and around 30,000 followers on Instagram.\r\n\r\n'Too Israeli' or 'bad Arab'\r\nHowever, despite their success, the two activists still deal with daily setbacks. There is resistance from all sides, said Mohammed. When she speaks Arabic in public, Israelis look at her with alarm. And when she speaks Hebrew without an Arab accent, Palestinians don't trust her. \"Everyone starts to delegitimize you, in a way. If I am 'too Israeli,' I am siding with the oppressor. If I am 'too proud of being a Palestinian,' I am justifying terror, I'm a 'bad Arab,'\" she said.\r\n\r\nMohammed is convinced that the dual identity she shares with many others is a source of untapped potential in this conflict.\r\n\r\n\"We know both cultures. We can feel the Palestinian pain. But we can also feel the pain of the Israelis,\" she said. \"But as long as we are not recognized as Palestinian Israelis, we cannot be the kind of translator, the medium. We're a minority, but we want to be represented and seen as what we are.\"\r\n\r\nConflicting emotions\r\nMohammed was especially conscious of her dual identity on October 7. \"It was a disaster of emotions. I didn't know what I am supposed to feel,\" she said.\r\n\r\nAs she sought shelter from the bombs in a stairwell in southern Israel, not far from Gaza, she was glued to her phone, watching images of the events happening in real time. She saw Palestinians break through the border fence that, for the past 30 years, had confined them to Gaza's 365 square kilometers — an area not even half the size of Hamburg, with a population of more than 2 million.\r\n\r\n\"Seeing those Gazans flee out, seeing that liberation, I felt a little bit of relief. They deserve to be free,\" said Mohammed.\r\n\r\nBut the people who broke through the fence were not in search of freedom. They murdered at least 1,200 people, set fire to homes, and took hundreds of hostages back with them to Gaza. Still in the stairwell, Mohammed started seeing pictures of the corpses of young women and hostages being taken to Gaza. The building she was in was shaking as bombs fell around it. And she thought: \"This could also have been me. This was the moment in which I felt my Israeli side.\"\r\n\r\n'We all deserve better'\r\nMore than nine months after the Hamas attack on Israel, the war in Gaza continues. It has taken a terrible toll: According to the UN, more than 39,000 people have been killed in Israeli attacks on Gaza, and 120 hostages, both Israeli and of other nationalities, are still being held captive by Hamas. There is no immediate prospect of peace.\r\n\r\nNonetheless, the two podcasters continue their work. They want to show solidarity with both Palestinians and Israelis and be allowed to criticize both sides without having to justify themselves, said Mohammed.\r\n\r\n\"We want to stop the bloodshed. Palestinians, Israelis, Christians, Jews, Muslims — we all deserve better.\"\r\n\r\nThis article was originally written in German.\r\n,
            pubDate: "2024-08-04 04:40:00",
            image_url: "https://static.dw.com/image/69744635_6.jpg",
            source_id: "dw",
            source_priority: 2734,
            source_name: "Dw Akademie",
            source_url: "https://www.dw.com",
            source_icon: "https://i.bytvi.com/domain_icons/dw.png",
            language: "english",
            country: [
              "germany"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: false
          },
          {
            article_id: "66faaebe9ea3750123367f2ba4dc51b7",
            title: "Venezuela: Mass protests against President Maduro's contested reelection",
            link: "https://www.dw.com/en/venezuela-mass-protests-against-president-maduro-s-contested-reelection/a-69851025?maca=en-rss-en-top-1022-rdf",
            keywords: null,
            creator: null,
            video_url: null,
            description: "Thousands of people took to the streets across Venezuela on Saturday to protest against the widely disputed reelection of President Nicolas Maduro.\r\n\r\nThey waved the national flag and sang the national anthem in support of an opposition candidate they believe won the presidential vote.\r\n\r\nAuthorities have declared Maduro the winner of last Sunday's election but have yet to produce voting tallies to prove he won.\r\n\r\nMaduro also urged his backers to attend his own \"mother of all marches\" later Saturday in the capital city, Caracas.\r\n\r\nOpposition leader Maria Corina Machado made a surprise appearance at the rally in Caracas after spending much of the week in hiding, saying that her life and freedom were at risk.\r\nWhat did Machado say?\r\n\"After six days of brutal repression, they thought they were going to silence us, intimidate or paralyze us,\" Machado told her ecstatic supporters from the raised platform on a truck.\r\n\r\n\"The presence of every one of you here today represents the best of Venezuela,\" she said.\r\n\r\n\"We have overcome all the barriers! We have knocked them all down,\" she added. \"Never has the regime been so weak.\"\r\n\r\nSince the disputed poll, Maduro's government has arrested hundreds of opposition supporters.\r\n\r\nThe president and his supporters have also threatened to lock up Machado and her hand-picked presidential candidate, Edmundo Gonzalez.\r\n\r\nGonzalez, who remains in hiding, was not seen at Saturday's event.\r\n\r\nAfter the rally, Machado was given a non-descript shirt and whisked away on the back of a motorcycle.\r\nMaduro lambasts opposition\r\nLater in the day, thousands of government supporters gathered before Maduro's office at the Miraflores national palace.\r\n\r\nAddressing them, Maduro vilified the opposition, claiming they \"represent the hatred, the division, of fascism.\"\r\n\r\nHe vowed to continue to use a heavy hand against his political opponents, saying 2,000 of them have been arrested already.\r\n\r\n\"This time there will be no pardon, this time there will be Tocoron,\" he said, referring to a notorious prison.\r\n\r\nHow did EU countries and others react?\r\nVenezuela's CNE election authority, loyal to Maduro, on Friday proclaimed him the winner with 52% of the vote to 43% for Gonzalez.\r\n\r\nThe opposition has rejected the result.\r\n\r\nThey have launched a website with copies of 84% of ballots cast, showing an easy win for Gonzalez.The government claims these are forged.\r\n\r\nMany countries, including the United States, Argentina, Costa Rica, Ecuador, Panama and Uruguay, have rejected the results released by the election authority.\r\n\r\nThe Organization of American States called for \"reconciliation and justice\" in Venezuela, saying, \"Let all Venezuelans who express themselves in the streets find only an echo of peace, a peace that reflects the spirit of democracy.\"\r\n\r\nSeven European Union countries also called on Venezuela to publish its voting records.\r\n\r\nThe statement — from France, Germany, Italy, the Netherlands, Poland, Portugal and Spain — expressed \"strong concern\" about the situation in the country following the contested presidential election.\r\n\r\n\"We call on the Venezuelan authorities to promptly publish all voting records,\" it read, adding that such a step was necessary to \"recognise the will of the Venezuelan people.\" \r\n\r\n\"The rights of all Venezuelans, especially political leaders, must be respected during this process,\" the statement noted. \"We strongly condemn any arrest or threat against them.\"\r\nWhat's Maduro's economic record?\r\nMaduro, 61, has led Venezuela since 2013.\r\n\r\nThe Latin American country has the world's largest proven crude oil reserves.\r\n\r\nIt was once one of the most advanced economies in the region.\r\n\r\nThe nation's GDP has plummeted by about 80% under Maduro. It also suffers hyperinflation and widespread shortages of goods.\r\n\r\nThe economic turmoil has forced over seven million of the country's 30 million citizens to emigrate over the past decade, marking the largest exodus in Latin America's history.\r\n\r\nsri/sms (AP, AFP, Reuters),
            pubDate: "2024-08-04 01:39:00",
            image_url: "https://static.dw.com/image/69850451_6.jpg",
            source_id: "dw",
            source_priority: 2734,
            source_name: "Dw Akademie",
            source_url: "https://www.dw.com",
            source_icon: "https://i.bytvi.com/domain_icons/dw.png",
            language: "english",
            country: [
              "germany"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: false
          },
          {
            article_id: "365935e718f95b052e73d0fad9c85238",
            title: "Berlin: Thousands march in COVID-19 pandemic skeptic protest",
            link: "https://www.dw.com/en/berlin-thousands-march-in-covid-19-pandemic-skeptic-protest/a-69850493?maca=en-rss-en-top-1022-rdf",
            keywords: null,
            creator: null,
            video_url: null,
            description: "Several thousand people on Saturday joined a street demonstration and rally in Berlin organized by Germany's \"Lateral Thinking\" protest movement.\r\n\r\nThe protest faction, best known for staging demonstrations against COVID-19 pandemic restrictions, was calling for a reassessment of government measures and \"consequences for those responsible.\"\r\n\r\nHowever, a large contingent also protested against the German government's push to rebuild the country's military.\r\n\r\nHow the protests unfolded\r\nThe demonstration moved along the German capital's famous Kurfürstendamm shopping street toward Berlin-Tiergarten.\r\n\r\nThere, a stage had been set up for a  \"freedom, peace, joy\" rally organized by the movement's initiator Michael Ballweg.\r\n\r\nMany participants in the march protested against the policies of German Chancellor Olaf Scholz's center-left-led coalition government.\r\n\r\nSome carried placards for the fringe political party The Basis, which is seen as aligned with the Lateral Thinking movement.\r\n\r\nAmong the statements on display was \"Peace-ready, not war-ready,\" a reference to the statement by German Defense Minister Boris Pistorius that Germany must be prepared for conflict with Russia by 2029.\r\n\r\nAccording to the Berlin police in the late afternoon, the demonstration and rally had been peaceful and without incident, there were no arrests.\r\n\r\nHowever, there were several violations of the requirement not to display posters referring to the magazine \"Compact,\" which Germany's domestic intelligence service had classified as right-wing extremist and which was subsequently banned. A preliminary estimate by police put the crowd at the demonstration at around 9,000 people.\r\n\r\nBerlin police deployed 500 officers to monitor both the demonstration and several planned counter-demonstrations.\r\nWhat is the Lateral Thinking movement?\r\nThe movement began in Stuttgart and eventually spread across Germany during the coronavirus pandemic.\r\n\r\nSupporters repeatedly protested against lockdown measures and vaccine requirements as measures to contain the virus.\r\n\r\nAn estimated 20,000 people joined a demonstration against the coronavirus measures in Berlin in August 2020, although organizers claimed that the actual crowd was much larger.\r\n\r\nGermany's domestic intelligence service, the Federal Office for the Protection of the Constitution, in 2021 said it would keep parts of the anti-coronavirus lockdown movement under observation.\r\n\r\nWhile the protests became smaller after that, incidents of violence became more frequent. There was increasing concern that the rallies were being used as a platform for far-right and extremist views.\r\n\r\nProtesters were noted to have increasingly embraced conspiracy theories, most notably those floated by the QAnon movement which originated in the United States.\r\n\r\nThis article was written using material from the DPA news agency.\r\n\r\nEdited by: Sean Sinico,
            pubDate: "2024-08-03 22:35:00",
            image_url: "https://static.dw.com/image/69850544_6.jpg",
            source_id: "dw",
            source_priority: 2734,
            source_name: "Dw Akademie",
            source_url: "https://www.dw.com",
            source_icon: "https://i.bytvi.com/domain_icons/dw.png",
            language: "english",
            country: [
              "germany"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: false
          },
          {
            article_id: "61e66958a2df17f83be5d03fb532b031",
            title: "Nigerian police teargas protesters, arrest hundreds",
            link: "https://www.dw.com/en/nigerian-police-teargas-protesters-arrest-hundreds/a-69850509?maca=en-rss-en-top-1022-rdf",
            keywords: null,
            creator: null,
            video_url: null,
            description: "Days of widespread demonstrations in Africa's most populous nation have left at least 13 people dead, Amnesty International says.",
            content: "Nigerian police said they had arrested nearly 700 people in days of nationwide protests against the high cost of living.\r\n\r\nOn Saturday, police said they fired rubber bullets and teargas at protesters in the capital city, Abuja.\r\n\r\nAmnesty International said 50 journalists were among the 681 people arrested over the three days of demonstrations.\r\n\r\nDemonstrations to continue\r\nThe people who have been arrested are being accused by the police of \"armed robbery, arson, mischief,\" and damaging property. Damilare Adenola, leader of the Take It Back group organizing protests in Abuja, told the AFP news agency that police fired on protesters on Saturday, who \"were gathered peacefully.\"\r\n\r\n\"We are going to continue with the demonstrations,\" he added.\r\n\r\nThey demand that the government reduce fuel prices and address Nigeria's most severe economic crisis, with inflation reaching a 28-year high of 34%.\r\nPolice blamed for violent crackdown\r\nAmnesty International said security forces had killed 13 protesters since Thursday, blaming them for using live rounds.\r\n\r\nPolice denied this, saying seven people have so far died during the protests but that security forces killed none of them.\r\n\r\nPolice have sought to confine protesters to the outskirts of major cities to avoid disruptions to business and traffic. In particular, they deployed more forces to Kano State where some protesters attempted to break into a police station near the neighborhoods of Kurna and Rijiyar Lemo.\r\n\r\nIn the commercial hub of Lagos, more than 1,000 protesters held a peaceful demonstration against President Bola Tinubu's reforms, including the removal of a popular petrol subsidy and the devaluation of the currency, which sent inflation soaring.\r\n\r\nlo/msh (AFP, AP, Reuters),
            pubDate: "2024-08-03 21:50:00",
            image_url: "https://static.dw.com/image/69850610_6.jpg",
            source_id: "dw",
            source_priority: 2734,
            source_name: "Dw Akademie",
            source_url: "https://www.dw.com",
            source_icon: "https://i.bytvi.com/domain_icons/dw.png",
            language: "english",
            country: [
              "germany"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: false
          },
          {
            article_id: "e2a0bc3cc5e58e6b23fc6353db70bc43",
            title: "Venezuela opposition leader joins rally calling for overturning election results",
            link: "https://www.euronews.com/2024/08/04/venezuela-opposition-leader-joins-rally-calling-for-overturning-election-results",
            keywords: null,
            creator: null,
            video_url: null,
            description: "Thousands of people rallied in the streets of Venezuela's capital Saturday, waving the national flag and singing the national anthem to support an opposition candidate they believe won the presidential election by a landslide.",
            content: "Thousands of people rallied in the streets of Venezuela's capital Saturday to support an opposition candidate they believe won the presidential election by a landslide.\r\n\r\nThousands rallied in the streets of Venezuela’s capital on Saturday to support opposition leader Maria Corina Machado and opposition candidate Edmundo Gonzalez, who they believe won the presidential election by a landslide. \r\n\r\nAuthorities have declared President Nicolás Maduro the winner of last Sunday’s national elections in Venezuela but have yet to produce voting tallies to confirm his win. \r\n\r\nMaduro’s government arrested hundreds of opposition supporters who had taken to the streets in the days after the disputed poll. He has also threatened to lock up opposition leader María Corina Machado and her hand-picked presidential candidate, Edmundo González. Supporters chanted and sang as Machado arrived at the rally in Caracas on Saturday.\r\nMachado, who Maduro's government has barred from running for office for 15 years, had been in hiding since Tuesday, saying her life and freedom are at risk. \r\n\r\nMasked assailants ransacked the opposition's headquarters on Friday, taking documents and vandalising the space. Maduro held a Venezuela flag aloft on Saturday and promised that the government whose policies have forces million to emigrate was finally coming to an end. \r\n\r\n\"We have already won the election. Now comes a new stage. We knew that just as it took us a long time to achieve the electoral victory, now comes a stage that we live day by day. But we have never been as strong as we are today. Never has the regime been as weak as it is today,\" said Machado before thousands of supporters. \r\n\r\nWhen the rally ended, Machado was given a nondescript shirt and whisked away on the back of a motorcycle. \r\n\r\nGonzález, who remains in hiding, was not seen at the event.\r\n\r\n,
            pubDate: "2024-08-03 23:47:29",
            image_url: "https://static.euronews.com/articles/stories/08/62/74/30/1200x675_cmsv2_0f45e430-de31-5f28-bc2b-69d760d4a2ed-8627430.jpg",
            source_id: "euronews",
            source_priority: 3311,
            source_name: "Euronews",
            source_url: "https://www.euronews.com",
            source_icon: "https://i.bytvi.com/domain_icons/euronews.png",
            language: "english",
            country: [
              "france"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: false
          },
          {
            article_id: "8a77cc016eef98e5c012d977aeb9bb34",
            title: "UK: Riots continue for a fourth day in wake of mass stabbing",
            link: "https://www.dw.com/en/uk-riots-continue-for-a-fourth-day-in-wake-of-mass-stabbing/a-69851161?maca=en-rss-en-top-1022-rdf",
            keywords: null,
            creator: null,
            video_url: null,
            description: "Clashes between anti-immigration and anti-racism groups continued for a fourth night with violence across the UK. Several people have been arrested and the government has warned of strong penalties.",
            content: "The Prime Minister of the United Kingdom, Sir Keir Starmer, will chair an emergency \"Cobra\" meeting on Monday to discuss the government's response to far-right rioting which continued across the country this weekend.\r\n\r\nPockets of violence broke out in several British towns and cities over the past week after three young girls were killed in a knife attack in Southport in northwest England last Monday.\r\n\r\nA 17-year-old boy named as Axel Rudakubana, who was born in Cardiff, Wales, to Rwandan parents, has been arrested and charged with three counts of murder, a further 10 counts of attempted murder and one count of possessing a blade.\r\n\r\nMore than 150 people were arrested over the weekend alone after anti-immigration protesters clashed with police, looted shops and tried to attack mosques, with many chanting far-right, racist and Islamophobic slurs.\r\n\r\nHome Secretary condemns 'disgraceful scenes'\r\nSpeaking on breakfast television in the UK on Monday morning, the Home Secretary – the interior minister – Yvette Cooper promised there \"will be a reckoning\" for those responsible for what she called \"disgraceful scenes.\"\r\n\r\n\"Nobody should have to put up with this,\" she said. “Lots of people have concerns and views about crime, about the NHS [National Health Service], about immigration, but they don't pick up bricks and throw them at the police, they don't try and set light to a hotel where people are known to be inside it, they don’t loot shops as a result.\"\r\n\r\nCooper said those involved in the disorder \"do not speak for Britain\" but praised those people who have helped to clean up and repair damage.\r\n\r\n\"Right across the country, we've seen people coming out in our towns and cities to clean up, to make sure they can rebuild the wall in front of the mosque, to make sure that they can clear up the debris and the damage that's been left from the fires,\" she said. \"Those are the people who speak for Britain.\"\r\n\r\nWhat is a 'Cobra' meeting?\r\n\"Cobra\" stands for \"Cabinet Office Briefing Room A,\" where the UK government convenes emergency response meetings in times of urgent crisis.\r\n\r\nCobra meetings involve government ministers, senior civil servants, police chiefs, intelligence officers and any other relevant officials deemed appropriate for the issue in question.\r\n\r\nCobra meetings were held regularly during the COVID-19 pandemic, for instance.\r\n\r\nThe acronym has nothing to do with the venomous snake of the same name.\r\nUK: what happened in over the weekend?\r\nPolice in the northern English city of Rotherham struggled to hold back a group of far-right activists on Sunday, who broke into a hotel believed to be housing asylum-seekers.\r\n\r\nFootage aired on British TV showed officers with shields targeted by a barrage of projectiles outside the Holiday Inn Express hotel in Rotherham, near Sheffield.\r\n\r\nA few minutes later, the protesters can be seen storming the building and removing chairs from inside to use as weapons.\r\n\r\nA small fire was also visible while windows in the hotel were smashed. At least one officer was injured in the confrontation.\r\n\r\nLate Sunday, Staffordshire police said another hotel known to have sheltered asylum-seekers was targeted near Birmingham.\r\n\r\n\"A large group of individuals\" have been \"throwing projectiles, smashing windows, starting fires and targeting police\" at the hotel in the town of Tamworth, with one officer injured, said the statement.\r\n\r\nThere were more anti-immigration protests and counter-demonstrations elsewhere, including the northeastern city of Middlesborough, where officers used police dogs to control the crowd.\r\n\r\nIn the cities of Liverpool, Bolton and Southport — where the mass stabbing took place — the police were granted the right to issue dispersal orders, allowing them to stop protests from taking place on Sunday.\r\n\r\nUK PM says far-right rioters will 'regret' actions\r\nPrime Minister Starmer condemned the attack on hotels housing asylum-seekers and described it as \"far-right thuggery.\"\r\n\r\n\"We will do whatever it takes to bring these thugs to justice,\" said Starmer.\r\n\r\n\"These thugs are mobile, they move from community to community, and we must have a police response that can do the same.\"\r\n\r\n\"Mosques being attacked because they're mosques — the far-right are showing who they are. We have to show who we are in response to that.\"\r\n\r\nBritain's Home Secretary (or interior minister) Yvette Cooper called the \"criminal, violent attack\" on the hotel \"utterly appalling: Deliberately setting fire to a building with people known to be inside.\"\r\n\r\nShe said police had \"full Government support for the strongest action against those responsible.\"\r\nDozens arrested during Saturday's riots\r\nClose to 100 people were arrested after skirmishes broke out at far-right rallies in Liverpool, Manchester, Bristol, Blackpool and Hull, as well as Belfast in Northern Ireland on Saturday.\r\n\r\nIn Liverpool, in the northwest, protesters threw chairs, flares and bricks at police officers. Manchester also saw clashes between officers and rioters. \r\n\r\nIn the city of Hull, protesters broke windows of a hotel that was housing migrants, the BBC reported. \r\n\r\nIn Belfast, fireworks were thrown due to a clash between an anti-Islam group and anti-racism protesters.\r\n\r\nOpposing groups also faced off in the cities of Nottingham and Bristol.\r\n\r\nIn Leeds, anti-immigration protesters carrying British flags chanted, \"You're not English anymore.\" They were met with counter-protesters shouting, \"Nazi scum off our streets.\"\r\n\r\nOn Friday, Sunderland saw violence erupt as a police station and an overturned car were set on fire.\r\n\r\nIn London, a pro-Palestinian demonstration was carried out as usual despite counterprotesting nearby.\r\n\r\nWhy did the riots break out?\r\nThe riots began last week due to misinformation over a mass stabbing at a Taylor Swift-themed dance party at a studio in Southport, a seaside town in northwest England.\r\n\r\nThree children were killed in the knife attack, and 10 other people — eight of whom were children — were injured.\r\n\r\nA 17-year-old boy, Axel Rudakubana, has been charged with several offenses, including the girls' murder, which happened during a Taylor Swift-themed workshop.\r\n\r\nRudakubana is accused of killing Bebe King, 6, Elsie Dot Stancombe, 7, and Alice Dasilva Aguiar, 9, and injuring another 10 people.\r\n\r\nSince the Southport attack, far-right social media channels have been awash with false claims that the suspect was an asylum-seeker who had arrived in the UK by boat.\r\n\r\nPolice have emphasized that Rudakubana was born in Britain.\r\n\r\nHe was remanded to a youth detention center and will next appear in court in October.\r\n\r\nThe unrest is seen as UK Prime Minister Keir Starmer's first major test after joining office less than a month ago. He has condemned the violence and said thugs were \"hijacking\" the nation's grief. \r\n\r\nPolice believe the English Defence League, an anti-Islam organization, is behind the violence. Anti-racism campaign group Hope Not Hate says it has identified 30 more such events set to take place over the weekend.\r\n\r\nmm, tg, rc/msh (dpa, AFP, AP, Reuters),
            pubDate: "2024-08-04 03:12:00",
            image_url: "https://static.dw.com/image/69851116_6.jpg",
            source_id: "dw",
            source_priority: 2734,
            source_name: "Dw Akademie",
            source_url: "https://www.dw.com",
            source_icon: "https://i.bytvi.com/domain_icons/dw.png",
            language: "english",
            country: [
              "germany"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: false
          },
          {
            article_id: "76281bda872cb7b4387924ac98ca57f5",
            title: "'They're tightening the screws': Kremlin ups attacks on critics abroad",
            link: "https://www.bbc.com/news/articles/cl4y0j47xe4o",
            keywords: null,
            creator: null,
            video_url: null,
            description: "With dissent snuffed out at home, Russia intensifies attacks on opponents seeking refuge in the West.",
            content: "Two plain-clothed UK police officers were waiting for Dmitry Gudkov as he arrived at London’s Luton Airport last summer. The Russian opposition politician, who lives in exile in an EU country, was flying to the UK to attend a friend’s birthday.\r\n“They were there to intercept me immediately after I exited the plane,” Dmitry says. “That had never happened to me before.\"\r\nBut the police weren’t arresting him – instead, they wanted to warn him.\r\n“They told me I’m on a list of people who are in danger. They asked where I’ll be staying and what phone I’ll be using.”\r\nDmitry Gudkov is the co-founder of the Anti-War Committee, an organisation that co-ordinates efforts to oppose the war in Ukraine. He is wanted in Russia for \"spreading fakes\" about the Russian army.\r\nThe start of Russia's full-scale invasion of Ukraine in 2022 led to a wide-ranging crackdown against opponents inside Russia. Almost all activists and independent journalists fled the country.\r\nNow, a number of Kremlin critics living in Europe have told the BBC that Russia is stepping up its efforts to silence, threaten and persecute opponents abroad. Some were unwilling to share their stories publicly. The Russian embassy in London didn’t respond to a request for comment.\r\n'They can get their hands on people almost anywhere'\r\nAnalyst Mark Galeotti, who studies the Russian security services, agrees that the campaign against Russia’s \"enemies\" abroad is intensifying. “I think it reflects the growing paranoia of the Kremlin,” he says, “that it is involved in an existential political struggle.\"\r\nWith all dissent snuffed out at home, Russia is turning its attention to opponents who have sought refuge in the West. Dmitry Medvedev, a former Russian president who is now deputy head of Russia's Security Council, described them as “traitors who have gone over to the enemy and want their Fatherland to perish”.\r\nAnother anti-Kremlin activist was also contacted by British police. “They said they needed to discuss the safety of me and my family,” Ksenia Maximova tells me.\r\nThe founder of the Russian Democratic Society in London says the police advised her not to travel to certain countries where Russian agents operate more freely.\r\n“[The Kremlin is] stepping up the campaign against ‘enemies’, that’s absolutely true,” she says, “They’re tightening the screws.”\r\nShe and her fellow campaigners have noticed an uptick in cyber attacks and attempts to infiltrate the group online.\r\nIn a statement to the BBC, a spokesperson for UK Counter Terrorism Policing said, “We have been open for some time now about the growing demand within our casework relating to countering state threats… We have been actively increasing resources dedicated to countering the activity of hostile states.”\r\nIn December, new UK legislation came into effect, giving police more powers to tackle threats from hostile states such as Russia.\r\n\"Parasites can’t sleep in peace...\" was one of the messages that investigative journalist Alesya Marokhovskaya received last year.\r\nThe threats were accompanied by the name of the street in Prague where she lived. “I moved house to make it harder for them,” says Alesya.\r\n“We thought it may just be some crazy Czech guy who was pro-Putin and had recognised me on the street.”\r\nBut then the messages became more sinister - calling her a \"scumbag\" and promising to find her \"wherever she walks her wheezing dog\".\r\nAlesya’s dog really does wheeze when it walks. She informed the Czech police.\r\nLater, Alesya was due to fly to Sweden to attend a conference. The sender then sent even more specific threats: details of her flight, seat number and the hotel she had booked. “It was clear they had high-level access to documents,” Alesya says. “It looks like the behaviour of the Russian state.”\r\nAlesya had been branded a 'foreign agent’ years before by the Russian government, due to her work at independent Russian news website iStories.\r\n“When I left Russia and came to Prague, I had this illusion of security,” says Alesya. “Now I realise that [Russian intelligence services] can get their hands on people almost anywhere in Europe. I can’t say I’m not afraid, because I am.\"\r\nBut why is this happening now? Experts suggest the Russian security services are beginning to activate operations abroad after a period of turmoil. Hundreds of Russian diplomats believed to be intelligence agents operating under diplomatic cover were expelled from Western countries following the full-scale invasion of Ukraine.\r\n“There was a period of confusion after 2022,” says Andrei Soldatov, a Russian journalist who writes about the intelligence services. “In 2023, the agencies regrouped and found a new sense of purpose. They got resources and began increasing pressure.”\r\nMark Galeotti says the authorities are increasingly turning to proxies to do their dirty work - criminal gangs: “If you want someone beaten up or even killed, they’re a lot easier to engage,” says Mr Galeotti, who has been writing about the links between the Russian state and organised crime for years.\r\n“They’re going to be some thug – maybe someone whom the Russian-based organised crime groups have at some point dealt with.”\r\nThe Polish government believes that’s what happened in the case of Leonid Volkov, a prominent activist and associate of the late Alexei Navalny. He was brutally attacked with a hammer in Lithuania four months ago, but survived.\r\nThe Polish Prime Minister, Donald Tusk, said a Belarusian man working for Russian intelligence had paid two Polish football hooligans to carry out the assault. All three have been arrested.\r\n“Intimidation is the intent,” suggests Mark Galeotti. “The idea that you'd better keep your head down. It’s a way of deterring the emergence of some kind of coherent political opposition [to the Kremlin].”\r\nThe Russian authorities also try to make day-to-day life as difficult as possible for opponents abroad.\r\nActivist Olesya Krivtsova, 21, escaped from Russia after being arrested and threatened with jail for anti-war posts on social media. She now lives in Norway, but recently discovered her Russian passport had been cancelled, meaning she can’t apply for travel documents.\r\n“I think this is a new [method] of repression,” Olesya says. “They’re always thinking, how can we do more, how can we pressure them?”\r\nSeveral other activists living abroad have also had their passports cancelled without warning. Many have criminal cases open against them in Russia - without a valid passport, they cannot hire lawyers or make payments back home. The only way to resolve the issue is to return to Russia.\r\nFor Olesya, returning would mean arrest and prison. She has now applied for a temporary Norwegian ID for refugees.\r\n“In Russia, now I only have one right – the right to go to prison. My passport is cancelled. This shows the essence of their cruelty,” says the young activist.\r\n“They’ve already completely destroyed my life and the life of my family…They’re never going to stop.”,
            pubDate: "2024-08-04 00:50:57",
            image_url: "https://ichef.bbci.co.uk/news/240/cpsprodpb/eb79/live/10ee4020-4f42-11ef-aebc-6de4d31bf5cd.jpg",
            source_id: "bbc",
            source_priority: 103,
            source_name: "The Bbc",
            source_url: "http://www.bbc.com",
            source_icon: "https://i.bytvi.com/domain_icons/bbc.jpg",
            language: "english",
            country: [
              "united kingdom"
            ],
            category: [
              "top"
            ],
            ai_tag: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            sentiment_stats: "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
            ai_region: "ONLY AVAILABLE IN CORPORATE PLANS",
            ai_org: "ONLY AVAILABLE IN CORPORATE PLANS",
            duplicate: true
          }
    };
    var rules$1 = {
    	users: {
    		".create": false,
    		".read": [
    			"Owner"
    		],
    		".update": false,
    		".delete": false
    	},
    	members: {
    		".update": "isOwner(user, get('teams', data.teamId))",
    		".delete": "isOwner(user, get('teams', data.teamId)) || isOwner(user, data)",
    		"*": {
    			teamId: {
    				".update": "newData.teamId = data.teamId"
    			},
    			status: {
    				".create": "newData.status = 'pending'"
    			}
    		}
    	}
    };
    var settings = {
    	identity: identity,
    	protectedData: protectedData,
    	seedData: seedData,
    	rules: rules$1
    };

    const plugins = [
        storage(settings),
        auth(settings),
        util$2(),
        rules(settings)
    ];

    const server = http__default['default'].createServer(requestHandler(plugins, services));

    const port = 3030;
    server.listen(port);
    console.log(`Server started on port ${port}. You can make requests to http://localhost:${port}/`);
    console.log(`Admin panel located at http://localhost:${port}/admin`);

    var softuniPracticeServer = {

    };

    return softuniPracticeServer;

})));
