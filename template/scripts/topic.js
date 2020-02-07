(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var model = rh.model;
var consts = rh.consts;
var _ = rh._;

var PhoneGap = function () {
  function PhoneGap() {
    _classCallCheck(this, PhoneGap);

    this.addJsToTopics();
  }

  _createClass(PhoneGap, [{
    key: 'addJsToTopics',
    value: function addJsToTopics() {
      return model.subscribeOnce(consts('KEY_MOBILE_APP_MODE'), function (val) {
        if (val) {
          return model.subscribe(consts('EVT_WIDGET_LOADED'), function () {
            return _.loadScript(consts('CORDOVA_JS_URL'), false, function () {
              if (rh.debug) {
                return rh._d('info', 'loaded Cordova.js');
              }
            });
          });
        }
      });
    }
  }]);

  return PhoneGap;
}();

new PhoneGap();

},{}],2:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var consts = rh.consts;


rh.model.subscribe(consts('EVT_SCROLL_TO_TOP'), function (dummy) {
  return window.scrollTo(0, 0);
});

rh.model.subscribe(consts('EVT_PRINT_TOPIC'), function () {
  window.focus();
  return window.print();
});

},{}],3:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var consts = rh.consts;


_.getRootUrl = function () {
  var rootUrl = null;
  return function () {
    if (rootUrl == null) {
      var rootInfo = window.gScreenRelPathMap[window.gFinalCommonRootRelPath];
      rootUrl = '' + _.getHostFolder() + _.fixRelativeUrl(rootInfo != null ? rootInfo.defaultURL : undefined);
    }
    return rootUrl;
  };
}();

_.redirectToLayout = function () {
  var hostFolder = _.getHostFolder();
  var query = '';
  var relUrl = window._getRelativeFileName(hostFolder, decodeURI(document.location.href));
  var ref = document.referrer;
  if (ref && !_.isExternalUrl(ref)) {
    var queryMap = _.urlParams(_.extractParamString(ref));
    if (!_.isEmptyObject(queryMap)) {
      query = '?' + _.mapToEncodedString(queryMap);
    }
  }

  var hashMap = _.urlParams(_.extractParamString(relUrl));
  hashMap[consts('HASH_KEY_TOPIC')] = _.stripParam(relUrl);
  hashMap[consts('HASH_KEY_UIMODE')] = null;
  var hash = '#' + _.mapToEncodedString(hashMap);
  return document.location.replace('' + _.getRootUrl() + query + hash);
};

_.goToFullLayout = function () {
  var hostFolder = _.getHostFolder();
  var query = '';
  var relUrl = window._getRelativeFileName(hostFolder, decodeURI(document.location.href));
  var ref = document.referrer;
  if (ref && !_.isExternalUrl(ref)) {
    var queryMap = _.urlParams(_.extractParamString(ref));
    queryMap[consts('RHMAPID')] = null;
    queryMap[consts('RHMAPNO')] = null;
    if (!_.isEmptyObject(queryMap)) {
      query = '?' + _.mapToEncodedString(queryMap);
    }
  }

  var topicPagePath = consts('START_FILEPATH');
  if (topicPagePath && topicPagePath !== '') {
    var rootUrl = '' + hostFolder + _.fixRelativeUrl(topicPagePath);
    var hashMap = _.urlParams(_.extractParamString(relUrl));
    hashMap[consts('HASH_KEY_TOPIC')] = _.stripParam(relUrl);
    hashMap[consts('HASH_KEY_UIMODE')] = null;
    var hash = '#' + _.mapToEncodedString(hashMap);
    return document.location.replace('' + rootUrl + query + hash);
  }
};

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
(function (global){
"use strict";

//Gunjan
if (global.rh === undefined) {
  global.rh = {};
}

module.exports = global.rh;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
"use strict";

require("../lib/rh");
require("../../lenient_src/utils/shim");
require("../../lenient_src/robohelp/topic/url_utils");
require("../../lenient_src/robohelp/topic/topic_events");
require("../../lenient_src/robohelp/topic/phonegap");
require("./topic/init");
require("./topic/widgets/dropdown_text");
require("./topic/widgets/expanding_text");
require("./topic/widgets/popover");
require("./topic/widgets/hyperlink_popover");
require("./topic/widgets/text_popover");
require("./topic/widgets/trigger");
require("./topic/highlight");
require("../../lenient_src/robohelp/topic/topic_events");

},{"../../lenient_src/robohelp/topic/phonegap":1,"../../lenient_src/robohelp/topic/topic_events":2,"../../lenient_src/robohelp/topic/url_utils":3,"../../lenient_src/utils/shim":4,"../lib/rh":5,"./topic/highlight":7,"./topic/init":8,"./topic/widgets/dropdown_text":9,"./topic/widgets/expanding_text":10,"./topic/widgets/hyperlink_popover":11,"./topic/widgets/popover":12,"./topic/widgets/text_popover":13,"./topic/widgets/trigger":14}],7:[function(require,module,exports){
'use strict';

var rh = require("../../lib/rh");
var _ = rh._;
var $ = rh.$;

_.removeHighlight = function () {
  var $body = $('body', 0);
  var $highlight_elements = $.find($body, 'span[data-highlight]') || [];
  _.each($highlight_elements, function (node) {
    $.removeAttribute(node, 'style');
  });
};

rh.model.csubscribe('EVT_REMOVE_HIGHLIGHT', _.removeHighlight);

},{"../../lib/rh":5}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var _ = rh._;
var consts = rh.consts;
var $ = rh.$;
var model = rh.model;
var EventHandlers = void 0,
    eHandlers = void 0,
    registeredEvents = void 0;

_.onTopicLoad = function () {
  var paramsStr = _.extractParamString(document.location.href);
  var paramsMap = _.urlParams(paramsStr);
  var redirectattr = consts('RH_FULL_LAYOUT_PARAM');
  if (redirectattr in paramsMap) {
    _.addProjectData(_.goToFullLayout);
  } else {
    _.addGoToLayout();
    _.remove_cbt();
  }
};

_.remove_cbt = function () {
  var $body = $('body', 0);
  var $cbt_elements = $.find($body, '[data-rhtags]');
  if ($cbt_elements) {
    _.each($cbt_elements, function (node) {
      $.removeClass(node, 'rh-hide');
    });
  }
};

_.getRelativeTopicPath = function () {
  var path = _.makeRelativeUrl(_.getRootUrl(), _.filePath());
  var index = path.lastIndexOf('/');
  return index !== -1 ? _.parentPath(path) : "";
};

_.addLayoutHTML = function () {

  model.subscribeOnce([consts('KEY_HEADER_HTML')], function () {
    var format = model.get(consts('KEY_HEADER_HTML'));

    if (format && format !== "") {

      model.subscribeOnce([consts('KEY_HEADER_TITLE'), consts('KEY_LNG')], function () {
        var title = model.get(consts('KEY_HEADER_TITLE'));
        var label = model.get(consts('KEY_LNG')).ShowTopicInContext;
        label = label ? label : "Click here to see this page in full context";
        var tooltip = label;
        var logo = model.get(consts('KEY_HEADER_LOGO_PATH'));
        logo = _.getRelativeTopicPath() + logo;
        var html = _.resolveEnclosedVar(format, function (variable) {
          if (variable === "label") {
            return label;
          } else if (variable === "tooltip") {
            return tooltip;
          } else if (variable === "title") {
            return title;
          } else if (variable === "logo") {
            return logo;
          }
        });
        var $body = $('body', 0);
        var $div = document.createElement("div");
        $div.innerHTML = html;
        $body.insertBefore($div, $body.childNodes[0]);
      });
    }
  });
};

_.addLayoutCSS = function () {

  model.subscribeOnce([consts('KEY_HEADER_CSS')], function () {
    var format = model.get(consts('KEY_HEADER_CSS'));

    if (format && format !== "") {

      model.subscribeOnce([consts('KEY_HEADER_LOGO_PATH'), consts('KEY_HEADER_TITLE_COLOR'), consts('KEY_HEADER_BACKGROUND_COLOR'), consts('KEY_LAYOUT_FONT_FAMILY')], function () {
        var backgroundColor = model.get(consts('KEY_HEADER_BACKGROUND_COLOR'));
        backgroundColor = backgroundColor ? backgroundColor : model.get(consts('KEY_HEADER_DEFAULT_BACKGROUND_COLOR'));
        var color = model.get(consts('KEY_HEADER_TITLE_COLOR'));
        color = color ? color : model.get(consts('KEY_HEADER_DEFAULT_TITLE_COLOR'));
        var fontFamily = model.get(consts('KEY_LAYOUT_FONT_FAMILY'));
        fontFamily = fontFamily ? fontFamily : model.get(consts('KEY_LAYOUT_DEFAULT_FONT_FAMILY'));
        var css = _.resolveEnclosedVar(format, function (variable) {
          if (variable === "background-color") {
            return backgroundColor;
          } else if (variable === "color") {
            return color;
          } else if (variable === "font-family") {
            return fontFamily;
          }
        });
        var $style = document.createElement("style");
        $style.type = 'text/css';
        $style.innerHTML = css;
        document.head.appendChild($style);
      });
    }
  });
};

_.addProjectData = function (callback) {
  callback = callback || function () {};
  var src = _.getRelativeTopicPath() + "template/scripts/projectdata.js";
  _.loadScript(src, null, callback);
};

_.addGoToLayout = function () {
  _.addProjectData();
  _.addLayoutHTML();
  _.addLayoutCSS();
};

model.publish(consts('KEY_SHARED_INPUT'), [consts('KEY_PROJECT_TAG_COMBINATIONS'), consts('KEY_TAG_EXPRESSION'), {
  key: consts('EVT_SCROLL_TO_TOP'),
  nested: false
}, consts('EVT_PRINT_TOPIC'), consts('KEY_MERGED_PROJECT_MAP'), consts('KEY_PROJECT_LIST'), consts('KEY_SHOW_TAGS'), consts('KEY_IFRAME_EVENTS'), consts('EVT_RELOAD_TOPIC'), consts('KEY_MOBILE_APP_MODE'), consts('KEY_HEADER_LOGO_PATH'), consts('KEY_HEADER_TITLE'), consts('KEY_HEADER_TITLE_COLOR'), consts('KEY_HEADER_BACKGROUND_COLOR'), consts('KEY_LAYOUT_FONT_FAMILY'), consts('KEY_HEADER_HTML'), consts('KEY_HEADER_CSS'), consts('KEY_HEADER_DEFAULT_BACKGROUND_COLOR'), consts('KEY_HEADER_DEFAULT_TITLE_COLOR'), consts('KEY_LAYOUT_DEFAULT_FONT_FAMILY'), consts('KEY_TOC_ORDER'), consts('EVT_COLLAPSE_ALL'), consts('EVT_EXPAND_ALL'), consts('KEY_SEARCH_HIGHLIGHT_COLOR'), consts('KEY_SEARCH_BG_COLOR'), consts('EVT_REMOVE_HIGHLIGHT')]);

model.publish(consts('KEY_SHARED_OUTPUT'), [consts('KEY_TOPIC_URL'), consts('KEY_TOPIC_ID'), consts('KEY_TOPIC_TITLE'), consts('KEY_TOPIC_BRSMAP'), consts('SHOW_MODAL'), consts('EVT_NAVIGATE_TO_URL'), consts('EVT_CLICK_INSIDE_IFRAME'), consts('EVT_SCROLL_INSIDE_IFRAME'), consts('EVT_INSIDE_IFRAME_DOM_CONTENTLOADED'), consts('KEY_TOPIC_HEIGHT'), consts('EVT_TOPIC_WIDGET_LOADED')]);

rh.iframe.init();

EventHandlers = function () {
  var lastScrollTop = void 0,
      publishScrollInfo = void 0;

  var EventHandlers = function () {
    function EventHandlers() {
      _classCallCheck(this, EventHandlers);
    }

    _createClass(EventHandlers, [{
      key: 'handle_click',
      value: function handle_click(event) {
        if (!event.defaultPrevented) {
          model.publish(consts('EVT_CLICK_INSIDE_IFRAME'), null);
          return _.hookClick(event);
        }
      }
    }, {
      key: 'handle_scroll',
      value: function handle_scroll() {
        var curScrollTop = void 0,
            dir = void 0;
        curScrollTop = document.body.scrollTop;
        if (curScrollTop > lastScrollTop) {
          dir = 'down';
        } else {
          dir = 'up';
        }
        lastScrollTop = curScrollTop;
        return publishScrollInfo(dir);
      }
    }]);

    return EventHandlers;
  }();

  lastScrollTop = -1;

  publishScrollInfo = _.throttle(function (dir) {
    var body = void 0,
        info = void 0;
    body = document.body;
    info = {
      scrollTop: body.scrollTop,
      scrollHeight: body.scrollHeight,
      dir: dir
    };
    return model.publish(consts('EVT_SCROLL_INSIDE_IFRAME'), info);
  }, 200);

  return EventHandlers;
}();

eHandlers = new EventHandlers();

registeredEvents = {};

model.subscribe(consts('EVT_WIDGET_LOADED'), _.one(function () {
  model.subscribe(consts('KEY_IFRAME_EVENTS'), function (obj) {
    if (obj === null) {
      obj = {};
    }
    return _.each(['click', 'scroll'], function (eName) {
      if (obj[eName]) {
        _.addEventListener(document, eName, eHandlers['handle_' + eName]);
        registeredEvents[eName] = true;
      } else if (registeredEvents[eName]) {
        _.removeEventListener(document, eName, eHandlers['handle_' + eName]);
        registeredEvents[eName] = false;
      }
    });
  });
  return _.delay(function () {
    return model.publish(consts('KEY_TOPIC_HEIGHT'), $.pageHeight());
  }, 100);
}));

model.subscribeOnce([rh.consts('KEY_TOC_ORDER'), rh.consts('EVT_PROJECT_LOADED')], function () {
  var orderData = rh.model.get(rh.consts('KEY_TOC_ORDER'));
  var url = rh._.parentPath(rh._.filePath().substring(rh._.getHostFolder().length));
  url = url.length && url[url.length - 1] === '/' ? url.substring(0, url.length - 1) : url;
  while (orderData[url] === undefined) {
    url = url.substring(0, url.lastIndexOf('/'));
  }
  var order = url && orderData[url].order;
  rh.model.publish(rh.consts('KEY_TOC_CHILD_ORDER'), order);
});

model.subscribe(consts('EVT_RELOAD_TOPIC'), function () {
  return document.location.reload();
});

model.subscribeOnce([consts('EVT_WINDOW_LOADED'), consts('KEY_TAG_EXPRESSION'), consts('KEY_TOPIC_ORIGIN')], function () {
  return _.defer(function () {
    var bookmark = document.location.hash;
    if (bookmark !== undefined && bookmark !== "" && bookmark !== "#") {
      var bookmark_name = bookmark.substring(1);
      var $elements = rh.$(bookmark + ",a[name=" + bookmark_name + "]");
      if ($elements.length > 0) {
        $elements[0].scrollIntoView(true);
      }
    }
  });
});

model.subscribe(consts('KEY_TOPIC_HEIGHT'), function () {
  _.delay(function () {
    model.publish(consts('EVT_WINDOW_LOADED'), null);
  }, 1000);
});

_.addEventListener(document, 'DOMContentLoaded', function () {
  return model.publish(consts('EVT_INSIDE_IFRAME_DOM_CONTENTLOADED'), null);
});

_.addEventListener(window, 'resize', function () {
  var triggeredByMe = void 0;
  triggeredByMe = false;
  return _.debounce(function () {
    var height = void 0;
    if (triggeredByMe) {
      triggeredByMe = false;
      return triggeredByMe;
    } else {
      height = $.pageHeight();
      if (height !== model.get(consts('KEY_TOPIC_HEIGHT'))) {
        triggeredByMe = true;
        return model.publish(consts('KEY_TOPIC_HEIGHT'), $.pageHeight());
      }
    }
  }, 250);
}());

},{"../../lib/rh":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rh = require("../../../lib/rh"),
    $ = rh.$,
    _ = rh._;

var DropdownText = function (_rh$Widget) {
  _inherits(DropdownText, _rh$Widget);

  function DropdownText(config) {
    _classCallCheck(this, DropdownText);

    var _this = _possibleConstructorReturn(this, (DropdownText.__proto__ || Object.getPrototypeOf(DropdownText)).call(this, config));

    _this.contentClass = 'dropdown-content';
    _this.titleClass = 'dropdown-title';
    _this.initNodes();
    return _this;
  }

  _createClass(DropdownText, [{
    key: 'initNodes',
    value: function initNodes() {
      var _this2 = this;

      var contentNodes = [];
      $.eachChildNode(this.node, function (child) {
        if ($.hasClass(child, _this2.contentClass)) {
          contentNodes.push(child);
        }
      });
      var nodeHolder = new rh.NodeHolder(contentNodes);
      nodeHolder.hide();
      $.eachChildNode(this.node, function (child) {
        if ($.hasClass(child, _this2.titleClass)) {
          _.addEventListener(child, 'click', function (evt) {
            if (!evt.defaultPrevented) {
              _this2.toggleState(nodeHolder);
              return _.preventDefault(evt);
            }
          });
        }
      });

      rh.model.csubscribe('EVT_COLLAPSE_ALL', function () {
        _this2.hide(nodeHolder);
      });

      rh.model.csubscribe('EVT_EXPAND_ALL', function () {
        _this2.show(nodeHolder);
      });
    }
  }, {
    key: 'hide',
    value: function hide(nodeHolder) {
      $.removeClass(this.node, 'expanded');
      nodeHolder.hide();
    }
  }, {
    key: 'show',
    value: function show(nodeHolder) {
      if (!$.hasClass(this.node, 'expanded')) {
        $.addClass(this.node, 'expanded');
      }
      nodeHolder.show();
    }
  }, {
    key: 'toggleState',
    value: function toggleState(nodeHolder) {
      if ($.hasClass(this.node, 'expanded')) {
        this.hide(nodeHolder);
      } else {
        this.show(nodeHolder);
      }
    }
  }]);

  return DropdownText;
}(rh.Widget);

exports.default = DropdownText;


rh.widgets.DropdownText = DropdownText;

},{"../../../lib/rh":5}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _rh = require('../../../lib/rh');

var _rh2 = _interopRequireDefault(_rh);

var _dropdown_text = require('./dropdown_text');

var _dropdown_text2 = _interopRequireDefault(_dropdown_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExpandingText = function (_DropdownText) {
  _inherits(ExpandingText, _DropdownText);

  function ExpandingText() {
    _classCallCheck(this, ExpandingText);

    return _possibleConstructorReturn(this, (ExpandingText.__proto__ || Object.getPrototypeOf(ExpandingText)).apply(this, arguments));
  }

  _createClass(ExpandingText, [{
    key: 'initNodes',
    value: function initNodes() {
      this.contentClass = 'expanding-content';
      this.titleClass = 'expanding-title';
      _get(ExpandingText.prototype.__proto__ || Object.getPrototypeOf(ExpandingText.prototype), 'initNodes', this).call(this);
    }
  }]);

  return ExpandingText;
}(_dropdown_text2.default);

_rh2.default.widgets.ExpandingText = ExpandingText;

},{"../../../lib/rh":5,"./dropdown_text":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rh = require("../../../lib/rh"),
    nodeUtils = require("../../utils/node_utils"),
    $ = rh.$,
    _ = rh._,
    instanceCount = 0;

var HyperlinkPopover = function (_rh$Widget) {
  _inherits(HyperlinkPopover, _rh$Widget);

  function HyperlinkPopover(config) {
    _classCallCheck(this, HyperlinkPopover);

    var _this = _possibleConstructorReturn(this, (HyperlinkPopover.__proto__ || Object.getPrototypeOf(HyperlinkPopover)).call(this, config));

    instanceCount = instanceCount + 1;
    _.addEventListener(_this.node, 'click', function (evt) {
      _this.showPopover();
      return _.preventDefault(evt);
    });
    return _this;
  }

  _createClass(HyperlinkPopover, [{
    key: "createPopupNode",
    value: function createPopupNode() {
      var node = $.createElement('div');
      $.addClass(node, 'rh-popover');
      $.dataset(node, 'height', $.dataset(this.node, 'height'));
      $.dataset(node, 'width', $.dataset(this.node, 'width'));
      $.dataset(node, 'placement', $.dataset(this.node, 'placement'));

      node.innerHTML = "<div class=\"rh-popover-content\">\n      <iframe class=\"popover-topic\" id=\"" + this.iframeID + "\" src=\"" + this.hyperlink + "\" frameborder=\"0\" scrolling=\"auto\"\n      onload=\"rh._.resetIframeSize('#" + this.iframeID + "')\" ></iframe>\n    </div>";
      return node;
    }
  }, {
    key: "showPopover",
    value: function showPopover() {
      var node = this.createPopupNode();
      nodeUtils.appendChild(document.body, node);
      this.popoverWidget = new rh.widgets.Popover({ node: node });
      this.popoverWidget.init();
      this.popoverWidget.initPosition(this.node);
    }
  }, {
    key: "hyperlink",
    get: function get() {
      return $.getAttribute(this.node, 'href');
    }
  }, {
    key: "iframeID",
    get: function get() {
      return "RhPopoverIframe" + instanceCount;
    }
  }]);

  return HyperlinkPopover;
}(rh.Widget);

exports.default = HyperlinkPopover;


rh.widgets.HyperlinkPopover = HyperlinkPopover;

},{"../../../lib/rh":5,"../../utils/node_utils":15}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rh = require("../../../lib/rh"),
    nodeUtils = require("../../utils/node_utils"),
    pageUtil = require("../../utils/page_utils"),
    _ = rh._,
    $ = rh.$;

var Popover = function (_rh$Widget) {
  _inherits(Popover, _rh$Widget);

  function Popover(config) {
    _classCallCheck(this, Popover);

    var _this = _possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).call(this, config));

    _this.placement = $.dataset(_this.node, 'placement');
    _this.height = _.parseInt($.dataset(_this.node, 'height'), 300);
    _this.width = _.parseInt($.dataset(_this.node, 'width'), 400);

    _.delay(function () {
      _this.handleClick = function (evt) {
        return _this._handleClick(evt);
      };
      _.addEventListener(document, 'click', _this.handleClick);
    }, 250);
    return _this;
  }

  _createClass(Popover, [{
    key: "destruct",
    value: function destruct() {
      _.removeEventListener(document, 'click', this.handleClick);
      _get(Popover.prototype.__proto__ || Object.getPrototypeOf(Popover.prototype), "destruct", this).call(this);
      nodeUtils.removeChild(this.node);
    }
  }, {
    key: "initPosition",
    value: function initPosition(target) {
      var rect = target && target.getClientRects()[0];
      if (rect) {
        this.setPosition(rect);
        if (this.height) {
          this.node.style.height = this.height;
        }
        if (this.width) {
          this.node.style.width = this.width;
        }
      }
    }
  }, {
    key: "setPosition",
    value: function setPosition(rect) {
      var pageHeight = pageUtil.innerHeight(),
          pageWidth = pageUtil.innerWidth();
      if (this.placement === 'top') {
        this.showTop(rect, pageHeight);
        this.setAutoHorizontalPosition(rect, pageWidth);
      } else if (this.placement === 'bottom') {
        this.showBottom(rect);
        this.setAutoHorizontalPosition(rect, pageWidth);
      } else if (this.placement === 'left') {
        this.setAutoVerticalPosition(rect, pageHeight);
        this.showLeft(rect, pageWidth);
      } else if (this.placement === 'right') {
        this.setAutoVerticalPosition(rect, pageHeight);
        this.showRight(rect);
      } else {
        this.setAutoHorizontalPosition(rect, pageWidth);
        this.setAutoVerticalPosition(rect, pageHeight);
      }
    }
  }, {
    key: "canShowTop",
    value: function canShowTop(rect) {
      return rect.top - this.height > 0;
    }
  }, {
    key: "canShowBottom",
    value: function canShowBottom(rect, pageHeight) {
      return pageHeight - rect.bottom - this.height > 0;
    }
  }, {
    key: "canShowLeft",
    value: function canShowLeft(rect) {
      return rect.left - this.width > 0;
    }
  }, {
    key: "canShowRight",
    value: function canShowRight(rect, pageWidth) {
      return pageWidth - rect.right - this.width > 0;
    }
  }, {
    key: "showTop",
    value: function showTop(rect, pageHeight) {
      this.node.style.bottom = pageHeight - rect.top + 2;
    }
  }, {
    key: "showBottom",
    value: function showBottom(rect) {
      this.node.style.top = rect.bottom;
    }
  }, {
    key: "showRight",
    value: function showRight(rect) {
      this.node.style.left = rect.right + 2;
    }
  }, {
    key: "showLeft",
    value: function showLeft(rect, pageWidth) {
      this.node.style.right = pageWidth - rect.left + 2;
    }
  }, {
    key: "setAutoHorizontalPosition",
    value: function setAutoHorizontalPosition(rect, pageWidth) {
      if (this.canShowRight(rect, pageWidth)) {
        this.showRight(rect);
      } else if (this.canShowLeft(rect)) {
        this.showLeft(rect, pageWidth);
      } else {
        this.node.style.left = pageWidth - this.width + 2;
      }
    }
  }, {
    key: "setAutoVerticalPosition",
    value: function setAutoVerticalPosition(rect, pageHeight) {
      if (this.canShowBottom(rect, pageHeight)) {
        this.showBottom(rect);
      } else if (this.canShowTop(rect)) {
        this.showTop(rect, pageHeight);
      } else {
        this.node.style.top = pageHeight - this.height + 2;
      }
    }
  }, {
    key: "_handleClick",
    value: function _handleClick(evt) {
      this.destruct();
      return _.preventDefault(evt);
    }
  }]);

  return Popover;
}(rh.Widget);

exports.default = Popover;


rh.widgets.Popover = Popover;

},{"../../../lib/rh":5,"../../utils/node_utils":15,"../../utils/page_utils":16}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rh = require("../../../lib/rh"),
    nodeUtils = require("../../utils/node_utils"),
    $ = rh.$,
    _ = rh._,
    instanceCount = 0;

var TextPopOver = function (_rh$Widget) {
  _inherits(TextPopOver, _rh$Widget);

  function TextPopOver(config) {
    _classCallCheck(this, TextPopOver);

    var _this = _possibleConstructorReturn(this, (TextPopOver.__proto__ || Object.getPrototypeOf(TextPopOver)).call(this, config));

    instanceCount = instanceCount + 1;
    _.addEventListener(_this.node, 'click', function (evt) {
      _this.showPopover();
      return _.preventDefault(evt);
    });
    return _this;
  }

  _createClass(TextPopOver, [{
    key: "createPopupNode",
    value: function createPopupNode() {
      var node = $.createElement('div');
      $.addClass(node, 'rh-popover');
      $.dataset(node, 'height', $.dataset(this.node, 'height'));
      $.dataset(node, 'width', $.dataset(this.node, 'width'));
      $.dataset(node, 'placement', $.dataset(this.node, 'placement'));

      node.innerHTML = "<div class=\"rh-popover-content\">\n      <div class=\"popover-text\" id=\"" + this.contentID + "\">" + this.text + "</div>\n    </div>";
      return node;
    }
  }, {
    key: "showPopover",
    value: function showPopover() {
      var node = this.createPopupNode();
      nodeUtils.appendChild(document.body, node);
      this.popoverWidget = new rh.widgets.Popover({ node: node });
      this.popoverWidget.init();
      this.popoverWidget.initPosition(this.node);
    }
  }, {
    key: "text",
    get: function get() {
      return $.dataset(this.node, 'popovertext');
    }
  }, {
    key: "contentID",
    get: function get() {
      return "Rh-textPopOver" + instanceCount;
    }
  }]);

  return TextPopOver;
}(rh.Widget);

exports.default = TextPopOver;


rh.widgets.TextPopOver = TextPopOver;

/*<a data-rhwidget="TextPopOver" data-popovertext="this is definition" href="#"> term </a> */

},{"../../../lib/rh":5,"../../utils/node_utils":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rh = require("../../../lib/rh"),
    $ = rh.$,
    _ = rh._;

var Trigger = function (_rh$Widget) {
  _inherits(Trigger, _rh$Widget);

  function Trigger(config) {
    _classCallCheck(this, Trigger);

    var _this = _possibleConstructorReturn(this, (Trigger.__proto__ || Object.getPrototypeOf(Trigger)).call(this, config));

    _this.initTargets();
    return _this;
  }

  _createClass(Trigger, [{
    key: 'getTargetNodes',
    value: function getTargetNodes() {
      var targetNames = _.splitAndTrim($.dataset(this.node, 'target'), ' ');
      var targetNodes = [];
      _.each(targetNames, function (targetName) {
        var nodes = $.find(document, '[data-targetname="' + targetName + '"]');
        _.each(nodes, function (node) {
          targetNodes.push(node);
        });
      });
      return targetNodes;
    }
  }, {
    key: 'initTargets',
    value: function initTargets() {
      var _this2 = this;

      var targetNodes = this.getTargetNodes();
      _.each(targetNodes, function (node) {
        if (!$.dataset(node, 'targetset')) {
          $.dataset(node, 'targetset', true);
        }
      });
      var nodeHolder = new rh.NodeHolder(targetNodes);
      nodeHolder.hide();
      _.addEventListener(this.node, 'click', function (evt) {
        if (!evt.defaultPrevented) {
          _this2.toggleState(nodeHolder);
          return _.preventDefault(evt);
        }
      });
      rh.model.csubscribe('EVT_COLLAPSE_ALL', function () {
        _this2.hide(nodeHolder);
      });

      rh.model.csubscribe('EVT_EXPAND_ALL', function () {
        _this2.show(nodeHolder);
      });
    }
  }, {
    key: 'hide',
    value: function hide(nodeHolder) {
      $.removeClass(this.node, 'pressed');
      nodeHolder.hide();
      nodeHolder.updateClass([]);
    }
  }, {
    key: 'show',
    value: function show(nodeHolder) {
      if (!$.hasClass(this.node, 'pressed')) {
        $.addClass(this.node, 'pressed');
      }
      nodeHolder.show();
      nodeHolder.updateClass(['show']);
    }
  }, {
    key: 'toggleState',
    value: function toggleState(nodeHolder) {
      if ($.hasClass(this.node, 'pressed')) {
        this.hide(nodeHolder);
      } else {
        this.show(nodeHolder);
      }
    }
  }]);

  return Trigger;
}(rh.Widget);

exports.default = Trigger;


rh.widgets.Trigger = Trigger;
rh.widgets.DropSpot = Trigger;
rh.widgets.ExpandSpot = Trigger;

},{"../../../lib/rh":5}],15:[function(require,module,exports){
'use strict';

var rh = require("../../lib/rh");
var $ = rh.$;
module.exports = {

  nodeType: {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  },

  removeChild: function removeChild(node) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.parentNode(node);

    return parent && parent.removeChild && parent.removeChild(node);
  },
  appendChild: function appendChild(parent, newNode) {
    return parent && parent.appendChild && parent.appendChild(newNode);
  },
  parentNode: function parentNode(node) {
    return node && node.parentNode;
  },
  childNodes: function childNodes(node) {
    return node && node.childNodes || [];
  },
  toHtmlNode: function toHtmlNode(html) {
    return this.childNodes($.createElement('div', html));
  },
  outerHTML: function outerHTML(node) {
    return node && node.outerHTML || '';
  },
  insertAfter: function insertAfter(node, newNode) {
    return node.parentNode.insertBefore(newNode, node.nextSibling);
  },
  value: function value(node) {
    return node && node.nodeValue;
  },
  name: function name(node) {
    return node && node.nodeName;
  },
  type: function type(node) {
    return node && node.nodeType;
  },
  isElementNode: function isElementNode(node) {
    return this.type(node) === this.nodeType.ELEMENT_NODE;
  },
  isTextNode: function isTextNode(node) {
    return this.type(node) === this.nodeType.TEXT_NODE;
  }
};

},{"../../lib/rh":5}],16:[function(require,module,exports){
(function (global){
'use strict';

var rh = require("../../lib/rh"),
    _ = rh._;

module.exports = {
  innerWidth: function innerWidth() {
    var innerWidth = global.innerWidth;
    if (!_.isDefined(innerWidth)) {
      var clientWidth = _.get(document, 'documentElement.clientWidth');
      clientWidth = _.isDefined(clientWidth) ? clientWidth : _.get(document, 'body.clientWidth');
      if (_.isDefined(clientWidth)) {
        innerWidth = clientWidth;
      }
    }
    return innerWidth;
  },
  innerHeight: function innerHeight() {
    var innerHeight = global.innerHeight;
    if (!_.isDefined(innerHeight)) {
      var clientHeight = _.get(document, 'documentElement.clientHeight');
      clientHeight = _.isDefined(clientHeight) ? clientHeight : _.get(document, 'body.clientHeight');
      if (_.isDefined(clientHeight)) {
        innerHeight = clientHeight;
      }
    }
    return innerHeight;
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../lib/rh":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsZW5pZW50X3NyYy9yb2JvaGVscC90b3BpYy9waG9uZWdhcC5qcyIsImxlbmllbnRfc3JjL3JvYm9oZWxwL3RvcGljL3RvcGljX2V2ZW50cy5qcyIsImxlbmllbnRfc3JjL3JvYm9oZWxwL3RvcGljL3VybF91dGlscy5qcyIsImxlbmllbnRfc3JjL3V0aWxzL3NoaW0uanMiLCJzcmMvbGliL3JoLmpzIiwic3JjL3Jlc3BvbnNpdmVfaGVscC90b3BpYy5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdG9waWMvaGlnaGxpZ2h0LmpzIiwic3JjL3Jlc3BvbnNpdmVfaGVscC90b3BpYy9pbml0LmpzIiwic3JjL3Jlc3BvbnNpdmVfaGVscC90b3BpYy93aWRnZXRzL2Ryb3Bkb3duX3RleHQuanMiLCJzcmMvcmVzcG9uc2l2ZV9oZWxwL3RvcGljL3dpZGdldHMvZXhwYW5kaW5nX3RleHQuanMiLCJzcmMvcmVzcG9uc2l2ZV9oZWxwL3RvcGljL3dpZGdldHMvaHlwZXJsaW5rX3BvcG92ZXIuanMiLCJzcmMvcmVzcG9uc2l2ZV9oZWxwL3RvcGljL3dpZGdldHMvcG9wb3Zlci5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdG9waWMvd2lkZ2V0cy90ZXh0X3BvcG92ZXIuanMiLCJzcmMvcmVzcG9uc2l2ZV9oZWxwL3RvcGljL3dpZGdldHMvdHJpZ2dlci5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdXRpbHMvbm9kZV91dGlscy5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdXRpbHMvcGFnZV91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztjQ0FhLE07SUFBUCxFLFdBQUEsRTtJQUNBLEssR0FBVSxFLENBQVYsSztJQUNBLE0sR0FBVyxFLENBQVgsTTtJQUNBLEMsR0FBTSxFLENBQU4sQzs7SUFFQSxRO0FBQ0osc0JBQWM7QUFBQTs7QUFDWCxTQUFLLGFBQU47QUFD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SyxRQUFRLGNBQVIsQ0FBVDtBQUFBLElBQ0UsSUFBSSxHQUFHLENBRFQ7O0FBR0EsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsWUFEZSx3QkFDRjtBQUNYLFFBQUksYUFBYSxPQUFPLFVBQXhCO0FBQ0EsUUFBRyxDQUFDLEVBQUUsU0FBRixDQUFZLFVBQVosQ0FBSixFQUE2QjtBQUMzQixVQUFJLGNBQWMsRUFBRSxHQUFGLENBQU0sUUFBTixFQUFnQiw2QkFBaEIsQ0FBbEI7QUFDQSxvQkFBYyxFQUFFLFNBQUYsQ0FBWSxXQUFaLElBQTJCLFdBQTNCLEdBQXlDLEVBQUUsR0FBRixDQUFNLFFBQU4sRUFBZ0Isa0JBQWhCLENBQXZEO0FBQ0EsVUFBRyxFQUFFLFNBQUYsQ0FBWSxXQUFaLENBQUgsRUFBNkI7QUFDM0IscUJBQWEsV0FBYjtBQUNEO0FBQ0Y7QUFDRCxXQUFPLFVBQVA7QUFFRCxHQVpjO0FBYWYsYUFiZSx5QkFhRDtBQUNaLFFBQUksY0FBYyxPQUFPLFdBQXpCO0FBQ0EsUUFBRyxDQUFDLEVBQUUsU0FBRixDQUFZLFdBQVosQ0FBSixFQUE4QjtBQUM1QixVQUFJLGVBQWUsRUFBRSxHQUFGLENBQU0sUUFBTixFQUFnQiw4QkFBaEIsQ0FBbkI7QUFDQSxxQkFBZSxFQUFFLFNBQUYsQ0FBWSxZQUFaLElBQTRCLFlBQTVCLEdBQTJDLEVBQUUsR0FBRixDQUFNLFFBQU4sRUFBZ0IsbUJBQWhCLENBQTFEO0FBQ0EsVUFBRyxFQUFFLFNBQUYsQ0FBWSxZQUFaLENBQUgsRUFBOEI7QUFDNUIsc0JBQWMsWUFBZDtBQUNEO0FBQ0Y7QUFDRCxXQUFPLFdBQVA7QUFDRDtBQXZCYyxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImxldCB7IHJoIH0gPSB3aW5kb3c7XHJcbmxldCB7IG1vZGVsIH0gPSByaDtcclxubGV0IHsgY29uc3RzIH0gPSByaDtcclxubGV0IHsgXyB9ID0gcmg7XHJcblxyXG5jbGFzcyBQaG9uZUdhcCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAodGhpcy5hZGRKc1RvVG9waWNzKSgpO1xyXG4gIH1cclxuXHJcbiAgYWRkSnNUb1RvcGljcygpIHtcclxuICAgIHJldHVybiBtb2RlbC5zdWJzY3JpYmVPbmNlKGNvbnN0cygnS0VZX01PQklMRV9BUFBfTU9ERScpLCBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHJldHVybiBtb2RlbC5zdWJzY3JpYmUoY29uc3RzKCdFVlRfV0lER0VUX0xPQURFRCcpLCAoKSA9PlxyXG4gICAgICAgICAgXy5sb2FkU2NyaXB0KGNvbnN0cygnQ09SRE9WQV9KU19VUkwnKSwgZmFsc2UsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAocmguZGVidWcpIHsgcmV0dXJuIHJoLl9kKCdpbmZvJywgJ2xvYWRlZCBDb3Jkb3ZhLmpzJyk7IH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxubmV3IFBob25lR2FwO1xyXG4iLCJsZXQgeyByaCB9ID0gd2luZG93O1xyXG5sZXQgeyBjb25zdHMgfSA9IHJoO1xyXG5cclxucmgubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnRVZUX1NDUk9MTF9UT19UT1AnKSwgZHVtbXkgPT4gd2luZG93LnNjcm9sbFRvKDAsIDApKTtcclxuXHJcbnJoLm1vZGVsLnN1YnNjcmliZShjb25zdHMoJ0VWVF9QUklOVF9UT1BJQycpLCBmdW5jdGlvbigpIHtcclxuICAod2luZG93LmZvY3VzKSgpO1xyXG4gIHJldHVybiAod2luZG93LnByaW50KSgpO1xyXG59KTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7IGNvbnN0cyB9ID0gcmg7XHJcblxyXG5fLmdldFJvb3RVcmwgPSAoZnVuY3Rpb24oKSB7XHJcbiAgbGV0IHJvb3RVcmwgPSBudWxsO1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIGlmIChyb290VXJsID09IG51bGwpIHtcclxuICAgICAgbGV0IHJvb3RJbmZvID0gd2luZG93LmdTY3JlZW5SZWxQYXRoTWFwW3dpbmRvdy5nRmluYWxDb21tb25Sb290UmVsUGF0aF07XHJcbiAgICAgIHJvb3RVcmwgPSBgJHtfLmdldEhvc3RGb2xkZXIoKX0ke18uZml4UmVsYXRpdmVVcmwocm9vdEluZm8gIT0gbnVsbCA/IHJvb3RJbmZvLmRlZmF1bHRVUkwgOiB1bmRlZmluZWQpfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcm9vdFVybDtcclxuICB9O1xyXG59KSgpO1xyXG5cclxuXy5yZWRpcmVjdFRvTGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IGhvc3RGb2xkZXIgPSBfLmdldEhvc3RGb2xkZXIoKTtcclxuICBsZXQgcXVlcnkgPSAnJztcclxuICBsZXQgcmVsVXJsID0gd2luZG93Ll9nZXRSZWxhdGl2ZUZpbGVOYW1lKGhvc3RGb2xkZXIsXHJcbiAgICBkZWNvZGVVUkkoZG9jdW1lbnQubG9jYXRpb24uaHJlZikpO1xyXG4gIGxldCByZWYgPSBkb2N1bWVudC5yZWZlcnJlcjtcclxuICBpZiAocmVmICYmICFfLmlzRXh0ZXJuYWxVcmwocmVmKSkge1xyXG4gICAgbGV0IHF1ZXJ5TWFwID0gXy51cmxQYXJhbXMoXy5leHRyYWN0UGFyYW1TdHJpbmcocmVmKSk7XHJcbiAgICBpZiAoIV8uaXNFbXB0eU9iamVjdChxdWVyeU1hcCkpIHsgcXVlcnkgPSBgPyR7Xy5tYXBUb0VuY29kZWRTdHJpbmcocXVlcnlNYXApfWA7IH1cclxuICB9XHJcblxyXG4gIGxldCBoYXNoTWFwID0gXy51cmxQYXJhbXMoXy5leHRyYWN0UGFyYW1TdHJpbmcocmVsVXJsKSk7XHJcbiAgaGFzaE1hcFtjb25zdHMoJ0hBU0hfS0VZX1RPUElDJyldID0gXy5zdHJpcFBhcmFtKHJlbFVybCk7XHJcbiAgaGFzaE1hcFtjb25zdHMoJ0hBU0hfS0VZX1VJTU9ERScpXSA9IG51bGw7XHJcbiAgbGV0IGhhc2ggPSBgIyR7Xy5tYXBUb0VuY29kZWRTdHJpbmcoaGFzaE1hcCl9YDtcclxuICByZXR1cm4gZG9jdW1lbnQubG9jYXRpb24ucmVwbGFjZShgJHtfLmdldFJvb3RVcmwoKX0ke3F1ZXJ5fSR7aGFzaH1gKTtcclxufTtcclxuXHJcblxyXG5fLmdvVG9GdWxsTGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IGhvc3RGb2xkZXIgPSBfLmdldEhvc3RGb2xkZXIoKTtcclxuICBsZXQgcXVlcnkgPSAnJztcclxuICBsZXQgcmVsVXJsID0gd2luZG93Ll9nZXRSZWxhdGl2ZUZpbGVOYW1lKGhvc3RGb2xkZXIsXHJcbiAgICBkZWNvZGVVUkkoZG9jdW1lbnQubG9jYXRpb24uaHJlZikpO1xyXG4gIGxldCByZWYgPSBkb2N1bWVudC5yZWZlcnJlcjtcclxuICBpZiAocmVmICYmICFfLmlzRXh0ZXJuYWxVcmwocmVmKSkge1xyXG4gICAgbGV0IHF1ZXJ5TWFwID0gXy51cmxQYXJhbXMoXy5leHRyYWN0UGFyYW1TdHJpbmcocmVmKSk7XHJcbiAgICBxdWVyeU1hcFtjb25zdHMoJ1JITUFQSUQnKV0gPSBudWxsO1xyXG4gICAgcXVlcnlNYXBbY29uc3RzKCdSSE1BUE5PJyldID0gbnVsbDtcclxuICAgIGlmICghXy5pc0VtcHR5T2JqZWN0KHF1ZXJ5TWFwKSkgeyBxdWVyeSA9IGA/JHtfLm1hcFRvRW5jb2RlZFN0cmluZyhxdWVyeU1hcCl9YDsgfVxyXG4gIH1cclxuXHJcbiAgbGV0IHRvcGljUGFnZVBhdGggPSBjb25zdHMoJ1NUQVJUX0ZJTEVQQVRIJyk7XHJcbiAgaWYodG9waWNQYWdlUGF0aCAmJiAodG9waWNQYWdlUGF0aCAhPT0gJycpKSB7XHJcbiAgICBsZXQgcm9vdFVybCA9IGAke2hvc3RGb2xkZXJ9JHtfLmZpeFJlbGF0aXZlVXJsKHRvcGljUGFnZVBhdGgpfWA7XHJcbiAgICBsZXQgaGFzaE1hcCA9IF8udXJsUGFyYW1zKF8uZXh0cmFjdFBhcmFtU3RyaW5nKHJlbFVybCkpO1xyXG4gICAgaGFzaE1hcFtjb25zdHMoJ0hBU0hfS0VZX1RPUElDJyldID0gXy5zdHJpcFBhcmFtKHJlbFVybCk7XHJcbiAgICBoYXNoTWFwW2NvbnN0cygnSEFTSF9LRVlfVUlNT0RFJyldID0gbnVsbDtcclxuICAgIGxldCBoYXNoID0gYCMke18ubWFwVG9FbmNvZGVkU3RyaW5nKGhhc2hNYXApfWA7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQubG9jYXRpb24ucmVwbGFjZShgJHtyb290VXJsfSR7cXVlcnl9JHtoYXNofWApO1xyXG4gIH1cclxufTtcclxuICIsIlxyXG4vLyB0byBzdXBwb3J0IG9sZCBicm93c2VyXHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltID09IG51bGwpIHtcclxuICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICB9O1xyXG59XHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltU3RhcnQgPT0gbnVsbCkge1xyXG4gIFN0cmluZy5wcm90b3R5cGUudHJpbVN0YXJ0ID0gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdFxyXG59XHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltRW5kID09IG51bGwpIHtcclxuICBTdHJpbmcucHJvdG90eXBlLnRyaW1FbmQgPSBTdHJpbmcucHJvdG90eXBlLnRyaW1SaWdodFxyXG59XHJcbiIsIi8vR3VuamFuXHJcbmlmIChnbG9iYWwucmggPT09IHVuZGVmaW5lZCkge1xyXG4gIGdsb2JhbC5yaCA9IHt9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5yaFxyXG4iLCJyZXF1aXJlKFwiLi4vbGliL3JoXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy91dGlscy9zaGltXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC90b3BpYy91cmxfdXRpbHNcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL3JvYm9oZWxwL3RvcGljL3RvcGljX2V2ZW50c1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvcm9ib2hlbHAvdG9waWMvcGhvbmVnYXBcIilcclxucmVxdWlyZShcIi4vdG9waWMvaW5pdFwiKVxyXG5yZXF1aXJlKFwiLi90b3BpYy93aWRnZXRzL2Ryb3Bkb3duX3RleHRcIilcclxucmVxdWlyZShcIi4vdG9waWMvd2lkZ2V0cy9leHBhbmRpbmdfdGV4dFwiKVxyXG5yZXF1aXJlKFwiLi90b3BpYy93aWRnZXRzL3BvcG92ZXJcIilcclxucmVxdWlyZShcIi4vdG9waWMvd2lkZ2V0cy9oeXBlcmxpbmtfcG9wb3ZlclwiKVxyXG5yZXF1aXJlKFwiLi90b3BpYy93aWRnZXRzL3RleHRfcG9wb3ZlclwiKVxyXG5yZXF1aXJlKFwiLi90b3BpYy93aWRnZXRzL3RyaWdnZXJcIilcclxucmVxdWlyZShcIi4vdG9waWMvaGlnaGxpZ2h0XCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC90b3BpYy90b3BpY19ldmVudHNcIilcclxuIiwibGV0IHJoID0gcmVxdWlyZShcIi4uLy4uL2xpYi9yaFwiKVxyXG5sZXQgXyA9IHJoLl9cclxubGV0ICQgPSByaC4kXHJcblxyXG5fLnJlbW92ZUhpZ2hsaWdodCA9ICgpID0+IHtcclxuICBsZXQgJGJvZHkgPSAkKCdib2R5JywgMClcclxuICBsZXQgJGhpZ2hsaWdodF9lbGVtZW50cyA9ICQuZmluZCgkYm9keSwgJ3NwYW5bZGF0YS1oaWdobGlnaHRdJykgfHwgW11cclxuICBfLmVhY2goJGhpZ2hsaWdodF9lbGVtZW50cywgKG5vZGUpID0+IHtcclxuICAgICQucmVtb3ZlQXR0cmlidXRlKG5vZGUsICdzdHlsZScpXHJcbiAgfSlcclxufVxyXG5cclxucmgubW9kZWwuY3N1YnNjcmliZSgnRVZUX1JFTU9WRV9ISUdITElHSFQnLCBfLnJlbW92ZUhpZ2hsaWdodClcclxuXHJcbiIsImxldCByaCA9IHJlcXVpcmUoXCIuLi8uLi9saWIvcmhcIik7XHJcbmxldCBfID0gcmguXztcclxubGV0IGNvbnN0cyA9IHJoLmNvbnN0cztcclxubGV0ICQgPSByaC4kO1xyXG5sZXQgbW9kZWwgPSByaC5tb2RlbDtcclxubGV0IEV2ZW50SGFuZGxlcnMsIGVIYW5kbGVycywgcmVnaXN0ZXJlZEV2ZW50cztcclxuXHJcbl8ub25Ub3BpY0xvYWQgPSAoKSA9PiB7XHJcbiAgbGV0IHBhcmFtc1N0ciA9IF8uZXh0cmFjdFBhcmFtU3RyaW5nKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpO1xyXG4gIGxldCBwYXJhbXNNYXAgPSBfLnVybFBhcmFtcyhwYXJhbXNTdHIpO1xyXG4gIGxldCByZWRpcmVjdGF0dHIgPSBjb25zdHMoJ1JIX0ZVTExfTEFZT1VUX1BBUkFNJyk7XHJcbiAgaWYgKHJlZGlyZWN0YXR0ciBpbiBwYXJhbXNNYXApIHtcclxuICAgIF8uYWRkUHJvamVjdERhdGEoXy5nb1RvRnVsbExheW91dClcclxuICB9XHJcbiAgZWxzZXtcclxuICAgIF8uYWRkR29Ub0xheW91dCgpO1xyXG4gICAgXy5yZW1vdmVfY2J0KCk7XHJcbiAgfVxyXG59O1xyXG5cclxuXy5yZW1vdmVfY2J0ID0gKCkgPT57XHJcbiAgbGV0ICRib2R5ID0gJCgnYm9keScsMCk7XHJcbiAgbGV0ICRjYnRfZWxlbWVudHMgPSAkLmZpbmQoJGJvZHksICdbZGF0YS1yaHRhZ3NdJyk7XHJcbiAgaWYoJGNidF9lbGVtZW50cyl7XHJcbiAgICBfLmVhY2goJGNidF9lbGVtZW50cywgKG5vZGUpID0+e1xyXG4gICAgICAkLnJlbW92ZUNsYXNzKG5vZGUsICdyaC1oaWRlJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5fLmdldFJlbGF0aXZlVG9waWNQYXRoID0gKCkgPT4ge1xyXG4gIGxldCBwYXRoID0gXy5tYWtlUmVsYXRpdmVVcmwoXy5nZXRSb290VXJsKCksIF8uZmlsZVBhdGgoKSk7XHJcbiAgbGV0IGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xyXG4gIHJldHVybiBpbmRleCAhPT0gLTEgPyBfLnBhcmVudFBhdGgocGF0aCkgOiBcIlwiO1xyXG59XHJcblxyXG5fLmFkZExheW91dEhUTUwgPSAoKSA9PntcclxuXHJcbiAgbW9kZWwuc3Vic2NyaWJlT25jZShbY29uc3RzKCdLRVlfSEVBREVSX0hUTUwnKV0sICgpID0+IHtcclxuICAgIGxldCBmb3JtYXQgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfSEVBREVSX0hUTUwnKSk7XHJcblxyXG4gICAgaWYoZm9ybWF0ICYmIGZvcm1hdCAhPT0gXCJcIil7XHJcblxyXG4gICAgICBtb2RlbC5zdWJzY3JpYmVPbmNlKFtjb25zdHMoJ0tFWV9IRUFERVJfVElUTEUnKSwgY29uc3RzKCdLRVlfTE5HJyldLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHRpdGxlID0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX0hFQURFUl9USVRMRScpKTtcclxuICAgICAgICBsZXQgbGFiZWwgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfTE5HJykpLlNob3dUb3BpY0luQ29udGV4dDtcclxuICAgICAgICBsYWJlbCA9IGxhYmVsID8gbGFiZWwgOiBcIkNsaWNrIGhlcmUgdG8gc2VlIHRoaXMgcGFnZSBpbiBmdWxsIGNvbnRleHRcIjtcclxuICAgICAgICBsZXQgdG9vbHRpcCA9IGxhYmVsO1xyXG4gICAgICAgIGxldCBsb2dvID0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX0hFQURFUl9MT0dPX1BBVEgnKSk7XHJcbiAgICAgICAgbG9nbyA9IF8uZ2V0UmVsYXRpdmVUb3BpY1BhdGgoKSArIGxvZ287XHJcbiAgICAgICAgbGV0IGh0bWwgPSBfLnJlc29sdmVFbmNsb3NlZFZhcihmb3JtYXQsICh2YXJpYWJsZSkgPT4ge1xyXG4gICAgICAgICAgaWYodmFyaWFibGUgPT09IFwibGFiZWxcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhcmlhYmxlID09PSBcInRvb2x0aXBcIil7XHJcbiAgICAgICAgICAgIHJldHVybiB0b29sdGlwO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2YXJpYWJsZSA9PT0gXCJ0aXRsZVwiKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRpdGxlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2YXJpYWJsZSA9PT0gXCJsb2dvXCIpe1xyXG4gICAgICAgICAgICByZXR1cm4gbG9nbztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgJGJvZHkgPSAkKCdib2R5JywwKTtcclxuICAgICAgICBsZXQgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgJGRpdi5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICAgICRib2R5Lmluc2VydEJlZm9yZSgkZGl2LCAkYm9keS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5fLmFkZExheW91dENTUyA9ICgpID0+e1xyXG5cclxuICBtb2RlbC5zdWJzY3JpYmVPbmNlKFtjb25zdHMoJ0tFWV9IRUFERVJfQ1NTJyldLCAoKSA9PiB7XHJcbiAgICBsZXQgZm9ybWF0ID0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX0hFQURFUl9DU1MnKSk7XHJcblxyXG4gICAgaWYoZm9ybWF0ICYmIGZvcm1hdCAhPT0gXCJcIil7XHJcblxyXG4gICAgICBtb2RlbC5zdWJzY3JpYmVPbmNlKFtjb25zdHMoJ0tFWV9IRUFERVJfTE9HT19QQVRIJyksXHJcbiAgICAgICAgY29uc3RzKCdLRVlfSEVBREVSX1RJVExFX0NPTE9SJyksIGNvbnN0cygnS0VZX0hFQURFUl9CQUNLR1JPVU5EX0NPTE9SJyksIGNvbnN0cygnS0VZX0xBWU9VVF9GT05UX0ZBTUlMWScpXSwgKCkgPT4ge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfSEVBREVSX0JBQ0tHUk9VTkRfQ09MT1InKSk7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yID0gYmFja2dyb3VuZENvbG9yID8gYmFja2dyb3VuZENvbG9yIDogbW9kZWwuZ2V0KGNvbnN0cygnS0VZX0hFQURFUl9ERUZBVUxUX0JBQ0tHUk9VTkRfQ09MT1InKSk7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX0hFQURFUl9USVRMRV9DT0xPUicpKTtcclxuICAgICAgICBjb2xvciA9IGNvbG9yID8gY29sb3IgOiBtb2RlbC5nZXQoY29uc3RzKCdLRVlfSEVBREVSX0RFRkFVTFRfVElUTEVfQ09MT1InKSk7XHJcbiAgICAgICAgbGV0IGZvbnRGYW1pbHkgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfTEFZT1VUX0ZPTlRfRkFNSUxZJykpO1xyXG4gICAgICAgIGZvbnRGYW1pbHkgPSBmb250RmFtaWx5ID8gZm9udEZhbWlseSA6IG1vZGVsLmdldChjb25zdHMoJ0tFWV9MQVlPVVRfREVGQVVMVF9GT05UX0ZBTUlMWScpKTtcclxuICAgICAgICBsZXQgY3NzID0gXy5yZXNvbHZlRW5jbG9zZWRWYXIoZm9ybWF0LCAodmFyaWFibGUpID0+IHtcclxuICAgICAgICAgIGlmKHZhcmlhYmxlID09PSBcImJhY2tncm91bmQtY29sb3JcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2YXJpYWJsZSA9PT0gXCJjb2xvclwiKXtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2YXJpYWJsZSA9PT0gXCJmb250LWZhbWlseVwiKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZvbnRGYW1pbHk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0ICRzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuICAgICAgICAkc3R5bGUudHlwZSA9ICd0ZXh0L2NzcydcclxuICAgICAgICAkc3R5bGUuaW5uZXJIVE1MID0gY3NzO1xyXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoJHN0eWxlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5fLmFkZFByb2plY3REYXRhID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCAoKCkgPT57fSlcclxuICBsZXQgc3JjID0gXy5nZXRSZWxhdGl2ZVRvcGljUGF0aCgpICsgXCJ0ZW1wbGF0ZS9zY3JpcHRzL3Byb2plY3RkYXRhLmpzXCI7XHJcbiAgXy5sb2FkU2NyaXB0KHNyYywgbnVsbCwgY2FsbGJhY2spXHJcbn1cclxuXHJcbl8uYWRkR29Ub0xheW91dCA9ICgpID0+IHtcclxuICBfLmFkZFByb2plY3REYXRhKCk7XHJcbiAgXy5hZGRMYXlvdXRIVE1MKCk7XHJcbiAgXy5hZGRMYXlvdXRDU1MoKTtcclxufTtcclxuXHJcbm1vZGVsLnB1Ymxpc2goY29uc3RzKCdLRVlfU0hBUkVEX0lOUFVUJyksIFtcclxuICBjb25zdHMoJ0tFWV9QUk9KRUNUX1RBR19DT01CSU5BVElPTlMnKSxcclxuICBjb25zdHMoJ0tFWV9UQUdfRVhQUkVTU0lPTicpLFxyXG4gIHtcclxuICAgIGtleTogY29uc3RzKCdFVlRfU0NST0xMX1RPX1RPUCcpLFxyXG4gICAgbmVzdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAgY29uc3RzKCdFVlRfUFJJTlRfVE9QSUMnKSxcclxuICBjb25zdHMoJ0tFWV9NRVJHRURfUFJPSkVDVF9NQVAnKSxcclxuICBjb25zdHMoJ0tFWV9QUk9KRUNUX0xJU1QnKSxcclxuICBjb25zdHMoJ0tFWV9TSE9XX1RBR1MnKSxcclxuICBjb25zdHMoJ0tFWV9JRlJBTUVfRVZFTlRTJyksXHJcbiAgY29uc3RzKCdFVlRfUkVMT0FEX1RPUElDJyksXHJcbiAgY29uc3RzKCdLRVlfTU9CSUxFX0FQUF9NT0RFJyksXHJcbiAgY29uc3RzKCdLRVlfSEVBREVSX0xPR09fUEFUSCcpLFxyXG4gIGNvbnN0cygnS0VZX0hFQURFUl9USVRMRScpLFxyXG4gIGNvbnN0cygnS0VZX0hFQURFUl9USVRMRV9DT0xPUicpLFxyXG4gIGNvbnN0cygnS0VZX0hFQURFUl9CQUNLR1JPVU5EX0NPTE9SJyksXHJcbiAgY29uc3RzKCdLRVlfTEFZT1VUX0ZPTlRfRkFNSUxZJyksXHJcbiAgY29uc3RzKCdLRVlfSEVBREVSX0hUTUwnKSxcclxuICBjb25zdHMoJ0tFWV9IRUFERVJfQ1NTJyksXHJcbiAgY29uc3RzKCdLRVlfSEVBREVSX0RFRkFVTFRfQkFDS0dST1VORF9DT0xPUicpLFxyXG4gIGNvbnN0cygnS0VZX0hFQURFUl9ERUZBVUxUX1RJVExFX0NPTE9SJyksXHJcbiAgY29uc3RzKCdLRVlfTEFZT1VUX0RFRkFVTFRfRk9OVF9GQU1JTFknKSxcclxuICBjb25zdHMoJ0tFWV9UT0NfT1JERVInKSxcclxuICBjb25zdHMoJ0VWVF9DT0xMQVBTRV9BTEwnKSxcclxuICBjb25zdHMoJ0VWVF9FWFBBTkRfQUxMJyksXHJcbiAgY29uc3RzKCdLRVlfU0VBUkNIX0hJR0hMSUdIVF9DT0xPUicpLFxyXG4gIGNvbnN0cygnS0VZX1NFQVJDSF9CR19DT0xPUicpLFxyXG4gIGNvbnN0cygnRVZUX1JFTU9WRV9ISUdITElHSFQnKVxyXG5dKTtcclxuXHJcbm1vZGVsLnB1Ymxpc2goY29uc3RzKCdLRVlfU0hBUkVEX09VVFBVVCcpLCBbXHJcbiAgY29uc3RzKCdLRVlfVE9QSUNfVVJMJyksXHJcbiAgY29uc3RzKCdLRVlfVE9QSUNfSUQnKSxcclxuICBjb25zdHMoJ0tFWV9UT1BJQ19USVRMRScpLFxyXG4gIGNvbnN0cygnS0VZX1RPUElDX0JSU01BUCcpLFxyXG4gIGNvbnN0cygnU0hPV19NT0RBTCcpLFxyXG4gIGNvbnN0cygnRVZUX05BVklHQVRFX1RPX1VSTCcpLFxyXG4gIGNvbnN0cygnRVZUX0NMSUNLX0lOU0lERV9JRlJBTUUnKSxcclxuICBjb25zdHMoJ0VWVF9TQ1JPTExfSU5TSURFX0lGUkFNRScpLFxyXG4gIGNvbnN0cygnRVZUX0lOU0lERV9JRlJBTUVfRE9NX0NPTlRFTlRMT0FERUQnKSxcclxuICBjb25zdHMoJ0tFWV9UT1BJQ19IRUlHSFQnKSxcclxuICBjb25zdHMoJ0VWVF9UT1BJQ19XSURHRVRfTE9BREVEJyldKTtcclxuXHJcbnJoLmlmcmFtZS5pbml0KCk7XHJcblxyXG5FdmVudEhhbmRsZXJzID0gKCgoKSA9PiB7XHJcbiAgbGV0IGxhc3RTY3JvbGxUb3AsIHB1Ymxpc2hTY3JvbGxJbmZvO1xyXG5cclxuICBjbGFzcyBFdmVudEhhbmRsZXJzIHtcclxuICAgIGhhbmRsZV9jbGljayhldmVudCkge1xyXG4gICAgICBpZiAoIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuICAgICAgICBtb2RlbC5wdWJsaXNoKGNvbnN0cygnRVZUX0NMSUNLX0lOU0lERV9JRlJBTUUnKSwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIF8uaG9va0NsaWNrKGV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZV9zY3JvbGwoKSB7XHJcbiAgICAgIGxldCBjdXJTY3JvbGxUb3AsIGRpcjtcclxuICAgICAgY3VyU2Nyb2xsVG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XHJcbiAgICAgIGlmIChjdXJTY3JvbGxUb3AgPiBsYXN0U2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgZGlyID0gJ2Rvd24nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRpciA9ICd1cCc7XHJcbiAgICAgIH1cclxuICAgICAgbGFzdFNjcm9sbFRvcCA9IGN1clNjcm9sbFRvcDtcclxuICAgICAgcmV0dXJuIHB1Ymxpc2hTY3JvbGxJbmZvKGRpcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsYXN0U2Nyb2xsVG9wID0gLTE7XHJcblxyXG4gIHB1Ymxpc2hTY3JvbGxJbmZvID0gXy50aHJvdHRsZShkaXIgPT4ge1xyXG4gICAgbGV0IGJvZHksIGluZm87XHJcbiAgICBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgIGluZm8gPSB7XHJcbiAgICAgIHNjcm9sbFRvcDogYm9keS5zY3JvbGxUb3AsXHJcbiAgICAgIHNjcm9sbEhlaWdodDogYm9keS5zY3JvbGxIZWlnaHQsXHJcbiAgICAgIGRpclxyXG4gICAgfTtcclxuICAgIHJldHVybiBtb2RlbC5wdWJsaXNoKGNvbnN0cygnRVZUX1NDUk9MTF9JTlNJREVfSUZSQU1FJyksIGluZm8pO1xyXG4gIH0sIDIwMCk7XHJcblxyXG4gIHJldHVybiBFdmVudEhhbmRsZXJzO1xyXG59KSkoKTtcclxuXHJcbmVIYW5kbGVycyA9IG5ldyBFdmVudEhhbmRsZXJzKCk7XHJcblxyXG5yZWdpc3RlcmVkRXZlbnRzID0ge307XHJcblxyXG5tb2RlbC5zdWJzY3JpYmUoY29uc3RzKCdFVlRfV0lER0VUX0xPQURFRCcpLCBfLm9uZSgoKSA9PiB7XHJcbiAgbW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnS0VZX0lGUkFNRV9FVkVOVFMnKSwgb2JqID0+IHtcclxuICAgIGlmIChvYmogPT09IG51bGwpIHtcclxuICAgICAgb2JqID0ge307XHJcbiAgICB9XHJcbiAgICByZXR1cm4gXy5lYWNoKFsnY2xpY2snLCAnc2Nyb2xsJ10sIGVOYW1lID0+IHtcclxuICAgICAgaWYgKG9ialtlTmFtZV0pIHtcclxuICAgICAgICBfLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsIGVOYW1lLCBlSGFuZGxlcnNbYGhhbmRsZV8ke2VOYW1lfWBdKTtcclxuICAgICAgICByZWdpc3RlcmVkRXZlbnRzW2VOYW1lXSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVnaXN0ZXJlZEV2ZW50c1tlTmFtZV0pIHtcclxuICAgICAgICBfLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsIGVOYW1lLCBlSGFuZGxlcnNbYGhhbmRsZV8ke2VOYW1lfWBdKTtcclxuICAgICAgICByZWdpc3RlcmVkRXZlbnRzW2VOYW1lXSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gXy5kZWxheSgoKSA9PiBtb2RlbC5wdWJsaXNoKGNvbnN0cygnS0VZX1RPUElDX0hFSUdIVCcpLCAkLnBhZ2VIZWlnaHQoKSksIDEwMCk7XHJcbn0pKTtcclxuXHJcbm1vZGVsLnN1YnNjcmliZU9uY2UoW3JoLmNvbnN0cygnS0VZX1RPQ19PUkRFUicpLCByaC5jb25zdHMoJ0VWVF9QUk9KRUNUX0xPQURFRCcpXSwgKCkgPT4ge1xyXG4gIGxldCBvcmRlckRhdGEgPSByaC5tb2RlbC5nZXQocmguY29uc3RzKCdLRVlfVE9DX09SREVSJykpXHJcbiAgbGV0IHVybCA9IHJoLl8ucGFyZW50UGF0aChyaC5fLmZpbGVQYXRoKCkuc3Vic3RyaW5nKHJoLl8uZ2V0SG9zdEZvbGRlcigpLmxlbmd0aCkpXHJcbiAgdXJsID0gKHVybC5sZW5ndGggJiYgdXJsW3VybC5sZW5ndGgtMV0gPT09ICcvJykgPyB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGgtMSkgOiB1cmxcclxuICB3aGlsZShvcmRlckRhdGFbdXJsXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB1cmwgPSAgdXJsLnN1YnN0cmluZygwLCB1cmwubGFzdEluZGV4T2YoJy8nKSlcclxuICB9XHJcbiAgbGV0IG9yZGVyID0gdXJsICYmIG9yZGVyRGF0YVt1cmxdLm9yZGVyXHJcbiAgcmgubW9kZWwucHVibGlzaChyaC5jb25zdHMoJ0tFWV9UT0NfQ0hJTERfT1JERVInKSwgb3JkZXIpXHJcbn0pO1xyXG5cclxubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnRVZUX1JFTE9BRF9UT1BJQycpLCAoKSA9PiBkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKSk7XHJcblxyXG5tb2RlbC5zdWJzY3JpYmVPbmNlKFtjb25zdHMoJ0VWVF9XSU5ET1dfTE9BREVEJyksIGNvbnN0cygnS0VZX1RBR19FWFBSRVNTSU9OJyksIGNvbnN0cygnS0VZX1RPUElDX09SSUdJTicpXSxcclxuICAoKSA9PiBfLmRlZmVyKCgpID0+IHtcclxuICAgIGxldCBib29rbWFyayA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2g7XHJcbiAgICBpZiAoYm9va21hcmsgIT09IHVuZGVmaW5lZCAmJiBib29rbWFyayAhPT0gXCJcIiAmJiBib29rbWFyayAhPT0gXCIjXCIpe1xyXG4gICAgICBsZXQgYm9va21hcmtfbmFtZSA9IGJvb2ttYXJrLnN1YnN0cmluZygxKTtcclxuICAgICAgbGV0ICRlbGVtZW50cyA9IChyaC4kKGJvb2ttYXJrK1wiLGFbbmFtZT1cIiArIGJvb2ttYXJrX25hbWUgK1wiXVwiKSk7XHJcbiAgICAgIGlmKCRlbGVtZW50cy5sZW5ndGggPiAwKXtcclxuICAgICAgICAkZWxlbWVudHNbMF0uc2Nyb2xsSW50b1ZpZXcodHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4pO1xyXG5cclxubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnS0VZX1RPUElDX0hFSUdIVCcpLCAoKSA9PiB7XHJcbiAgXy5kZWxheSgoKSA9PiB7XHJcbiAgICBtb2RlbC5wdWJsaXNoKGNvbnN0cygnRVZUX1dJTkRPV19MT0FERUQnKSwgbnVsbClcclxuICB9LCAxMDAwKVxyXG5cclxufSk7XHJcblxyXG5fLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICdET01Db250ZW50TG9hZGVkJywgKCkgPT4gbW9kZWwucHVibGlzaChjb25zdHMoJ0VWVF9JTlNJREVfSUZSQU1FX0RPTV9DT05URU5UTE9BREVEJyksIG51bGwpKTtcclxuXHJcbl8uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdyZXNpemUnLCAoKCgpID0+IHtcclxuICBsZXQgdHJpZ2dlcmVkQnlNZTtcclxuICB0cmlnZ2VyZWRCeU1lID0gZmFsc2U7XHJcbiAgcmV0dXJuIF8uZGVib3VuY2UoKCkgPT4ge1xyXG4gICAgbGV0IGhlaWdodDtcclxuICAgIGlmICh0cmlnZ2VyZWRCeU1lKSB7XHJcbiAgICAgIHRyaWdnZXJlZEJ5TWUgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuIHRyaWdnZXJlZEJ5TWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoZWlnaHQgPSAkLnBhZ2VIZWlnaHQoKTtcclxuICAgICAgaWYgKGhlaWdodCAhPT0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX1RPUElDX0hFSUdIVCcpKSkge1xyXG4gICAgICAgIHRyaWdnZXJlZEJ5TWUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBtb2RlbC5wdWJsaXNoKGNvbnN0cygnS0VZX1RPUElDX0hFSUdIVCcpLCAkLnBhZ2VIZWlnaHQoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCAyNTApO1xyXG59KSkoKSk7XHJcbiIsImxldCByaCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9saWIvcmhcIiksXHJcbiAgJCA9IHJoLiQsXHJcbiAgXyA9IHJoLl9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyb3Bkb3duVGV4dCBleHRlbmRzIHJoLldpZGdldCB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcpXHJcbiAgICB0aGlzLmNvbnRlbnRDbGFzcyA9ICdkcm9wZG93bi1jb250ZW50J1xyXG4gICAgdGhpcy50aXRsZUNsYXNzID0gJ2Ryb3Bkb3duLXRpdGxlJ1xyXG4gICAgdGhpcy5pbml0Tm9kZXMoKVxyXG4gIH1cclxuXHJcbiAgaW5pdE5vZGVzKCkge1xyXG4gICAgbGV0IGNvbnRlbnROb2RlcyA9IFtdXHJcbiAgICAkLmVhY2hDaGlsZE5vZGUodGhpcy5ub2RlLCBjaGlsZCA9PiB7XHJcbiAgICAgIGlmKCQuaGFzQ2xhc3MoY2hpbGQsIHRoaXMuY29udGVudENsYXNzKSkge1xyXG4gICAgICAgIGNvbnRlbnROb2Rlcy5wdXNoKGNoaWxkKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgbGV0IG5vZGVIb2xkZXIgPSBuZXcgcmguTm9kZUhvbGRlcihjb250ZW50Tm9kZXMpXHJcbiAgICBub2RlSG9sZGVyLmhpZGUoKVxyXG4gICAgJC5lYWNoQ2hpbGROb2RlKHRoaXMubm9kZSwgY2hpbGQgPT4ge1xyXG4gICAgICBpZigkLmhhc0NsYXNzKGNoaWxkLCB0aGlzLnRpdGxlQ2xhc3MpKSB7XHJcbiAgICAgICAgXy5hZGRFdmVudExpc3RlbmVyKGNoaWxkLCAnY2xpY2snLCBldnQgPT4ge1xyXG4gICAgICAgICAgaWYoIWV2dC5kZWZhdWx0UHJldmVudGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlU3RhdGUobm9kZUhvbGRlcilcclxuICAgICAgICAgICAgcmV0dXJuIF8ucHJldmVudERlZmF1bHQoZXZ0KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgcmgubW9kZWwuY3N1YnNjcmliZSgnRVZUX0NPTExBUFNFX0FMTCcsICgpID0+IHtcclxuICAgICAgdGhpcy5oaWRlKG5vZGVIb2xkZXIpXHJcbiAgICB9KVxyXG5cclxuICAgIHJoLm1vZGVsLmNzdWJzY3JpYmUoJ0VWVF9FWFBBTkRfQUxMJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnNob3cobm9kZUhvbGRlcilcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBoaWRlKG5vZGVIb2xkZXIpIHtcclxuICAgICQucmVtb3ZlQ2xhc3ModGhpcy5ub2RlLCAnZXhwYW5kZWQnKVxyXG4gICAgbm9kZUhvbGRlci5oaWRlKClcclxuICB9XHJcblxyXG4gIHNob3cobm9kZUhvbGRlcikge1xyXG4gICAgaWYoISQuaGFzQ2xhc3ModGhpcy5ub2RlLCAnZXhwYW5kZWQnKSkge1xyXG4gICAgICAkLmFkZENsYXNzKHRoaXMubm9kZSwgJ2V4cGFuZGVkJylcclxuICAgIH1cclxuICAgIG5vZGVIb2xkZXIuc2hvdygpXHJcbiAgfVxyXG5cclxuICB0b2dnbGVTdGF0ZShub2RlSG9sZGVyKSB7XHJcbiAgICBpZigkLmhhc0NsYXNzKHRoaXMubm9kZSwgJ2V4cGFuZGVkJykpIHtcclxuICAgICAgdGhpcy5oaWRlKG5vZGVIb2xkZXIpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3cobm9kZUhvbGRlcilcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbnJoLndpZGdldHMuRHJvcGRvd25UZXh0ID0gRHJvcGRvd25UZXh0XHJcbiIsImltcG9ydCByaCBmcm9tICcuLi8uLi8uLi9saWIvcmgnXHJcbmltcG9ydCBEcm9wZG93blRleHQgZnJvbSAnLi9kcm9wZG93bl90ZXh0J1xyXG5cclxuY2xhc3MgRXhwYW5kaW5nVGV4dCBleHRlbmRzIERyb3Bkb3duVGV4dCB7XHJcbiAgaW5pdE5vZGVzKCkge1xyXG4gICAgdGhpcy5jb250ZW50Q2xhc3MgPSAnZXhwYW5kaW5nLWNvbnRlbnQnXHJcbiAgICB0aGlzLnRpdGxlQ2xhc3MgPSAnZXhwYW5kaW5nLXRpdGxlJ1xyXG4gICAgc3VwZXIuaW5pdE5vZGVzKClcclxuICB9XHJcbn1cclxuXHJcbnJoLndpZGdldHMuRXhwYW5kaW5nVGV4dCA9IEV4cGFuZGluZ1RleHRcclxuIiwibGV0IHJoID0gcmVxdWlyZShcIi4uLy4uLy4uL2xpYi9yaFwiKSxcclxuICBub2RlVXRpbHMgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvbm9kZV91dGlsc1wiKSxcclxuICAkID0gcmguJCxcclxuICBfID0gcmguXyxcclxuICBpbnN0YW5jZUNvdW50ID0gMFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHlwZXJsaW5rUG9wb3ZlciBleHRlbmRzIHJoLldpZGdldCB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcpXHJcbiAgICBpbnN0YW5jZUNvdW50ID0gaW5zdGFuY2VDb3VudCArIDFcclxuICAgIF8uYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm5vZGUsICdjbGljaycsIGV2dCA9PiB7XHJcbiAgICAgIHRoaXMuc2hvd1BvcG92ZXIoKVxyXG4gICAgICByZXR1cm4gXy5wcmV2ZW50RGVmYXVsdChldnQpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZ2V0IGh5cGVybGluaygpIHtcclxuICAgIHJldHVybiAkLmdldEF0dHJpYnV0ZSh0aGlzLm5vZGUsICdocmVmJylcclxuICB9XHJcblxyXG4gIGdldCBpZnJhbWVJRCgpIHtcclxuICAgIHJldHVybiBgUmhQb3BvdmVySWZyYW1lJHtpbnN0YW5jZUNvdW50fWBcclxuICB9XHJcblxyXG4gIGNyZWF0ZVBvcHVwTm9kZSgpIHtcclxuICAgIGxldCBub2RlID0gJC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgJC5hZGRDbGFzcyhub2RlLCAncmgtcG9wb3ZlcicpXHJcbiAgICAkLmRhdGFzZXQobm9kZSwgJ2hlaWdodCcsICQuZGF0YXNldCh0aGlzLm5vZGUsICdoZWlnaHQnKSlcclxuICAgICQuZGF0YXNldChub2RlLCAnd2lkdGgnLCAkLmRhdGFzZXQodGhpcy5ub2RlLCAnd2lkdGgnKSlcclxuICAgICQuZGF0YXNldChub2RlLCAncGxhY2VtZW50JywgJC5kYXRhc2V0KHRoaXMubm9kZSwgJ3BsYWNlbWVudCcpKVxyXG5cclxuICAgIG5vZGUuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJyaC1wb3BvdmVyLWNvbnRlbnRcIj5cclxuICAgICAgPGlmcmFtZSBjbGFzcz1cInBvcG92ZXItdG9waWNcIiBpZD1cIiR7dGhpcy5pZnJhbWVJRH1cIiBzcmM9XCIke3RoaXMuaHlwZXJsaW5rfVwiIGZyYW1lYm9yZGVyPVwiMFwiIHNjcm9sbGluZz1cImF1dG9cIlxyXG4gICAgICBvbmxvYWQ9XCJyaC5fLnJlc2V0SWZyYW1lU2l6ZSgnIyR7dGhpcy5pZnJhbWVJRH0nKVwiID48L2lmcmFtZT5cclxuICAgIDwvZGl2PmBcclxuICAgIHJldHVybiBub2RlXHJcbiAgfVxyXG5cclxuICBzaG93UG9wb3ZlcigpIHtcclxuICAgIGxldCBub2RlID0gdGhpcy5jcmVhdGVQb3B1cE5vZGUoKVxyXG4gICAgbm9kZVV0aWxzLmFwcGVuZENoaWxkKGRvY3VtZW50LmJvZHksIG5vZGUpO1xyXG4gICAgdGhpcy5wb3BvdmVyV2lkZ2V0ID0gbmV3IHJoLndpZGdldHMuUG9wb3Zlcih7bm9kZTogbm9kZX0pXHJcbiAgICB0aGlzLnBvcG92ZXJXaWRnZXQuaW5pdCgpXHJcbiAgICB0aGlzLnBvcG92ZXJXaWRnZXQuaW5pdFBvc2l0aW9uKHRoaXMubm9kZSlcclxuICB9XHJcbn1cclxuXHJcbnJoLndpZGdldHMuSHlwZXJsaW5rUG9wb3ZlciA9IEh5cGVybGlua1BvcG92ZXJcclxuIiwibGV0IHJoID0gcmVxdWlyZShcIi4uLy4uLy4uL2xpYi9yaFwiKSxcclxuICBub2RlVXRpbHMgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvbm9kZV91dGlsc1wiKSxcclxuICBwYWdlVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9wYWdlX3V0aWxzXCIpLFxyXG4gIF8gPSByaC5fLFxyXG4gICQgPSByaC4kXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3BvdmVyIGV4dGVuZHMgcmguV2lkZ2V0IHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgIHN1cGVyKGNvbmZpZylcclxuICAgIHRoaXMucGxhY2VtZW50ID0gJC5kYXRhc2V0KHRoaXMubm9kZSwgJ3BsYWNlbWVudCcpXHJcbiAgICB0aGlzLmhlaWdodCA9IF8ucGFyc2VJbnQoJC5kYXRhc2V0KHRoaXMubm9kZSwgJ2hlaWdodCcpLCAzMDApXHJcbiAgICB0aGlzLndpZHRoID0gXy5wYXJzZUludCgkLmRhdGFzZXQodGhpcy5ub2RlLCAnd2lkdGgnKSwgNDAwKVxyXG5cclxuICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICB0aGlzLmhhbmRsZUNsaWNrID0gZXZ0ID0+IHRoaXMuX2hhbmRsZUNsaWNrKGV2dClcclxuICAgICAgXy5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LCAnY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrKVxyXG4gICAgfSwgMjUwKVxyXG4gIH1cclxuXHJcbiAgZGVzdHJ1Y3QoKSB7XHJcbiAgICBfLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spXHJcbiAgICBzdXBlci5kZXN0cnVjdCgpXHJcbiAgICBub2RlVXRpbHMucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKVxyXG4gIH1cclxuXHJcbiAgaW5pdFBvc2l0aW9uKHRhcmdldCkge1xyXG4gICAgbGV0IHJlY3QgPSB0YXJnZXQgJiYgdGFyZ2V0LmdldENsaWVudFJlY3RzKClbMF1cclxuICAgIGlmKHJlY3QpIHtcclxuICAgICAgdGhpcy5zZXRQb3NpdGlvbihyZWN0KVxyXG4gICAgICBpZih0aGlzLmhlaWdodCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMud2lkdGgpIHtcclxuICAgICAgICB0aGlzLm5vZGUuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFBvc2l0aW9uKHJlY3QpIHtcclxuICAgIGxldCBwYWdlSGVpZ2h0ID0gcGFnZVV0aWwuaW5uZXJIZWlnaHQoKSwgcGFnZVdpZHRoID0gcGFnZVV0aWwuaW5uZXJXaWR0aCgpXHJcbiAgICBpZih0aGlzLnBsYWNlbWVudCA9PT0gJ3RvcCcpIHtcclxuICAgICAgdGhpcy5zaG93VG9wKHJlY3QsIHBhZ2VIZWlnaHQpXHJcbiAgICAgIHRoaXMuc2V0QXV0b0hvcml6b250YWxQb3NpdGlvbihyZWN0LCBwYWdlV2lkdGgpXHJcbiAgICB9IGVsc2UgaWYodGhpcy5wbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XHJcbiAgICAgIHRoaXMuc2hvd0JvdHRvbShyZWN0KVxyXG4gICAgICB0aGlzLnNldEF1dG9Ib3Jpem9udGFsUG9zaXRpb24ocmVjdCwgcGFnZVdpZHRoKVxyXG4gICAgfSBlbHNlIGlmKHRoaXMucGxhY2VtZW50ID09PSAnbGVmdCcpIHtcclxuICAgICAgdGhpcy5zZXRBdXRvVmVydGljYWxQb3NpdGlvbihyZWN0LCBwYWdlSGVpZ2h0KVxyXG4gICAgICB0aGlzLnNob3dMZWZ0KHJlY3QsIHBhZ2VXaWR0aClcclxuICAgIH0gZWxzZSBpZih0aGlzLnBsYWNlbWVudCA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICB0aGlzLnNldEF1dG9WZXJ0aWNhbFBvc2l0aW9uKHJlY3QsIHBhZ2VIZWlnaHQpXHJcbiAgICAgIHRoaXMuc2hvd1JpZ2h0KHJlY3QpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldEF1dG9Ib3Jpem9udGFsUG9zaXRpb24ocmVjdCwgcGFnZVdpZHRoKVxyXG4gICAgICB0aGlzLnNldEF1dG9WZXJ0aWNhbFBvc2l0aW9uKHJlY3QsIHBhZ2VIZWlnaHQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjYW5TaG93VG9wKHJlY3QpIHtcclxuICAgIHJldHVybiAocmVjdC50b3AgLSB0aGlzLmhlaWdodCkgPiAwXHJcbiAgfVxyXG5cclxuICBjYW5TaG93Qm90dG9tKHJlY3QsIHBhZ2VIZWlnaHQpIHtcclxuICAgIHJldHVybiAocGFnZUhlaWdodCAtIHJlY3QuYm90dG9tIC0gdGhpcy5oZWlnaHQpID4gMFxyXG4gIH1cclxuXHJcbiAgY2FuU2hvd0xlZnQocmVjdCkge1xyXG4gICAgcmV0dXJuIChyZWN0LmxlZnQgLSB0aGlzLndpZHRoKSA+IDBcclxuICB9XHJcblxyXG4gIGNhblNob3dSaWdodChyZWN0LCBwYWdlV2lkdGgpIHtcclxuICAgIHJldHVybiAocGFnZVdpZHRoIC0gcmVjdC5yaWdodCAtIHRoaXMud2lkdGgpID4gMFxyXG4gIH1cclxuXHJcbiAgc2hvd1RvcChyZWN0LCBwYWdlSGVpZ2h0KSB7XHJcbiAgICB0aGlzLm5vZGUuc3R5bGUuYm90dG9tID0gcGFnZUhlaWdodCAtIHJlY3QudG9wICsgMlxyXG4gIH1cclxuXHJcbiAgc2hvd0JvdHRvbShyZWN0KSB7XHJcbiAgICB0aGlzLm5vZGUuc3R5bGUudG9wID0gcmVjdC5ib3R0b21cclxuICB9XHJcblxyXG4gIHNob3dSaWdodChyZWN0KSB7XHJcbiAgICB0aGlzLm5vZGUuc3R5bGUubGVmdCA9IHJlY3QucmlnaHQgKyAyXHJcbiAgfVxyXG5cclxuICBzaG93TGVmdChyZWN0LCBwYWdlV2lkdGgpIHtcclxuICAgIHRoaXMubm9kZS5zdHlsZS5yaWdodCA9IHBhZ2VXaWR0aCAtIHJlY3QubGVmdCArIDJcclxuICB9XHJcblxyXG4gIHNldEF1dG9Ib3Jpem9udGFsUG9zaXRpb24ocmVjdCwgcGFnZVdpZHRoKSB7XHJcbiAgICBpZih0aGlzLmNhblNob3dSaWdodChyZWN0LCBwYWdlV2lkdGgpKSB7XHJcbiAgICAgIHRoaXMuc2hvd1JpZ2h0KHJlY3QpXHJcbiAgICB9IGVsc2UgaWYodGhpcy5jYW5TaG93TGVmdChyZWN0KSkge1xyXG4gICAgICB0aGlzLnNob3dMZWZ0KHJlY3QsIHBhZ2VXaWR0aClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubm9kZS5zdHlsZS5sZWZ0ID0gcGFnZVdpZHRoIC0gdGhpcy53aWR0aCArIDJcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldEF1dG9WZXJ0aWNhbFBvc2l0aW9uKHJlY3QsIHBhZ2VIZWlnaHQpIHtcclxuICAgIGlmKHRoaXMuY2FuU2hvd0JvdHRvbShyZWN0LCBwYWdlSGVpZ2h0KSkge1xyXG4gICAgICB0aGlzLnNob3dCb3R0b20ocmVjdClcclxuICAgIH0gZWxzZSBpZih0aGlzLmNhblNob3dUb3AocmVjdCkpIHtcclxuICAgICAgdGhpcy5zaG93VG9wKHJlY3QsIHBhZ2VIZWlnaHQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5vZGUuc3R5bGUudG9wID0gcGFnZUhlaWdodCAtIHRoaXMuaGVpZ2h0ICsgMlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2hhbmRsZUNsaWNrKGV2dCkge1xyXG4gICAgdGhpcy5kZXN0cnVjdCgpXHJcbiAgICByZXR1cm4gXy5wcmV2ZW50RGVmYXVsdChldnQpXHJcbiAgfVxyXG59XHJcblxyXG5yaC53aWRnZXRzLlBvcG92ZXIgPSBQb3BvdmVyXHJcbiIsImxldCByaCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9saWIvcmhcIiksXHJcbiAgbm9kZVV0aWxzID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL25vZGVfdXRpbHNcIiksXHJcbiAgJCA9IHJoLiQsXHJcbiAgXyA9IHJoLl8sXHJcbiAgaW5zdGFuY2VDb3VudCA9IDBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRQb3BPdmVyIGV4dGVuZHMgcmguV2lkZ2V0IHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgIHN1cGVyKGNvbmZpZylcclxuICAgIGluc3RhbmNlQ291bnQgPSBpbnN0YW5jZUNvdW50ICsgMVxyXG4gICAgXy5hZGRFdmVudExpc3RlbmVyKHRoaXMubm9kZSwgJ2NsaWNrJywgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5zaG93UG9wb3ZlcigpXHJcbiAgICAgIHJldHVybiBfLnByZXZlbnREZWZhdWx0KGV2dClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBnZXQgdGV4dCgpIHtcclxuICAgIHJldHVybiAkLmRhdGFzZXQodGhpcy5ub2RlLCAncG9wb3ZlcnRleHQnKVxyXG4gIH1cclxuXHJcbiAgZ2V0IGNvbnRlbnRJRCgpIHtcclxuICAgIHJldHVybiBgUmgtdGV4dFBvcE92ZXIke2luc3RhbmNlQ291bnR9YFxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUG9wdXBOb2RlKCkge1xyXG4gICAgbGV0IG5vZGUgPSAkLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAkLmFkZENsYXNzKG5vZGUsICdyaC1wb3BvdmVyJylcclxuICAgICQuZGF0YXNldChub2RlLCAnaGVpZ2h0JywgJC5kYXRhc2V0KHRoaXMubm9kZSwgJ2hlaWdodCcpKVxyXG4gICAgJC5kYXRhc2V0KG5vZGUsICd3aWR0aCcsICQuZGF0YXNldCh0aGlzLm5vZGUsICd3aWR0aCcpKVxyXG4gICAgJC5kYXRhc2V0KG5vZGUsICdwbGFjZW1lbnQnLCAkLmRhdGFzZXQodGhpcy5ub2RlLCAncGxhY2VtZW50JykpXHJcblxyXG4gICAgbm9kZS5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cInJoLXBvcG92ZXItY29udGVudFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicG9wb3Zlci10ZXh0XCIgaWQ9XCIke3RoaXMuY29udGVudElEfVwiPiR7dGhpcy50ZXh0fTwvZGl2PlxyXG4gICAgPC9kaXY+YFxyXG4gICAgcmV0dXJuIG5vZGVcclxuICB9XHJcblxyXG4gIHNob3dQb3BvdmVyKCkge1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzLmNyZWF0ZVBvcHVwTm9kZSgpXHJcbiAgICBub2RlVXRpbHMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuYm9keSwgbm9kZSk7XHJcbiAgICB0aGlzLnBvcG92ZXJXaWRnZXQgPSBuZXcgcmgud2lkZ2V0cy5Qb3BvdmVyKHtub2RlOiBub2RlfSlcclxuICAgIHRoaXMucG9wb3ZlcldpZGdldC5pbml0KClcclxuICAgIHRoaXMucG9wb3ZlcldpZGdldC5pbml0UG9zaXRpb24odGhpcy5ub2RlKVxyXG4gIH1cclxufVxyXG5cclxucmgud2lkZ2V0cy5UZXh0UG9wT3ZlciA9IFRleHRQb3BPdmVyXHJcblxyXG4vKjxhIGRhdGEtcmh3aWRnZXQ9XCJUZXh0UG9wT3ZlclwiIGRhdGEtcG9wb3ZlcnRleHQ9XCJ0aGlzIGlzIGRlZmluaXRpb25cIiBocmVmPVwiI1wiPiB0ZXJtIDwvYT4gKi8iLCJsZXQgcmggPSByZXF1aXJlKFwiLi4vLi4vLi4vbGliL3JoXCIpLFxyXG4gICQgPSByaC4kLFxyXG4gIF8gPSByaC5fXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlnZ2VyIGV4dGVuZHMgcmguV2lkZ2V0IHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgIHN1cGVyKGNvbmZpZylcclxuICAgIHRoaXMuaW5pdFRhcmdldHMoKVxyXG4gIH1cclxuXHJcbiAgZ2V0VGFyZ2V0Tm9kZXMoKSB7XHJcbiAgICBsZXQgdGFyZ2V0TmFtZXMgPSBfLnNwbGl0QW5kVHJpbSgkLmRhdGFzZXQodGhpcy5ub2RlLCAndGFyZ2V0JyksICcgJylcclxuICAgIGxldCB0YXJnZXROb2RlcyA9IFtdXHJcbiAgICBfLmVhY2godGFyZ2V0TmFtZXMsIHRhcmdldE5hbWUgPT4ge1xyXG4gICAgICBsZXQgbm9kZXMgPSAkLmZpbmQoZG9jdW1lbnQsIGBbZGF0YS10YXJnZXRuYW1lPVwiJHt0YXJnZXROYW1lfVwiXWApXHJcbiAgICAgIF8uZWFjaChub2Rlcywgbm9kZSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0Tm9kZXMucHVzaChub2RlKVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICAgIHJldHVybiB0YXJnZXROb2Rlc1xyXG4gIH1cclxuXHJcbiAgaW5pdFRhcmdldHMoKSAge1xyXG4gICAgbGV0IHRhcmdldE5vZGVzID0gdGhpcy5nZXRUYXJnZXROb2RlcygpXHJcbiAgICBfLmVhY2godGFyZ2V0Tm9kZXMsIG5vZGUgPT4ge1xyXG4gICAgICBpZighJC5kYXRhc2V0KG5vZGUsICd0YXJnZXRzZXQnKSkge1xyXG4gICAgICAgICQuZGF0YXNldChub2RlLCAndGFyZ2V0c2V0JywgdHJ1ZSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIGxldCBub2RlSG9sZGVyID0gbmV3IHJoLk5vZGVIb2xkZXIodGFyZ2V0Tm9kZXMpXHJcbiAgICBub2RlSG9sZGVyLmhpZGUoKVxyXG4gICAgXy5hZGRFdmVudExpc3RlbmVyKHRoaXMubm9kZSwgJ2NsaWNrJywgZXZ0ID0+IHtcclxuICAgICAgaWYoIWV2dC5kZWZhdWx0UHJldmVudGVkKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVTdGF0ZShub2RlSG9sZGVyKVxyXG4gICAgICAgIHJldHVybiBfLnByZXZlbnREZWZhdWx0KGV2dClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJoLm1vZGVsLmNzdWJzY3JpYmUoJ0VWVF9DT0xMQVBTRV9BTEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuaGlkZShub2RlSG9sZGVyKVxyXG4gICAgfSlcclxuXHJcbiAgICByaC5tb2RlbC5jc3Vic2NyaWJlKCdFVlRfRVhQQU5EX0FMTCcsICgpID0+IHtcclxuICAgICAgdGhpcy5zaG93KG5vZGVIb2xkZXIpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaGlkZShub2RlSG9sZGVyKSB7XHJcbiAgICAkLnJlbW92ZUNsYXNzKHRoaXMubm9kZSwgJ3ByZXNzZWQnKVxyXG4gICAgbm9kZUhvbGRlci5oaWRlKClcclxuICAgIG5vZGVIb2xkZXIudXBkYXRlQ2xhc3MoW10pXHJcbiAgfVxyXG5cclxuICBzaG93KG5vZGVIb2xkZXIpIHtcclxuICAgIGlmKCEkLmhhc0NsYXNzKHRoaXMubm9kZSwgJ3ByZXNzZWQnKSkge1xyXG4gICAgICAkLmFkZENsYXNzKHRoaXMubm9kZSwgJ3ByZXNzZWQnKVxyXG4gICAgfVxyXG4gICAgbm9kZUhvbGRlci5zaG93KClcclxuICAgIG5vZGVIb2xkZXIudXBkYXRlQ2xhc3MoWydzaG93J10pXHJcbiAgfVxyXG5cclxuICB0b2dnbGVTdGF0ZShub2RlSG9sZGVyKSB7XHJcbiAgICBpZigkLmhhc0NsYXNzKHRoaXMubm9kZSwgJ3ByZXNzZWQnKSkge1xyXG4gICAgICB0aGlzLmhpZGUobm9kZUhvbGRlcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hvdyhub2RlSG9sZGVyKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxucmgud2lkZ2V0cy5UcmlnZ2VyID0gVHJpZ2dlclxyXG5yaC53aWRnZXRzLkRyb3BTcG90ID0gVHJpZ2dlclxyXG5yaC53aWRnZXRzLkV4cGFuZFNwb3QgPSBUcmlnZ2VyXHJcbiIsImxldCByaCA9IHJlcXVpcmUoXCIuLi8uLi9saWIvcmhcIilcclxubGV0ICQgPSByaC4kXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBub2RlVHlwZToge1xyXG4gICAgRUxFTUVOVF9OT0RFOiAxLFxyXG4gICAgQVRUUklCVVRFX05PREU6IDIsXHJcbiAgICBURVhUX05PREU6IDMsXHJcbiAgICBDREFUQV9TRUNUSU9OX05PREU6IDQsXHJcbiAgICBFTlRJVFlfUkVGRVJFTkNFX05PREU6IDUsXHJcbiAgICBFTlRJVFlfTk9ERTogNixcclxuICAgIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERTogNyxcclxuICAgIENPTU1FTlRfTk9ERTogOCxcclxuICAgIERPQ1VNRU5UX05PREU6IDksXHJcbiAgICBET0NVTUVOVF9UWVBFX05PREU6IDEwLFxyXG4gICAgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTogMTEsXHJcbiAgICBOT1RBVElPTl9OT0RFOiAxMlxyXG4gIH0sXHJcblxyXG4gIHJlbW92ZUNoaWxkKG5vZGUsIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZShub2RlKSkge1xyXG4gICAgcmV0dXJuIHBhcmVudCAmJiBwYXJlbnQucmVtb3ZlQ2hpbGQgJiYgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpXHJcbiAgfSxcclxuICBhcHBlbmRDaGlsZChwYXJlbnQsIG5ld05vZGUpIHtcclxuICAgIHJldHVybiBwYXJlbnQgJiYgcGFyZW50LmFwcGVuZENoaWxkICYmIHBhcmVudC5hcHBlbmRDaGlsZChuZXdOb2RlKVxyXG4gIH0sXHJcbiAgcGFyZW50Tm9kZShub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLnBhcmVudE5vZGVcclxuICB9LFxyXG4gIGNoaWxkTm9kZXMobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5jaGlsZE5vZGVzIHx8IFtdXHJcbiAgfSxcclxuICB0b0h0bWxOb2RlKGh0bWwpIHtcclxuICAgIHJldHVybiB0aGlzLmNoaWxkTm9kZXMoJC5jcmVhdGVFbGVtZW50KCdkaXYnLCBodG1sKSlcclxuICB9LFxyXG4gIG91dGVySFRNTChub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLm91dGVySFRNTCB8fCAnJ1xyXG4gIH0sXHJcbiAgaW5zZXJ0QWZ0ZXIobm9kZSwgbmV3Tm9kZSl7XHJcbiAgICByZXR1cm4gbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlLm5leHRTaWJsaW5nKVxyXG4gIH0sXHJcbiAgdmFsdWUobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5ub2RlVmFsdWVcclxuICB9LFxyXG4gIG5hbWUobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5ub2RlTmFtZVxyXG4gIH0sXHJcbiAgdHlwZShub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLm5vZGVUeXBlXHJcbiAgfSxcclxuICBpc0VsZW1lbnROb2RlKG5vZGUpIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGUobm9kZSkgPT09IHRoaXMubm9kZVR5cGUuRUxFTUVOVF9OT0RFXHJcbiAgfSxcclxuICBpc1RleHROb2RlKG5vZGUpIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGUobm9kZSkgPT09IHRoaXMubm9kZVR5cGUuVEVYVF9OT0RFXHJcbiAgfVxyXG59IiwibGV0IHJoID0gcmVxdWlyZShcIi4uLy4uL2xpYi9yaFwiKSxcclxuICBfID0gcmguX1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgaW5uZXJXaWR0aCgpIHtcclxuICAgIGxldCBpbm5lcldpZHRoID0gZ2xvYmFsLmlubmVyV2lkdGhcclxuICAgIGlmKCFfLmlzRGVmaW5lZChpbm5lcldpZHRoKSkge1xyXG4gICAgICBsZXQgY2xpZW50V2lkdGggPSBfLmdldChkb2N1bWVudCwgJ2RvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCcpXHJcbiAgICAgIGNsaWVudFdpZHRoID0gXy5pc0RlZmluZWQoY2xpZW50V2lkdGgpID8gY2xpZW50V2lkdGggOiBfLmdldChkb2N1bWVudCwgJ2JvZHkuY2xpZW50V2lkdGgnKVxyXG4gICAgICBpZihfLmlzRGVmaW5lZChjbGllbnRXaWR0aCkpIHtcclxuICAgICAgICBpbm5lcldpZHRoID0gY2xpZW50V2lkdGhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlubmVyV2lkdGhcclxuXHJcbiAgfSxcclxuICBpbm5lckhlaWdodCgpIHtcclxuICAgIGxldCBpbm5lckhlaWdodCA9IGdsb2JhbC5pbm5lckhlaWdodFxyXG4gICAgaWYoIV8uaXNEZWZpbmVkKGlubmVySGVpZ2h0KSkge1xyXG4gICAgICBsZXQgY2xpZW50SGVpZ2h0ID0gXy5nZXQoZG9jdW1lbnQsICdkb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0JylcclxuICAgICAgY2xpZW50SGVpZ2h0ID0gXy5pc0RlZmluZWQoY2xpZW50SGVpZ2h0KSA/IGNsaWVudEhlaWdodCA6IF8uZ2V0KGRvY3VtZW50LCAnYm9keS5jbGllbnRIZWlnaHQnKVxyXG4gICAgICBpZihfLmlzRGVmaW5lZChjbGllbnRIZWlnaHQpKSB7XHJcbiAgICAgICAgaW5uZXJIZWlnaHQgPSBjbGllbnRIZWlnaHRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlubmVySGVpZ2h0XHJcbiAgfVxyXG59XHJcbiJdfQ==
