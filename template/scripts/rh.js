(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;


var Console = function () {
  var overrides = undefined;
  var colors = undefined;
  Console = function (_rh$Plugin) {
    _inherits(Console, _rh$Plugin);

    _createClass(Console, null, [{
      key: 'initClass',
      value: function initClass() {

        overrides = ['info', 'log', 'warn', 'debug', 'error'];

        colors = ['#00FF00', '#000000', '#0000FF', '#0000FF', '#FF0000'];
      }
    }]);

    function Console() {
      _classCallCheck(this, Console);

      var _this = _possibleConstructorReturn(this, (Console.__proto__ || Object.getPrototypeOf(Console)).call(this));

      _this.$el = $('#console', 0);

      if (_this.$el) {
        if (window.console == null) {
          window.console = {};
        }
        _this.attachOwner(window.console);
        _this.addOverrides(overrides);
        _.each(overrides, function (fnName, index) {
          return this[fnName] = function () {
            this.color = colors[index];
            return this.logger.apply(this, arguments);
          };
        }, _this);
        _this.createChildNodes();
        _this.setUpInputBox();
      }
      return _this;
    }

    _createClass(Console, [{
      key: 'ownerIsChanged',
      value: function ownerIsChanged() {
        var _this2 = this;

        return this.$el.style.display = function () {
          if (_this2.hasOwner()) {
            return '';
          } else if (_this2.$el) {
            return 'none';
          }
        }();
      }
    }, {
      key: 'logger',
      value: function logger(oldHandler, args, tag) {
        if (tag == null) {
          tag = 'span';
        }
        var messages = [];
        var node = document.createElement(tag);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(args)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var arg = _step.value;

            if (_.isFunction(arg) || _.isString(arg)) {
              messages.push(arg);
            } else if (arg != null) {
              var msg;
              try {
                msg = JSON.stringify(arg);
              } catch (e) {
                msg = e.name + ': ' + e.message;
              }
              messages.push(msg);
            } else {
              messages.push('undefined');
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.color === '#FF0000') {
          messages.push(_.stackTrace());
        }
        node.style.color = this.color;
        $.textContent(node, messages.join(' '));

        this.$logNode.appendChild(node);
        this.$logNode.appendChild(document.createElement('br'));
        this.$el.scrollTop = this.$el.scrollHeight;

        if (oldHandler) {
          return oldHandler(args);
        }
      }
    }, {
      key: 'createChildNodes',
      value: function createChildNodes() {
        this.$logNode = $.find(this.$el, 'p')[0];
        if (!this.$logNode) {
          this.$logNode = document.createElement('p');
          this.$logNode.className = 'console';
          this.$el.appendChild(this.$logNode);
        }

        this.$input = $.find(this.$el, 'input')[0];
        if (!this.$input) {
          var $lable = document.createElement('label');
          $.textContent($lable, '> ');
          $lable.style.color = 'blue';
          this.$input = document.createElement('input');
          this.$input.type = 'text';
          this.$input.className = 'console';
          this.$input.style.width = '98%';
          this.$input.style.border = '0';
          this.$input.style.padding = '2px';
          this.$input.placeholder = 'Enter a valid expression';
          $lable.appendChild(this.$input);
          return this.$el.appendChild($lable);
        }
      }
    }, {
      key: 'setUpInputBox',
      value: function setUpInputBox() {
        var _this3 = this;

        return this.$input.onkeydown = function (event) {
          if (event.keyCode === 13) {
            _this3.color = '#0000FF';
            var expr = _this3.$input.value;
            try {
              var retVal = Function('event', 'return ' + expr)(event);
              _this3.$input.value = '';
              _this3.logger(null, [expr], 'b');
              return _this3.logger(null, [retVal]);
            } catch (e) {
              _this3.color = '#FF1100';
              return _this3.logger(null, [e.name + ': ' + e.message], 'b');
            }
          }
        };
      }
    }]);

    return Console;
  }(rh.Plugin);
  Console.initClass();
  return Console;
}();

rh.Console = Console;

},{}],2:[function(require,module,exports){
'use strict';

var consts = void 0;
var _window = window,
    rh = _window.rh;

var cache = {};

rh.consts = consts = function consts(key, value) {
  if (arguments.length === 1) {
    if (rh._debug) {
      if (!(key in cache)) {
        rh._d('error', 'consts', key + ' is not available');
      }
    }
    return cache[key];
  } else if (key in cache) {
    if (rh._debug) {
      return rh._d('error', 'consts', key + ' is already registered');
    }
  } else {
    return cache[key] = value;
  }
};

// Temp keys
consts('KEY_TEMP_DATA', '.temp.data');

// iframe keys
consts('KEY_SHARED_INPUT', '._sharedkeys.input');
consts('KEY_SHARED_OUTPUT', '._sharedkeys.output');
consts('KEY_IFRAME_EVENTS', '.l.iframe_events');

// Screen specific
consts('KEY_SCREEN', '.l.screen');
consts('KEY_DEFAULT_SCREEN', '.l.default_screen');
consts('KEY_SCREEN_NAMES', '.l.screen_names');
consts('KEY_SCREEN_DESKTOP', consts('KEY_SCREEN') + '.desktop.attached');
consts('KEY_SCREEN_TABLET', consts('KEY_SCREEN') + '.tablet.attached');
consts('KEY_SCREEN_TABLET_PORTRAIT', consts('KEY_SCREEN') + '.tablet_portrait.attached');
consts('KEY_SCREEN_PHONE', consts('KEY_SCREEN') + '.phone.attached');
consts('KEY_SCREEN_IOS', consts('KEY_SCREEN') + '.ios.attached');
consts('KEY_SCREEN_IPAD', consts('KEY_SCREEN') + '.ipad.attached');
consts('KEY_SCREEN_PRINT', consts('KEY_SCREEN') + '.print.attached');

// Events
consts('EVT_ORIENTATION_CHANGE', '.e.orientationchange');
consts('EVT_HASH_CHANGE', '.e.hashchange');
consts('EVT_WIDGET_BEFORELOAD', '.e.widget_beforeload');
consts('EVT_WIDGET_LOADED', '.e.widget_loaded');
consts('EVT_BEFORE_UNLOAD', '.e.before_unload');
consts('EVT_UNLOAD', '.e.unload');
consts('EVT_MOUSEMOVE', '.e.mousemove');
consts('EVT_SWIPE_DIR', '.e.swipe_dir');
consts('EVT_FAST_CLICK', '.e.fast_click');
consts('EVT_CLICK_INSIDE_IFRAME', '.e.click_inside_iframe');
consts('EVT_SCROLL_INSIDE_IFRAME', '.e.scroll_inside_iframe');
consts('EVT_INSIDE_IFRAME_DOM_CONTENTLOADED', 'e.inside_iframe_dom_contentloaded');
consts('RHMAPNO', 'rhmapno');
consts('TOPIC_FILE', 'topic.htm');
consts('HOME_PAGE', 'index.htm');

},{}],3:[function(require,module,exports){
"use strict";

var _window = window,
    rh = _window.rh;
var _ = rh._;


rh.controller = _.cache(_.isFunction);

},{}],4:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var model = rh.model;


var loadWidgets = function loadWidgets(parentNode, parent) {
  return _.each($.find(parentNode, '[data-rhwidget]'), function (node) {
    if ($.dataset(node, 'loaded')) {
      return;
    } //it can be empty string on old browser
    if (!$.isDescendent(parentNode, node)) {
      return;
    } //ignore nested widget data
    var config = $.dataset(node, 'config');
    config = config ? _.resolveNiceJSON(config) : {};
    return _.each(_.resolveWidgetArgs($.dataset(node, 'rhwidget')), function (wInfo) {
      var wName = wInfo.wName,
          wArg = wInfo.wArg,
          pipedArgs = wInfo.pipedArgs,
          rawArg = wInfo.rawArg;

      if (wName[0] === wName[0].toLowerCase()) {
        //data widget
        config.rawArg = rawArg;
      } else {
        if (pipedArgs.length > 0) {
          config.pipedArgs = pipedArgs;
        }
        if (wArg) {
          _.extend(config, wArg);
        }
      }
      config.node = node;
      var wclass = rh.widgets[wName];
      var widget = new wclass(config);
      return widget.init(parent);
    });
  });
};

//data-rhtags is synthatic suger(shortcut) for data-rhwidgets='ContentFilter' and
// data-config='{"id": "1"}'
var loadContentFilter = function loadContentFilter(parentNode) {
  return function () {
    var result = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Array.from($.find(parentNode, '[data-rhtags]'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;

        var widget;
        if (!$.isDescendent(parentNode, node)) {
          continue;
        } //ignore nested widget data
        var config = $.dataset(node, 'config');
        config = config ? _.resolveNiceJSON(config) : {};
        config.ids = $.dataset(node, 'rhtags').split(',');
        config.node = node;
        result.push(widget = new rh.widgets.ContentFilter(config));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return result;
  }();
};

var loadDataHandlers = function loadDataHandlers(parentNode, parent) {
  loadWidgets(parentNode, parent);
  return loadContentFilter(parentNode);
};

_.loadWidgets = loadWidgets;
_.loadContentFilter = loadContentFilter;
_.loadDataHandlers = loadDataHandlers;

},{}],5:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;


rh._params = _.urlParams();
rh._debugFilter = _.toRegExp(rh._params.rh_debug);
rh._debug = rh._debugFilter != null;

rh._testFilter = _.toRegExp(rh._params.rh_test);
rh._test = rh._testFilter != null;

rh._errorFilter = _.toRegExp(rh._params.rh_error);
rh._error = rh._errorFilter != null;

rh._breakFilter = _.toRegExp(rh._params.rh_break);
rh._break = rh._breakFilter != null;

var matchFilter = function matchFilter(messages, filter) {
  return messages.join(' ').match(filter);
};

rh._d = function () {
  var _window2 = window,
      console = _window2.console;

  if (rh._debug && console && _.isFunction(console.log)) {
    var fn = void 0;
    var args = [];var i = -1;
    while (++i < arguments.length) {
      args.push(arguments[i]);
    }
    if (['info', 'log', 'warn', 'debug', 'error'].indexOf(args[0]) > -1) {
      fn = console[args[0]];
      args = args.slice(1);
    } else {
      fn = console.debug;
    }

    var newArgs = ['[ ' + args[0] + ' ]:'].concat(args.slice(1));
    if (rh._debugFilter === '' || matchFilter(newArgs, rh._debugFilter)) {
      if (rh._break && matchFilter(newArgs, rh._breakFilter)) {
        return Function('', 'debugger')();
      } else if (rh._error && matchFilter(newArgs, rh._errorFilter)) {
        return console.error.apply(console, newArgs);
      } else {
        return fn.apply(console, newArgs);
      }
    }
  }
};

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;

var Guard = function () {
  function Guard() {
    _classCallCheck(this, Guard);

    this.guard = this.guard.bind(this);
  }

  _createClass(Guard, [{
    key: "guard",
    value: function guard(fn, guardName) {
      if (this.guardedNames == null) {
        this.guardedNames = [];
      }
      if (this.guardedNames.indexOf(guardName) === -1) {
        this.guardedNames.push(guardName);
        fn.call(this);
        return this.guardedNames.splice(this.guardedNames.indexOf(guardName), 1);
      }
    }
  }]);

  return Guard;
}();

rh.Guard = Guard;
rh.guard = new Guard().guard;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;


var defaultOpts = { async: true };

var formData = rh.formData = function (opts) {
  var form_data = new window.FormData();
  _.each(opts, function (value, key) {
    return form_data.append(key, value);
  });
  return form_data;
};

//private class of http api

var Response = function () {
  function Response(xhr, opts) {
    _classCallCheck(this, Response);

    this.onreadystatechange = this.onreadystatechange.bind(this);
    this.xhr = xhr;
    this.opts = opts;
    if (this.opts.success != null) {
      this.success(this.opts.success);
    }
    if (this.opts.error != null) {
      this.error(this.opts.error);
    }
    this.xhr.onreadystatechange = this.onreadystatechange;
  }

  _createClass(Response, [{
    key: 'onreadystatechange',
    value: function onreadystatechange() {
      var _this = this;

      if (this.xhr.readyState !== 4) {
        return;
      }

      var text = this.xhr.responseText;
      var status = this.xhr.status;

      var headers = function headers(name) {
        return _this.xhr.getResponseHeader(name);
      };

      if (this.isSuccess(status)) {
        if (this.successFn) {
          this.successFn(text, status, headers, this.opts);
        }
      } else {
        if (this.errorFn) {
          this.errorFn(text, status, headers, this.opts);
        }
      }

      if (this.finallyFn) {
        return this.finallyFn(text, status, headers, this.opts);
      }
    }
  }, {
    key: 'isSuccess',
    value: function isSuccess(status) {
      return status >= 200 && status < 300 || status === 304;
    }
  }, {
    key: 'success',
    value: function success(fn) {
      this.successFn = fn;
      return this;
    }
  }, {
    key: 'error',
    value: function error(fn) {
      this.errorFn = fn;
      return this;
    }
  }, {
    key: 'finally',
    value: function _finally(fn) {
      this.finallyFn = fn;
      return this;
    }
  }]);

  return Response;
}();

var createRequest = function createRequest(opts) {
  var XHR = window.XMLHttpRequest || window.ActiveXObject('Microsoft.XMLHTTP');
  var xhr = new XHR();
  var response = new Response(xhr, opts);
  return { xhr: xhr, response: response };
};

// http apis
var http = rh.http = function (opts) {
  opts = _.extend({}, defaultOpts, opts);

  var _createRequest = createRequest(opts),
      xhr = _createRequest.xhr,
      response = _createRequest.response;

  xhr.open(opts.method, opts.url, opts.async);

  if (opts['Content-type']) {
    xhr.setRequestHeader('Content-type', opts['Content-type']);
  }

  xhr.send(opts.data);
  return response;
};

http.get = function (url, opts) {
  return http(_.extend({ url: url, method: 'GET' }, opts));
};

http.post = function (url, data, opts) {
  return http(_.extend({ url: url, method: 'POST', data: data }, opts));
};

http.put = function (url, data, opts) {
  return http(_.extend({ url: url, method: 'PUT', data: data }, opts));
};

http.jsonp = function (url, opts) {
  opts = _.extend({}, defaultOpts, opts);
  var node = $('script', 0) || document.head.children[0];
  var newNode = document.createElement('script');
  newNode.async = opts.async;
  newNode.src = url;
  return node.parentNode.insertBefore(newNode, node);
};

},{}],8:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;

var Iframe = function (_rh$Guard) {
  _inherits(Iframe, _rh$Guard);

  _createClass(Iframe, [{
    key: 'toString',
    value: function toString() {
      return 'Iframe';
    }
  }]);

  function Iframe() {
    _classCallCheck(this, Iframe);

    var _this = _possibleConstructorReturn(this, (Iframe.__proto__ || Object.getPrototypeOf(Iframe)).call(this));

    _this.unsubscribe = _this.unsubscribe.bind(_this);
    _this.linkedSubs = {};
    if (_.isIframe()) {
      rh.model.subscribe(consts('EVT_BEFORE_UNLOAD'), _this.unsubscribe);
      rh.model.subscribe(consts('EVT_UNLOAD'), _this.unsubscribe);
    }
    return _this;
  }

  _createClass(Iframe, [{
    key: 'unsubscribe',
    value: function unsubscribe() {
      if (this.parent) {
        var msg = { id: this.id };
        this.parent.postMessage({ rhmodel_unsubscribe: msg }, '*');
        return this.parent = undefined;
      }
    }
  }, {
    key: 'init',
    value: function init() {
      if (this.id == null) {
        this.id = _.uniqueId();
      }
      this.parent = window.parent;
      if (_.isIframe()) {
        var input = rh.model.get('_sharedkeys.input');
        if (input) {
          var inputKeys = _.map(input, function (item) {
            if (_.isString(item)) {
              return { key: item };
            } else {
              return item;
            }
          });
          var msg = { input: inputKeys, id: this.id };
          this.parent.postMessage({ rhmodel_subscribe: msg }, '*');
        }
        var outputKeys = rh.model.get('_sharedkeys.output');
        if (outputKeys) {
          return this.linkModel(this.parent, this.id, outputKeys);
        }
      }
    }
  }, {
    key: 'clean',
    value: function clean(id) {
      var subs = this.linkedSubs[id];
      if (subs) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(subs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var unsub = _step.value;
            unsub();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return delete this.linkedSubs[id];
      }
    }
  }, {
    key: 'linkModel',
    value: function linkModel(source, id, keys) {
      var _this2 = this;

      if (keys == null) {
        keys = [];
      }
      var subs = [];
      var callback = function callback(value, key) {
        return _this2.guard(function () {
          var msg = {};msg[key] = value;
          return source.postMessage({ rhmodel_publish: msg }, '*');
        }, id);
      };
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.from(keys)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          key = key.trim();
          subs.push(rh.model.subscribe(key, callback));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.clean(id);
      return this.linkedSubs[id] = subs;
    }
  }, {
    key: 'publish',
    value: function publish(key, value, opts) {
      if (opts == null) {
        opts = {};
      }
      return this.guard(function () {
        return rh.model.publish(key, value, opts);
      });
    }
  }, {
    key: 'guard',
    value: function guard(fn, guardName) {
      if (guardName == null) {
        guardName = this.id;
      }
      return _get(Iframe.prototype.__proto__ || Object.getPrototypeOf(Iframe.prototype), 'guard', this).call(this, fn, guardName);
    }
  }]);

  return Iframe;
}(rh.Guard);

rh.iframe = new Iframe();

},{}],9:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;


var head = $('head', 0);
var style = document.createElement('style');
style.innerHTML = '.rh-hide:not(.rh-animate){display:none !important;}';
head.insertBefore(style, head.childNodes[0]);

_.addEventListener(document, 'DOMContentLoaded', _.one(function () {
  if (rh._debug) {
    if (rh.console == null) {
      rh.console = new rh.Console();
    }
  }

  rh.model.publish(consts('EVT_WIDGET_BEFORELOAD'), true, { sync: true });

  _.loadWidgets(document);

  _.loadContentFilter(document);

  return rh.model.publish(consts('EVT_WIDGET_LOADED'), true, { sync: true });
}));

if (_.isIframe()) {
  _.addEventListener(window, 'beforeunload', function () {
    rh.model.publish(consts('EVT_BEFORE_UNLOAD'), true, { sync: true });
    return undefined;
  });

  _.addEventListener(window, 'unload', function (event) {
    rh.model.publish(consts('EVT_UNLOAD'), true, { sync: true });
    return undefined;
  });
}

},{}],10:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;


_.addEventListener(window, 'message', function (e) {
  var config = void 0,
      key = void 0;
  if (!_.isSameOrigin(e.origin)) {
    return;
  }

  var data = e.data;

  if (!_.isObject(data)) {
    return;
  }

  if (data.rhmodel_publish) {
    config = data.rhmodel_publish;
    if (config) {
      for (key in config) {
        var value = config[key];rh.iframe.publish(key, value, { sync: true });
      }
    }
  }

  if (data.rhmodel_subscribe) {
    config = data.rhmodel_subscribe;
    var input = config.input || [];
    var topContainer = !rh.model.get('_sharedkeys.input');
    var keys = _.reduce(input, function (result, item) {
      if (topContainer || item.nested !== false) {
        result.push(item.key);
      }
      return result;
    }, []);
    if (keys != null ? keys.length : undefined) {
      rh.iframe.linkModel(e.source, config.id, keys);
    }
  }

  if (data.rhmodel_unsubscribe) {
    config = data.rhmodel_unsubscribe;
    return rh.iframe.clean(config.id);
  }
});

},{}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var consts = rh.consts;

// ChildNode private class for Model

var ChildNode = function () {
  function ChildNode(subscribers, children) {
    _classCallCheck(this, ChildNode);

    if (subscribers == null) {
      subscribers = [];
    }
    this.subscribers = subscribers;
    if (children == null) {
      children = {};
    }
    this.children = children;
  }

  // TODO: add key.* support in get


  _createClass(ChildNode, [{
    key: 'getSubscribers',
    value: function getSubscribers(keys, path, value, subs) {
      if (keys.length > 1) {
        var child = void 0;
        subs.push({ fnsInfo: this.subscribers, key: path, value: value });
        var childKey = keys[1];
        if (child = this.children[childKey]) {
          var newPath = path + '.' + childKey;
          child.getSubscribers(keys.slice(1), newPath, value != null ? value[childKey] : undefined, subs);
        }
      } else if (keys.length > 0) {
        this._getAllChildSubscribers(path, value, subs);
      }
      return subs;
    }
  }, {
    key: 'addSubscribers',
    value: function addSubscribers(fn, keys, opts) {
      if (keys.length === 1) {
        return this.subscribers.push([fn, opts]);
      } else if (keys.length > 1) {
        var childKey = keys[1];
        if (this.children[childKey] == null) {
          this.children[childKey] = new ChildNode();
        }
        return this.children[childKey].addSubscribers(fn, keys.slice(1), opts);
      }
    }
  }, {
    key: 'removeSubscriber',
    value: function removeSubscriber(fn, keys) {
      if (keys.length === 1) {
        return this._deleteSubscriber(fn);
      } else if (keys.length > 1) {
        return this.children[keys[1]].removeSubscriber(fn, keys.slice(1));
      }
    }
  }, {
    key: '_deleteSubscriber',
    value: function _deleteSubscriber(fn) {
      var index = _.findIndex(this.subscribers, function (item) {
        return item[0] === fn;
      });
      if (index != null && index !== -1) {
        return this.subscribers.splice(index, 1);
      } else if (rh._debug) {
        return rh._d('error', '_unsubscribe', this + '.{key} is not subscribed with ' + fn);
      }
    }
  }, {
    key: '_getAllChildSubscribers',
    value: function _getAllChildSubscribers(path, value, subs) {
      subs.push({ fnsInfo: this.subscribers, key: path, value: value });
      if (this.children) {
        if (value == null) {
          value = {};
        }
        for (var key in this.children) {
          var child = this.children[key];
          child._getAllChildSubscribers(path + '.' + key, value[key], subs);
        }
      }
      return subs;
    }
  }]);

  return ChildNode;
}();

//RootNode prive class for Model


var RootNode = function (_ChildNode) {
  _inherits(RootNode, _ChildNode);

  function RootNode(subscribers, children, data) {
    var _this;

    _classCallCheck(this, RootNode);

    var _this = _possibleConstructorReturn(this, (RootNode.__proto__ || Object.getPrototypeOf(RootNode)).call(this));

    _this.subscribers = subscribers;
    _this.children = children;
    if (data == null) {
      data = {};
    }
    _this.data = data;
    return _this = _possibleConstructorReturn(this, (RootNode.__proto__ || Object.getPrototypeOf(RootNode)).call(this, _this.subscribers, _this.childs));
  }

  _createClass(RootNode, [{
    key: 'getSubscribers',
    value: function getSubscribers(keys) {
      var childKey = keys[0];
      var child = this.children[childKey];
      if (child) {
        return child.getSubscribers(keys, '' + keys[0], this.data[keys[0]], []);
      } else {
        return [];
      }
    }
  }, {
    key: 'addSubscribers',
    value: function addSubscribers(fn, keys, opts) {
      var childKey = keys[0];
      if (this.children[childKey] == null) {
        this.children[childKey] = new ChildNode();
      }
      return this.children[childKey].addSubscribers(fn, keys, opts);
    }
  }, {
    key: 'removeSubscriber',
    value: function removeSubscriber(fn, keys) {
      var childKey = keys[0];
      return this.children[childKey] != null ? this.children[childKey].removeSubscriber(fn, keys) : undefined;
    }
  }, {
    key: 'getData',
    value: function getData(keys) {
      var value = void 0;
      var data = this.data;

      for (var index = 0; index < keys.length; index++) {
        var key = keys[index];
        if (_.isDefined(data)) {
          if (index === keys.length - 1) {
            value = data[key];
          } else {
            data = data[key];
          }
        } else {
          break;
        }
      }
      return value;
    }
  }, {
    key: 'setData',
    value: function setData(keys, value) {
      //a.b a.*
      var data = this.data;

      for (var index = 0; index < keys.length; index++) {
        var key = keys[index];
        if (index === keys.length - 1) {
          data[key] = value;
        } else {
          if (!_.isDefined(data[key])) {
            data[key] = {};
          }
          data = data[key];
        }
      }
    }
  }]);

  return RootNode;
}(ChildNode);

// Model class to read write local data using publish subscribe pattern


var Model = function () {
  var _count = undefined;
  Model = function () {
    _createClass(Model, [{
      key: 'toString',
      value: function toString() {
        return 'Model_' + this._count;
      }
    }], [{
      key: 'initClass',
      value: function initClass() {

        // private static variable
        _count = 0;
      }
    }]);

    function Model() {
      _classCallCheck(this, Model);

      this._rootNode = new RootNode();

      this._count = _count;
      _count += 1;
    }

    _createClass(Model, [{
      key: 'get',
      value: function get(key) {
        var value = void 0;
        if (this._isForGlobal(key)) {
          return rh.model.get(key);
        }

        if (_.isString(key)) {
          value = this._rootNode.getData(this._getKeys(key));
        } else {
          rh._d('error', 'Get', this + '.' + key + ' is not a string');
        }

        if (rh._debug) {
          rh._d('log', 'Get', this + '.' + key + ': ' + JSON.stringify(value));
        }

        return value;
      }
    }, {
      key: 'cget',
      value: function cget(key) {
        return this.get(consts(key));
      }

      // TODO: add options to detect change then only trigger the event

    }, {
      key: 'publish',
      value: function publish(key, value, opts) {
        var _this2 = this;

        if (opts == null) {
          opts = {};
        }
        if (this._isForGlobal(key)) {
          return rh.model.publish(key, value, opts);
        }
        if (rh._debug) {
          rh._d('log', 'Publish', this + '.' + key + ': ' + JSON.stringify(value));
        }
        if (_.isString(key)) {
          this._rootNode.setData(this._getKeys(key), value);
          var subs = this._rootNode.getSubscribers(this._getKeys(key));
          var keyLength = key[0] === '.' ? key.length - 1 : key.length;
          var filteredSubs = _.map(subs, function (sub) {
            var fnsInfo = _.filter(sub.fnsInfo, function (fnInfo) {
              return _.isDefined(fnInfo[0]) && (fnInfo[1].partial !== false || sub.key.length >= keyLength);
            });
            return {
              key: sub.key,
              value: sub.value,
              fns: _.map(fnsInfo, function (fnInfo) {
                return fnInfo[0];
              })
            };
          });

          _.each(filteredSubs, function (sub) {
            return _.each(sub.fns, function (fn) {
              if (rh._debug) {
                rh._d('log', 'Publish call', _this2 + '.' + sub.key + ': ' + JSON.stringify(sub.value));
              }
              var unsub = function unsub() {
                return _this2._unsubscribe(sub.key, fn);
              };
              if (opts.sync) {
                return fn(sub.value, sub.key, unsub);
              } else {
                return rh._.defer(fn, sub.value, sub.key, unsub);
              }
            });
          });
        } else {
          rh._d('error', 'Publish', this + '.' + key + ' is not a string');
        }
      }
    }, {
      key: 'cpublish',
      value: function cpublish(key, value, opts) {
        return this.publish(consts(key), value, opts);
      }
    }, {
      key: 'isSubscribed',
      value: function isSubscribed(key) {
        var found = void 0;
        if (this._isForGlobal(key)) {
          return rh.model.isSubscribed(key);
        }
        if (key[0] === '.') {
          key = key.substring(1);
        }
        var subs = this._rootNode.getSubscribers(this._getKeys(key));
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(subs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var sub = _step.value;
            if (sub.key === key) {
              found = true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return found === true;
      }
    }, {
      key: 'cisSubscribed',
      value: function cisSubscribed(key) {
        return this.isSubscribed(consts(key));
      }
    }, {
      key: 'subscribeOnce',
      value: function subscribeOnce(key, fn, opts) {
        var _this3 = this;

        if (opts == null) {
          opts = {};
        }
        var keys = _.isString(key) ? [key] : key;
        return this._subscribe(keys.splice(0, 1)[0], function (value, key, unsub) {
          if (keys.length === 0) {
            fn(value, key);
          } else {
            _this3.subscribeOnce(keys, fn, opts);
          }
          return unsub();
        }, opts);
      }
    }, {
      key: 'csubscribeOnce',
      value: function csubscribeOnce(key, fn, opts) {
        return this.subscribeOnce(consts(key), fn, opts);
      }
    }, {
      key: 'subscribe',
      value: function subscribe(key, fn, opts) {
        var _this4 = this;

        if (opts == null) {
          opts = {};
        }
        if (_.isString(key)) {
          return this._subscribe(key, fn, opts);
        } else {
          var unsubs = _.map(key, function (item) {
            return _this4._subscribe(item, fn, opts);
          });
          return function () {
            return _.each(unsubs, function (unsub) {
              return unsub();
            });
          };
        }
      }
    }, {
      key: 'csubscribe',
      value: function csubscribe(key, fn, opts) {
        return this.subscribe(consts(key), fn, opts);
      }
    }, {
      key: '_subscribe',
      value: function _subscribe(key, fn, opts) {
        var _this5 = this;

        if (opts == null) {
          opts = {};
        }
        if (this._isForGlobal(key)) {
          return rh.model.subscribe(key, fn, opts);
        }
        if (rh._debug) {
          rh._d('log', 'Subscribe', this + '.' + key);
        }

        this._rootNode.addSubscribers(fn, this._getKeys(key), opts);
        var value = this._rootNode.getData(this._getKeys(key));
        var unsub = function unsub() {
          return _this5._unsubscribe(key, fn);
        };
        if (opts.forceInit || value != null && !opts.initDone) {
          fn(value, key, unsub);
        }
        return unsub;
      }
    }, {
      key: '_unsubscribe',
      value: function _unsubscribe(key, fn) {
        if (this._isForGlobal(key)) {
          return rh.model._unsubscribe(key);
        }
        if (rh._debug) {
          rh._d('log', '_Unsubscribe', this + '.' + key);
        }
        return this._rootNode.removeSubscriber(fn, this._getKeys(key));
      }
    }, {
      key: 'isGlobal',
      value: function isGlobal() {
        return this === rh.model;
      }
    }, {
      key: 'isGlobalKey',
      value: function isGlobalKey(key) {
        return key && key[0] === '.';
      }
    }, {
      key: '_isForGlobal',
      value: function _isForGlobal(key) {
        return !this.isGlobal() && this.isGlobalKey(key);
      }
    }, {
      key: '_getKeys',
      value: function _getKeys(fullKey) {
        var keys = fullKey.split('.');
        if (keys[0] === '') {
          keys = keys.slice(1);
        } //strip first global key .
        if (rh._debug && keys.length === 0) {
          rh._d('error', 'Model', this + '.' + fullKey + ' is invalid');
        }
        return keys;
      }
    }]);

    return Model;
  }();
  Model.initClass();
  return Model;
}();

//global object
rh.Model = Model;
rh.model = new Model();
rh.model.toString = function () {
  return 'GlobalModel';
};

},{}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var $ = rh.$;
var _ = rh._;

var NodeHolder = function () {
  function NodeHolder(nodes) {
    _classCallCheck(this, NodeHolder);

    this.nodes = nodes;
  }

  _createClass(NodeHolder, [{
    key: 'isVisible',
    value: function isVisible(node) {
      if (node == null) {
        node = this.nodes[0];
      }
      return !$.hasClass(node, 'rh-hide');
    }
  }, {
    key: 'show',
    value: function show() {
      return _.each(this.nodes, function (node) {
        if (!this.isVisible(node)) {
          $.removeClass(node, 'rh-hide');
          return node.hidden = false;
        }
      }, this);
    }
  }, {
    key: 'hide',
    value: function hide() {
      return _.each(this.nodes, function (node) {
        if (this.isVisible(node)) {
          $.addClass(node, 'rh-hide');
          return node.hidden = true;
        }
      }, this);
    }
  }, {
    key: 'accessible',
    value: function accessible(flag) {
      return _.each(this.nodes, function (node) {
        return node.hidden = flag;
      });
    }
  }, {
    key: 'updateClass',
    value: function updateClass(newClasses) {
      if (this.oldClasses == null) {
        this.oldClasses = [];
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.from(this.nodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Array.from(this.oldClasses)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var className = _step2.value;
              $.removeClass(node, className);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = Array.from(newClasses)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              className = _step3.value;

              if (className.length > 0) {
                $.addClass(node, className);
                this.oldClasses.push(className);
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'updateNodes',
    value: function updateNodes(newNodes) {
      var firstNode = this.nodes[0];
      var parentNode = firstNode.parentNode;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = Array.from(newNodes)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var node = _step4.value;
          parentNode.insertBefore(node, firstNode);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Array.from(this.nodes)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          node = _step5.value;
          parentNode.removeChild(node);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return this.nodes = newNodes;
    }
  }]);

  return NodeHolder;
}();

rh.NodeHolder = NodeHolder;

},{}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;

var Plugin = function () {
  function Plugin() {
    _classCallCheck(this, Plugin);
  }

  _createClass(Plugin, [{
    key: 'attachOwner',
    value: function attachOwner(obj) {
      if (this._ownerFns == null) {
        this._ownerFns = {};
      }
      if (this.hasOwner()) {
        this.detach(this.owner);
      }
      this.owner = obj;
      if (this._overrideNames) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(this._overrideNames)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var fnName = _step.value;
            this._overrideOwnerFn(fnName);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return this.ownerIsChanged();
    }
  }, {
    key: 'detachOwner',
    value: function detachOwner() {
      if (this.hasOwner()) {
        if (this._ownerFns) {
          for (var fnName in this._ownerFns) {
            this._restoreOwnerFn(fnName);
          }
        }
        this.owner = null;
        this._ownerFns = {};
        return this.ownerIsChanged();
      }
    }

    // plugin should override this method to get the notification of owoner change

  }, {
    key: 'ownerIsChanged',
    value: function ownerIsChanged() {}
  }, {
    key: 'hasOwner',
    value: function hasOwner() {
      return this.owner != null;
    }
  }, {
    key: 'addOverrides',
    value: function addOverrides(fnNames) {
      var _this = this;

      if (this._overrideNames == null) {
        this._overrideNames = [];
      }
      return function () {
        var result = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Array.from(fnNames)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var fnName = _step2.value;

            _this._overrideNames.push(fnName);
            result.push(_this._overrideOwnerFn(fnName));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return result;
      }();
    }
  }, {
    key: 'removeOverrides',
    value: function removeOverrides(fnNames) {
      var _this2 = this;

      return function () {
        var result = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Array.from(fnNames)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var fnName = _step3.value;

            _this2._restoreOwnerFn(fnName);
            var index = _this2._overrideNames.indexOf(fnName);
            if (index > -1) {
              result.push(_this2._overrideNames.splice(index, 1));
            } else {
              result.push(undefined);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return result;
      }();
    }
  }, {
    key: '_overrideOwnerFn',
    value: function _overrideOwnerFn(fnName) {
      if (this.hasOwner()) {
        var ownerFn = this.owner[fnName];
        this._ownerFns[fnName] = ownerFn;
        return this.owner[fnName] = function () {
          var _this3 = this;

          var args = [];var i = -1;
          while (++i < arguments.length) {
            args.push(arguments[i]);
          }
          var bindedFn = function bindedFn(newArgs) {
            return __guardMethod__(ownerFn, 'apply', function (o) {
              return o.apply(_this3.owner, newArgs);
            });
          };
          return this[fnName](bindedFn, args);
        }.bind(this);
      }
    }
  }, {
    key: '_restoreOwnerFn',
    value: function _restoreOwnerFn(fnName) {
      if (this.hasOwner()) {
        this.owner[fnName] = this._ownerFns[fnName];
        return delete this._ownerFns[fnName];
      }
    }
  }]);

  return Plugin;
}();

rh.Plugin = Plugin;

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

},{}],14:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;


var $ = rh.$ = function (selector, index) {
  if (index != null && index === 0) {
    return document.querySelector(selector);
  } else {
    var nodeList = document.querySelectorAll(selector);
    if (index != null && index < nodeList.length) {
      return nodeList[index];
    } else {
      return nodeList;
    }
  }
};

//arguments
// (parent, selector) ->
// or (selector) ->
$.find = function () {
  var parent = void 0,
      selector = void 0;
  if (arguments.length > 1) {
    parent = arguments[0];
    selector = arguments[1];
  } else {
    parent = document;
    selector = arguments[0];
  }
  return parent.querySelectorAll(selector);
};

$.traverseNode = function (node, preChild, postChild, onChild, context) {
  if (context == null) {
    context = window;
  }
  if (preChild && preChild.call(context, node)) {
    $.eachChildNode(node, function (child) {
      if (!onChild || onChild.call(context, child)) {
        return $.traverseNode(child, preChild, postChild, onChild, context);
      }
    });
    if (postChild) {
      postChild.call(context, node);
    }
  }
  return node;
};

$.eachChildNode = function (parent, fn, context) {
  if (context == null) {
    context = window;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Array.from(parent.children)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var child = _step.value;
      fn.call(context, child);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

$.eachChild = function (parent, selector, fn, context) {
  if (context == null) {
    context = window;
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Array.from(this.find(parent, selector))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var node = _step2.value;

      fn.call(context, node);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
};

$.eachDataNode = function (parent, dataAttr, fn, context) {
  if (context == null) {
    context = window;
  }
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = Array.from(this.find(parent, '[data-' + dataAttr + ']'))[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var node = _step3.value;

      fn.call(context, node, $.dataset(node, dataAttr));
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

$.eachAttributes = function (node, fn, context) {
  var infos = Array.from(node.attributes).map(function (attr) {
    return [attr.specified, attr.name, attr.value];
  });
  var i = -1;
  while (++i < infos.length) {
    //here length can be increased in between
    var info = infos[i];
    if (info[0] !== false) {
      fn.call(context || window, info[1], info[2], infos);
    }
  }
};

$.getAttribute = function (node, attrName) {
  if (node.getAttribute != null) {
    return node.getAttribute(attrName);
  }
};

$.setAttribute = function (node, attrName, value) {
  if (node.setAttribute != null) {
    return node.setAttribute(attrName, value);
  }
};

$.removeAttribute = function (node, attrName) {
  if (node.removeAttribute != null) {
    return node.removeAttribute(attrName);
  }
};

$.hasAttribute = function (node, attrName) {
  if (node.hasAttribute != null) {
    return node.hasAttribute(attrName);
  } else {
    return false;
  }
};

$.dataset = function (node, attrName, value) {
  if (arguments.length === 3) {
    if (value !== null) {
      return $.setAttribute(node, 'data-' + attrName, value);
    } else {
      return $.removeAttribute(node, 'data-' + attrName);
    }
  } else {
    return $.getAttribute(node, 'data-' + attrName);
  }
};

$.isDescendent = function (parent, child) {
  var node = child.parentNode;
  while (true) {
    if (!node || node === parent) {
      break;
    }
    node = node.parentNode;
  }
  return node === parent;
};

$.addClass = function (node, className) {
  if (node.classList != null) {
    return node.classList.add(className);
  } else {
    return node.className = node.className + ' ' + className;
  }
};

$.removeClass = function (node, className) {
  if (node.classList != null) {
    return node.classList.remove(className);
  } else {
    return node.className = node.className.replace(className, '');
  }
};

$.hasClass = function (node, className) {
  if (node.classList != null) {
    return node.classList.contains(className);
  } else if (node.className) {
    return node.className.match(new RegExp(className + '($| )')) !== null;
  }
};

$.toggleClass = function (node, className) {
  if ($.hasClass(node, className)) {
    return $.removeClass(node, className);
  } else {
    return $.addClass(node, className);
  }
};

$.computedStyle = function (node) {
  return node.currentStyle || window.getComputedStyle(node, null);
};

$.isVisibleNode = function (node) {
  var computedStyle = $.computedStyle(node);
  return 'none' !== computedStyle['display'] && !_.isZeroCSSValue(computedStyle['opacity']) && !_.isZeroCSSValue(computedStyle['max-height']);
};

$.textContent = function (node, content) {
  if (arguments.length === 2) {
    if (node.textContent != null) {
      return node.textContent = content;
    } else {
      return node.innerText = content;
    }
  } else {
    return node.textContent || node.innerText;
  }
};

$.innerHTML = function (node, content) {
  if (arguments.length === 2) {
    return node.innerHTML = content;
  } else {
    return node.innerHTML;
  }
};

$.css = function (node, styleName, value) {
  if (arguments.length === 3) {
    return node.style[styleName] = value;
  } else {
    return node.style[styleName];
  }
};

$.nodeName = function (node) {
  return node.nodeName;
};

$.pageHeight = function () {
  var height = void 0;
  var de = document.documentElement;
  if (de) {
    height = de.scrollHeight || de.clientHeight || de.offsetHeight;
  }
  if (!height) {
    height = window.innerHeight;
  }
  var _document = document,
      body = _document.body;

  var bodyHeight = body.scrollHeight || body.clientHeight || body.offsetHeight;
  height = Math.max(height, bodyHeight);
  return height + 'px';
};

$.createElement = function (tag, innerHtml) {
  var tagNode = document.createElement(tag);
  tagNode.innerHTML = innerHtml;
  return tagNode;
};

},{}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var consts = rh.consts;
var model = rh.model;

var Responsive = function () {
  _createClass(Responsive, [{
    key: 'toString',
    value: function toString() {
      return 'Responsive';
    }
  }]);

  function Responsive() {
    var _this = this;

    _classCallCheck(this, Responsive);

    this.subs = [];
    model.subscribe(consts('EVT_ORIENTATION_CHANGE'), function () {
      return _.each(_this.subs, function (sub) {
        return sub.eventHandler(sub.mql);
      });
    });

    if (rh._debug && !this.isSupported()) {
      rh._d('error', 'Browser Issue', 'matchMedia is not supported.');
    }
  }

  _createClass(Responsive, [{
    key: 'isSupported',
    value: function isSupported() {
      return window.matchMedia != null;
    }
  }, {
    key: 'attach',
    value: function attach(media_query, onFn, offFn) {
      if (this.isSupported) {
        var mql = window.matchMedia(media_query);
        var eventHandler = function eventHandler(mql) {
          if (mql.matches) {
            return onFn();
          } else {
            return offFn();
          }
        };
        eventHandler(mql);
        mql.addListener(eventHandler);
        return this.subs.push({ mql: mql, on: onFn, off: offFn, eventHandler: eventHandler });
      }
    }
  }, {
    key: 'detach',
    value: function detach(media_query, onFn, offFn) {
      for (var index = 0; index < this.subs.length; index++) {
        var sub = this.subs[index];
        if (sub.mql.media === media_query && sub.on === onFn && sub.off === offFn) {
          sub.mql.removeListener(sub.eventHandler);
          this.subs.splice(index);
          break;
        }
      }
    }
  }]);

  return Responsive;
}();

rh.responsive = new Responsive();

},{}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var model = rh.model;
var http = rh.http;

var formdata = rh.formData;

var RoboHelpServer = function () {
  _createClass(RoboHelpServer, [{
    key: 'toString',
    value: function toString() {
      return 'RoboHelpServer';
    }
  }]);

  function RoboHelpServer() {
    _classCallCheck(this, RoboHelpServer);
  }

  _createClass(RoboHelpServer, [{
    key: 'area',
    value: function area() {
      return _.urlParam('area', _.extractParamString());
    }
  }, {
    key: 'type',
    value: function type() {
      return _.urlParam('type', _.extractParamString());
    }
  }, {
    key: 'project',
    value: function project() {
      return _.urlParam('project', _.extractParamString());
    }
  }, {
    key: 'logTopicView',
    value: function logTopicView(topic) {
      var _this = this;

      return model.subscribe(consts('EVT_PROJECT_LOADED'), function () {
        var baseUrl = model.get(consts('KEY_PUBLISH_BASE_URL'));
        var parentPath = _.parentPath(_.filePath(_.getRootUrl()));
        var tpcUrl = _.isRelativeUrl(topic) ? parentPath + topic : topic;
        if (baseUrl && !_.isEmptyString(baseUrl)) {
          var hashString = _.mapToEncodedString(_.extend(consts('RHS_LOG_TOPIC_VIEW'), { area: _this.area(), tpc: _.filePath(tpcUrl) }));
          return http.get(baseUrl + '?' + hashString);
        }
      });
    }
  }, {
    key: 'preSearch',
    value: function preSearch() {
      var hashString = void 0;
      var searchText = model.get(consts('KEY_SEARCH_TERM'));
      if (searchText && !_.isEmptyString(searchText)) {
        hashString = _.mapToEncodedString(_.extend(consts('RHS_DO_SEARCH'), _.addPathNameKey({
          area: this.area(), type: this.type(), project: this.project(), quesn: searchText,
          oldquesn: '', quesnsyn: ''
        })));

        model.publish(consts('KEY_SEARCHED_TERM'), searchText);
        model.publish(consts('EVT_SEARCH_IN_PROGRESS'), true);
        model.publish(consts('KEY_SEARCH_PROGRESS'), 0);
      }

      return { searchText: searchText, hashString: hashString };
    }
  }, {
    key: 'postSearch',
    value: function postSearch(searchText, resultsText) {
      var searchResults = JSON.parse(resultsText);
      if (searchResults && searchResults.clientIndex) {
        var hashString = _.mapToEncodedString(_.addPathNameKey({ area: this.area(), type: this.type(),
          project: this.project(), quesn: searchText, cmd: 'clientindex' }));
        model.subscribeOnce(consts('KEY_SEARCH_RESULTS'), function (data) {
          var baseUrl = model.get(consts('KEY_PUBLISH_BASE_URL'));
          return http.post(baseUrl + '?' + hashString, JSON.stringify(data), { 'Content-type': 'application/json' }).error(function () {
            var result = void 0;
            return result = false;
          }).success(function () {
            var result = void 0;
            return result = true;
          });
        }, { initDone: true });
        return window.doSearch();
      }
      model.publish(consts('EVT_SEARCH_IN_PROGRESS'), false);
      model.publish(consts('KEY_SEARCH_PROGRESS'), null);

      if (searchResults) {
        var searchTopics = searchResults.topics;
        if (searchTopics && searchTopics.length > 0) {
          window.setResultsStringHTML(searchTopics.length, window._textToHtml_nonbsp(searchText));
        }

        var resultsParams = '?' + _.mapToEncodedString(_.extend({ rhhlterm: searchText }, { rhsyns: searchResults.syns }));

        model.publish(consts('KEY_SEARCH_RESULT_PARAMS'), resultsParams);
        model.publish(consts('KEY_SEARCH_RESULTS'), searchTopics);
      }

      if (!searchResults || !(searchResults.topics != null ? searchResults.topics.length : undefined)) {
        return window.displayMsg(window.gsNoTopics);
      }
    }
  }, {
    key: 'doSearch',
    value: function doSearch() {
      var _this2 = this;

      var result = model.get(consts('KEY_PUBLISH_MODE'));
      var baseUrl = model.get(consts('KEY_PUBLISH_BASE_URL'));
      if (baseUrl && !_.isEmptyString(baseUrl)) {
        var _preSearch = this.preSearch(),
            searchText = _preSearch.searchText,
            hashString = _preSearch.hashString;

        http.get(baseUrl + '?' + hashString).error(function () {
          return result = false;
        }).success(function (resultsText) {
          _this2.postSearch(searchText, resultsText);
          return result = true;
        });
      }
      return result;
    }
  }]);

  return RoboHelpServer;
}();

rh.rhs = new RoboHelpServer();

},{}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var consts = rh.consts;
var model = rh.model;


var defaultScreens = {
  desktop: {
    media_query: 'screen and (min-width: 1296px)'
  },
  tablet: {
    media_query: 'screen and (min-width: 942px) and (max-width: 1295px)'
  },
  phone: {
    media_query: 'screen and (max-width: 941px)'
  },
  ios: {
    user_agent: /(iPad|iPhone|iPod)/g
  },
  ipad: {
    user_agent: /(iPad)/g
  },
  print: {
    media_query: 'print'
  }
};

var Screen = function () {
  _createClass(Screen, [{
    key: 'attachedKey',
    value: function attachedKey(name) {
      return consts('KEY_SCREEN') + '.' + name + '.attached';
    }
  }]);

  function Screen() {
    _classCallCheck(this, Screen);

    this.subscribeScreen = this.subscribeScreen.bind(this);
    this.onScreen = this.onScreen.bind(this);
    this.offScreen = this.offScreen.bind(this);
    var data = _.extend({}, defaultScreens, model.get(consts('KEY_SCREEN')));
    if (data) {
      _.each(data, this.subscribeScreen);
    }
  }

  _createClass(Screen, [{
    key: 'subscribeScreen',
    value: function subscribeScreen(info, name) {
      var _this = this;

      if (info.user_agent && !window.navigator.userAgent.match(_.toRegExp(info.user_agent))) {
        return this.offScreen(name);
      } else if (info.media_query) {
        if (rh.responsive.isSupported()) {
          return rh.responsive.attach(info.media_query, function () {
            return _this.onScreen(name);
          }, function () {
            return _this.offScreen(name);
          });
        } else if (name === model.get(consts('KEY_DEFAULT_SCREEN'))) {
          return this.onScreen(name);
        } else {
          return this.offScreen(name);
        }
      } else {
        return this.onScreen(name);
      }
    }
  }, {
    key: 'onScreen',
    value: function onScreen(name) {
      var key = this.attachedKey(name);
      return model.publish(key, true);
    }
  }, {
    key: 'offScreen',
    value: function offScreen(name) {
      var key = this.attachedKey(name);
      if (false !== model.get(key)) {
        return model.publish(key, false);
      }
    }
  }]);

  return Screen;
}();

model.subscribe(consts('EVT_WIDGET_BEFORELOAD'), function () {
  var screen = null;
  return function () {
    return screen != null ? screen : screen = new Screen();
  };
}());

model.publish(consts('KEY_SCREEN_NAMES'), ['desktop', 'tablet', 'phone']);
model.publish(consts('KEY_SCREEN'), defaultScreens);
model.publish(consts('KEY_DEFAULT_SCREEN'), 'phone');

},{}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;

// Storage class to persist key value pairs to localDB/cookies

var Storage = function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }

  _createClass(Storage, [{
    key: 'toString',
    value: function toString() {
      return 'Storage';
    }
  }, {
    key: 'init',
    value: function init(namespace) {
      if (this.namespace) {
        if (rh._debug && this.namespace !== namespace) {
          return rh._d('error', 'Storage', 'Namespace cann\'t be changed');
        }
      } else {
        var jsonString = void 0;
        this.namespace = namespace;
        if (_.canUseLocalDB()) {
          jsonString = localStorage.getItem(this.namespace);
        } else {
          var rawData = _.explodeAndMap(document.cookie, ';', '=');
          if (rawData[this.namespace]) {
            jsonString = unescape(rawData[this.namespace]);
          }
        }
        return this.storageMap = jsonString ? JSON.parse(jsonString) : {};
      }
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      if (rh._debug && !this.storageMap) {
        rh._d('error', 'Storage', 'Namespace is not set yet.');
      }
      return this.storageMap != null;
    }
  }, {
    key: 'persist',
    value: function persist(key, value) {
      if (this.isValid()) {
        this.storageMap[key] = value;
        return this.dump();
      }
    }
  }, {
    key: 'fetch',
    value: function fetch(key) {
      if (this.isValid()) {
        return this.storageMap[key];
      }
    }
  }, {
    key: 'dump',
    value: function dump() {
      if (this.isValid()) {
        if (_.canUseLocalDB()) {
          return localStorage.setItem(this.namespace, JSON.stringify(this.storageMap));
        } else {
          return document.cookie = this.namespace + '=' + escape(JSON.stringify(this.storageMap));
        }
      }
    }
  }]);

  return Storage;
}();

rh.Storage = Storage;
rh.storage = new Storage();

},{}],19:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;

//Widget class for any custom behavior on dom node

var Widget = function () {
  var _count = undefined;
  Widget = function (_rh$Guard) {
    _inherits(Widget, _rh$Guard);

    _createClass(Widget, [{
      key: 'toString',
      value: function toString() {
        return this.constructor.name + '_' + this._count;
      }
    }, {
      key: 'mapDataAttrMethods',
      value: function mapDataAttrMethods(attrs) {
        return _.reduce(attrs, function (map, value) {
          map['data-' + value] = 'data_' + value;
          return map;
        }, {});
      }
    }], [{
      key: 'initClass',
      value: function initClass() {

        //private static variable
        _count = 0;

        this.prototype.dataAttrs = ['repeat', 'init', 'stext', 'shtml', 'controller', 'class', 'animate', 'css', 'attr', 'value', 'checked', 'html', 'text', 'if', 'hidden', 'keydown', 'keyup', 'scroll', 'change', 'toggle', 'toggleclass', 'method', 'trigger', 'click', 'load', 'mouseover', 'mouseout', 'focus', 'blur', 'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'screenvar'];

        this.prototype.dataAttrMethods = function () {
          return Widget.prototype.mapDataAttrMethods(Widget.prototype.dataAttrs);
        }();

        //all list/data-reapeat items data-i attribute are support
        //this is the list of special list item attribute.
        //That means attributes like data-ihref, data-iid etc will
        // be supported without listing here.
        this.prototype.dataIAttrs = ['itext', 'ihtml', 'iclass', 'irepeat'];
        this.prototype.dataIAttrMethods = function () {
          return Widget.prototype.mapDataAttrMethods(Widget.prototype.dataIAttrs);
        }();

        this.prototype.supportedArgs = ['node', 'model', 'key', 'user_vars', 'templateExpr', 'include'];

        this.prototype.resolveEventRawExpr = _.memoize(function (rawExpr) {
          var _$resolveExprOptions = _.resolveExprOptions(rawExpr),
              expr = _$resolveExprOptions.expr,
              opts = _$resolveExprOptions.opts;

          expr = this.patchRawExpr(expr, opts);
          var exprFn = this._function('event, node', expr);
          var callback = _.safeExec(exprFn);
          callback = _.applyCallbackOptions(callback, opts);
          return { callback: callback, opts: opts };
        });

        this.prototype.resolveRawExprWithValue = _.memoize(function (rawExpr) {
          var keys = [];

          var _$resolveExprOptions2 = _.resolveExprOptions(rawExpr),
              expr = _$resolveExprOptions2.expr,
              opts = _$resolveExprOptions2.opts;

          expr = this.patchRawExpr(expr, opts);
          var exprFn = this._evalFunction('', expr, keys);
          var callback = _.safeExec(exprFn);
          callback = _.applyCallbackOptions(callback, opts);
          return { callback: callback, keys: keys, opts: opts };
        });

        //######### Heleper function to create functions in widget #################
        this.prototype.resolveExpression = _.memoize(function (expr) {
          var keys = [];
          return {
            expr: _.resolveModelKeys(_.resolveNamedVar(expr), keys),
            keys: keys
          };
        });

        this.prototype._safeFunction = _.memoize(function (arg, expr) {
          var fn = void 0;
          try {
            fn = new Function(arg, expr);
          } catch (error) {
            fn = function fn() {};
            if (rh._debug) {
              rh._d('error', 'Expression: ' + expr, error.message);
            }
          }
          return fn;
        });

        this.prototype._eventCallBackData = {};

        this.prototype.resolveAttr = function () {
          var cache = {};
          return function (attrsData) {
            var props = cache[attrsData];
            if (props == null) {
              props = _.resolveAttr(attrsData);
              cache[attrsData] = props;
            }
            return props;
          };
        }();

        /*
         * Toggle model variable on click
         * Example: data-toggle='showhide'
         *          data-toggle='showLeftBar:true'
         *          data-toggle='showLeftBar:true;showRightBar:false'
         */
        this.prototype._toggleData = {};

        /*
         * Example: data-load='test.js'
         *          data-load='test.js:key'
         */
        this.prototype._loadData = {};
      }
    }]);

    function Widget(opts) {
      _classCallCheck(this, Widget);

      var _this = _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).call(this));

      _this.reRender = _this.reRender.bind(_this);
      _count += 1;
      _this._count = _count;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.from(_this.supportedArgs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;
          if (opts[key]) {
            _this[key] = opts[key];
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (_this.templateExpr || _this.include) {
        _this.useTemplate = true;
      }
      _this.parseOpts(opts);
      if (!_this.node) {
        rh._d('error', 'constructor', _this + ' does not have a node');
      }
      return _this;
    }

    _createClass(Widget, [{
      key: 'destruct',
      value: function destruct() {
        this.resetContent();
        if (this._subscriptions) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Array.from(this._subscriptions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var unsub = _step2.value;
              unsub();
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
        this._subscriptions = [];
        delete this.model;
        return delete this.controllers;
      }
    }, {
      key: 'parseOpts',
      value: function parseOpts(opts) {
        this.opts = opts;
        if (opts.arg) {
          this.key = opts.arg;
        }
        return this.parsePipedArg();
      }
    }, {
      key: 'parsePipedArg',
      value: function parsePipedArg() {
        var args = this.opts.pipedArgs;
        if (args != null ? args.shift : undefined) {
          //first piped argument is default Model
          return this.modelArgs = _.resolveNiceJSON(args.shift());
        }
      }
    }, {
      key: 'get',
      value: function get(key) {
        if (this.model == null) {
          this.model = new rh.Model();
        }
        return this.model.get(key);
      }
    }, {
      key: 'publish',
      value: function publish(key, value, opts) {
        if (this.model == null) {
          this.model = new rh.Model();
        }
        return this.model.publish(key, value, opts);
      }
    }, {
      key: 'subscribe',
      value: function subscribe(key, fn, opts) {
        if (key == null) {
          return;
        }
        if (this.model == null) {
          this.model = new rh.Model();
        }
        var unsub = this.model.subscribe(key, fn, opts);
        if (this.model.isGlobal() || this.model.isGlobal(key)) {
          unsub = this.storeSubscribe(unsub);
        }
        return unsub;
      }
    }, {
      key: 'subscribeOnly',
      value: function subscribeOnly(key, fn, opts) {
        if (opts == null) {
          opts = {};
        }
        opts['initDone'] = true;
        return this.subscribe(key, fn, opts);
      }
    }, {
      key: 'storeSubscribe',
      value: function storeSubscribe(unsub) {
        var _this2 = this;

        if (this._subscriptions == null) {
          this._subscriptions = [];
        }
        var newUnsub = function newUnsub() {
          var index = _this2._subscriptions.indexOf(newUnsub);
          if (index != null && index !== -1) {
            _this2._subscriptions.splice(index, 1);
          }
          return unsub();
        };
        this._subscriptions.push(newUnsub);
        return newUnsub;
      }

      /*
       * data-if="@sidebar_open | screen: desktop"
       * data-if="@screen.desktop.attached === true && @sidebar_open"
       */

    }, {
      key: 'patchScreenOptions',
      value: function patchScreenOptions(expr, screen) {
        var names = _.isString(screen) ? [screen] : screen;
        var screenExpr = _.map(names, function (name) {
          return '@' + consts('KEY_SCREEN') + '.' + name + '.attached';
        }).join(' || ');
        if (screenExpr) {
          return screenExpr + ' ? (' + expr + ') : null';
        } else {
          return expr;
        }
      }
    }, {
      key: 'patchDirOptions',
      value: function patchDirOptions(expr, dir) {
        return '@' + consts('KEY_DIR') + ' == \'' + dir + '\' ? (' + expr + ') : null';
      }
    }, {
      key: 'patchRawExprOptions',
      value: function patchRawExprOptions(expr, opts) {
        if (opts.screen) {
          expr = this.patchScreenOptions(expr, opts.screen);
        }
        if (opts.dir != null) {
          expr = this.patchDirOptions(expr, opts.dir);
        }
        return expr;
      }
    }, {
      key: 'patchRawExpr',
      value: function patchRawExpr(expr, opts) {
        if (expr && _.isValidModelKey(expr)) {
          expr = '@' + expr;
        }
        if (opts) {
          expr = this.patchRawExprOptions(expr, opts);
        }
        return expr;
      }
    }, {
      key: 'subscribeExpr',
      value: function subscribeExpr(rawExpr, fn, subs, opts) {
        var _this3 = this;

        if (rawExpr == null) {
          return;
        }

        var _resolveRawExprWithVa = this.resolveRawExprWithValue(rawExpr),
            callback = _resolveRawExprWithVa.callback,
            keys = _resolveRawExprWithVa.keys,
            expOpts = _resolveRawExprWithVa.expOpts;

        var subsFn = function subsFn() {
          return fn.call(_this3, callback.call(_this3), expOpts);
        };

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Array.from(keys)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            var unsub = this.subscribeOnly(key, subsFn, opts);
            if (subs) {
              subs.push(unsub);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return subsFn();
      }
    }, {
      key: 'resetContent',
      value: function resetContent() {
        if (this.children) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = Array.from(this.children)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var child = _step4.value;
              child.destruct();
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
        if (this.htmlSubs) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = Array.from(this.htmlSubs)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var unsub = _step5.value;
              unsub();
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
        this.children = [];
        return this.htmlSubs = [];
      }
    }, {
      key: 'addChild',
      value: function addChild(child) {
        if (this.children == null) {
          this.children = [];
        }
        return this.children.push(child);
      }
    }, {
      key: 'linkModel',
      value: function linkModel(fromModel, fromKey, toModel, toKey, opts) {
        var _this4 = this;

        if (opts == null) {
          opts = {};
        }
        var partial = opts.partial != null ? opts.partial : false;
        return this.storeSubscribe(fromModel.subscribe(fromKey, function (value) {
          return _this4.guard(function () {
            return toModel.publish(toKey, value, { sync: true });
          }, _this4.toString());
        }, { partial: partial }));
      }
    }, {
      key: 'init',
      value: function init(parent) {
        var initExpr = void 0;
        if (this.initDone) {
          return;
        }
        this.initDone = true;
        this.initParent(parent);
        this.initModel();

        if (initExpr = $.dataset(this.node, 'init')) {
          this.data_init(this.node, initExpr);
          $.dataset(this.node, 'init', null);
        }

        this.render();
        return this.subscribeOnly(this.opts.renderkey, this.reRender, { partial: false });
      }
    }, {
      key: 'initParent',
      value: function initParent(parent) {
        if (parent) {
          parent.addChild(this);
        }
        var parentModel = (parent != null ? parent.model : undefined) || rh.model;
        var input = __guard__($.dataset(this.node, 'input'), function (x) {
          return x.trim();
        });
        var output = __guard__($.dataset(this.node, 'output'), function (x1) {
          return x1.trim();
        });

        if (input === '.' || output === '.') {
          return this.model = parentModel;
        } else {
          var keys = void 0,
              opts = void 0;
          if (input || output || this.key) {
            if (this.model == null) {
              this.model = new rh.Model();
            }
          }
          if (input) {
            var _$resolveInputKeys = _.resolveInputKeys(input);

            keys = _$resolveInputKeys.keys;
            opts = _$resolveInputKeys.opts;

            _.each(keys, function (parentKey, key) {
              if (parentKey == null) {
                parentKey = key;
              }
              return this.linkModel(parentModel, parentKey, this.model, key, opts);
            }, this);
          }
          if (output) {
            var _$resolveInputKeys2 = _.resolveInputKeys(output);

            keys = _$resolveInputKeys2.keys;
            opts = _$resolveInputKeys2.opts;

            return _.each(keys, function (parentKey, key) {
              if (parentKey == null) {
                parentKey = key;
              }
              return this.linkModel(this.model, key, parentModel, parentKey, opts);
            }, this);
          }
        }
      }
    }, {
      key: 'initModel',
      value: function initModel() {
        if (this.modelArgs) {
          _.each(this.modelArgs, function (value, key) {
            return this.publish(key, value);
          }, this);
          return delete this.modelArgs;
        }
      }
    }, {
      key: 'initUI',
      value: function initUI() {
        if (rh._debug) {
          var loadedWidgets = $.dataset(this.node, 'loaded');
          if (loadedWidgets) {
            loadedWidgets = loadedWidgets + ';' + this;
          }
          $.dataset(this.node, 'loaded', loadedWidgets || this);
        } else {
          $.dataset(this.node, 'loaded', true);
        }

        if (this.templateExpr) {
          this.subscribeTemplateExpr();
        }
        if (this.include) {
          this.subscribeIncludePath();
        }
        if (this.tplNode == null) {
          this.tplNode = this.node;
        }
        return this.resetContent();
      }
    }, {
      key: 'subscribeTemplateExpr',
      value: function subscribeTemplateExpr() {
        var constructing = true;
        this.subscribeExpr(this.templateExpr, function (template) {
          this.tplNode = $.createElement('div', template).firstChild;
          if (!constructing) {
            return this.reRender(true);
          }
        });
        constructing = false;
        return this.templateExpr = undefined;
      }
    }, {
      key: 'subscribeIncludePath',
      value: function subscribeIncludePath() {
        var _this5 = this;

        _.require(this.include, function (template) {
          return _this5.setTemplate(template);
        });
        return this.include = undefined;
      }
    }, {
      key: 'setTemplate',
      value: function setTemplate(template) {
        this.useTemplate = true;
        this.tplNode = $.createElement('div', template).firstChild;
        return this.reRender(true);
      }
    }, {
      key: 'reRender',
      value: function reRender(render) {
        if (render != null && this.tplNode) {
          return this.render();
        }
      }
    }, {
      key: 'preRender',
      value: function preRender() {
        var oldNode = void 0;
        if (this.useTemplate) {
          oldNode = this.node;
          this.node = this.tplNode.cloneNode(true);
        }
        return oldNode;
      }
    }, {
      key: 'postRender',
      value: function postRender(oldNode) {
        if (oldNode && oldNode.parentNode) {
          return oldNode.parentNode.replaceChild(this.node, oldNode);
        }
      }
    }, {
      key: 'alterNodeContent',
      value: function alterNodeContent() {}
    }, {
      key: 'render',
      value: function render() {
        if (rh._test) {
          rh.model.publish('test.' + this + '.render.begin', _.time());
        }
        this.initUI();
        var oldNode = this.preRender();
        this.nodeHolder = new rh.NodeHolder([this.node]);
        this.alterNodeContent();
        this.resolveDataAttrs(this.node);
        _.loadDataHandlers(this.node, this);
        this.postRender(oldNode);
        if (rh._test) {
          return rh.model.publish('test.' + this + '.render.end', _.time());
        }
      }
    }, {
      key: 'isVisible',
      value: function isVisible() {
        return this.nodeHolder.isVisible();
      }
    }, {
      key: 'show',
      value: function show() {
        return this.nodeHolder.show();
      }
    }, {
      key: 'hide',
      value: function hide() {
        return this.nodeHolder.hide();
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.isVisible()) {
          return this.hide();
        } else {
          return this.show();
        }
      }
    }, {
      key: 'isWidgetNode',
      value: function isWidgetNode(node) {
        return $.dataset(node, 'rhwidget');
      }
    }, {
      key: 'isDescendent',
      value: function isDescendent(node) {
        var nestedWidget = void 0;
        var child = node;
        while (true) {
          var parent = child.parentNode;
          if (!parent) {
            break;
          }
          if (this.isWidgetNode(child)) {
            nestedWidget = parent;
            break;
          }
          if (this.node === parent) {
            break;
          }
          child = parent;
        }
        return nestedWidget != null;
      }
    }, {
      key: 'eachChild',
      value: function eachChild(selector, fn) {
        return $.eachChild(this.node, selector, function (node) {
          if (!this.isDescendent(node)) {
            return fn.call(this, node);
          }
        }, this);
      }
    }, {
      key: 'eachDataNode',
      value: function eachDataNode(dataAttr, fn) {
        return $.eachDataNode(this.node, dataAttr, function (node, value) {
          if (!this.isDescendent(node)) {
            return fn.call(this, node, value);
          }
        }, this);
      }
    }, {
      key: 'traverseNode',
      value: function traverseNode(node, pre, post) {
        return $.traverseNode(node, pre, post, function (child) {
          return !this.isDescendent(child);
        }, this);
      }
    }, {
      key: 'resolveDataAttrs',
      value: function resolveDataAttrs(pnode) {
        return this.traverseNode(pnode, function (node) {
          var repeatVal = void 0;
          if (_.isString(repeatVal = $.dataset(node, 'repeat'))) {
            this.data_repeat(node, repeatVal);
            return false;
          } else {
            $.eachAttributes(node, function (name, value) {
              var fnName = this.dataAttrMethods[name];
              if (fnName && value) {
                return this[fnName].call(this, node, value);
              }
            }, this);
            return true;
          }
        });
      }
    }, {
      key: 'resolveRepeatExpr',
      value: function resolveRepeatExpr(rawExpr) {
        var values = _.resolvePipedExpression(rawExpr);
        var opts = values[1] && _.resolveNiceJSON(values[1]);
        var data = _.resolveLoopExpr(values[0]);
        if (opts != null ? opts.filter : undefined) {
          data['filter'] = this._evalFunction('item, index', opts.filter);
        }
        data['step'] = (opts != null ? opts.step : undefined) || 1;
        return data;
      }

      /*
       * varName: Ex: #{@data.title} means item.data.title
       */

    }, {
      key: 'resolveRepeatVar',
      value: function resolveRepeatVar(expr, item, index, cache, node) {
        var _this6 = this;

        return cache[expr] = cache[expr] || function () {
          switch (expr) {
            case '@index':
              return index;
            case '@size':
              return item.length;
            case 'this':
              return item;
            default:
              if (_.isValidModelKey(expr)) {
                return _.get(item, expr);
              } else {
                return _this6.subscribeIDataExpr(node, expr, item, index);
              }
          }
        }();
      }
    }, {
      key: 'resolveEnclosedVar',
      value: function resolveEnclosedVar(value, item, index, itemCache, node) {
        return _.resolveEnclosedVar(value, function (varName) {
          return this.resolveRepeatVar(varName, item, index, itemCache, node);
        }, this);
      }
    }, {
      key: 'updateEncloseVar',
      value: function updateEncloseVar(name, value, item, index, itemCache, node) {
        var newValue = this.resolveEnclosedVar(value, item, index, itemCache, node);
        if (newValue === '') {
          $.removeAttribute(node, name);
        } else if (newValue !== value) {
          $.setAttribute(node, name, newValue);
        }
        return newValue;
      }
    }, {
      key: 'updateWidgetEncloseVar',
      value: function updateWidgetEncloseVar(item, index, itemCache, node) {
        return _.each(['rhwidget', 'input', 'output', 'init'], function (name) {
          var value = void 0;
          if (value = $.dataset(node, name)) {
            return this.updateEncloseVar('data-' + name, value, item, index, itemCache, node);
          }
        }, this);
      }
    }, {
      key: 'isRepeat',
      value: function isRepeat(node) {
        return $.dataset(node, 'repeat') || $.dataset(node, 'irepeat');
      }
    }, {
      key: 'resolveNestedRepeat',
      value: function resolveNestedRepeat(node, item, index, itemCache) {
        return _.each(['repeat', 'irepeat'], function (name) {
          var value = void 0;
          if (value = $.dataset(node, name)) {
            value = this.updateEncloseVar('data-' + name, value, item, index, itemCache, node);
            if (value !== '') {
              return typeof this['data_' + name] === 'function' ? this['data_' + name](node, value, item, index) : undefined;
            }
          }
        }, this);
      }
    }, {
      key: 'resolveItemIndex',
      value: function resolveItemIndex(pnode, item, index) {
        var _this7 = this;

        if (!pnode.children) {
          return;
        }
        var itemCache = {};
        return $.traverseNode(pnode, function (node) {
          if (node !== pnode && $.dataset(node, 'rhwidget')) {
            _this7.updateWidgetEncloseVar(item, index, itemCache, node);
            return false;
          }

          if (_this7.isRepeat(node)) {
            _this7.resolveNestedRepeat(node, item, index, itemCache);
            return false;
          }

          $.eachAttributes(node, function (name, value, attrsInfo) {
            if (_.isString(value)) {
              var fnName = void 0;
              if (0 === name.search('data-')) {
                value = this.updateEncloseVar(name, value, item, index, itemCache, node);
              }
              if (value === '') {
                return;
              }

              if (fnName = this.dataIAttrMethods[name]) {
                if (this[fnName].call(this, node, value, item, index, attrsInfo)) {
                  return $.removeAttribute(node, name);
                }
              } else if (0 === name.search('data-i-')) {
                this.data_iHandler(node, value, item, index, name.substring(7));
                return $.removeAttribute(node, name);
              }
            }
          }, _this7);
          return true;
        });
      }
    }, {
      key: 'guard',
      value: function guard(fn, guardName) {
        if (guardName == null) {
          guardName = 'ui';
        }
        return _get(Widget.prototype.__proto__ || Object.getPrototypeOf(Widget.prototype), 'guard', this).call(this, fn, guardName);
      }
    }, {
      key: 'data_repeat',
      value: function data_repeat(node, rawExpr) {
        var _this8 = this;

        $.dataset(node, 'repeat', null);
        node.removeAttribute('data-repeat');
        var opts = this.resolveRepeatExpr(rawExpr);

        var nodeHolder = new rh.NodeHolder([node]);
        this.subscribeDataExpr(opts.expr, function (result) {
          //TODO usub old subs using stack of html subs
          return _this8._repeatNodes(nodeHolder, result, opts, node);
        }, { partial: false });
        return true;
      }

      //if statement for data-repeat like structure

    }, {
      key: 'resolve_rif',
      value: function resolve_rif(node, item, index) {
        var callback = void 0,
            cloneNode = void 0,
            rawExpr = void 0;
        if (rawExpr = $.dataset(node, 'rif')) {
          callback = this._evalFunction('item, index', rawExpr);
        }

        if (!callback || callback.call(this, item, index)) {
          cloneNode = node.cloneNode(false);
          $.dataset(cloneNode, 'rif', null);
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = Array.from(node.childNodes)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var child = _step6.value;

              var cloneChild = this.resolve_rif(child, item, index);
              if (cloneChild) {
                cloneNode.appendChild(cloneChild);
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }
        }
        return cloneNode;
      }
    }, {
      key: '_function',
      value: function _function(arg, expr, keys) {
        var data = this.resolveExpression(expr);
        if (keys) {
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = Array.from(data.keys)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var key = _step7.value;
              keys.push(key);
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
        return this._safeFunction(arg, data.expr);
      }
    }, {
      key: '_evalFunction',
      value: function _evalFunction(arg, expr, keys) {
        return this._function(arg, 'return ' + expr + ';', keys);
      }

      //########## list or repeat items data attributes handling ############

    }, {
      key: '_setLoopVar',
      value: function _setLoopVar(opts, item, index) {
        var oldValue = {};
        if (opts.item) {
          oldValue['item'] = this.user_vars[opts.item];
          this.user_vars[opts.item] = item;
        }
        if (opts.index) {
          oldValue['index'] = this.user_vars[opts.index];
          this.user_vars[opts.index] = index;
        }
        return oldValue;
      }
    }, {
      key: '_repeatNodes',
      value: function _repeatNodes(nodeHolder, result, opts, tmplNode) {
        var cloneNode = void 0;
        if (result == null) {
          result = [];
        }
        if (this.user_vars == null) {
          this.user_vars = {};
        }
        var newNodes = [];
        var filter = opts.filter,
            step = opts.step;

        for (var step1 = step, asc = step1 > 0, index = asc ? 0 : result.length - 1; asc ? index < result.length : index >= 0; index += step1) {
          var item = result[index];
          var oldValue = this._setLoopVar(opts, item, index);
          if (!filter || filter.call(this, item, index)) {
            if (cloneNode = this.resolve_rif(tmplNode, item, index)) {
              newNodes.push(cloneNode);
              this.resolveItemIndex(cloneNode, item, index);
              this.resolveDataAttrs(cloneNode);
            }
          }
          this._setLoopVar(opts, oldValue.item, oldValue.index);
        }

        if (newNodes.length === 0) {
          var tempNode = tmplNode.cloneNode(false);
          $.addClass(tempNode, 'rh-hide');
          newNodes.push(tempNode);
        }

        return nodeHolder.updateNodes(newNodes);
      }
    }, {
      key: 'data_irepeat',
      value: function data_irepeat(node, rawExpr, item, index, attrsInfo) {
        $.dataset(node, 'irepeat', null);
        var opts = this.resolveRepeatExpr(rawExpr);
        var nodeHolder = new rh.NodeHolder([node]);
        var result = this.subscribeIDataExpr(node, opts.expr, item, index);
        this._repeatNodes(nodeHolder, result, opts, node);
        return true;
      }

      /*
       * helper method for r(repeat) attributes
       */

    }, {
      key: 'subscribeIDataExpr',
      value: function subscribeIDataExpr(node, rawExpr, item, index, attrsInfo) {
        var exprFn = this._evalFunction('item, index, node', rawExpr);
        try {
          return exprFn.call(this, item, index, node);
        } catch (error) {
          if (rh._debug) {
            return rh._d('error', 'iExpression: ' + rawExpr, error.message);
          }
        }
      }

      /*
       * get the key value and fills its value as text content
       * Example: <a data-itext="item.title">temp value</a>
       *          <div data-itext="@key">temp value</div>
       */

    }, {
      key: 'data_itext',
      value: function data_itext(node, rawExpr, item, index, attrsInfo) {
        $.textContent(node, this.subscribeIDataExpr(node, rawExpr, item, index));
        return true;
      }

      /*
       * get the key value and fills its value as HTML content
       * Example: <a data-ihtml="item.data">temp value</a>
       *          <div data-ihtml="@key">temp value</div>
       */

    }, {
      key: 'data_ihtml',
      value: function data_ihtml(node, rawExpr, item, index, attrsInfo) {
        node.innerHTML = this.subscribeIDataExpr(node, rawExpr, item, index);
        return true;
      }

      /*
       * get the key value and fills its value as text content
       * Example: <a data-iclass="item.data?'enabled':'disabled'">temp value</a>
       *          <div data-iclass="@key">temp value</div>
       */

    }, {
      key: 'data_iclass',
      value: function data_iclass(node, rawExpr, item, index, attrsInfo) {
        var className = this.subscribeIDataExpr(node, rawExpr, item, index);
        if (className) {
          $.addClass(node, className);
        }
        return true;
      }

      /*
       * get the key value and fills its value as text content
       * Example: <a data-ihref="item.url">temp value</a>
       *          <div data-iid="item.id">temp value</div>
       */

    }, {
      key: 'data_iHandler',
      value: function data_iHandler(node, rawExpr, item, index, attrName) {
        var attrValue = this.subscribeIDataExpr(node, rawExpr, item, index);
        if (attrValue) {
          $.setAttribute(node, attrName, attrValue);
        }
        return true;
      }

      //################ Static data attributes handling ##########################
      /* get the key value at the time of rendering
       * and fills its value as html content
       * Example: <a data-shtml="key">temp value</a>
       *          <div data-shtml="key">temp value</div>
       */

    }, {
      key: 'data_shtml',
      value: function data_shtml(node, key) {
        $.removeAttribute(node, 'data-shtml');
        return node.innerHTML = this.get(key);
      }

      /*
       * get the key value and fills its value as text content
       * Example: <a data-stext="key">temp value</a>
       *          <div data-stext="key">temp value</div>
       */

    }, {
      key: 'data_stext',
      value: function data_stext(node, key) {
        $.removeAttribute(node, 'data-stext');
        return $.textContent(node, this.get(key) || '');
      }

      //################ Generic data attributes handling ##########################
      /*
       * evaluates expression value to init
       * Example: data-init="@key(true)"
       *          data-init="rh._.loadScript('p.toc')"
       */

    }, {
      key: 'data_init',
      value: function data_init(node, rawExpr) {
        var resolvedData = _.resolveExprOptions(rawExpr);
        var callback = this._function('node', resolvedData.expr);
        callback = _.applyCallbackOptions(callback, resolvedData.opts);
        return callback.call(this, node);
      }

      /*
       * helper method for data methods having expression like data-if
       */

    }, {
      key: 'subscribeDataExpr',
      value: function subscribeDataExpr(rawExpr, handler, opts) {
        return this.subscribeExpr(rawExpr, handler, this.htmlSubs, opts);
      }
    }, {
      key: '_data_event_callback',
      value: function _data_event_callback(rawExpr) {
        var data = Widget.prototype._eventCallBackData[rawExpr];
        if (data == null) {
          data = {};
          var value = _.resolvePipedExpression(rawExpr);
          data.callback = this._function('event, node', value[0]);
          if (value[1]) {
            data.opts = _.resolveNiceJSON(value[1]);
          }
          Widget.prototype._eventCallBackData[rawExpr] = data;
        }
        return data;
      }

      /*
       * subscribes to keys and evaluates expression value to show or hide
       * Example: data-if="@key"
       *          data-if="!@key&&@key2"
       *          data-if='this.get("key", "value")'
       *          data-if="@key==value"
       *          data-if="@key!==value"
       */

    }, {
      key: 'data_if',
      value: function data_if(node, rawExpr) {
        var nodeHolder = new rh.NodeHolder([node]);
        return this.subscribeDataExpr(rawExpr, function (result) {
          if (result) {
            return nodeHolder.show();
          } else {
            return nodeHolder.hide();
          }
        });
      }
    }, {
      key: 'data_hidden',
      value: function data_hidden(node, rawExpr) {
        var nodeHolder = new rh.NodeHolder([node]);
        return this.subscribeDataExpr(rawExpr, function (result) {
          return nodeHolder.accessible(!result);
        });
      }

      /*
       * subscribes to a key and fills its value as html content
       * Example: <a data-html="@key">temp value</a>
       *          <div data-html="@key['url']">temp value</div>
       */

    }, {
      key: 'data_html',
      value: function data_html(node, rawExpr) {
        return this.subscribeDataExpr(rawExpr, function (result) {
          var _this9 = this;

          if (result == null) {
            result = '';
          }
          node.innerHTML = result;
          //TODO unsub old subscribes
          return $.eachChildNode(node, function (child) {
            return _this9.resolveDataAttrs(child);
          });
        });
      }

      /*
       * subscribes to a key and fills its value as text content
       * Example: <a data-text="@key">temp value</a>
       *          <div data-text="@key['title']">temp value</div>
       */

    }, {
      key: 'data_text',
      value: function data_text(node, rawExpr) {
        return this.subscribeDataExpr(rawExpr, function (result) {
          if (result == null) {
            result = '';
          }
          return $.textContent(node, result);
        });
      }
      /*
       * provide expression to update the class attribute
       * Example: data-class="selected: #{@index} == @.dataidx"
       * data-class="selected: @key1; bold: @key2"
       */

    }, {
      key: 'data_class',
      value: function data_class(node, attrsData) {
        return _.each(this.resolveAttr(attrsData), function (rawExpr, className) {
          var nodeHolder = new rh.NodeHolder([node]);
          return this.subscribeDataExpr(rawExpr, function (result) {
            var addRemoveClass = result ? [className] : [];
            return nodeHolder.updateClass(addRemoveClass);
          });
        }, this);
      }

      /*
       * To update any html tag attribute.
       * Example: <a data-attr="href:link_key">Google</a>
       *          <button data-attr="disabled:key">temp value</button>
       */

    }, {
      key: 'data_attr',
      value: function data_attr(node, attrsData) {
        return _.each(this.resolveAttr(attrsData), function (rawExpr, attr_name) {
          return this.subscribeDataExpr(rawExpr, function (result) {
            if (result != null) {
              return $.setAttribute(node, attr_name, result);
            } else if ($.hasAttribute(node, attr_name)) {
              return $.removeAttribute(node, attr_name);
            }
          });
        }, this);
      }

      /*
       * To update style attribute of HTML node.
       * Example:
       * <span style="visible: true;" data-css="visible: @key"> some text </span>
       * <li style="color: blue; display: block;" data-css="color:
       * @.selected_color; display: @.dataidx > 10 ? 'none' : 'block'"></li>
       */

    }, {
      key: 'data_css',
      value: function data_css(node, attrsData) {
        return _.each(this.resolveAttr(attrsData), function (rawExpr, styleName) {
          return this.subscribeDataExpr(rawExpr, function () {
            var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            return (// null to force set css
              $.css(node, styleName, result)
            );
          });
        }, this);
      }

      /*
       * works like data-if but sets the states checked
       * Example:
       * <input type="radio" name="group1" value="Print" data-checked="key" />
       * <input type="radio" name="group1" value="Online" data-checked="key" />
       */

    }, {
      key: 'data_checked',
      value: function data_checked(node, key) {
        var _this10 = this;

        if (_.isValidModelConstKey(key)) {
          key = consts(key);
        }
        var type = node.getAttribute('type');
        if (type === 'checkbox' || type === 'radio') {
          var nodeValue = void 0;
          if ($.getAttribute(node, 'checked')) {
            this.guard(function () {
              return this.publish(key, node.getAttribute('value', { sync: true }));
            });
          }

          node.onclick = function () {
            nodeValue = node.getAttribute('value');
            var value = nodeValue === null ? node.checked : node.checked ? nodeValue : undefined;
            return _this10.guard(function () {
              return this.publish(key, value, { sync: true });
            });
          };
          return this.htmlSubs.push(this.subscribe(key, function (value) {
            nodeValue = node.getAttribute('value');
            if (nodeValue != null) {
              return node.checked = value === nodeValue;
            } else {
              return node.checked = value === true;
            }
          }));
        }
      }

      /*
       * subscribes to a key and fills its value as html content
       * Example:
       * <input type="text" data-value="key" />
       * <input type="text" value="Online" data-value="key" />
       */

    }, {
      key: 'data_value',
      value: function data_value(node, key) {
        var _this11 = this;

        if (_.isValidModelConstKey(key)) {
          key = consts(key);
        }
        var nodeGuard = Math.random();
        if (node.value) {
          this.guard(function () {
            return this.publish(key, node.value, { sync: true });
          }, nodeGuard);
        }

        node.onchange = function () {
          return _this11.guard(function () {
            return this.guard(function () {
              return this.publish(key, node.value, { sync: true });
            });
          }, nodeGuard);
        };

        return this.htmlSubs.push(this.subscribe(key, function (value) {
          return _this11.guard(function () {
            return node.value = value;
          }, nodeGuard);
        }));
      }
    }, {
      key: '_register_event_with_rawExpr',
      value: function _register_event_with_rawExpr(name, node, rawExpr) {
        var _this12 = this;

        var _resolveEventRawExpr = this.resolveEventRawExpr(rawExpr),
            callback = _resolveEventRawExpr.callback;

        _.addEventListener(node, name, function (e) {
          return callback.call(_this12, e, e.currentTarget);
        });
        return callback;
      }

      /*
       * Example: data-click='@key("value")'
       *          data-click='this.publish("key", "value")'
       *          data-click='@key("value"); event.preventDefault();'
       */

    }, {
      key: 'data_click',
      value: function data_click(node, rawExpr) {
        return this._register_event_with_rawExpr('click', node, rawExpr);
      }

      /*
       * Example: data-mouseover='@key("value")'
       *          data-mouseover='this.publish("key", "value")'
       *          data-mouseover='@key("value"); event.preventDefault();'
       */

    }, {
      key: 'data_mouseover',
      value: function data_mouseover(node, rawExpr) {
        return this._register_event_with_rawExpr('mouseover', node, rawExpr);
      }
    }, {
      key: 'data_mouseout',
      value: function data_mouseout(node, rawExpr) {
        return this._register_event_with_rawExpr('mouseout', node, rawExpr);
      }
    }, {
      key: 'data_focus',
      value: function data_focus(node, rawExpr) {
        return this._register_event_with_rawExpr('focus', node, rawExpr);
      }
    }, {
      key: 'data_blur',
      value: function data_blur(node, rawExpr) {
        return this._register_event_with_rawExpr('blur', node, rawExpr);
      }

      /*
       * trigger
       * Example: data-trigger='.l.go_to_top'
       *          data-trigger='EVT_SEARCH_PAGE'
       */

    }, {
      key: 'data_trigger',
      value: function data_trigger(node, key) {
        var _this13 = this;

        if (_.isValidModelConstKey(key)) {
          key = consts(key);
        }
        return _.addEventListener(node, 'click', function () {
          return _this13.publish(key, null);
        });
      }

      /*
       * call member or global method on click
       * advantage is you will get event as argument
       * Example: data-method='handleSave' => data-click='this.handleSave(event)'
       *          data-method='handleCancel'
       */

    }, {
      key: 'data_method',
      value: function data_method(node, method) {
        var _this14 = this;

        return _.addEventListener(node, 'click', function (event) {
          if (!event.defaultPrevented) {
            return (_this14[method] || window[method])(event);
          }
        });
      }
    }, {
      key: 'data_toggle',
      value: function data_toggle(node, rawArgs) {
        var _this15 = this;

        var opts = void 0;
        var keys = [];
        var data = Widget.prototype._toggleData[rawArgs];
        if (data == null) {
          var pipedArgs = _.resolvePipedExpression(rawArgs);
          var config = pipedArgs.shift() || '';
          config = _.explodeAndMap(config, ';', ':', { trim: true });
          if (pipedArgs[0]) {
            opts = _.resolveNiceJSON(pipedArgs[0]);
          }
          data = { keyValues: config, opts: opts };
          Widget.prototype._toggleData[rawArgs] = data;
        }

        _.each(data.keyValues, function (value, key) {
          keys.push(key);
          if (value != null) {
            return this.guard(function () {
              return this.publish(key, value === 'true', { sync: true });
            });
          }
        }, this);

        var callback = function callback(key) {
          return _this15.guard(function () {
            return this.publish(key, !this.get(key), { sync: true });
          });
        };
        if (data.opts) {
          callback = _.applyCallbackOptions(callback, data.opts);
        }

        return _.addEventListener(node, 'click', function (event) {
          return _.each(keys, function (key) {
            if (!event.defaultPrevented) {
              return callback(key);
            }
          });
        });
      }

      /*
       * Toggle model variable on click
       * Example: data-toggleclass='rh-hide'
       *          data-toggleclass='open'
       *          <div class="open" data-toggleclass='open,closed'>
       */

    }, {
      key: 'data_toggleclass',
      value: function data_toggleclass(node, classNames) {
        var newClasses = _.splitAndTrim(classNames, ',');
        return _.addEventListener(node, 'click', function (event) {
          if (!event.defaultPrevented) {
            node = event.currentTarget;
            return _.each(newClasses, function (className) {
              if ($.hasClass(node, className)) {
                return $.removeClass(node, className);
              } else {
                return $.addClass(node, className);
              }
            });
          }
        });
      }

      /*
       * Example: data-change='@key("value")'
       *          data-change='this.publish("key", "value")'
       */

    }, {
      key: 'data_change',
      value: function data_change(node, rawExpr) {
        var _this16 = this;

        var data = this._data_event_callback(rawExpr);
        var callback = _.applyCallbackOptions(data.callback, data.opts);
        return node.onchange = function (event) {
          return callback.call(_this16, event, event.currentTarget);
        };
      }

      /*
       * Example: data-keydown='@text(node.value); | keyCode: 13'
       *          data-keydown='event.keyCode == 13 && @text(node.value)'
       *          data-keydown='this.publish("key", "myvalue");'
       *          data-keydownoptions='debounce:300'
       */

    }, {
      key: 'data_keydown',
      value: function data_keydown(node, rawExpr) {
        var _this17 = this;

        var data = this._data_event_callback(rawExpr);
        var callback = _.applyCallbackOptions(data.callback, data.opts);
        var keyCode = data.opts && data.opts.keyCode;

        return node.onkeydown = function (event) {
          if (!keyCode || keyCode === event.keyCode) {
            return callback.call(_this17, event, event.currentTarget);
          }
        };
      }

      /*
       * Example: data-keyup='if(key == 13)@text(node.value);'
       *          data-keyup='@text(node.value) | keyCode: 13'
       *          data-keyup='this.publish("key", "myvalue") | debounce:300'
       */

    }, {
      key: 'data_keyup',
      value: function data_keyup(node, rawExpr) {
        var _this18 = this;

        var data = this._data_event_callback(rawExpr);
        var callback = _.applyCallbackOptions(data.callback, data.opts);
        var keyCode = data.opts && data.opts.keyCode;

        return node.onkeyup = function (event) {
          if (!keyCode || keyCode === event.keyCode) {
            return callback.call(_this18, event, event.currentTarget);
          }
        };
      }

      /*
       * Example: data-scroll='@text(node.value) | debounce:300'
       *          data-scroll='this.publish("key", "myvalue")'
       */

    }, {
      key: 'data_scroll',
      value: function data_scroll(node, rawExpr) {
        var _this19 = this;

        var data = this._data_event_callback(rawExpr);
        var opts = data.opts;

        var delta = opts && opts.delta || 100;
        var callback = function callback(event) {
          var rect = node.getBoundingClientRect();
          if (node.scrollTop > node.scrollHeight - (rect.height + delta)) {
            return data.callback.call(_this19, event, node);
          }
        };

        if (opts) {
          callback = _.applyCallbackOptions(callback, opts);
        }
        return _.addEventListener(node, 'scroll', callback);
      }
    }, {
      key: 'data_load',
      value: function data_load(node, value) {
        var _this20 = this;

        var pair = value.split(':');
        var jsPath = pair[0];
        var key = pair[1];
        if (!Widget.prototype._loadData[jsPath]) {
          return _.addEventListener(node, 'click', function (event) {
            if (!Widget.prototype._loadData[jsPath]) {
              Widget.prototype._loadData[jsPath] = true;
              if (key) {
                $.addClass(node, 'loading');
                var unsub = _this20.subscribeOnly(key, function () {
                  $.removeClass(node, 'loading');
                  return unsub();
                });
              }
              return _.loadScript(jsPath);
            }
          });
        }
      }
    }, {
      key: 'data_controller',
      value: function data_controller(node, value) {
        if (this.user_vars == null) {
          this.user_vars = {};
        }
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = Array.from(_.splitAndTrim(value, ';'))[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var data = _step8.value;

            var ctrlClass, opts;
            var pair = _.resolvePipedExpression(data);
            if (pair[1]) {
              opts = _.resolveNiceJSON(pair[1]);
            }
            pair = _.splitAndTrim(pair[0], ':');
            if (pair.length === 0) {
              pair = _.splitAndTrim(pair[0], ' as ');
            }
            if (pair[0] != null) {
              ctrlClass = rh.controller(pair[0]);
            }
            var ctrlName = pair[1];
            if (ctrlClass && !this.user_vars[ctrlName]) {
              var controller = new ctrlClass(this, opts);
              if (ctrlName) {
                this.user_vars[ctrlName] = controller;
              }
            } else if (rh._debug && !ctrlClass) {
              rh._d('error', 'Controller ' + ctrlClass + ' not found');
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }
    }, {
      key: 'data_screenvar',
      value: function data_screenvar(node, value) {
        var sVars = _.splitAndTrim(value, ',');
        var current_screen = _.findIndex(this.get(consts('KEY_SCREEN')), function (v, k) {
          return v.attached;
        });
        var cache = {};
        cache[current_screen] = {};

        var screenKeys = this.get(consts('KEY_SCREEN'));
        return _.each(_.keys(screenKeys), function (key) {
          var _this21 = this;

          return this.subscribeOnly(consts('KEY_SCREEN') + '.' + key + '.attached', function (attached) {
            var name = void 0;
            if (!attached) {
              return;
            }
            _.each(sVars, function (sVar) {
              cache[current_screen][sVar] = this.get(sVar);
              if (cache[key] != null) {
                return this.publish(sVar, cache[key][sVar]);
              }
            }, _this21);
            return cache[name = current_screen = key] != null ? cache[name] : cache[name] = {};
          });
        }, this);
      }
    }]);

    return Widget;
  }(rh.Guard);
  Widget.initClass();
  return Widget;
}();

//######################### Utility methods #########################

rh.widgets = {};
rh.Widget = Widget;
rh.widgets.Basic = Widget;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

},{}],20:[function(require,module,exports){
"use strict";

var _window = window,
    rh = _window.rh;


rh.registerDataAttr = function (attrName, DataAttrHandler, Widget) {
  if (Widget == null) {
    Widget = rh.Widget;
  }
  var methodName = "data_" + attrName;
  Widget.prototype.dataAttrMethods["data-" + attrName] = methodName;
  Widget.prototype.dataAttrs.push(attrName);
  return Widget.prototype[methodName] = function (node, attrValue) {
    return new DataAttrHandler(this, node, attrValue);
  };
};

},{}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;

var Resize = function () {
  function Resize(widget, node, rawExpr) {
    _classCallCheck(this, Resize);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.widget = widget;
    this.node = node;

    var _widget$resolveRawExp = this.widget.resolveRawExprWithValue(rawExpr),
        callback = _widget$resolveRawExp.callback,
        opts = _widget$resolveRawExp.opts;

    this.opts = opts;
    this.callback = function () {
      return callback.call(this.widget);
    };

    if (opts.maxx == null) {
      opts.maxx = 1;
    }
    if (opts.minx == null) {
      opts.minx = 0;
    }
    if (opts.maxy == null) {
      opts.maxy = 1;
    }
    if (opts.miny == null) {
      opts.miny = 0;
    }
    this.resize = false;

    _.initMouseMove();
    _.addEventListener(this.node, 'mousedown', this.handleMouseDown);
    this.widget.subscribe(consts('EVT_MOUSEMOVE'), this.handleMouseMove);
  }

  _createClass(Resize, [{
    key: 'handleMouseDown',
    value: function handleMouseDown(evt) {
      if (evt.which !== 1) {
        return;
      }
      this.resize = evt.target === this.node && !evt.defaultPrevented;
      if (this.resize) {
        var result = this.callback();
        return this.resize = result !== false && result !== null;
      }
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(obj) {
      if (obj.defaultPrevented) {
        this.resize = false;
      }
      if (!this.resize) {
        return;
      }

      obj.defaultPrevented = true;
      if (obj.which === 1) {
        return this.publish(obj);
      } else {
        return this.resize = false;
      }
    }
  }, {
    key: 'getBaseWidth',
    value: function getBaseWidth() {
      return this.opts.basex || document.body.offsetWidth;
    }
  }, {
    key: 'getBaseHeight',
    value: function getBaseHeight() {
      return this.opts.basey || document.body.offsetHeight;
    }
  }, {
    key: 'publish',
    value: function publish(obj) {
      var base = this.getBaseWidth();
      var rtl = 'rtl' === this.widget.get(consts('KEY_DIR'));
      var newValue = rtl ? base - obj.x : obj.x;
      if (!this.publishPos(base, this.opts.minx, this.opts.maxx, this.opts.x, newValue)) {
        base = this.getBaseHeight();
        newValue = rtl ? base - obj.y : obj.y;
        return this.publishPos(base, this.opts.miny, this.opts.maxy, this.opts.y, newValue);
      }
    }
  }, {
    key: 'publishPos',
    value: function publishPos(base, min, max, key, newValue) {
      if (key != null && newValue != null) {
        var oldValue = this.widget.get(key);
        if (oldValue !== newValue) {
          if (max * base < newValue) {
            newValue = max * base;
          } else if (min * base > newValue) {
            newValue = min * base;
          }
          this.widget.publish(key, newValue + 'px');
          this.callback();
          return true;
        }
      }
    }
  }]);

  return Resize;
}();

rh.registerDataAttr('resize', Resize);

},{}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;

var Table = function () {
  function Table(widget, node, key) {
    _classCallCheck(this, Table);

    this.widget = widget;
    this.node = node;
    this.widget.publish(key, this.extractRowColumnMatrix(this.node));
  }

  _createClass(Table, [{
    key: 'extractRowColumnMatrix',
    value: function extractRowColumnMatrix(node) {
      var rowColMatrix = [];
      var rowElements = [];
      this.widget.traverseNode(node, function (node) {
        if ('TD' === $.nodeName(node)) {
          rowElements.push($.innerHTML(node));
          return false;
        } else if ('TR' === $.nodeName(node)) {
          if (rowElements.length !== 0) {
            rowColMatrix.push(rowElements);
          }
          rowElements = [];
        }
        return true;
      });
      if (rowElements.length !== 0) {
        rowColMatrix.push(rowElements);
      }
      return rowColMatrix;
    }
  }]);

  return Table;
}();

rh.registerDataAttr('table', Table);

},{}],23:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;

var TableNestedData = function (_rh$Widget) {
  _inherits(TableNestedData, _rh$Widget);

  function TableNestedData(opts) {
    _classCallCheck(this, TableNestedData);

    var _this = _possibleConstructorReturn(this, (TableNestedData.__proto__ || Object.getPrototypeOf(TableNestedData)).call(this, opts));

    _this.rowColMatrix = _this.extractRowColumnMatrix(_this.node);
    return _this;
  }

  _createClass(TableNestedData, [{
    key: 'extractRowColumnMatrix',
    value: function extractRowColumnMatrix(node) {
      var rowColMatrix = [];
      var rowElements = [];
      this.traverseNode(node, function (node) {
        if ('TD' === $.nodeName(node)) {
          if (this.hasOnlyTable(node)) {
            var childMatrix = this.extractRowColumnMatrix(node.children[0]);
            if (childMatrix.length !== 0) {
              rowElements.push({ child: childMatrix });
            }
          } else {
            rowElements.push({ html: $.innerHTML(node) });
          }
          return false;
        } else if ('TR' === $.nodeName(node)) {
          if (rowElements.length !== 0) {
            rowColMatrix.push(rowElements);
          }
          rowElements = [];
        }
        return true;
      });
      if (rowElements.length !== 0) {
        rowColMatrix.push(rowElements);
      }
      return rowColMatrix;
    }
  }, {
    key: 'hasOnlyTable',
    value: function hasOnlyTable(node) {
      return (node.children != null ? node.children.length : undefined) === 1 && 'TABLE' === $.nodeName(node.children[0]);
    }
  }]);

  return TableNestedData;
}(rh.Widget);

//rh.registerDataAttr 'tabler', TableNestedData


window.rh.widgets.TableNestedData = TableNestedData;

},{}],24:[function(require,module,exports){
"use strict";

//JavaScript handler.
var rh = require("../../src/lib/rh");

rh.IndigoSetSidebar = function () {
	var sideBarToSet = rh.model.get(rh.consts('SIDEBAR_STATE'));

	var body = document.getElementsByTagName("body")[0];
	var toc = document.getElementById("toc-holder");
	var idx = document.getElementById("idx-holder");
	var glo = document.getElementById("glo-holder");
	var fts = document.getElementById("fts-holder");
	var filter = document.getElementById("filter-holder");
	var fav = document.getElementById("favorites-holder");
	var mobileMenu = document.getElementById("mobile-menu-holder");

	var visibleClass = "layout-visible";

	var setVisible = function setVisible(elem) {
		if (typeof elem != "undefined" && elem != null) {
			elem.classList.add(visibleClass);

			//Keyboard focus on first link element in the popup-visible. This allows better keyboard access.
			var input = elem.getElementsByTagName("input")[0];
			if (typeof input != "undefined" && rh.model.get(rh.consts('KEY_SCREEN_DESKTOP'))) {
				if (input.classList.contains("wSearchField")) {
					rh.model.cpublish('EVT_CLOSE_SEARCH_SUGGESTION', true);
					setTimeout(function () {
						input.focus();
					}, 300);
				} else {
					input.focus();
				}
			} else if (rh.model.get(rh.consts('KEY_SCREEN_DESKTOP'))) {
				var list = elem.getElementsByTagName("li");

				if (typeof list[0] != "undefined") {
					list[0].focus();
				} else {

					var links = elem.getElementsByTagName("a");
					if (typeof links[1] != "undefined") {
						links[1].focus();
					} else if (typeof links[0] != "undefined") {
						links[0].focus();
					}
				}
			}
		}
	};
	var setHidden = function setHidden(elem) {
		if (typeof elem != "undefined" && elem != null) {
			elem.classList.remove(visibleClass);
		}
	};

	var menuDelay = "has-delay";
	var menuImmediate = "no-transform";

	var showOtherMenu = function showOtherMenu() {
		mobileMenu.classList.add(menuDelay);

		setTimeout(function () {
			mobileMenu.classList.remove(menuDelay);
			mobileMenu.classList.add(menuImmediate);
		}, 750);
	};

	var hideOtherMenu = function hideOtherMenu() {
		setTimeout(function () {
			mobileMenu.classList.remove(menuImmediate);
		}, 750);
	};

	body.classList.add("popup-visible");

	switch (sideBarToSet) {
		case "toc":
			showOtherMenu();
			setVisible(toc);
			setHidden(idx);
			setHidden(glo);
			setHidden(fts);
			setHidden(filter);
			setHidden(fav);
			setHidden(mobileMenu);
			break;
		case "idx":
			showOtherMenu();
			setVisible(idx);
			setHidden(toc);
			setHidden(glo);
			setHidden(fts);
			setHidden(filter);
			setHidden(fav);
			setHidden(mobileMenu);
			break;
		case "glo":
			showOtherMenu();
			setVisible(glo);
			setHidden(idx);
			setHidden(toc);
			setHidden(fts);
			setHidden(filter);
			setHidden(fav);
			setHidden(mobileMenu);
			break;
		case "fts":
			showOtherMenu();
			setVisible(fts);
			setHidden(idx);
			setHidden(glo);
			setHidden(toc);
			setHidden(filter);
			setHidden(fav);
			setHidden(mobileMenu);
			break;
		case "filter":
			showOtherMenu();
			setVisible(filter);
			setHidden(idx);
			setHidden(glo);
			setHidden(fts);
			setHidden(toc);
			setHidden(fav);
			setHidden(mobileMenu);
			break;
		case "favorites":
			showOtherMenu();
			setVisible(fav);
			setHidden(idx);
			setHidden(glo);
			setHidden(fts);
			setHidden(toc);
			setHidden(filter);
			setHidden(mobileMenu);
			break;
		case "menu":
			setVisible(mobileMenu);
			hideOtherMenu();
			setHidden(idx);
			setHidden(glo);
			setHidden(fts);
			setHidden(toc);
			setHidden(fav);
			setHidden(filter);
			break;
		default:
			//Nothing. Show topic
			setHidden(idx);
			setHidden(glo);
			setHidden(fts);
			setHidden(toc);
			setHidden(filter);
			setHidden(fav);
			setHidden(mobileMenu);
			hideOtherMenu();
			body.classList.remove("popup-visible");
			if (rh.model.get(rh.consts('KEY_SCREEN_DESKTOP'))) {
				rh.IndigoSetFocusOnSearch();
			}
	}
};
rh.IndigoSetFocusOnSearch = function () {
	var input = document.getElementsByTagName("input");
	for (var i = 0; i < input.length; i++) {
		if (input[i].classList.contains("wSearchField")) {
			rh.model.cpublish('EVT_CLOSE_SEARCH_SUGGESTION', true);
			setTimeout(function () {
				input[i].focus();
			}, 300);
			break;
		}
	}
};
rh.IndigoSetSidebarSearch = function () {
	rh.model.publish(rh.consts("SIDEBAR_STATE"), "fts");
};
rh.IndigoSetTransitionAllow = function () {
	var body = document.getElementsByTagName("body")[0];

	var allowPhone = "allow-phone-transitions";
	var allowTablet = "allow-tablet-transitions";
	var allowDesktop = "allow-desktop-transitions";

	body.classList.remove(allowPhone);
	body.classList.remove(allowTablet);
	body.classList.remove(allowDesktop);

	var toSet = false;
	if (rh.model.get(rh.consts('KEY_SCREEN_PHONE')) == true) {
		toSet = allowPhone;
	} else if (rh.model.get(rh.consts('KEY_SCREEN_TABLET')) == true) {
		toSet = allowTablet;
	} else if (rh.model.get(rh.consts('KEY_SCREEN_DESKTOP')) == true) {
		toSet = allowDesktop;
	}

	setTimeout(function () {

		body.classList.remove(allowPhone); //Always make sure there is only 1
		body.classList.remove(allowTablet);
		body.classList.remove(allowDesktop);

		body.classList.add(toSet);
	}, 10);
};

rh.initIndigo = function () {

	rh.model.subscribe(rh.consts("SIDEBAR_STATE"), rh.IndigoSetSidebar);
	rh.model.subscribe(rh.consts("EVT_SEARCH_IN_PROGRESS"), rh.IndigoSetSidebarSearch);
	rh.model.subscribe(rh.consts("KEY_SCREEN"), rh.IndigoSetTransitionAllow);

	//When opening the page, check whether there is a highlight term.
	//If found, add it to the search box
	setTimeout(function () {
		var highlight = getUrlParameter(RHHIGHLIGHTTERM);
		if (highlight != "") {
			var input = document.getElementsByTagName("input");
			for (var i = 0; i < input.length; i++) {
				if (input[i].classList.contains("wSearchField")) {
					input[i].value = highlight;
					break;
				}
			}
			rh.model.publish(rh.consts('KEY_SEARCH_TERM'), highlight);
		}
	}, 250);

	//For Keyboard accessibility, get the ESC key to close overlays
	document.onkeydown = function (evt) {
		evt = evt || window.event;
		if (evt.keyCode == 27) {
			rh.model.publish(rh.consts('SIDEBAR_STATE'), false);
			rh.IndigoSetFocusOnSearch(); //Focus on the search for keyboard accessibility
		}
	};
};

},{"../../src/lib/rh":41}],25:[function(require,module,exports){
'use strict';

var _ = window.rh._;


_.stackTrace = function () {
  var err = new Error();
  return err.stack;
};

_.safeExec = function (fn) {
  return function () {
    try {
      return fn.apply(this, arguments);
    } catch (error) {
      if (rh._debug) {
        rh._d('error', 'Function: ' + fn, error.message);
      }
      return undefined;
    }
  };
};

},{}],26:[function(require,module,exports){
'use strict';

var _ = window.rh._;


_.addEventListener = function (obj, eventName, callback) {
  if (obj == null) {
    obj = window;
  }
  if (obj.addEventListener != null) {
    return obj.addEventListener(eventName, callback, false);
  } else if (obj.attachEvent != null) {
    return obj.attachEvent('on' + eventName, callback);
  }
};

_.removeEventListener = function (obj, eventName, callback) {
  if (obj == null) {
    obj = window;
  }
  if (obj.removeEventListener != null) {
    return obj.removeEventListener(eventName, callback, false);
  } else if (obj.detachEvent != null) {
    return obj.detachEvent('on' + eventName, callback);
  }
};

_.isTouchEnabled = function () {
  return 'ontouchstart' in document.documentElement;
};

_.preventDefault = function (e) {
  if (e.preventDefault != null) {
    return e.preventDefault();
  } else {
    return e.returnValue = false;
  }
};

_.mouseButton = function (e) {
  if ('buttons' in e) {
    return e.buttons;
  } else if ('which' in e) {
    return e.which;
  } else {
    return e.button;
  }
};

_.initMouseMove = function () {
  var initDone = false;
  return function () {
    if (!initDone) {
      initDone = true;
      return _.addEventListener(document, 'mousemove', function (e) {
        if (!e.defaultPrevented) {
          var obj = { x: e.clientX, y: e.clientY, which: _.mouseButton(e) };
          rh.model.publish(rh.consts('EVT_MOUSEMOVE'), obj, { sync: true });
          if (obj.defaultPrevented) {
            return _.preventDefault(e);
          }
        }
      });
    }
  };
}();

_.initTouchEvent = function () {
  var initDone = false;
  return function () {
    if (!initDone && _.isTouchEnabled()) {
      var x = void 0,
          y = void 0,
          y1 = void 0;
      initDone = true;
      var x1 = y1 = x = y = 0;

      var calculateDirection = _.debounce(function () {
        var direction = void 0;
        var angle = Math.atan((y1 - y) / (x1 - x));
        if (x1 > x) {
          direction = angle > Math.PI / 4 ? 'down' : angle < -Math.PI / 4 ? 'up' : 'right';
        } else {
          direction = angle > Math.PI / 4 ? 'up' : angle < -Math.PI / 4 ? 'down' : 'left';
        }
        rh.model.publish('.touchmove', { x: x, y: y, x1: x1, y1: y1 });
        rh.model.publish(rh.consts('EVT_SWIPE_DIR'), direction, { sync: true });
        rh.model.publish(rh.consts('EVT_SWIPE_DIR'), null);
        return x = y = 0;
      }, 200);

      return _.addEventListener(document, 'touchmove', function (e) {
        x1 = (e.touches[0] != null ? e.touches[0].pageX : undefined) || 0;
        y1 = (e.touches[0] != null ? e.touches[0].pageY : undefined) || 0;
        if (x === 0 && y === 0) {
          x = x1;
          y = y1;
        }

        calculateDirection();
        return _.preventDefault(e);
      });
    }
  };
}();

},{}],27:[function(require,module,exports){
'use strict';

var _ = window.rh._;

// Regular Expressions

// Ex: @key('wow') => this.publish('key', 'wow');

var publishRegx = /(^|[^\\])@([\w\.]*)\((.*)\)/;

// Ex: x = @key => x = this.get('key');
var getRegx = /(^|[^\\])@([\w\.]*)/;

// Ex: x = @KEY => x = rh.consts('KEY')
var modelConstsRegx = /@([A-Z][_A-Z0-9]*)/;

_.resolvePublish = function (expression) {
  var regex = new RegExp(publishRegx);
  while (true) {
    var match = regex.exec(expression);
    if (!match) {
      break;
    }
    expression = expression.replace(match[0], match[1] + ' this.publish(\'' + match[2] + '\', ' + match[3] + ')');
  }
  return expression;
};

_.resolveGet = function (expression, keys) {
  var regex = new RegExp(getRegx);
  while (true) {
    var match = regex.exec(expression);
    if (!match) {
      break;
    }
    if (keys && -1 === keys.indexOf(match[2])) {
      keys.push(match[2]);
    }
    expression = expression.replace(match[0], match[1] + ' this.get(\'' + match[2] + '\')');
  }
  return expression;
};

_.resolveModelConst = function (expression) {
  var subexp = '';
  var regex = new RegExp(modelConstsRegx);
  while (true) {
    var match = regex.exec(expression);
    if (!match) {
      break;
    }
    var key = rh.consts(match[1]);
    if (key != null) {
      expression = expression.replace(match[0], '@' + key);
    } else {
      var index = match.index + match[1].length + 1;
      subexp += expression.substring(0, index);
      expression = expression.substring(index);
    }
  }
  return subexp + expression;
};

_.resolveModelKeys = function (expression, keys) {
  return this.resolveGet(this.resolvePublish(this.resolveModelConst(expression)), keys);
};

_.isValidModelKey = function (key) {
  if (key === 'true' || key === 'false') {
    return false;
  }
  var match = key.match(/[._a-zA-Z][._a-zA-Z0-9 ]*/);
  return match && match[0] === key;
};

_.isValidModelConstKey = function (key) {
  var match = key.match(/[A-Z][_A-Z0-9]*/);
  return match && match[0] === key;
};

_.get = function (obj, itemKey) {
  var value = void 0;
  var keys = itemKey.split('.');
  for (var index = 0; index < keys.length; index++) {
    var key = keys[index];
    if (index === 0) {
      value = obj[key];
    } else if (value) {
      value = value[key];
    } else {
      break;
    }
  }
  return value;
};

_.isScreenAttached = function (scrrenName) {
  return true === rh.model.get(rh.consts('KEY_SCREEN') + '.' + scrrenName + '.attached');
};

_.parentKey = function (fullKey) {
  var keys = fullKey.split('.');
  keys.pop();
  return keys.join('.');
};

_.lastKey = function (fullKey) {
  var keys = fullKey.split('.');
  return keys[keys.length - 1];
};

_.splitKey = function (fullKey) {
  var keys = fullKey.split('.');
  var key = keys.pop();
  var parentKey = keys.join('.');
  return { key: key, parentKey: parentKey };
};

},{}],28:[function(require,module,exports){
'use strict';

var _ = window.rh._;

//Regular Expressions

//Ex: "abc #{var1}"

var enclosedVarRegx = /\#{([^}]*)\}/g;
var userVarRegx = /\$([_a-zA-Z][_a-zA-Z0-9]*)/g;
var regxStringRegx = /\B\/([^\/]*)\//g;

_.toRegExp = function (str) {
  var regx = void 0;
  if (!str || !_.isString(str)) {
    return str;
  }
  var matches = str.match(regxStringRegx);
  var match = matches && matches[0];
  if (match) {
    var pattern = match.substring(1, match.length - 1);
    var flag = str.substring(match.length);
    regx = new RegExp(pattern, flag);
  }
  return regx || str;
};

_.splitAndTrim = function (string, splitKey) {
  if (string == null) {
    string = '';
  }
  return _.map(string.split(splitKey), function (value) {
    return value.trim();
  });
};

/*
 * Explodes a string based on explodeKey then
 * creates a map using the exploded strings by splitting them further on mapKey
 */
_.explodeAndMap = function (string, explodeKey, mapKey, opts) {
  if (string == null) {
    string = ' ';
  }
  if (opts == null) {
    opts = {};
  }
  var pairs = string.split(explodeKey);
  var regex = new RegExp(mapKey + '(.+)?');
  var map = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Array.from(pairs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rawPair = _step.value;

      var pair = rawPair.split(regex);
      var key = pair[0].trim();
      var value = pair[1];

      if (opts.caseInsensitive) {
        key = key.toLowerCase();
      }
      if (opts.trim) {
        value = value && value.trim();
      }
      if (opts.default != null && value == null) {
        value = opts.default;
      }

      if (key !== '') {
        map[key] = value;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return map;
};

_.resolveNamedVar = function (expr) {
  var matches = void 0;
  if (matches = expr.match(userVarRegx)) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Array.from(matches)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var match = _step2.value;

        expr = expr.replace(match, 'this.user_vars.' + match.substring(1));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
  return expr;
};

_.resolveEnclosedVar = function (expr, callback, context) {
  var matches = void 0;
  if (context == null) {
    context = this;
  }
  if (matches = expr.match(enclosedVarRegx)) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = Array.from(matches)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var match = _step3.value;

        var name = match.substring(2, match.length - 1).trim();
        var value = callback.call(context, name);
        expr = expr.replace(match, value != null ? value : '');
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }
  return expr;
};

// use '.' as attrib name to pass opts for attrs data
_.resolveAttr = function (string) {
  return _.reduce(_.explodeAndMap(string, ';', ':'), function (r, v, k) {
    _.each(k.split(','), function (key) {
      return r[key.trim()] = v;
    });
    return r;
  }, {});
};

_.resolveNiceJSON = function (string) {
  if (string == null) {
    string = '';
  }
  string = string.trim();
  if (!string) {
    return {};
  }
  if (string[0] === '{') {
    return JSON.parse(string);
  } else {
    string = string.replace(/'/g, '"');
    string = '{' + string + '}';
    return JSON.parse(string.replace(/(\{|,)\s*(.+?)\s*:/g, '$1 "$2":'));
  }
};

_.resolvePipedExpression = function (string) {
  if (string == null) {
    string = '';
  }
  var concatNext = false;
  return _.reduce(string.split('|'), function (result, item) {
    var mergedItem = void 0;
    if (concatNext && result.length > 0) {
      mergedItem = result[result.length - 1] + ' ||' + item;
      result.length = result.length - 1;
    }

    concatNext = item.length === 0;
    if (mergedItem) {
      item = mergedItem;
    }

    if (item.length !== 0) {
      result.push(item.trim());
    }
    return result;
  }, []);
};

_.resolveLoopExpr = function (config) {
  var value = config.split(':');
  if (value.length > 1) {
    var vars = _.splitAndTrim(value.shift(), ',');
    return { expr: value[0], index: vars[0], item: vars[1] };
  } else {
    return { expr: value[0] };
  }
};

_.resolveWidgetArgs = function (rawArgs) {
  var pairs = rawArgs.split(';');
  return _.map(pairs, function (pair) {
    var wArg = void 0;
    var pipedArgs = _.resolvePipedExpression(pair);
    var args = pipedArgs.shift() || '';
    args = args.split(/:(.+)?/);
    var wName = args[0].trim();
    var rawArg = pair.substring(wName.length).trim();
    if (rawArg[0] === ':') {
      rawArg = rawArg.substring(1);
    }
    if (wArg = args[1]) {
      if (-1 !== wArg.search(':')) {
        wArg = _.explodeAndMap(wArg, ',', ':', { trim: true });
      } else {
        wArg = { arg: wArg };
      }
    }
    return { wName: wName, wArg: wArg, pipedArgs: pipedArgs, rawArg: rawArg };
  });
};

_.resolveExprOptions = function (rawArgs) {
  var opts = void 0;
  var values = _.resolvePipedExpression(rawArgs);
  if (values[1]) {
    opts = _.resolveNiceJSON(values[1]);
  }
  return { expr: values[0], opts: opts };
};

_.resolveInputKeys = function (rawArgs) {
  var opts = void 0;
  var values = _.resolvePipedExpression(rawArgs);
  if (values[1]) {
    opts = _.resolveNiceJSON(values[1]);
  }
  var keys = _.explodeAndMap(values[0], ',', ':', { trim: true });
  return { keys: keys, opts: opts };
};

_.applyCallbackOptions = function (callback, opts) {
  var newCallback = callback;
  if (opts && opts.debounce) {
    newCallback = _.debounce(newCallback, opts.debounce);
  }

  if (opts && opts.toggleTimeout) {
    newCallback = _.toggleTimeout(newCallback, opts.toggleTimeout);
  }

  if (opts && opts.timeout) {
    newCallback = _.timeout(newCallback, opts.timeout);
  }

  if (opts && opts.defer) {
    newCallback = _.timeout(newCallback, 1);
  }

  return newCallback;
};

_.parseInt = function (string, defaultValue, base) {
  if (base == null) {
    base = 10;
  }
  if (string != null && string !== '') {
    return parseInt(string, base);
  } else if (defaultValue != null) {
    return defaultValue;
  } else {
    return string;
  }
};

},{}],29:[function(require,module,exports){
'use strict';

// to support old browser

if (String.prototype.trim == null) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

if (String.prototype.trimStart == null) {
  String.prototype.trimStart = String.prototype.trimLeft;
}

if (String.prototype.trimEnd == null) {
  String.prototype.trimEnd = String.prototype.trimRight;
}

},{}],30:[function(require,module,exports){
'use strict';

var _ = window.rh._;


_.hasNonAsciiChar = function (str) {
  if (str == null) {
    str = '';
  }return _.any(str, function (ch) {
    return ch.charCodeAt(0) > 127;
  });
};

},{}],31:[function(require,module,exports){
'use strict';

var _ = window.rh._;
var consts = window.rh.consts;


_.mapToEncodedString = function (map, explodeKey, mapKey) {
  if (explodeKey == null) {
    explodeKey = '&';
  }
  if (mapKey == null) {
    mapKey = '=';
  }
  return _.reduce(map, function (result, value, key) {
    if (value != null) {
      if (result.length > 0) {
        result += explodeKey;
      }
      result += '' + key + mapKey + encodeURIComponent(value);
    }
    return result;
  }, '');
};

_.encodedStringToMap = function (string, explodeKey, mapKey) {
  if (explodeKey == null) {
    explodeKey = '&';
  }
  if (mapKey == null) {
    mapKey = '=';
  }
  var map = _.explodeAndMap(string, explodeKey, mapKey, { default: '' });
  _.each(map, function (value, key) {
    return map[key] = decodeURIComponent(value);
  });
  return map;
};

_.urlParams = function (query) {
  if (query == null) {
    query = location.search.substring(1);
  }
  return _.encodedStringToMap(query);
};

_.urlParam = function (key, query) {
  if (query == null) {
    query = location.search.substring(1);
  }
  return key && _.urlParams(query)[key];
};

_.hashParams = function (hash) {
  if (hash == null) {
    hash = location.hash.substring(1);
  }
  return _.encodedStringToMap(hash);
};

_.hashParam = function (key) {
  return key && _.hashParams()[key];
};

_.updateHashMap = function (changeMap, addToHistory) {
  var newMap = _.extend({}, _.hashParams(), changeMap);
  var hash = _.mapToEncodedString(newMap);
  if (hash.length > 0) {
    hash = '#' + hash;
  }

  if (addToHistory) {
    return location.hash = hash;
  } else if (hash !== '' && location.hash !== hash) {
    return location.replace(hash);
  }
};

_.queueUpdateHashMap = function (hashMap, addToHistory) {
  return _.defer(function () {
    return _.updateHashMap(hashMap, addToHistory);
  });
};

_.stripStringBetween = function (str, startChar, endChar) {
  var newStr = void 0;
  var start = str.indexOf(startChar);
  if (start !== -1) {
    var end = str.indexOf(endChar);
    if (end < start) {
      end = str.length;
    }
    newStr = '' + str.substring(0, start) + str.substring(end, str.length);
  }
  return newStr || str;
};

_.stripParam = function (url) {
  if (url == null) {
    url = document.location.href;
  }
  return _.stripStringBetween(url, '?', '#');
};

_.stripBookmark = function (url) {
  if (url == null) {
    url = document.location.href;
  }
  return _.stripStringBetween(url, '#', '?');
};

_.extractStringBetween = function (str, startChar, endChar) {
  var substring = void 0;
  var start = str.indexOf(startChar);
  if (start !== -1) {
    var end = str.indexOf(endChar);
    if (end < start) {
      end = str.length;
    }
    substring = str.substring(start + 1, end);
  }
  return substring || '';
};

_.extractParamString = function (url) {
  if (url == null) {
    url = document.location.href;
  }
  return _.extractStringBetween(url, '?', '#');
};

_.extractHashString = function (url) {
  if (url == null) {
    url = document.location.href;
  }
  return _.extractStringBetween(url, '#', '?');
};

//#####
// pathTraverseTo(fromPath, toPath)
// Takes in two absolute paths and simulates
// traversal from fromPath to toPath.
// Returns the steps neeed to traverse from
// fromPath to toPath.
//#####
// TODO: Complete this method
_.traverseToPath = function (fromPath, toPath) {
  return '';
};

var processPathUnit = function processPathUnit(fullPath, pathUnit, separator) {
  if (separator == null) {
    separator = '/';
  }
  switch (pathUnit) {
    case '.':
      return fullPath;
    case '..':
      return fullPath.substring(0, fullPath.lastIndexOf(separator));
    default:
      return fullPath + separator + pathUnit;
  }
};

//#####
// pathTraverseBy(fromPath, traverseBy)
// Takes in two path components and simulates
// traversal from fromPath by traverseBy.
// Returns the resulting path after the traversal.
// Eg: 'C:/a/b/c/', '../../' retuns 'C:/a/'
//#####
_.traverseByPath = function (fromPath, traverseBy, separator) {
  if (separator == null) {
    separator = '/';
  }
  fromPath = fromPath.substring(0, fromPath.lastIndexOf(separator));
  var parts = traverseBy.split(separator);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Array.from(parts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var part = _step.value;

      if (part.length > 0) {
        fromPath = processPathUnit(fromPath, part, separator);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return fromPath + separator;
};

_.scheme = function (url) {
  var scheme = void 0;
  var index = url.indexOf(':');
  if (index !== -1) {
    scheme = url.substring(0, index + 1).toLowerCase().trim();
  }
  return scheme;
};

_.protocol = function (url) {
  var protocol = void 0;
  var index = url.trim().indexOf(':');
  if (index !== -1) {
    protocol = url.substring(0, index + 1).toLowerCase();
  }
  if (protocol) {
    var match = protocol.match(/^[a-z]+:/);
    if (!match || match[0].length !== protocol.length) {
      protocol = undefined;
    }
  }
  return protocol;
};

_.isInternal = function (urlName) {
  return urlName.indexOf('//') !== 0 && urlName.indexOf('/&#47;') !== 0 && urlName.indexOf('&#47;/') !== 0 && urlName.indexOf('&#47;&#47;') !== 0;
};

_.isJavaScriptUrl = function (url) {
  return 'javascript:' === _.scheme(url);
};

_.isRelativeUrl = function (url) {
  return !_.scheme(url) && url.trim().indexOf('/');
};

_.isValidFileUrl = function (url) {
  if (url[0] === '#') {
    return false;
  }
  var scheme = _.scheme(url);
  return !scheme || ['http:', 'https:', 'ftp:', 'file:'].indexOf(scheme) !== -1;
};

_.makeRelativeUrl = function (absUrl, baseUrl) {
  if (baseUrl == null) {
    baseUrl = decodeURI(document.location.href);
  }
  if (absUrl === baseUrl) {
    return '';
  }
  var absPath = _.filePath(absUrl);
  var basePath = _.filePath(baseUrl);
  var relPath = _.makeRelativePath(absPath, basePath);
  return '' + relPath + absUrl.substring(absPath.length);
};

_.makeRelativePath = function (absUrl, baseUrl) {
  var relUrl = void 0;
  if (baseUrl == null) {
    baseUrl = _.filePath();
  }
  if (absUrl && !_.isRelativeUrl(absUrl) && !_.isRelativeUrl(baseUrl)) {
    var srcParts = absUrl.split('/');
    var baseParts = baseUrl.split('/');
    var idx = 0;
    while (true) {
      if (srcParts.length === idx || baseParts.length === idx) {
        break;
      }
      if (srcParts[idx] !== baseParts[idx]) {
        break;
      }
      idx++;
    }

    var relParts = srcParts.slice(idx);
    relUrl = '';
    var dotdotcount = baseParts.length - idx - 1;
    while (true) {
      if (dotdotcount <= 0) {
        break;
      }
      relUrl += '../';
      dotdotcount--;
    }
    relUrl += relParts.join('/');
  } else {
    relUrl = absUrl;
  }
  return relUrl;
};

_.makeFullUrl = function (relUrl, parentPath) {
  if (parentPath == null) {
    parentPath = rh._.parentPath();
  }
  if (_.isRelativeUrl(relUrl)) {
    return window._getFullPath(parentPath, relUrl);
  } else {
    return relUrl;
  }
};

_.isLocal = function () {
  return window.location.protocol === 'file:';
};

_.isRemote = function () {
  return window.location.protocol !== 'file:';
};

var curOrigin = null;
_.isSameOrigin = function (origin) {
  if (_.isLocal()) {
    return true;
  }
  var _window = window,
      location = _window.location;

  if (curOrigin == null) {
    curOrigin = location.origin;
  }
  if (curOrigin == null) {
    curOrigin = location.protocol + '//' + location.hostname;
    if (location.port) {
      curOrigin += ':' + location.port;
    }
  }
  return curOrigin === origin;
};

_.filePath = function (url) {
  if (url == null) {
    url = decodeURI(document.location.href);
  }
  var index = url.indexOf('?');
  if (index !== -1) {
    url = url.substring(0, index);
  }
  index = url.indexOf('#');
  if (index !== -1) {
    url = url.substring(0, index);
  }
  return url;
};

_.parentPath = function (filePath) {
  if (filePath == null) {
    filePath = _.filePath();
  }
  var index = filePath.lastIndexOf('/');
  if (index !== -1) {
    filePath = filePath.substring(0, index + 1);
  }
  return filePath;
};

_.getFileName = function (absUrl) {
  var filePath = _.filePath(absUrl);
  var idx = filePath.lastIndexOf('/');
  var fiileName = idx !== -1 ? filePath.substring(idx + 1) : filePath;
  return fiileName || '';
};

_.getFileExtention = function (absUrl) {
  var ext = void 0;
  var fiileName = _.getFileName(absUrl);
  var idx = fiileName != null ? fiileName.lastIndexOf('.') : undefined;
  if (idx !== -1) {
    ext = fiileName.substring(idx);
  }
  return ext || '';
};

},{}],32:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (window.rh == null) {
  window.rh = {};
}
var _window = window,
    rh = _window.rh;

if (rh._ == null) {
  rh._ = {};
}
rh.util = rh._;
var _ = rh._;


var nativeForEach = Array.prototype.forEach;
var nativeKeys = Object.keys;
var hasOwnProperty = Object.prototype.hasOwnProperty;


_.time = function () {
  return new Date().getTime();
};

_.delay = function (fn, wait) {
  var args = [];var i = 1;
  while (++i < arguments.length) {
    args.push(arguments[i]);
  }
  return setTimeout(function () {
    return fn.apply(null, args);
  }, wait);
};

_.defer = function (fn) {
  var args = [];var i = 0;
  while (++i < arguments.length) {
    args.push(arguments[i]);
  }
  return this.delay.apply(this, [fn, 1].concat(args));
};

_.debounce = function (fn, threshold, execAsap) {
  var timeout = null;
  return function () {
    var args = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Array.from(arguments)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var arg = _step.value;
        args.push(arg);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var obj = this;
    var delayed = function delayed() {
      if (!execAsap) {
        fn.apply(obj, args);
      }
      return timeout = null;
    };
    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      fn.apply(obj, args);
    }
    return timeout = setTimeout(delayed, threshold || 100);
  };
};

_.throttle = function (fn, threshold) {
  var timeout = null;
  var fnExecuted = false;
  return function () {
    var args = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Array.from(arguments)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var arg = _step2.value;
        args.push(arg);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var obj = this;
    var delayed = function delayed() {
      if (!fnExecuted) {
        fn.apply(obj, args);
      }
      return timeout = null;
    };
    if (timeout) {
      clearTimeout(timeout);
      fnExecuted = false;
    } else {
      fn.apply(obj, args);
      fnExecuted = true;
    }

    return timeout = setTimeout(delayed, threshold || 100);
  };
};

_.timeout = function (fn, wait) {
  return function () {
    var args = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = Array.from(arguments)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var arg = _step3.value;
        args.push(arg);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var obj = this;
    var delayed = function delayed() {
      return fn.apply(obj, args);
    };
    return setTimeout(delayed, wait);
  };
};

_.toggleTimeout = function (fn, wait, toggle) {
  return function () {
    var args = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = Array.from(arguments)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var arg = _step4.value;
        args.push(arg);
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    var obj = this;
    var delayed = function delayed() {
      return fn.apply(obj, args);
    };
    if (toggle) {
      if (rh._debug) {
        args.push(_.stackTrace());
      }
      setTimeout(delayed, wait);
    } else {
      delayed();
    }
    return toggle = !toggle;
  };
};

// Object methods

_.has = function (obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
};

_.keys = function (obj) {
  var keys = [];
  if (!_.isObject(obj)) {
    return keys;
  }
  if (nativeKeys) {
    return nativeKeys(obj);
  }
  for (var key in obj) {
    if (_.has(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};

//Iterators

_.any = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  if (obj == null) {
    return false;
  }
  var keys = obj.length !== +obj.length && _.keys(obj);

  var _ref = keys || obj,
      length = _ref.length;

  var index = 0;
  while (true) {
    if (index >= length) {
      break;
    }
    var key = keys ? keys[index] : index;
    if (fn.call(context, obj[key], key, obj)) {
      return true;
    }
    index++;
  }
  return false;
};

_.each = function (obj, fn, context) {
  var value = void 0;
  if (context == null) {
    context = this;
  }
  if (obj == null) {
    return;
  }
  if (nativeForEach === obj.forEach) {
    obj.forEach(fn, context);
  } else if (obj.length === +obj.length) {
    for (var index = 0; index < obj.length; index++) {
      value = obj[index];fn.call(context, value, index, obj);
    }
  } else {
    for (var key in obj) {
      value = obj[key];fn.call(context, value, key, obj);
    }
  }
  return obj;
};

_.map = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  var result = [];
  _.each(obj, function (value, key, obj) {
    return result.push(fn.call(context, value, key, obj));
  });
  return result;
};

_.reduce = function (obj, fn, initial, context) {
  if (context == null) {
    context = this;
  }
  _.each(obj, function (value, key) {
    return initial = fn.call(context, initial, value, key);
  });
  return initial;
};

_.find = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  var result = undefined;
  _.any(obj, function (value, key, obj) {
    if (fn.call(context, value, key, obj)) {
      result = value;
      return true;
    }
  });
  return result;
};

_.findIndex = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  var result = -1;
  _.any(obj, function (value, key, obj) {
    if (fn.call(context, value, key, obj)) {
      result = key;
      return true;
    }
  });
  return result;
};

_.findParentNode = function (node, rootNode, fn, context) {
  if (rootNode == null) {
    rootNode = document;
  }
  if (context == null) {
    context = this;
  }
  var result = null;
  while (true) {
    if (!node || node === rootNode) {
      break;
    }
    if (fn.call(context, node)) {
      result = node;
      break;
    }
    node = node.parentNode;
  }
  return result;
};

_.filter = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  var result = [];
  _.each(obj, function (value, key, obj) {
    if (fn.call(context, value, key, obj)) {
      return result.push(value);
    }
  });
  return result;
};

_.flatten = function (obj) {
  return _.reduce(obj, function (result, elem) {
    return result.concat(elem);
  }, []);
};

_.unique = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  if (fn) {
    obj = _.map(obj, fn, context);
  }
  return _.filter(obj, function (value, index) {
    return obj.indexOf(value) === index;
  });
};

_.union = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  if (fn) {
    obj = _.map(obj, fn, context);
  }
  return _.unique(_.flatten(obj));
};

_.count = function (obj, fn, context) {
  if (context == null) {
    context = this;
  }
  var count = 0;
  _.each(obj, function (value, key, obj) {
    if (fn.call(context, value, key, obj)) {
      return count++;
    }
  });
  return count;
};

_.extend = function (obj, oldObj, newObj) {
  if (oldObj) {
    _.each(oldObj, function (value, key) {
      return obj[key] = value;
    });
  }
  if (newObj) {
    _.each(newObj, function (value, key) {
      return obj[key] = value;
    });
  }
  return obj;
};

_.addPathNameKey = function (obj) {
  return _.extend(obj, { 'pathname': decodeURIComponent(window.location.pathname) });
};

_.clone = function (obj) {
  if (!_.isObject(obj)) {
    return obj;
  }
  return _.reduce(obj, function (result, value, key) {
    result[key] = _.clone(value);
    return result;
  }, {});
};

_.compact = function (array) {
  return _.filter(array, function (item) {
    return item;
  });
};

_.compactObject = function (obj) {
  if (obj == null) {
    obj = {};
  }
  return _.reduce(obj, function (result, value, key) {
    if (value != null) {
      if (_.isObject(value)) {
        value = _.compactObject(value);
        if (!_.isEmptyObject(value)) {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }, {});
};

_.isString = function (value) {
  return typeof value === 'string';
};

_.isFunction = function (value) {
  return typeof value === 'function';
};

_.isObject = function (value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
};

_.isDefined = function (value) {
  return value !== null && value !== undefined;
};

_.isEmptyString = function (value) {
  return value.length === 0;
};

_.isUsefulString = function (value) {
  return _.isDefined(value) && !_.isEmptyString(value);
};

_.isEmptyObject = function (value) {
  return Object.keys(value).length === 0;
};

_.isEqual = function (obj1, obj2) {
  if ((typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) !== (typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2))) {
    return false;
  }
  if (!_.isDefined(obj1) || !_.isDefined(obj2)) {
    return obj1 === obj2;
  }

  switch (typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) {
    case 'object':
      return _.isEqualObject(obj1, obj2);
    case 'array':
      return !_.any(obj1, function (value, index) {
        return !_.isEqual(value, obj2[index]);
      });
    default:
      return obj1 === obj2;
  }
};

_.isEqualObject = function (obj1, obj2) {
  var keys1 = _.filter(_.keys(obj1), function (key) {
    return obj1[key] !== undefined;
  });
  var keys2 = _.filter(_.keys(obj2), function (key) {
    return obj2[key] !== undefined;
  });
  if (keys1.length !== keys2.length) {
    return false;
  }
  return !_.any(keys1, function (key) {
    return !_.isEqual(obj1[key], obj2[key]);
  });
};

_.isZeroCSSValue = function (value) {
  return value === '0' || value === '0px' || value === '0em' || value === '0%';
};

//Helper methods

(function () {
  var localDB = void 0;
  try {
    localStorage.setItem('testLocalDB', true);
    localDB = localStorage.getItem('testLocalDB') != null;
    localStorage.removeItem('testLocalDB');
  } catch (error) {
    localDB = false;
  }

  return _.canUseLocalDB = function () {
    return localDB;
  };
})();

_.isIframe = function () {
  return parent !== window;
};

_.loadScript = function (jsPath) {
  var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var onload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var autodelete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = async === true;
  script.src = jsPath;
  script.onerror = script.onload = function (args) {
    if (autodelete) {
      document.body.removeChild(script);
    }
    return onload && onload.apply(null, args);
  };

  return document.body.appendChild(script);
};

(function () {
  var randomStr = function randomStr() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(32).substring(1);
  };

  return _.uniqueId = function () {
    return _.time().toString(32) + '_' + randomStr() + randomStr() + randomStr();
  };
})();

_.one = function (fn) {
  return function () {
    if ('function' === typeof fn) {
      var fn1 = fn;
      fn = null;
      return fn1.apply(this, arguments);
    }
  };
};

_.cache = function (isValid, cache) {
  if (cache == null) {
    cache = {};
  }
  return function (name, value) {
    if (arguments.length === 1) {
      return cache[name];
    } else if (!isValid || isValid(value)) {
      return cache[name] = value;
    }
  };
};

_.memoize = function (generator, cache) {
  if (cache == null) {
    cache = {};
  }
  return function () {
    var fullkey = void 0;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = Array.from(arguments)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var arg = _step5.value;

        var key = _.isString(arg) ? arg : JSON.stringify(arg);
        fullkey = fullkey != null ? fullkey + ', ' + key : key;
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    if (fullkey in cache) {
      return cache[fullkey];
    } else {
      return cache[fullkey] = generator.apply(this, arguments);
    }
  };
};

// last argument of generator function should be callback function
_.memoizeAsync = function (generator, cache) {
  if (cache == null) {
    cache = {};
  }
  return function () {
    var callback = void 0;
    var args = [];
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = Array.from(arguments)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var arg = _step6.value;
        args.push(arg);
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    if (args.length > 1) {
      callback = args.pop();
    }
    var fullkey = args.join(', ');
    if (fullkey in cache) {
      return typeof callback === 'function' ? callback(cache[fullkey]) : undefined;
    } else {
      args.push(function (data) {
        cache[fullkey] = data;
        return typeof callback === 'function' ? callback(data) : undefined;
      });
      return generator.apply(this, args);
    }
  };
};

_.require = _.memoizeAsync(function (jsPath, callback) {
  return _.loadScript(jsPath, true, function () {
    return callback(_.exports());
  });
});

(function () {
  var cache = undefined;
  return _.exports = function (value) {
    var retValue = cache;
    cache = value != null ? value : undefined;
    return retValue;
  };
})();

},{}],33:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;

var util = rh._;
var $ = rh.$;


var dataWidget = function dataWidget(attr) {
    var DataWidget = function (_rh$Widget) {
        _inherits(DataWidget, _rh$Widget);

        _createClass(DataWidget, [{
            key: "toString",
            value: function toString() {
                return attr + "_" + this._count;
            }
        }], [{
            key: "initClass",
            value: function initClass() {

                this.prototype.dataAttrMethods = function () {
                    var map = {};
                    map["data-" + attr] = "data_" + attr;
                    return map;
                }();
            }
        }]);

        function DataWidget(opts) {
            _classCallCheck(this, DataWidget);

            // Use global model unless someone gives you in javascript
            var _this = _possibleConstructorReturn(this, (DataWidget.__proto__ || Object.getPrototypeOf(DataWidget)).call(this, opts));

            if (_this.model == null) {
                _this.model = rh.model;
            }
            $.dataset(_this.node, attr, opts.rawArg);
            return _this;
        }

        _createClass(DataWidget, [{
            key: "init",
            value: function init(parent) {
                if (this.initDone) {
                    return;
                }
                this.initDone = true;
                this.initParent(parent);
                this.initUI();
                return this.resolveDataAttrs(this.node);
            }
        }]);

        return DataWidget;
    }(rh.Widget);

    DataWidget.initClass();

    return DataWidget;
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = Array.from(rh.Widget.prototype.dataAttrs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attr = _step.value;
        window.rh.widgets[attr] = dataWidget(attr);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

},{}],34:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;

var util = rh._;
var $ = rh.$;

var Global = function (_rh$Widget) {
  _inherits(Global, _rh$Widget);

  function Global(opts) {
    _classCallCheck(this, Global);

    var _this = _possibleConstructorReturn(this, (Global.__proto__ || Object.getPrototypeOf(Global)).call(this, opts));

    if (_this.model == null) {
      _this.model = rh.model;
    }
    return _this;
  }

  return Global;
}(rh.Widget);

window.rh.widgets.Global = Global;

},{}],35:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var Widget = rh.Widget;

var List = function (_Widget) {
  _inherits(List, _Widget);

  _createClass(List, null, [{
    key: 'initClass',
    value: function initClass() {

      this.prototype.dataIAttrs = ['child'].concat(Widget.prototype.dataIAttrs);
      this.prototype.dataIAttrMethods = function () {
        return Widget.prototype.mapDataAttrMethods(List.prototype.dataIAttrs);
      }();

      this.prototype.supportedArgs = ['node', 'model', 'key', 'user_vars', 'filter', 'spliton', 'path', 'tplNode', 'tplChildNodes'];
    }
  }]);

  function List(opts) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, opts));

    _this.reRender = _this.reRender.bind(_this);
    _this.renderChunck = _this.renderChunck.bind(_this);

    if (_this.key == null) {
      _this.key = '_' + _this;
    }
    if (_this.path == null) {
      _this.path = [];
    }
    if (_this.children == null) {
      _this.children = [];
    }
    if (_this.user_vars == null) {
      _this.user_vars = {};
    }
    _this.useTemplate = true;
    _this.renderedIndex = 0;
    _this.renderedCount = 0;
    return _this;
  }

  _createClass(List, [{
    key: 'init',
    value: function init(parent) {
      if (this.initDone) {
        return;
      }
      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'init', this).call(this, parent);
      this.subscribeOnly(this.key, this.reRender, { partial: false });
      this.subscribeExpr(this.keyexpr, function (result) {
        if (result == null) {
          result = [];
        }return this.publish(this.key, result, { sync: true });
      });
      return this.subscribeOnly(this.opts.loadmore, this.renderChunck);
    }
  }, {
    key: 'parseOpts',
    value: function parseOpts(opts) {
      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'parseOpts', this).call(this, opts);
      if (this.key) {
        if (_.isValidModelConstKey(this.key)) {
          this.key = consts(this.key);
        }
        if (!_.isValidModelKey(this.key)) {
          this.keyexpr = this.key;
          return this.key = null;
        }
      }
    }
  }, {
    key: 'parsePipedArg',
    value: function parsePipedArg() {
      var args = this.opts.pipedArgs;
      if (args != null ? args.shift : undefined) {
        var arg = void 0;
        if (arg = args.shift()) {
          this.filter = arg;
        }
        if (arg = args.shift()) {
          this.spliton = arg;
        }
      }

      if (_.isString(this.filter)) {
        this.filter = this.listItemExpr(this.filter);
      }
      if (_.isString(this.spliton)) {
        return this.spliton = this.listItemExpr(this.spliton);
      }
    }
  }, {
    key: 'notifyLoading',
    value: function notifyLoading(value) {
      if (this.opts.loading) {
        return this.publish(this.opts.loading, value);
      }
    }
  }, {
    key: 'listItemExpr',
    value: function listItemExpr(expr) {
      return this._evalFunction('item, index', expr);
    }
  }, {
    key: 'isWidgetNode',
    value: function isWidgetNode(node) {
      return _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'isWidgetNode', this).apply(this, arguments) || $.dataset(node, 'child');
    }
  }, {
    key: 'reRender',
    value: function reRender(render) {
      this.data = null;
      this.renderedIndex = 0;
      this.renderedCount = 0;
      return _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'reRender', this).call(this, render);
    }
  }, {
    key: 'preRender',
    value: function preRender() {
      var _this2 = this;

      var node = void 0;
      var oldNode = this.node;
      if (this.tplChildNodes == null) {
        this.tplChildNodes = function () {
          var result = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Array.from(_this2.tplNode.childNodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              node = _step.value;
              result.push(node);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return result;
        }();
      }

      this.node = this.tplNode.cloneNode(false);
      return oldNode;
    }
  }, {
    key: 'alterNodeContent',
    value: function alterNodeContent() {
      if (this.data == null) {
        this.data = this.get(this.key) || [];
      }
      return this.renderChunck();
    }
  }, {
    key: 'renderChunck',
    value: function renderChunck() {
      var i = void 0;
      var end = void 0;
      this.notifyLoading(false);
      for (i = this.renderedIndex, end = this.data.length - 1; i <= end; i++) {
        var item = this.data[i];
        if (this.filter && !this.filter(item, i)) {
          continue;
        }
        if (this.spliton && i !== this.renderedIndex && this.spliton(item, this.renderedCount)) {
          this.notifyLoading(true);
          break;
        } else {
          this.renderOneItem(item, i);
        }
      }
      this.renderedIndex = i;
      if (this.renderedCount === 0) {
        this.hide();
      } else if (!this.isVisible()) {
        this.show();
      }
      if (this.opts.loaded && i === this.data.length) {
        return this.publish(this.opts.loaded, true);
      }
    }
  }, {
    key: 'renderOneItem',
    value: function renderOneItem(item, index) {
      this.renderedIndex = index;
      var generateindex = this.opts.generateindex || rh._debug;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.from(this.tplChildNodes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var node = _step2.value;

          var newNode;
          if (newNode = this.resolve_rif(node, item, index)) {
            if (incremented == null) {
              this.renderedCount++;
              var incremented = true;
            }
            if (generateindex) {
              $.dataset(newNode, 'listindex', this.renderedCount - 1);
            }
            if (newNode.hasChildNodes()) {
              this.renderChildList(newNode, item, index);
            }
            this.node.appendChild(newNode);
            this.resolveItemIndex(newNode, item, index);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'convertToListContainer',
    value: function convertToListContainer(node) {}
  }, {
    key: '_pathId',
    value: function _pathId(index) {
      var id = '_';
      id += this.path.join('_');
      if (index != null) {
        if (this.path.length > 0) {
          id += '_';
        }
        id += index;
      }
      return id;
    }
  }, {
    key: '_pathKey',
    value: function _pathKey(subpath) {
      if (subpath == null) {
        subpath = '';
      }
      subpath = subpath.toString();
      var path = this.path.join('.');
      if (subpath.length > 0 && path.length > 0) {
        return '.' + path + '.' + subpath;
      } else if (subpath.length > 0) {
        return '.' + subpath;
      } else {
        return '.' + path;
      }
    }

    /*
     * @path: unique path for list
     * @ppath: unique path of parent
     */

  }, {
    key: 'resolveRepeatVar',
    value: function resolveRepeatVar(expr, item, index, cache, node) {
      var _this3 = this;

      return cache[expr] = cache[expr] || function () {
        switch (expr) {
          case '@itemkey':
            return _this3.key + '.' + index;
          case '@key':
            return _this3.key;
          case '@id':
            return _this3._pathId(index);
          case '@pid':
            return _this3._pathId();
          case '@path':
            return _this3._pathKey(index);
          case '@ppath':
            return _this3._pathKey();
          case '@level':
            return _this3.path.length;
          default:
            return _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'resolveRepeatVar', _this3).call(_this3, expr, item, index, cache, node);
        }
      }();
    }
  }, {
    key: 'data_child',
    value: function data_child(node, rawExpr, item, index, attrsInfo) {
      if (!_.isValidModelKey(rawExpr)) {
        $.dataset(node, 'child', this.subscribeIDataExpr(node, rawExpr, item, index));
      }
      return false;
    }

    /*
     * it can be key or expression
     * data-child="value"
     * data-child="@.p.value"
     */

  }, {
    key: 'renderChildList',
    value: function renderChildList(node, item, index) {
      return $.eachDataNode(node, 'child', function (childNode, value) {
        this.convertToListContainer(node);
        this.resolveItemIndex(childNode, item, index);

        value = $.dataset(childNode, 'child'); //get updated value
        if (value === 'undefined' || value === '') {
          return childNode.parentNode.removeChild(childNode);
        } else {
          var args = value.split('|');
          var filter = args[1];
          var childkey = args[0];

          var childList = new List({
            node: childNode,
            model: this.model,
            key: childkey,
            user_vars: this.user_vars,
            path: this.path.concat([this.renderedCount - 1]),
            filter: filter,
            tplNode: childNode.cloneNode(false),
            tplChildNodes: this.tplChildNodes
          });

          childList.init(this);
          return this.children.push(childList);
        }
      }, this);
    }
  }]);

  return List;
}(Widget);

List.initClass();

window.rh.widgets.List = List;

},{}],36:[function(require,module,exports){
"use strict";

require("../lib/rh");
require("../../lenient_src/utils/utils");
require("../../lenient_src/common/query");
require("../../lenient_src/utils/url_utils");

},{"../../lenient_src/common/query":14,"../../lenient_src/utils/url_utils":31,"../../lenient_src/utils/utils":32,"../lib/rh":41}],37:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require('../../lib/rh');

var OnLoad = function OnLoad(widget, node, rawExpr) {
  _classCallCheck(this, OnLoad);

  var _widget$resolveRawExp = widget.resolveRawExprWithValue(rawExpr),
      callback = _widget$resolveRawExp.callback;

  node.onload = function () {
    return callback.call(widget);
  };
};

rh.registerDataAttr('onload', OnLoad);

},{"../../lib/rh":41}],38:[function(require,module,exports){
"use strict";

require("../lib/rh");
require("../../lenient_src/utils/shim");
require("../../lenient_src/utils/parse_utils");
require("../../lenient_src/utils/debug_utils");
require("../../lenient_src/utils/event_utils");
require("../../lenient_src/utils/model_utils");
require("../../lenient_src/utils/unicode_utils");
require("../../lenient_src/common/debug");
require("../../lenient_src/common/consts");
require("../../lenient_src/common/model");
require("../../lenient_src/common/data_util");
require("../../lenient_src/common/guard");
require("../../lenient_src/common/plugin");
require("../../lenient_src/common/console");
require("../../lenient_src/common/widget");
require("../../lenient_src/common/init");
require("../../lenient_src/common/message");
require("../../lenient_src/common/iframe");
require("../../lenient_src/common/storage");
require("../../lenient_src/common/responsive");
require("../../lenient_src/common/screen");
require("../../lenient_src/common/node_holder");
require("../../lenient_src/common/controller");
require("../../lenient_src/common/http");
require("../../lenient_src/data_attributes/data_attr");
require("../../lenient_src/data_attributes/resize");
require("../../lenient_src/data_attributes/table");
require("../../lenient_src/data_attributes/table_recursive");
require("../../lenient_src/widgets/global");
require("../../lenient_src/widgets/list");
require("../../lenient_src/widgets/data_widgets");
require("./data_attributes/onload");
require("./utils/operator_search");
require("./utils/collections");
require("../../lenient_src/indigo/handlers");
require("../../lenient_src/common/rhs");

},{"../../lenient_src/common/console":1,"../../lenient_src/common/consts":2,"../../lenient_src/common/controller":3,"../../lenient_src/common/data_util":4,"../../lenient_src/common/debug":5,"../../lenient_src/common/guard":6,"../../lenient_src/common/http":7,"../../lenient_src/common/iframe":8,"../../lenient_src/common/init":9,"../../lenient_src/common/message":10,"../../lenient_src/common/model":11,"../../lenient_src/common/node_holder":12,"../../lenient_src/common/plugin":13,"../../lenient_src/common/responsive":15,"../../lenient_src/common/rhs":16,"../../lenient_src/common/screen":17,"../../lenient_src/common/storage":18,"../../lenient_src/common/widget":19,"../../lenient_src/data_attributes/data_attr":20,"../../lenient_src/data_attributes/resize":21,"../../lenient_src/data_attributes/table":22,"../../lenient_src/data_attributes/table_recursive":23,"../../lenient_src/indigo/handlers":24,"../../lenient_src/utils/debug_utils":25,"../../lenient_src/utils/event_utils":26,"../../lenient_src/utils/model_utils":27,"../../lenient_src/utils/parse_utils":28,"../../lenient_src/utils/shim":29,"../../lenient_src/utils/unicode_utils":30,"../../lenient_src/widgets/data_widgets":33,"../../lenient_src/widgets/global":34,"../../lenient_src/widgets/list":35,"../lib/rh":41,"./data_attributes/onload":37,"./utils/collections":39,"./utils/operator_search":40}],39:[function(require,module,exports){
"use strict";

},{}],40:[function(require,module,exports){
"use strict";

var rh = require('../../lib/rh');
var _ = rh._;
_.isAND = function (a_strOp, enableOperatorSearch) {
  return enableOperatorSearch && (a_strOp === "and" || a_strOp === "&" || a_strOp === "AND") || a_strOp === "\xACand\xAC";
};

_.isOR = function (a_strOp, enableOperatorSearch) {
  return enableOperatorSearch && (a_strOp === "or" || a_strOp === "|" || a_strOp === "OR");
};

_.isNOT = function (a_strOp, enableOperatorSearch) {
  return enableOperatorSearch && (a_strOp === "not" || a_strOp === "~" || a_strOp === "NOT");
};

_.isOperator = function (strOp, enableOperatorSearch) {
  if (strOp === "\xACand\xAC" || enableOperatorSearch && (strOp === "and" || strOp === "or" || strOp === "not")) {
    return true;
  }
  return false;
};

},{"../../lib/rh":41}],41:[function(require,module,exports){
(function (global){
"use strict";

//Gunjan
if (global.rh === undefined) {
  global.rh = {};
}

module.exports = global.rh;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[36,38])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsZW5pZW50X3NyYy9jb21tb24vY29uc29sZS5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi9jb25zdHMuanMiLCJsZW5pZW50X3NyYy9jb21tb24vY29udHJvbGxlci5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi9kYXRhX3V0aWwuanMiLCJsZW5pZW50X3NyYy9jb21tb24vZGVidWcuanMiLCJsZW5pZW50X3NyYy9jb21tb24vZ3VhcmQuanMiLCJsZW5pZW50X3NyYy9jb21tb24vaHR0cC5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi9pZnJhbWUuanMiLCJsZW5pZW50X3NyYy9jb21tb24vaW5pdC5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi9tZXNzYWdlLmpzIiwibGVuaWVudF9zcmMvY29tbW9uL21vZGVsLmpzIiwibGVuaWVudF9zcmMvY29tbW9uL25vZGVfaG9sZGVyLmpzIiwibGVuaWVudF9zcmMvY29tbW9uL3BsdWdpbi5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi9xdWVyeS5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi9yZXNwb25zaXZlLmpzIiwibGVuaWVudF9zcmMvY29tbW9uL3Jocy5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi9zY3JlZW4uanMiLCJsZW5pZW50X3NyYy9jb21tb24vc3RvcmFnZS5qcyIsImxlbmllbnRfc3JjL2NvbW1vbi93aWRnZXQuanMiLCJsZW5pZW50X3NyYy9kYXRhX2F0dHJpYnV0ZXMvZGF0YV9hdHRyLmpzIiwibGVuaWVudF9zcmMvZGF0YV9hdHRyaWJ1dGVzL3Jlc2l6ZS5qcyIsImxlbmllbnRfc3JjL2RhdGFfYXR0cmlidXRlcy90YWJsZS5qcyIsImxlbmllbnRfc3JjL2RhdGFfYXR0cmlidXRlcy90YWJsZV9yZWN1cnNpdmUuanMiLCJsZW5pZW50X3NyYy9pbmRpZ28vaGFuZGxlcnMuanMiLCJsZW5pZW50X3NyYy91dGlscy9kZWJ1Z191dGlscy5qcyIsImxlbmllbnRfc3JjL3V0aWxzL2V2ZW50X3V0aWxzLmpzIiwibGVuaWVudF9zcmMvdXRpbHMvbW9kZWxfdXRpbHMuanMiLCJsZW5pZW50X3NyYy91dGlscy9wYXJzZV91dGlscy5qcyIsImxlbmllbnRfc3JjL3V0aWxzL3NoaW0uanMiLCJsZW5pZW50X3NyYy91dGlscy91bmljb2RlX3V0aWxzLmpzIiwibGVuaWVudF9zcmMvdXRpbHMvdXJsX3V0aWxzLmpzIiwibGVuaWVudF9zcmMvdXRpbHMvdXRpbHMuanMiLCJsZW5pZW50X3NyYy93aWRnZXRzL2RhdGFfd2lkZ2V0cy5qcyIsImxlbmllbnRfc3JjL3dpZGdldHMvZ2xvYmFsLmpzIiwibGVuaWVudF9zcmMvd2lkZ2V0cy9saXN0LmpzIiwic3JjL2ZyYW1ld29ya3MvYWFkaGFyLmpzIiwic3JjL2ZyYW1ld29ya3MvZGF0YV9hdHRyaWJ1dGVzL29ubG9hZC5qcyIsInNyYy9mcmFtZXdvcmtzL3JoLmpzIiwic3JjL2ZyYW1ld29ya3MvdXRpbHMvY29sbGVjdGlvbnMuanMiLCJzcmMvZnJhbWV3b3Jrcy91dGlscy9vcGVyYXRvcl9zZWFyY2guanMiLCJzcmMvbGliL3JoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztjQ0FhLE07SUFBUCxFLFdBQUEsRTtJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLEMsR0FBTSxFLENBQU4sQzs7O0FBRU4sSUFBSSxVQUFXLFlBQVc7QUFDeEIsTUFBSSxZQUFZLFNBQWhCO0FBQ0EsTUFBSSxTQUFTLFNBQWI7QUFDQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxrQ0FDcUI7O0FBRWpCLG9CQUFZLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0IsT0FBeEIsRUFBaUMsT0FBakMsQ0FBWjs7QUFFQSxpQkFBUyxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDLFNBQWxDLEVBQTZDLFNBQTdDLENBQVQ7QUFDRDtBQU5IOztBQVFFLHVCQUFjO0FBQUE7O0FBQUE7O0FBRVosWUFBSyxHQUFMLEdBQVcsRUFBRSxVQUFGLEVBQWMsQ0FBZCxDQUFYOztBQUVBLFVBQUksTUFBSyxHQUFULEVBQWM7QUFDWixZQUFJLE9BQU8sT0FBUCxJQUFrQixJQUF0QixFQUE0QjtBQUFFLGlCQUFPLE9BQVAsR0FBaUIsRUFBakI7QUFBc0I7QUFDcEQsY0FBSyxXQUFMLENBQWlCLE9BQU8sT0FBeEI7QUFDQSxjQUFLLFlBQUwsQ0FBa0IsU0FBbEI7QUFDQSxVQUFFLElBQUYsQ0FBTyxTQUFQLEVBQWtCLFVBQVMsTUFBVCxFQUFpQixLQUFqQixFQUF3QjtBQUN4QyxpQkFBTyxLQUFLLE1BQUwsSUFBZSxZQUFXO0FBQy9CLGlCQUFLLEtBQUwsR0FBYSxPQUFPLEtBQVAsQ0FBYjtBQUNBLG1CQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsSUFBbEIsRUFBd0IsU0FBeEIsQ0FBUDtBQUNELFdBSEQ7QUFJRCxTQUxEO0FBT0EsY0FBSyxnQkFBTDtBQUNBLGNBQUssYUFBTDtBQUNEO0FBakJXO0FBa0JiOztBQTFCSDtBQUFBO0FBQUEsdUNBNEJtQjtBQUFBOztBQUNmLGVBQU8sS0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLE9BQWYsR0FBMEIsWUFBTTtBQUNyQyxjQUFJLE9BQUssUUFBTCxFQUFKLEVBQXFCO0FBQUUsbUJBQU8sRUFBUDtBQUFZLFdBQW5DLE1BQXlDLElBQUksT0FBSyxHQUFULEVBQWM7QUFBRSxtQkFBTyxNQUFQO0FBQWdCO0FBQzFFLFNBRitCLEVBQWhDO0FBR0Q7QUFoQ0g7QUFBQTtBQUFBLDZCQWtDUyxVQWxDVCxFQWtDcUIsSUFsQ3JCLEVBa0MyQixHQWxDM0IsRUFrQ2dDO0FBQzVCLFlBQUksT0FBTyxJQUFYLEVBQWlCO0FBQUUsZ0JBQU0sTUFBTjtBQUFlO0FBQ2xDLFlBQUksV0FBVyxFQUFmO0FBQ0EsWUFBSSxPQUFPLFNBQVMsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBSDRCO0FBQUE7QUFBQTs7QUFBQTtBQUk1QiwrQkFBZ0IsTUFBTSxJQUFOLENBQVcsSUFBWCxDQUFoQiw4SEFBa0M7QUFBQSxnQkFBekIsR0FBeUI7O0FBQ2hDLGdCQUFJLEVBQUUsVUFBRixDQUFhLEdBQWIsS0FBcUIsRUFBRSxRQUFGLENBQVcsR0FBWCxDQUF6QixFQUEwQztBQUN4Qyx1QkFBUyxJQUFULENBQWMsR0FBZDtBQUNELGFBRkQsTUFFTyxJQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUN0QixrQkFBSSxHQUFKO0FBQ0Esa0JBQUk7QUFBRSxzQkFBTSxLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQU47QUFBNEIsZUFBbEMsQ0FDQSxPQUFPLENBQVAsRUFBVTtBQUFFLHNCQUFTLEVBQUUsSUFBWCxVQUFvQixFQUFFLE9BQXRCO0FBQWtDO0FBQzlDLHVCQUFTLElBQVQsQ0FBYyxHQUFkO0FBQ0QsYUFMTSxNQUtBO0FBQ0wsdUJBQVMsSUFBVCxDQUFjLFdBQWQ7QUFDRDtBQUNGO0FBZjJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBZ0I1QixZQUFJLEtBQUssS0FBTCxLQUFlLFNBQW5CLEVBQThCO0FBQUUsbUJBQVMsSUFBVCxDQUFjLEVBQUUsVUFBRixFQUFkO0FBQWdDO0FBQ2hFLGFBQUssS0FBTCxDQUFXLEtBQVgsR0FBbUIsS0FBSyxLQUF4QjtBQUNBLFVBQUUsV0FBRixDQUFjLElBQWQsRUFBb0IsU0FBUyxJQUFULENBQWMsR0FBZCxDQUFwQjs7QUFFQSxhQUFLLFFBQUwsQ0FBYyxXQUFkLENBQTBCLElBQTFCO0FBQ0EsYUFBSyxRQUFMLENBQWMsV0FBZCxDQUEwQixTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBMUI7QUFDQSxhQUFLLEdBQUwsQ0FBUyxTQUFULEdBQXFCLEtBQUssR0FBTCxDQUFTLFlBQTlCOztBQUVBLFlBQUksVUFBSixFQUFnQjtBQUFFLGlCQUFPLFdBQVcsSUFBWCxDQUFQO0FBQTBCO0FBQzdDO0FBM0RIO0FBQUE7QUFBQSx5Q0E2RHFCO0FBQ2pCLGFBQUssUUFBTCxHQUFnQixFQUFFLElBQUYsQ0FBTyxLQUFLLEdBQVosRUFBaUIsR0FBakIsRUFBc0IsQ0FBdEIsQ0FBaEI7QUFDQSxZQUFJLENBQUMsS0FBSyxRQUFWLEVBQW9CO0FBQ2xCLGVBQUssUUFBTCxHQUFnQixTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBaEI7QUFDQSxlQUFLLFFBQUwsQ0FBYyxTQUFkLEdBQTBCLFNBQTFCO0FBQ0EsZUFBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLFFBQTFCO0FBQ0Q7O0FBRUQsYUFBSyxNQUFMLEdBQWMsRUFBRSxJQUFGLENBQU8sS0FBSyxHQUFaLEVBQWlCLE9BQWpCLEVBQTBCLENBQTFCLENBQWQ7QUFDQSxZQUFJLENBQUMsS0FBSyxNQUFWLEVBQWtCO0FBQ2hCLGNBQUksU0FBUyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNBLFlBQUUsV0FBRixDQUFjLE1BQWQsRUFBc0IsSUFBdEI7QUFDQSxpQkFBTyxLQUFQLENBQWEsS0FBYixHQUFxQixNQUFyQjtBQUNBLGVBQUssTUFBTCxHQUFjLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFkO0FBQ0EsZUFBSyxNQUFMLENBQVksSUFBWixHQUFtQixNQUFuQjtBQUNBLGVBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsU0FBeEI7QUFDQSxlQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEtBQWxCLEdBQTBCLEtBQTFCO0FBQ0EsZUFBSyxNQUFMLENBQVksS0FBWixDQUFrQixNQUFsQixHQUEyQixHQUEzQjtBQUNBLGVBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsT0FBbEIsR0FBNEIsS0FBNUI7QUFDQSxlQUFLLE1BQUwsQ0FBWSxXQUFaLEdBQTBCLDBCQUExQjtBQUNBLGlCQUFPLFdBQVAsQ0FBbUIsS0FBSyxNQUF4QjtBQUNBLGlCQUFPLEtBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsTUFBckIsQ0FBUDtBQUNEO0FBQ0Y7QUFwRkg7QUFBQTtBQUFBLHNDQXNGa0I7QUFBQTs7QUFDZCxlQUFPLEtBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsaUJBQVM7QUFDdEMsY0FBSSxNQUFNLE9BQU4sS0FBa0IsRUFBdEIsRUFBMEI7QUFDeEIsbUJBQUssS0FBTCxHQUFhLFNBQWI7QUFDQSxnQkFBSSxPQUFPLE9BQUssTUFBTCxDQUFZLEtBQXZCO0FBQ0EsZ0JBQUk7QUFDRixrQkFBSSxTQUFTLFNBQVMsT0FBVCxjQUE0QixJQUE1QixFQUFvQyxLQUFwQyxDQUFiO0FBQ0EscUJBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsRUFBcEI7QUFDQSxxQkFBSyxNQUFMLENBQVksSUFBWixFQUFrQixDQUFDLElBQUQsQ0FBbEIsRUFBMEIsR0FBMUI7QUFDQSxxQkFBTyxPQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLENBQUMsTUFBRCxDQUFsQixDQUFQO0FBQ0QsYUFMRCxDQUtFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YscUJBQUssS0FBTCxHQUFhLFNBQWI7QUFDQSxxQkFBTyxPQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLENBQUksRUFBRSxJQUFOLFVBQWUsRUFBRSxPQUFqQixDQUFsQixFQUErQyxHQUEvQyxDQUFQO0FBQ0Q7QUFDRjtBQUNGLFNBZEQ7QUFlRDtBQXRHSDs7QUFBQTtBQUFBLElBQWdDLEdBQUcsTUFBbkM7QUF3R0EsVUFBUSxTQUFSO0FBQ0EsU0FBTyxPQUFQO0FBQ0QsQ0E3R2EsRUFBZDs7QUErR0EsR0FBRyxPQUFILEdBQWEsT0FBYjs7Ozs7QUNuSEEsSUFBSSxlQUFKO2NBQ2EsTTtJQUFQLEUsV0FBQSxFOztBQUNOLElBQUksUUFBUSxFQUFaOztBQUVBLEdBQUcsTUFBSCxHQUFhLFNBQVMsZ0JBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUI7QUFDekMsTUFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsUUFBSSxHQUFHLE1BQVAsRUFBZTtBQUNiLFVBQUksRUFBRSxPQUFPLEtBQVQsQ0FBSixFQUFxQjtBQUFFLFdBQUcsRUFBSCxDQUFNLE9BQU4sRUFBZSxRQUFmLEVBQTRCLEdBQTVCO0FBQXNEO0FBQzlFO0FBQ0QsV0FBTyxNQUFNLEdBQU4sQ0FBUDtBQUNELEdBTEQsTUFLTyxJQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUN2QixRQUFJLEdBQUcsTUFBUCxFQUFlO0FBQUUsYUFBTyxHQUFHLEVBQUgsQ0FBTSxPQUFOLEVBQWUsUUFBZixFQUE0QixHQUE1Qiw0QkFBUDtBQUFrRTtBQUNwRixHQUZNLE1BRUE7QUFDTCxXQUFPLE1BQU0sR0FBTixJQUFhLEtBQXBCO0FBQ0Q7QUFDRixDQVhEOztBQWFBO0FBQ0EsT0FBTyxlQUFQLEVBQXlDLFlBQXpDOztBQUVBO0FBQ0EsT0FBTyxrQkFBUCxFQUF3QyxvQkFBeEM7QUFDQSxPQUFPLG1CQUFQLEVBQXdDLHFCQUF4QztBQUNBLE9BQU8sbUJBQVAsRUFBd0Msa0JBQXhDOztBQUVBO0FBQ0EsT0FBTyxZQUFQLEVBQXdDLFdBQXhDO0FBQ0EsT0FBTyxvQkFBUCxFQUF3QyxtQkFBeEM7QUFDQSxPQUFPLGtCQUFQLEVBQXdDLGlCQUF4QztBQUNBLE9BQU8sb0JBQVAsRUFDVSxPQUFPLFlBQVAsQ0FEVjtBQUVBLE9BQU8sbUJBQVAsRUFDSyxPQUFPLFlBQVAsQ0FETDtBQUVBLE9BQU8sNEJBQVAsRUFDSyxPQUFPLFlBQVAsQ0FETDtBQUVBLE9BQU8sa0JBQVAsRUFDSyxPQUFPLFlBQVAsQ0FETDtBQUVBLE9BQU8sZ0JBQVAsRUFDSyxPQUFPLFlBQVAsQ0FETDtBQUVBLE9BQU8saUJBQVAsRUFDSyxPQUFPLFlBQVAsQ0FETDtBQUVBLE9BQU8sa0JBQVAsRUFDSyxPQUFPLFlBQVAsQ0FETDs7QUFHQTtBQUNBLE9BQU8sd0JBQVAsRUFBeUMsc0JBQXpDO0FBQ0EsT0FBTyxpQkFBUCxFQUF5QyxlQUF6QztBQUNBLE9BQU8sdUJBQVAsRUFBeUMsc0JBQXpDO0FBQ0EsT0FBTyxtQkFBUCxFQUF5QyxrQkFBekM7QUFDQSxPQUFPLG1CQUFQLEVBQXlDLGtCQUF6QztBQUNBLE9BQU8sWUFBUCxFQUF5QyxXQUF6QztBQUNBLE9BQU8sZUFBUCxFQUF5QyxjQUF6QztBQUNBLE9BQU8sZUFBUCxFQUF5QyxjQUF6QztBQUNBLE9BQU8sZ0JBQVAsRUFBeUMsZUFBekM7QUFDQSxPQUFPLHlCQUFQLEVBQXlDLHdCQUF6QztBQUNBLE9BQU8sMEJBQVAsRUFBeUMseUJBQXpDO0FBQ0EsT0FBTyxxQ0FBUCxFQUN5QyxtQ0FEekM7QUFFQSxPQUFPLFNBQVAsRUFBMEMsU0FBMUM7QUFDQSxPQUFPLFlBQVAsRUFBMEMsV0FBMUM7QUFDQSxPQUFPLFdBQVAsRUFBMEMsV0FBMUM7Ozs7O2NDNURhLE07SUFBUCxFLFdBQUEsRTtJQUNBLEMsR0FBTSxFLENBQU4sQzs7O0FBRU4sR0FBRyxVQUFILEdBQWdCLEVBQUUsS0FBRixDQUFRLEVBQUUsVUFBVixDQUFoQjs7Ozs7Y0NIYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxLLEdBQVUsRSxDQUFWLEs7OztBQUVOLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxVQUFELEVBQWEsTUFBYjtBQUFBLFNBQ2hCLEVBQUUsSUFBRixDQUFPLEVBQUUsSUFBRixDQUFPLFVBQVAsRUFBbUIsaUJBQW5CLENBQVAsRUFBOEMsVUFBUyxJQUFULEVBQWU7QUFDM0QsUUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFFBQWhCLENBQUosRUFBK0I7QUFBRTtBQUFTLEtBRGlCLENBQ2hCO0FBQzNDLFFBQUksQ0FBQyxFQUFFLFlBQUYsQ0FBZSxVQUFmLEVBQTJCLElBQTNCLENBQUwsRUFBdUM7QUFBRTtBQUFTLEtBRlMsQ0FFUjtBQUNuRCxRQUFJLFNBQVMsRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixRQUFoQixDQUFiO0FBQ0EsYUFBUyxTQUFTLEVBQUUsZUFBRixDQUFrQixNQUFsQixDQUFULEdBQXFDLEVBQTlDO0FBQ0EsV0FBTyxFQUFFLElBQUYsQ0FBTyxFQUFFLGlCQUFGLENBQW9CLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsVUFBaEIsQ0FBcEIsQ0FBUCxFQUF5RCxVQUFTLEtBQVQsRUFBZ0I7QUFBQSxVQUN6RSxLQUR5RSxHQUN2QyxLQUR1QyxDQUN6RSxLQUR5RTtBQUFBLFVBQ2xFLElBRGtFLEdBQ3ZDLEtBRHVDLENBQ2xFLElBRGtFO0FBQUEsVUFDNUQsU0FENEQsR0FDdkMsS0FEdUMsQ0FDNUQsU0FENEQ7QUFBQSxVQUNqRCxNQURpRCxHQUN2QyxLQUR1QyxDQUNqRCxNQURpRDs7QUFFOUUsVUFBSSxNQUFNLENBQU4sTUFBYSxNQUFNLENBQU4sRUFBUyxXQUFULEVBQWpCLEVBQXlDO0FBQUU7QUFDekMsZUFBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSSxVQUFVLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFBRSxpQkFBTyxTQUFQLEdBQW1CLFNBQW5CO0FBQStCO0FBQzNELFlBQUksSUFBSixFQUFVO0FBQUUsWUFBRSxNQUFGLENBQVMsTUFBVCxFQUFpQixJQUFqQjtBQUF5QjtBQUN0QztBQUNELGFBQU8sSUFBUCxHQUFjLElBQWQ7QUFDQSxVQUFJLFNBQVMsR0FBRyxPQUFILENBQVcsS0FBWCxDQUFiO0FBQ0EsVUFBSSxTQUFTLElBQUksTUFBSixDQUFXLE1BQVgsQ0FBYjtBQUNBLGFBQU8sT0FBTyxJQUFQLENBQVksTUFBWixDQUFQO0FBQ0QsS0FaTSxDQUFQO0FBYUQsR0FsQkQsQ0FEZ0I7QUFBQSxDQUFsQjs7QUFzQkE7QUFDQTtBQUNBLElBQUksb0JBQW9CLFNBQXBCLGlCQUFvQjtBQUFBLFNBQ3JCLFlBQU07QUFDTCxRQUFJLFNBQVMsRUFBYjtBQURLO0FBQUE7QUFBQTs7QUFBQTtBQUVMLDJCQUFpQixNQUFNLElBQU4sQ0FBVyxFQUFFLElBQUYsQ0FBTyxVQUFQLEVBQW1CLGVBQW5CLENBQVgsQ0FBakIsOEhBQWtFO0FBQUEsWUFBekQsSUFBeUQ7O0FBQ2hFLFlBQUksTUFBSjtBQUNBLFlBQUksQ0FBQyxFQUFFLFlBQUYsQ0FBZSxVQUFmLEVBQTJCLElBQTNCLENBQUwsRUFBdUM7QUFBRTtBQUFXLFNBRlksQ0FFWDtBQUNyRCxZQUFJLFNBQVMsRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixRQUFoQixDQUFiO0FBQ0EsaUJBQVMsU0FBUyxFQUFFLGVBQUYsQ0FBa0IsTUFBbEIsQ0FBVCxHQUFxQyxFQUE5QztBQUNBLGVBQU8sR0FBUCxHQUFhLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsUUFBaEIsRUFBMEIsS0FBMUIsQ0FBZ0MsR0FBaEMsQ0FBYjtBQUNBLGVBQU8sSUFBUCxHQUFjLElBQWQ7QUFDQSxlQUFPLElBQVAsQ0FBWSxTQUFTLElBQUksR0FBRyxPQUFILENBQVcsYUFBZixDQUE2QixNQUE3QixDQUFyQjtBQUNEO0FBVkk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFXTCxXQUFPLE1BQVA7QUFDRCxHQVpELEVBRHNCO0FBQUEsQ0FBeEI7O0FBZ0JBLElBQUksbUJBQW1CLFNBQW5CLGdCQUFtQixDQUFTLFVBQVQsRUFBcUIsTUFBckIsRUFBNkI7QUFDbEQsY0FBWSxVQUFaLEVBQXdCLE1BQXhCO0FBQ0EsU0FBTyxrQkFBa0IsVUFBbEIsQ0FBUDtBQUNELENBSEQ7O0FBS0EsRUFBRSxXQUFGLEdBQWdCLFdBQWhCO0FBQ0EsRUFBRSxpQkFBRixHQUFzQixpQkFBdEI7QUFDQSxFQUFFLGdCQUFGLEdBQXFCLGdCQUFyQjs7Ozs7Y0NwRGEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDOzs7QUFFTixHQUFHLE9BQUgsR0FBYSxFQUFFLFNBQUYsRUFBYjtBQUNBLEdBQUcsWUFBSCxHQUFrQixFQUFFLFFBQUYsQ0FBVyxHQUFHLE9BQUgsQ0FBVyxRQUF0QixDQUFsQjtBQUNBLEdBQUcsTUFBSCxHQUFhLEdBQUcsWUFBSCxJQUFtQixJQUFoQzs7QUFFQSxHQUFHLFdBQUgsR0FBaUIsRUFBRSxRQUFGLENBQVcsR0FBRyxPQUFILENBQVcsT0FBdEIsQ0FBakI7QUFDQSxHQUFHLEtBQUgsR0FBWSxHQUFHLFdBQUgsSUFBa0IsSUFBOUI7O0FBRUEsR0FBRyxZQUFILEdBQWtCLEVBQUUsUUFBRixDQUFXLEdBQUcsT0FBSCxDQUFXLFFBQXRCLENBQWxCO0FBQ0EsR0FBRyxNQUFILEdBQWEsR0FBRyxZQUFILElBQW1CLElBQWhDOztBQUVBLEdBQUcsWUFBSCxHQUFrQixFQUFFLFFBQUYsQ0FBVyxHQUFHLE9BQUgsQ0FBVyxRQUF0QixDQUFsQjtBQUNBLEdBQUcsTUFBSCxHQUFhLEdBQUcsWUFBSCxJQUFtQixJQUFoQzs7QUFFQSxJQUFJLGNBQWMsU0FBZCxXQUFjLENBQUMsUUFBRCxFQUFXLE1BQVg7QUFBQSxTQUFzQixTQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CLEtBQW5CLENBQXlCLE1BQXpCLENBQXRCO0FBQUEsQ0FBbEI7O0FBRUEsR0FBRyxFQUFILEdBQVEsWUFBVztBQUFBLGlCQUNDLE1BREQ7QUFBQSxNQUNYLE9BRFcsWUFDWCxPQURXOztBQUVqQixNQUFJLEdBQUcsTUFBSCxJQUFhLE9BQWIsSUFBd0IsRUFBRSxVQUFGLENBQWEsUUFBUSxHQUFyQixDQUE1QixFQUF1RDtBQUNyRCxRQUFJLFdBQUo7QUFDQSxRQUFJLE9BQU8sRUFBWCxDQUFlLElBQUksSUFBSSxDQUFDLENBQVQ7QUFDZixXQUFPLEVBQUUsQ0FBRixHQUFNLFVBQVUsTUFBdkIsRUFBK0I7QUFBRSxXQUFLLElBQUwsQ0FBVSxVQUFVLENBQVYsQ0FBVjtBQUEwQjtBQUMzRCxRQUFJLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0IsT0FBeEIsRUFBaUMsT0FBakMsRUFBMEMsT0FBMUMsQ0FBa0QsS0FBSyxDQUFMLENBQWxELElBQTZELENBQUMsQ0FBbEUsRUFBcUU7QUFDbkUsV0FBSyxRQUFRLEtBQUssQ0FBTCxDQUFSLENBQUw7QUFDQSxhQUFPLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBUDtBQUNELEtBSEQsTUFHTztBQUNMLFdBQUssUUFBUSxLQUFiO0FBQ0Q7O0FBRUQsUUFBSSxVQUFVLFFBQU0sS0FBSyxDQUFMLENBQU4sVUFBb0IsTUFBcEIsQ0FBMkIsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUEzQixDQUFkO0FBQ0EsUUFBSyxHQUFHLFlBQUgsS0FBb0IsRUFBckIsSUFBNEIsWUFBWSxPQUFaLEVBQXFCLEdBQUcsWUFBeEIsQ0FBaEMsRUFBdUU7QUFDckUsVUFBSSxHQUFHLE1BQUgsSUFBYSxZQUFZLE9BQVosRUFBcUIsR0FBRyxZQUF4QixDQUFqQixFQUF3RDtBQUN0RCxlQUFPLFNBQVMsRUFBVCxFQUFhLFVBQWIsR0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJLEdBQUcsTUFBSCxJQUFhLFlBQVksT0FBWixFQUFxQixHQUFHLFlBQXhCLENBQWpCLEVBQXdEO0FBQzdELGVBQU8sUUFBUSxLQUFSLENBQWMsS0FBZCxDQUFvQixPQUFwQixFQUE2QixPQUE3QixDQUFQO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsZUFBTyxHQUFHLEtBQUgsQ0FBUyxPQUFULEVBQWtCLE9BQWxCLENBQVA7QUFDRDtBQUNGO0FBQ0Y7QUFDRixDQXhCRDs7Ozs7Ozs7O2NDbEJhLE07SUFBUCxFLFdBQUEsRTs7SUFFQSxLO0FBRUosbUJBQWM7QUFBQTs7QUFDWixTQUFLLEtBQUwsR0FBYSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQWI7QUFDRDs7OzswQkFFSyxFLEVBQUksUyxFQUFXO0FBQ25CLFVBQUksS0FBSyxZQUFMLElBQXFCLElBQXpCLEVBQStCO0FBQUUsYUFBSyxZQUFMLEdBQW9CLEVBQXBCO0FBQXlCO0FBQzFELFVBQUksS0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLFNBQTFCLE1BQXlDLENBQUMsQ0FBOUMsRUFBaUQ7QUFDL0MsYUFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLFNBQXZCO0FBQ0EsV0FBRyxJQUFILENBQVEsSUFBUjtBQUNBLGVBQU8sS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLEtBQUssWUFBTCxDQUFrQixPQUFsQixDQUEwQixTQUExQixDQUF6QixFQUErRCxDQUEvRCxDQUFQO0FBQ0Q7QUFDRjs7Ozs7O0FBR0gsR0FBRyxLQUFILEdBQVcsS0FBWDtBQUNBLEdBQUcsS0FBSCxHQUFZLElBQUksS0FBSixFQUFELENBQWMsS0FBekI7Ozs7Ozs7OztjQ25CYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxDLEdBQU0sRSxDQUFOLEM7OztBQUVOLElBQUksY0FDRixFQUFDLE9BQU8sSUFBUixFQURGOztBQUdBLElBQUksV0FBWSxHQUFHLFFBQUgsR0FBYyxVQUFTLElBQVQsRUFBZTtBQUMzQyxNQUFJLFlBQVksSUFBSSxPQUFPLFFBQVgsRUFBaEI7QUFDQSxJQUFFLElBQUYsQ0FBTyxJQUFQLEVBQWEsVUFBQyxLQUFELEVBQVEsR0FBUjtBQUFBLFdBQWdCLFVBQVUsTUFBVixDQUFpQixHQUFqQixFQUFzQixLQUF0QixDQUFoQjtBQUFBLEdBQWI7QUFDQSxTQUFPLFNBQVA7QUFDRCxDQUpEOztBQU1BOztJQUNNLFE7QUFFSixvQkFBWSxHQUFaLEVBQWlCLElBQWpCLEVBQXVCO0FBQUE7O0FBQ3JCLFNBQUssa0JBQUwsR0FBMEIsS0FBSyxrQkFBTCxDQUF3QixJQUF4QixDQUE2QixJQUE3QixDQUExQjtBQUNBLFNBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsUUFBSSxLQUFLLElBQUwsQ0FBVSxPQUFWLElBQXFCLElBQXpCLEVBQStCO0FBQUUsV0FBSyxPQUFMLENBQWEsS0FBSyxJQUFMLENBQVUsT0FBdkI7QUFBa0M7QUFDbkUsUUFBSSxLQUFLLElBQUwsQ0FBVSxLQUFWLElBQW1CLElBQXZCLEVBQTZCO0FBQUUsV0FBSyxLQUFMLENBQVcsS0FBSyxJQUFMLENBQVUsS0FBckI7QUFBOEI7QUFDN0QsU0FBSyxHQUFMLENBQVMsa0JBQVQsR0FBOEIsS0FBSyxrQkFBbkM7QUFDRDs7Ozt5Q0FFb0I7QUFBQTs7QUFDbkIsVUFBSSxLQUFLLEdBQUwsQ0FBUyxVQUFULEtBQXdCLENBQTVCLEVBQStCO0FBQUU7QUFBUzs7QUFFMUMsVUFBSSxPQUFPLEtBQUssR0FBTCxDQUFTLFlBQXBCO0FBSG1CLFVBSWIsTUFKYSxHQUlGLEtBQUssR0FKSCxDQUliLE1BSmE7O0FBS25CLFVBQUksVUFBVSxTQUFWLE9BQVU7QUFBQSxlQUFRLE1BQUssR0FBTCxDQUFTLGlCQUFULENBQTJCLElBQTNCLENBQVI7QUFBQSxPQUFkOztBQUVBLFVBQUksS0FBSyxTQUFMLENBQWUsTUFBZixDQUFKLEVBQTRCO0FBQzFCLFlBQUksS0FBSyxTQUFULEVBQW9CO0FBQUUsZUFBSyxTQUFMLENBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixPQUE3QixFQUFzQyxLQUFLLElBQTNDO0FBQW1EO0FBQzFFLE9BRkQsTUFFTztBQUNMLFlBQUksS0FBSyxPQUFULEVBQWtCO0FBQUUsZUFBSyxPQUFMLENBQWEsSUFBYixFQUFtQixNQUFuQixFQUEyQixPQUEzQixFQUFvQyxLQUFLLElBQXpDO0FBQWlEO0FBQ3RFOztBQUVELFVBQUksS0FBSyxTQUFULEVBQW9CO0FBQUUsZUFBTyxLQUFLLFNBQUwsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCLE9BQTdCLEVBQXNDLEtBQUssSUFBM0MsQ0FBUDtBQUEwRDtBQUNqRjs7OzhCQUVTLE0sRUFBUTtBQUFFLGFBQVMsVUFBVSxHQUFYLElBQW9CLFNBQVMsR0FBOUIsSUFBd0MsV0FBVyxHQUExRDtBQUFpRTs7OzRCQUU3RSxFLEVBQUk7QUFDVixXQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzBCQUVLLEUsRUFBSTtBQUNSLFdBQUssT0FBTCxHQUFlLEVBQWY7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzZCQUVPLEUsRUFBSTtBQUNWLFdBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7QUFHSCxJQUFJLGdCQUFnQixTQUFoQixhQUFnQixDQUFTLElBQVQsRUFBZTtBQUNqQyxNQUFJLE1BQU0sT0FBTyxjQUFQLElBQXlCLE9BQU8sYUFBUCxDQUFxQixtQkFBckIsQ0FBbkM7QUFDQSxNQUFJLE1BQU0sSUFBSSxHQUFKLEVBQVY7QUFDQSxNQUFJLFdBQVcsSUFBSSxRQUFKLENBQWEsR0FBYixFQUFrQixJQUFsQixDQUFmO0FBQ0EsU0FBTyxFQUFDLFFBQUQsRUFBTSxrQkFBTixFQUFQO0FBQ0QsQ0FMRDs7QUFPQTtBQUNBLElBQUksT0FBUSxHQUFHLElBQUgsR0FBVSxVQUFTLElBQVQsRUFBZTtBQUNuQyxTQUFPLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxXQUFiLEVBQTBCLElBQTFCLENBQVA7O0FBRG1DLHVCQUViLGNBQWMsSUFBZCxDQUZhO0FBQUEsTUFFOUIsR0FGOEIsa0JBRTlCLEdBRjhCO0FBQUEsTUFFekIsUUFGeUIsa0JBRXpCLFFBRnlCOztBQUduQyxNQUFJLElBQUosQ0FBUyxLQUFLLE1BQWQsRUFBc0IsS0FBSyxHQUEzQixFQUFnQyxLQUFLLEtBQXJDOztBQUVBLE1BQUksS0FBSyxjQUFMLENBQUosRUFBMEI7QUFDeEIsUUFBSSxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxLQUFLLGNBQUwsQ0FBckM7QUFDRDs7QUFFRCxNQUFJLElBQUosQ0FBUyxLQUFLLElBQWQ7QUFDQSxTQUFPLFFBQVA7QUFDRCxDQVhEOztBQWFBLEtBQUssR0FBTCxHQUFXLFVBQUMsR0FBRCxFQUFNLElBQU47QUFBQSxTQUFlLEtBQUssRUFBRSxNQUFGLENBQVMsRUFBQyxRQUFELEVBQU0sUUFBUSxLQUFkLEVBQVQsRUFBK0IsSUFBL0IsQ0FBTCxDQUFmO0FBQUEsQ0FBWDs7QUFFQSxLQUFLLElBQUwsR0FBWSxVQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksSUFBWjtBQUFBLFNBQXFCLEtBQUssRUFBRSxNQUFGLENBQVMsRUFBQyxRQUFELEVBQU0sUUFBUSxNQUFkLEVBQXNCLFVBQXRCLEVBQVQsRUFBc0MsSUFBdEMsQ0FBTCxDQUFyQjtBQUFBLENBQVo7O0FBRUEsS0FBSyxHQUFMLEdBQVcsVUFBQyxHQUFELEVBQU0sSUFBTixFQUFZLElBQVo7QUFBQSxTQUFxQixLQUFLLEVBQUUsTUFBRixDQUFTLEVBQUMsUUFBRCxFQUFNLFFBQVEsS0FBZCxFQUFxQixVQUFyQixFQUFULEVBQXFDLElBQXJDLENBQUwsQ0FBckI7QUFBQSxDQUFYOztBQUVBLEtBQUssS0FBTCxHQUFhLFVBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0I7QUFDL0IsU0FBTyxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsV0FBYixFQUEwQixJQUExQixDQUFQO0FBQ0EsTUFBSSxPQUFPLEVBQUUsUUFBRixFQUFZLENBQVosS0FBa0IsU0FBUyxJQUFULENBQWMsUUFBZCxDQUF1QixDQUF2QixDQUE3QjtBQUNBLE1BQUksVUFBVSxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZDtBQUNBLFVBQVEsS0FBUixHQUFnQixLQUFLLEtBQXJCO0FBQ0EsVUFBUSxHQUFSLEdBQWMsR0FBZDtBQUNBLFNBQU8sS0FBSyxVQUFMLENBQWdCLFlBQWhCLENBQTZCLE9BQTdCLEVBQXNDLElBQXRDLENBQVA7QUFDRCxDQVBEOzs7Ozs7Ozs7Ozs7Ozs7Y0N0RmEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsTSxHQUFXLEUsQ0FBWCxNOztJQUVBLE07Ozs7OytCQUVPO0FBQUUsYUFBTyxRQUFQO0FBQWtCOzs7QUFFL0Isb0JBQWM7QUFBQTs7QUFBQTs7QUFFWixVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5CO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsUUFBSSxFQUFFLFFBQUYsRUFBSixFQUFrQjtBQUNoQixTQUFHLEtBQUgsQ0FBUyxTQUFULENBQW1CLE9BQU8sbUJBQVAsQ0FBbkIsRUFBZ0QsTUFBSyxXQUFyRDtBQUNBLFNBQUcsS0FBSCxDQUFTLFNBQVQsQ0FBbUIsT0FBTyxZQUFQLENBQW5CLEVBQXlDLE1BQUssV0FBOUM7QUFDRDtBQVBXO0FBUWI7Ozs7a0NBRWE7QUFDWixVQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLFlBQUksTUFBTSxFQUFDLElBQUksS0FBSyxFQUFWLEVBQVY7QUFDQSxhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEVBQUMscUJBQXFCLEdBQXRCLEVBQXhCLEVBQW9ELEdBQXBEO0FBQ0EsZUFBTyxLQUFLLE1BQUwsR0FBYyxTQUFyQjtBQUNEO0FBQ0Y7OzsyQkFFTTtBQUNMLFVBQUksS0FBSyxFQUFMLElBQVcsSUFBZixFQUFxQjtBQUFFLGFBQUssRUFBTCxHQUFVLEVBQUUsUUFBRixFQUFWO0FBQXlCO0FBQ2hELFdBQUssTUFBTCxHQUFjLE9BQU8sTUFBckI7QUFDQSxVQUFJLEVBQUUsUUFBRixFQUFKLEVBQWtCO0FBQ2hCLFlBQUksUUFBUSxHQUFHLEtBQUgsQ0FBUyxHQUFULENBQWEsbUJBQWIsQ0FBWjtBQUNBLFlBQUksS0FBSixFQUFXO0FBQ1QsY0FBSSxZQUFZLEVBQUUsR0FBRixDQUFNLEtBQU4sRUFBYSxVQUFTLElBQVQsRUFBZTtBQUMxQyxnQkFBSSxFQUFFLFFBQUYsQ0FBVyxJQUFYLENBQUosRUFBc0I7QUFBRSxxQkFBTyxFQUFDLEtBQUssSUFBTixFQUFQO0FBQXFCLGFBQTdDLE1BQW1EO0FBQUUscUJBQU8sSUFBUDtBQUFjO0FBQ3BFLFdBRmUsQ0FBaEI7QUFHQSxjQUFJLE1BQU0sRUFBQyxPQUFPLFNBQVIsRUFBbUIsSUFBSSxLQUFLLEVBQTVCLEVBQVY7QUFDQSxlQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEVBQUMsbUJBQW1CLEdBQXBCLEVBQXhCLEVBQWtELEdBQWxEO0FBQ0Q7QUFDRCxZQUFJLGFBQWEsR0FBRyxLQUFILENBQVMsR0FBVCxDQUFhLG9CQUFiLENBQWpCO0FBQ0EsWUFBSSxVQUFKLEVBQWdCO0FBQUUsaUJBQU8sS0FBSyxTQUFMLENBQWUsS0FBSyxNQUFwQixFQUE0QixLQUFLLEVBQWpDLEVBQXFDLFVBQXJDLENBQVA7QUFBMEQ7QUFDN0U7QUFDRjs7OzBCQUVLLEUsRUFBSTtBQUNSLFVBQUksT0FBTyxLQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBWDtBQUNBLFVBQUksSUFBSixFQUFVO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ1IsK0JBQWtCLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBbEIsOEhBQW9DO0FBQUEsZ0JBQTNCLEtBQTJCO0FBQUU7QUFBVTtBQUR4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUVSLGVBQU8sT0FBTyxLQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBZDtBQUNEO0FBQ0Y7Ozs4QkFFUyxNLEVBQVEsRSxFQUFJLEksRUFBTTtBQUFBOztBQUMxQixVQUFJLFFBQVEsSUFBWixFQUFrQjtBQUFFLGVBQU8sRUFBUDtBQUFZO0FBQ2hDLFVBQUksT0FBTyxFQUFYO0FBQ0EsVUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWdCO0FBQzdCLGVBQU8sT0FBSyxLQUFMLENBQVcsWUFBVztBQUMzQixjQUFJLE1BQU0sRUFBVixDQUFjLElBQUksR0FBSixJQUFXLEtBQVg7QUFDZCxpQkFBTyxPQUFPLFdBQVAsQ0FBbUIsRUFBQyxpQkFBaUIsR0FBbEIsRUFBbkIsRUFBMkMsR0FBM0MsQ0FBUDtBQUNELFNBSE0sRUFJTCxFQUpLLENBQVA7QUFLRCxPQU5EO0FBSDBCO0FBQUE7QUFBQTs7QUFBQTtBQVUxQiw4QkFBZ0IsTUFBTSxJQUFOLENBQVcsSUFBWCxDQUFoQixtSUFBa0M7QUFBQSxjQUF6QixHQUF5Qjs7QUFDaEMsZ0JBQU0sSUFBSSxJQUFKLEVBQU47QUFDQSxlQUFLLElBQUwsQ0FBVSxHQUFHLEtBQUgsQ0FBUyxTQUFULENBQW1CLEdBQW5CLEVBQXdCLFFBQXhCLENBQVY7QUFDRDtBQWJ5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWMxQixXQUFLLEtBQUwsQ0FBVyxFQUFYO0FBQ0EsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsSUFBc0IsSUFBN0I7QUFDRDs7OzRCQUVPLEcsRUFBSyxLLEVBQU8sSSxFQUFNO0FBQ3hCLFVBQUksUUFBUSxJQUFaLEVBQWtCO0FBQUUsZUFBTyxFQUFQO0FBQVk7QUFDaEMsYUFBTyxLQUFLLEtBQUwsQ0FBVztBQUFBLGVBQU0sR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixFQUE2QixJQUE3QixDQUFOO0FBQUEsT0FBWCxDQUFQO0FBQ0Q7OzswQkFFSyxFLEVBQUksUyxFQUFXO0FBQ25CLFVBQUksYUFBYSxJQUFqQixFQUF1QjtBQUFFLG9CQUFZLEtBQUssRUFBakI7QUFBc0I7QUFDL0MsbUhBQW1CLEVBQW5CLEVBQXVCLFNBQXZCO0FBQ0Q7Ozs7RUF6RWtCLEdBQUcsSzs7QUE0RXhCLEdBQUcsTUFBSCxHQUFZLElBQUksTUFBSixFQUFaOzs7OztjQ2pGYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxNLEdBQVcsRSxDQUFYLE07OztBQUdOLElBQUksT0FBTyxFQUFFLE1BQUYsRUFBVSxDQUFWLENBQVg7QUFDQSxJQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQVo7QUFDQSxNQUFNLFNBQU4sR0FBa0IscURBQWxCO0FBQ0EsS0FBSyxZQUFMLENBQWtCLEtBQWxCLEVBQXlCLEtBQUssVUFBTCxDQUFnQixDQUFoQixDQUF6Qjs7QUFFQSxFQUFFLGdCQUFGLENBQW1CLFFBQW5CLEVBQTZCLGtCQUE3QixFQUFpRCxFQUFFLEdBQUYsQ0FBTSxZQUFXO0FBQ2hFLE1BQUksR0FBRyxNQUFQLEVBQWU7QUFBRSxRQUFJLEdBQUcsT0FBSCxJQUFjLElBQWxCLEVBQXdCO0FBQUUsU0FBRyxPQUFILEdBQWEsSUFBSSxHQUFHLE9BQVAsRUFBYjtBQUFnQztBQUFFOztBQUU3RSxLQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLE9BQU8sdUJBQVAsQ0FBakIsRUFBa0QsSUFBbEQsRUFBd0QsRUFBQyxNQUFNLElBQVAsRUFBeEQ7O0FBRUEsSUFBRSxXQUFGLENBQWMsUUFBZDs7QUFFQSxJQUFFLGlCQUFGLENBQW9CLFFBQXBCOztBQUVBLFNBQU8sR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixPQUFPLG1CQUFQLENBQWpCLEVBQThDLElBQTlDLEVBQW9ELEVBQUMsTUFBTSxJQUFQLEVBQXBELENBQVA7QUFDRCxDQVZnRCxDQUFqRDs7QUFhQSxJQUFJLEVBQUUsUUFBRixFQUFKLEVBQWtCO0FBQ2hCLElBQUUsZ0JBQUYsQ0FBbUIsTUFBbkIsRUFBMkIsY0FBM0IsRUFBMkMsWUFBVztBQUNwRCxPQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLE9BQU8sbUJBQVAsQ0FBakIsRUFBOEMsSUFBOUMsRUFBb0QsRUFBQyxNQUFNLElBQVAsRUFBcEQ7QUFDQSxXQUFPLFNBQVA7QUFDRCxHQUhEOztBQUtBLElBQUUsZ0JBQUYsQ0FBbUIsTUFBbkIsRUFBMkIsUUFBM0IsRUFBcUMsVUFBUyxLQUFULEVBQWdCO0FBQ25ELE9BQUcsS0FBSCxDQUFTLE9BQVQsQ0FBaUIsT0FBTyxZQUFQLENBQWpCLEVBQXVDLElBQXZDLEVBQTZDLEVBQUMsTUFBTSxJQUFQLEVBQTdDO0FBQ0EsV0FBTyxTQUFQO0FBQ0QsR0FIRDtBQUlEOzs7OztjQ2xDWSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7OztBQUVOLEVBQUUsZ0JBQUYsQ0FBbUIsTUFBbkIsRUFBMkIsU0FBM0IsRUFBc0MsVUFBUyxDQUFULEVBQVk7QUFDaEQsTUFBSSxlQUFKO0FBQUEsTUFBWSxZQUFaO0FBQ0EsTUFBSSxDQUFDLEVBQUUsWUFBRixDQUFlLEVBQUUsTUFBakIsQ0FBTCxFQUErQjtBQUFFO0FBQVM7O0FBRk0sTUFJMUMsSUFKMEMsR0FJakMsQ0FKaUMsQ0FJMUMsSUFKMEM7O0FBS2hELE1BQUksQ0FBQyxFQUFFLFFBQUYsQ0FBVyxJQUFYLENBQUwsRUFBdUI7QUFBRTtBQUFTOztBQUVsQyxNQUFJLEtBQUssZUFBVCxFQUEwQjtBQUN4QixhQUFTLEtBQUssZUFBZDtBQUNBLFFBQUksTUFBSixFQUFZO0FBQUUsV0FBSyxHQUFMLElBQVksTUFBWixFQUFvQjtBQUFFLFlBQUksUUFBUSxPQUFPLEdBQVAsQ0FBWixDQUF5QixHQUFHLE1BQUgsQ0FBVSxPQUFWLENBQWtCLEdBQWxCLEVBQXVCLEtBQXZCLEVBQThCLEVBQUMsTUFBTSxJQUFQLEVBQTlCO0FBQThDO0FBQUU7QUFDOUc7O0FBRUQsTUFBSSxLQUFLLGlCQUFULEVBQTRCO0FBQzFCLGFBQVMsS0FBSyxpQkFBZDtBQUNBLFFBQUksUUFBUSxPQUFPLEtBQVAsSUFBZ0IsRUFBNUI7QUFDQSxRQUFJLGVBQWUsQ0FBQyxHQUFHLEtBQUgsQ0FBUyxHQUFULENBQWEsbUJBQWIsQ0FBcEI7QUFDQSxRQUFJLE9BQU8sRUFBRSxNQUFGLENBQVMsS0FBVCxFQUFnQixVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUI7QUFDaEQsVUFBSSxnQkFBaUIsS0FBSyxNQUFMLEtBQWdCLEtBQXJDLEVBQTZDO0FBQUUsZUFBTyxJQUFQLENBQVksS0FBSyxHQUFqQjtBQUF3QjtBQUN2RSxhQUFPLE1BQVA7QUFDRCxLQUhVLEVBSVQsRUFKUyxDQUFYO0FBS0EsUUFBSSxRQUFRLElBQVIsR0FBZSxLQUFLLE1BQXBCLEdBQTZCLFNBQWpDLEVBQTRDO0FBQUUsU0FBRyxNQUFILENBQVUsU0FBVixDQUFvQixFQUFFLE1BQXRCLEVBQThCLE9BQU8sRUFBckMsRUFBeUMsSUFBekM7QUFBaUQ7QUFDaEc7O0FBRUQsTUFBSSxLQUFLLG1CQUFULEVBQThCO0FBQzVCLGFBQVMsS0FBSyxtQkFBZDtBQUNBLFdBQU8sR0FBRyxNQUFILENBQVUsS0FBVixDQUFnQixPQUFPLEVBQXZCLENBQVA7QUFDRDtBQUNGLENBNUJEOzs7Ozs7Ozs7Ozs7O2NDSGEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsTSxHQUFXLEUsQ0FBWCxNOztBQUVOOztJQUNNLFM7QUFFSixxQkFBWSxXQUFaLEVBQXlCLFFBQXpCLEVBQW1DO0FBQUE7O0FBQ2pDLFFBQUksZUFBZSxJQUFuQixFQUF5QjtBQUFFLG9CQUFjLEVBQWQ7QUFBbUI7QUFDOUMsU0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsUUFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQUUsaUJBQVcsRUFBWDtBQUFnQjtBQUN4QyxTQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDRDs7QUFFRDs7Ozs7bUNBQ2UsSSxFQUFNLEksRUFBTSxLLEVBQU8sSSxFQUFNO0FBQ3RDLFVBQUksS0FBSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsWUFBSSxjQUFKO0FBQ0EsYUFBSyxJQUFMLENBQVUsRUFBQyxTQUFTLEtBQUssV0FBZixFQUE0QixLQUFLLElBQWpDLEVBQXVDLFlBQXZDLEVBQVY7QUFDQSxZQUFJLFdBQVcsS0FBSyxDQUFMLENBQWY7QUFDQSxZQUFJLFFBQVEsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUFaLEVBQXFDO0FBQ25DLGNBQUksVUFBYSxJQUFiLFNBQXFCLFFBQXpCO0FBQ0EsZ0JBQU0sY0FBTixDQUFxQixLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQXJCLEVBQW9DLE9BQXBDLEVBQTZDLFNBQVMsSUFBVCxHQUFnQixNQUFNLFFBQU4sQ0FBaEIsR0FBa0MsU0FBL0UsRUFBMEYsSUFBMUY7QUFDRDtBQUNGLE9BUkQsTUFRTyxJQUFJLEtBQUssTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQzFCLGFBQUssdUJBQUwsQ0FBNkIsSUFBN0IsRUFBbUMsS0FBbkMsRUFBMEMsSUFBMUM7QUFDRDtBQUNELGFBQU8sSUFBUDtBQUNEOzs7bUNBRWMsRSxFQUFJLEksRUFBTSxJLEVBQU07QUFDN0IsVUFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsZUFBTyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsQ0FBQyxFQUFELEVBQUssSUFBTCxDQUF0QixDQUFQO0FBQ0QsT0FGRCxNQUVPLElBQUksS0FBSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDMUIsWUFBSSxXQUFXLEtBQUssQ0FBTCxDQUFmO0FBQ0EsWUFBSSxLQUFLLFFBQUwsQ0FBYyxRQUFkLEtBQTJCLElBQS9CLEVBQXFDO0FBQUUsZUFBSyxRQUFMLENBQWMsUUFBZCxJQUEwQixJQUFJLFNBQUosRUFBMUI7QUFBNEM7QUFDbkYsZUFBTyxLQUFLLFFBQUwsQ0FBYyxRQUFkLEVBQXdCLGNBQXhCLENBQXVDLEVBQXZDLEVBQTJDLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBM0MsRUFBMEQsSUFBMUQsQ0FBUDtBQUNEO0FBQ0Y7OztxQ0FFZ0IsRSxFQUFJLEksRUFBTTtBQUN6QixVQUFJLEtBQUssTUFBTCxLQUFnQixDQUFwQixFQUF1QjtBQUNyQixlQUFPLEtBQUssaUJBQUwsQ0FBdUIsRUFBdkIsQ0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJLEtBQUssTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQzFCLGVBQU8sS0FBSyxRQUFMLENBQWMsS0FBSyxDQUFMLENBQWQsRUFBdUIsZ0JBQXZCLENBQXdDLEVBQXhDLEVBQTRDLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBNUMsQ0FBUDtBQUNEO0FBQ0Y7OztzQ0FFaUIsRSxFQUFJO0FBQ3BCLFVBQUksUUFBUSxFQUFFLFNBQUYsQ0FBWSxLQUFLLFdBQWpCLEVBQThCO0FBQUEsZUFBUSxLQUFLLENBQUwsTUFBWSxFQUFwQjtBQUFBLE9BQTlCLENBQVo7QUFDQSxVQUFLLFNBQVMsSUFBVixJQUFvQixVQUFVLENBQUMsQ0FBbkMsRUFBdUM7QUFDckMsZUFBTyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBd0IsS0FBeEIsRUFBK0IsQ0FBL0IsQ0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJLEdBQUcsTUFBUCxFQUFlO0FBQ3BCLGVBQU8sR0FBRyxFQUFILENBQU0sT0FBTixFQUFlLGNBQWYsRUFDRixJQURFLHNDQUNtQyxFQURuQyxDQUFQO0FBRUQ7QUFDRjs7OzRDQUV1QixJLEVBQU0sSyxFQUFPLEksRUFBTTtBQUN6QyxXQUFLLElBQUwsQ0FBVSxFQUFDLFNBQVMsS0FBSyxXQUFmLEVBQTRCLEtBQUssSUFBakMsRUFBdUMsWUFBdkMsRUFBVjtBQUNBLFVBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLFlBQUksU0FBUyxJQUFiLEVBQW1CO0FBQUUsa0JBQVEsRUFBUjtBQUFhO0FBQ2xDLGFBQUssSUFBSSxHQUFULElBQWdCLEtBQUssUUFBckIsRUFBK0I7QUFDN0IsY0FBSSxRQUFRLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBWjtBQUNBLGdCQUFNLHVCQUFOLENBQWlDLElBQWpDLFNBQXlDLEdBQXpDLEVBQWdELE1BQU0sR0FBTixDQUFoRCxFQUE0RCxJQUE1RDtBQUNEO0FBQ0Y7QUFDRCxhQUFPLElBQVA7QUFDRDs7Ozs7O0FBR0g7OztJQUNNLFE7OztBQUVKLG9CQUFZLFdBQVosRUFBeUIsUUFBekIsRUFBbUMsSUFBbkMsRUFBeUM7QUFBQTs7QUFBQTs7QUFBQTs7QUFFdkMsVUFBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsUUFBSSxRQUFRLElBQVosRUFBa0I7QUFBRSxhQUFPLEVBQVA7QUFBWTtBQUNoQyxVQUFLLElBQUwsR0FBWSxJQUFaO0FBTHVDLHVIQU1qQyxNQUFLLFdBTjRCLEVBTWYsTUFBSyxNQU5VO0FBT3hDOzs7O21DQUVjLEksRUFBTTtBQUNuQixVQUFJLFdBQVcsS0FBSyxDQUFMLENBQWY7QUFDQSxVQUFJLFFBQVEsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUFaO0FBQ0EsVUFBSSxLQUFKLEVBQVc7QUFDVCxlQUFPLE1BQU0sY0FBTixDQUFxQixJQUFyQixPQUE4QixLQUFLLENBQUwsQ0FBOUIsRUFBeUMsS0FBSyxJQUFMLENBQVUsS0FBSyxDQUFMLENBQVYsQ0FBekMsRUFBNkQsRUFBN0QsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sRUFBUDtBQUNEO0FBQ0Y7OzttQ0FFYyxFLEVBQUksSSxFQUFNLEksRUFBTTtBQUM3QixVQUFJLFdBQVcsS0FBSyxDQUFMLENBQWY7QUFDQSxVQUFJLEtBQUssUUFBTCxDQUFjLFFBQWQsS0FBMkIsSUFBL0IsRUFBcUM7QUFBRSxhQUFLLFFBQUwsQ0FBYyxRQUFkLElBQTBCLElBQUksU0FBSixFQUExQjtBQUE0QztBQUNuRixhQUFPLEtBQUssUUFBTCxDQUFjLFFBQWQsRUFBd0IsY0FBeEIsQ0FBdUMsRUFBdkMsRUFBMkMsSUFBM0MsRUFBaUQsSUFBakQsQ0FBUDtBQUNEOzs7cUNBRWdCLEUsRUFBSSxJLEVBQU07QUFDekIsVUFBSSxXQUFXLEtBQUssQ0FBTCxDQUFmO0FBQ0EsYUFBUSxLQUFLLFFBQUwsQ0FBYyxRQUFkLEtBQTJCLElBQTNCLEdBQWtDLEtBQUssUUFBTCxDQUFjLFFBQWQsRUFBd0IsZ0JBQXhCLENBQXlDLEVBQXpDLEVBQTZDLElBQTdDLENBQWxDLEdBQXVGLFNBQS9GO0FBQ0Q7Ozs0QkFFTyxJLEVBQU07QUFDWixVQUFJLGNBQUo7QUFEWSxVQUVOLElBRk0sR0FFRyxJQUZILENBRU4sSUFGTTs7QUFHWixXQUFLLElBQUksUUFBUSxDQUFqQixFQUFvQixRQUFRLEtBQUssTUFBakMsRUFBeUMsT0FBekMsRUFBa0Q7QUFDaEQsWUFBSSxNQUFNLEtBQUssS0FBTCxDQUFWO0FBQ0EsWUFBSSxFQUFFLFNBQUYsQ0FBWSxJQUFaLENBQUosRUFBdUI7QUFDckIsY0FBSSxVQUFXLEtBQUssTUFBTCxHQUFjLENBQTdCLEVBQWlDO0FBQy9CLG9CQUFRLEtBQUssR0FBTCxDQUFSO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQU8sS0FBSyxHQUFMLENBQVA7QUFDRDtBQUNGLFNBTkQsTUFNTztBQUNMO0FBQ0Q7QUFDRjtBQUNELGFBQU8sS0FBUDtBQUNEOzs7NEJBRU8sSSxFQUFNLEssRUFBTztBQUFFO0FBQUYsVUFDYixJQURhLEdBQ0osSUFESSxDQUNiLElBRGE7O0FBRW5CLFdBQUssSUFBSSxRQUFRLENBQWpCLEVBQW9CLFFBQVEsS0FBSyxNQUFqQyxFQUF5QyxPQUF6QyxFQUFrRDtBQUNoRCxZQUFJLE1BQU0sS0FBSyxLQUFMLENBQVY7QUFDQSxZQUFJLFVBQVcsS0FBSyxNQUFMLEdBQWMsQ0FBN0IsRUFBaUM7QUFDL0IsZUFBSyxHQUFMLElBQVksS0FBWjtBQUNELFNBRkQsTUFFTztBQUNMLGNBQUksQ0FBQyxFQUFFLFNBQUYsQ0FBWSxLQUFLLEdBQUwsQ0FBWixDQUFMLEVBQTZCO0FBQUUsaUJBQUssR0FBTCxJQUFZLEVBQVo7QUFBaUI7QUFDaEQsaUJBQU8sS0FBSyxHQUFMLENBQVA7QUFDRDtBQUNGO0FBQ0Y7Ozs7RUE3RG9CLFM7O0FBZ0V2Qjs7O0FBQ0EsSUFBSSxRQUFTLFlBQVc7QUFDdEIsTUFBSSxTQUFTLFNBQWI7QUFDQTtBQUFBO0FBQUE7QUFBQSxpQ0FPYTtBQUFFLDBCQUFnQixLQUFLLE1BQXJCO0FBQWdDO0FBUC9DO0FBQUE7QUFBQSxrQ0FDcUI7O0FBRWpCO0FBQ0EsaUJBQVMsQ0FBVDtBQUNEO0FBTEg7O0FBU0UscUJBQWM7QUFBQTs7QUFDWixXQUFLLFNBQUwsR0FBaUIsSUFBSSxRQUFKLEVBQWpCOztBQUVBLFdBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxnQkFBVSxDQUFWO0FBQ0Q7O0FBZEg7QUFBQTtBQUFBLDBCQWdCTSxHQWhCTixFQWdCVztBQUNQLFlBQUksY0FBSjtBQUNBLFlBQUksS0FBSyxZQUFMLENBQWtCLEdBQWxCLENBQUosRUFBNEI7QUFBRSxpQkFBTyxHQUFHLEtBQUgsQ0FBUyxHQUFULENBQWEsR0FBYixDQUFQO0FBQTJCOztBQUV6RCxZQUFJLEVBQUUsUUFBRixDQUFXLEdBQVgsQ0FBSixFQUFxQjtBQUNuQixrQkFBUSxLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBdkIsQ0FBUjtBQUNELFNBRkQsTUFFTztBQUNMLGFBQUcsRUFBSCxDQUFNLE9BQU4sRUFBZSxLQUFmLEVBQXlCLElBQXpCLFNBQWlDLEdBQWpDO0FBQ0Q7O0FBRUQsWUFBSSxHQUFHLE1BQVAsRUFBZTtBQUNiLGFBQUcsRUFBSCxDQUFNLEtBQU4sRUFBYSxLQUFiLEVBQXVCLElBQXZCLFNBQStCLEdBQS9CLFVBQXVDLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBdkM7QUFDRDs7QUFFRCxlQUFPLEtBQVA7QUFDRDtBQS9CSDtBQUFBO0FBQUEsMkJBaUNPLEdBakNQLEVBaUNZO0FBQUUsZUFBTyxLQUFLLEdBQUwsQ0FBUyxPQUFPLEdBQVAsQ0FBVCxDQUFQO0FBQStCOztBQUUzQzs7QUFuQ0Y7QUFBQTtBQUFBLDhCQW9DVSxHQXBDVixFQW9DZSxLQXBDZixFQW9Dc0IsSUFwQ3RCLEVBb0M0QjtBQUFBOztBQUN4QixZQUFJLFFBQVEsSUFBWixFQUFrQjtBQUFFLGlCQUFPLEVBQVA7QUFBWTtBQUNoQyxZQUFJLEtBQUssWUFBTCxDQUFrQixHQUFsQixDQUFKLEVBQTRCO0FBQUUsaUJBQU8sR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixFQUE2QixJQUE3QixDQUFQO0FBQTRDO0FBQzFFLFlBQUksR0FBRyxNQUFQLEVBQWU7QUFDYixhQUFHLEVBQUgsQ0FBTSxLQUFOLEVBQWEsU0FBYixFQUEyQixJQUEzQixTQUFtQyxHQUFuQyxVQUEyQyxLQUFLLFNBQUwsQ0FBZSxLQUFmLENBQTNDO0FBQ0Q7QUFDRCxZQUFJLEVBQUUsUUFBRixDQUFXLEdBQVgsQ0FBSixFQUFxQjtBQUNuQixlQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBdkIsRUFBMkMsS0FBM0M7QUFDQSxjQUFJLE9BQU8sS0FBSyxTQUFMLENBQWUsY0FBZixDQUE4QixLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQTlCLENBQVg7QUFDQSxjQUFJLFlBQVksSUFBSSxDQUFKLE1BQVcsR0FBWCxHQUFpQixJQUFJLE1BQUosR0FBYSxDQUE5QixHQUFrQyxJQUFJLE1BQXREO0FBQ0EsY0FBSSxlQUFlLEVBQUUsR0FBRixDQUFNLElBQU4sRUFBWSxVQUFTLEdBQVQsRUFBYztBQUMzQyxnQkFBSSxVQUFVLEVBQUUsTUFBRixDQUFTLElBQUksT0FBYixFQUFzQjtBQUFBLHFCQUFVLEVBQUUsU0FBRixDQUFZLE9BQU8sQ0FBUCxDQUFaLE1BQzFDLE9BQU8sQ0FBUCxFQUFVLE9BQVYsS0FBc0IsS0FBdkIsSUFBa0MsSUFBSSxHQUFKLENBQVEsTUFBUixJQUFrQixTQURULENBQVY7QUFBQSxhQUF0QixDQUFkO0FBR0EsbUJBQU87QUFDTCxtQkFBSyxJQUFJLEdBREo7QUFFTCxxQkFBTyxJQUFJLEtBRk47QUFHTCxtQkFBSyxFQUFFLEdBQUYsQ0FBTSxPQUFOLEVBQWU7QUFBQSx1QkFBVSxPQUFPLENBQVAsQ0FBVjtBQUFBLGVBQWY7QUFIQSxhQUFQO0FBS0gsV0FUb0IsQ0FBbkI7O0FBV0EsWUFBRSxJQUFGLENBQU8sWUFBUCxFQUFxQixlQUFPO0FBQzFCLG1CQUFPLEVBQUUsSUFBRixDQUFPLElBQUksR0FBWCxFQUFnQixjQUFNO0FBQzNCLGtCQUFJLEdBQUcsTUFBUCxFQUFlO0FBQ2IsbUJBQUcsRUFBSCxDQUFNLEtBQU4sRUFBYSxjQUFiLEVBQ0ssTUFETCxTQUNhLElBQUksR0FEakIsVUFDeUIsS0FBSyxTQUFMLENBQWUsSUFBSSxLQUFuQixDQUR6QjtBQUVEO0FBQ0Qsa0JBQUksUUFBUSxTQUFSLEtBQVE7QUFBQSx1QkFBTSxPQUFLLFlBQUwsQ0FBa0IsSUFBSSxHQUF0QixFQUEyQixFQUEzQixDQUFOO0FBQUEsZUFBWjtBQUNBLGtCQUFJLEtBQUssSUFBVCxFQUFlO0FBQ2IsdUJBQU8sR0FBRyxJQUFJLEtBQVAsRUFBYyxJQUFJLEdBQWxCLEVBQXVCLEtBQXZCLENBQVA7QUFDRCxlQUZELE1BRU87QUFDTCx1QkFBTyxHQUFHLENBQUgsQ0FBSyxLQUFMLENBQVcsRUFBWCxFQUFlLElBQUksS0FBbkIsRUFBMEIsSUFBSSxHQUE5QixFQUFtQyxLQUFuQyxDQUFQO0FBQ0Q7QUFDRixhQVhNLENBQVA7QUFZRCxXQWJEO0FBY0QsU0E3QkQsTUE2Qk87QUFDTCxhQUFHLEVBQUgsQ0FBTSxPQUFOLEVBQWUsU0FBZixFQUE2QixJQUE3QixTQUFxQyxHQUFyQztBQUNEO0FBQ0Y7QUExRUg7QUFBQTtBQUFBLCtCQTRFVyxHQTVFWCxFQTRFZ0IsS0E1RWhCLEVBNEV1QixJQTVFdkIsRUE0RTZCO0FBQ3pCLGVBQU8sS0FBSyxPQUFMLENBQWEsT0FBTyxHQUFQLENBQWIsRUFBMEIsS0FBMUIsRUFBaUMsSUFBakMsQ0FBUDtBQUNEO0FBOUVIO0FBQUE7QUFBQSxtQ0FnRmUsR0FoRmYsRUFnRm9CO0FBQ2hCLFlBQUksY0FBSjtBQUNBLFlBQUksS0FBSyxZQUFMLENBQWtCLEdBQWxCLENBQUosRUFBNEI7QUFBRSxpQkFBTyxHQUFHLEtBQUgsQ0FBUyxZQUFULENBQXNCLEdBQXRCLENBQVA7QUFBb0M7QUFDbEUsWUFBSSxJQUFJLENBQUosTUFBVyxHQUFmLEVBQW9CO0FBQUUsZ0JBQU0sSUFBSSxTQUFKLENBQWMsQ0FBZCxDQUFOO0FBQXlCO0FBQy9DLFlBQUksT0FBTyxLQUFLLFNBQUwsQ0FBZSxjQUFmLENBQThCLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBOUIsQ0FBWDtBQUpnQjtBQUFBO0FBQUE7O0FBQUE7QUFLaEIsK0JBQWdCLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBaEIsOEhBQWtDO0FBQUEsZ0JBQXpCLEdBQXlCO0FBQUUsZ0JBQUksSUFBSSxHQUFKLEtBQVksR0FBaEIsRUFBcUI7QUFBRSxzQkFBUSxJQUFSO0FBQWU7QUFBRTtBQUw1RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU1oQixlQUFPLFVBQVUsSUFBakI7QUFDRDtBQXZGSDtBQUFBO0FBQUEsb0NBeUZnQixHQXpGaEIsRUF5RnFCO0FBQUUsZUFBTyxLQUFLLFlBQUwsQ0FBa0IsT0FBTyxHQUFQLENBQWxCLENBQVA7QUFBd0M7QUF6Ri9EO0FBQUE7QUFBQSxvQ0EyRmdCLEdBM0ZoQixFQTJGcUIsRUEzRnJCLEVBMkZ5QixJQTNGekIsRUEyRitCO0FBQUE7O0FBQzNCLFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQUUsaUJBQU8sRUFBUDtBQUFZO0FBQ2hDLFlBQUksT0FBTyxFQUFFLFFBQUYsQ0FBVyxHQUFYLElBQWtCLENBQUMsR0FBRCxDQUFsQixHQUEwQixHQUFyQztBQUNBLGVBQU8sS0FBSyxVQUFMLENBQWdCLEtBQUssTUFBTCxDQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBQWhCLEVBQXNDLFVBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYSxLQUFiLEVBQXVCO0FBQ2xFLGNBQUksS0FBSyxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLGVBQUcsS0FBSCxFQUFVLEdBQVY7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBSyxhQUFMLENBQW1CLElBQW5CLEVBQXlCLEVBQXpCLEVBQTZCLElBQTdCO0FBQ0Q7QUFDRCxpQkFBTyxPQUFQO0FBQ0QsU0FQTSxFQVFMLElBUkssQ0FBUDtBQVNEO0FBdkdIO0FBQUE7QUFBQSxxQ0F5R2lCLEdBekdqQixFQXlHc0IsRUF6R3RCLEVBeUcwQixJQXpHMUIsRUF5R2dDO0FBQzVCLGVBQU8sS0FBSyxhQUFMLENBQW1CLE9BQU8sR0FBUCxDQUFuQixFQUFnQyxFQUFoQyxFQUFvQyxJQUFwQyxDQUFQO0FBQ0Q7QUEzR0g7QUFBQTtBQUFBLGdDQTZHWSxHQTdHWixFQTZHaUIsRUE3R2pCLEVBNkdxQixJQTdHckIsRUE2RzJCO0FBQUE7O0FBQ3ZCLFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQUUsaUJBQU8sRUFBUDtBQUFZO0FBQ2hDLFlBQUksRUFBRSxRQUFGLENBQVcsR0FBWCxDQUFKLEVBQXFCO0FBQ25CLGlCQUFPLEtBQUssVUFBTCxDQUFnQixHQUFoQixFQUFxQixFQUFyQixFQUF5QixJQUF6QixDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBSSxTQUFTLEVBQUUsR0FBRixDQUFNLEdBQU4sRUFBVztBQUFBLG1CQUFRLE9BQUssVUFBTCxDQUFnQixJQUFoQixFQUFzQixFQUF0QixFQUEwQixJQUExQixDQUFSO0FBQUEsV0FBWCxDQUFiO0FBQ0EsaUJBQU87QUFBQSxtQkFBTSxFQUFFLElBQUYsQ0FBTyxNQUFQLEVBQWU7QUFBQSxxQkFBUyxPQUFUO0FBQUEsYUFBZixDQUFOO0FBQUEsV0FBUDtBQUNEO0FBQ0Y7QUFySEg7QUFBQTtBQUFBLGlDQXVIYSxHQXZIYixFQXVIa0IsRUF2SGxCLEVBdUhzQixJQXZIdEIsRUF1SDRCO0FBQUUsZUFBTyxLQUFLLFNBQUwsQ0FBZSxPQUFPLEdBQVAsQ0FBZixFQUE0QixFQUE1QixFQUFnQyxJQUFoQyxDQUFQO0FBQStDO0FBdkg3RTtBQUFBO0FBQUEsaUNBeUhhLEdBekhiLEVBeUhrQixFQXpIbEIsRUF5SHNCLElBekh0QixFQXlINEI7QUFBQTs7QUFDeEIsWUFBSSxRQUFRLElBQVosRUFBa0I7QUFBRSxpQkFBTyxFQUFQO0FBQVk7QUFDaEMsWUFBSSxLQUFLLFlBQUwsQ0FBa0IsR0FBbEIsQ0FBSixFQUE0QjtBQUFFLGlCQUFPLEdBQUcsS0FBSCxDQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0IsRUFBeEIsRUFBNEIsSUFBNUIsQ0FBUDtBQUEyQztBQUN6RSxZQUFJLEdBQUcsTUFBUCxFQUFlO0FBQUUsYUFBRyxFQUFILENBQU0sS0FBTixFQUFhLFdBQWIsRUFBNkIsSUFBN0IsU0FBcUMsR0FBckM7QUFBOEM7O0FBRS9ELGFBQUssU0FBTCxDQUFlLGNBQWYsQ0FBOEIsRUFBOUIsRUFBa0MsS0FBSyxRQUFMLENBQWMsR0FBZCxDQUFsQyxFQUFzRCxJQUF0RDtBQUNBLFlBQUksUUFBUSxLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBdkIsQ0FBWjtBQUNBLFlBQUksUUFBUSxTQUFSLEtBQVE7QUFBQSxpQkFBTSxPQUFLLFlBQUwsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkIsQ0FBTjtBQUFBLFNBQVo7QUFDQSxZQUFJLEtBQUssU0FBTCxJQUFvQixTQUFTLElBQVYsSUFBbUIsQ0FBQyxLQUFLLFFBQWhELEVBQTJEO0FBQUUsYUFBRyxLQUFILEVBQVUsR0FBVixFQUFlLEtBQWY7QUFBd0I7QUFDckYsZUFBTyxLQUFQO0FBQ0Q7QUFuSUg7QUFBQTtBQUFBLG1DQXFJZSxHQXJJZixFQXFJb0IsRUFySXBCLEVBcUl3QjtBQUNwQixZQUFJLEtBQUssWUFBTCxDQUFrQixHQUFsQixDQUFKLEVBQTRCO0FBQUUsaUJBQU8sR0FBRyxLQUFILENBQVMsWUFBVCxDQUFzQixHQUF0QixDQUFQO0FBQW9DO0FBQ2xFLFlBQUksR0FBRyxNQUFQLEVBQWU7QUFBRSxhQUFHLEVBQUgsQ0FBTSxLQUFOLEVBQWEsY0FBYixFQUFnQyxJQUFoQyxTQUF3QyxHQUF4QztBQUFpRDtBQUNsRSxlQUFPLEtBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDLEVBQWhDLEVBQW9DLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBcEMsQ0FBUDtBQUNEO0FBeklIO0FBQUE7QUFBQSxpQ0EySWE7QUFBRSxlQUFPLFNBQVMsR0FBRyxLQUFuQjtBQUEyQjtBQTNJMUM7QUFBQTtBQUFBLGtDQTZJYyxHQTdJZCxFQTZJbUI7QUFBRSxlQUFPLE9BQVEsSUFBSSxDQUFKLE1BQVcsR0FBMUI7QUFBaUM7QUE3SXREO0FBQUE7QUFBQSxtQ0ErSWUsR0EvSWYsRUErSW9CO0FBQUUsZUFBTyxDQUFDLEtBQUssUUFBTCxFQUFELElBQW9CLEtBQUssV0FBTCxDQUFpQixHQUFqQixDQUEzQjtBQUFtRDtBQS9JekU7QUFBQTtBQUFBLCtCQWlKVyxPQWpKWCxFQWlKb0I7QUFDaEIsWUFBSSxPQUFPLFFBQVEsS0FBUixDQUFjLEdBQWQsQ0FBWDtBQUNBLFlBQUksS0FBSyxDQUFMLE1BQVksRUFBaEIsRUFBb0I7QUFBRSxpQkFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFBdUIsU0FGN0IsQ0FFOEI7QUFDOUMsWUFBSSxHQUFHLE1BQUgsSUFBYyxLQUFLLE1BQUwsS0FBZ0IsQ0FBbEMsRUFBc0M7QUFDcEMsYUFBRyxFQUFILENBQU0sT0FBTixFQUFlLE9BQWYsRUFBMkIsSUFBM0IsU0FBbUMsT0FBbkM7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNEO0FBeEpIOztBQUFBO0FBQUE7QUEwSkEsUUFBTSxTQUFOO0FBQ0EsU0FBTyxLQUFQO0FBQ0QsQ0E5SlcsRUFBWjs7QUFnS0E7QUFDQSxHQUFHLEtBQUgsR0FBVyxLQUFYO0FBQ0EsR0FBRyxLQUFILEdBQVcsSUFBSSxLQUFKLEVBQVg7QUFDQSxHQUFHLEtBQUgsQ0FBUyxRQUFULEdBQW9CO0FBQUEsU0FBTSxhQUFOO0FBQUEsQ0FBcEI7Ozs7Ozs7OztjQzVTYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxDLEdBQU0sRSxDQUFOLEM7O0lBRUEsVTtBQUVKLHNCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFDakIsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNEOzs7OzhCQUVTLEksRUFBTTtBQUNkLFVBQUksUUFBUSxJQUFaLEVBQWtCO0FBQUUsZUFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFBdUI7QUFDM0MsYUFBTyxDQUFDLEVBQUUsUUFBRixDQUFXLElBQVgsRUFBaUIsU0FBakIsQ0FBUjtBQUNEOzs7MkJBRU07QUFDTCxhQUFPLEVBQUUsSUFBRixDQUFPLEtBQUssS0FBWixFQUFtQixVQUFTLElBQVQsRUFBZTtBQUN2QyxZQUFJLENBQUMsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFMLEVBQTJCO0FBQ3pCLFlBQUUsV0FBRixDQUFjLElBQWQsRUFBb0IsU0FBcEI7QUFDQSxpQkFBTyxLQUFLLE1BQUwsR0FBYyxLQUFyQjtBQUNEO0FBQ0YsT0FMTSxFQU1MLElBTkssQ0FBUDtBQU9EOzs7MkJBRU07QUFDTCxhQUFPLEVBQUUsSUFBRixDQUFPLEtBQUssS0FBWixFQUFtQixVQUFTLElBQVQsRUFBZTtBQUN2QyxZQUFJLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBSixFQUEwQjtBQUN4QixZQUFFLFFBQUYsQ0FBVyxJQUFYLEVBQWlCLFNBQWpCO0FBQ0EsaUJBQU8sS0FBSyxNQUFMLEdBQWMsSUFBckI7QUFDRDtBQUNGLE9BTE0sRUFNTCxJQU5LLENBQVA7QUFPRDs7OytCQUVVLEksRUFBTTtBQUNmLGFBQU8sRUFBRSxJQUFGLENBQU8sS0FBSyxLQUFaLEVBQW1CO0FBQUEsZUFBUSxLQUFLLE1BQUwsR0FBYyxJQUF0QjtBQUFBLE9BQW5CLENBQVA7QUFDRDs7O2dDQUVXLFUsRUFBWTtBQUN0QixVQUFJLEtBQUssVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUFFLGFBQUssVUFBTCxHQUFrQixFQUFsQjtBQUF1QjtBQURoQztBQUFBO0FBQUE7O0FBQUE7QUFFdEIsNkJBQWlCLE1BQU0sSUFBTixDQUFXLEtBQUssS0FBaEIsQ0FBakIsOEhBQXlDO0FBQUEsY0FBaEMsSUFBZ0M7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdkMsa0NBQXNCLE1BQU0sSUFBTixDQUFXLEtBQUssVUFBaEIsQ0FBdEIsbUlBQW1EO0FBQUEsa0JBQTFDLFNBQTBDO0FBQUUsZ0JBQUUsV0FBRixDQUFjLElBQWQsRUFBb0IsU0FBcEI7QUFBaUM7QUFEL0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFFdkMsa0NBQWtCLE1BQU0sSUFBTixDQUFXLFVBQVgsQ0FBbEIsbUlBQTBDO0FBQXJDLHVCQUFxQzs7QUFDeEMsa0JBQUksVUFBVSxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLGtCQUFFLFFBQUYsQ0FBVyxJQUFYLEVBQWlCLFNBQWpCO0FBQ0EscUJBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixTQUFyQjtBQUNEO0FBQ0Y7QUFQc0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVF4QztBQVZxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBV3ZCOzs7Z0NBRVcsUSxFQUFVO0FBQ3BCLFVBQUksWUFBWSxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQWhCO0FBRG9CLFVBRWQsVUFGYyxHQUVDLFNBRkQsQ0FFZCxVQUZjO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBR3BCLDhCQUFpQixNQUFNLElBQU4sQ0FBVyxRQUFYLENBQWpCLG1JQUF1QztBQUFBLGNBQTlCLElBQThCO0FBQUUscUJBQVcsWUFBWCxDQUF3QixJQUF4QixFQUE4QixTQUE5QjtBQUEyQztBQUhoRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUlwQiw4QkFBYSxNQUFNLElBQU4sQ0FBVyxLQUFLLEtBQWhCLENBQWIsbUlBQXFDO0FBQWhDLGNBQWdDO0FBQUUscUJBQVcsV0FBWCxDQUF1QixJQUF2QjtBQUErQjtBQUpsRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUtwQixhQUFPLEtBQUssS0FBTCxHQUFhLFFBQXBCO0FBQ0Q7Ozs7OztBQUdILEdBQUcsVUFBSCxHQUFnQixVQUFoQjs7Ozs7Ozs7O2NDN0RhLE07SUFBUCxFLFdBQUEsRTtJQUNBLEMsR0FBTSxFLENBQU4sQzs7SUFFQSxNOzs7Ozs7O2dDQUVRLEcsRUFBSztBQUNmLFVBQUksS0FBSyxTQUFMLElBQWtCLElBQXRCLEVBQTRCO0FBQUUsYUFBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQXNCO0FBQ3BELFVBQUksS0FBSyxRQUFMLEVBQUosRUFBcUI7QUFBRSxhQUFLLE1BQUwsQ0FBWSxLQUFLLEtBQWpCO0FBQTBCO0FBQ2pELFdBQUssS0FBTCxHQUFhLEdBQWI7QUFDQSxVQUFJLEtBQUssY0FBVCxFQUF5QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFFLCtCQUFtQixNQUFNLElBQU4sQ0FBVyxLQUFLLGNBQWhCLENBQW5CLDhIQUFvRDtBQUFBLGdCQUEzQyxNQUEyQztBQUFFLGlCQUFLLGdCQUFMLENBQXNCLE1BQXRCO0FBQWdDO0FBQXhGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMEY7QUFDbkgsYUFBTyxLQUFLLGNBQUwsRUFBUDtBQUNEOzs7a0NBRWE7QUFDWixVQUFJLEtBQUssUUFBTCxFQUFKLEVBQXFCO0FBQ25CLFlBQUksS0FBSyxTQUFULEVBQW9CO0FBQUUsZUFBSyxJQUFJLE1BQVQsSUFBbUIsS0FBSyxTQUF4QixFQUFtQztBQUFFLGlCQUFLLGVBQUwsQ0FBcUIsTUFBckI7QUFBK0I7QUFBRTtBQUM1RixhQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsZUFBTyxLQUFLLGNBQUwsRUFBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7cUNBQ2lCLENBQUU7OzsrQkFFUjtBQUFFLGFBQVEsS0FBSyxLQUFMLElBQWMsSUFBdEI7QUFBOEI7OztpQ0FFOUIsTyxFQUFTO0FBQUE7O0FBQ3BCLFVBQUksS0FBSyxjQUFMLElBQXVCLElBQTNCLEVBQWlDO0FBQUUsYUFBSyxjQUFMLEdBQXNCLEVBQXRCO0FBQTJCO0FBQzlELGFBQVEsWUFBTTtBQUNaLFlBQUksU0FBUyxFQUFiO0FBRFk7QUFBQTtBQUFBOztBQUFBO0FBRVosZ0NBQW1CLE1BQU0sSUFBTixDQUFXLE9BQVgsQ0FBbkIsbUlBQXdDO0FBQUEsZ0JBQS9CLE1BQStCOztBQUN0QyxrQkFBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLE1BQXpCO0FBQ0EsbUJBQU8sSUFBUCxDQUFZLE1BQUssZ0JBQUwsQ0FBc0IsTUFBdEIsQ0FBWjtBQUNEO0FBTFc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNWixlQUFPLE1BQVA7QUFDRCxPQVBNLEVBQVA7QUFRRDs7O29DQUVlLE8sRUFBUztBQUFBOztBQUN2QixhQUFRLFlBQU07QUFDWixZQUFJLFNBQVMsRUFBYjtBQURZO0FBQUE7QUFBQTs7QUFBQTtBQUVaLGdDQUFtQixNQUFNLElBQU4sQ0FBVyxPQUFYLENBQW5CLG1JQUF3QztBQUFBLGdCQUEvQixNQUErQjs7QUFDdEMsbUJBQUssZUFBTCxDQUFxQixNQUFyQjtBQUNBLGdCQUFJLFFBQVEsT0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQTRCLE1BQTVCLENBQVo7QUFDQSxnQkFBSSxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUFFLHFCQUFPLElBQVAsQ0FBWSxPQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsS0FBM0IsRUFBa0MsQ0FBbEMsQ0FBWjtBQUFvRCxhQUF0RSxNQUE0RTtBQUMxRSxxQkFBTyxJQUFQLENBQVksU0FBWjtBQUNEO0FBQ0Y7QUFSVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVNaLGVBQU8sTUFBUDtBQUNELE9BVk0sRUFBUDtBQVdEOzs7cUNBRWdCLE0sRUFBUTtBQUN2QixVQUFJLEtBQUssUUFBTCxFQUFKLEVBQXFCO0FBQ25CLFlBQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWQ7QUFDQSxhQUFLLFNBQUwsQ0FBZSxNQUFmLElBQXlCLE9BQXpCO0FBQ0EsZUFBTyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLFlBQVc7QUFBQTs7QUFDckMsY0FBSSxPQUFPLEVBQVgsQ0FBZSxJQUFJLElBQUksQ0FBQyxDQUFUO0FBQ2YsaUJBQU8sRUFBRSxDQUFGLEdBQU0sVUFBVSxNQUF2QixFQUErQjtBQUFFLGlCQUFLLElBQUwsQ0FBVSxVQUFVLENBQVYsQ0FBVjtBQUEwQjtBQUMzRCxjQUFJLFdBQVcsU0FBWCxRQUFXLFVBQVc7QUFDeEIsbUJBQU8sZ0JBQWdCLE9BQWhCLEVBQXlCLE9BQXpCLEVBQWtDO0FBQUEscUJBQUssRUFBRSxLQUFGLENBQVEsT0FBSyxLQUFiLEVBQW9CLE9BQXBCLENBQUw7QUFBQSxhQUFsQyxDQUFQO0FBQ0QsV0FGRDtBQUdBLGlCQUFPLEtBQUssTUFBTCxFQUFhLFFBQWIsRUFBdUIsSUFBdkIsQ0FBUDtBQUNELFNBUDJCLENBTzFCLElBUDBCLENBT3JCLElBUHFCLENBQTVCO0FBUUQ7QUFDRjs7O29DQUVlLE0sRUFBUTtBQUN0QixVQUFJLEtBQUssUUFBTCxFQUFKLEVBQXFCO0FBQ25CLGFBQUssS0FBTCxDQUFXLE1BQVgsSUFBcUIsS0FBSyxTQUFMLENBQWUsTUFBZixDQUFyQjtBQUNBLGVBQU8sT0FBTyxLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQWQ7QUFDRDtBQUNGOzs7Ozs7QUFHSCxHQUFHLE1BQUgsR0FBWSxNQUFaOztBQUVBLFNBQVMsZUFBVCxDQUF5QixHQUF6QixFQUE4QixVQUE5QixFQUEwQyxTQUExQyxFQUFxRDtBQUNuRCxNQUFJLE9BQU8sR0FBUCxLQUFlLFdBQWYsSUFBOEIsUUFBUSxJQUF0QyxJQUE4QyxPQUFPLElBQUksVUFBSixDQUFQLEtBQTJCLFVBQTdFLEVBQXlGO0FBQ3ZGLFdBQU8sVUFBVSxHQUFWLEVBQWUsVUFBZixDQUFQO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxTQUFQO0FBQ0Q7QUFDRjs7Ozs7Y0NwRlksTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDOzs7QUFFTixJQUFJLElBQUssR0FBRyxDQUFILEdBQU8sVUFBUyxRQUFULEVBQW1CLEtBQW5CLEVBQTBCO0FBQ3hDLE1BQUssU0FBUyxJQUFWLElBQW9CLFVBQVUsQ0FBbEMsRUFBc0M7QUFDcEMsV0FBTyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBUDtBQUNELEdBRkQsTUFFTztBQUNMLFFBQUksV0FBVyxTQUFTLGdCQUFULENBQTBCLFFBQTFCLENBQWY7QUFDQSxRQUFLLFNBQVMsSUFBVixJQUFvQixRQUFRLFNBQVMsTUFBekMsRUFBa0Q7QUFDaEQsYUFBTyxTQUFTLEtBQVQsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sUUFBUDtBQUNEO0FBQ0Y7QUFDRixDQVhEOztBQWFBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBRixHQUFTLFlBQVc7QUFDbEIsTUFBSSxlQUFKO0FBQUEsTUFBWSxpQkFBWjtBQUNBLE1BQUksVUFBVSxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLGFBQVMsVUFBVSxDQUFWLENBQVQ7QUFDQSxlQUFXLFVBQVUsQ0FBVixDQUFYO0FBQ0QsR0FIRCxNQUdPO0FBQ0wsYUFBUyxRQUFUO0FBQ0EsZUFBVyxVQUFVLENBQVYsQ0FBWDtBQUNEO0FBQ0QsU0FBTyxPQUFPLGdCQUFQLENBQXdCLFFBQXhCLENBQVA7QUFDRCxDQVZEOztBQVlBLEVBQUUsWUFBRixHQUFpQixVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCLFNBQXpCLEVBQW9DLE9BQXBDLEVBQTZDLE9BQTdDLEVBQXNEO0FBQ3JFLE1BQUksV0FBVyxJQUFmLEVBQXFCO0FBQUUsY0FBVSxNQUFWO0FBQW1CO0FBQzFDLE1BQUksWUFBWSxTQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLElBQXZCLENBQWhCLEVBQThDO0FBQzVDLE1BQUUsYUFBRixDQUFnQixJQUFoQixFQUFzQixVQUFTLEtBQVQsRUFBZ0I7QUFDcEMsVUFBSSxDQUFDLE9BQUQsSUFBWSxRQUFRLElBQVIsQ0FBYSxPQUFiLEVBQXNCLEtBQXRCLENBQWhCLEVBQThDO0FBQzVDLGVBQU8sRUFBRSxZQUFGLENBQWUsS0FBZixFQUFzQixRQUF0QixFQUFnQyxTQUFoQyxFQUEyQyxPQUEzQyxFQUFvRCxPQUFwRCxDQUFQO0FBQ0Q7QUFDRixLQUpEO0FBS0EsUUFBSSxTQUFKLEVBQWU7QUFBRSxnQkFBVSxJQUFWLENBQWUsT0FBZixFQUF3QixJQUF4QjtBQUFnQztBQUNsRDtBQUNELFNBQU8sSUFBUDtBQUNELENBWEQ7O0FBYUEsRUFBRSxhQUFGLEdBQWtCLFVBQVMsTUFBVCxFQUFpQixFQUFqQixFQUFxQixPQUFyQixFQUE4QjtBQUM5QyxNQUFJLFdBQVcsSUFBZixFQUFxQjtBQUFFLGNBQVUsTUFBVjtBQUFtQjtBQURJO0FBQUE7QUFBQTs7QUFBQTtBQUU5Qyx5QkFBa0IsTUFBTSxJQUFOLENBQVcsT0FBTyxRQUFsQixDQUFsQiw4SEFBK0M7QUFBQSxVQUF0QyxLQUFzQztBQUFFLFNBQUcsSUFBSCxDQUFRLE9BQVIsRUFBaUIsS0FBakI7QUFBMEI7QUFGN0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUcvQyxDQUhEOztBQUtBLEVBQUUsU0FBRixHQUFjLFVBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQixFQUEzQixFQUErQixPQUEvQixFQUF3QztBQUNwRCxNQUFJLFdBQVcsSUFBZixFQUFxQjtBQUFFLGNBQVUsTUFBVjtBQUFtQjtBQURVO0FBQUE7QUFBQTs7QUFBQTtBQUVwRCwwQkFBaUIsTUFBTSxJQUFOLENBQVcsS0FBSyxJQUFMLENBQVUsTUFBVixFQUFrQixRQUFsQixDQUFYLENBQWpCLG1JQUEwRDtBQUFBLFVBQWpELElBQWlEOztBQUN4RCxTQUFHLElBQUgsQ0FBUSxPQUFSLEVBQWlCLElBQWpCO0FBQ0Q7QUFKbUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtyRCxDQUxEOztBQU9BLEVBQUUsWUFBRixHQUFpQixVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsRUFBM0IsRUFBK0IsT0FBL0IsRUFBd0M7QUFDdkQsTUFBSSxXQUFXLElBQWYsRUFBcUI7QUFBRSxjQUFVLE1BQVY7QUFBbUI7QUFEYTtBQUFBO0FBQUE7O0FBQUE7QUFFdkQsMEJBQWlCLE1BQU0sSUFBTixDQUFXLEtBQUssSUFBTCxDQUFVLE1BQVYsYUFBMkIsUUFBM0IsT0FBWCxDQUFqQixtSUFBc0U7QUFBQSxVQUE3RCxJQUE2RDs7QUFDcEUsU0FBRyxJQUFILENBQVEsT0FBUixFQUFpQixJQUFqQixFQUF1QixFQUFFLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFFBQWhCLENBQXZCO0FBQ0Q7QUFKc0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUt4RCxDQUxEOztBQU9BLEVBQUUsY0FBRixHQUFtQixVQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLE9BQW5CLEVBQTRCO0FBQzdDLE1BQUksUUFBUyxNQUFNLElBQU4sQ0FBVyxLQUFLLFVBQWhCLEVBQTRCLEdBQTVCLENBQWdDLFVBQUMsSUFBRDtBQUFBLFdBQVUsQ0FBQyxLQUFLLFNBQU4sRUFBaUIsS0FBSyxJQUF0QixFQUE0QixLQUFLLEtBQWpDLENBQVY7QUFBQSxHQUFoQyxDQUFiO0FBQ0EsTUFBSSxJQUFJLENBQUMsQ0FBVDtBQUNBLFNBQU8sRUFBRSxDQUFGLEdBQU0sTUFBTSxNQUFuQixFQUEyQjtBQUFFO0FBQzNCLFFBQUksT0FBTyxNQUFNLENBQU4sQ0FBWDtBQUNBLFFBQUksS0FBSyxDQUFMLE1BQVksS0FBaEIsRUFBdUI7QUFBRSxTQUFHLElBQUgsQ0FBUSxXQUFXLE1BQW5CLEVBQTJCLEtBQUssQ0FBTCxDQUEzQixFQUFvQyxLQUFLLENBQUwsQ0FBcEMsRUFBNkMsS0FBN0M7QUFBc0Q7QUFDaEY7QUFDRixDQVBEOztBQVNBLEVBQUUsWUFBRixHQUFpQixVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCO0FBQ3hDLE1BQUksS0FBSyxZQUFMLElBQXFCLElBQXpCLEVBQStCO0FBQUUsV0FBTyxLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBUDtBQUFxQztBQUN2RSxDQUZEOztBQUlBLEVBQUUsWUFBRixHQUFpQixVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCLEtBQXpCLEVBQWdDO0FBQy9DLE1BQUksS0FBSyxZQUFMLElBQXFCLElBQXpCLEVBQStCO0FBQUUsV0FBTyxLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEIsS0FBNUIsQ0FBUDtBQUE0QztBQUM5RSxDQUZEOztBQUlBLEVBQUUsZUFBRixHQUFvQixVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCO0FBQzNDLE1BQUksS0FBSyxlQUFMLElBQXdCLElBQTVCLEVBQWtDO0FBQUUsV0FBTyxLQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBUDtBQUF3QztBQUM3RSxDQUZEOztBQUlBLEVBQUUsWUFBRixHQUFpQixVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCO0FBQ3hDLE1BQUksS0FBSyxZQUFMLElBQXFCLElBQXpCLEVBQStCO0FBQUUsV0FBTyxLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBUDtBQUFxQyxHQUF0RSxNQUE0RTtBQUFFLFdBQU8sS0FBUDtBQUFlO0FBQzlGLENBRkQ7O0FBSUEsRUFBRSxPQUFGLEdBQVksVUFBUyxJQUFULEVBQWUsUUFBZixFQUF5QixLQUF6QixFQUFnQztBQUMxQyxNQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQixRQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNsQixhQUFPLEVBQUUsWUFBRixDQUFlLElBQWYsWUFBNkIsUUFBN0IsRUFBeUMsS0FBekMsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sRUFBRSxlQUFGLENBQWtCLElBQWxCLFlBQWdDLFFBQWhDLENBQVA7QUFDRDtBQUNGLEdBTkQsTUFNTztBQUNMLFdBQU8sRUFBRSxZQUFGLENBQWUsSUFBZixZQUE2QixRQUE3QixDQUFQO0FBQ0Q7QUFDRixDQVZEOztBQVlBLEVBQUUsWUFBRixHQUFpQixVQUFTLE1BQVQsRUFBaUIsS0FBakIsRUFBd0I7QUFDdkMsTUFBSSxPQUFPLE1BQU0sVUFBakI7QUFDQSxTQUFPLElBQVAsRUFBYTtBQUNYLFFBQUksQ0FBQyxJQUFELElBQVUsU0FBUyxNQUF2QixFQUFnQztBQUFFO0FBQVE7QUFDMUMsV0FBTyxLQUFLLFVBQVo7QUFDRDtBQUNELFNBQU8sU0FBUyxNQUFoQjtBQUNELENBUEQ7O0FBU0EsRUFBRSxRQUFGLEdBQWEsVUFBUyxJQUFULEVBQWUsU0FBZixFQUEwQjtBQUNyQyxNQUFJLEtBQUssU0FBTCxJQUFrQixJQUF0QixFQUE0QjtBQUMxQixXQUFPLEtBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsU0FBbkIsQ0FBUDtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU8sS0FBSyxTQUFMLEdBQW9CLEtBQUssU0FBekIsU0FBc0MsU0FBN0M7QUFDRDtBQUNGLENBTkQ7O0FBUUEsRUFBRSxXQUFGLEdBQWdCLFVBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEI7QUFDeEMsTUFBSSxLQUFLLFNBQUwsSUFBa0IsSUFBdEIsRUFBNEI7QUFDMUIsV0FBTyxLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFNBQXRCLENBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPLEtBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFNBQXZCLEVBQWtDLEVBQWxDLENBQXhCO0FBQ0Q7QUFDRixDQU5EOztBQVFBLEVBQUUsUUFBRixHQUFhLFVBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEI7QUFDckMsTUFBSSxLQUFLLFNBQUwsSUFBa0IsSUFBdEIsRUFBNEI7QUFDMUIsV0FBTyxLQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLFNBQXhCLENBQVA7QUFDRCxHQUZELE1BRU8sSUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDekIsV0FBTyxLQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLElBQUksTUFBSixDQUFjLFNBQWQsV0FBckIsTUFBMEQsSUFBakU7QUFDRDtBQUNGLENBTkQ7O0FBUUEsRUFBRSxXQUFGLEdBQWdCLFVBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEI7QUFDeEMsTUFBSSxFQUFFLFFBQUYsQ0FBVyxJQUFYLEVBQWlCLFNBQWpCLENBQUosRUFBaUM7QUFDL0IsV0FBTyxFQUFFLFdBQUYsQ0FBYyxJQUFkLEVBQW9CLFNBQXBCLENBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPLEVBQUUsUUFBRixDQUFXLElBQVgsRUFBaUIsU0FBakIsQ0FBUDtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxFQUFFLGFBQUYsR0FBa0I7QUFBQSxTQUFRLEtBQUssWUFBTCxJQUFxQixPQUFPLGdCQUFQLENBQXdCLElBQXhCLEVBQThCLElBQTlCLENBQTdCO0FBQUEsQ0FBbEI7O0FBRUEsRUFBRSxhQUFGLEdBQWtCLFVBQVMsSUFBVCxFQUFlO0FBQy9CLE1BQUksZ0JBQWdCLEVBQUUsYUFBRixDQUFnQixJQUFoQixDQUFwQjtBQUNBLFNBQVEsV0FBVyxjQUFjLFNBQWQsQ0FBWixJQUNQLENBQUMsRUFBRSxjQUFGLENBQWlCLGNBQWMsU0FBZCxDQUFqQixDQURNLElBRVAsQ0FBQyxFQUFFLGNBQUYsQ0FBaUIsY0FBYyxZQUFkLENBQWpCLENBRkQ7QUFHRCxDQUxEOztBQU9BLEVBQUUsV0FBRixHQUFnQixVQUFTLElBQVQsRUFBZSxPQUFmLEVBQXdCO0FBQ3RDLE1BQUksVUFBVSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCLFFBQUksS0FBSyxXQUFMLElBQW9CLElBQXhCLEVBQThCO0FBQzVCLGFBQU8sS0FBSyxXQUFMLEdBQW1CLE9BQTFCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxLQUFLLFNBQUwsR0FBaUIsT0FBeEI7QUFDRDtBQUNGLEdBTkQsTUFNTztBQUNMLFdBQU8sS0FBSyxXQUFMLElBQW9CLEtBQUssU0FBaEM7QUFDRDtBQUNGLENBVkQ7O0FBWUEsRUFBRSxTQUFGLEdBQWMsVUFBUyxJQUFULEVBQWUsT0FBZixFQUF3QjtBQUNwQyxNQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQixXQUFPLEtBQUssU0FBTCxHQUFpQixPQUF4QjtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU8sS0FBSyxTQUFaO0FBQ0Q7QUFDRixDQU5EOztBQVFBLEVBQUUsR0FBRixHQUFRLFVBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEIsS0FBMUIsRUFBaUM7QUFDdkMsTUFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsV0FBTyxLQUFLLEtBQUwsQ0FBVyxTQUFYLElBQXdCLEtBQS9CO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQVA7QUFDRDtBQUNGLENBTkQ7O0FBUUEsRUFBRSxRQUFGLEdBQWE7QUFBQSxTQUFRLEtBQUssUUFBYjtBQUFBLENBQWI7O0FBRUEsRUFBRSxVQUFGLEdBQWUsWUFBVztBQUN4QixNQUFJLGVBQUo7QUFDQSxNQUFJLEtBQUssU0FBUyxlQUFsQjtBQUNBLE1BQUksRUFBSixFQUFRO0FBQUUsYUFBUyxHQUFHLFlBQUgsSUFBbUIsR0FBRyxZQUF0QixJQUFzQyxHQUFHLFlBQWxEO0FBQWlFO0FBQzNFLE1BQUksQ0FBQyxNQUFMLEVBQWE7QUFBRSxhQUFTLE9BQU8sV0FBaEI7QUFBOEI7QUFKckIsa0JBS1QsUUFMUztBQUFBLE1BS2xCLElBTGtCLGFBS2xCLElBTGtCOztBQU14QixNQUFJLGFBQWEsS0FBSyxZQUFMLElBQXFCLEtBQUssWUFBMUIsSUFBMEMsS0FBSyxZQUFoRTtBQUNBLFdBQVMsS0FBSyxHQUFMLENBQVMsTUFBVCxFQUFpQixVQUFqQixDQUFUO0FBQ0EsU0FBVSxNQUFWO0FBQ0QsQ0FURDs7QUFXQSxFQUFFLGFBQUYsR0FBa0IsVUFBUyxHQUFULEVBQWMsU0FBZCxFQUF5QjtBQUN6QyxNQUFJLFVBQVUsU0FBUyxhQUFULENBQXVCLEdBQXZCLENBQWQ7QUFDQSxVQUFRLFNBQVIsR0FBb0IsU0FBcEI7QUFDQSxTQUFPLE9BQVA7QUFDRCxDQUpEOzs7Ozs7Ozs7Y0MvTGEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsTSxHQUFXLEUsQ0FBWCxNO0lBQ0EsSyxHQUFVLEUsQ0FBVixLOztJQUVBLFU7OzsrQkFFTztBQUFFLGFBQU8sWUFBUDtBQUFzQjs7O0FBRW5DLHdCQUFjO0FBQUE7O0FBQUE7O0FBQ1osU0FBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFVBQU0sU0FBTixDQUFnQixPQUFPLHdCQUFQLENBQWhCLEVBQWtELFlBQU07QUFDdEQsYUFBTyxFQUFFLElBQUYsQ0FBTyxNQUFLLElBQVosRUFBa0I7QUFBQSxlQUFPLElBQUksWUFBSixDQUFpQixJQUFJLEdBQXJCLENBQVA7QUFBQSxPQUFsQixDQUFQO0FBQ0QsS0FGRDs7QUFJQSxRQUFJLEdBQUcsTUFBSCxJQUFhLENBQUMsS0FBSyxXQUFMLEVBQWxCLEVBQXNDO0FBQ3BDLFNBQUcsRUFBSCxDQUFNLE9BQU4sRUFBZSxlQUFmLEVBQWdDLDhCQUFoQztBQUNEO0FBQ0Y7Ozs7a0NBRWE7QUFBRSxhQUFRLE9BQU8sVUFBUCxJQUFxQixJQUE3QjtBQUFxQzs7OzJCQUU5QyxXLEVBQWEsSSxFQUFNLEssRUFBTztBQUMvQixVQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNwQixZQUFJLE1BQU0sT0FBTyxVQUFQLENBQWtCLFdBQWxCLENBQVY7QUFDQSxZQUFJLGVBQWUsU0FBZixZQUFlLENBQVMsR0FBVCxFQUFjO0FBQUUsY0FBSSxJQUFJLE9BQVIsRUFBaUI7QUFBRSxtQkFBTyxNQUFQO0FBQWdCLFdBQW5DLE1BQXlDO0FBQUUsbUJBQU8sT0FBUDtBQUFpQjtBQUFFLFNBQWpHO0FBQ0EscUJBQWEsR0FBYjtBQUNBLFlBQUksV0FBSixDQUFnQixZQUFoQjtBQUNBLGVBQU8sS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLEVBQUMsUUFBRCxFQUFNLElBQUksSUFBVixFQUFnQixLQUFLLEtBQXJCLEVBQTRCLDBCQUE1QixFQUFmLENBQVA7QUFDRDtBQUNGOzs7MkJBRU0sVyxFQUFhLEksRUFBTSxLLEVBQU87QUFDL0IsV0FBSyxJQUFJLFFBQVEsQ0FBakIsRUFBb0IsUUFBUSxLQUFLLElBQUwsQ0FBVSxNQUF0QyxFQUE4QyxPQUE5QyxFQUF1RDtBQUNyRCxZQUFJLE1BQU0sS0FBSyxJQUFMLENBQVUsS0FBVixDQUFWO0FBQ0EsWUFBSyxJQUFJLEdBQUosQ0FBUSxLQUFSLEtBQWtCLFdBQW5CLElBQW9DLElBQUksRUFBSixLQUFXLElBQS9DLElBQXlELElBQUksR0FBSixLQUFZLEtBQXpFLEVBQWlGO0FBQy9FLGNBQUksR0FBSixDQUFRLGNBQVIsQ0FBdUIsSUFBSSxZQUEzQjtBQUNBLGVBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsS0FBakI7QUFDQTtBQUNEO0FBQ0Y7QUFDRjs7Ozs7O0FBR0gsR0FBRyxVQUFILEdBQWdCLElBQUksVUFBSixFQUFoQjs7Ozs7Ozs7O2NDNUNlLE07SUFBUCxFLFdBQUEsRTtJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLE0sR0FBVyxFLENBQVgsTTtJQUNBLEssR0FBVSxFLENBQVYsSztJQUNBLEksR0FBUyxFLENBQVQsSTs7QUFDUixJQUFNLFdBQVcsR0FBRyxRQUFwQjs7SUFFTSxjOzs7K0JBRU87QUFBRSxhQUFPLGdCQUFQO0FBQTBCOzs7QUFFdkMsNEJBQWM7QUFBQTtBQUFFOzs7OzJCQUVUO0FBQ0wsYUFBTyxFQUFFLFFBQUYsQ0FBVyxNQUFYLEVBQW1CLEVBQUUsa0JBQUYsRUFBbkIsQ0FBUDtBQUNEOzs7MkJBRU07QUFDTCxhQUFPLEVBQUUsUUFBRixDQUFXLE1BQVgsRUFBbUIsRUFBRSxrQkFBRixFQUFuQixDQUFQO0FBQ0Q7Ozs4QkFFUztBQUNSLGFBQU8sRUFBRSxRQUFGLENBQVcsU0FBWCxFQUFzQixFQUFFLGtCQUFGLEVBQXRCLENBQVA7QUFDRDs7O2lDQUVZLEssRUFBTztBQUFBOztBQUNsQixhQUFPLE1BQU0sU0FBTixDQUFnQixPQUFPLG9CQUFQLENBQWhCLEVBQThDLFlBQU07QUFDekQsWUFBTSxVQUFVLE1BQU0sR0FBTixDQUFVLE9BQU8sc0JBQVAsQ0FBVixDQUFoQjtBQUNBLFlBQU0sYUFBYSxFQUFFLFVBQUYsQ0FBYSxFQUFFLFFBQUYsQ0FBVyxFQUFFLFVBQUYsRUFBWCxDQUFiLENBQW5CO0FBQ0EsWUFBTSxTQUFTLEVBQUUsYUFBRixDQUFnQixLQUFoQixJQUF5QixhQUFhLEtBQXRDLEdBQThDLEtBQTdEO0FBQ0EsWUFBSSxXQUFXLENBQUMsRUFBRSxhQUFGLENBQWdCLE9BQWhCLENBQWhCLEVBQTBDO0FBQ3hDLGNBQU0sYUFBYSxFQUFFLGtCQUFGLENBQXFCLEVBQUUsTUFBRixDQUFTLE9BQU8sb0JBQVAsQ0FBVCxFQUN0QyxFQUFDLE1BQU0sTUFBSyxJQUFMLEVBQVAsRUFBb0IsS0FBSyxFQUFFLFFBQUYsQ0FBVyxNQUFYLENBQXpCLEVBRHNDLENBQXJCLENBQW5CO0FBR0EsaUJBQU8sS0FBSyxHQUFMLENBQVksT0FBWixTQUF1QixVQUF2QixDQUFQO0FBQ0Q7QUFDRixPQVZNLENBQVA7QUFXRDs7O2dDQUVXO0FBQ1YsVUFBSSxtQkFBSjtBQUNBLFVBQU0sYUFBYSxNQUFNLEdBQU4sQ0FBVSxPQUFPLGlCQUFQLENBQVYsQ0FBbkI7QUFDQSxVQUFJLGNBQWMsQ0FBQyxFQUFFLGFBQUYsQ0FBZ0IsVUFBaEIsQ0FBbkIsRUFBZ0Q7QUFDOUMscUJBQWEsRUFBRSxrQkFBRixDQUFxQixFQUFFLE1BQUYsQ0FBUyxPQUFPLGVBQVAsQ0FBVCxFQUFrQyxFQUFFLGNBQUYsQ0FBaUI7QUFDbkYsZ0JBQU0sS0FBSyxJQUFMLEVBRDZFLEVBQ2hFLE1BQU0sS0FBSyxJQUFMLEVBRDBELEVBQzdDLFNBQVMsS0FBSyxPQUFMLEVBRG9DLEVBQ3BCLE9BQU8sVUFEYTtBQUVuRixvQkFBVSxFQUZ5RSxFQUVyRSxVQUFVO0FBRjJELFNBQWpCLENBQWxDLENBQXJCLENBQWI7O0FBT0EsY0FBTSxPQUFOLENBQWMsT0FBTyxtQkFBUCxDQUFkLEVBQTJDLFVBQTNDO0FBQ0EsY0FBTSxPQUFOLENBQWMsT0FBTyx3QkFBUCxDQUFkLEVBQWdELElBQWhEO0FBQ0EsY0FBTSxPQUFOLENBQWMsT0FBTyxxQkFBUCxDQUFkLEVBQTZDLENBQTdDO0FBQ0Q7O0FBRUQsYUFBTyxFQUFDLHNCQUFELEVBQWEsc0JBQWIsRUFBUDtBQUNEOzs7K0JBRVUsVSxFQUFZLFcsRUFBYTtBQUNsQyxVQUFNLGdCQUFnQixLQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXRCO0FBQ0EsVUFBSSxpQkFBaUIsY0FBYyxXQUFuQyxFQUFnRDtBQUM5QyxZQUFNLGFBQWEsRUFBRSxrQkFBRixDQUFxQixFQUFFLGNBQUYsQ0FBaUIsRUFBQyxNQUFNLEtBQUssSUFBTCxFQUFQLEVBQW9CLE1BQU0sS0FBSyxJQUFMLEVBQTFCO0FBQ3pELG1CQUFTLEtBQUssT0FBTCxFQURnRCxFQUNoQyxPQUFPLFVBRHlCLEVBQ2IsS0FBSyxhQURRLEVBQWpCLENBQXJCLENBQW5CO0FBRUEsY0FBTSxhQUFOLENBQW9CLE9BQU8sb0JBQVAsQ0FBcEIsRUFBa0QsVUFBUyxJQUFULEVBQWU7QUFDL0QsY0FBTSxVQUFVLE1BQU0sR0FBTixDQUFVLE9BQU8sc0JBQVAsQ0FBVixDQUFoQjtBQUNBLGlCQUFPLEtBQUssSUFBTCxDQUFhLE9BQWIsU0FBd0IsVUFBeEIsRUFBc0MsS0FBSyxTQUFMLENBQWUsSUFBZixDQUF0QyxFQUNQLEVBQUMsZ0JBQWdCLGtCQUFqQixFQURPLEVBRU4sS0FGTSxDQUVBLFlBQVc7QUFDaEIsZ0JBQUksZUFBSjtBQUNBLG1CQUFPLFNBQVMsS0FBaEI7QUFBdUIsV0FKbEIsRUFJb0IsT0FKcEIsQ0FJNEIsWUFBVztBQUM1QyxnQkFBSSxlQUFKO0FBQ0EsbUJBQU8sU0FBUyxJQUFoQjtBQUNELFdBUE0sQ0FBUDtBQVFELFNBVkQsRUFXRSxFQUFDLFVBQVUsSUFBWCxFQVhGO0FBWUEsZUFBTyxPQUFPLFFBQVAsRUFBUDtBQUNEO0FBQ0QsWUFBTSxPQUFOLENBQWMsT0FBTyx3QkFBUCxDQUFkLEVBQWdELEtBQWhEO0FBQ0EsWUFBTSxPQUFOLENBQWMsT0FBTyxxQkFBUCxDQUFkLEVBQTZDLElBQTdDOztBQUVBLFVBQUksYUFBSixFQUFtQjtBQUNqQixZQUFNLGVBQWUsY0FBYyxNQUFuQztBQUNBLFlBQUksZ0JBQWlCLGFBQWEsTUFBYixHQUFzQixDQUEzQyxFQUErQztBQUM3QyxpQkFBTyxvQkFBUCxDQUE0QixhQUFhLE1BQXpDLEVBQ0EsT0FBTyxrQkFBUCxDQUEwQixVQUExQixDQURBO0FBRUQ7O0FBRUQsWUFBTSxnQkFBZ0IsTUFBTSxFQUFFLGtCQUFGLENBQXFCLEVBQUUsTUFBRixDQUFTLEVBQUMsVUFBVSxVQUFYLEVBQVQsRUFDL0MsRUFBQyxRQUFRLGNBQWMsSUFBdkIsRUFEK0MsQ0FBckIsQ0FBNUI7O0FBSUEsY0FBTSxPQUFOLENBQWMsT0FBTywwQkFBUCxDQUFkLEVBQWtELGFBQWxEO0FBQ0EsY0FBTSxPQUFOLENBQWMsT0FBTyxvQkFBUCxDQUFkLEVBQTRDLFlBQTVDO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDLGFBQUQsSUFBa0IsRUFBRSxjQUFjLE1BQWQsSUFBd0IsSUFBeEIsR0FBK0IsY0FBYyxNQUFkLENBQXFCLE1BQXBELEdBQTZELFNBQS9ELENBQXRCLEVBQWlHO0FBQy9GLGVBQU8sT0FBTyxVQUFQLENBQWtCLE9BQU8sVUFBekIsQ0FBUDtBQUNEO0FBQ0Y7OzsrQkFFVTtBQUFBOztBQUNULFVBQUksU0FBUyxNQUFNLEdBQU4sQ0FBVSxPQUFPLGtCQUFQLENBQVYsQ0FBYjtBQUNBLFVBQU0sVUFBVSxNQUFNLEdBQU4sQ0FBVSxPQUFPLHNCQUFQLENBQVYsQ0FBaEI7QUFDQSxVQUFJLFdBQVcsQ0FBQyxFQUFFLGFBQUYsQ0FBZ0IsT0FBaEIsQ0FBaEIsRUFBMEM7QUFBQSx5QkFDUCxLQUFLLFNBQUwsRUFETztBQUFBLFlBQ2pDLFVBRGlDLGNBQ2pDLFVBRGlDO0FBQUEsWUFDckIsVUFEcUIsY0FDckIsVUFEcUI7O0FBR3hDLGFBQUssR0FBTCxDQUFZLE9BQVosU0FBdUIsVUFBdkIsRUFDQyxLQURELENBQ087QUFBQSxpQkFBTSxTQUFTLEtBQWY7QUFBQSxTQURQLEVBQzZCLE9BRDdCLENBQ3FDLHVCQUFlO0FBQ2xELGlCQUFLLFVBQUwsQ0FBZ0IsVUFBaEIsRUFBNEIsV0FBNUI7QUFDQSxpQkFBTyxTQUFTLElBQWhCO0FBQ0QsU0FKRDtBQUtEO0FBQ0QsYUFBTyxNQUFQO0FBQ0Q7Ozs7OztBQUdILEdBQUcsR0FBSCxHQUFTLElBQUksY0FBSixFQUFUOzs7Ozs7Ozs7Y0NySGEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsTSxHQUFXLEUsQ0FBWCxNO0lBQ0EsSyxHQUFVLEUsQ0FBVixLOzs7QUFFTixJQUFJLGlCQUFpQjtBQUNuQixXQUFTO0FBQ1AsaUJBQWE7QUFETixHQURVO0FBSW5CLFVBQVE7QUFDTixpQkFBYTtBQURQLEdBSlc7QUFPbkIsU0FBTztBQUNMLGlCQUFhO0FBRFIsR0FQWTtBQVVuQixPQUFLO0FBQ0gsZ0JBQVk7QUFEVCxHQVZjO0FBYW5CLFFBQU07QUFDSixnQkFBWTtBQURSLEdBYmE7QUFnQm5CLFNBQU87QUFDTCxpQkFBYTtBQURSO0FBaEJZLENBQXJCOztJQXNCTSxNOzs7Z0NBRVEsSSxFQUFNO0FBQUUsYUFBVSxPQUFPLFlBQVAsQ0FBVixTQUFrQyxJQUFsQztBQUFvRDs7O0FBRXhFLG9CQUFjO0FBQUE7O0FBQ1osU0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDQSxRQUFJLE9BQU8sRUFBRSxNQUFGLENBQVMsRUFBVCxFQUFhLGNBQWIsRUFBNkIsTUFBTSxHQUFOLENBQVUsT0FBTyxZQUFQLENBQVYsQ0FBN0IsQ0FBWDtBQUNBLFFBQUksSUFBSixFQUFVO0FBQUUsUUFBRSxJQUFGLENBQU8sSUFBUCxFQUFhLEtBQUssZUFBbEI7QUFBcUM7QUFDbEQ7Ozs7b0NBRWUsSSxFQUFNLEksRUFBTTtBQUFBOztBQUMxQixVQUFJLEtBQUssVUFBTCxJQUNKLENBQUMsT0FBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLEtBQTNCLENBQWlDLEVBQUUsUUFBRixDQUFXLEtBQUssVUFBaEIsQ0FBakMsQ0FERCxFQUNnRTtBQUM5RCxlQUFPLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBUDtBQUNELE9BSEQsTUFHTyxJQUFJLEtBQUssV0FBVCxFQUFzQjtBQUMzQixZQUFJLEdBQUcsVUFBSCxDQUFjLFdBQWQsRUFBSixFQUFpQztBQUMvQixpQkFBTyxHQUFHLFVBQUgsQ0FBYyxNQUFkLENBQXFCLEtBQUssV0FBMUIsRUFBdUMsWUFBTTtBQUNsRCxtQkFBTyxNQUFLLFFBQUwsQ0FBYyxJQUFkLENBQVA7QUFDRCxXQUZNLEVBR0wsWUFBTTtBQUNOLG1CQUFPLE1BQUssU0FBTCxDQUFlLElBQWYsQ0FBUDtBQUNELFdBTE0sQ0FBUDtBQU1ELFNBUEQsTUFPTyxJQUFJLFNBQVMsTUFBTSxHQUFOLENBQVUsT0FBTyxvQkFBUCxDQUFWLENBQWIsRUFBc0Q7QUFDM0QsaUJBQU8sS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFQO0FBQ0QsU0FGTSxNQUVBO0FBQ0wsaUJBQU8sS0FBSyxTQUFMLENBQWUsSUFBZixDQUFQO0FBQ0Q7QUFDRixPQWJNLE1BYUE7QUFDTCxlQUFPLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBUDtBQUNEO0FBQ0Y7Ozs2QkFFUSxJLEVBQU07QUFDYixVQUFJLE1BQU0sS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQVY7QUFDQSxhQUFPLE1BQU0sT0FBTixDQUFjLEdBQWQsRUFBbUIsSUFBbkIsQ0FBUDtBQUNEOzs7OEJBRVMsSSxFQUFNO0FBQ2QsVUFBSSxNQUFNLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFWO0FBQ0EsVUFBSSxVQUFVLE1BQU0sR0FBTixDQUFVLEdBQVYsQ0FBZCxFQUE4QjtBQUFFLGVBQU8sTUFBTSxPQUFOLENBQWMsR0FBZCxFQUFtQixLQUFuQixDQUFQO0FBQW1DO0FBQ3BFOzs7Ozs7QUFHSCxNQUFNLFNBQU4sQ0FBZ0IsT0FBTyx1QkFBUCxDQUFoQixFQUFrRCxZQUFXO0FBQzNELE1BQUksU0FBUyxJQUFiO0FBQ0EsU0FBTztBQUFBLFdBQU0sVUFBVSxJQUFWLEdBQWlCLE1BQWpCLEdBQTJCLFNBQVMsSUFBSSxNQUFKLEVBQTFDO0FBQUEsR0FBUDtBQUNELENBSGdELEVBQWpEOztBQU1BLE1BQU0sT0FBTixDQUFjLE9BQU8sa0JBQVAsQ0FBZCxFQUEwQyxDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLE9BQXRCLENBQTFDO0FBQ0EsTUFBTSxPQUFOLENBQWMsT0FBTyxZQUFQLENBQWQsRUFBb0MsY0FBcEM7QUFDQSxNQUFNLE9BQU4sQ0FBYyxPQUFPLG9CQUFQLENBQWQsRUFBNEMsT0FBNUM7Ozs7Ozs7OztjQ2hGYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7O0FBRU47O0lBQ00sTzs7Ozs7OzsrQkFFTztBQUFFLGFBQU8sU0FBUDtBQUFtQjs7O3lCQUUzQixTLEVBQVc7QUFDZCxVQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixZQUFJLEdBQUcsTUFBSCxJQUFjLEtBQUssU0FBTCxLQUFtQixTQUFyQyxFQUFpRDtBQUMvQyxpQkFBTyxHQUFHLEVBQUgsQ0FBTSxPQUFOLEVBQWUsU0FBZixFQUEwQiw4QkFBMUIsQ0FBUDtBQUNEO0FBQ0YsT0FKRCxNQUlPO0FBQ0wsWUFBSSxtQkFBSjtBQUNBLGFBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLFlBQUksRUFBRSxhQUFGLEVBQUosRUFBdUI7QUFDckIsdUJBQWEsYUFBYSxPQUFiLENBQXFCLEtBQUssU0FBMUIsQ0FBYjtBQUNELFNBRkQsTUFFTztBQUNMLGNBQUksVUFBVSxFQUFFLGFBQUYsQ0FBZ0IsU0FBUyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQyxHQUF0QyxDQUFkO0FBQ0EsY0FBSSxRQUFRLEtBQUssU0FBYixDQUFKLEVBQTZCO0FBQUUseUJBQWEsU0FBUyxRQUFRLEtBQUssU0FBYixDQUFULENBQWI7QUFBaUQ7QUFDakY7QUFDRCxlQUFPLEtBQUssVUFBTCxHQUFrQixhQUFhLEtBQUssS0FBTCxDQUFXLFVBQVgsQ0FBYixHQUFzQyxFQUEvRDtBQUNEO0FBQ0Y7Ozs4QkFFUztBQUNSLFVBQUksR0FBRyxNQUFILElBQWEsQ0FBQyxLQUFLLFVBQXZCLEVBQW1DO0FBQ2pDLFdBQUcsRUFBSCxDQUFNLE9BQU4sRUFBZSxTQUFmLEVBQTBCLDJCQUExQjtBQUNEO0FBQ0QsYUFBUSxLQUFLLFVBQUwsSUFBbUIsSUFBM0I7QUFDRDs7OzRCQUVPLEcsRUFBSyxLLEVBQU87QUFDbEIsVUFBSSxLQUFLLE9BQUwsRUFBSixFQUFvQjtBQUNsQixhQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsSUFBdUIsS0FBdkI7QUFDQSxlQUFPLEtBQUssSUFBTCxFQUFQO0FBQ0Q7QUFDRjs7OzBCQUVLLEcsRUFBSztBQUFFLFVBQUksS0FBSyxPQUFMLEVBQUosRUFBb0I7QUFBRSxlQUFPLEtBQUssVUFBTCxDQUFnQixHQUFoQixDQUFQO0FBQThCO0FBQUU7OzsyQkFFNUQ7QUFDTCxVQUFJLEtBQUssT0FBTCxFQUFKLEVBQW9CO0FBQ2xCLFlBQUksRUFBRSxhQUFGLEVBQUosRUFBdUI7QUFDckIsaUJBQU8sYUFBYSxPQUFiLENBQXFCLEtBQUssU0FBMUIsRUFBcUMsS0FBSyxTQUFMLENBQWUsS0FBSyxVQUFwQixDQUFyQyxDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU8sU0FBUyxNQUFULEdBQXFCLEtBQUssU0FBMUIsU0FBdUMsT0FBTyxLQUFLLFNBQUwsQ0FBZSxLQUFLLFVBQXBCLENBQVAsQ0FBOUM7QUFDRDtBQUNGO0FBQ0Y7Ozs7OztBQUdILEdBQUcsT0FBSCxHQUFhLE9BQWI7QUFDQSxHQUFHLE9BQUgsR0FBYSxJQUFJLE9BQUosRUFBYjs7Ozs7Ozs7Ozs7Ozs7O2NDdERhLE07SUFBUCxFLFdBQUEsRTtJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLE0sR0FBVyxFLENBQVgsTTs7QUFFTjs7QUFDQSxJQUFJLFNBQVUsWUFBVztBQUN2QixNQUFJLFNBQVMsU0FBYjtBQUNBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGlDQThGYTtBQUFFLGVBQVUsS0FBSyxXQUFMLENBQWlCLElBQTNCLFNBQW1DLEtBQUssTUFBeEM7QUFBbUQ7QUE5RmxFO0FBQUE7QUFBQSx5Q0FnR3FCLEtBaEdyQixFQWdHNEI7QUFDeEIsZUFBTyxFQUFFLE1BQUYsQ0FBUyxLQUFULEVBQWdCLFVBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUI7QUFDMUMsd0JBQVksS0FBWixjQUErQixLQUEvQjtBQUNBLGlCQUFPLEdBQVA7QUFDRCxTQUhNLEVBSUwsRUFKSyxDQUFQO0FBS0Q7QUF0R0g7QUFBQTtBQUFBLGtDQUNxQjs7QUFFaEI7QUFDRCxpQkFBUyxDQUFUOztBQUVBLGFBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsQ0FBQyxRQUFELEVBQVcsTUFBWCxFQUFtQixPQUFuQixFQUE0QixPQUE1QixFQUN6QixZQUR5QixFQUNYLE9BRFcsRUFDRixTQURFLEVBQ1MsS0FEVCxFQUNnQixNQURoQixFQUN3QixPQUR4QixFQUNpQyxTQURqQyxFQUV6QixNQUZ5QixFQUVqQixNQUZpQixFQUVULElBRlMsRUFFSCxRQUZHLEVBRU8sU0FGUCxFQUVrQixPQUZsQixFQUUyQixRQUYzQixFQUd6QixRQUh5QixFQUdmLFFBSGUsRUFHTCxhQUhLLEVBR1UsUUFIVixFQUdvQixTQUhwQixFQUcrQixPQUgvQixFQUd3QyxNQUh4QyxFQUl6QixXQUp5QixFQUlaLFVBSlksRUFJQSxPQUpBLEVBSVMsTUFKVCxFQUt6QixXQUx5QixFQUtaLFlBTFksRUFLRSxTQUxGLEVBS2EsV0FMYixFQUswQixXQUwxQixDQUEzQjs7QUFPQSxhQUFLLFNBQUwsQ0FBZSxlQUFmLEdBQWtDO0FBQUEsaUJBQU0sT0FBTyxTQUFQLENBQWlCLGtCQUFqQixDQUFvQyxPQUFPLFNBQVAsQ0FBaUIsU0FBckQsQ0FBTjtBQUFBLFNBQUQsRUFBakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLLFNBQUwsQ0FBZSxVQUFmLEdBQTRCLENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsUUFBbkIsRUFBNkIsU0FBN0IsQ0FBNUI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxnQkFBZixHQUFtQztBQUFBLGlCQUFNLE9BQU8sU0FBUCxDQUFpQixrQkFBakIsQ0FBb0MsT0FBTyxTQUFQLENBQWlCLFVBQXJELENBQU47QUFBQSxTQUFELEVBQWxDOztBQUVBLGFBQUssU0FBTCxDQUFlLGFBQWYsR0FBK0IsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixLQUFsQixFQUF5QixXQUF6QixFQUM3QixjQUQ2QixFQUNiLFNBRGEsQ0FBL0I7O0FBR0EsYUFBSyxTQUFMLENBQWUsbUJBQWYsR0FBcUMsRUFBRSxPQUFGLENBQVUsVUFBUyxPQUFULEVBQWtCO0FBQUEscUNBQzVDLEVBQUUsa0JBQUYsQ0FBcUIsT0FBckIsQ0FENEM7QUFBQSxjQUMxRCxJQUQwRCx3QkFDMUQsSUFEMEQ7QUFBQSxjQUNwRCxJQURvRCx3QkFDcEQsSUFEb0Q7O0FBRS9ELGlCQUFPLEtBQUssWUFBTCxDQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFQO0FBQ0EsY0FBSSxTQUFTLEtBQUssU0FBTCxDQUFlLGFBQWYsRUFBOEIsSUFBOUIsQ0FBYjtBQUNBLGNBQUksV0FBVyxFQUFFLFFBQUYsQ0FBVyxNQUFYLENBQWY7QUFDQSxxQkFBVyxFQUFFLG9CQUFGLENBQXVCLFFBQXZCLEVBQWlDLElBQWpDLENBQVg7QUFDQSxpQkFBTyxFQUFDLGtCQUFELEVBQVcsVUFBWCxFQUFQO0FBQ0QsU0FQb0MsQ0FBckM7O0FBU0EsYUFBSyxTQUFMLENBQWUsdUJBQWYsR0FBeUMsRUFBRSxPQUFGLENBQVUsVUFBUyxPQUFULEVBQWtCO0FBQ25FLGNBQUksT0FBTyxFQUFYOztBQURtRSxzQ0FFaEQsRUFBRSxrQkFBRixDQUFxQixPQUFyQixDQUZnRDtBQUFBLGNBRTlELElBRjhELHlCQUU5RCxJQUY4RDtBQUFBLGNBRXhELElBRndELHlCQUV4RCxJQUZ3RDs7QUFHbkUsaUJBQU8sS0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLElBQXhCLENBQVA7QUFDQSxjQUFJLFNBQVMsS0FBSyxhQUFMLENBQW1CLEVBQW5CLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBQWI7QUFDQSxjQUFJLFdBQVcsRUFBRSxRQUFGLENBQVcsTUFBWCxDQUFmO0FBQ0EscUJBQVcsRUFBRSxvQkFBRixDQUF1QixRQUF2QixFQUFpQyxJQUFqQyxDQUFYO0FBQ0EsaUJBQU8sRUFBQyxrQkFBRCxFQUFXLFVBQVgsRUFBaUIsVUFBakIsRUFBUDtBQUNELFNBUndDLENBQXpDOztBQVVGO0FBQ0UsYUFBSyxTQUFMLENBQWUsaUJBQWYsR0FBbUMsRUFBRSxPQUFGLENBQVUsVUFBUyxJQUFULEVBQWU7QUFDMUQsY0FBSSxPQUFPLEVBQVg7QUFDQSxpQkFBTztBQUNMLGtCQUFNLEVBQUUsZ0JBQUYsQ0FBbUIsRUFBRSxlQUFGLENBQWtCLElBQWxCLENBQW5CLEVBQTRDLElBQTVDLENBREQ7QUFFTDtBQUZLLFdBQVA7QUFJRCxTQU5rQyxDQUFuQzs7QUFRQSxhQUFLLFNBQUwsQ0FBZSxhQUFmLEdBQStCLEVBQUUsT0FBRixDQUFVLFVBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0I7QUFDM0QsY0FBSSxXQUFKO0FBQ0EsY0FBSTtBQUNGLGlCQUFLLElBQUksUUFBSixDQUFhLEdBQWIsRUFBa0IsSUFBbEIsQ0FBTDtBQUNELFdBRkQsQ0FFRSxPQUFPLEtBQVAsRUFBYztBQUNkLGlCQUFLLGNBQVcsQ0FBRSxDQUFsQjtBQUNBLGdCQUFJLEdBQUcsTUFBUCxFQUFlO0FBQUUsaUJBQUcsRUFBSCxDQUFNLE9BQU4sbUJBQThCLElBQTlCLEVBQXNDLE1BQU0sT0FBNUM7QUFBdUQ7QUFDekU7QUFDRCxpQkFBTyxFQUFQO0FBQ0QsU0FUOEIsQ0FBL0I7O0FBV0EsYUFBSyxTQUFMLENBQWUsa0JBQWYsR0FBb0MsRUFBcEM7O0FBRUEsYUFBSyxTQUFMLENBQWUsV0FBZixHQUE4QixZQUFXO0FBQ3ZDLGNBQUksUUFBUSxFQUFaO0FBQ0EsaUJBQU8sVUFBUyxTQUFULEVBQW9CO0FBQ3pCLGdCQUFJLFFBQVEsTUFBTSxTQUFOLENBQVo7QUFDQSxnQkFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsc0JBQVEsRUFBRSxXQUFGLENBQWMsU0FBZCxDQUFSO0FBQ0Esb0JBQU0sU0FBTixJQUFtQixLQUFuQjtBQUNEO0FBQ0QsbUJBQU8sS0FBUDtBQUNELFdBUEQ7QUFRRCxTQVY0QixFQUE3Qjs7QUFZQTs7Ozs7O0FBTUEsYUFBSyxTQUFMLENBQWUsV0FBZixHQUE2QixFQUE3Qjs7QUFHQTs7OztBQUlBLGFBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsRUFBM0I7QUFDRDtBQTVGSDs7QUF3R0Usb0JBQVksSUFBWixFQUFrQjtBQUFBOztBQUFBOztBQUVoQixZQUFLLFFBQUwsR0FBZ0IsTUFBSyxRQUFMLENBQWMsSUFBZCxPQUFoQjtBQUNBLGdCQUFVLENBQVY7QUFDQSxZQUFLLE1BQUwsR0FBYyxNQUFkO0FBSmdCO0FBQUE7QUFBQTs7QUFBQTtBQUtoQiw2QkFBZ0IsTUFBTSxJQUFOLENBQVcsTUFBSyxhQUFoQixDQUFoQiw4SEFBZ0Q7QUFBQSxjQUF2QyxHQUF1QztBQUFFLGNBQUksS0FBSyxHQUFMLENBQUosRUFBZTtBQUFFLGtCQUFLLEdBQUwsSUFBWSxLQUFLLEdBQUwsQ0FBWjtBQUF3QjtBQUFFO0FBTDdFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTWhCLFVBQUksTUFBSyxZQUFMLElBQXFCLE1BQUssT0FBOUIsRUFBdUM7QUFBRSxjQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFBMEI7QUFDbkUsWUFBSyxTQUFMLENBQWUsSUFBZjtBQUNBLFVBQUksQ0FBQyxNQUFLLElBQVYsRUFBZ0I7QUFBRSxXQUFHLEVBQUgsQ0FBTSxPQUFOLEVBQWUsYUFBZjtBQUFnRTtBQVJsRTtBQVNqQjs7QUFqSEg7QUFBQTtBQUFBLGlDQW1IYTtBQUNULGFBQUssWUFBTDtBQUNBLFlBQUksS0FBSyxjQUFULEVBQXlCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUUsa0NBQWtCLE1BQU0sSUFBTixDQUFXLEtBQUssY0FBaEIsQ0FBbEIsbUlBQW1EO0FBQUEsa0JBQTFDLEtBQTBDO0FBQUU7QUFBVTtBQUFqRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW1FO0FBQzVGLGFBQUssY0FBTCxHQUFzQixFQUF0QjtBQUNBLGVBQU8sS0FBSyxLQUFaO0FBQ0EsZUFBTyxPQUFPLEtBQUssV0FBbkI7QUFDRDtBQXpISDtBQUFBO0FBQUEsZ0NBMkhZLElBM0haLEVBMkhrQjtBQUNkLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxZQUFJLEtBQUssR0FBVCxFQUFjO0FBQUUsZUFBSyxHQUFMLEdBQVcsS0FBSyxHQUFoQjtBQUFzQjtBQUN0QyxlQUFRLEtBQUssYUFBTixFQUFQO0FBQ0Q7QUEvSEg7QUFBQTtBQUFBLHNDQWlJa0I7QUFDZCxZQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsU0FBckI7QUFDQSxZQUFJLFFBQVEsSUFBUixHQUFlLEtBQUssS0FBcEIsR0FBNEIsU0FBaEMsRUFBMkM7QUFBRTtBQUMzQyxpQkFBTyxLQUFLLFNBQUwsR0FBaUIsRUFBRSxlQUFGLENBQWtCLEtBQUssS0FBTCxFQUFsQixDQUF4QjtBQUNEO0FBQ0Y7QUF0SUg7QUFBQTtBQUFBLDBCQXdJTSxHQXhJTixFQXdJVztBQUNQLFlBQUksS0FBSyxLQUFMLElBQWMsSUFBbEIsRUFBd0I7QUFBRSxlQUFLLEtBQUwsR0FBYSxJQUFJLEdBQUcsS0FBUCxFQUFiO0FBQThCO0FBQ3hELGVBQU8sS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLEdBQWYsQ0FBUDtBQUNEO0FBM0lIO0FBQUE7QUFBQSw4QkE2SVUsR0E3SVYsRUE2SWUsS0E3SWYsRUE2SXNCLElBN0l0QixFQTZJNEI7QUFDeEIsWUFBSSxLQUFLLEtBQUwsSUFBYyxJQUFsQixFQUF3QjtBQUFFLGVBQUssS0FBTCxHQUFhLElBQUksR0FBRyxLQUFQLEVBQWI7QUFBOEI7QUFDeEQsZUFBTyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQW5CLEVBQXdCLEtBQXhCLEVBQStCLElBQS9CLENBQVA7QUFDRDtBQWhKSDtBQUFBO0FBQUEsZ0NBa0pZLEdBbEpaLEVBa0ppQixFQWxKakIsRUFrSnFCLElBbEpyQixFQWtKMkI7QUFDdkIsWUFBSSxPQUFPLElBQVgsRUFBaUI7QUFBRTtBQUFTO0FBQzVCLFlBQUksS0FBSyxLQUFMLElBQWMsSUFBbEIsRUFBd0I7QUFBRSxlQUFLLEtBQUwsR0FBYSxJQUFJLEdBQUcsS0FBUCxFQUFiO0FBQThCO0FBQ3hELFlBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEdBQXJCLEVBQTBCLEVBQTFCLEVBQThCLElBQTlCLENBQVo7QUFDQSxZQUFJLEtBQUssS0FBTCxDQUFXLFFBQVgsTUFBeUIsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixHQUFwQixDQUE3QixFQUF1RDtBQUFFLGtCQUFRLEtBQUssY0FBTCxDQUFvQixLQUFwQixDQUFSO0FBQXFDO0FBQzlGLGVBQU8sS0FBUDtBQUNEO0FBeEpIO0FBQUE7QUFBQSxvQ0EwSmdCLEdBMUpoQixFQTBKcUIsRUExSnJCLEVBMEp5QixJQTFKekIsRUEwSitCO0FBQzNCLFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQUUsaUJBQU8sRUFBUDtBQUFZO0FBQ2hDLGFBQUssVUFBTCxJQUFtQixJQUFuQjtBQUNBLGVBQU8sS0FBSyxTQUFMLENBQWUsR0FBZixFQUFvQixFQUFwQixFQUF3QixJQUF4QixDQUFQO0FBQ0Q7QUE5Skg7QUFBQTtBQUFBLHFDQWdLaUIsS0FoS2pCLEVBZ0t3QjtBQUFBOztBQUNwQixZQUFJLEtBQUssY0FBTCxJQUF1QixJQUEzQixFQUFpQztBQUFFLGVBQUssY0FBTCxHQUFzQixFQUF0QjtBQUEyQjtBQUM5RCxZQUFJLFdBQVcsU0FBWCxRQUFXLEdBQU07QUFDbkIsY0FBSSxRQUFRLE9BQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixRQUE1QixDQUFaO0FBQ0EsY0FBSyxTQUFTLElBQVYsSUFBb0IsVUFBVSxDQUFDLENBQW5DLEVBQXVDO0FBQ3JDLG1CQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsS0FBM0IsRUFBa0MsQ0FBbEM7QUFDRDtBQUNELGlCQUFPLE9BQVA7QUFDRCxTQU5EO0FBT0EsYUFBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLFFBQXpCO0FBQ0EsZUFBTyxRQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0FBN0tGO0FBQUE7QUFBQSx5Q0FpTHFCLElBakxyQixFQWlMMkIsTUFqTDNCLEVBaUxtQztBQUMvQixZQUFJLFFBQVEsRUFBRSxRQUFGLENBQVcsTUFBWCxJQUFxQixDQUFDLE1BQUQsQ0FBckIsR0FBaUMsTUFBN0M7QUFDQSxZQUFJLGFBQWEsRUFBRSxHQUFGLENBQU0sS0FBTixFQUFhO0FBQUEsdUJBQVksT0FBTyxZQUFQLENBQVosU0FBb0MsSUFBcEM7QUFBQSxTQUFiLEVBQWtFLElBQWxFLENBQXVFLE1BQXZFLENBQWpCO0FBQ0EsWUFBSSxVQUFKLEVBQWdCO0FBQ2QsaUJBQVUsVUFBVixZQUEyQixJQUEzQjtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLElBQVA7QUFDRDtBQUNGO0FBekxIO0FBQUE7QUFBQSxzQ0EyTGtCLElBM0xsQixFQTJMd0IsR0EzTHhCLEVBMkw2QjtBQUN6QixxQkFBVyxPQUFPLFNBQVAsQ0FBWCxjQUFvQyxHQUFwQyxjQUErQyxJQUEvQztBQUNEO0FBN0xIO0FBQUE7QUFBQSwwQ0ErTHNCLElBL0x0QixFQStMNEIsSUEvTDVCLEVBK0xrQztBQUM5QixZQUFJLEtBQUssTUFBVCxFQUFpQjtBQUFFLGlCQUFPLEtBQUssa0JBQUwsQ0FBd0IsSUFBeEIsRUFBOEIsS0FBSyxNQUFuQyxDQUFQO0FBQW9EO0FBQ3ZFLFlBQUksS0FBSyxHQUFMLElBQVksSUFBaEIsRUFBc0I7QUFBRSxpQkFBTyxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsRUFBMkIsS0FBSyxHQUFoQyxDQUFQO0FBQThDO0FBQ3RFLGVBQU8sSUFBUDtBQUNEO0FBbk1IO0FBQUE7QUFBQSxtQ0FxTWUsSUFyTWYsRUFxTXFCLElBck1yQixFQXFNMkI7QUFDdkIsWUFBSSxRQUFRLEVBQUUsZUFBRixDQUFrQixJQUFsQixDQUFaLEVBQXFDO0FBQUUsdUJBQVcsSUFBWDtBQUFvQjtBQUMzRCxZQUFJLElBQUosRUFBVTtBQUFFLGlCQUFPLEtBQUssbUJBQUwsQ0FBeUIsSUFBekIsRUFBK0IsSUFBL0IsQ0FBUDtBQUE4QztBQUMxRCxlQUFPLElBQVA7QUFDRDtBQXpNSDtBQUFBO0FBQUEsb0NBMk1nQixPQTNNaEIsRUEyTXlCLEVBM016QixFQTJNNkIsSUEzTTdCLEVBMk1tQyxJQTNNbkMsRUEyTXlDO0FBQUE7O0FBQ3JDLFlBQUksV0FBVyxJQUFmLEVBQXFCO0FBQUU7QUFBUzs7QUFESyxvQ0FFTCxLQUFLLHVCQUFMLENBQTZCLE9BQTdCLENBRks7QUFBQSxZQUVoQyxRQUZnQyx5QkFFaEMsUUFGZ0M7QUFBQSxZQUV0QixJQUZzQix5QkFFdEIsSUFGc0I7QUFBQSxZQUVoQixPQUZnQix5QkFFaEIsT0FGZ0I7O0FBR3JDLFlBQUksU0FBUyxTQUFULE1BQVMsR0FBTTtBQUNqQixpQkFBTyxHQUFHLElBQUgsQ0FBUSxNQUFSLEVBQWMsU0FBUyxJQUFULENBQWMsTUFBZCxDQUFkLEVBQW1DLE9BQW5DLENBQVA7QUFDRCxTQUZEOztBQUhxQztBQUFBO0FBQUE7O0FBQUE7QUFPckMsZ0NBQWdCLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBaEIsbUlBQWtDO0FBQUEsZ0JBQXpCLEdBQXlCOztBQUNoQyxnQkFBSSxRQUFRLEtBQUssYUFBTCxDQUFtQixHQUFuQixFQUF3QixNQUF4QixFQUFnQyxJQUFoQyxDQUFaO0FBQ0EsZ0JBQUksSUFBSixFQUFVO0FBQUUsbUJBQUssSUFBTCxDQUFVLEtBQVY7QUFBbUI7QUFDaEM7QUFWb0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFXckMsZUFBTyxRQUFQO0FBQ0Q7QUF2Tkg7QUFBQTtBQUFBLHFDQXlOaUI7QUFDYixZQUFJLEtBQUssUUFBVCxFQUFtQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFFLGtDQUFrQixNQUFNLElBQU4sQ0FBVyxLQUFLLFFBQWhCLENBQWxCLG1JQUE2QztBQUFBLGtCQUFwQyxLQUFvQztBQUFFLG9CQUFNLFFBQU47QUFBbUI7QUFBcEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFzRTtBQUN6RixZQUFJLEtBQUssUUFBVCxFQUFtQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFFLGtDQUFrQixNQUFNLElBQU4sQ0FBVyxLQUFLLFFBQWhCLENBQWxCLG1JQUE2QztBQUFBLGtCQUFwQyxLQUFvQztBQUFFO0FBQVU7QUFBM0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE2RDtBQUNoRixhQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxlQUFPLEtBQUssUUFBTCxHQUFnQixFQUF2QjtBQUNEO0FBOU5IO0FBQUE7QUFBQSwrQkFnT1csS0FoT1gsRUFnT2tCO0FBQ2QsWUFBSSxLQUFLLFFBQUwsSUFBaUIsSUFBckIsRUFBMkI7QUFBRSxlQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFBcUI7QUFDbEQsZUFBTyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEtBQW5CLENBQVA7QUFDRDtBQW5PSDtBQUFBO0FBQUEsZ0NBcU9ZLFNBck9aLEVBcU91QixPQXJPdkIsRUFxT2dDLE9Bck9oQyxFQXFPeUMsS0FyT3pDLEVBcU9nRCxJQXJPaEQsRUFxT3NEO0FBQUE7O0FBQ2xELFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQUUsaUJBQU8sRUFBUDtBQUFZO0FBQ2hDLFlBQUksVUFBVyxLQUFLLE9BQUwsSUFBZ0IsSUFBakIsR0FBeUIsS0FBSyxPQUE5QixHQUF3QyxLQUF0RDtBQUNBLGVBQU8sS0FBSyxjQUFMLENBQW9CLFVBQVUsU0FBVixDQUFvQixPQUFwQixFQUE2QixpQkFBUztBQUMvRCxpQkFBTyxPQUFLLEtBQUwsQ0FBWTtBQUFBLG1CQUFNLFFBQVEsT0FBUixDQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixFQUFDLE1BQU0sSUFBUCxFQUE5QixDQUFOO0FBQUEsV0FBWixFQUFnRSxPQUFLLFFBQUwsRUFBaEUsQ0FBUDtBQUNELFNBRjBCLEVBR3pCLEVBQUMsZ0JBQUQsRUFIeUIsQ0FBcEIsQ0FBUDtBQUtEO0FBN09IO0FBQUE7QUFBQSwyQkErT08sTUEvT1AsRUErT2U7QUFDWCxZQUFJLGlCQUFKO0FBQ0EsWUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFBRTtBQUFTO0FBQzlCLGFBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNBLGFBQUssVUFBTCxDQUFnQixNQUFoQjtBQUNDLGFBQUssU0FBTjs7QUFFQSxZQUFJLFdBQVcsRUFBRSxPQUFGLENBQVUsS0FBSyxJQUFmLEVBQXFCLE1BQXJCLENBQWYsRUFBNkM7QUFDM0MsZUFBSyxTQUFMLENBQWUsS0FBSyxJQUFwQixFQUEwQixRQUExQjtBQUNBLFlBQUUsT0FBRixDQUFVLEtBQUssSUFBZixFQUFxQixNQUFyQixFQUE2QixJQUE3QjtBQUNEOztBQUVELGFBQUssTUFBTDtBQUNBLGVBQU8sS0FBSyxhQUFMLENBQW1CLEtBQUssSUFBTCxDQUFVLFNBQTdCLEVBQXdDLEtBQUssUUFBN0MsRUFBdUQsRUFBQyxTQUFTLEtBQVYsRUFBdkQsQ0FBUDtBQUNEO0FBN1BIO0FBQUE7QUFBQSxpQ0ErUGEsTUEvUGIsRUErUHFCO0FBQ2pCLFlBQUksTUFBSixFQUFZO0FBQUUsaUJBQU8sUUFBUCxDQUFnQixJQUFoQjtBQUF3QjtBQUN0QyxZQUFJLGNBQWMsQ0FBQyxVQUFVLElBQVYsR0FBaUIsT0FBTyxLQUF4QixHQUFnQyxTQUFqQyxLQUErQyxHQUFHLEtBQXBFO0FBQ0EsWUFBSSxRQUFRLFVBQVUsRUFBRSxPQUFGLENBQVUsS0FBSyxJQUFmLEVBQXFCLE9BQXJCLENBQVYsRUFBeUM7QUFBQSxpQkFBSyxFQUFFLElBQUYsRUFBTDtBQUFBLFNBQXpDLENBQVo7QUFDQSxZQUFJLFNBQVMsVUFBVSxFQUFFLE9BQUYsQ0FBVSxLQUFLLElBQWYsRUFBcUIsUUFBckIsQ0FBVixFQUEwQztBQUFBLGlCQUFNLEdBQUcsSUFBSCxFQUFOO0FBQUEsU0FBMUMsQ0FBYjs7QUFFQSxZQUFLLFVBQVUsR0FBWCxJQUFvQixXQUFXLEdBQW5DLEVBQXlDO0FBQ3ZDLGlCQUFPLEtBQUssS0FBTCxHQUFhLFdBQXBCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBSSxhQUFKO0FBQUEsY0FBVSxhQUFWO0FBQ0EsY0FBSSxTQUFTLE1BQVQsSUFBbUIsS0FBSyxHQUE1QixFQUFpQztBQUFFLGdCQUFJLEtBQUssS0FBTCxJQUFjLElBQWxCLEVBQXdCO0FBQUUsbUJBQUssS0FBTCxHQUFhLElBQUksR0FBRyxLQUFQLEVBQWI7QUFBOEI7QUFBRTtBQUM3RixjQUFJLEtBQUosRUFBVztBQUFBLHFDQUNPLEVBQUUsZ0JBQUYsQ0FBbUIsS0FBbkIsQ0FEUDs7QUFDUCxnQkFETyxzQkFDUCxJQURPO0FBQ0QsZ0JBREMsc0JBQ0QsSUFEQzs7QUFFVCxjQUFFLElBQUYsQ0FBTyxJQUFQLEVBQWEsVUFBUyxTQUFULEVBQW9CLEdBQXBCLEVBQXlCO0FBQ3BDLGtCQUFJLGFBQWEsSUFBakIsRUFBdUI7QUFBRSw0QkFBWSxHQUFaO0FBQWtCO0FBQzNDLHFCQUFPLEtBQUssU0FBTCxDQUFlLFdBQWYsRUFBNEIsU0FBNUIsRUFBdUMsS0FBSyxLQUE1QyxFQUFtRCxHQUFuRCxFQUF3RCxJQUF4RCxDQUFQO0FBQ0QsYUFIRCxFQUlFLElBSkY7QUFLRDtBQUNELGNBQUksTUFBSixFQUFZO0FBQUEsc0NBQ00sRUFBRSxnQkFBRixDQUFtQixNQUFuQixDQUROOztBQUNSLGdCQURRLHVCQUNSLElBRFE7QUFDRixnQkFERSx1QkFDRixJQURFOztBQUVWLG1CQUFPLEVBQUUsSUFBRixDQUFPLElBQVAsRUFBYSxVQUFTLFNBQVQsRUFBb0IsR0FBcEIsRUFBeUI7QUFDM0Msa0JBQUksYUFBYSxJQUFqQixFQUF1QjtBQUFFLDRCQUFZLEdBQVo7QUFBa0I7QUFDM0MscUJBQU8sS0FBSyxTQUFMLENBQWUsS0FBSyxLQUFwQixFQUEyQixHQUEzQixFQUFnQyxXQUFoQyxFQUE2QyxTQUE3QyxFQUF3RCxJQUF4RCxDQUFQO0FBQ0QsYUFITSxFQUlMLElBSkssQ0FBUDtBQUtEO0FBQ0Y7QUFDRjtBQTNSSDtBQUFBO0FBQUEsa0NBNlJjO0FBQ1YsWUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDbEIsWUFBRSxJQUFGLENBQU8sS0FBSyxTQUFaLEVBQXVCLFVBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQjtBQUMxQyxtQkFBTyxLQUFLLE9BQUwsQ0FBYSxHQUFiLEVBQWtCLEtBQWxCLENBQVA7QUFDRCxXQUZELEVBR0UsSUFIRjtBQUlBLGlCQUFPLE9BQU8sS0FBSyxTQUFuQjtBQUNEO0FBQ0Y7QUFyU0g7QUFBQTtBQUFBLCtCQXVTVztBQUNQLFlBQUksR0FBRyxNQUFQLEVBQWU7QUFDYixjQUFJLGdCQUFnQixFQUFFLE9BQUYsQ0FBVSxLQUFLLElBQWYsRUFBcUIsUUFBckIsQ0FBcEI7QUFDQSxjQUFJLGFBQUosRUFBbUI7QUFBRSw0QkFBbUIsYUFBbkIsU0FBb0MsSUFBcEM7QUFBNkM7QUFDbEUsWUFBRSxPQUFGLENBQVUsS0FBSyxJQUFmLEVBQXFCLFFBQXJCLEVBQStCLGlCQUFpQixJQUFoRDtBQUNELFNBSkQsTUFJTztBQUNMLFlBQUUsT0FBRixDQUFVLEtBQUssSUFBZixFQUFxQixRQUFyQixFQUErQixJQUEvQjtBQUNEOztBQUVELFlBQUksS0FBSyxZQUFULEVBQXVCO0FBQUcsZUFBSyxxQkFBTjtBQUFpQztBQUMxRCxZQUFJLEtBQUssT0FBVCxFQUFrQjtBQUFHLGVBQUssb0JBQU47QUFBZ0M7QUFDcEQsWUFBSSxLQUFLLE9BQUwsSUFBZ0IsSUFBcEIsRUFBMEI7QUFBRSxlQUFLLE9BQUwsR0FBZSxLQUFLLElBQXBCO0FBQTJCO0FBQ3ZELGVBQVEsS0FBSyxZQUFOLEVBQVA7QUFDRDtBQXBUSDtBQUFBO0FBQUEsOENBc1QwQjtBQUN0QixZQUFJLGVBQWUsSUFBbkI7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsS0FBSyxZQUF4QixFQUFzQyxVQUFTLFFBQVQsRUFBbUI7QUFDdkQsZUFBSyxPQUFMLEdBQWUsRUFBRSxhQUFGLENBQWdCLEtBQWhCLEVBQXVCLFFBQXZCLEVBQWlDLFVBQWhEO0FBQ0EsY0FBSSxDQUFDLFlBQUwsRUFBbUI7QUFBRSxtQkFBTyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQVA7QUFBNkI7QUFDbkQsU0FIRDtBQUlBLHVCQUFlLEtBQWY7QUFDQSxlQUFPLEtBQUssWUFBTCxHQUFvQixTQUEzQjtBQUNEO0FBOVRIO0FBQUE7QUFBQSw2Q0FnVXlCO0FBQUE7O0FBQ3JCLFVBQUUsT0FBRixDQUFVLEtBQUssT0FBZixFQUF3QjtBQUFBLGlCQUFZLE9BQUssV0FBTCxDQUFpQixRQUFqQixDQUFaO0FBQUEsU0FBeEI7QUFDQSxlQUFPLEtBQUssT0FBTCxHQUFlLFNBQXRCO0FBQ0Q7QUFuVUg7QUFBQTtBQUFBLGtDQXFVYyxRQXJVZCxFQXFVd0I7QUFDcEIsYUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBSyxPQUFMLEdBQWUsRUFBRSxhQUFGLENBQWdCLEtBQWhCLEVBQXVCLFFBQXZCLEVBQWlDLFVBQWhEO0FBQ0EsZUFBTyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQVA7QUFDRDtBQXpVSDtBQUFBO0FBQUEsK0JBMlVXLE1BM1VYLEVBMlVtQjtBQUFFLFlBQUssVUFBVSxJQUFYLElBQW9CLEtBQUssT0FBN0IsRUFBc0M7QUFBRSxpQkFBTyxLQUFLLE1BQUwsRUFBUDtBQUF1QjtBQUFFO0FBM1V0RjtBQUFBO0FBQUEsa0NBNlVjO0FBQ1YsWUFBSSxnQkFBSjtBQUNBLFlBQUksS0FBSyxXQUFULEVBQXNCO0FBQ3BCLG9CQUFVLEtBQUssSUFBZjtBQUNBLGVBQUssSUFBTCxHQUFZLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsSUFBdkIsQ0FBWjtBQUNEO0FBQ0QsZUFBTyxPQUFQO0FBQ0Q7QUFwVkg7QUFBQTtBQUFBLGlDQXNWYSxPQXRWYixFQXNWc0I7QUFDbEIsWUFBSSxXQUFXLFFBQVEsVUFBdkIsRUFBbUM7QUFDakMsaUJBQU8sUUFBUSxVQUFSLENBQW1CLFlBQW5CLENBQWdDLEtBQUssSUFBckMsRUFBMkMsT0FBM0MsQ0FBUDtBQUNEO0FBQ0Y7QUExVkg7QUFBQTtBQUFBLHlDQTRWcUIsQ0FBRTtBQTVWdkI7QUFBQTtBQUFBLCtCQThWVztBQUNQLFlBQUksR0FBRyxLQUFQLEVBQWM7QUFBRSxhQUFHLEtBQUgsQ0FBUyxPQUFULFdBQXlCLElBQXpCLG9CQUE4QyxFQUFFLElBQUYsRUFBOUM7QUFBMEQ7QUFDMUUsYUFBSyxNQUFMO0FBQ0EsWUFBSSxVQUFVLEtBQUssU0FBTCxFQUFkO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLElBQUksR0FBRyxVQUFQLENBQWtCLENBQUMsS0FBSyxJQUFOLENBQWxCLENBQWxCO0FBQ0MsYUFBSyxnQkFBTjtBQUNBLGFBQUssZ0JBQUwsQ0FBc0IsS0FBSyxJQUEzQjtBQUNBLFVBQUUsZ0JBQUYsQ0FBbUIsS0FBSyxJQUF4QixFQUE4QixJQUE5QjtBQUNBLGFBQUssVUFBTCxDQUFnQixPQUFoQjtBQUNBLFlBQUksR0FBRyxLQUFQLEVBQWM7QUFBRSxpQkFBTyxHQUFHLEtBQUgsQ0FBUyxPQUFULFdBQXlCLElBQXpCLGtCQUE0QyxFQUFFLElBQUYsRUFBNUMsQ0FBUDtBQUErRDtBQUNoRjtBQXhXSDtBQUFBO0FBQUEsa0NBMFdjO0FBQUUsZUFBTyxLQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsRUFBUDtBQUFxQztBQTFXckQ7QUFBQTtBQUFBLDZCQTRXUztBQUFFLGVBQU8sS0FBSyxVQUFMLENBQWdCLElBQWhCLEVBQVA7QUFBZ0M7QUE1VzNDO0FBQUE7QUFBQSw2QkE4V1M7QUFBRSxlQUFPLEtBQUssVUFBTCxDQUFnQixJQUFoQixFQUFQO0FBQWdDO0FBOVczQztBQUFBO0FBQUEsK0JBZ1hXO0FBQUUsWUFBSSxLQUFLLFNBQUwsRUFBSixFQUFzQjtBQUFFLGlCQUFPLEtBQUssSUFBTCxFQUFQO0FBQXFCLFNBQTdDLE1BQW1EO0FBQUUsaUJBQU8sS0FBSyxJQUFMLEVBQVA7QUFBcUI7QUFBRTtBQWhYekY7QUFBQTtBQUFBLG1DQWtYZSxJQWxYZixFQWtYcUI7QUFBRSxlQUFPLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsVUFBaEIsQ0FBUDtBQUFxQztBQWxYNUQ7QUFBQTtBQUFBLG1DQW9YZSxJQXBYZixFQW9YcUI7QUFDakIsWUFBSSxxQkFBSjtBQUNBLFlBQUksUUFBUSxJQUFaO0FBQ0EsZUFBTyxJQUFQLEVBQWE7QUFDWCxjQUFJLFNBQVMsTUFBTSxVQUFuQjtBQUNBLGNBQUksQ0FBQyxNQUFMLEVBQWE7QUFBRTtBQUFRO0FBQ3ZCLGNBQUksS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQUosRUFBOEI7QUFDNUIsMkJBQWUsTUFBZjtBQUNBO0FBQ0Q7QUFDRCxjQUFJLEtBQUssSUFBTCxLQUFjLE1BQWxCLEVBQTBCO0FBQUU7QUFBUTtBQUNwQyxrQkFBUSxNQUFSO0FBQ0Q7QUFDRCxlQUFRLGdCQUFnQixJQUF4QjtBQUNEO0FBbFlIO0FBQUE7QUFBQSxnQ0FvWVksUUFwWVosRUFvWXNCLEVBcFl0QixFQW9ZMEI7QUFDdEIsZUFBTyxFQUFFLFNBQUYsQ0FBWSxLQUFLLElBQWpCLEVBQXVCLFFBQXZCLEVBQWlDLFVBQVMsSUFBVCxFQUFlO0FBQ3JELGNBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBTCxFQUE4QjtBQUFFLG1CQUFPLEdBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxJQUFkLENBQVA7QUFBNkI7QUFDOUQsU0FGTSxFQUdMLElBSEssQ0FBUDtBQUlEO0FBellIO0FBQUE7QUFBQSxtQ0EyWWUsUUEzWWYsRUEyWXlCLEVBM1l6QixFQTJZNkI7QUFDekIsZUFBTyxFQUFFLFlBQUYsQ0FBZSxLQUFLLElBQXBCLEVBQTBCLFFBQTFCLEVBQW9DLFVBQVMsSUFBVCxFQUFlLEtBQWYsRUFBc0I7QUFDL0QsY0FBSSxDQUFDLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUFMLEVBQThCO0FBQUUsbUJBQU8sR0FBRyxJQUFILENBQVEsSUFBUixFQUFjLElBQWQsRUFBb0IsS0FBcEIsQ0FBUDtBQUFvQztBQUNyRSxTQUZNLEVBR0wsSUFISyxDQUFQO0FBSUQ7QUFoWkg7QUFBQTtBQUFBLG1DQWtaZSxJQWxaZixFQWtacUIsR0FsWnJCLEVBa1owQixJQWxaMUIsRUFrWmdDO0FBQzVCLGVBQU8sRUFBRSxZQUFGLENBQWUsSUFBZixFQUFxQixHQUFyQixFQUEwQixJQUExQixFQUFnQyxVQUFTLEtBQVQsRUFBZ0I7QUFDckQsaUJBQU8sQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBUjtBQUNELFNBRk0sRUFHTCxJQUhLLENBQVA7QUFJRDtBQXZaSDtBQUFBO0FBQUEsdUNBeVptQixLQXpabkIsRUF5WjBCO0FBQ3RCLGVBQU8sS0FBSyxZQUFMLENBQWtCLEtBQWxCLEVBQXlCLFVBQVMsSUFBVCxFQUFlO0FBQzdDLGNBQUksa0JBQUo7QUFDQSxjQUFJLEVBQUUsUUFBRixDQUFXLFlBQVksRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixRQUFoQixDQUF2QixDQUFKLEVBQXVEO0FBQ3JELGlCQUFLLFdBQUwsQ0FBaUIsSUFBakIsRUFBdUIsU0FBdkI7QUFDQSxtQkFBTyxLQUFQO0FBQ0QsV0FIRCxNQUdPO0FBQ0wsY0FBRSxjQUFGLENBQWlCLElBQWpCLEVBQXVCLFVBQVMsSUFBVCxFQUFlLEtBQWYsRUFBc0I7QUFDM0Msa0JBQUksU0FBUyxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBYjtBQUNBLGtCQUFJLFVBQVUsS0FBZCxFQUFxQjtBQUFFLHVCQUFPLEtBQUssTUFBTCxFQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEIsS0FBOUIsQ0FBUDtBQUE4QztBQUN0RSxhQUhELEVBSUUsSUFKRjtBQUtBLG1CQUFPLElBQVA7QUFDRDtBQUNGLFNBYk0sQ0FBUDtBQWNEO0FBeGFIO0FBQUE7QUFBQSx3Q0EwYW9CLE9BMWFwQixFQTBhNkI7QUFDekIsWUFBSSxTQUFTLEVBQUUsc0JBQUYsQ0FBeUIsT0FBekIsQ0FBYjtBQUNBLFlBQUksT0FBTyxPQUFPLENBQVAsS0FBYSxFQUFFLGVBQUYsQ0FBa0IsT0FBTyxDQUFQLENBQWxCLENBQXhCO0FBQ0EsWUFBSSxPQUFPLEVBQUUsZUFBRixDQUFrQixPQUFPLENBQVAsQ0FBbEIsQ0FBWDtBQUNBLFlBQUksUUFBUSxJQUFSLEdBQWUsS0FBSyxNQUFwQixHQUE2QixTQUFqQyxFQUE0QztBQUMxQyxlQUFLLFFBQUwsSUFBaUIsS0FBSyxhQUFMLENBQW1CLGFBQW5CLEVBQWtDLEtBQUssTUFBdkMsQ0FBakI7QUFDRDtBQUNELGFBQUssTUFBTCxJQUFlLENBQUMsUUFBUSxJQUFSLEdBQWUsS0FBSyxJQUFwQixHQUEyQixTQUE1QixLQUEwQyxDQUF6RDtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVEOzs7O0FBcmJGO0FBQUE7QUFBQSx1Q0F3Ym1CLElBeGJuQixFQXdieUIsSUF4YnpCLEVBd2IrQixLQXhiL0IsRUF3YnNDLEtBeGJ0QyxFQXdiNkMsSUF4YjdDLEVBd2JtRDtBQUFBOztBQUMvQyxlQUFPLE1BQU0sSUFBTixJQUFjLE1BQU0sSUFBTixLQUFnQixZQUFNO0FBQUUsa0JBQVEsSUFBUjtBQUMzQyxpQkFBSyxRQUFMO0FBQWUscUJBQU8sS0FBUDtBQUNmLGlCQUFLLE9BQUw7QUFBYyxxQkFBTyxLQUFLLE1BQVo7QUFDZCxpQkFBSyxNQUFMO0FBQWEscUJBQU8sSUFBUDtBQUNiO0FBQ0Usa0JBQUksRUFBRSxlQUFGLENBQWtCLElBQWxCLENBQUosRUFBNkI7QUFDM0IsdUJBQU8sRUFBRSxHQUFGLENBQU0sSUFBTixFQUFZLElBQVosQ0FBUDtBQUNELGVBRkQsTUFFTztBQUNMLHVCQUFPLE9BQUssa0JBQUwsQ0FBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0MsSUFBcEMsRUFBMEMsS0FBMUMsQ0FBUDtBQUNEO0FBVHdDO0FBVTFDLFNBVmlDLEVBQXBDO0FBV0Q7QUFwY0g7QUFBQTtBQUFBLHlDQXNjcUIsS0F0Y3JCLEVBc2M0QixJQXRjNUIsRUFzY2tDLEtBdGNsQyxFQXNjeUMsU0F0Y3pDLEVBc2NvRCxJQXRjcEQsRUFzYzBEO0FBQ3RELGVBQU8sRUFBRSxrQkFBRixDQUFxQixLQUFyQixFQUE0QixVQUFTLE9BQVQsRUFBa0I7QUFDbkQsaUJBQU8sS0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixJQUEvQixFQUFxQyxLQUFyQyxFQUE0QyxTQUE1QyxFQUF1RCxJQUF2RCxDQUFQO0FBQ0QsU0FGTSxFQUdMLElBSEssQ0FBUDtBQUlEO0FBM2NIO0FBQUE7QUFBQSx1Q0E2Y21CLElBN2NuQixFQTZjeUIsS0E3Y3pCLEVBNmNnQyxJQTdjaEMsRUE2Y3NDLEtBN2N0QyxFQTZjNkMsU0E3YzdDLEVBNmN3RCxJQTdjeEQsRUE2YzhEO0FBQzFELFlBQUksV0FBVyxLQUFLLGtCQUFMLENBQXdCLEtBQXhCLEVBQStCLElBQS9CLEVBQXFDLEtBQXJDLEVBQTRDLFNBQTVDLEVBQXVELElBQXZELENBQWY7QUFDQSxZQUFJLGFBQWEsRUFBakIsRUFBcUI7QUFDbkIsWUFBRSxlQUFGLENBQWtCLElBQWxCLEVBQXdCLElBQXhCO0FBQ0QsU0FGRCxNQUVPLElBQUksYUFBYSxLQUFqQixFQUF3QjtBQUM3QixZQUFFLFlBQUYsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCLFFBQTNCO0FBQ0Q7QUFDRCxlQUFPLFFBQVA7QUFDRDtBQXJkSDtBQUFBO0FBQUEsNkNBdWR5QixJQXZkekIsRUF1ZCtCLEtBdmQvQixFQXVkc0MsU0F2ZHRDLEVBdWRpRCxJQXZkakQsRUF1ZHVEO0FBQ25ELGVBQU8sRUFBRSxJQUFGLENBQU8sQ0FBQyxVQUFELEVBQWEsT0FBYixFQUFzQixRQUF0QixFQUFnQyxNQUFoQyxDQUFQLEVBQWdELFVBQVMsSUFBVCxFQUFlO0FBQ3BFLGNBQUksY0FBSjtBQUNBLGNBQUksUUFBUSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLElBQWhCLENBQVosRUFBbUM7QUFDakMsbUJBQU8sS0FBSyxnQkFBTCxXQUE4QixJQUE5QixFQUFzQyxLQUF0QyxFQUE2QyxJQUE3QyxFQUFtRCxLQUFuRCxFQUEwRCxTQUExRCxFQUFxRSxJQUFyRSxDQUFQO0FBQ0Q7QUFDRixTQUxNLEVBTUwsSUFOSyxDQUFQO0FBT0Q7QUEvZEg7QUFBQTtBQUFBLCtCQWllVyxJQWplWCxFQWllaUI7QUFDYixlQUFPLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsUUFBaEIsS0FBNkIsRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixTQUFoQixDQUFwQztBQUNEO0FBbmVIO0FBQUE7QUFBQSwwQ0FxZXNCLElBcmV0QixFQXFlNEIsSUFyZTVCLEVBcWVrQyxLQXJlbEMsRUFxZXlDLFNBcmV6QyxFQXFlb0Q7QUFDaEQsZUFBTyxFQUFFLElBQUYsQ0FBTyxDQUFDLFFBQUQsRUFBVyxTQUFYLENBQVAsRUFBOEIsVUFBUyxJQUFULEVBQWU7QUFDbEQsY0FBSSxjQUFKO0FBQ0EsY0FBSSxRQUFRLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsSUFBaEIsQ0FBWixFQUFtQztBQUNqQyxvQkFBUSxLQUFLLGdCQUFMLFdBQThCLElBQTlCLEVBQXNDLEtBQXRDLEVBQ04sSUFETSxFQUNBLEtBREEsRUFDTyxTQURQLEVBQ2tCLElBRGxCLENBQVI7QUFFQSxnQkFBSSxVQUFVLEVBQWQsRUFBa0I7QUFBRSxxQkFBUSxPQUFPLGVBQWEsSUFBYixDQUFQLEtBQWdDLFVBQWhDLEdBQTZDLGVBQWEsSUFBYixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxJQUFsQyxFQUF3QyxLQUF4QyxDQUE3QyxHQUE4RixTQUF0RztBQUFtSDtBQUN4STtBQUNGLFNBUE0sRUFRTCxJQVJLLENBQVA7QUFTRDtBQS9lSDtBQUFBO0FBQUEsdUNBaWZtQixLQWpmbkIsRUFpZjBCLElBamYxQixFQWlmZ0MsS0FqZmhDLEVBaWZ1QztBQUFBOztBQUNuQyxZQUFJLENBQUMsTUFBTSxRQUFYLEVBQXFCO0FBQUU7QUFBUztBQUNoQyxZQUFJLFlBQVksRUFBaEI7QUFDQSxlQUFPLEVBQUUsWUFBRixDQUFlLEtBQWYsRUFBc0IsZ0JBQVE7QUFDbkMsY0FBSyxTQUFTLEtBQVYsSUFBb0IsRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixVQUFoQixDQUF4QixFQUFxRDtBQUNuRCxtQkFBSyxzQkFBTCxDQUE0QixJQUE1QixFQUFrQyxLQUFsQyxFQUF5QyxTQUF6QyxFQUFvRCxJQUFwRDtBQUNBLG1CQUFPLEtBQVA7QUFDRDs7QUFFRCxjQUFJLE9BQUssUUFBTCxDQUFjLElBQWQsQ0FBSixFQUF5QjtBQUN2QixtQkFBSyxtQkFBTCxDQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxLQUFyQyxFQUE0QyxTQUE1QztBQUNBLG1CQUFPLEtBQVA7QUFDRDs7QUFFRCxZQUFFLGNBQUYsQ0FBaUIsSUFBakIsRUFBdUIsVUFBUyxJQUFULEVBQWUsS0FBZixFQUFzQixTQUF0QixFQUFpQztBQUN0RCxnQkFBSSxFQUFFLFFBQUYsQ0FBVyxLQUFYLENBQUosRUFBdUI7QUFDckIsa0JBQUksZUFBSjtBQUNBLGtCQUFJLE1BQU0sS0FBSyxNQUFMLENBQVksT0FBWixDQUFWLEVBQWdDO0FBQzlCLHdCQUFRLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEIsS0FBNUIsRUFDTixJQURNLEVBQ0EsS0FEQSxFQUNPLFNBRFAsRUFDa0IsSUFEbEIsQ0FBUjtBQUVEO0FBQ0Qsa0JBQUksVUFBVSxFQUFkLEVBQWtCO0FBQUU7QUFBUzs7QUFFN0Isa0JBQUksU0FBUyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQWIsRUFBMEM7QUFDeEMsb0JBQUksS0FBSyxNQUFMLEVBQWEsSUFBYixDQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QixLQUE5QixFQUFxQyxJQUFyQyxFQUEyQyxLQUEzQyxFQUFrRCxTQUFsRCxDQUFKLEVBQWtFO0FBQ2hFLHlCQUFPLEVBQUUsZUFBRixDQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFQO0FBQ0Q7QUFDRixlQUpELE1BSU8sSUFBSSxNQUFNLEtBQUssTUFBTCxDQUFZLFNBQVosQ0FBVixFQUFrQztBQUN2QyxxQkFBSyxhQUFMLENBQW1CLElBQW5CLEVBQXlCLEtBQXpCLEVBQWdDLElBQWhDLEVBQXNDLEtBQXRDLEVBQTZDLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBN0M7QUFDQSx1QkFBTyxFQUFFLGVBQUYsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsQ0FBUDtBQUNEO0FBQ0Y7QUFDRixXQWxCRCxFQW1CRSxNQW5CRjtBQW9CQSxpQkFBTyxJQUFQO0FBQ0QsU0FoQ00sQ0FBUDtBQWlDRDtBQXJoQkg7QUFBQTtBQUFBLDRCQXVoQlEsRUF2aEJSLEVBdWhCWSxTQXZoQlosRUF1aEJ1QjtBQUNuQixZQUFJLGFBQWEsSUFBakIsRUFBdUI7QUFBRSxzQkFBWSxJQUFaO0FBQW1CO0FBQzVDLHFIQUFtQixFQUFuQixFQUF1QixTQUF2QjtBQUNEO0FBMWhCSDtBQUFBO0FBQUEsa0NBNGhCYyxJQTVoQmQsRUE0aEJvQixPQTVoQnBCLEVBNGhCNkI7QUFBQTs7QUFDekIsVUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixRQUFoQixFQUEwQixJQUExQjtBQUNBLGFBQUssZUFBTCxDQUFxQixhQUFyQjtBQUNBLFlBQUksT0FBTyxLQUFLLGlCQUFMLENBQXVCLE9BQXZCLENBQVg7O0FBRUEsWUFBSSxhQUFhLElBQUksR0FBRyxVQUFQLENBQWtCLENBQUMsSUFBRCxDQUFsQixDQUFqQjtBQUNBLGFBQUssaUJBQUwsQ0FBdUIsS0FBSyxJQUE1QixFQUFrQyxrQkFBVTtBQUMxQztBQUNBLGlCQUFPLE9BQUssWUFBTCxDQUFrQixVQUFsQixFQUE4QixNQUE5QixFQUFzQyxJQUF0QyxFQUE0QyxJQUE1QyxDQUFQO0FBQ0QsU0FIRCxFQUlFLEVBQUMsU0FBUyxLQUFWLEVBSkY7QUFLQSxlQUFPLElBQVA7QUFDRDs7QUFFRDs7QUExaUJGO0FBQUE7QUFBQSxrQ0EyaUJjLElBM2lCZCxFQTJpQm9CLElBM2lCcEIsRUEyaUIwQixLQTNpQjFCLEVBMmlCaUM7QUFDN0IsWUFBSSxpQkFBSjtBQUFBLFlBQWMsa0JBQWQ7QUFBQSxZQUF5QixnQkFBekI7QUFDQSxZQUFJLFVBQVUsRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixLQUFoQixDQUFkLEVBQXNDO0FBQ3BDLHFCQUFXLEtBQUssYUFBTCxDQUFtQixhQUFuQixFQUFrQyxPQUFsQyxDQUFYO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDLFFBQUQsSUFBYSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCLEtBQTFCLENBQWpCLEVBQW1EO0FBQ2pELHNCQUFZLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBWjtBQUNBLFlBQUUsT0FBRixDQUFVLFNBQVYsRUFBcUIsS0FBckIsRUFBNEIsSUFBNUI7QUFGaUQ7QUFBQTtBQUFBOztBQUFBO0FBR2pELGtDQUFrQixNQUFNLElBQU4sQ0FBVyxLQUFLLFVBQWhCLENBQWxCLG1JQUErQztBQUFBLGtCQUF0QyxLQUFzQzs7QUFDN0Msa0JBQUksYUFBYSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsRUFBd0IsSUFBeEIsRUFBOEIsS0FBOUIsQ0FBakI7QUFDQSxrQkFBSSxVQUFKLEVBQWdCO0FBQUUsMEJBQVUsV0FBVixDQUFzQixVQUF0QjtBQUFvQztBQUN2RDtBQU5nRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT2xEO0FBQ0QsZUFBTyxTQUFQO0FBQ0Q7QUExakJIO0FBQUE7QUFBQSxnQ0E0akJZLEdBNWpCWixFQTRqQmlCLElBNWpCakIsRUE0akJ1QixJQTVqQnZCLEVBNGpCNkI7QUFDekIsWUFBSSxPQUFPLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBWDtBQUNBLFlBQUksSUFBSixFQUFVO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUUsa0NBQWdCLE1BQU0sSUFBTixDQUFXLEtBQUssSUFBaEIsQ0FBaEIsbUlBQXVDO0FBQUEsa0JBQTlCLEdBQThCO0FBQUUsbUJBQUssSUFBTCxDQUFVLEdBQVY7QUFBaUI7QUFBNUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE4RDtBQUN4RSxlQUFPLEtBQUssYUFBTCxDQUFtQixHQUFuQixFQUF3QixLQUFLLElBQTdCLENBQVA7QUFDRDtBQWhrQkg7QUFBQTtBQUFBLG9DQWtrQmdCLEdBbGtCaEIsRUFra0JxQixJQWxrQnJCLEVBa2tCMkIsSUFsa0IzQixFQWtrQmlDO0FBQzdCLGVBQU8sS0FBSyxTQUFMLENBQWUsR0FBZixjQUE4QixJQUE5QixRQUF1QyxJQUF2QyxDQUFQO0FBQ0Q7O0FBRUQ7O0FBdGtCRjtBQUFBO0FBQUEsa0NBdWtCYyxJQXZrQmQsRUF1a0JvQixJQXZrQnBCLEVBdWtCMEIsS0F2a0IxQixFQXVrQmlDO0FBQzdCLFlBQUksV0FBVyxFQUFmO0FBQ0EsWUFBSSxLQUFLLElBQVQsRUFBZTtBQUNiLG1CQUFTLE1BQVQsSUFBbUIsS0FBSyxTQUFMLENBQWUsS0FBSyxJQUFwQixDQUFuQjtBQUNBLGVBQUssU0FBTCxDQUFlLEtBQUssSUFBcEIsSUFBNEIsSUFBNUI7QUFDRDtBQUNELFlBQUksS0FBSyxLQUFULEVBQWdCO0FBQ2QsbUJBQVMsT0FBVCxJQUFvQixLQUFLLFNBQUwsQ0FBZSxLQUFLLEtBQXBCLENBQXBCO0FBQ0EsZUFBSyxTQUFMLENBQWUsS0FBSyxLQUFwQixJQUE2QixLQUE3QjtBQUNEO0FBQ0QsZUFBTyxRQUFQO0FBQ0Q7QUFsbEJIO0FBQUE7QUFBQSxtQ0FvbEJlLFVBcGxCZixFQW9sQjJCLE1BcGxCM0IsRUFvbEJtQyxJQXBsQm5DLEVBb2xCeUMsUUFwbEJ6QyxFQW9sQm1EO0FBQy9DLFlBQUksa0JBQUo7QUFDQSxZQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUFFLG1CQUFTLEVBQVQ7QUFBYztBQUNwQyxZQUFJLEtBQUssU0FBTCxJQUFrQixJQUF0QixFQUE0QjtBQUFFLGVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUFzQjtBQUNwRCxZQUFJLFdBQVcsRUFBZjtBQUorQyxZQUsxQyxNQUwwQyxHQUsxQixJQUwwQixDQUsxQyxNQUwwQztBQUFBLFlBS2xDLElBTGtDLEdBSzFCLElBTDBCLENBS2xDLElBTGtDOztBQU0vQyxhQUFLLElBQUksUUFBUSxJQUFaLEVBQWtCLE1BQU0sUUFBUSxDQUFoQyxFQUFtQyxRQUFRLE1BQU0sQ0FBTixHQUFVLE9BQU8sTUFBUCxHQUFnQixDQUExRSxFQUE2RSxNQUFNLFFBQVEsT0FBTyxNQUFyQixHQUE4QixTQUFTLENBQXBILEVBQXVILFNBQVMsS0FBaEksRUFBdUk7QUFDckksY0FBSSxPQUFPLE9BQU8sS0FBUCxDQUFYO0FBQ0EsY0FBSSxXQUFXLEtBQUssV0FBTCxDQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QixLQUE3QixDQUFmO0FBQ0EsY0FBSSxDQUFDLE1BQUQsSUFBVyxPQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLEtBQXhCLENBQWYsRUFBK0M7QUFDN0MsZ0JBQUksWUFBWSxLQUFLLFdBQUwsQ0FBaUIsUUFBakIsRUFBMkIsSUFBM0IsRUFBaUMsS0FBakMsQ0FBaEIsRUFBeUQ7QUFDdkQsdUJBQVMsSUFBVCxDQUFjLFNBQWQ7QUFDQSxtQkFBSyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QztBQUNBLG1CQUFLLGdCQUFMLENBQXNCLFNBQXRCO0FBQ0Q7QUFDRjtBQUNELGVBQUssV0FBTCxDQUFpQixJQUFqQixFQUF1QixTQUFTLElBQWhDLEVBQXNDLFNBQVMsS0FBL0M7QUFDRDs7QUFHRCxZQUFJLFNBQVMsTUFBVCxLQUFvQixDQUF4QixFQUEyQjtBQUN6QixjQUFJLFdBQVcsU0FBUyxTQUFULENBQW1CLEtBQW5CLENBQWY7QUFDQSxZQUFFLFFBQUYsQ0FBVyxRQUFYLEVBQXFCLFNBQXJCO0FBQ0EsbUJBQVMsSUFBVCxDQUFjLFFBQWQ7QUFDRDs7QUFFRCxlQUFPLFdBQVcsV0FBWCxDQUF1QixRQUF2QixDQUFQO0FBQ0Q7QUEvbUJIO0FBQUE7QUFBQSxtQ0FpbkJlLElBam5CZixFQWluQnFCLE9Bam5CckIsRUFpbkI4QixJQWpuQjlCLEVBaW5Cb0MsS0FqbkJwQyxFQWluQjJDLFNBam5CM0MsRUFpbkJzRDtBQUNsRCxVQUFFLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFNBQWhCLEVBQTJCLElBQTNCO0FBQ0EsWUFBSSxPQUFPLEtBQUssaUJBQUwsQ0FBdUIsT0FBdkIsQ0FBWDtBQUNBLFlBQUksYUFBYSxJQUFJLEdBQUcsVUFBUCxDQUFrQixDQUFDLElBQUQsQ0FBbEIsQ0FBakI7QUFDQSxZQUFJLFNBQVMsS0FBSyxrQkFBTCxDQUF3QixJQUF4QixFQUE4QixLQUFLLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLEtBQS9DLENBQWI7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsTUFBOUIsRUFBc0MsSUFBdEMsRUFBNEMsSUFBNUM7QUFDQSxlQUFPLElBQVA7QUFDRDs7QUFFRDs7OztBQTFuQkY7QUFBQTtBQUFBLHlDQTZuQnFCLElBN25CckIsRUE2bkIyQixPQTduQjNCLEVBNm5Cb0MsSUE3bkJwQyxFQTZuQjBDLEtBN25CMUMsRUE2bkJpRCxTQTduQmpELEVBNm5CNEQ7QUFDeEQsWUFBSSxTQUFTLEtBQUssYUFBTCxDQUFtQixtQkFBbkIsRUFBd0MsT0FBeEMsQ0FBYjtBQUNBLFlBQUk7QUFDRixpQkFBTyxPQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLEtBQXhCLEVBQStCLElBQS9CLENBQVA7QUFDRCxTQUZELENBRUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxjQUFJLEdBQUcsTUFBUCxFQUFlO0FBQUUsbUJBQU8sR0FBRyxFQUFILENBQU0sT0FBTixvQkFBK0IsT0FBL0IsRUFBMEMsTUFBTSxPQUFoRCxDQUFQO0FBQWtFO0FBQ3BGO0FBQ0Y7O0FBRUQ7Ozs7OztBQXRvQkY7QUFBQTtBQUFBLGlDQTJvQmEsSUEzb0JiLEVBMm9CbUIsT0Ezb0JuQixFQTJvQjRCLElBM29CNUIsRUEyb0JrQyxLQTNvQmxDLEVBMm9CeUMsU0Ezb0J6QyxFQTJvQm9EO0FBQ2hELFVBQUUsV0FBRixDQUFjLElBQWQsRUFBb0IsS0FBSyxrQkFBTCxDQUF3QixJQUF4QixFQUE4QixPQUE5QixFQUF1QyxJQUF2QyxFQUE2QyxLQUE3QyxDQUFwQjtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7QUFocEJGO0FBQUE7QUFBQSxpQ0FxcEJhLElBcnBCYixFQXFwQm1CLE9BcnBCbkIsRUFxcEI0QixJQXJwQjVCLEVBcXBCa0MsS0FycEJsQyxFQXFwQnlDLFNBcnBCekMsRUFxcEJvRDtBQUNoRCxhQUFLLFNBQUwsR0FBaUIsS0FBSyxrQkFBTCxDQUF3QixJQUF4QixFQUE4QixPQUE5QixFQUF1QyxJQUF2QyxFQUE2QyxLQUE3QyxDQUFqQjtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7QUExcEJGO0FBQUE7QUFBQSxrQ0ErcEJjLElBL3BCZCxFQStwQm9CLE9BL3BCcEIsRUErcEI2QixJQS9wQjdCLEVBK3BCbUMsS0EvcEJuQyxFQStwQjBDLFNBL3BCMUMsRUErcEJxRDtBQUNqRCxZQUFJLFlBQVksS0FBSyxrQkFBTCxDQUF3QixJQUF4QixFQUE4QixPQUE5QixFQUF1QyxJQUF2QyxFQUE2QyxLQUE3QyxDQUFoQjtBQUNBLFlBQUksU0FBSixFQUFlO0FBQUUsWUFBRSxRQUFGLENBQVcsSUFBWCxFQUFpQixTQUFqQjtBQUE4QjtBQUMvQyxlQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBcnFCRjtBQUFBO0FBQUEsb0NBMHFCZ0IsSUExcUJoQixFQTBxQnNCLE9BMXFCdEIsRUEwcUIrQixJQTFxQi9CLEVBMHFCcUMsS0ExcUJyQyxFQTBxQjRDLFFBMXFCNUMsRUEwcUJzRDtBQUNsRCxZQUFJLFlBQVksS0FBSyxrQkFBTCxDQUF3QixJQUF4QixFQUE4QixPQUE5QixFQUF1QyxJQUF2QyxFQUE2QyxLQUE3QyxDQUFoQjtBQUNBLFlBQUksU0FBSixFQUFlO0FBQUUsWUFBRSxZQUFGLENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQixTQUEvQjtBQUE0QztBQUM3RCxlQUFPLElBQVA7QUFDRDs7QUFFRDtBQUNBOzs7Ozs7QUFqckJGO0FBQUE7QUFBQSxpQ0FzckJhLElBdHJCYixFQXNyQm1CLEdBdHJCbkIsRUFzckJ3QjtBQUNwQixVQUFFLGVBQUYsQ0FBa0IsSUFBbEIsRUFBd0IsWUFBeEI7QUFDQSxlQUFPLEtBQUssU0FBTCxHQUFpQixLQUFLLEdBQUwsQ0FBUyxHQUFULENBQXhCO0FBQ0Q7O0FBRUQ7Ozs7OztBQTNyQkY7QUFBQTtBQUFBLGlDQWdzQmEsSUFoc0JiLEVBZ3NCbUIsR0Foc0JuQixFQWdzQndCO0FBQ3BCLFVBQUUsZUFBRixDQUFrQixJQUFsQixFQUF3QixZQUF4QjtBQUNBLGVBQU8sRUFBRSxXQUFGLENBQWMsSUFBZCxFQUFvQixLQUFLLEdBQUwsQ0FBUyxHQUFULEtBQWlCLEVBQXJDLENBQVA7QUFDRDs7QUFFRDtBQUNBOzs7Ozs7QUF0c0JGO0FBQUE7QUFBQSxnQ0Eyc0JZLElBM3NCWixFQTJzQmtCLE9BM3NCbEIsRUEyc0IyQjtBQUN2QixZQUFJLGVBQWUsRUFBRSxrQkFBRixDQUFxQixPQUFyQixDQUFuQjtBQUNBLFlBQUksV0FBVyxLQUFLLFNBQUwsQ0FBZSxNQUFmLEVBQXVCLGFBQWEsSUFBcEMsQ0FBZjtBQUNBLG1CQUFXLEVBQUUsb0JBQUYsQ0FBdUIsUUFBdkIsRUFBaUMsYUFBYSxJQUE5QyxDQUFYO0FBQ0EsZUFBTyxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLElBQXBCLENBQVA7QUFDRDs7QUFFRDs7OztBQWx0QkY7QUFBQTtBQUFBLHdDQXF0Qm9CLE9BcnRCcEIsRUFxdEI2QixPQXJ0QjdCLEVBcXRCc0MsSUFydEJ0QyxFQXF0QjRDO0FBQ3hDLGVBQU8sS0FBSyxhQUFMLENBQW1CLE9BQW5CLEVBQTRCLE9BQTVCLEVBQXFDLEtBQUssUUFBMUMsRUFBb0QsSUFBcEQsQ0FBUDtBQUNEO0FBdnRCSDtBQUFBO0FBQUEsMkNBd3RCdUIsT0F4dEJ2QixFQXd0QmdDO0FBQzVCLFlBQUksT0FBTyxPQUFPLFNBQVAsQ0FBaUIsa0JBQWpCLENBQW9DLE9BQXBDLENBQVg7QUFDQSxZQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNoQixpQkFBTyxFQUFQO0FBQ0EsY0FBSSxRQUFRLEVBQUUsc0JBQUYsQ0FBeUIsT0FBekIsQ0FBWjtBQUNBLGVBQUssUUFBTCxHQUFnQixLQUFLLFNBQUwsQ0FBZSxhQUFmLEVBQThCLE1BQU0sQ0FBTixDQUE5QixDQUFoQjtBQUNBLGNBQUksTUFBTSxDQUFOLENBQUosRUFBYztBQUFFLGlCQUFLLElBQUwsR0FBWSxFQUFFLGVBQUYsQ0FBa0IsTUFBTSxDQUFOLENBQWxCLENBQVo7QUFBMEM7QUFDMUQsaUJBQU8sU0FBUCxDQUFpQixrQkFBakIsQ0FBb0MsT0FBcEMsSUFBK0MsSUFBL0M7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFwdUJGO0FBQUE7QUFBQSw4QkE0dUJVLElBNXVCVixFQTR1QmdCLE9BNXVCaEIsRUE0dUJ5QjtBQUNyQixZQUFJLGFBQWEsSUFBSSxHQUFHLFVBQVAsQ0FBa0IsQ0FBQyxJQUFELENBQWxCLENBQWpCO0FBQ0EsZUFBTyxLQUFLLGlCQUFMLENBQXVCLE9BQXZCLEVBQWdDLFVBQVMsTUFBVCxFQUFpQjtBQUN0RCxjQUFJLE1BQUosRUFBWTtBQUFFLG1CQUFPLFdBQVcsSUFBWCxFQUFQO0FBQTJCLFdBQXpDLE1BQStDO0FBQUUsbUJBQU8sV0FBVyxJQUFYLEVBQVA7QUFBMkI7QUFDN0UsU0FGTSxDQUFQO0FBR0Q7QUFqdkJIO0FBQUE7QUFBQSxrQ0FtdkJjLElBbnZCZCxFQW12Qm9CLE9BbnZCcEIsRUFtdkI2QjtBQUN6QixZQUFJLGFBQWEsSUFBSSxHQUFHLFVBQVAsQ0FBa0IsQ0FBQyxJQUFELENBQWxCLENBQWpCO0FBQ0EsZUFBTyxLQUFLLGlCQUFMLENBQXVCLE9BQXZCLEVBQWdDO0FBQUEsaUJBQVUsV0FBVyxVQUFYLENBQXNCLENBQUMsTUFBdkIsQ0FBVjtBQUFBLFNBQWhDLENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBeHZCRjtBQUFBO0FBQUEsZ0NBNnZCWSxJQTd2QlosRUE2dkJrQixPQTd2QmxCLEVBNnZCMkI7QUFDdkIsZUFBTyxLQUFLLGlCQUFMLENBQXVCLE9BQXZCLEVBQWdDLFVBQVMsTUFBVCxFQUFpQjtBQUFBOztBQUN0RCxjQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUFFLHFCQUFTLEVBQVQ7QUFBYztBQUNwQyxlQUFLLFNBQUwsR0FBaUIsTUFBakI7QUFDQTtBQUNBLGlCQUFPLEVBQUUsYUFBRixDQUFnQixJQUFoQixFQUFzQjtBQUFBLG1CQUFTLE9BQUssZ0JBQUwsQ0FBc0IsS0FBdEIsQ0FBVDtBQUFBLFdBQXRCLENBQVA7QUFDRCxTQUxNLENBQVA7QUFNRDs7QUFFRDs7Ozs7O0FBdHdCRjtBQUFBO0FBQUEsZ0NBMndCWSxJQTN3QlosRUEyd0JrQixPQTN3QmxCLEVBMndCMkI7QUFDdkIsZUFBTyxLQUFLLGlCQUFMLENBQXVCLE9BQXZCLEVBQWdDLFVBQVMsTUFBVCxFQUFpQjtBQUN0RCxjQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUFFLHFCQUFTLEVBQVQ7QUFBYztBQUNwQyxpQkFBTyxFQUFFLFdBQUYsQ0FBYyxJQUFkLEVBQW9CLE1BQXBCLENBQVA7QUFDRCxTQUhNLENBQVA7QUFJRDtBQUNEOzs7Ozs7QUFqeEJGO0FBQUE7QUFBQSxpQ0FzeEJhLElBdHhCYixFQXN4Qm1CLFNBdHhCbkIsRUFzeEI4QjtBQUMxQixlQUFPLEVBQUUsSUFBRixDQUFPLEtBQUssV0FBTCxDQUFpQixTQUFqQixDQUFQLEVBQW9DLFVBQVMsT0FBVCxFQUFrQixTQUFsQixFQUE2QjtBQUN0RSxjQUFJLGFBQWEsSUFBSSxHQUFHLFVBQVAsQ0FBa0IsQ0FBQyxJQUFELENBQWxCLENBQWpCO0FBQ0EsaUJBQU8sS0FBSyxpQkFBTCxDQUF1QixPQUF2QixFQUFnQyxVQUFTLE1BQVQsRUFBaUI7QUFDdEQsZ0JBQUksaUJBQWlCLFNBQVMsQ0FBQyxTQUFELENBQVQsR0FBdUIsRUFBNUM7QUFDQSxtQkFBTyxXQUFXLFdBQVgsQ0FBdUIsY0FBdkIsQ0FBUDtBQUNELFdBSE0sQ0FBUDtBQUlELFNBTk0sRUFPTCxJQVBLLENBQVA7QUFRRDs7QUFFRDs7Ozs7O0FBanlCRjtBQUFBO0FBQUEsZ0NBc3lCWSxJQXR5QlosRUFzeUJrQixTQXR5QmxCLEVBc3lCNkI7QUFDekIsZUFBTyxFQUFFLElBQUYsQ0FBTyxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsQ0FBUCxFQUFvQyxVQUFTLE9BQVQsRUFBa0IsU0FBbEIsRUFBNkI7QUFDdEUsaUJBQU8sS0FBSyxpQkFBTCxDQUF1QixPQUF2QixFQUFnQyxVQUFTLE1BQVQsRUFBaUI7QUFDdEQsZ0JBQUksVUFBVSxJQUFkLEVBQW9CO0FBQ2xCLHFCQUFPLEVBQUUsWUFBRixDQUFlLElBQWYsRUFBcUIsU0FBckIsRUFBZ0MsTUFBaEMsQ0FBUDtBQUNELGFBRkQsTUFFTyxJQUFJLEVBQUUsWUFBRixDQUFlLElBQWYsRUFBcUIsU0FBckIsQ0FBSixFQUFxQztBQUMxQyxxQkFBTyxFQUFFLGVBQUYsQ0FBa0IsSUFBbEIsRUFBd0IsU0FBeEIsQ0FBUDtBQUNEO0FBQ0YsV0FOTSxDQUFQO0FBT0QsU0FSTSxFQVNMLElBVEssQ0FBUDtBQVVEOztBQUVEOzs7Ozs7OztBQW56QkY7QUFBQTtBQUFBLCtCQTB6QlcsSUExekJYLEVBMHpCaUIsU0ExekJqQixFQTB6QjRCO0FBQ3hCLGVBQU8sRUFBRSxJQUFGLENBQU8sS0FBSyxXQUFMLENBQWlCLFNBQWpCLENBQVAsRUFBb0MsVUFBUyxPQUFULEVBQWtCLFNBQWxCLEVBQTZCO0FBQ3RFLGlCQUFPLEtBQUssaUJBQUwsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFBQSxnQkFBQyxNQUFELHVFQUFVLElBQVY7QUFBQSxtQkFBbUI7QUFDeEQsZ0JBQUUsR0FBRixDQUFNLElBQU4sRUFBWSxTQUFaLEVBQXVCLE1BQXZCO0FBRHFDO0FBQUEsV0FBaEMsQ0FBUDtBQUdELFNBSk0sRUFLTCxJQUxLLENBQVA7QUFNRDs7QUFFRDs7Ozs7OztBQW4wQkY7QUFBQTtBQUFBLG1DQXkwQmUsSUF6MEJmLEVBeTBCcUIsR0F6MEJyQixFQXkwQjBCO0FBQUE7O0FBQ3RCLFlBQUksRUFBRSxvQkFBRixDQUF1QixHQUF2QixDQUFKLEVBQWlDO0FBQUUsZ0JBQU0sT0FBTyxHQUFQLENBQU47QUFBb0I7QUFDdkQsWUFBSSxPQUFPLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUFYO0FBQ0EsWUFBSyxTQUFTLFVBQVYsSUFBMEIsU0FBUyxPQUF2QyxFQUFpRDtBQUMvQyxjQUFJLGtCQUFKO0FBQ0EsY0FBSSxFQUFFLFlBQUYsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLENBQUosRUFBcUM7QUFDbkMsaUJBQUssS0FBTCxDQUFXLFlBQVc7QUFBRSxxQkFBTyxLQUFLLE9BQUwsQ0FBYSxHQUFiLEVBQWtCLEtBQUssWUFBTCxDQUFrQixPQUFsQixFQUEyQixFQUFDLE1BQU0sSUFBUCxFQUEzQixDQUFsQixDQUFQO0FBQXFFLGFBQTdGO0FBQ0Q7O0FBRUQsZUFBSyxPQUFMLEdBQWUsWUFBTTtBQUNuQix3QkFBWSxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBWjtBQUNBLGdCQUFJLFFBQ0YsY0FBYyxJQUFkLEdBQ0UsS0FBSyxPQURQLEdBRUUsS0FBSyxPQUFMLEdBQ0EsU0FEQSxHQUdBLFNBTko7QUFPQSxtQkFBTyxRQUFLLEtBQUwsQ0FBVyxZQUFXO0FBQUUscUJBQU8sS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixLQUFsQixFQUF5QixFQUFDLE1BQU0sSUFBUCxFQUF6QixDQUFQO0FBQWdELGFBQXhFLENBQVA7QUFDRCxXQVZEO0FBV0EsaUJBQU8sS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixLQUFLLFNBQUwsQ0FBZSxHQUFmLEVBQW9CLFVBQVMsS0FBVCxFQUFnQjtBQUM1RCx3QkFBWSxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBWjtBQUNBLGdCQUFJLGFBQWEsSUFBakIsRUFBdUI7QUFDckIscUJBQU8sS0FBSyxPQUFMLEdBQWUsVUFBVSxTQUFoQztBQUNELGFBRkQsTUFFTztBQUNMLHFCQUFPLEtBQUssT0FBTCxHQUFlLFVBQVUsSUFBaEM7QUFDRDtBQUNGLFdBUHlCLENBQW5CLENBQVA7QUFTRDtBQUNGOztBQUVEOzs7Ozs7O0FBejJCRjtBQUFBO0FBQUEsaUNBKzJCYSxJQS8yQmIsRUErMkJtQixHQS8yQm5CLEVBKzJCd0I7QUFBQTs7QUFDcEIsWUFBSSxFQUFFLG9CQUFGLENBQXVCLEdBQXZCLENBQUosRUFBaUM7QUFBRSxnQkFBTSxPQUFPLEdBQVAsQ0FBTjtBQUFvQjtBQUN2RCxZQUFJLFlBQVksS0FBSyxNQUFMLEVBQWhCO0FBQ0EsWUFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFBRSxlQUFLLEtBQUwsQ0FBWSxZQUFXO0FBQUUsbUJBQU8sS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixLQUFLLEtBQXZCLEVBQThCLEVBQUMsTUFBTSxJQUFQLEVBQTlCLENBQVA7QUFBcUQsV0FBOUUsRUFBaUYsU0FBakY7QUFBOEY7O0FBRWhILGFBQUssUUFBTCxHQUFnQixZQUFNO0FBQ3BCLGlCQUFPLFFBQUssS0FBTCxDQUFZLFlBQVc7QUFBRSxtQkFBTyxLQUFLLEtBQUwsQ0FBVyxZQUFXO0FBQUUscUJBQU8sS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixLQUFLLEtBQXZCLEVBQThCLEVBQUMsTUFBTSxJQUFQLEVBQTlCLENBQVA7QUFBcUQsYUFBN0UsQ0FBUDtBQUM5QixXQURLLEVBQ0YsU0FERSxDQUFQO0FBRUQsU0FIRDs7QUFLQSxlQUFPLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsS0FBSyxTQUFMLENBQWUsR0FBZixFQUFvQixpQkFBUztBQUNyRCxpQkFBTyxRQUFLLEtBQUwsQ0FBWTtBQUFBLG1CQUFNLEtBQUssS0FBTCxHQUFhLEtBQW5CO0FBQUEsV0FBWixFQUF1QyxTQUF2QyxDQUFQO0FBQ0QsU0FGeUIsQ0FBbkIsQ0FBUDtBQUlEO0FBNzNCSDtBQUFBO0FBQUEsbURBZzRCK0IsSUFoNEIvQixFQWc0QnFDLElBaDRCckMsRUFnNEIyQyxPQWg0QjNDLEVBZzRCb0Q7QUFBQTs7QUFBQSxtQ0FDL0IsS0FBSyxtQkFBTCxDQUF5QixPQUF6QixDQUQrQjtBQUFBLFlBQzNDLFFBRDJDLHdCQUMzQyxRQUQyQzs7QUFFaEQsVUFBRSxnQkFBRixDQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQjtBQUFBLGlCQUFLLFNBQVMsSUFBVCxDQUFjLE9BQWQsRUFBb0IsQ0FBcEIsRUFBdUIsRUFBRSxhQUF6QixDQUFMO0FBQUEsU0FBL0I7QUFDQSxlQUFPLFFBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBdDRCRjtBQUFBO0FBQUEsaUNBMjRCYSxJQTM0QmIsRUEyNEJtQixPQTM0Qm5CLEVBMjRCNEI7QUFDeEIsZUFBTyxLQUFLLDRCQUFMLENBQWtDLE9BQWxDLEVBQTJDLElBQTNDLEVBQWlELE9BQWpELENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBLzRCRjtBQUFBO0FBQUEscUNBbzVCaUIsSUFwNUJqQixFQW81QnVCLE9BcDVCdkIsRUFvNUJnQztBQUM1QixlQUFPLEtBQUssNEJBQUwsQ0FBa0MsV0FBbEMsRUFBK0MsSUFBL0MsRUFBcUQsT0FBckQsQ0FBUDtBQUNEO0FBdDVCSDtBQUFBO0FBQUEsb0NBdzVCZ0IsSUF4NUJoQixFQXc1QnNCLE9BeDVCdEIsRUF3NUIrQjtBQUMzQixlQUFPLEtBQUssNEJBQUwsQ0FBa0MsVUFBbEMsRUFBOEMsSUFBOUMsRUFBb0QsT0FBcEQsQ0FBUDtBQUNEO0FBMTVCSDtBQUFBO0FBQUEsaUNBNDVCYSxJQTU1QmIsRUE0NUJtQixPQTU1Qm5CLEVBNDVCNEI7QUFDeEIsZUFBTyxLQUFLLDRCQUFMLENBQWtDLE9BQWxDLEVBQTJDLElBQTNDLEVBQWlELE9BQWpELENBQVA7QUFDRDtBQTk1Qkg7QUFBQTtBQUFBLGdDQWc2QlksSUFoNkJaLEVBZzZCa0IsT0FoNkJsQixFQWc2QjJCO0FBQ3ZCLGVBQU8sS0FBSyw0QkFBTCxDQUFrQyxNQUFsQyxFQUEwQyxJQUExQyxFQUFnRCxPQUFoRCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQXA2QkY7QUFBQTtBQUFBLG1DQXk2QmUsSUF6NkJmLEVBeTZCcUIsR0F6NkJyQixFQXk2QjBCO0FBQUE7O0FBQ3RCLFlBQUksRUFBRSxvQkFBRixDQUF1QixHQUF2QixDQUFKLEVBQWlDO0FBQUUsZ0JBQU0sT0FBTyxHQUFQLENBQU47QUFBb0I7QUFDdkQsZUFBTyxFQUFFLGdCQUFGLENBQW1CLElBQW5CLEVBQXlCLE9BQXpCLEVBQWtDO0FBQUEsaUJBQU0sUUFBSyxPQUFMLENBQWEsR0FBYixFQUFrQixJQUFsQixDQUFOO0FBQUEsU0FBbEMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBOTZCRjtBQUFBO0FBQUEsa0NBbzdCYyxJQXA3QmQsRUFvN0JvQixNQXA3QnBCLEVBbzdCNEI7QUFBQTs7QUFDeEIsZUFBTyxFQUFFLGdCQUFGLENBQW1CLElBQW5CLEVBQXlCLE9BQXpCLEVBQWtDLGlCQUFTO0FBQ2hELGNBQUksQ0FBQyxNQUFNLGdCQUFYLEVBQTZCO0FBQUUsbUJBQU8sQ0FBQyxRQUFLLE1BQUwsS0FBZ0IsT0FBTyxNQUFQLENBQWpCLEVBQWlDLEtBQWpDLENBQVA7QUFBaUQ7QUFDakYsU0FGTSxDQUFQO0FBR0Q7QUF4N0JIO0FBQUE7QUFBQSxrQ0F5N0JjLElBejdCZCxFQXk3Qm9CLE9BejdCcEIsRUF5N0I2QjtBQUFBOztBQUN6QixZQUFJLGFBQUo7QUFDQSxZQUFJLE9BQU8sRUFBWDtBQUNBLFlBQUksT0FBTyxPQUFPLFNBQVAsQ0FBaUIsV0FBakIsQ0FBNkIsT0FBN0IsQ0FBWDtBQUNBLFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLGNBQUksWUFBWSxFQUFFLHNCQUFGLENBQXlCLE9BQXpCLENBQWhCO0FBQ0EsY0FBSSxTQUFTLFVBQVUsS0FBVixNQUFxQixFQUFsQztBQUNBLG1CQUFTLEVBQUUsYUFBRixDQUFnQixNQUFoQixFQUF3QixHQUF4QixFQUE2QixHQUE3QixFQUFrQyxFQUFDLE1BQU0sSUFBUCxFQUFsQyxDQUFUO0FBQ0EsY0FBSSxVQUFVLENBQVYsQ0FBSixFQUFrQjtBQUFFLG1CQUFPLEVBQUUsZUFBRixDQUFrQixVQUFVLENBQVYsQ0FBbEIsQ0FBUDtBQUF5QztBQUM3RCxpQkFBTyxFQUFDLFdBQVcsTUFBWixFQUFvQixVQUFwQixFQUFQO0FBQ0EsaUJBQU8sU0FBUCxDQUFpQixXQUFqQixDQUE2QixPQUE3QixJQUF3QyxJQUF4QztBQUNEOztBQUVELFVBQUUsSUFBRixDQUFPLEtBQUssU0FBWixFQUF1QixVQUFTLEtBQVQsRUFBZ0IsR0FBaEIsRUFBcUI7QUFDMUMsZUFBSyxJQUFMLENBQVUsR0FBVjtBQUNBLGNBQUksU0FBUyxJQUFiLEVBQW1CO0FBQ2pCLG1CQUFPLEtBQUssS0FBTCxDQUFXLFlBQVc7QUFBRSxxQkFBTyxLQUFLLE9BQUwsQ0FBYSxHQUFiLEVBQWtCLFVBQVUsTUFBNUIsRUFBb0MsRUFBQyxNQUFNLElBQVAsRUFBcEMsQ0FBUDtBQUEyRCxhQUFuRixDQUFQO0FBQ0Q7QUFDRixTQUxELEVBTUUsSUFORjs7QUFRQSxZQUFJLFdBQVc7QUFBQSxpQkFBTyxRQUFLLEtBQUwsQ0FBVyxZQUFXO0FBQUUsbUJBQU8sS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixDQUFDLEtBQUssR0FBTCxDQUFTLEdBQVQsQ0FBbkIsRUFBa0MsRUFBQyxNQUFNLElBQVAsRUFBbEMsQ0FBUDtBQUF5RCxXQUFqRixDQUFQO0FBQUEsU0FBZjtBQUNBLFlBQUksS0FBSyxJQUFULEVBQWU7QUFBRSxxQkFBVyxFQUFFLG9CQUFGLENBQXVCLFFBQXZCLEVBQWlDLEtBQUssSUFBdEMsQ0FBWDtBQUF5RDs7QUFFMUUsZUFBTyxFQUFFLGdCQUFGLENBQW1CLElBQW5CLEVBQXlCLE9BQXpCLEVBQWtDO0FBQUEsaUJBQVMsRUFBRSxJQUFGLENBQU8sSUFBUCxFQUFhLFVBQVMsR0FBVCxFQUFjO0FBQUUsZ0JBQUksQ0FBQyxNQUFNLGdCQUFYLEVBQTZCO0FBQUUscUJBQU8sU0FBUyxHQUFULENBQVA7QUFBdUI7QUFBRSxXQUFyRixDQUFUO0FBQUEsU0FBbEMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBcDlCRjtBQUFBO0FBQUEsdUNBMDlCbUIsSUExOUJuQixFQTA5QnlCLFVBMTlCekIsRUEwOUJxQztBQUNqQyxZQUFJLGFBQWEsRUFBRSxZQUFGLENBQWUsVUFBZixFQUEyQixHQUEzQixDQUFqQjtBQUNBLGVBQU8sRUFBRSxnQkFBRixDQUFtQixJQUFuQixFQUF5QixPQUF6QixFQUFrQyxVQUFTLEtBQVQsRUFBZ0I7QUFDdkQsY0FBSSxDQUFDLE1BQU0sZ0JBQVgsRUFBNkI7QUFDM0IsbUJBQU8sTUFBTSxhQUFiO0FBQ0EsbUJBQU8sRUFBRSxJQUFGLENBQU8sVUFBUCxFQUFtQixVQUFTLFNBQVQsRUFBb0I7QUFDNUMsa0JBQUksRUFBRSxRQUFGLENBQVcsSUFBWCxFQUFpQixTQUFqQixDQUFKLEVBQWlDO0FBQy9CLHVCQUFPLEVBQUUsV0FBRixDQUFjLElBQWQsRUFBb0IsU0FBcEIsQ0FBUDtBQUNELGVBRkQsTUFFTztBQUNMLHVCQUFPLEVBQUUsUUFBRixDQUFXLElBQVgsRUFBaUIsU0FBakIsQ0FBUDtBQUNEO0FBQ0YsYUFOTSxDQUFQO0FBT0Q7QUFDRixTQVhNLENBQVA7QUFZRDs7QUFFRDs7Ozs7QUExK0JGO0FBQUE7QUFBQSxrQ0E4K0JjLElBOStCZCxFQTgrQm9CLE9BOStCcEIsRUE4K0I2QjtBQUFBOztBQUN6QixZQUFJLE9BQU8sS0FBSyxvQkFBTCxDQUEwQixPQUExQixDQUFYO0FBQ0EsWUFBSSxXQUFXLEVBQUUsb0JBQUYsQ0FBdUIsS0FBSyxRQUE1QixFQUFzQyxLQUFLLElBQTNDLENBQWY7QUFDQSxlQUFPLEtBQUssUUFBTCxHQUFnQjtBQUFBLGlCQUFTLFNBQVMsSUFBVCxDQUFjLE9BQWQsRUFBb0IsS0FBcEIsRUFBMkIsTUFBTSxhQUFqQyxDQUFUO0FBQUEsU0FBdkI7QUFDRDs7QUFFRDs7Ozs7OztBQXAvQkY7QUFBQTtBQUFBLG1DQTAvQmUsSUExL0JmLEVBMC9CcUIsT0ExL0JyQixFQTAvQjhCO0FBQUE7O0FBQzFCLFlBQUksT0FBTyxLQUFLLG9CQUFMLENBQTBCLE9BQTFCLENBQVg7QUFDQSxZQUFJLFdBQVcsRUFBRSxvQkFBRixDQUF1QixLQUFLLFFBQTVCLEVBQXNDLEtBQUssSUFBM0MsQ0FBZjtBQUNBLFlBQUksVUFBVSxLQUFLLElBQUwsSUFBYSxLQUFLLElBQUwsQ0FBVSxPQUFyQzs7QUFFQSxlQUFPLEtBQUssU0FBTCxHQUFpQixpQkFBUztBQUMvQixjQUFJLENBQUMsT0FBRCxJQUFhLFlBQVksTUFBTSxPQUFuQyxFQUE2QztBQUMzQyxtQkFBTyxTQUFTLElBQVQsQ0FBYyxPQUFkLEVBQW9CLEtBQXBCLEVBQTJCLE1BQU0sYUFBakMsQ0FBUDtBQUNEO0FBQ0YsU0FKRDtBQUtEOztBQUVEOzs7Ozs7QUF0Z0NGO0FBQUE7QUFBQSxpQ0EyZ0NhLElBM2dDYixFQTJnQ21CLE9BM2dDbkIsRUEyZ0M0QjtBQUFBOztBQUN4QixZQUFJLE9BQU8sS0FBSyxvQkFBTCxDQUEwQixPQUExQixDQUFYO0FBQ0EsWUFBSSxXQUFXLEVBQUUsb0JBQUYsQ0FBdUIsS0FBSyxRQUE1QixFQUFzQyxLQUFLLElBQTNDLENBQWY7QUFDQSxZQUFJLFVBQVUsS0FBSyxJQUFMLElBQWEsS0FBSyxJQUFMLENBQVUsT0FBckM7O0FBRUEsZUFBTyxLQUFLLE9BQUwsR0FBZSxpQkFBUztBQUM3QixjQUFJLENBQUMsT0FBRCxJQUFhLFlBQVksTUFBTSxPQUFuQyxFQUE2QztBQUMzQyxtQkFBTyxTQUFTLElBQVQsQ0FBYyxPQUFkLEVBQW9CLEtBQXBCLEVBQTJCLE1BQU0sYUFBakMsQ0FBUDtBQUNEO0FBQ0YsU0FKRDtBQUtEOztBQUVEOzs7OztBQXZoQ0Y7QUFBQTtBQUFBLGtDQTJoQ2MsSUEzaENkLEVBMmhDb0IsT0EzaENwQixFQTJoQzZCO0FBQUE7O0FBQ3pCLFlBQUksT0FBTyxLQUFLLG9CQUFMLENBQTBCLE9BQTFCLENBQVg7QUFEeUIsWUFFbkIsSUFGbUIsR0FFVixJQUZVLENBRW5CLElBRm1COztBQUd6QixZQUFJLFFBQVMsUUFBUSxLQUFLLEtBQWQsSUFBd0IsR0FBcEM7QUFDQSxZQUFJLFdBQVcseUJBQVM7QUFDdEIsY0FBSSxPQUFPLEtBQUsscUJBQUwsRUFBWDtBQUNBLGNBQUksS0FBSyxTQUFMLEdBQWtCLEtBQUssWUFBTCxJQUFxQixLQUFLLE1BQUwsR0FBYyxLQUFuQyxDQUF0QixFQUFrRTtBQUNoRSxtQkFBTyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLE9BQW5CLEVBQXlCLEtBQXpCLEVBQWdDLElBQWhDLENBQVA7QUFDRDtBQUNGLFNBTEQ7O0FBT0EsWUFBSSxJQUFKLEVBQVU7QUFBRSxxQkFBVyxFQUFFLG9CQUFGLENBQXVCLFFBQXZCLEVBQWlDLElBQWpDLENBQVg7QUFBb0Q7QUFDaEUsZUFBTyxFQUFFLGdCQUFGLENBQW1CLElBQW5CLEVBQXlCLFFBQXpCLEVBQW1DLFFBQW5DLENBQVA7QUFDRDtBQXhpQ0g7QUFBQTtBQUFBLGdDQXlpQ1ksSUF6aUNaLEVBeWlDa0IsS0F6aUNsQixFQXlpQ3lCO0FBQUE7O0FBQ3JCLFlBQUksT0FBTyxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQVg7QUFDQSxZQUFJLFNBQVMsS0FBSyxDQUFMLENBQWI7QUFDQSxZQUFJLE1BQU0sS0FBSyxDQUFMLENBQVY7QUFDQSxZQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLE1BQTNCLENBQUwsRUFBeUM7QUFDdkMsaUJBQU8sRUFBRSxnQkFBRixDQUFtQixJQUFuQixFQUF5QixPQUF6QixFQUFrQyxpQkFBUztBQUNoRCxnQkFBSSxDQUFDLE9BQU8sU0FBUCxDQUFpQixTQUFqQixDQUEyQixNQUEzQixDQUFMLEVBQXlDO0FBQ3ZDLHFCQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsTUFBM0IsSUFBcUMsSUFBckM7QUFDQSxrQkFBSSxHQUFKLEVBQVM7QUFDUCxrQkFBRSxRQUFGLENBQVcsSUFBWCxFQUFpQixTQUFqQjtBQUNBLG9CQUFJLFFBQVEsUUFBSyxhQUFMLENBQW1CLEdBQW5CLEVBQXdCLFlBQVc7QUFDN0Msb0JBQUUsV0FBRixDQUFjLElBQWQsRUFBb0IsU0FBcEI7QUFDQSx5QkFBTyxPQUFQO0FBQ0QsaUJBSFcsQ0FBWjtBQUlEO0FBQ0QscUJBQU8sRUFBRSxVQUFGLENBQWEsTUFBYixDQUFQO0FBQ0Q7QUFDRixXQVpNLENBQVA7QUFhRDtBQUNGO0FBNWpDSDtBQUFBO0FBQUEsc0NBOGpDa0IsSUE5akNsQixFQThqQ3dCLEtBOWpDeEIsRUE4akMrQjtBQUMzQixZQUFJLEtBQUssU0FBTCxJQUFrQixJQUF0QixFQUE0QjtBQUFFLGVBQUssU0FBTCxHQUFpQixFQUFqQjtBQUFzQjtBQUR6QjtBQUFBO0FBQUE7O0FBQUE7QUFFM0IsZ0NBQWlCLE1BQU0sSUFBTixDQUFXLEVBQUUsWUFBRixDQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBWCxDQUFqQixtSUFBeUQ7QUFBQSxnQkFBaEQsSUFBZ0Q7O0FBQ3ZELGdCQUFJLFNBQUosRUFBZSxJQUFmO0FBQ0EsZ0JBQUksT0FBTyxFQUFFLHNCQUFGLENBQXlCLElBQXpCLENBQVg7QUFDQSxnQkFBSSxLQUFLLENBQUwsQ0FBSixFQUFhO0FBQUUscUJBQU8sRUFBRSxlQUFGLENBQWtCLEtBQUssQ0FBTCxDQUFsQixDQUFQO0FBQW9DO0FBQ25ELG1CQUFPLEVBQUUsWUFBRixDQUFlLEtBQUssQ0FBTCxDQUFmLEVBQXdCLEdBQXhCLENBQVA7QUFDQSxnQkFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFBRSxxQkFBTyxFQUFFLFlBQUYsQ0FBZSxLQUFLLENBQUwsQ0FBZixFQUF3QixNQUF4QixDQUFQO0FBQXlDO0FBQ2xFLGdCQUFJLEtBQUssQ0FBTCxLQUFXLElBQWYsRUFBcUI7QUFBRSwwQkFBWSxHQUFHLFVBQUgsQ0FBYyxLQUFLLENBQUwsQ0FBZCxDQUFaO0FBQXFDO0FBQzVELGdCQUFJLFdBQVcsS0FBSyxDQUFMLENBQWY7QUFDQSxnQkFBSSxhQUFhLENBQUMsS0FBSyxTQUFMLENBQWUsUUFBZixDQUFsQixFQUE0QztBQUMxQyxrQkFBSSxhQUFhLElBQUksU0FBSixDQUFjLElBQWQsRUFBb0IsSUFBcEIsQ0FBakI7QUFDQSxrQkFBSSxRQUFKLEVBQWM7QUFBRSxxQkFBSyxTQUFMLENBQWUsUUFBZixJQUEyQixVQUEzQjtBQUF3QztBQUN6RCxhQUhELE1BR08sSUFBSSxHQUFHLE1BQUgsSUFBYSxDQUFDLFNBQWxCLEVBQTZCO0FBQ2xDLGlCQUFHLEVBQUgsQ0FBTSxPQUFOLGtCQUE2QixTQUE3QjtBQUNEO0FBQ0Y7QUFoQjBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFpQjVCO0FBL2tDSDtBQUFBO0FBQUEscUNBaWxDaUIsSUFqbENqQixFQWlsQ3VCLEtBamxDdkIsRUFpbEM4QjtBQUMxQixZQUFJLFFBQVEsRUFBRSxZQUFGLENBQWUsS0FBZixFQUFzQixHQUF0QixDQUFaO0FBQ0EsWUFBSSxpQkFBaUIsRUFBRSxTQUFGLENBQVksS0FBSyxHQUFMLENBQVMsT0FBTyxZQUFQLENBQVQsQ0FBWixFQUE0QyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsaUJBQVUsRUFBRSxRQUFaO0FBQUEsU0FBNUMsQ0FBckI7QUFDQSxZQUFJLFFBQVEsRUFBWjtBQUNBLGNBQU0sY0FBTixJQUF3QixFQUF4Qjs7QUFFQSxZQUFJLGFBQWEsS0FBSyxHQUFMLENBQVMsT0FBTyxZQUFQLENBQVQsQ0FBakI7QUFDQSxlQUFPLEVBQUUsSUFBRixDQUFRLEVBQUUsSUFBRixDQUFPLFVBQVAsQ0FBUixFQUE2QixVQUFTLEdBQVQsRUFBYztBQUFBOztBQUNoRCxpQkFBTyxLQUFLLGFBQUwsQ0FBc0IsT0FBTyxZQUFQLENBQXRCLFNBQThDLEdBQTlDLGdCQUE4RCxvQkFBWTtBQUMvRSxnQkFBSSxhQUFKO0FBQ0EsZ0JBQUksQ0FBQyxRQUFMLEVBQWU7QUFBRTtBQUFTO0FBQzFCLGNBQUUsSUFBRixDQUFPLEtBQVAsRUFBYyxVQUFTLElBQVQsRUFBZTtBQUMzQixvQkFBTSxjQUFOLEVBQXNCLElBQXRCLElBQThCLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBOUI7QUFDQSxrQkFBSSxNQUFNLEdBQU4sS0FBYyxJQUFsQixFQUF3QjtBQUFFLHVCQUFPLEtBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsTUFBTSxHQUFOLEVBQVcsSUFBWCxDQUFuQixDQUFQO0FBQThDO0FBQ3pFLGFBSEQsRUFJRSxPQUpGO0FBS0EsbUJBQU8sTUFBTSxPQUFRLGlCQUFpQixHQUEvQixLQUF3QyxJQUF4QyxHQUErQyxNQUFNLElBQU4sQ0FBL0MsR0FBOEQsTUFBTSxJQUFOLElBQWMsRUFBbkY7QUFDSCxXQVRRLENBQVA7QUFVRCxTQVhNLEVBWUwsSUFaSyxDQUFQO0FBYUQ7QUFybUNIOztBQUFBO0FBQUEsSUFBOEIsR0FBRyxLQUFqQztBQXVtQ0EsU0FBTyxTQUFQO0FBQ0EsU0FBTyxNQUFQO0FBQ0QsQ0EzbUNZLEVBQWI7O0FBNm1DRTs7QUFFRixHQUFHLE9BQUgsR0FBYSxFQUFiO0FBQ0EsR0FBRyxNQUFILEdBQVksTUFBWjtBQUNBLEdBQUcsT0FBSCxDQUFXLEtBQVgsR0FBbUIsTUFBbkI7O0FBRUEsU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDO0FBQ25DLFNBQVEsT0FBTyxLQUFQLEtBQWlCLFdBQWpCLElBQWdDLFVBQVUsSUFBM0MsR0FBbUQsVUFBVSxLQUFWLENBQW5ELEdBQXNFLFNBQTdFO0FBQ0Q7Ozs7O2NDM25DWSxNO0lBQVAsRSxXQUFBLEU7OztBQUVOLEdBQUcsZ0JBQUgsR0FBdUIsVUFBUyxRQUFULEVBQW1CLGVBQW5CLEVBQW9DLE1BQXBDLEVBQTRDO0FBQ2pFLE1BQUksVUFBVSxJQUFkLEVBQW9CO0FBQUssVUFBTCxHQUFnQixFQUFoQixDQUFLLE1BQUw7QUFBc0I7QUFDMUMsTUFBSSx1QkFBcUIsUUFBekI7QUFDQSxTQUFPLFNBQVAsQ0FBaUIsZUFBakIsV0FBeUMsUUFBekMsSUFBdUQsVUFBdkQ7QUFDQSxTQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsSUFBM0IsQ0FBZ0MsUUFBaEM7QUFDQSxTQUFPLE9BQU8sU0FBUCxDQUFpQixVQUFqQixJQUErQixVQUFTLElBQVQsRUFBZSxTQUFmLEVBQTBCO0FBQzlELFdBQU8sSUFBSSxlQUFKLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLFNBQWhDLENBQVA7QUFDRCxHQUZEO0FBR0QsQ0FSRDs7Ozs7Ozs7O2NDRmEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsTSxHQUFXLEUsQ0FBWCxNOztJQUVBLE07QUFDSixrQkFBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQ2pDLFNBQUssZUFBTCxHQUF1QixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdkI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXZCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFNBQUssSUFBTCxHQUFZLElBQVo7O0FBSmlDLGdDQUtWLEtBQUssTUFBTCxDQUFZLHVCQUFaLENBQW9DLE9BQXBDLENBTFU7QUFBQSxRQUs1QixRQUw0Qix5QkFLNUIsUUFMNEI7QUFBQSxRQUtsQixJQUxrQix5QkFLbEIsSUFMa0I7O0FBTWpDLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsWUFBVztBQUFFLGFBQU8sU0FBUyxJQUFULENBQWMsS0FBSyxNQUFuQixDQUFQO0FBQW9DLEtBQWpFOztBQUVBLFFBQUksS0FBSyxJQUFMLElBQWEsSUFBakIsRUFBdUI7QUFBRSxXQUFLLElBQUwsR0FBWSxDQUFaO0FBQWdCO0FBQ3pDLFFBQUksS0FBSyxJQUFMLElBQWEsSUFBakIsRUFBdUI7QUFBRSxXQUFLLElBQUwsR0FBWSxDQUFaO0FBQWdCO0FBQ3pDLFFBQUksS0FBSyxJQUFMLElBQWEsSUFBakIsRUFBdUI7QUFBRSxXQUFLLElBQUwsR0FBWSxDQUFaO0FBQWdCO0FBQ3pDLFFBQUksS0FBSyxJQUFMLElBQWEsSUFBakIsRUFBdUI7QUFBRSxXQUFLLElBQUwsR0FBWSxDQUFaO0FBQWdCO0FBQ3pDLFNBQUssTUFBTCxHQUFjLEtBQWQ7O0FBRUEsTUFBRSxhQUFGO0FBQ0EsTUFBRSxnQkFBRixDQUFtQixLQUFLLElBQXhCLEVBQThCLFdBQTlCLEVBQTJDLEtBQUssZUFBaEQ7QUFDQSxTQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLE9BQU8sZUFBUCxDQUF0QixFQUErQyxLQUFLLGVBQXBEO0FBQ0Q7Ozs7b0NBRWUsRyxFQUFLO0FBQ25CLFVBQUksSUFBSSxLQUFKLEtBQWMsQ0FBbEIsRUFBcUI7QUFBRTtBQUFTO0FBQ2hDLFdBQUssTUFBTCxHQUFlLElBQUksTUFBSixLQUFlLEtBQUssSUFBckIsSUFBOEIsQ0FBQyxJQUFJLGdCQUFqRDtBQUNBLFVBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2YsWUFBSSxTQUFVLEtBQUssUUFBTixFQUFiO0FBQ0EsZUFBTyxLQUFLLE1BQUwsR0FBZSxXQUFXLEtBQVosSUFBdUIsV0FBVyxJQUF2RDtBQUNEO0FBQ0Y7OztvQ0FFZSxHLEVBQUs7QUFDbkIsVUFBSSxJQUFJLGdCQUFSLEVBQTBCO0FBQUUsYUFBSyxNQUFMLEdBQWMsS0FBZDtBQUFzQjtBQUNsRCxVQUFJLENBQUMsS0FBSyxNQUFWLEVBQWtCO0FBQUU7QUFBUzs7QUFFN0IsVUFBSSxnQkFBSixHQUF1QixJQUF2QjtBQUNBLFVBQUksSUFBSSxLQUFKLEtBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsZUFBTyxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLEtBQUssTUFBTCxHQUFjLEtBQXJCO0FBQ0Q7QUFDRjs7O21DQUVjO0FBQUUsYUFBTyxLQUFLLElBQUwsQ0FBVSxLQUFWLElBQW1CLFNBQVMsSUFBVCxDQUFjLFdBQXhDO0FBQXNEOzs7b0NBRXZEO0FBQUUsYUFBTyxLQUFLLElBQUwsQ0FBVSxLQUFWLElBQW1CLFNBQVMsSUFBVCxDQUFjLFlBQXhDO0FBQXVEOzs7NEJBRWpFLEcsRUFBSztBQUNYLFVBQUksT0FBTyxLQUFLLFlBQUwsRUFBWDtBQUNBLFVBQUksTUFBTSxVQUFVLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBTyxTQUFQLENBQWhCLENBQXBCO0FBQ0EsVUFBSSxXQUFXLE1BQU0sT0FBTyxJQUFJLENBQWpCLEdBQXFCLElBQUksQ0FBeEM7QUFDQSxVQUFJLENBQUMsS0FBSyxVQUFMLENBQWdCLElBQWhCLEVBQXNCLEtBQUssSUFBTCxDQUFVLElBQWhDLEVBQXNDLEtBQUssSUFBTCxDQUFVLElBQWhELEVBQXNELEtBQUssSUFBTCxDQUFVLENBQWhFLEVBQW1FLFFBQW5FLENBQUwsRUFBbUY7QUFDakYsZUFBTyxLQUFLLGFBQUwsRUFBUDtBQUNBLG1CQUFXLE1BQU0sT0FBTyxJQUFJLENBQWpCLEdBQXFCLElBQUksQ0FBcEM7QUFDQSxlQUFPLEtBQUssVUFBTCxDQUFnQixJQUFoQixFQUFzQixLQUFLLElBQUwsQ0FBVSxJQUFoQyxFQUFzQyxLQUFLLElBQUwsQ0FBVSxJQUFoRCxFQUFzRCxLQUFLLElBQUwsQ0FBVSxDQUFoRSxFQUFtRSxRQUFuRSxDQUFQO0FBQ0Q7QUFDRjs7OytCQUVVLEksRUFBTSxHLEVBQUssRyxFQUFLLEcsRUFBSyxRLEVBQVU7QUFDeEMsVUFBSyxPQUFPLElBQVIsSUFBa0IsWUFBWSxJQUFsQyxFQUF5QztBQUN2QyxZQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixHQUFoQixDQUFmO0FBQ0EsWUFBSSxhQUFhLFFBQWpCLEVBQTJCO0FBQ3pCLGNBQUssTUFBTSxJQUFQLEdBQWUsUUFBbkIsRUFBNkI7QUFDM0IsdUJBQVcsTUFBTSxJQUFqQjtBQUNELFdBRkQsTUFFTyxJQUFLLE1BQU0sSUFBUCxHQUFlLFFBQW5CLEVBQTZCO0FBQ2xDLHVCQUFXLE1BQU0sSUFBakI7QUFDRDtBQUNELGVBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsR0FBcEIsRUFBNEIsUUFBNUI7QUFDQyxlQUFLLFFBQU47QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNGOzs7Ozs7QUFHSCxHQUFHLGdCQUFILENBQW9CLFFBQXBCLEVBQThCLE1BQTlCOzs7Ozs7Ozs7Y0MvRWEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsQyxHQUFNLEUsQ0FBTixDOztJQUVBLEs7QUFFSixpQkFBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLEdBQTFCLEVBQStCO0FBQUE7O0FBQzdCLFNBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixHQUFwQixFQUF5QixLQUFLLHNCQUFMLENBQTRCLEtBQUssSUFBakMsQ0FBekI7QUFDRDs7OzsyQ0FFc0IsSSxFQUFNO0FBQzNCLFVBQUksZUFBZSxFQUFuQjtBQUNBLFVBQUksY0FBYyxFQUFsQjtBQUNBLFdBQUssTUFBTCxDQUFZLFlBQVosQ0FBeUIsSUFBekIsRUFBK0IsVUFBUyxJQUFULEVBQWU7QUFDNUMsWUFBSSxTQUFTLEVBQUUsUUFBRixDQUFXLElBQVgsQ0FBYixFQUErQjtBQUM3QixzQkFBWSxJQUFaLENBQWlCLEVBQUUsU0FBRixDQUFZLElBQVosQ0FBakI7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FIRCxNQUdPLElBQUksU0FBUyxFQUFFLFFBQUYsQ0FBVyxJQUFYLENBQWIsRUFBK0I7QUFDcEMsY0FBSSxZQUFZLE1BQVosS0FBdUIsQ0FBM0IsRUFBOEI7QUFBRSx5QkFBYSxJQUFiLENBQWtCLFdBQWxCO0FBQWlDO0FBQ2pFLHdCQUFjLEVBQWQ7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNELE9BVEQ7QUFVQSxVQUFJLFlBQVksTUFBWixLQUF1QixDQUEzQixFQUE4QjtBQUFFLHFCQUFhLElBQWIsQ0FBa0IsV0FBbEI7QUFBaUM7QUFDakUsYUFBTyxZQUFQO0FBQ0Q7Ozs7OztBQUdILEdBQUcsZ0JBQUgsQ0FBb0IsT0FBcEIsRUFBNkIsS0FBN0I7Ozs7Ozs7Ozs7Ozs7Y0M5QmEsTTtJQUFQLEUsV0FBQSxFO0lBQ0EsQyxHQUFNLEUsQ0FBTixDO0lBQ0EsQyxHQUFNLEUsQ0FBTixDOztJQUVBLGU7OztBQUVKLDJCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQSxrSUFDVixJQURVOztBQUVoQixVQUFLLFlBQUwsR0FBb0IsTUFBSyxzQkFBTCxDQUE0QixNQUFLLElBQWpDLENBQXBCO0FBRmdCO0FBR2pCOzs7OzJDQUVzQixJLEVBQU07QUFDM0IsVUFBSSxlQUFlLEVBQW5CO0FBQ0EsVUFBSSxjQUFjLEVBQWxCO0FBQ0EsV0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLFVBQVMsSUFBVCxFQUFlO0FBQ3JDLFlBQUksU0FBUyxFQUFFLFFBQUYsQ0FBVyxJQUFYLENBQWIsRUFBK0I7QUFDN0IsY0FBSSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBSixFQUE2QjtBQUMzQixnQkFBSSxjQUFjLEtBQUssc0JBQUwsQ0FBNEIsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUE1QixDQUFsQjtBQUNBLGdCQUFJLFlBQVksTUFBWixLQUF1QixDQUEzQixFQUE4QjtBQUFFLDBCQUFZLElBQVosQ0FBaUIsRUFBQyxPQUFPLFdBQVIsRUFBakI7QUFBeUM7QUFDMUUsV0FIRCxNQUdPO0FBQ0wsd0JBQVksSUFBWixDQUFpQixFQUFDLE1BQU0sRUFBRSxTQUFGLENBQVksSUFBWixDQUFQLEVBQWpCO0FBQ0Q7QUFDRCxpQkFBTyxLQUFQO0FBQ0QsU0FSRCxNQVFPLElBQUksU0FBUyxFQUFFLFFBQUYsQ0FBVyxJQUFYLENBQWIsRUFBK0I7QUFDcEMsY0FBSSxZQUFZLE1BQVosS0FBdUIsQ0FBM0IsRUFBOEI7QUFBRSx5QkFBYSxJQUFiLENBQWtCLFdBQWxCO0FBQWlDO0FBQ2pFLHdCQUFjLEVBQWQ7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNELE9BZEQ7QUFlQSxVQUFJLFlBQVksTUFBWixLQUF1QixDQUEzQixFQUE4QjtBQUFFLHFCQUFhLElBQWIsQ0FBa0IsV0FBbEI7QUFBaUM7QUFDakUsYUFBTyxZQUFQO0FBQ0Q7OztpQ0FFWSxJLEVBQU07QUFDakIsYUFBUSxDQUFDLEtBQUssUUFBTCxJQUFpQixJQUFqQixHQUF3QixLQUFLLFFBQUwsQ0FBYyxNQUF0QyxHQUErQyxTQUFoRCxNQUErRCxDQUFoRSxJQUF1RSxZQUFZLEVBQUUsUUFBRixDQUFXLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBWCxDQUExRjtBQUNEOzs7O0VBL0IyQixHQUFHLE07O0FBa0NqQzs7O0FBQ0EsT0FBTyxFQUFQLENBQVUsT0FBVixDQUFrQixlQUFsQixHQUFvQyxlQUFwQzs7Ozs7QUN2Q0E7QUFDQSxJQUFJLEtBQUssUUFBUSxrQkFBUixDQUFUOztBQUVBLEdBQUcsZ0JBQUgsR0FBc0IsWUFBVztBQUNoQyxLQUFJLGVBQWUsR0FBRyxLQUFILENBQVMsR0FBVCxDQUFhLEdBQUcsTUFBSCxDQUFVLGVBQVYsQ0FBYixDQUFuQjs7QUFFQSxLQUFJLE9BQU8sU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUFYO0FBQ0EsS0FBSSxNQUFNLFNBQVMsY0FBVCxDQUF3QixZQUF4QixDQUFWO0FBQ0EsS0FBSSxNQUFNLFNBQVMsY0FBVCxDQUF3QixZQUF4QixDQUFWO0FBQ0EsS0FBSSxNQUFNLFNBQVMsY0FBVCxDQUF3QixZQUF4QixDQUFWO0FBQ0EsS0FBSSxNQUFNLFNBQVMsY0FBVCxDQUF3QixZQUF4QixDQUFWO0FBQ0EsS0FBSSxTQUFTLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFiO0FBQ0EsS0FBSSxNQUFNLFNBQVMsY0FBVCxDQUF3QixrQkFBeEIsQ0FBVjtBQUNBLEtBQUksYUFBYSxTQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLENBQWpCOztBQUVBLEtBQUksZUFBZSxnQkFBbkI7O0FBRUEsS0FBSSxhQUFhLFNBQWIsVUFBYSxDQUFTLElBQVQsRUFBZTtBQUMvQixNQUFHLE9BQU8sSUFBUCxJQUFnQixXQUFoQixJQUErQixRQUFRLElBQTFDLEVBQWdEO0FBQy9DLFFBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsWUFBbkI7O0FBRUE7QUFDQSxPQUFJLFFBQVEsS0FBSyxvQkFBTCxDQUEwQixPQUExQixFQUFtQyxDQUFuQyxDQUFaO0FBQ0EsT0FBRyxPQUFPLEtBQVAsSUFBaUIsV0FBakIsSUFBZ0MsR0FBRyxLQUFILENBQVMsR0FBVCxDQUFhLEdBQUcsTUFBSCxDQUFVLG9CQUFWLENBQWIsQ0FBbkMsRUFBa0Y7QUFDakYsUUFBSSxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsQ0FBeUIsY0FBekIsQ0FBSixFQUE4QztBQUM3QyxRQUFHLEtBQUgsQ0FBUyxRQUFULENBQWtCLDZCQUFsQixFQUFpRCxJQUFqRDtBQUNBLGdCQUFXLFlBQUk7QUFDZCxZQUFNLEtBQU47QUFDQSxNQUZELEVBRUUsR0FGRjtBQUdBLEtBTEQsTUFNSTtBQUNILFdBQU0sS0FBTjtBQUNBO0FBQ0QsSUFWRCxNQVVPLElBQUksR0FBRyxLQUFILENBQVMsR0FBVCxDQUFhLEdBQUcsTUFBSCxDQUFVLG9CQUFWLENBQWIsQ0FBSixFQUFtRDtBQUN6RCxRQUFJLE9BQU8sS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUFYOztBQUVBLFFBQUcsT0FBTyxLQUFLLENBQUwsQ0FBUCxJQUFtQixXQUF0QixFQUFtQztBQUNsQyxVQUFLLENBQUwsRUFBUSxLQUFSO0FBQ0EsS0FGRCxNQUVPOztBQUVOLFNBQUksUUFBUSxLQUFLLG9CQUFMLENBQTBCLEdBQTFCLENBQVo7QUFDQSxTQUFHLE9BQU8sTUFBTSxDQUFOLENBQVAsSUFBb0IsV0FBdkIsRUFBb0M7QUFDbkMsWUFBTSxDQUFOLEVBQVMsS0FBVDtBQUNBLE1BRkQsTUFFTyxJQUFHLE9BQU8sTUFBTSxDQUFOLENBQVAsSUFBb0IsV0FBdkIsRUFBb0M7QUFDMUMsWUFBTSxDQUFOLEVBQVMsS0FBVDtBQUNBO0FBQ0Q7QUFDRDtBQUNEO0FBQ0QsRUFoQ0Q7QUFpQ0EsS0FBSSxZQUFZLFNBQVosU0FBWSxDQUFTLElBQVQsRUFBZTtBQUM5QixNQUFHLE9BQU8sSUFBUCxJQUFnQixXQUFoQixJQUErQixRQUFRLElBQTFDLEVBQWdEO0FBQy9DLFFBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsWUFBdEI7QUFDQTtBQUNELEVBSkQ7O0FBTUEsS0FBSSxZQUFZLFdBQWhCO0FBQ0EsS0FBSSxnQkFBZ0IsY0FBcEI7O0FBRUEsS0FBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsR0FBVztBQUM5QixhQUFXLFNBQVgsQ0FBcUIsR0FBckIsQ0FBeUIsU0FBekI7O0FBRUEsYUFBVyxZQUFVO0FBQ3BCLGNBQVcsU0FBWCxDQUFxQixNQUFyQixDQUE0QixTQUE1QjtBQUNBLGNBQVcsU0FBWCxDQUFxQixHQUFyQixDQUF5QixhQUF6QjtBQUNBLEdBSEQsRUFHRSxHQUhGO0FBSUEsRUFQRDs7QUFTQSxLQUFJLGdCQUFnQixTQUFoQixhQUFnQixHQUFXO0FBQzlCLGFBQVcsWUFBVTtBQUNwQixjQUFXLFNBQVgsQ0FBcUIsTUFBckIsQ0FBNEIsYUFBNUI7QUFDQSxHQUZELEVBRUcsR0FGSDtBQUdBLEVBSkQ7O0FBTUEsTUFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixlQUFuQjs7QUFFQSxTQUFPLFlBQVA7QUFDQyxPQUFLLEtBQUw7QUFDQztBQUNBLGNBQVcsR0FBWDtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsTUFBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsVUFBVjtBQUNBO0FBQ0QsT0FBSyxLQUFMO0FBQ0M7QUFDQSxjQUFXLEdBQVg7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLE1BQVY7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLFVBQVY7QUFDQTtBQUNELE9BQUssS0FBTDtBQUNDO0FBQ0EsY0FBVyxHQUFYO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxNQUFWO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxVQUFWO0FBQ0E7QUFDRCxPQUFLLEtBQUw7QUFDQztBQUNBLGNBQVcsR0FBWDtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsTUFBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsVUFBVjtBQUNBO0FBQ0QsT0FBSyxRQUFMO0FBQ0M7QUFDQSxjQUFXLE1BQVg7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLEdBQVY7QUFDQSxhQUFVLFVBQVY7QUFDQTtBQUNELE9BQUssV0FBTDtBQUNDO0FBQ0EsY0FBVyxHQUFYO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxHQUFWO0FBQ0EsYUFBVSxNQUFWO0FBQ0EsYUFBVSxVQUFWO0FBQ0E7QUFDRCxPQUFLLE1BQUw7QUFDQyxjQUFXLFVBQVg7QUFDQTtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtBQUNBLGFBQVUsTUFBVjtBQUNBO0FBQ0Q7QUFBUztBQUNSLGFBQVUsR0FBVjtBQUNBLGFBQVUsR0FBVjtB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QztBQUMzQyxTQUFTLHlCQUNOLFlBQVcsSUFBWCxJQUFtQixZQUFZLEdBQS9CLElBQXNDLFlBQVksSUFENUMsQ0FBVDtBQUVELENBSEQ7O0FBS0EsRUFBRSxLQUFGLEdBQVUsVUFBRSxPQUFGLEVBQVcsb0JBQVgsRUFBbUM7QUFDM0MsU0FBUSx5QkFDSCxZQUFZLEtBQVosSUFBcUIsWUFBWSxHQUFqQyxJQUF3QyxZQUFZLEtBRGpELENBQVI7QUFFRCxDQUhEOztBQUtBLEVBQUUsVUFBRixHQUFlLFVBQUUsS0FBRixFQUFTLG9CQUFULEVBQWtDO0FBQy9DLE1BQUssVUFBVSxhQUFWLElBQ0UseUJBQ0osVUFBVSxLQUFWLElBQW1CLFVBQVUsSUFBN0IsSUFBcUMsVUFBVSxLQUQzQyxDQURQLEVBRTJEO0FBQ3pELFdBQU8sSUFBUDtBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0QsQ0FQRDs7Ozs7O0FDbEJBO0FBQ0EsSUFBSSxPQUFPLEVBQVAsS0FBYyxTQUFsQixFQUE2QjtBQUMzQixTQUFPLEVBQVAsR0FBWSxFQUFaO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQU8sRUFBeEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBfIH0gPSByaDtcclxubGV0IHsgJCB9ID0gcmg7XHJcblxyXG52YXIgQ29uc29sZSA9IChmdW5jdGlvbigpIHtcclxuICBsZXQgb3ZlcnJpZGVzID0gdW5kZWZpbmVkO1xyXG4gIGxldCBjb2xvcnMgPSB1bmRlZmluZWQ7XHJcbiAgQ29uc29sZSA9IGNsYXNzIENvbnNvbGUgZXh0ZW5kcyByaC5QbHVnaW4ge1xyXG4gICAgc3RhdGljIGluaXRDbGFzcygpIHtcclxuICBcclxuICAgICAgb3ZlcnJpZGVzID0gWydpbmZvJywgJ2xvZycsICd3YXJuJywgJ2RlYnVnJywgJ2Vycm9yJ107XHJcbiAgXHJcbiAgICAgIGNvbG9ycyA9IFsnIzAwRkYwMCcsICcjMDAwMDAwJywgJyMwMDAwRkYnLCAnIzAwMDBGRicsICcjRkYwMDAwJ107XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuJGVsID0gJCgnI2NvbnNvbGUnLCAwKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLiRlbCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuY29uc29sZSA9PSBudWxsKSB7IHdpbmRvdy5jb25zb2xlID0ge307IH1cclxuICAgICAgICB0aGlzLmF0dGFjaE93bmVyKHdpbmRvdy5jb25zb2xlKTtcclxuICAgICAgICB0aGlzLmFkZE92ZXJyaWRlcyhvdmVycmlkZXMpO1xyXG4gICAgICAgIF8uZWFjaChvdmVycmlkZXMsIGZ1bmN0aW9uKGZuTmFtZSwgaW5kZXgpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yc1tpbmRleF07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvZ2dlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLCB0aGlzKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUNoaWxkTm9kZXMoKTtcclxuICAgICAgICB0aGlzLnNldFVwSW5wdXRCb3goKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG93bmVySXNDaGFuZ2VkKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duZXIoKSkgeyByZXR1cm4gJyc7IH0gZWxzZSBpZiAodGhpcy4kZWwpIHsgcmV0dXJuICdub25lJzsgfVxyXG4gICAgICB9KSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2dlcihvbGRIYW5kbGVyLCBhcmdzLCB0YWcpIHtcclxuICAgICAgaWYgKHRhZyA9PSBudWxsKSB7IHRhZyA9ICdzcGFuJzsgfVxyXG4gICAgICBsZXQgbWVzc2FnZXMgPSBbXTtcclxuICAgICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICAgIGZvciAobGV0IGFyZyBvZiBBcnJheS5mcm9tKGFyZ3MpKSB7XHJcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihhcmcpIHx8IF8uaXNTdHJpbmcoYXJnKSkge1xyXG4gICAgICAgICAgbWVzc2FnZXMucHVzaChhcmcpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnICE9IG51bGwpIHtcclxuICAgICAgICAgIHZhciBtc2c7XHJcbiAgICAgICAgICB0cnkgeyBtc2cgPSBKU09OLnN0cmluZ2lmeShhcmcpOyB9XHJcbiAgICAgICAgICBjYXRjaCAoZSkgeyBtc2cgPSBgJHtlLm5hbWV9OiAke2UubWVzc2FnZX1gOyB9XHJcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKG1zZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG1lc3NhZ2VzLnB1c2goJ3VuZGVmaW5lZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5jb2xvciA9PT0gJyNGRjAwMDAnKSB7IG1lc3NhZ2VzLnB1c2goXy5zdGFja1RyYWNlKCkpOyB9XHJcbiAgICAgIG5vZGUuc3R5bGUuY29sb3IgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAkLnRleHRDb250ZW50KG5vZGUsIG1lc3NhZ2VzLmpvaW4oJyAnKSk7XHJcblxyXG4gICAgICB0aGlzLiRsb2dOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgICB0aGlzLiRsb2dOb2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xyXG4gICAgICB0aGlzLiRlbC5zY3JvbGxUb3AgPSB0aGlzLiRlbC5zY3JvbGxIZWlnaHQ7XHJcblxyXG4gICAgICBpZiAob2xkSGFuZGxlcikgeyByZXR1cm4gb2xkSGFuZGxlcihhcmdzKTsgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNoaWxkTm9kZXMoKSB7XHJcbiAgICAgIHRoaXMuJGxvZ05vZGUgPSAkLmZpbmQodGhpcy4kZWwsICdwJylbMF07XHJcbiAgICAgIGlmICghdGhpcy4kbG9nTm9kZSkge1xyXG4gICAgICAgIHRoaXMuJGxvZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgdGhpcy4kbG9nTm9kZS5jbGFzc05hbWUgPSAnY29uc29sZSc7XHJcbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbG9nTm9kZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGlucHV0ID0gJC5maW5kKHRoaXMuJGVsLCAnaW5wdXQnKVswXTtcclxuICAgICAgaWYgKCF0aGlzLiRpbnB1dCkge1xyXG4gICAgICAgIGxldCAkbGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gICAgICAgICQudGV4dENvbnRlbnQoJGxhYmxlLCAnPiAnKTtcclxuICAgICAgICAkbGFibGUuc3R5bGUuY29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy4kaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuJGlucHV0LnR5cGUgPSAndGV4dCc7XHJcbiAgICAgICAgdGhpcy4kaW5wdXQuY2xhc3NOYW1lID0gJ2NvbnNvbGUnO1xyXG4gICAgICAgIHRoaXMuJGlucHV0LnN0eWxlLndpZHRoID0gJzk4JSc7XHJcbiAgICAgICAgdGhpcy4kaW5wdXQuc3R5bGUuYm9yZGVyID0gJzAnO1xyXG4gICAgICAgIHRoaXMuJGlucHV0LnN0eWxlLnBhZGRpbmcgPSAnMnB4JztcclxuICAgICAgICB0aGlzLiRpbnB1dC5wbGFjZWhvbGRlciA9ICdFbnRlciBhIHZhbGlkIGV4cHJlc3Npb24nO1xyXG4gICAgICAgICRsYWJsZS5hcHBlbmRDaGlsZCh0aGlzLiRpbnB1dCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRsYWJsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRVcElucHV0Qm94KCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kaW5wdXQub25rZXlkb3duID0gZXZlbnQgPT4ge1xyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgICAgdGhpcy5jb2xvciA9ICcjMDAwMEZGJztcclxuICAgICAgICAgIGxldCBleHByID0gdGhpcy4kaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcmV0VmFsID0gRnVuY3Rpb24oJ2V2ZW50JywgYHJldHVybiAke2V4cHJ9YCkoZXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLiRpbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihudWxsLCBbZXhwcl0sICdiJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvZ2dlcihudWxsLCBbcmV0VmFsXSk7XHJcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3IgPSAnI0ZGMTEwMCc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvZ2dlcihudWxsLCBbYCR7ZS5uYW1lfTogJHtlLm1lc3NhZ2V9YF0sICdiJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH07XHJcbiAgQ29uc29sZS5pbml0Q2xhc3MoKTtcclxuICByZXR1cm4gQ29uc29sZTtcclxufSkoKTtcclxuXHJcbnJoLkNvbnNvbGUgPSBDb25zb2xlO1xyXG4iLCJsZXQgY29uc3RzO1xyXG5sZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgY2FjaGUgPSB7fTtcclxuXHJcbnJoLmNvbnN0cyA9IChjb25zdHMgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgIGlmIChyaC5fZGVidWcpIHtcclxuICAgICAgaWYgKCEoa2V5IGluIGNhY2hlKSkgeyByaC5fZCgnZXJyb3InLCAnY29uc3RzJywgYCR7a2V5fSBpcyBub3QgYXZhaWxhYmxlYCk7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBjYWNoZVtrZXldO1xyXG4gIH0gZWxzZSBpZiAoa2V5IGluIGNhY2hlKSB7XHJcbiAgICBpZiAocmguX2RlYnVnKSB7IHJldHVybiByaC5fZCgnZXJyb3InLCAnY29uc3RzJywgYCR7a2V5fSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRgKTsgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gY2FjaGVba2V5XSA9IHZhbHVlO1xyXG4gIH1cclxufSk7XHJcblxyXG4vLyBUZW1wIGtleXNcclxuY29uc3RzKCdLRVlfVEVNUF9EQVRBJywgICAgICAgICAgICAgICAgICAnLnRlbXAuZGF0YScpO1xyXG5cclxuLy8gaWZyYW1lIGtleXNcclxuY29uc3RzKCdLRVlfU0hBUkVEX0lOUFVUJywgICAgICAgICAgICAgICcuX3NoYXJlZGtleXMuaW5wdXQnKTtcclxuY29uc3RzKCdLRVlfU0hBUkVEX09VVFBVVCcsICAgICAgICAgICAgICcuX3NoYXJlZGtleXMub3V0cHV0Jyk7XHJcbmNvbnN0cygnS0VZX0lGUkFNRV9FVkVOVFMnLCAgICAgICAgICAgICAnLmwuaWZyYW1lX2V2ZW50cycpO1xyXG5cclxuLy8gU2NyZWVuIHNwZWNpZmljXHJcbmNvbnN0cygnS0VZX1NDUkVFTicsICAgICAgICAgICAgICAgICAgICAnLmwuc2NyZWVuJyk7XHJcbmNvbnN0cygnS0VZX0RFRkFVTFRfU0NSRUVOJywgICAgICAgICAgICAnLmwuZGVmYXVsdF9zY3JlZW4nKTtcclxuY29uc3RzKCdLRVlfU0NSRUVOX05BTUVTJywgICAgICAgICAgICAgICcubC5zY3JlZW5fbmFtZXMnKTtcclxuY29uc3RzKCdLRVlfU0NSRUVOX0RFU0tUT1AnLFxyXG4gICAgICAgYCR7Y29uc3RzKCdLRVlfU0NSRUVOJyl9LmRlc2t0b3AuYXR0YWNoZWRgKTtcclxuY29uc3RzKCdLRVlfU0NSRUVOX1RBQkxFVCcsXHJcbiAgYCR7Y29uc3RzKCdLRVlfU0NSRUVOJyl9LnRhYmxldC5hdHRhY2hlZGApO1xyXG5jb25zdHMoJ0tFWV9TQ1JFRU5fVEFCTEVUX1BPUlRSQUlUJyxcclxuICBgJHtjb25zdHMoJ0tFWV9TQ1JFRU4nKX0udGFibGV0X3BvcnRyYWl0LmF0dGFjaGVkYCk7XHJcbmNvbnN0cygnS0VZX1NDUkVFTl9QSE9ORScsXHJcbiAgYCR7Y29uc3RzKCdLRVlfU0NSRUVOJyl9LnBob25lLmF0dGFjaGVkYCk7XHJcbmNvbnN0cygnS0VZX1NDUkVFTl9JT1MnLFxyXG4gIGAke2NvbnN0cygnS0VZX1NDUkVFTicpfS5pb3MuYXR0YWNoZWRgKTtcclxuY29uc3RzKCdLRVlfU0NSRUVOX0lQQUQnLFxyXG4gIGAke2NvbnN0cygnS0VZX1NDUkVFTicpfS5pcGFkLmF0dGFjaGVkYCk7XHJcbmNvbnN0cygnS0VZX1NDUkVFTl9QUklOVCcsXHJcbiAgYCR7Y29uc3RzKCdLRVlfU0NSRUVOJyl9LnByaW50LmF0dGFjaGVkYCk7XHJcblxyXG4vLyBFdmVudHNcclxuY29uc3RzKCdFVlRfT1JJRU5UQVRJT05fQ0hBTkdFJywgICAgICAgICAnLmUub3JpZW50YXRpb25jaGFuZ2UnKTtcclxuY29uc3RzKCdFVlRfSEFTSF9DSEFOR0UnLCAgICAgICAgICAgICAgICAnLmUuaGFzaGNoYW5nZScpO1xyXG5jb25zdHMoJ0VWVF9XSURHRVRfQkVGT1JFTE9BRCcsICAgICAgICAgICcuZS53aWRnZXRfYmVmb3JlbG9hZCcpO1xyXG5jb25zdHMoJ0VWVF9XSURHRVRfTE9BREVEJywgICAgICAgICAgICAgICcuZS53aWRnZXRfbG9hZGVkJyk7XHJcbmNvbnN0cygnRVZUX0JFRk9SRV9VTkxPQUQnLCAgICAgICAgICAgICAgJy5lLmJlZm9yZV91bmxvYWQnKTtcclxuY29uc3RzKCdFVlRfVU5MT0FEJywgICAgICAgICAgICAgICAgICAgICAnLmUudW5sb2FkJyk7XHJcbmNvbnN0cygnRVZUX01PVVNFTU9WRScsICAgICAgICAgICAgICAgICAgJy5lLm1vdXNlbW92ZScpO1xyXG5jb25zdHMoJ0VWVF9TV0lQRV9ESVInLCAgICAgICAgICAgICAgICAgICcuZS5zd2lwZV9kaXInKTtcclxuY29uc3RzKCdFVlRfRkFTVF9DTElDSycsICAgICAgICAgICAgICAgICAnLmUuZmFzdF9jbGljaycpO1xyXG5jb25zdHMoJ0VWVF9DTElDS19JTlNJREVfSUZSQU1FJywgICAgICAgICcuZS5jbGlja19pbnNpZGVfaWZyYW1lJyk7XHJcbmNvbnN0cygnRVZUX1NDUk9MTF9JTlNJREVfSUZSQU1FJywgICAgICAgJy5lLnNjcm9sbF9pbnNpZGVfaWZyYW1lJyk7XHJcbmNvbnN0cygnRVZUX0lOU0lERV9JRlJBTUVfRE9NX0NPTlRFTlRMT0FERUQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdlLmluc2lkZV9pZnJhbWVfZG9tX2NvbnRlbnRsb2FkZWQnKTtcclxuY29uc3RzKCdSSE1BUE5PJywgICAgICAgICAgICAgICAgICAgICAgICAgJ3JobWFwbm8nKTtcclxuY29uc3RzKCdUT1BJQ19GSUxFJywgICAgICAgICAgICAgICAgICAgICAgJ3RvcGljLmh0bScpO1xyXG5jb25zdHMoJ0hPTUVfUEFHRScsICAgICAgICAgICAgICAgICAgICAgICAnaW5kZXguaHRtJyk7XHJcbiIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5cclxucmguY29udHJvbGxlciA9IF8uY2FjaGUoXy5pc0Z1bmN0aW9uKTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7ICQgfSA9IHJoO1xyXG5sZXQgeyBtb2RlbCB9ID0gcmg7XHJcblxyXG5sZXQgbG9hZFdpZGdldHMgPSAocGFyZW50Tm9kZSwgcGFyZW50KSA9PlxyXG4gIF8uZWFjaCgkLmZpbmQocGFyZW50Tm9kZSwgJ1tkYXRhLXJod2lkZ2V0XScpLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICBpZiAoJC5kYXRhc2V0KG5vZGUsICdsb2FkZWQnKSkgeyByZXR1cm47IH0gLy9pdCBjYW4gYmUgZW1wdHkgc3RyaW5nIG9uIG9sZCBicm93c2VyXHJcbiAgICBpZiAoISQuaXNEZXNjZW5kZW50KHBhcmVudE5vZGUsIG5vZGUpKSB7IHJldHVybjsgfSAvL2lnbm9yZSBuZXN0ZWQgd2lkZ2V0IGRhdGFcclxuICAgIGxldCBjb25maWcgPSAkLmRhdGFzZXQobm9kZSwgJ2NvbmZpZycpO1xyXG4gICAgY29uZmlnID0gY29uZmlnID8gXy5yZXNvbHZlTmljZUpTT04oY29uZmlnKSA6IHt9O1xyXG4gICAgcmV0dXJuIF8uZWFjaChfLnJlc29sdmVXaWRnZXRBcmdzKCQuZGF0YXNldChub2RlLCAncmh3aWRnZXQnKSksIGZ1bmN0aW9uKHdJbmZvKSB7XHJcbiAgICAgIGxldCB7d05hbWUsIHdBcmcsIHBpcGVkQXJncywgcmF3QXJnfSA9IHdJbmZvO1xyXG4gICAgICBpZiAod05hbWVbMF0gPT09IHdOYW1lWzBdLnRvTG93ZXJDYXNlKCkpIHsgLy9kYXRhIHdpZGdldFxyXG4gICAgICAgIGNvbmZpZy5yYXdBcmcgPSByYXdBcmc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHBpcGVkQXJncy5sZW5ndGggPiAwKSB7IGNvbmZpZy5waXBlZEFyZ3MgPSBwaXBlZEFyZ3M7IH1cclxuICAgICAgICBpZiAod0FyZykgeyBfLmV4dGVuZChjb25maWcsIHdBcmcpOyB9XHJcbiAgICAgIH1cclxuICAgICAgY29uZmlnLm5vZGUgPSBub2RlO1xyXG4gICAgICBsZXQgd2NsYXNzID0gcmgud2lkZ2V0c1t3TmFtZV07XHJcbiAgICAgIGxldCB3aWRnZXQgPSBuZXcgd2NsYXNzKGNvbmZpZyk7XHJcbiAgICAgIHJldHVybiB3aWRnZXQuaW5pdChwYXJlbnQpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuO1xyXG4gIFxyXG4vL2RhdGEtcmh0YWdzIGlzIHN5bnRoYXRpYyBzdWdlcihzaG9ydGN1dCkgZm9yIGRhdGEtcmh3aWRnZXRzPSdDb250ZW50RmlsdGVyJyBhbmRcclxuLy8gZGF0YS1jb25maWc9J3tcImlkXCI6IFwiMVwifSdcclxubGV0IGxvYWRDb250ZW50RmlsdGVyID0gcGFyZW50Tm9kZSA9PlxyXG4gICgoKSA9PiB7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBmb3IgKGxldCBub2RlIG9mIEFycmF5LmZyb20oJC5maW5kKHBhcmVudE5vZGUsICdbZGF0YS1yaHRhZ3NdJykpKSB7XHJcbiAgICAgIHZhciB3aWRnZXQ7XHJcbiAgICAgIGlmICghJC5pc0Rlc2NlbmRlbnQocGFyZW50Tm9kZSwgbm9kZSkpIHsgY29udGludWU7IH0gLy9pZ25vcmUgbmVzdGVkIHdpZGdldCBkYXRhXHJcbiAgICAgIGxldCBjb25maWcgPSAkLmRhdGFzZXQobm9kZSwgJ2NvbmZpZycpO1xyXG4gICAgICBjb25maWcgPSBjb25maWcgPyBfLnJlc29sdmVOaWNlSlNPTihjb25maWcpIDoge307XHJcbiAgICAgIGNvbmZpZy5pZHMgPSAkLmRhdGFzZXQobm9kZSwgJ3JodGFncycpLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbmZpZy5ub2RlID0gbm9kZTtcclxuICAgICAgcmVzdWx0LnB1c2god2lkZ2V0ID0gbmV3IHJoLndpZGdldHMuQ29udGVudEZpbHRlcihjb25maWcpKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSkoKVxyXG47XHJcblxyXG5sZXQgbG9hZERhdGFIYW5kbGVycyA9IGZ1bmN0aW9uKHBhcmVudE5vZGUsIHBhcmVudCkge1xyXG4gIGxvYWRXaWRnZXRzKHBhcmVudE5vZGUsIHBhcmVudCk7XHJcbiAgcmV0dXJuIGxvYWRDb250ZW50RmlsdGVyKHBhcmVudE5vZGUpO1xyXG59O1xyXG5cclxuXy5sb2FkV2lkZ2V0cyA9IGxvYWRXaWRnZXRzO1xyXG5fLmxvYWRDb250ZW50RmlsdGVyID0gbG9hZENvbnRlbnRGaWx0ZXI7XHJcbl8ubG9hZERhdGFIYW5kbGVycyA9IGxvYWREYXRhSGFuZGxlcnM7XHJcbiIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5cclxucmguX3BhcmFtcyA9IF8udXJsUGFyYW1zKCk7XHJcbnJoLl9kZWJ1Z0ZpbHRlciA9IF8udG9SZWdFeHAocmguX3BhcmFtcy5yaF9kZWJ1Zyk7XHJcbnJoLl9kZWJ1ZyA9IChyaC5fZGVidWdGaWx0ZXIgIT0gbnVsbCk7XHJcblxyXG5yaC5fdGVzdEZpbHRlciA9IF8udG9SZWdFeHAocmguX3BhcmFtcy5yaF90ZXN0KTtcclxucmguX3Rlc3QgPSAocmguX3Rlc3RGaWx0ZXIgIT0gbnVsbCk7XHJcblxyXG5yaC5fZXJyb3JGaWx0ZXIgPSBfLnRvUmVnRXhwKHJoLl9wYXJhbXMucmhfZXJyb3IpO1xyXG5yaC5fZXJyb3IgPSAocmguX2Vycm9yRmlsdGVyICE9IG51bGwpO1xyXG5cclxucmguX2JyZWFrRmlsdGVyID0gXy50b1JlZ0V4cChyaC5fcGFyYW1zLnJoX2JyZWFrKTtcclxucmguX2JyZWFrID0gKHJoLl9icmVha0ZpbHRlciAhPSBudWxsKTtcclxuXHJcbmxldCBtYXRjaEZpbHRlciA9IChtZXNzYWdlcywgZmlsdGVyKSA9PiBtZXNzYWdlcy5qb2luKCcgJykubWF0Y2goZmlsdGVyKTtcclxuXHJcbnJoLl9kID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IHsgY29uc29sZSB9ID0gd2luZG93O1xyXG4gIGlmIChyaC5fZGVidWcgJiYgY29uc29sZSAmJiBfLmlzRnVuY3Rpb24oY29uc29sZS5sb2cpKSB7XHJcbiAgICBsZXQgZm47XHJcbiAgICBsZXQgYXJncyA9IFtdOyBsZXQgaSA9IC0xO1xyXG4gICAgd2hpbGUgKCsraSA8IGFyZ3VtZW50cy5sZW5ndGgpIHsgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7IH1cclxuICAgIGlmIChbJ2luZm8nLCAnbG9nJywgJ3dhcm4nLCAnZGVidWcnLCAnZXJyb3InXS5pbmRleE9mKGFyZ3NbMF0pID4gLTEpIHtcclxuICAgICAgZm4gPSBjb25zb2xlW2FyZ3NbMF1dO1xyXG4gICAgICBhcmdzID0gYXJncy5zbGljZSgxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZuID0gY29uc29sZS5kZWJ1ZztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbmV3QXJncyA9IFtgWyAke2FyZ3NbMF19IF06YF0uY29uY2F0KGFyZ3Muc2xpY2UoMSkpO1xyXG4gICAgaWYgKChyaC5fZGVidWdGaWx0ZXIgPT09ICcnKSB8fCBtYXRjaEZpbHRlcihuZXdBcmdzLCByaC5fZGVidWdGaWx0ZXIpKSB7XHJcbiAgICAgIGlmIChyaC5fYnJlYWsgJiYgbWF0Y2hGaWx0ZXIobmV3QXJncywgcmguX2JyZWFrRmlsdGVyKSkge1xyXG4gICAgICAgIHJldHVybiBGdW5jdGlvbignJywgJ2RlYnVnZ2VyJykoKTtcclxuICAgICAgfSBlbHNlIGlmIChyaC5fZXJyb3IgJiYgbWF0Y2hGaWx0ZXIobmV3QXJncywgcmguX2Vycm9yRmlsdGVyKSkge1xyXG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIG5ld0FyZ3MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb25zb2xlLCBuZXdBcmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxuXHJcbmNsYXNzIEd1YXJkIHtcclxuICBcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZ3VhcmQgPSB0aGlzLmd1YXJkLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBndWFyZChmbiwgZ3VhcmROYW1lKSB7XHJcbiAgICBpZiAodGhpcy5ndWFyZGVkTmFtZXMgPT0gbnVsbCkgeyB0aGlzLmd1YXJkZWROYW1lcyA9IFtdOyB9XHJcbiAgICBpZiAodGhpcy5ndWFyZGVkTmFtZXMuaW5kZXhPZihndWFyZE5hbWUpID09PSAtMSkge1xyXG4gICAgICB0aGlzLmd1YXJkZWROYW1lcy5wdXNoKGd1YXJkTmFtZSk7XHJcbiAgICAgIGZuLmNhbGwodGhpcyk7XHJcbiAgICAgIHJldHVybiB0aGlzLmd1YXJkZWROYW1lcy5zcGxpY2UodGhpcy5ndWFyZGVkTmFtZXMuaW5kZXhPZihndWFyZE5hbWUpLCAxKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnJoLkd1YXJkID0gR3VhcmQ7XHJcbnJoLmd1YXJkID0gKG5ldyBHdWFyZCgpKS5ndWFyZDtcclxuICAiLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBfIH0gPSByaDtcclxubGV0IHsgJCB9ID0gcmg7XHJcblxyXG5sZXQgZGVmYXVsdE9wdHMgPVxyXG4gIHthc3luYzogdHJ1ZX07XHJcblxyXG5sZXQgZm9ybURhdGEgPSAocmguZm9ybURhdGEgPSBmdW5jdGlvbihvcHRzKSB7XHJcbiAgbGV0IGZvcm1fZGF0YSA9IG5ldyB3aW5kb3cuRm9ybURhdGE7XHJcbiAgXy5lYWNoKG9wdHMsICh2YWx1ZSwga2V5KSA9PiBmb3JtX2RhdGEuYXBwZW5kKGtleSwgdmFsdWUpKTtcclxuICByZXR1cm4gZm9ybV9kYXRhO1xyXG59KTtcclxuXHJcbi8vcHJpdmF0ZSBjbGFzcyBvZiBodHRwIGFwaVxyXG5jbGFzcyBSZXNwb25zZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHhociwgb3B0cykge1xyXG4gICAgdGhpcy5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy54aHIgPSB4aHI7XHJcbiAgICB0aGlzLm9wdHMgPSBvcHRzO1xyXG4gICAgaWYgKHRoaXMub3B0cy5zdWNjZXNzICE9IG51bGwpIHsgdGhpcy5zdWNjZXNzKHRoaXMub3B0cy5zdWNjZXNzKTsgfVxyXG4gICAgaWYgKHRoaXMub3B0cy5lcnJvciAhPSBudWxsKSB7IHRoaXMuZXJyb3IodGhpcy5vcHRzLmVycm9yKTsgfVxyXG4gICAgdGhpcy54aHIub25yZWFkeXN0YXRlY2hhbmdlID0gdGhpcy5vbnJlYWR5c3RhdGVjaGFuZ2U7XHJcbiAgfVxyXG4gICAgXHJcbiAgb25yZWFkeXN0YXRlY2hhbmdlKCkge1xyXG4gICAgaWYgKHRoaXMueGhyLnJlYWR5U3RhdGUgIT09IDQpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgbGV0IHRleHQgPSB0aGlzLnhoci5yZXNwb25zZVRleHQ7XHJcbiAgICBsZXQgeyBzdGF0dXMgfSA9IHRoaXMueGhyO1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuYW1lID0+IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKG5hbWUpO1xyXG4gICAgXHJcbiAgICBpZiAodGhpcy5pc1N1Y2Nlc3Moc3RhdHVzKSkge1xyXG4gICAgICBpZiAodGhpcy5zdWNjZXNzRm4pIHsgdGhpcy5zdWNjZXNzRm4odGV4dCwgc3RhdHVzLCBoZWFkZXJzLCB0aGlzLm9wdHMpOyB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5lcnJvckZuKSB7IHRoaXMuZXJyb3JGbih0ZXh0LCBzdGF0dXMsIGhlYWRlcnMsIHRoaXMub3B0cyk7IH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5maW5hbGx5Rm4pIHsgcmV0dXJuIHRoaXMuZmluYWxseUZuKHRleHQsIHN0YXR1cywgaGVhZGVycywgdGhpcy5vcHRzKTsgfVxyXG4gIH1cclxuXHJcbiAgaXNTdWNjZXNzKHN0YXR1cykgeyByZXR1cm4gKChzdGF0dXMgPj0gMjAwKSAmJiAoc3RhdHVzIDwgMzAwKSkgfHwgKHN0YXR1cyA9PT0gMzA0KTsgfVxyXG5cclxuICBzdWNjZXNzKGZuKSB7XHJcbiAgICB0aGlzLnN1Y2Nlc3NGbiA9IGZuO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBlcnJvcihmbikge1xyXG4gICAgdGhpcy5lcnJvckZuID0gZm47XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGZpbmFsbHkoZm4pIHtcclxuICAgIHRoaXMuZmluYWxseUZuID0gZm47XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuICBcclxubGV0IGNyZWF0ZVJlcXVlc3QgPSBmdW5jdGlvbihvcHRzKSB7XHJcbiAgbGV0IFhIUiA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCB8fCB3aW5kb3cuQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcclxuICBsZXQgeGhyID0gbmV3IFhIUjtcclxuICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoeGhyLCBvcHRzKTtcclxuICByZXR1cm4ge3hociwgcmVzcG9uc2V9O1xyXG59O1xyXG5cclxuLy8gaHR0cCBhcGlzXHJcbmxldCBodHRwID0gKHJoLmh0dHAgPSBmdW5jdGlvbihvcHRzKSB7XHJcbiAgb3B0cyA9IF8uZXh0ZW5kKHt9LCBkZWZhdWx0T3B0cywgb3B0cyk7XHJcbiAgbGV0IHt4aHIsIHJlc3BvbnNlfSA9IGNyZWF0ZVJlcXVlc3Qob3B0cyk7XHJcbiAgeGhyLm9wZW4ob3B0cy5tZXRob2QsIG9wdHMudXJsLCBvcHRzLmFzeW5jKTtcclxuICBcclxuICBpZiAob3B0c1snQ29udGVudC10eXBlJ10pIHtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCBvcHRzWydDb250ZW50LXR5cGUnXSk7XHJcbiAgfVxyXG5cclxuICB4aHIuc2VuZChvcHRzLmRhdGEpO1xyXG4gIHJldHVybiByZXNwb25zZTtcclxufSk7XHJcblxyXG5odHRwLmdldCA9ICh1cmwsIG9wdHMpID0+IGh0dHAoXy5leHRlbmQoe3VybCwgbWV0aG9kOiAnR0VUJ30sIG9wdHMpKTtcclxuXHJcbmh0dHAucG9zdCA9ICh1cmwsIGRhdGEsIG9wdHMpID0+IGh0dHAoXy5leHRlbmQoe3VybCwgbWV0aG9kOiAnUE9TVCcsIGRhdGF9LCBvcHRzKSk7XHJcblxyXG5odHRwLnB1dCA9ICh1cmwsIGRhdGEsIG9wdHMpID0+IGh0dHAoXy5leHRlbmQoe3VybCwgbWV0aG9kOiAnUFVUJywgZGF0YX0sIG9wdHMpKTtcclxuXHJcbmh0dHAuanNvbnAgPSBmdW5jdGlvbih1cmwsIG9wdHMpIHtcclxuICBvcHRzID0gXy5leHRlbmQoe30sIGRlZmF1bHRPcHRzLCBvcHRzKTtcclxuICBsZXQgbm9kZSA9ICQoJ3NjcmlwdCcsIDApIHx8IGRvY3VtZW50LmhlYWQuY2hpbGRyZW5bMF07XHJcbiAgbGV0IG5ld05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICBuZXdOb2RlLmFzeW5jID0gb3B0cy5hc3luYztcclxuICBuZXdOb2RlLnNyYyA9IHVybDtcclxuICByZXR1cm4gbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlKTtcclxufTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7ICQgfSA9IHJoO1xyXG5sZXQgeyBjb25zdHMgfSA9IHJoO1xyXG5cclxuY2xhc3MgSWZyYW1lIGV4dGVuZHMgcmguR3VhcmQge1xyXG5cclxuICB0b1N0cmluZygpIHsgcmV0dXJuICdJZnJhbWUnOyB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUgPSB0aGlzLnVuc3Vic2NyaWJlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxpbmtlZFN1YnMgPSB7fTtcclxuICAgIGlmIChfLmlzSWZyYW1lKCkpIHtcclxuICAgICAgcmgubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnRVZUX0JFRk9SRV9VTkxPQUQnKSwgdGhpcy51bnN1YnNjcmliZSk7XHJcbiAgICAgIHJoLm1vZGVsLnN1YnNjcmliZShjb25zdHMoJ0VWVF9VTkxPQUQnKSwgdGhpcy51bnN1YnNjcmliZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1bnN1YnNjcmliZSgpIHtcclxuICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICBsZXQgbXNnID0ge2lkOiB0aGlzLmlkfTtcclxuICAgICAgdGhpcy5wYXJlbnQucG9zdE1lc3NhZ2Uoe3JobW9kZWxfdW5zdWJzY3JpYmU6IG1zZ30sICcqJyk7XHJcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5pZCA9PSBudWxsKSB7IHRoaXMuaWQgPSBfLnVuaXF1ZUlkKCk7IH1cclxuICAgIHRoaXMucGFyZW50ID0gd2luZG93LnBhcmVudDtcclxuICAgIGlmIChfLmlzSWZyYW1lKCkpIHtcclxuICAgICAgbGV0IGlucHV0ID0gcmgubW9kZWwuZ2V0KCdfc2hhcmVka2V5cy5pbnB1dCcpO1xyXG4gICAgICBpZiAoaW5wdXQpIHtcclxuICAgICAgICBsZXQgaW5wdXRLZXlzID0gXy5tYXAoaW5wdXQsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGl0ZW0pKSB7IHJldHVybiB7a2V5OiBpdGVtfTsgfSBlbHNlIHsgcmV0dXJuIGl0ZW07IH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbXNnID0ge2lucHV0OiBpbnB1dEtleXMsIGlkOiB0aGlzLmlkfTtcclxuICAgICAgICB0aGlzLnBhcmVudC5wb3N0TWVzc2FnZSh7cmhtb2RlbF9zdWJzY3JpYmU6IG1zZ30sICcqJyk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IG91dHB1dEtleXMgPSByaC5tb2RlbC5nZXQoJ19zaGFyZWRrZXlzLm91dHB1dCcpO1xyXG4gICAgICBpZiAob3V0cHV0S2V5cykgeyByZXR1cm4gdGhpcy5saW5rTW9kZWwodGhpcy5wYXJlbnQsIHRoaXMuaWQsIG91dHB1dEtleXMpOyB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGVhbihpZCkge1xyXG4gICAgbGV0IHN1YnMgPSB0aGlzLmxpbmtlZFN1YnNbaWRdO1xyXG4gICAgaWYgKHN1YnMpIHtcclxuICAgICAgZm9yIChsZXQgdW5zdWIgb2YgQXJyYXkuZnJvbShzdWJzKSkgeyB1bnN1YigpOyB9XHJcbiAgICAgIHJldHVybiBkZWxldGUgdGhpcy5saW5rZWRTdWJzW2lkXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxpbmtNb2RlbChzb3VyY2UsIGlkLCBrZXlzKSB7XHJcbiAgICBpZiAoa2V5cyA9PSBudWxsKSB7IGtleXMgPSBbXTsgfVxyXG4gICAgbGV0IHN1YnMgPSBbXTtcclxuICAgIGxldCBjYWxsYmFjayA9ICh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmd1YXJkKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBtc2cgPSB7fTsgbXNnW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm4gc291cmNlLnBvc3RNZXNzYWdlKHtyaG1vZGVsX3B1Ymxpc2g6IG1zZ30sICcqJyk7XHJcbiAgICAgIH1cclxuICAgICAgLCBpZCk7XHJcbiAgICB9O1xyXG4gICAgZm9yIChsZXQga2V5IG9mIEFycmF5LmZyb20oa2V5cykpIHtcclxuICAgICAga2V5ID0ga2V5LnRyaW0oKTtcclxuICAgICAgc3Vicy5wdXNoKHJoLm1vZGVsLnN1YnNjcmliZShrZXksIGNhbGxiYWNrKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNsZWFuKGlkKTtcclxuICAgIHJldHVybiB0aGlzLmxpbmtlZFN1YnNbaWRdID0gc3VicztcclxuICB9XHJcblxyXG4gIHB1Ymxpc2goa2V5LCB2YWx1ZSwgb3B0cykge1xyXG4gICAgaWYgKG9wdHMgPT0gbnVsbCkgeyBvcHRzID0ge307IH1cclxuICAgIHJldHVybiB0aGlzLmd1YXJkKCgpID0+IHJoLm1vZGVsLnB1Ymxpc2goa2V5LCB2YWx1ZSwgb3B0cykpO1xyXG4gIH1cclxuXHJcbiAgZ3VhcmQoZm4sIGd1YXJkTmFtZSkge1xyXG4gICAgaWYgKGd1YXJkTmFtZSA9PSBudWxsKSB7IGd1YXJkTmFtZSA9IHRoaXMuaWQ7IH1cclxuICAgIHJldHVybiBzdXBlci5ndWFyZChmbiwgZ3VhcmROYW1lKTtcclxuICB9XHJcbn1cclxuXHJcbnJoLmlmcmFtZSA9IG5ldyBJZnJhbWUoKTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7ICQgfSA9IHJoO1xyXG5sZXQgeyBjb25zdHMgfSA9IHJoO1xyXG5cclxuXHJcbmxldCBoZWFkID0gJCgnaGVhZCcsIDApO1xyXG5sZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG5zdHlsZS5pbm5lckhUTUwgPSAnLnJoLWhpZGU6bm90KC5yaC1hbmltYXRlKXtkaXNwbGF5Om5vbmUgIWltcG9ydGFudDt9JztcclxuaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuY2hpbGROb2Rlc1swXSk7XHJcblxyXG5fLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICdET01Db250ZW50TG9hZGVkJywgXy5vbmUoZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHJoLl9kZWJ1ZykgeyBpZiAocmguY29uc29sZSA9PSBudWxsKSB7IHJoLmNvbnNvbGUgPSBuZXcgcmguQ29uc29sZSgpOyB9IH1cclxuXHJcbiAgcmgubW9kZWwucHVibGlzaChjb25zdHMoJ0VWVF9XSURHRVRfQkVGT1JFTE9BRCcpLCB0cnVlLCB7c3luYzogdHJ1ZX0pO1xyXG4gIFxyXG4gIF8ubG9hZFdpZGdldHMoZG9jdW1lbnQpO1xyXG4gIFxyXG4gIF8ubG9hZENvbnRlbnRGaWx0ZXIoZG9jdW1lbnQpO1xyXG5cclxuICByZXR1cm4gcmgubW9kZWwucHVibGlzaChjb25zdHMoJ0VWVF9XSURHRVRfTE9BREVEJyksIHRydWUsIHtzeW5jOiB0cnVlfSk7XHJcbn0pXHJcbik7XHJcblxyXG5pZiAoXy5pc0lmcmFtZSgpKSB7XHJcbiAgXy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ2JlZm9yZXVubG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgcmgubW9kZWwucHVibGlzaChjb25zdHMoJ0VWVF9CRUZPUkVfVU5MT0FEJyksIHRydWUsIHtzeW5jOiB0cnVlfSk7XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH0pO1xyXG5cclxuICBfLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAndW5sb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIHJoLm1vZGVsLnB1Ymxpc2goY29uc3RzKCdFVlRfVU5MT0FEJyksIHRydWUsIHtzeW5jOiB0cnVlfSk7XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH0pO1xyXG59XHJcbiIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5cclxuXy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgbGV0IGNvbmZpZywga2V5O1xyXG4gIGlmICghXy5pc1NhbWVPcmlnaW4oZS5vcmlnaW4pKSB7IHJldHVybjsgfVxyXG5cclxuICBsZXQgeyBkYXRhIH0gPSBlO1xyXG4gIGlmICghXy5pc09iamVjdChkYXRhKSkgeyByZXR1cm47IH1cclxuXHJcbiAgaWYgKGRhdGEucmhtb2RlbF9wdWJsaXNoKSB7XHJcbiAgICBjb25maWcgPSBkYXRhLnJobW9kZWxfcHVibGlzaDtcclxuICAgIGlmIChjb25maWcpIHsgZm9yIChrZXkgaW4gY29uZmlnKSB7IGxldCB2YWx1ZSA9IGNvbmZpZ1trZXldOyByaC5pZnJhbWUucHVibGlzaChrZXksIHZhbHVlLCB7c3luYzogdHJ1ZX0pOyB9IH1cclxuICB9XHJcbiAgXHJcbiAgaWYgKGRhdGEucmhtb2RlbF9zdWJzY3JpYmUpIHtcclxuICAgIGNvbmZpZyA9IGRhdGEucmhtb2RlbF9zdWJzY3JpYmU7XHJcbiAgICBsZXQgaW5wdXQgPSBjb25maWcuaW5wdXQgfHwgW107XHJcbiAgICBsZXQgdG9wQ29udGFpbmVyID0gIXJoLm1vZGVsLmdldCgnX3NoYXJlZGtleXMuaW5wdXQnKTtcclxuICAgIGxldCBrZXlzID0gXy5yZWR1Y2UoaW5wdXQsIGZ1bmN0aW9uKHJlc3VsdCwgaXRlbSkge1xyXG4gICAgICBpZiAodG9wQ29udGFpbmVyIHx8IChpdGVtLm5lc3RlZCAhPT0gZmFsc2UpKSB7IHJlc3VsdC5wdXNoKGl0ZW0ua2V5KTsgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgLCBbXSk7XHJcbiAgICBpZiAoa2V5cyAhPSBudWxsID8ga2V5cy5sZW5ndGggOiB1bmRlZmluZWQpIHsgcmguaWZyYW1lLmxpbmtNb2RlbChlLnNvdXJjZSwgY29uZmlnLmlkLCBrZXlzKTsgfVxyXG4gIH1cclxuICBcclxuICBpZiAoZGF0YS5yaG1vZGVsX3Vuc3Vic2NyaWJlKSB7XHJcbiAgICBjb25maWcgPSBkYXRhLnJobW9kZWxfdW5zdWJzY3JpYmU7XHJcbiAgICByZXR1cm4gcmguaWZyYW1lLmNsZWFuKGNvbmZpZy5pZCk7XHJcbiAgfVxyXG59KTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7IGNvbnN0cyB9ID0gcmg7XHJcblxyXG4vLyBDaGlsZE5vZGUgcHJpdmF0ZSBjbGFzcyBmb3IgTW9kZWxcclxuY2xhc3MgQ2hpbGROb2RlIHtcclxuXHJcbiAgY29uc3RydWN0b3Ioc3Vic2NyaWJlcnMsIGNoaWxkcmVuKSB7XHJcbiAgICBpZiAoc3Vic2NyaWJlcnMgPT0gbnVsbCkgeyBzdWJzY3JpYmVycyA9IFtdOyB9XHJcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gc3Vic2NyaWJlcnM7XHJcbiAgICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkgeyBjaGlsZHJlbiA9IHt9OyB9XHJcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBhZGQga2V5Liogc3VwcG9ydCBpbiBnZXRcclxuICBnZXRTdWJzY3JpYmVycyhrZXlzLCBwYXRoLCB2YWx1ZSwgc3Vicykge1xyXG4gICAgaWYgKGtleXMubGVuZ3RoID4gMSkge1xyXG4gICAgICBsZXQgY2hpbGQ7XHJcbiAgICAgIHN1YnMucHVzaCh7Zm5zSW5mbzogdGhpcy5zdWJzY3JpYmVycywga2V5OiBwYXRoLCB2YWx1ZX0pO1xyXG4gICAgICBsZXQgY2hpbGRLZXkgPSBrZXlzWzFdO1xyXG4gICAgICBpZiAoY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2NoaWxkS2V5XSkge1xyXG4gICAgICAgIGxldCBuZXdQYXRoID0gYCR7cGF0aH0uJHtjaGlsZEtleX1gO1xyXG4gICAgICAgIGNoaWxkLmdldFN1YnNjcmliZXJzKGtleXMuc2xpY2UoMSksIG5ld1BhdGgsIHZhbHVlICE9IG51bGwgPyB2YWx1ZVtjaGlsZEtleV0gOiB1bmRlZmluZWQsIHN1YnMpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGtleXMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLl9nZXRBbGxDaGlsZFN1YnNjcmliZXJzKHBhdGgsIHZhbHVlLCBzdWJzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdWJzO1xyXG4gIH1cclxuXHJcbiAgYWRkU3Vic2NyaWJlcnMoZm4sIGtleXMsIG9wdHMpIHtcclxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVycy5wdXNoKFtmbiwgb3B0c10pO1xyXG4gICAgfSBlbHNlIGlmIChrZXlzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgbGV0IGNoaWxkS2V5ID0ga2V5c1sxXTtcclxuICAgICAgaWYgKHRoaXMuY2hpbGRyZW5bY2hpbGRLZXldID09IG51bGwpIHsgdGhpcy5jaGlsZHJlbltjaGlsZEtleV0gPSBuZXcgQ2hpbGROb2RlKCk7IH1cclxuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bY2hpbGRLZXldLmFkZFN1YnNjcmliZXJzKGZuLCBrZXlzLnNsaWNlKDEpLCBvcHRzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZVN1YnNjcmliZXIoZm4sIGtleXMpIHtcclxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fZGVsZXRlU3Vic2NyaWJlcihmbik7XHJcbiAgICB9IGVsc2UgaWYgKGtleXMubGVuZ3RoID4gMSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltrZXlzWzFdXS5yZW1vdmVTdWJzY3JpYmVyKGZuLCBrZXlzLnNsaWNlKDEpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9kZWxldGVTdWJzY3JpYmVyKGZuKSB7XHJcbiAgICBsZXQgaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLnN1YnNjcmliZXJzLCBpdGVtID0+IGl0ZW1bMF0gPT09IGZuKTtcclxuICAgIGlmICgoaW5kZXggIT0gbnVsbCkgJiYgKGluZGV4ICE9PSAtMSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH0gZWxzZSBpZiAocmguX2RlYnVnKSB7XHJcbiAgICAgIHJldHVybiByaC5fZCgnZXJyb3InLCAnX3Vuc3Vic2NyaWJlJyxcclxuICAgICAgICBgJHt0aGlzfS57a2V5fSBpcyBub3Qgc3Vic2NyaWJlZCB3aXRoICR7Zm59YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfZ2V0QWxsQ2hpbGRTdWJzY3JpYmVycyhwYXRoLCB2YWx1ZSwgc3Vicykge1xyXG4gICAgc3Vicy5wdXNoKHtmbnNJbmZvOiB0aGlzLnN1YnNjcmliZXJzLCBrZXk6IHBhdGgsIHZhbHVlfSk7XHJcbiAgICBpZiAodGhpcy5jaGlsZHJlbikge1xyXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkgeyB2YWx1ZSA9IHt9OyB9XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltrZXldO1xyXG4gICAgICAgIGNoaWxkLl9nZXRBbGxDaGlsZFN1YnNjcmliZXJzKGAke3BhdGh9LiR7a2V5fWAsIHZhbHVlW2tleV0sIHN1YnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VicztcclxuICB9XHJcbn1cclxuXHJcbi8vUm9vdE5vZGUgcHJpdmUgY2xhc3MgZm9yIE1vZGVsXHJcbmNsYXNzIFJvb3ROb2RlIGV4dGVuZHMgQ2hpbGROb2RlIHtcclxuXHJcbiAgY29uc3RydWN0b3Ioc3Vic2NyaWJlcnMsIGNoaWxkcmVuLCBkYXRhKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gc3Vic2NyaWJlcnM7XHJcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7IGRhdGEgPSB7fTsgfVxyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHN1cGVyKHRoaXMuc3Vic2NyaWJlcnMsIHRoaXMuY2hpbGRzKTtcclxuICB9XHJcblxyXG4gIGdldFN1YnNjcmliZXJzKGtleXMpIHtcclxuICAgIGxldCBjaGlsZEtleSA9IGtleXNbMF07XHJcbiAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2NoaWxkS2V5XTtcclxuICAgIGlmIChjaGlsZCkge1xyXG4gICAgICByZXR1cm4gY2hpbGQuZ2V0U3Vic2NyaWJlcnMoa2V5cywgYCR7a2V5c1swXX1gLCB0aGlzLmRhdGFba2V5c1swXV0sIFtdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZFN1YnNjcmliZXJzKGZuLCBrZXlzLCBvcHRzKSB7XHJcbiAgICBsZXQgY2hpbGRLZXkgPSBrZXlzWzBdO1xyXG4gICAgaWYgKHRoaXMuY2hpbGRyZW5bY2hpbGRLZXldID09IG51bGwpIHsgdGhpcy5jaGlsZHJlbltjaGlsZEtleV0gPSBuZXcgQ2hpbGROb2RlKCk7IH1cclxuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2NoaWxkS2V5XS5hZGRTdWJzY3JpYmVycyhmbiwga2V5cywgb3B0cyk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVTdWJzY3JpYmVyKGZuLCBrZXlzKSB7XHJcbiAgICBsZXQgY2hpbGRLZXkgPSBrZXlzWzBdO1xyXG4gICAgcmV0dXJuICh0aGlzLmNoaWxkcmVuW2NoaWxkS2V5XSAhPSBudWxsID8gdGhpcy5jaGlsZHJlbltjaGlsZEtleV0ucmVtb3ZlU3Vic2NyaWJlcihmbiwga2V5cykgOiB1bmRlZmluZWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGF0YShrZXlzKSB7XHJcbiAgICBsZXQgdmFsdWU7XHJcbiAgICBsZXQgeyBkYXRhIH0gPSB0aGlzO1xyXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgIGxldCBrZXkgPSBrZXlzW2luZGV4XTtcclxuICAgICAgaWYgKF8uaXNEZWZpbmVkKGRhdGEpKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAoa2V5cy5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgdmFsdWUgPSBkYXRhW2tleV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGEgPSBkYXRhW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKGtleXMsIHZhbHVlKSB7IC8vYS5iIGEuKlxyXG4gICAgbGV0IHsgZGF0YSB9ID0gdGhpcztcclxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBrZXlzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICBsZXQga2V5ID0ga2V5c1tpbmRleF07XHJcbiAgICAgIGlmIChpbmRleCA9PT0gKGtleXMubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICBkYXRhW2tleV0gPSB2YWx1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIV8uaXNEZWZpbmVkKGRhdGFba2V5XSkpIHsgZGF0YVtrZXldID0ge307IH1cclxuICAgICAgICBkYXRhID0gZGF0YVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBNb2RlbCBjbGFzcyB0byByZWFkIHdyaXRlIGxvY2FsIGRhdGEgdXNpbmcgcHVibGlzaCBzdWJzY3JpYmUgcGF0dGVyblxyXG52YXIgTW9kZWwgPSAoZnVuY3Rpb24oKSB7XHJcbiAgbGV0IF9jb3VudCA9IHVuZGVmaW5lZDtcclxuICBNb2RlbCA9IGNsYXNzIE1vZGVsIHtcclxuICAgIHN0YXRpYyBpbml0Q2xhc3MoKSB7XHJcblxyXG4gICAgICAvLyBwcml2YXRlIHN0YXRpYyB2YXJpYWJsZVxyXG4gICAgICBfY291bnQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gYE1vZGVsXyR7dGhpcy5fY291bnR9YDsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICB0aGlzLl9yb290Tm9kZSA9IG5ldyBSb290Tm9kZSgpO1xyXG5cclxuICAgICAgdGhpcy5fY291bnQgPSBfY291bnQ7XHJcbiAgICAgIF9jb3VudCArPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChrZXkpIHtcclxuICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICBpZiAodGhpcy5faXNGb3JHbG9iYWwoa2V5KSkgeyByZXR1cm4gcmgubW9kZWwuZ2V0KGtleSk7IH1cclxuXHJcbiAgICAgIGlmIChfLmlzU3RyaW5nKGtleSkpIHtcclxuICAgICAgICB2YWx1ZSA9IHRoaXMuX3Jvb3ROb2RlLmdldERhdGEodGhpcy5fZ2V0S2V5cyhrZXkpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByaC5fZCgnZXJyb3InLCAnR2V0JywgYCR7dGhpc30uJHtrZXl9IGlzIG5vdCBhIHN0cmluZ2ApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmguX2RlYnVnKSB7XHJcbiAgICAgICAgcmguX2QoJ2xvZycsICdHZXQnLCBgJHt0aGlzfS4ke2tleX06ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2dldChrZXkpIHsgcmV0dXJuIHRoaXMuZ2V0KGNvbnN0cyhrZXkpKTsgfVxyXG5cclxuICAgIC8vIFRPRE86IGFkZCBvcHRpb25zIHRvIGRldGVjdCBjaGFuZ2UgdGhlbiBvbmx5IHRyaWdnZXIgdGhlIGV2ZW50XHJcbiAgICBwdWJsaXNoKGtleSwgdmFsdWUsIG9wdHMpIHtcclxuICAgICAgaWYgKG9wdHMgPT0gbnVsbCkgeyBvcHRzID0ge307IH1cclxuICAgICAgaWYgKHRoaXMuX2lzRm9yR2xvYmFsKGtleSkpIHsgcmV0dXJuIHJoLm1vZGVsLnB1Ymxpc2goa2V5LCB2YWx1ZSwgb3B0cyk7IH1cclxuICAgICAgaWYgKHJoLl9kZWJ1Zykge1xyXG4gICAgICAgIHJoLl9kKCdsb2cnLCAnUHVibGlzaCcsIGAke3RoaXN9LiR7a2V5fTogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKF8uaXNTdHJpbmcoa2V5KSkge1xyXG4gICAgICAgIHRoaXMuX3Jvb3ROb2RlLnNldERhdGEodGhpcy5fZ2V0S2V5cyhrZXkpLCB2YWx1ZSk7XHJcbiAgICAgICAgbGV0IHN1YnMgPSB0aGlzLl9yb290Tm9kZS5nZXRTdWJzY3JpYmVycyh0aGlzLl9nZXRLZXlzKGtleSkpO1xyXG4gICAgICAgIGxldCBrZXlMZW5ndGggPSBrZXlbMF0gPT09ICcuJyA/IGtleS5sZW5ndGggLSAxIDoga2V5Lmxlbmd0aDtcclxuICAgICAgICBsZXQgZmlsdGVyZWRTdWJzID0gXy5tYXAoc3VicywgZnVuY3Rpb24oc3ViKSB7XHJcbiAgICAgICAgICBsZXQgZm5zSW5mbyA9IF8uZmlsdGVyKHN1Yi5mbnNJbmZvLCBmbkluZm8gPT4gXy5pc0RlZmluZWQoZm5JbmZvWzBdKSAmJlxyXG4gICAgICAgICAgICAoKGZuSW5mb1sxXS5wYXJ0aWFsICE9PSBmYWxzZSkgfHwgKHN1Yi5rZXkubGVuZ3RoID49IGtleUxlbmd0aCkpXHJcbiAgICAgICAgICAgKTtcclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGtleTogc3ViLmtleSxcclxuICAgICAgICAgICAgdmFsdWU6IHN1Yi52YWx1ZSxcclxuICAgICAgICAgICAgZm5zOiBfLm1hcChmbnNJbmZvLCBmbkluZm8gPT4gZm5JbmZvWzBdKVxyXG4gICAgICAgICAgfTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAgIF8uZWFjaChmaWx0ZXJlZFN1YnMsIHN1YiA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gXy5lYWNoKHN1Yi5mbnMsIGZuID0+IHtcclxuICAgICAgICAgICAgaWYgKHJoLl9kZWJ1Zykge1xyXG4gICAgICAgICAgICAgIHJoLl9kKCdsb2cnLCAnUHVibGlzaCBjYWxsJyxcclxuICAgICAgICAgICAgICAgIGAke3RoaXN9LiR7c3ViLmtleX06ICR7SlNPTi5zdHJpbmdpZnkoc3ViLnZhbHVlKX1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdW5zdWIgPSAoKSA9PiB0aGlzLl91bnN1YnNjcmliZShzdWIua2V5LCBmbik7XHJcbiAgICAgICAgICAgIGlmIChvcHRzLnN5bmMpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZm4oc3ViLnZhbHVlLCBzdWIua2V5LCB1bnN1Yik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJoLl8uZGVmZXIoZm4sIHN1Yi52YWx1ZSwgc3ViLmtleSwgdW5zdWIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByaC5fZCgnZXJyb3InLCAnUHVibGlzaCcsIGAke3RoaXN9LiR7a2V5fSBpcyBub3QgYSBzdHJpbmdgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNwdWJsaXNoKGtleSwgdmFsdWUsIG9wdHMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHVibGlzaChjb25zdHMoa2V5KSwgdmFsdWUsIG9wdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzU3Vic2NyaWJlZChrZXkpIHtcclxuICAgICAgbGV0IGZvdW5kO1xyXG4gICAgICBpZiAodGhpcy5faXNGb3JHbG9iYWwoa2V5KSkgeyByZXR1cm4gcmgubW9kZWwuaXNTdWJzY3JpYmVkKGtleSk7IH1cclxuICAgICAgaWYgKGtleVswXSA9PT0gJy4nKSB7IGtleSA9IGtleS5zdWJzdHJpbmcoMSk7IH1cclxuICAgICAgbGV0IHN1YnMgPSB0aGlzLl9yb290Tm9kZS5nZXRTdWJzY3JpYmVycyh0aGlzLl9nZXRLZXlzKGtleSkpO1xyXG4gICAgICBmb3IgKGxldCBzdWIgb2YgQXJyYXkuZnJvbShzdWJzKSkgeyBpZiAoc3ViLmtleSA9PT0ga2V5KSB7IGZvdW5kID0gdHJ1ZTsgfSB9XHJcbiAgICAgIHJldHVybiBmb3VuZCA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjaXNTdWJzY3JpYmVkKGtleSkgeyByZXR1cm4gdGhpcy5pc1N1YnNjcmliZWQoY29uc3RzKGtleSkpOyB9XHJcblxyXG4gICAgc3Vic2NyaWJlT25jZShrZXksIGZuLCBvcHRzKSB7XHJcbiAgICAgIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IHt9OyB9XHJcbiAgICAgIGxldCBrZXlzID0gXy5pc1N0cmluZyhrZXkpID8gW2tleV0gOiBrZXk7XHJcbiAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUoa2V5cy5zcGxpY2UoMCwgMSlbMF0sICh2YWx1ZSwga2V5LCB1bnN1YikgPT4ge1xyXG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgZm4odmFsdWUsIGtleSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlT25jZShrZXlzLCBmbiwgb3B0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bnN1YigpO1xyXG4gICAgICB9XHJcbiAgICAgICwgb3B0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3N1YnNjcmliZU9uY2Uoa2V5LCBmbiwgb3B0cykge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVPbmNlKGNvbnN0cyhrZXkpLCBmbiwgb3B0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKGtleSwgZm4sIG9wdHMpIHtcclxuICAgICAgaWYgKG9wdHMgPT0gbnVsbCkgeyBvcHRzID0ge307IH1cclxuICAgICAgaWYgKF8uaXNTdHJpbmcoa2V5KSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUoa2V5LCBmbiwgb3B0cyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHVuc3VicyA9IF8ubWFwKGtleSwgaXRlbSA9PiB0aGlzLl9zdWJzY3JpYmUoaXRlbSwgZm4sIG9wdHMpKTtcclxuICAgICAgICByZXR1cm4gKCkgPT4gXy5lYWNoKHVuc3VicywgdW5zdWIgPT4gdW5zdWIoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjc3Vic2NyaWJlKGtleSwgZm4sIG9wdHMpIHsgcmV0dXJuIHRoaXMuc3Vic2NyaWJlKGNvbnN0cyhrZXkpLCBmbiwgb3B0cyk7IH1cclxuXHJcbiAgICBfc3Vic2NyaWJlKGtleSwgZm4sIG9wdHMpIHtcclxuICAgICAgaWYgKG9wdHMgPT0gbnVsbCkgeyBvcHRzID0ge307IH1cclxuICAgICAgaWYgKHRoaXMuX2lzRm9yR2xvYmFsKGtleSkpIHsgcmV0dXJuIHJoLm1vZGVsLnN1YnNjcmliZShrZXksIGZuLCBvcHRzKTsgfVxyXG4gICAgICBpZiAocmguX2RlYnVnKSB7IHJoLl9kKCdsb2cnLCAnU3Vic2NyaWJlJywgYCR7dGhpc30uJHtrZXl9YCk7IH1cclxuXHJcbiAgICAgIHRoaXMuX3Jvb3ROb2RlLmFkZFN1YnNjcmliZXJzKGZuLCB0aGlzLl9nZXRLZXlzKGtleSksIG9wdHMpO1xyXG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLl9yb290Tm9kZS5nZXREYXRhKHRoaXMuX2dldEtleXMoa2V5KSk7XHJcbiAgICAgIGxldCB1bnN1YiA9ICgpID0+IHRoaXMuX3Vuc3Vic2NyaWJlKGtleSwgZm4pO1xyXG4gICAgICBpZiAob3B0cy5mb3JjZUluaXQgfHwgKCh2YWx1ZSAhPSBudWxsKSAmJiAhb3B0cy5pbml0RG9uZSkpIHsgZm4odmFsdWUsIGtleSwgdW5zdWIpOyB9XHJcbiAgICAgIHJldHVybiB1bnN1YjtcclxuICAgIH1cclxuXHJcbiAgICBfdW5zdWJzY3JpYmUoa2V5LCBmbikge1xyXG4gICAgICBpZiAodGhpcy5faXNGb3JHbG9iYWwoa2V5KSkgeyByZXR1cm4gcmgubW9kZWwuX3Vuc3Vic2NyaWJlKGtleSk7IH1cclxuICAgICAgaWYgKHJoLl9kZWJ1ZykgeyByaC5fZCgnbG9nJywgJ19VbnN1YnNjcmliZScsIGAke3RoaXN9LiR7a2V5fWApOyB9XHJcbiAgICAgIHJldHVybiB0aGlzLl9yb290Tm9kZS5yZW1vdmVTdWJzY3JpYmVyKGZuLCB0aGlzLl9nZXRLZXlzKGtleSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzR2xvYmFsKCkgeyByZXR1cm4gdGhpcyA9PT0gcmgubW9kZWw7IH1cclxuXHJcbiAgICBpc0dsb2JhbEtleShrZXkpIHsgcmV0dXJuIGtleSAmJiAoa2V5WzBdID09PSAnLicpOyB9XHJcblxyXG4gICAgX2lzRm9yR2xvYmFsKGtleSkgeyByZXR1cm4gIXRoaXMuaXNHbG9iYWwoKSAmJiB0aGlzLmlzR2xvYmFsS2V5KGtleSk7IH1cclxuXHJcbiAgICBfZ2V0S2V5cyhmdWxsS2V5KSB7XHJcbiAgICAgIGxldCBrZXlzID0gZnVsbEtleS5zcGxpdCgnLicpO1xyXG4gICAgICBpZiAoa2V5c1swXSA9PT0gJycpIHsga2V5cyA9IGtleXMuc2xpY2UoMSk7IH0gLy9zdHJpcCBmaXJzdCBnbG9iYWwga2V5IC5cclxuICAgICAgaWYgKHJoLl9kZWJ1ZyAmJiAoa2V5cy5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgICAgcmguX2QoJ2Vycm9yJywgJ01vZGVsJywgYCR7dGhpc30uJHtmdWxsS2V5fSBpcyBpbnZhbGlkYCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGtleXM7XHJcbiAgICB9XHJcbiAgfTtcclxuICBNb2RlbC5pbml0Q2xhc3MoKTtcclxuICByZXR1cm4gTW9kZWw7XHJcbn0pKCk7XHJcblxyXG4vL2dsb2JhbCBvYmplY3RcclxucmguTW9kZWwgPSBNb2RlbDtcclxucmgubW9kZWwgPSBuZXcgTW9kZWwoKTtcclxucmgubW9kZWwudG9TdHJpbmcgPSAoKSA9PiAnR2xvYmFsTW9kZWwnO1xyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyAkIH0gPSByaDtcclxubGV0IHsgXyB9ID0gcmg7XHJcblxyXG5jbGFzcyBOb2RlSG9sZGVyIHtcclxuXHJcbiAgY29uc3RydWN0b3Iobm9kZXMpIHtcclxuICAgIHRoaXMubm9kZXMgPSBub2RlcztcclxuICB9XHJcblxyXG4gIGlzVmlzaWJsZShub2RlKSB7XHJcbiAgICBpZiAobm9kZSA9PSBudWxsKSB7IG5vZGUgPSB0aGlzLm5vZGVzWzBdOyB9XHJcbiAgICByZXR1cm4gISQuaGFzQ2xhc3Mobm9kZSwgJ3JoLWhpZGUnKTtcclxuICB9XHJcblxyXG4gIHNob3coKSB7XHJcbiAgICByZXR1cm4gXy5lYWNoKHRoaXMubm9kZXMsIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgaWYgKCF0aGlzLmlzVmlzaWJsZShub2RlKSkge1xyXG4gICAgICAgICQucmVtb3ZlQ2xhc3Mobm9kZSwgJ3JoLWhpZGUnKTtcclxuICAgICAgICByZXR1cm4gbm9kZS5oaWRkZW4gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGhpZGUoKSB7XHJcbiAgICByZXR1cm4gXy5lYWNoKHRoaXMubm9kZXMsIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlKG5vZGUpKSB7XHJcbiAgICAgICAgJC5hZGRDbGFzcyhub2RlLCAncmgtaGlkZScpO1xyXG4gICAgICAgIHJldHVybiBub2RlLmhpZGRlbiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgICwgdGhpcyk7XHJcbiAgfVxyXG4gIFxyXG4gIGFjY2Vzc2libGUoZmxhZykge1xyXG4gICAgcmV0dXJuIF8uZWFjaCh0aGlzLm5vZGVzLCBub2RlID0+IG5vZGUuaGlkZGVuID0gZmxhZyk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDbGFzcyhuZXdDbGFzc2VzKSB7XHJcbiAgICBpZiAodGhpcy5vbGRDbGFzc2VzID09IG51bGwpIHsgdGhpcy5vbGRDbGFzc2VzID0gW107IH1cclxuICAgIGZvciAobGV0IG5vZGUgb2YgQXJyYXkuZnJvbSh0aGlzLm5vZGVzKSkge1xyXG4gICAgICBmb3IgKHZhciBjbGFzc05hbWUgb2YgQXJyYXkuZnJvbSh0aGlzLm9sZENsYXNzZXMpKSB7ICQucmVtb3ZlQ2xhc3Mobm9kZSwgY2xhc3NOYW1lKTsgfVxyXG4gICAgICBmb3IgKGNsYXNzTmFtZSBvZiBBcnJheS5mcm9tKG5ld0NsYXNzZXMpKSB7XHJcbiAgICAgICAgaWYgKGNsYXNzTmFtZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAkLmFkZENsYXNzKG5vZGUsIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICB0aGlzLm9sZENsYXNzZXMucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlTm9kZXMobmV3Tm9kZXMpIHtcclxuICAgIGxldCBmaXJzdE5vZGUgPSB0aGlzLm5vZGVzWzBdO1xyXG4gICAgbGV0IHsgcGFyZW50Tm9kZSB9ID0gZmlyc3ROb2RlO1xyXG4gICAgZm9yICh2YXIgbm9kZSBvZiBBcnJheS5mcm9tKG5ld05vZGVzKSkgeyBwYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBmaXJzdE5vZGUpOyB9XHJcbiAgICBmb3IgKG5vZGUgb2YgQXJyYXkuZnJvbSh0aGlzLm5vZGVzKSkgeyBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpOyB9XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlcyA9IG5ld05vZGVzO1xyXG4gIH1cclxufVxyXG5cclxucmguTm9kZUhvbGRlciA9IE5vZGVIb2xkZXI7IiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcblxyXG5jbGFzcyBQbHVnaW4ge1xyXG5cclxuICBhdHRhY2hPd25lcihvYmopIHtcclxuICAgIGlmICh0aGlzLl9vd25lckZucyA9PSBudWxsKSB7IHRoaXMuX293bmVyRm5zID0ge307IH1cclxuICAgIGlmICh0aGlzLmhhc093bmVyKCkpIHsgdGhpcy5kZXRhY2godGhpcy5vd25lcik7IH1cclxuICAgIHRoaXMub3duZXIgPSBvYmo7XHJcbiAgICBpZiAodGhpcy5fb3ZlcnJpZGVOYW1lcykgeyBmb3IgKGxldCBmbk5hbWUgb2YgQXJyYXkuZnJvbSh0aGlzLl9vdmVycmlkZU5hbWVzKSkgeyB0aGlzLl9vdmVycmlkZU93bmVyRm4oZm5OYW1lKTsgfSB9XHJcbiAgICByZXR1cm4gdGhpcy5vd25lcklzQ2hhbmdlZCgpO1xyXG4gIH1cclxuXHJcbiAgZGV0YWNoT3duZXIoKSB7XHJcbiAgICBpZiAodGhpcy5oYXNPd25lcigpKSB7XHJcbiAgICAgIGlmICh0aGlzLl9vd25lckZucykgeyBmb3IgKGxldCBmbk5hbWUgaW4gdGhpcy5fb3duZXJGbnMpIHsgdGhpcy5fcmVzdG9yZU93bmVyRm4oZm5OYW1lKTsgfSB9XHJcbiAgICAgIHRoaXMub3duZXIgPSBudWxsO1xyXG4gICAgICB0aGlzLl9vd25lckZucyA9IHt9O1xyXG4gICAgICByZXR1cm4gdGhpcy5vd25lcklzQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcGx1Z2luIHNob3VsZCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBnZXQgdGhlIG5vdGlmaWNhdGlvbiBvZiBvd29uZXIgY2hhbmdlXHJcbiAgb3duZXJJc0NoYW5nZWQoKSB7fVxyXG5cclxuICBoYXNPd25lcigpIHsgcmV0dXJuICh0aGlzLm93bmVyICE9IG51bGwpOyB9XHJcblxyXG4gIGFkZE92ZXJyaWRlcyhmbk5hbWVzKSB7XHJcbiAgICBpZiAodGhpcy5fb3ZlcnJpZGVOYW1lcyA9PSBudWxsKSB7IHRoaXMuX292ZXJyaWRlTmFtZXMgPSBbXTsgfVxyXG4gICAgcmV0dXJuICgoKSA9PiB7XHJcbiAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgZm9yIChsZXQgZm5OYW1lIG9mIEFycmF5LmZyb20oZm5OYW1lcykpIHtcclxuICAgICAgICB0aGlzLl9vdmVycmlkZU5hbWVzLnB1c2goZm5OYW1lKTtcclxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9vdmVycmlkZU93bmVyRm4oZm5OYW1lKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0pKCk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVPdmVycmlkZXMoZm5OYW1lcykge1xyXG4gICAgcmV0dXJuICgoKSA9PiB7XHJcbiAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgZm9yIChsZXQgZm5OYW1lIG9mIEFycmF5LmZyb20oZm5OYW1lcykpIHtcclxuICAgICAgICB0aGlzLl9yZXN0b3JlT3duZXJGbihmbk5hbWUpO1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX292ZXJyaWRlTmFtZXMuaW5kZXhPZihmbk5hbWUpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7IHJlc3VsdC5wdXNoKHRoaXMuX292ZXJyaWRlTmFtZXMuc3BsaWNlKGluZGV4LCAxKSk7IH0gZWxzZSB7XHJcbiAgICAgICAgICByZXN1bHQucHVzaCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSkoKTtcclxuICB9XHJcblxyXG4gIF9vdmVycmlkZU93bmVyRm4oZm5OYW1lKSB7XHJcbiAgICBpZiAodGhpcy5oYXNPd25lcigpKSB7XHJcbiAgICAgIGxldCBvd25lckZuID0gdGhpcy5vd25lcltmbk5hbWVdO1xyXG4gICAgICB0aGlzLl9vd25lckZuc1tmbk5hbWVdID0gb3duZXJGbjtcclxuICAgICAgcmV0dXJuIHRoaXMub3duZXJbZm5OYW1lXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBhcmdzID0gW107IGxldCBpID0gLTE7XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGFyZ3VtZW50cy5sZW5ndGgpIHsgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7IH1cclxuICAgICAgICBsZXQgYmluZGVkRm4gPSBuZXdBcmdzID0+IHtcclxuICAgICAgICAgIHJldHVybiBfX2d1YXJkTWV0aG9kX18ob3duZXJGbiwgJ2FwcGx5JywgbyA9PiBvLmFwcGx5KHRoaXMub3duZXIsIG5ld0FyZ3MpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0oYmluZGVkRm4sIGFyZ3MpO1xyXG4gICAgICB9LmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfcmVzdG9yZU93bmVyRm4oZm5OYW1lKSB7XHJcbiAgICBpZiAodGhpcy5oYXNPd25lcigpKSB7XHJcbiAgICAgIHRoaXMub3duZXJbZm5OYW1lXSA9IHRoaXMuX293bmVyRm5zW2ZuTmFtZV07XHJcbiAgICAgIHJldHVybiBkZWxldGUgdGhpcy5fb3duZXJGbnNbZm5OYW1lXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnJoLlBsdWdpbiA9IFBsdWdpbjtcclxuXHJcbmZ1bmN0aW9uIF9fZ3VhcmRNZXRob2RfXyhvYmosIG1ldGhvZE5hbWUsIHRyYW5zZm9ybSkge1xyXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAndW5kZWZpbmVkJyAmJiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9ialttZXRob2ROYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIHRyYW5zZm9ybShvYmosIG1ldGhvZE5hbWUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxufSIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5cclxubGV0ICQgPSAocmguJCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBpbmRleCkge1xyXG4gIGlmICgoaW5kZXggIT0gbnVsbCkgJiYgKGluZGV4ID09PSAwKSkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZXQgbm9kZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgIGlmICgoaW5kZXggIT0gbnVsbCkgJiYgKGluZGV4IDwgbm9kZUxpc3QubGVuZ3RoKSkge1xyXG4gICAgICByZXR1cm4gbm9kZUxpc3RbaW5kZXhdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG5vZGVMaXN0O1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG4vL2FyZ3VtZW50c1xyXG4vLyAocGFyZW50LCBzZWxlY3RvcikgLT5cclxuLy8gb3IgKHNlbGVjdG9yKSAtPlxyXG4kLmZpbmQgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgcGFyZW50LCBzZWxlY3RvcjtcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgIHBhcmVudCA9IGFyZ3VtZW50c1swXTtcclxuICAgIHNlbGVjdG9yID0gYXJndW1lbnRzWzFdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwYXJlbnQgPSBkb2N1bWVudDtcclxuICAgIHNlbGVjdG9yID0gYXJndW1lbnRzWzBdO1xyXG4gIH1cclxuICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG59O1xyXG5cclxuJC50cmF2ZXJzZU5vZGUgPSBmdW5jdGlvbihub2RlLCBwcmVDaGlsZCwgcG9zdENoaWxkLCBvbkNoaWxkLCBjb250ZXh0KSB7XHJcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gd2luZG93OyB9XHJcbiAgaWYgKHByZUNoaWxkICYmIHByZUNoaWxkLmNhbGwoY29udGV4dCwgbm9kZSkpIHtcclxuICAgICQuZWFjaENoaWxkTm9kZShub2RlLCBmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICBpZiAoIW9uQ2hpbGQgfHwgb25DaGlsZC5jYWxsKGNvbnRleHQsIGNoaWxkKSkge1xyXG4gICAgICAgIHJldHVybiAkLnRyYXZlcnNlTm9kZShjaGlsZCwgcHJlQ2hpbGQsIHBvc3RDaGlsZCwgb25DaGlsZCwgY29udGV4dCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKHBvc3RDaGlsZCkgeyBwb3N0Q2hpbGQuY2FsbChjb250ZXh0LCBub2RlKTsgfVxyXG4gIH1cclxuICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcbiQuZWFjaENoaWxkTm9kZSA9IGZ1bmN0aW9uKHBhcmVudCwgZm4sIGNvbnRleHQpIHtcclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB3aW5kb3c7IH1cclxuICBmb3IgKGxldCBjaGlsZCBvZiBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikpIHsgZm4uY2FsbChjb250ZXh0LCBjaGlsZCk7IH1cclxufTtcclxuXHJcbiQuZWFjaENoaWxkID0gZnVuY3Rpb24ocGFyZW50LCBzZWxlY3RvciwgZm4sIGNvbnRleHQpIHtcclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB3aW5kb3c7IH1cclxuICBmb3IgKGxldCBub2RlIG9mIEFycmF5LmZyb20odGhpcy5maW5kKHBhcmVudCwgc2VsZWN0b3IpKSkge1xyXG4gICAgZm4uY2FsbChjb250ZXh0LCBub2RlKTtcclxuICB9XHJcbn07XHJcblxyXG4kLmVhY2hEYXRhTm9kZSA9IGZ1bmN0aW9uKHBhcmVudCwgZGF0YUF0dHIsIGZuLCBjb250ZXh0KSB7XHJcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gd2luZG93OyB9XHJcbiAgZm9yIChsZXQgbm9kZSBvZiBBcnJheS5mcm9tKHRoaXMuZmluZChwYXJlbnQsIGBbZGF0YS0ke2RhdGFBdHRyfV1gKSkpIHtcclxuICAgIGZuLmNhbGwoY29udGV4dCwgbm9kZSwgJC5kYXRhc2V0KG5vZGUsIGRhdGFBdHRyKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuJC5lYWNoQXR0cmlidXRlcyA9IGZ1bmN0aW9uKG5vZGUsIGZuLCBjb250ZXh0KSB7XHJcbiAgbGV0IGluZm9zID0gKEFycmF5LmZyb20obm9kZS5hdHRyaWJ1dGVzKS5tYXAoKGF0dHIpID0+IFthdHRyLnNwZWNpZmllZCwgYXR0ci5uYW1lLCBhdHRyLnZhbHVlXSkpO1xyXG4gIGxldCBpID0gLTE7XHJcbiAgd2hpbGUgKCsraSA8IGluZm9zLmxlbmd0aCkgeyAvL2hlcmUgbGVuZ3RoIGNhbiBiZSBpbmNyZWFzZWQgaW4gYmV0d2VlblxyXG4gICAgbGV0IGluZm8gPSBpbmZvc1tpXTtcclxuICAgIGlmIChpbmZvWzBdICE9PSBmYWxzZSkgeyBmbi5jYWxsKGNvbnRleHQgfHwgd2luZG93LCBpbmZvWzFdLCBpbmZvWzJdLCBpbmZvcyk7IH1cclxuICB9XHJcbn07XHJcblxyXG4kLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKG5vZGUsIGF0dHJOYW1lKSB7XHJcbiAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlICE9IG51bGwpIHsgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTsgfVxyXG59O1xyXG5cclxuJC5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbihub2RlLCBhdHRyTmFtZSwgdmFsdWUpIHtcclxuICBpZiAobm9kZS5zZXRBdHRyaWJ1dGUgIT0gbnVsbCkgeyByZXR1cm4gbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIHZhbHVlKTsgfVxyXG59O1xyXG5cclxuJC5yZW1vdmVBdHRyaWJ1dGUgPSBmdW5jdGlvbihub2RlLCBhdHRyTmFtZSkge1xyXG4gIGlmIChub2RlLnJlbW92ZUF0dHJpYnV0ZSAhPSBudWxsKSB7IHJldHVybiBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7IH1cclxufTtcclxuXHJcbiQuaGFzQXR0cmlidXRlID0gZnVuY3Rpb24obm9kZSwgYXR0ck5hbWUpIHtcclxuICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUgIT0gbnVsbCkgeyByZXR1cm4gbm9kZS5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpOyB9IGVsc2UgeyByZXR1cm4gZmFsc2U7IH1cclxufTtcclxuXHJcbiQuZGF0YXNldCA9IGZ1bmN0aW9uKG5vZGUsIGF0dHJOYW1lLCB2YWx1ZSkge1xyXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XHJcbiAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgcmV0dXJuICQuc2V0QXR0cmlidXRlKG5vZGUsIGBkYXRhLSR7YXR0ck5hbWV9YCwgdmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICQucmVtb3ZlQXR0cmlidXRlKG5vZGUsIGBkYXRhLSR7YXR0ck5hbWV9YCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAkLmdldEF0dHJpYnV0ZShub2RlLCBgZGF0YS0ke2F0dHJOYW1lfWApO1xyXG4gIH1cclxufTtcclxuXHJcbiQuaXNEZXNjZW5kZW50ID0gZnVuY3Rpb24ocGFyZW50LCBjaGlsZCkge1xyXG4gIGxldCBub2RlID0gY2hpbGQucGFyZW50Tm9kZTtcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgaWYgKCFub2RlIHx8IChub2RlID09PSBwYXJlbnQpKSB7IGJyZWFrOyB9XHJcbiAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZSA9PT0gcGFyZW50O1xyXG59O1xyXG5cclxuJC5hZGRDbGFzcyA9IGZ1bmN0aW9uKG5vZGUsIGNsYXNzTmFtZSkge1xyXG4gIGlmIChub2RlLmNsYXNzTGlzdCAhPSBudWxsKSB7XHJcbiAgICByZXR1cm4gbm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBub2RlLmNsYXNzTmFtZSA9IGAke25vZGUuY2xhc3NOYW1lfSAke2NsYXNzTmFtZX1gO1xyXG4gIH1cclxufTtcclxuXHJcbiQucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihub2RlLCBjbGFzc05hbWUpIHtcclxuICBpZiAobm9kZS5jbGFzc0xpc3QgIT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbm9kZS5jbGFzc05hbWUgPSBub2RlLmNsYXNzTmFtZS5yZXBsYWNlKGNsYXNzTmFtZSwgJycpO1xyXG4gIH1cclxufTtcclxuXHJcbiQuaGFzQ2xhc3MgPSBmdW5jdGlvbihub2RlLCBjbGFzc05hbWUpIHtcclxuICBpZiAobm9kZS5jbGFzc0xpc3QgIT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XHJcbiAgfSBlbHNlIGlmIChub2RlLmNsYXNzTmFtZSkge1xyXG4gICAgcmV0dXJuIG5vZGUuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoYCR7Y2xhc3NOYW1lfSgkfCApYCkpICE9PSBudWxsO1xyXG4gIH1cclxufTtcclxuXHJcbiQudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihub2RlLCBjbGFzc05hbWUpIHtcclxuICBpZiAoJC5oYXNDbGFzcyhub2RlLCBjbGFzc05hbWUpKSB7XHJcbiAgICByZXR1cm4gJC5yZW1vdmVDbGFzcyhub2RlLCBjbGFzc05hbWUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJC5hZGRDbGFzcyhub2RlLCBjbGFzc05hbWUpO1xyXG4gIH1cclxufTtcclxuXHJcbiQuY29tcHV0ZWRTdHlsZSA9IG5vZGUgPT4gbm9kZS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCk7XHJcblxyXG4kLmlzVmlzaWJsZU5vZGUgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgbGV0IGNvbXB1dGVkU3R5bGUgPSAkLmNvbXB1dGVkU3R5bGUobm9kZSk7XHJcbiAgcmV0dXJuICgnbm9uZScgIT09IGNvbXB1dGVkU3R5bGVbJ2Rpc3BsYXknXSkgJiZcclxuICAhXy5pc1plcm9DU1NWYWx1ZShjb21wdXRlZFN0eWxlWydvcGFjaXR5J10pICYmXHJcbiAgIV8uaXNaZXJvQ1NTVmFsdWUoY29tcHV0ZWRTdHlsZVsnbWF4LWhlaWdodCddKTtcclxufTtcclxuXHJcbiQudGV4dENvbnRlbnQgPSBmdW5jdGlvbihub2RlLCBjb250ZW50KSB7XHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcclxuICAgIGlmIChub2RlLnRleHRDb250ZW50ICE9IG51bGwpIHtcclxuICAgICAgcmV0dXJuIG5vZGUudGV4dENvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG5vZGUuaW5uZXJUZXh0ID0gY29udGVudDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG5vZGUudGV4dENvbnRlbnQgfHwgbm9kZS5pbm5lclRleHQ7XHJcbiAgfVxyXG59O1xyXG5cclxuJC5pbm5lckhUTUwgPSBmdW5jdGlvbihub2RlLCBjb250ZW50KSB7XHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcclxuICAgIHJldHVybiBub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBub2RlLmlubmVySFRNTDtcclxuICB9XHJcbn07XHJcblxyXG4kLmNzcyA9IGZ1bmN0aW9uKG5vZGUsIHN0eWxlTmFtZSwgdmFsdWUpIHtcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xyXG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbc3R5bGVOYW1lXSA9IHZhbHVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtzdHlsZU5hbWVdO1xyXG4gIH1cclxufTtcclxuXHJcbiQubm9kZU5hbWUgPSBub2RlID0+IG5vZGUubm9kZU5hbWU7XHJcblxyXG4kLnBhZ2VIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgaGVpZ2h0O1xyXG4gIGxldCBkZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICBpZiAoZGUpIHsgaGVpZ2h0ID0gZGUuc2Nyb2xsSGVpZ2h0IHx8IGRlLmNsaWVudEhlaWdodCB8fCBkZS5vZmZzZXRIZWlnaHQ7IH1cclxuICBpZiAoIWhlaWdodCkgeyBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7IH1cclxuICBsZXQgeyBib2R5IH0gPSBkb2N1bWVudDtcclxuICBsZXQgYm9keUhlaWdodCA9IGJvZHkuc2Nyb2xsSGVpZ2h0IHx8IGJvZHkuY2xpZW50SGVpZ2h0IHx8IGJvZHkub2Zmc2V0SGVpZ2h0O1xyXG4gIGhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgYm9keUhlaWdodCk7XHJcbiAgcmV0dXJuIGAke2hlaWdodH1weGA7XHJcbn07XHJcblxyXG4kLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbih0YWcsIGlubmVySHRtbCkge1xyXG4gIGxldCB0YWdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xyXG4gIHRhZ05vZGUuaW5uZXJIVE1MID0gaW5uZXJIdG1sO1xyXG4gIHJldHVybiB0YWdOb2RlO1xyXG59OyIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5sZXQgeyBjb25zdHMgfSA9IHJoO1xyXG5sZXQgeyBtb2RlbCB9ID0gcmg7XHJcblxyXG5jbGFzcyBSZXNwb25zaXZlIHtcclxuXHJcbiAgdG9TdHJpbmcoKSB7IHJldHVybiAnUmVzcG9uc2l2ZSc7IH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnN1YnMgPSBbXTtcclxuICAgIG1vZGVsLnN1YnNjcmliZShjb25zdHMoJ0VWVF9PUklFTlRBVElPTl9DSEFOR0UnKSwgKCkgPT4ge1xyXG4gICAgICByZXR1cm4gXy5lYWNoKHRoaXMuc3Vicywgc3ViID0+IHN1Yi5ldmVudEhhbmRsZXIoc3ViLm1xbCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHJoLl9kZWJ1ZyAmJiAhdGhpcy5pc1N1cHBvcnRlZCgpKSB7XHJcbiAgICAgIHJoLl9kKCdlcnJvcicsICdCcm93c2VyIElzc3VlJywgJ21hdGNoTWVkaWEgaXMgbm90IHN1cHBvcnRlZC4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzU3VwcG9ydGVkKCkgeyByZXR1cm4gKHdpbmRvdy5tYXRjaE1lZGlhICE9IG51bGwpOyB9XHJcblxyXG4gIGF0dGFjaChtZWRpYV9xdWVyeSwgb25Gbiwgb2ZmRm4pIHtcclxuICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkKSB7XHJcbiAgICAgIGxldCBtcWwgPSB3aW5kb3cubWF0Y2hNZWRpYShtZWRpYV9xdWVyeSk7XHJcbiAgICAgIGxldCBldmVudEhhbmRsZXIgPSBmdW5jdGlvbihtcWwpIHsgaWYgKG1xbC5tYXRjaGVzKSB7IHJldHVybiBvbkZuKCk7IH0gZWxzZSB7IHJldHVybiBvZmZGbigpOyB9IH07XHJcbiAgICAgIGV2ZW50SGFuZGxlcihtcWwpO1xyXG4gICAgICBtcWwuYWRkTGlzdGVuZXIoZXZlbnRIYW5kbGVyKTtcclxuICAgICAgcmV0dXJuIHRoaXMuc3Vicy5wdXNoKHttcWwsIG9uOiBvbkZuLCBvZmY6IG9mZkZuLCBldmVudEhhbmRsZXJ9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRldGFjaChtZWRpYV9xdWVyeSwgb25Gbiwgb2ZmRm4pIHtcclxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnN1YnMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgIGxldCBzdWIgPSB0aGlzLnN1YnNbaW5kZXhdO1xyXG4gICAgICBpZiAoKHN1Yi5tcWwubWVkaWEgPT09IG1lZGlhX3F1ZXJ5KSAmJiAoc3ViLm9uID09PSBvbkZuKSAmJiAoc3ViLm9mZiA9PT0gb2ZmRm4pKSB7XHJcbiAgICAgICAgc3ViLm1xbC5yZW1vdmVMaXN0ZW5lcihzdWIuZXZlbnRIYW5kbGVyKTtcclxuICAgICAgICB0aGlzLnN1YnMuc3BsaWNlKGluZGV4KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxucmgucmVzcG9uc2l2ZSA9IG5ldyBSZXNwb25zaXZlKCk7IiwiY29uc3QgeyByaCB9ID0gd2luZG93O1xyXG5jb25zdCB7IF8gfSA9IHJoO1xyXG5jb25zdCB7ICQgfSA9IHJoO1xyXG5jb25zdCB7IGNvbnN0cyB9ID0gcmg7XHJcbmNvbnN0IHsgbW9kZWwgfSA9IHJoO1xyXG5jb25zdCB7IGh0dHAgfSA9IHJoO1xyXG5jb25zdCBmb3JtZGF0YSA9IHJoLmZvcm1EYXRhO1xyXG5cclxuY2xhc3MgUm9ib0hlbHBTZXJ2ZXIge1xyXG5cclxuICB0b1N0cmluZygpIHsgcmV0dXJuICdSb2JvSGVscFNlcnZlcic7IH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBhcmVhKCkge1xyXG4gICAgcmV0dXJuIF8udXJsUGFyYW0oJ2FyZWEnLCBfLmV4dHJhY3RQYXJhbVN0cmluZygpKTtcclxuICB9XHJcblxyXG4gIHR5cGUoKSB7XHJcbiAgICByZXR1cm4gXy51cmxQYXJhbSgndHlwZScsIF8uZXh0cmFjdFBhcmFtU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgcHJvamVjdCgpIHtcclxuICAgIHJldHVybiBfLnVybFBhcmFtKCdwcm9qZWN0JywgXy5leHRyYWN0UGFyYW1TdHJpbmcoKSk7XHJcbiAgfVxyXG5cclxuICBsb2dUb3BpY1ZpZXcodG9waWMpIHtcclxuICAgIHJldHVybiBtb2RlbC5zdWJzY3JpYmUoY29uc3RzKCdFVlRfUFJPSkVDVF9MT0FERUQnKSwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBiYXNlVXJsID0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX1BVQkxJU0hfQkFTRV9VUkwnKSk7XHJcbiAgICAgIGNvbnN0IHBhcmVudFBhdGggPSBfLnBhcmVudFBhdGgoXy5maWxlUGF0aChfLmdldFJvb3RVcmwoKSkpO1xyXG4gICAgICBjb25zdCB0cGNVcmwgPSBfLmlzUmVsYXRpdmVVcmwodG9waWMpID8gcGFyZW50UGF0aCArIHRvcGljIDogdG9waWM7XHJcbiAgICAgIGlmIChiYXNlVXJsICYmICFfLmlzRW1wdHlTdHJpbmcoYmFzZVVybCkpIHtcclxuICAgICAgICBjb25zdCBoYXNoU3RyaW5nID0gXy5tYXBUb0VuY29kZWRTdHJpbmcoXy5leHRlbmQoY29uc3RzKCdSSFNfTE9HX1RPUElDX1ZJRVcnKSxcclxuICAgICAgICAgIHthcmVhOiB0aGlzLmFyZWEoKSwgdHBjOiBfLmZpbGVQYXRoKHRwY1VybCl9KVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIGh0dHAuZ2V0KGAke2Jhc2VVcmx9PyR7aGFzaFN0cmluZ31gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcmVTZWFyY2goKSB7XHJcbiAgICBsZXQgaGFzaFN0cmluZztcclxuICAgIGNvbnN0IHNlYXJjaFRleHQgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfU0VBUkNIX1RFUk0nKSk7XHJcbiAgICBpZiAoc2VhcmNoVGV4dCAmJiAhXy5pc0VtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XHJcbiAgICAgIGhhc2hTdHJpbmcgPSBfLm1hcFRvRW5jb2RlZFN0cmluZyhfLmV4dGVuZChjb25zdHMoJ1JIU19ET19TRUFSQ0gnKSwgXy5hZGRQYXRoTmFtZUtleSh7XHJcbiAgICAgICAgYXJlYTogdGhpcy5hcmVhKCksIHR5cGU6IHRoaXMudHlwZSgpLCBwcm9qZWN0OiB0aGlzLnByb2plY3QoKSwgcXVlc246IHNlYXJjaFRleHQsXHJcbiAgICAgICAgb2xkcXVlc246ICcnLCBxdWVzbnN5bjogJydcclxuICAgICAgfSlcclxuICAgICAgKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgbW9kZWwucHVibGlzaChjb25zdHMoJ0tFWV9TRUFSQ0hFRF9URVJNJyksIHNlYXJjaFRleHQpO1xyXG4gICAgICBtb2RlbC5wdWJsaXNoKGNvbnN0cygnRVZUX1NFQVJDSF9JTl9QUk9HUkVTUycpLCB0cnVlKTtcclxuICAgICAgbW9kZWwucHVibGlzaChjb25zdHMoJ0tFWV9TRUFSQ0hfUFJPR1JFU1MnKSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtzZWFyY2hUZXh0LCBoYXNoU3RyaW5nfTtcclxuICB9XHJcblxyXG4gIHBvc3RTZWFyY2goc2VhcmNoVGV4dCwgcmVzdWx0c1RleHQpIHtcclxuICAgIGNvbnN0IHNlYXJjaFJlc3VsdHMgPSBKU09OLnBhcnNlKHJlc3VsdHNUZXh0KTtcclxuICAgIGlmIChzZWFyY2hSZXN1bHRzICYmIHNlYXJjaFJlc3VsdHMuY2xpZW50SW5kZXgpIHtcclxuICAgICAgY29uc3QgaGFzaFN0cmluZyA9IF8ubWFwVG9FbmNvZGVkU3RyaW5nKF8uYWRkUGF0aE5hbWVLZXkoe2FyZWE6IHRoaXMuYXJlYSgpLCB0eXBlOiB0aGlzLnR5cGUoKSxcclxuICAgICAgcHJvamVjdDogdGhpcy5wcm9qZWN0KCksIHF1ZXNuOiBzZWFyY2hUZXh0LCBjbWQ6ICdjbGllbnRpbmRleCd9KSk7XHJcbiAgICAgIG1vZGVsLnN1YnNjcmliZU9uY2UoY29uc3RzKCdLRVlfU0VBUkNIX1JFU1VMVFMnKSwgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfUFVCTElTSF9CQVNFX1VSTCcpKTtcclxuICAgICAgICByZXR1cm4gaHR0cC5wb3N0KGAke2Jhc2VVcmx9PyR7aGFzaFN0cmluZ31gLCBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICAgICAgICB7J0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pXHJcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICAgIHJldHVybiByZXN1bHQgPSBmYWxzZTt9KS5zdWNjZXNzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICAgIHJldHVybiByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgICwge2luaXREb25lOiB0cnVlfSk7XHJcbiAgICAgIHJldHVybiB3aW5kb3cuZG9TZWFyY2goKTtcclxuICAgIH1cclxuICAgIG1vZGVsLnB1Ymxpc2goY29uc3RzKCdFVlRfU0VBUkNIX0lOX1BST0dSRVNTJyksIGZhbHNlKTtcclxuICAgIG1vZGVsLnB1Ymxpc2goY29uc3RzKCdLRVlfU0VBUkNIX1BST0dSRVNTJyksIG51bGwpO1xyXG5cclxuICAgIGlmIChzZWFyY2hSZXN1bHRzKSB7XHJcbiAgICAgIGNvbnN0IHNlYXJjaFRvcGljcyA9IHNlYXJjaFJlc3VsdHMudG9waWNzO1xyXG4gICAgICBpZiAoc2VhcmNoVG9waWNzICYmIChzZWFyY2hUb3BpY3MubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICB3aW5kb3cuc2V0UmVzdWx0c1N0cmluZ0hUTUwoc2VhcmNoVG9waWNzLmxlbmd0aCxcclxuICAgICAgICB3aW5kb3cuX3RleHRUb0h0bWxfbm9uYnNwKHNlYXJjaFRleHQpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzdWx0c1BhcmFtcyA9ICc/JyArIF8ubWFwVG9FbmNvZGVkU3RyaW5nKF8uZXh0ZW5kKHtyaGhsdGVybTogc2VhcmNoVGV4dH0sXHJcbiAgICAgICAge3Joc3luczogc2VhcmNoUmVzdWx0cy5zeW5zfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIG1vZGVsLnB1Ymxpc2goY29uc3RzKCdLRVlfU0VBUkNIX1JFU1VMVF9QQVJBTVMnKSwgcmVzdWx0c1BhcmFtcyk7XHJcbiAgICAgIG1vZGVsLnB1Ymxpc2goY29uc3RzKCdLRVlfU0VBUkNIX1JFU1VMVFMnKSwgc2VhcmNoVG9waWNzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXNlYXJjaFJlc3VsdHMgfHwgIShzZWFyY2hSZXN1bHRzLnRvcGljcyAhPSBudWxsID8gc2VhcmNoUmVzdWx0cy50b3BpY3MubGVuZ3RoIDogdW5kZWZpbmVkKSkge1xyXG4gICAgICByZXR1cm4gd2luZG93LmRpc3BsYXlNc2cod2luZG93LmdzTm9Ub3BpY3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZG9TZWFyY2goKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX1BVQkxJU0hfTU9ERScpKTtcclxuICAgIGNvbnN0IGJhc2VVcmwgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfUFVCTElTSF9CQVNFX1VSTCcpKTtcclxuICAgIGlmIChiYXNlVXJsICYmICFfLmlzRW1wdHlTdHJpbmcoYmFzZVVybCkpIHtcclxuICAgICAgY29uc3Qge3NlYXJjaFRleHQsIGhhc2hTdHJpbmd9ID0gdGhpcy5wcmVTZWFyY2goKTtcclxuXHJcbiAgICAgIGh0dHAuZ2V0KGAke2Jhc2VVcmx9PyR7aGFzaFN0cmluZ31gKVxyXG4gICAgICAuZXJyb3IoKCkgPT4gcmVzdWx0ID0gZmFsc2UpLnN1Y2Nlc3MocmVzdWx0c1RleHQgPT4ge1xyXG4gICAgICAgIHRoaXMucG9zdFNlYXJjaChzZWFyY2hUZXh0LCByZXN1bHRzVGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn1cclxuXHJcbnJoLnJocyA9IG5ldyBSb2JvSGVscFNlcnZlcigpO1xyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBfIH0gPSByaDtcclxubGV0IHsgY29uc3RzIH0gPSByaDtcclxubGV0IHsgbW9kZWwgfSA9IHJoO1xyXG5cclxubGV0IGRlZmF1bHRTY3JlZW5zID0ge1xyXG4gIGRlc2t0b3A6IHtcclxuICAgIG1lZGlhX3F1ZXJ5OiAnc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjk2cHgpJ1xyXG4gIH0sXHJcbiAgdGFibGV0OiB7XHJcbiAgICBtZWRpYV9xdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogOTQycHgpIGFuZCAobWF4LXdpZHRoOiAxMjk1cHgpJ1xyXG4gIH0sXHJcbiAgcGhvbmU6IHtcclxuICAgIG1lZGlhX3F1ZXJ5OiAnc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA5NDFweCknXHJcbiAgfSxcclxuICBpb3M6IHtcclxuICAgIHVzZXJfYWdlbnQ6IC8oaVBhZHxpUGhvbmV8aVBvZCkvZ1xyXG4gIH0sXHJcbiAgaXBhZDoge1xyXG4gICAgdXNlcl9hZ2VudDogLyhpUGFkKS9nXHJcbiAgfSxcclxuICBwcmludDoge1xyXG4gICAgbWVkaWFfcXVlcnk6ICdwcmludCdcclxuICB9XHJcbn07XHJcblxyXG5cclxuY2xhc3MgU2NyZWVuIHtcclxuXHJcbiAgYXR0YWNoZWRLZXkobmFtZSkgeyByZXR1cm4gYCR7Y29uc3RzKCdLRVlfU0NSRUVOJyl9LiR7bmFtZX0uYXR0YWNoZWRgOyB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmVTY3JlZW4gPSB0aGlzLnN1YnNjcmliZVNjcmVlbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5vblNjcmVlbiA9IHRoaXMub25TY3JlZW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMub2ZmU2NyZWVuID0gdGhpcy5vZmZTY3JlZW4uYmluZCh0aGlzKTtcclxuICAgIGxldCBkYXRhID0gXy5leHRlbmQoe30sIGRlZmF1bHRTY3JlZW5zLCBtb2RlbC5nZXQoY29uc3RzKCdLRVlfU0NSRUVOJykpKTtcclxuICAgIGlmIChkYXRhKSB7IF8uZWFjaChkYXRhLCB0aGlzLnN1YnNjcmliZVNjcmVlbik7IH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZVNjcmVlbihpbmZvLCBuYW1lKSB7XHJcbiAgICBpZiAoaW5mby51c2VyX2FnZW50ICYmXHJcbiAgICAhd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goXy50b1JlZ0V4cChpbmZvLnVzZXJfYWdlbnQpKSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vZmZTY3JlZW4obmFtZSk7XHJcbiAgICB9IGVsc2UgaWYgKGluZm8ubWVkaWFfcXVlcnkpIHtcclxuICAgICAgaWYgKHJoLnJlc3BvbnNpdmUuaXNTdXBwb3J0ZWQoKSkge1xyXG4gICAgICAgIHJldHVybiByaC5yZXNwb25zaXZlLmF0dGFjaChpbmZvLm1lZGlhX3F1ZXJ5LCAoKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5vblNjcmVlbihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLCAoKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5vZmZTY3JlZW4obmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX0RFRkFVTFRfU0NSRUVOJykpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25TY3JlZW4obmFtZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2ZmU2NyZWVuKG5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5vblNjcmVlbihuYW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uU2NyZWVuKG5hbWUpIHtcclxuICAgIGxldCBrZXkgPSB0aGlzLmF0dGFjaGVkS2V5KG5hbWUpO1xyXG4gICAgcmV0dXJuIG1vZGVsLnB1Ymxpc2goa2V5LCB0cnVlKTtcclxuICB9XHJcbiAgXHJcbiAgb2ZmU2NyZWVuKG5hbWUpIHtcclxuICAgIGxldCBrZXkgPSB0aGlzLmF0dGFjaGVkS2V5KG5hbWUpO1xyXG4gICAgaWYgKGZhbHNlICE9PSBtb2RlbC5nZXQoa2V5KSkgeyByZXR1cm4gbW9kZWwucHVibGlzaChrZXksIGZhbHNlKTsgfVxyXG4gIH1cclxufVxyXG5cclxubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnRVZUX1dJREdFVF9CRUZPUkVMT0FEJyksIChmdW5jdGlvbigpIHtcclxuICBsZXQgc2NyZWVuID0gbnVsbDtcclxuICByZXR1cm4gKCkgPT4gc2NyZWVuICE9IG51bGwgPyBzY3JlZW4gOiAoc2NyZWVuID0gbmV3IFNjcmVlbigpKTtcclxufSkoKVxyXG4pO1xyXG5cclxubW9kZWwucHVibGlzaChjb25zdHMoJ0tFWV9TQ1JFRU5fTkFNRVMnKSwgWydkZXNrdG9wJywgJ3RhYmxldCcsICdwaG9uZSddKTtcclxubW9kZWwucHVibGlzaChjb25zdHMoJ0tFWV9TQ1JFRU4nKSwgZGVmYXVsdFNjcmVlbnMpO1xyXG5tb2RlbC5wdWJsaXNoKGNvbnN0cygnS0VZX0RFRkFVTFRfU0NSRUVOJyksICdwaG9uZScpO1xyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBfIH0gPSByaDtcclxuXHJcbi8vIFN0b3JhZ2UgY2xhc3MgdG8gcGVyc2lzdCBrZXkgdmFsdWUgcGFpcnMgdG8gbG9jYWxEQi9jb29raWVzXHJcbmNsYXNzIFN0b3JhZ2Uge1xyXG5cclxuICB0b1N0cmluZygpIHsgcmV0dXJuICdTdG9yYWdlJzsgfVxyXG5cclxuICBpbml0KG5hbWVzcGFjZSkge1xyXG4gICAgaWYgKHRoaXMubmFtZXNwYWNlKSB7XHJcbiAgICAgIGlmIChyaC5fZGVidWcgJiYgKHRoaXMubmFtZXNwYWNlICE9PSBuYW1lc3BhY2UpKSB7XHJcbiAgICAgICAgcmV0dXJuIHJoLl9kKCdlcnJvcicsICdTdG9yYWdlJywgJ05hbWVzcGFjZSBjYW5uXFwndCBiZSBjaGFuZ2VkJyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBqc29uU3RyaW5nO1xyXG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcclxuICAgICAgaWYgKF8uY2FuVXNlTG9jYWxEQigpKSB7XHJcbiAgICAgICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZXNwYWNlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmF3RGF0YSA9IF8uZXhwbG9kZUFuZE1hcChkb2N1bWVudC5jb29raWUsICc7JywgJz0nKTtcclxuICAgICAgICBpZiAocmF3RGF0YVt0aGlzLm5hbWVzcGFjZV0pIHsganNvblN0cmluZyA9IHVuZXNjYXBlKHJhd0RhdGFbdGhpcy5uYW1lc3BhY2VdKTsgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2VNYXAgPSBqc29uU3RyaW5nID8gSlNPTi5wYXJzZShqc29uU3RyaW5nKSA6IHt9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNWYWxpZCgpIHtcclxuICAgIGlmIChyaC5fZGVidWcgJiYgIXRoaXMuc3RvcmFnZU1hcCkge1xyXG4gICAgICByaC5fZCgnZXJyb3InLCAnU3RvcmFnZScsICdOYW1lc3BhY2UgaXMgbm90IHNldCB5ZXQuJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKHRoaXMuc3RvcmFnZU1hcCAhPSBudWxsKTtcclxuICB9XHJcblxyXG4gIHBlcnNpc3Qoa2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XHJcbiAgICAgIHRoaXMuc3RvcmFnZU1hcFtrZXldID0gdmFsdWU7XHJcbiAgICAgIHJldHVybiB0aGlzLmR1bXAoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZldGNoKGtleSkgeyBpZiAodGhpcy5pc1ZhbGlkKCkpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZU1hcFtrZXldOyB9IH1cclxuXHJcbiAgZHVtcCgpIHtcclxuICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xyXG4gICAgICBpZiAoXy5jYW5Vc2VMb2NhbERCKCkpIHtcclxuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lc3BhY2UsIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZU1hcCkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jb29raWUgPSBgJHt0aGlzLm5hbWVzcGFjZX09JHtlc2NhcGUoSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlTWFwKSl9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxucmguU3RvcmFnZSA9IFN0b3JhZ2U7XHJcbnJoLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBfIH0gPSByaDtcclxubGV0IHsgJCB9ID0gcmg7XHJcbmxldCB7IGNvbnN0cyB9ID0gcmg7XHJcblxyXG4vL1dpZGdldCBjbGFzcyBmb3IgYW55IGN1c3RvbSBiZWhhdmlvciBvbiBkb20gbm9kZVxyXG52YXIgV2lkZ2V0ID0gKGZ1bmN0aW9uKCkge1xyXG4gIGxldCBfY291bnQgPSB1bmRlZmluZWQ7XHJcbiAgV2lkZ2V0ID0gY2xhc3MgV2lkZ2V0IGV4dGVuZHMgcmguR3VhcmQge1xyXG4gICAgc3RhdGljIGluaXRDbGFzcygpIHtcclxuXHJcbiAgICAgICAvL3ByaXZhdGUgc3RhdGljIHZhcmlhYmxlXHJcbiAgICAgIF9jb3VudCA9IDA7XHJcblxyXG4gICAgICB0aGlzLnByb3RvdHlwZS5kYXRhQXR0cnMgPSBbJ3JlcGVhdCcsICdpbml0JywgJ3N0ZXh0JywgJ3NodG1sJyxcclxuICAgICAgICAnY29udHJvbGxlcicsICdjbGFzcycsICdhbmltYXRlJywgJ2NzcycsICdhdHRyJywgJ3ZhbHVlJywgJ2NoZWNrZWQnLFxyXG4gICAgICAgICdodG1sJywgJ3RleHQnLCAnaWYnLCAnaGlkZGVuJywgJ2tleWRvd24nLCAna2V5dXAnLCAnc2Nyb2xsJyxcclxuICAgICAgICAnY2hhbmdlJywgJ3RvZ2dsZScsICd0b2dnbGVjbGFzcycsICdtZXRob2QnLCAndHJpZ2dlcicsICdjbGljaycsICdsb2FkJyxcclxuICAgICAgICAnbW91c2VvdmVyJywgJ21vdXNlb3V0JywgJ2ZvY3VzJywgJ2JsdXInLFxyXG4gICAgICAgICdzd2lwZWxlZnQnLCAnc3dpcGVyaWdodCcsICdzd2lwZXVwJywgJ3N3aXBlZG93bicsICdzY3JlZW52YXInXTtcclxuXHJcbiAgICAgIHRoaXMucHJvdG90eXBlLmRhdGFBdHRyTWV0aG9kcyA9ICgoKSA9PiBXaWRnZXQucHJvdG90eXBlLm1hcERhdGFBdHRyTWV0aG9kcyhXaWRnZXQucHJvdG90eXBlLmRhdGFBdHRycykpKCk7XHJcblxyXG4gICAgICAvL2FsbCBsaXN0L2RhdGEtcmVhcGVhdCBpdGVtcyBkYXRhLWkgYXR0cmlidXRlIGFyZSBzdXBwb3J0XHJcbiAgICAgIC8vdGhpcyBpcyB0aGUgbGlzdCBvZiBzcGVjaWFsIGxpc3QgaXRlbSBhdHRyaWJ1dGUuXHJcbiAgICAgIC8vVGhhdCBtZWFucyBhdHRyaWJ1dGVzIGxpa2UgZGF0YS1paHJlZiwgZGF0YS1paWQgZXRjIHdpbGxcclxuICAgICAgLy8gYmUgc3VwcG9ydGVkIHdpdGhvdXQgbGlzdGluZyBoZXJlLlxyXG4gICAgICB0aGlzLnByb3RvdHlwZS5kYXRhSUF0dHJzID0gWydpdGV4dCcsICdpaHRtbCcsICdpY2xhc3MnLCAnaXJlcGVhdCddO1xyXG4gICAgICB0aGlzLnByb3RvdHlwZS5kYXRhSUF0dHJNZXRob2RzID0gKCgpID0+IFdpZGdldC5wcm90b3R5cGUubWFwRGF0YUF0dHJNZXRob2RzKFdpZGdldC5wcm90b3R5cGUuZGF0YUlBdHRycykpKCk7XHJcblxyXG4gICAgICB0aGlzLnByb3RvdHlwZS5zdXBwb3J0ZWRBcmdzID0gWydub2RlJywgJ21vZGVsJywgJ2tleScsICd1c2VyX3ZhcnMnLFxyXG4gICAgICAgICd0ZW1wbGF0ZUV4cHInLCAnaW5jbHVkZSddO1xyXG5cclxuICAgICAgdGhpcy5wcm90b3R5cGUucmVzb2x2ZUV2ZW50UmF3RXhwciA9IF8ubWVtb2l6ZShmdW5jdGlvbihyYXdFeHByKSB7XHJcbiAgICAgICAgbGV0IHtleHByLCBvcHRzfSA9IF8ucmVzb2x2ZUV4cHJPcHRpb25zKHJhd0V4cHIpO1xyXG4gICAgICAgIGV4cHIgPSB0aGlzLnBhdGNoUmF3RXhwcihleHByLCBvcHRzKTtcclxuICAgICAgICBsZXQgZXhwckZuID0gdGhpcy5fZnVuY3Rpb24oJ2V2ZW50LCBub2RlJywgZXhwcik7XHJcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gXy5zYWZlRXhlYyhleHByRm4pO1xyXG4gICAgICAgIGNhbGxiYWNrID0gXy5hcHBseUNhbGxiYWNrT3B0aW9ucyhjYWxsYmFjaywgb3B0cyk7XHJcbiAgICAgICAgcmV0dXJuIHtjYWxsYmFjaywgb3B0c307XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5wcm90b3R5cGUucmVzb2x2ZVJhd0V4cHJXaXRoVmFsdWUgPSBfLm1lbW9pemUoZnVuY3Rpb24ocmF3RXhwcikge1xyXG4gICAgICAgIGxldCBrZXlzID0gW107XHJcbiAgICAgICAgbGV0IHtleHByLCBvcHRzfSA9IF8ucmVzb2x2ZUV4cHJPcHRpb25zKHJhd0V4cHIpO1xyXG4gICAgICAgIGV4cHIgPSB0aGlzLnBhdGNoUmF3RXhwcihleHByLCBvcHRzKTtcclxuICAgICAgICBsZXQgZXhwckZuID0gdGhpcy5fZXZhbEZ1bmN0aW9uKCcnLCBleHByLCBrZXlzKTtcclxuICAgICAgICBsZXQgY2FsbGJhY2sgPSBfLnNhZmVFeGVjKGV4cHJGbik7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBfLmFwcGx5Q2FsbGJhY2tPcHRpb25zKGNhbGxiYWNrLCBvcHRzKTtcclxuICAgICAgICByZXR1cm4ge2NhbGxiYWNrLCBrZXlzLCBvcHRzfTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgLy8jIyMjIyMjIyMgSGVsZXBlciBmdW5jdGlvbiB0byBjcmVhdGUgZnVuY3Rpb25zIGluIHdpZGdldCAjIyMjIyMjIyMjIyMjIyMjI1xyXG4gICAgICB0aGlzLnByb3RvdHlwZS5yZXNvbHZlRXhwcmVzc2lvbiA9IF8ubWVtb2l6ZShmdW5jdGlvbihleHByKSB7XHJcbiAgICAgICAgbGV0IGtleXMgPSBbXTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZXhwcjogXy5yZXNvbHZlTW9kZWxLZXlzKF8ucmVzb2x2ZU5hbWVkVmFyKGV4cHIpLCBrZXlzKSxcclxuICAgICAgICAgIGtleXNcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMucHJvdG90eXBlLl9zYWZlRnVuY3Rpb24gPSBfLm1lbW9pemUoZnVuY3Rpb24oYXJnLCBleHByKSB7XHJcbiAgICAgICAgbGV0IGZuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBmbiA9IG5ldyBGdW5jdGlvbihhcmcsIGV4cHIpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBmbiA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgICBpZiAocmguX2RlYnVnKSB7IHJoLl9kKCdlcnJvcicsIGBFeHByZXNzaW9uOiAke2V4cHJ9YCwgZXJyb3IubWVzc2FnZSk7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZuO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMucHJvdG90eXBlLl9ldmVudENhbGxCYWNrRGF0YSA9IHt9O1xyXG5cclxuICAgICAgdGhpcy5wcm90b3R5cGUucmVzb2x2ZUF0dHIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNhY2hlID0ge307XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGF0dHJzRGF0YSkge1xyXG4gICAgICAgICAgbGV0IHByb3BzID0gY2FjaGVbYXR0cnNEYXRhXTtcclxuICAgICAgICAgIGlmIChwcm9wcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHByb3BzID0gXy5yZXNvbHZlQXR0cihhdHRyc0RhdGEpO1xyXG4gICAgICAgICAgICBjYWNoZVthdHRyc0RhdGFdID0gcHJvcHM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gcHJvcHM7XHJcbiAgICAgICAgfTtcclxuICAgICAgfSkoKTtcclxuXHJcbiAgICAgIC8qXHJcbiAgICAgICAqIFRvZ2dsZSBtb2RlbCB2YXJpYWJsZSBvbiBjbGlja1xyXG4gICAgICAgKiBFeGFtcGxlOiBkYXRhLXRvZ2dsZT0nc2hvd2hpZGUnXHJcbiAgICAgICAqICAgICAgICAgIGRhdGEtdG9nZ2xlPSdzaG93TGVmdEJhcjp0cnVlJ1xyXG4gICAgICAgKiAgICAgICAgICBkYXRhLXRvZ2dsZT0nc2hvd0xlZnRCYXI6dHJ1ZTtzaG93UmlnaHRCYXI6ZmFsc2UnXHJcbiAgICAgICAqL1xyXG4gICAgICB0aGlzLnByb3RvdHlwZS5fdG9nZ2xlRGF0YSA9IHt9O1xyXG5cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgICAqIEV4YW1wbGU6IGRhdGEtbG9hZD0ndGVzdC5qcydcclxuICAgICAgICogICAgICAgICAgZGF0YS1sb2FkPSd0ZXN0LmpzOmtleSdcclxuICAgICAgICovXHJcbiAgICAgIHRoaXMucHJvdG90eXBlLl9sb2FkRGF0YSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfV8ke3RoaXMuX2NvdW50fWA7IH1cclxuXHJcbiAgICBtYXBEYXRhQXR0ck1ldGhvZHMoYXR0cnMpIHtcclxuICAgICAgcmV0dXJuIF8ucmVkdWNlKGF0dHJzLCBmdW5jdGlvbihtYXAsIHZhbHVlKSB7XHJcbiAgICAgICAgbWFwW2BkYXRhLSR7dmFsdWV9YF0gPSBgZGF0YV8ke3ZhbHVlfWA7XHJcbiAgICAgICAgcmV0dXJuIG1hcDtcclxuICAgICAgfVxyXG4gICAgICAsIHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMucmVSZW5kZXIgPSB0aGlzLnJlUmVuZGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIF9jb3VudCArPSAxO1xyXG4gICAgICB0aGlzLl9jb3VudCA9IF9jb3VudDtcclxuICAgICAgZm9yIChsZXQga2V5IG9mIEFycmF5LmZyb20odGhpcy5zdXBwb3J0ZWRBcmdzKSkgeyBpZiAob3B0c1trZXldKSB7IHRoaXNba2V5XSA9IG9wdHNba2V5XTsgfSB9XHJcbiAgICAgIGlmICh0aGlzLnRlbXBsYXRlRXhwciB8fCB0aGlzLmluY2x1ZGUpIHsgdGhpcy51c2VUZW1wbGF0ZSA9IHRydWU7IH1cclxuICAgICAgdGhpcy5wYXJzZU9wdHMob3B0cyk7XHJcbiAgICAgIGlmICghdGhpcy5ub2RlKSB7IHJoLl9kKCdlcnJvcicsICdjb25zdHJ1Y3RvcicsIGAke3RoaXN9IGRvZXMgbm90IGhhdmUgYSBub2RlYCk7IH1cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cnVjdCgpIHtcclxuICAgICAgdGhpcy5yZXNldENvbnRlbnQoKTtcclxuICAgICAgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbnMpIHsgZm9yIChsZXQgdW5zdWIgb2YgQXJyYXkuZnJvbSh0aGlzLl9zdWJzY3JpcHRpb25zKSkgeyB1bnN1YigpOyB9IH1cclxuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtdO1xyXG4gICAgICBkZWxldGUgdGhpcy5tb2RlbDtcclxuICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLmNvbnRyb2xsZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlT3B0cyhvcHRzKSB7XHJcbiAgICAgIHRoaXMub3B0cyA9IG9wdHM7XHJcbiAgICAgIGlmIChvcHRzLmFyZykgeyB0aGlzLmtleSA9IG9wdHMuYXJnOyB9XHJcbiAgICAgIHJldHVybiAodGhpcy5wYXJzZVBpcGVkQXJnKSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlUGlwZWRBcmcoKSB7XHJcbiAgICAgIGxldCBhcmdzID0gdGhpcy5vcHRzLnBpcGVkQXJncztcclxuICAgICAgaWYgKGFyZ3MgIT0gbnVsbCA/IGFyZ3Muc2hpZnQgOiB1bmRlZmluZWQpIHsgLy9maXJzdCBwaXBlZCBhcmd1bWVudCBpcyBkZWZhdWx0IE1vZGVsXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWxBcmdzID0gXy5yZXNvbHZlTmljZUpTT04oYXJncy5zaGlmdCgpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldChrZXkpIHtcclxuICAgICAgaWYgKHRoaXMubW9kZWwgPT0gbnVsbCkgeyB0aGlzLm1vZGVsID0gbmV3IHJoLk1vZGVsKCk7IH1cclxuICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGlzaChrZXksIHZhbHVlLCBvcHRzKSB7XHJcbiAgICAgIGlmICh0aGlzLm1vZGVsID09IG51bGwpIHsgdGhpcy5tb2RlbCA9IG5ldyByaC5Nb2RlbCgpOyB9XHJcbiAgICAgIHJldHVybiB0aGlzLm1vZGVsLnB1Ymxpc2goa2V5LCB2YWx1ZSwgb3B0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKGtleSwgZm4sIG9wdHMpIHtcclxuICAgICAgaWYgKGtleSA9PSBudWxsKSB7IHJldHVybjsgfVxyXG4gICAgICBpZiAodGhpcy5tb2RlbCA9PSBudWxsKSB7IHRoaXMubW9kZWwgPSBuZXcgcmguTW9kZWwoKTsgfVxyXG4gICAgICBsZXQgdW5zdWIgPSB0aGlzLm1vZGVsLnN1YnNjcmliZShrZXksIGZuLCBvcHRzKTtcclxuICAgICAgaWYgKHRoaXMubW9kZWwuaXNHbG9iYWwoKSB8fCB0aGlzLm1vZGVsLmlzR2xvYmFsKGtleSkpIHsgdW5zdWIgPSB0aGlzLnN0b3JlU3Vic2NyaWJlKHVuc3ViKTsgfVxyXG4gICAgICByZXR1cm4gdW5zdWI7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlT25seShrZXksIGZuLCBvcHRzKSB7XHJcbiAgICAgIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IHt9OyB9XHJcbiAgICAgIG9wdHNbJ2luaXREb25lJ10gPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmUoa2V5LCBmbiwgb3B0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcmVTdWJzY3JpYmUodW5zdWIpIHtcclxuICAgICAgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbnMgPT0gbnVsbCkgeyB0aGlzLl9zdWJzY3JpcHRpb25zID0gW107IH1cclxuICAgICAgdmFyIG5ld1Vuc3ViID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmlwdGlvbnMuaW5kZXhPZihuZXdVbnN1Yik7XHJcbiAgICAgICAgaWYgKChpbmRleCAhPSBudWxsKSAmJiAoaW5kZXggIT09IC0xKSkge1xyXG4gICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5zdWIoKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKG5ld1Vuc3ViKTtcclxuICAgICAgcmV0dXJuIG5ld1Vuc3ViO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBkYXRhLWlmPVwiQHNpZGViYXJfb3BlbiB8IHNjcmVlbjogZGVza3RvcFwiXHJcbiAgICAgKiBkYXRhLWlmPVwiQHNjcmVlbi5kZXNrdG9wLmF0dGFjaGVkID09PSB0cnVlICYmIEBzaWRlYmFyX29wZW5cIlxyXG4gICAgICovXHJcbiAgICBwYXRjaFNjcmVlbk9wdGlvbnMoZXhwciwgc2NyZWVuKSB7XHJcbiAgICAgIGxldCBuYW1lcyA9IF8uaXNTdHJpbmcoc2NyZWVuKSA/IFtzY3JlZW5dICA6IHNjcmVlbjtcclxuICAgICAgbGV0IHNjcmVlbkV4cHIgPSBfLm1hcChuYW1lcywgbmFtZSA9PiBgQCR7Y29uc3RzKCdLRVlfU0NSRUVOJyl9LiR7bmFtZX0uYXR0YWNoZWRgKS5qb2luKCcgfHwgJyk7XHJcbiAgICAgIGlmIChzY3JlZW5FeHByKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3NjcmVlbkV4cHJ9ID8gKCR7ZXhwcn0pIDogbnVsbGA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cHI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXRjaERpck9wdGlvbnMoZXhwciwgZGlyKSB7XHJcbiAgICAgIHJldHVybiBgQCR7Y29uc3RzKCdLRVlfRElSJyl9ID09ICcke2Rpcn0nID8gKCR7ZXhwcn0pIDogbnVsbGA7XHJcbiAgICB9XHJcblxyXG4gICAgcGF0Y2hSYXdFeHByT3B0aW9ucyhleHByLCBvcHRzKSB7XHJcbiAgICAgIGlmIChvcHRzLnNjcmVlbikgeyBleHByID0gdGhpcy5wYXRjaFNjcmVlbk9wdGlvbnMoZXhwciwgb3B0cy5zY3JlZW4pOyB9XHJcbiAgICAgIGlmIChvcHRzLmRpciAhPSBudWxsKSB7IGV4cHIgPSB0aGlzLnBhdGNoRGlyT3B0aW9ucyhleHByLCBvcHRzLmRpcik7IH1cclxuICAgICAgcmV0dXJuIGV4cHI7XHJcbiAgICB9XHJcblxyXG4gICAgcGF0Y2hSYXdFeHByKGV4cHIsIG9wdHMpIHtcclxuICAgICAgaWYgKGV4cHIgJiYgXy5pc1ZhbGlkTW9kZWxLZXkoZXhwcikpIHsgZXhwciA9IGBAJHtleHByfWA7IH1cclxuICAgICAgaWYgKG9wdHMpIHsgZXhwciA9IHRoaXMucGF0Y2hSYXdFeHByT3B0aW9ucyhleHByLCBvcHRzKTsgfVxyXG4gICAgICByZXR1cm4gZXhwcjtcclxuICAgIH1cclxuXHJcbiAgICBzdWJzY3JpYmVFeHByKHJhd0V4cHIsIGZuLCBzdWJzLCBvcHRzKSB7XHJcbiAgICAgIGlmIChyYXdFeHByID09IG51bGwpIHsgcmV0dXJuOyB9XHJcbiAgICAgIGxldCB7Y2FsbGJhY2ssIGtleXMsIGV4cE9wdHN9ID0gdGhpcy5yZXNvbHZlUmF3RXhwcldpdGhWYWx1ZShyYXdFeHByKTtcclxuICAgICAgbGV0IHN1YnNGbiA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBjYWxsYmFjay5jYWxsKHRoaXMpLCBleHBPcHRzKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBvZiBBcnJheS5mcm9tKGtleXMpKSB7XHJcbiAgICAgICAgbGV0IHVuc3ViID0gdGhpcy5zdWJzY3JpYmVPbmx5KGtleSwgc3Vic0ZuLCBvcHRzKTtcclxuICAgICAgICBpZiAoc3VicykgeyBzdWJzLnB1c2godW5zdWIpOyB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHN1YnNGbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0Q29udGVudCgpIHtcclxuICAgICAgaWYgKHRoaXMuY2hpbGRyZW4pIHsgZm9yIChsZXQgY2hpbGQgb2YgQXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKSkgeyBjaGlsZC5kZXN0cnVjdCgpOyB9IH1cclxuICAgICAgaWYgKHRoaXMuaHRtbFN1YnMpIHsgZm9yIChsZXQgdW5zdWIgb2YgQXJyYXkuZnJvbSh0aGlzLmh0bWxTdWJzKSkgeyB1bnN1YigpOyB9IH1cclxuICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICByZXR1cm4gdGhpcy5odG1sU3VicyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENoaWxkKGNoaWxkKSB7XHJcbiAgICAgIGlmICh0aGlzLmNoaWxkcmVuID09IG51bGwpIHsgdGhpcy5jaGlsZHJlbiA9IFtdOyB9XHJcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxpbmtNb2RlbChmcm9tTW9kZWwsIGZyb21LZXksIHRvTW9kZWwsIHRvS2V5LCBvcHRzKSB7XHJcbiAgICAgIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IHt9OyB9XHJcbiAgICAgIGxldCBwYXJ0aWFsID0gKG9wdHMucGFydGlhbCAhPSBudWxsKSA/IG9wdHMucGFydGlhbCA6IGZhbHNlO1xyXG4gICAgICByZXR1cm4gdGhpcy5zdG9yZVN1YnNjcmliZShmcm9tTW9kZWwuc3Vic2NyaWJlKGZyb21LZXksIHZhbHVlID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ndWFyZCgoKCkgPT4gdG9Nb2RlbC5wdWJsaXNoKHRvS2V5LCB2YWx1ZSwge3N5bmM6IHRydWV9KSksIHRoaXMudG9TdHJpbmcoKSk7XHJcbiAgICAgIH1cclxuICAgICAgLCB7cGFydGlhbH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChwYXJlbnQpIHtcclxuICAgICAgbGV0IGluaXRFeHByO1xyXG4gICAgICBpZiAodGhpcy5pbml0RG9uZSkgeyByZXR1cm47IH1cclxuICAgICAgdGhpcy5pbml0RG9uZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuaW5pdFBhcmVudChwYXJlbnQpO1xyXG4gICAgICAodGhpcy5pbml0TW9kZWwpKCk7XHJcblxyXG4gICAgICBpZiAoaW5pdEV4cHIgPSAkLmRhdGFzZXQodGhpcy5ub2RlLCAnaW5pdCcpKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhX2luaXQodGhpcy5ub2RlLCBpbml0RXhwcik7XHJcbiAgICAgICAgJC5kYXRhc2V0KHRoaXMubm9kZSwgJ2luaXQnLCBudWxsKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlT25seSh0aGlzLm9wdHMucmVuZGVya2V5LCB0aGlzLnJlUmVuZGVyLCB7cGFydGlhbDogZmFsc2V9KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UGFyZW50KHBhcmVudCkge1xyXG4gICAgICBpZiAocGFyZW50KSB7IHBhcmVudC5hZGRDaGlsZCh0aGlzKTsgfVxyXG4gICAgICBsZXQgcGFyZW50TW9kZWwgPSAocGFyZW50ICE9IG51bGwgPyBwYXJlbnQubW9kZWwgOiB1bmRlZmluZWQpIHx8IHJoLm1vZGVsO1xyXG4gICAgICBsZXQgaW5wdXQgPSBfX2d1YXJkX18oJC5kYXRhc2V0KHRoaXMubm9kZSwgJ2lucHV0JyksIHggPT4geC50cmltKCkpO1xyXG4gICAgICBsZXQgb3V0cHV0ID0gX19ndWFyZF9fKCQuZGF0YXNldCh0aGlzLm5vZGUsICdvdXRwdXQnKSwgeDEgPT4geDEudHJpbSgpKTtcclxuXHJcbiAgICAgIGlmICgoaW5wdXQgPT09ICcuJykgfHwgKG91dHB1dCA9PT0gJy4nKSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsID0gcGFyZW50TW9kZWw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGtleXMsIG9wdHM7XHJcbiAgICAgICAgaWYgKGlucHV0IHx8IG91dHB1dCB8fCB0aGlzLmtleSkgeyBpZiAodGhpcy5tb2RlbCA9PSBudWxsKSB7IHRoaXMubW9kZWwgPSBuZXcgcmguTW9kZWwoKTsgfSB9XHJcbiAgICAgICAgaWYgKGlucHV0KSB7XHJcbiAgICAgICAgICAoe2tleXMsIG9wdHN9ID0gXy5yZXNvbHZlSW5wdXRLZXlzKGlucHV0KSk7XHJcbiAgICAgICAgICBfLmVhY2goa2V5cywgZnVuY3Rpb24ocGFyZW50S2V5LCBrZXkpIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudEtleSA9PSBudWxsKSB7IHBhcmVudEtleSA9IGtleTsgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saW5rTW9kZWwocGFyZW50TW9kZWwsIHBhcmVudEtleSwgdGhpcy5tb2RlbCwga2V5LCBvcHRzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvdXRwdXQpIHtcclxuICAgICAgICAgICh7a2V5cywgb3B0c30gPSBfLnJlc29sdmVJbnB1dEtleXMob3V0cHV0KSk7XHJcbiAgICAgICAgICByZXR1cm4gXy5lYWNoKGtleXMsIGZ1bmN0aW9uKHBhcmVudEtleSwga2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRLZXkgPT0gbnVsbCkgeyBwYXJlbnRLZXkgPSBrZXk7IH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlua01vZGVsKHRoaXMubW9kZWwsIGtleSwgcGFyZW50TW9kZWwsIHBhcmVudEtleSwgb3B0cyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRNb2RlbCgpIHtcclxuICAgICAgaWYgKHRoaXMubW9kZWxBcmdzKSB7XHJcbiAgICAgICAgXy5lYWNoKHRoaXMubW9kZWxBcmdzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5wdWJsaXNoKGtleSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAsIHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5tb2RlbEFyZ3M7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0VUkoKSB7XHJcbiAgICAgIGlmIChyaC5fZGVidWcpIHtcclxuICAgICAgICBsZXQgbG9hZGVkV2lkZ2V0cyA9ICQuZGF0YXNldCh0aGlzLm5vZGUsICdsb2FkZWQnKTtcclxuICAgICAgICBpZiAobG9hZGVkV2lkZ2V0cykgeyBsb2FkZWRXaWRnZXRzID0gYCR7bG9hZGVkV2lkZ2V0c307JHt0aGlzfWA7IH1cclxuICAgICAgICAkLmRhdGFzZXQodGhpcy5ub2RlLCAnbG9hZGVkJywgbG9hZGVkV2lkZ2V0cyB8fCB0aGlzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkLmRhdGFzZXQodGhpcy5ub2RlLCAnbG9hZGVkJywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnRlbXBsYXRlRXhwcikgeyAodGhpcy5zdWJzY3JpYmVUZW1wbGF0ZUV4cHIpKCk7IH1cclxuICAgICAgaWYgKHRoaXMuaW5jbHVkZSkgeyAodGhpcy5zdWJzY3JpYmVJbmNsdWRlUGF0aCkoKTsgfVxyXG4gICAgICBpZiAodGhpcy50cGxOb2RlID09IG51bGwpIHsgdGhpcy50cGxOb2RlID0gdGhpcy5ub2RlOyB9XHJcbiAgICAgIHJldHVybiAodGhpcy5yZXNldENvbnRlbnQpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlVGVtcGxhdGVFeHByKCkge1xyXG4gICAgICBsZXQgY29uc3RydWN0aW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5zdWJzY3JpYmVFeHByKHRoaXMudGVtcGxhdGVFeHByLCBmdW5jdGlvbih0ZW1wbGF0ZSkge1xyXG4gICAgICAgIHRoaXMudHBsTm9kZSA9ICQuY3JlYXRlRWxlbWVudCgnZGl2JywgdGVtcGxhdGUpLmZpcnN0Q2hpbGQ7XHJcbiAgICAgICAgaWYgKCFjb25zdHJ1Y3RpbmcpIHsgcmV0dXJuIHRoaXMucmVSZW5kZXIodHJ1ZSk7IH1cclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0cnVjdGluZyA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZUV4cHIgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlSW5jbHVkZVBhdGgoKSB7XHJcbiAgICAgIF8ucmVxdWlyZSh0aGlzLmluY2x1ZGUsIHRlbXBsYXRlID0+IHRoaXMuc2V0VGVtcGxhdGUodGVtcGxhdGUpKTtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5jbHVkZSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUZW1wbGF0ZSh0ZW1wbGF0ZSkge1xyXG4gICAgICB0aGlzLnVzZVRlbXBsYXRlID0gdHJ1ZTtcclxuICAgICAgdGhpcy50cGxOb2RlID0gJC5jcmVhdGVFbGVtZW50KCdkaXYnLCB0ZW1wbGF0ZSkuZmlyc3RDaGlsZDtcclxuICAgICAgcmV0dXJuIHRoaXMucmVSZW5kZXIodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVSZW5kZXIocmVuZGVyKSB7IGlmICgocmVuZGVyICE9IG51bGwpICYmIHRoaXMudHBsTm9kZSkgeyByZXR1cm4gdGhpcy5yZW5kZXIoKTsgfSB9XHJcblxyXG4gICAgcHJlUmVuZGVyKCkge1xyXG4gICAgICBsZXQgb2xkTm9kZTtcclxuICAgICAgaWYgKHRoaXMudXNlVGVtcGxhdGUpIHtcclxuICAgICAgICBvbGROb2RlID0gdGhpcy5ub2RlO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMudHBsTm9kZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG9sZE5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdFJlbmRlcihvbGROb2RlKSB7XHJcbiAgICAgIGlmIChvbGROb2RlICYmIG9sZE5vZGUucGFyZW50Tm9kZSkge1xyXG4gICAgICAgIHJldHVybiBvbGROb2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRoaXMubm9kZSwgb2xkTm9kZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbHRlck5vZGVDb250ZW50KCkge31cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgIGlmIChyaC5fdGVzdCkgeyByaC5tb2RlbC5wdWJsaXNoKGB0ZXN0LiR7dGhpc30ucmVuZGVyLmJlZ2luYCwgXy50aW1lKCkpOyB9XHJcbiAgICAgIHRoaXMuaW5pdFVJKCk7XHJcbiAgICAgIGxldCBvbGROb2RlID0gdGhpcy5wcmVSZW5kZXIoKTtcclxuICAgICAgdGhpcy5ub2RlSG9sZGVyID0gbmV3IHJoLk5vZGVIb2xkZXIoW3RoaXMubm9kZV0pO1xyXG4gICAgICAodGhpcy5hbHRlck5vZGVDb250ZW50KSgpO1xyXG4gICAgICB0aGlzLnJlc29sdmVEYXRhQXR0cnModGhpcy5ub2RlKTtcclxuICAgICAgXy5sb2FkRGF0YUhhbmRsZXJzKHRoaXMubm9kZSwgdGhpcyk7XHJcbiAgICAgIHRoaXMucG9zdFJlbmRlcihvbGROb2RlKTtcclxuICAgICAgaWYgKHJoLl90ZXN0KSB7IHJldHVybiByaC5tb2RlbC5wdWJsaXNoKGB0ZXN0LiR7dGhpc30ucmVuZGVyLmVuZGAsIF8udGltZSgpKTsgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzVmlzaWJsZSgpIHsgcmV0dXJuIHRoaXMubm9kZUhvbGRlci5pc1Zpc2libGUoKTsgfVxyXG5cclxuICAgIHNob3coKSB7IHJldHVybiB0aGlzLm5vZGVIb2xkZXIuc2hvdygpOyB9XHJcblxyXG4gICAgaGlkZSgpIHsgcmV0dXJuIHRoaXMubm9kZUhvbGRlci5oaWRlKCk7IH1cclxuXHJcbiAgICB0b2dnbGUoKSB7IGlmICh0aGlzLmlzVmlzaWJsZSgpKSB7IHJldHVybiB0aGlzLmhpZGUoKTsgfSBlbHNlIHsgcmV0dXJuIHRoaXMuc2hvdygpOyB9IH1cclxuXHJcbiAgICBpc1dpZGdldE5vZGUobm9kZSkgeyByZXR1cm4gJC5kYXRhc2V0KG5vZGUsICdyaHdpZGdldCcpOyB9XHJcblxyXG4gICAgaXNEZXNjZW5kZW50KG5vZGUpIHtcclxuICAgICAgbGV0IG5lc3RlZFdpZGdldDtcclxuICAgICAgbGV0IGNoaWxkID0gbm9kZTtcclxuICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBsZXQgcGFyZW50ID0gY2hpbGQucGFyZW50Tm9kZTtcclxuICAgICAgICBpZiAoIXBhcmVudCkgeyBicmVhazsgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzV2lkZ2V0Tm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgIG5lc3RlZFdpZGdldCA9IHBhcmVudDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlID09PSBwYXJlbnQpIHsgYnJlYWs7IH1cclxuICAgICAgICBjaGlsZCA9IHBhcmVudDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gKG5lc3RlZFdpZGdldCAhPSBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBlYWNoQ2hpbGQoc2VsZWN0b3IsIGZuKSB7XHJcbiAgICAgIHJldHVybiAkLmVhY2hDaGlsZCh0aGlzLm5vZGUsIHNlbGVjdG9yLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzY2VuZGVudChub2RlKSkgeyByZXR1cm4gZm4uY2FsbCh0aGlzLCBub2RlKTsgfVxyXG4gICAgICB9XHJcbiAgICAgICwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZWFjaERhdGFOb2RlKGRhdGFBdHRyLCBmbikge1xyXG4gICAgICByZXR1cm4gJC5lYWNoRGF0YU5vZGUodGhpcy5ub2RlLCBkYXRhQXR0ciwgZnVuY3Rpb24obm9kZSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNEZXNjZW5kZW50KG5vZGUpKSB7IHJldHVybiBmbi5jYWxsKHRoaXMsIG5vZGUsIHZhbHVlKTsgfVxyXG4gICAgICB9XHJcbiAgICAgICwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhdmVyc2VOb2RlKG5vZGUsIHByZSwgcG9zdCkge1xyXG4gICAgICByZXR1cm4gJC50cmF2ZXJzZU5vZGUobm9kZSwgcHJlLCBwb3N0LCBmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5pc0Rlc2NlbmRlbnQoY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICAgICwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZURhdGFBdHRycyhwbm9kZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmF2ZXJzZU5vZGUocG5vZGUsIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICBsZXQgcmVwZWF0VmFsO1xyXG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHJlcGVhdFZhbCA9ICQuZGF0YXNldChub2RlLCAncmVwZWF0JykpKSB7XHJcbiAgICAgICAgICB0aGlzLmRhdGFfcmVwZWF0KG5vZGUsIHJlcGVhdFZhbCk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQuZWFjaEF0dHJpYnV0ZXMobm9kZSwgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgbGV0IGZuTmFtZSA9IHRoaXMuZGF0YUF0dHJNZXRob2RzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZm5OYW1lICYmIHZhbHVlKSB7IHJldHVybiB0aGlzW2ZuTmFtZV0uY2FsbCh0aGlzLCBub2RlLCB2YWx1ZSk7IH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgICwgdGhpcyk7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVSZXBlYXRFeHByKHJhd0V4cHIpIHtcclxuICAgICAgbGV0IHZhbHVlcyA9IF8ucmVzb2x2ZVBpcGVkRXhwcmVzc2lvbihyYXdFeHByKTtcclxuICAgICAgbGV0IG9wdHMgPSB2YWx1ZXNbMV0gJiYgXy5yZXNvbHZlTmljZUpTT04odmFsdWVzWzFdKTtcclxuICAgICAgbGV0IGRhdGEgPSBfLnJlc29sdmVMb29wRXhwcih2YWx1ZXNbMF0pO1xyXG4gICAgICBpZiAob3B0cyAhPSBudWxsID8gb3B0cy5maWx0ZXIgOiB1bmRlZmluZWQpIHtcclxuICAgICAgICBkYXRhWydmaWx0ZXInXSA9IHRoaXMuX2V2YWxGdW5jdGlvbignaXRlbSwgaW5kZXgnLCBvcHRzLmZpbHRlcik7XHJcbiAgICAgIH1cclxuICAgICAgZGF0YVsnc3RlcCddID0gKG9wdHMgIT0gbnVsbCA/IG9wdHMuc3RlcCA6IHVuZGVmaW5lZCkgfHwgMTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHZhck5hbWU6IEV4OiAje0BkYXRhLnRpdGxlfSBtZWFucyBpdGVtLmRhdGEudGl0bGVcclxuICAgICAqL1xyXG4gICAgcmVzb2x2ZVJlcGVhdFZhcihleHByLCBpdGVtLCBpbmRleCwgY2FjaGUsIG5vZGUpIHtcclxuICAgICAgcmV0dXJuIGNhY2hlW2V4cHJdID0gY2FjaGVbZXhwcl0gfHwgKCgpID0+IHsgc3dpdGNoIChleHByKSB7XHJcbiAgICAgICAgY2FzZSAnQGluZGV4JzogcmV0dXJuIGluZGV4O1xyXG4gICAgICAgIGNhc2UgJ0BzaXplJzogcmV0dXJuIGl0ZW0ubGVuZ3RoO1xyXG4gICAgICAgIGNhc2UgJ3RoaXMnOiByZXR1cm4gaXRlbTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgaWYgKF8uaXNWYWxpZE1vZGVsS2V5KGV4cHIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLmdldChpdGVtLCBleHByKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZUlEYXRhRXhwcihub2RlLCBleHByLCBpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0gfSkoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlRW5jbG9zZWRWYXIodmFsdWUsIGl0ZW0sIGluZGV4LCBpdGVtQ2FjaGUsIG5vZGUpIHtcclxuICAgICAgcmV0dXJuIF8ucmVzb2x2ZUVuY2xvc2VkVmFyKHZhbHVlLCBmdW5jdGlvbih2YXJOYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZVJlcGVhdFZhcih2YXJOYW1lLCBpdGVtLCBpbmRleCwgaXRlbUNhY2hlLCBub2RlKTtcclxuICAgICAgfVxyXG4gICAgICAsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUVuY2xvc2VWYXIobmFtZSwgdmFsdWUsIGl0ZW0sIGluZGV4LCBpdGVtQ2FjaGUsIG5vZGUpIHtcclxuICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5yZXNvbHZlRW5jbG9zZWRWYXIodmFsdWUsIGl0ZW0sIGluZGV4LCBpdGVtQ2FjaGUsIG5vZGUpO1xyXG4gICAgICBpZiAobmV3VmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgJC5yZW1vdmVBdHRyaWJ1dGUobm9kZSwgbmFtZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAobmV3VmFsdWUgIT09IHZhbHVlKSB7XHJcbiAgICAgICAgJC5zZXRBdHRyaWJ1dGUobm9kZSwgbmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVXaWRnZXRFbmNsb3NlVmFyKGl0ZW0sIGluZGV4LCBpdGVtQ2FjaGUsIG5vZGUpIHtcclxuICAgICAgcmV0dXJuIF8uZWFjaChbJ3Jod2lkZ2V0JywgJ2lucHV0JywgJ291dHB1dCcsICdpbml0J10sIGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlID0gJC5kYXRhc2V0KG5vZGUsIG5hbWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVFbmNsb3NlVmFyKGBkYXRhLSR7bmFtZX1gLCB2YWx1ZSwgaXRlbSwgaW5kZXgsIGl0ZW1DYWNoZSwgbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgICwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNSZXBlYXQobm9kZSkge1xyXG4gICAgICByZXR1cm4gJC5kYXRhc2V0KG5vZGUsICdyZXBlYXQnKSB8fCAkLmRhdGFzZXQobm9kZSwgJ2lyZXBlYXQnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlTmVzdGVkUmVwZWF0KG5vZGUsIGl0ZW0sIGluZGV4LCBpdGVtQ2FjaGUpIHtcclxuICAgICAgcmV0dXJuIF8uZWFjaChbJ3JlcGVhdCcsICdpcmVwZWF0J10sIGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlID0gJC5kYXRhc2V0KG5vZGUsIG5hbWUpKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMudXBkYXRlRW5jbG9zZVZhcihgZGF0YS0ke25hbWV9YCwgdmFsdWUsXHJcbiAgICAgICAgICAgIGl0ZW0sIGluZGV4LCBpdGVtQ2FjaGUsIG5vZGUpO1xyXG4gICAgICAgICAgaWYgKHZhbHVlICE9PSAnJykgeyByZXR1cm4gKHR5cGVvZiB0aGlzW2BkYXRhXyR7bmFtZX1gXSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXNbYGRhdGFfJHtuYW1lfWBdKG5vZGUsIHZhbHVlLCBpdGVtLCBpbmRleCkgOiB1bmRlZmluZWQpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgICwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZUl0ZW1JbmRleChwbm9kZSwgaXRlbSwgaW5kZXgpIHtcclxuICAgICAgaWYgKCFwbm9kZS5jaGlsZHJlbikgeyByZXR1cm47IH1cclxuICAgICAgbGV0IGl0ZW1DYWNoZSA9IHt9O1xyXG4gICAgICByZXR1cm4gJC50cmF2ZXJzZU5vZGUocG5vZGUsIG5vZGUgPT4ge1xyXG4gICAgICAgIGlmICgobm9kZSAhPT0gcG5vZGUpICYmICQuZGF0YXNldChub2RlLCAncmh3aWRnZXQnKSkge1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVXaWRnZXRFbmNsb3NlVmFyKGl0ZW0sIGluZGV4LCBpdGVtQ2FjaGUsIG5vZGUpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNSZXBlYXQobm9kZSkpIHtcclxuICAgICAgICAgIHRoaXMucmVzb2x2ZU5lc3RlZFJlcGVhdChub2RlLCBpdGVtLCBpbmRleCwgaXRlbUNhY2hlKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZWFjaEF0dHJpYnV0ZXMobm9kZSwgZnVuY3Rpb24obmFtZSwgdmFsdWUsIGF0dHJzSW5mbykge1xyXG4gICAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGxldCBmbk5hbWU7XHJcbiAgICAgICAgICAgIGlmICgwID09PSBuYW1lLnNlYXJjaCgnZGF0YS0nKSkge1xyXG4gICAgICAgICAgICAgIHZhbHVlID0gdGhpcy51cGRhdGVFbmNsb3NlVmFyKG5hbWUsIHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgaXRlbSwgaW5kZXgsIGl0ZW1DYWNoZSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSAnJykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmbk5hbWUgPSB0aGlzLmRhdGFJQXR0ck1ldGhvZHNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICBpZiAodGhpc1tmbk5hbWVdLmNhbGwodGhpcywgbm9kZSwgdmFsdWUsIGl0ZW0sIGluZGV4LCBhdHRyc0luZm8pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5yZW1vdmVBdHRyaWJ1dGUobm9kZSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKDAgPT09IG5hbWUuc2VhcmNoKCdkYXRhLWktJykpIHtcclxuICAgICAgICAgICAgICB0aGlzLmRhdGFfaUhhbmRsZXIobm9kZSwgdmFsdWUsIGl0ZW0sIGluZGV4LCBuYW1lLnN1YnN0cmluZyg3KSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICQucmVtb3ZlQXR0cmlidXRlKG5vZGUsIG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICwgdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGd1YXJkKGZuLCBndWFyZE5hbWUpIHtcclxuICAgICAgaWYgKGd1YXJkTmFtZSA9PSBudWxsKSB7IGd1YXJkTmFtZSA9ICd1aSc7IH1cclxuICAgICAgcmV0dXJuIHN1cGVyLmd1YXJkKGZuLCBndWFyZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGFfcmVwZWF0KG5vZGUsIHJhd0V4cHIpIHtcclxuICAgICAgJC5kYXRhc2V0KG5vZGUsICdyZXBlYXQnLCBudWxsKTtcclxuICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcmVwZWF0Jyk7XHJcbiAgICAgIGxldCBvcHRzID0gdGhpcy5yZXNvbHZlUmVwZWF0RXhwcihyYXdFeHByKTtcclxuXHJcbiAgICAgIGxldCBub2RlSG9sZGVyID0gbmV3IHJoLk5vZGVIb2xkZXIoW25vZGVdKTtcclxuICAgICAgdGhpcy5zdWJzY3JpYmVEYXRhRXhwcihvcHRzLmV4cHIsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgLy9UT0RPIHVzdWIgb2xkIHN1YnMgdXNpbmcgc3RhY2sgb2YgaHRtbCBzdWJzXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcGVhdE5vZGVzKG5vZGVIb2xkZXIsIHJlc3VsdCwgb3B0cywgbm9kZSk7XHJcbiAgICAgIH1cclxuICAgICAgLCB7cGFydGlhbDogZmFsc2V9KTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9pZiBzdGF0ZW1lbnQgZm9yIGRhdGEtcmVwZWF0IGxpa2Ugc3RydWN0dXJlXHJcbiAgICByZXNvbHZlX3JpZihub2RlLCBpdGVtLCBpbmRleCkge1xyXG4gICAgICBsZXQgY2FsbGJhY2ssIGNsb25lTm9kZSwgcmF3RXhwcjtcclxuICAgICAgaWYgKHJhd0V4cHIgPSAkLmRhdGFzZXQobm9kZSwgJ3JpZicpKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSB0aGlzLl9ldmFsRnVuY3Rpb24oJ2l0ZW0sIGluZGV4JywgcmF3RXhwcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghY2FsbGJhY2sgfHwgY2FsbGJhY2suY2FsbCh0aGlzLCBpdGVtLCBpbmRleCkpIHtcclxuICAgICAgICBjbG9uZU5vZGUgPSBub2RlLmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICAgICAgJC5kYXRhc2V0KGNsb25lTm9kZSwgJ3JpZicsIG51bGwpO1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20obm9kZS5jaGlsZE5vZGVzKSkge1xyXG4gICAgICAgICAgbGV0IGNsb25lQ2hpbGQgPSB0aGlzLnJlc29sdmVfcmlmKGNoaWxkLCBpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgICBpZiAoY2xvbmVDaGlsZCkgeyBjbG9uZU5vZGUuYXBwZW5kQ2hpbGQoY2xvbmVDaGlsZCk7IH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNsb25lTm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBfZnVuY3Rpb24oYXJnLCBleHByLCBrZXlzKSB7XHJcbiAgICAgIGxldCBkYXRhID0gdGhpcy5yZXNvbHZlRXhwcmVzc2lvbihleHByKTtcclxuICAgICAgaWYgKGtleXMpIHsgZm9yIChsZXQga2V5IG9mIEFycmF5LmZyb20oZGF0YS5rZXlzKSkgeyBrZXlzLnB1c2goa2V5KTsgfSB9XHJcbiAgICAgIHJldHVybiB0aGlzLl9zYWZlRnVuY3Rpb24oYXJnLCBkYXRhLmV4cHIpO1xyXG4gICAgfVxyXG5cclxuICAgIF9ldmFsRnVuY3Rpb24oYXJnLCBleHByLCBrZXlzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9mdW5jdGlvbihhcmcsIGByZXR1cm4gJHtleHByfTtgLCBrZXlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyMjIyMjIyMjIyMgbGlzdCBvciByZXBlYXQgaXRlbXMgZGF0YSBhdHRyaWJ1dGVzIGhhbmRsaW5nICMjIyMjIyMjIyMjI1xyXG4gICAgX3NldExvb3BWYXIob3B0cywgaXRlbSwgaW5kZXgpIHtcclxuICAgICAgbGV0IG9sZFZhbHVlID0ge307XHJcbiAgICAgIGlmIChvcHRzLml0ZW0pIHtcclxuICAgICAgICBvbGRWYWx1ZVsnaXRlbSddID0gdGhpcy51c2VyX3ZhcnNbb3B0cy5pdGVtXTtcclxuICAgICAgICB0aGlzLnVzZXJfdmFyc1tvcHRzLml0ZW1dID0gaXRlbTtcclxuICAgICAgfVxyXG4gICAgICBpZiAob3B0cy5pbmRleCkge1xyXG4gICAgICAgIG9sZFZhbHVlWydpbmRleCddID0gdGhpcy51c2VyX3ZhcnNbb3B0cy5pbmRleF07XHJcbiAgICAgICAgdGhpcy51c2VyX3ZhcnNbb3B0cy5pbmRleF0gPSBpbmRleDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gb2xkVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3JlcGVhdE5vZGVzKG5vZGVIb2xkZXIsIHJlc3VsdCwgb3B0cywgdG1wbE5vZGUpIHtcclxuICAgICAgbGV0IGNsb25lTm9kZTtcclxuICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7IHJlc3VsdCA9IFtdOyB9XHJcbiAgICAgIGlmICh0aGlzLnVzZXJfdmFycyA9PSBudWxsKSB7IHRoaXMudXNlcl92YXJzID0ge307IH1cclxuICAgICAgbGV0IG5ld05vZGVzID0gW107XHJcbiAgICAgIGxldCB7ZmlsdGVyLCBzdGVwfSA9IG9wdHM7XHJcbiAgICAgIGZvciAobGV0IHN0ZXAxID0gc3RlcCwgYXNjID0gc3RlcDEgPiAwLCBpbmRleCA9IGFzYyA/IDAgOiByZXN1bHQubGVuZ3RoIC0gMTsgYXNjID8gaW5kZXggPCByZXN1bHQubGVuZ3RoIDogaW5kZXggPj0gMDsgaW5kZXggKz0gc3RlcDEpIHtcclxuICAgICAgICBsZXQgaXRlbSA9IHJlc3VsdFtpbmRleF07XHJcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gdGhpcy5fc2V0TG9vcFZhcihvcHRzLCBpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgaWYgKCFmaWx0ZXIgfHwgZmlsdGVyLmNhbGwodGhpcywgaXRlbSwgaW5kZXgpKSB7XHJcbiAgICAgICAgICBpZiAoY2xvbmVOb2RlID0gdGhpcy5yZXNvbHZlX3JpZih0bXBsTm9kZSwgaXRlbSwgaW5kZXgpKSB7XHJcbiAgICAgICAgICAgIG5ld05vZGVzLnB1c2goY2xvbmVOb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlSXRlbUluZGV4KGNsb25lTm9kZSwgaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVEYXRhQXR0cnMoY2xvbmVOb2RlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2V0TG9vcFZhcihvcHRzLCBvbGRWYWx1ZS5pdGVtLCBvbGRWYWx1ZS5pbmRleCk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBpZiAobmV3Tm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgbGV0IHRlbXBOb2RlID0gdG1wbE5vZGUuY2xvbmVOb2RlKGZhbHNlKTtcclxuICAgICAgICAkLmFkZENsYXNzKHRlbXBOb2RlLCAncmgtaGlkZScpO1xyXG4gICAgICAgIG5ld05vZGVzLnB1c2godGVtcE5vZGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbm9kZUhvbGRlci51cGRhdGVOb2RlcyhuZXdOb2Rlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YV9pcmVwZWF0KG5vZGUsIHJhd0V4cHIsIGl0ZW0sIGluZGV4LCBhdHRyc0luZm8pIHtcclxuICAgICAgJC5kYXRhc2V0KG5vZGUsICdpcmVwZWF0JywgbnVsbCk7XHJcbiAgICAgIGxldCBvcHRzID0gdGhpcy5yZXNvbHZlUmVwZWF0RXhwcihyYXdFeHByKTtcclxuICAgICAgbGV0IG5vZGVIb2xkZXIgPSBuZXcgcmguTm9kZUhvbGRlcihbbm9kZV0pO1xyXG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5zdWJzY3JpYmVJRGF0YUV4cHIobm9kZSwgb3B0cy5leHByLCBpdGVtLCBpbmRleCk7XHJcbiAgICAgIHRoaXMuX3JlcGVhdE5vZGVzKG5vZGVIb2xkZXIsIHJlc3VsdCwgb3B0cywgbm9kZSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBoZWxwZXIgbWV0aG9kIGZvciByKHJlcGVhdCkgYXR0cmlidXRlc1xyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVJRGF0YUV4cHIobm9kZSwgcmF3RXhwciwgaXRlbSwgaW5kZXgsIGF0dHJzSW5mbykge1xyXG4gICAgICBsZXQgZXhwckZuID0gdGhpcy5fZXZhbEZ1bmN0aW9uKCdpdGVtLCBpbmRleCwgbm9kZScsIHJhd0V4cHIpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBleHByRm4uY2FsbCh0aGlzLCBpdGVtLCBpbmRleCwgbm9kZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKHJoLl9kZWJ1ZykgeyByZXR1cm4gcmguX2QoJ2Vycm9yJywgYGlFeHByZXNzaW9uOiAke3Jhd0V4cHJ9YCwgZXJyb3IubWVzc2FnZSk7IH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBnZXQgdGhlIGtleSB2YWx1ZSBhbmQgZmlsbHMgaXRzIHZhbHVlIGFzIHRleHQgY29udGVudFxyXG4gICAgICogRXhhbXBsZTogPGEgZGF0YS1pdGV4dD1cIml0ZW0udGl0bGVcIj50ZW1wIHZhbHVlPC9hPlxyXG4gICAgICogICAgICAgICAgPGRpdiBkYXRhLWl0ZXh0PVwiQGtleVwiPnRlbXAgdmFsdWU8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgZGF0YV9pdGV4dChub2RlLCByYXdFeHByLCBpdGVtLCBpbmRleCwgYXR0cnNJbmZvKSB7XHJcbiAgICAgICQudGV4dENvbnRlbnQobm9kZSwgdGhpcy5zdWJzY3JpYmVJRGF0YUV4cHIobm9kZSwgcmF3RXhwciwgaXRlbSwgaW5kZXgpKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGdldCB0aGUga2V5IHZhbHVlIGFuZCBmaWxscyBpdHMgdmFsdWUgYXMgSFRNTCBjb250ZW50XHJcbiAgICAgKiBFeGFtcGxlOiA8YSBkYXRhLWlodG1sPVwiaXRlbS5kYXRhXCI+dGVtcCB2YWx1ZTwvYT5cclxuICAgICAqICAgICAgICAgIDxkaXYgZGF0YS1paHRtbD1cIkBrZXlcIj50ZW1wIHZhbHVlPC9kaXY+XHJcbiAgICAgKi9cclxuICAgIGRhdGFfaWh0bWwobm9kZSwgcmF3RXhwciwgaXRlbSwgaW5kZXgsIGF0dHJzSW5mbykge1xyXG4gICAgICBub2RlLmlubmVySFRNTCA9IHRoaXMuc3Vic2NyaWJlSURhdGFFeHByKG5vZGUsIHJhd0V4cHIsIGl0ZW0sIGluZGV4KTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGdldCB0aGUga2V5IHZhbHVlIGFuZCBmaWxscyBpdHMgdmFsdWUgYXMgdGV4dCBjb250ZW50XHJcbiAgICAgKiBFeGFtcGxlOiA8YSBkYXRhLWljbGFzcz1cIml0ZW0uZGF0YT8nZW5hYmxlZCc6J2Rpc2FibGVkJ1wiPnRlbXAgdmFsdWU8L2E+XHJcbiAgICAgKiAgICAgICAgICA8ZGl2IGRhdGEtaWNsYXNzPVwiQGtleVwiPnRlbXAgdmFsdWU8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgZGF0YV9pY2xhc3Mobm9kZSwgcmF3RXhwciwgaXRlbSwgaW5kZXgsIGF0dHJzSW5mbykge1xyXG4gICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5zdWJzY3JpYmVJRGF0YUV4cHIobm9kZSwgcmF3RXhwciwgaXRlbSwgaW5kZXgpO1xyXG4gICAgICBpZiAoY2xhc3NOYW1lKSB7ICQuYWRkQ2xhc3Mobm9kZSwgY2xhc3NOYW1lKTsgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogZ2V0IHRoZSBrZXkgdmFsdWUgYW5kIGZpbGxzIGl0cyB2YWx1ZSBhcyB0ZXh0IGNvbnRlbnRcclxuICAgICAqIEV4YW1wbGU6IDxhIGRhdGEtaWhyZWY9XCJpdGVtLnVybFwiPnRlbXAgdmFsdWU8L2E+XHJcbiAgICAgKiAgICAgICAgICA8ZGl2IGRhdGEtaWlkPVwiaXRlbS5pZFwiPnRlbXAgdmFsdWU8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgZGF0YV9pSGFuZGxlcihub2RlLCByYXdFeHByLCBpdGVtLCBpbmRleCwgYXR0ck5hbWUpIHtcclxuICAgICAgbGV0IGF0dHJWYWx1ZSA9IHRoaXMuc3Vic2NyaWJlSURhdGFFeHByKG5vZGUsIHJhd0V4cHIsIGl0ZW0sIGluZGV4KTtcclxuICAgICAgaWYgKGF0dHJWYWx1ZSkgeyAkLnNldEF0dHJpYnV0ZShub2RlLCBhdHRyTmFtZSwgYXR0clZhbHVlKTsgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyMjIyMjIyMjIyMjIyMjIyMgU3RhdGljIGRhdGEgYXR0cmlidXRlcyBoYW5kbGluZyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG4gICAgLyogZ2V0IHRoZSBrZXkgdmFsdWUgYXQgdGhlIHRpbWUgb2YgcmVuZGVyaW5nXHJcbiAgICAgKiBhbmQgZmlsbHMgaXRzIHZhbHVlIGFzIGh0bWwgY29udGVudFxyXG4gICAgICogRXhhbXBsZTogPGEgZGF0YS1zaHRtbD1cImtleVwiPnRlbXAgdmFsdWU8L2E+XHJcbiAgICAgKiAgICAgICAgICA8ZGl2IGRhdGEtc2h0bWw9XCJrZXlcIj50ZW1wIHZhbHVlPC9kaXY+XHJcbiAgICAgKi9cclxuICAgIGRhdGFfc2h0bWwobm9kZSwga2V5KSB7XHJcbiAgICAgICQucmVtb3ZlQXR0cmlidXRlKG5vZGUsICdkYXRhLXNodG1sJyk7XHJcbiAgICAgIHJldHVybiBub2RlLmlubmVySFRNTCA9IHRoaXMuZ2V0KGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGdldCB0aGUga2V5IHZhbHVlIGFuZCBmaWxscyBpdHMgdmFsdWUgYXMgdGV4dCBjb250ZW50XHJcbiAgICAgKiBFeGFtcGxlOiA8YSBkYXRhLXN0ZXh0PVwia2V5XCI+dGVtcCB2YWx1ZTwvYT5cclxuICAgICAqICAgICAgICAgIDxkaXYgZGF0YS1zdGV4dD1cImtleVwiPnRlbXAgdmFsdWU8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgZGF0YV9zdGV4dChub2RlLCBrZXkpIHtcclxuICAgICAgJC5yZW1vdmVBdHRyaWJ1dGUobm9kZSwgJ2RhdGEtc3RleHQnKTtcclxuICAgICAgcmV0dXJuICQudGV4dENvbnRlbnQobm9kZSwgdGhpcy5nZXQoa2V5KSB8fCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jIyMjIyMjIyMjIyMjIyMjIEdlbmVyaWMgZGF0YSBhdHRyaWJ1dGVzIGhhbmRsaW5nICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcbiAgICAvKlxyXG4gICAgICogZXZhbHVhdGVzIGV4cHJlc3Npb24gdmFsdWUgdG8gaW5pdFxyXG4gICAgICogRXhhbXBsZTogZGF0YS1pbml0PVwiQGtleSh0cnVlKVwiXHJcbiAgICAgKiAgICAgICAgICBkYXRhLWluaXQ9XCJyaC5fLmxvYWRTY3JpcHQoJ3AudG9jJylcIlxyXG4gICAgICovXHJcbiAgICBkYXRhX2luaXQobm9kZSwgcmF3RXhwcikge1xyXG4gICAgICBsZXQgcmVzb2x2ZWREYXRhID0gXy5yZXNvbHZlRXhwck9wdGlvbnMocmF3RXhwcik7XHJcbiAgICAgIGxldCBjYWxsYmFjayA9IHRoaXMuX2Z1bmN0aW9uKCdub2RlJywgcmVzb2x2ZWREYXRhLmV4cHIpO1xyXG4gICAgICBjYWxsYmFjayA9IF8uYXBwbHlDYWxsYmFja09wdGlvbnMoY2FsbGJhY2ssIHJlc29sdmVkRGF0YS5vcHRzKTtcclxuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGhlbHBlciBtZXRob2QgZm9yIGRhdGEgbWV0aG9kcyBoYXZpbmcgZXhwcmVzc2lvbiBsaWtlIGRhdGEtaWZcclxuICAgICAqL1xyXG4gICAgc3Vic2NyaWJlRGF0YUV4cHIocmF3RXhwciwgaGFuZGxlciwgb3B0cykge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVFeHByKHJhd0V4cHIsIGhhbmRsZXIsIHRoaXMuaHRtbFN1YnMsIG9wdHMpO1xyXG4gICAgfVxyXG4gICAgX2RhdGFfZXZlbnRfY2FsbGJhY2socmF3RXhwcikge1xyXG4gICAgICBsZXQgZGF0YSA9IFdpZGdldC5wcm90b3R5cGUuX2V2ZW50Q2FsbEJhY2tEYXRhW3Jhd0V4cHJdO1xyXG4gICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XHJcbiAgICAgICAgZGF0YSA9IHt9O1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IF8ucmVzb2x2ZVBpcGVkRXhwcmVzc2lvbihyYXdFeHByKTtcclxuICAgICAgICBkYXRhLmNhbGxiYWNrID0gdGhpcy5fZnVuY3Rpb24oJ2V2ZW50LCBub2RlJywgdmFsdWVbMF0pO1xyXG4gICAgICAgIGlmICh2YWx1ZVsxXSkgeyBkYXRhLm9wdHMgPSBfLnJlc29sdmVOaWNlSlNPTih2YWx1ZVsxXSk7IH1cclxuICAgICAgICBXaWRnZXQucHJvdG90eXBlLl9ldmVudENhbGxCYWNrRGF0YVtyYXdFeHByXSA9IGRhdGE7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHN1YnNjcmliZXMgdG8ga2V5cyBhbmQgZXZhbHVhdGVzIGV4cHJlc3Npb24gdmFsdWUgdG8gc2hvdyBvciBoaWRlXHJcbiAgICAgKiBFeGFtcGxlOiBkYXRhLWlmPVwiQGtleVwiXHJcbiAgICAgKiAgICAgICAgICBkYXRhLWlmPVwiIUBrZXkmJkBrZXkyXCJcclxuICAgICAqICAgICAgICAgIGRhdGEtaWY9J3RoaXMuZ2V0KFwia2V5XCIsIFwidmFsdWVcIiknXHJcbiAgICAgKiAgICAgICAgICBkYXRhLWlmPVwiQGtleT09dmFsdWVcIlxyXG4gICAgICogICAgICAgICAgZGF0YS1pZj1cIkBrZXkhPT12YWx1ZVwiXHJcbiAgICAgKi9cclxuICAgIGRhdGFfaWYobm9kZSwgcmF3RXhwcikge1xyXG4gICAgICBsZXQgbm9kZUhvbGRlciA9IG5ldyByaC5Ob2RlSG9sZGVyKFtub2RlXSk7XHJcbiAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZURhdGFFeHByKHJhd0V4cHIsIGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQpIHsgcmV0dXJuIG5vZGVIb2xkZXIuc2hvdygpOyB9IGVsc2UgeyByZXR1cm4gbm9kZUhvbGRlci5oaWRlKCk7IH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YV9oaWRkZW4obm9kZSwgcmF3RXhwcikge1xyXG4gICAgICBsZXQgbm9kZUhvbGRlciA9IG5ldyByaC5Ob2RlSG9sZGVyKFtub2RlXSk7XHJcbiAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZURhdGFFeHByKHJhd0V4cHIsIHJlc3VsdCA9PiBub2RlSG9sZGVyLmFjY2Vzc2libGUoIXJlc3VsdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBzdWJzY3JpYmVzIHRvIGEga2V5IGFuZCBmaWxscyBpdHMgdmFsdWUgYXMgaHRtbCBjb250ZW50XHJcbiAgICAgKiBFeGFtcGxlOiA8YSBkYXRhLWh0bWw9XCJAa2V5XCI+dGVtcCB2YWx1ZTwvYT5cclxuICAgICAqICAgICAgICAgIDxkaXYgZGF0YS1odG1sPVwiQGtleVsndXJsJ11cIj50ZW1wIHZhbHVlPC9kaXY+XHJcbiAgICAgKi9cclxuICAgIGRhdGFfaHRtbChub2RlLCByYXdFeHByKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZURhdGFFeHByKHJhd0V4cHIsIGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkgeyByZXN1bHQgPSAnJzsgfVxyXG4gICAgICAgIG5vZGUuaW5uZXJIVE1MID0gcmVzdWx0O1xyXG4gICAgICAgIC8vVE9ETyB1bnN1YiBvbGQgc3Vic2NyaWJlc1xyXG4gICAgICAgIHJldHVybiAkLmVhY2hDaGlsZE5vZGUobm9kZSwgY2hpbGQgPT4gdGhpcy5yZXNvbHZlRGF0YUF0dHJzKGNoaWxkKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBzdWJzY3JpYmVzIHRvIGEga2V5IGFuZCBmaWxscyBpdHMgdmFsdWUgYXMgdGV4dCBjb250ZW50XHJcbiAgICAgKiBFeGFtcGxlOiA8YSBkYXRhLXRleHQ9XCJAa2V5XCI+dGVtcCB2YWx1ZTwvYT5cclxuICAgICAqICAgICAgICAgIDxkaXYgZGF0YS10ZXh0PVwiQGtleVsndGl0bGUnXVwiPnRlbXAgdmFsdWU8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgZGF0YV90ZXh0KG5vZGUsIHJhd0V4cHIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlRGF0YUV4cHIocmF3RXhwciwgZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7IHJlc3VsdCA9ICcnOyB9XHJcbiAgICAgICAgcmV0dXJuICQudGV4dENvbnRlbnQobm9kZSwgcmVzdWx0KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKlxyXG4gICAgICogcHJvdmlkZSBleHByZXNzaW9uIHRvIHVwZGF0ZSB0aGUgY2xhc3MgYXR0cmlidXRlXHJcbiAgICAgKiBFeGFtcGxlOiBkYXRhLWNsYXNzPVwic2VsZWN0ZWQ6ICN7QGluZGV4fSA9PSBALmRhdGFpZHhcIlxyXG4gICAgICogZGF0YS1jbGFzcz1cInNlbGVjdGVkOiBAa2V5MTsgYm9sZDogQGtleTJcIlxyXG4gICAgICovXHJcbiAgICBkYXRhX2NsYXNzKG5vZGUsIGF0dHJzRGF0YSkge1xyXG4gICAgICByZXR1cm4gXy5lYWNoKHRoaXMucmVzb2x2ZUF0dHIoYXR0cnNEYXRhKSwgZnVuY3Rpb24ocmF3RXhwciwgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgbGV0IG5vZGVIb2xkZXIgPSBuZXcgcmguTm9kZUhvbGRlcihbbm9kZV0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZURhdGFFeHByKHJhd0V4cHIsIGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgICAgbGV0IGFkZFJlbW92ZUNsYXNzID0gcmVzdWx0ID8gW2NsYXNzTmFtZV0gOiBbXTtcclxuICAgICAgICAgIHJldHVybiBub2RlSG9sZGVyLnVwZGF0ZUNsYXNzKGFkZFJlbW92ZUNsYXNzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICAsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUbyB1cGRhdGUgYW55IGh0bWwgdGFnIGF0dHJpYnV0ZS5cclxuICAgICAqIEV4YW1wbGU6IDxhIGRhdGEtYXR0cj1cImhyZWY6bGlua19rZXlcIj5Hb29nbGU8L2E+XHJcbiAgICAgKiAgICAgICAgICA8YnV0dG9uIGRhdGEtYXR0cj1cImRpc2FibGVkOmtleVwiPnRlbXAgdmFsdWU8L2J1dHRvbj5cclxuICAgICAqL1xyXG4gICAgZGF0YV9hdHRyKG5vZGUsIGF0dHJzRGF0YSkge1xyXG4gICAgICByZXR1cm4gXy5lYWNoKHRoaXMucmVzb2x2ZUF0dHIoYXR0cnNEYXRhKSwgZnVuY3Rpb24ocmF3RXhwciwgYXR0cl9uYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlRGF0YUV4cHIocmF3RXhwciwgZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQuc2V0QXR0cmlidXRlKG5vZGUsIGF0dHJfbmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoJC5oYXNBdHRyaWJ1dGUobm9kZSwgYXR0cl9uYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJC5yZW1vdmVBdHRyaWJ1dGUobm9kZSwgYXR0cl9uYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICAsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUbyB1cGRhdGUgc3R5bGUgYXR0cmlidXRlIG9mIEhUTUwgbm9kZS5cclxuICAgICAqIEV4YW1wbGU6XHJcbiAgICAgKiA8c3BhbiBzdHlsZT1cInZpc2libGU6IHRydWU7XCIgZGF0YS1jc3M9XCJ2aXNpYmxlOiBAa2V5XCI+IHNvbWUgdGV4dCA8L3NwYW4+XHJcbiAgICAgKiA8bGkgc3R5bGU9XCJjb2xvcjogYmx1ZTsgZGlzcGxheTogYmxvY2s7XCIgZGF0YS1jc3M9XCJjb2xvcjpcclxuICAgICAqIEAuc2VsZWN0ZWRfY29sb3I7IGRpc3BsYXk6IEAuZGF0YWlkeCA+IDEwID8gJ25vbmUnIDogJ2Jsb2NrJ1wiPjwvbGk+XHJcbiAgICAgKi9cclxuICAgIGRhdGFfY3NzKG5vZGUsIGF0dHJzRGF0YSkge1xyXG4gICAgICByZXR1cm4gXy5lYWNoKHRoaXMucmVzb2x2ZUF0dHIoYXR0cnNEYXRhKSwgZnVuY3Rpb24ocmF3RXhwciwgc3R5bGVOYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlRGF0YUV4cHIocmF3RXhwciwgKHJlc3VsdCA9IG51bGwpID0+IC8vIG51bGwgdG8gZm9yY2Ugc2V0IGNzc1xyXG4gICAgICAgICAgJC5jc3Mobm9kZSwgc3R5bGVOYW1lLCByZXN1bHQpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICAsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB3b3JrcyBsaWtlIGRhdGEtaWYgYnV0IHNldHMgdGhlIHN0YXRlcyBjaGVja2VkXHJcbiAgICAgKiBFeGFtcGxlOlxyXG4gICAgICogPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT1cIlByaW50XCIgZGF0YS1jaGVja2VkPVwia2V5XCIgLz5cclxuICAgICAqIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCJPbmxpbmVcIiBkYXRhLWNoZWNrZWQ9XCJrZXlcIiAvPlxyXG4gICAgICovXHJcbiAgICBkYXRhX2NoZWNrZWQobm9kZSwga2V5KSB7XHJcbiAgICAgIGlmIChfLmlzVmFsaWRNb2RlbENvbnN0S2V5KGtleSkpIHsga2V5ID0gY29uc3RzKGtleSk7IH1cclxuICAgICAgbGV0IHR5cGUgPSBub2RlLmdldEF0dHJpYnV0ZSgndHlwZScpO1xyXG4gICAgICBpZiAoKHR5cGUgPT09ICdjaGVja2JveCcpIHx8ICh0eXBlID09PSAncmFkaW8nKSkge1xyXG4gICAgICAgIGxldCBub2RlVmFsdWU7XHJcbiAgICAgICAgaWYgKCQuZ2V0QXR0cmlidXRlKG5vZGUsICdjaGVja2VkJykpIHtcclxuICAgICAgICAgIHRoaXMuZ3VhcmQoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnB1Ymxpc2goa2V5LCBub2RlLmdldEF0dHJpYnV0ZSgndmFsdWUnLCB7c3luYzogdHJ1ZX0pKTsgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBub2RlLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICBub2RlVmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9XHJcbiAgICAgICAgICAgIG5vZGVWYWx1ZSA9PT0gbnVsbCA/XHJcbiAgICAgICAgICAgICAgbm9kZS5jaGVja2VkXHJcbiAgICAgICAgICAgIDogbm9kZS5jaGVja2VkID9cclxuICAgICAgICAgICAgICBub2RlVmFsdWVcclxuICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICAgIHVuZGVmaW5lZDtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmd1YXJkKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5wdWJsaXNoKGtleSwgdmFsdWUsIHtzeW5jOiB0cnVlfSk7IH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHRtbFN1YnMucHVzaCh0aGlzLnN1YnNjcmliZShrZXksIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICBub2RlVmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcclxuICAgICAgICAgIGlmIChub2RlVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5jaGVja2VkID0gdmFsdWUgPT09IG5vZGVWYWx1ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLmNoZWNrZWQgPSB2YWx1ZSA9PT0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogc3Vic2NyaWJlcyB0byBhIGtleSBhbmQgZmlsbHMgaXRzIHZhbHVlIGFzIGh0bWwgY29udGVudFxyXG4gICAgICogRXhhbXBsZTpcclxuICAgICAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtdmFsdWU9XCJrZXlcIiAvPlxyXG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJPbmxpbmVcIiBkYXRhLXZhbHVlPVwia2V5XCIgLz5cclxuICAgICAqL1xyXG4gICAgZGF0YV92YWx1ZShub2RlLCBrZXkpIHtcclxuICAgICAgaWYgKF8uaXNWYWxpZE1vZGVsQ29uc3RLZXkoa2V5KSkgeyBrZXkgPSBjb25zdHMoa2V5KTsgfVxyXG4gICAgICBsZXQgbm9kZUd1YXJkID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgaWYgKG5vZGUudmFsdWUpIHsgdGhpcy5ndWFyZCgoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnB1Ymxpc2goa2V5LCBub2RlLnZhbHVlLCB7c3luYzogdHJ1ZX0pOyB9KSwgbm9kZUd1YXJkKTsgfVxyXG5cclxuICAgICAgbm9kZS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ndWFyZCgoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmd1YXJkKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5wdWJsaXNoKGtleSwgbm9kZS52YWx1ZSwge3N5bmM6IHRydWV9KTsgfSk7XHJcbiAgICAgICAgIH0pLCBub2RlR3VhcmQpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuaHRtbFN1YnMucHVzaCh0aGlzLnN1YnNjcmliZShrZXksIHZhbHVlID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ndWFyZCgoKCkgPT4gbm9kZS52YWx1ZSA9IHZhbHVlKSwgbm9kZUd1YXJkKTtcclxuICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgX3JlZ2lzdGVyX2V2ZW50X3dpdGhfcmF3RXhwcihuYW1lLCBub2RlLCByYXdFeHByKSB7XHJcbiAgICAgIGxldCB7Y2FsbGJhY2t9ID0gdGhpcy5yZXNvbHZlRXZlbnRSYXdFeHByKHJhd0V4cHIpO1xyXG4gICAgICBfLmFkZEV2ZW50TGlzdGVuZXIobm9kZSwgbmFtZSwgZSA9PiBjYWxsYmFjay5jYWxsKHRoaXMsIGUsIGUuY3VycmVudFRhcmdldCkpO1xyXG4gICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEV4YW1wbGU6IGRhdGEtY2xpY2s9J0BrZXkoXCJ2YWx1ZVwiKSdcclxuICAgICAqICAgICAgICAgIGRhdGEtY2xpY2s9J3RoaXMucHVibGlzaChcImtleVwiLCBcInZhbHVlXCIpJ1xyXG4gICAgICogICAgICAgICAgZGF0YS1jbGljaz0nQGtleShcInZhbHVlXCIpOyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOydcclxuICAgICAqL1xyXG4gICAgZGF0YV9jbGljayhub2RlLCByYXdFeHByKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZWdpc3Rlcl9ldmVudF93aXRoX3Jhd0V4cHIoJ2NsaWNrJywgbm9kZSwgcmF3RXhwcik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEV4YW1wbGU6IGRhdGEtbW91c2VvdmVyPSdAa2V5KFwidmFsdWVcIiknXHJcbiAgICAgKiAgICAgICAgICBkYXRhLW1vdXNlb3Zlcj0ndGhpcy5wdWJsaXNoKFwia2V5XCIsIFwidmFsdWVcIiknXHJcbiAgICAgKiAgICAgICAgICBkYXRhLW1vdXNlb3Zlcj0nQGtleShcInZhbHVlXCIpOyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOydcclxuICAgICAqL1xyXG4gICAgZGF0YV9tb3VzZW92ZXIobm9kZSwgcmF3RXhwcikge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVnaXN0ZXJfZXZlbnRfd2l0aF9yYXdFeHByKCdtb3VzZW92ZXInLCBub2RlLCByYXdFeHByKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhX21vdXNlb3V0KG5vZGUsIHJhd0V4cHIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyX2V2ZW50X3dpdGhfcmF3RXhwcignbW91c2VvdXQnLCBub2RlLCByYXdFeHByKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhX2ZvY3VzKG5vZGUsIHJhd0V4cHIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyX2V2ZW50X3dpdGhfcmF3RXhwcignZm9jdXMnLCBub2RlLCByYXdFeHByKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhX2JsdXIobm9kZSwgcmF3RXhwcikge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVnaXN0ZXJfZXZlbnRfd2l0aF9yYXdFeHByKCdibHVyJywgbm9kZSwgcmF3RXhwcik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHRyaWdnZXJcclxuICAgICAqIEV4YW1wbGU6IGRhdGEtdHJpZ2dlcj0nLmwuZ29fdG9fdG9wJ1xyXG4gICAgICogICAgICAgICAgZGF0YS10cmlnZ2VyPSdFVlRfU0VBUkNIX1BBR0UnXHJcbiAgICAgKi9cclxuICAgIGRhdGFfdHJpZ2dlcihub2RlLCBrZXkpIHtcclxuICAgICAgaWYgKF8uaXNWYWxpZE1vZGVsQ29uc3RLZXkoa2V5KSkgeyBrZXkgPSBjb25zdHMoa2V5KTsgfVxyXG4gICAgICByZXR1cm4gXy5hZGRFdmVudExpc3RlbmVyKG5vZGUsICdjbGljaycsICgpID0+IHRoaXMucHVibGlzaChrZXksIG51bGwpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogY2FsbCBtZW1iZXIgb3IgZ2xvYmFsIG1ldGhvZCBvbiBjbGlja1xyXG4gICAgICogYWR2YW50YWdlIGlzIHlvdSB3aWxsIGdldCBldmVudCBhcyBhcmd1bWVudFxyXG4gICAgICogRXhhbXBsZTogZGF0YS1tZXRob2Q9J2hhbmRsZVNhdmUnID0+IGRhdGEtY2xpY2s9J3RoaXMuaGFuZGxlU2F2ZShldmVudCknXHJcbiAgICAgKiAgICAgICAgICBkYXRhLW1ldGhvZD0naGFuZGxlQ2FuY2VsJ1xyXG4gICAgICovXHJcbiAgICBkYXRhX21ldGhvZChub2RlLCBtZXRob2QpIHtcclxuICAgICAgcmV0dXJuIF8uYWRkRXZlbnRMaXN0ZW5lcihub2RlLCAnY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgaWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkKSB7IHJldHVybiAodGhpc1ttZXRob2RdIHx8IHdpbmRvd1ttZXRob2RdKShldmVudCk7IH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkYXRhX3RvZ2dsZShub2RlLCByYXdBcmdzKSB7XHJcbiAgICAgIGxldCBvcHRzO1xyXG4gICAgICBsZXQga2V5cyA9IFtdO1xyXG4gICAgICBsZXQgZGF0YSA9IFdpZGdldC5wcm90b3R5cGUuX3RvZ2dsZURhdGFbcmF3QXJnc107XHJcbiAgICAgIGlmIChkYXRhID09IG51bGwpIHtcclxuICAgICAgICBsZXQgcGlwZWRBcmdzID0gXy5yZXNvbHZlUGlwZWRFeHByZXNzaW9uKHJhd0FyZ3MpO1xyXG4gICAgICAgIGxldCBjb25maWcgPSBwaXBlZEFyZ3Muc2hpZnQoKSB8fCAnJztcclxuICAgICAgICBjb25maWcgPSBfLmV4cGxvZGVBbmRNYXAoY29uZmlnLCAnOycsICc6Jywge3RyaW06IHRydWV9KTtcclxuICAgICAgICBpZiAocGlwZWRBcmdzWzBdKSB7IG9wdHMgPSBfLnJlc29sdmVOaWNlSlNPTihwaXBlZEFyZ3NbMF0pOyB9XHJcbiAgICAgICAgZGF0YSA9IHtrZXlWYWx1ZXM6IGNvbmZpZywgb3B0c307XHJcbiAgICAgICAgV2lkZ2V0LnByb3RvdHlwZS5fdG9nZ2xlRGF0YVtyYXdBcmdzXSA9IGRhdGE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF8uZWFjaChkYXRhLmtleVZhbHVlcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5ndWFyZChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMucHVibGlzaChrZXksIHZhbHVlID09PSAndHJ1ZScsIHtzeW5jOiB0cnVlfSk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAsIHRoaXMpO1xyXG5cclxuICAgICAgbGV0IGNhbGxiYWNrID0ga2V5ID0+IHRoaXMuZ3VhcmQoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnB1Ymxpc2goa2V5LCAhdGhpcy5nZXQoa2V5KSwge3N5bmM6IHRydWV9KTsgfSk7XHJcbiAgICAgIGlmIChkYXRhLm9wdHMpIHsgY2FsbGJhY2sgPSBfLmFwcGx5Q2FsbGJhY2tPcHRpb25zKGNhbGxiYWNrLCBkYXRhLm9wdHMpOyB9XHJcblxyXG4gICAgICByZXR1cm4gXy5hZGRFdmVudExpc3RlbmVyKG5vZGUsICdjbGljaycsIGV2ZW50ID0+IF8uZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHsgaWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkKSB7IHJldHVybiBjYWxsYmFjayhrZXkpOyB9IH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVG9nZ2xlIG1vZGVsIHZhcmlhYmxlIG9uIGNsaWNrXHJcbiAgICAgKiBFeGFtcGxlOiBkYXRhLXRvZ2dsZWNsYXNzPSdyaC1oaWRlJ1xyXG4gICAgICogICAgICAgICAgZGF0YS10b2dnbGVjbGFzcz0nb3BlbidcclxuICAgICAqICAgICAgICAgIDxkaXYgY2xhc3M9XCJvcGVuXCIgZGF0YS10b2dnbGVjbGFzcz0nb3BlbixjbG9zZWQnPlxyXG4gICAgICovXHJcbiAgICBkYXRhX3RvZ2dsZWNsYXNzKG5vZGUsIGNsYXNzTmFtZXMpIHtcclxuICAgICAgbGV0IG5ld0NsYXNzZXMgPSBfLnNwbGl0QW5kVHJpbShjbGFzc05hbWVzLCAnLCcpO1xyXG4gICAgICByZXR1cm4gXy5hZGRFdmVudExpc3RlbmVyKG5vZGUsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XHJcbiAgICAgICAgICBub2RlID0gZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgIHJldHVybiBfLmVhY2gobmV3Q2xhc3NlcywgZnVuY3Rpb24oY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICgkLmhhc0NsYXNzKG5vZGUsIGNsYXNzTmFtZSkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJC5yZW1vdmVDbGFzcyhub2RlLCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJldHVybiAkLmFkZENsYXNzKG5vZGUsIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEV4YW1wbGU6IGRhdGEtY2hhbmdlPSdAa2V5KFwidmFsdWVcIiknXHJcbiAgICAgKiAgICAgICAgICBkYXRhLWNoYW5nZT0ndGhpcy5wdWJsaXNoKFwia2V5XCIsIFwidmFsdWVcIiknXHJcbiAgICAgKi9cclxuICAgIGRhdGFfY2hhbmdlKG5vZGUsIHJhd0V4cHIpIHtcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLl9kYXRhX2V2ZW50X2NhbGxiYWNrKHJhd0V4cHIpO1xyXG4gICAgICBsZXQgY2FsbGJhY2sgPSBfLmFwcGx5Q2FsbGJhY2tPcHRpb25zKGRhdGEuY2FsbGJhY2ssIGRhdGEub3B0cyk7XHJcbiAgICAgIHJldHVybiBub2RlLm9uY2hhbmdlID0gZXZlbnQgPT4gY2FsbGJhY2suY2FsbCh0aGlzLCBldmVudCwgZXZlbnQuY3VycmVudFRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEV4YW1wbGU6IGRhdGEta2V5ZG93bj0nQHRleHQobm9kZS52YWx1ZSk7IHwga2V5Q29kZTogMTMnXHJcbiAgICAgKiAgICAgICAgICBkYXRhLWtleWRvd249J2V2ZW50LmtleUNvZGUgPT0gMTMgJiYgQHRleHQobm9kZS52YWx1ZSknXHJcbiAgICAgKiAgICAgICAgICBkYXRhLWtleWRvd249J3RoaXMucHVibGlzaChcImtleVwiLCBcIm15dmFsdWVcIik7J1xyXG4gICAgICogICAgICAgICAgZGF0YS1rZXlkb3dub3B0aW9ucz0nZGVib3VuY2U6MzAwJ1xyXG4gICAgICovXHJcbiAgICBkYXRhX2tleWRvd24obm9kZSwgcmF3RXhwcikge1xyXG4gICAgICBsZXQgZGF0YSA9IHRoaXMuX2RhdGFfZXZlbnRfY2FsbGJhY2socmF3RXhwcik7XHJcbiAgICAgIGxldCBjYWxsYmFjayA9IF8uYXBwbHlDYWxsYmFja09wdGlvbnMoZGF0YS5jYWxsYmFjaywgZGF0YS5vcHRzKTtcclxuICAgICAgbGV0IGtleUNvZGUgPSBkYXRhLm9wdHMgJiYgZGF0YS5vcHRzLmtleUNvZGU7XHJcblxyXG4gICAgICByZXR1cm4gbm9kZS5vbmtleWRvd24gPSBldmVudCA9PiB7XHJcbiAgICAgICAgaWYgKCFrZXlDb2RlIHx8IChrZXlDb2RlID09PSBldmVudC5rZXlDb2RlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgZXZlbnQsIGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogRXhhbXBsZTogZGF0YS1rZXl1cD0naWYoa2V5ID09IDEzKUB0ZXh0KG5vZGUudmFsdWUpOydcclxuICAgICAqICAgICAgICAgIGRhdGEta2V5dXA9J0B0ZXh0KG5vZGUudmFsdWUpIHwga2V5Q29kZTogMTMnXHJcbiAgICAgKiAgICAgICAgICBkYXRhLWtleXVwPSd0aGlzLnB1Ymxpc2goXCJrZXlcIiwgXCJteXZhbHVlXCIpIHwgZGVib3VuY2U6MzAwJ1xyXG4gICAgICovXHJcbiAgICBkYXRhX2tleXVwKG5vZGUsIHJhd0V4cHIpIHtcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLl9kYXRhX2V2ZW50X2NhbGxiYWNrKHJhd0V4cHIpO1xyXG4gICAgICBsZXQgY2FsbGJhY2sgPSBfLmFwcGx5Q2FsbGJhY2tPcHRpb25zKGRhdGEuY2FsbGJhY2ssIGRhdGEub3B0cyk7XHJcbiAgICAgIGxldCBrZXlDb2RlID0gZGF0YS5vcHRzICYmIGRhdGEub3B0cy5rZXlDb2RlO1xyXG5cclxuICAgICAgcmV0dXJuIG5vZGUub25rZXl1cCA9IGV2ZW50ID0+IHtcclxuICAgICAgICBpZiAoIWtleUNvZGUgfHwgKGtleUNvZGUgPT09IGV2ZW50LmtleUNvZGUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCBldmVudCwgZXZlbnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBFeGFtcGxlOiBkYXRhLXNjcm9sbD0nQHRleHQobm9kZS52YWx1ZSkgfCBkZWJvdW5jZTozMDAnXHJcbiAgICAgKiAgICAgICAgICBkYXRhLXNjcm9sbD0ndGhpcy5wdWJsaXNoKFwia2V5XCIsIFwibXl2YWx1ZVwiKSdcclxuICAgICAqL1xyXG4gICAgZGF0YV9zY3JvbGwobm9kZSwgcmF3RXhwcikge1xyXG4gICAgICBsZXQgZGF0YSA9IHRoaXMuX2RhdGFfZXZlbnRfY2FsbGJhY2socmF3RXhwcik7XHJcbiAgICAgIGxldCB7IG9wdHMgfSA9IGRhdGE7XHJcbiAgICAgIGxldCBkZWx0YSA9IChvcHRzICYmIG9wdHMuZGVsdGEpIHx8IDEwMDtcclxuICAgICAgbGV0IGNhbGxiYWNrID0gZXZlbnQgPT4ge1xyXG4gICAgICAgIGxldCByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBpZiAobm9kZS5zY3JvbGxUb3AgPiAobm9kZS5zY3JvbGxIZWlnaHQgLSAocmVjdC5oZWlnaHQgKyBkZWx0YSkpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50LCBub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAob3B0cykgeyBjYWxsYmFjayA9IF8uYXBwbHlDYWxsYmFja09wdGlvbnMoY2FsbGJhY2ssIG9wdHMpOyB9XHJcbiAgICAgIHJldHVybiBfLmFkZEV2ZW50TGlzdGVuZXIobm9kZSwgJ3Njcm9sbCcsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIGRhdGFfbG9hZChub2RlLCB2YWx1ZSkge1xyXG4gICAgICBsZXQgcGFpciA9IHZhbHVlLnNwbGl0KCc6Jyk7XHJcbiAgICAgIGxldCBqc1BhdGggPSBwYWlyWzBdO1xyXG4gICAgICBsZXQga2V5ID0gcGFpclsxXTtcclxuICAgICAgaWYgKCFXaWRnZXQucHJvdG90eXBlLl9sb2FkRGF0YVtqc1BhdGhdKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uYWRkRXZlbnRMaXN0ZW5lcihub2RlLCAnY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBpZiAoIVdpZGdldC5wcm90b3R5cGUuX2xvYWREYXRhW2pzUGF0aF0pIHtcclxuICAgICAgICAgICAgV2lkZ2V0LnByb3RvdHlwZS5fbG9hZERhdGFbanNQYXRoXSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICAgICAgICAkLmFkZENsYXNzKG5vZGUsICdsb2FkaW5nJyk7XHJcbiAgICAgICAgICAgICAgdmFyIHVuc3ViID0gdGhpcy5zdWJzY3JpYmVPbmx5KGtleSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkLnJlbW92ZUNsYXNzKG5vZGUsICdsb2FkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5zdWIoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXy5sb2FkU2NyaXB0KGpzUGF0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkYXRhX2NvbnRyb2xsZXIobm9kZSwgdmFsdWUpIHtcclxuICAgICAgaWYgKHRoaXMudXNlcl92YXJzID09IG51bGwpIHsgdGhpcy51c2VyX3ZhcnMgPSB7fTsgfVxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIEFycmF5LmZyb20oXy5zcGxpdEFuZFRyaW0odmFsdWUsICc7JykpKSB7XHJcbiAgICAgICAgdmFyIGN0cmxDbGFzcywgb3B0cztcclxuICAgICAgICBsZXQgcGFpciA9IF8ucmVzb2x2ZVBpcGVkRXhwcmVzc2lvbihkYXRhKTtcclxuICAgICAgICBpZiAocGFpclsxXSkgeyBvcHRzID0gXy5yZXNvbHZlTmljZUpTT04ocGFpclsxXSk7IH1cclxuICAgICAgICBwYWlyID0gXy5zcGxpdEFuZFRyaW0ocGFpclswXSwgJzonKTtcclxuICAgICAgICBpZiAocGFpci5sZW5ndGggPT09IDApIHsgcGFpciA9IF8uc3BsaXRBbmRUcmltKHBhaXJbMF0sICcgYXMgJyk7IH1cclxuICAgICAgICBpZiAocGFpclswXSAhPSBudWxsKSB7IGN0cmxDbGFzcyA9IHJoLmNvbnRyb2xsZXIocGFpclswXSk7IH1cclxuICAgICAgICBsZXQgY3RybE5hbWUgPSBwYWlyWzFdO1xyXG4gICAgICAgIGlmIChjdHJsQ2xhc3MgJiYgIXRoaXMudXNlcl92YXJzW2N0cmxOYW1lXSkge1xyXG4gICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBuZXcgY3RybENsYXNzKHRoaXMsIG9wdHMpO1xyXG4gICAgICAgICAgaWYgKGN0cmxOYW1lKSB7IHRoaXMudXNlcl92YXJzW2N0cmxOYW1lXSA9IGNvbnRyb2xsZXI7IH1cclxuICAgICAgICB9IGVsc2UgaWYgKHJoLl9kZWJ1ZyAmJiAhY3RybENsYXNzKSB7XHJcbiAgICAgICAgICByaC5fZCgnZXJyb3InLCBgQ29udHJvbGxlciAke2N0cmxDbGFzc30gbm90IGZvdW5kYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YV9zY3JlZW52YXIobm9kZSwgdmFsdWUpIHtcclxuICAgICAgbGV0IHNWYXJzID0gXy5zcGxpdEFuZFRyaW0odmFsdWUsICcsJyk7XHJcbiAgICAgIGxldCBjdXJyZW50X3NjcmVlbiA9IF8uZmluZEluZGV4KHRoaXMuZ2V0KGNvbnN0cygnS0VZX1NDUkVFTicpKSwgKHYsIGspID0+IHYuYXR0YWNoZWQpO1xyXG4gICAgICBsZXQgY2FjaGUgPSB7fTtcclxuICAgICAgY2FjaGVbY3VycmVudF9zY3JlZW5dID0ge307XHJcblxyXG4gICAgICBsZXQgc2NyZWVuS2V5cyA9IHRoaXMuZ2V0KGNvbnN0cygnS0VZX1NDUkVFTicpKTtcclxuICAgICAgcmV0dXJuIF8uZWFjaCgoXy5rZXlzKHNjcmVlbktleXMpKSwgZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlT25seShgJHtjb25zdHMoJ0tFWV9TQ1JFRU4nKX0uJHtrZXl9LmF0dGFjaGVkYCwgYXR0YWNoZWQgPT4ge1xyXG4gICAgICAgICAgbGV0IG5hbWU7XHJcbiAgICAgICAgICBpZiAoIWF0dGFjaGVkKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgXy5lYWNoKHNWYXJzLCBmdW5jdGlvbihzVmFyKSB7XHJcbiAgICAgICAgICAgIGNhY2hlW2N1cnJlbnRfc2NyZWVuXVtzVmFyXSA9IHRoaXMuZ2V0KHNWYXIpO1xyXG4gICAgICAgICAgICBpZiAoY2FjaGVba2V5XSAhPSBudWxsKSB7IHJldHVybiB0aGlzLnB1Ymxpc2goc1ZhciwgY2FjaGVba2V5XVtzVmFyXSk7IH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgICwgdGhpcyk7XHJcbiAgICAgICAgICByZXR1cm4gY2FjaGVbbmFtZSA9IChjdXJyZW50X3NjcmVlbiA9IGtleSldICE9IG51bGwgPyBjYWNoZVtuYW1lXSA6IChjYWNoZVtuYW1lXSA9IHt9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgLCB0aGlzKTtcclxuICAgIH1cclxuICB9O1xyXG4gIFdpZGdldC5pbml0Q2xhc3MoKTtcclxuICByZXR1cm4gV2lkZ2V0O1xyXG59KSgpO1xyXG5cclxuICAvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMgVXRpbGl0eSBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuXHJcbnJoLndpZGdldHMgPSB7fTtcclxucmguV2lkZ2V0ID0gV2lkZ2V0O1xyXG5yaC53aWRnZXRzLkJhc2ljID0gV2lkZ2V0O1xyXG5cclxuZnVuY3Rpb24gX19ndWFyZF9fKHZhbHVlLCB0cmFuc2Zvcm0pIHtcclxuICByZXR1cm4gKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpID8gdHJhbnNmb3JtKHZhbHVlKSA6IHVuZGVmaW5lZDtcclxufVxyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5cclxucmgucmVnaXN0ZXJEYXRhQXR0ciAgPSBmdW5jdGlvbihhdHRyTmFtZSwgRGF0YUF0dHJIYW5kbGVyLCBXaWRnZXQpIHtcclxuICBpZiAoV2lkZ2V0ID09IG51bGwpIHsgKHsgV2lkZ2V0IH0gPSByaCk7IH1cclxuICBsZXQgbWV0aG9kTmFtZSA9IGBkYXRhXyR7YXR0ck5hbWV9YDtcclxuICBXaWRnZXQucHJvdG90eXBlLmRhdGFBdHRyTWV0aG9kc1tgZGF0YS0ke2F0dHJOYW1lfWBdID0gbWV0aG9kTmFtZTtcclxuICBXaWRnZXQucHJvdG90eXBlLmRhdGFBdHRycy5wdXNoKGF0dHJOYW1lKTtcclxuICByZXR1cm4gV2lkZ2V0LnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKG5vZGUsIGF0dHJWYWx1ZSkge1xyXG4gICAgcmV0dXJuIG5ldyBEYXRhQXR0ckhhbmRsZXIodGhpcywgbm9kZSwgYXR0clZhbHVlKTtcclxuICB9O1xyXG59O1xyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBfIH0gPSByaDtcclxubGV0IHsgJCB9ID0gcmg7XHJcbmxldCB7IGNvbnN0cyB9ID0gcmg7XHJcblxyXG5jbGFzcyBSZXNpemUge1xyXG4gIGNvbnN0cnVjdG9yKHdpZGdldCwgbm9kZSwgcmF3RXhwcikge1xyXG4gICAgdGhpcy5oYW5kbGVNb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUgPSB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy53aWRnZXQgPSB3aWRnZXQ7XHJcbiAgICB0aGlzLm5vZGUgPSBub2RlO1xyXG4gICAgbGV0IHtjYWxsYmFjaywgb3B0c30gPSB0aGlzLndpZGdldC5yZXNvbHZlUmF3RXhwcldpdGhWYWx1ZShyYXdFeHByKTtcclxuICAgIHRoaXMub3B0cyA9IG9wdHM7XHJcbiAgICB0aGlzLmNhbGxiYWNrID0gZnVuY3Rpb24oKSB7IHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMud2lkZ2V0KTsgfTtcclxuXHJcbiAgICBpZiAob3B0cy5tYXh4ID09IG51bGwpIHsgb3B0cy5tYXh4ID0gMTsgfVxyXG4gICAgaWYgKG9wdHMubWlueCA9PSBudWxsKSB7IG9wdHMubWlueCA9IDA7IH1cclxuICAgIGlmIChvcHRzLm1heHkgPT0gbnVsbCkgeyBvcHRzLm1heHkgPSAxOyB9XHJcbiAgICBpZiAob3B0cy5taW55ID09IG51bGwpIHsgb3B0cy5taW55ID0gMDsgfVxyXG4gICAgdGhpcy5yZXNpemUgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgXy5pbml0TW91c2VNb3ZlKCk7XHJcbiAgICBfLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5ub2RlLCAnbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd24pO1xyXG4gICAgdGhpcy53aWRnZXQuc3Vic2NyaWJlKGNvbnN0cygnRVZUX01PVVNFTU9WRScpLCB0aGlzLmhhbmRsZU1vdXNlTW92ZSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVNb3VzZURvd24oZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSB7IHJldHVybjsgfVxyXG4gICAgdGhpcy5yZXNpemUgPSAoZXZ0LnRhcmdldCA9PT0gdGhpcy5ub2RlKSAmJiAhZXZ0LmRlZmF1bHRQcmV2ZW50ZWQ7XHJcbiAgICBpZiAodGhpcy5yZXNpemUpIHtcclxuICAgICAgbGV0IHJlc3VsdCA9ICh0aGlzLmNhbGxiYWNrKSgpO1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXNpemUgPSAocmVzdWx0ICE9PSBmYWxzZSkgJiYgKHJlc3VsdCAhPT0gbnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVNb3VzZU1vdmUob2JqKSB7XHJcbiAgICBpZiAob2JqLmRlZmF1bHRQcmV2ZW50ZWQpIHsgdGhpcy5yZXNpemUgPSBmYWxzZTsgfVxyXG4gICAgaWYgKCF0aGlzLnJlc2l6ZSkgeyByZXR1cm47IH1cclxuXHJcbiAgICBvYmouZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XHJcbiAgICBpZiAob2JqLndoaWNoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2gob2JqKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlc2l6ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QmFzZVdpZHRoKCkgeyByZXR1cm4gdGhpcy5vcHRzLmJhc2V4IHx8IGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGg7IH1cclxuICAgIFxyXG4gIGdldEJhc2VIZWlnaHQoKSB7IHJldHVybiB0aGlzLm9wdHMuYmFzZXkgfHwgZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7IH1cclxuICBcclxuICBwdWJsaXNoKG9iaikge1xyXG4gICAgbGV0IGJhc2UgPSB0aGlzLmdldEJhc2VXaWR0aCgpO1xyXG4gICAgbGV0IHJ0bCA9ICdydGwnID09PSB0aGlzLndpZGdldC5nZXQoY29uc3RzKCdLRVlfRElSJykpO1xyXG4gICAgbGV0IG5ld1ZhbHVlID0gcnRsID8gYmFzZSAtIG9iai54IDogb2JqLng7XHJcbiAgICBpZiAoIXRoaXMucHVibGlzaFBvcyhiYXNlLCB0aGlzLm9wdHMubWlueCwgdGhpcy5vcHRzLm1heHgsIHRoaXMub3B0cy54LCBuZXdWYWx1ZSkpIHtcclxuICAgICAgYmFzZSA9IHRoaXMuZ2V0QmFzZUhlaWdodCgpO1xyXG4gICAgICBuZXdWYWx1ZSA9IHJ0bCA/IGJhc2UgLSBvYmoueSA6IG9iai55O1xyXG4gICAgICByZXR1cm4gdGhpcy5wdWJsaXNoUG9zKGJhc2UsIHRoaXMub3B0cy5taW55LCB0aGlzLm9wdHMubWF4eSwgdGhpcy5vcHRzLnksIG5ld1ZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1Ymxpc2hQb3MoYmFzZSwgbWluLCBtYXgsIGtleSwgbmV3VmFsdWUpIHtcclxuICAgIGlmICgoa2V5ICE9IG51bGwpICYmIChuZXdWYWx1ZSAhPSBudWxsKSkge1xyXG4gICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLndpZGdldC5nZXQoa2V5KTtcclxuICAgICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkge1xyXG4gICAgICAgIGlmICgobWF4ICogYmFzZSkgPCBuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSBtYXggKiBiYXNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoKG1pbiAqIGJhc2UpID4gbmV3VmFsdWUpIHtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gbWluICogYmFzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53aWRnZXQucHVibGlzaChrZXksIGAke25ld1ZhbHVlfXB4YCk7XHJcbiAgICAgICAgKHRoaXMuY2FsbGJhY2spKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnJoLnJlZ2lzdGVyRGF0YUF0dHIoJ3Jlc2l6ZScsIFJlc2l6ZSk7XHJcbiIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5sZXQgeyAkIH0gPSByaDtcclxuXHJcbmNsYXNzIFRhYmxlIHtcclxuXHJcbiAgY29uc3RydWN0b3Iod2lkZ2V0LCBub2RlLCBrZXkpIHtcclxuICAgIHRoaXMud2lkZ2V0ID0gd2lkZ2V0O1xyXG4gICAgdGhpcy5ub2RlID0gbm9kZTtcclxuICAgIHRoaXMud2lkZ2V0LnB1Ymxpc2goa2V5LCB0aGlzLmV4dHJhY3RSb3dDb2x1bW5NYXRyaXgodGhpcy5ub2RlKSk7XHJcbiAgfVxyXG4gXHJcbiAgZXh0cmFjdFJvd0NvbHVtbk1hdHJpeChub2RlKSB7XHJcbiAgICBsZXQgcm93Q29sTWF0cml4ID0gW107XHJcbiAgICBsZXQgcm93RWxlbWVudHMgPSBbXTtcclxuICAgIHRoaXMud2lkZ2V0LnRyYXZlcnNlTm9kZShub2RlLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIGlmICgnVEQnID09PSAkLm5vZGVOYW1lKG5vZGUpKSB7XHJcbiAgICAgICAgcm93RWxlbWVudHMucHVzaCgkLmlubmVySFRNTChub2RlKSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9IGVsc2UgaWYgKCdUUicgPT09ICQubm9kZU5hbWUobm9kZSkpIHtcclxuICAgICAgICBpZiAocm93RWxlbWVudHMubGVuZ3RoICE9PSAwKSB7IHJvd0NvbE1hdHJpeC5wdXNoKHJvd0VsZW1lbnRzKTsgfVxyXG4gICAgICAgIHJvd0VsZW1lbnRzID0gW107XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxuICAgIGlmIChyb3dFbGVtZW50cy5sZW5ndGggIT09IDApIHsgcm93Q29sTWF0cml4LnB1c2gocm93RWxlbWVudHMpOyB9XHJcbiAgICByZXR1cm4gcm93Q29sTWF0cml4O1xyXG4gIH1cclxufVxyXG5cclxucmgucmVnaXN0ZXJEYXRhQXR0cigndGFibGUnLCBUYWJsZSk7XHJcbiIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5sZXQgeyAkIH0gPSByaDtcclxuXHJcbmNsYXNzIFRhYmxlTmVzdGVkRGF0YSBleHRlbmRzIHJoLldpZGdldCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcclxuICAgIHN1cGVyKG9wdHMpO1xyXG4gICAgdGhpcy5yb3dDb2xNYXRyaXggPSB0aGlzLmV4dHJhY3RSb3dDb2x1bW5NYXRyaXgodGhpcy5ub2RlKTtcclxuICB9XHJcbiBcclxuICBleHRyYWN0Um93Q29sdW1uTWF0cml4KG5vZGUpIHtcclxuICAgIGxldCByb3dDb2xNYXRyaXggPSBbXTtcclxuICAgIGxldCByb3dFbGVtZW50cyA9IFtdO1xyXG4gICAgdGhpcy50cmF2ZXJzZU5vZGUobm9kZSwgZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICBpZiAoJ1REJyA9PT0gJC5ub2RlTmFtZShub2RlKSkge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc09ubHlUYWJsZShub2RlKSkge1xyXG4gICAgICAgICAgbGV0IGNoaWxkTWF0cml4ID0gdGhpcy5leHRyYWN0Um93Q29sdW1uTWF0cml4KG5vZGUuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgaWYgKGNoaWxkTWF0cml4Lmxlbmd0aCAhPT0gMCkgeyByb3dFbGVtZW50cy5wdXNoKHtjaGlsZDogY2hpbGRNYXRyaXh9KTsgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByb3dFbGVtZW50cy5wdXNoKHtodG1sOiAkLmlubmVySFRNTChub2RlKX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSBpZiAoJ1RSJyA9PT0gJC5ub2RlTmFtZShub2RlKSkge1xyXG4gICAgICAgIGlmIChyb3dFbGVtZW50cy5sZW5ndGggIT09IDApIHsgcm93Q29sTWF0cml4LnB1c2gocm93RWxlbWVudHMpOyB9XHJcbiAgICAgICAgcm93RWxlbWVudHMgPSBbXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG4gICAgaWYgKHJvd0VsZW1lbnRzLmxlbmd0aCAhPT0gMCkgeyByb3dDb2xNYXRyaXgucHVzaChyb3dFbGVtZW50cyk7IH1cclxuICAgIHJldHVybiByb3dDb2xNYXRyaXg7XHJcbiAgfVxyXG5cclxuICBoYXNPbmx5VGFibGUobm9kZSkge1xyXG4gICAgcmV0dXJuICgobm9kZS5jaGlsZHJlbiAhPSBudWxsID8gbm9kZS5jaGlsZHJlbi5sZW5ndGggOiB1bmRlZmluZWQpID09PSAxKSAmJiAoJ1RBQkxFJyA9PT0gJC5ub2RlTmFtZShub2RlLmNoaWxkcmVuWzBdKSk7XHJcbiAgfVxyXG59XHJcblxyXG4vL3JoLnJlZ2lzdGVyRGF0YUF0dHIgJ3RhYmxlcicsIFRhYmxlTmVzdGVkRGF0YVxyXG53aW5kb3cucmgud2lkZ2V0cy5UYWJsZU5lc3RlZERhdGEgPSBUYWJsZU5lc3RlZERhdGE7IiwiLy9KYXZhU2NyaXB0IGhhbmRsZXIuXHJcbmxldCByaCA9IHJlcXVpcmUoXCIuLi8uLi9zcmMvbGliL3JoXCIpXHJcblxyXG5yaC5JbmRpZ29TZXRTaWRlYmFyID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNpZGVCYXJUb1NldCA9IHJoLm1vZGVsLmdldChyaC5jb25zdHMoJ1NJREVCQVJfU1RBVEUnKSk7XHJcblxyXG5cdHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xyXG5cdHZhciB0b2MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvYy1ob2xkZXJcIik7XHJcblx0dmFyIGlkeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWR4LWhvbGRlclwiKTtcclxuXHR2YXIgZ2xvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnbG8taG9sZGVyXCIpO1xyXG5cdHZhciBmdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZ0cy1ob2xkZXJcIik7XHJcblx0dmFyIGZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLWhvbGRlclwiKTtcclxuXHR2YXIgZmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmYXZvcml0ZXMtaG9sZGVyXCIpO1xyXG5cdHZhciBtb2JpbGVNZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2JpbGUtbWVudS1ob2xkZXJcIik7XHJcblxyXG5cdHZhciB2aXNpYmxlQ2xhc3MgPSBcImxheW91dC12aXNpYmxlXCI7XHJcblxyXG5cdHZhciBzZXRWaXNpYmxlID0gZnVuY3Rpb24oZWxlbSkge1xyXG5cdFx0aWYodHlwZW9mKGVsZW0pICE9IFwidW5kZWZpbmVkXCIgJiYgZWxlbSAhPSBudWxsKSB7XHJcblx0XHRcdGVsZW0uY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xyXG5cclxuXHRcdFx0Ly9LZXlib2FyZCBmb2N1cyBvbiBmaXJzdCBsaW5rIGVsZW1lbnQgaW4gdGhlIHBvcHVwLXZpc2libGUuIFRoaXMgYWxsb3dzIGJldHRlciBrZXlib2FyZCBhY2Nlc3MuXHJcblx0XHRcdHZhciBpbnB1dCA9IGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXTtcclxuXHRcdFx0aWYodHlwZW9mKGlucHV0KSAhPSBcInVuZGVmaW5lZFwiICYmIHJoLm1vZGVsLmdldChyaC5jb25zdHMoJ0tFWV9TQ1JFRU5fREVTS1RPUCcpKSkge1xyXG5cdFx0XHRcdGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoXCJ3U2VhcmNoRmllbGRcIikpIHtcclxuXHRcdFx0XHRcdHJoLm1vZGVsLmNwdWJsaXNoKCdFVlRfQ0xPU0VfU0VBUkNIX1NVR0dFU1RJT04nLCB0cnVlKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRcdFx0aW5wdXQuZm9jdXMoKTtcclxuXHRcdFx0XHRcdH0sMzAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRcdGlucHV0LmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHJoLm1vZGVsLmdldChyaC5jb25zdHMoJ0tFWV9TQ1JFRU5fREVTS1RPUCcpKSkge1xyXG5cdFx0XHRcdHZhciBsaXN0ID0gZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpXCIpO1xyXG5cclxuXHRcdFx0XHRpZih0eXBlb2YobGlzdFswXSkgIT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0bGlzdFswXS5mb2N1cygpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGxpbmtzID0gZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIik7XHJcblx0XHRcdFx0XHRpZih0eXBlb2YobGlua3NbMV0pICE9IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0XHRcdFx0bGlua3NbMV0uZm9jdXMoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZih0eXBlb2YobGlua3NbMF0pICE9IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0XHRcdFx0bGlua3NbMF0uZm9jdXMoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0dmFyIHNldEhpZGRlbiA9IGZ1bmN0aW9uKGVsZW0pIHtcclxuXHRcdGlmKHR5cGVvZihlbGVtKSAhPSBcInVuZGVmaW5lZFwiICYmIGVsZW0gIT0gbnVsbCkge1xyXG5cdFx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBtZW51RGVsYXkgPSBcImhhcy1kZWxheVwiO1xyXG5cdHZhciBtZW51SW1tZWRpYXRlID0gXCJuby10cmFuc2Zvcm1cIjtcclxuXHJcblx0dmFyIHNob3dPdGhlck1lbnUgPSBmdW5jdGlvbigpIHtcclxuXHRcdG1vYmlsZU1lbnUuY2xhc3NMaXN0LmFkZChtZW51RGVsYXkpO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0bW9iaWxlTWVudS5jbGFzc0xpc3QucmVtb3ZlKG1lbnVEZWxheSk7XHJcblx0XHRcdG1vYmlsZU1lbnUuY2xhc3NMaXN0LmFkZChtZW51SW1tZWRpYXRlKTtcclxuXHRcdH0sNzUwKTtcclxuXHR9XHJcblxyXG5cdHZhciBoaWRlT3RoZXJNZW51ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdG1vYmlsZU1lbnUuY2xhc3NMaXN0LnJlbW92ZShtZW51SW1tZWRpYXRlKTtcclxuXHRcdH0sIDc1MCk7XHJcblx0fVxyXG5cclxuXHRib2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cC12aXNpYmxlXCIpO1xyXG5cclxuXHRzd2l0Y2goc2lkZUJhclRvU2V0KSB7XHJcblx0XHRjYXNlIFwidG9jXCI6XHJcblx0XHRcdHNob3dPdGhlck1lbnUoKTtcclxuXHRcdFx0c2V0VmlzaWJsZSh0b2MpO1xyXG5cdFx0XHRzZXRIaWRkZW4oaWR4KTtcclxuXHRcdFx0c2V0SGlkZGVuKGdsbyk7XHJcblx0XHRcdHNldEhpZGRlbihmdHMpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZmlsdGVyKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZhdik7XHJcblx0XHRcdHNldEhpZGRlbihtb2JpbGVNZW51KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiaWR4XCI6XHJcblx0XHRcdHNob3dPdGhlck1lbnUoKTtcclxuXHRcdFx0c2V0VmlzaWJsZShpZHgpO1xyXG5cdFx0XHRzZXRIaWRkZW4odG9jKTtcclxuXHRcdFx0c2V0SGlkZGVuKGdsbyk7XHJcblx0XHRcdHNldEhpZGRlbihmdHMpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZmlsdGVyKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZhdik7XHJcblx0XHRcdHNldEhpZGRlbihtb2JpbGVNZW51KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiZ2xvXCI6XHJcblx0XHRcdHNob3dPdGhlck1lbnUoKTtcclxuXHRcdFx0c2V0VmlzaWJsZShnbG8pO1xyXG5cdFx0XHRzZXRIaWRkZW4oaWR4KTtcclxuXHRcdFx0c2V0SGlkZGVuKHRvYyk7XHJcblx0XHRcdHNldEhpZGRlbihmdHMpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZmlsdGVyKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZhdik7XHJcblx0XHRcdHNldEhpZGRlbihtb2JpbGVNZW51KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiZnRzXCI6XHJcblx0XHRcdHNob3dPdGhlck1lbnUoKTtcclxuXHRcdFx0c2V0VmlzaWJsZShmdHMpO1xyXG5cdFx0XHRzZXRIaWRkZW4oaWR4KTtcclxuXHRcdFx0c2V0SGlkZGVuKGdsbyk7XHJcblx0XHRcdHNldEhpZGRlbih0b2MpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZmlsdGVyKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZhdik7XHJcblx0XHRcdHNldEhpZGRlbihtb2JpbGVNZW51KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiZmlsdGVyXCI6XHJcblx0XHRcdHNob3dPdGhlck1lbnUoKTtcclxuXHRcdFx0c2V0VmlzaWJsZShmaWx0ZXIpO1xyXG5cdFx0XHRzZXRIaWRkZW4oaWR4KTtcclxuXHRcdFx0c2V0SGlkZGVuKGdsbyk7XHJcblx0XHRcdHNldEhpZGRlbihmdHMpO1xyXG5cdFx0XHRzZXRIaWRkZW4odG9jKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZhdik7XHJcblx0XHRcdHNldEhpZGRlbihtb2JpbGVNZW51KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiZmF2b3JpdGVzXCI6XHJcblx0XHRcdHNob3dPdGhlck1lbnUoKTtcclxuXHRcdFx0c2V0VmlzaWJsZShmYXYpO1xyXG5cdFx0XHRzZXRIaWRkZW4oaWR4KTtcclxuXHRcdFx0c2V0SGlkZGVuKGdsbyk7XHJcblx0XHRcdHNldEhpZGRlbihmdHMpO1xyXG5cdFx0XHRzZXRIaWRkZW4odG9jKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZpbHRlcik7XHJcblx0XHRcdHNldEhpZGRlbihtb2JpbGVNZW51KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwibWVudVwiOlxyXG5cdFx0XHRzZXRWaXNpYmxlKG1vYmlsZU1lbnUpO1xyXG5cdFx0XHRoaWRlT3RoZXJNZW51KCk7XHJcblx0XHRcdHNldEhpZGRlbihpZHgpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZ2xvKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZ0cyk7XHJcblx0XHRcdHNldEhpZGRlbih0b2MpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZmF2KTtcclxuXHRcdFx0c2V0SGlkZGVuKGZpbHRlcik7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDogLy9Ob3RoaW5nLiBTaG93IHRvcGljXHJcblx0XHRcdHNldEhpZGRlbihpZHgpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZ2xvKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZ0cyk7XHJcblx0XHRcdHNldEhpZGRlbih0b2MpO1xyXG5cdFx0XHRzZXRIaWRkZW4oZmlsdGVyKTtcclxuXHRcdFx0c2V0SGlkZGVuKGZhdik7XHJcblx0XHRcdHNldEhpZGRlbihtb2JpbGVNZW51KTtcclxuXHRcdFx0aGlkZU90aGVyTWVudSgpO1xyXG5cdFx0XHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3B1cC12aXNpYmxlXCIpO1xyXG5cdFx0XHRpZihyaC5tb2RlbC5nZXQocmguY29uc3RzKCdLRVlfU0NSRUVOX0RFU0tUT1AnKSkpIHtcclxuXHRcdFx0XHRyaC5JbmRpZ29TZXRGb2N1c09uU2VhcmNoKCk7XHJcblx0XHRcdH1cclxuXHR9XHJcbn1cclxucmguSW5kaWdvU2V0Rm9jdXNPblNlYXJjaCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIik7XHJcblx0Zm9yKHZhciBpPTA7aTxpbnB1dC5sZW5ndGg7aSsrKXtcclxuXHRcdGlmKGlucHV0W2ldLmNsYXNzTGlzdC5jb250YWlucyhcIndTZWFyY2hGaWVsZFwiKSl7XHJcblx0XHRcdHJoLm1vZGVsLmNwdWJsaXNoKCdFVlRfQ0xPU0VfU0VBUkNIX1NVR0dFU1RJT04nLCB0cnVlKTtcclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdGlucHV0W2ldLmZvY3VzKCk7XHJcblx0XHRcdH0sMzAwKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbnJoLkluZGlnb1NldFNpZGViYXJTZWFyY2ggPSBmdW5jdGlvbigpIHtcclxuXHRyaC5tb2RlbC5wdWJsaXNoKHJoLmNvbnN0cyhcIlNJREVCQVJfU1RBVEVcIiksIFwiZnRzXCIpO1xyXG59XHJcbnJoLkluZGlnb1NldFRyYW5zaXRpb25BbGxvdyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xyXG5cclxuXHR2YXIgYWxsb3dQaG9uZSA9IFwiYWxsb3ctcGhvbmUtdHJhbnNpdGlvbnNcIjtcclxuXHR2YXIgYWxsb3dUYWJsZXQgPSBcImFsbG93LXRhYmxldC10cmFuc2l0aW9uc1wiO1xyXG5cdHZhciBhbGxvd0Rlc2t0b3AgPSBcImFsbG93LWRlc2t0b3AtdHJhbnNpdGlvbnNcIjtcclxuXHJcblx0Ym9keS5jbGFzc0xpc3QucmVtb3ZlKGFsbG93UGhvbmUpO1xyXG5cdGJvZHkuY2xhc3NMaXN0LnJlbW92ZShhbGxvd1RhYmxldCk7XHJcblx0Ym9keS5jbGFzc0xpc3QucmVtb3ZlKGFsbG93RGVza3RvcCk7XHJcblxyXG5cdHZhciB0b1NldCA9IGZhbHNlO1xyXG5cdGlmKHJoLm1vZGVsLmdldChyaC5jb25zdHMoJ0tFWV9TQ1JFRU5fUEhPTkUnKSkgPT0gdHJ1ZSkge1xyXG5cdFx0dG9TZXQgPSBhbGxvd1Bob25lO1xyXG5cdH0gZWxzZSBpZihyaC5tb2RlbC5nZXQocmguY29uc3RzKCdLRVlfU0NSRUVOX1RBQkxFVCcpKSA9PSB0cnVlKSB7XHJcblx0XHR0b1NldCA9IGFsbG93VGFibGV0O1xyXG5cdH0gZWxzZSBpZihyaC5tb2RlbC5nZXQocmguY29uc3RzKCdLRVlfU0NSRUVOX0RFU0tUT1AnKSkgPT0gdHJ1ZSkge1xyXG5cdFx0dG9TZXQgPSBhbGxvd0Rlc2t0b3A7XHJcblx0fVxyXG5cclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0Ym9keS5jbGFzc0xpc3QucmVtb3ZlKGFsbG93UGhvbmUpOy8vQWx3YXlzIG1ha2Ugc3VyZSB0aGVyZSBpcyBvbmx5IDFcclxuXHRcdGJvZHkuY2xhc3NMaXN0LnJlbW92ZShhbGxvd1RhYmxldCk7XHJcblx0XHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoYWxsb3dEZXNrdG9wKTtcclxuXHJcblx0XHRib2R5LmNsYXNzTGlzdC5hZGQodG9TZXQpO1xyXG5cclxuXHR9LCAxMCk7XHJcblxyXG59XHJcblxyXG5yaC5pbml0SW5kaWdvID0gKCkgPT4ge1xyXG5cclxuXHRyaC5tb2RlbC5zdWJzY3JpYmUocmguY29uc3RzKFwiU0lERUJBUl9TVEFURVwiKSwgcmguSW5kaWdvU2V0U2lkZWJhcik7XHJcblx0cmgubW9kZWwuc3Vic2NyaWJlKHJoLmNvbnN0cyhcIkVWVF9TRUFSQ0hfSU5fUFJPR1JFU1NcIiksIHJoLkluZGlnb1NldFNpZGViYXJTZWFyY2gpO1xyXG5cdHJoLm1vZGVsLnN1YnNjcmliZShyaC5jb25zdHMoXCJLRVlfU0NSRUVOXCIpLCByaC5JbmRpZ29TZXRUcmFuc2l0aW9uQWxsb3cpO1xyXG5cclxuXHQvL1doZW4gb3BlbmluZyB0aGUgcGFnZSwgY2hlY2sgd2hldGhlciB0aGVyZSBpcyBhIGhpZ2hsaWdodCB0ZXJtLlxyXG5cdC8vSWYgZm91bmQsIGFkZCBpdCB0byB0aGUgc2VhcmNoIGJveFxyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdHZhciBoaWdobGlnaHQgPSBnZXRVcmxQYXJhbWV0ZXIoUkhISUdITElHSFRURVJNKTtcclxuXHRcdGlmKGhpZ2hsaWdodCAhPSBcIlwiKSB7XHJcblx0XHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIik7XHJcblx0XHRcdGZvcih2YXIgaT0wO2k8aW5wdXQubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0aWYoaW5wdXRbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwid1NlYXJjaEZpZWxkXCIpKXtcclxuXHRcdFx0XHRcdGlucHV0W2ldLnZhbHVlID0gaGlnaGxpZ2h0O1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICByaC5tb2RlbC5wdWJsaXNoKHJoLmNvbnN0cygnS0VZX1NFQVJDSF9URVJNJyksIGhpZ2hsaWdodCk7XHJcblx0ICB9XHJcbiAgfSwgMjUwKTtcclxuXHJcblx0Ly9Gb3IgS2V5Ym9hcmQgYWNjZXNzaWJpbGl0eSwgZ2V0IHRoZSBFU0Mga2V5IHRvIGNsb3NlIG92ZXJsYXlzXHJcblx0ZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24oZXZ0KSB7XHJcblx0XHRldnQgPSBldnQgfHwgd2luZG93LmV2ZW50O1xyXG5cdFx0aWYgKGV2dC5rZXlDb2RlID09IDI3KSB7XHJcblx0XHRcdHJoLm1vZGVsLnB1Ymxpc2gocmguY29uc3RzKCdTSURFQkFSX1NUQVRFJyksIGZhbHNlKTtcclxuXHRcdFx0cmguSW5kaWdvU2V0Rm9jdXNPblNlYXJjaCgpOy8vRm9jdXMgb24gdGhlIHNlYXJjaCBmb3Iga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuIiwibGV0IHsgXyB9ID0gd2luZG93LnJoO1xyXG5cclxuXHJcbl8uc3RhY2tUcmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGxldCBlcnIgPSBuZXcgRXJyb3IoKTtcclxuICByZXR1cm4gZXJyLnN0YWNrO1xyXG59O1xyXG5cclxuXy5zYWZlRXhlYyA9IGZuID0+XHJcbiAgZnVuY3Rpb24oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGlmIChyaC5fZGVidWcpIHsgcmguX2QoJ2Vycm9yJywgYEZ1bmN0aW9uOiAke2ZufWAsIGVycm9yLm1lc3NhZ2UpOyB9XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG47XHJcbiIsImxldCB7IF8gfSA9IHdpbmRvdy5yaDtcclxuXHJcblxyXG5fLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihvYmosIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcclxuICBpZiAob2JqID09IG51bGwpIHsgb2JqID0gd2luZG93OyB9XHJcbiAgaWYgKG9iai5hZGRFdmVudExpc3RlbmVyICE9IG51bGwpIHtcclxuICAgIHJldHVybiBvYmouYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBmYWxzZSk7XHJcbiAgfSBlbHNlIGlmIChvYmouYXR0YWNoRXZlbnQgIT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIG9iai5hdHRhY2hFdmVudChgb24ke2V2ZW50TmFtZX1gLCBjYWxsYmFjayk7XHJcbiAgfVxyXG59O1xyXG5cclxuXy5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24ob2JqLCBldmVudE5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKG9iaiA9PSBudWxsKSB7IG9iaiA9IHdpbmRvdzsgfVxyXG4gIGlmIChvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lciAhPSBudWxsKSB7XHJcbiAgICByZXR1cm4gb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xyXG4gIH0gZWxzZSBpZiAob2JqLmRldGFjaEV2ZW50ICE9IG51bGwpIHtcclxuICAgIHJldHVybiBvYmouZGV0YWNoRXZlbnQoYG9uJHtldmVudE5hbWV9YCwgY2FsbGJhY2spO1xyXG4gIH1cclxufTtcclxuXHJcbl8uaXNUb3VjaEVuYWJsZWQgPSAoKSA9PiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG5fLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oZSkge1xyXG4gIGlmIChlLnByZXZlbnREZWZhdWx0ICE9IG51bGwpIHtcclxuICAgIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuXy5tb3VzZUJ1dHRvbiA9IGZ1bmN0aW9uKGUpIHtcclxuICBpZiAoJ2J1dHRvbnMnIGluIGUpIHtcclxuICAgIHJldHVybiBlLmJ1dHRvbnM7XHJcbiAgfSBlbHNlIGlmICgnd2hpY2gnIGluIGUpIHtcclxuICAgIHJldHVybiBlLndoaWNoO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZS5idXR0b247XHJcbiAgfVxyXG59O1xyXG5cclxuXy5pbml0TW91c2VNb3ZlID0gKGZ1bmN0aW9uKCkge1xyXG4gIGxldCBpbml0RG9uZSA9IGZhbHNlO1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGlmICghaW5pdERvbmUpIHtcclxuICAgICAgaW5pdERvbmUgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gXy5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmICghZS5kZWZhdWx0UHJldmVudGVkKSB7XHJcbiAgICAgICAgICBsZXQgb2JqID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZLCB3aGljaDogXy5tb3VzZUJ1dHRvbihlKX07XHJcbiAgICAgICAgICByaC5tb2RlbC5wdWJsaXNoKHJoLmNvbnN0cygnRVZUX01PVVNFTU9WRScpLCBvYmosIHtzeW5jOiB0cnVlfSk7XHJcbiAgICAgICAgICBpZiAob2JqLmRlZmF1bHRQcmV2ZW50ZWQpIHsgcmV0dXJuIF8ucHJldmVudERlZmF1bHQoZSk7IH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbn0pKCk7XHJcblxyXG5fLmluaXRUb3VjaEV2ZW50ID0gKGZ1bmN0aW9uKCkge1xyXG4gIGxldCBpbml0RG9uZSA9IGZhbHNlO1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGlmICghaW5pdERvbmUgJiYgXy5pc1RvdWNoRW5hYmxlZCgpKSB7XHJcbiAgICAgIGxldCB4LCB5LCB5MTtcclxuICAgICAgaW5pdERvbmUgPSB0cnVlO1xyXG4gICAgICBsZXQgeDEgPSAoeTEgPSAoeCA9ICh5ID0gMCkpKTtcclxuICBcclxuICAgICAgbGV0IGNhbGN1bGF0ZURpcmVjdGlvbiA9IF8uZGVib3VuY2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbjtcclxuICAgICAgICBsZXQgYW5nbGUgPSBNYXRoLmF0YW4oKHkxIC0geSkgLyAoeDEgLSB4KSk7XHJcbiAgICAgICAgaWYgKHgxID4geCkge1xyXG4gICAgICAgICAgZGlyZWN0aW9uID1cclxuICAgICAgICAgICAgYW5nbGUgPiAoTWF0aC5QSSAvIDQpID9cclxuICAgICAgICAgICAgICAnZG93bidcclxuICAgICAgICAgICAgOiBhbmdsZSA8ICgtTWF0aC5QSSAvIDQpID9cclxuICAgICAgICAgICAgICAndXAnXHJcbiAgICAgICAgICAgIDpcclxuICAgICAgICAgICAgICAncmlnaHQnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkaXJlY3Rpb24gPVxyXG4gICAgICAgICAgICBhbmdsZSA+IChNYXRoLlBJIC8gNCkgP1xyXG4gICAgICAgICAgICAgICd1cCdcclxuICAgICAgICAgICAgOiBhbmdsZSA8ICgtTWF0aC5QSSAvIDQpID9cclxuICAgICAgICAgICAgICAnZG93bidcclxuICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICAgICdsZWZ0JztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmgubW9kZWwucHVibGlzaCgnLnRvdWNobW92ZScsIHt4LCB5LCB4MSwgeTF9KTtcclxuICAgICAgICByaC5tb2RlbC5wdWJsaXNoKHJoLmNvbnN0cygnRVZUX1NXSVBFX0RJUicpLCBkaXJlY3Rpb24sIHtzeW5jOiB0cnVlfSk7XHJcbiAgICAgICAgcmgubW9kZWwucHVibGlzaChyaC5jb25zdHMoJ0VWVF9TV0lQRV9ESVInKSwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIHggPSAoeSA9IDApO1xyXG4gICAgICB9XHJcbiAgICAgICwgMjAwKTtcclxuXHJcbiAgICAgIHJldHVybiBfLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgeDEgPSAoZS50b3VjaGVzWzBdICE9IG51bGwgPyBlLnRvdWNoZXNbMF0ucGFnZVggOiB1bmRlZmluZWQpIHx8IDA7XHJcbiAgICAgICAgeTEgPSAoZS50b3VjaGVzWzBdICE9IG51bGwgPyBlLnRvdWNoZXNbMF0ucGFnZVkgOiB1bmRlZmluZWQpIHx8IDA7XHJcbiAgICAgICAgaWYgKCh4ID09PSAwKSAmJiAoeSA9PT0gMCkpIHtcclxuICAgICAgICAgIHggPSB4MTtcclxuICAgICAgICAgIHkgPSB5MTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhbGN1bGF0ZURpcmVjdGlvbigpO1xyXG4gICAgICAgIHJldHVybiBfLnByZXZlbnREZWZhdWx0KGUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59KSgpO1xyXG4iLCJsZXQgeyBfIH0gPSB3aW5kb3cucmg7XHJcblxyXG4vLyBSZWd1bGFyIEV4cHJlc3Npb25zXHJcblxyXG4vLyBFeDogQGtleSgnd293JykgPT4gdGhpcy5wdWJsaXNoKCdrZXknLCAnd293Jyk7XHJcbmxldCBwdWJsaXNoUmVneCA9IC8oXnxbXlxcXFxdKUAoW1xcd1xcLl0qKVxcKCguKilcXCkvO1xyXG5cclxuLy8gRXg6IHggPSBAa2V5ID0+IHggPSB0aGlzLmdldCgna2V5Jyk7XHJcbmxldCBnZXRSZWd4ID0gLyhefFteXFxcXF0pQChbXFx3XFwuXSopLztcclxuXHJcbi8vIEV4OiB4ID0gQEtFWSA9PiB4ID0gcmguY29uc3RzKCdLRVknKVxyXG5sZXQgbW9kZWxDb25zdHNSZWd4ID0gL0AoW0EtWl1bX0EtWjAtOV0qKS87XHJcblxyXG5cclxuXy5yZXNvbHZlUHVibGlzaCA9IGZ1bmN0aW9uKGV4cHJlc3Npb24pIHtcclxuICBsZXQgcmVnZXggPSBuZXcgUmVnRXhwKHB1Ymxpc2hSZWd4KTtcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhleHByZXNzaW9uKTtcclxuICAgIGlmICghbWF0Y2gpIHsgYnJlYWs7IH1cclxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UobWF0Y2hbMF0sXHJcbiAgICAgIGAke21hdGNoWzFdfSB0aGlzLnB1Ymxpc2goJyR7bWF0Y2hbMl19JywgJHttYXRjaFszXX0pYCk7XHJcbiAgfVxyXG4gIHJldHVybiBleHByZXNzaW9uO1xyXG59O1xyXG5cclxuXy5yZXNvbHZlR2V0ID0gZnVuY3Rpb24oZXhwcmVzc2lvbiwga2V5cykge1xyXG4gIGxldCByZWdleCA9IG5ldyBSZWdFeHAoZ2V0UmVneCk7XHJcbiAgd2hpbGUgKHRydWUpIHtcclxuICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoZXhwcmVzc2lvbik7XHJcbiAgICBpZiAoIW1hdGNoKSB7IGJyZWFrOyB9XHJcbiAgICBpZiAoa2V5cyAmJiAoLTEgPT09IGtleXMuaW5kZXhPZihtYXRjaFsyXSkpKSB7IGtleXMucHVzaChtYXRjaFsyXSk7IH1cclxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UobWF0Y2hbMF0sXHJcbiAgICAgIGAke21hdGNoWzFdfSB0aGlzLmdldCgnJHttYXRjaFsyXX0nKWApO1xyXG4gIH1cclxuICByZXR1cm4gZXhwcmVzc2lvbjtcclxufTtcclxuXHJcbl8ucmVzb2x2ZU1vZGVsQ29uc3QgPSBmdW5jdGlvbihleHByZXNzaW9uKSB7XHJcbiAgbGV0IHN1YmV4cCA9ICcnO1xyXG4gIGxldCByZWdleCA9IG5ldyBSZWdFeHAobW9kZWxDb25zdHNSZWd4KTtcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhleHByZXNzaW9uKTtcclxuICAgIGlmICghbWF0Y2gpIHsgYnJlYWs7IH1cclxuICAgIGxldCBrZXkgPSByaC5jb25zdHMobWF0Y2hbMV0pO1xyXG4gICAgaWYgKGtleSAhPSBudWxsKSB7XHJcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UobWF0Y2hbMF0sIGBAJHtrZXl9YCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgaW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aCArIDE7XHJcbiAgICAgIHN1YmV4cCArPSBleHByZXNzaW9uLnN1YnN0cmluZygwLCBpbmRleCk7XHJcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnN1YnN0cmluZyhpbmRleCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBzdWJleHAgKyBleHByZXNzaW9uO1xyXG59O1xyXG5cclxuXy5yZXNvbHZlTW9kZWxLZXlzID0gZnVuY3Rpb24oZXhwcmVzc2lvbiwga2V5cykge1xyXG4gIHJldHVybiB0aGlzLnJlc29sdmVHZXQodGhpcy5yZXNvbHZlUHVibGlzaCh0aGlzLnJlc29sdmVNb2RlbENvbnN0KGV4cHJlc3Npb24pKSwga2V5cyk7XHJcbn07XHJcblxyXG5fLmlzVmFsaWRNb2RlbEtleSA9IGZ1bmN0aW9uKGtleSkge1xyXG4gIGlmICgoa2V5ID09PSAndHJ1ZScpIHx8IChrZXkgPT09ICdmYWxzZScpKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gIGxldCBtYXRjaCA9IGtleS5tYXRjaCgvWy5fYS16QS1aXVsuX2EtekEtWjAtOSBdKi8pO1xyXG4gIHJldHVybiBtYXRjaCAmJiAobWF0Y2hbMF0gPT09IGtleSk7XHJcbn07XHJcblxyXG5fLmlzVmFsaWRNb2RlbENvbnN0S2V5ID0gZnVuY3Rpb24oa2V5KSB7XHJcbiAgbGV0IG1hdGNoID0ga2V5Lm1hdGNoKC9bQS1aXVtfQS1aMC05XSovKTtcclxuICByZXR1cm4gbWF0Y2ggJiYgKG1hdGNoWzBdID09PSBrZXkpO1xyXG59O1xyXG5cclxuXy5nZXQgPSBmdW5jdGlvbihvYmosIGl0ZW1LZXkpIHtcclxuICBsZXQgdmFsdWU7XHJcbiAgbGV0IGtleXMgPSBpdGVtS2V5LnNwbGl0KCcuJyk7XHJcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICBsZXQga2V5ID0ga2V5c1tpbmRleF07XHJcbiAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgdmFsdWUgPSBvYmpba2V5XTtcclxuICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcclxuICAgICAgdmFsdWUgPSB2YWx1ZVtrZXldO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuXHJcbl8uaXNTY3JlZW5BdHRhY2hlZCA9IHNjcnJlbk5hbWUgPT4gdHJ1ZSA9PT0gcmgubW9kZWwuZ2V0KGAke3JoLmNvbnN0cygnS0VZX1NDUkVFTicpfS4ke3NjcnJlbk5hbWV9LmF0dGFjaGVkYCk7XHJcblxyXG5fLnBhcmVudEtleSA9IGZ1bmN0aW9uKGZ1bGxLZXkpIHtcclxuICBsZXQga2V5cyA9IGZ1bGxLZXkuc3BsaXQoJy4nKTtcclxuICAoa2V5cy5wb3ApKCk7XHJcbiAgcmV0dXJuIGtleXMuam9pbignLicpO1xyXG59O1xyXG5cclxuXy5sYXN0S2V5ID0gZnVuY3Rpb24oZnVsbEtleSkge1xyXG4gIGxldCBrZXlzID0gZnVsbEtleS5zcGxpdCgnLicpO1xyXG4gIHJldHVybiBrZXlzW2tleXMubGVuZ3RoIC0gMV07XHJcbn07XHJcblxyXG5fLnNwbGl0S2V5ID0gZnVuY3Rpb24oZnVsbEtleSkge1xyXG4gIGxldCBrZXlzID0gZnVsbEtleS5zcGxpdCgnLicpO1xyXG4gIGxldCBrZXkgPSAoa2V5cy5wb3ApKCk7XHJcbiAgbGV0IHBhcmVudEtleSA9IGtleXMuam9pbignLicpO1xyXG4gIHJldHVybiB7a2V5LCBwYXJlbnRLZXl9O1xyXG59O1xyXG4iLCJsZXQgeyBfIH0gPSB3aW5kb3cucmg7XHJcblxyXG4vL1JlZ3VsYXIgRXhwcmVzc2lvbnNcclxuXHJcbi8vRXg6IFwiYWJjICN7dmFyMX1cIlxyXG5sZXQgZW5jbG9zZWRWYXJSZWd4ID0gL1xcI3soW159XSopXFx9L2c7XHJcbmxldCB1c2VyVmFyUmVneCA9IC9cXCQoW19hLXpBLVpdW19hLXpBLVowLTldKikvZztcclxubGV0IHJlZ3hTdHJpbmdSZWd4ID0gL1xcQlxcLyhbXlxcL10qKVxcLy9nO1xyXG5cclxuXy50b1JlZ0V4cCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gIGxldCByZWd4O1xyXG4gIGlmICghc3RyIHx8ICFfLmlzU3RyaW5nKHN0cikpIHsgcmV0dXJuIHN0cjsgfVxyXG4gIGxldCBtYXRjaGVzID0gc3RyLm1hdGNoKHJlZ3hTdHJpbmdSZWd4KTtcclxuICBsZXQgbWF0Y2ggPSBtYXRjaGVzICYmIG1hdGNoZXNbMF07XHJcbiAgaWYgKG1hdGNoKSB7XHJcbiAgICBsZXQgcGF0dGVybiA9IG1hdGNoLnN1YnN0cmluZygxLCBtYXRjaC5sZW5ndGggLSAxKTtcclxuICAgIGxldCBmbGFnID0gc3RyLnN1YnN0cmluZyhtYXRjaC5sZW5ndGgpO1xyXG4gICAgcmVneCA9IG5ldyBSZWdFeHAocGF0dGVybiwgZmxhZyk7XHJcbiAgfVxyXG4gIHJldHVybiByZWd4IHx8IHN0cjtcclxufTtcclxuXHJcbl8uc3BsaXRBbmRUcmltID0gZnVuY3Rpb24oc3RyaW5nLCBzcGxpdEtleSkge1xyXG4gIGlmIChzdHJpbmcgPT0gbnVsbCkgeyBzdHJpbmcgPSAnJzsgfVxyXG4gIHJldHVybiBfLm1hcChzdHJpbmcuc3BsaXQoc3BsaXRLZXkpLCB2YWx1ZSA9PiB2YWx1ZS50cmltKCkpO1xyXG59O1xyXG5cclxuLypcclxuICogRXhwbG9kZXMgYSBzdHJpbmcgYmFzZWQgb24gZXhwbG9kZUtleSB0aGVuXHJcbiAqIGNyZWF0ZXMgYSBtYXAgdXNpbmcgdGhlIGV4cGxvZGVkIHN0cmluZ3MgYnkgc3BsaXR0aW5nIHRoZW0gZnVydGhlciBvbiBtYXBLZXlcclxuICovXHJcbl8uZXhwbG9kZUFuZE1hcCA9IGZ1bmN0aW9uKHN0cmluZywgZXhwbG9kZUtleSwgbWFwS2V5LCBvcHRzKSB7XHJcbiAgaWYgKHN0cmluZyA9PSBudWxsKSB7IHN0cmluZyA9ICcgJzsgfVxyXG4gIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IHt9OyB9XHJcbiAgbGV0IHBhaXJzID0gc3RyaW5nLnNwbGl0KGV4cGxvZGVLZXkpO1xyXG4gIGxldCByZWdleCA9IG5ldyBSZWdFeHAoYCR7bWFwS2V5fSguKyk/YCk7XHJcbiAgbGV0IG1hcCA9IHt9O1xyXG5cclxuICBmb3IgKGxldCByYXdQYWlyIG9mIEFycmF5LmZyb20ocGFpcnMpKSB7XHJcbiAgICBsZXQgcGFpciA9IHJhd1BhaXIuc3BsaXQocmVnZXgpO1xyXG4gICAgbGV0IGtleSA9IHBhaXJbMF0udHJpbSgpO1xyXG4gICAgbGV0IHZhbHVlID0gcGFpclsxXTtcclxuXHJcbiAgICBpZiAob3B0cy5jYXNlSW5zZW5zaXRpdmUpIHsga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7IH1cclxuICAgIGlmIChvcHRzLnRyaW0pIHsgdmFsdWUgPSB2YWx1ZSAmJiB2YWx1ZS50cmltKCk7IH1cclxuICAgIGlmICgob3B0cy5kZWZhdWx0ICE9IG51bGwpICYmICh2YWx1ZSA9PSBudWxsKSkgeyB2YWx1ZSA9IG9wdHMuZGVmYXVsdDsgfVxyXG5cclxuICAgIGlmIChrZXkgIT09ICcnKSB7IG1hcFtrZXldID0gdmFsdWU7IH1cclxuICB9XHJcbiAgcmV0dXJuIG1hcDtcclxufTtcclxuXHJcbl8ucmVzb2x2ZU5hbWVkVmFyID0gZnVuY3Rpb24oZXhwcikge1xyXG4gIGxldCBtYXRjaGVzO1xyXG4gIGlmIChtYXRjaGVzID0gZXhwci5tYXRjaCh1c2VyVmFyUmVneCkpIHtcclxuICAgIGZvciAobGV0IG1hdGNoIG9mIEFycmF5LmZyb20obWF0Y2hlcykpIHtcclxuICAgICAgZXhwciA9IGV4cHIucmVwbGFjZShtYXRjaCwgYHRoaXMudXNlcl92YXJzLiR7bWF0Y2guc3Vic3RyaW5nKDEpfWApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZXhwcjtcclxufTtcclxuXHJcbl8ucmVzb2x2ZUVuY2xvc2VkVmFyID0gZnVuY3Rpb24oZXhwciwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICBsZXQgbWF0Y2hlcztcclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzOyB9XHJcbiAgaWYgKG1hdGNoZXMgPSBleHByLm1hdGNoKGVuY2xvc2VkVmFyUmVneCkpIHtcclxuICAgIGZvciAobGV0IG1hdGNoIG9mIEFycmF5LmZyb20obWF0Y2hlcykpIHtcclxuICAgICAgbGV0IG5hbWUgPSBtYXRjaC5zdWJzdHJpbmcoMiwgbWF0Y2gubGVuZ3RoIC0gMSkudHJpbSgpO1xyXG4gICAgICBsZXQgdmFsdWUgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG5hbWUpO1xyXG4gICAgICBleHByID0gZXhwci5yZXBsYWNlKG1hdGNoLCAodmFsdWUgIT0gbnVsbCkgPyB2YWx1ZSA6ICcnKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGV4cHI7XHJcbn07XHJcblxyXG4vLyB1c2UgJy4nIGFzIGF0dHJpYiBuYW1lIHRvIHBhc3Mgb3B0cyBmb3IgYXR0cnMgZGF0YVxyXG5fLnJlc29sdmVBdHRyID0gc3RyaW5nID0+XHJcbiAgXy5yZWR1Y2UoXy5leHBsb2RlQW5kTWFwKHN0cmluZywgJzsnLCAnOicpLCBmdW5jdGlvbihyLCB2LCBrKSB7XHJcbiAgICBfLmVhY2goay5zcGxpdCgnLCcpLCBrZXkgPT4gcltrZXkudHJpbSgpXSA9IHYpO1xyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG4gICwge30pXHJcbjtcclxuXHJcbl8ucmVzb2x2ZU5pY2VKU09OID0gZnVuY3Rpb24oc3RyaW5nKSB7XHJcbiAgaWYgKHN0cmluZyA9PSBudWxsKSB7IHN0cmluZyA9ICcnOyB9XHJcbiAgc3RyaW5nID0gKHN0cmluZy50cmltKSgpO1xyXG4gIGlmICghc3RyaW5nKSB7IHJldHVybiB7fTsgfVxyXG4gIGlmIChzdHJpbmdbMF0gPT09ICd7Jykge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyaW5nKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLycvZywgJ1wiJyk7XHJcbiAgICBzdHJpbmcgPSBgeyR7c3RyaW5nfX1gO1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyaW5nLnJlcGxhY2UoLyhcXHt8LClcXHMqKC4rPylcXHMqOi9nLCAnJDEgXCIkMlwiOicpKTtcclxuICB9XHJcbn07XHJcblxyXG5fLnJlc29sdmVQaXBlZEV4cHJlc3Npb24gPSBmdW5jdGlvbihzdHJpbmcpIHtcclxuICBpZiAoc3RyaW5nID09IG51bGwpIHsgc3RyaW5nID0gJyc7IH1cclxuICBsZXQgY29uY2F0TmV4dCA9IGZhbHNlO1xyXG4gIHJldHVybiBfLnJlZHVjZShzdHJpbmcuc3BsaXQoJ3wnKSwgZnVuY3Rpb24ocmVzdWx0LCBpdGVtKSB7XHJcbiAgICBsZXQgbWVyZ2VkSXRlbTtcclxuICAgIGlmIChjb25jYXROZXh0ICYmIChyZXN1bHQubGVuZ3RoID4gMCkpIHtcclxuICAgICAgbWVyZ2VkSXRlbSA9IGAke3Jlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV19IHx8JHtpdGVtfWA7XHJcbiAgICAgIHJlc3VsdC5sZW5ndGggPSByZXN1bHQubGVuZ3RoIC0gMTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uY2F0TmV4dCA9IGl0ZW0ubGVuZ3RoID09PSAwO1xyXG4gICAgaWYgKG1lcmdlZEl0ZW0pIHsgaXRlbSA9IG1lcmdlZEl0ZW07IH1cclxuICAgIFxyXG4gICAgaWYgKGl0ZW0ubGVuZ3RoICE9PSAwKSB7IHJlc3VsdC5wdXNoKGl0ZW0udHJpbSgpKTsgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgLCBbXSk7XHJcbn07XHJcblxyXG5fLnJlc29sdmVMb29wRXhwciA9IGZ1bmN0aW9uKGNvbmZpZykge1xyXG4gIGxldCB2YWx1ZSA9IGNvbmZpZy5zcGxpdCgnOicpO1xyXG4gIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XHJcbiAgICBsZXQgdmFycyA9IF8uc3BsaXRBbmRUcmltKHZhbHVlLnNoaWZ0KCksICcsJyk7XHJcbiAgICByZXR1cm4ge2V4cHI6IHZhbHVlWzBdLCBpbmRleDogdmFyc1swXSwgaXRlbTogdmFyc1sxXX07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7ZXhwcjogdmFsdWVbMF19O1xyXG4gIH1cclxufTtcclxuXHJcbl8ucmVzb2x2ZVdpZGdldEFyZ3MgPSBmdW5jdGlvbihyYXdBcmdzKSB7XHJcbiAgbGV0IHBhaXJzID0gcmF3QXJncy5zcGxpdCgnOycpO1xyXG4gIHJldHVybiBfLm1hcChwYWlycywgZnVuY3Rpb24ocGFpcikge1xyXG4gICAgbGV0IHdBcmc7XHJcbiAgICBsZXQgcGlwZWRBcmdzID0gXy5yZXNvbHZlUGlwZWRFeHByZXNzaW9uKHBhaXIpO1xyXG4gICAgbGV0IGFyZ3MgPSAocGlwZWRBcmdzLnNoaWZ0KSgpIHx8ICcnO1xyXG4gICAgYXJncyA9IGFyZ3Muc3BsaXQoLzooLispPy8pO1xyXG4gICAgbGV0IHdOYW1lID0gYXJnc1swXS50cmltKCk7XHJcbiAgICBsZXQgcmF3QXJnID0gcGFpci5zdWJzdHJpbmcod05hbWUubGVuZ3RoKS50cmltKCk7XHJcbiAgICBpZiAocmF3QXJnWzBdID09PSAnOicpIHsgcmF3QXJnID0gcmF3QXJnLnN1YnN0cmluZygxKTsgfVxyXG4gICAgaWYgKHdBcmcgPSBhcmdzWzFdKSB7XHJcbiAgICAgIGlmICgtMSAhPT0gd0FyZy5zZWFyY2goJzonKSkge1xyXG4gICAgICAgIHdBcmcgPSBfLmV4cGxvZGVBbmRNYXAod0FyZywgJywnLCAnOicsIHt0cmltOiB0cnVlfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd0FyZyA9IHthcmc6IHdBcmd9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge3dOYW1lLCB3QXJnLCBwaXBlZEFyZ3MsIHJhd0FyZ307XHJcbn0pO1xyXG59O1xyXG5cclxuXy5yZXNvbHZlRXhwck9wdGlvbnMgPSBmdW5jdGlvbihyYXdBcmdzKSB7XHJcbiAgbGV0IG9wdHM7XHJcbiAgbGV0IHZhbHVlcyA9IF8ucmVzb2x2ZVBpcGVkRXhwcmVzc2lvbihyYXdBcmdzKTtcclxuICBpZiAodmFsdWVzWzFdKSB7IG9wdHMgPSBfLnJlc29sdmVOaWNlSlNPTih2YWx1ZXNbMV0pOyB9XHJcbiAgcmV0dXJuIHtleHByOiB2YWx1ZXNbMF0sIG9wdHN9O1xyXG59O1xyXG5cclxuXy5yZXNvbHZlSW5wdXRLZXlzID0gZnVuY3Rpb24ocmF3QXJncykge1xyXG4gIGxldCBvcHRzO1xyXG4gIGxldCB2YWx1ZXMgPSBfLnJlc29sdmVQaXBlZEV4cHJlc3Npb24ocmF3QXJncyk7XHJcbiAgaWYgKHZhbHVlc1sxXSkgeyBvcHRzID0gXy5yZXNvbHZlTmljZUpTT04odmFsdWVzWzFdKTsgfVxyXG4gIGxldCBrZXlzID0gXy5leHBsb2RlQW5kTWFwKHZhbHVlc1swXSwgJywnLCAnOicsIHt0cmltOiB0cnVlfSk7XHJcbiAgcmV0dXJuIHtrZXlzLCBvcHRzfTtcclxufTtcclxuXHJcbl8uYXBwbHlDYWxsYmFja09wdGlvbnMgPSBmdW5jdGlvbihjYWxsYmFjaywgb3B0cykge1xyXG4gIGxldCBuZXdDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gIGlmIChvcHRzICYmIG9wdHMuZGVib3VuY2UpIHtcclxuICAgIG5ld0NhbGxiYWNrID0gXy5kZWJvdW5jZShuZXdDYWxsYmFjaywgb3B0cy5kZWJvdW5jZSk7XHJcbiAgfVxyXG4gICAgXHJcbiAgaWYgKG9wdHMgJiYgb3B0cy50b2dnbGVUaW1lb3V0KSB7XHJcbiAgICBuZXdDYWxsYmFjayA9IF8udG9nZ2xlVGltZW91dChuZXdDYWxsYmFjaywgb3B0cy50b2dnbGVUaW1lb3V0KTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRzICYmIG9wdHMudGltZW91dCkge1xyXG4gICAgbmV3Q2FsbGJhY2sgPSBfLnRpbWVvdXQobmV3Q2FsbGJhY2ssIG9wdHMudGltZW91dCk7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0cyAmJiBvcHRzLmRlZmVyKSB7XHJcbiAgICBuZXdDYWxsYmFjayA9IF8udGltZW91dChuZXdDYWxsYmFjaywgMSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3Q2FsbGJhY2s7XHJcbn07XHJcblxyXG5fLnBhcnNlSW50ID0gZnVuY3Rpb24oc3RyaW5nLCBkZWZhdWx0VmFsdWUsIGJhc2UpIHtcclxuICBpZiAoYmFzZSA9PSBudWxsKSB7IGJhc2UgPSAxMDsgfVxyXG4gIGlmICgoc3RyaW5nICE9IG51bGwpICYmIChzdHJpbmcgIT09ICcnKSkge1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KHN0cmluZywgYmFzZSk7XHJcbiAgfSBlbHNlIGlmIChkZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHN0cmluZztcclxuICB9XHJcbn07XHJcbiIsIlxyXG4vLyB0byBzdXBwb3J0IG9sZCBicm93c2VyXHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltID09IG51bGwpIHtcclxuICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICB9O1xyXG59XHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltU3RhcnQgPT0gbnVsbCkge1xyXG4gIFN0cmluZy5wcm90b3R5cGUudHJpbVN0YXJ0ID0gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdFxyXG59XHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltRW5kID09IG51bGwpIHtcclxuICBTdHJpbmcucHJvdG90eXBlLnRyaW1FbmQgPSBTdHJpbmcucHJvdG90eXBlLnRyaW1SaWdodFxyXG59XHJcbiIsImxldCB7IF8gfSA9IHdpbmRvdy5yaDtcclxuXHJcbl8uaGFzTm9uQXNjaWlDaGFyID0gZnVuY3Rpb24oc3RyKSB7IGlmIChzdHIgPT0gbnVsbCkgeyBzdHIgPSAnJzsgfSByZXR1cm4gXy5hbnkoc3RyLCBjaCA9PiBjaC5jaGFyQ29kZUF0KDApID4gMTI3KTsgfTtcclxuIiwibGV0IHsgXyB9ID0gd2luZG93LnJoO1xyXG5sZXQgeyBjb25zdHMgfSA9IHdpbmRvdy5yaDtcclxuXHJcblxyXG5fLm1hcFRvRW5jb2RlZFN0cmluZyA9IGZ1bmN0aW9uKG1hcCwgZXhwbG9kZUtleSwgbWFwS2V5KSB7XHJcbiAgaWYgKGV4cGxvZGVLZXkgPT0gbnVsbCkgeyBleHBsb2RlS2V5ID0gJyYnOyB9XHJcbiAgaWYgKG1hcEtleSA9PSBudWxsKSB7IG1hcEtleSA9ICc9JzsgfVxyXG4gIHJldHVybiBfLnJlZHVjZShtYXAsIGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xyXG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcclxuICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7IHJlc3VsdCArPSBleHBsb2RlS2V5OyB9XHJcbiAgICAgIHJlc3VsdCArPSBgJHtrZXl9JHttYXBLZXl9JHtlbmNvZGVVUklDb21wb25lbnQodmFsdWUpfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAsICcnKTtcclxufTtcclxuXHJcbl8uZW5jb2RlZFN0cmluZ1RvTWFwID0gZnVuY3Rpb24oc3RyaW5nLCBleHBsb2RlS2V5LCBtYXBLZXkpIHtcclxuICBpZiAoZXhwbG9kZUtleSA9PSBudWxsKSB7IGV4cGxvZGVLZXkgPSAnJic7IH1cclxuICBpZiAobWFwS2V5ID09IG51bGwpIHsgbWFwS2V5ID0gJz0nOyB9XHJcbiAgbGV0IG1hcCA9IF8uZXhwbG9kZUFuZE1hcChzdHJpbmcsIGV4cGxvZGVLZXksIG1hcEtleSwge2RlZmF1bHQ6ICcnfSk7XHJcbiAgXy5lYWNoKG1hcCwgKHZhbHVlLCBrZXkpID0+IG1hcFtrZXldID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XHJcbiAgcmV0dXJuIG1hcDtcclxufTtcclxuXHJcbl8udXJsUGFyYW1zID0gZnVuY3Rpb24ocXVlcnkpIHtcclxuICBpZiAocXVlcnkgPT0gbnVsbCkgeyBxdWVyeSA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7IH1cclxuICByZXR1cm4gXy5lbmNvZGVkU3RyaW5nVG9NYXAocXVlcnkpO1xyXG59O1xyXG5cclxuXy51cmxQYXJhbSA9IGZ1bmN0aW9uKGtleSwgcXVlcnkpIHtcclxuICBpZiAocXVlcnkgPT0gbnVsbCkgeyBxdWVyeSA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7IH1cclxuICByZXR1cm4ga2V5ICYmIF8udXJsUGFyYW1zKHF1ZXJ5KVtrZXldO1xyXG59O1xyXG5cclxuXy5oYXNoUGFyYW1zID0gZnVuY3Rpb24oaGFzaCkge1xyXG4gIGlmIChoYXNoID09IG51bGwpIHsgaGFzaCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpOyB9XHJcbiAgcmV0dXJuIF8uZW5jb2RlZFN0cmluZ1RvTWFwKGhhc2gpO1xyXG59O1xyXG5cclxuXy5oYXNoUGFyYW0gPSBrZXkgPT4ga2V5ICYmIF8uaGFzaFBhcmFtcygpW2tleV07XHJcblxyXG5fLnVwZGF0ZUhhc2hNYXAgPSBmdW5jdGlvbihjaGFuZ2VNYXAsIGFkZFRvSGlzdG9yeSkge1xyXG4gIGxldCBuZXdNYXAgPSBfLmV4dGVuZCh7fSwgXy5oYXNoUGFyYW1zKCksIGNoYW5nZU1hcCk7XHJcbiAgbGV0IGhhc2ggPSBfLm1hcFRvRW5jb2RlZFN0cmluZyhuZXdNYXApO1xyXG4gIGlmIChoYXNoLmxlbmd0aCA+IDApIHsgaGFzaCA9IGAjJHtoYXNofWA7IH1cclxuXHJcbiAgaWYgKGFkZFRvSGlzdG9yeSkge1xyXG4gICAgcmV0dXJuIGxvY2F0aW9uLmhhc2ggPSBoYXNoO1xyXG4gIH0gZWxzZSBpZiAoKGhhc2ggIT09ICcnKSAmJiAobG9jYXRpb24uaGFzaCAhPT0gaGFzaCkpIHtcclxuICAgIHJldHVybiBsb2NhdGlvbi5yZXBsYWNlKGhhc2gpO1xyXG4gIH1cclxufTtcclxuXHJcbl8ucXVldWVVcGRhdGVIYXNoTWFwID0gKGhhc2hNYXAsIGFkZFRvSGlzdG9yeSkgPT4gXy5kZWZlcigoKSA9PiBfLnVwZGF0ZUhhc2hNYXAoaGFzaE1hcCwgYWRkVG9IaXN0b3J5KSk7XHJcblxyXG5fLnN0cmlwU3RyaW5nQmV0d2VlbiA9IGZ1bmN0aW9uKHN0ciwgc3RhcnRDaGFyLCBlbmRDaGFyKSB7XHJcbiAgbGV0IG5ld1N0cjtcclxuICBsZXQgc3RhcnQgPSBzdHIuaW5kZXhPZihzdGFydENoYXIpO1xyXG4gIGlmIChzdGFydCAhPT0gLTEpIHtcclxuICAgIGxldCBlbmQgPSBzdHIuaW5kZXhPZihlbmRDaGFyKTtcclxuICAgIGlmIChlbmQgPCBzdGFydCkgeyBlbmQgPSBzdHIubGVuZ3RoOyB9XHJcbiAgICBuZXdTdHIgPSBgJHtzdHIuc3Vic3RyaW5nKDAsIHN0YXJ0KX0ke3N0ci5zdWJzdHJpbmcoZW5kLCBzdHIubGVuZ3RoKX1gO1xyXG4gIH1cclxuICByZXR1cm4gbmV3U3RyIHx8IHN0cjtcclxufTtcclxuXHJcbl8uc3RyaXBQYXJhbSA9IGZ1bmN0aW9uKHVybCkge1xyXG4gIGlmICh1cmwgPT0gbnVsbCkgeyB1cmwgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmOyB9XHJcbiAgcmV0dXJuIF8uc3RyaXBTdHJpbmdCZXR3ZWVuKHVybCwgJz8nLCAnIycpO1xyXG59O1xyXG5cclxuXy5zdHJpcEJvb2ttYXJrID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgaWYgKHVybCA9PSBudWxsKSB7IHVybCA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7IH1cclxuICByZXR1cm4gXy5zdHJpcFN0cmluZ0JldHdlZW4odXJsLCAnIycsICc/Jyk7XHJcbn07XHJcblxyXG5fLmV4dHJhY3RTdHJpbmdCZXR3ZWVuID0gZnVuY3Rpb24oc3RyLCBzdGFydENoYXIsIGVuZENoYXIpIHtcclxuICBsZXQgc3Vic3RyaW5nO1xyXG4gIGxldCBzdGFydCA9IHN0ci5pbmRleE9mKHN0YXJ0Q2hhcik7XHJcbiAgaWYgKHN0YXJ0ICE9PSAtMSkge1xyXG4gICAgbGV0IGVuZCA9IHN0ci5pbmRleE9mKGVuZENoYXIpO1xyXG4gICAgaWYgKGVuZCA8IHN0YXJ0KSB7IGVuZCA9IHN0ci5sZW5ndGg7IH1cclxuICAgIHN1YnN0cmluZyA9IHN0ci5zdWJzdHJpbmcoc3RhcnQgKyAxLCBlbmQpO1xyXG4gIH1cclxuICByZXR1cm4gc3Vic3RyaW5nIHx8ICcnO1xyXG59O1xyXG5cclxuXy5leHRyYWN0UGFyYW1TdHJpbmcgPSBmdW5jdGlvbih1cmwpIHtcclxuICBpZiAodXJsID09IG51bGwpIHsgdXJsID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZjsgfVxyXG4gIHJldHVybiBfLmV4dHJhY3RTdHJpbmdCZXR3ZWVuKHVybCwgJz8nLCAnIycpO1xyXG59O1xyXG5cclxuXy5leHRyYWN0SGFzaFN0cmluZyA9IGZ1bmN0aW9uKHVybCkge1xyXG4gIGlmICh1cmwgPT0gbnVsbCkgeyB1cmwgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmOyB9XHJcbiAgcmV0dXJuIF8uZXh0cmFjdFN0cmluZ0JldHdlZW4odXJsLCAnIycsICc/Jyk7XHJcbn07XHJcblxyXG5cclxuLy8jIyMjI1xyXG4vLyBwYXRoVHJhdmVyc2VUbyhmcm9tUGF0aCwgdG9QYXRoKVxyXG4vLyBUYWtlcyBpbiB0d28gYWJzb2x1dGUgcGF0aHMgYW5kIHNpbXVsYXRlc1xyXG4vLyB0cmF2ZXJzYWwgZnJvbSBmcm9tUGF0aCB0byB0b1BhdGguXHJcbi8vIFJldHVybnMgdGhlIHN0ZXBzIG5lZWVkIHRvIHRyYXZlcnNlIGZyb21cclxuLy8gZnJvbVBhdGggdG8gdG9QYXRoLlxyXG4vLyMjIyMjXHJcbi8vIFRPRE86IENvbXBsZXRlIHRoaXMgbWV0aG9kXHJcbl8udHJhdmVyc2VUb1BhdGggPSAoZnJvbVBhdGgsIHRvUGF0aCkgPT4gJyc7XHJcblxyXG5sZXQgcHJvY2Vzc1BhdGhVbml0ID0gZnVuY3Rpb24oZnVsbFBhdGgsIHBhdGhVbml0LCBzZXBhcmF0b3IpIHtcclxuICBpZiAoc2VwYXJhdG9yID09IG51bGwpIHsgc2VwYXJhdG9yID0gJy8nOyB9XHJcbiAgc3dpdGNoIChwYXRoVW5pdCkge1xyXG4gICAgY2FzZSAnLic6IHJldHVybiBmdWxsUGF0aDtcclxuICAgIGNhc2UgJy4uJzogcmV0dXJuIGZ1bGxQYXRoLnN1YnN0cmluZygwLCBmdWxsUGF0aC5sYXN0SW5kZXhPZihzZXBhcmF0b3IpKTtcclxuICAgIGRlZmF1bHQ6IHJldHVybiBmdWxsUGF0aCArIHNlcGFyYXRvciArIHBhdGhVbml0O1xyXG4gIH1cclxufTtcclxuXHJcbi8vIyMjIyNcclxuLy8gcGF0aFRyYXZlcnNlQnkoZnJvbVBhdGgsIHRyYXZlcnNlQnkpXHJcbi8vIFRha2VzIGluIHR3byBwYXRoIGNvbXBvbmVudHMgYW5kIHNpbXVsYXRlc1xyXG4vLyB0cmF2ZXJzYWwgZnJvbSBmcm9tUGF0aCBieSB0cmF2ZXJzZUJ5LlxyXG4vLyBSZXR1cm5zIHRoZSByZXN1bHRpbmcgcGF0aCBhZnRlciB0aGUgdHJhdmVyc2FsLlxyXG4vLyBFZzogJ0M6L2EvYi9jLycsICcuLi8uLi8nIHJldHVucyAnQzovYS8nXHJcbi8vIyMjIyNcclxuXy50cmF2ZXJzZUJ5UGF0aCA9IGZ1bmN0aW9uKGZyb21QYXRoLCB0cmF2ZXJzZUJ5LCBzZXBhcmF0b3IpIHtcclxuICBpZiAoc2VwYXJhdG9yID09IG51bGwpIHsgc2VwYXJhdG9yID0gJy8nOyB9XHJcbiAgZnJvbVBhdGggPSBmcm9tUGF0aC5zdWJzdHJpbmcoMCwgZnJvbVBhdGgubGFzdEluZGV4T2Yoc2VwYXJhdG9yKSk7XHJcbiAgbGV0IHBhcnRzID0gdHJhdmVyc2VCeS5zcGxpdChzZXBhcmF0b3IpO1xyXG5cclxuICBmb3IgKGxldCBwYXJ0IG9mIEFycmF5LmZyb20ocGFydHMpKSB7XHJcbiAgICBpZiAocGFydC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZyb21QYXRoID0gcHJvY2Vzc1BhdGhVbml0KGZyb21QYXRoLCBwYXJ0LCBzZXBhcmF0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZyb21QYXRoICsgc2VwYXJhdG9yO1xyXG59O1xyXG5cclxuXy5zY2hlbWUgPSBmdW5jdGlvbih1cmwpIHtcclxuICBsZXQgc2NoZW1lO1xyXG4gIGxldCBpbmRleCA9IHVybC5pbmRleE9mKCc6Jyk7XHJcbiAgaWYgKGluZGV4ICE9PSAtMSkgeyBzY2hlbWUgPSB1cmwuc3Vic3RyaW5nKDAsIGluZGV4ICsgMSkudG9Mb3dlckNhc2UoKS50cmltKCk7IH1cclxuICByZXR1cm4gc2NoZW1lO1xyXG59O1xyXG4gIFxyXG5fLnByb3RvY29sID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgbGV0IHByb3RvY29sO1xyXG4gIGxldCBpbmRleCA9IHVybC50cmltKCkuaW5kZXhPZignOicpO1xyXG4gIGlmIChpbmRleCAhPT0gLTEpIHsgcHJvdG9jb2wgPSB1cmwuc3Vic3RyaW5nKDAsIGluZGV4ICsgMSkudG9Mb3dlckNhc2UoKTsgfVxyXG4gIGlmIChwcm90b2NvbCkge1xyXG4gICAgbGV0IG1hdGNoID0gcHJvdG9jb2wubWF0Y2goL15bYS16XSs6Lyk7XHJcbiAgICBpZiAoIW1hdGNoIHx8IChtYXRjaFswXS5sZW5ndGggIT09IHByb3RvY29sLmxlbmd0aCkpIHsgcHJvdG9jb2wgPSB1bmRlZmluZWQ7IH1cclxuICB9XHJcbiAgcmV0dXJuIHByb3RvY29sO1xyXG59O1xyXG5cclxuXy5pc0ludGVybmFsID0gdXJsTmFtZSA9PlxyXG4gICh1cmxOYW1lLmluZGV4T2YoJy8vJykgIT09IDApICYmICh1cmxOYW1lLmluZGV4T2YoJy8mIzQ3OycpICE9PSAwKSAmJlxyXG4gICh1cmxOYW1lLmluZGV4T2YoJyYjNDc7LycpICE9PSAwKSAmJiAodXJsTmFtZS5pbmRleE9mKCcmIzQ3OyYjNDc7JykgIT09IDApXHJcbjtcclxuXHJcbl8uaXNKYXZhU2NyaXB0VXJsID0gdXJsID0+ICdqYXZhc2NyaXB0OicgPT09IF8uc2NoZW1lKHVybCk7XHJcblxyXG5fLmlzUmVsYXRpdmVVcmwgPSB1cmwgPT4gIV8uc2NoZW1lKHVybCkgJiYgdXJsLnRyaW0oKS5pbmRleE9mKCcvJyk7XHJcblxyXG5fLmlzVmFsaWRGaWxlVXJsID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgaWYgKHVybFswXSA9PT0gJyMnKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gIGxldCBzY2hlbWUgPSBfLnNjaGVtZSh1cmwpO1xyXG4gIHJldHVybiAhc2NoZW1lIHx8IChbJ2h0dHA6JywgJ2h0dHBzOicsICdmdHA6JywgJ2ZpbGU6J10uaW5kZXhPZihzY2hlbWUpICE9PSAtMSk7XHJcbn07XHJcblxyXG5fLm1ha2VSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKGFic1VybCwgYmFzZVVybCkge1xyXG4gIGlmIChiYXNlVXJsID09IG51bGwpIHsgYmFzZVVybCA9IGRlY29kZVVSSShkb2N1bWVudC5sb2NhdGlvbi5ocmVmKTsgfVxyXG4gIGlmIChhYnNVcmwgPT09IGJhc2VVcmwpIHsgcmV0dXJuICcnOyB9XHJcbiAgbGV0IGFic1BhdGggPSBfLmZpbGVQYXRoKGFic1VybCk7XHJcbiAgbGV0IGJhc2VQYXRoID0gXy5maWxlUGF0aChiYXNlVXJsKTtcclxuICBsZXQgcmVsUGF0aCA9IF8ubWFrZVJlbGF0aXZlUGF0aChhYnNQYXRoLCBiYXNlUGF0aCk7XHJcbiAgcmV0dXJuIGAke3JlbFBhdGh9JHthYnNVcmwuc3Vic3RyaW5nKGFic1BhdGgubGVuZ3RoKX1gO1xyXG59O1xyXG5cclxuXy5tYWtlUmVsYXRpdmVQYXRoID0gZnVuY3Rpb24oYWJzVXJsLCBiYXNlVXJsKSB7XHJcbiAgbGV0IHJlbFVybDtcclxuICBpZiAoYmFzZVVybCA9PSBudWxsKSB7IGJhc2VVcmwgPSBfLmZpbGVQYXRoKCk7IH1cclxuICBpZiAoYWJzVXJsICYmICFfLmlzUmVsYXRpdmVVcmwoYWJzVXJsKSAmJiAhXy5pc1JlbGF0aXZlVXJsKGJhc2VVcmwpKSB7XHJcbiAgICBsZXQgc3JjUGFydHMgPSBhYnNVcmwuc3BsaXQoJy8nKTtcclxuICAgIGxldCBiYXNlUGFydHMgPSBiYXNlVXJsLnNwbGl0KCcvJyk7XHJcbiAgICBsZXQgaWR4ID0gMDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgIGlmICgoc3JjUGFydHMubGVuZ3RoID09PSBpZHgpIHx8IChiYXNlUGFydHMubGVuZ3RoID09PSBpZHgpKSB7IGJyZWFrOyB9XHJcbiAgICAgIGlmIChzcmNQYXJ0c1tpZHhdICE9PSBiYXNlUGFydHNbaWR4XSkgeyBicmVhazsgfVxyXG4gICAgICBpZHgrKztcclxuICAgIH1cclxuICAgIFxyXG4gICAgbGV0IHJlbFBhcnRzID0gc3JjUGFydHMuc2xpY2UoaWR4KTtcclxuICAgIHJlbFVybCA9ICcnO1xyXG4gICAgbGV0IGRvdGRvdGNvdW50ID0gYmFzZVBhcnRzLmxlbmd0aCAtIGlkeCAtIDE7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICBpZiAoZG90ZG90Y291bnQgPD0gMCkgeyBicmVhazsgfVxyXG4gICAgICByZWxVcmwgKz0gJy4uLyc7XHJcbiAgICAgIGRvdGRvdGNvdW50LS07XHJcbiAgICB9XHJcbiAgICByZWxVcmwgKz0gcmVsUGFydHMuam9pbignLycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZWxVcmwgPSBhYnNVcmw7XHJcbiAgfVxyXG4gIHJldHVybiByZWxVcmw7XHJcbn07XHJcblxyXG5fLm1ha2VGdWxsVXJsID0gZnVuY3Rpb24ocmVsVXJsLCBwYXJlbnRQYXRoKSB7XHJcbiAgaWYgKHBhcmVudFBhdGggPT0gbnVsbCkgeyBwYXJlbnRQYXRoID0gcmguXy5wYXJlbnRQYXRoKCk7IH1cclxuICBpZiAoXy5pc1JlbGF0aXZlVXJsKHJlbFVybCkpIHtcclxuICAgIHJldHVybiB3aW5kb3cuX2dldEZ1bGxQYXRoKHBhcmVudFBhdGgsIHJlbFVybCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiByZWxVcmw7XHJcbiAgfVxyXG59O1xyXG5cclxuXy5pc0xvY2FsID0gKCkgPT4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnZmlsZTonO1xyXG5cclxuXy5pc1JlbW90ZSA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCAhPT0gJ2ZpbGU6JztcclxuXHJcbmxldCBjdXJPcmlnaW4gPSBudWxsO1xyXG5fLmlzU2FtZU9yaWdpbiA9IGZ1bmN0aW9uKG9yaWdpbikge1xyXG4gIGlmIChfLmlzTG9jYWwoKSkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gIGxldCB7IGxvY2F0aW9uIH0gPSB3aW5kb3c7XHJcbiAgaWYgKGN1ck9yaWdpbiA9PSBudWxsKSB7IGN1ck9yaWdpbiA9IGxvY2F0aW9uLm9yaWdpbjsgfVxyXG4gIGlmIChjdXJPcmlnaW4gPT0gbnVsbCkge1xyXG4gICAgY3VyT3JpZ2luID0gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfWA7XHJcbiAgICBpZiAobG9jYXRpb24ucG9ydCkgeyBjdXJPcmlnaW4gKz0gYDoke2xvY2F0aW9uLnBvcnR9YDsgfVxyXG4gIH1cclxuICByZXR1cm4gY3VyT3JpZ2luID09PSBvcmlnaW47XHJcbn07XHJcblxyXG5fLmZpbGVQYXRoID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgaWYgKHVybCA9PSBudWxsKSB7IHVybCA9IGRlY29kZVVSSShkb2N1bWVudC5sb2NhdGlvbi5ocmVmKTsgfVxyXG4gIGxldCBpbmRleCA9IHVybC5pbmRleE9mKCc/Jyk7XHJcbiAgaWYgKGluZGV4ICE9PSAtMSkgeyB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIGluZGV4KTsgfVxyXG4gIGluZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcclxuICBpZiAoaW5kZXggIT09IC0xKSB7IHVybCA9IHVybC5zdWJzdHJpbmcoMCwgaW5kZXgpOyB9XHJcbiAgcmV0dXJuIHVybDtcclxufTtcclxuXHJcbl8ucGFyZW50UGF0aCA9IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XHJcbiAgaWYgKGZpbGVQYXRoID09IG51bGwpIHsgZmlsZVBhdGggPSBfLmZpbGVQYXRoKCk7IH1cclxuICBsZXQgaW5kZXggPSBmaWxlUGF0aC5sYXN0SW5kZXhPZignLycpO1xyXG4gIGlmIChpbmRleCAhPT0gLTEpIHsgZmlsZVBhdGggPSBmaWxlUGF0aC5zdWJzdHJpbmcoMCwgaW5kZXggKyAxKTsgfVxyXG4gIHJldHVybiBmaWxlUGF0aDtcclxufTtcclxuXHJcbl8uZ2V0RmlsZU5hbWUgPSBmdW5jdGlvbihhYnNVcmwpIHtcclxuICBsZXQgZmlsZVBhdGggPSBfLmZpbGVQYXRoKGFic1VybCk7XHJcbiAgbGV0IGlkeCA9IGZpbGVQYXRoLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgbGV0IGZpaWxlTmFtZSA9IGlkeCAhPT0gLTEgPyBmaWxlUGF0aC5zdWJzdHJpbmcoaWR4ICsgMSkgOiBmaWxlUGF0aDtcclxuICByZXR1cm4gZmlpbGVOYW1lIHx8ICcnO1xyXG59O1xyXG5cclxuXy5nZXRGaWxlRXh0ZW50aW9uID0gZnVuY3Rpb24oYWJzVXJsKSB7XHJcbiAgbGV0IGV4dDtcclxuICBsZXQgZmlpbGVOYW1lID0gXy5nZXRGaWxlTmFtZShhYnNVcmwpO1xyXG4gIGxldCBpZHggPSBmaWlsZU5hbWUgIT0gbnVsbCA/IGZpaWxlTmFtZS5sYXN0SW5kZXhPZignLicpIDogdW5kZWZpbmVkO1xyXG4gIGlmIChpZHggIT09IC0xKSB7IGV4dCA9IGZpaWxlTmFtZS5zdWJzdHJpbmcoaWR4KTsgfVxyXG4gIHJldHVybiBleHQgfHwgJyc7XHJcbn07XHJcbiIsImlmICh3aW5kb3cucmggPT0gbnVsbCkgeyB3aW5kb3cucmggPSB7fTsgfVxyXG5jb25zdCB7IHJoIH0gPSB3aW5kb3c7XHJcbmlmIChyaC5fID09IG51bGwpIHsgcmguXyA9IHt9OyB9XHJcbnJoLnV0aWwgPSByaC5fO1xyXG5jb25zdCB7IF8gfSA9IHJoO1xyXG5cclxuY29uc3QgbmF0aXZlRm9yRWFjaCAgID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbmNvbnN0IG5hdGl2ZUtleXMgICAgICA9IE9iamVjdC5rZXlzO1xyXG5jb25zdCB7IGhhc093blByb3BlcnR5IH0gID0gT2JqZWN0LnByb3RvdHlwZTtcclxuXHJcbl8udGltZSA9ICgpID0+IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblxyXG5fLmRlbGF5ID0gZnVuY3Rpb24oZm4sIHdhaXQpIHtcclxuICBjb25zdCBhcmdzID0gW107IGxldCBpID0gMTtcclxuICB3aGlsZSAoKytpIDwgYXJndW1lbnRzLmxlbmd0aCkgeyBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTsgfVxyXG4gIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IGZuLmFwcGx5KG51bGwsIGFyZ3MpXHJcbiAgLCB3YWl0KTtcclxufTtcclxuXHJcbl8uZGVmZXIgPSBmdW5jdGlvbihmbikge1xyXG4gIGNvbnN0IGFyZ3MgPSBbXTsgbGV0IGkgPSAwO1xyXG4gIHdoaWxlICgrK2kgPCBhcmd1bWVudHMubGVuZ3RoKSB7IGFyZ3MucHVzaChhcmd1bWVudHNbaV0pOyB9XHJcbiAgcmV0dXJuIHRoaXMuZGVsYXkuYXBwbHkodGhpcywgW2ZuLCAxXS5jb25jYXQoYXJncykpO1xyXG59O1xyXG5cclxuXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZuLCB0aHJlc2hvbGQsIGV4ZWNBc2FwKSB7XHJcbiAgbGV0IHRpbWVvdXQgPSBudWxsO1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGFyZ3MgPSBbXTtcclxuICAgIGZvciAobGV0IGFyZyBvZiBBcnJheS5mcm9tKGFyZ3VtZW50cykpIHsgYXJncy5wdXNoKGFyZyk7IH1cclxuICAgIGNvbnN0IG9iaiA9IHRoaXM7XHJcbiAgICBjb25zdCBkZWxheWVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICghZXhlY0FzYXApIHsgZm4uYXBwbHkob2JqLCBhcmdzKTsgfVxyXG4gICAgICByZXR1cm4gdGltZW91dCA9IG51bGw7XHJcbiAgICB9O1xyXG4gICAgaWYgKHRpbWVvdXQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgfSBlbHNlIGlmIChleGVjQXNhcCkge1xyXG4gICAgICBmbi5hcHBseShvYmosIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xyXG4gIH07XHJcbn07XHJcblxyXG5fLnRocm90dGxlID0gZnVuY3Rpb24oZm4sIHRocmVzaG9sZCkge1xyXG4gIGxldCB0aW1lb3V0ID0gbnVsbDtcclxuICBsZXQgZm5FeGVjdXRlZCA9IGZhbHNlO1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGFyZ3MgPSBbXTtcclxuICAgIGZvciAobGV0IGFyZyBvZiBBcnJheS5mcm9tKGFyZ3VtZW50cykpIHsgYXJncy5wdXNoKGFyZyk7IH1cclxuICAgIGNvbnN0IG9iaiA9IHRoaXM7XHJcbiAgICBjb25zdCBkZWxheWVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICghZm5FeGVjdXRlZCkgeyBmbi5hcHBseShvYmosIGFyZ3MpOyB9XHJcbiAgICAgIHJldHVybiB0aW1lb3V0ID0gbnVsbDtcclxuICAgIH07XHJcbiAgICBpZiAodGltZW91dCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIGZuRXhlY3V0ZWQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZuLmFwcGx5KG9iaiwgYXJncyk7XHJcbiAgICAgIGZuRXhlY3V0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTtcclxuICB9O1xyXG59O1xyXG5cclxuXy50aW1lb3V0ID0gKGZuLCB3YWl0KSA9PlxyXG4gIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgYXJncyA9IFtdO1xyXG4gICAgZm9yIChsZXQgYXJnIG9mIEFycmF5LmZyb20oYXJndW1lbnRzKSkgeyBhcmdzLnB1c2goYXJnKTsgfVxyXG4gICAgY29uc3Qgb2JqID0gdGhpcztcclxuICAgIGNvbnN0IGRlbGF5ZWQgPSAoKSA9PiBmbi5hcHBseShvYmosIGFyZ3MpO1xyXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XHJcbiAgfVxyXG47XHJcblxyXG5fLnRvZ2dsZVRpbWVvdXQgPSAoZm4sIHdhaXQsIHRvZ2dsZSkgPT5cclxuICBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGFyZ3MgPSBbXTtcclxuICAgIGZvciAobGV0IGFyZyBvZiBBcnJheS5mcm9tKGFyZ3VtZW50cykpIHsgYXJncy5wdXNoKGFyZyk7IH1cclxuICAgIGNvbnN0IG9iaiA9IHRoaXM7XHJcbiAgICBjb25zdCBkZWxheWVkID0gKCkgPT4gZm4uYXBwbHkob2JqLCBhcmdzKTtcclxuICAgIGlmICh0b2dnbGUpIHtcclxuICAgICAgaWYgKHJoLl9kZWJ1ZykgeyBhcmdzLnB1c2goXy5zdGFja1RyYWNlKCkpOyB9XHJcbiAgICAgIHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZWxheWVkKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9nZ2xlID0gIXRvZ2dsZTtcclxuICB9XHJcbjtcclxuXHJcbi8vIE9iamVjdCBtZXRob2RzXHJcblxyXG5fLmhhcyA9IChvYmosIGtleSkgPT4gKG9iaiAhPSBudWxsKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcclxuXHJcbl8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xyXG4gIGNvbnN0IGtleXMgPSBbXTtcclxuICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgeyByZXR1cm4ga2V5czsgfVxyXG4gIGlmIChuYXRpdmVLZXlzKSB7IHJldHVybiBuYXRpdmVLZXlzKG9iaik7IH1cclxuICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7IGlmIChfLmhhcyhvYmosIGtleSkpIHsga2V5cy5wdXNoKGtleSk7IH0gfVxyXG4gIHJldHVybiBrZXlzO1xyXG59O1xyXG5cclxuLy9JdGVyYXRvcnNcclxuXHJcbl8uYW55ID0gZnVuY3Rpb24ob2JqLCBmbiwgY29udGV4dCkge1xyXG4gIGlmIChjb250ZXh0ID09IG51bGwpIHsgY29udGV4dCA9IHRoaXM7IH1cclxuICBpZiAob2JqID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgY29uc3Qga2V5cyA9IChvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCkgJiYgXy5rZXlzKG9iaik7XHJcbiAgY29uc3QgeyBsZW5ndGggfSA9IChrZXlzIHx8IG9iaik7XHJcbiAgbGV0IGluZGV4ID0gMDtcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgaWYgKGluZGV4ID49IGxlbmd0aCkgeyBicmVhazsgfVxyXG4gICAgY29uc3Qga2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XHJcbiAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmopKSB7IHJldHVybiB0cnVlOyB9XHJcbiAgICBpbmRleCsrO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5fLmVhY2ggPSBmdW5jdGlvbihvYmosIGZuLCBjb250ZXh0KSB7XHJcbiAgbGV0IHZhbHVlO1xyXG4gIGlmIChjb250ZXh0ID09IG51bGwpIHsgY29udGV4dCA9IHRoaXM7IH1cclxuICBpZiAob2JqID09IG51bGwpIHsgcmV0dXJuOyB9XHJcbiAgaWYgKG5hdGl2ZUZvckVhY2ggPT09IG9iai5mb3JFYWNoKSB7XHJcbiAgICBvYmouZm9yRWFjaChmbiwgY29udGV4dCk7XHJcbiAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xyXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iai5sZW5ndGg7IGluZGV4KyspIHsgdmFsdWUgPSBvYmpbaW5kZXhdOyBmbi5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgb2JqKTsgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7IHZhbHVlID0gb2JqW2tleV07IGZuLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgb2JqKTsgfVxyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuXy5tYXAgPSBmdW5jdGlvbihvYmosIGZuLCBjb250ZXh0KSB7XHJcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gdGhpczsgfVxyXG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gIF8uZWFjaChvYmosICh2YWx1ZSwga2V5LCBvYmopID0+IHJlc3VsdC5wdXNoKGZuLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgb2JqKSkpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5fLnJlZHVjZSA9IGZ1bmN0aW9uKG9iaiwgZm4sIGluaXRpYWwsIGNvbnRleHQpIHtcclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzOyB9XHJcbiAgXy5lYWNoKG9iaiwgKHZhbHVlLCBrZXkpID0+IGluaXRpYWwgPSBmbi5jYWxsKGNvbnRleHQsIGluaXRpYWwsIHZhbHVlLCBrZXkpKTtcclxuICByZXR1cm4gaW5pdGlhbDtcclxufTtcclxuXHJcbl8uZmluZCA9IGZ1bmN0aW9uKG9iaiwgZm4sIGNvbnRleHQpIHtcclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzOyB9XHJcbiAgbGV0IHJlc3VsdCA9IHVuZGVmaW5lZDtcclxuICBfLmFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xyXG4gICAgaWYgKGZuLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgb2JqKSkge1xyXG4gICAgICByZXN1bHQgPSB2YWx1ZTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbl8uZmluZEluZGV4ID0gZnVuY3Rpb24ob2JqLCBmbiwgY29udGV4dCkge1xyXG4gIGlmIChjb250ZXh0ID09IG51bGwpIHsgY29udGV4dCA9IHRoaXM7IH1cclxuICBsZXQgcmVzdWx0ID0gLTE7XHJcbiAgXy5hbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHtcclxuICAgIGlmIChmbi5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIG9iaikpIHtcclxuICAgICAgcmVzdWx0ID0ga2V5O1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXy5maW5kUGFyZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHJvb3ROb2RlLCBmbiwgY29udGV4dCkge1xyXG4gIGlmIChyb290Tm9kZSA9PSBudWxsKSB7IHJvb3ROb2RlID0gZG9jdW1lbnQ7IH1cclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzOyB9XHJcbiAgbGV0IHJlc3VsdCA9IG51bGw7XHJcbiAgd2hpbGUgKHRydWUpIHtcclxuICAgIGlmICghbm9kZSB8fCAobm9kZSA9PT0gcm9vdE5vZGUpKSB7IGJyZWFrOyB9XHJcbiAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBub2RlKSkge1xyXG4gICAgICByZXN1bHQgPSBub2RlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5fLmZpbHRlciA9IGZ1bmN0aW9uKG9iaiwgZm4sIGNvbnRleHQpIHtcclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzOyB9XHJcbiAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XHJcbiAgICBpZiAoZm4uY2FsbChjb250ZXh0LCB2YWx1ZSwga2V5LCBvYmopKSB7IHJldHVybiByZXN1bHQucHVzaCh2YWx1ZSk7IH1cclxuICB9KTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXy5mbGF0dGVuID0gb2JqID0+XHJcbiAgXy5yZWR1Y2Uob2JqLCAocmVzdWx0LCBlbGVtKSA9PiByZXN1bHQuY29uY2F0KGVsZW0pXHJcbiAgLCBbXSlcclxuO1xyXG5cclxuXy51bmlxdWUgPSBmdW5jdGlvbihvYmosIGZuLCBjb250ZXh0KSB7XHJcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gdGhpczsgfVxyXG4gIGlmIChmbikgeyBvYmogPSBfLm1hcChvYmosIGZuLCBjb250ZXh0KTsgfVxyXG4gIHJldHVybiBfLmZpbHRlcihvYmosICh2YWx1ZSwgaW5kZXgpID0+IG9iai5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXgpO1xyXG59O1xyXG5cclxuXy51bmlvbiA9IGZ1bmN0aW9uKG9iaiwgZm4sIGNvbnRleHQpIHtcclxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzOyB9XHJcbiAgaWYgKGZuKSB7IG9iaiA9IF8ubWFwKG9iaiwgZm4sIGNvbnRleHQpOyB9XHJcbiAgcmV0dXJuIF8udW5pcXVlKF8uZmxhdHRlbihvYmopKTtcclxufTtcclxuXHJcbl8uY291bnQgPSBmdW5jdGlvbihvYmosIGZuLCBjb250ZXh0KSB7XHJcbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gdGhpczsgfVxyXG4gIGxldCBjb3VudCA9IDA7XHJcbiAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IGlmIChmbi5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIG9iaikpIHsgcmV0dXJuIGNvdW50Kys7IH0gfSk7XHJcbiAgcmV0dXJuIGNvdW50O1xyXG59O1xyXG5cclxuXy5leHRlbmQgPSBmdW5jdGlvbihvYmosIG9sZE9iaiwgbmV3T2JqKSB7XHJcbiAgaWYgKG9sZE9iaikgeyBfLmVhY2gob2xkT2JqLCAodmFsdWUsIGtleSkgPT4gb2JqW2tleV0gPSB2YWx1ZSk7IH1cclxuICBpZiAobmV3T2JqKSB7IF8uZWFjaChuZXdPYmosICh2YWx1ZSwga2V5KSA9PiBvYmpba2V5XSA9IHZhbHVlKTsgfVxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG5fLmFkZFBhdGhOYW1lS2V5ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgcmV0dXJuIF8uZXh0ZW5kKG9iaiwgeydwYXRobmFtZSc6IGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpfSlcclxufVxyXG5cclxuXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xyXG4gIGlmICghXy5pc09iamVjdChvYmopKSB7IHJldHVybiBvYmo7IH1cclxuICByZXR1cm4gXy5yZWR1Y2Uob2JqLCBmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcclxuICAgIHJlc3VsdFtrZXldID0gXy5jbG9uZSh2YWx1ZSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAsIHt9KTtcclxufTtcclxuXHJcbl8uY29tcGFjdCA9IGFycmF5ID0+IF8uZmlsdGVyKGFycmF5LCBpdGVtID0+IGl0ZW0pO1xyXG5cclxuXy5jb21wYWN0T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgaWYgKG9iaiA9PSBudWxsKSB7IG9iaiA9IHt9OyB9XHJcbiAgcmV0dXJuIF8ucmVkdWNlKG9iaiwgZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XHJcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICB2YWx1ZSA9IF8uY29tcGFjdE9iamVjdCh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKCFfLmlzRW1wdHlPYmplY3QodmFsdWUpKSB7IHJlc3VsdFtrZXldID0gdmFsdWU7IH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHRba2V5XSA9ICB2YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgLCB7fSk7XHJcbn07XHJcblxyXG5fLmlzU3RyaW5nID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcclxuXHJcbl8uaXNGdW5jdGlvbiA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcclxuXHJcbl8uaXNPYmplY3QgPSB2YWx1ZSA9PiAodmFsdWUgIT09IG51bGwpICYmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKTtcclxuXHJcbl8uaXNEZWZpbmVkID0gdmFsdWUgPT4gKHZhbHVlICE9PSBudWxsKSAmJiAodmFsdWUgIT09IHVuZGVmaW5lZCk7XHJcblxyXG5fLmlzRW1wdHlTdHJpbmcgPSB2YWx1ZSA9PiB2YWx1ZS5sZW5ndGggPT09IDA7XHJcblxyXG5fLmlzVXNlZnVsU3RyaW5nID0gdmFsdWUgPT4gXy5pc0RlZmluZWQodmFsdWUpICYmICFfLmlzRW1wdHlTdHJpbmcodmFsdWUpO1xyXG5cclxuXy5pc0VtcHR5T2JqZWN0ID0gdmFsdWUgPT4gT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMDtcclxuXHJcbl8uaXNFcXVhbCA9IGZ1bmN0aW9uKG9iajEsIG9iajIpIHtcclxuICBpZiAodHlwZW9mIG9iajEgIT09IHR5cGVvZiBvYmoyKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gIGlmICghXy5pc0RlZmluZWQob2JqMSkgfHwgIV8uaXNEZWZpbmVkKG9iajIpKSB7IHJldHVybiBvYmoxID09PSBvYmoyOyB9XHJcblxyXG4gIHN3aXRjaCAodHlwZW9mIG9iajEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIHJldHVybiBfLmlzRXF1YWxPYmplY3Qob2JqMSwgb2JqMik7XHJcbiAgICBjYXNlICdhcnJheSc6XHJcbiAgICAgIHJldHVybiAhXy5hbnkob2JqMSwgKHZhbHVlLCBpbmRleCkgPT4gIV8uaXNFcXVhbCh2YWx1ZSwgb2JqMltpbmRleF0pKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBvYmoxID09PSBvYmoyO1xyXG4gIH1cclxufTtcclxuXHJcbl8uaXNFcXVhbE9iamVjdCA9IGZ1bmN0aW9uKG9iajEsIG9iajIpIHtcclxuICBjb25zdCBrZXlzMSA9IF8uZmlsdGVyKF8ua2V5cyhvYmoxKSwga2V5ID0+IG9iajFba2V5XSAhPT0gdW5kZWZpbmVkKTtcclxuICBjb25zdCBrZXlzMiA9IF8uZmlsdGVyKF8ua2V5cyhvYmoyKSwga2V5ID0+IG9iajJba2V5XSAhPT0gdW5kZWZpbmVkKTtcclxuICBpZiAoa2V5czEubGVuZ3RoICE9PSBrZXlzMi5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgcmV0dXJuICFfLmFueShrZXlzMSwga2V5ID0+ICFfLmlzRXF1YWwob2JqMVtrZXldLCBvYmoyW2tleV0pKTtcclxufTtcclxuXHJcblxyXG5fLmlzWmVyb0NTU1ZhbHVlID0gdmFsdWUgPT4gKHZhbHVlID09PSAnMCcpIHx8ICh2YWx1ZSA9PT0gJzBweCcpIHx8ICh2YWx1ZSA9PT0gJzBlbScpIHx8ICh2YWx1ZSA9PT0gJzAlJyk7XHJcblxyXG4vL0hlbHBlciBtZXRob2RzXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgbGV0IGxvY2FsREI7XHJcbiAgdHJ5IHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0ZXN0TG9jYWxEQicsIHRydWUpO1xyXG4gICAgbG9jYWxEQiA9IChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGVzdExvY2FsREInKSAhPSBudWxsKTtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0ZXN0TG9jYWxEQicpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBsb2NhbERCID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gXy5jYW5Vc2VMb2NhbERCICA9ICgpID0+IGxvY2FsREI7XHJcbn0pKCk7XHJcblxyXG5fLmlzSWZyYW1lID0gKCkgPT4gcGFyZW50ICE9PSB3aW5kb3c7XHJcblxyXG5fLmxvYWRTY3JpcHQgPSAoanNQYXRoLCBhc3luYyA9IHRydWUsIG9ubG9hZCA9IG51bGwsIGF1dG9kZWxldGUgPSBmYWxzZSkgPT57XHJcbiAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICBzY3JpcHQuYXN5bmMgPSBhc3luYyA9PT0gdHJ1ZTtcclxuICBzY3JpcHQuc3JjID0ganNQYXRoO1xyXG4gIHNjcmlwdC5vbmVycm9yID0gKHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbihhcmdzKSB7XHJcbiAgICBpZiAoYXV0b2RlbGV0ZSkgeyBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcmlwdCk7IH1cclxuICAgIHJldHVybiBvbmxvYWQgJiYgb25sb2FkLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbn07XHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgY29uc3QgcmFuZG9tU3RyID0gKCkgPT4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMCkudG9TdHJpbmcoMzIpLnN1YnN0cmluZygxKTtcclxuXHJcbiAgcmV0dXJuIF8udW5pcXVlSWQgPSAoKSA9PiBgJHtfLnRpbWUoKS50b1N0cmluZygzMil9XyR7cmFuZG9tU3RyKCl9JHtyYW5kb21TdHIoKX0ke3JhbmRvbVN0cigpfWA7XHJcbn0pKCk7XHJcblxyXG5fLm9uZSA9IGZuID0+XHJcbiAgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZuKSB7XHJcbiAgICAgIGNvbnN0IGZuMSA9IGZuO1xyXG4gICAgICBmbiA9IG51bGw7XHJcbiAgICAgIHJldHVybiBmbjEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH1cclxuICB9XHJcbjtcclxuXHJcbl8uY2FjaGUgPSBmdW5jdGlvbihpc1ZhbGlkLCBjYWNoZSkge1xyXG4gIGlmIChjYWNoZSA9PSBudWxsKSB7IGNhY2hlID0ge307IH1cclxuICByZXR1cm4gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBjYWNoZVtuYW1lXTtcclxuICAgIH0gZWxzZSBpZiAoIWlzVmFsaWQgfHwgaXNWYWxpZCh2YWx1ZSkpIHtcclxuICAgICAgcmV0dXJuIGNhY2hlW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuXHJcbl8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGdlbmVyYXRvciwgY2FjaGUpIHtcclxuICBpZiAoY2FjaGUgPT0gbnVsbCkgeyBjYWNoZSA9IHt9OyB9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGZ1bGxrZXk7XHJcbiAgICBmb3IgKGxldCBhcmcgb2YgQXJyYXkuZnJvbShhcmd1bWVudHMpKSB7XHJcbiAgICAgIGNvbnN0IGtleSA9IF8uaXNTdHJpbmcoYXJnKSA/IGFyZyA6IEpTT04uc3RyaW5naWZ5KGFyZyk7XHJcbiAgICAgIGZ1bGxrZXkgPSAoZnVsbGtleSAhPSBudWxsKSA/IGAke2Z1bGxrZXl9LCAke2tleX1gIDoga2V5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmdWxsa2V5IGluIGNhY2hlKSB7XHJcbiAgICAgIHJldHVybiBjYWNoZVtmdWxsa2V5XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBjYWNoZVtmdWxsa2V5XSA9IGdlbmVyYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG4gIH07XHJcbn07XHJcblxyXG4vLyBsYXN0IGFyZ3VtZW50IG9mIGdlbmVyYXRvciBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGJhY2sgZnVuY3Rpb25cclxuXy5tZW1vaXplQXN5bmMgPSBmdW5jdGlvbihnZW5lcmF0b3IsIGNhY2hlKSB7XHJcbiAgaWYgKGNhY2hlID09IG51bGwpIHsgY2FjaGUgPSB7fTsgfVxyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjYWxsYmFjaztcclxuICAgIGNvbnN0IGFyZ3MgPSBbXTtcclxuICAgIGZvciAobGV0IGFyZyBvZiBBcnJheS5mcm9tKGFyZ3VtZW50cykpIHsgYXJncy5wdXNoKGFyZyk7IH1cclxuICAgIGlmIChhcmdzLmxlbmd0aCA+IDEpIHsgY2FsbGJhY2sgPSAoYXJncy5wb3ApKCk7IH1cclxuICAgIGNvbnN0IGZ1bGxrZXkgPSBhcmdzLmpvaW4oJywgJyk7XHJcbiAgICBpZiAoZnVsbGtleSBpbiBjYWNoZSkge1xyXG4gICAgICByZXR1cm4gKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrKGNhY2hlW2Z1bGxrZXldKSA6IHVuZGVmaW5lZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcmdzLnB1c2goZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGNhY2hlW2Z1bGxrZXldID0gZGF0YTtcclxuICAgICAgICByZXR1cm4gKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrKGRhdGEpIDogdW5kZWZpbmVkKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBnZW5lcmF0b3IuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuXHJcbl8ucmVxdWlyZSA9IF8ubWVtb2l6ZUFzeW5jKChqc1BhdGgsIGNhbGxiYWNrKSA9PiBfLmxvYWRTY3JpcHQoanNQYXRoLCB0cnVlLCAoKSA9PiBjYWxsYmFjayhfLmV4cG9ydHMoKSkpKTtcclxuXHJcbihmdW5jdGlvbigpIHtcclxuICBsZXQgY2FjaGUgPSB1bmRlZmluZWQ7XHJcbiAgcmV0dXJuIF8uZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICBjb25zdCByZXRWYWx1ZSA9IGNhY2hlO1xyXG4gICAgY2FjaGUgPSAodmFsdWUgIT0gbnVsbCkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiByZXRWYWx1ZTtcclxuICB9O1xyXG59KSgpO1xyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgdXRpbCA9IHJoLl87XHJcbmxldCB7ICQgfSA9IHJoO1xyXG5cclxubGV0IGRhdGFXaWRnZXQgPSBmdW5jdGlvbihhdHRyKSB7XHJcbiAgY2xhc3MgRGF0YVdpZGdldCBleHRlbmRzIHJoLldpZGdldCB7XHJcbiAgICBzdGF0aWMgaW5pdENsYXNzKCkge1xyXG4gIFxyXG4gICAgICB0aGlzLnByb3RvdHlwZS5kYXRhQXR0ck1ldGhvZHMgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IG1hcCA9IHt9O1xyXG4gICAgICAgIG1hcFtgZGF0YS0ke2F0dHJ9YF0gPSBgZGF0YV8ke2F0dHJ9YDtcclxuICAgICAgICByZXR1cm4gbWFwO1xyXG4gICAgICAgIH0pKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKSB7IHJldHVybiBgJHthdHRyfV8ke3RoaXMuX2NvdW50fWA7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XHJcbiAgICAgIHN1cGVyKG9wdHMpO1xyXG4gICAgICBcclxuICAgICAgLy8gVXNlIGdsb2JhbCBtb2RlbCB1bmxlc3Mgc29tZW9uZSBnaXZlcyB5b3UgaW4gamF2YXNjcmlwdFxyXG4gICAgICBpZiAodGhpcy5tb2RlbCA9PSBudWxsKSB7IHRoaXMubW9kZWwgPSByaC5tb2RlbDsgfVxyXG4gICAgICAkLmRhdGFzZXQodGhpcy5ub2RlLCBhdHRyLCBvcHRzLnJhd0FyZyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChwYXJlbnQpIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdERvbmUpIHsgcmV0dXJuOyB9XHJcbiAgICAgIHRoaXMuaW5pdERvbmUgPSB0cnVlO1xyXG4gICAgICB0aGlzLmluaXRQYXJlbnQocGFyZW50KTtcclxuICAgICAgdGhpcy5pbml0VUkoKTtcclxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZURhdGFBdHRycyh0aGlzLm5vZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBEYXRhV2lkZ2V0LmluaXRDbGFzcygpO1xyXG4gICAgICBcclxuICByZXR1cm4gRGF0YVdpZGdldDtcclxufTtcclxuICAgIFxyXG5mb3IgKGxldCBhdHRyIG9mIEFycmF5LmZyb20ocmguV2lkZ2V0LnByb3RvdHlwZS5kYXRhQXR0cnMpKSB7IHdpbmRvdy5yaC53aWRnZXRzW2F0dHJdID0gIGRhdGFXaWRnZXQoYXR0cik7IH0iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgdXRpbCA9IHJoLl87XHJcbmxldCB7ICQgfSA9IHJoO1xyXG5cclxuY2xhc3MgR2xvYmFsIGV4dGVuZHMgcmguV2lkZ2V0IHtcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0cykge1xyXG4gICAgc3VwZXIob3B0cyk7XHJcbiAgICBpZiAodGhpcy5tb2RlbCA9PSBudWxsKSB7IHRoaXMubW9kZWwgPSByaC5tb2RlbDsgfVxyXG4gIH1cclxufVxyXG4gICAgXHJcbndpbmRvdy5yaC53aWRnZXRzLkdsb2JhbCA9IEdsb2JhbDsiLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBfIH0gPSByaDtcclxubGV0IHsgJCB9ID0gcmg7XHJcbmxldCB7IGNvbnN0cyB9ID0gcmg7XHJcbmxldCB7IFdpZGdldCB9ID0gcmg7XHJcblxyXG5jbGFzcyBMaXN0IGV4dGVuZHMgV2lkZ2V0IHtcclxuICBzdGF0aWMgaW5pdENsYXNzKCkge1xyXG5cclxuICAgIHRoaXMucHJvdG90eXBlLmRhdGFJQXR0cnMgPSBbJ2NoaWxkJ10uY29uY2F0KFdpZGdldC5wcm90b3R5cGUuZGF0YUlBdHRycyk7XHJcbiAgICB0aGlzLnByb3RvdHlwZS5kYXRhSUF0dHJNZXRob2RzID0gKCgpID0+IFdpZGdldC5wcm90b3R5cGUubWFwRGF0YUF0dHJNZXRob2RzKExpc3QucHJvdG90eXBlLmRhdGFJQXR0cnMpKSgpO1xyXG5cclxuICAgIHRoaXMucHJvdG90eXBlLnN1cHBvcnRlZEFyZ3MgPSBbJ25vZGUnLCAnbW9kZWwnLCAna2V5JywgJ3VzZXJfdmFycycsICdmaWx0ZXInLFxyXG4gICAgICdzcGxpdG9uJywgJ3BhdGgnLCAndHBsTm9kZScsICd0cGxDaGlsZE5vZGVzJ107XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRzKSB7XHJcbiAgICBzdXBlcihvcHRzKTtcclxuICAgIHRoaXMucmVSZW5kZXIgPSB0aGlzLnJlUmVuZGVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbmRlckNodW5jayA9IHRoaXMucmVuZGVyQ2h1bmNrLmJpbmQodGhpcyk7XHJcblxyXG4gICAgaWYgKHRoaXMua2V5ID09IG51bGwpIHsgdGhpcy5rZXkgPSBgXyR7dGhpc31gOyB9XHJcbiAgICBpZiAodGhpcy5wYXRoID09IG51bGwpIHsgdGhpcy5wYXRoID0gW107IH1cclxuICAgIGlmICh0aGlzLmNoaWxkcmVuID09IG51bGwpIHsgdGhpcy5jaGlsZHJlbiA9IFtdOyB9XHJcbiAgICBpZiAodGhpcy51c2VyX3ZhcnMgPT0gbnVsbCkgeyB0aGlzLnVzZXJfdmFycyA9IHt9OyB9XHJcbiAgICB0aGlzLnVzZVRlbXBsYXRlID0gdHJ1ZTtcclxuICAgIHRoaXMucmVuZGVyZWRJbmRleCA9IDA7XHJcbiAgICB0aGlzLnJlbmRlcmVkQ291bnQgPSAwO1xyXG4gIH1cclxuXHJcbiAgaW5pdChwYXJlbnQpIHtcclxuICAgIGlmICh0aGlzLmluaXREb25lKSB7IHJldHVybjsgfVxyXG4gICAgc3VwZXIuaW5pdChwYXJlbnQpO1xyXG4gICAgdGhpcy5zdWJzY3JpYmVPbmx5KHRoaXMua2V5LCB0aGlzLnJlUmVuZGVyLCB7cGFydGlhbDogZmFsc2V9KTtcclxuICAgIHRoaXMuc3Vic2NyaWJlRXhwcih0aGlzLmtleWV4cHIsIGZ1bmN0aW9uKHJlc3VsdCkgeyBpZiAocmVzdWx0ID09IG51bGwpIHsgcmVzdWx0ID0gW107IH0gcmV0dXJuIHRoaXMucHVibGlzaCh0aGlzLmtleSwgcmVzdWx0LCB7c3luYzogdHJ1ZX0pOyB9KTtcclxuICAgIHJldHVybiB0aGlzLnN1YnNjcmliZU9ubHkodGhpcy5vcHRzLmxvYWRtb3JlLCB0aGlzLnJlbmRlckNodW5jayk7XHJcbiAgfVxyXG5cclxuICBwYXJzZU9wdHMob3B0cykge1xyXG4gICAgc3VwZXIucGFyc2VPcHRzKG9wdHMpO1xyXG4gICAgaWYgKHRoaXMua2V5KSB7XHJcbiAgICAgIGlmIChfLmlzVmFsaWRNb2RlbENvbnN0S2V5KHRoaXMua2V5KSkgeyB0aGlzLmtleSA9IGNvbnN0cyh0aGlzLmtleSk7IH1cclxuICAgICAgaWYgKCFfLmlzVmFsaWRNb2RlbEtleSh0aGlzLmtleSkpIHtcclxuICAgICAgICB0aGlzLmtleWV4cHIgPSB0aGlzLmtleTtcclxuICAgICAgICByZXR1cm4gdGhpcy5rZXkgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwYXJzZVBpcGVkQXJnKCkge1xyXG4gICAgbGV0IGFyZ3MgPSB0aGlzLm9wdHMucGlwZWRBcmdzO1xyXG4gICAgaWYgKGFyZ3MgIT0gbnVsbCA/IGFyZ3Muc2hpZnQgOiB1bmRlZmluZWQpIHtcclxuICAgICAgbGV0IGFyZztcclxuICAgICAgaWYgKGFyZyA9IGFyZ3Muc2hpZnQoKSkgeyB0aGlzLmZpbHRlciA9IGFyZzsgfVxyXG4gICAgICBpZiAoYXJnID0gYXJncy5zaGlmdCgpKSB7IHRoaXMuc3BsaXRvbiA9IGFyZzsgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChfLmlzU3RyaW5nKHRoaXMuZmlsdGVyKSkgeyB0aGlzLmZpbHRlciA9IHRoaXMubGlzdEl0ZW1FeHByKHRoaXMuZmlsdGVyKTsgfVxyXG4gICAgaWYgKF8uaXNTdHJpbmcodGhpcy5zcGxpdG9uKSkgeyByZXR1cm4gdGhpcy5zcGxpdG9uID0gdGhpcy5saXN0SXRlbUV4cHIodGhpcy5zcGxpdG9uKTsgfVxyXG4gIH1cclxuXHJcbiAgbm90aWZ5TG9hZGluZyh2YWx1ZSkgeyBpZiAodGhpcy5vcHRzLmxvYWRpbmcpIHsgcmV0dXJuIHRoaXMucHVibGlzaCh0aGlzLm9wdHMubG9hZGluZywgdmFsdWUpOyB9IH1cclxuXHJcbiAgbGlzdEl0ZW1FeHByKGV4cHIpIHsgcmV0dXJuIHRoaXMuX2V2YWxGdW5jdGlvbignaXRlbSwgaW5kZXgnLCBleHByKTsgfVxyXG5cclxuICBpc1dpZGdldE5vZGUobm9kZSkgeyByZXR1cm4gc3VwZXIuaXNXaWRnZXROb2RlKC4uLmFyZ3VtZW50cykgfHwgJC5kYXRhc2V0KG5vZGUsICdjaGlsZCcpOyB9XHJcblxyXG4gIHJlUmVuZGVyKHJlbmRlcikge1xyXG4gICAgdGhpcy5kYXRhID0gbnVsbDtcclxuICAgIHRoaXMucmVuZGVyZWRJbmRleCA9IDA7XHJcbiAgICB0aGlzLnJlbmRlcmVkQ291bnQgPSAwO1xyXG4gICAgcmV0dXJuIHN1cGVyLnJlUmVuZGVyKHJlbmRlcik7XHJcbiAgfVxyXG5cclxuICBwcmVSZW5kZXIoKSB7XHJcbiAgICBsZXQgbm9kZTtcclxuICAgIGxldCBvbGROb2RlID0gdGhpcy5ub2RlO1xyXG4gICAgaWYgKHRoaXMudHBsQ2hpbGROb2RlcyA9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMudHBsQ2hpbGROb2RlcyA9ICgoKCkgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICBmb3IgKG5vZGUgb2YgQXJyYXkuZnJvbSh0aGlzLnRwbE5vZGUuY2hpbGROb2RlcykpIHsgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9KSgpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5vZGUgPSB0aGlzLnRwbE5vZGUuY2xvbmVOb2RlKGZhbHNlKTtcclxuICAgIHJldHVybiBvbGROb2RlO1xyXG4gIH1cclxuXHJcbiAgYWx0ZXJOb2RlQ29udGVudCgpIHtcclxuICAgIGlmICh0aGlzLmRhdGEgPT0gbnVsbCkgeyB0aGlzLmRhdGEgPSB0aGlzLmdldCh0aGlzLmtleSkgfHwgW107IH1cclxuICAgIHJldHVybiAodGhpcy5yZW5kZXJDaHVuY2spKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXJDaHVuY2soKSB7XHJcbiAgICBsZXQgaTtcclxuICAgIGxldCBlbmQ7XHJcbiAgICB0aGlzLm5vdGlmeUxvYWRpbmcoZmFsc2UpO1xyXG4gICAgZm9yIChpID0gdGhpcy5yZW5kZXJlZEluZGV4LCBlbmQgPSB0aGlzLmRhdGEubGVuZ3RoIC0gMTsgaSA8PSBlbmQ7IGkrKykge1xyXG4gICAgICBsZXQgaXRlbSA9IHRoaXMuZGF0YVtpXTtcclxuICAgICAgaWYgKHRoaXMuZmlsdGVyICYmICF0aGlzLmZpbHRlcihpdGVtLCBpKSkgeyBjb250aW51ZTsgfVxyXG4gICAgICBpZiAodGhpcy5zcGxpdG9uICYmIChpICE9PSB0aGlzLnJlbmRlcmVkSW5kZXgpICYmIHRoaXMuc3BsaXRvbihpdGVtLCB0aGlzLnJlbmRlcmVkQ291bnQpKSB7XHJcbiAgICAgICAgdGhpcy5ub3RpZnlMb2FkaW5nKHRydWUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVuZGVyT25lSXRlbShpdGVtLCBpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXJlZEluZGV4ID0gaTtcclxuICAgIGlmICh0aGlzLnJlbmRlcmVkQ291bnQgPT09IDApIHsgdGhpcy5oaWRlKCk7IH0gZWxzZSBpZiAoIXRoaXMuaXNWaXNpYmxlKCkpIHsgdGhpcy5zaG93KCk7IH1cclxuICAgIGlmICh0aGlzLm9wdHMubG9hZGVkICYmIChpID09PSB0aGlzLmRhdGEubGVuZ3RoKSkgeyByZXR1cm4gdGhpcy5wdWJsaXNoKHRoaXMub3B0cy5sb2FkZWQsIHRydWUpOyB9XHJcbiAgfVxyXG5cclxuICByZW5kZXJPbmVJdGVtKGl0ZW0sIGluZGV4KSB7XHJcbiAgICB0aGlzLnJlbmRlcmVkSW5kZXggPSBpbmRleDtcclxuICAgIGxldCBnZW5lcmF0ZWluZGV4ID0gdGhpcy5vcHRzLmdlbmVyYXRlaW5kZXggfHwgcmguX2RlYnVnO1xyXG4gICAgZm9yIChsZXQgbm9kZSBvZiBBcnJheS5mcm9tKHRoaXMudHBsQ2hpbGROb2RlcykpIHtcclxuICAgICAgdmFyIG5ld05vZGU7XHJcbiAgICAgIGlmICgobmV3Tm9kZSA9IHRoaXMucmVzb2x2ZV9yaWYobm9kZSwgaXRlbSwgaW5kZXgpKSkge1xyXG4gICAgICAgIGlmIChpbmNyZW1lbnRlZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVkQ291bnQrKztcclxuICAgICAgICAgIHZhciBpbmNyZW1lbnRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnZW5lcmF0ZWluZGV4KSB7ICQuZGF0YXNldChuZXdOb2RlLCAnbGlzdGluZGV4JywgdGhpcy5yZW5kZXJlZENvdW50IC0gMSk7IH1cclxuICAgICAgICBpZiAobmV3Tm9kZS5oYXNDaGlsZE5vZGVzKCkpIHsgdGhpcy5yZW5kZXJDaGlsZExpc3QobmV3Tm9kZSwgaXRlbSwgaW5kZXgpOyB9XHJcbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKG5ld05vZGUpO1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZUl0ZW1JbmRleChuZXdOb2RlLCBpdGVtLCBpbmRleCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnZlcnRUb0xpc3RDb250YWluZXIobm9kZSkge31cclxuXHJcbiAgX3BhdGhJZChpbmRleCkge1xyXG4gICAgbGV0IGlkID0gJ18nO1xyXG4gICAgaWQgKz0gdGhpcy5wYXRoLmpvaW4oJ18nKTtcclxuICAgIGlmIChpbmRleCAhPSBudWxsKSB7XHJcbiAgICAgIGlmICh0aGlzLnBhdGgubGVuZ3RoID4gMCkgeyBpZCArPSAnXyc7IH1cclxuICAgICAgaWQgKz0gaW5kZXg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWQ7XHJcbiAgfVxyXG5cclxuICBfcGF0aEtleShzdWJwYXRoKSB7XHJcbiAgICBpZiAoc3VicGF0aCA9PSBudWxsKSB7IHN1YnBhdGggPSAnJzsgfVxyXG4gICAgc3VicGF0aCA9IHN1YnBhdGgudG9TdHJpbmcoKTtcclxuICAgIGxldCBwYXRoID0gdGhpcy5wYXRoLmpvaW4oJy4nKTtcclxuICAgIGlmICgoc3VicGF0aC5sZW5ndGggPiAwKSAmJiAocGF0aC5sZW5ndGggPiAwKSkge1xyXG4gICAgICByZXR1cm4gYC4ke3BhdGh9LiR7c3VicGF0aH1gO1xyXG4gICAgfSBlbHNlIGlmIChzdWJwYXRoLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIGAuJHtzdWJwYXRofWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gYC4ke3BhdGh9YDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogQHBhdGg6IHVuaXF1ZSBwYXRoIGZvciBsaXN0XHJcbiAgICogQHBwYXRoOiB1bmlxdWUgcGF0aCBvZiBwYXJlbnRcclxuICAgKi9cclxuICByZXNvbHZlUmVwZWF0VmFyKGV4cHIsIGl0ZW0sIGluZGV4LCBjYWNoZSwgbm9kZSkge1xyXG4gICAgcmV0dXJuIGNhY2hlW2V4cHJdID0gY2FjaGVbZXhwcl0gfHwgKCgpID0+IHsgc3dpdGNoIChleHByKSB7XHJcbiAgICAgIGNhc2UgJ0BpdGVta2V5JzogcmV0dXJuIGAke3RoaXMua2V5fS4ke2luZGV4fWA7XHJcbiAgICAgIGNhc2UgJ0BrZXknOiByZXR1cm4gdGhpcy5rZXk7XHJcbiAgICAgIGNhc2UgJ0BpZCc6IHJldHVybiB0aGlzLl9wYXRoSWQoaW5kZXgpO1xyXG4gICAgICBjYXNlICdAcGlkJzogcmV0dXJuIHRoaXMuX3BhdGhJZCgpO1xyXG4gICAgICBjYXNlICdAcGF0aCc6IHJldHVybiB0aGlzLl9wYXRoS2V5KGluZGV4KTtcclxuICAgICAgY2FzZSAnQHBwYXRoJzogcmV0dXJuIHRoaXMuX3BhdGhLZXkoKTtcclxuICAgICAgY2FzZSAnQGxldmVsJzogcmV0dXJuIHRoaXMucGF0aC5sZW5ndGg7XHJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBzdXBlci5yZXNvbHZlUmVwZWF0VmFyKGV4cHIsIGl0ZW0sIGluZGV4LCBjYWNoZSwgbm9kZSk7XHJcbiAgICB9IH0pKCk7XHJcbiAgfVxyXG5cclxuICBkYXRhX2NoaWxkKG5vZGUsIHJhd0V4cHIsIGl0ZW0sIGluZGV4LCBhdHRyc0luZm8pIHtcclxuICAgIGlmICghXy5pc1ZhbGlkTW9kZWxLZXkocmF3RXhwcikpIHtcclxuICAgICAgJC5kYXRhc2V0KG5vZGUsICdjaGlsZCcsIHRoaXMuc3Vic2NyaWJlSURhdGFFeHByKG5vZGUsIHJhd0V4cHIsIGl0ZW0sIGluZGV4KSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIGl0IGNhbiBiZSBrZXkgb3IgZXhwcmVzc2lvblxyXG4gICAqIGRhdGEtY2hpbGQ9XCJ2YWx1ZVwiXHJcbiAgICogZGF0YS1jaGlsZD1cIkAucC52YWx1ZVwiXHJcbiAgICovXHJcbiAgcmVuZGVyQ2hpbGRMaXN0KG5vZGUsIGl0ZW0sIGluZGV4KSB7XHJcbiAgICByZXR1cm4gJC5lYWNoRGF0YU5vZGUobm9kZSwgJ2NoaWxkJywgZnVuY3Rpb24oY2hpbGROb2RlLCB2YWx1ZSkge1xyXG4gICAgICB0aGlzLmNvbnZlcnRUb0xpc3RDb250YWluZXIobm9kZSk7XHJcbiAgICAgIHRoaXMucmVzb2x2ZUl0ZW1JbmRleChjaGlsZE5vZGUsIGl0ZW0sIGluZGV4KTtcclxuXHJcbiAgICAgIHZhbHVlID0gJC5kYXRhc2V0KGNoaWxkTm9kZSwgJ2NoaWxkJyk7IC8vZ2V0IHVwZGF0ZWQgdmFsdWVcclxuICAgICAgaWYgKCh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHx8ICh2YWx1ZSA9PT0gJycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGFyZ3MgPSB2YWx1ZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGxldCBmaWx0ZXIgPSBhcmdzWzFdO1xyXG4gICAgICAgIGxldCBjaGlsZGtleSA9IGFyZ3NbMF07XHJcblxyXG4gICAgICAgIGxldCBjaGlsZExpc3QgPSBuZXcgTGlzdCh7XHJcbiAgICAgICAgICBub2RlOiBjaGlsZE5vZGUsXHJcbiAgICAgICAgICBtb2RlbDogdGhpcy5tb2RlbCxcclxuICAgICAgICAgIGtleTogY2hpbGRrZXksXHJcbiAgICAgICAgICB1c2VyX3ZhcnM6IHRoaXMudXNlcl92YXJzLFxyXG4gICAgICAgICAgcGF0aDogdGhpcy5wYXRoLmNvbmNhdChbdGhpcy5yZW5kZXJlZENvdW50IC0gMV0pLFxyXG4gICAgICAgICAgZmlsdGVyLFxyXG4gICAgICAgICAgdHBsTm9kZTogY2hpbGROb2RlLmNsb25lTm9kZShmYWxzZSksXHJcbiAgICAgICAgICB0cGxDaGlsZE5vZGVzOiB0aGlzLnRwbENoaWxkTm9kZXNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2hpbGRMaXN0LmluaXQodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZExpc3QpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAsIHRoaXMpO1xyXG4gIH1cclxufVxyXG5MaXN0LmluaXRDbGFzcygpO1xyXG5cclxud2luZG93LnJoLndpZGdldHMuTGlzdCA9IExpc3Q7XHJcbiIsInJlcXVpcmUoXCIuLi9saWIvcmhcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL3V0aWxzL3V0aWxzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vcXVlcnlcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL3V0aWxzL3VybF91dGlsc1wiKVxyXG4iLCJsZXQgcmggPSByZXF1aXJlKCcuLi8uLi9saWIvcmgnKVxyXG5cclxuY2xhc3MgT25Mb2FkIHtcclxuICBjb25zdHJ1Y3Rvcih3aWRnZXQsIG5vZGUsIHJhd0V4cHIpIHtcclxuICAgIGxldCB7Y2FsbGJhY2t9ID0gd2lkZ2V0LnJlc29sdmVSYXdFeHByV2l0aFZhbHVlKHJhd0V4cHIpXHJcbiAgICBub2RlLm9ubG9hZCA9ICgpID0+IGNhbGxiYWNrLmNhbGwod2lkZ2V0KVxyXG4gIH1cclxufVxyXG5cclxucmgucmVnaXN0ZXJEYXRhQXR0cignb25sb2FkJywgT25Mb2FkKVxyXG4iLCJyZXF1aXJlKFwiLi4vbGliL3JoXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy91dGlscy9zaGltXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy91dGlscy9wYXJzZV91dGlsc1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvdXRpbHMvZGVidWdfdXRpbHNcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL3V0aWxzL2V2ZW50X3V0aWxzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy91dGlscy9tb2RlbF91dGlsc1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvdXRpbHMvdW5pY29kZV91dGlsc1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvY29tbW9uL2RlYnVnXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vY29uc3RzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vbW9kZWxcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL2NvbW1vbi9kYXRhX3V0aWxcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL2NvbW1vbi9ndWFyZFwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvY29tbW9uL3BsdWdpblwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvY29tbW9uL2NvbnNvbGVcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL2NvbW1vbi93aWRnZXRcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL2NvbW1vbi9pbml0XCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vbWVzc2FnZVwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvY29tbW9uL2lmcmFtZVwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvY29tbW9uL3N0b3JhZ2VcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL2NvbW1vbi9yZXNwb25zaXZlXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vc2NyZWVuXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vbm9kZV9ob2xkZXJcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL2NvbW1vbi9jb250cm9sbGVyXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vaHR0cFwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvZGF0YV9hdHRyaWJ1dGVzL2RhdGFfYXR0clwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvZGF0YV9hdHRyaWJ1dGVzL3Jlc2l6ZVwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvZGF0YV9hdHRyaWJ1dGVzL3RhYmxlXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9kYXRhX2F0dHJpYnV0ZXMvdGFibGVfcmVjdXJzaXZlXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy93aWRnZXRzL2dsb2JhbFwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvd2lkZ2V0cy9saXN0XCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy93aWRnZXRzL2RhdGFfd2lkZ2V0c1wiKVxyXG5yZXF1aXJlKFwiLi9kYXRhX2F0dHJpYnV0ZXMvb25sb2FkXCIpXHJcbnJlcXVpcmUoXCIuL3V0aWxzL29wZXJhdG9yX3NlYXJjaFwiKVxyXG5yZXF1aXJlKFwiLi91dGlscy9jb2xsZWN0aW9uc1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvaW5kaWdvL2hhbmRsZXJzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9jb21tb24vcmhzXCIpXHJcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpqYjJ4c1pXTjBhVzl1Y3k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwibGV0IHJoID0gcmVxdWlyZSgnLi4vLi4vbGliL3JoJylcclxubGV0IF8gPSByaC5fXHJcbl8uaXNBTkQgPSAoIGFfc3RyT3AsIGVuYWJsZU9wZXJhdG9yU2VhcmNoICkgPT57XHJcbiAgcmV0dXJuIChlbmFibGVPcGVyYXRvclNlYXJjaCAmJlxyXG4gICAgICAgICAgICAoYV9zdHJPcCA9PT0gXCJhbmRcIiB8fCBhX3N0ck9wID09PSBcIiZcInx8IGFfc3RyT3AgPT09IFwiQU5EXCIpKXx8XHJcbiAgICAgICAgICAgIGFfc3RyT3AgPT09IFwiXFx1MDBBQ2FuZFxcdTAwQUNcIiA7XHJcbn1cclxuXHJcbl8uaXNPUiA9ICggYV9zdHJPcCwgZW5hYmxlT3BlcmF0b3JTZWFyY2ggKSA9PntcclxuICByZXR1cm4gKCBlbmFibGVPcGVyYXRvclNlYXJjaCAmJlxyXG5cdFx0XHRcdChhX3N0ck9wID09PVwib3JcIiB8fCBhX3N0ck9wID09PSBcInxcIiB8fCBhX3N0ck9wID09PSBcIk9SXCIpKTtcclxufVxyXG5cclxuXy5pc05PVCA9ICggYV9zdHJPcCwgZW5hYmxlT3BlcmF0b3JTZWFyY2gpID0+e1xyXG4gIHJldHVybiAgZW5hYmxlT3BlcmF0b3JTZWFyY2ggJiZcclxuXHRcdFx0XHRcdFx0KGFfc3RyT3AgPT09IFwibm90XCIgfHwgYV9zdHJPcCA9PT0gXCJ+XCIgfHwgYV9zdHJPcCA9PT0gXCJOT1RcIilcclxufVxyXG5cclxuXy5pc09wZXJhdG9yID0gKCBzdHJPcCwgZW5hYmxlT3BlcmF0b3JTZWFyY2ggKSA9PntcclxuICBpZiAoIHN0ck9wID09PSBcIlxcdTAwQUNhbmRcXHUwMEFDXCJ8fFxyXG4gICAgICAgIChlbmFibGVPcGVyYXRvclNlYXJjaCAmJlxyXG5cdFx0XHRcdChzdHJPcCA9PT0gXCJhbmRcIiB8fCBzdHJPcCA9PT0gXCJvclwiIHx8IHN0ck9wID09PSBcIm5vdFwiICkpKXtcclxuICAgIHJldHVybiB0cnVlXHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZSAgICAgIFxyXG59XHJcbiIsIi8vR3VuamFuXHJcbmlmIChnbG9iYWwucmggPT09IHVuZGVmaW5lZCkge1xyXG4gIGdsb2JhbC5yaCA9IHt9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5yaFxyXG4iXX0=
