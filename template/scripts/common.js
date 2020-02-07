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
var consts = rh.consts;


rh.model.subscribe(consts('EVT_PROJECT_LOADED'), function () {
  return rh.model.subscribe(consts('KEY_MERGED_PROJECT_MAP'), function () {
    var origin = _.getProjectName(_.filePath());
    return rh.model.publish(consts('KEY_TOPIC_ORIGIN'), origin);
  });
});

var ContentFilter = function () {
  var nonTextNodes = undefined;
  ContentFilter = function (_rh$Widget) {
    _inherits(ContentFilter, _rh$Widget);

    _createClass(ContentFilter, [{
      key: 'preventClick',
      value: function preventClick(e) {
        _.preventDefault(e);
        return false;
      }
    }], [{
      key: 'initClass',
      value: function initClass() {

        nonTextNodes = ['IMG', 'OBJECT', 'VIDEO'];
      }
    }]);

    function ContentFilter(config) {
      _classCallCheck(this, ContentFilter);

      var _this = _possibleConstructorReturn(this, (ContentFilter.__proto__ || Object.getPrototypeOf(ContentFilter)).call(this, config));

      _this.onTagExpr = _this.onTagExpr.bind(_this);
      _this.ids = config.ids;
      _this.className = config.className || 'rh-hide';
      _this.node = config.node;
      _this.hoverClass = 'rh-tag-content-hover';
      _this.supClass = 'rh-applied-tag';
      _this.createTagNode();

      if (_this.ids) {
        _this.subscribe(consts('KEY_TOPIC_ORIGIN'), function () {
          return _this.subscribe(consts('KEY_TAG_EXPRESSION'), _this.onTagExpr);
        });
      } else if (rh._debug) {
        rh._d('error', 'data-tags without any tag combination');
      }
      return _this;
    }

    _createClass(ContentFilter, [{
      key: 'onTagExpr',
      value: function onTagExpr(tagExprs) {
        var origin = this.get(consts('KEY_TOPIC_ORIGIN'));
        if (!this.get('tags')) {
          this.tags = _.union(this.ids, function (id) {
            return _.getTags(id, origin);
          });
          this.publish('tags', this.tags.join(','));
        }

        var apply = !_.any(this.ids, function (id) {
          return _.evalTagExpression(id, tagExprs, origin);
        });
        this.toggleClass(apply);
        if (this.className !== 'rh-hide') {
          this.toggleClick(apply);
        }
        return this.applied = apply;
      }
    }, {
      key: 'toggleClass',
      value: function toggleClass(apply) {
        if (apply) {
          if (!this.applied) {
            return $.addClass(this.node, this.className);
          }
        } else {
          return $.removeClass(this.node, this.className);
        }
      }
    }, {
      key: 'toggleClick',
      value: function toggleClick(addEvent) {
        if (addEvent) {
          if (!this.applied) {
            return _.addEventListener(this.node, 'click', this.preventClick);
          }
        } else {
          if (this.applied) {
            return _.removeEventListener(this.node, 'click', this.preventClick);
          }
        }
      }
    }, {
      key: 'onHover',
      value: function onHover() {
        return $.addClass(this.node, this.hoverClass);
      }
    }, {
      key: 'onMouseOut',
      value: function onMouseOut() {
        return $.removeClass(this.node, this.hoverClass);
      }
    }, {
      key: 'appendNode',
      value: function appendNode(supNode) {
        var parentNode = this.node;
        var sibling = null;
        if (nonTextNodes.indexOf(this.node.nodeName) !== -1) {
          parentNode = this.node.parentNode;

          sibling = this.node.nextSibling;
        }
        if (sibling) {
          parentNode.insertBefore(supNode, sibling);
        } else {
          parentNode.appendChild(supNode);
        }
        return this.resolveDataAttrs(supNode);
      }
    }, {
      key: 'getAptNames',
      value: function getAptNames() {
        var _this2 = this;

        return this.subscribe('tags', function () {
          var data = [];
          _.each(_this2.tags, function (current, idx) {
            return data.push(current.replace("att_sep", ":"));
          });
          return _this2.publish('showtags', data.join(','));
        });
      }
    }, {
      key: 'createTagNode',
      value: function createTagNode() {
        var _this3 = this;

        return this.subscribe(consts('KEY_SHOW_TAGS'), function (showTags) {
          if (!showTags || $.find(_this3.node, 'sup.' + _this3.supClass).length > 0) {
            return;
          }
          var supNode = document.createElement('sup');
          _this3.getAptNames();
          $.setAttribute(supNode, 'data-text', 'showtags');
          $.setAttribute(supNode, 'data-mouseover', 'this.onHover()');
          $.setAttribute(supNode, 'data-mouseout', 'this.onMouseOut()');
          $.setAttribute(supNode, 'class', _this3.supClass);
          return _this3.appendNode(supNode);
        });
      }
    }]);

    return ContentFilter;
  }(rh.Widget);
  ContentFilter.initClass();
  return ContentFilter;
}();

window.rh.widgets.ContentFilter = ContentFilter;

},{}],2:[function(require,module,exports){
'use strict';

/*
 Help for Edwidget
*/

var edWidget = window.rh.edWidget;

/*
 Tab edwidget
*/

edWidget('tab', {
  attrs: {
    'data-table': 'data',
    'data-rhwidget': 'Basic',
    'data-output': 'data: edw.data.#{@index}',
    class: 'print-only'
  },
  view: {
    tag: 'div',
    attrs: {
      'data-rhwidget': 'Basic: include: edwidgets/tab/tabLayout.js',
      'data-input': 'data: edw.data.#{@index}'
    },
    model: {
      tab: '0'
    }
  }
});

/*
 Gallary edwidget
*/
//edWidget 'Gallary'

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var $ = rh.$;
var _ = rh._;
var consts = rh.consts;


var Edwidget = function () {
  var valueSeperator = undefined;
  Edwidget = function () {
    _createClass(Edwidget, null, [{
      key: 'initClass',
      value: function initClass() {
        valueSeperator = {
          'data-rhwidget': ';',
          class: ' '
        };
      }
    }]);

    function Edwidget(node, index, arg) {
      _classCallCheck(this, Edwidget);

      this.node = node;
      this.index = index;

      var _parseArg = this.parseArg(arg),
          view = _parseArg.view,
          attrs = _parseArg.attrs,
          model = _parseArg.model,
          argModel = _parseArg.argModel;

      if (attrs) {
        this.setAttributes(this.node, attrs);
      }
      if (model) {
        this.setModelArg(this.node, _.extend({}, model, argModel));
      }
      if (view) {
        this.createView(view, argModel);
      }
    }

    _createClass(Edwidget, [{
      key: 'parseArg',
      value: function parseArg(arg) {
        var argModel = void 0,
            attrs = void 0,
            config = void 0,
            model = void 0,
            view = void 0;
        var wName = arg.wName,
            wArg = arg.wArg,
            pipedArgs = arg.pipedArgs;

        if (config = rh.edWidget(wName)) {
          var vars = void 0;
          var _config = config;
          view = _config.view;
          attrs = _config.attrs;
          vars = _config.vars;
          model = _config.model;

          argModel = _.resolveNiceJSON(pipedArgs.shift());
          this.vars = _.extend({}, vars, wArg);
        }
        return { view: view, attrs: attrs, model: model, argModel: argModel };
      }
    }, {
      key: 'createView',
      value: function createView(view, argModel) {
        var viewModel = _.extend({}, view.model, argModel);
        var viewNode = document.createElement(view.tag || 'div');
        if (view.attrs) {
          this.setAttributes(viewNode, view.attrs);
        }
        this.setModelArg(viewNode, viewModel);
        return this.node.parentNode.insertBefore(viewNode, this.node);
      }
    }, {
      key: 'setAttributes',
      value: function setAttributes(node, attrs) {
        return _.each(attrs, function (value, attr) {
          return $.setAttribute(node, attr, this.resolveValue(this.mergedValue(node, attr, value)));
        }, this);
      }
    }, {
      key: 'setModelArg',
      value: function setModelArg(node, model) {
        if (!_.isEmptyObject(model)) {
          var jsonString = this.resolveValue(JSON.stringify(model));
          return $.dataset(node, 'rhwidget', ($.dataset(node, 'rhwidget') || 'Basic') + ' | ' + jsonString);
        }
      }
    }, {
      key: 'mergedValue',
      value: function mergedValue(node, attrib, value) {
        var oldValue = void 0,
            seperator = void 0;
        if (!(seperator = valueSeperator[attrib])) {
          return value;
        }
        if (oldValue = $.getAttribute(node, attrib) || '') {
          return '' + oldValue + seperator + value;
        } else {
          return value;
        }
      }
    }, {
      key: 'resolveValue',
      value: function resolveValue(value) {
        var _this = this;

        return _.resolveEnclosedVar(value, function (varName) {
          switch (varName) {
            case 'this':
              return JSON.stringify(_this.vars);
            case '@index':
              return _this.index;
            default:
              return _this.vars[varName];
          }
        });
      }
    }]);

    return Edwidget;
  }();
  Edwidget.initClass();
  return Edwidget;
}();

/*
  <div data-edwidget="Tab: <name>: <string value>, <name>: <string value>
   | <json or niceJSON>"></div>
*/

rh.model.subscribe(consts('EVT_WIDGET_BEFORELOAD'), function () {
  return _.each($.find(document, '[data-edwidget]'), function (node, index) {
    var args = _.resolveWidgetArgs($.dataset(node, 'edwidget'));
    _.each(args, function (arg) {
      return new Edwidget(node, index, arg);
    });
    return $.dataset(node, 'edwidget', null);
  });
});

rh.edWidget = _.cache(_.isObject);

},{}],4:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var model = rh.model;


_.hookClick = function (event) {
  var href = void 0;
  if ('button' in event && event.button !== 0) {
    return;
  }
  if (event.defaultPrevented) {
    return;
  }

  var _document = document,
      body = _document.body;

  var node = event.target;
  while (true) {
    if (!node || node === document) {
      break;
    }
    href = $.getAttribute(node, 'href');
    if (href) {
      break;
    }
    node = node.parentNode;
  }
  if (!href) {
    return;
  }
  href = decodeURI(href);
  var mobileAppMode = model.get(consts('KEY_MOBILE_APP_MODE'));

  var target = $.getAttribute(node, 'target');
  if (target && target !== '_self' && !mobileAppMode) {
    return;
  }

  if (href[0] === '#' && _.isRootUrl()) {
    if (href.length > 1) {
      var bookmarkKey = '' + consts('EVT_BOOKMARK') + href;
      if (model.isSubscribed(bookmarkKey)) {
        model.publish(bookmarkKey, '');
      } else {
        model.publish(consts('EVT_NAVIGATE_TO_URL'), { absUrl: '' + _.getRootUrl() + href });
      }
    }
    return _.preventDefault(event);
  } else if (_.isValidFileUrl(href)) {
    var absUrl = void 0;
    if (_.isRelativeUrl(href)) {
      absUrl = window._getFullPath(_.parentPath(), href);
    }
    if (absUrl == null) {
      absUrl = href;
    }

    if ((mobileAppMode || !target) && !_.isUrlAllowdInIframe(absUrl)) {
      return $.setAttribute(node, 'target', '_blank');
    } else {
      model.publish(consts('EVT_NAVIGATE_TO_URL'), { absUrl: absUrl });
      if (!target) {
        return _.preventDefault(event);
      }
    }
  }
};

},{}],5:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var consts = rh.consts;

// Project specific model keys

consts('KEY_PROJECT_TOPICLIST', '.p.topiclist');
consts('KEY_PROJECT_BRSLIST', '.p.brslist');
consts('KEY_PROJECT_TAG_COMBINATIONS', '.p.tag_combinations');
consts('KEY_PROJECT_TAG_STATES', '.p.tag_states');
consts('KEY_MERGED_FILTER_KEY', '.p.tags');
consts('KEY_PROJECT_FILTER_CAPTION', '.p.filter_caption');
consts('KEY_PROJECT_FILTER_TYPE', '.p.filter_type');
consts('KEY_PROJECT_LIST', '.p.projects');
consts('KEY_MASTER_PROJECT_LIST', '.p.masterprojects');
consts('KEY_SEARCH_RESULTS', '.p.searchresults');
consts('KEY_SEARCH_RESULT_PARAMS', '.p.searchresultparams');
consts('KEY_ONSEARCH_TAG_STATES', '.p.onsearchtagstates');
consts('KEY_LNG', '.p.lng_db');
consts('KEY_DEFAULT_FILTER', '.p.deffilter');
consts('PROJECT_GLOSSARY_DATA', '.p.glodata');
consts('PROJECT_INDEX_DATA', '.p.idxdata');

// Merged Project specific
consts('KEY_MERGED_PROJECT_MAP', '.mp.tmap');

// Topic specific model keys
consts('KEY_TOPIC_URL', '.t.topicurl');
consts('KEY_TOPIC_ID', '.t.topicid');
consts('KEY_TOPIC_TITLE', '.t.topictitle');
consts('KEY_TOPIC_BRSMAP', '.t.brsmap');
consts('KEY_TOPIC_ORIGIN', '.t.origin');
consts('KEY_TOPIC_HEIGHT', '.t.topic_height');

// Layout specific model keys
consts('KEY_SEARCH_TERM', '.l.searchterm');
consts('KEY_SEARCHED_TERM', '.l.searched_term');
consts('KEY_TAG_EXPRESSION', '.l.tag_expression');
consts('KEY_UI_MODE', '.l.uimode'); // RH11
consts('KEY_BASE_IFRAME_NAME', '.l.base_iframe_name');
consts('KEY_CAN_HANDLE_SERCH', '.l.can_handle_search'); // RH11
consts('KEY_CAN_HANDLE_SEARCH', '.l.can_handle_search');
consts('KEY_CSH_MODE', '.l.csh_mode');
consts('KEY_ONSEARCH_TAG_EXPR', '.l.onsearchtagexpr');
consts('KEY_AND_SEARCH', '.l.andsearch');
consts('KEY_FEATURE', '.l.features');
consts('KEY_SEARCH_PROGRESS', '.l.search_progress');
consts('KEY_LAYOUT_VERSION', '.l.layout_version');
consts('KEY_TOPIC_IN_IFRAME', '.l.topic_in_iframe');
consts('KEY_SHOW_TAGS', '.l.showtags');
consts('KEY_DIR', '.l.dir');
consts('KEY_SEARCH_LOCATION', '.l.search_location');
consts('KEY_DEFAULT_SEARCH_LOCATION', '.l.default_search_location');
consts('KEY_FILTER_LOCATION', '.l.filter_location');
consts('KEY_ACTIVE_TAB', '.l.active_tab');
consts('KEY_DEFAULT_TAB', '.l.default_tab');
consts('KEY_ACTIVE_TOPIC_TAB', '.l.active_topic_tab');
consts('KEY_TOC_DRILL_DOWN', '.l.toc_drilldown');
consts('KEY_MOBILE_TOC_DRILL_DOWN', '.l.mobile_toc_drilldown');
consts('KEY_PUBLISH_MODE', '.l.publish_mode');
consts('KEY_PUBLISH_BASE_URL', '.l.publish_base_url');
consts('KEY_PROJECTS_BASE_URL', '.l.projects_base_url');
consts('KEY_INDEX_FILTER', '.l.idxfilter');

// Events
consts('EVT_BASE_IFRAME_LOAD', '.e.base_iframe_load');
consts('EVT_SCROLL_TO_TOP', '.e.scroll_to_top');
consts('EVT_SEARCH_TERM', '.e.search_term');
consts('EVT_NAVIGATE_TO_URL', '.e.navigate_to_url');
consts('EVT_PROJECT_LOADED', '.e.project_loaded');
consts('EVT_TOC_LOADED', '.e.toc_loaded');
consts('EVT_TOPIC_LOADED', '.e.topic_loaded');
consts('EVT_TOPIC_LOADING', '.e.topic_loading');
consts('EVT_BOOKMARK', '.e.bookmark.');
consts('EVT_PRINT_TOPIC', '.e.print_topic');
consts('EVT_SEARCH_IN_PROGRESS', '.e.search_in_progress');
consts('EVT_RELOAD_TOPIC', '.e.reload_topic');
consts('EVT_QUERY_SEARCH_RESULTS', '.e.query_search_results');
consts('EVT_LOAD_IDX', '.e.load_idx');
consts('EVT_LOAD_GLO', '.e.load_glo');

// Hash and query keys
consts('HASH_KEY_RH_HIGHLIGHT', 'rhhlterm');
consts('HASH_KEY_RH_SYNS', 'rhsyns');
consts('HASH_KEY_RH_SEARCH', 'rhsearch');
consts('HASH_KEY_RH_TOCID', 'rhtocid');

// Hash keys
consts('HASH_KEY_TOPIC', 't');
consts('HASH_KEY_UIMODE', 'ux');
consts('HASH_KEY_RANDOM', 'random');

consts('PATH_PROJECT_TAGDATA_FILE', 'whxdata/whtagdata.js');
consts('CORDOVA_JS_URL', 'cordova.js');
consts('RHS_LOG_TOPIC_VIEW', { mgr: 'sys', cmd: 'logtpc' });
consts('RHS_DO_SEARCH', { mgr: 'agm', agt: 'nls', cmd: 'search' });
consts('KEY_MOBILE_APP_MODE', '.m.mobileapp');

},{}],6:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var model = rh.model;
var consts = rh.consts;


var KEY_MERGED_PROJECT_MAP = consts('KEY_MERGED_PROJECT_MAP');

_.parseProjectName = function (project) {
  return project.replace(/\.\//g, '').replace(/\.$/, '').replace(/\/$/, '');
};

_.mapTagIndex = function (idx, project) {
  if (project == null) {
    project = '';
  }
  if (idx) {
    return idx + '+' + project;
  }
  return idx;
};

_.getTags = function (idx, project) {
  if (project == null) {
    project = '';
  }
  if (idx == null) {
    return idx;
  }
  var idmap = model.get(KEY_MERGED_PROJECT_MAP);
  var len = idx.indexOf('+');
  if (len !== -1) {
    project = idx.substring(len + 1, idx.length);
    idx = idx.substring(0, len);
  }
  project = _.parseProjectName(project);
  if ((idmap[project] != null ? idmap[project][idx] : undefined) != null) {
    return idmap[project][idx];
  }
  return idx;
};

_.getProjectName = function (url) {
  var idmap = model.get(KEY_MERGED_PROJECT_MAP);
  if (url != null && idmap != null) {
    url = _.parentPath(url);
    var relUrl = _.makeRelativePath(url, _.getHostFolder());
    relUrl = _.parseProjectName(relUrl);
    while (idmap[relUrl] == null) {
      var n = relUrl.lastIndexOf('/');
      if (n < 0) {
        relUrl = '';
        break;
      }
      relUrl = relUrl.substring(0, n);
    }
    url = relUrl;
  }
  return url;
};

_.evalTagExpression = function (index, groupExprs, project) {
  if (project == null) {
    project = '';
  }
  if (!groupExprs || groupExprs.length === 0) {
    return true;
  }

  var tags = _.getTags(index, project);
  if (!tags || tags.length === 0) {
    return true;
  }

  // TODO: fix empty string in robohelp
  if (tags.length === 1 && (tags[0] === '' || tags[0] === '$')) {
    return true;
  }

  var trueFlag = false;
  var falseFlag = _.any(groupExprs, function (item) {
    if (_.evalMultipleTagExpression(item.c, tags)) {
      trueFlag = true;
    } else if (item.c.length) {
      if (_.evalMultipleTagExpression(item.u, tags)) {
        return true;
      }
    }
    return false;
  });

  if (falseFlag) {
    return false;
  } else {
    return trueFlag;
  }
};

_.evalMultipleTagExpression = function (exprs, tags) {
  return _.any(exprs, function (expr) {
    return _.evalSingleTagExpression(expr, tags);
  });
};

_.evalSingleTagExpression = function () {
  var cache = {};
  var operators = ['&', '|', '!'];
  var evalAnd = function evalAnd(stack) {
    var items = stack.splice(stack.length - 2);
    return stack.push(items[0] === 1 && items[1] === 1 ? 1 : 0);
  };

  var evalOr = function evalOr(stack) {
    var items = stack.splice(stack.length - 2);
    return stack.push(items[0] === 1 || items[1] === 1 ? 1 : 0);
  };

  var evalNot = function evalNot(stack, tags) {
    var items = stack.splice(stack.length - 1);
    return stack.push(items[0] === 1 ? 0 : 1);
  };

  return function (expr, tags) {
    var key = expr + ':' + tags; // TODO: now robohelp should export tags as string
    var result = cache[key];
    if (result != null) {
      return result;
    }

    var tokens = _.map(expr.split(' '), function (item) {
      if (-1 !== operators.indexOf(item)) {
        return item;
      }
      if (-1 === tags.indexOf(item)) {
        return 0;
      } else {
        return 1;
      }
    });

    if (tokens.length > 1) {
      var stack = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.from(tokens)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var token = _step.value;

          switch (token) {
            case '&':
              evalAnd(stack);break;
            case '|':
              evalOr(stack);break;
            case '!':
              evalNot(stack);break;
            default:
              stack.push(token);
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

      result = stack[0];
    } else {
      result = tokens[0];
    }

    return cache[key] = result;
  };
}();

},{}],7:[function(require,module,exports){
'use strict';

var rh = window.rh;
var _ = rh._;
var consts = rh.consts;

_.getHostFolder = function () {
  var hostFolder = void 0;
  hostFolder = null;
  return function () {
    if (hostFolder == null) {
      hostFolder = _.isLocal() ? window.gHostPath : document.location.protocol + '//' + window.gHost + window.gHostPath;
    }
    return hostFolder;
  };
}();

_.getHostData = function (rootPath) {
  var absFolder = void 0;
  absFolder = window._getFullPath(_.parentPath(), rootPath + '/');
  if (window._isHTTPUrl(absFolder)) {
    return {
      gHost: window._getHostNameFromURL(absFolder),
      gHostPath: window._getPathFromURL(absFolder)
    };
  } else {
    return {
      gHost: '',
      gHostPath: absFolder
    };
  }
};

_.getHashMapForRoot = function (relUrl, bCsh) {
  var hashMap = void 0;
  var urlhashMap = void 0;
  if (bCsh == null) {
    bCsh = null;
  }
  relUrl = _.fixRelativeUrl(relUrl);
  urlhashMap = _.urlParams(_.extractParamString(relUrl));
  if (bCsh) {
    urlhashMap[consts('RHMAPID')] = null;
    urlhashMap[consts('RHMAPNO')] = null;
  }
  hashMap = _.extend(_.urlParams(), urlhashMap);
  hashMap = _.fixHashMapForRoot(hashMap);
  //hashMap = _.addRHSParams(hashMap);
  return hashMap;
};

_.getParamsForRoot = function (relUrl, bCsh) {
  var queryMap = void 0;
  var queryString = void 0;
  if (bCsh == null) {
    bCsh = null;
  }
  queryMap = _.getHashMapForRoot(relUrl, bCsh);
  queryString = _.mapToEncodedString(queryMap);
  if (queryString.length === 0) {
    return '';
  } else {
    return '?' + queryString;
  }
};

_.isRootUrl = function (absUrl) {
  var fileName = void 0;
  var filePath = void 0;
  var rootUrl = void 0;
  if (absUrl == null) {
    absUrl = decodeURI(document.location.href);
  }
  rootUrl = _.getRootUrl();
  filePath = _.filePath(absUrl);
  if (filePath === _.filePath(rootUrl)) {
    return true;
  }
  fileName = _.getFileName(rootUrl);
  return (fileName === 'index.htm' || fileName === 'index.html') && filePath === _.parentPath(rootUrl);
};

_.isExternalUrl = function (absUrl) {
  var hostFolder = void 0;
  var targetFolder = void 0;
  if (rh.model.get(rh.consts('KEY_PUBLISH_MODE'))) {
    hostFolder = rh.model.get(rh.consts('KEY_PROJECTS_BASE_URL'));
  } else {
    hostFolder = _.getHostFolder();
  }
  targetFolder = absUrl.substring(0, hostFolder.length);
  return targetFolder !== hostFolder;
};

_.fixHashMapForRoot = function (hashMap) {
  var HASH_KEY_RANDOM = void 0;
  var HASH_KEY_RH_HIGHLIGHT = void 0;
  var HASH_KEY_RH_SEARCH = void 0;
  var HASH_KEY_RH_TOCID = void 0;
  var HASH_KEY_TOPIC = void 0;
  var HASH_KEY_UIMODE = void 0;
  if (hashMap == null) {
    hashMap = {};
  }
  HASH_KEY_RH_SEARCH = consts('HASH_KEY_RH_SEARCH');
  HASH_KEY_TOPIC = consts('HASH_KEY_TOPIC');
  HASH_KEY_UIMODE = consts('HASH_KEY_UIMODE');
  HASH_KEY_RH_TOCID = consts('HASH_KEY_RH_TOCID');
  HASH_KEY_RH_HIGHLIGHT = consts('HASH_KEY_RH_HIGHLIGHT');
  HASH_KEY_RANDOM = consts('HASH_KEY_RANDOM');
  if (!hashMap[HASH_KEY_UIMODE]) {
    hashMap[HASH_KEY_UIMODE] = null;
  }
  hashMap[HASH_KEY_RANDOM] = null;
  if (!hashMap[HASH_KEY_RH_TOCID]) {
    hashMap[HASH_KEY_RH_TOCID] = null;
  }
  if (!hashMap[HASH_KEY_RH_HIGHLIGHT]) {
    hashMap[HASH_KEY_RH_HIGHLIGHT] = null;
  }
  if (!hashMap[HASH_KEY_RH_SEARCH]) {
    hashMap[HASH_KEY_RH_SEARCH] = null;
  }
  return hashMap;
};

_.fixRelativeUrl = function (filePath) {
  if (filePath == null) {
    filePath = '';
  }
  filePath = filePath.replace(/\/\.\//g, '/');
  if (filePath[0] === '.' && filePath[1] === '/') {
    filePath = filePath.substring(2);
  }
  return filePath;
};

_.ensureSlash = function (url) {
  if (url != null && url.substr(-1) !== '/') {
    url += '/';
  }
  return url;
};

_.isUrlAllowdInIframe = function () {
  var ALLOWED_EXTS_IN_IFRAME = void 0;
  ALLOWED_EXTS_IN_IFRAME = ['', '.htm', '.html', '.asp', '.aspx'];
  return function (absUrl) {
    var ext = void 0;
    var relUrl = void 0;
    if (_.isExternalUrl(absUrl)) {
      return false;
    }
    relUrl = absUrl.substring(_.getHostFolder().length);
    ext = _.getFileExtention(relUrl).toLowerCase();
    return ALLOWED_EXTS_IN_IFRAME.includes(ext);
  };
}();

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

var rh = require("./rh");
var consts = rh.consts;

consts('RHMAPID', 'rhmapid');
consts('RH_FULL_LAYOUT_PARAM', 'rhfulllayout');

consts('EVT_TOPIC_WIDGET_LOADED', '.e.topic_widget_loaded');
consts('EVT_CLOSE_SEARCH_SUGGESTION', '.e.close_search_suggestion');

consts('KEY_TOC_BREADCRUMBS', '.p.toc_breadcrumbs');
consts('KEY_TOC_SELECT_ITEM', '.p.toc_select_item');
consts('KEY_TOC_ORDER', '.p.toc_order');
consts('KEY_TOC_CHILD_ORDER', '.p.toc_child_order');
//Search specific
consts('SEARCH_MAP_ADDR', "whxdata/search_auto_map_0.js");
consts('SEARCH_MODEL_ADDR', "whxdata/search_auto_model_");
consts('SEARCH_INDEX_DATA', ".l.search_index_data");
consts('SEARCH_INDEX_FILE', "whxdata/search_auto_index.js");
consts('SEARCH_DB_FILE', "whxdata/search_db.js");
consts('SEARCH_METADATA_FILE', "whxdata/search_topics.js");
consts('SEARCH_TEXT_FILE', "whxdata/text");

consts('SEARCH_MODEL_KEY', '.l.search_model.');
consts('SEARCH_MAP_KEY', '.l.search_map.');
consts('SEARCH_MAX_TOPICS', 20);
consts('SEARCH_RESULTS_KEY', 'search_results');
consts('STOP_NAVIGATE_TO_TOPIC', '.l.stoptopicnav');
consts('SEARCH_WORDS_MAP', '.l.search_words_map');
consts("MAX_SEARCH_INPUT", 3);
consts("KEY_BREADCRUMBS", '.l.breadcrumbs');
consts('HASH_HOMEPAGE_MODE', 'homepage');
consts('KEY_VIEW_MODE', '.l.mode');
consts('HELP_LAYOUT_MODE', 'layout');
consts('HELP_SEARCH_MODE', 'search');
consts('HELP_TOPIC_MODE', 'topic');
consts('PREV_SEARCH_KEY', 'data-prev-search');

/* favorites constants */
consts('FAVATTRIBUTE', 'data-favwidget');
consts('FAVBUTTON', 'fav-button');
consts('FAVLIST', 'fav-list');
consts('FAVSTORAGE', 'fav-store');

consts('FAVLINKCLASS', 'favorite');
consts('UNFAVLINKCLASS', 'unfavorite');
consts('FAVTABLECLASS', 'favoritesholder');
consts('FAVTABLETITLECLASS', 'favorite');
consts('FAVTABLEREMOVECLASS', 'removelink');
consts('FAVLISTINTROCLASS', 'favoritesintro');
consts('FAVLISTTABLEINTROCLASS', 'favoritestableintro');
consts('EVENTFAVCHANGE', 'favorite-changed-in-script');
consts('TOPIC_FAVORITE', '.l.topic_favorite');
consts('KEY_FAVORITES', '.l.favorites');
consts('FAVORITES_BUTTON_TITLE', '.l.favorites_title');
consts('KEY_GLOSSARY_RESULT', '.p.glossary_search_result');
consts('KEY_GLOSSARY_RESULT_TERM', '.p.glossary_search_term');

consts('EVT_WINDOW_LOADED', '.e.win_loaded');

consts('KEY_LNG_NAME', '.p.lng_name');
consts('SHOW_MODAL', '.l.show_modal');

consts('KEY_HEADER_LOGO_PATH', '.l.header.logo');
consts('KEY_HEADER_TITLE', '.l.header.title');
consts('KEY_HEADER_TITLE_COLOR', '.l.header.title_color');
consts('KEY_HEADER_BACKGROUND_COLOR', '.l.header.background_color');
consts('KEY_LAYOUT_FONT_FAMILY', '.l.layout.font_family');
consts('KEY_HEADER_HTML', '.l.header.html');
consts('KEY_HEADER_CSS', '.l.header.css');
consts('KEY_HEADER_DEFAULT_BACKGROUND_COLOR', '.l.header.default_background_color');
consts('KEY_HEADER_DEFAULT_TITLE_COLOR', '.l.header.default_title_color');
consts('KEY_LAYOUT_DEFAULT_FONT_FAMILY', '.l.layout.default_font_family');

consts('KEY_CUSTOM_BUTTONS', '.l.custom_buttons');
consts('KEY_CUSTOM_BUTTONS_CONFIG', '.l.custom_buttons_config');
consts('KEY_SEARCH_HIGHLIGHT_COLOR', '.l.search_result.highlight_color');
consts('KEY_SEARCH_BG_COLOR', '.l.search_result.highlight_bccolor');
consts('TOPIC_HIGHLIGHTED', '.l.search_result.topic_highlighted');
consts('EVT_REMOVE_HIGHLIGHT', '.e.remove_highlight');

consts('EVT_EXPAND_COLLAPSE_ALL', '.e.expand_collapse_all');
consts('EVT_EXPAND_ALL', '.e.expand_all');
consts('EVT_COLLAPSE_ALL', '.e.collapse_all');
consts('ALL_ARE_EXPANDED', '.l.all_are_expanded');

},{"./rh":10}],10:[function(require,module,exports){
(function (global){
"use strict";

//Gunjan
if (global.rh === undefined) {
  global.rh = {};
}

module.exports = global.rh;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],11:[function(require,module,exports){
"use strict";

require("../lib/rh");
require("../../lenient_src/utils/shim");
require("../../lenient_src/robohelp/common/rh_consts");
require("../../lenient_src/robohelp/common/tag_expression_utils");
require("../../lenient_src/robohelp/common/hook_click");
require("../../lenient_src/robohelp/common/content_filter");
require("../../lenient_src/robohelp/common/ed_widgets");
require("../../lenient_src/robohelp/common/ed_widget_configs");
require("../../lenient_src/robohelp/common/url_utils");
require("../../lenient_src/robohelp/common/tag_expression_utils");
require("../../lenient_src/robohelp/common/hook_click");
require("../../lenient_src/robohelp/common/content_filter");
require("../../lenient_src/robohelp/common/ed_widgets");
require("../../lenient_src/robohelp/common/ed_widget_configs");
require("../lib/consts");
require("../../lenient_src/robohelp/common/url_utils");
require("./utils/home_utils");
require("./utils/url_utils");
require("./utils/io_utils");
require("./utils/html_resolver");
require("./utils/iframe_utils");
require("./layout/data_attrs/popup_image");
require("./layout/data_attrs/focusif");
require("./common/init");

},{"../../lenient_src/robohelp/common/content_filter":1,"../../lenient_src/robohelp/common/ed_widget_configs":2,"../../lenient_src/robohelp/common/ed_widgets":3,"../../lenient_src/robohelp/common/hook_click":4,"../../lenient_src/robohelp/common/rh_consts":5,"../../lenient_src/robohelp/common/tag_expression_utils":6,"../../lenient_src/robohelp/common/url_utils":7,"../../lenient_src/utils/shim":8,"../lib/consts":9,"../lib/rh":10,"./common/init":12,"./layout/data_attrs/focusif":13,"./layout/data_attrs/popup_image":14,"./utils/home_utils":15,"./utils/html_resolver":16,"./utils/iframe_utils":17,"./utils/io_utils":18,"./utils/url_utils":20}],12:[function(require,module,exports){
'use strict';

var rh = require("../../lib/rh");
var consts = rh.consts;
var $ = rh.$;
var model = rh.model;

model.subscribe(consts('EVT_PROJECT_LOADED'), function () {
  var $html = $('html', 0);
  var lang = model.get(consts('KEY_LNG_NAME'));
  if ($html && lang && lang !== '') {
    $.setAttribute($html, 'lang', lang);
  }
});

model.subscribe(consts('KEY_AND_SEARCH'), function (value) {
  return value === '' && model.publish(consts('KEY_AND_SEARCH'), '1');
});

},{"../../lib/rh":10}],13:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../lib/rh");

var Focusif = function Focusif(widget, node, rawExpr) {
  _classCallCheck(this, Focusif);

  widget.subscribeDataExpr(rawExpr, function (result) {
    if (result) {
      node.focus();
    }
  });
};

rh.registerDataAttr('focusif', Focusif);

},{"../../../lib/rh":10}],14:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../lib/rh");
var _ = rh._;
var $ = rh.$;
var HtmlResolver = require("../../utils/html_resolver");
var nodeUtils = require("../../utils/node_utils");

var PopupImage = function () {
  function PopupImage(widget, node, rawExpr) {
    _classCallCheck(this, PopupImage);

    $.addClass(node, "popup-image-thumbnail");
    this.node = node;
    rh.model.csubscribe('EVT_PROJECT_LOADED', this._addEnlargeButton.bind(this));
    this._clickFn = this._getClickFn(rawExpr);
    _.addEventListener(node, "click", this._clickFn);
  }

  _createClass(PopupImage, [{
    key: "_content",
    value: function _content(rawExpr) {
      var nodes = [];
      var imgNode = $.createElement('img');
      $.setAttribute(imgNode, 'src', rawExpr);
      nodes.push(imgNode);

      if ($.hasAttribute(this.node, "usemap")) {
        var mapId = $.getAttribute(this.node, "usemap");
        $.setAttribute(imgNode, 'usemap', mapId);
        nodes.push($(mapId, 0));
      }

      var html_resolver = new HtmlResolver();
      return html_resolver.resolve(_.map(nodes, function (node) {
        return nodeUtils.outerHTML(node);
      }).join(' '));
    }
  }, {
    key: "_getClickFn",
    value: function _getClickFn(rawExpr) {
      var _this = this;

      return function () {
        rh.model.cpublish('SHOW_MODAL', { content: _this._content(rawExpr), isImage: true });
      };
    }
  }, {
    key: "_addEnlargeButton",
    value: function _addEnlargeButton() {

      var img = $.createElement('img', this.node);
      $.setAttribute(img, "src", this.expandImagePath);
      $.addClass(img, "rh-expand-icon");
      nodeUtils.insertAfter(this.node, img);
      _.addEventListener(img, "click", this._clickFn);
    }
  }, {
    key: "expandImagePath",
    get: function get() {
      var html_resolver = new HtmlResolver();
      var fullImagePath = html_resolver.makeFullPath('template/images/expand.png', _.getRootUrl());
      return _.makeRelativeUrl(fullImagePath);
    }
  }]);

  return PopupImage;
}();

rh.registerDataAttr('popupimage', PopupImage);

},{"../../../lib/rh":10,"../../utils/html_resolver":16,"../../utils/node_utils":19}],15:[function(require,module,exports){
'use strict';

var rh = require("../../lib/rh");
var _ = rh._;
var consts = rh.consts;

_.goToHome = function (hash_map, params_map) {
  var home_path = consts('HOME_FILEPATH');
  if (home_path) {
    var home_url = _.makeFullUrl(home_path);
    var paramsStr = params_map === undefined ? '' : '?' + _.mapToEncodedString(params_map);
    var hashStr = hash_map === undefined ? '' : '#' + _.mapToEncodedString(hash_map);

    home_url = '' + home_url + paramsStr + hashStr;
    document.location = home_url;
  }
};

_.isHomeUrl = function (url) {
  var home_path = consts('HOME_FILEPATH');
  var rootUrl = _.getRootUrl();
  var relativePath = _.makeRelativePath(url, rootUrl);
  var filePath = _.filePath(relativePath);
  return home_path === filePath;
};

_.compare = function (word1, word2) {
  return word1 === word2 ? 0 : -1;
};

},{"../../lib/rh":10}],16:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var $ = rh.$;
var _ = rh._;
var nodeUtils = require("./node_utils");
var util = {
  scheme: function scheme(url) {
    var index = void 0,
        scheme = void 0;
    index = url.indexOf(':');
    if (index !== -1) {
      scheme = url.substring(0, index + 1).toLowerCase().trim();
    }
    return scheme;
  }
};

var HtmlResolver = function () {
  _createClass(HtmlResolver, [{
    key: "paths",
    get: function get() {
      return ['src', 'href'];
    }
  }, {
    key: "links",
    get: function get() {
      return ['href'];
    }
  }]);

  function HtmlResolver() {
    _classCallCheck(this, HtmlResolver);
  }

  _createClass(HtmlResolver, [{
    key: "resolve",
    value: function resolve(html) {
      var _this = this;

      var nodes = nodeUtils.toHtmlNode(html);
      _.each(nodes, function (node) {
        if (nodeUtils.isElementNode(node)) {
          $.traverseNode(node, function (node) {
            return _this.resolveNode(node);
          });
        }
      });
      return _.reduce(nodes, function (result, node) {
        result += nodeUtils.outerHTML(node);
        return result;
      }, '');
    }
  }, {
    key: "resolveNode",
    value: function resolveNode(node) {
      var _this2 = this;

      _.each(this.paths, function (attribute) {
        return _this2.resovePaths(node, attribute);
      });
      _.each(this.links, function (attribute) {
        return _this2.resoveLinks(node, attribute);
      });
      return true;
    }
  }, {
    key: "resovePaths",
    value: function resovePaths(node, attribute) {
      if (!$.hasAttribute(node, attribute)) {
        return;
      }
      var value = $.getAttribute(node, attribute);
      $.setAttribute(node, attribute, this.resovePath(value));
    }
  }, {
    key: "resoveLinks",
    value: function resoveLinks(node, attribute) {
      if (!$.hasAttribute(node, attribute)) {
        return;
      }
      $.setAttribute(node, "data-click", "@close(true)");
    }
  }, {
    key: "resovePath",
    value: function resovePath(path) {
      if (!_.isRelativeUrl(path)) {
        return path;
      }
      var baseUrl = _.getRootUrl();
      var fullUrl = _.makeFullUrl(path);
      return _.makeRelativeUrl(fullUrl, baseUrl);
    }
  }, {
    key: "makeFullPath",
    value: function makeFullPath(relUrl, baseUrl) {
      if (!this.isRelativeUrl(relUrl) || this.isRelativeUrl(baseUrl)) {
        return relUrl;
      }
      var baseParts = this.filePath(baseUrl).split('/'),
          relPath = this.filePath(relUrl),
          params = relUrl.substring(relPath.length),
          relParts = relPath.split('/');

      if (relParts.length > 1 || relParts[0]) {
        baseParts.pop();
        _.each(relParts, function (relPart) {
          if (relPart === '..') {
            baseParts.pop();
          } else if (relPart !== '.') {
            baseParts.push(relPart);
          }
        });
      }

      return "" + baseParts.join('/') + params;
    }
  }, {
    key: "isRelativeUrl",
    value: function isRelativeUrl(url) {
      return !url || !util.scheme(url) && url.trim().indexOf('/');
    }
  }, {
    key: "filePath",
    value: function filePath(url) {
      var index = void 0;
      url = url || '';
      index = url.indexOf('?');
      if (index !== -1) {
        url = url.substring(0, index);
      }
      index = url.indexOf('#');
      if (index !== -1) {
        url = url.substring(0, index);
      }
      return url;
    }
  }]);

  return HtmlResolver;
}();

module.exports = HtmlResolver;

},{"../../lib/rh":10,"./node_utils":19}],17:[function(require,module,exports){
'use strict';

var rh = require('../../lib/rh'),
    _ = rh._,
    $ = rh.$;

_.resetIframeSize = function (selector) {
  var iframe = $(selector, 0);
  return iframe;
};

},{"../../lib/rh":10}],18:[function(require,module,exports){
"use strict";

var rh = require("../../lib/rh");
var _ = rh._;
var keyHash = {
  8: "backspace",
  13: "return",
  27: "escape",
  38: "down",
  40: "up",
  39: "right"
};

_.getKeyIndex = function (keyCode) {
  if (keyHash[keyCode]) {
    return keyHash[keyCode];
  } else {
    return "default";
  }
};

},{"../../lib/rh":10}],19:[function(require,module,exports){
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

},{"../../lib/rh":10}],20:[function(require,module,exports){
'use strict';

var rh = require("../../lib/rh");
var _ = rh._;

_.addParam = function (url, key, value) {
  var hashStr = _.extractHashString(url);
  var paramsStr = _.extractParamString(url);
  var paramsMap = _.urlParams(paramsStr);
  paramsMap[key] = value;
  var strippedUrl = _.stripBookmark(url);
  strippedUrl = _.stripParam(strippedUrl);

  var urlHashStr = hashStr === '' ? hashStr : '#' + hashStr;

  var updatedParamsStr = rh._.mapToEncodedString(paramsMap);
  var urlParamsStr = updatedParamsStr === '' ? updatedParamsStr : '?' + updatedParamsStr;
  return strippedUrl + urlParamsStr + urlHashStr;
};

_.removeParam = function (url, param) {
  var hashStr = _.extractHashString(url);
  var paramsStr = _.extractParamString(url);
  var paramsMap = _.urlParams(paramsStr);
  paramsMap[param] = null;
  var strippedUrl = _.stripBookmark(url);
  strippedUrl = _.stripParam(strippedUrl);

  var urlHashStr = hashStr === '' ? hashStr : '#' + hashStr;

  var updatedParamsStr = rh._.mapToEncodedString(paramsMap);
  var urlParamsStr = updatedParamsStr === '' ? updatedParamsStr : '?' + updatedParamsStr;
  return strippedUrl + urlParamsStr + urlHashStr;
};

_.createHashedUrl = function (url) {
  //let hashedUrl = url
  var relUrl = void 0,
      params = void 0;
  if (!_.isRootUrl(url)) {
    var rootUrl = _.getRootUrl();
    if (_.isExternalUrl(url)) {
      relUrl = url;
    } else {
      params = _.getParamsForRoot(url, true);
      relUrl = _.fixRelativeUrl(_.makeRelativePath(url, rootUrl));
      url = '' + rootUrl + params + '#t=' + encodeURIComponent(relUrl);
    }
  }
  return url;
};

},{"../../lib/rh":10}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vY29udGVudF9maWx0ZXIuanMiLCJsZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vZWRfd2lkZ2V0X2NvbmZpZ3MuanMiLCJsZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vZWRfd2lkZ2V0cy5qcyIsImxlbmllbnRfc3JjL3JvYm9oZWxwL2NvbW1vbi9ob29rX2NsaWNrLmpzIiwibGVuaWVudF9zcmMvcm9ib2hlbHAvY29tbW9uL3JoX2NvbnN0cy5qcyIsImxlbmllbnRfc3JjL3JvYm9oZWxwL2NvbW1vbi90YWdfZXhwcmVzc2lvbl91dGlscy5qcyIsImxlbmllbnRfc3JjL3JvYm9oZWxwL2NvbW1vbi91cmxfdXRpbHMuanMiLCJsZW5pZW50X3NyYy91dGlscy9zaGltLmpzIiwic3JjL2xpYi9jb25zdHMuanMiLCJzcmMvbGliL3JoLmpzIiwic3JjL3Jlc3BvbnNpdmVfaGVscC9jb21tb24uanMiLCJzcmMvcmVzcG9uc2l2ZV9oZWxwL2NvbW1vbi9pbml0LmpzIiwic3JjL3Jlc3BvbnNpdmVfaGVscC9sYXlvdXQvZGF0YV9hdHRycy9mb2N1c2lmLmpzIiwic3JjL3Jlc3BvbnNpdmVfaGVscC9sYXlvdXQvZGF0YV9hdHRycy9wb3B1cF9pbWFnZS5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdXRpbHMvaG9tZV91dGlscy5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdXRpbHMvaHRtbF9yZXNvbHZlci5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdXRpbHMvaWZyYW1lX3V0aWxzLmpzIiwic3JjL3Jlc3BvbnNpdmVfaGVscC91dGlscy9pb191dGlscy5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdXRpbHMvbm9kZV91dGlscy5qcyIsInNyYy9yZXNwb25zaXZlX2hlbHAvdXRpbHMvdXJsX3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztjQ0FhLE07SUFBUCxFLFdBQUEsRTtJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLE0sR0FBVyxFLENBQVgsTTs7O0FBRU4sR0FBRyxLQUFILENBQVMsU0FBVCxDQUFtQixPQUFPLG9CQUFQLENBQW5CLEVBQWtEO0FBQUEsU0FDaEQsR0FBRyxLQUFILENBQVMsU0FBVCxDQUFtQixPQUFPLHdCQUFQLENBQW5CLEVBQXFELFlBQVc7QUFDOUQsUUFBSSxTQUFTLEVBQUUsY0FBRixDQUFpQixFQUFFLFFBQUYsRUFBakIsQ0FBYjtBQUNBLFdBQU8sR0FBRyxLQUFILENBQVMsT0FBVCxDQUFpQixPQUFPLGtCQUFQLENBQWpCLEVBQTZDLE1BQTdDLENBQVA7QUFDRCxHQUhELENBRGdEO0FBQUEsQ0FBbEQ7O0FBT0EsSUFBSSxnQkFBaUIsWUFBVztBQUM5QixNQUFJLGVBQWUsU0FBbkI7QUFDQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxtQ0FNZSxDQU5mLEVBTWtCO0FBQ2QsVUFBRSxjQUFGLENBQWlCLENBQWpCO0FBQ0EsZUFBTyxLQUFQO0FBQ0Q7QUFUSDtBQUFBO0FBQUEsa0NBQ3FCOztBQUVqQix1QkFBZSxDQUFDLEtBQUQsRUFBTyxRQUFQLEVBQWdCLE9BQWhCLENBQWY7QUFDRDtBQUpIOztBQVdFLDJCQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFBQSxnSUFDWixNQURZOztBQUVsQixZQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLFlBQUssR0FBTCxHQUFXLE9BQU8sR0FBbEI7QUFDQSxZQUFLLFNBQUwsR0FBaUIsT0FBTyxTQUFQLElBQW9CLFNBQXJDO0FBQ0EsWUFBSyxJQUFMLEdBQVksT0FBTyxJQUFuQjtBQUNBLFlBQUssVUFBTCxHQUFrQixzQkFBbEI7QUFDQSxZQUFLLFFBQUwsR0FBZ0IsZ0JBQWhCO0FBQ0EsWUFBSyxhQUFMOztBQUVBLFVBQUksTUFBSyxHQUFULEVBQWM7QUFDWixjQUFLLFNBQUwsQ0FBZSxPQUFPLGtCQUFQLENBQWYsRUFBMkMsWUFBTTtBQUMvQyxpQkFBTyxNQUFLLFNBQUwsQ0FBZSxPQUFPLG9CQUFQLENBQWYsRUFBNkMsTUFBSyxTQUFsRCxDQUFQO0FBQ0QsU0FGRDtBQUdELE9BSkQsTUFJTyxJQUFJLEdBQUcsTUFBUCxFQUFlO0FBQ3BCLFdBQUcsRUFBSCxDQUFNLE9BQU4sRUFBZSx1Q0FBZjtBQUNEO0FBaEJpQjtBQWlCbkI7O0FBNUJIO0FBQUE7QUFBQSxnQ0E4QlksUUE5QlosRUE4QnNCO0FBQ2xCLFlBQUksU0FBUyxLQUFLLEdBQUwsQ0FBUyxPQUFPLGtCQUFQLENBQVQsQ0FBYjtBQUNBLFlBQUksQ0FBQyxLQUFLLEdBQUwsQ0FBUyxNQUFULENBQUwsRUFBdUI7QUFDckIsZUFBSyxJQUFMLEdBQVksRUFBRSxLQUFGLENBQVEsS0FBSyxHQUFiLEVBQWtCO0FBQUEsbUJBQU0sRUFBRSxPQUFGLENBQVUsRUFBVixFQUFjLE1BQWQsQ0FBTjtBQUFBLFdBQWxCLENBQVo7QUFDQSxlQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxHQUFmLENBQXJCO0FBQ0Q7O0FBRUQsWUFBSSxRQUFRLENBQUMsRUFBRSxHQUFGLENBQU0sS0FBSyxHQUFYLEVBQWdCO0FBQUEsaUJBQU0sRUFBRSxpQkFBRixDQUFvQixFQUFwQixFQUF3QixRQUF4QixFQUFrQyxNQUFsQyxDQUFOO0FBQUEsU0FBaEIsQ0FBYjtBQUNBLGFBQUssV0FBTCxDQUFpQixLQUFqQjtBQUNBLFlBQUksS0FBSyxTQUFMLEtBQW1CLFNBQXZCLEVBQWtDO0FBQUUsZUFBSyxXQUFMLENBQWlCLEtBQWpCO0FBQTBCO0FBQzlELGVBQU8sS0FBSyxPQUFMLEdBQWUsS0FBdEI7QUFDRDtBQXpDSDtBQUFBO0FBQUEsa0NBMkNjLEtBM0NkLEVBMkNxQjtBQUNqQixZQUFJLEtBQUosRUFBVztBQUNULGNBQUksQ0FBQyxLQUFLLE9BQVYsRUFBbUI7QUFBRSxtQkFBTyxFQUFFLFFBQUYsQ0FBVyxLQUFLLElBQWhCLEVBQXNCLEtBQUssU0FBM0IsQ0FBUDtBQUErQztBQUNyRSxTQUZELE1BRU87QUFDTCxpQkFBTyxFQUFFLFdBQUYsQ0FBYyxLQUFLLElBQW5CLEVBQXlCLEtBQUssU0FBOUIsQ0FBUDtBQUNEO0FBQ0Y7QUFqREg7QUFBQTtBQUFBLGtDQW1EYyxRQW5EZCxFQW1Ed0I7QUFDcEIsWUFBSSxRQUFKLEVBQWM7QUFDWixjQUFJLENBQUMsS0FBSyxPQUFWLEVBQW1CO0FBQUUsbUJBQU8sRUFBRSxnQkFBRixDQUFtQixLQUFLLElBQXhCLEVBQThCLE9BQTlCLEVBQXVDLEtBQUssWUFBNUMsQ0FBUDtBQUFtRTtBQUN6RixTQUZELE1BRU87QUFDTCxjQUFJLEtBQUssT0FBVCxFQUFrQjtBQUFFLG1CQUFPLEVBQUUsbUJBQUYsQ0FBc0IsS0FBSyxJQUEzQixFQUFpQyxPQUFqQyxFQUEwQyxLQUFLLFlBQS9DLENBQVA7QUFBc0U7QUFDM0Y7QUFDRjtBQXpESDtBQUFBO0FBQUEsZ0NBMkRZO0FBQ1IsZUFBTyxFQUFFLFFBQUYsQ0FBVyxLQUFLLElBQWhCLEVBQXNCLEtBQUssVUFBM0IsQ0FBUDtBQUNEO0FBN0RIO0FBQUE7QUFBQSxtQ0ErRGU7QUFDWCxlQUFPLEVBQUUsV0FBRixDQUFjLEtBQUssSUFBbkIsRUFBeUIsS0FBSyxVQUE5QixDQUFQO0FBQ0Q7QUFqRUg7QUFBQTtBQUFBLGlDQW1FYSxPQW5FYixFQW1Fc0I7QUFDbEIsWUFBSSxhQUFhLEtBQUssSUFBdEI7QUFDQSxZQUFJLFVBQVUsSUFBZDtBQUNBLFlBQUksYUFBYSxPQUFiLENBQXFCLEtBQUssSUFBTCxDQUFVLFFBQS9CLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7QUFDaEQsb0JBRGdELEdBQ2pDLEtBQUssSUFENEIsQ0FDaEQsVUFEZ0Q7O0FBRW5ELG9CQUFVLEtBQUssSUFBTCxDQUFVLFdBQXBCO0FBQ0Q7QUFDRCxZQUFJLE9BQUosRUFBYTtBQUNYLHFCQUFXLFlBQVgsQ0FBd0IsT0FBeEIsRUFBaUMsT0FBakM7QUFDRCxTQUZELE1BRU87QUFDTCxxQkFBVyxXQUFYLENBQXVCLE9BQXZCO0FBQ0Q7QUFDRCxlQUFPLEtBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBUDtBQUNEO0FBaEZIO0FBQUE7QUFBQSxvQ0FrRmdCO0FBQUE7O0FBQ1osZUFBTyxLQUFLLFNBQUwsQ0FBZSxNQUFmLEVBQXVCLFlBQU07QUFDbEMsY0FBSSxPQUFPLEVBQVg7QUFDQSxZQUFFLElBQUYsQ0FBTyxPQUFLLElBQVosRUFBa0IsVUFBQyxPQUFELEVBQVUsR0FBVjtBQUFBLG1CQUFrQixLQUFLLElBQUwsQ0FBVSxRQUFRLE9BQVIsQ0FBZ0IsU0FBaEIsRUFBMkIsR0FBM0IsQ0FBVixDQUFsQjtBQUFBLFdBQWxCO0FBQ0EsaUJBQU8sT0FBSyxPQUFMLENBQWEsVUFBYixFQUF5QixLQUFLLElBQUwsQ0FBVSxHQUFWLENBQXpCLENBQVA7QUFDRCxTQUpNLENBQVA7QUFLRDtBQXhGSDtBQUFBO0FBQUEsc0NBMEZrQjtBQUFBOztBQUNkLGVBQU8sS0FBSyxTQUFMLENBQWUsT0FBTyxlQUFQLENBQWYsRUFBeUMsb0JBQVk7QUFDMUQsY0FBSSxDQUFDLFFBQUQsSUFBYyxFQUFFLElBQUYsQ0FBTyxPQUFLLElBQVosV0FBeUIsT0FBSyxRQUE5QixFQUEwQyxNQUExQyxHQUFtRCxDQUFyRSxFQUF5RTtBQUFFO0FBQVM7QUFDcEYsY0FBSSxVQUFVLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFkO0FBQ0MsaUJBQUssV0FBTjtBQUNBLFlBQUUsWUFBRixDQUFlLE9BQWYsRUFBd0IsV0FBeEIsRUFBcUMsVUFBckM7QUFDQSxZQUFFLFlBQUYsQ0FBZSxPQUFmLEVBQXdCLGdCQUF4QixFQUEwQyxnQkFBMUM7QUFDQSxZQUFFLFlBQUYsQ0FBZSxPQUFmLEVBQXdCLGVBQXhCLEVBQXlDLG1CQUF6QztBQUNBLFlBQUUsWUFBRixDQUFlLE9BQWYsRUFBd0IsT0FBeEIsRUFBaUMsT0FBSyxRQUF0QztBQUNBLGlCQUFPLE9BQUssVUFBTCxDQUFnQixPQUFoQixDQUFQO0FBQ0QsU0FUTSxDQUFQO0FBVUQ7QUFyR0g7O0FBQUE7QUFBQSxJQUE0QyxHQUFHLE1BQS9DO0FBdUdBLGdCQUFjLFNBQWQ7QUFDQSxTQUFPLGFBQVA7QUFDRCxDQTNHbUIsRUFBcEI7O0FBNkdBLE9BQU8sRUFBUCxDQUFVLE9BQVYsQ0FBa0IsYUFBbEIsR0FBa0MsYUFBbEM7Ozs7O0FDekhBOzs7O0lBSU0sUSxHQUFhLE9BQU8sRSxDQUFwQixROztBQUVOOzs7O0FBR0EsU0FBUyxLQUFULEVBQWdCO0FBQ2QsU0FBTztBQUNMLGtCQUFjLE1BRFQ7QUFFTCxxQkFBaUIsT0FGWjtBQUdMLG1CQUFlLDBCQUhWO0FBSUwsV0FBTztBQUpGLEdBRE87QUFPZCxRQUFNO0FBQ0osU0FBSyxLQUREO0FBRUosV0FBTztBQUNMLHVCQUFpQiw0Q0FEWjtBQUVMLG9CQUFjO0FBRlQsS0FGSDtBQU1KLFdBQU87QUFDTCxXQUFLO0FBREE7QUFOSDtBQVBRLENBQWhCOztBQW9CQTs7O0FBR0E7Ozs7Ozs7OztjQ2hDYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxNLEdBQVcsRSxDQUFYLE07OztBQUVOLElBQUksV0FBWSxZQUFXO0FBQ3pCLE1BQUksaUJBQWlCLFNBQXJCO0FBQ0E7QUFBQTtBQUFBO0FBQUEsa0NBQ3FCO0FBQ2pCLHlCQUFpQjtBQUNmLDJCQUFpQixHQURGO0FBRWYsaUJBQU87QUFGUSxTQUFqQjtBQUlEO0FBTkg7O0FBUUUsc0JBQVksSUFBWixFQUFrQixLQUFsQixFQUF5QixHQUF6QixFQUE4QjtBQUFBOztBQUM1QixXQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsV0FBSyxLQUFMLEdBQWEsS0FBYjs7QUFGNEIsc0JBR1MsS0FBSyxRQUFMLENBQWMsR0FBZCxDQUhUO0FBQUEsVUFHdkIsSUFIdUIsYUFHdkIsSUFIdUI7QUFBQSxVQUdqQixLQUhpQixhQUdqQixLQUhpQjtBQUFBLFVBR1YsS0FIVSxhQUdWLEtBSFU7QUFBQSxVQUdILFFBSEcsYUFHSCxRQUhHOztBQUk1QixVQUFJLEtBQUosRUFBVztBQUFFLGFBQUssYUFBTCxDQUFtQixLQUFLLElBQXhCLEVBQThCLEtBQTlCO0FBQXVDO0FBQ3BELFVBQUksS0FBSixFQUFXO0FBQUUsYUFBSyxXQUFMLENBQWlCLEtBQUssSUFBdEIsRUFBNEIsRUFBRSxNQUFGLENBQVMsRUFBVCxFQUFhLEtBQWIsRUFBb0IsUUFBcEIsQ0FBNUI7QUFBNkQ7QUFDMUUsVUFBSSxJQUFKLEVBQVU7QUFBRSxhQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsRUFBc0IsUUFBdEI7QUFBa0M7QUFDL0M7O0FBZkg7QUFBQTtBQUFBLCtCQWlCVyxHQWpCWCxFQWlCZ0I7QUFDWixZQUFJLGlCQUFKO0FBQUEsWUFBYyxjQUFkO0FBQUEsWUFBcUIsZUFBckI7QUFBQSxZQUE2QixjQUE3QjtBQUFBLFlBQW9DLGFBQXBDO0FBRFksWUFFUCxLQUZPLEdBRW1CLEdBRm5CLENBRVAsS0FGTztBQUFBLFlBRUEsSUFGQSxHQUVtQixHQUZuQixDQUVBLElBRkE7QUFBQSxZQUVNLFNBRk4sR0FFbUIsR0FGbkIsQ0FFTSxTQUZOOztBQUdaLFlBQUksU0FBUyxHQUFHLFFBQUgsQ0FBWSxLQUFaLENBQWIsRUFBaUM7QUFDL0IsY0FBSSxhQUFKO0FBRCtCLHdCQUVELE1BRkM7QUFFN0IsY0FGNkIsV0FFN0IsSUFGNkI7QUFFdkIsZUFGdUIsV0FFdkIsS0FGdUI7QUFFaEIsY0FGZ0IsV0FFaEIsSUFGZ0I7QUFFVixlQUZVLFdBRVYsS0FGVTs7QUFHL0IscUJBQVcsRUFBRSxlQUFGLENBQWtCLFVBQVUsS0FBVixFQUFsQixDQUFYO0FBQ0EsZUFBSyxJQUFMLEdBQVksRUFBRSxNQUFGLENBQVMsRUFBVCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWjtBQUNEO0FBQ0QsZUFBTyxFQUFDLFVBQUQsRUFBTyxZQUFQLEVBQWMsWUFBZCxFQUFxQixrQkFBckIsRUFBUDtBQUNEO0FBM0JIO0FBQUE7QUFBQSxpQ0E2QmEsSUE3QmIsRUE2Qm1CLFFBN0JuQixFQTZCNkI7QUFDekIsWUFBSSxZQUFZLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxLQUFLLEtBQWxCLEVBQXlCLFFBQXpCLENBQWhCO0FBQ0EsWUFBSSxXQUFXLFNBQVMsYUFBVCxDQUF1QixLQUFLLEdBQUwsSUFBWSxLQUFuQyxDQUFmO0FBQ0EsWUFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFBRSxlQUFLLGFBQUwsQ0FBbUIsUUFBbkIsRUFBNkIsS0FBSyxLQUFsQztBQUEyQztBQUM3RCxhQUFLLFdBQUwsQ0FBaUIsUUFBakIsRUFBMkIsU0FBM0I7QUFDQSxlQUFPLEtBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsWUFBckIsQ0FBa0MsUUFBbEMsRUFBNEMsS0FBSyxJQUFqRCxDQUFQO0FBQ0Q7QUFuQ0g7QUFBQTtBQUFBLG9DQXFDZ0IsSUFyQ2hCLEVBcUNzQixLQXJDdEIsRUFxQzZCO0FBQ3pCLGVBQU8sRUFBRSxJQUFGLENBQU8sS0FBUCxFQUFjLFVBQVMsS0FBVCxFQUFnQixJQUFoQixFQUFzQjtBQUN6QyxpQkFBTyxFQUFFLFlBQUYsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCLEtBQUssWUFBTCxDQUFrQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsS0FBN0IsQ0FBbEIsQ0FBM0IsQ0FBUDtBQUNELFNBRk0sRUFHTCxJQUhLLENBQVA7QUFJRDtBQTFDSDtBQUFBO0FBQUEsa0NBNENjLElBNUNkLEVBNENvQixLQTVDcEIsRUE0QzJCO0FBQ3ZCLFlBQUksQ0FBQyxFQUFFLGFBQUYsQ0FBZ0IsS0FBaEIsQ0FBTCxFQUE2QjtBQUMzQixjQUFJLGFBQWEsS0FBSyxZQUFMLENBQWtCLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBbEIsQ0FBakI7QUFDQSxpQkFBTyxFQUFFLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFVBQWhCLEdBQ0YsRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixVQUFoQixLQUErQixPQUQ3QixZQUMwQyxVQUQxQyxDQUFQO0FBRUQ7QUFDRjtBQWxESDtBQUFBO0FBQUEsa0NBb0RjLElBcERkLEVBb0RvQixNQXBEcEIsRUFvRDRCLEtBcEQ1QixFQW9EbUM7QUFDL0IsWUFBSSxpQkFBSjtBQUFBLFlBQWMsa0JBQWQ7QUFDQSxZQUFJLEVBQUUsWUFBWSxlQUFlLE1BQWYsQ0FBZCxDQUFKLEVBQTJDO0FBQUUsaUJBQU8sS0FBUDtBQUFlO0FBQzVELFlBQUssV0FBVyxFQUFFLFlBQUYsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEtBQWdDLEVBQWhELEVBQXFEO0FBQ25ELHNCQUFVLFFBQVYsR0FBcUIsU0FBckIsR0FBaUMsS0FBakM7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxLQUFQO0FBQ0Q7QUFDRjtBQTVESDtBQUFBO0FBQUEsbUNBOERlLEtBOURmLEVBOERzQjtBQUFBOztBQUNsQixlQUFPLEVBQUUsa0JBQUYsQ0FBcUIsS0FBckIsRUFBNEIsbUJBQVc7QUFDNUMsa0JBQVEsT0FBUjtBQUNFLGlCQUFLLE1BQUw7QUFDRSxxQkFBTyxLQUFLLFNBQUwsQ0FBZSxNQUFLLElBQXBCLENBQVA7QUFDRixpQkFBSyxRQUFMO0FBQ0UscUJBQU8sTUFBSyxLQUFaO0FBQ0Y7QUFDRSxxQkFBTyxNQUFLLElBQUwsQ0FBVSxPQUFWLENBQVA7QUFOSjtBQVFILFNBVFEsQ0FBUDtBQVVEO0FBekVIOztBQUFBO0FBQUE7QUEyRUEsV0FBUyxTQUFUO0FBQ0EsU0FBTyxRQUFQO0FBQ0QsQ0EvRWMsRUFBZjs7QUFpRkE7Ozs7O0FBS0EsR0FBRyxLQUFILENBQVMsU0FBVCxDQUFtQixPQUFPLHVCQUFQLENBQW5CLEVBQW9EO0FBQUEsU0FDbEQsRUFBRSxJQUFGLENBQU8sRUFBRSxJQUFGLENBQU8sUUFBUCxFQUFpQixpQkFBakIsQ0FBUCxFQUE0QyxVQUFTLElBQVQsRUFBZSxLQUFmLEVBQXNCO0FBQ2hFLFFBQUksT0FBTyxFQUFFLGlCQUFGLENBQW9CLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsVUFBaEIsQ0FBcEIsQ0FBWDtBQUNBLE1BQUUsSUFBRixDQUFPLElBQVAsRUFBYTtBQUFBLGFBQU8sSUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixLQUFuQixFQUEwQixHQUExQixDQUFQO0FBQUEsS0FBYjtBQUNBLFdBQU8sRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixVQUFoQixFQUE0QixJQUE1QixDQUFQO0FBQ0QsR0FKRCxDQURrRDtBQUFBLENBQXBEOztBQVFBLEdBQUcsUUFBSCxHQUFjLEVBQUUsS0FBRixDQUFRLEVBQUUsUUFBVixDQUFkOzs7OztjQ25HYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxDLEdBQU0sRSxDQUFOLEM7SUFDQSxNLEdBQVcsRSxDQUFYLE07SUFDQSxLLEdBQVUsRSxDQUFWLEs7OztBQUVOLEVBQUUsU0FBRixHQUFjLFVBQVMsS0FBVCxFQUFnQjtBQUM1QixNQUFJLGFBQUo7QUFDQSxNQUFJLFlBQVksS0FBWixJQUFzQixNQUFNLE1BQU4sS0FBaUIsQ0FBM0MsRUFBK0M7QUFBRTtBQUFTO0FBQzFELE1BQUksTUFBTSxnQkFBVixFQUE0QjtBQUFFO0FBQVM7O0FBSFgsa0JBS2IsUUFMYTtBQUFBLE1BS3RCLElBTHNCLGFBS3RCLElBTHNCOztBQU01QixNQUFJLE9BQU8sTUFBTSxNQUFqQjtBQUNBLFNBQU8sSUFBUCxFQUFhO0FBQ1gsUUFBSSxDQUFDLElBQUQsSUFBVSxTQUFTLFFBQXZCLEVBQWtDO0FBQUU7QUFBUTtBQUM1QyxXQUFPLEVBQUUsWUFBRixDQUFlLElBQWYsRUFBcUIsTUFBckIsQ0FBUDtBQUNBLFFBQUksSUFBSixFQUFVO0FBQUU7QUFBUTtBQUNwQixXQUFPLEtBQUssVUFBWjtBQUNEO0FBQ0QsTUFBSSxDQUFDLElBQUwsRUFBVztBQUFFO0FBQVM7QUFDdEIsU0FBTyxVQUFVLElBQVYsQ0FBUDtBQUNBLE1BQUksZ0JBQWdCLE1BQU0sR0FBTixDQUFVLE9BQU8scUJBQVAsQ0FBVixDQUFwQjs7QUFFQSxNQUFJLFNBQVMsRUFBRSxZQUFGLENBQWUsSUFBZixFQUFxQixRQUFyQixDQUFiO0FBQ0EsTUFBSSxVQUFXLFdBQVcsT0FBdEIsSUFBa0MsQ0FBQyxhQUF2QyxFQUFzRDtBQUFFO0FBQVM7O0FBRWpFLE1BQUssS0FBSyxDQUFMLE1BQVksR0FBYixJQUFxQixFQUFFLFNBQUYsRUFBekIsRUFBd0M7QUFDdEMsUUFBSSxLQUFLLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNuQixVQUFJLG1CQUFpQixPQUFPLGNBQVAsQ0FBakIsR0FBMEMsSUFBOUM7QUFDQSxVQUFJLE1BQU0sWUFBTixDQUFtQixXQUFuQixDQUFKLEVBQXFDO0FBQ25DLGNBQU0sT0FBTixDQUFjLFdBQWQsRUFBMkIsRUFBM0I7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFNLE9BQU4sQ0FBYyxPQUFPLHFCQUFQLENBQWQsRUFDRSxFQUFDLGFBQVksRUFBRSxVQUFILEVBQVgsR0FBOEIsSUFBL0IsRUFERjtBQUVEO0FBQ0Y7QUFDRCxXQUFPLEVBQUUsY0FBRixDQUFpQixLQUFqQixDQUFQO0FBQ0QsR0FYRCxNQVdPLElBQUksRUFBRSxjQUFGLENBQWlCLElBQWpCLENBQUosRUFBNEI7QUFDakMsUUFBSSxlQUFKO0FBQ0EsUUFBSSxFQUFFLGFBQUYsQ0FBZ0IsSUFBaEIsQ0FBSixFQUEyQjtBQUFFLGVBQVMsT0FBTyxZQUFQLENBQW9CLEVBQUUsVUFBRixFQUFwQixFQUFvQyxJQUFwQyxDQUFUO0FBQXFEO0FBQ2xGLFFBQUksVUFBVSxJQUFkLEVBQW9CO0FBQUUsZUFBUyxJQUFUO0FBQWdCOztBQUV0QyxRQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBbkIsS0FBOEIsQ0FBQyxFQUFFLG1CQUFGLENBQXNCLE1BQXRCLENBQW5DLEVBQWtFO0FBQ2hFLGFBQU8sRUFBRSxZQUFGLENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQixRQUEvQixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxPQUFOLENBQWMsT0FBTyxxQkFBUCxDQUFkLEVBQTZDLEVBQUMsY0FBRCxFQUE3QztBQUNBLFVBQUksQ0FBQyxNQUFMLEVBQWE7QUFBRSxlQUFPLEVBQUUsY0FBRixDQUFpQixLQUFqQixDQUFQO0FBQWlDO0FBQ2pEO0FBQ0Y7QUFDRixDQTNDRDs7Ozs7Y0NOYSxNO0lBQVAsRSxXQUFBLEU7SUFDQSxNLEdBQVcsRSxDQUFYLE07O0FBRU47O0FBQ0EsT0FBTyx1QkFBUCxFQUF5QyxjQUF6QztBQUNBLE9BQU8scUJBQVAsRUFBeUMsWUFBekM7QUFDQSxPQUFPLDhCQUFQLEVBQXlDLHFCQUF6QztBQUNBLE9BQU8sd0JBQVAsRUFBeUMsZUFBekM7QUFDQSxPQUFPLHVCQUFQLEVBQXlDLFNBQXpDO0FBQ0EsT0FBTyw0QkFBUCxFQUF5QyxtQkFBekM7QUFDQSxPQUFPLHlCQUFQLEVBQXlDLGdCQUF6QztBQUNBLE9BQU8sa0JBQVAsRUFBeUMsYUFBekM7QUFDQSxPQUFPLHlCQUFQLEVBQXlDLG1CQUF6QztBQUNBLE9BQU8sb0JBQVAsRUFBeUMsa0JBQXpDO0FBQ0EsT0FBTywwQkFBUCxFQUF5Qyx1QkFBekM7QUFDQSxPQUFPLHlCQUFQLEVBQXlDLHNCQUF6QztBQUNBLE9BQU8sU0FBUCxFQUF5QyxXQUF6QztBQUNBLE9BQU8sb0JBQVAsRUFBeUMsY0FBekM7QUFDQSxPQUFPLHVCQUFQLEVBQXlDLFlBQXpDO0FBQ0EsT0FBTyxvQkFBUCxFQUF5QyxZQUF6Qzs7QUFFQTtBQUNBLE9BQU8sd0JBQVAsRUFBeUMsVUFBekM7O0FBRUE7QUFDQSxPQUFPLGVBQVAsRUFBd0MsYUFBeEM7QUFDQSxPQUFPLGNBQVAsRUFBd0MsWUFBeEM7QUFDQSxPQUFPLGlCQUFQLEVBQXdDLGVBQXhDO0FBQ0EsT0FBTyxrQkFBUCxFQUF3QyxXQUF4QztBQUNBLE9BQU8sa0JBQVAsRUFBd0MsV0FBeEM7QUFDQSxPQUFPLGtCQUFQLEVBQXdDLGlCQUF4Qzs7QUFFQTtBQUNBLE9BQU8saUJBQVAsRUFBd0MsZUFBeEM7QUFDQSxPQUFPLG1CQUFQLEVBQXdDLGtCQUF4QztBQUNBLE9BQU8sb0JBQVAsRUFBd0MsbUJBQXhDO0FBQ0EsT0FBTyxhQUFQLEVBQXdDLFdBQXhDLEUsQ0FBaUU7QUFDakUsT0FBTyxzQkFBUCxFQUF3QyxxQkFBeEM7QUFDQSxPQUFPLHNCQUFQLEVBQXdDLHNCQUF4QyxFLENBQWlFO0FBQ2pFLE9BQU8sdUJBQVAsRUFBd0Msc0JBQXhDO0FBQ0EsT0FBTyxjQUFQLEVBQXdDLGFBQXhDO0FBQ0EsT0FBTyx1QkFBUCxFQUF3QyxvQkFBeEM7QUFDQSxPQUFPLGdCQUFQLEVBQXdDLGNBQXhDO0FBQ0EsT0FBTyxhQUFQLEVBQXdDLGFBQXhDO0FBQ0EsT0FBTyxxQkFBUCxFQUF3QyxvQkFBeEM7QUFDQSxPQUFPLG9CQUFQLEVBQXdDLG1CQUF4QztBQUNBLE9BQU8scUJBQVAsRUFBd0Msb0JBQXhDO0FBQ0EsT0FBTyxlQUFQLEVBQXdDLGFBQXhDO0FBQ0EsT0FBTyxTQUFQLEVBQXdDLFFBQXhDO0FBQ0EsT0FBTyxxQkFBUCxFQUF3QyxvQkFBeEM7QUFDQSxPQUFPLDZCQUFQLEVBQXdDLDRCQUF4QztBQUNBLE9BQU8scUJBQVAsRUFBd0Msb0JBQXhDO0FBQ0EsT0FBTyxnQkFBUCxFQUF3QyxlQUF4QztBQUNBLE9BQU8saUJBQVAsRUFBd0MsZ0JBQXhDO0FBQ0EsT0FBTyxzQkFBUCxFQUF3QyxxQkFBeEM7QUFDQSxPQUFPLG9CQUFQLEVBQXdDLGtCQUF4QztBQUNBLE9BQU8sMkJBQVAsRUFBd0MseUJBQXhDO0FBQ0EsT0FBTyxrQkFBUCxFQUF3QyxpQkFBeEM7QUFDQSxPQUFPLHNCQUFQLEVBQXdDLHFCQUF4QztBQUNBLE9BQU8sdUJBQVAsRUFBd0Msc0JBQXhDO0FBQ0EsT0FBTyxrQkFBUCxFQUF3QyxjQUF4Qzs7QUFFQTtBQUNBLE9BQU8sc0JBQVAsRUFBeUMscUJBQXpDO0FBQ0EsT0FBTyxtQkFBUCxFQUF5QyxrQkFBekM7QUFDQSxPQUFPLGlCQUFQLEVBQXlDLGdCQUF6QztBQUNBLE9BQU8scUJBQVAsRUFBeUMsb0JBQXpDO0FBQ0EsT0FBTyxvQkFBUCxFQUF5QyxtQkFBekM7QUFDQSxPQUFPLGdCQUFQLEVBQXlDLGVBQXpDO0FBQ0EsT0FBTyxrQkFBUCxFQUF5QyxpQkFBekM7QUFDQSxPQUFPLG1CQUFQLEVBQXlDLGtCQUF6QztBQUNBLE9BQU8sY0FBUCxFQUF5QyxjQUF6QztBQUNBLE9BQU8saUJBQVAsRUFBeUMsZ0JBQXpDO0FBQ0EsT0FBTyx3QkFBUCxFQUF5Qyx1QkFBekM7QUFDQSxPQUFPLGtCQUFQLEVBQXlDLGlCQUF6QztBQUNBLE9BQU8sMEJBQVAsRUFBeUMseUJBQXpDO0FBQ0EsT0FBTyxjQUFQLEVBQXlDLGFBQXpDO0FBQ0EsT0FBTyxjQUFQLEVBQXlDLGFBQXpDOztBQUVBO0FBQ0EsT0FBTyx1QkFBUCxFQUF5QyxVQUF6QztBQUNBLE9BQU8sa0JBQVAsRUFBeUMsUUFBekM7QUFDQSxPQUFPLG9CQUFQLEVBQXlDLFVBQXpDO0FBQ0EsT0FBTyxtQkFBUCxFQUF5QyxTQUF6Qzs7QUFFQTtBQUNBLE9BQU8sZ0JBQVAsRUFBeUMsR0FBekM7QUFDQSxPQUFPLGlCQUFQLEVBQXlDLElBQXpDO0FBQ0EsT0FBTyxpQkFBUCxFQUF5QyxRQUF6Qzs7QUFFQSxPQUFPLDJCQUFQLEVBQXlDLHNCQUF6QztBQUNBLE9BQU8sZ0JBQVAsRUFBeUMsWUFBekM7QUFDQSxPQUFPLG9CQUFQLEVBQTBDLEVBQUMsS0FBSyxLQUFOLEVBQWEsS0FBSyxRQUFsQixFQUExQztBQUNBLE9BQU8sZUFBUCxFQUEwQyxFQUFDLEtBQUssS0FBTixFQUFhLEtBQUssS0FBbEIsRUFBeUIsS0FBSyxRQUE5QixFQUExQztBQUNBLE9BQU8scUJBQVAsRUFBd0MsY0FBeEM7Ozs7O2NDOUZhLE07SUFBUCxFLFdBQUEsRTtJQUNBLEMsR0FBTSxFLENBQU4sQztJQUNBLEssR0FBVSxFLENBQVYsSztJQUNBLE0sR0FBVyxFLENBQVgsTTs7O0FBRU4sSUFBSSx5QkFBeUIsT0FBTyx3QkFBUCxDQUE3Qjs7QUFFQSxFQUFFLGdCQUFGLEdBQXFCO0FBQUEsU0FBVyxRQUFRLE9BQVIsQ0FBZ0IsT0FBaEIsRUFBeUIsRUFBekIsRUFBNkIsT0FBN0IsQ0FBcUMsS0FBckMsRUFBNEMsRUFBNUMsRUFBZ0QsT0FBaEQsQ0FBd0QsS0FBeEQsRUFBK0QsRUFBL0QsQ0FBWDtBQUFBLENBQXJCOztBQUVBLEVBQUUsV0FBRixHQUFnQixVQUFTLEdBQVQsRUFBYyxPQUFkLEVBQXVCO0FBQ3JDLE1BQUksV0FBVyxJQUFmLEVBQXFCO0FBQUUsY0FBVSxFQUFWO0FBQWU7QUFDdEMsTUFBSSxHQUFKLEVBQVM7QUFDUCxXQUFPLE1BQU0sR0FBTixHQUFZLE9BQW5CO0FBQ0Q7QUFDRCxTQUFPLEdBQVA7QUFDRCxDQU5EOztBQVFBLEVBQUUsT0FBRixHQUFZLFVBQVMsR0FBVCxFQUFjLE9BQWQsRUFBdUI7QUFDakMsTUFBSSxXQUFXLElBQWYsRUFBcUI7QUFBRSxjQUFVLEVBQVY7QUFBZTtBQUN0QyxNQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUFFLFdBQU8sR0FBUDtBQUFhO0FBQ2hDLE1BQUksUUFBUSxNQUFNLEdBQU4sQ0FBVSxzQkFBVixDQUFaO0FBQ0EsTUFBSSxNQUFNLElBQUksT0FBSixDQUFZLEdBQVosQ0FBVjtBQUNBLE1BQUksUUFBUSxDQUFDLENBQWIsRUFBZ0I7QUFDZCxjQUFVLElBQUksU0FBSixDQUFjLE1BQU0sQ0FBcEIsRUFBdUIsSUFBSSxNQUEzQixDQUFWO0FBQ0EsVUFBTSxJQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLEdBQWpCLENBQU47QUFDRDtBQUNELFlBQVUsRUFBRSxnQkFBRixDQUFtQixPQUFuQixDQUFWO0FBQ0EsTUFBSSxDQUFDLE1BQU0sT0FBTixLQUFrQixJQUFsQixHQUF5QixNQUFNLE9BQU4sRUFBZSxHQUFmLENBQXpCLEdBQStDLFNBQWhELEtBQThELElBQWxFLEVBQXdFO0FBQUUsV0FBTyxNQUFNLE9BQU4sRUFBZSxHQUFmLENBQVA7QUFBNkI7QUFDdkcsU0FBTyxHQUFQO0FBQ0QsQ0FaRDs7QUFjQSxFQUFFLGNBQUYsR0FBbUIsVUFBUyxHQUFULEVBQWM7QUFDL0IsTUFBSSxRQUFRLE1BQU0sR0FBTixDQUFVLHNCQUFWLENBQVo7QUFDQSxNQUFLLE9BQU8sSUFBUixJQUFrQixTQUFTLElBQS9CLEVBQXNDO0FBQ3BDLFVBQU0sRUFBRSxVQUFGLENBQWEsR0FBYixDQUFOO0FBQ0EsUUFBSSxTQUFTLEVBQUUsZ0JBQUYsQ0FBbUIsR0FBbkIsRUFBd0IsRUFBRSxhQUFGLEVBQXhCLENBQWI7QUFDQSxhQUFTLEVBQUUsZ0JBQUYsQ0FBbUIsTUFBbkIsQ0FBVDtBQUNBLFdBQVEsTUFBTSxNQUFOLEtBQWlCLElBQXpCLEVBQWdDO0FBQzlCLFVBQUksSUFBSSxPQUFPLFdBQVAsQ0FBbUIsR0FBbkIsQ0FBUjtBQUNBLFVBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxpQkFBUyxFQUFUO0FBQ0E7QUFDRDtBQUNELGVBQVMsT0FBTyxTQUFQLENBQWlCLENBQWpCLEVBQW1CLENBQW5CLENBQVQ7QUFDRDtBQUNELFVBQU0sTUFBTjtBQUNEO0FBQ0QsU0FBTyxHQUFQO0FBQ0QsQ0FqQkQ7O0FBbUJBLEVBQUUsaUJBQUYsR0FBc0IsVUFBUyxLQUFULEVBQWdCLFVBQWhCLEVBQTRCLE9BQTVCLEVBQXFDO0FBQ3pELE1BQUksV0FBVyxJQUFmLEVBQXFCO0FBQUUsY0FBVSxFQUFWO0FBQWU7QUFDdEMsTUFBSSxDQUFDLFVBQUQsSUFBZ0IsV0FBVyxNQUFYLEtBQXNCLENBQTFDLEVBQThDO0FBQUUsV0FBTyxJQUFQO0FBQWM7O0FBRTlELE1BQUksT0FBTyxFQUFFLE9BQUYsQ0FBVSxLQUFWLEVBQWlCLE9BQWpCLENBQVg7QUFDQSxNQUFJLENBQUMsSUFBRCxJQUFVLEtBQUssTUFBTCxLQUFnQixDQUE5QixFQUFrQztBQUFFLFdBQU8sSUFBUDtBQUFjOztBQUVsRDtBQUNBLE1BQUssS0FBSyxNQUFMLEtBQWdCLENBQWpCLEtBQXlCLEtBQUssQ0FBTCxNQUFZLEVBQWIsSUFBcUIsS0FBSyxDQUFMLE1BQVksR0FBekQsQ0FBSixFQUFvRTtBQUFFLFdBQU8sSUFBUDtBQUFjOztBQUVwRixNQUFJLFdBQVcsS0FBZjtBQUNBLE1BQUksWUFBWSxFQUFFLEdBQUYsQ0FBTSxVQUFOLEVBQWtCLFVBQVMsSUFBVCxFQUFlO0FBQy9DLFFBQUksRUFBRSx5QkFBRixDQUE0QixLQUFLLENBQWpDLEVBQW9DLElBQXBDLENBQUosRUFBK0M7QUFDN0MsaUJBQVcsSUFBWDtBQUNELEtBRkQsTUFFTyxJQUFJLEtBQUssQ0FBTCxDQUFPLE1BQVgsRUFBbUI7QUFDeEIsVUFBSSxFQUFFLHlCQUFGLENBQTRCLEtBQUssQ0FBakMsRUFBb0MsSUFBcEMsQ0FBSixFQUErQztBQUFFLGVBQU8sSUFBUDtBQUFjO0FBQ2hFO0FBQ0QsV0FBTyxLQUFQO0FBQ0QsR0FQZSxDQUFoQjs7QUFTQSxNQUFJLFNBQUosRUFBZTtBQUFFLFdBQU8sS0FBUDtBQUFlLEdBQWhDLE1BQXNDO0FBQUUsV0FBTyxRQUFQO0FBQWtCO0FBQzNELENBckJEOztBQXVCQSxFQUFFLHlCQUFGLEdBQThCLFVBQUMsS0FBRCxFQUFRLElBQVI7QUFBQSxTQUFpQixFQUFFLEdBQUYsQ0FBTSxLQUFOLEVBQWE7QUFBQSxXQUFRLEVBQUUsdUJBQUYsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsQ0FBUjtBQUFBLEdBQWIsQ0FBakI7QUFBQSxDQUE5Qjs7QUFFQSxFQUFFLHVCQUFGLEdBQTZCLFlBQVc7QUFDdEMsTUFBSSxRQUFRLEVBQVo7QUFDQSxNQUFJLFlBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBaEI7QUFDQSxNQUFJLFVBQVUsU0FBVixPQUFVLENBQVMsS0FBVCxFQUFnQjtBQUM1QixRQUFJLFFBQVEsTUFBTSxNQUFOLENBQWEsTUFBTSxNQUFOLEdBQWUsQ0FBNUIsQ0FBWjtBQUNBLFdBQU8sTUFBTSxJQUFOLENBQVksTUFBTSxDQUFOLE1BQWEsQ0FBZCxJQUFxQixNQUFNLENBQU4sTUFBYSxDQUFsQyxHQUF1QyxDQUF2QyxHQUEyQyxDQUF0RCxDQUFQO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLFNBQVMsU0FBVCxNQUFTLENBQVMsS0FBVCxFQUFnQjtBQUMzQixRQUFJLFFBQVEsTUFBTSxNQUFOLENBQWEsTUFBTSxNQUFOLEdBQWUsQ0FBNUIsQ0FBWjtBQUNBLFdBQU8sTUFBTSxJQUFOLENBQVksTUFBTSxDQUFOLE1BQWEsQ0FBZCxJQUFxQixNQUFNLENBQU4sTUFBYSxDQUFsQyxHQUF1QyxDQUF2QyxHQUEyQyxDQUF0RCxDQUFQO0FBQ0QsR0FIRDs7QUFLQSxNQUFJLFVBQVUsU0FBVixPQUFVLENBQVMsS0FBVCxFQUFnQixJQUFoQixFQUFzQjtBQUNsQyxRQUFJLFFBQVEsTUFBTSxNQUFOLENBQWEsTUFBTSxNQUFOLEdBQWUsQ0FBNUIsQ0FBWjtBQUNBLFdBQU8sTUFBTSxJQUFOLENBQVcsTUFBTSxDQUFOLE1BQWEsQ0FBYixHQUFpQixDQUFqQixHQUFxQixDQUFoQyxDQUFQO0FBQ0QsR0FIRDs7QUFLQSxTQUFPLFVBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7QUFDMUIsUUFBSSxNQUFTLElBQVQsU0FBaUIsSUFBckIsQ0FEMEIsQ0FDRztBQUM3QixRQUFJLFNBQVMsTUFBTSxHQUFOLENBQWI7QUFDQSxRQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUFFLGFBQU8sTUFBUDtBQUFnQjs7QUFFdEMsUUFBSSxTQUFTLEVBQUUsR0FBRixDQUFNLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBTixFQUF1QixVQUFTLElBQVQsRUFBZTtBQUNqRCxVQUFJLENBQUMsQ0FBRCxLQUFPLFVBQVUsT0FBVixDQUFrQixJQUFsQixDQUFYLEVBQW9DO0FBQUUsZUFBTyxJQUFQO0FBQWM7QUFDcEQsVUFBSSxDQUFDLENBQUQsS0FBTyxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQVgsRUFBK0I7QUFBRSxlQUFPLENBQVA7QUFBVyxPQUE1QyxNQUFrRDtBQUFFLGVBQU8sQ0FBUDtBQUFXO0FBQ2hFLEtBSFksQ0FBYjs7QUFLQSxRQUFJLE9BQU8sTUFBUCxHQUFnQixDQUFwQixFQUF1QjtBQUNyQixVQUFJLFFBQVEsRUFBWjtBQURxQjtBQUFBO0FBQUE7O0FBQUE7QUFFckIsNkJBQWtCLE1BQU0sSUFBTixDQUFXLE1BQVgsQ0FBbEIsOEhBQXNDO0FBQUEsY0FBN0IsS0FBNkI7O0FBQ3BDLGtCQUFRLEtBQVI7QUFDRSxpQkFBSyxHQUFMO0FBQVUsc0JBQVEsS0FBUixFQUFnQjtBQUMxQixpQkFBSyxHQUFMO0FBQVUscUJBQU8sS0FBUCxFQUFlO0FBQ3pCLGlCQUFLLEdBQUw7QUFBVSxzQkFBUSxLQUFSLEVBQWdCO0FBQzFCO0FBQVMsb0JBQU0sSUFBTixDQUFXLEtBQVg7QUFKWDtBQU1EO0FBVG9CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBVXJCLGVBQVMsTUFBTSxDQUFOLENBQVQ7QUFDRCxLQVhELE1BV087QUFDTCxlQUFTLE9BQU8sQ0FBUCxDQUFUO0FBQ0Q7O0FBRUQsV0FBTyxNQUFNLEdBQU4sSUFBYSxNQUFwQjtBQUNELEdBMUJEO0FBMkJELENBN0MyQixFQUE1Qjs7Ozs7QUMxRUEsSUFBSSxLQUFLLE9BQU8sRUFBaEI7QUFDQSxJQUFJLElBQUksR0FBRyxDQUFYO0FBQ0EsSUFBSSxTQUFTLEdBQUcsTUFBaEI7O0FBRUEsRUFBRSxhQUFGLEdBQW9CLFlBQU07QUFDeEIsTUFBSSxtQkFBSjtBQUNBLGVBQWEsSUFBYjtBQUNBLFNBQU8sWUFBTTtBQUNYLFFBQUksY0FBYyxJQUFsQixFQUF3QjtBQUN0QixtQkFBYSxFQUFFLE9BQUYsS0FBYyxPQUFPLFNBQXJCLEdBQW9DLFNBQVMsUUFBVCxDQUFrQixRQUF0RCxVQUFtRSxPQUFPLEtBQTFFLEdBQWtGLE9BQU8sU0FBdEc7QUFDRDtBQUNELFdBQU8sVUFBUDtBQUNELEdBTEQ7QUFNRCxDQVRpQixFQUFsQjs7QUFXQSxFQUFFLFdBQUYsR0FBZ0Isb0JBQVk7QUFDMUIsTUFBSSxrQkFBSjtBQUNBLGNBQVksT0FBTyxZQUFQLENBQW9CLEVBQUUsVUFBRixFQUFwQixFQUF1QyxRQUF2QyxPQUFaO0FBQ0EsTUFBSSxPQUFPLFVBQVAsQ0FBa0IsU0FBbEIsQ0FBSixFQUFrQztBQUNoQyxXQUFPO0FBQ0wsYUFBTyxPQUFPLG1CQUFQLENBQTJCLFNBQTNCLENBREY7QUFFTCxpQkFBVyxPQUFPLGVBQVAsQ0FBdUIsU0FBdkI7QUFGTixLQUFQO0FBSUQsR0FMRCxNQUtPO0FBQ0wsV0FBTztBQUNMLGFBQU8sRUFERjtBQUVMLGlCQUFXO0FBRk4sS0FBUDtBQUlEO0FBQ0YsQ0FkRDs7QUFnQkEsRUFBRSxpQkFBRixHQUFzQixVQUFDLE1BQUQsRUFBUyxJQUFULEVBQWtCO0FBQ3RDLE1BQUksZ0JBQUo7QUFDQSxNQUFJLG1CQUFKO0FBQ0EsTUFBSSxRQUFRLElBQVosRUFBa0I7QUFDaEIsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxXQUFTLEVBQUUsY0FBRixDQUFpQixNQUFqQixDQUFUO0FBQ0EsZUFBYSxFQUFFLFNBQUYsQ0FBWSxFQUFFLGtCQUFGLENBQXFCLE1BQXJCLENBQVosQ0FBYjtBQUNBLE1BQUksSUFBSixFQUFVO0FBQ1IsZUFBVyxPQUFPLFNBQVAsQ0FBWCxJQUFnQyxJQUFoQztBQUNBLGVBQVcsT0FBTyxTQUFQLENBQVgsSUFBZ0MsSUFBaEM7QUFDRDtBQUNELFlBQVUsRUFBRSxNQUFGLENBQVMsRUFBRSxTQUFGLEVBQVQsRUFBd0IsVUFBeEIsQ0FBVjtBQUNBLFlBQVUsRUFBRSxpQkFBRixDQUFvQixPQUFwQixDQUFWO0FBQ0E7QUFDQSxTQUFPLE9BQVA7QUFDRCxDQWhCRDs7QUFrQkEsRUFBRSxnQkFBRixHQUFxQixVQUFDLE1BQUQsRUFBUyxJQUFULEVBQWtCO0FBQ3JDLE1BQUksaUJBQUo7QUFDQSxNQUFJLG9CQUFKO0FBQ0EsTUFBSSxRQUFRLElBQVosRUFBa0I7QUFDaEIsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxhQUFXLEVBQUUsaUJBQUYsQ0FBb0IsTUFBcEIsRUFBNEIsSUFBNUIsQ0FBWDtBQUNBLGdCQUFjLEVBQUUsa0JBQUYsQ0FBcUIsUUFBckIsQ0FBZDtBQUNBLE1BQUksWUFBWSxNQUFaLEtBQXVCLENBQTNCLEVBQThCO0FBQzVCLFdBQU8sRUFBUDtBQUNELEdBRkQsTUFFTztBQUNMLGlCQUFXLFdBQVg7QUFDRDtBQUNGLENBYkQ7O0FBZUEsRUFBRSxTQUFGLEdBQWMsa0JBQVU7QUFDdEIsTUFBSSxpQkFBSjtBQUNBLE1BQUksaUJBQUo7QUFDQSxNQUFJLGdCQUFKO0FBQ0EsTUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsYUFBUyxVQUFVLFNBQVMsUUFBVCxDQUFrQixJQUE1QixDQUFUO0FBQ0Q7QUFDRCxZQUFVLEVBQUUsVUFBRixFQUFWO0FBQ0EsYUFBVyxFQUFFLFFBQUYsQ0FBVyxNQUFYLENBQVg7QUFDQSxNQUFJLGFBQWEsRUFBRSxRQUFGLENBQVcsT0FBWCxDQUFqQixFQUFzQztBQUNwQyxXQUFPLElBQVA7QUFDRDtBQUNELGFBQVcsRUFBRSxXQUFGLENBQWMsT0FBZCxDQUFYO0FBQ0EsU0FBTyxDQUFDLGFBQWEsV0FBYixJQUE0QixhQUFhLFlBQTFDLEtBQTJELGFBQWEsRUFBRSxVQUFGLENBQWEsT0FBYixDQUEvRTtBQUNELENBZEQ7O0FBZ0JBLEVBQUUsYUFBRixHQUFrQixrQkFBVTtBQUMxQixNQUFJLG1CQUFKO0FBQ0EsTUFBSSxxQkFBSjtBQUNBLE1BQUksR0FBRyxLQUFILENBQVMsR0FBVCxDQUFhLEdBQUcsTUFBSCxDQUFVLGtCQUFWLENBQWIsQ0FBSixFQUFpRDtBQUMvQyxpQkFBYSxHQUFHLEtBQUgsQ0FBUyxHQUFULENBQWEsR0FBRyxNQUFILENBQVUsdUJBQVYsQ0FBYixDQUFiO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsaUJBQWEsRUFBRSxhQUFGLEVBQWI7QUFDRDtBQUNELGlCQUFlLE9BQU8sU0FBUCxDQUFpQixDQUFqQixFQUFvQixXQUFXLE1BQS9CLENBQWY7QUFDQSxTQUFPLGlCQUFpQixVQUF4QjtBQUNELENBVkQ7O0FBWUEsRUFBRSxpQkFBRixHQUFzQixtQkFBVztBQUMvQixNQUFJLHdCQUFKO0FBQ0EsTUFBSSw4QkFBSjtBQUNBLE1BQUksMkJBQUo7QUFDQSxNQUFJLDBCQUFKO0FBQ0EsTUFBSSx1QkFBSjtBQUNBLE1BQUksd0JBQUo7QUFDQSxNQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixjQUFVLEVBQVY7QUFDRDtBQUNELHVCQUFxQixPQUFPLG9CQUFQLENBQXJCO0FBQ0EsbUJBQWlCLE9BQU8sZ0JBQVAsQ0FBakI7QUFDQSxvQkFBa0IsT0FBTyxpQkFBUCxDQUFsQjtBQUNBLHNCQUFvQixPQUFPLG1CQUFQLENBQXBCO0FBQ0EsMEJBQXdCLE9BQU8sdUJBQVAsQ0FBeEI7QUFDQSxvQkFBa0IsT0FBTyxpQkFBUCxDQUFsQjtBQUNBLE1BQUksQ0FBQyxRQUFRLGVBQVIsQ0FBTCxFQUErQjtBQUM3QixZQUFRLGVBQVIsSUFBMkIsSUFBM0I7QUFDRDtBQUNELFVBQVEsZUFBUixJQUEyQixJQUEzQjtBQUNBLE1BQUksQ0FBQyxRQUFRLGlCQUFSLENBQUwsRUFBaUM7QUFDL0IsWUFBUSxpQkFBUixJQUE2QixJQUE3QjtBQUNEO0FBQ0QsTUFBSSxDQUFDLFFBQVEscUJBQVIsQ0FBTCxFQUFxQztBQUNuQyxZQUFRLHFCQUFSLElBQWlDLElBQWpDO0FBQ0Q7QUFDRCxNQUFJLENBQUMsUUFBUSxrQkFBUixDQUFMLEVBQWtDO0FBQ2hDLFlBQVEsa0JBQVIsSUFBOEIsSUFBOUI7QUFDRDtBQUNELFNBQU8sT0FBUDtBQUNELENBOUJEOztBQWdDQSxFQUFFLGNBQUYsR0FBbUIsb0JBQVk7QUFDN0IsTUFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLGVBQVcsRUFBWDtBQUNEO0FBQ0QsYUFBVyxTQUFTLE9BQVQsQ0FBaUIsU0FBakIsRUFBNEIsR0FBNUIsQ0FBWDtBQUNBLE1BQUksU0FBUyxDQUFULE1BQWdCLEdBQWhCLElBQXVCLFNBQVMsQ0FBVCxNQUFnQixHQUEzQyxFQUFnRDtBQUM5QyxlQUFXLFNBQVMsU0FBVCxDQUFtQixDQUFuQixDQUFYO0FBQ0Q7QUFDRCxTQUFPLFFBQVA7QUFDRCxDQVREOztBQVdBLEVBQUUsV0FBRixHQUFnQixlQUFPO0FBQ3JCLE1BQUssT0FBTyxJQUFSLElBQWlCLElBQUksTUFBSixDQUFXLENBQUMsQ0FBWixNQUFtQixHQUF4QyxFQUE2QztBQUMzQyxXQUFPLEdBQVA7QUFDRDtBQUNELFNBQU8sR0FBUDtBQUNELENBTEQ7O0FBT0EsRUFBRSxtQkFBRixHQUEwQixZQUFNO0FBQzlCLE1BQUksK0JBQUo7QUFDQSwyQkFBeUIsQ0FBQyxFQUFELEVBQUssTUFBTCxFQUFhLE9BQWIsRUFBc0IsTUFBdEIsRUFBOEIsT0FBOUIsQ0FBekI7QUFDQSxTQUFPLGtCQUFVO0FBQ2YsUUFBSSxZQUFKO0FBQ0EsUUFBSSxlQUFKO0FBQ0EsUUFBSSxFQUFFLGFBQUYsQ0FBZ0IsTUFBaEIsQ0FBSixFQUE2QjtBQUMzQixhQUFPLEtBQVA7QUFDRDtBQUNELGFBQVMsT0FBTyxTQUFQLENBQWlCLEVBQUUsYUFBRixHQUFrQixNQUFuQyxDQUFUO0FBQ0EsVUFBTSxFQUFFLGdCQUFGLENBQW1CLE1BQW5CLEVBQTJCLFdBQTNCLEVBQU47QUFDQSxXQUFPLHVCQUF1QixRQUF2QixDQUFnQyxHQUFoQyxDQUFQO0FBQ0QsR0FURDtBQVVELENBYnVCLEVBQXhCOzs7OztBQzlJQTs7QUFFQSxJQUFJLE9BQU8sU0FBUCxDQUFpQixJQUFqQixJQUF5QixJQUE3QixFQUFtQztBQUNqQyxTQUFPLFNBQVAsQ0FBaUIsSUFBakIsR0FBd0IsWUFBVztBQUNqQyxXQUFPLEtBQUssT0FBTCxDQUFhLFlBQWIsRUFBMkIsRUFBM0IsQ0FBUDtBQUNELEdBRkQ7QUFHRDs7QUFFRCxJQUFJLE9BQU8sU0FBUCxDQUFpQixTQUFqQixJQUE4QixJQUFsQyxFQUF3QztBQUN0QyxTQUFPLFNBQVAsQ0FBaUIsU0FBakIsR0FBNkIsT0FBTyxTQUFQLENBQWlCLFFBQTlDO0FBQ0Q7O0FBRUQsSUFBSSxPQUFPLFNBQVAsQ0FBaUIsT0FBakIsSUFBNEIsSUFBaEMsRUFBc0M7QUFDcEMsU0FBTyxTQUFQLENBQWlCLE9BQWpCLEdBQTJCLE9BQU8sU0FBUCxDQUFpQixTQUE1QztBQUNEOzs7OztBQ2ZELElBQUksS0FBSyxRQUFRLE1BQVIsQ0FBVDtBQUNBLElBQUksU0FBUyxHQUFHLE1BQWhCOztBQUVBLE9BQU8sU0FBUCxFQUFrQixTQUFsQjtBQUNBLE9BQU8sc0JBQVAsRUFBK0IsY0FBL0I7O0FBRUEsT0FBTyx5QkFBUCxFQUFrQyx3QkFBbEM7QUFDQSxPQUFPLDZCQUFQLEVBQXNDLDRCQUF0Qzs7QUFFQSxPQUFPLHFCQUFQLEVBQThCLG9CQUE5QjtBQUNBLE9BQU8scUJBQVAsRUFBOEIsb0JBQTlCO0FBQ0EsT0FBTyxlQUFQLEVBQXdCLGNBQXhCO0FBQ0EsT0FBTyxxQkFBUCxFQUE4QixvQkFBOUI7QUFDQTtBQUNBLE9BQU8saUJBQVAsRUFBMEIsOEJBQTFCO0FBQ0EsT0FBTyxtQkFBUCxFQUE0Qiw0QkFBNUI7QUFDQSxPQUFPLG1CQUFQLEVBQTRCLHNCQUE1QjtBQUNBLE9BQU8sbUJBQVAsRUFBNEIsOEJBQTVCO0FBQ0EsT0FBTyxnQkFBUCxFQUF5QixzQkFBekI7QUFDQSxPQUFPLHNCQUFQLEVBQStCLDBCQUEvQjtBQUNBLE9BQU8sa0JBQVAsRUFBMkIsY0FBM0I7O0FBRUEsT0FBTyxrQkFBUCxFQUEwQixrQkFBMUI7QUFDQSxPQUFPLGdCQUFQLEVBQXlCLGdCQUF6QjtBQUNBLE9BQU8sbUJBQVAsRUFBNEIsRUFBNUI7QUFDQSxPQUFPLG9CQUFQLEVBQTZCLGdCQUE3QjtBQUNBLE9BQU8sd0JBQVAsRUFBaUMsaUJBQWpDO0FBQ0EsT0FBTyxrQkFBUCxFQUEyQixxQkFBM0I7QUFDQSxPQUFPLGtCQUFQLEVBQTJCLENBQTNCO0FBQ0EsT0FBTyxpQkFBUCxFQUEwQixnQkFBMUI7QUFDQSxPQUFPLG9CQUFQLEVBQTZCLFVBQTdCO0FBQ0EsT0FBTyxlQUFQLEVBQXdCLFNBQXhCO0FBQ0EsT0FBTyxrQkFBUCxFQUEyQixRQUEzQjtBQUNBLE9BQU8sa0JBQVAsRUFBMkIsUUFBM0I7QUFDQSxPQUFPLGlCQUFQLEVBQTBCLE9BQTFCO0FBQ0EsT0FBTyxpQkFBUCxFQUEwQixrQkFBMUI7O0FBSUM7QUFDRCxPQUFPLGNBQVAsRUFBc0IsZ0JBQXRCO0FBQ0EsT0FBTyxXQUFQLEVBQW1CLFlBQW5CO0FBQ0EsT0FBTyxTQUFQLEVBQWlCLFVBQWpCO0FBQ0EsT0FBTyxZQUFQLEVBQXFCLFdBQXJCOztBQUVBLE9BQU8sY0FBUCxFQUFzQixVQUF0QjtBQUNBLE9BQU8sZ0JBQVAsRUFBd0IsWUFBeEI7QUFDQSxPQUFPLGVBQVAsRUFBd0IsaUJBQXhCO0FBQ0EsT0FBTyxvQkFBUCxFQUE2QixVQUE3QjtBQUNBLE9BQU8scUJBQVAsRUFBOEIsWUFBOUI7QUFDQSxPQUFPLG1CQUFQLEVBQTRCLGdCQUE1QjtBQUNBLE9BQU8sd0JBQVAsRUFBaUMscUJBQWpDO0FBQ0EsT0FBTyxnQkFBUCxFQUF5Qiw0QkFBekI7QUFDQSxPQUFPLGdCQUFQLEVBQXlCLG1CQUF6QjtBQUNBLE9BQU8sZUFBUCxFQUF3QixjQUF4QjtBQUNBLE9BQU8sd0JBQVAsRUFBaUMsb0JBQWpDO0FBQ0EsT0FBTyxxQkFBUCxFQUE4QiwyQkFBOUI7QUFDQSxPQUFPLDBCQUFQLEVBQW1DLHlCQUFuQzs7QUFHQSxPQUFPLG1CQUFQLEVBQTRCLGVBQTVCOztBQUVBLE9BQU8sY0FBUCxFQUF1QixhQUF2QjtBQUNBLE9BQU8sWUFBUCxFQUFxQixlQUFyQjs7QUFFQSxPQUFPLHNCQUFQLEVBQStCLGdCQUEvQjtBQUNBLE9BQU8sa0JBQVAsRUFBMkIsaUJBQTNCO0FBQ0EsT0FBTyx3QkFBUCxFQUFpQyx1QkFBakM7QUFDQSxPQUFPLDZCQUFQLEVBQXNDLDRCQUF0QztBQUNBLE9BQU8sd0JBQVAsRUFBaUMsdUJBQWpDO0FBQ0EsT0FBTyxpQkFBUCxFQUEwQixnQkFBMUI7QUFDQSxPQUFPLGdCQUFQLEVBQXlCLGVBQXpCO0FBQ0EsT0FBTyxxQ0FBUCxFQUE4QyxvQ0FBOUM7QUFDQSxPQUFPLGdDQUFQLEVBQXlDLCtCQUF6QztBQUNBLE9BQU8sZ0NBQVAsRUFBeUMsK0JBQXpDOztBQUVBLE9BQU8sb0JBQVAsRUFBNkIsbUJBQTdCO0FBQ0EsT0FBTywyQkFBUCxFQUFvQywwQkFBcEM7QUFDQSxPQUFPLDRCQUFQLEVBQXFDLGtDQUFyQztBQUNBLE9BQU8scUJBQVAsRUFBOEIsb0NBQTlCO0FBQ0EsT0FBTyxtQkFBUCxFQUE0QixvQ0FBNUI7QUFDQSxPQUFPLHNCQUFQLEVBQStCLHFCQUEvQjs7QUFHQSxPQUFPLHlCQUFQLEVBQWtDLHdCQUFsQztBQUNBLE9BQU8sZ0JBQVAsRUFBeUIsZUFBekI7QUFDQSxPQUFPLGtCQUFQLEVBQTJCLGlCQUEzQjtBQUNBLE9BQU8sa0JBQVAsRUFBMkIscUJBQTNCOzs7Ozs7QUN2RkE7QUFDQSxJQUFJLE9BQU8sRUFBUCxLQUFjLFNBQWxCLEVBQTZCO0FBQzNCLFNBQU8sRUFBUCxHQUFZLEVBQVo7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsT0FBTyxFQUF4Qjs7Ozs7OztBQ0xBLFFBQVEsV0FBUjtBQUNBLFFBQVEsOEJBQVI7QUFDQSxRQUFRLDZDQUFSO0FBQ0EsUUFBUSx3REFBUjtBQUNBLFFBQVEsOENBQVI7QUFDQSxRQUFRLGtEQUFSO0FBQ0EsUUFBUSw4Q0FBUjtBQUNBLFFBQVEscURBQVI7QUFDQSxRQUFRLDZDQUFSO0FBQ0EsUUFBUSx3REFBUjtBQUNBLFFBQVEsOENBQVI7QUFDQSxRQUFRLGtEQUFSO0FBQ0EsUUFBUSw4Q0FBUjtBQUNBLFFBQVEscURBQVI7QUFDQSxRQUFRLGVBQVI7QUFDQSxRQUFRLDZDQUFSO0FBQ0EsUUFBUSxvQkFBUjtBQUNBLFFBQVEsbUJBQVI7QUFDQSxRQUFRLGtCQUFSO0FBQ0EsUUFBUSx1QkFBUjtBQUNBLFFBQVEsc0JBQVI7QUFDQSxRQUFRLGlDQUFSO0FBQ0EsUUFBUSw2QkFBUjtBQUNBLFFBQVEsZUFBUjs7Ozs7QUN2QkEsSUFBSSxLQUFLLFFBQVEsY0FBUixDQUFUO0FBQ0EsSUFBSSxTQUFTLEdBQUcsTUFBaEI7QUFDQSxJQUFJLElBQUksR0FBRyxDQUFYO0FBQ0EsSUFBSSxRQUFRLEdBQUcsS0FBZjs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0IsT0FBTyxvQkFBUCxDQUFoQixFQUE4QyxZQUFLO0FBQ2pELE1BQUksUUFBUSxFQUFFLE1BQUYsRUFBUyxDQUFULENBQVo7QUFDQSxNQUFJLE9BQU8sTUFBTSxHQUFOLENBQVUsT0FBTyxjQUFQLENBQVYsQ0FBWDtBQUNBLE1BQUcsU0FBUyxJQUFULElBQWlCLFNBQVMsRUFBN0IsRUFBZ0M7QUFDOUIsTUFBRSxZQUFGLENBQWUsS0FBZixFQUFzQixNQUF0QixFQUE4QixJQUE5QjtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxNQUFNLFNBQU4sQ0FBZ0IsT0FBTyxnQkFBUCxDQUFoQixFQUEwQztBQUFBLFNBQVMsVUFBVSxFQUFWLElBQWdCLE1BQU0sT0FBTixDQUFjLE9BQU8sZ0JBQVAsQ0FBZCxFQUF3QyxHQUF4QyxDQUF6QjtBQUFBLENBQTFDOzs7Ozs7O0FDYkEsSUFBTSxLQUFLLFFBQVEsaUJBQVIsQ0FBWDs7SUFFTSxPLEdBQ0osaUJBQWEsTUFBYixFQUFxQixJQUFyQixFQUEyQixPQUEzQixFQUFvQztBQUFBOztBQUNsQyxTQUFPLGlCQUFQLENBQXlCLE9BQXpCLEVBQWtDLGtCQUFVO0FBQzFDLFFBQUcsTUFBSCxFQUFXO0FBQ1QsV0FBSyxLQUFMO0FBQ0Q7QUFDRixHQUpEO0FBS0QsQzs7QUFHSCxHQUFHLGdCQUFILENBQW9CLFNBQXBCLEVBQStCLE9BQS9COzs7Ozs7Ozs7QUNaQSxJQUFNLEtBQUssUUFBUSxpQkFBUixDQUFYO0FBQ0EsSUFBTSxJQUFJLEdBQUcsQ0FBYjtBQUNBLElBQUksSUFBSSxHQUFHLENBQVg7QUFDQSxJQUFJLGVBQWUsUUFBUSwyQkFBUixDQUFuQjtBQUNBLElBQUksWUFBWSxRQUFRLHdCQUFSLENBQWhCOztJQUdNLFU7QUFDSixzQkFBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQ2pDLE1BQUUsUUFBRixDQUFXLElBQVgsRUFBaUIsdUJBQWpCO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUcsS0FBSCxDQUFTLFVBQVQsQ0FBb0Isb0JBQXBCLEVBQTBDLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBMUM7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQWhCO0FBQ0EsTUFBRSxnQkFBRixDQUFtQixJQUFuQixFQUF5QixPQUF6QixFQUFrQyxLQUFLLFFBQXZDO0FBQ0Q7Ozs7NkJBRVEsTyxFQUFRO0FBQ2YsVUFBSSxRQUFRLEVBQVo7QUFDQSxVQUFJLFVBQVUsRUFBRSxhQUFGLENBQWdCLEtBQWhCLENBQWQ7QUFDQSxRQUFFLFlBQUYsQ0FBZSxPQUFmLEVBQXdCLEtBQXhCLEVBQStCLE9BQS9CO0FBQ0EsWUFBTSxJQUFOLENBQVcsT0FBWDs7QUFFQSxVQUFHLEVBQUUsWUFBRixDQUFlLEtBQUssSUFBcEIsRUFBMEIsUUFBMUIsQ0FBSCxFQUF3QztBQUN0QyxZQUFJLFFBQVEsRUFBRSxZQUFGLENBQWUsS0FBSyxJQUFwQixFQUEwQixRQUExQixDQUFaO0FBQ0EsVUFBRSxZQUFGLENBQWUsT0FBZixFQUF3QixRQUF4QixFQUFrQyxLQUFsQztBQUNBLGNBQU0sSUFBTixDQUFXLEVBQUUsS0FBRixFQUFTLENBQVQsQ0FBWDtBQUNEOztBQUVELFVBQUksZ0JBQWdCLElBQUksWUFBSixFQUFwQjtBQUNBLGFBQU8sY0FBYyxPQUFkLENBQXNCLEVBQUUsR0FBRixDQUFNLEtBQU4sRUFBYTtBQUFBLGVBQVEsVUFBVSxTQUFWLENBQW9CLElBQXBCLENBQVI7QUFBQSxPQUFiLEVBQWdELElBQWhELENBQXFELEdBQXJELENBQXRCLENBQVA7QUFDRDs7O2dDQUVXLE8sRUFBUTtBQUFBOztBQUNsQixhQUFPLFlBQU07QUFDWCxXQUFHLEtBQUgsQ0FBUyxRQUFULENBQWtCLFlBQWxCLEVBQWdDLEVBQUMsU0FBUyxNQUFLLFFBQUwsQ0FBYyxPQUFkLENBQVYsRUFBa0MsU0FBUSxJQUExQyxFQUFoQztBQUNELE9BRkQ7QUFHRDs7O3dDQUNrQjs7QUFFakIsVUFBSSxNQUFNLEVBQUUsYUFBRixDQUFnQixLQUFoQixFQUF1QixLQUFLLElBQTVCLENBQVY7QUFDQSxRQUFFLFlBQUYsQ0FBZSxHQUFmLEVBQW1CLEtBQW5CLEVBQTBCLEtBQUssZUFBL0I7QUFDQSxRQUFFLFFBQUYsQ0FBVyxHQUFYLEVBQWdCLGdCQUFoQjtBQUNBLGdCQUFVLFdBQVYsQ0FBc0IsS0FBSyxJQUEzQixFQUFpQyxHQUFqQztBQUNBLFFBQUUsZ0JBQUYsQ0FBbUIsR0FBbkIsRUFBd0IsT0FBeEIsRUFBaUMsS0FBSyxRQUF0QztBQUNEOzs7d0JBQ3FCO0FBQ3BCLFVBQUksZ0JBQWdCLElBQUksWUFBSixFQUFwQjtBQUNBLFVBQUksZ0JBQWdCLGNBQWMsWUFBZCxDQUEyQiw0QkFBM0IsRUFBeUQsRUFBRSxVQUFGLEVBQXpELENBQXBCO0FBQ0EsYUFBTyxFQUFFLGVBQUYsQ0FBa0IsYUFBbEIsQ0FBUDtBQUNEOzs7Ozs7QUFHSCxHQUFHLGdCQUFILENBQW9CLFlBQXBCLEVBQWtDLFVBQWxDOzs7OztBQ3BEQSxJQUFJLEtBQUssUUFBUSxjQUFSLENBQVQ7QUFDQSxJQUFJLElBQUksR0FBRyxDQUFYO0FBQ0EsSUFBSSxTQUFTLEdBQUcsTUFBaEI7O0FBRUEsRUFBRSxRQUFGLEdBQWEsVUFBQyxRQUFELEVBQVcsVUFBWCxFQUEwQjtBQUNyQyxNQUFJLFlBQVksT0FBTyxlQUFQLENBQWhCO0FBQ0EsTUFBRyxTQUFILEVBQWM7QUFDWixRQUFJLFdBQVcsRUFBRSxXQUFGLENBQWMsU0FBZCxDQUFmO0FBQ0EsUUFBSSxZQUFhLGVBQWUsU0FBaEIsR0FBNEIsRUFBNUIsR0FBaUMsTUFBSyxFQUFFLGtCQUFGLENBQXFCLFVBQXJCLENBQXREO0FBQ0EsUUFBSSxVQUFXLGFBQWEsU0FBZCxHQUEwQixFQUExQixHQUErQixNQUFLLEVBQUUsa0JBQUYsQ0FBcUIsUUFBckIsQ0FBbEQ7O0FBRUEsb0JBQWMsUUFBZCxHQUF5QixTQUF6QixHQUFxQyxPQUFyQztBQUNBLGFBQVMsUUFBVCxHQUFvQixRQUFwQjtBQUNEO0FBQ0YsQ0FWRDs7QUFZQSxFQUFFLFNBQUYsR0FBYSxVQUFDLEdBQUQsRUFBUTtBQUNuQixNQUFJLFlBQVksT0FBTyxlQUFQLENBQWhCO0FBQ0EsTUFBSSxVQUFVLEVBQUUsVUFBRixFQUFkO0FBQ0EsTUFBSSxlQUFlLEVBQUUsZ0JBQUYsQ0FBbUIsR0FBbkIsRUFBd0IsT0FBeEIsQ0FBbkI7QUFDQSxNQUFJLFdBQVcsRUFBRSxRQUFGLENBQVcsWUFBWCxDQUFmO0FBQ0EsU0FBUSxjQUFjLFFBQXRCO0FBQ0QsQ0FORDs7QUFRQSxFQUFFLE9BQUYsR0FBWSxVQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWtCO0FBQzVCLFNBQVEsVUFBVSxLQUFYLEdBQW9CLENBQXBCLEdBQXVCLENBQUMsQ0FBL0I7QUFDRCxDQUZEOzs7Ozs7Ozs7QUN4QkEsSUFBSSxLQUFLLFFBQVEsY0FBUixDQUFUO0FBQ0EsSUFBSSxJQUFJLEdBQUcsQ0FBWDtBQUNBLElBQUksSUFBSSxHQUFHLENBQVg7QUFDQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCO0FBQ0EsSUFBTSxPQUFPO0FBQ1gsUUFEVyxrQkFDSixHQURJLEVBQ0M7QUFDVixRQUFJLGNBQUo7QUFBQSxRQUFXLGVBQVg7QUFDQSxZQUFRLElBQUksT0FBSixDQUFZLEdBQVosQ0FBUjtBQUNBLFFBQUksVUFBVSxDQUFDLENBQWYsRUFBa0I7QUFDaEIsZUFBUyxJQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLFFBQVEsQ0FBekIsRUFBNEIsV0FBNUIsR0FBMEMsSUFBMUMsRUFBVDtBQUNEO0FBQ0QsV0FBTyxNQUFQO0FBQ0Q7QUFSVSxDQUFiOztJQVVNLFk7Ozt3QkFFTztBQUNULGFBQU8sQ0FBQyxLQUFELEVBQVEsTUFBUixDQUFQO0FBQ0Q7Ozt3QkFFVTtBQUNULGFBQU8sQ0FBQyxNQUFELENBQVA7QUFDRDs7O0FBRUQsMEJBQWE7QUFBQTtBQUNaOzs7OzRCQUVPLEksRUFBSztBQUFBOztBQUNYLFVBQUksUUFBUSxVQUFVLFVBQVYsQ0FBcUIsSUFBckIsQ0FBWjtBQUNBLFFBQUUsSUFBRixDQUFPLEtBQVAsRUFBYyxnQkFBUTtBQUNwQixZQUFHLFVBQVUsYUFBVixDQUF3QixJQUF4QixDQUFILEVBQWtDO0FBQ2hDLFlBQUUsWUFBRixDQUFlLElBQWYsRUFBcUI7QUFBQSxtQkFBUSxNQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBUjtBQUFBLFdBQXJCO0FBQ0Q7QUFDRixPQUpEO0FBS0EsYUFBTyxFQUFFLE1BQUYsQ0FBUyxLQUFULEVBQWdCLFVBQUMsTUFBRCxFQUFTLElBQVQsRUFBa0I7QUFDdkMsa0JBQVUsVUFBVSxTQUFWLENBQW9CLElBQXBCLENBQVY7QUFDQSxlQUFPLE1BQVA7QUFDRCxPQUhNLEVBR0osRUFISSxDQUFQO0FBSUQ7OztnQ0FFVyxJLEVBQUs7QUFBQTs7QUFDZixRQUFFLElBQUYsQ0FBTyxLQUFLLEtBQVosRUFBbUI7QUFBQSxlQUFhLE9BQUssV0FBTCxDQUFpQixJQUFqQixFQUF1QixTQUF2QixDQUFiO0FBQUEsT0FBbkI7QUFDQSxRQUFFLElBQUYsQ0FBTyxLQUFLLEtBQVosRUFBbUI7QUFBQSxlQUFhLE9BQUssV0FBTCxDQUFpQixJQUFqQixFQUF1QixTQUF2QixDQUFiO0FBQUEsT0FBbkI7QUFDQSxhQUFPLElBQVA7QUFDRDs7O2dDQUVXLEksRUFBTSxTLEVBQVc7QUFDM0IsVUFBRyxDQUFDLEVBQUUsWUFBRixDQUFlLElBQWYsRUFBcUIsU0FBckIsQ0FBSixFQUFxQztBQUNuQztBQUNEO0FBQ0QsVUFBSSxRQUFRLEVBQUUsWUFBRixDQUFlLElBQWYsRUFBcUIsU0FBckIsQ0FBWjtBQUNBLFFBQUUsWUFBRixDQUFlLElBQWYsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLEtBQWhCLENBQWhDO0FBQ0Q7OztnQ0FFVyxJLEVBQU0sUyxFQUFVO0FBQzFCLFVBQUcsQ0FBQyxFQUFFLFlBQUYsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLENBQUosRUFBcUM7QUFDbkM7QUFDRDtBQUNELFFBQUUsWUFBRixDQUFlLElBQWYsRUFBcUIsWUFBckIsRUFBbUMsY0FBbkM7QUFDRDs7OytCQUVVLEksRUFBTTtBQUNmLFVBQUcsQ0FBQyxFQUFFLGFBQUYsQ0FBZ0IsSUFBaEIsQ0FBSixFQUEwQjtBQUN4QixlQUFPLElBQVA7QUFDRDtBQUNELFVBQUksVUFBVSxFQUFFLFVBQUYsRUFBZDtBQUNBLFVBQUksVUFBVSxFQUFFLFdBQUYsQ0FBYyxJQUFkLENBQWQ7QUFDQSxhQUFPLEVBQUUsZUFBRixDQUFrQixPQUFsQixFQUEyQixPQUEzQixDQUFQO0FBQ0Q7OztpQ0FDWSxNLEVBQVEsTyxFQUFTO0FBQzVCLFVBQUcsQ0FBQyxLQUFLLGFBQUwsQ0FBbUIsTUFBbkIsQ0FBRCxJQUErQixLQUFLLGFBQUwsQ0FBbUIsT0FBbkIsQ0FBbEMsRUFBK0Q7QUFDN0QsZUFBTyxNQUFQO0FBQ0Q7QUFDRCxVQUFJLFlBQVksS0FBSyxRQUFMLENBQWMsT0FBZCxFQUF1QixLQUF2QixDQUE2QixHQUE3QixDQUFoQjtBQUFBLFVBQ0UsVUFBVSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBRFo7QUFBQSxVQUVFLFNBQVMsT0FBTyxTQUFQLENBQWlCLFFBQVEsTUFBekIsQ0FGWDtBQUFBLFVBR0UsV0FBVyxRQUFRLEtBQVIsQ0FBYyxHQUFkLENBSGI7O0FBS0EsVUFBRyxTQUFTLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUIsU0FBUyxDQUFULENBQTFCLEVBQXVDO0FBQ3JDLGtCQUFVLEdBQVY7QUFDQSxVQUFFLElBQUYsQ0FBTyxRQUFQLEVBQWlCLG1CQUFXO0FBQzFCLGNBQUcsWUFBWSxJQUFmLEVBQXFCO0FBQ25CLHNCQUFVLEdBQVY7QUFDRCxXQUZELE1BRU8sSUFBRyxZQUFZLEdBQWYsRUFBb0I7QUFDekIsc0JBQVUsSUFBVixDQUFlLE9BQWY7QUFDRDtBQUNGLFNBTkQ7QUFPRDs7QUFFRCxrQkFBVSxVQUFVLElBQVYsQ0FBZSxHQUFmLENBQVYsR0FBZ0MsTUFBaEM7QUFDRDs7O2tDQUVhLEcsRUFBSztBQUNqQixhQUFPLENBQUMsR0FBRCxJQUFRLENBQUMsS0FBSyxNQUFMLENBQVksR0FBWixDQUFELElBQXFCLElBQUksSUFBSixHQUFXLE9BQVgsQ0FBbUIsR0FBbkIsQ0FBcEM7QUFDRDs7OzZCQUVRLEcsRUFBSztBQUNaLFVBQUksY0FBSjtBQUNBLFlBQU0sT0FBTyxFQUFiO0FBQ0EsY0FBUSxJQUFJLE9BQUosQ0FBWSxHQUFaLENBQVI7QUFDQSxVQUFJLFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCLGNBQU0sSUFBSSxTQUFKLENBQWMsQ0FBZCxFQUFpQixLQUFqQixDQUFOO0FBQ0Q7QUFDRCxjQUFRLElBQUksT0FBSixDQUFZLEdBQVosQ0FBUjtBQUNBLFVBQUksVUFBVSxDQUFDLENBQWYsRUFBa0I7QUFDaEIsY0FBTSxJQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLEtBQWpCLENBQU47QUFDRDtBQUNELGFBQU8sR0FBUDtBQUNEOzs7Ozs7QUFJSCxPQUFPLE9BQVAsR0FBaUIsWUFBakI7Ozs7O0FDaEhBLElBQUksS0FBSyxRQUFRLGNBQVIsQ0FBVDtBQUFBLElBQ0UsSUFBSSxHQUFHLENBRFQ7QUFBQSxJQUVFLElBQUksR0FBRyxDQUZUOztBQUlBLEVBQUUsZUFBRixHQUFvQixvQkFBWTtBQUM5QixNQUFJLFNBQVMsRUFBRSxRQUFGLEVBQVksQ0FBWixDQUFiO0FBQ0EsU0FBTyxNQUFQO0FBQ0QsQ0FIRDs7Ozs7QUNKQSxJQUFJLEtBQUssUUFBUSxjQUFSLENBQVQ7QUFDQSxJQUFJLElBQUksR0FBRyxDQUFYO0FBQ0EsSUFBSSxVQUFVO0FBQ1osS0FBSSxXQURRO0FBRVosTUFBSSxRQUZRO0FBR1osTUFBSSxRQUhRO0FBSVosTUFBSSxNQUpRO0FBS1osTUFBSSxJQUxRO0FBTVosTUFBSTtBQU5RLENBQWQ7O0FBU0EsRUFBRSxXQUFGLEdBQWdCLFVBQUMsT0FBRCxFQUFhO0FBQzNCLE1BQUcsUUFBUSxPQUFSLENBQUgsRUFBcUI7QUFDbkIsV0FBTyxRQUFRLE9BQVIsQ0FBUDtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU8sU0FBUDtBQUNEO0FBQ0YsQ0FORDs7Ozs7QUNYQSxJQUFJLEtBQUssUUFBUSxjQUFSLENBQVQ7QUFDQSxJQUFJLElBQUksR0FBRyxDQUFYO0FBQ0EsT0FBTyxPQUFQLEdBQWlCOztBQUVmLFlBQVU7QUFDUixrQkFBYyxDQUROO0FBRVIsb0JBQWdCLENBRlI7QUFHUixlQUFXLENBSEg7QUFJUix3QkFBb0IsQ0FKWjtBQUtSLDJCQUF1QixDQUxmO0FBTVIsaUJBQWEsQ0FOTDtBQU9SLGlDQUE2QixDQVByQjtBQVFSLGtCQUFjLENBUk47QUFTUixtQkFBZSxDQVRQO0FBVVIsd0JBQW9CLEVBVlo7QUFXUiw0QkFBd0IsRUFYaEI7QUFZUixtQkFBZTtBQVpQLEdBRks7O0FBaUJmLGFBakJlLHVCQWlCSCxJQWpCRyxFQWlCbUM7QUFBQSxRQUFoQyxNQUFnQyx1RUFBdkIsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXVCOztBQUNoRCxXQUFPLFVBQVUsT0FBTyxXQUFqQixJQUFnQyxPQUFPLFdBQVAsQ0FBbUIsSUFBbkIsQ0FBdkM7QUFDRCxHQW5CYztBQW9CZixhQXBCZSx1QkFvQkgsTUFwQkcsRUFvQkssT0FwQkwsRUFvQmM7QUFDM0IsV0FBTyxVQUFVLE9BQU8sV0FBakIsSUFBZ0MsT0FBTyxXQUFQLENBQW1CLE9BQW5CLENBQXZDO0FBQ0QsR0F0QmM7QUF1QmYsWUF2QmUsc0JBdUJKLElBdkJJLEVBdUJFO0FBQ2YsV0FBTyxRQUFRLEtBQUssVUFBcEI7QUFDRCxHQXpCYztBQTBCZixZQTFCZSxzQkEwQkosSUExQkksRUEwQkU7QUFDZixXQUFPLFFBQVEsS0FBSyxVQUFiLElBQTJCLEVBQWxDO0FBQ0QsR0E1QmM7QUE2QmYsWUE3QmUsc0JBNkJKLElBN0JJLEVBNkJFO0FBQ2YsV0FBTyxLQUFLLFVBQUwsQ0FBZ0IsRUFBRSxhQUFGLENBQWdCLEtBQWhCLEVBQXVCLElBQXZCLENBQWhCLENBQVA7QUFDRCxHQS9CYztBQWdDZixXQWhDZSxxQkFnQ0wsSUFoQ0ssRUFnQ0M7QUFDZCxXQUFPLFFBQVEsS0FBSyxTQUFiLElBQTBCLEVBQWpDO0FBQ0QsR0FsQ2M7QUFtQ2YsYUFuQ2UsdUJBbUNILElBbkNHLEVBbUNHLE9BbkNILEVBbUNXO0FBQ3hCLFdBQU8sS0FBSyxVQUFMLENBQWdCLFlBQWhCLENBQTZCLE9BQTdCLEVBQXNDLEtBQUssV0FBM0MsQ0FBUDtBQUNELEdBckNjO0FBc0NmLE9BdENlLGlCQXNDVCxJQXRDUyxFQXNDSDtBQUNWLFdBQU8sUUFBUSxLQUFLLFNBQXBCO0FBQ0QsR0F4Q2M7QUF5Q2YsTUF6Q2UsZ0JBeUNWLElBekNVLEVBeUNKO0FBQ1QsV0FBTyxRQUFRLEtBQUssUUFBcEI7QUFDRCxHQTNDYztBQTRDZixNQTVDZSxnQkE0Q1YsSUE1Q1UsRUE0Q0o7QUFDVCxXQUFPLFFBQVEsS0FBSyxRQUFwQjtBQUNELEdBOUNjO0FBK0NmLGVBL0NlLHlCQStDRCxJQS9DQyxFQStDSztBQUNsQixXQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsTUFBb0IsS0FBSyxRQUFMLENBQWMsWUFBekM7QUFDRCxHQWpEYztBQWtEZixZQWxEZSxzQkFrREosSUFsREksRUFrREU7QUFDZixXQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsTUFBb0IsS0FBSyxRQUFMLENBQWMsU0FBekM7QUFDRDtBQXBEYyxDQUFqQjs7Ozs7QUNGQSxJQUFJLEtBQUssUUFBUSxjQUFSLENBQVQ7QUFDQSxJQUFJLElBQUksR0FBRyxDQUFYOztBQUVBLEVBQUUsUUFBRixHQUFhLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQXFCO0FBQ2hDLE1BQUksVUFBVSxFQUFFLGlCQUFGLENBQW9CLEdBQXBCLENBQWQ7QUFDQSxNQUFJLFlBQVksRUFBRSxrQkFBRixDQUFxQixHQUFyQixDQUFoQjtBQUNBLE1BQUksWUFBWSxFQUFFLFNBQUYsQ0FBWSxTQUFaLENBQWhCO0FBQ0EsWUFBVSxHQUFWLElBQWlCLEtBQWpCO0FBQ0EsTUFBSSxjQUFjLEVBQUUsYUFBRixDQUFnQixHQUFoQixDQUFsQjtBQUNBLGdCQUFjLEVBQUUsVUFBRixDQUFhLFdBQWIsQ0FBZDs7QUFFQSxNQUFJLGFBQWMsWUFBWSxFQUFiLEdBQWtCLE9BQWxCLEdBQTRCLE1BQUssT0FBbEQ7O0FBRUEsTUFBSSxtQkFBbUIsR0FBRyxDQUFILENBQUssa0JBQUwsQ0FBd0IsU0FBeEIsQ0FBdkI7QUFDQSxNQUFJLGVBQWdCLHFCQUFxQixFQUF0QixHQUEwQixnQkFBMUIsR0FBNEMsTUFBTSxnQkFBckU7QUFDQSxTQUFPLGNBQWMsWUFBZCxHQUE2QixVQUFwQztBQUNELENBYkQ7O0FBZUEsRUFBRSxXQUFGLEdBQWdCLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDOUIsTUFBSSxVQUFVLEVBQUUsaUJBQUYsQ0FBb0IsR0FBcEIsQ0FBZDtBQUNBLE1BQUksWUFBWSxFQUFFLGtCQUFGLENBQXFCLEdBQXJCLENBQWhCO0FBQ0EsTUFBSSxZQUFZLEVBQUUsU0FBRixDQUFZLFNBQVosQ0FBaEI7QUFDQSxZQUFVLEtBQVYsSUFBbUIsSUFBbkI7QUFDQSxNQUFJLGNBQWMsRUFBRSxhQUFGLENBQWdCLEdBQWhCLENBQWxCO0FBQ0EsZ0JBQWMsRUFBRSxVQUFGLENBQWEsV0FBYixDQUFkOztBQUVBLE1BQUksYUFBYyxZQUFZLEVBQWIsR0FBa0IsT0FBbEIsR0FBNEIsTUFBSyxPQUFsRDs7QUFFQSxNQUFJLG1CQUFtQixHQUFHLENBQUgsQ0FBSyxrQkFBTCxDQUF3QixTQUF4QixDQUF2QjtBQUNBLE1BQUksZUFBZ0IscUJBQXFCLEVBQXRCLEdBQTBCLGdCQUExQixHQUE0QyxNQUFNLGdCQUFyRTtBQUNBLFNBQU8sY0FBYyxZQUFkLEdBQTZCLFVBQXBDO0FBQ0QsQ0FiRDs7QUFlQSxFQUFFLGVBQUYsR0FBb0IsVUFBQyxHQUFELEVBQVE7QUFDMUI7QUFDQSxNQUFJLGVBQUo7QUFBQSxNQUFZLGVBQVo7QUFDQSxNQUFHLENBQUMsRUFBRSxTQUFGLENBQVksR0FBWixDQUFKLEVBQXFCO0FBQ25CLFFBQUksVUFBVSxFQUFFLFVBQUYsRUFBZDtBQUNBLFFBQUcsRUFBRSxhQUFGLENBQWdCLEdBQWhCLENBQUgsRUFBd0I7QUFDdEIsZUFBUyxHQUFUO0FBQ0QsS0FGRCxNQUdJO0FBQ0YsZUFBUyxFQUFFLGdCQUFGLENBQW1CLEdBQW5CLEVBQXdCLElBQXhCLENBQVQ7QUFDQSxlQUFTLEVBQUUsY0FBRixDQUFrQixFQUFFLGdCQUFGLENBQW9CLEdBQXBCLEVBQXlCLE9BQXpCLENBQWxCLENBQVQ7QUFDQSxpQkFBUyxPQUFULEdBQW1CLE1BQW5CLFdBQStCLG1CQUFtQixNQUFuQixDQUEvQjtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEdBQVA7QUFDRCxDQWZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7ICQgfSA9IHJoO1xyXG5sZXQgeyBjb25zdHMgfSA9IHJoO1xyXG5cclxucmgubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnRVZUX1BST0pFQ1RfTE9BREVEJyksICAoKSA9PlxyXG4gIHJoLm1vZGVsLnN1YnNjcmliZShjb25zdHMoJ0tFWV9NRVJHRURfUFJPSkVDVF9NQVAnKSwgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgb3JpZ2luID0gXy5nZXRQcm9qZWN0TmFtZShfLmZpbGVQYXRoKCkpO1xyXG4gICAgcmV0dXJuIHJoLm1vZGVsLnB1Ymxpc2goY29uc3RzKCdLRVlfVE9QSUNfT1JJR0lOJyksIG9yaWdpbik7XHJcbiAgfSlcclxuKTtcclxuXHJcbnZhciBDb250ZW50RmlsdGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gIGxldCBub25UZXh0Tm9kZXMgPSB1bmRlZmluZWQ7XHJcbiAgQ29udGVudEZpbHRlciA9IGNsYXNzIENvbnRlbnRGaWx0ZXIgZXh0ZW5kcyByaC5XaWRnZXQge1xyXG4gICAgc3RhdGljIGluaXRDbGFzcygpIHtcclxuXHJcbiAgICAgIG5vblRleHROb2RlcyA9IFsnSU1HJywnT0JKRUNUJywnVklERU8nXTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2ZW50Q2xpY2soZSkge1xyXG4gICAgICBfLnByZXZlbnREZWZhdWx0KGUpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcbiAgICAgIHN1cGVyKGNvbmZpZyk7XHJcbiAgICAgIHRoaXMub25UYWdFeHByID0gdGhpcy5vblRhZ0V4cHIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5pZHMgPSBjb25maWcuaWRzO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IGNvbmZpZy5jbGFzc05hbWUgfHwgJ3JoLWhpZGUnO1xyXG4gICAgICB0aGlzLm5vZGUgPSBjb25maWcubm9kZTtcclxuICAgICAgdGhpcy5ob3ZlckNsYXNzID0gJ3JoLXRhZy1jb250ZW50LWhvdmVyJztcclxuICAgICAgdGhpcy5zdXBDbGFzcyA9ICdyaC1hcHBsaWVkLXRhZyc7XHJcbiAgICAgIHRoaXMuY3JlYXRlVGFnTm9kZSgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuaWRzKSB7XHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUoY29uc3RzKCdLRVlfVE9QSUNfT1JJR0lOJyksICgpID0+IHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZShjb25zdHMoJ0tFWV9UQUdfRVhQUkVTU0lPTicpLCB0aGlzLm9uVGFnRXhwcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmguX2RlYnVnKSB7XHJcbiAgICAgICAgcmguX2QoJ2Vycm9yJywgJ2RhdGEtdGFncyB3aXRob3V0IGFueSB0YWcgY29tYmluYXRpb24nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uVGFnRXhwcih0YWdFeHBycykge1xyXG4gICAgICBsZXQgb3JpZ2luID0gdGhpcy5nZXQoY29uc3RzKCdLRVlfVE9QSUNfT1JJR0lOJykpO1xyXG4gICAgICBpZiAoIXRoaXMuZ2V0KCd0YWdzJykpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSBfLnVuaW9uKHRoaXMuaWRzLCBpZCA9PiBfLmdldFRhZ3MoaWQsIG9yaWdpbikpO1xyXG4gICAgICAgIHRoaXMucHVibGlzaCgndGFncycsIHRoaXMudGFncy5qb2luKCcsJykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgYXBwbHkgPSAhXy5hbnkodGhpcy5pZHMsIGlkID0+IF8uZXZhbFRhZ0V4cHJlc3Npb24oaWQsIHRhZ0V4cHJzLCBvcmlnaW4pKTtcclxuICAgICAgdGhpcy50b2dnbGVDbGFzcyhhcHBseSk7XHJcbiAgICAgIGlmICh0aGlzLmNsYXNzTmFtZSAhPT0gJ3JoLWhpZGUnKSB7IHRoaXMudG9nZ2xlQ2xpY2soYXBwbHkpOyB9XHJcbiAgICAgIHJldHVybiB0aGlzLmFwcGxpZWQgPSBhcHBseTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVDbGFzcyhhcHBseSkge1xyXG4gICAgICBpZiAoYXBwbHkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXBwbGllZCkgeyByZXR1cm4gJC5hZGRDbGFzcyh0aGlzLm5vZGUsIHRoaXMuY2xhc3NOYW1lKTsgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAkLnJlbW92ZUNsYXNzKHRoaXMubm9kZSwgdGhpcy5jbGFzc05hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ2xpY2soYWRkRXZlbnQpIHtcclxuICAgICAgaWYgKGFkZEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFwcGxpZWQpIHsgcmV0dXJuIF8uYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm5vZGUsICdjbGljaycsIHRoaXMucHJldmVudENsaWNrKTsgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLmFwcGxpZWQpIHsgcmV0dXJuIF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLm5vZGUsICdjbGljaycsIHRoaXMucHJldmVudENsaWNrKTsgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Ib3ZlcigpIHtcclxuICAgICAgcmV0dXJuICQuYWRkQ2xhc3ModGhpcy5ub2RlLCB0aGlzLmhvdmVyQ2xhc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgIHJldHVybiAkLnJlbW92ZUNsYXNzKHRoaXMubm9kZSwgdGhpcy5ob3ZlckNsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmROb2RlKHN1cE5vZGUpIHtcclxuICAgICAgbGV0IHBhcmVudE5vZGUgPSB0aGlzLm5vZGU7XHJcbiAgICAgIGxldCBzaWJsaW5nID0gbnVsbDtcclxuICAgICAgaWYgKG5vblRleHROb2Rlcy5pbmRleE9mKHRoaXMubm9kZS5ub2RlTmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgKHsgcGFyZW50Tm9kZSB9ID0gdGhpcy5ub2RlKTtcclxuICAgICAgICBzaWJsaW5nID0gdGhpcy5ub2RlLm5leHRTaWJsaW5nO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzaWJsaW5nKSB7XHJcbiAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3VwTm9kZSwgc2libGluZyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChzdXBOb2RlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlRGF0YUF0dHJzKHN1cE5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFwdE5hbWVzKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmUoJ3RhZ3MnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuICAgICAgICBfLmVhY2godGhpcy50YWdzLCAoY3VycmVudCwgaWR4KSA9PiBkYXRhLnB1c2goY3VycmVudC5yZXBsYWNlKFwiYXR0X3NlcFwiLCBcIjpcIikpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaXNoKCdzaG93dGFncycsIGRhdGEuam9pbignLCcpKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVGFnTm9kZSgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlKGNvbnN0cygnS0VZX1NIT1dfVEFHUycpLCAgc2hvd1RhZ3MgPT4ge1xyXG4gICAgICAgIGlmICghc2hvd1RhZ3MgfHwgKCQuZmluZCh0aGlzLm5vZGUsIGBzdXAuJHt0aGlzLnN1cENsYXNzfWApLmxlbmd0aCA+IDApKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGxldCBzdXBOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3VwJyk7XHJcbiAgICAgICAgKHRoaXMuZ2V0QXB0TmFtZXMpKCk7XHJcbiAgICAgICAgJC5zZXRBdHRyaWJ1dGUoc3VwTm9kZSwgJ2RhdGEtdGV4dCcsICdzaG93dGFncycpO1xyXG4gICAgICAgICQuc2V0QXR0cmlidXRlKHN1cE5vZGUsICdkYXRhLW1vdXNlb3ZlcicsICd0aGlzLm9uSG92ZXIoKScpO1xyXG4gICAgICAgICQuc2V0QXR0cmlidXRlKHN1cE5vZGUsICdkYXRhLW1vdXNlb3V0JywgJ3RoaXMub25Nb3VzZU91dCgpJyk7XHJcbiAgICAgICAgJC5zZXRBdHRyaWJ1dGUoc3VwTm9kZSwgJ2NsYXNzJywgdGhpcy5zdXBDbGFzcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwZW5kTm9kZShzdXBOb2RlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBDb250ZW50RmlsdGVyLmluaXRDbGFzcygpO1xyXG4gIHJldHVybiBDb250ZW50RmlsdGVyO1xyXG59KSgpO1xyXG5cclxud2luZG93LnJoLndpZGdldHMuQ29udGVudEZpbHRlciA9IENvbnRlbnRGaWx0ZXI7XHJcbiIsIi8qXHJcbiBIZWxwIGZvciBFZHdpZGdldFxyXG4qL1xyXG5cclxubGV0IHsgZWRXaWRnZXQgfSA9IHdpbmRvdy5yaDtcclxuXHJcbi8qXHJcbiBUYWIgZWR3aWRnZXRcclxuKi9cclxuZWRXaWRnZXQoJ3RhYicsIHtcclxuICBhdHRyczoge1xyXG4gICAgJ2RhdGEtdGFibGUnOiAnZGF0YScsXHJcbiAgICAnZGF0YS1yaHdpZGdldCc6ICdCYXNpYycsXHJcbiAgICAnZGF0YS1vdXRwdXQnOiAnZGF0YTogZWR3LmRhdGEuI3tAaW5kZXh9JyxcclxuICAgIGNsYXNzOiAncHJpbnQtb25seSdcclxuICB9LFxyXG4gIHZpZXc6IHtcclxuICAgIHRhZzogJ2RpdicsXHJcbiAgICBhdHRyczoge1xyXG4gICAgICAnZGF0YS1yaHdpZGdldCc6ICdCYXNpYzogaW5jbHVkZTogZWR3aWRnZXRzL3RhYi90YWJMYXlvdXQuanMnLFxyXG4gICAgICAnZGF0YS1pbnB1dCc6ICdkYXRhOiBlZHcuZGF0YS4je0BpbmRleH0nXHJcbiAgICB9LFxyXG4gICAgbW9kZWw6IHtcclxuICAgICAgdGFiOiAnMCdcclxuICAgIH1cclxuICB9XHJcbn1cclxuKTtcclxuXHJcbi8qXHJcbiBHYWxsYXJ5IGVkd2lkZ2V0XHJcbiovXHJcbi8vZWRXaWRnZXQgJ0dhbGxhcnknIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgJCB9ID0gcmg7XHJcbmxldCB7IF8gfSA9IHJoO1xyXG5sZXQgeyBjb25zdHMgfSA9IHJoO1xyXG5cclxudmFyIEVkd2lkZ2V0ID0gKGZ1bmN0aW9uKCkge1xyXG4gIGxldCB2YWx1ZVNlcGVyYXRvciA9IHVuZGVmaW5lZDtcclxuICBFZHdpZGdldCA9IGNsYXNzIEVkd2lkZ2V0IHtcclxuICAgIHN0YXRpYyBpbml0Q2xhc3MoKSB7XHJcbiAgICAgIHZhbHVlU2VwZXJhdG9yID0ge1xyXG4gICAgICAgICdkYXRhLXJod2lkZ2V0JzogJzsnLFxyXG4gICAgICAgIGNsYXNzOiAnICdcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCBpbmRleCwgYXJnKSB7XHJcbiAgICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgbGV0IHt2aWV3LCBhdHRycywgbW9kZWwsIGFyZ01vZGVsfSA9IHRoaXMucGFyc2VBcmcoYXJnKTtcclxuICAgICAgaWYgKGF0dHJzKSB7IHRoaXMuc2V0QXR0cmlidXRlcyh0aGlzLm5vZGUsIGF0dHJzKTsgfVxyXG4gICAgICBpZiAobW9kZWwpIHsgdGhpcy5zZXRNb2RlbEFyZyh0aGlzLm5vZGUsIF8uZXh0ZW5kKHt9LCBtb2RlbCwgYXJnTW9kZWwpKTsgfVxyXG4gICAgICBpZiAodmlldykgeyB0aGlzLmNyZWF0ZVZpZXcodmlldywgYXJnTW9kZWwpOyB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHBhcnNlQXJnKGFyZykge1xyXG4gICAgICBsZXQgYXJnTW9kZWwsIGF0dHJzLCBjb25maWcsIG1vZGVsLCB2aWV3O1xyXG4gICAgICBsZXQge3dOYW1lLCB3QXJnLCBwaXBlZEFyZ3N9ID0gYXJnO1xyXG4gICAgICBpZiAoY29uZmlnID0gcmguZWRXaWRnZXQod05hbWUpKSB7XHJcbiAgICAgICAgbGV0IHZhcnM7XHJcbiAgICAgICAgKHt2aWV3LCBhdHRycywgdmFycywgbW9kZWx9ID0gY29uZmlnKTtcclxuICAgICAgICBhcmdNb2RlbCA9IF8ucmVzb2x2ZU5pY2VKU09OKHBpcGVkQXJncy5zaGlmdCgpKTtcclxuICAgICAgICB0aGlzLnZhcnMgPSBfLmV4dGVuZCh7fSwgdmFycywgd0FyZyk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHt2aWV3LCBhdHRycywgbW9kZWwsIGFyZ01vZGVsfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVWaWV3KHZpZXcsIGFyZ01vZGVsKSB7XHJcbiAgICAgIGxldCB2aWV3TW9kZWwgPSBfLmV4dGVuZCh7fSwgdmlldy5tb2RlbCwgYXJnTW9kZWwpO1xyXG4gICAgICBsZXQgdmlld05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHZpZXcudGFnIHx8ICdkaXYnKTtcclxuICAgICAgaWYgKHZpZXcuYXR0cnMpIHsgdGhpcy5zZXRBdHRyaWJ1dGVzKHZpZXdOb2RlLCB2aWV3LmF0dHJzKTsgfVxyXG4gICAgICB0aGlzLnNldE1vZGVsQXJnKHZpZXdOb2RlLCB2aWV3TW9kZWwpO1xyXG4gICAgICByZXR1cm4gdGhpcy5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHZpZXdOb2RlLCB0aGlzLm5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEF0dHJpYnV0ZXMobm9kZSwgYXR0cnMpIHtcclxuICAgICAgcmV0dXJuIF8uZWFjaChhdHRycywgZnVuY3Rpb24odmFsdWUsIGF0dHIpIHtcclxuICAgICAgICByZXR1cm4gJC5zZXRBdHRyaWJ1dGUobm9kZSwgYXR0ciwgdGhpcy5yZXNvbHZlVmFsdWUodGhpcy5tZXJnZWRWYWx1ZShub2RlLCBhdHRyLCB2YWx1ZSkpKTtcclxuICAgICAgfVxyXG4gICAgICAsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1vZGVsQXJnKG5vZGUsIG1vZGVsKSB7XHJcbiAgICAgIGlmICghXy5pc0VtcHR5T2JqZWN0KG1vZGVsKSkge1xyXG4gICAgICAgIGxldCBqc29uU3RyaW5nID0gdGhpcy5yZXNvbHZlVmFsdWUoSlNPTi5zdHJpbmdpZnkobW9kZWwpKTtcclxuICAgICAgICByZXR1cm4gJC5kYXRhc2V0KG5vZGUsICdyaHdpZGdldCcsXHJcbiAgICAgICAgICBgJHskLmRhdGFzZXQobm9kZSwgJ3Jod2lkZ2V0JykgfHwgJ0Jhc2ljJ30gfCAke2pzb25TdHJpbmd9YCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtZXJnZWRWYWx1ZShub2RlLCBhdHRyaWIsIHZhbHVlKSB7XHJcbiAgICAgIGxldCBvbGRWYWx1ZSwgc2VwZXJhdG9yO1xyXG4gICAgICBpZiAoIShzZXBlcmF0b3IgPSB2YWx1ZVNlcGVyYXRvclthdHRyaWJdKSkgeyByZXR1cm4gdmFsdWU7IH1cclxuICAgICAgaWYgKChvbGRWYWx1ZSA9ICQuZ2V0QXR0cmlidXRlKG5vZGUsIGF0dHJpYikgfHwgJycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke29sZFZhbHVlfSR7c2VwZXJhdG9yfSR7dmFsdWV9YDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlVmFsdWUodmFsdWUpIHtcclxuICAgICAgcmV0dXJuIF8ucmVzb2x2ZUVuY2xvc2VkVmFyKHZhbHVlLCB2YXJOYW1lID0+IHtcclxuICAgICAgICBzd2l0Y2ggKHZhck5hbWUpIHtcclxuICAgICAgICAgIGNhc2UgJ3RoaXMnOlxyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy52YXJzKTtcclxuICAgICAgICAgIGNhc2UgJ0BpbmRleCc6XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFyc1t2YXJOYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG4gIEVkd2lkZ2V0LmluaXRDbGFzcygpO1xyXG4gIHJldHVybiBFZHdpZGdldDtcclxufSkoKTtcclxuXHJcbi8qXHJcbiAgPGRpdiBkYXRhLWVkd2lkZ2V0PVwiVGFiOiA8bmFtZT46IDxzdHJpbmcgdmFsdWU+LCA8bmFtZT46IDxzdHJpbmcgdmFsdWU+XHJcbiAgIHwgPGpzb24gb3IgbmljZUpTT04+XCI+PC9kaXY+XHJcbiovXHJcblxyXG5yaC5tb2RlbC5zdWJzY3JpYmUoY29uc3RzKCdFVlRfV0lER0VUX0JFRk9SRUxPQUQnKSwgKCkgPT5cclxuICBfLmVhY2goJC5maW5kKGRvY3VtZW50LCAnW2RhdGEtZWR3aWRnZXRdJyksIGZ1bmN0aW9uKG5vZGUsIGluZGV4KSB7XHJcbiAgICBsZXQgYXJncyA9IF8ucmVzb2x2ZVdpZGdldEFyZ3MoJC5kYXRhc2V0KG5vZGUsICdlZHdpZGdldCcpKTtcclxuICAgIF8uZWFjaChhcmdzLCBhcmcgPT4gbmV3IEVkd2lkZ2V0KG5vZGUsIGluZGV4LCBhcmcpKTtcclxuICAgIHJldHVybiAkLmRhdGFzZXQobm9kZSwgJ2Vkd2lkZ2V0JywgbnVsbCk7XHJcbiAgfSlcclxuKTtcclxuXHJcbnJoLmVkV2lkZ2V0ID0gXy5jYWNoZShfLmlzT2JqZWN0KTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7ICQgfSA9IHJoO1xyXG5sZXQgeyBjb25zdHMgfSA9IHJoO1xyXG5sZXQgeyBtb2RlbCB9ID0gcmg7XHJcblxyXG5fLmhvb2tDbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgbGV0IGhyZWY7XHJcbiAgaWYgKCdidXR0b24nIGluIGV2ZW50ICYmIChldmVudC5idXR0b24gIT09IDApKSB7IHJldHVybjsgfVxyXG4gIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7IHJldHVybjsgfVxyXG4gIFxyXG4gIGxldCB7IGJvZHkgfSA9IGRvY3VtZW50O1xyXG4gIGxldCBub2RlID0gZXZlbnQudGFyZ2V0O1xyXG4gIHdoaWxlICh0cnVlKSB7XHJcbiAgICBpZiAoIW5vZGUgfHwgKG5vZGUgPT09IGRvY3VtZW50KSkgeyBicmVhazsgfVxyXG4gICAgaHJlZiA9ICQuZ2V0QXR0cmlidXRlKG5vZGUsICdocmVmJyk7XHJcbiAgICBpZiAoaHJlZikgeyBicmVhazsgfVxyXG4gICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcclxuICB9XHJcbiAgaWYgKCFocmVmKSB7IHJldHVybjsgfVxyXG4gIGhyZWYgPSBkZWNvZGVVUkkoaHJlZik7XHJcbiAgbGV0IG1vYmlsZUFwcE1vZGUgPSBtb2RlbC5nZXQoY29uc3RzKCdLRVlfTU9CSUxFX0FQUF9NT0RFJykpO1xyXG5cclxuICBsZXQgdGFyZ2V0ID0gJC5nZXRBdHRyaWJ1dGUobm9kZSwgJ3RhcmdldCcpO1xyXG4gIGlmICh0YXJnZXQgJiYgKHRhcmdldCAhPT0gJ19zZWxmJykgJiYgIW1vYmlsZUFwcE1vZGUpIHsgcmV0dXJuOyB9XHJcbiAgXHJcbiAgaWYgKChocmVmWzBdID09PSAnIycpICYmIF8uaXNSb290VXJsKCkpIHtcclxuICAgIGlmIChocmVmLmxlbmd0aCA+IDEpIHtcclxuICAgICAgbGV0IGJvb2ttYXJrS2V5ID0gYCR7Y29uc3RzKCdFVlRfQk9PS01BUksnKX0ke2hyZWZ9YDtcclxuICAgICAgaWYgKG1vZGVsLmlzU3Vic2NyaWJlZChib29rbWFya0tleSkpIHtcclxuICAgICAgICBtb2RlbC5wdWJsaXNoKGJvb2ttYXJrS2V5LCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbW9kZWwucHVibGlzaChjb25zdHMoJ0VWVF9OQVZJR0FURV9UT19VUkwnKSxcclxuICAgICAgICAgIHthYnNVcmw6IGAkeyhfLmdldFJvb3RVcmwpKCl9JHtocmVmfWB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIF8ucHJldmVudERlZmF1bHQoZXZlbnQpO1xyXG4gIH0gZWxzZSBpZiAoXy5pc1ZhbGlkRmlsZVVybChocmVmKSkge1xyXG4gICAgbGV0IGFic1VybDtcclxuICAgIGlmIChfLmlzUmVsYXRpdmVVcmwoaHJlZikpIHsgYWJzVXJsID0gd2luZG93Ll9nZXRGdWxsUGF0aChfLnBhcmVudFBhdGgoKSwgaHJlZik7IH1cclxuICAgIGlmIChhYnNVcmwgPT0gbnVsbCkgeyBhYnNVcmwgPSBocmVmOyB9XHJcblxyXG4gICAgaWYgKChtb2JpbGVBcHBNb2RlIHx8ICF0YXJnZXQpICYmICFfLmlzVXJsQWxsb3dkSW5JZnJhbWUoYWJzVXJsKSkge1xyXG4gICAgICByZXR1cm4gJC5zZXRBdHRyaWJ1dGUobm9kZSwgJ3RhcmdldCcsICdfYmxhbmsnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1vZGVsLnB1Ymxpc2goY29uc3RzKCdFVlRfTkFWSUdBVEVfVE9fVVJMJyksIHthYnNVcmx9KTtcclxuICAgICAgaWYgKCF0YXJnZXQpIHsgcmV0dXJuIF8ucHJldmVudERlZmF1bHQoZXZlbnQpOyB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgY29uc3RzIH0gPSByaDtcclxuXHJcbi8vIFByb2plY3Qgc3BlY2lmaWMgbW9kZWwga2V5c1xyXG5jb25zdHMoJ0tFWV9QUk9KRUNUX1RPUElDTElTVCcsICAgICAgICAgICcucC50b3BpY2xpc3QnKTtcclxuY29uc3RzKCdLRVlfUFJPSkVDVF9CUlNMSVNUJywgICAgICAgICAgICAnLnAuYnJzbGlzdCcpO1xyXG5jb25zdHMoJ0tFWV9QUk9KRUNUX1RBR19DT01CSU5BVElPTlMnLCAgICcucC50YWdfY29tYmluYXRpb25zJyk7XHJcbmNvbnN0cygnS0VZX1BST0pFQ1RfVEFHX1NUQVRFUycsICAgICAgICAgJy5wLnRhZ19zdGF0ZXMnKTtcclxuY29uc3RzKCdLRVlfTUVSR0VEX0ZJTFRFUl9LRVknLCAgICAgICAgICAnLnAudGFncycpO1xyXG5jb25zdHMoJ0tFWV9QUk9KRUNUX0ZJTFRFUl9DQVBUSU9OJywgICAgICcucC5maWx0ZXJfY2FwdGlvbicpO1xyXG5jb25zdHMoJ0tFWV9QUk9KRUNUX0ZJTFRFUl9UWVBFJywgICAgICAgICcucC5maWx0ZXJfdHlwZScpO1xyXG5jb25zdHMoJ0tFWV9QUk9KRUNUX0xJU1QnLCAgICAgICAgICAgICAgICcucC5wcm9qZWN0cycpO1xyXG5jb25zdHMoJ0tFWV9NQVNURVJfUFJPSkVDVF9MSVNUJywgICAgICAgICcucC5tYXN0ZXJwcm9qZWN0cycpO1xyXG5jb25zdHMoJ0tFWV9TRUFSQ0hfUkVTVUxUUycsICAgICAgICAgICAgICcucC5zZWFyY2hyZXN1bHRzJyk7XHJcbmNvbnN0cygnS0VZX1NFQVJDSF9SRVNVTFRfUEFSQU1TJywgICAgICAgJy5wLnNlYXJjaHJlc3VsdHBhcmFtcycpO1xyXG5jb25zdHMoJ0tFWV9PTlNFQVJDSF9UQUdfU1RBVEVTJywgICAgICAgICcucC5vbnNlYXJjaHRhZ3N0YXRlcycpO1xyXG5jb25zdHMoJ0tFWV9MTkcnLCAgICAgICAgICAgICAgICAgICAgICAgICcucC5sbmdfZGInKTtcclxuY29uc3RzKCdLRVlfREVGQVVMVF9GSUxURVInLCAgICAgICAgICAgICAnLnAuZGVmZmlsdGVyJyk7XHJcbmNvbnN0cygnUFJPSkVDVF9HTE9TU0FSWV9EQVRBJywgICAgICAgICAgJy5wLmdsb2RhdGEnKTtcclxuY29uc3RzKCdQUk9KRUNUX0lOREVYX0RBVEEnLCAgICAgICAgICAgICAnLnAuaWR4ZGF0YScpO1xyXG5cclxuLy8gTWVyZ2VkIFByb2plY3Qgc3BlY2lmaWNcclxuY29uc3RzKCdLRVlfTUVSR0VEX1BST0pFQ1RfTUFQJywgICAgICAgICAnLm1wLnRtYXAnKTtcclxuXHJcbi8vIFRvcGljIHNwZWNpZmljIG1vZGVsIGtleXNcclxuY29uc3RzKCdLRVlfVE9QSUNfVVJMJywgICAgICAgICAgICAgICAgICcudC50b3BpY3VybCcpO1xyXG5jb25zdHMoJ0tFWV9UT1BJQ19JRCcsICAgICAgICAgICAgICAgICAgJy50LnRvcGljaWQnKTtcclxuY29uc3RzKCdLRVlfVE9QSUNfVElUTEUnLCAgICAgICAgICAgICAgICcudC50b3BpY3RpdGxlJyk7XHJcbmNvbnN0cygnS0VZX1RPUElDX0JSU01BUCcsICAgICAgICAgICAgICAnLnQuYnJzbWFwJyk7XHJcbmNvbnN0cygnS0VZX1RPUElDX09SSUdJTicsICAgICAgICAgICAgICAnLnQub3JpZ2luJyk7XHJcbmNvbnN0cygnS0VZX1RPUElDX0hFSUdIVCcsICAgICAgICAgICAgICAnLnQudG9waWNfaGVpZ2h0Jyk7XHJcblxyXG4vLyBMYXlvdXQgc3BlY2lmaWMgbW9kZWwga2V5c1xyXG5jb25zdHMoJ0tFWV9TRUFSQ0hfVEVSTScsICAgICAgICAgICAgICAgJy5sLnNlYXJjaHRlcm0nKTtcclxuY29uc3RzKCdLRVlfU0VBUkNIRURfVEVSTScsICAgICAgICAgICAgICcubC5zZWFyY2hlZF90ZXJtJyk7XHJcbmNvbnN0cygnS0VZX1RBR19FWFBSRVNTSU9OJywgICAgICAgICAgICAnLmwudGFnX2V4cHJlc3Npb24nKTtcclxuY29uc3RzKCdLRVlfVUlfTU9ERScsICAgICAgICAgICAgICAgICAgICcubC51aW1vZGUnKTsgICAgICAgICAgICAvLyBSSDExXHJcbmNvbnN0cygnS0VZX0JBU0VfSUZSQU1FX05BTUUnLCAgICAgICAgICAnLmwuYmFzZV9pZnJhbWVfbmFtZScpO1xyXG5jb25zdHMoJ0tFWV9DQU5fSEFORExFX1NFUkNIJywgICAgICAgICAgJy5sLmNhbl9oYW5kbGVfc2VhcmNoJyk7IC8vIFJIMTFcclxuY29uc3RzKCdLRVlfQ0FOX0hBTkRMRV9TRUFSQ0gnLCAgICAgICAgICcubC5jYW5faGFuZGxlX3NlYXJjaCcpO1xyXG5jb25zdHMoJ0tFWV9DU0hfTU9ERScsICAgICAgICAgICAgICAgICAgJy5sLmNzaF9tb2RlJyk7XHJcbmNvbnN0cygnS0VZX09OU0VBUkNIX1RBR19FWFBSJywgICAgICAgICAnLmwub25zZWFyY2h0YWdleHByJyk7XHJcbmNvbnN0cygnS0VZX0FORF9TRUFSQ0gnLCAgICAgICAgICAgICAgICAnLmwuYW5kc2VhcmNoJyk7XHJcbmNvbnN0cygnS0VZX0ZFQVRVUkUnLCAgICAgICAgICAgICAgICAgICAnLmwuZmVhdHVyZXMnKTtcclxuY29uc3RzKCdLRVlfU0VBUkNIX1BST0dSRVNTJywgICAgICAgICAgICcubC5zZWFyY2hfcHJvZ3Jlc3MnKTtcclxuY29uc3RzKCdLRVlfTEFZT1VUX1ZFUlNJT04nLCAgICAgICAgICAgICcubC5sYXlvdXRfdmVyc2lvbicpO1xyXG5jb25zdHMoJ0tFWV9UT1BJQ19JTl9JRlJBTUUnLCAgICAgICAgICAgJy5sLnRvcGljX2luX2lmcmFtZScpO1xyXG5jb25zdHMoJ0tFWV9TSE9XX1RBR1MnLCAgICAgICAgICAgICAgICAgJy5sLnNob3d0YWdzJyk7XHJcbmNvbnN0cygnS0VZX0RJUicsICAgICAgICAgICAgICAgICAgICAgICAnLmwuZGlyJyk7XHJcbmNvbnN0cygnS0VZX1NFQVJDSF9MT0NBVElPTicsICAgICAgICAgICAnLmwuc2VhcmNoX2xvY2F0aW9uJyk7XHJcbmNvbnN0cygnS0VZX0RFRkFVTFRfU0VBUkNIX0xPQ0FUSU9OJywgICAnLmwuZGVmYXVsdF9zZWFyY2hfbG9jYXRpb24nKTtcclxuY29uc3RzKCdLRVlfRklMVEVSX0xPQ0FUSU9OJywgICAgICAgICAgICcubC5maWx0ZXJfbG9jYXRpb24nKTtcclxuY29uc3RzKCdLRVlfQUNUSVZFX1RBQicsICAgICAgICAgICAgICAgICcubC5hY3RpdmVfdGFiJyk7XHJcbmNvbnN0cygnS0VZX0RFRkFVTFRfVEFCJywgICAgICAgICAgICAgICAnLmwuZGVmYXVsdF90YWInKTtcclxuY29uc3RzKCdLRVlfQUNUSVZFX1RPUElDX1RBQicsICAgICAgICAgICcubC5hY3RpdmVfdG9waWNfdGFiJyk7XHJcbmNvbnN0cygnS0VZX1RPQ19EUklMTF9ET1dOJywgICAgICAgICAgICAnLmwudG9jX2RyaWxsZG93bicpO1xyXG5jb25zdHMoJ0tFWV9NT0JJTEVfVE9DX0RSSUxMX0RPV04nLCAgICAgJy5sLm1vYmlsZV90b2NfZHJpbGxkb3duJyk7XHJcbmNvbnN0cygnS0VZX1BVQkxJU0hfTU9ERScsICAgICAgICAgICAgICAnLmwucHVibGlzaF9tb2RlJyk7XHJcbmNvbnN0cygnS0VZX1BVQkxJU0hfQkFTRV9VUkwnLCAgICAgICAgICAnLmwucHVibGlzaF9iYXNlX3VybCcpO1xyXG5jb25zdHMoJ0tFWV9QUk9KRUNUU19CQVNFX1VSTCcsICAgICAgICAgJy5sLnByb2plY3RzX2Jhc2VfdXJsJyk7XHJcbmNvbnN0cygnS0VZX0lOREVYX0ZJTFRFUicsICAgICAgICAgICAgICAnLmwuaWR4ZmlsdGVyJyk7XHJcblxyXG4vLyBFdmVudHNcclxuY29uc3RzKCdFVlRfQkFTRV9JRlJBTUVfTE9BRCcsICAgICAgICAgICAnLmUuYmFzZV9pZnJhbWVfbG9hZCcpO1xyXG5jb25zdHMoJ0VWVF9TQ1JPTExfVE9fVE9QJywgICAgICAgICAgICAgICcuZS5zY3JvbGxfdG9fdG9wJyk7XHJcbmNvbnN0cygnRVZUX1NFQVJDSF9URVJNJywgICAgICAgICAgICAgICAgJy5lLnNlYXJjaF90ZXJtJyk7XHJcbmNvbnN0cygnRVZUX05BVklHQVRFX1RPX1VSTCcsICAgICAgICAgICAgJy5lLm5hdmlnYXRlX3RvX3VybCcpO1xyXG5jb25zdHMoJ0VWVF9QUk9KRUNUX0xPQURFRCcsICAgICAgICAgICAgICcuZS5wcm9qZWN0X2xvYWRlZCcpO1xyXG5jb25zdHMoJ0VWVF9UT0NfTE9BREVEJywgICAgICAgICAgICAgICAgICcuZS50b2NfbG9hZGVkJyk7XHJcbmNvbnN0cygnRVZUX1RPUElDX0xPQURFRCcsICAgICAgICAgICAgICAgJy5lLnRvcGljX2xvYWRlZCcpO1xyXG5jb25zdHMoJ0VWVF9UT1BJQ19MT0FESU5HJywgICAgICAgICAgICAgICcuZS50b3BpY19sb2FkaW5nJyk7XHJcbmNvbnN0cygnRVZUX0JPT0tNQVJLJywgICAgICAgICAgICAgICAgICAgJy5lLmJvb2ttYXJrLicpO1xyXG5jb25zdHMoJ0VWVF9QUklOVF9UT1BJQycsICAgICAgICAgICAgICAgICcuZS5wcmludF90b3BpYycpO1xyXG5jb25zdHMoJ0VWVF9TRUFSQ0hfSU5fUFJPR1JFU1MnLCAgICAgICAgICcuZS5zZWFyY2hfaW5fcHJvZ3Jlc3MnKTtcclxuY29uc3RzKCdFVlRfUkVMT0FEX1RPUElDJywgICAgICAgICAgICAgICAnLmUucmVsb2FkX3RvcGljJyk7XHJcbmNvbnN0cygnRVZUX1FVRVJZX1NFQVJDSF9SRVNVTFRTJywgICAgICAgJy5lLnF1ZXJ5X3NlYXJjaF9yZXN1bHRzJyk7XHJcbmNvbnN0cygnRVZUX0xPQURfSURYJywgICAgICAgICAgICAgICAgICAgJy5lLmxvYWRfaWR4Jyk7XHJcbmNvbnN0cygnRVZUX0xPQURfR0xPJywgICAgICAgICAgICAgICAgICAgJy5lLmxvYWRfZ2xvJyk7XHJcblxyXG4vLyBIYXNoIGFuZCBxdWVyeSBrZXlzXHJcbmNvbnN0cygnSEFTSF9LRVlfUkhfSElHSExJR0hUJywgICAgICAgICAgJ3JoaGx0ZXJtJyk7XHJcbmNvbnN0cygnSEFTSF9LRVlfUkhfU1lOUycsICAgICAgICAgICAgICAgJ3Joc3lucycpO1xyXG5jb25zdHMoJ0hBU0hfS0VZX1JIX1NFQVJDSCcsICAgICAgICAgICAgICdyaHNlYXJjaCcpO1xyXG5jb25zdHMoJ0hBU0hfS0VZX1JIX1RPQ0lEJywgICAgICAgICAgICAgICdyaHRvY2lkJyk7XHJcblxyXG4vLyBIYXNoIGtleXNcclxuY29uc3RzKCdIQVNIX0tFWV9UT1BJQycsICAgICAgICAgICAgICAgICAndCcpO1xyXG5jb25zdHMoJ0hBU0hfS0VZX1VJTU9ERScsICAgICAgICAgICAgICAgICd1eCcpO1xyXG5jb25zdHMoJ0hBU0hfS0VZX1JBTkRPTScsICAgICAgICAgICAgICAgICdyYW5kb20nKTtcclxuXHJcbmNvbnN0cygnUEFUSF9QUk9KRUNUX1RBR0RBVEFfRklMRScsICAgICAgJ3doeGRhdGEvd2h0YWdkYXRhLmpzJyk7XHJcbmNvbnN0cygnQ09SRE9WQV9KU19VUkwnLCAgICAgICAgICAgICAgICAgJ2NvcmRvdmEuanMnKTtcclxuY29uc3RzKCdSSFNfTE9HX1RPUElDX1ZJRVcnLCAgICAgICAgICAgICAge21ncjogJ3N5cycsIGNtZDogJ2xvZ3RwYyd9KTtcclxuY29uc3RzKCdSSFNfRE9fU0VBUkNIJywgICAgICAgICAgICAgICAgICAge21ncjogJ2FnbScsIGFndDogJ25scycsIGNtZDogJ3NlYXJjaCd9KTtcclxuY29uc3RzKCdLRVlfTU9CSUxFX0FQUF9NT0RFJywgICAgICAgICAgICcubS5tb2JpbGVhcHAnKTtcclxuIiwibGV0IHsgcmggfSA9IHdpbmRvdztcclxubGV0IHsgXyB9ID0gcmg7XHJcbmxldCB7IG1vZGVsIH0gPSByaDtcclxubGV0IHsgY29uc3RzIH0gPSByaDtcclxuXHJcbmxldCBLRVlfTUVSR0VEX1BST0pFQ1RfTUFQID0gY29uc3RzKCdLRVlfTUVSR0VEX1BST0pFQ1RfTUFQJyk7XHJcblxyXG5fLnBhcnNlUHJvamVjdE5hbWUgPSBwcm9qZWN0ID0+IHByb2plY3QucmVwbGFjZSgvXFwuXFwvL2csICcnKS5yZXBsYWNlKC9cXC4kLywgJycpLnJlcGxhY2UoL1xcLyQvLCAnJyk7XHJcblxyXG5fLm1hcFRhZ0luZGV4ID0gZnVuY3Rpb24oaWR4LCBwcm9qZWN0KSB7XHJcbiAgaWYgKHByb2plY3QgPT0gbnVsbCkgeyBwcm9qZWN0ID0gJyc7IH1cclxuICBpZiAoaWR4KSB7XHJcbiAgICByZXR1cm4gaWR4ICsgJysnICsgcHJvamVjdDtcclxuICB9XHJcbiAgcmV0dXJuIGlkeDtcclxufTtcclxuXHJcbl8uZ2V0VGFncyA9IGZ1bmN0aW9uKGlkeCwgcHJvamVjdCkge1xyXG4gIGlmIChwcm9qZWN0ID09IG51bGwpIHsgcHJvamVjdCA9ICcnOyB9XHJcbiAgaWYgKGlkeCA9PSBudWxsKSB7IHJldHVybiBpZHg7IH1cclxuICBsZXQgaWRtYXAgPSBtb2RlbC5nZXQoS0VZX01FUkdFRF9QUk9KRUNUX01BUCk7XHJcbiAgbGV0IGxlbiA9IGlkeC5pbmRleE9mKCcrJyk7XHJcbiAgaWYgKGxlbiAhPT0gLTEpIHtcclxuICAgIHByb2plY3QgPSBpZHguc3Vic3RyaW5nKGxlbiArIDEsIGlkeC5sZW5ndGgpO1xyXG4gICAgaWR4ID0gaWR4LnN1YnN0cmluZygwLCBsZW4pO1xyXG4gIH1cclxuICBwcm9qZWN0ID0gXy5wYXJzZVByb2plY3ROYW1lKHByb2plY3QpO1xyXG4gIGlmICgoaWRtYXBbcHJvamVjdF0gIT0gbnVsbCA/IGlkbWFwW3Byb2plY3RdW2lkeF0gOiB1bmRlZmluZWQpICE9IG51bGwpIHsgcmV0dXJuIGlkbWFwW3Byb2plY3RdW2lkeF07IH1cclxuICByZXR1cm4gaWR4O1xyXG59O1xyXG5cclxuXy5nZXRQcm9qZWN0TmFtZSA9IGZ1bmN0aW9uKHVybCkge1xyXG4gIGxldCBpZG1hcCA9IG1vZGVsLmdldChLRVlfTUVSR0VEX1BST0pFQ1RfTUFQKTtcclxuICBpZiAoKHVybCAhPSBudWxsKSAmJiAoaWRtYXAgIT0gbnVsbCkpIHtcclxuICAgIHVybCA9IF8ucGFyZW50UGF0aCh1cmwpO1xyXG4gICAgbGV0IHJlbFVybCA9IF8ubWFrZVJlbGF0aXZlUGF0aCh1cmwsIF8uZ2V0SG9zdEZvbGRlcigpKTtcclxuICAgIHJlbFVybCA9IF8ucGFyc2VQcm9qZWN0TmFtZShyZWxVcmwpO1xyXG4gICAgd2hpbGUgKChpZG1hcFtyZWxVcmxdID09IG51bGwpKSB7XHJcbiAgICAgIGxldCBuID0gcmVsVXJsLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgIGlmIChuIDwgMCkge1xyXG4gICAgICAgIHJlbFVybCA9ICcnO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIHJlbFVybCA9IHJlbFVybC5zdWJzdHJpbmcoMCxuKTtcclxuICAgIH1cclxuICAgIHVybCA9IHJlbFVybDtcclxuICB9XHJcbiAgcmV0dXJuIHVybDtcclxufTtcclxuXHJcbl8uZXZhbFRhZ0V4cHJlc3Npb24gPSBmdW5jdGlvbihpbmRleCwgZ3JvdXBFeHBycywgcHJvamVjdCkge1xyXG4gIGlmIChwcm9qZWN0ID09IG51bGwpIHsgcHJvamVjdCA9ICcnOyB9XHJcbiAgaWYgKCFncm91cEV4cHJzIHx8IChncm91cEV4cHJzLmxlbmd0aCA9PT0gMCkpIHsgcmV0dXJuIHRydWU7IH1cclxuICBcclxuICBsZXQgdGFncyA9IF8uZ2V0VGFncyhpbmRleCwgcHJvamVjdCk7XHJcbiAgaWYgKCF0YWdzIHx8ICh0YWdzLmxlbmd0aCA9PT0gMCkpIHsgcmV0dXJuIHRydWU7IH1cclxuICBcclxuICAvLyBUT0RPOiBmaXggZW1wdHkgc3RyaW5nIGluIHJvYm9oZWxwXHJcbiAgaWYgKCh0YWdzLmxlbmd0aCA9PT0gMSkgJiYgKCh0YWdzWzBdID09PSAnJykgfHwgKHRhZ3NbMF0gPT09ICckJykpKSB7IHJldHVybiB0cnVlOyB9XHJcblxyXG4gIGxldCB0cnVlRmxhZyA9IGZhbHNlO1xyXG4gIGxldCBmYWxzZUZsYWcgPSBfLmFueShncm91cEV4cHJzLCBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICBpZiAoXy5ldmFsTXVsdGlwbGVUYWdFeHByZXNzaW9uKGl0ZW0uYywgdGFncykpIHtcclxuICAgICAgdHJ1ZUZsYWcgPSB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChpdGVtLmMubGVuZ3RoKSB7XHJcbiAgICAgIGlmIChfLmV2YWxNdWx0aXBsZVRhZ0V4cHJlc3Npb24oaXRlbS51LCB0YWdzKSkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGlmIChmYWxzZUZsYWcpIHsgcmV0dXJuIGZhbHNlOyB9IGVsc2UgeyByZXR1cm4gdHJ1ZUZsYWc7IH1cclxufTtcclxuXHJcbl8uZXZhbE11bHRpcGxlVGFnRXhwcmVzc2lvbiA9IChleHBycywgdGFncykgPT4gXy5hbnkoZXhwcnMsIGV4cHIgPT4gXy5ldmFsU2luZ2xlVGFnRXhwcmVzc2lvbihleHByLCB0YWdzKSk7XHJcblxyXG5fLmV2YWxTaW5nbGVUYWdFeHByZXNzaW9uID0gKGZ1bmN0aW9uKCkge1xyXG4gIGxldCBjYWNoZSA9IHt9O1xyXG4gIGxldCBvcGVyYXRvcnMgPSBbJyYnLCAnfCcsICchJ107XHJcbiAgbGV0IGV2YWxBbmQgPSBmdW5jdGlvbihzdGFjaykge1xyXG4gICAgbGV0IGl0ZW1zID0gc3RhY2suc3BsaWNlKHN0YWNrLmxlbmd0aCAtIDIpO1xyXG4gICAgcmV0dXJuIHN0YWNrLnB1c2goKGl0ZW1zWzBdID09PSAxKSAmJiAoaXRlbXNbMV0gPT09IDEpID8gMSA6IDApO1xyXG4gIH07XHJcblxyXG4gIGxldCBldmFsT3IgPSBmdW5jdGlvbihzdGFjaykge1xyXG4gICAgbGV0IGl0ZW1zID0gc3RhY2suc3BsaWNlKHN0YWNrLmxlbmd0aCAtIDIpO1xyXG4gICAgcmV0dXJuIHN0YWNrLnB1c2goKGl0ZW1zWzBdID09PSAxKSB8fCAoaXRlbXNbMV0gPT09IDEpID8gMSA6IDApO1xyXG4gIH07XHJcblxyXG4gIGxldCBldmFsTm90ID0gZnVuY3Rpb24oc3RhY2ssIHRhZ3MpIHtcclxuICAgIGxldCBpdGVtcyA9IHN0YWNrLnNwbGljZShzdGFjay5sZW5ndGggLSAxKTtcclxuICAgIHJldHVybiBzdGFjay5wdXNoKGl0ZW1zWzBdID09PSAxID8gMCA6IDEpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihleHByLCB0YWdzKSB7XHJcbiAgICBsZXQga2V5ID0gYCR7ZXhwcn06JHt0YWdzfWA7IC8vIFRPRE86IG5vdyByb2JvaGVscCBzaG91bGQgZXhwb3J0IHRhZ3MgYXMgc3RyaW5nXHJcbiAgICBsZXQgcmVzdWx0ID0gY2FjaGVba2V5XTtcclxuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XHJcblxyXG4gICAgbGV0IHRva2VucyA9IF8ubWFwKGV4cHIuc3BsaXQoJyAnKSwgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICBpZiAoLTEgIT09IG9wZXJhdG9ycy5pbmRleE9mKGl0ZW0pKSB7IHJldHVybiBpdGVtOyB9XHJcbiAgICAgIGlmICgtMSA9PT0gdGFncy5pbmRleE9mKGl0ZW0pKSB7IHJldHVybiAwOyB9IGVsc2UgeyByZXR1cm4gMTsgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHRva2Vucy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGxldCBzdGFjayA9IFtdO1xyXG4gICAgICBmb3IgKGxldCB0b2tlbiBvZiBBcnJheS5mcm9tKHRva2VucykpIHtcclxuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XHJcbiAgICAgICAgICBjYXNlICcmJzogZXZhbEFuZChzdGFjayk7IGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnfCc6IGV2YWxPcihzdGFjayk7IGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnISc6IGV2YWxOb3Qoc3RhY2spOyBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6IHN0YWNrLnB1c2godG9rZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSBzdGFja1swXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRva2Vuc1swXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIGNhY2hlW2tleV0gPSByZXN1bHQ7XHJcbiAgfTtcclxufSkoKTtcclxuIiwiXHJcbmxldCByaCA9IHdpbmRvdy5yaDtcclxubGV0IF8gPSByaC5fO1xyXG5sZXQgY29uc3RzID0gcmguY29uc3RzO1xyXG5cclxuXy5nZXRIb3N0Rm9sZGVyID0gKCgoKSA9PiB7XHJcbiAgbGV0IGhvc3RGb2xkZXI7XHJcbiAgaG9zdEZvbGRlciA9IG51bGw7XHJcbiAgcmV0dXJuICgpID0+IHtcclxuICAgIGlmIChob3N0Rm9sZGVyID09IG51bGwpIHtcclxuICAgICAgaG9zdEZvbGRlciA9IF8uaXNMb2NhbCgpID8gd2luZG93LmdIb3N0UGF0aCA6IGAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cuZ0hvc3R9JHt3aW5kb3cuZ0hvc3RQYXRofWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaG9zdEZvbGRlcjtcclxuICB9O1xyXG59KSkoKTtcclxuXHJcbl8uZ2V0SG9zdERhdGEgPSByb290UGF0aCA9PiB7XHJcbiAgbGV0IGFic0ZvbGRlcjtcclxuICBhYnNGb2xkZXIgPSB3aW5kb3cuX2dldEZ1bGxQYXRoKF8ucGFyZW50UGF0aCgpLCBgJHtyb290UGF0aH0vYCk7XHJcbiAgaWYgKHdpbmRvdy5faXNIVFRQVXJsKGFic0ZvbGRlcikpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGdIb3N0OiB3aW5kb3cuX2dldEhvc3ROYW1lRnJvbVVSTChhYnNGb2xkZXIpLFxyXG4gICAgICBnSG9zdFBhdGg6IHdpbmRvdy5fZ2V0UGF0aEZyb21VUkwoYWJzRm9sZGVyKVxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZ0hvc3Q6ICcnLFxyXG4gICAgICBnSG9zdFBhdGg6IGFic0ZvbGRlclxyXG4gICAgfTtcclxuICB9XHJcbn07XHJcblxyXG5fLmdldEhhc2hNYXBGb3JSb290ID0gKHJlbFVybCwgYkNzaCkgPT4ge1xyXG4gIGxldCBoYXNoTWFwO1xyXG4gIGxldCB1cmxoYXNoTWFwO1xyXG4gIGlmIChiQ3NoID09IG51bGwpIHtcclxuICAgIGJDc2ggPSBudWxsO1xyXG4gIH1cclxuICByZWxVcmwgPSBfLmZpeFJlbGF0aXZlVXJsKHJlbFVybCk7XHJcbiAgdXJsaGFzaE1hcCA9IF8udXJsUGFyYW1zKF8uZXh0cmFjdFBhcmFtU3RyaW5nKHJlbFVybCkpO1xyXG4gIGlmIChiQ3NoKSB7XHJcbiAgICB1cmxoYXNoTWFwW2NvbnN0cygnUkhNQVBJRCcpXSA9IG51bGw7XHJcbiAgICB1cmxoYXNoTWFwW2NvbnN0cygnUkhNQVBOTycpXSA9IG51bGw7XHJcbiAgfVxyXG4gIGhhc2hNYXAgPSBfLmV4dGVuZChfLnVybFBhcmFtcygpLCB1cmxoYXNoTWFwKTtcclxuICBoYXNoTWFwID0gXy5maXhIYXNoTWFwRm9yUm9vdChoYXNoTWFwKTtcclxuICAvL2hhc2hNYXAgPSBfLmFkZFJIU1BhcmFtcyhoYXNoTWFwKTtcclxuICByZXR1cm4gaGFzaE1hcDtcclxufTtcclxuXHJcbl8uZ2V0UGFyYW1zRm9yUm9vdCA9IChyZWxVcmwsIGJDc2gpID0+IHtcclxuICBsZXQgcXVlcnlNYXA7XHJcbiAgbGV0IHF1ZXJ5U3RyaW5nO1xyXG4gIGlmIChiQ3NoID09IG51bGwpIHtcclxuICAgIGJDc2ggPSBudWxsO1xyXG4gIH1cclxuICBxdWVyeU1hcCA9IF8uZ2V0SGFzaE1hcEZvclJvb3QocmVsVXJsLCBiQ3NoKTtcclxuICBxdWVyeVN0cmluZyA9IF8ubWFwVG9FbmNvZGVkU3RyaW5nKHF1ZXJ5TWFwKTtcclxuICBpZiAocXVlcnlTdHJpbmcubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBgPyR7cXVlcnlTdHJpbmd9YDtcclxuICB9XHJcbn07XHJcblxyXG5fLmlzUm9vdFVybCA9IGFic1VybCA9PiB7XHJcbiAgbGV0IGZpbGVOYW1lO1xyXG4gIGxldCBmaWxlUGF0aDtcclxuICBsZXQgcm9vdFVybDtcclxuICBpZiAoYWJzVXJsID09IG51bGwpIHtcclxuICAgIGFic1VybCA9IGRlY29kZVVSSShkb2N1bWVudC5sb2NhdGlvbi5ocmVmKTtcclxuICB9XHJcbiAgcm9vdFVybCA9IF8uZ2V0Um9vdFVybCgpO1xyXG4gIGZpbGVQYXRoID0gXy5maWxlUGF0aChhYnNVcmwpO1xyXG4gIGlmIChmaWxlUGF0aCA9PT0gXy5maWxlUGF0aChyb290VXJsKSkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIGZpbGVOYW1lID0gXy5nZXRGaWxlTmFtZShyb290VXJsKTtcclxuICByZXR1cm4gKGZpbGVOYW1lID09PSAnaW5kZXguaHRtJyB8fCBmaWxlTmFtZSA9PT0gJ2luZGV4Lmh0bWwnKSAmJiBmaWxlUGF0aCA9PT0gXy5wYXJlbnRQYXRoKHJvb3RVcmwpO1xyXG59O1xyXG5cclxuXy5pc0V4dGVybmFsVXJsID0gYWJzVXJsID0+IHtcclxuICBsZXQgaG9zdEZvbGRlcjtcclxuICBsZXQgdGFyZ2V0Rm9sZGVyO1xyXG4gIGlmIChyaC5tb2RlbC5nZXQocmguY29uc3RzKCdLRVlfUFVCTElTSF9NT0RFJykpKSB7XHJcbiAgICBob3N0Rm9sZGVyID0gcmgubW9kZWwuZ2V0KHJoLmNvbnN0cygnS0VZX1BST0pFQ1RTX0JBU0VfVVJMJykpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBob3N0Rm9sZGVyID0gXy5nZXRIb3N0Rm9sZGVyKCk7XHJcbiAgfVxyXG4gIHRhcmdldEZvbGRlciA9IGFic1VybC5zdWJzdHJpbmcoMCwgaG9zdEZvbGRlci5sZW5ndGgpO1xyXG4gIHJldHVybiB0YXJnZXRGb2xkZXIgIT09IGhvc3RGb2xkZXI7XHJcbn07XHJcblxyXG5fLmZpeEhhc2hNYXBGb3JSb290ID0gaGFzaE1hcCA9PiB7XHJcbiAgbGV0IEhBU0hfS0VZX1JBTkRPTTtcclxuICBsZXQgSEFTSF9LRVlfUkhfSElHSExJR0hUO1xyXG4gIGxldCBIQVNIX0tFWV9SSF9TRUFSQ0g7XHJcbiAgbGV0IEhBU0hfS0VZX1JIX1RPQ0lEO1xyXG4gIGxldCBIQVNIX0tFWV9UT1BJQztcclxuICBsZXQgSEFTSF9LRVlfVUlNT0RFO1xyXG4gIGlmIChoYXNoTWFwID09IG51bGwpIHtcclxuICAgIGhhc2hNYXAgPSB7fTtcclxuICB9XHJcbiAgSEFTSF9LRVlfUkhfU0VBUkNIID0gY29uc3RzKCdIQVNIX0tFWV9SSF9TRUFSQ0gnKTtcclxuICBIQVNIX0tFWV9UT1BJQyA9IGNvbnN0cygnSEFTSF9LRVlfVE9QSUMnKTtcclxuICBIQVNIX0tFWV9VSU1PREUgPSBjb25zdHMoJ0hBU0hfS0VZX1VJTU9ERScpO1xyXG4gIEhBU0hfS0VZX1JIX1RPQ0lEID0gY29uc3RzKCdIQVNIX0tFWV9SSF9UT0NJRCcpO1xyXG4gIEhBU0hfS0VZX1JIX0hJR0hMSUdIVCA9IGNvbnN0cygnSEFTSF9LRVlfUkhfSElHSExJR0hUJyk7XHJcbiAgSEFTSF9LRVlfUkFORE9NID0gY29uc3RzKCdIQVNIX0tFWV9SQU5ET00nKTtcclxuICBpZiAoIWhhc2hNYXBbSEFTSF9LRVlfVUlNT0RFXSkge1xyXG4gICAgaGFzaE1hcFtIQVNIX0tFWV9VSU1PREVdID0gbnVsbDtcclxuICB9XHJcbiAgaGFzaE1hcFtIQVNIX0tFWV9SQU5ET01dID0gbnVsbDtcclxuICBpZiAoIWhhc2hNYXBbSEFTSF9LRVlfUkhfVE9DSURdKSB7XHJcbiAgICBoYXNoTWFwW0hBU0hfS0VZX1JIX1RPQ0lEXSA9IG51bGw7XHJcbiAgfVxyXG4gIGlmICghaGFzaE1hcFtIQVNIX0tFWV9SSF9ISUdITElHSFRdKSB7XHJcbiAgICBoYXNoTWFwW0hBU0hfS0VZX1JIX0hJR0hMSUdIVF0gPSBudWxsO1xyXG4gIH1cclxuICBpZiAoIWhhc2hNYXBbSEFTSF9LRVlfUkhfU0VBUkNIXSkge1xyXG4gICAgaGFzaE1hcFtIQVNIX0tFWV9SSF9TRUFSQ0hdID0gbnVsbDtcclxuICB9XHJcbiAgcmV0dXJuIGhhc2hNYXA7XHJcbn07XHJcblxyXG5fLmZpeFJlbGF0aXZlVXJsID0gZmlsZVBhdGggPT4ge1xyXG4gIGlmIChmaWxlUGF0aCA9PSBudWxsKSB7XHJcbiAgICBmaWxlUGF0aCA9ICcnO1xyXG4gIH1cclxuICBmaWxlUGF0aCA9IGZpbGVQYXRoLnJlcGxhY2UoL1xcL1xcLlxcLy9nLCAnLycpO1xyXG4gIGlmIChmaWxlUGF0aFswXSA9PT0gJy4nICYmIGZpbGVQYXRoWzFdID09PSAnLycpIHtcclxuICAgIGZpbGVQYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKDIpO1xyXG4gIH1cclxuICByZXR1cm4gZmlsZVBhdGg7XHJcbn07XHJcblxyXG5fLmVuc3VyZVNsYXNoID0gdXJsID0+IHtcclxuICBpZiAoKHVybCAhPSBudWxsKSAmJiB1cmwuc3Vic3RyKC0xKSAhPT0gJy8nKSB7XHJcbiAgICB1cmwgKz0gJy8nO1xyXG4gIH1cclxuICByZXR1cm4gdXJsO1xyXG59O1xyXG5cclxuXy5pc1VybEFsbG93ZEluSWZyYW1lID0gKCgoKSA9PiB7XHJcbiAgbGV0IEFMTE9XRURfRVhUU19JTl9JRlJBTUU7XHJcbiAgQUxMT1dFRF9FWFRTX0lOX0lGUkFNRSA9IFsnJywgJy5odG0nLCAnLmh0bWwnLCAnLmFzcCcsICcuYXNweCddO1xyXG4gIHJldHVybiBhYnNVcmwgPT4ge1xyXG4gICAgbGV0IGV4dDtcclxuICAgIGxldCByZWxVcmw7XHJcbiAgICBpZiAoXy5pc0V4dGVybmFsVXJsKGFic1VybCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmVsVXJsID0gYWJzVXJsLnN1YnN0cmluZyhfLmdldEhvc3RGb2xkZXIoKS5sZW5ndGgpO1xyXG4gICAgZXh0ID0gXy5nZXRGaWxlRXh0ZW50aW9uKHJlbFVybCkudG9Mb3dlckNhc2UoKTtcclxuICAgIHJldHVybiBBTExPV0VEX0VYVFNfSU5fSUZSQU1FLmluY2x1ZGVzKGV4dCk7XHJcbiAgfTtcclxufSkpKCk7XHJcbiIsIlxyXG4vLyB0byBzdXBwb3J0IG9sZCBicm93c2VyXHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltID09IG51bGwpIHtcclxuICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICB9O1xyXG59XHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltU3RhcnQgPT0gbnVsbCkge1xyXG4gIFN0cmluZy5wcm90b3R5cGUudHJpbVN0YXJ0ID0gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdFxyXG59XHJcblxyXG5pZiAoU3RyaW5nLnByb3RvdHlwZS50cmltRW5kID09IG51bGwpIHtcclxuICBTdHJpbmcucHJvdG90eXBlLnRyaW1FbmQgPSBTdHJpbmcucHJvdG90eXBlLnRyaW1SaWdodFxyXG59XHJcbiIsImxldCByaCA9IHJlcXVpcmUoXCIuL3JoXCIpXHJcbmxldCBjb25zdHMgPSByaC5jb25zdHNcclxuXHJcbmNvbnN0cygnUkhNQVBJRCcsICdyaG1hcGlkJyk7XHJcbmNvbnN0cygnUkhfRlVMTF9MQVlPVVRfUEFSQU0nLCAncmhmdWxsbGF5b3V0Jyk7XHJcblxyXG5jb25zdHMoJ0VWVF9UT1BJQ19XSURHRVRfTE9BREVEJywgJy5lLnRvcGljX3dpZGdldF9sb2FkZWQnKTtcclxuY29uc3RzKCdFVlRfQ0xPU0VfU0VBUkNIX1NVR0dFU1RJT04nLCAnLmUuY2xvc2Vfc2VhcmNoX3N1Z2dlc3Rpb24nKTtcclxuXHJcbmNvbnN0cygnS0VZX1RPQ19CUkVBRENSVU1CUycsICcucC50b2NfYnJlYWRjcnVtYnMnKTtcclxuY29uc3RzKCdLRVlfVE9DX1NFTEVDVF9JVEVNJywgJy5wLnRvY19zZWxlY3RfaXRlbScpO1xyXG5jb25zdHMoJ0tFWV9UT0NfT1JERVInLCAnLnAudG9jX29yZGVyJyk7XHJcbmNvbnN0cygnS0VZX1RPQ19DSElMRF9PUkRFUicsICcucC50b2NfY2hpbGRfb3JkZXInKTtcclxuLy9TZWFyY2ggc3BlY2lmaWNcclxuY29uc3RzKCdTRUFSQ0hfTUFQX0FERFInLCBcIndoeGRhdGEvc2VhcmNoX2F1dG9fbWFwXzAuanNcIik7XHJcbmNvbnN0cygnU0VBUkNIX01PREVMX0FERFInLCBcIndoeGRhdGEvc2VhcmNoX2F1dG9fbW9kZWxfXCIpO1xyXG5jb25zdHMoJ1NFQVJDSF9JTkRFWF9EQVRBJywgXCIubC5zZWFyY2hfaW5kZXhfZGF0YVwiKTtcclxuY29uc3RzKCdTRUFSQ0hfSU5ERVhfRklMRScsIFwid2h4ZGF0YS9zZWFyY2hfYXV0b19pbmRleC5qc1wiKTtcclxuY29uc3RzKCdTRUFSQ0hfREJfRklMRScsIFwid2h4ZGF0YS9zZWFyY2hfZGIuanNcIik7XHJcbmNvbnN0cygnU0VBUkNIX01FVEFEQVRBX0ZJTEUnLCBcIndoeGRhdGEvc2VhcmNoX3RvcGljcy5qc1wiKVxyXG5jb25zdHMoJ1NFQVJDSF9URVhUX0ZJTEUnLCBcIndoeGRhdGEvdGV4dFwiKVxyXG5cclxuY29uc3RzKCdTRUFSQ0hfTU9ERUxfS0VZJywnLmwuc2VhcmNoX21vZGVsLicpO1xyXG5jb25zdHMoJ1NFQVJDSF9NQVBfS0VZJywgJy5sLnNlYXJjaF9tYXAuJyk7XHJcbmNvbnN0cygnU0VBUkNIX01BWF9UT1BJQ1MnLCAyMCk7XHJcbmNvbnN0cygnU0VBUkNIX1JFU1VMVFNfS0VZJywgJ3NlYXJjaF9yZXN1bHRzJyk7XHJcbmNvbnN0cygnU1RPUF9OQVZJR0FURV9UT19UT1BJQycsICcubC5zdG9wdG9waWNuYXYnKTtcclxuY29uc3RzKCdTRUFSQ0hfV09SRFNfTUFQJywgJy5sLnNlYXJjaF93b3Jkc19tYXAnKTtcclxuY29uc3RzKFwiTUFYX1NFQVJDSF9JTlBVVFwiLCAzKTtcclxuY29uc3RzKFwiS0VZX0JSRUFEQ1JVTUJTXCIsICcubC5icmVhZGNydW1icycpO1xyXG5jb25zdHMoJ0hBU0hfSE9NRVBBR0VfTU9ERScsICdob21lcGFnZScpO1xyXG5jb25zdHMoJ0tFWV9WSUVXX01PREUnLCAnLmwubW9kZScpO1xyXG5jb25zdHMoJ0hFTFBfTEFZT1VUX01PREUnLCAnbGF5b3V0Jyk7XHJcbmNvbnN0cygnSEVMUF9TRUFSQ0hfTU9ERScsICdzZWFyY2gnKVxyXG5jb25zdHMoJ0hFTFBfVE9QSUNfTU9ERScsICd0b3BpYycpXHJcbmNvbnN0cygnUFJFVl9TRUFSQ0hfS0VZJywgJ2RhdGEtcHJldi1zZWFyY2gnKVxyXG5cclxuXHJcblxyXG5cdC8qIGZhdm9yaXRlcyBjb25zdGFudHMgKi9cclxuY29uc3RzKCdGQVZBVFRSSUJVVEUnLCdkYXRhLWZhdndpZGdldCcpO1xyXG5jb25zdHMoJ0ZBVkJVVFRPTicsJ2Zhdi1idXR0b24nKTtcclxuY29uc3RzKCdGQVZMSVNUJywnZmF2LWxpc3QnKTtcclxuY29uc3RzKCdGQVZTVE9SQUdFJywgJ2Zhdi1zdG9yZScpO1xyXG5cclxuY29uc3RzKCdGQVZMSU5LQ0xBU1MnLCdmYXZvcml0ZScpO1xyXG5jb25zdHMoJ1VORkFWTElOS0NMQVNTJywndW5mYXZvcml0ZScpO1xyXG5jb25zdHMoJ0ZBVlRBQkxFQ0xBU1MnLCAnZmF2b3JpdGVzaG9sZGVyJyk7XHJcbmNvbnN0cygnRkFWVEFCTEVUSVRMRUNMQVNTJywgJ2Zhdm9yaXRlJyk7XHJcbmNvbnN0cygnRkFWVEFCTEVSRU1PVkVDTEFTUycsICdyZW1vdmVsaW5rJyk7XHJcbmNvbnN0cygnRkFWTElTVElOVFJPQ0xBU1MnLCAnZmF2b3JpdGVzaW50cm8nKTtcclxuY29uc3RzKCdGQVZMSVNUVEFCTEVJTlRST0NMQVNTJywgJ2Zhdm9yaXRlc3RhYmxlaW50cm8nKTtcclxuY29uc3RzKCdFVkVOVEZBVkNIQU5HRScsICdmYXZvcml0ZS1jaGFuZ2VkLWluLXNjcmlwdCcpO1xyXG5jb25zdHMoJ1RPUElDX0ZBVk9SSVRFJywgJy5sLnRvcGljX2Zhdm9yaXRlJyk7XHJcbmNvbnN0cygnS0VZX0ZBVk9SSVRFUycsICcubC5mYXZvcml0ZXMnKTtcclxuY29uc3RzKCdGQVZPUklURVNfQlVUVE9OX1RJVExFJywgJy5sLmZhdm9yaXRlc190aXRsZScpO1xyXG5jb25zdHMoJ0tFWV9HTE9TU0FSWV9SRVNVTFQnLCAnLnAuZ2xvc3Nhcnlfc2VhcmNoX3Jlc3VsdCcpO1xyXG5jb25zdHMoJ0tFWV9HTE9TU0FSWV9SRVNVTFRfVEVSTScsICcucC5nbG9zc2FyeV9zZWFyY2hfdGVybScpO1xyXG5cclxuXHJcbmNvbnN0cygnRVZUX1dJTkRPV19MT0FERUQnLCAnLmUud2luX2xvYWRlZCcpXHJcblxyXG5jb25zdHMoJ0tFWV9MTkdfTkFNRScsICcucC5sbmdfbmFtZScpO1xyXG5jb25zdHMoJ1NIT1dfTU9EQUwnLCAnLmwuc2hvd19tb2RhbCcpXHJcblxyXG5jb25zdHMoJ0tFWV9IRUFERVJfTE9HT19QQVRIJywgJy5sLmhlYWRlci5sb2dvJyk7XHJcbmNvbnN0cygnS0VZX0hFQURFUl9USVRMRScsICcubC5oZWFkZXIudGl0bGUnKTtcclxuY29uc3RzKCdLRVlfSEVBREVSX1RJVExFX0NPTE9SJywgJy5sLmhlYWRlci50aXRsZV9jb2xvcicpO1xyXG5jb25zdHMoJ0tFWV9IRUFERVJfQkFDS0dST1VORF9DT0xPUicsICcubC5oZWFkZXIuYmFja2dyb3VuZF9jb2xvcicpO1xyXG5jb25zdHMoJ0tFWV9MQVlPVVRfRk9OVF9GQU1JTFknLCAnLmwubGF5b3V0LmZvbnRfZmFtaWx5Jyk7XHJcbmNvbnN0cygnS0VZX0hFQURFUl9IVE1MJywgJy5sLmhlYWRlci5odG1sJyk7XHJcbmNvbnN0cygnS0VZX0hFQURFUl9DU1MnLCAnLmwuaGVhZGVyLmNzcycpO1xyXG5jb25zdHMoJ0tFWV9IRUFERVJfREVGQVVMVF9CQUNLR1JPVU5EX0NPTE9SJywgJy5sLmhlYWRlci5kZWZhdWx0X2JhY2tncm91bmRfY29sb3InKTtcclxuY29uc3RzKCdLRVlfSEVBREVSX0RFRkFVTFRfVElUTEVfQ09MT1InLCAnLmwuaGVhZGVyLmRlZmF1bHRfdGl0bGVfY29sb3InKTtcclxuY29uc3RzKCdLRVlfTEFZT1VUX0RFRkFVTFRfRk9OVF9GQU1JTFknLCAnLmwubGF5b3V0LmRlZmF1bHRfZm9udF9mYW1pbHknKTtcclxuXHJcbmNvbnN0cygnS0VZX0NVU1RPTV9CVVRUT05TJywgJy5sLmN1c3RvbV9idXR0b25zJyk7XHJcbmNvbnN0cygnS0VZX0NVU1RPTV9CVVRUT05TX0NPTkZJRycsICcubC5jdXN0b21fYnV0dG9uc19jb25maWcnKTtcclxuY29uc3RzKCdLRVlfU0VBUkNIX0hJR0hMSUdIVF9DT0xPUicsICcubC5zZWFyY2hfcmVzdWx0LmhpZ2hsaWdodF9jb2xvcicpO1xyXG5jb25zdHMoJ0tFWV9TRUFSQ0hfQkdfQ09MT1InLCAnLmwuc2VhcmNoX3Jlc3VsdC5oaWdobGlnaHRfYmNjb2xvcicpO1xyXG5jb25zdHMoJ1RPUElDX0hJR0hMSUdIVEVEJywgJy5sLnNlYXJjaF9yZXN1bHQudG9waWNfaGlnaGxpZ2h0ZWQnKTtcclxuY29uc3RzKCdFVlRfUkVNT1ZFX0hJR0hMSUdIVCcsICcuZS5yZW1vdmVfaGlnaGxpZ2h0Jyk7XHJcblxyXG5cclxuY29uc3RzKCdFVlRfRVhQQU5EX0NPTExBUFNFX0FMTCcsICcuZS5leHBhbmRfY29sbGFwc2VfYWxsJyk7XHJcbmNvbnN0cygnRVZUX0VYUEFORF9BTEwnLCAnLmUuZXhwYW5kX2FsbCcpO1xyXG5jb25zdHMoJ0VWVF9DT0xMQVBTRV9BTEwnLCAnLmUuY29sbGFwc2VfYWxsJyk7XHJcbmNvbnN0cygnQUxMX0FSRV9FWFBBTkRFRCcsICcubC5hbGxfYXJlX2V4cGFuZGVkJyk7XHJcblxyXG4iLCIvL0d1bmphblxyXG5pZiAoZ2xvYmFsLnJoID09PSB1bmRlZmluZWQpIHtcclxuICBnbG9iYWwucmggPSB7fTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwucmhcclxuIiwicmVxdWlyZShcIi4uL2xpYi9yaFwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvdXRpbHMvc2hpbVwiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvcm9ib2hlbHAvY29tbW9uL3JoX2NvbnN0c1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvcm9ib2hlbHAvY29tbW9uL3RhZ19leHByZXNzaW9uX3V0aWxzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vaG9va19jbGlja1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvcm9ib2hlbHAvY29tbW9uL2NvbnRlbnRfZmlsdGVyXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vZWRfd2lkZ2V0c1wiKVxyXG5yZXF1aXJlKFwiLi4vLi4vbGVuaWVudF9zcmMvcm9ib2hlbHAvY29tbW9uL2VkX3dpZGdldF9jb25maWdzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vdXJsX3V0aWxzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vdGFnX2V4cHJlc3Npb25fdXRpbHNcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL3JvYm9oZWxwL2NvbW1vbi9ob29rX2NsaWNrXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vY29udGVudF9maWx0ZXJcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL3JvYm9oZWxwL2NvbW1vbi9lZF93aWRnZXRzXCIpXHJcbnJlcXVpcmUoXCIuLi8uLi9sZW5pZW50X3NyYy9yb2JvaGVscC9jb21tb24vZWRfd2lkZ2V0X2NvbmZpZ3NcIilcclxucmVxdWlyZShcIi4uL2xpYi9jb25zdHNcIilcclxucmVxdWlyZShcIi4uLy4uL2xlbmllbnRfc3JjL3JvYm9oZWxwL2NvbW1vbi91cmxfdXRpbHNcIilcclxucmVxdWlyZShcIi4vdXRpbHMvaG9tZV91dGlsc1wiKVxyXG5yZXF1aXJlKFwiLi91dGlscy91cmxfdXRpbHNcIilcclxucmVxdWlyZShcIi4vdXRpbHMvaW9fdXRpbHNcIilcclxucmVxdWlyZShcIi4vdXRpbHMvaHRtbF9yZXNvbHZlclwiKVxyXG5yZXF1aXJlKFwiLi91dGlscy9pZnJhbWVfdXRpbHNcIilcclxucmVxdWlyZShcIi4vbGF5b3V0L2RhdGFfYXR0cnMvcG9wdXBfaW1hZ2VcIilcclxucmVxdWlyZShcIi4vbGF5b3V0L2RhdGFfYXR0cnMvZm9jdXNpZlwiKVxyXG5yZXF1aXJlKFwiLi9jb21tb24vaW5pdFwiKVxyXG4iLCJsZXQgcmggPSByZXF1aXJlKFwiLi4vLi4vbGliL3JoXCIpO1xyXG5sZXQgY29uc3RzID0gcmguY29uc3RzO1xyXG5sZXQgJCA9IHJoLiQ7XHJcbmxldCBtb2RlbCA9IHJoLm1vZGVsO1xyXG5cclxubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnRVZUX1BST0pFQ1RfTE9BREVEJyksICgpID0+e1xyXG4gIGxldCAkaHRtbCA9ICQoJ2h0bWwnLDApO1xyXG4gIGxldCBsYW5nID0gbW9kZWwuZ2V0KGNvbnN0cygnS0VZX0xOR19OQU1FJykpXHJcbiAgaWYoJGh0bWwgJiYgbGFuZyAmJiBsYW5nICE9PSAnJyl7ICBcclxuICAgICQuc2V0QXR0cmlidXRlKCRodG1sLCAnbGFuZycsIGxhbmcpXHJcbiAgfVxyXG59KVxyXG5cclxubW9kZWwuc3Vic2NyaWJlKGNvbnN0cygnS0VZX0FORF9TRUFSQ0gnKSwgdmFsdWUgPT4gdmFsdWUgPT09ICcnICYmIG1vZGVsLnB1Ymxpc2goY29uc3RzKCdLRVlfQU5EX1NFQVJDSCcpLCAnMScpKVxyXG4iLCJjb25zdCByaCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9saWIvcmhcIilcclxuXHJcbmNsYXNzIEZvY3VzaWYge1xyXG4gIGNvbnN0cnVjdG9yICh3aWRnZXQsIG5vZGUsIHJhd0V4cHIpIHtcclxuICAgIHdpZGdldC5zdWJzY3JpYmVEYXRhRXhwcihyYXdFeHByLCByZXN1bHQgPT4ge1xyXG4gICAgICBpZihyZXN1bHQpIHtcclxuICAgICAgICBub2RlLmZvY3VzKClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbnJoLnJlZ2lzdGVyRGF0YUF0dHIoJ2ZvY3VzaWYnLCBGb2N1c2lmKSIsImNvbnN0IHJoID0gcmVxdWlyZShcIi4uLy4uLy4uL2xpYi9yaFwiKVxyXG5jb25zdCBfID0gcmguXztcclxubGV0ICQgPSByaC4kO1xyXG5sZXQgSHRtbFJlc29sdmVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL2h0bWxfcmVzb2x2ZXJcIilcclxubGV0IG5vZGVVdGlscyA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9ub2RlX3V0aWxzXCIpXHJcblxyXG5cclxuY2xhc3MgUG9wdXBJbWFnZXtcclxuICBjb25zdHJ1Y3Rvcih3aWRnZXQsIG5vZGUsIHJhd0V4cHIpIHtcclxuICAgICQuYWRkQ2xhc3Mobm9kZSwgXCJwb3B1cC1pbWFnZS10aHVtYm5haWxcIilcclxuICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICByaC5tb2RlbC5jc3Vic2NyaWJlKCdFVlRfUFJPSkVDVF9MT0FERUQnLCB0aGlzLl9hZGRFbmxhcmdlQnV0dG9uLmJpbmQodGhpcykpXHJcbiAgICB0aGlzLl9jbGlja0ZuID0gdGhpcy5fZ2V0Q2xpY2tGbihyYXdFeHByKVxyXG4gICAgXy5hZGRFdmVudExpc3RlbmVyKG5vZGUsIFwiY2xpY2tcIiwgdGhpcy5fY2xpY2tGbik7XHJcbiAgfVxyXG5cclxuICBfY29udGVudChyYXdFeHByKXtcclxuICAgIGxldCBub2RlcyA9IFtdXHJcbiAgICBsZXQgaW1nTm9kZSA9ICQuY3JlYXRlRWxlbWVudCgnaW1nJylcclxuICAgICQuc2V0QXR0cmlidXRlKGltZ05vZGUsICdzcmMnLCByYXdFeHByKVxyXG4gICAgbm9kZXMucHVzaChpbWdOb2RlKVxyXG5cclxuICAgIGlmKCQuaGFzQXR0cmlidXRlKHRoaXMubm9kZSwgXCJ1c2VtYXBcIikpIHtcclxuICAgICAgbGV0IG1hcElkID0gJC5nZXRBdHRyaWJ1dGUodGhpcy5ub2RlLCBcInVzZW1hcFwiKVxyXG4gICAgICAkLnNldEF0dHJpYnV0ZShpbWdOb2RlLCAndXNlbWFwJywgbWFwSWQpXHJcbiAgICAgIG5vZGVzLnB1c2goJChtYXBJZCwgMCkpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGh0bWxfcmVzb2x2ZXIgPSBuZXcgSHRtbFJlc29sdmVyKCk7XHJcbiAgICByZXR1cm4gaHRtbF9yZXNvbHZlci5yZXNvbHZlKF8ubWFwKG5vZGVzLCBub2RlID0+IG5vZGVVdGlscy5vdXRlckhUTUwobm9kZSkpLmpvaW4oJyAnKSlcclxuICB9XHJcblxyXG4gIF9nZXRDbGlja0ZuKHJhd0V4cHIpe1xyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgcmgubW9kZWwuY3B1Ymxpc2goJ1NIT1dfTU9EQUwnLCB7Y29udGVudDogdGhpcy5fY29udGVudChyYXdFeHByKSwgaXNJbWFnZTp0cnVlfSlcclxuICAgIH07XHJcbiAgfVxyXG4gIF9hZGRFbmxhcmdlQnV0dG9uKCl7XHJcblxyXG4gICAgbGV0IGltZyA9ICQuY3JlYXRlRWxlbWVudCgnaW1nJywgdGhpcy5ub2RlKVxyXG4gICAgJC5zZXRBdHRyaWJ1dGUoaW1nLFwic3JjXCIsIHRoaXMuZXhwYW5kSW1hZ2VQYXRoKVxyXG4gICAgJC5hZGRDbGFzcyhpbWcsIFwicmgtZXhwYW5kLWljb25cIilcclxuICAgIG5vZGVVdGlscy5pbnNlcnRBZnRlcih0aGlzLm5vZGUsIGltZylcclxuICAgIF8uYWRkRXZlbnRMaXN0ZW5lcihpbWcsIFwiY2xpY2tcIiwgdGhpcy5fY2xpY2tGbik7XHJcbiAgfVxyXG4gIGdldCBleHBhbmRJbWFnZVBhdGggKCl7XHJcbiAgICBsZXQgaHRtbF9yZXNvbHZlciA9IG5ldyBIdG1sUmVzb2x2ZXIoKTtcclxuICAgIGxldCBmdWxsSW1hZ2VQYXRoID0gaHRtbF9yZXNvbHZlci5tYWtlRnVsbFBhdGgoJ3RlbXBsYXRlL2ltYWdlcy9leHBhbmQucG5nJywgXy5nZXRSb290VXJsKCkpIFxyXG4gICAgcmV0dXJuIF8ubWFrZVJlbGF0aXZlVXJsKGZ1bGxJbWFnZVBhdGgpXHJcbiAgfVxyXG59XHJcblxyXG5yaC5yZWdpc3RlckRhdGFBdHRyKCdwb3B1cGltYWdlJywgUG9wdXBJbWFnZSkiLCJsZXQgcmggPSByZXF1aXJlKFwiLi4vLi4vbGliL3JoXCIpXHJcbmxldCBfID0gcmguX1xyXG5sZXQgY29uc3RzID0gcmguY29uc3RzXHJcblxyXG5fLmdvVG9Ib21lID0gKGhhc2hfbWFwLCBwYXJhbXNfbWFwKSA9PiB7XHJcbiAgbGV0IGhvbWVfcGF0aCA9IGNvbnN0cygnSE9NRV9GSUxFUEFUSCcpXHJcbiAgaWYoaG9tZV9wYXRoKSB7XHJcbiAgICBsZXQgaG9tZV91cmwgPSBfLm1ha2VGdWxsVXJsKGhvbWVfcGF0aClcclxuICAgIGxldCBwYXJhbXNTdHIgPSAocGFyYW1zX21hcCA9PT0gdW5kZWZpbmVkKT8gJycgOiAnPycrIF8ubWFwVG9FbmNvZGVkU3RyaW5nKHBhcmFtc19tYXApXHJcbiAgICBsZXQgaGFzaFN0ciA9IChoYXNoX21hcCA9PT0gdW5kZWZpbmVkKT8gJycgOiAnIycrIF8ubWFwVG9FbmNvZGVkU3RyaW5nKGhhc2hfbWFwKVxyXG5cclxuICAgIGhvbWVfdXJsID0gYCR7aG9tZV91cmx9JHtwYXJhbXNTdHJ9JHtoYXNoU3RyfWBcclxuICAgIGRvY3VtZW50LmxvY2F0aW9uID0gaG9tZV91cmxcclxuICB9XHJcbn07XHJcblxyXG5fLmlzSG9tZVVybCA9KHVybCkgPT57XHJcbiAgbGV0IGhvbWVfcGF0aCA9IGNvbnN0cygnSE9NRV9GSUxFUEFUSCcpXHJcbiAgbGV0IHJvb3RVcmwgPSBfLmdldFJvb3RVcmwoKVxyXG4gIGxldCByZWxhdGl2ZVBhdGggPSBfLm1ha2VSZWxhdGl2ZVBhdGgodXJsLCByb290VXJsKVxyXG4gIGxldCBmaWxlUGF0aCA9IF8uZmlsZVBhdGgocmVsYXRpdmVQYXRoKVxyXG4gIHJldHVybiAoaG9tZV9wYXRoID09PSBmaWxlUGF0aClcclxufVxyXG5cclxuXy5jb21wYXJlID0gKHdvcmQxLCB3b3JkMikgPT4ge1xyXG4gIHJldHVybiAod29yZDEgPT09IHdvcmQyKSA/IDAgOi0xO1xyXG59O1xyXG4iLCJsZXQgcmggPSByZXF1aXJlKFwiLi4vLi4vbGliL3JoXCIpXHJcbmxldCAkID0gcmguJFxyXG5sZXQgXyA9IHJoLl9cclxubGV0IG5vZGVVdGlscyA9IHJlcXVpcmUoXCIuL25vZGVfdXRpbHNcIilcclxuY29uc3QgdXRpbCA9IHsgXHJcbiAgc2NoZW1lKHVybCkge1xyXG4gICAgbGV0IGluZGV4LCBzY2hlbWVcclxuICAgIGluZGV4ID0gdXJsLmluZGV4T2YoJzonKVxyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICBzY2hlbWUgPSB1cmwuc3Vic3RyaW5nKDAsIGluZGV4ICsgMSkudG9Mb3dlckNhc2UoKS50cmltKClcclxuICAgIH1cclxuICAgIHJldHVybiBzY2hlbWVcclxuICB9XHJcbn1cclxuY2xhc3MgSHRtbFJlc29sdmVyIHtcclxuXHJcbiAgZ2V0IHBhdGhzKCl7XHJcbiAgICByZXR1cm4gWydzcmMnLCAnaHJlZiddO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxpbmtzKCl7XHJcbiAgICByZXR1cm4gWydocmVmJ107XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gIH1cclxuICBcclxuICByZXNvbHZlKGh0bWwpe1xyXG4gICAgbGV0IG5vZGVzID0gbm9kZVV0aWxzLnRvSHRtbE5vZGUoaHRtbClcclxuICAgIF8uZWFjaChub2Rlcywgbm9kZSA9PiB7XHJcbiAgICAgIGlmKG5vZGVVdGlscy5pc0VsZW1lbnROb2RlKG5vZGUpKSB7XHJcbiAgICAgICAgJC50cmF2ZXJzZU5vZGUobm9kZSwgbm9kZSA9PiB0aGlzLnJlc29sdmVOb2RlKG5vZGUpKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIF8ucmVkdWNlKG5vZGVzLCAocmVzdWx0LCBub2RlKSA9PiB7XHJcbiAgICAgIHJlc3VsdCArPSBub2RlVXRpbHMub3V0ZXJIVE1MKG5vZGUpXHJcbiAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH0sICcnKVxyXG4gIH1cclxuXHJcbiAgcmVzb2x2ZU5vZGUobm9kZSl7XHJcbiAgICBfLmVhY2godGhpcy5wYXRocywgYXR0cmlidXRlID0+IHRoaXMucmVzb3ZlUGF0aHMobm9kZSwgYXR0cmlidXRlKSlcclxuICAgIF8uZWFjaCh0aGlzLmxpbmtzLCBhdHRyaWJ1dGUgPT4gdGhpcy5yZXNvdmVMaW5rcyhub2RlLCBhdHRyaWJ1dGUpKVxyXG4gICAgcmV0dXJuIHRydWVcclxuICB9XHJcblxyXG4gIHJlc292ZVBhdGhzKG5vZGUsIGF0dHJpYnV0ZSkge1xyXG4gICAgaWYoISQuaGFzQXR0cmlidXRlKG5vZGUsIGF0dHJpYnV0ZSkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBsZXQgdmFsdWUgPSAkLmdldEF0dHJpYnV0ZShub2RlLCBhdHRyaWJ1dGUpXHJcbiAgICAkLnNldEF0dHJpYnV0ZShub2RlLCBhdHRyaWJ1dGUsIHRoaXMucmVzb3ZlUGF0aCh2YWx1ZSkpICBcclxuICB9XHJcblxyXG4gIHJlc292ZUxpbmtzKG5vZGUsIGF0dHJpYnV0ZSl7XHJcbiAgICBpZighJC5oYXNBdHRyaWJ1dGUobm9kZSwgYXR0cmlidXRlKSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgICQuc2V0QXR0cmlidXRlKG5vZGUsIFwiZGF0YS1jbGlja1wiLCBcIkBjbG9zZSh0cnVlKVwiKVxyXG4gIH1cclxuXHJcbiAgcmVzb3ZlUGF0aChwYXRoKSB7XHJcbiAgICBpZighXy5pc1JlbGF0aXZlVXJsKHBhdGgpKXtcclxuICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcbiAgICBsZXQgYmFzZVVybCA9IF8uZ2V0Um9vdFVybCgpO1xyXG4gICAgbGV0IGZ1bGxVcmwgPSBfLm1ha2VGdWxsVXJsKHBhdGgpO1xyXG4gICAgcmV0dXJuIF8ubWFrZVJlbGF0aXZlVXJsKGZ1bGxVcmwsIGJhc2VVcmwpO1xyXG4gIH1cclxuICBtYWtlRnVsbFBhdGgocmVsVXJsLCBiYXNlVXJsKSB7XHJcbiAgICBpZighdGhpcy5pc1JlbGF0aXZlVXJsKHJlbFVybCkgfHwgdGhpcy5pc1JlbGF0aXZlVXJsKGJhc2VVcmwpKSB7XHJcbiAgICAgIHJldHVybiByZWxVcmxcclxuICAgIH1cclxuICAgIGxldCBiYXNlUGFydHMgPSB0aGlzLmZpbGVQYXRoKGJhc2VVcmwpLnNwbGl0KCcvJyksXHJcbiAgICAgIHJlbFBhdGggPSB0aGlzLmZpbGVQYXRoKHJlbFVybCksXHJcbiAgICAgIHBhcmFtcyA9IHJlbFVybC5zdWJzdHJpbmcocmVsUGF0aC5sZW5ndGgpLFxyXG4gICAgICByZWxQYXJ0cyA9IHJlbFBhdGguc3BsaXQoJy8nKVxyXG5cclxuICAgIGlmKHJlbFBhcnRzLmxlbmd0aCA+IDEgfHwgcmVsUGFydHNbMF0pIHtcclxuICAgICAgYmFzZVBhcnRzLnBvcCgpXHJcbiAgICAgIF8uZWFjaChyZWxQYXJ0cywgcmVsUGFydCA9PiB7XHJcbiAgICAgICAgaWYocmVsUGFydCA9PT0gJy4uJykge1xyXG4gICAgICAgICAgYmFzZVBhcnRzLnBvcCgpXHJcbiAgICAgICAgfSBlbHNlIGlmKHJlbFBhcnQgIT09ICcuJykge1xyXG4gICAgICAgICAgYmFzZVBhcnRzLnB1c2gocmVsUGFydClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBgJHtiYXNlUGFydHMuam9pbignLycpfSR7cGFyYW1zfWBcclxuICB9XHJcbiAgXHJcbiAgaXNSZWxhdGl2ZVVybCh1cmwpIHtcclxuICAgIHJldHVybiAhdXJsIHx8ICF1dGlsLnNjaGVtZSh1cmwpICYmIHVybC50cmltKCkuaW5kZXhPZignLycpXHJcbiAgfVxyXG5cclxuICBmaWxlUGF0aCh1cmwpIHtcclxuICAgIGxldCBpbmRleDtcclxuICAgIHVybCA9IHVybCB8fCAnJ1xyXG4gICAgaW5kZXggPSB1cmwuaW5kZXhPZignPycpXHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgaW5kZXgpXHJcbiAgICB9XHJcbiAgICBpbmRleCA9IHVybC5pbmRleE9mKCcjJylcclxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgdXJsID0gdXJsLnN1YnN0cmluZygwLCBpbmRleClcclxuICAgIH1cclxuICAgIHJldHVybiB1cmxcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWxSZXNvbHZlcjsiLCJsZXQgcmggPSByZXF1aXJlKCcuLi8uLi9saWIvcmgnKSxcclxuICBfID0gcmguXyxcclxuICAkID0gcmguJFxyXG5cclxuXy5yZXNldElmcmFtZVNpemUgPSBzZWxlY3RvciA9PiB7XHJcbiAgbGV0IGlmcmFtZSA9ICQoc2VsZWN0b3IsIDApXHJcbiAgcmV0dXJuIGlmcmFtZVxyXG59XHJcbiIsImxldCByaCA9IHJlcXVpcmUoXCIuLi8uLi9saWIvcmhcIilcclxubGV0IF8gPSByaC5fXHJcbmxldCBrZXlIYXNoID0ge1xyXG4gIDg6ICBcImJhY2tzcGFjZVwiLFxyXG4gIDEzOiBcInJldHVyblwiLFxyXG4gIDI3OiBcImVzY2FwZVwiLFxyXG4gIDM4OiBcImRvd25cIixcclxuICA0MDogXCJ1cFwiLFxyXG4gIDM5OiBcInJpZ2h0XCJcclxufVxyXG5cclxuXy5nZXRLZXlJbmRleCA9IChrZXlDb2RlKSA9PiB7XHJcbiAgaWYoa2V5SGFzaFtrZXlDb2RlXSkge1xyXG4gICAgcmV0dXJuIGtleUhhc2hba2V5Q29kZV1cclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIFwiZGVmYXVsdFwiXHJcbiAgfVxyXG59XHJcbiIsImxldCByaCA9IHJlcXVpcmUoXCIuLi8uLi9saWIvcmhcIilcclxubGV0ICQgPSByaC4kXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBub2RlVHlwZToge1xyXG4gICAgRUxFTUVOVF9OT0RFOiAxLFxyXG4gICAgQVRUUklCVVRFX05PREU6IDIsXHJcbiAgICBURVhUX05PREU6IDMsXHJcbiAgICBDREFUQV9TRUNUSU9OX05PREU6IDQsXHJcbiAgICBFTlRJVFlfUkVGRVJFTkNFX05PREU6IDUsXHJcbiAgICBFTlRJVFlfTk9ERTogNixcclxuICAgIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05fTk9ERTogNyxcclxuICAgIENPTU1FTlRfTk9ERTogOCxcclxuICAgIERPQ1VNRU5UX05PREU6IDksXHJcbiAgICBET0NVTUVOVF9UWVBFX05PREU6IDEwLFxyXG4gICAgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTogMTEsXHJcbiAgICBOT1RBVElPTl9OT0RFOiAxMlxyXG4gIH0sXHJcblxyXG4gIHJlbW92ZUNoaWxkKG5vZGUsIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZShub2RlKSkge1xyXG4gICAgcmV0dXJuIHBhcmVudCAmJiBwYXJlbnQucmVtb3ZlQ2hpbGQgJiYgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpXHJcbiAgfSxcclxuICBhcHBlbmRDaGlsZChwYXJlbnQsIG5ld05vZGUpIHtcclxuICAgIHJldHVybiBwYXJlbnQgJiYgcGFyZW50LmFwcGVuZENoaWxkICYmIHBhcmVudC5hcHBlbmRDaGlsZChuZXdOb2RlKVxyXG4gIH0sXHJcbiAgcGFyZW50Tm9kZShub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLnBhcmVudE5vZGVcclxuICB9LFxyXG4gIGNoaWxkTm9kZXMobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5jaGlsZE5vZGVzIHx8IFtdXHJcbiAgfSxcclxuICB0b0h0bWxOb2RlKGh0bWwpIHtcclxuICAgIHJldHVybiB0aGlzLmNoaWxkTm9kZXMoJC5jcmVhdGVFbGVtZW50KCdkaXYnLCBodG1sKSlcclxuICB9LFxyXG4gIG91dGVySFRNTChub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLm91dGVySFRNTCB8fCAnJ1xyXG4gIH0sXHJcbiAgaW5zZXJ0QWZ0ZXIobm9kZSwgbmV3Tm9kZSl7XHJcbiAgICByZXR1cm4gbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBub2RlLm5leHRTaWJsaW5nKVxyXG4gIH0sXHJcbiAgdmFsdWUobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5ub2RlVmFsdWVcclxuICB9LFxyXG4gIG5hbWUobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5ub2RlTmFtZVxyXG4gIH0sXHJcbiAgdHlwZShub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLm5vZGVUeXBlXHJcbiAgfSxcclxuICBpc0VsZW1lbnROb2RlKG5vZGUpIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGUobm9kZSkgPT09IHRoaXMubm9kZVR5cGUuRUxFTUVOVF9OT0RFXHJcbiAgfSxcclxuICBpc1RleHROb2RlKG5vZGUpIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGUobm9kZSkgPT09IHRoaXMubm9kZVR5cGUuVEVYVF9OT0RFXHJcbiAgfVxyXG59IiwibGV0IHJoID0gcmVxdWlyZShcIi4uLy4uL2xpYi9yaFwiKVxyXG5sZXQgXyA9IHJoLl9cclxuXHJcbl8uYWRkUGFyYW0gPSAodXJsLCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgbGV0IGhhc2hTdHIgPSBfLmV4dHJhY3RIYXNoU3RyaW5nKHVybClcclxuICBsZXQgcGFyYW1zU3RyID0gXy5leHRyYWN0UGFyYW1TdHJpbmcodXJsKVxyXG4gIGxldCBwYXJhbXNNYXAgPSBfLnVybFBhcmFtcyhwYXJhbXNTdHIpXHJcbiAgcGFyYW1zTWFwW2tleV0gPSB2YWx1ZVxyXG4gIGxldCBzdHJpcHBlZFVybCA9IF8uc3RyaXBCb29rbWFyayh1cmwpXHJcbiAgc3RyaXBwZWRVcmwgPSBfLnN0cmlwUGFyYW0oc3RyaXBwZWRVcmwpXHJcblxyXG4gIGxldCB1cmxIYXNoU3RyID0gKGhhc2hTdHIgPT09ICcnKT8gaGFzaFN0ciA6ICcjJysgaGFzaFN0clxyXG5cclxuICBsZXQgdXBkYXRlZFBhcmFtc1N0ciA9IHJoLl8ubWFwVG9FbmNvZGVkU3RyaW5nKHBhcmFtc01hcClcclxuICBsZXQgdXJsUGFyYW1zU3RyID0gKHVwZGF0ZWRQYXJhbXNTdHIgPT09ICcnKT91cGRhdGVkUGFyYW1zU3RyOiAnPycgKyB1cGRhdGVkUGFyYW1zU3RyXHJcbiAgcmV0dXJuIHN0cmlwcGVkVXJsICsgdXJsUGFyYW1zU3RyICsgdXJsSGFzaFN0clxyXG59XHJcblxyXG5fLnJlbW92ZVBhcmFtID0gKHVybCwgcGFyYW0pID0+IHtcclxuICBsZXQgaGFzaFN0ciA9IF8uZXh0cmFjdEhhc2hTdHJpbmcodXJsKVxyXG4gIGxldCBwYXJhbXNTdHIgPSBfLmV4dHJhY3RQYXJhbVN0cmluZyh1cmwpXHJcbiAgbGV0IHBhcmFtc01hcCA9IF8udXJsUGFyYW1zKHBhcmFtc1N0cilcclxuICBwYXJhbXNNYXBbcGFyYW1dID0gbnVsbFxyXG4gIGxldCBzdHJpcHBlZFVybCA9IF8uc3RyaXBCb29rbWFyayh1cmwpXHJcbiAgc3RyaXBwZWRVcmwgPSBfLnN0cmlwUGFyYW0oc3RyaXBwZWRVcmwpXHJcblxyXG4gIGxldCB1cmxIYXNoU3RyID0gKGhhc2hTdHIgPT09ICcnKT8gaGFzaFN0ciA6ICcjJysgaGFzaFN0clxyXG5cclxuICBsZXQgdXBkYXRlZFBhcmFtc1N0ciA9IHJoLl8ubWFwVG9FbmNvZGVkU3RyaW5nKHBhcmFtc01hcClcclxuICBsZXQgdXJsUGFyYW1zU3RyID0gKHVwZGF0ZWRQYXJhbXNTdHIgPT09ICcnKT91cGRhdGVkUGFyYW1zU3RyOiAnPycgKyB1cGRhdGVkUGFyYW1zU3RyXHJcbiAgcmV0dXJuIHN0cmlwcGVkVXJsICsgdXJsUGFyYW1zU3RyICsgdXJsSGFzaFN0clxyXG59XHJcblxyXG5fLmNyZWF0ZUhhc2hlZFVybCA9ICh1cmwpID0+e1xyXG4gIC8vbGV0IGhhc2hlZFVybCA9IHVybFxyXG4gIGxldCByZWxVcmwsIHBhcmFtc1xyXG4gIGlmKCFfLmlzUm9vdFVybCh1cmwpKXtcclxuICAgIGxldCByb290VXJsID0gXy5nZXRSb290VXJsKClcclxuICAgIGlmKF8uaXNFeHRlcm5hbFVybCh1cmwpKXtcclxuICAgICAgcmVsVXJsID0gdXJsXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBwYXJhbXMgPSBfLmdldFBhcmFtc0ZvclJvb3QodXJsLCB0cnVlKVxyXG4gICAgICByZWxVcmwgPSBfLmZpeFJlbGF0aXZlVXJsKCBfLm1ha2VSZWxhdGl2ZVBhdGggKHVybCwgcm9vdFVybCkpXHJcbiAgICAgIHVybCA9IGAke3Jvb3RVcmx9JHtwYXJhbXN9I3Q9JHtlbmNvZGVVUklDb21wb25lbnQocmVsVXJsKX1gXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB1cmxcclxufVxyXG4iXX0=
