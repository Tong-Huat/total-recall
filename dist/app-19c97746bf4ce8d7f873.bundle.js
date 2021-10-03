/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ "./src/styles.scss");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);

 // global value that holds info about the current hand.

var currentGame = null;
var displayedCards = [];
var selectedCards = [];
var numOfCards; // query for game and card container

var gameContainer = document.querySelector('#game-container');
var cardSelectionContainer = document.querySelector('#select-container');
var errorContainer = document.querySelector('#error-container'); // create registrations on landing page

var registrationContainer = document.createElement('div');
registrationContainer.classList.add('container', 'form-signin', 'bg-light'); // create registration elements: user name and pw

var registrationText = document.createElement('h2');
registrationText.innerText = 'Registration Form';
var regUserNameDiv = document.createElement('div');
regUserNameDiv.classList.add('form-floating');
var regUserName = document.createElement('input');
regUserName.placeholder = 'Input Username';
var regPasswordDiv = document.createElement('div');
regPasswordDiv.classList.add('form-floating');
var regPassword = document.createElement('input');
regPassword.placeholder = 'Input Password';
var registrationBtn = document.createElement('button');
registrationBtn.innerText = 'Register';
regUserNameDiv.appendChild(regUserName);
regPasswordDiv.appendChild(regPassword);
registrationContainer.appendChild(registrationText);
registrationContainer.appendChild(regUserNameDiv);
registrationContainer.appendChild(regPasswordDiv);
registrationContainer.appendChild(registrationBtn); // ************** create login on landing page **************//

var loginContainer = document.createElement('div');
loginContainer.classList.add('container', 'form-signin', 'bg-light'); // create login elements: UserName and pw

var loginText = document.createElement('h2');
loginText.innerText = 'Login Form';
var userNameDiv = document.createElement('div');
userNameDiv.classList.add('form-floating');
var userName = document.createElement('input');
userName.placeholder = 'Input User Name';
var passwordDiv = document.createElement('div');
passwordDiv.classList.add('form-floating');
var password = document.createElement('input');
password.placeholder = 'Input Password';
var loginBtn = document.createElement('button');
loginBtn.innerText = 'Login';
userNameDiv.appendChild(userName);
passwordDiv.appendChild(password);
loginContainer.appendChild(loginText);
loginContainer.appendChild(userNameDiv);
loginContainer.appendChild(passwordDiv);
loginContainer.appendChild(loginBtn);

var checkLoggedIn = function checkLoggedIn() {
  axios__WEBPACK_IMPORTED_MODULE_1___default().get('/isloggedin').then(function (response) {
    console.log('response from login :>> ', response);

    if (response.data.isLoggedIn === true) {
      document.body.appendChild(diffContainer);
      document.body.appendChild(playBtn);
    } else {
      // render other buttons
      document.body.appendChild(registrationContainer);
      document.body.appendChild(loginContainer);
    }
  })["catch"](function (error) {
    return console.log('error from logging in', error);
  });
}; // ************** create difficulty selection elements **************//


var diffContainer = document.createElement('div');
diffContainer.classList.add('container', 'bg-light', 'cardContainer');
var bgnBtn = document.createElement('input');
bgnBtn.type = 'radio';
bgnBtn.name = 'difficulty';
bgnBtn.checked = false;
bgnBtn.value = 'beginner';
var bgnLabel = document.createElement('label');
var bgnDescription = document.createTextNode('Beginner');
bgnLabel.appendChild(bgnDescription);
var advBtn = document.createElement('input');
advBtn.type = 'radio';
advBtn.name = 'difficulty';
advBtn.checked = false;
advBtn.value = 'advanced';
var advLabel = document.createElement('label');
var advDescription = document.createTextNode('Advanced');
advLabel.appendChild(advDescription);
var expBtn = document.createElement('input');
expBtn.type = 'radio';
expBtn.name = 'difficulty';
expBtn.checked = false;
expBtn.value = 'expert';
var expLabel = document.createElement('label');
var expDescription = document.createTextNode('Expert');
expLabel.appendChild(expDescription);
diffContainer.appendChild(bgnBtn);
diffContainer.appendChild(bgnLabel);
diffContainer.appendChild(advBtn);
diffContainer.appendChild(advLabel);
diffContainer.appendChild(expBtn);
diffContainer.appendChild(expLabel); // create play game btn to start 1st game

var playBtn = document.createElement('button');
playBtn.innerText = 'Play Game'; // ************** create card and card holders **************//

var flashedCards = document.createElement('h5');
flashedCards.classList.add('flashedCard');
var flashedCardContainer = document.createElement('div');
flashedCardContainer.classList.add('container', 'bg-light', 'cardContainer');
flashedCardContainer.appendChild(flashedCards);
var allCards = document.createElement('h5');
var allCardsContainer = document.createElement('div');
allCardsContainer.classList.add('container', 'bg-light', 'cardContainer');
allCardsContainer.innerText = "Select the card order";
var resultFlashedCards = document.createElement('div');
resultFlashedCards.classList.add('resultCard'); // create submit ans button

var submitAnsBtn = document.createElement('button');
submitAnsBtn.innerText = 'Submit';
var resultOutcome = document.createElement('h3'); // create play again btn

var playAgainBtn = document.createElement('button');
playAgainBtn.innerText = 'Play Again'; // create card function

var createCard = function createCard(cardInfo) {
  var suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;
  var name = document.createElement('div');
  name.classList.add('name', cardInfo.color);
  name.innerText = cardInfo.displayName;
  var card = document.createElement('div');
  card.classList.add('card');
  card.appendChild(name);
  card.appendChild(suit);
  return card;
}; // create num of cards to be flashed according to difficulty level 


var flashingCards = function flashingCards(_ref, gameLevel) {
  var flashCards = _ref.flashCards;
  var cardElement; // manipulate DOM

  if (gameLevel == 'beginner') {
    numOfCards = 5;

    for (var i = 0; i < numOfCards; i += 1) {
      displayedCards.push(flashCards[i]);
      cardElement = createCard(flashCards[i]);
      cardElement.id = "card".concat(i);
      cardElement.classList.toggle('beginner');
      flashedCards.appendChild(cardElement);
      console.log('flashCards :>> ', flashCards);
      console.log('displayedCards :>> ', displayedCards);
      setTimeout(function () {
        gameContainer.innerText = '';
      }, 5000);
    }

    ;
  } else if (gameLevel == 'advanced') {
    numOfCards = 7;

    for (var _i = 0; _i < numOfCards; _i += 1) {
      displayedCards.push(flashCards[_i]);
      cardElement = createCard(flashCards[_i]);
      cardElement.id = "card".concat(_i);
      cardElement.classList.toggle('advanced');
      flashedCards.appendChild(cardElement);
      console.log('flashCards :>> ', flashCards);
      console.log('displayedCards :>> ', displayedCards);
      setTimeout(function () {
        gameContainer.innerText = '';
      }, 7000);
    }

    ;
  } else {
    numOfCards = 10;

    for (var _i2 = 0; _i2 < numOfCards; _i2 += 1) {
      displayedCards.push(flashCards[_i2]);
      cardElement = createCard(flashCards[_i2]);
      cardElement.id = "card".concat(_i2);
      cardElement.classList.toggle('expert');
      flashedCards.appendChild(cardElement);
      console.log('flashCards :>> ', flashCards);
      console.log('displayedCards :>> ', displayedCards);
      setTimeout(function () {
        gameContainer.innerText = '';
      }, 10000);
    }

    ;
  }

  console.log('flashCards :>> ', flashCards);
  flashedCardContainer.appendChild(flashedCards);
  gameContainer.appendChild(flashedCardContainer);
}; // display all cards in array for user to select order


var displayCards = function displayCards(_ref2) {
  var flashCards = _ref2.flashCards;
  var cardElement; // shuffle the mixed flash card array

  for (var i = flashCards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref3 = [flashCards[j], flashCards[i]];
    flashCards[i] = _ref3[0];
    flashCards[j] = _ref3[1];
  } // append all 10 cards for selection


  for (var _i3 = 0; _i3 < flashCards.length; _i3 += 1) {
    cardElement = createCard(flashCards[_i3]);
    cardElement.id = "card".concat(_i3);
    allCards.appendChild(cardElement);
  }

  allCardsContainer.appendChild(allCards);
  cardSelectionContainer.appendChild(allCardsContainer);
}; // event listener for all displayed cards slated for selection


var cardSelection = function cardSelection() {
  var card0 = document.getElementById('card0');
  card0.addEventListener('click', cardSelected);
  var card1 = document.getElementById('card1');
  card1.addEventListener('click', cardSelected);
  var card2 = document.getElementById('card2');
  card2.addEventListener('click', cardSelected);
  var card3 = document.getElementById('card3');
  card3.addEventListener('click', cardSelected);
  var card4 = document.getElementById('card4');
  card4.addEventListener('click', cardSelected);
  var card5 = document.getElementById('card5');
  card5.addEventListener('click', cardSelected);
  var card6 = document.getElementById('card6');
  card6.addEventListener('click', cardSelected);
  var card7 = document.getElementById('card7');
  card7.addEventListener('click', cardSelected);
  var card8 = document.getElementById('card8');
  card8.addEventListener('click', cardSelected);
  var card9 = document.getElementById('card9');
  card9.addEventListener('click', cardSelected);
}; // selected cards to be appended to solution array and disappear


var cardSelected = function cardSelected(e) {
  if (e.target.nodeName === "DIV") {
    document.getElementById(e.target.id).remove(); // ansContainer.appendChild(e.target)
    // document.body.appendChild(ansContainer)

    var displayName = e.target.firstChild.innerText;
    var cardSuitSymbol = e.target.lastChild.innerText;
    console.log(e.target.firstChild.innerText);
    console.log(e.target.lastChild.innerText);
    selectedCards.push({
      displayName: displayName,
      suitSymbol: cardSuitSymbol
    });
    console.log('selectedCards :>> ', selectedCards);
  }
};

var displayFinalResults = function displayFinalResults() {
  var cardElement;

  for (var i = 0; i < selectedCards.length; i += 1) {
    cardElement = createCard(selectedCards[i]);
    allCards.appendChild(cardElement);
  }

  for (var _i4 = 0; _i4 < displayedCards.length; _i4 += 1) {
    cardElement = createCard(displayedCards[_i4]);
    resultFlashedCards.appendChild(cardElement);
  }

  flashedCardContainer.innerText = "Actual Card Order";
  flashedCardContainer.appendChild(resultFlashedCards);
  gameContainer.appendChild(flashedCardContainer);
  allCardsContainer.innerText = "Your Selected Order";
  allCardsContainer.appendChild(allCards);
  cardSelectionContainer.appendChild(allCardsContainer);
};

registrationBtn.addEventListener('click', function () {
  var registerData = {
    name: regUserName.value,
    password: regPassword.value
  };
  console.log(registerData);
  axios__WEBPACK_IMPORTED_MODULE_1___default().post('/register', registerData).then(function (response) {
    console.log('hellloow>>>>>>', response.data);

    if (response.data.error) {
      throw response.data.error;
    } else {
      document.body.removeChild(registrationContainer);
      registrationContainer.innerHTML = '';
    }
  })["catch"](function (error) {
    errorContainer.innerHTML = '<p style="color:red">Invalid Registration Details</p>';
    console.log(error);
  });
  checkLoggedIn();
});
loginBtn.addEventListener('click', function () {
  var loginData = {
    name: userName.value,
    password: password.value
  };
  console.log(loginData);
  axios__WEBPACK_IMPORTED_MODULE_1___default().post('/login', loginData).then(function (response) {
    console.log('hellloow>>>>>>', response.data);

    if (response.data.error) {
      throw response.data.error;
    } else {
      document.body.appendChild(diffContainer);
      document.body.appendChild(playBtn);
      loginContainer.innerHTML = '';
      document.body.removeChild(loginContainer);
      document.body.removeChild(registrationContainer);
      document.body.removeChild(errorContainer);
    }
  })["catch"](function (error) {
    errorContainer.innerHTML = '<p style="color:red">Invalid Login Details</p>';
    console.log(error);
  });
  checkLoggedIn();
});
playBtn.addEventListener('click', function () {
  document.body.removeChild(playBtn);
  gameContainer.appendChild(flashedCardContainer); // Make a request to create a new game

  axios__WEBPACK_IMPORTED_MODULE_1___default().post('/games').then(function (response) {
    // set the global value to the new game.
    currentGame = response.data;
    console.log('currentGame>>>>>>>', currentGame);
    var difficulty = document.querySelector('input[name="difficulty"]:checked');
    var gameLevel = difficulty.value;
    document.body.removeChild(diffContainer); // display it out to the user

    flashingCards(currentGame, gameLevel);

    if (numOfCards == 5) {
      setTimeout(function () {
        displayCards(currentGame);
        cardSelection();
        document.body.appendChild(submitAnsBtn);
      }, 6000);
    } else if (numOfCards == 7) {
      setTimeout(function () {
        displayCards(currentGame);
        cardSelection();
        document.body.appendChild(submitAnsBtn);
      }, 8000);
    } else {
      setTimeout(function () {
        displayCards(currentGame);
        cardSelection();
        document.body.appendChild(submitAnsBtn);
      }, 10000);
    }
  })["catch"](function (error) {
    // handle error
    console.log(error);
  });
});
submitAnsBtn.addEventListener('click', function () {
  var cardDifference = displayedCards.length - selectedCards.length;

  if (displayedCards.length > selectedCards.length) {
    errorContainer.innerHTML = "<p style=\"color:red\">Number of selected cards is lesser that those displayed. Pls select ".concat(cardDifference, " more cards! </p>");
    setTimeout(function () {
      errorContainer.innerHTML = "";
    }, 3000);
  } else {
    allCards.innerHTML = "";
    flashedCards.innerHTML = "";
    cardSelectionContainer.removeChild(allCardsContainer);
    var playerWon = false;
    var count = 0; // check for win conditions

    for (var i = 0; i < displayedCards.length; i += 1) {
      if (displayedCards[i].displayName === selectedCards[i].displayName && displayedCards[i].suitSymbol === selectedCards[i].suitSymbol) {
        count += 1;
      }
    }

    if (count === displayedCards.length) {
      playerWon = true;
      resultOutcome.innerText = 'You won';
      console.log('you won');
      document.body.removeChild(submitAnsBtn);
    } else {
      resultOutcome.innerText = 'You lost';
      console.log('you lost ');
      document.body.removeChild(submitAnsBtn);
    }

    displayFinalResults();
    document.body.appendChild(resultOutcome);
    document.body.appendChild(playAgainBtn);
  }
});
playAgainBtn.addEventListener('click', function () {
  flashedCardContainer.innerText = "";
  allCardsContainer.innerText = "Select the card order";
  allCards.innerHTML = "";
  resultFlashedCards.innerHTML = "";
  cardSelectionContainer.removeChild(allCardsContainer);
  gameContainer.removeChild(flashedCardContainer);
  document.body.removeChild(resultOutcome);
  document.body.removeChild(playAgainBtn);
  currentGame = null;
  displayedCards = [];
  selectedCards = [];
  document.body.appendChild(diffContainer);
  document.body.appendChild(playBtn);
});
checkLoggedIn();

/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL3NyYy9zdHlsZXMuc2NzcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJjdXJyZW50R2FtZSIsImRpc3BsYXllZENhcmRzIiwic2VsZWN0ZWRDYXJkcyIsIm51bU9mQ2FyZHMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2FyZFNlbGVjdGlvbkNvbnRhaW5lciIsImVycm9yQ29udGFpbmVyIiwicmVnaXN0cmF0aW9uQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInJlZ2lzdHJhdGlvblRleHQiLCJpbm5lclRleHQiLCJyZWdVc2VyTmFtZURpdiIsInJlZ1VzZXJOYW1lIiwicGxhY2Vob2xkZXIiLCJyZWdQYXNzd29yZERpdiIsInJlZ1Bhc3N3b3JkIiwicmVnaXN0cmF0aW9uQnRuIiwiYXBwZW5kQ2hpbGQiLCJsb2dpbkNvbnRhaW5lciIsImxvZ2luVGV4dCIsInVzZXJOYW1lRGl2IiwidXNlck5hbWUiLCJwYXNzd29yZERpdiIsInBhc3N3b3JkIiwibG9naW5CdG4iLCJjaGVja0xvZ2dlZEluIiwiYXhpb3MiLCJ0aGVuIiwicmVzcG9uc2UiLCJjb25zb2xlIiwibG9nIiwiZGF0YSIsImlzTG9nZ2VkSW4iLCJib2R5IiwiZGlmZkNvbnRhaW5lciIsInBsYXlCdG4iLCJlcnJvciIsImJnbkJ0biIsInR5cGUiLCJuYW1lIiwiY2hlY2tlZCIsInZhbHVlIiwiYmduTGFiZWwiLCJiZ25EZXNjcmlwdGlvbiIsImNyZWF0ZVRleHROb2RlIiwiYWR2QnRuIiwiYWR2TGFiZWwiLCJhZHZEZXNjcmlwdGlvbiIsImV4cEJ0biIsImV4cExhYmVsIiwiZXhwRGVzY3JpcHRpb24iLCJmbGFzaGVkQ2FyZHMiLCJmbGFzaGVkQ2FyZENvbnRhaW5lciIsImFsbENhcmRzIiwiYWxsQ2FyZHNDb250YWluZXIiLCJyZXN1bHRGbGFzaGVkQ2FyZHMiLCJzdWJtaXRBbnNCdG4iLCJyZXN1bHRPdXRjb21lIiwicGxheUFnYWluQnRuIiwiY3JlYXRlQ2FyZCIsImNhcmRJbmZvIiwic3VpdCIsInN1aXRTeW1ib2wiLCJjb2xvciIsImRpc3BsYXlOYW1lIiwiY2FyZCIsImZsYXNoaW5nQ2FyZHMiLCJnYW1lTGV2ZWwiLCJmbGFzaENhcmRzIiwiY2FyZEVsZW1lbnQiLCJpIiwicHVzaCIsImlkIiwidG9nZ2xlIiwic2V0VGltZW91dCIsImRpc3BsYXlDYXJkcyIsImxlbmd0aCIsImoiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjYXJkU2VsZWN0aW9uIiwiY2FyZDAiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjYXJkU2VsZWN0ZWQiLCJjYXJkMSIsImNhcmQyIiwiY2FyZDMiLCJjYXJkNCIsImNhcmQ1IiwiY2FyZDYiLCJjYXJkNyIsImNhcmQ4IiwiY2FyZDkiLCJlIiwidGFyZ2V0Iiwibm9kZU5hbWUiLCJyZW1vdmUiLCJmaXJzdENoaWxkIiwiY2FyZFN1aXRTeW1ib2wiLCJsYXN0Q2hpbGQiLCJkaXNwbGF5RmluYWxSZXN1bHRzIiwicmVnaXN0ZXJEYXRhIiwicmVtb3ZlQ2hpbGQiLCJpbm5lckhUTUwiLCJsb2dpbkRhdGEiLCJkaWZmaWN1bHR5IiwiY2FyZERpZmZlcmVuY2UiLCJwbGF5ZXJXb24iLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsNEZBQXVDLEM7Ozs7Ozs7Ozs7O0FDQTFCOztBQUViLFlBQVksbUJBQU8sQ0FBQyxxREFBWTtBQUNoQyxhQUFhLG1CQUFPLENBQUMsaUVBQWtCO0FBQ3ZDLGNBQWMsbUJBQU8sQ0FBQyx5RUFBc0I7QUFDNUMsZUFBZSxtQkFBTyxDQUFDLDJFQUF1QjtBQUM5QyxvQkFBb0IsbUJBQU8sQ0FBQyw2RUFBdUI7QUFDbkQsbUJBQW1CLG1CQUFPLENBQUMsbUZBQTJCO0FBQ3RELHNCQUFzQixtQkFBTyxDQUFDLHlGQUE4QjtBQUM1RCxrQkFBa0IsbUJBQU8sQ0FBQyx5RUFBcUI7O0FBRS9DO0FB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O1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiYXBwLTE5Yzk3NzQ2YmY0Y2U4ZDdmODczLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCc7XG4gICAgICBpZiAoY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKHRpbWVvdXRFcnJvck1lc3NhZ2UsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXF1ZXN0RGF0YSkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGF4aW9zLmRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxuLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuYXhpb3MuaXNBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzQXhpb3NFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBhcmd1bWVudHNbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICB9XG5cbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcubWV0aG9kID0gJ2dldCc7XG4gIH1cblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuQXhpb3MucHJvdG90eXBlLmdldFVyaSA9IGZ1bmN0aW9uIGdldFVyaShjb25maWcpIHtcbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIGVycm9yLmlzQXhpb3NFcnJvciA9IHRydWU7XG5cbiAgZXJyb3IudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgY29kZTogdGhpcy5jb2RlXG4gICAgfTtcbiAgfTtcbiAgcmV0dXJuIGVycm9yO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBDb25maWctc3BlY2lmaWMgbWVyZ2UtZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhIG5ldyBjb25maWctb2JqZWN0XG4gKiBieSBtZXJnaW5nIHR3byBjb25maWd1cmF0aW9uIG9iamVjdHMgdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIHZhciBjb25maWcgPSB7fTtcblxuICB2YXIgdmFsdWVGcm9tQ29uZmlnMktleXMgPSBbJ3VybCcsICdtZXRob2QnLCAnZGF0YSddO1xuICB2YXIgbWVyZ2VEZWVwUHJvcGVydGllc0tleXMgPSBbJ2hlYWRlcnMnLCAnYXV0aCcsICdwcm94eScsICdwYXJhbXMnXTtcbiAgdmFyIGRlZmF1bHRUb0NvbmZpZzJLZXlzID0gW1xuICAgICdiYXNlVVJMJywgJ3RyYW5zZm9ybVJlcXVlc3QnLCAndHJhbnNmb3JtUmVzcG9uc2UnLCAncGFyYW1zU2VyaWFsaXplcicsXG4gICAgJ3RpbWVvdXQnLCAndGltZW91dE1lc3NhZ2UnLCAnd2l0aENyZWRlbnRpYWxzJywgJ2FkYXB0ZXInLCAncmVzcG9uc2VUeXBlJywgJ3hzcmZDb29raWVOYW1lJyxcbiAgICAneHNyZkhlYWRlck5hbWUnLCAnb25VcGxvYWRQcm9ncmVzcycsICdvbkRvd25sb2FkUHJvZ3Jlc3MnLCAnZGVjb21wcmVzcycsXG4gICAgJ21heENvbnRlbnRMZW5ndGgnLCAnbWF4Qm9keUxlbmd0aCcsICdtYXhSZWRpcmVjdHMnLCAndHJhbnNwb3J0JywgJ2h0dHBBZ2VudCcsXG4gICAgJ2h0dHBzQWdlbnQnLCAnY2FuY2VsVG9rZW4nLCAnc29ja2V0UGF0aCcsICdyZXNwb25zZUVuY29kaW5nJ1xuICBdO1xuICB2YXIgZGlyZWN0TWVyZ2VLZXlzID0gWyd2YWxpZGF0ZVN0YXR1cyddO1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgdXRpbHMuZm9yRWFjaCh2YWx1ZUZyb21Db25maWcyS2V5cywgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gobWVyZ2VEZWVwUHJvcGVydGllc0tleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHV0aWxzLmZvckVhY2goZGVmYXVsdFRvQ29uZmlnMktleXMsIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKGRpcmVjdE1lcmdlS2V5cywgZnVuY3Rpb24gbWVyZ2UocHJvcCkge1xuICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGF4aW9zS2V5cyA9IHZhbHVlRnJvbUNvbmZpZzJLZXlzXG4gICAgLmNvbmNhdChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cylcbiAgICAuY29uY2F0KGRlZmF1bHRUb0NvbmZpZzJLZXlzKVxuICAgIC5jb25jYXQoZGlyZWN0TWVyZ2VLZXlzKTtcblxuICB2YXIgb3RoZXJLZXlzID0gT2JqZWN0XG4gICAgLmtleXMoY29uZmlnMSlcbiAgICAuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gZmlsdGVyQXhpb3NLZXlzKGtleSkge1xuICAgICAgcmV0dXJuIGF4aW9zS2V5cy5pbmRleE9mKGtleSkgPT09IC0xO1xuICAgIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gob3RoZXJLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gKHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JykgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbCkge1xuICBpZiAodG9TdHJpbmcuY2FsbCh2YWwpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTVxufTtcbiIsImltcG9ydCAnLi9zdHlsZXMuc2Nzcyc7XG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuLy8gZ2xvYmFsIHZhbHVlIHRoYXQgaG9sZHMgaW5mbyBhYm91dCB0aGUgY3VycmVudCBoYW5kLlxubGV0IGN1cnJlbnRHYW1lID0gbnVsbDtcbmxldCBkaXNwbGF5ZWRDYXJkcyA9IFtdXG5sZXQgc2VsZWN0ZWRDYXJkcyA9IFtdXG5sZXQgbnVtT2ZDYXJkcztcbi8vIHF1ZXJ5IGZvciBnYW1lIGFuZCBjYXJkIGNvbnRhaW5lclxuY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLWNvbnRhaW5lcicpO1xuY29uc3QgY2FyZFNlbGVjdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3QtY29udGFpbmVyJyk7XG5jb25zdCBlcnJvckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlcnJvci1jb250YWluZXInKTtcbi8vIGNyZWF0ZSByZWdpc3RyYXRpb25zIG9uIGxhbmRpbmcgcGFnZVxuY29uc3QgcmVnaXN0cmF0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5yZWdpc3RyYXRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2Zvcm0tc2lnbmluJywgJ2JnLWxpZ2h0Jyk7XG5cbi8vIGNyZWF0ZSByZWdpc3RyYXRpb24gZWxlbWVudHM6IHVzZXIgbmFtZSBhbmQgcHdcbmNvbnN0IHJlZ2lzdHJhdGlvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xucmVnaXN0cmF0aW9uVGV4dC5pbm5lclRleHQgPSAnUmVnaXN0cmF0aW9uIEZvcm0nO1xuXG5jb25zdCByZWdVc2VyTmFtZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVnVXNlck5hbWVEaXYuY2xhc3NMaXN0LmFkZCgnZm9ybS1mbG9hdGluZycpO1xuY29uc3QgcmVnVXNlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xucmVnVXNlck5hbWUucGxhY2Vob2xkZXIgPSAnSW5wdXQgVXNlcm5hbWUnO1xuXG5jb25zdCByZWdQYXNzd29yZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVnUGFzc3dvcmREaXYuY2xhc3NMaXN0LmFkZCgnZm9ybS1mbG9hdGluZycpO1xuY29uc3QgcmVnUGFzc3dvcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xucmVnUGFzc3dvcmQucGxhY2Vob2xkZXIgPSAnSW5wdXQgUGFzc3dvcmQnO1xuXG5jb25zdCByZWdpc3RyYXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbnJlZ2lzdHJhdGlvbkJ0bi5pbm5lclRleHQgPSAnUmVnaXN0ZXInO1xuXG5yZWdVc2VyTmFtZURpdi5hcHBlbmRDaGlsZChyZWdVc2VyTmFtZSk7XG5yZWdQYXNzd29yZERpdi5hcHBlbmRDaGlsZChyZWdQYXNzd29yZCk7XG5yZWdpc3RyYXRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQocmVnaXN0cmF0aW9uVGV4dCk7XG5yZWdpc3RyYXRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQocmVnVXNlck5hbWVEaXYpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlZ1Bhc3N3b3JkRGl2KTtcbnJlZ2lzdHJhdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChyZWdpc3RyYXRpb25CdG4pO1xuXG4vLyAqKioqKioqKioqKioqKiBjcmVhdGUgbG9naW4gb24gbGFuZGluZyBwYWdlICoqKioqKioqKioqKioqLy9cbmNvbnN0IGxvZ2luQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5sb2dpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInLCAnZm9ybS1zaWduaW4nLCAnYmctbGlnaHQnKTtcblxuLy8gY3JlYXRlIGxvZ2luIGVsZW1lbnRzOiBVc2VyTmFtZSBhbmQgcHdcbmNvbnN0IGxvZ2luVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG5sb2dpblRleHQuaW5uZXJUZXh0ID0gJ0xvZ2luIEZvcm0nO1xuXG5jb25zdCB1c2VyTmFtZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xudXNlck5hbWVEaXYuY2xhc3NMaXN0LmFkZCgnZm9ybS1mbG9hdGluZycpO1xuY29uc3QgdXNlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xudXNlck5hbWUucGxhY2Vob2xkZXIgPSAnSW5wdXQgVXNlciBOYW1lJztcblxuY29uc3QgcGFzc3dvcmREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnBhc3N3b3JkRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHBhc3N3b3JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnBhc3N3b3JkLnBsYWNlaG9sZGVyID0gJ0lucHV0IFBhc3N3b3JkJztcblxuY29uc3QgbG9naW5CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbmxvZ2luQnRuLmlubmVyVGV4dCA9ICdMb2dpbic7XG5cbnVzZXJOYW1lRGl2LmFwcGVuZENoaWxkKHVzZXJOYW1lKTtcbnBhc3N3b3JkRGl2LmFwcGVuZENoaWxkKHBhc3N3b3JkKTtcbmxvZ2luQ29udGFpbmVyLmFwcGVuZENoaWxkKGxvZ2luVGV4dCk7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh1c2VyTmFtZURpdik7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChwYXNzd29yZERpdik7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2dpbkJ0bik7XG5cbmNvbnN0IGNoZWNrTG9nZ2VkSW4gPSAoKSA9PiB7XG4gIGF4aW9zLmdldCgnL2lzbG9nZ2VkaW4nKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gbG9naW4gOj4+ICcsIHJlc3BvbnNlKTtcbiAgICAgIGlmIChyZXNwb25zZS5kYXRhLmlzTG9nZ2VkSW4gPT09IHRydWUpXG4gICAgICB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGlmZkNvbnRhaW5lcik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gcmVuZGVyIG90aGVyIGJ1dHRvbnNcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZWdpc3RyYXRpb25Db250YWluZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxvZ2luQ29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUubG9nKCdlcnJvciBmcm9tIGxvZ2dpbmcgaW4nLCBlcnJvcikpO1xufTtcblxuLy8gKioqKioqKioqKioqKiogY3JlYXRlIGRpZmZpY3VsdHkgc2VsZWN0aW9uIGVsZW1lbnRzICoqKioqKioqKioqKioqLy9cbmNvbnN0IGRpZmZDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmRpZmZDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2JnLWxpZ2h0JywgJ2NhcmRDb250YWluZXInKTtcblxuY29uc3QgYmduQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbmJnbkJ0bi50eXBlID0gJ3JhZGlvJztcbmJnbkJ0bi5uYW1lID0gJ2RpZmZpY3VsdHknO1xuYmduQnRuLmNoZWNrZWQgPSBmYWxzZTtcbmJnbkJ0bi52YWx1ZSA9ICdiZWdpbm5lcic7XG5jb25zdCBiZ25MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5jb25zdCBiZ25EZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdCZWdpbm5lcicpO1xuYmduTGFiZWwuYXBwZW5kQ2hpbGQoYmduRGVzY3JpcHRpb24pO1xuXG5jb25zdCBhZHZCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuYWR2QnRuLnR5cGUgPSAncmFkaW8nO1xuYWR2QnRuLm5hbWUgPSAnZGlmZmljdWx0eSc7XG5hZHZCdG4uY2hlY2tlZCA9IGZhbHNlO1xuYWR2QnRuLnZhbHVlID0gJ2FkdmFuY2VkJztcbmNvbnN0IGFkdkxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbmNvbnN0IGFkdkRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0FkdmFuY2VkJyk7XG5hZHZMYWJlbC5hcHBlbmRDaGlsZChhZHZEZXNjcmlwdGlvbik7XG5cbmNvbnN0IGV4cEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5leHBCdG4udHlwZSA9ICdyYWRpbyc7XG5leHBCdG4ubmFtZSA9ICdkaWZmaWN1bHR5JztcbmV4cEJ0bi5jaGVja2VkID0gZmFsc2U7XG5leHBCdG4udmFsdWUgPSAnZXhwZXJ0JztcbmNvbnN0IGV4cExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbmNvbnN0IGV4cERlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0V4cGVydCcpO1xuZXhwTGFiZWwuYXBwZW5kQ2hpbGQoZXhwRGVzY3JpcHRpb24pO1xuXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGJnbkJ0bilcbmRpZmZDb250YWluZXIuYXBwZW5kQ2hpbGQoYmduTGFiZWwpXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGFkdkJ0bilcbmRpZmZDb250YWluZXIuYXBwZW5kQ2hpbGQoYWR2TGFiZWwpXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGV4cEJ0bilcbmRpZmZDb250YWluZXIuYXBwZW5kQ2hpbGQoZXhwTGFiZWwpXG5cbi8vIGNyZWF0ZSBwbGF5IGdhbWUgYnRuIHRvIHN0YXJ0IDFzdCBnYW1lXG5jb25zdCBwbGF5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5wbGF5QnRuLmlubmVyVGV4dCA9ICdQbGF5IEdhbWUnO1xuXG5cbi8vICoqKioqKioqKioqKioqIGNyZWF0ZSBjYXJkIGFuZCBjYXJkIGhvbGRlcnMgKioqKioqKioqKioqKiovL1xuY29uc3QgZmxhc2hlZENhcmRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDUnKTtcbmZsYXNoZWRDYXJkcy5jbGFzc0xpc3QuYWRkKCdmbGFzaGVkQ2FyZCcpXG5jb25zdCBmbGFzaGVkQ2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZmxhc2hlZENhcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2JnLWxpZ2h0JywgJ2NhcmRDb250YWluZXInKTtcbmZsYXNoZWRDYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGZsYXNoZWRDYXJkcylcblxuY29uc3QgYWxsQ2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpO1xuY29uc3QgYWxsQ2FyZHNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmFsbENhcmRzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdiZy1saWdodCcsICdjYXJkQ29udGFpbmVyJyk7XG5hbGxDYXJkc0NvbnRhaW5lci5pbm5lclRleHQgPSBcIlNlbGVjdCB0aGUgY2FyZCBvcmRlclwiXG5cbmNvbnN0IHJlc3VsdEZsYXNoZWRDYXJkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVzdWx0Rmxhc2hlZENhcmRzLmNsYXNzTGlzdC5hZGQoJ3Jlc3VsdENhcmQnKVxuLy8gY3JlYXRlIHN1Ym1pdCBhbnMgYnV0dG9uXG5jb25zdCBzdWJtaXRBbnNCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbnN1Ym1pdEFuc0J0bi5pbm5lclRleHQgPSAnU3VibWl0JztcblxuY29uc3QgcmVzdWx0T3V0Y29tZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG5cbi8vIGNyZWF0ZSBwbGF5IGFnYWluIGJ0blxuY29uc3QgcGxheUFnYWluQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5wbGF5QWdhaW5CdG4uaW5uZXJUZXh0ID0gJ1BsYXkgQWdhaW4nO1xuXG5cblxuLy8gY3JlYXRlIGNhcmQgZnVuY3Rpb25cbmNvbnN0IGNyZWF0ZUNhcmQgPSAoY2FyZEluZm8pID0+IHtcbiAgY29uc3Qgc3VpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzdWl0LmNsYXNzTGlzdC5hZGQoJ3N1aXQnKTtcbiAgc3VpdC5pbm5lclRleHQgPSBjYXJkSW5mby5zdWl0U3ltYm9sO1xuXG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbmFtZS5jbGFzc0xpc3QuYWRkKCduYW1lJywgY2FyZEluZm8uY29sb3IpO1xuICBuYW1lLmlubmVyVGV4dCA9IGNhcmRJbmZvLmRpc3BsYXlOYW1lO1xuXG4gIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY2FyZC5jbGFzc0xpc3QuYWRkKCdjYXJkJyk7XG4gXG4gIGNhcmQuYXBwZW5kQ2hpbGQobmFtZSk7XG4gIGNhcmQuYXBwZW5kQ2hpbGQoc3VpdCk7XG5cbiAgcmV0dXJuIGNhcmQ7XG59O1xuXG4vLyBjcmVhdGUgbnVtIG9mIGNhcmRzIHRvIGJlIGZsYXNoZWQgYWNjb3JkaW5nIHRvIGRpZmZpY3VsdHkgbGV2ZWwgXG5jb25zdCBmbGFzaGluZ0NhcmRzID0gKHsgZmxhc2hDYXJkcywgfSwgZ2FtZUxldmVsKSA9PiB7XG4gIGxldCBjYXJkRWxlbWVudDtcbiAgXG4gIC8vIG1hbmlwdWxhdGUgRE9NXG4gIGlmIChnYW1lTGV2ZWwgPT0gJ2JlZ2lubmVyJyl7XG4gICAgbnVtT2ZDYXJkcyA9IDUgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZDYXJkczsgaSArPSAxKXtcbiAgICBkaXNwbGF5ZWRDYXJkcy5wdXNoKGZsYXNoQ2FyZHNbaV0pXG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBjYXJkRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdiZWdpbm5lcicpXG4gICAgZmxhc2hlZENhcmRzLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcbiAgICBjb25zb2xlLmxvZygnZmxhc2hDYXJkcyA6Pj4gJywgZmxhc2hDYXJkcyk7XG4gICAgY29uc29sZS5sb2coJ2Rpc3BsYXllZENhcmRzIDo+PiAnLCBkaXNwbGF5ZWRDYXJkcyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZ2FtZUNvbnRhaW5lci5pbm5lclRleHQgPSAnJztcbiAgICB9LCA1MDAwKTtcbn07XG4gICAgXG4gIH0gZWxzZSBpZiAoZ2FtZUxldmVsID09ICdhZHZhbmNlZCcpe1xuICAgIG51bU9mQ2FyZHMgPSA3XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZkNhcmRzOyBpICs9IDEpe1xuICAgIGRpc3BsYXllZENhcmRzLnB1c2goZmxhc2hDYXJkc1tpXSlcbiAgICBjYXJkRWxlbWVudCA9IGNyZWF0ZUNhcmQoZmxhc2hDYXJkc1tpXSk7XG4gICAgY2FyZEVsZW1lbnQuaWQgPSBgY2FyZCR7aX1gO1xuICAgIGNhcmRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2FkdmFuY2VkJylcbiAgICBmbGFzaGVkQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICAgIGNvbnNvbGUubG9nKCdmbGFzaENhcmRzIDo+PiAnLCBmbGFzaENhcmRzKTtcbiAgICBjb25zb2xlLmxvZygnZGlzcGxheWVkQ2FyZHMgOj4+ICcsIGRpc3BsYXllZENhcmRzKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBnYW1lQ29udGFpbmVyLmlubmVyVGV4dCA9ICcnO1xuICAgIH0sIDcwMDApO1xuICB9O1xuICB9IGVsc2Uge1xuICAgIG51bU9mQ2FyZHMgPSAxMFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZDYXJkczsgaSArPSAxKXtcbiAgICBkaXNwbGF5ZWRDYXJkcy5wdXNoKGZsYXNoQ2FyZHNbaV0pXG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBjYXJkRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdleHBlcnQnKVxuICAgIGZsYXNoZWRDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gICAgY29uc29sZS5sb2coJ2ZsYXNoQ2FyZHMgOj4+ICcsIGZsYXNoQ2FyZHMpO1xuICAgIGNvbnNvbGUubG9nKCdkaXNwbGF5ZWRDYXJkcyA6Pj4gJywgZGlzcGxheWVkQ2FyZHMpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGdhbWVDb250YWluZXIuaW5uZXJUZXh0ID0gJyc7XG4gICAgfSwgMTAwMDApO1xuICB9O1xuICB9XG4gICAgY29uc29sZS5sb2coJ2ZsYXNoQ2FyZHMgOj4+ICcsIGZsYXNoQ2FyZHMpO1xuICAgIGZsYXNoZWRDYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGZsYXNoZWRDYXJkcyk7XG4gICAgZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZENvbnRhaW5lcik7XG4gIFxuXG59XG5cbi8vIGRpc3BsYXkgYWxsIGNhcmRzIGluIGFycmF5IGZvciB1c2VyIHRvIHNlbGVjdCBvcmRlclxuY29uc3QgZGlzcGxheUNhcmRzID0gKHsgZmxhc2hDYXJkcyx9KSA9Plxue1xuICBsZXQgY2FyZEVsZW1lbnQ7XG4gICAgLy8gc2h1ZmZsZSB0aGUgbWl4ZWQgZmxhc2ggY2FyZCBhcnJheVxuICBmb3IgKGxldCBpID0gZmxhc2hDYXJkcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgW2ZsYXNoQ2FyZHNbaV0sIGZsYXNoQ2FyZHNbal1dID0gW2ZsYXNoQ2FyZHNbal0sIGZsYXNoQ2FyZHNbaV1dO1xuICAgIH1cbiAgICBcbiAgLy8gYXBwZW5kIGFsbCAxMCBjYXJkcyBmb3Igc2VsZWN0aW9uXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmxhc2hDYXJkcy5sZW5ndGg7IGkgKz0gMSl7XG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBhbGxDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gIH1cbiAgYWxsQ2FyZHNDb250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHMpXG4gIGNhcmRTZWxlY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHNDb250YWluZXIpO1xufVxuXG4vLyBldmVudCBsaXN0ZW5lciBmb3IgYWxsIGRpc3BsYXllZCBjYXJkcyBzbGF0ZWQgZm9yIHNlbGVjdGlvblxuY29uc3QgY2FyZFNlbGVjdGlvbiA9ICgpID0+IHtcbmNvbnN0IGNhcmQwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQwJyk7XG5jYXJkMC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhcmRTZWxlY3RlZCk7XG5jb25zdCBjYXJkMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMScpO1xuY2FyZDEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMicpO1xuY2FyZDIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMycpO1xuY2FyZDMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNCcpO1xuY2FyZDQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNScpO1xuY2FyZDUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNicpO1xuY2FyZDYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNycpO1xuY2FyZDcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkOCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkOCcpO1xuY2FyZDguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkOSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkOScpO1xuY2FyZDkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG59XG5cbi8vIHNlbGVjdGVkIGNhcmRzIHRvIGJlIGFwcGVuZGVkIHRvIHNvbHV0aW9uIGFycmF5IGFuZCBkaXNhcHBlYXJcbmNvbnN0IGNhcmRTZWxlY3RlZCA9IChlKSA9PiB7XG4gICBpZiAoZS50YXJnZXQubm9kZU5hbWUgPT09IFwiRElWXCIpe1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUudGFyZ2V0LmlkKS5yZW1vdmUoKVxuICAgIC8vIGFuc0NvbnRhaW5lci5hcHBlbmRDaGlsZChlLnRhcmdldClcbiAgICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFuc0NvbnRhaW5lcilcbiAgICBjb25zdCBkaXNwbGF5TmFtZSA9IGUudGFyZ2V0LmZpcnN0Q2hpbGQuaW5uZXJUZXh0O1xuICAgIGNvbnN0IGNhcmRTdWl0U3ltYm9sID0gZS50YXJnZXQubGFzdENoaWxkLmlubmVyVGV4dDtcbiAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5maXJzdENoaWxkLmlubmVyVGV4dClcbiAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5sYXN0Q2hpbGQuaW5uZXJUZXh0KVxuICAgIHNlbGVjdGVkQ2FyZHMucHVzaCh7ZGlzcGxheU5hbWUsIHN1aXRTeW1ib2w6IGNhcmRTdWl0U3ltYm9sIH0pXG4gICAgY29uc29sZS5sb2coJ3NlbGVjdGVkQ2FyZHMgOj4+ICcsIHNlbGVjdGVkQ2FyZHMpO1xuICB9XG59XG5cbmNvbnN0IGRpc3BsYXlGaW5hbFJlc3VsdHMgPSAoKSA9PiB7XG4gIGxldCBjYXJkRWxlbWVudDtcbiAgXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRDYXJkcy5sZW5ndGg7IGkgKz0gMSl7XG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKHNlbGVjdGVkQ2FyZHNbaV0pO1xuICAgIGFsbENhcmRzLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpc3BsYXllZENhcmRzLmxlbmd0aDsgaSArPSAxKXtcbiAgICBjYXJkRWxlbWVudCA9IGNyZWF0ZUNhcmQoZGlzcGxheWVkQ2FyZHNbaV0pO1xuICAgIHJlc3VsdEZsYXNoZWRDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gIH1cbiAgZmxhc2hlZENhcmRDb250YWluZXIuaW5uZXJUZXh0ID0gXCJBY3R1YWwgQ2FyZCBPcmRlclwiXG4gIGZsYXNoZWRDYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlc3VsdEZsYXNoZWRDYXJkcylcbiAgZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZENvbnRhaW5lcik7XG4gIGFsbENhcmRzQ29udGFpbmVyLmlubmVyVGV4dCA9IFwiWW91ciBTZWxlY3RlZCBPcmRlclwiXG4gIGFsbENhcmRzQ29udGFpbmVyLmFwcGVuZENoaWxkKGFsbENhcmRzKVxuICBjYXJkU2VsZWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGFsbENhcmRzQ29udGFpbmVyKTtcbn1cblxucmVnaXN0cmF0aW9uQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25zdCByZWdpc3RlckRhdGEgPSB7XG4gICAgbmFtZTogcmVnVXNlck5hbWUudmFsdWUsXG4gICAgcGFzc3dvcmQ6IHJlZ1Bhc3N3b3JkLnZhbHVlLFxuICB9O1xuICBcbiAgY29uc29sZS5sb2cocmVnaXN0ZXJEYXRhKTtcbiAgYXhpb3NcbiAgICAucG9zdCgnL3JlZ2lzdGVyJywgcmVnaXN0ZXJEYXRhKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2hlbGxsb293Pj4+Pj4+JywgcmVzcG9uc2UuZGF0YSk7XG4gICAgICBpZiAocmVzcG9uc2UuZGF0YS5lcnJvcil7XG4gICAgICAgIHRocm93IHJlc3BvbnNlLmRhdGEuZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHJlZ2lzdHJhdGlvbkNvbnRhaW5lcik7XG4gICAgICAgIHJlZ2lzdHJhdGlvbkNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGVycm9yQ29udGFpbmVyLmlubmVySFRNTCA9ICc8cCBzdHlsZT1cImNvbG9yOnJlZFwiPkludmFsaWQgUmVnaXN0cmF0aW9uIERldGFpbHM8L3A+JztcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxuICAgICBjaGVja0xvZ2dlZEluKCk7XG59KTtcblxubG9naW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IGxvZ2luRGF0YSA9IHtcbiAgICBuYW1lOiB1c2VyTmFtZS52YWx1ZSxcbiAgICBwYXNzd29yZDogcGFzc3dvcmQudmFsdWUsXG4gIH07XG4gIGNvbnNvbGUubG9nKGxvZ2luRGF0YSk7XG4gIGF4aW9zXG4gICAgLnBvc3QoJy9sb2dpbicsIGxvZ2luRGF0YSlcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdoZWxsbG9vdz4+Pj4+PicsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuZXJyb3IpXG4gICAgICB7XG4gICAgICAgICB0aHJvdyByZXNwb25zZS5kYXRhLmVycm9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaWZmQ29udGFpbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICAgICAgbG9naW5Db250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobG9naW5Db250YWluZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHJlZ2lzdHJhdGlvbkNvbnRhaW5lcik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZXJyb3JDb250YWluZXIpO1xuICAgICAgfVxuICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBlcnJvckNvbnRhaW5lci5pbm5lckhUTUwgPSAnPHAgc3R5bGU9XCJjb2xvcjpyZWRcIj5JbnZhbGlkIExvZ2luIERldGFpbHM8L3A+JztcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KVxuICAgICBjaGVja0xvZ2dlZEluKCk7XG59KTtcblxucGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChwbGF5QnRuKTtcbiAgZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZENvbnRhaW5lcik7XG4gIC8vIE1ha2UgYSByZXF1ZXN0IHRvIGNyZWF0ZSBhIG5ldyBnYW1lXG4gIGF4aW9zXG4gICAucG9zdCgnL2dhbWVzJylcbiAgIC50aGVuKCAocmVzcG9uc2UpID0+IHtcbiAgICAvLyBzZXQgdGhlIGdsb2JhbCB2YWx1ZSB0byB0aGUgbmV3IGdhbWUuXG4gICAgICBjdXJyZW50R2FtZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjb25zb2xlLmxvZygnY3VycmVudEdhbWU+Pj4+Pj4+JyxjdXJyZW50R2FtZSk7XG4gICAgICBjb25zdCBkaWZmaWN1bHR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImRpZmZpY3VsdHlcIl06Y2hlY2tlZCcpO1xuICAgICAgY29uc3QgZ2FtZUxldmVsID0gZGlmZmljdWx0eS52YWx1ZVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaWZmQ29udGFpbmVyKTtcbiAgICAgIC8vIGRpc3BsYXkgaXQgb3V0IHRvIHRoZSB1c2VyXG4gICAgICBmbGFzaGluZ0NhcmRzKGN1cnJlbnRHYW1lLCBnYW1lTGV2ZWwpO1xuICAgICAgaWYgKG51bU9mQ2FyZHMgPT0gNSl7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRpc3BsYXlDYXJkcyhjdXJyZW50R2FtZSk7XG4gICAgICBjYXJkU2VsZWN0aW9uKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgfSwgNjAwMCk7fSBlbHNlIGlmIChudW1PZkNhcmRzID09IDcpe1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkaXNwbGF5Q2FyZHMoY3VycmVudEdhbWUpO1xuICAgICAgY2FyZFNlbGVjdGlvbigpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdWJtaXRBbnNCdG4pO1xuICAgIH0sIDgwMDApO30gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRpc3BsYXlDYXJkcyhjdXJyZW50R2FtZSk7XG4gICAgICBjYXJkU2VsZWN0aW9uKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgfSwgMTAwMDApO31cbiAgICAgXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAvLyBoYW5kbGUgZXJyb3JcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcbn0pO1xuXG5zdWJtaXRBbnNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGxldCBjYXJkRGlmZmVyZW5jZSA9IGRpc3BsYXllZENhcmRzLmxlbmd0aCAtIHNlbGVjdGVkQ2FyZHMubGVuZ3RoO1xuICBpZihkaXNwbGF5ZWRDYXJkcy5sZW5ndGggPiBzZWxlY3RlZENhcmRzLmxlbmd0aCl7IFxuICAgIGVycm9yQ29udGFpbmVyLmlubmVySFRNTCA9IGA8cCBzdHlsZT1cImNvbG9yOnJlZFwiPk51bWJlciBvZiBzZWxlY3RlZCBjYXJkcyBpcyBsZXNzZXIgdGhhdCB0aG9zZSBkaXNwbGF5ZWQuIFBscyBzZWxlY3QgJHtjYXJkRGlmZmVyZW5jZX0gbW9yZSBjYXJkcyEgPC9wPmA7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7IGVycm9yQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJ9LCAzMDAwKVxuICB9IGVsc2Uge1xuICBhbGxDYXJkcy5pbm5lckhUTUwgPSBcIlwiXG4gIGZsYXNoZWRDYXJkcy5pbm5lckhUTUwgPSBcIlwiXG4gIGNhcmRTZWxlY3Rpb25Db250YWluZXIucmVtb3ZlQ2hpbGQoYWxsQ2FyZHNDb250YWluZXIpO1xuICBsZXQgcGxheWVyV29uID0gZmFsc2U7XG4gIGxldCBjb3VudCA9IDA7XG4gIFxuICAvLyBjaGVjayBmb3Igd2luIGNvbmRpdGlvbnNcbiAgZm9yKGxldCBpID0gMDsgaSA8IGRpc3BsYXllZENhcmRzLmxlbmd0aDsgaSArPSAxKXtcbiAgaWYoZGlzcGxheWVkQ2FyZHNbaV0uZGlzcGxheU5hbWUgPT09IHNlbGVjdGVkQ2FyZHNbaV0uZGlzcGxheU5hbWUgJiYgXG4gICAgICBkaXNwbGF5ZWRDYXJkc1tpXS5zdWl0U3ltYm9sID09PSBzZWxlY3RlZENhcmRzW2ldLnN1aXRTeW1ib2wpe1xuICAgICAgICBjb3VudCArPSAxOyAgICAgICBcbiAgICAgIH1cbiAgfVxuICBpZihjb3VudCA9PT0gZGlzcGxheWVkQ2FyZHMubGVuZ3RoKXtcbiAgICAgIHBsYXllcldvbiA9IHRydWVcbiAgICAgIHJlc3VsdE91dGNvbWUuaW5uZXJUZXh0ID0gJ1lvdSB3b24nXG4gICAgICBjb25zb2xlLmxvZygneW91IHdvbicpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0T3V0Y29tZS5pbm5lclRleHQgPSAnWW91IGxvc3QnXG4gICAgICBjb25zb2xlLmxvZygneW91IGxvc3QgJyk7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgICB9XG4gICAgZGlzcGxheUZpbmFsUmVzdWx0cygpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVzdWx0T3V0Y29tZSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBsYXlBZ2FpbkJ0bilcbiAgfVxuICB9KTtcblxucGxheUFnYWluQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT57XG4gIGZsYXNoZWRDYXJkQ29udGFpbmVyLmlubmVyVGV4dCA9IFwiXCJcbiAgYWxsQ2FyZHNDb250YWluZXIuaW5uZXJUZXh0ID0gXCJTZWxlY3QgdGhlIGNhcmQgb3JkZXJcIlxuICBhbGxDYXJkcy5pbm5lckhUTUwgPSBcIlwiXG4gIHJlc3VsdEZsYXNoZWRDYXJkcy5pbm5lckhUTUwgPSBcIlwiXG4gIGNhcmRTZWxlY3Rpb25Db250YWluZXIucmVtb3ZlQ2hpbGQoYWxsQ2FyZHNDb250YWluZXIpO1xuICBnYW1lQ29udGFpbmVyLnJlbW92ZUNoaWxkKGZsYXNoZWRDYXJkQ29udGFpbmVyKTtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChyZXN1bHRPdXRjb21lKVxuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHBsYXlBZ2FpbkJ0bilcbiAgY3VycmVudEdhbWUgPSBudWxsO1xuICBkaXNwbGF5ZWRDYXJkcyA9IFtdXG4gIHNlbGVjdGVkQ2FyZHMgPSBbXVxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpZmZDb250YWluZXIpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBsYXlCdG4pO1xufSk7XG5cbmNoZWNrTG9nZ2VkSW4oKSIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gbW9kdWxlWydkZWZhdWx0J10gOlxuXHRcdCgpID0+IG1vZHVsZTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=