(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var model = rh.model;


var HASH_KEY_RH_SEARCH = consts('HASH_KEY_RH_SEARCH');
var HASH_KEY_TOPIC = consts('HASH_KEY_TOPIC');
var HASH_KEY_UIMODE = consts('HASH_KEY_UIMODE');
var HASH_KEY_RH_TOCID = consts('HASH_KEY_RH_TOCID');
var HASH_KEY_RH_HIGHLIGHT = consts('HASH_KEY_RH_HIGHLIGHT');
var HASH_KEY_RANDOM = consts('HASH_KEY_RANDOM');
var hashQueryKeys = [HASH_KEY_RH_HIGHLIGHT, consts('HASH_KEY_RH_SYNS'), HASH_KEY_RH_TOCID];

// Helper methods
var getMergedParamsMap = function getMergedParamsMap(topicUrl) {
  var paramsMap = _.urlParams(_.extractParamString(topicUrl));
  var hashMap = _.hashParams(_.extractHashString(topicUrl));
  return _.extend(paramsMap, hashMap);
};

var getTopicURL = function getTopicURL(newMap, topicUrl) {
  topicUrl = topicUrl;
  var filePath = _.filePath(topicUrl);
  var bookMark = _.extractHashString(topicUrl);
  if (bookMark.length > 0) {
    bookMark = '#' + bookMark;
  }

  var paramsMap = _.urlParams(_.extractParamString(topicUrl));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Array.from(hashQueryKeys)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;
      if (newMap[key] != null) {
        paramsMap[key] = newMap[key];
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

  if (model.get(consts('KEY_SCREEN_IOS'))) {
    paramsMap[HASH_KEY_RANDOM] = _.uniqueId();
  }
  var params = _.mapToEncodedString(paramsMap);
  if (params.length > 0) {
    params = '?' + params;
  }

  return '' + filePath + params + bookMark;
};

var queueUpdateHashMap = _.queueUpdateHashMap;


var fixHashMapForTopic = function fixHashMapForTopic(hashMap) {
  if (hashMap == null) {
    hashMap = {};
  }
  hashMap[HASH_KEY_UIMODE] = null;
  hashMap[HASH_KEY_RANDOM] = null;
  if (!hashMap[HASH_KEY_RH_TOCID]) {
    hashMap[HASH_KEY_RH_TOCID] = null;
  }
  if (!hashMap[HASH_KEY_RH_HIGHLIGHT]) {
    hashMap[HASH_KEY_RH_HIGHLIGHT] = null;
  }
  return hashMap;
};

var showTopic = function showTopic(relUrl, addToHistory) {
  relUrl = _.fixRelativeUrl(relUrl);
  var hashMap = _.urlParams(_.extractParamString(relUrl));
  hashMap[HASH_KEY_TOPIC] = _.stripParam(relUrl);
  hashMap = fixHashMapForTopic(hashMap);
  return queueUpdateHashMap(hashMap, addToHistory);
};

var showNonTopic = function showNonTopic(url, addToHistory) {
  var hashMap = {};
  hashMap[HASH_KEY_TOPIC] = url;
  hashMap = fixHashMapForTopic(hashMap);
  return queueUpdateHashMap(hashMap, addToHistory);
};

({
  isSameTopic: function isSameTopic(url1, url2) {}
});

//Event Handlers

var hashChanged = function hashChanged(obj) {
  var searchTermChanged = void 0;
  var newMap = obj.newMap;
  var oldMap = obj.oldMap;

  var oldUiMode = oldMap[HASH_KEY_UIMODE];
  var uiMode = newMap[HASH_KEY_UIMODE];

  if (HASH_KEY_RH_SEARCH in newMap) {
    var searchTerm = newMap[HASH_KEY_RH_SEARCH];
    searchTermChanged = searchTerm !== model.get(consts('KEY_SEARCHED_TERM'));
    model.publish(consts('KEY_SEARCH_TERM'), searchTerm, { sync: true });
  }

  if (uiMode === 'search') {
    if (searchTermChanged && window.gHost) {
      model.publish(consts('EVT_QUERY_SEARCH_RESULTS'), true);
    }
  }

  if (!uiMode || newMap[HASH_KEY_TOPIC]) {
    var topicUrl = void 0;
    var oldTopicUrl = model.get(consts('KEY_TOPIC_IN_IFRAME'));
    if (HASH_KEY_TOPIC in newMap) {
      topicUrl = newMap[HASH_KEY_TOPIC];
    }
    if (!topicUrl) {
      topicUrl = oldTopicUrl;
    }
    var feature = rh.model.get(rh.consts('KEY_FEATURE'));
    if (!topicUrl && (!feature || feature.showDefTopic !== false)) {
      topicUrl = window.gDefaultTopic != null ? window.gDefaultTopic.substring(1) : undefined;
    }
    var changed = topicUrl && (topicUrl !== oldTopicUrl || oldUiMode !== uiMode || oldMap[HASH_KEY_RH_HIGHLIGHT] !== newMap[HASH_KEY_RH_HIGHLIGHT] || oldMap[HASH_KEY_RH_TOCID] !== newMap[HASH_KEY_RH_TOCID]);
    if (changed) {
      if (_.stripBookmark(topicUrl) !== _.stripBookmark(oldTopicUrl)) {
        _.runTopicLoadingAnimation(true);
      }
      model.publish(consts('KEY_TOPIC_IN_IFRAME'), topicUrl);
      window.loadTopic(getTopicURL(newMap, topicUrl));
    }
  }

  return model.publish(consts('KEY_UI_MODE'), newMap[HASH_KEY_UIMODE]);
};

var topicChanged = function topicChanged(topicUrl) {
  var hashMap = _.hashParams();
  if (topicUrl && !hashMap[HASH_KEY_UIMODE]) {
    var decodedURI = decodeURI(document.location.href);
    var relUrl = window._getRelativeFileName(decodedURI, topicUrl);
    var oldUrl = hashMap[HASH_KEY_TOPIC];
    if (!oldUrl || _.filePath(relUrl) !== _.filePath(oldUrl)) {
      model.publish(consts('KEY_TOPIC_IN_IFRAME'), relUrl);
      return showTopic(relUrl, false);
    }
  }
};

var navigateToUrl = function navigateToUrl(obj) {
  var url = obj.absUrl;
  if (_.isRootUrl()) {
    if (_.isUrlAllowdInIframe(url)) {
      url = _.makeRelativeUrl(_.fixRelativeUrl(url));
      if (_.isHomeUrl(url)) {
        return document.location.href = url;
      }
      var fileName = url && _.filePath(url);
      if (fileName === consts('START_FILEPATH')) {
        url = url.substring(fileName.length); //never pass start file inside iframe
      } else if (!url) {
        url = '#ux';
      }

      if (url[0] === '#' || url[0] === '?') {
        var hashMap = _.hashParams(_.extractHashString(url));
        if (!(HASH_KEY_UIMODE in hashMap)) {
          hashMap[HASH_KEY_UIMODE] = null;
        }
        return queueUpdateHashMap(hashMap, true);
      } else if (url) {
        return showTopic(url, true);
      }
    } else {
      return showNonTopic(url, true);
    }
  } else {
    if (!_.isRootUrl(url)) {
      var params = void 0,
          relUrl = void 0;
      var rootUrl = _.getRootUrl();
      if (_.isExternalUrl(url)) {
        relUrl = url;
      } else {
        params = _.getParamsForRoot(url);
        relUrl = _.fixRelativeUrl(_.makeRelativePath(url, rootUrl));
      }
      url = '' + rootUrl + params + '#t=' + encodeURIComponent(relUrl);
    }
    return document.location.href = url;
  }
};

model.subscribe(consts('EVT_WIDGET_LOADED'), function () {
  _.addEventListener(document, 'click', _.hookClick);

  model.subscribe(consts('EVT_HASH_CHANGE'), hashChanged);

  model.subscribe(consts('KEY_TOPIC_URL'), topicChanged);

  model.subscribe(consts('EVT_NAVIGATE_TO_URL'), navigateToUrl);

  // call to update old layout specific variables
  model.subscribe(consts('KEY_TOPIC_IN_IFRAME'), function (topicUrl) {
    if ('' + window.gHost + window.gHostPath !== '/') {
      // wait to resolve gHostPath
      if (window.setTopic) {
        window.setTopic();
      }
      if (window.changeTopicLink) {
        return window.changeTopicLink(document.location.toString());
      }
    }
  });

  model.subscribe(consts('EVT_TOPIC_LOADED'), function () {
    return _.runTopicLoadingAnimation(false);
  });

  return model.subscribe(consts('EVT_INSIDE_IFRAME_DOM_CONTENTLOADED'), function () {
    return _.runTopicLoadingAnimation(false);
  });
});

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;
var model = rh.model;
var _ = rh._;
var consts = rh.consts;
var http = rh.http;


var GlossaryController = function () {
  var entrys = undefined;
  GlossaryController = function (_rh$NavController) {
    _inherits(GlossaryController, _rh$NavController);

    _createClass(GlossaryController, null, [{
      key: 'initClass',
      value: function initClass() {

        entrys = 'entrys';
      }
    }]);

    function GlossaryController(widget) {
      _classCallCheck(this, GlossaryController);

      var _this = _possibleConstructorReturn(this, (GlossaryController.__proto__ || Object.getPrototypeOf(GlossaryController)).call(this));

      _this.data = [];
      _this.chunkCount = 0;
      _this.count = 0;
      _this.keys = '';
      _this.alhpabet = '';
      _this.loadNavData('glo');
      _this.filter = '';
      _this.widget = widget;
      _this.widget.publish('show', {});
      return _this;
    }

    _createClass(GlossaryController, [{
      key: 'addElement',
      value: function addElement(elements, list) {
        var _this2 = this;

        return function () {
          var result = [];
          _.each(elements[entrys], function (element) {
            if (element != null) {
              if (!_this2.lookup(list, element)) {
                result.push(list.push(element));
              } else {
                result.push(undefined);
              }
            }
          }, _this2);
          return result;
        }();
      }
    }, {
      key: 'exists',
      value: function exists(name) {
        var ch = this.alphaText(name);
        if (this.alhpabet.indexOf(ch) > -1) {
          return true;
        }
        this.alhpabet += ch;
        return false;
      }
    }, {
      key: 'isFiltered',
      value: function isFiltered(name, modelKey) {
        var filter = modelKey ? model.get(modelKey) : this.filter;
        return filter && name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) === -1;
      }
    }, {
      key: 'alphaText',
      value: function alphaText(name) {
        return name.toUpperCase().charAt(0);
      }
    }, {
      key: 'filterGlo',
      value: function filterGlo(value) {
        this.filter = value.toLocaleLowerCase();
        this.alhpabet = '';
        return model.publish(consts('PROJECT_GLOSSARY_DATA'), model.get(consts('PROJECT_GLOSSARY_DATA')));
      }
    }]);

    return GlossaryController;
  }(rh.NavController);
  GlossaryController.initClass();
  return GlossaryController;
}();

rh.controller('GlossaryController', GlossaryController);

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var model = rh.model;
var _ = rh._;
var consts = rh.consts;
var http = rh.http;
var rhs = rh.rhs;

var topics = 'topics';

var NavController = function () {
  function NavController() {
    _classCallCheck(this, NavController);

    this.updateData = this.updateData.bind(this);
  }

  _createClass(NavController, [{
    key: 'lookup',
    value: function lookup(children, key) {
      var element = void 0;
      if (children != null && key != null) {
        _.any(children, function (child) {
          if (child != null) {
            if (key.type === child.type && key.name === child.name && _.isEqual(key.url, child.url)) {
              element = child;
            }
            return element != null;
          }
        }, this);
      }
      return element;
    }
  }, {
    key: 'sort',
    value: function sort(array) {
      return array.sort(function (first, second) {
        return window.compare(first.name, second.name);
      });
    }
  }, {
    key: 'updateData',
    value: function updateData(constKey, projectUrl) {
      var curData = model.get(consts('KEY_TEMP_DATA')) || [];
      model.publish(consts('KEY_TEMP_DATA'));
      this.addElement(curData, this.data, projectUrl, this.keys);
      if (--this.chunkCount === 0 && this.count === 0) {
        this.sort(this.data);
        return model.publish(consts(constKey), this.data);
      }
    }
  }, {
    key: 'getChunkData',
    value: function getChunkData(projectUrl, key) {
      this.count--;
      var arr = __guard__(model.get(consts('KEY_TEMP_DATA')), function (x) {
        return x['chunkinfos'];
      }) || [];
      this.chunkCount += arr.length;
      return _.each(arr, function (chunk) {
        var _this = this;

        if (projectUrl) {
          projectUrl = _.ensureSlash(projectUrl);
        }
        return _.loadScript(projectUrl + 'whxdata/' + chunk.node + '.new.js', false, function () {
          return _this.updateData(key, projectUrl);
        });
      }, this);
    }
  }, {
    key: 'loadNavData',
    value: function loadNavData(type) {
      var _this2 = this;

      return model.subscribe(consts('KEY_PROJECT_LIST'), function (list) {
        _this2.alhpabet = '';
        _this2.count += list.length;
        return _.each(list, function (projectUrl) {
          var _this3 = this;

          if (projectUrl) {
            projectUrl = _.ensureSlash(projectUrl);
          }
          return _.loadScript(projectUrl + 'whxdata/' + (type === 'ndx' ? 'idx' : 'glo') + '.new.js', false, function () {
            return _this3.getChunkData(projectUrl, type === 'ndx' ? 'PROJECT_INDEX_DATA' : 'PROJECT_GLOSSARY_DATA');
          });
        }, _this2);
      });
    }
  }]);

  return NavController;
}();

rh.NavController = NavController;

var IndexController = function () {
  var defProject = undefined;
  IndexController = function (_rh$NavController) {
    _inherits(IndexController, _rh$NavController);

    _createClass(IndexController, null, [{
      key: 'initClass',
      value: function initClass() {
        defProject = '';
      }
    }]);

    function IndexController(widget) {
      _classCallCheck(this, IndexController);

      var _this4 = _possibleConstructorReturn(this, (IndexController.__proto__ || Object.getPrototypeOf(IndexController)).call(this));

      _this4.data = [];
      _this4.chunkCount = 0;
      _this4.count = 0;
      _this4.alhpabet = '';
      _this4.filter = '';
      _this4.keys = 'keys';
      _this4.widget = widget;

      model.subscribeOnce(consts('EVT_PROJECT_LOADED'), function () {
        _this4.loadNavData('ndx');
        _this4.getIndexData();
        return model.subscribe(consts('KEY_INDEX_FILTER'), function () {
          return _this4.alhpabet = '';
        });
      });
      return _this4;
    }

    _createClass(IndexController, [{
      key: 'addElement',
      value: function addElement(element, list, projectUrl, data) {
        var _this5 = this;

        if (element[data] != null) {
          return function () {
            var result = [];
            _.each(element[data], function (child) {
              if (child != null) {
                var existing;

                if (!(existing = _this5.lookup(list, child))) {
                  var obj = { type: child.type, name: child.name };
                  if (child['data-rhtags']) {
                    obj['data-rhtags'] = child['data-rhtags'] + '+' + projectUrl;
                  }
                  if (!child.url) {
                    obj[topics] = [];
                  }
                  var relUrl = _.makeRelativeUrl('' + projectUrl, defProject);
                  if (child.url != null) {
                    obj.url = '' + encodeURI(relUrl) + child.url;
                  }
                  if (child.url == null) {
                    obj[_this5.keys] = [];
                  }
                  list.push(obj);
                  existing = list[list.length - 1];
                }
                _this5.addElement(child, existing[_this5.keys], projectUrl, _this5.keys);
                result.push(_this5.addElement(child, existing[topics], projectUrl, topics));
              }
            }, _this5);
            return result;
          }();
        }
      }
    }, {
      key: 'showItem',
      value: function showItem(name) {
        var filter = model.get(consts('KEY_INDEX_FILTER'));
        return !filter || name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1;
      }
    }, {
      key: 'showCategory',
      value: function showCategory(name, level) {
        if (level > 0) {
          return false;
        }
        var ch = this.alphaText(name);
        if (this.alhpabet.indexOf(ch) > -1) {
          return false;
        }
        this.alhpabet += ch;
        return true;
      }
    }, {
      key: 'showNextLevel',
      value: function showNextLevel(node) {
        var id = node.getAttribute('data-indexid');
        var old = this.widget.get('show.' + id);
        var childData = _defineProperty({}, id, !old);
        while (id) {
          id = id.substr(0, id.lastIndexOf('_'));
          childData[id] = true;
        }
        return this.widget.publish('show', childData);
      }
    }, {
      key: 'alphaText',
      value: function alphaText(name) {
        return name.toUpperCase().charAt(0);
      }
    }, {
      key: 'getIndexData',
      value: function getIndexData() {
        return model.subscribeOnce(consts('KEY_PUBLISH_BASE_URL'), function () {
          try {
            var baseUrl = model.get(consts('KEY_PUBLISH_BASE_URL'));
            var host = document.location.origin;
            var baseContext = baseUrl.substr(host.length);
            var parentPath = _.parentPath(_.filePath(_.getRootUrl()));
            if (baseContext && !_.isEmptyString(baseContext)) {
              var hashString = _.mapToEncodedString(_.extend(_.addPathNameKey({ area: rhs.area(),
                prj: rhs.project(), type: rhs.type(), agt: 'ndx', mgr: 'agm'
              })));
              return http.get(baseContext + '?' + hashString).success(function (data, status) {
                data = JSON.parse(data);
                var list = [];
                var rootPrjs = [];
                var projects = data.allProjects;
                var _data = data,
                    masterProjects = _data.masterProjects;

                if (projects.length) {
                  projects[0] = _.ensureSlash(projects[0]);
                }
                var makelist = function makelist(projectList, outList) {
                  return _.each(projectList, function (item) {
                    return outList.push(_.makeRelativeUrl(item, projects[0]));
                  });
                };
                makelist(projects, list);
                makelist(masterProjects, rootPrjs);
                var updateList = function updateList(item, index, list) {
                  if (_.isEmptyString(item)) {
                    list[index] = '.';
                  }
                };
                _.each(list, updateList);
                _.each(rootPrjs, updateList);
                model.publish(consts('KEY_PROJECT_LIST'), list);
                return model.publish(consts('KEY_MASTER_PROJECT_LIST'), rootPrjs);
              });
            }
          } catch (err) {
            if (rh._debug) {
              return rh._d('warn', err.message);
            }
          }
        });
      }
    }]);

    return IndexController;
  }(rh.NavController);
  IndexController.initClass();
  return IndexController;
}();

rh.controller('IndexController', IndexController);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

},{}],4:[function(require,module,exports){
"use strict";

var rh = require("../../src/lib/rh");
var _ = rh._;

_.findEditDist = function (first, second) {
  if (first == second) return 0;
  var prevDist = [];
  var dist = [];
  for (var i = 0; i < second.length + 1; i++) {
    prevDist.push(i);
    dist.push(0); //just to create a array of size second.length+1
  }

  for (var i = 0; i < first.length; i++) {
    dist[0] = i + 1;

    for (var j = 0; j < second.length; j++) {
      var curr = void 0;
      if (first[i] == second[j]) curr = 0;else curr = 1;

      dist[j + 1] = Math.min(dist[j] + 1, prevDist[j + 1] + 1, prevDist[j] + curr);
    }

    for (var j = 0; j < prevDist.length; j++) {
      prevDist[j] = dist[j];
    }
  }
  return dist[dist.length - 1];
};

},{"../../src/lib/rh":24}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bind = function bind(fn, me) {
  return function () {
    return fn.apply(me, arguments);
  };
};

var rh = require("../../src/lib/rh");
var nodeUtil = require('../../src/responsive_help/utils/node_utils');
var _ = rh._;
var $ = rh.$;
var model = rh.model;
var consts = rh.consts;
var KEY_TOC_DRILL_DOWN = consts('KEY_TOC_DRILL_DOWN');
var ANIM_TIME = 700;
var SyncToc = void 0;
var TocController = void 0;

SyncToc = function () {
  var SyncToc = function () {
    function SyncToc() {
      _classCallCheck(this, SyncToc);
    }

    _createClass(SyncToc, [{
      key: 'sync',
      value: function sync(tc, info) {
        var node = void 0;
        tc.updateActiveBookInfo(0, '_');

        node = tc.widget.node;
        //tc.updateBreadcrumbInfo(tc.widget.node);

        this.reset(info);
        return this.syncToProjectToc(tc, node.children, function (_this) {
          return function (nodes) {
            return _this.syncToTocItem(tc, nodes);
          };
        }(this));
      }
    }, {
      key: 'reset',
      value: function reset(info) {
        var idx = void 0;
        this.parseTocInfo(info);
        idx = this.order.lastIndexOf('@');
        return this.parentOrder = idx !== -1 ? this.order.substring(0, idx) : '';
      }
    }, {
      key: 'parseTocInfo',
      value: function parseTocInfo(info) {
        var path = void 0;
        this.order = info.childOrder || '';
        path = _.splitAndTrim(info.childPrefix, '.');
        this.tocPath = _.reduce(path, function (result, prefix) {
          var arr = void 0,
              bookNo = void 0;
          arr = _.splitAndTrim(prefix, '@');
          if (bookNo = arr.shift()) {
            result.push({
              bookNo: _.parseInt(bookNo, 0),
              order: arr.length > 0 ? '@' + arr.join('@') : ''
            });
          }
          return result;
        }, []);
        path = _.splitAndTrim(info.topicID || '0', '_');
        this.bookNos = _.map(path.shift().split('.'), function (item) {
          return _.parseInt(item, 0);
        });
        return this.pageNo = _.parseInt(path.shift(), 0);
      }
    }, {
      key: 'syncToProjectToc',
      value: function syncToProjectToc(tc, nodes, success) {
        var curBookNo = void 0,
            idx = void 0,
            path = void 0;
        if (this.tocPath.length > 0) {
          curBookNo = 0;
          path = this.tocPath.shift();
          idx = _.findIndex(nodes, function (child) {
            var childOrder = void 0;
            childOrder = $.dataset(child, 'childorder') || '';
            if (childOrder === path.order && tc.isBookNode(child)) {
              curBookNo++;
              if (curBookNo === path.bookNo) {
                return true;
              }
            }
            return false;
          });
          if (idx !== -1) {
            return tc.openBook(nodes[idx], true, function (_this) {
              return function () {
                return _.defer(function () {
                  var child = void 0,
                      childNodes = void 0;
                  child = nodes[idx + 1];
                  if (childNodes = child.children && child.children[0]) {
                    return _this.syncToProjectToc(tc, childNodes.children, success);
                  }
                });
              };
            }(this));
          }
        } else if (success) {
          return success(nodes);
        }
      }
    }, {
      key: 'syncToTocItem',
      value: function syncToTocItem(tc, nodes, wait) {
        var curBookNo = void 0,
            curPageNo = void 0,
            lastBookNode = void 0;
        if (wait == null) {
          wait = 1;
        }
        curPageNo = 0;
        curBookNo = 0;
        lastBookNode = null;
        return _.any(nodes, function (_this) {
          return function (child) {
            var bookNode = void 0,
                childOrder = void 0,
                hasChild = void 0,
                pageNode = void 0,
                topicNode = void 0;
            childOrder = $.dataset(child, 'childorder') || '';
            if (childOrder !== _this.order) {
              return;
            }
            if (tc.isBookNode(child)) {
              bookNode = child;
              lastBookNode = bookNode;
            }
            if (bookNode) {
              curBookNo++;
            }
            if (_this.bookNos[0] !== curBookNo) {
              return;
            }
            if (tc.isPageNode(child)) {
              pageNode = child;
            }
            if (pageNode) {
              curPageNo++;
            }
            if (_this.bookNos.length === 1) {
              if (_this.pageNo === 0) {
                topicNode = child;
                if (lastBookNode) {
                  tc.openBook(lastBookNode, true, function () {
                    return tc.updateBookInfo();
                  });
                }
              } else if (pageNode && curPageNo === _this.pageNo) {
                topicNode = child;
              }
              tc.updateBookInfo();
              if (topicNode) {
                tc.selectLink(topicNode, true, wait);
              }
            } else if (lastBookNode && (hasChild = $.hasClass(child, 'child'))) {
              _this.bookNos.shift();
              tc.openBook(lastBookNode, true, function () {
                return _.defer(function () {
                  var childNodes = void 0;
                  if (childNodes = child.children && child.children[0]) {
                    return _this.syncToTocItem(tc, childNodes.children, ANIM_TIME);
                  }
                });
              });
              return true;
            }
            return topicNode != null;
          };
        }(this));
      }
    }]);

    return SyncToc;
  }();

  return SyncToc;
}();

TocController = function () {
  var ACTIVE_CLASS = void 0,
      COLLAPSING_CLASS = void 0,
      EXPANDED_CLASS = void 0,
      EXPANDING_CLASS = void 0,
      KEY_ACTIVE_BOOKID = void 0,
      KEY_ACTIVE_BOOK_LEVEL = void 0,
      KEY_BOOKID = void 0,
      KEY_BOOK_LEVEL = void 0,
      KEY_SHOW_CHILD = void 0,
      KEY_TOC = void 0,
      LOADING_BOOK = void 0,
      SELECTED_CLASS = void 0;

  EXPANDED_CLASS = 'expanded';

  ACTIVE_CLASS = 'active';

  COLLAPSING_CLASS = 'collapsing';

  EXPANDING_CLASS = 'expanding';

  LOADING_BOOK = 'loading-book';

  SELECTED_CLASS = 'selected';

  KEY_SHOW_CHILD = 'show_child';

  KEY_BOOKID = 'bookid';

  KEY_ACTIVE_BOOKID = 'active_bookid';

  KEY_BOOK_LEVEL = 'level';

  KEY_ACTIVE_BOOK_LEVEL = 'active_level';

  KEY_TOC = '.p.toc';
  var CURRENT_TOC_KEY = 'curtoc',
      TOC_ITEM_ATTR = 'data-tocitem';

  var KEY_BREADCRUMBS = consts('KEY_TOC_BREADCRUMBS');

  var TocController = function () {
    function TocController(widget) {
      var _this2 = this;

      _classCallCheck(this, TocController);

      this.widget = widget;
      this.subscribeTopicID = bind(this.subscribeTopicID, this);

      this.onClick = bind(this.onClick, this);
      this.updateBookInfo = bind(this.updateBookInfo, this);
      this._data = {};
      this.projectAbsRef = [];
      if (this.syncToc == null) {
        this.syncToc = new SyncToc();
      }
      this.widget.publish(KEY_BOOK_LEVEL, 0);
      this.widget.publish(KEY_BOOKID, '_');
      rh.model.subscribe(KEY_TOC, function (data) {
        _this2.widget.publish(CURRENT_TOC_KEY, data);
        _this2.widget.publish('curlevel', 0);
      });
      this.widget.subscribe(consts('KEY_TOC_SELECT_ITEM'), this.selectTocItem.bind(this));
      model.subscribeOnce([consts('EVT_PROJECT_LOADED'), consts('KEY_TOC_ORDER')], function (_this) {
        return function () {
          if (model.get(consts('KEY_PUBLISH_MODE'))) {
            return _this.getTOCData();
          } else {
            return _this.loadToc(KEY_TOC, '', function () {
              _this.widget.publish(consts('EVT_TOC_LOADED'), true);
              return _.defer(function () {
                return _this.widget.subscribe(rh.consts('KEY_TOPIC_ID'), _this.subscribeTopicID);
              });
            });
          }
        };
      }(this));
    }

    _createClass(TocController, [{
      key: 'expandBook',
      value: function expandBook(level, id, node, item) {
        this.selectTocItem({ 'id': id });
        var key = $.getAttribute(node, 'data-itemkey');
        rh.model.publish('EVT_TOC_LOADED' + 'gototab', { 'tab': 0, 'key': key, 'item': item });
      }
    }, {
      key: 'updateBookInfo',
      value: function updateBookInfo() {
        var id = void 0,
            newLevel = void 0;
        id = this.widget.get(KEY_ACTIVE_BOOKID);
        if (id != null && id !== this.widget.get(KEY_BOOKID)) {
          this.widget.publish(KEY_BOOKID, id);
        }
        newLevel = this.widget.get(KEY_ACTIVE_BOOK_LEVEL);
        if (newLevel != null && newLevel !== this.widget.get(KEY_BOOK_LEVEL)) {
          return this.widget.publish(KEY_BOOK_LEVEL, newLevel);
        }
      }
    }, {
      key: 'updateActiveBookInfo',
      value: function updateActiveBookInfo(level, id) {
        this.widget.publish(KEY_ACTIVE_BOOKID, id);

        return this.widget.publish(KEY_ACTIVE_BOOK_LEVEL, level);
      }
      /*
      _addBookmark(node){
        let that = this.this;
        if(!Array.isArray(this.path) || this.path.length === 0){
          return false;
        }
        if(that.isTOCItem(node)){
          if(this.currIndex === this.path[0]){
            let index = this.path.shift();
            this.curr_path += (this.curr_path === "")? index.toString() : "_" + index.toString();
            let text = that.getText(node);
            this.bookmarks.push({text: text, path: this.curr_path });
            this.index = 0;
          }
          else{
          //traverseChild =false;
            this.currIndex += 1;
          }
        }
      }
      */

    }, {
      key: 'getText',
      value: function getText(node) {
        return node.textContent.trim();
      }
    }, {
      key: '_getPreviousItemNode',
      value: function _getPreviousItemNode(node) {
        var pid = this.pid($.getAttribute(node, 'data-itemid'));
        return $.find(this.widget.node, '[data-itemid=\"' + pid + '\"]')[0];
      }
    }, {
      key: 'updateBreadcrumbInfo',
      value: function updateBreadcrumbInfo(node) {
        var $leafnode = node;
        var $node = void 0;
        var breadcrumbs = [];
        if (!this.isTOCItem(node)) {
          return;
        }
        breadcrumbs.push(this._createBreadcrumbItem($leafnode));
        while ($node = this._getPreviousItemNode($leafnode)) {
          breadcrumbs.push(this._createBreadcrumbItem($node));
          $leafnode = $node;
        }
        breadcrumbs.reverse();
        if (breadcrumbs.length > 0) {
          breadcrumbs[breadcrumbs.length - 1].lastNode = true;
        }
        breadcrumbs.curlevel = this.widget.get("curlevel");
        this.widget.publish(KEY_BREADCRUMBS, breadcrumbs);
      }
    }, {
      key: '_createBreadcrumbItem',
      value: function _createBreadcrumbItem(node) {
        var linkNode = node;
        if (!this.hasTOCItemLink(node)) {
          linkNode = this._findFirstLink(node);
        }
        var url = linkNode && ($.getAttribute(linkNode, 'href') || $.getAttribute(linkNode, 'link')) || '#';
        return { id: $.getAttribute(node, 'data-itemid'),
          text: this.getText(node),
          url: url,
          hasUrl: this.hasTOCItemLink(node),
          lastNode: false };
      }
    }, {
      key: 'isTOCItem',
      value: function isTOCItem(node) {

        return $.nodeName(node) === 'LI' || $.getAttribute(node, TOC_ITEM_ATTR);
      }
    }, {
      key: '_findFirstLink',
      value: function _findFirstLink(bookNode) {
        var context = { that: this };

        var node = nodeUtil.parentNode(bookNode);
        context.bookid = $.getAttribute(bookNode, 'data-itemid');
        $.traverseNode(node, this._findLinkFn, null, null, context);
        return context.linkNode;
      }
    }, {
      key: '_isParentTocItem',
      value: function _isParentTocItem(node) {
        return this.bookNode !== node && this.that.isTOCItem(node);
      }
    }, {
      key: '_findLinkFn',
      value: function _findLinkFn(node) {
        var id = $.getAttribute(node, 'data-itemid');
        if (id === this.bookid) {
          this.bookFound = true;
        }
        if (this.bookFound && this.that.hasTOCItemLink(node) && this.linkNode === undefined) {
          this.linkNode = node;
          return false;
        }
        return true;
      }
    }, {
      key: 'nextLevel',
      value: function nextLevel(node) {
        var level = void 0;
        level = _.parseInt($.dataset(node, 'itemlevel'), 0);
        if ($.hasClass(node, EXPANDED_CLASS)) {
          return level;
        } else {
          return level + 1;
        }
      }
    }, {
      key: 'onClick',
      value: function onClick(event) {
        var clickNode = void 0,
            hasLink = void 0,
            node = void 0,
            topNode = void 0;
        topNode = event.currentTarget;
        clickNode = event.target;
        hasLink = this.hasLink(clickNode);
        node = this.getItemNode(clickNode, topNode);
        if (this.isBookNode(node)) {
          if (!(hasLink && this.selectedNode !== node && this.isOpenBook(node))) {
            this.toggleBook(node, false);
            this.updateBreadcrumbInfo(node);
          }
        }

        if (!(!hasLink || this.isUrlNode(node) && this.hasExternalLink(clickNode))) {
          return this.selectLink(node, false);
        }
      }
    }, {
      key: 'selectLink',
      value: function selectLink(node, scrollIntoView, wait) {
        if (wait == null) {
          wait = ANIM_TIME;
        }
        if (this.selectedNode) {
          $.removeClass(this.selectedNode, SELECTED_CLASS);
        }
        if (scrollIntoView && this.selectedNode !== node) {
          _.delay(function () {
            return node.scrollIntoView(false);
          }, wait);
        }
        this.selectedNode = node;
        if (node) {
          this.updateBreadcrumbInfo(node);
          return $.addClass(node, SELECTED_CLASS);
        }
      }
    }, {
      key: 'selectTocItem',
      value: function selectTocItem(tocObj) {
        var id = tocObj.id + '_0';
        if (id) {
          var childData = {},
              level = -1;
          while (id) {
            level++;
            childData[id] = true;
            id = id.substr(0, id.lastIndexOf('_'));
          }
          this.widget.publish("show_child", childData);
          this.widget.publish("curlevel", level);
          if (tocObj.url) rh.model.publish('EVT_TOC_LOADED' + 'gototab', { 'tab': 0, 'item': { 'url': tocObj.url } });
        }
      }
    }, {
      key: 'getItemNode',
      value: function getItemNode(node, topNode) {
        return _.findParentNode(node, topNode, this.isTOCItem);
      }
    }, {
      key: 'getChildItemNode',
      value: function getChildItemNode(node, index) {
        return $.find(node, function (node) {
          return $.nodeName(node) === 'LI' || $.getAttribute(node, TOC_ITEM_ATTR);
        });
      }
    }, {
      key: 'hasTOCItemLink',
      value: function hasTOCItemLink(node) {
        var href = $.getAttribute(node, 'data-haslink');
        return href === 'true';
      }
    }, {
      key: 'hasLink',
      value: function hasLink(node) {
        var href = void 0;
        href = $.getAttribute(node, 'href');
        return href && href !== '#';
      }
    }, {
      key: 'isBookNode',
      value: function isBookNode(node) {
        return $.hasClass(node, 'book');
      }
    }, {
      key: 'isTopicNode',
      value: function isTopicNode(node) {
        return $.hasClass(node, 'item');
      }
    }, {
      key: 'isUrlNode',
      value: function isUrlNode(node) {
        return $.hasClass(node, 'url');
      }
    }, {
      key: 'isPageNode',
      value: function isPageNode(node) {
        return this.isTopicNode(node) || this.isUrlNode(node);
      }
    }, {
      key: 'isOpenBook',
      value: function isOpenBook(node) {
        if (this.widget.get(KEY_TOC_DRILL_DOWN)) {
          return $.hasClass(node, ACTIVE_CLASS);
        } else {
          return $.hasClass(node, EXPANDED_CLASS);
        }
      }
    }, {
      key: 'hasExternalLink',
      value: function hasExternalLink(node) {
        var href = void 0;
        href = $.getAttribute(node, 'href');
        if (!(href && !_.isRelativeUrl(href))) {
          return false;
        }
        return !_.isUrlAllowdInIframe(href);
      }
    }, {
      key: 'getBookNode',
      value: function getBookNode(node, topNode) {
        var itemNode = void 0;
        itemNode = this.getItemNode(node, topNode);
        if (this.isBookNode(itemNode)) {
          return itemNode;
        } else {
          return null;
        }
      }
    }, {
      key: 'animateCollapse',
      value: function animateCollapse(bookNode) {
        return _.each([bookNode, bookNode.nextElementSibling], function (node) {
          $.addClass(node, COLLAPSING_CLASS);
          return _.delay(function () {
            return $.removeClass(node, COLLAPSING_CLASS);
          }, ANIM_TIME);
        });
      }
    }, {
      key: 'animateExpand',
      value: function animateExpand(bookNode) {
        return _.each([bookNode, bookNode.nextElementSibling], function (node) {
          $.addClass(node, EXPANDING_CLASS);
          return _.delay(function () {
            return $.removeClass(node, EXPANDING_CLASS);
          }, ANIM_TIME);
        });
      }
    }, {
      key: 'toggleBook',
      value: function toggleBook(bookNode, scrollIntoView) {
        if (scrollIntoView == null) {
          scrollIntoView = true;
        }
        if (this.isOpenBook(bookNode)) {
          return this.closeBook(bookNode);
        } else {
          return this.openBook(bookNode, scrollIntoView);
        }
      }
    }, {
      key: 'closeBook',
      value: function closeBook(node) {
        var id = void 0,
            keyShow = void 0;
        id = $.dataset(node, 'itemid');
        keyShow = '' + KEY_SHOW_CHILD + id;
        if (false !== this.widget.get(keyShow)) {
          this.widget.publish(keyShow, false);
        }
        this.updateActiveBookInfo(this.nextLevel(node), this.pid(id));
        this.updateBookInfo();
        if ($.hasClass(node, EXPANDED_CLASS)) {
          $.removeClass(node, EXPANDED_CLASS);
          return this.animateCollapse(node);
        }
      }
    }, {
      key: 'openBook',
      value: function openBook(node, scrollIntoView, success) {
        var childOrder = void 0,
            id = void 0,
            key = void 0,
            keyShow = void 0;
        if (success == null) {
          success = this.updateBookInfo;
        }
        key = $.dataset(node, 'itemkey');
        id = $.dataset(node, 'itemid');
        childOrder = $.dataset(node, 'childorder');
        keyShow = '' + KEY_SHOW_CHILD + id;
        if (true !== this.widget.get(keyShow)) {
          this.widget.publish(keyShow, true);
        }
        this.updateActiveBookInfo(this.nextLevel(node), id);
        if (this.widget.get(key)) {
          if (!$.hasClass(node, EXPANDED_CLASS)) {
            $.addClass(node, EXPANDED_CLASS);
            this.animateExpand(node);
          }
          return success();
        } else {
          $.addClass(node, LOADING_BOOK);
          if (scrollIntoView) {
            node.scrollIntoView(false);
          }
          return this.loadToc(key, childOrder, function (_this) {
            return function () {
              $.removeClass(node, LOADING_BOOK);
              $.addClass(node, EXPANDED_CLASS);
              _this.animateExpand(node);
              return success();
            };
          }(this));
        }
      }
    }, {
      key: 'extractTempData',
      value: function extractTempData() {
        var tempItems = void 0;
        tempItems = this.widget.get(rh.consts('KEY_TEMP_DATA'));
        this.widget.publish(rh.consts('KEY_TEMP_DATA'));
        return tempItems;
      }
    }, {
      key: 'loadToc',
      value: function loadToc(fullKey, parentOrder, success) {
        var absRef = void 0,
            key = void 0,
            parentPath = void 0,
            ref1 = void 0;
        ref1 = this.parseKey(fullKey), absRef = ref1.absRef, key = ref1.key;
        parentPath = absRef ? absRef + '/' : '';
        return _.loadScript(parentPath + 'whxdata/' + key + '.new.js', true, function (_this) {
          return function () {
            var tempItems = void 0;
            tempItems = _this.extractTempData() || [];
            _.each(tempItems, function (item) {
              item.absRef = absRef;
              if (parentOrder) {
                return item.childOrder = parentOrder;
              }
            });
            return _this.loadRefToc(tempItems, function (items) {
              _this.widget.publish(fullKey, items);
              if (success) {
                return success();
              }
            });
          };
        }(this));
      }
    }, {
      key: 'loadRefToc',
      value: function loadRefToc(items, success) {
        var absRef = void 0,
            index = void 0,
            item = void 0;
        if (items == null) {
          items = [];
        }
        index = _.findIndex(items, function (item) {
          if (item.ref) {
            return true;
          }
        });
        if (index !== -1) {
          item = items[index];
          absRef = item.absRef || '';
          if (absRef) {
            absRef += '/';
          }
          absRef += item.ref;
          var prjOrder = model.get(consts('KEY_TOC_ORDER'));
          var childOrder = prjOrder[absRef].order;
          return _.loadScript(absRef + '/whxdata/toc.new.js', true, function (_this) {
            return function () {
              var tempItems = void 0;
              tempItems = _this.extractTempData() || [];
              _.each(tempItems, function (item) {
                item.absRef = absRef;
                if (childOrder) {
                  return item.childOrder = childOrder;
                }
              });
              Array.prototype.splice.apply(items, [index, 1].concat(tempItems));
              return _this.loadRefToc(items, success);
            };
          }(this));
        } else if (success) {
          return success(items);
        }
      }
    }, {
      key: 'getTOCData',
      value: function getTOCData() {
        return model.subscribeOnce(consts('KEY_PUBLISH_BASE_URL'), function (_this) {
          return function () {
            var err;
            try {
              return model.subscribe(consts('KEY_PROJECT_LIST'), function (allProjects) {
                return model.subscribe(consts('KEY_MASTER_PROJECT_LIST'), function (list) {
                  var items, len;
                  len = list.length;
                  items = [];
                  return _.each(list, function (prj) {
                    prj = _.makeRelativeUrl(prj, allProjects[0]);
                    if (prj) {
                      prj = prj + "/";
                    }
                    return _.loadScript(prj + "whxdata/toc.new.js", true, function (_this) {
                      return function () {
                        var tempItems;
                        tempItems = _this.extractTempData() || [];
                        _.each(tempItems, function (item) {
                          item.absRef = prj;
                        });
                        return _this.loadRefToc(tempItems, function (resolvedItems) {
                          len--;
                          items = items.concat(resolvedItems);
                          if (len === 0) {
                            _this.widget.publish(KEY_TOC, items);
                            _this.widget.publish(consts('EVT_TOC_LOADED'), true);
                            return _this.widget.subscribe(rh.consts('KEY_TOPIC_ID'), _this.subscribeTopicID);
                          }
                        });
                      };
                    }(this));
                  }, _this);
                });
              });
            } catch (error) {
              err = error;
              if (rh._debug) {
                return rh._d('warn', err.message);
              }
            }
          };
        }(this));
      }
    }, {
      key: 'nextChildOrder',
      value: function nextChildOrder(childOrder) {
        var orders = void 0;
        orders = childOrder.split('@');
        orders[orders.length - 1] = 1 + _.parseInt(orders[orders.length - 1], 0);
        return orders.join('@');
      }
    }, {
      key: 'childOrder',
      value: function childOrder(parentOrder) {
        if (parentOrder) {
          return parentOrder + '@1';
        } else {
          return '@1';
        }
      }
    }, {
      key: 'pid',
      value: function pid(id) {
        var path = void 0;
        path = id.split('_');
        path.pop();
        return path.join('_') || '_';
      }
    }, {
      key: 'key',
      value: function key(absRef, _key) {
        var idx = void 0;
        if (absRef == null) {
          absRef = '';
        }
        idx = _.findIndex(this.projectAbsRef, function (ref) {
          return ref === absRef;
        });
        if (idx === -1) {
          idx = this.projectAbsRef.length;
          this.projectAbsRef.push(absRef);
        }
        return '.p.child_toc.' + idx + '.' + _key;
      }
    }, {
      key: 'parseKey',
      value: function parseKey(key) {
        var absRef = void 0,
            keys = void 0,
            lastKey = void 0;
        key = key.substring(3);
        keys = key.split('.');
        lastKey = keys.pop();
        absRef = this.projectAbsRef[keys.pop()] || '';
        return {
          key: lastKey,
          absRef: absRef
        };
      }
    }, {
      key: 'url',
      value: function url(item, id) {
        var bookMark = void 0,
            filePath = void 0,
            params = void 0,
            parentPath = void 0,
            url = void 0;
        if (!item.url) {
          return '#';
        }
        if (item.type === 'remoteitem') {
          return encodeURI(item.url);
        }
        parentPath = item.absRef ? _.ensureSlash(item.absRef) : '';
        url = '' + parentPath + item.url;
        bookMark = _.extractHashString(url);
        if (bookMark.length > 0) {
          bookMark = '#' + bookMark;
          filePath = _.filePath(url);
          params = _.extractParamString(url);
          if (params.length > 0) {
            params = params + '&';
          }
          params = '?' + params + 'rhtocid=' + id;
          url = '' + filePath + params + bookMark;
        }
        return encodeURI(url);
      }
    }, {
      key: 'tags',
      value: function tags(item) {
        var parentPath = void 0;
        parentPath = item.absRef ? '+' + item.absRef : '';
        if (item['data-rhtags']) {
          return item['data-rhtags'] + parentPath;
        } else {
          return '';
        }
      }
    }, {
      key: 'subscribeTopicID',
      value: function subscribeTopicID(tocInfo) {
        var _this3 = this;

        var path = void 0,
            tocid = void 0;
        if (tocInfo == null) {
          tocInfo = {};
        }
        tocid = _.hashParams()['rhtocid'];
        if (tocid) {
          path = this.getPathfromId(tocid);
          this.selectTocById(path, this.widget.node);
        } else {
          rh.model.subscribe(rh.consts('KEY_MASTER_PROJECT_LIST'), function (list) {
            if (list && list.length < 2) return _this3.syncToc.sync(_this3, tocInfo);
          });
        }
      }
    }, {
      key: 'subscribeBookId',
      value: function subscribeBookId(bookId) {
        // sukumar: TODO remove this line
        var books = void 0;
        var path = void 0;
        if (bookId) {
          path = this.getPathfromId(bookId);
          return this.selectTocById(path, this.widget.node, null, books);
        }
      }
    }, {
      key: 'getPathfromId',
      value: function getPathfromId(id) {
        var path = void 0;
        path = id.split('_');
        path.shift();
        path = _.map(path, function (item) {
          return _.parseInt(item, 0);
        });
        return path;
      }
    }, {
      key: 'selectTocById',
      value: function selectTocById(path, node, wait, books) {
        var child = void 0,
            index = void 0;
        if (wait == null) {
          wait = 1;
        }
        if (!(node && node.children)) {
          return;
        }
        index = path.shift();
        child = _.find(node.children, function (child) {
          if (this.isBookNode(child) || this.isPageNode(child)) {
            if (index === 0) {
              return true;
            }
            index--;
          }
          return false;
        }, this);
        if (!child) {
          return;
        }

        if (path.length === 0) {
          this.selectLink(child, true, wait);
        }
        if (this.isBookNode(child)) {
          return this.openBook(child, true, function (_this) {
            return function () {
              return _.defer(function () {
                var childNode = void 0,
                    parentNode = void 0;
                if (path.length === 0) {
                  return _this.updateBookInfo();
                } else {
                  childNode = child.nextElementSibling;
                  parentNode = childNode.children && childNode.children[0];
                  return _this.selectTocById(path, parentNode, ANIM_TIME);
                }
              });
            };
          }(this));
        } else {
          return this.updateBookInfo();
        }
      }
    }]);

    return TocController;
  }();

  TocController.prototype["class"] = function (item) {
    if (item.type === 'remoteitem') {
      return 'url';
    } else {
      return item.type;
    }
  };

  return TocController;
}();

rh.controller('TocController', TocController);

},{"../../src/lib/rh":24,"../../src/responsive_help/utils/node_utils":66}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../src/lib/rh");
var _ = rh._;
var $ = rh.$;
var model = rh.model;
var consts = rh.consts;

var TOCLevel = function () {
  function TOCLevel() {
    var _this = this;

    _classCallCheck(this, TOCLevel);

    this.data = { '': { order: '', nextChild: 0 } };
    model.subscribeOnce(consts('KEY_PROJECT_LIST'), function (allProjects) {
      _.each(allProjects, function (prj) {
        prj = _.makeRelativeUrl(_this.trimFirst(prj, '.'), allProjects[0]);
        _this.childOrder(prj);
      });
      model.publish(consts('KEY_TOC_ORDER'), _this.data);
    });
  }

  _createClass(TOCLevel, [{
    key: 'trimFirst',
    value: function trimFirst(path, char) {
      return path = path.length && path[0] === char && path[1] !== char ? path.substring(1) : path;
    }
  }, {
    key: 'childOrder',
    value: function childOrder(absRef) {
      absRef = this.trimFirst(absRef, '/');
      if (!this.data[absRef]) {
        var path = absRef;
        path = path.substring(0, path.lastIndexOf('/'));
        path = path.substring(0, path.lastIndexOf('/'));
        var parent = this.data[path];
        parent.nextChild++;
        this.data[absRef] = { order: parent.order + '@' + parent.nextChild, nextChild: 0 };
      }
      return this.data[absRef].order;
    }
  }]);

  return TOCLevel;
}();

new TOCLevel();

},{"../../src/lib/rh":24}],7:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;

var BrowseSequenceBuilder = function BrowseSequenceBuilder() {
  _classCallCheck(this, BrowseSequenceBuilder);

  var handleTopicChange = function handleTopicChange(doNotUse) {
    var brsMap = rh.model.get('t.brsmap');
    if (brsMap != null) {
      var next = brsMap['n'] && brsMap['n'][0] || '';
      var prev = brsMap['p'] && brsMap['p'][0] || '';
      var decodedURI = window.decodeURI(document.location.href);

      if (!_.isEmptyString(next)) {
        next = window._getRelativeFileName(decodedURI, next);
      }
      if (!_.isEmptyString) {
        prev = window._getRelativeFileName(decodedURI, prev);
      }

      rh.model.publish('l.brsBack', prev);
      return rh.model.publish('l.brsNext', next);
    }
  };

  var updateShowBrs = function updateShowBrs() {
    var uiMode = rh.model.get(rh.consts('KEY_UI_MODE'));
    var prev = rh.model.get('l.brsBack');
    var next = rh.model.get('l.brsNext');
    var showBrs = !uiMode && (prev || next) ? true : false;
    return rh.model.publish('l.show_brs', showBrs);
  };

  rh.model.subscribe('t.topicurl', _.debounce(handleTopicChange, 200));
  rh.model.subscribe('t.brsmap', _.debounce(handleTopicChange, 200));

  rh.model.subscribe('l.brsBack', updateShowBrs);
  rh.model.subscribe('l.brsNext', updateShowBrs);
  rh.model.subscribe(rh.consts('KEY_UI_MODE'), updateShowBrs);
};

//TODO: move it to controller


rh.widgets.BrowseSequenceBuilder = BrowseSequenceBuilder;

},{}],8:[function(require,module,exports){
'use strict';

// Generated by CoffeeScript 1.9.1
(function () {
  var $, HASH_KEY_RANDOM, HASH_KEY_RH_HIGHLIGHT, HASH_KEY_RH_SEARCH, HASH_KEY_RH_TOCID, HASH_KEY_TOPIC, HASH_KEY_UIMODE, _, consts, fixHashMapForRoot, fixHashMapForTopic, getHashMapForRoot, getMergedParamsMap, getParamsForRoot, getTopicURL, hashChanged, hashQueryKeys, model, navigateToUrl, queueUpdateHashMap, rh, showNonTopic, showTopic, topicChanged;

  rh = window.rh;

  _ = rh._;

  $ = rh.$;

  consts = rh.consts;

  model = rh.model;

  HASH_KEY_RH_SEARCH = consts('HASH_KEY_RH_SEARCH');

  HASH_KEY_TOPIC = consts('HASH_KEY_TOPIC');

  HASH_KEY_UIMODE = consts('HASH_KEY_UIMODE');

  HASH_KEY_RH_TOCID = consts('HASH_KEY_RH_TOCID');

  HASH_KEY_RH_HIGHLIGHT = consts('HASH_KEY_RH_HIGHLIGHT');

  HASH_KEY_RANDOM = consts('HASH_KEY_RANDOM');

  hashQueryKeys = [HASH_KEY_RH_HIGHLIGHT, consts('HASH_KEY_RH_SYNS'), HASH_KEY_RH_TOCID];

  getMergedParamsMap = function getMergedParamsMap(topicUrl) {
    var hashMap, paramsMap;
    paramsMap = _.urlParams(_.extractParamString(topicUrl));
    hashMap = _.hashParams(_.extractHashString(topicUrl));
    return _.extend(paramsMap, hashMap);
  };

  getTopicURL = function getTopicURL(newMap, topicUrl) {
    var bookMark, filePath, i, key, len, params, paramsMap;
    topicUrl = topicUrl;
    filePath = _.filePath(topicUrl);
    bookMark = _.extractHashString(topicUrl);
    if (bookMark.length > 0) {
      bookMark = "#" + bookMark;
    }
    paramsMap = _.urlParams(_.extractParamString(topicUrl));
    for (i = 0, len = hashQueryKeys.length; i < len; i++) {
      key = hashQueryKeys[i];
      if (newMap[key] != null) {
        paramsMap[key] = newMap[key];
      }
    }
    if (model.get(consts('KEY_SCREEN_IOS'))) {
      paramsMap[HASH_KEY_RANDOM] = _.uniqueId();
    }
    params = _.mapToEncodedString(paramsMap);
    if (params.length > 0) {
      params = "?" + params;
    }
    return "" + filePath + params + bookMark;
  };

  queueUpdateHashMap = _.queueUpdateHashMap;

  fixHashMapForTopic = function fixHashMapForTopic(hashMap) {
    if (hashMap == null) {
      hashMap = {};
    }
    hashMap[HASH_KEY_UIMODE] = null;
    hashMap[HASH_KEY_RANDOM] = null;
    if (!hashMap[HASH_KEY_RH_TOCID]) {
      hashMap[HASH_KEY_RH_TOCID] = null;
    }
    if (!hashMap[HASH_KEY_RH_HIGHLIGHT]) {
      hashMap[HASH_KEY_RH_HIGHLIGHT] = null;
    }
    return hashMap;
  };

  fixHashMapForRoot = function fixHashMapForRoot(hashMap) {
    if (hashMap == null) {
      hashMap = {};
    }
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

  showTopic = function showTopic(relUrl, addToHistory) {
    var hashMap;
    relUrl = _.fixRelativeUrl(relUrl);
    hashMap = _.urlParams(_.extractParamString(relUrl));
    hashMap[HASH_KEY_TOPIC] = _.stripParam(relUrl);
    hashMap = fixHashMapForTopic(hashMap);
    return queueUpdateHashMap(hashMap, addToHistory);
  };

  getHashMapForRoot = function getHashMapForRoot(relUrl) {
    var hashMap;
    relUrl = _.fixRelativeUrl(relUrl);
    hashMap = _.urlParams(_.extractParamString(relUrl));
    hashMap = fixHashMapForRoot(hashMap);
    return hashMap;
  };

  getParamsForRoot = function getParamsForRoot(relUrl) {
    var queryMap;
    queryMap = getHashMapForRoot(relUrl);
    if (_.isEmptyObject(queryMap)) {
      return '';
    } else {
      return "?" + _.mapToEncodedString(queryMap);
    }
  };

  showNonTopic = function showNonTopic(url, addToHistory) {
    var hashMap;
    hashMap = {};
    hashMap[HASH_KEY_TOPIC] = url;
    hashMap = fixHashMapForTopic(hashMap);
    return queueUpdateHashMap(hashMap, addToHistory);
  };

  ({
    isSameTopic: function isSameTopic(url1, url2) {}
  });

  hashChanged = function hashChanged(obj) {
    var changed, newMap, oldMap, oldTopicUrl, oldUiMode, ref, searchTerm, searchTermChanged, topicUrl, uiMode;
    newMap = obj.newMap;
    oldMap = obj.oldMap;
    oldUiMode = oldMap[HASH_KEY_UIMODE];
    uiMode = newMap[HASH_KEY_UIMODE];
    if (HASH_KEY_RH_SEARCH in newMap) {
      searchTerm = newMap[HASH_KEY_RH_SEARCH];
      searchTermChanged = searchTerm !== model.get(consts('KEY_SEARCHED_TERM'));
      model.publish(consts('KEY_SEARCH_TERM'), searchTerm, {
        sync: true
      });
    }
    if (uiMode === 'search') {
      if (searchTermChanged && window.gHost) {
        model.publish(consts('EVT_QUERY_SEARCH_RESULTS'), true);
      }
    }
    if (!uiMode || newMap[HASH_KEY_TOPIC]) {
      oldTopicUrl = model.get(consts('KEY_TOPIC_IN_IFRAME'));
      if (HASH_KEY_TOPIC in newMap) {
        topicUrl = newMap[HASH_KEY_TOPIC];
      }
      if (!topicUrl) {
        topicUrl = oldTopicUrl;
      }
      var feature = rh.model.get(rh.consts('KEY_FEATURE'));
      if (!topicUrl && (!feature || feature.showDefTopic !== false)) {
        topicUrl = (ref = window.gDefaultTopic) != null ? ref.substring(1) : void 0;
      }
      changed = topicUrl && (topicUrl !== oldTopicUrl || oldUiMode !== uiMode || oldMap[HASH_KEY_RH_HIGHLIGHT] !== newMap[HASH_KEY_RH_HIGHLIGHT] || oldMap[HASH_KEY_RH_TOCID] !== newMap[HASH_KEY_RH_TOCID]);
      if (changed) {
        if (_.stripBookmark(topicUrl) !== _.stripBookmark(oldTopicUrl)) {
          _.runTopicLoadingAnimation(true);
        }
        model.publish(consts('KEY_TOPIC_IN_IFRAME'), topicUrl);
        window.loadTopic(getTopicURL(newMap, topicUrl));
      }
    }
    return model.publish(consts('KEY_UI_MODE'), newMap[HASH_KEY_UIMODE]);
  };

  topicChanged = function topicChanged(topicUrl) {
    var decodedURI, hashMap, oldUrl, relUrl;
    hashMap = _.hashParams();
    if (topicUrl && !hashMap[HASH_KEY_UIMODE]) {
      decodedURI = decodeURI(document.location.href);
      relUrl = window._getRelativeFileName(decodedURI, topicUrl);
      oldUrl = hashMap[HASH_KEY_TOPIC];
      if (!oldUrl || _.filePath(relUrl) !== _.filePath(oldUrl)) {
        model.publish(consts('KEY_TOPIC_IN_IFRAME'), relUrl);
        return showTopic(relUrl, false);
      }
    }
  };

  navigateToUrl = function navigateToUrl(obj) {
    var fileName, hashMap, params, relUrl, rootUrl, url;
    url = obj.absUrl;
    if (_.isRootUrl()) {
      if (_.isUrlAllowdInIframe(url)) {
        url = _.makeRelativeUrl(_.fixRelativeUrl(url));
        fileName = url && _.filePath(url);
        if (fileName === consts('START_FILEPATH')) {
          url = url.substring(fileName.length);
        } else if (!url) {
          url = '#ux';
        }
        if (url[0] === '#' || url[0] === '?') {
          hashMap = _.hashParams(_.extractHashString(url));
          if (!(HASH_KEY_UIMODE in hashMap)) {
            hashMap[HASH_KEY_UIMODE] = null;
          }
          return queueUpdateHashMap(hashMap, true);
        } else if (url) {
          return showTopic(url, true);
        }
      } else {
        return showNonTopic(url, true);
      }
    } else {
      if (!_.isRootUrl(url)) {
        rootUrl = _.getRootUrl();
        if (_.isExternalUrl(url)) {
          relUrl = url;
        } else {
          params = getParamsForRoot(url);
          relUrl = _.fixRelativeUrl(_.makeRelativePath(url, rootUrl));
        }
        url = "" + rootUrl + params + "#t=" + encodeURIComponent(relUrl);
      }
      return document.location.href = url;
    }
  };

  model.subscribe(consts('EVT_WIDGET_LOADED'), function () {
    _.addEventListener(document, 'click', _.hookClick);
    model.subscribe(consts('EVT_HASH_CHANGE'), hashChanged);
    model.subscribe(consts('KEY_TOPIC_URL'), topicChanged);
    model.subscribe(consts('EVT_NAVIGATE_TO_URL'), navigateToUrl);
    model.subscribe(consts('KEY_TOPIC_IN_IFRAME'), function (topicUrl) {
      if ("" + window.gHost + window.gHostPath !== '/') {
        if (window.setTopic) {
          window.setTopic();
        }
        if (window.changeTopicLink) {
          return window.changeTopicLink(document.location.toString());
        }
      }
    });
    model.subscribe(consts('EVT_TOPIC_LOADED'), function () {
      return _.runTopicLoadingAnimation(false);
    });
    return model.subscribe(consts('EVT_INSIDE_IFRAME_DOM_CONTENTLOADED'), function () {
      return _.runTopicLoadingAnimation(false);
    });
  });
}).call(undefined);

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var storage = rh.storage;

var urlFilter = rh._params.filter;

var ExpressionBuilder = function () {
  var GRP_SEPARATOR = undefined;
  var TAG_SEPARATOR = undefined;
  var ELEMENT_SEPARATOR = undefined;
  ExpressionBuilder = function () {
    _createClass(ExpressionBuilder, null, [{
      key: 'initClass',
      value: function initClass() {

        GRP_SEPARATOR = ':';
        TAG_SEPARATOR = ';';
        ELEMENT_SEPARATOR = ',';
      }
    }]);

    function ExpressionBuilder(config) {
      _classCallCheck(this, ExpressionBuilder);

      this.getUnchecked = this.getUnchecked.bind(this);
      this.handleTagStates = this.handleTagStates.bind(this);
      storage.init(consts('HELP_ID'));

      this.allTagNames = this.computeNames(rh.model.get(consts('KEY_MERGED_FILTER_KEY')));

      this.prepareTagStates();

      this.handleTagStates(rh.model.get(consts('KEY_PROJECT_TAG_STATES')));

      rh.model.subscribe(consts('KEY_PROJECT_TAG_STATES'), _.debounce(this.handleTagStates, 300), { initDone: true });
    }

    _createClass(ExpressionBuilder, [{
      key: 'computeNames',
      value: function computeNames(tags) {
        return _.reduce(tags, function (result, tag) {
          result.push(tag.children ? this.computeNames(tag.children) : tag.name);
          return result;
        }, [], this);
      }
    }, {
      key: 'getUnchecked',
      value: function getUnchecked(index, checked) {
        return _.filter(this.allTagNames[index], function (item) {
          return -1 === checked.indexOf(item);
        });
      }
    }, {
      key: 'computeExpression',
      value: function computeExpression(states) {
        if (!states || !this.allTagNames) {
          return rh.model.publish(consts('KEY_TAG_EXPRESSION'), []);
        }

        var groupExprs = _.reduce(states, function (result, value, key) {
          if (_.isString(value)) {
            result.push({ c: [value], u: [] });
          } else if (value != null) {
            var validValues = void 0;
            if ((validValues = _.compact(value)) && validValues.length > 0) {
              result.push({
                c: validValues,
                u: this.getUnchecked(key, validValues)
              });
            }
          }
          return result;
        }, [], this);

        return rh.model.publish(consts('KEY_TAG_EXPRESSION'), groupExprs);
      }
    }, {
      key: 'handleTagStates',
      value: function handleTagStates(states) {
        if (states == null) {
          states = {};
        }
        this.computeExpression(states);

        // Persist new tag state in localDB or cookies
        return storage.persist('tag_states', states);
      }
    }, {
      key: 'prepareTagStates',
      value: function prepareTagStates() {
        var _this = this;

        return rh.model.subscribe(consts('KEY_PROJECT_FILTER_TYPE'), function () {
          var tagStates = void 0;
          if (urlFilter) {
            var filter = rh.model.get(consts('KEY_MERGED_FILTER_KEY'));
            tagStates = _this.parseUrlFilter(filter, urlFilter.split(ELEMENT_SEPARATOR));
          }

          if (!tagStates) {
            tagStates = storage.fetch('tag_states');
          }

          if (!tagStates) {
            tagStates = _.clone(rh.model.get(consts('KEY_DEFAULT_FILTER')));
          }

          if (tagStates) {
            return rh.model.publish(consts('KEY_PROJECT_TAG_STATES'), tagStates);
          }
        });
      }
    }, {
      key: 'parseFilterElemnt',
      value: function parseFilterElemnt(filter, element) {
        var temp = element.split(GRP_SEPARATOR);
        var name = temp[0];
        var elements = temp[1] && temp[1].split(TAG_SEPARATOR);
        var index = _.findIndex(filter, function (item) {
          return elements != null === (item.children != null) && item.display === name;
        });
        return { index: index, elements: elements };
      }
    }, {
      key: 'parseUrlFilter',
      value: function parseUrlFilter(filter, array) {
        if (!array && !array.length) {
          return;
        }
        var radioMode = rh.model.get(consts('KEY_PROJECT_FILTER_TYPE')) === 'radio';
        var firstString = true;
        return _.reduce(array, function (result, element, index) {
          var elements = void 0;

          var _parseFilterElemnt = this.parseFilterElemnt(filter, element);

          index = _parseFilterElemnt.index;
          elements = _parseFilterElemnt.elements;

          if (index !== -1) {
            var node = filter[index];
            if (node.children) {
              result[index] = this.parseUrlFilter(node.children, elements);
            } else if (!radioMode || firstString) {
              firstString = false;
              result[index] = node.name;
            }
          }
          return result;
        }, {}, this);
      }
    }]);

    return ExpressionBuilder;
  }();
  ExpressionBuilder.initClass();
  return ExpressionBuilder;
}();

rh.widgets.ExpressionBuilder = ExpressionBuilder;

},{}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;


var FilterController = function () {
  var GROUP_CLASS = undefined;
  var ITEM_CLASS = undefined;
  var KEY_PROJECT_FILTER_TYPE = undefined;
  FilterController = function () {
    _createClass(FilterController, null, [{
      key: 'initClass',
      value: function initClass() {

        GROUP_CLASS = 'group';
        ITEM_CLASS = 'item';
        KEY_PROJECT_FILTER_TYPE = consts('KEY_PROJECT_FILTER_TYPE');
      }
    }]);

    function FilterController(widget) {
      _classCallCheck(this, FilterController);

      this.click = this.click.bind(this);
      this.widget = widget;
    }

    _createClass(FilterController, [{
      key: 'click',
      value: function click(e) {
        var topNode = e.currentTarget;
        var clickNode = e.target;
        var node = this.getItemNode(clickNode, topNode);
        var selTagExprsPath = '' + consts('KEY_PROJECT_TAG_STATES') + this.getItemKey(node);
        var selTagExprs = this.widget.get(selTagExprsPath);
        if (this.filterType() !== 'radio') {
          this.handleCheckboxClick(node, selTagExprsPath, selTagExprs);
        } else {
          this.handleRadioClick(node, selTagExprsPath, selTagExprs);
        }
        return _.preventDefault(e);
      }
    }, {
      key: 'handleRadioClick',
      value: function handleRadioClick(node, selTagExprsPath, selTagExprs) {
        if (!this.isGroupNode(node) && !selTagExprs) {
          var _$splitKey = _.splitKey(selTagExprsPath),
              parentKey = _$splitKey.parentKey,
              key = _$splitKey.key;

          var newValue = {};
          newValue[key] = this.getItemValue(node);
          return this.widget.publish(parentKey, newValue);
        }
      }
    }, {
      key: 'handleCheckboxClick',
      value: function handleCheckboxClick(node, selTagExprsPath, selTagExprs) {
        var newValue = void 0;
        if (this.isGroupNode(node)) {
          var checked = _.any(selTagExprs, function (tagExpr) {
            return tagExpr;
          });
          newValue = checked ? undefined : this.getGroupItemExprs(node);
          return this.widget.publish(selTagExprsPath, newValue);
        } else {
          newValue = selTagExprs ? undefined : this.getItemValue(node);
          return this.widget.publish(selTagExprsPath, newValue);
        }
      }
    }, {
      key: 'getItemNode',
      value: function getItemNode(node, topNode) {
        return _.findParentNode(node, topNode, function (node) {
          return $.nodeName(node) === 'LI';
        });
      }
    }, {
      key: 'getItemValue',
      value: function getItemValue(node) {
        return $.dataset(node, 'itemvalue');
      }
    }, {
      key: 'getGroupItemExprs',
      value: function getGroupItemExprs(node) {
        var key = $.dataset(node, 'itemkey');
        var groupTag = this.widget.get('' + this.widget.key + key);
        return _.map(groupTag.children, function (tag) {
          return tag.name;
        });
      }
    }, {
      key: 'getItemKey',
      value: function getItemKey(node) {
        return $.dataset(node, 'itemkey');
      }
    }, {
      key: 'isGroupNode',
      value: function isGroupNode(node) {
        return $.hasClass(node, GROUP_CLASS);
      }
    }, {
      key: 'isItemNode',
      value: function isItemNode(node) {
        return $.hasClass(node, ITEM_CLASS);
      }
    }, {
      key: 'class',
      value: function _class(item) {
        if (item.children) {
          return GROUP_CLASS;
        } else {
          return ITEM_CLASS;
        }
      }
    }, {
      key: 'value',
      value: function value(item) {
        if (item.children) {
          return null;
        } else {
          return item.name;
        }
      }
    }, {
      key: 'filterType',
      value: function filterType() {
        return this.widget.get(KEY_PROJECT_FILTER_TYPE) || 'checkbox';
      }
    }, {
      key: 'inputType',
      value: function inputType(item) {
        var type = this.filterType();
        if (item.children && type === 'radio') {
          type = undefined;
        }
        return type;
      }
    }]);

    return FilterController;
  }();
  FilterController.initClass();
  return FilterController;
}();

rh.controller('FilterController', FilterController);

},{}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var model = rh.model;
var _ = rh._;
var consts = rh.consts;
var http = rh.http;
var rhs = rh.rhs;


var FilterReport = function () {
  var getPostUrl = undefined;
  FilterReport = function () {
    _createClass(FilterReport, null, [{
      key: 'initClass',
      value: function initClass() {

        getPostUrl = function getPostUrl() {
          var host = document.location.origin;
          var baseContext = model.get(consts('KEY_PUBLISH_BASE_URL')).substr(host.length);
          if (baseContext && !_.isEmptyString(baseContext)) {
            var hashString = _.mapToEncodedString(_.extend(_.addPathNameKey({ area: rhs.area(),
              prj: rhs.project(), type: rhs.type(), agt: 'fltRpt', mgr: 'agm'
            })));
            return baseContext + '?' + hashString;
          }
        };
      }
    }]);

    function FilterReport() {
      _classCallCheck(this, FilterReport);

      var timer = 3000;
      model.subscribeOnce(consts('EVT_PROJECT_LOADED'), function () {
        return model.subscribeOnce(consts('KEY_PUBLISH_MODE'), function (val) {
          if (!val) {
            return;
          }
          var url = url || getPostUrl();
          var ckTags = [];
          var postToServer = _.debounce(function () {
            return http.post(url, JSON.stringify(ckTags)).error(function (data, status) {
              if (rh._debug) {
                return rh._d('error', 'Filter report status ', status);
              }
            });
          }, timer, false);

          return model.subscribe(consts('KEY_TAG_EXPRESSION'), function (expr) {
            ckTags = [];
            var filterData = rh.model.get(consts('KEY_MERGED_FILTER_KEY'));
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = Array.from(expr)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var tags = _step.value;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = Array.from(tags.c)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var tag = _step2.value;

                    var tagData;
                    if (tagData = rh.filterObject.lookup(filterData, tag, false)) {
                      ckTags.push(tagData.display);
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

            if (ckTags.length > 0) {
              return postToServer();
            }
          });
        });
      });
    }

    return FilterReport;
  }();
  FilterReport.initClass();
  return FilterReport;
}();

new FilterReport();

},{}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    rh = _window.rh;
var model = rh.model;
var _ = rh._;
var consts = rh.consts;
var http = rh.http;


var GlossaryController = function () {
  var entrys = undefined;
  GlossaryController = function (_rh$NavController) {
    _inherits(GlossaryController, _rh$NavController);

    _createClass(GlossaryController, null, [{
      key: 'initClass',
      value: function initClass() {

        entrys = 'entrys';
      }
    }]);

    function GlossaryController(widget) {
      _classCallCheck(this, GlossaryController);

      var _this = _possibleConstructorReturn(this, (GlossaryController.__proto__ || Object.getPrototypeOf(GlossaryController)).call(this));

      _this.data = [];
      _this.chunkCount = 0;
      _this.count = 0;
      _this.keys = '';
      _this.alhpabet = '';
      _this.loadNavData('glo');
      _this.filter = '';
      _this.widget = widget;
      _this.widget.publish('show', {});
      return _this;
    }

    _createClass(GlossaryController, [{
      key: 'addElement',
      value: function addElement(elements, list) {
        var _this2 = this;

        return function () {
          var result = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Array.from(elements[entrys])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var element = _step.value;

              if (element != null) {
                if (!_this2.lookup(list, element)) {
                  result.push(list.push(element));
                } else {
                  result.push(undefined);
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

          return result;
        }();
      }
    }, {
      key: 'exists',
      value: function exists(name) {
        var ch = this.alphaText(name);
        if (this.alhpabet.indexOf(ch) > -1) {
          return true;
        }
        this.alhpabet += ch;
        return false;
      }
    }, {
      key: 'isFiltered',
      value: function isFiltered(name) {
        return this.filter && name.toLocaleLowerCase().indexOf(this.filter) === -1;
      }
    }, {
      key: 'alphaText',
      value: function alphaText(name) {
        return name.toUpperCase().charAt(0);
      }
    }, {
      key: 'filterGlo',
      value: function filterGlo(value) {
        this.filter = value.toLocaleLowerCase();
        this.alhpabet = '';
        return model.publish(consts('PROJECT_GLOSSARY_DATA'), model.get(consts('PROJECT_GLOSSARY_DATA')));
      }
    }]);

    return GlossaryController;
  }(rh.NavController);
  GlossaryController.initClass();
  return GlossaryController;
}();

rh.controller('GlossaryController', GlossaryController);

},{}],13:[function(require,module,exports){
'use strict';

// Generated by CoffeeScript 1.9.1
(function () {
  var IndexController,
      NavController,
      _,
      consts,
      http,
      model,
      rh,
      rhs,
      topics,
      bind = function bind(fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  },
      extend = function extend(child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key)) child[key] = parent[key];
    }function ctor() {
      this.constructor = child;
    }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
  },
      hasProp = {}.hasOwnProperty;

  rh = window.rh;

  model = rh.model;

  _ = rh._;

  consts = rh.consts;

  http = rh.http;

  rhs = rh.rhs;

  topics = 'topics';

  NavController = function () {
    function NavController() {
      this.updateData = bind(this.updateData, this);
    }

    NavController.prototype.lookup = function (children, key) {
      var child, element, i, len;
      if (children != null && key != null) {
        for (i = 0, len = children.length; i < len; i++) {
          child = children[i];
          if (!(child != null)) {
            continue;
          }
          if (key.type === child.type && key.name === child.name && _.isEqual(key.url, child.url) && _.isEqual(key[topics], child[topics])) {
            element = child;
          }
          if (element != null) {
            break;
          }
        }
      }
      return element;
    };

    NavController.prototype.sort = function (array) {
      return array.sort(function (first, second) {
        return window.compare(first.name, second.name);
      });
    };

    NavController.prototype.updateData = function (constKey, projectUrl) {
      var curData;
      curData = model.get(consts('KEY_TEMP_DATA')) || [];
      model.publish(consts('KEY_TEMP_DATA'));
      this.addElement(curData, this.data, projectUrl, this.keys);
      if (--this.chunkCount === 0 && this.count === 0) {
        this.sort(this.data);
        return model.publish(consts(constKey), this.data);
      }
    };

    NavController.prototype.getChunkData = function (projectUrl, key) {
      var arr, ref;
      this.count--;
      arr = ((ref = model.get(consts('KEY_TEMP_DATA'))) != null ? ref['chunkinfos'] : void 0) || [];
      this.chunkCount += arr.length;
      return _.each(arr, function (chunk) {
        if (projectUrl) {
          projectUrl = _.ensureSlash(projectUrl);
        }
        return _.loadScript(projectUrl + "whxdata/" + chunk.node + ".new.js", false, function (_this) {
          return function () {
            return _this.updateData(key, projectUrl);
          };
        }(this));
      }, this);
    };

    NavController.prototype.loadNavData = function (type) {
      return model.subscribe(consts('KEY_PROJECT_LIST'), function (_this) {
        return function (list) {
          _this.alhpabet = '';
          _this.count += list.length;
          return _.each(list, function (projectUrl) {
            if (projectUrl) {
              projectUrl = _.ensureSlash(projectUrl);
            }
            return _.loadScript(projectUrl + "whxdata/" + (type === 'ndx' ? 'idx' : 'glo') + ".new.js", false, function (_this) {
              return function () {
                return _this.getChunkData(projectUrl, type === 'ndx' ? 'PROJECT_INDEX_DATA' : 'PROJECT_GLOSSARY_DATA');
              };
            }(this));
          }, _this);
        };
      }(this));
    };

    return NavController;
  }();

  rh.NavController = NavController;

  IndexController = function (superClass) {
    var defProject;

    extend(IndexController, superClass);

    defProject = '';

    function IndexController(widget) {
      this.data = [];
      this.chunkCount = 0;
      this.count = 0;
      this.alhpabet = '';
      this.filter = '';
      this.keys = 'keys';
      this.widget = widget;
      model.subscribeOnce(consts('EVT_PROJECT_LOADED'), function (_this) {
        return function () {
          _this.loadNavData('ndx');
          _this.getIndexData();
          return model.subscribe(consts('KEY_INDEX_FILTER'), function () {
            _this.alhpabet = '';
            return model.publish(consts('PROJECT_INDEX_DATA'), model.get(consts('PROJECT_INDEX_DATA')));
          });
        };
      }(this));
    }

    IndexController.prototype.addElement = function (element, list, projectUrl, data) {
      var child, existing, i, len, obj, ref, relUrl, results;
      if (element[data] != null) {
        ref = element[data];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (!(child != null)) {
            continue;
          }
          if (!(existing = this.lookup(list, child))) {
            obj = {
              type: child.type,
              name: child.name
            };
            if (child['data-rhtags']) {
              obj['data-rhtags'] = child['data-rhtags'] + "+" + projectUrl;
            }
            if (!child.url) {
              obj[topics] = [];
            }
            relUrl = _.makeRelativeUrl("" + projectUrl, defProject);
            if (child.url != null) {
              obj.url = "" + encodeURI(relUrl) + child.url;
            }
            if (child.url == null) {
              obj[this.keys] = [];
            }
            list.push(obj);
            existing = list[list.length - 1];
          }
          this.addElement(child, existing[this.keys], projectUrl, this.keys);
          results.push(this.addElement(child, existing[topics], projectUrl, topics));
        }
        return results;
      }
    };

    IndexController.prototype.showItem = function (name) {
      var filter;
      filter = model.get(consts('KEY_INDEX_FILTER'));
      return !filter || name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1;
    };

    IndexController.prototype.showCategory = function (name, level) {
      var ch;
      if (level > 0) {
        return false;
      }
      ch = this.alphaText(name);
      if (this.alhpabet.indexOf(ch) > -1) {
        return false;
      }
      this.alhpabet += ch;
      return true;
    };

    IndexController.prototype.showNextLevel = function (node) {
      var childData, id, obj1, old;
      id = node.getAttribute('data-indexid');
      old = this.widget.get('show.' + id);
      childData = (obj1 = {}, obj1["" + id] = !old, obj1);
      while (id) {
        id = id.substr(0, id.lastIndexOf('_'));
        childData[id] = true;
      }
      return this.widget.publish('show', childData);
    };

    IndexController.prototype.alphaText = function (name) {
      return name.toUpperCase().charAt(0);
    };

    IndexController.prototype.getIndexData = function () {
      return model.subscribeOnce(consts('KEY_PUBLISH_BASE_URL'), function () {
        var baseContext, baseUrl, err, hashString, host, parentPath;
        try {
          baseUrl = model.get(consts('KEY_PUBLISH_BASE_URL'));
          host = document.location.origin;
          baseContext = baseUrl.substr(host.length);
          parentPath = _.parentPath(_.filePath(_.getRootUrl()));
          if (baseContext && !_.isEmptyString(baseContext)) {
            hashString = _.mapToEncodedString(_.extend({
              area: rhs.area(),
              prj: rhs.project(),
              type: rhs.type(),
              agt: 'ndx',
              mgr: 'agm'
            }));
            return http.get(baseContext + "?" + hashString).success(function (data, status) {
              var list;
              data = JSON.parse(data);
              list = [];
              _.each(data, function (item) {
                data[0] = _.ensureSlash(data[0]);
                return list.push(_.makeRelativeUrl(item, data[0]));
              });
              return model.publish(consts('KEY_PROJECT_LIST'), list);
            });
          }
        } catch (_error) {
          err = _error;
          if (rh._debug) {
            return rh._d('warn', err.message);
          }
        }
      });
    };

    return IndexController;
  }(rh.NavController);

  rh.controller('IndexController', IndexController);
}).call(undefined);

},{}],14:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var model = rh.model;


model.publish(consts('KEY_SHOW_TAGS'), rh._params.showtags === 'true');
model.publish(consts('KEY_IFRAME_EVENTS'), { click: true });

var oldHashMap = {};
var hashChanged = function hashChanged() {
  var newHashMap = _.hashParams();
  model.publish(consts('EVT_HASH_CHANGE'), { oldMap: oldHashMap, newMap: newHashMap }, { sync: true });
  return oldHashMap = newHashMap;
};

var redirectToDefaultTopic = function redirectToDefaultTopic() {
  var paramsStr = _.extractParamString(document.location.href);
  var paramsMap = _.urlParams(paramsStr);
  var hashStr = _.extractHashString(document.location.href);
  var hashMap = _.hashParams(hashStr);
  var mapnoattr = consts('RHMAPNO');
  var topicKey = consts('HASH_KEY_TOPIC');
  if (!(mapnoattr in paramsMap) && !(topicKey in hashMap)) {
    return document.location = consts('DEFAULT_TOPIC');
  }
};

_.addEventListener(window, 'hashchange', hashChanged);

_.addEventListener(window, 'orientationchange', function (e) {
  model.publish(consts('EVT_ORIENTATION_CHANGE'), null);
  if (model.get(consts('KEY_SCREEN_IPAD'))) {
    var topicFrame = void 0;
    if (topicFrame = _.getTopicFrame()) {
      var display = topicFrame.style.display;

      topicFrame.style.display = 'none';
      topicFrame.offsetHeight;
      return _.defer(function () {
        topicFrame.style.display = display;
        return _.delay(function () {
          topicFrame.offsetHeight;
          return _.delay(function () {
            return (// Let try once more
              topicFrame.offsetHeight
            );
          }, 500);
        }, 200);
      });
    }
  }
});

// TODO
//model.subscribe consts('EVT_ORIENTATION_CHANGE'), _.debounce ->
//  meta = $('meta[name=viewport]', 0)
//  meta.content = "width=#{window.innerWidth}, initial-scale=1,
//  maximum-scale=3, user-scalable=yes"
//  if model.get consts 'KEY_SCREEN_IOS'
//    model.publish consts('EVT_RELOAD_TOPIC'), null
//, 250

model.subscribe(consts('EVT_WIDGET_LOADED'), function () {
  // Create ExpressionBuilder widget on every page
  var topicFrame = void 0;
  model.subscribe(consts('KEY_MERGED_FILTER_KEY'), function () {
    return new rh.widgets.ExpressionBuilder();
  });

  // Create BrowseSequenceBuilder widget on every page
  new rh.widgets.BrowseSequenceBuilder();

  hashChanged();

  // replace default print method to support iFrame
  rh.layoutPrint = window.print;
  window.print = function () {
    return (
      // publish it with null value, to stop the autmatic subscribe calls
      model.publish(consts('EVT_PRINT_TOPIC'), null)
    );
  };

  var topicFileName = _.getFileName(document.location.href);
  if (topicFileName === consts('TOPIC_FILE')) {
    var redirectUrl = redirectToDefaultTopic();
    if (redirectUrl) {
      return redirectUrl;
    }
  }

  if (topicFrame = _.getTopicFrame()) {
    return topicFrame.onload = function () {
      return model.publish(consts('EVT_TOPIC_LOADED'), null);
    };
  } else {
    var paramsStr = _.extractParamString(document.location.href);
    var paramsMap = _.urlParams(paramsStr);
    var mapnoattr = consts('RHMAPNO');
    if (mapnoattr in paramsMap) {
      return document.location = consts('TOPIC_FILE') + "?" + paramsStr;
    }
  }
});
model.subscribe(consts('EVT_BOOKMARK') + '#content_top_placeholder', function () {
  return (
    // Hack #content_top_link clicks and send them to content iframe
    model.publish(consts('EVT_SCROLL_TO_TOP'), null)
  );
});

model.subscribe(consts('KEY_PROJECT_LIST'), function () {
  return rh.filterObject = new rh.MergeProj();
});

model.subscribe(consts('EVT_PROJECT_LOADED'), function () {
  var deviceReady = "deviceready";
  return document.addEventListener(deviceReady, function () {
    if (window.cordova != null) {
      return model.publish(consts('KEY_MOBILE_APP_MODE'), true);
    }
  });
});

},{}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsLoadingController = function () {
  var rh = undefined;
  var $ = undefined;
  var _ = undefined;
  JsLoadingController = function () {
    _createClass(JsLoadingController, null, [{
      key: 'initClass',
      value: function initClass() {
        var _window = window;
        rh = _window.rh;
        var _rh = rh;
        $ = _rh.$;
        var _rh2 = rh;
        _ = _rh2._;
      }
    }]);

    function JsLoadingController(widget, opts) {
      _classCallCheck(this, JsLoadingController);

      var removeClasses = (opts != null ? opts.removeClasses : undefined) || ['hide-children', 'loading'];
      _.each(removeClasses, function (className) {
        return $.removeClass(widget.node, className);
      });
      _.each(opts != null ? opts.addClasses : undefined, function (className) {
        return $.addClass(widget.node, className);
      });
    }

    return JsLoadingController;
  }();
  JsLoadingController.initClass();
  return JsLoadingController;
}();

window.rh.controller('JsLoadingController', JsLoadingController);

},{}],16:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;


rh.model.subscribe(consts('EVT_WIDGET_BEFORELOAD'), function () {
  if ($('a.wShow', 0) !== null) {
    var contentDiv = $('.contenttopic', 0);
    $.setAttribute(contentDiv, 'data-rhwidget', 'Basic');
    return $.setAttribute(contentDiv, 'data-class', 'govt_csh:@.l.csh_mode;govt_nocsh:!@.l.csh_mode');
  }
});

},{}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    rh = _window.rh;
var _ = rh._;
var model = rh.model;
var consts = rh.consts;


var Projects = function () {
  var projectList = undefined;
  var projectQueue = undefined;
  var projDataFile = undefined;
  var REMOTENODE = undefined;
  var PROJNODE = undefined;
  var URL = undefined;
  var loaded = undefined;
  var loadProjectFile = undefined;
  var getProjectList = undefined;
  Projects = function () {
    _createClass(Projects, null, [{
      key: 'initClass',
      value: function initClass() {
        projectList = [];
        projectQueue = [];
        projDataFile = 'projectdata.js';
        REMOTENODE = 'remote';
        PROJNODE = 'project';
        URL = 'url';
        loaded = 0;

        loadProjectFile = function loadProjectFile(curProjPath) {
          var curProjDataFile = curProjPath + '/' + projDataFile;
          return window.xmlJsReader.loadFile(curProjDataFile, function (xmlDoc, curProjPath) {
            var remoteNodes = void 0;
            var len = 0;
            loaded++;
            if (xmlDoc != null) {
              var projXmlNode = xmlDoc.getElementsByTagName(PROJNODE)[0];
              remoteNodes = projXmlNode.getElementsByTagName(REMOTENODE);
              len = remoteNodes.length;
            }
            _.each(remoteNodes, function (remoteNode) {
              var path = curProjPath + '/' + remoteNode.getAttribute(URL);
              projectList.push(path);
              return projectQueue.push(path);
            });
            getProjectList();
            if (projectQueue.length === 0 && loaded === projectList.length) {
              model.publish(consts('KEY_PROJECT_LIST'), projectList);
              return model.publish(consts('KEY_MASTER_PROJECT_LIST'), ["."]);
            }
          }, curProjPath);
        };

        getProjectList = function getProjectList() {
          return function () {
            var result = [];
            while (projectQueue.length > 0) {
              var project = projectQueue.splice(0, 1);
              result.push(loadProjectFile(project));
            }
            return result;
          }();
        };
      }
    }]);

    function Projects() {
      _classCallCheck(this, Projects);

      projectList.push('.');
      projectQueue.push('.');
      getProjectList();
    }

    return Projects;
  }();
  Projects.initClass();
  return Projects;
}();

model.subscribe(consts('EVT_PROJECT_LOADED'), function () {
  return _.defer(function () {
    if (!model.get(consts('KEY_PUBLISH_MODE')) && !window.gbPreviewMode) {
      return new Projects();
    }
  });
});

},{}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModernLayoutController = function () {
  var rh = undefined;
  var _ = undefined;
  var $ = undefined;
  var consts = undefined;
  var KEY_FEATURE = undefined;
  var KEY_FILTER_LOCATION = undefined;
  var KEY_SEARCH_LOCATION = undefined;
  var KEY_ACTIVE_TAB = undefined;
  var KEY_UI_MODE = undefined;
  var KEY_MOBILE_TOC_DRILL_DOWN = undefined;
  var KEY_TOC_DRILL_DOWN = undefined;
  var DESKTOP = undefined;
  var TABLET = undefined;
  var PHONE = undefined;
  var SHOW_FILTER_UI = undefined;
  var tabs = undefined;
  var sideBarTabs = undefined;
  var delayLoadTabs = undefined;
  ModernLayoutController = function () {
    _createClass(ModernLayoutController, null, [{
      key: 'initClass',
      value: function initClass() {
        var _window = window;
        rh = _window.rh;
        var _rh = rh;
        _ = _rh._;
        var _rh2 = rh;
        $ = _rh2.$;
        var _rh3 = rh;
        consts = _rh3.consts;

        KEY_FEATURE = consts('KEY_FEATURE');
        KEY_FILTER_LOCATION = consts('KEY_FILTER_LOCATION');
        KEY_SEARCH_LOCATION = consts('KEY_SEARCH_LOCATION');
        KEY_ACTIVE_TAB = consts('KEY_ACTIVE_TAB');
        KEY_UI_MODE = consts('KEY_UI_MODE');
        KEY_MOBILE_TOC_DRILL_DOWN = consts('KEY_MOBILE_TOC_DRILL_DOWN');
        KEY_TOC_DRILL_DOWN = consts('KEY_TOC_DRILL_DOWN');
        DESKTOP = 'desktop';
        TABLET = 'tablet';
        PHONE = 'phone';
        SHOW_FILTER_UI = rh._params.hideUI !== 'filter';
        tabs = {
          desktop: ['toc', 'idx', 'glo', 'filter', 'fts'],
          tablet: ['toc', 'idx', 'glo', 'filter', 'fts'],
          phone: ['toc', 'idx', 'glo', 'filter', 'fts']
        };

        sideBarTabs = {
          desktop: ['toc', 'idx', 'glo', 'filter', 'fts'],
          tablet: ['toc', 'idx', 'glo', 'filter', 'fts'],
          phone: ['toc', 'idx', 'glo']
        };
        delayLoadTabs = {
          'idx': { evt: 'EVT_LOAD_IDX', f_key: 'delay_load_idx' },
          'glo': { evt: 'EVT_LOAD_GLO', f_key: 'delay_load_glo' }
        };
      }
    }]);

    function ModernLayoutController(widget) {
      var _this = this;

      _classCallCheck(this, ModernLayoutController);

      this.triggerDelayLoadWidgets = this.triggerDelayLoadWidgets.bind(this);
      this.widget = widget;
      this.init();
      this.subscribeActiveTab();
      this.subscribeToLocations();
      this.subscribeScreens();

      this.widget.subscribe(consts('EVT_PROJECT_LOADED'), function () {
        _this.subscribeUIMode();
        _this.subscribeMergedFilter();
        _this.subscribeTopicClick();
        _this.subscribeTopicScroll();
        _this.subscribForSearchResult();
        _this.subscribeTopicNavigate();
        _this.subscribeToDelayLoadEvents();
        return _this.widget.publish(consts('KEY_IFRAME_EVENTS'), { click: true, scroll: false });
      });
    }

    _createClass(ModernLayoutController, [{
      key: 'init',
      value: function init() {
        this.screens = this.widget.get(consts('KEY_SCREEN_NAMES'));
        rh.storage.init(consts('HELP_ID'));
        this.activeScreen = _.find(this.screens, function (screen) {
          return this.widget.get(consts('KEY_SCREEN') + '.' + screen + '.attached');
        }, this);
        if (this.activeScreen == null) {
          this.activeScreen = this.widget.get(consts('KEY_DEFAULT_SCREEN'));
        }

        this.assureLocations(this.activeScreen);

        this.initDefauls();

        return this.initActiveTab();
      }
    }, {
      key: 'initDefauls',
      value: function initDefauls() {
        var defaultTab = this.widget.get(consts('KEY_DEFAULT_TAB'));
        if (!this.hasFeature(defaultTab)) {
          defaultTab = null;
        }

        this.defaultTabs = {};

        return _.each(this.screens, function (screen) {
          tabs[screen] = _.filter(tabs[screen], function (tab) {
            return this.hasFeature(tab);
          }, this);

          sideBarTabs[screen] = _.filter(sideBarTabs[screen], function (tab) {
            return this.hasFeature(tab);
          }, this);

          return this.defaultTabs[screen] = defaultTab && -1 !== tabs[screen].indexOf(defaultTab) ? defaultTab : tabs[screen][0];
        }, this);
      }
    }, {
      key: 'initActiveTab',
      value: function initActiveTab() {
        var activeTab = rh.storage.fetch('activetab');
        if (activeTab !== undefined && activeTab && this.hasFeature(activeTab)) {
          return this.widget.publish(KEY_ACTIVE_TAB, activeTab);
        }
      }
    }, {
      key: 'isValidTab',
      value: function isValidTab(tab, screen) {
        if (screen == null) {
          screen = this.activeScreen;
        }
        if (!tab || !this.hasFeature(tab)) {
          return false;
        }

        if (screen === DESKTOP) {
          if (tab === 'filter' && 'content' === this.widget.get(KEY_FILTER_LOCATION) || tab === 'fts' && 'content' === this.widget.get(KEY_SEARCH_LOCATION)) {
            return false;
          }
        }

        return -1 !== tabs[screen].indexOf(tab);
      }
    }, {
      key: 'defaultTab',
      value: function defaultTab(screen) {
        if (screen == null) {
          screen = this.activeScreen;
        }
        var defaultTab = this.defaultTabs[screen];
        if (!this.isValidTab(defaultTab)) {
          defaultTab = _.find(tabs[screen], function (tab) {
            return this.isValidTab(tab);
          }, this);
        }
        return defaultTab;
      }
    }, {
      key: 'assureValidActiveTab',
      value: function assureValidActiveTab(screen) {
        if (screen == null) {
          screen = this.activeScreen;
        }
        var activetab = this.widget.get(KEY_ACTIVE_TAB);
        if (screen === DESKTOP || activetab) {
          if (!this.isValidTab(activetab)) {
            activetab = this.defaultTab();
          }
          return this.widget.publish(KEY_ACTIVE_TAB, activetab);
        }
      }
    }, {
      key: 'toggleSideBar',
      value: function toggleSideBar() {
        if (this.widget.get(KEY_ACTIVE_TAB)) {
          return this.widget.publish(KEY_ACTIVE_TAB, null);
        } else {
          return this.widget.publish(KEY_ACTIVE_TAB, this.lastMobileTab || this.defaultTab());
        }
      }
    }, {
      key: 'toggleActiveTab',
      value: function toggleActiveTab(tab) {
        return this.widget.publish(KEY_ACTIVE_TAB, !this.isDesktopScreen() && tab === this.widget.get(KEY_ACTIVE_TAB) ? null : tab);
      }
    }, {
      key: 'triggerDelayLoadWidgets',
      value: function triggerDelayLoadWidgets(tab) {
        var tabObj = delayLoadTabs[tab];
        if (tabObj && this.hasFeature(tabObj.f_key)) {
          return this.widget.publish(consts(tabObj.evt), true);
        }
      }
    }, {
      key: 'subscribeToDelayLoadEvents',
      value: function subscribeToDelayLoadEvents() {
        return this.widget.subscribe(KEY_ACTIVE_TAB, this.triggerDelayLoadWidgets);
      }
    }, {
      key: 'filterDone',
      value: function filterDone() {
        return this.widget.publish(KEY_ACTIVE_TAB, this.searchMode ? 'fts' : null);
      }
    }, {
      key: 'hasFeature',
      value: function hasFeature(feature) {
        return feature === undefined || false !== this.widget.get(KEY_FEATURE + '.' + feature);
      }
    }, {
      key: 'subscribeUIMode',
      value: function subscribeUIMode() {
        var _this2 = this;

        var setSearchTab = function setSearchTab() {
          if (!_this2.isValidTab('fts')) {
            return;
          }
          if (!_this2.isDesktopScreen() || 'tabbar' === _this2.widget.get(KEY_SEARCH_LOCATION)) {
            return _this2.widget.publish(KEY_ACTIVE_TAB, 'fts');
          }
        };

        this.widget.subscribe(KEY_UI_MODE, function (mode) {
          return _this2.widget.publish('active_content', mode);
        });

        this.widget.subscribe('active_content', function (mode) {
          if (_this2.isMobileScreen() && !mode) {
            return _this2.widget.publish(KEY_ACTIVE_TAB, null);
          } else if ('search' === mode) {
            return setSearchTab();
          }
        }, { initDone: true });
        if ('search' === this.widget.get('active_content')) {
          return setSearchTab();
        }
      }
    }, {
      key: 'subscribeMergedFilter',
      value: function subscribeMergedFilter() {
        var _this3 = this;

        var featureFilterKey = void 0;
        if (this.widget.get(featureFilterKey = KEY_FEATURE + '.filter')) {
          return this.widget.subscribe(consts('KEY_MERGED_FILTER_KEY'), function (tags) {
            _this3.widget.publish(featureFilterKey, tags && tags.length && SHOW_FILTER_UI ? true : false);
            return _this3.assureValidActiveTab();
          });
        }
      }
    }, {
      key: 'subscribeTopicClick',
      value: function subscribeTopicClick() {
        var _this4 = this;

        return this.widget.subscribe(consts('EVT_CLICK_INSIDE_IFRAME'), function () {
          if (_this4.activeScreen === PHONE && _this4.widget.get(KEY_ACTIVE_TAB)) {
            return _this4.toggleSideBar();
          }
        });
      }
    }, {
      key: 'subscribeTopicNavigate',
      value: function subscribeTopicNavigate() {
        var _this5 = this;

        return this.widget.subscribe(consts('EVT_NAVIGATE_TO_URL'), function (obj) {
          if (obj.absUrl && _.isUrlAllowdInIframe(obj.absUrl)) {
            return _this5.widget.publish('active_content', null);
          }
        });
      }
    }, {
      key: 'subscribeTopicScroll',
      value: function subscribeTopicScroll() {
        var _this6 = this;

        return this.widget.subscribe(consts('EVT_SCROLL_INSIDE_IFRAME'), function (info) {
          var hide_header = info.dir === 'down' || info.scrollTop > 10;
          _this6.widget.publish('hide_header', hide_header);

          var hide_mobile_functions = info.dir === 'down' && info.scrollTop > 10;
          return _this6.widget.publish('hide_mobile_functions', hide_mobile_functions);
        });
      }
    }, {
      key: 'subscribeActiveTab',
      value: function subscribeActiveTab() {
        var _this7 = this;

        return this.widget.subscribe(KEY_ACTIVE_TAB, function (activeTab) {
          rh.storage.persist('activetab', activeTab);
          if (_this7.isMobileScreen()) {
            if (_this7.isSidebarTab(activeTab)) {
              _this7.lastMobileTab = activeTab;
            }
            return _this7.searchMode = activeTab === 'fts' || _this7.searchMode && activeTab === 'filter';
          } else {
            return _this7.searchMode = false;
          }
        });
      }
    }, {
      key: 'subscribeScreens',
      value: function subscribeScreens() {
        return _.each(this.screens, function (screen) {
          var _this8 = this;

          var key = consts('KEY_SCREEN') + '.' + screen + '.attached';
          if (this.widget.get(key)) {
            this.handleScreen(true, screen);
          }
          return this.widget.subscribe(key, function (attached) {
            return _this8.handleScreen(attached, screen);
          }, { initDone: true });
        }, this);
      }
    }, {
      key: 'subscribeToLocations',
      value: function subscribeToLocations() {
        var _this9 = this;

        this.widget.subscribe(KEY_SEARCH_LOCATION, function () {
          return _this9.assureValidActiveTab(_this9.activeScreen);
        });

        return this.widget.subscribe(KEY_FILTER_LOCATION, function () {
          return _this9.assureValidActiveTab(_this9.activeScreen);
        });
      }
    }, {
      key: 'subscribForSearchResult',
      value: function subscribForSearchResult() {
        var _this10 = this;

        var updateSearchResults = function updateSearchResults() {
          var tagExpr = _this10.widget.get(consts('KEY_TAG_EXPRESSION'));
          var searchTagExpr = _this10.widget.get(consts('KEY_ONSEARCH_TAG_EXPR'));
          if (searchTagExpr && searchTagExpr !== JSON.stringify(tagExpr)) {
            return _this10.widget.publish(consts('EVT_SEARCH_TERM'), true);
          }
        };

        this.widget.subscribe(consts('KEY_TAG_EXPRESSION'), _.debounce(function () {
          if (_this10.isValidTab('fts') && 'fts' !== _this10.widget.get(KEY_ACTIVE_TAB)) {
            return;
          }
          if (!_this10.isSearchMode(_this10.widget.get(KEY_ACTIVE_TAB))) {
            return;
          }

          return updateSearchResults();
        }, 300));

        return this.widget.subscribe(KEY_ACTIVE_TAB, function (tab) {
          if (tab === 'fts') {
            return updateSearchResults();
          }
        });
      }
    }, {
      key: 'isMobileScreen',
      value: function isMobileScreen() {
        return this.activeScreen === PHONE;
      }
    }, {
      key: 'isDesktopScreen',
      value: function isDesktopScreen() {
        return this.activeScreen === DESKTOP;
      }
    }, {
      key: 'isTabletScreen',
      value: function isTabletScreen() {
        return this.activeScreen === TABLET;
      }
    }, {
      key: 'isSidebarTab',
      value: function isSidebarTab(tab) {
        return tab && -1 !== sideBarTabs[this.activeScreen].indexOf(tab);
      }
    }, {
      key: 'isSearchMode',
      value: function isSearchMode(tab) {
        var topicTab = this.widget.get('active_content');
        return tab === 'fts' || topicTab === 'search' && this.isDesktopScreen() && 'content' === this.widget.get(KEY_SEARCH_LOCATION);
      }
    }, {
      key: 'handleScreen',
      value: function handleScreen(attached, screen) {
        if (attached) {
          this.activeScreen = screen;
          return this.handleAttached(screen);
        } else {
          return this.handleDetached(screen);
        }
      }
    }, {
      key: 'handleDetached',
      value: function handleDetached(screen) {
        var _this11 = this;

        return _.defer(function () {
          if (screen === DESKTOP) {
            return _this11.widget.publish(KEY_ACTIVE_TAB, 'search' === _this11.widget.get('active_content') && _this11.isValidTab('fts') ? 'fts' : null);
          }
        });
      }
    }, {
      key: 'handleAttached',
      value: function handleAttached(screen) {
        this.assureLocations(screen);
        this.assureValidActiveTab(screen);
        return this.assureTOCMode(screen);
      }
    }, {
      key: 'assureLocations',
      value: function assureLocations(screen) {
        if (screen == null) {
          screen = this.activeScreen;
        }
        this.widget.publish(KEY_SEARCH_LOCATION, screen === DESKTOP ? this.widget.get(consts('KEY_DEFAULT_SEARCH_LOCATION')) : screen === TABLET ? 'tabbar' : 'content');
        return this.widget.publish(KEY_FILTER_LOCATION, screen === DESKTOP || screen === TABLET ? 'tabbar' : 'content');
      }
    }, {
      key: 'assureTOCMode',
      value: function assureTOCMode(screen) {
        if (screen == null) {
          screen = this.activeScreen;
        }
        return this.widget.publish(KEY_TOC_DRILL_DOWN, screen !== DESKTOP && this.widget.get(KEY_MOBILE_TOC_DRILL_DOWN));
      }
    }, {
      key: 'newSearch',
      value: function newSearch(text, keyCode, event) {
        if (keyCode === 13) {
          var oldText = this.widget.get(consts('KEY_SEARCH_TERM'));
          if (oldText !== text) {
            this.widget.publish(consts('KEY_SEARCH_TERM'), text);
          }
          this.widget.publish(consts('EVT_SEARCH_TERM'), true);
          if (event != null ? event.target : undefined) {
            return event.target.blur();
          }
        }
      }
    }, {
      key: 'isTagStatesChanged',
      value: function isTagStatesChanged() {
        var currentState = _.compactObject(this.widget.get(consts('KEY_PROJECT_TAG_STATES')));
        var defaultState = _.compactObject(this.widget.get(consts('KEY_DEFAULT_FILTER')));
        return !_.isEqual(currentState, defaultState);
      }
    }, {
      key: 'setDefaultTagStates',
      value: function setDefaultTagStates() {
        var defaultState = this.widget.get(consts('KEY_DEFAULT_FILTER'));
        return this.widget.publish(consts('KEY_PROJECT_TAG_STATES'), _.clone(defaultState));
      }
    }]);

    return ModernLayoutController;
  }();
  ModernLayoutController.initClass();
  return ModernLayoutController;
}();

window.rh.controller('ModernLayoutController', ModernLayoutController);

},{}],19:[function(require,module,exports){
'use strict';

// Generated by CoffeeScript 1.9.1
(function () {
  var MergeProj, _, consts, model, rh;

  rh = window.rh;

  model = rh.model;

  _ = rh._;

  consts = rh.consts;

  MergeProj = function () {
    var group, onLoadScipt;

    function MergeProj() {
      this.tagCombs = [];
      this.idmap = {};
      this.filter = [];
      this.grpType = 'group';
      this.dataLoaded = false;
      this.loadTagData(model.get(consts('KEY_PROJECT_LIST')));
      this.caption = this.type = this.defFilter = void 0;
    }

    MergeProj.prototype.updateTagCombs = function (project) {
      var base, combs;
      combs = model.get(consts('KEY_PROJECT_TAG_COMBINATIONS'));
      if (combs != null) {
        project = _.parseProjectName(project);
        return (base = this.idmap)[project] != null ? base[project] : base[project] = combs;
      }
    };

    MergeProj.prototype.lookup = function (children, key, isGrpType) {
      var child, compKey, element, i, len;
      if (isGrpType == null) {
        isGrpType = true;
      }
      if (children != null && key != null) {
        for (i = 0, len = children.length; i < len; i++) {
          child = children[i];
          if (!(child != null)) {
            continue;
          }
          compKey = child.name || child.display;
          if (isGrpType === (child.children != null) && compKey === key) {
            element = child;
          } else if (child.children != null && !isGrpType) {
            element = this.lookup(child.children, key, isGrpType);
          }
          if (element != null) {
            break;
          }
        }
      }
      return element;
    };

    group = function group(disp) {
      var object;
      return object = {
        type: 'group',
        display: disp,
        children: []
      };
    };

    MergeProj.prototype.addTag = function (childArr, tagElement) {
      var tag;
      if (this.lookup(this.filter, tagElement.name, false) == null) {
        tag = {
          display: tagElement.display,
          name: tagElement.name
        };
        return childArr.push(tag);
      }
    };

    MergeProj.prototype.addGroup = function (grpElement) {
      var element, grp, i, len, ref;
      grp = this.lookup(this.filter, grpElement.display);
      if (grp == null) {
        grp = group(grpElement.display);
        this.filter.push(grp);
      }
      ref = grpElement.children;
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        if (element != null) {
          if (element.children == null) {
            this.addTag(grp.children, element);
          }
        }
      }
      if (grp.children.length === 0 && this.filter.indexOf(grp) > -1) {
        return this.filter.splice(this.filter.indexOf(grp), 1);
      }
    };

    MergeProj.prototype.updateFilter = function () {
      var curfilter, element, i, len, results;
      curfilter = model.get(consts('KEY_TEMP_DATA')) || [];
      if (!this.caption) {
        this.caption = curfilter['caption'];
      }
      if (!this.type) {
        this.type = curfilter['type'];
      }
      if (typeof this.defFilter === 'undefined') {
        this.defFilter = curfilter['default'];
      }
      curfilter = curfilter['tags'] || [];
      model.publish(consts('KEY_TEMP_DATA'));
      results = [];
      for (i = 0, len = curfilter.length; i < len; i++) {
        element = curfilter[i];
        if (element != null) {
          if (element.children != null) {
            results.push(this.addGroup(element));
          } else {
            results.push(this.addTag(this.filter, element));
          }
        }
      }
      return results;
    };

    onLoadScipt = function onLoadScipt(project, count) {
      this.updateTagCombs(project);
      this.updateFilter();
      if (!count) {
        model.publish(consts('KEY_MERGED_FILTER_KEY'), this.filter);
        model.publish(consts('KEY_MERGED_PROJECT_MAP'), this.idmap);
        model.publish(consts('KEY_PROJECT_FILTER_CAPTION'), this.caption);
        model.publish(consts('KEY_PROJECT_FILTER_TYPE'), this.type);
        model.publish(consts('KEY_DEFAULT_FILTER'), this.defFilter);
        return this.dataLoaded = true;
      }
    };

    MergeProj.prototype.loadTagData = function (projList) {
      var count, i, len, project, results;
      if (!this.dataLoaded) {
        count = projList.length;
        results = [];
        for (i = 0, len = projList.length; i < len; i++) {
          project = projList[i];
          if (project != null) {
            if (project) {
              project = project + "/";
            }
            results.push(_.loadScript("" + project + consts('PATH_PROJECT_TAGDATA_FILE'), false, onLoadScipt.bind(this, project, --count)));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    return MergeProj;
  }();

  rh.MergeProj = MergeProj;
}).call(undefined);

},{}],20:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var model = rh.model;
var rhs = rh.rhs;

var unsub = null;

unsub = model.subscribe(consts('KEY_TAG_EXPRESSION'), function () {
  var done = false;
  return function () {
    if (unsub) {
      unsub();
    }
    if (done) {
      return;
    }
    done = true;
    return model.subscribe(consts('KEY_SEARCHED_TERM'), function () {
      return model.publish(consts('KEY_ONSEARCH_TAG_EXPR'), JSON.stringify(model.get(consts('KEY_TAG_EXPRESSION'))));
    });
  };
}());

model.subscribe(consts('EVT_SEARCH_TERM'), function () {
  var canHandleSearch = model.get(consts('KEY_CAN_HANDLE_SEARCH'));
  var searchTerm = model.get(consts('KEY_SEARCH_TERM')) || null;
  var newMap = {};
  newMap[consts('HASH_KEY_RH_SEARCH')] = searchTerm;
  newMap[consts('HASH_KEY_UIMODE')] = 'search';

  if (canHandleSearch !== true) {
    return document.location = window.gRootRelPath + '/' + ('' + (window.gSearchPageFilePath || consts('START_FILEPATH'))) + ('?#' + _.mapToEncodedString(newMap));
  } else {
    model.publish(consts('EVT_QUERY_SEARCH_RESULTS'), true);
    return _.defer(function () {
      return _.updateHashMap(newMap, true);
    });
  }
});

model.subscribe(consts('EVT_PROJECT_LOADED'), function () {
  if (window.readSetting) {
    window.readSetting(RHANDSEARCH, function (state) {
      return model.publish(consts('KEY_AND_SEARCH'), state);
    });
  }

  return model.subscribe(consts('KEY_AND_SEARCH'), function (state) {
    return saveSetting(RHANDSEARCH, state === '1' ? '1' : '0', true);
  });
});

model.subscribe(consts('EVT_QUERY_SEARCH_RESULTS'), function () {
  if (!rhs.doSearch()) {
    return window.doSearch();
  }
});

},{}],21:[function(require,module,exports){
'use strict';

var _window = window,
    rh = _window.rh;
var _ = rh._;
var $ = rh.$;
var consts = rh.consts;
var model = rh.model;


_.getRootUrl = function () {
  var rootUrl = null;
  return function () {
    return rootUrl != null ? rootUrl : rootUrl = '' + _.getHostFolder() + consts('START_FILEPATH');
  };
}();

_.runTopicLoadingAnimation = function () {
  var runAnimation = null;
  var topicLoading = false;
  return function (flag) {
    topicLoading = flag;
    if (flag) {
      if (runAnimation == null) {
        runAnimation = _.debounce(function () {
          return model.publish(consts('EVT_TOPIC_LOADING'), topicLoading);
        }, 700);
      }
      return runAnimation();
    } else {
      runAnimation = null;
      return model.publish(consts('EVT_TOPIC_LOADING'), false);
    }
  };
}();

_.getTopicFrame = function () {
  var topicFrameName = window.gTopicFrameName || 'rh_default_topic_frame_name';
  return $('[name=' + topicFrameName + ']', 0);
};

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.1
 * Copyright (C) 2018 Oliver Nightingale
 * @license MIT
 */

;(function(){

/**
 * A convenience function for configuring and constructing
 * a new lunr Index.
 *
 * A lunr.Builder instance is created and the pipeline setup
 * with a trimmer, stop word filter and stemmer.
 *
 * This builder object is yielded to the configuration function
 * that is passed as a parameter, allowing the list of fields
 * and other builder parameters to be customised.
 *
 * All documents _must_ be added within the passed config function.
 *
 * @example
 * var idx = lunr(function () {
 *   this.field('title')
 *   this.field('body')
 *   this.ref('id')
 *
 *   documents.forEach(function (doc) {
 *     this.add(doc)
 *   }, this)
 * })
 *
 * @see {@link lunr.Builder}
 * @see {@link lunr.Pipeline}
 * @see {@link lunr.trimmer}
 * @see {@link lunr.stopWordFilter}
 * @see {@link lunr.stemmer}
 * @namespace {function} lunr
 */
var lunr = function (config) {
  var builder = new lunr.Builder

  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  builder.searchPipeline.add(
    lunr.stemmer
  )

  config.call(builder, builder)
  return builder.build()
}

lunr.version = "2.3.1"
/*!
 * lunr.utils
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 * @namespace lunr.utils
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf lunr.utils
 * @function
 */
lunr.utils.warn = (function (global) {
  /* eslint-disable no-console */
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
  /* eslint-enable no-console */
})(this)

/**
 * Convert an object to a string.
 *
 * In the case of `null` and `undefined` the function returns
 * the empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {Any} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf lunr.utils
 */
lunr.utils.asString = function (obj) {
  if (obj === void 0 || obj === null) {
    return ""
  } else {
    return obj.toString()
  }
}

/**
 * Clones an object.
 *
 * Will create a copy of an existing object such that any mutations
 * on the copy cannot affect the original.
 *
 * Only shallow objects are supported, passing a nested object to this
 * function will cause a TypeError.
 *
 * Objects with primitives, and arrays of primitives are supported.
 *
 * @param {Object} obj The object to clone.
 * @return {Object} a clone of the passed object.
 * @throws {TypeError} when a nested object is passed.
 * @memberOf Utils
 */
lunr.utils.clone = function (obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  var clone = Object.create(null),
      keys = Object.keys(obj)

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i],
        val = obj[key]

    if (Array.isArray(val)) {
      clone[key] = val.slice()
      continue
    }

    if (typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean') {
      clone[key] = val
      continue
    }

    throw new TypeError("clone is not deep and does not support nested objects")
  }

  return clone
}
lunr.FieldRef = function (docRef, fieldName, stringValue) {
  this.docRef = docRef
  this.fieldName = fieldName
  this._stringValue = stringValue
}

lunr.FieldRef.joiner = "/"

lunr.FieldRef.fromString = function (s) {
  var n = s.indexOf(lunr.FieldRef.joiner)

  if (n === -1) {
    throw "malformed field ref string"
  }

  var fieldRef = s.slice(0, n),
      docRef = s.slice(n + 1)

  return new lunr.FieldRef (docRef, fieldRef, s)
}

lunr.FieldRef.prototype.toString = function () {
  if (this._stringValue == undefined) {
    this._stringValue = this.fieldName + lunr.FieldRef.joiner + this.docRef
  }

  return this._stringValue
}
/*!
 * lunr.Set
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * A lunr set.
 *
 * @constructor
 */
lunr.Set = function (elements) {
  this.elements = Object.create(null)

  if (elements) {
    this.length = elements.length

    for (var i = 0; i < this.length; i++) {
      this.elements[elements[i]] = true
    }
  } else {
    this.length = 0
  }
}

/**
 * A complete set that contains all elements.
 *
 * @static
 * @readonly
 * @type {lunr.Set}
 */
lunr.Set.complete = {
  intersect: function (other) {
    return other
  },

  union: function (other) {
    return other
  },

  contains: function () {
    return true
  }
}

/**
 * An empty set that contains no elements.
 *
 * @static
 * @readonly
 * @type {lunr.Set}
 */
lunr.Set.empty = {
  intersect: function () {
    return this
  },

  union: function (other) {
    return other
  },

  contains: function () {
    return false
  }
}

/**
 * Returns true if this set contains the specified object.
 *
 * @param {object} object - Object whose presence in this set is to be tested.
 * @returns {boolean} - True if this set contains the specified object.
 */
lunr.Set.prototype.contains = function (object) {
  return !!this.elements[object]
}

/**
 * Returns a new set containing only the elements that are present in both
 * this set and the specified set.
 *
 * @param {lunr.Set} other - set to intersect with this set.
 * @returns {lunr.Set} a new set that is the intersection of this and the specified set.
 */

lunr.Set.prototype.intersect = function (other) {
  var a, b, elements, intersection = []

  if (other === lunr.Set.complete) {
    return this
  }

  if (other === lunr.Set.empty) {
    return other
  }

  if (this.length < other.length) {
    a = this
    b = other
  } else {
    a = other
    b = this
  }

  elements = Object.keys(a.elements)

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i]
    if (element in b.elements) {
      intersection.push(element)
    }
  }

  return new lunr.Set (intersection)
}

/**
 * Returns a new set combining the elements of this and the specified set.
 *
 * @param {lunr.Set} other - set to union with this set.
 * @return {lunr.Set} a new set that is the union of this and the specified set.
 */

lunr.Set.prototype.union = function (other) {
  if (other === lunr.Set.complete) {
    return lunr.Set.complete
  }

  if (other === lunr.Set.empty) {
    return this
  }

  return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)))
}
/**
 * A function to calculate the inverse document frequency for
 * a posting. This is shared between the builder and the index
 *
 * @private
 * @param {object} posting - The posting for a given term
 * @param {number} documentCount - The total number of documents.
 */
lunr.idf = function (posting, documentCount) {
  var documentsWithTerm = 0

  for (var fieldName in posting) {
    if (fieldName == '_index') continue // Ignore the term index, its not a field
    documentsWithTerm += Object.keys(posting[fieldName]).length
  }

  var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)

  return Math.log(1 + Math.abs(x))
}

/**
 * A token wraps a string representation of a token
 * as it is passed through the text processing pipeline.
 *
 * @constructor
 * @param {string} [str=''] - The string token being wrapped.
 * @param {object} [metadata={}] - Metadata associated with this token.
 */
lunr.Token = function (str, metadata) {
  this.str = str || ""
  this.metadata = metadata || {}
}

/**
 * Returns the token string that is being wrapped by this object.
 *
 * @returns {string}
 */
lunr.Token.prototype.toString = function () {
  return this.str
}

/**
 * A token update function is used when updating or optionally
 * when cloning a token.
 *
 * @callback lunr.Token~updateFunction
 * @param {string} str - The string representation of the token.
 * @param {Object} metadata - All metadata associated with this token.
 */

/**
 * Applies the given function to the wrapped string token.
 *
 * @example
 * token.update(function (str, metadata) {
 *   return str.toUpperCase()
 * })
 *
 * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.update = function (fn) {
  this.str = fn(this.str, this.metadata)
  return this
}

/**
 * Creates a clone of this token. Optionally a function can be
 * applied to the cloned token.
 *
 * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.clone = function (fn) {
  fn = fn || function (s) { return s }
  return new lunr.Token (fn(this.str, this.metadata), this.metadata)
}
/*!
 * lunr.tokenizer
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index. Uses `lunr.tokenizer.separator` to split strings, change
 * the value of this property to change how strings are split into tokens.
 *
 * This tokenizer will convert its parameter to a string by calling `toString` and
 * then will split this string on the character in `lunr.tokenizer.separator`.
 * Arrays will have their elements converted to strings and wrapped in a lunr.Token.
 *
 * Optional metadata can be passed to the tokenizer, this metadata will be cloned and
 * added as metadata to every token that is created from the object to be tokenized.
 *
 * @static
 * @param {?(string|object|object[])} obj - The object to convert into tokens
 * @param {?object} metadata - Optional metadata to associate with every token
 * @returns {lunr.Token[]}
 * @see {@link lunr.Pipeline}
 */
lunr.tokenizer = function (obj, metadata) {
  if (obj == null || obj == undefined) {
    return []
  }

  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return new lunr.Token(
        lunr.utils.asString(t).toLowerCase(),
        lunr.utils.clone(metadata)
      )
    })
  }

  var str = obj.toString().trim().toLowerCase(),
      len = str.length,
      tokens = []

  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
    var char = str.charAt(sliceEnd),
        sliceLength = sliceEnd - sliceStart

    if ((char.match(lunr.tokenizer.separator) || sliceEnd == len)) {

      if (sliceLength > 0) {
        var tokenMetadata = lunr.utils.clone(metadata) || {}
        tokenMetadata["position"] = [sliceStart, sliceLength]
        tokenMetadata["index"] = tokens.length

        tokens.push(
          new lunr.Token (
            str.slice(sliceStart, sliceEnd),
            tokenMetadata
          )
        )
      }

      sliceStart = sliceEnd + 1
    }

  }

  return tokens
}

/**
 * The separator used to split a string into tokens. Override this property to change the behaviour of
 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see lunr.tokenizer
 */
lunr.tokenizer.separator = /[\s\-]+/
/*!
 * lunr.Pipeline
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.registeredFunctions = Object.create(null)

/**
 * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token
 * string as well as all known metadata. A pipeline function can mutate the token string
 * or mutate (or add) metadata for a given token.
 *
 * A pipeline function can indicate that the passed token should be discarded by returning
 * null. This token will not be passed to any downstream pipeline functions and will not be
 * added to the index.
 *
 * Multiple tokens can be returned by returning an array of tokens. Each token will be passed
 * to any downstream pipeline functions and all will returned tokens will be added to the index.
 *
 * Any number of pipeline functions may be chained together using a lunr.Pipeline.
 *
 * @interface lunr.PipelineFunction
 * @param {lunr.Token} token - A token from the document being processed.
 * @param {number} i - The index of this token in the complete list of tokens for this document/field.
 * @param {lunr.Token[]} tokens - All tokens for this document/field.
 * @returns {(?lunr.Token|lunr.Token[])}
 */

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @param {String} label - The label to register this function with
 */
lunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing registered function: ' + label)
  }

  fn.label = label
  lunr.Pipeline.registeredFunctions[fn.label] = fn
}

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @private
 */
lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn)
  }
}

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised - The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 */
lunr.Pipeline.load = function (serialised) {
  var pipeline = new lunr.Pipeline

  serialised.forEach(function (fnName) {
    var fn = lunr.Pipeline.registeredFunctions[fnName]

    if (fn) {
      pipeline.add(fn)
    } else {
      throw new Error('Cannot load unregistered function: ' + fnName)
    }
  })

  return pipeline
}

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.
 */
lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)

  fns.forEach(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)
    this._stack.push(fn)
  }, this)
}

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  pos = pos + 1
  this._stack.splice(pos, 0, newFn)
}

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  this._stack.splice(pos, 0, newFn)
}

/**
 * Removes a function from the pipeline.
 *
 * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.
 */
lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  if (pos == -1) {
    return
  }

  this._stack.splice(pos, 1)
}

/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 */
lunr.Pipeline.prototype.run = function (tokens) {
  var stackLength = this._stack.length

  for (var i = 0; i < stackLength; i++) {
    var fn = this._stack[i]
    var memo = []

    for (var j = 0; j < tokens.length; j++) {
      var result = fn(tokens[j], j, tokens)

      if (result === void 0 || result === '') continue

      if (result instanceof Array) {
        for (var k = 0; k < result.length; k++) {
          memo.push(result[k])
        }
      } else {
        memo.push(result)
      }
    }

    tokens = memo
  }

  return tokens
}

/**
 * Convenience method for passing a string through a pipeline and getting
 * strings out. This method takes care of wrapping the passed string in a
 * token and mapping the resulting tokens back to strings.
 *
 * @param {string} str - The string to pass through the pipeline.
 * @param {?object} metadata - Optional metadata to associate with the token
 * passed to the pipeline.
 * @returns {string[]}
 */
lunr.Pipeline.prototype.runString = function (str, metadata) {
  var token = new lunr.Token (str, metadata)

  return this.run([token]).map(function (t) {
    return t.toString()
  })
}

/**
 * Resets the pipeline by removing any existing processors.
 *
 */
lunr.Pipeline.prototype.reset = function () {
  this._stack = []
}

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 */
lunr.Pipeline.prototype.toJSON = function () {
  return this._stack.map(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)

    return fn.label
  })
}
/*!
 * lunr.Vector
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * A vector is used to construct the vector space of documents and queries. These
 * vectors support operations to determine the similarity between two documents or
 * a document and a query.
 *
 * Normally no parameters are required for initializing a vector, but in the case of
 * loading a previously dumped vector the raw elements can be provided to the constructor.
 *
 * For performance reasons vectors are implemented with a flat array, where an elements
 * index is immediately followed by its value. E.g. [index, value, index, value]. This
 * allows the underlying array to be as sparse as possible and still offer decent
 * performance when being used for vector calculations.
 *
 * @constructor
 * @param {Number[]} [elements] - The flat list of element index and element value pairs.
 */
lunr.Vector = function (elements) {
  this._magnitude = 0
  this.elements = elements || []
}


/**
 * Calculates the position within the vector to insert a given index.
 *
 * This is used internally by insert and upsert. If there are duplicate indexes then
 * the position is returned as if the value for that index were to be updated, but it
 * is the callers responsibility to check whether there is a duplicate at that index
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @returns {Number}
 */
lunr.Vector.prototype.positionForIndex = function (index) {
  // For an empty vector the tuple can be inserted at the beginning
  if (this.elements.length == 0) {
    return 0
  }

  var start = 0,
      end = this.elements.length / 2,
      sliceLength = end - start,
      pivotPoint = Math.floor(sliceLength / 2),
      pivotIndex = this.elements[pivotPoint * 2]

  while (sliceLength > 1) {
    if (pivotIndex < index) {
      start = pivotPoint
    }

    if (pivotIndex > index) {
      end = pivotPoint
    }

    if (pivotIndex == index) {
      break
    }

    sliceLength = end - start
    pivotPoint = start + Math.floor(sliceLength / 2)
    pivotIndex = this.elements[pivotPoint * 2]
  }

  if (pivotIndex == index) {
    return pivotPoint * 2
  }

  if (pivotIndex > index) {
    return pivotPoint * 2
  }

  if (pivotIndex < index) {
    return (pivotPoint + 1) * 2
  }
}

/**
 * Inserts an element at an index within the vector.
 *
 * Does not allow duplicates, will throw an error if there is already an entry
 * for this index.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 */
lunr.Vector.prototype.insert = function (insertIdx, val) {
  this.upsert(insertIdx, val, function () {
    throw "duplicate index"
  })
}

/**
 * Inserts or updates an existing index within the vector.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 * @param {function} fn - A function that is called for updates, the existing value and the
 * requested value are passed as arguments
 */
lunr.Vector.prototype.upsert = function (insertIdx, val, fn) {
  this._magnitude = 0
  var position = this.positionForIndex(insertIdx)

  if (this.elements[position] == insertIdx) {
    this.elements[position + 1] = fn(this.elements[position + 1], val)
  } else {
    this.elements.splice(position, 0, insertIdx, val)
  }
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude

  var sumOfSquares = 0,
      elementsLength = this.elements.length

  for (var i = 1; i < elementsLength; i += 2) {
    var val = this.elements[i]
    sumOfSquares += val * val
  }

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The vector to compute the dot product with.
 * @returns {Number}
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var dotProduct = 0,
      a = this.elements, b = otherVector.elements,
      aLen = a.length, bLen = b.length,
      aVal = 0, bVal = 0,
      i = 0, j = 0

  while (i < aLen && j < bLen) {
    aVal = a[i], bVal = b[j]
    if (aVal < bVal) {
      i += 2
    } else if (aVal > bVal) {
      j += 2
    } else if (aVal == bVal) {
      dotProduct += a[i + 1] * b[j + 1]
      i += 2
      j += 2
    }
  }

  return dotProduct
}

/**
 * Calculates the similarity between this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The other vector to calculate the
 * similarity with.
 * @returns {Number}
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / this.magnitude() || 0
}

/**
 * Converts the vector to an array of the elements within the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toArray = function () {
  var output = new Array (this.elements.length / 2)

  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
    output[j] = this.elements[i]
  }

  return output
}

/**
 * A JSON serializable representation of the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toJSON = function () {
  return this.elements
}
/* eslint-disable */
/*!
 * lunr.stemmer
 * Copyright (C) 2018 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token - The string to stem
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 * @function
 */
lunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) { w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return function (token) {
    return token.update(porterStemmer);
  }
})();

lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')
/*!
 * lunr.stopWordFilter
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
 * list of stop words.
 *
 * The built in lunr.stopWordFilter is built using this generator and can be used
 * to generate custom stopWordFilters for applications or non English languages.
 *
 * @function
 * @param {Array} token The token to pass through the filter
 * @returns {lunr.PipelineFunction}
 * @see lunr.Pipeline
 * @see lunr.stopWordFilter
 */
lunr.generateStopWordFilter = function (stopWords) {
  var words = stopWords.reduce(function (memo, stopWord) {
    memo[stopWord] = stopWord
    return memo
  }, {})

  return function (token) {
    if (token && words[token.toString()] !== token.toString()) return token
  }
}

/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @function
 * @implements {lunr.PipelineFunction}
 * @params {lunr.Token} token - A token to check for being a stop word.
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 */
lunr.stopWordFilter = lunr.generateStopWordFilter([
  'a',
  'able',
  'about',
  'across',
  'after',
  'all',
  'almost',
  'also',
  'am',
  'among',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'because',
  'been',
  'but',
  'by',
  'can',
  'cannot',
  'could',
  'dear',
  'did',
  'do',
  'does',
  'either',
  'else',
  'ever',
  'every',
  'for',
  'from',
  'get',
  'got',
  'had',
  'has',
  'have',
  'he',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'however',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'least',
  'let',
  'like',
  'likely',
  'may',
  'me',
  'might',
  'most',
  'must',
  'my',
  'neither',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'often',
  'on',
  'only',
  'or',
  'other',
  'our',
  'own',
  'rather',
  'said',
  'say',
  'says',
  'she',
  'should',
  'since',
  'so',
  'some',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'tis',
  'to',
  'too',
  'twas',
  'us',
  'wants',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'would',
  'yet',
  'you',
  'your'
])

lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')
/*!
 * lunr.trimmer
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the beginning and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token The token to pass through the filter
 * @returns {lunr.Token}
 * @see lunr.Pipeline
 */
lunr.trimmer = function (token) {
  return token.update(function (s) {
    return s.replace(/^\W+/, '').replace(/\W+$/, '')
  })
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')
/*!
 * lunr.TokenSet
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * A token set is used to store the unique list of all tokens
 * within an index. Token sets are also used to represent an
 * incoming query to the index, this query token set and index
 * token set are then intersected to find which tokens to look
 * up in the inverted index.
 *
 * A token set can hold multiple tokens, as in the case of the
 * index token set, or it can hold a single token as in the
 * case of a simple query token set.
 *
 * Additionally token sets are used to perform wildcard matching.
 * Leading, contained and trailing wildcards are supported, and
 * from this edit distance matching can also be provided.
 *
 * Token sets are implemented as a minimal finite state automata,
 * where both common prefixes and suffixes are shared between tokens.
 * This helps to reduce the space used for storing the token set.
 *
 * @constructor
 */
lunr.TokenSet = function () {
  this.final = false
  this.edges = {}
  this.id = lunr.TokenSet._nextId
  lunr.TokenSet._nextId += 1
}

/**
 * Keeps track of the next, auto increment, identifier to assign
 * to a new tokenSet.
 *
 * TokenSets require a unique identifier to be correctly minimised.
 *
 * @private
 */
lunr.TokenSet._nextId = 1

/**
 * Creates a TokenSet instance from the given sorted array of words.
 *
 * @param {String[]} arr - A sorted array of strings to create the set from.
 * @returns {lunr.TokenSet}
 * @throws Will throw an error if the input array is not sorted.
 */
lunr.TokenSet.fromArray = function (arr) {
  var builder = new lunr.TokenSet.Builder

  for (var i = 0, len = arr.length; i < len; i++) {
    builder.insert(arr[i])
  }

  builder.finish()
  return builder.root
}

/**
 * Creates a token set from a query clause.
 *
 * @private
 * @param {Object} clause - A single clause from lunr.Query.
 * @param {string} clause.term - The query clause term.
 * @param {number} [clause.editDistance] - The optional edit distance for the term.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromClause = function (clause) {
  if ('editDistance' in clause) {
    return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance)
  } else {
    return lunr.TokenSet.fromString(clause.term)
  }
}

/**
 * Creates a token set representing a single string with a specified
 * edit distance.
 *
 * Insertions, deletions, substitutions and transpositions are each
 * treated as an edit distance of 1.
 *
 * Increasing the allowed edit distance will have a dramatic impact
 * on the performance of both creating and intersecting these TokenSets.
 * It is advised to keep the edit distance less than 3.
 *
 * @param {string} str - The string to create the token set from.
 * @param {number} editDistance - The allowed edit distance to match.
 * @returns {lunr.Vector}
 */
lunr.TokenSet.fromFuzzyString = function (str, editDistance) {
  var root = new lunr.TokenSet

  var stack = [{
    node: root,
    editsRemaining: editDistance,
    str: str
  }]

  while (stack.length) {
    var frame = stack.pop()

    // no edit
    if (frame.str.length > 0) {
      var char = frame.str.charAt(0),
          noEditNode

      if (char in frame.node.edges) {
        noEditNode = frame.node.edges[char]
      } else {
        noEditNode = new lunr.TokenSet
        frame.node.edges[char] = noEditNode
      }

      if (frame.str.length == 1) {
        noEditNode.final = true
      } else {
        stack.push({
          node: noEditNode,
          editsRemaining: frame.editsRemaining,
          str: frame.str.slice(1)
        })
      }
    }

    // deletion
    // can only do a deletion if we have enough edits remaining
    // and if there are characters left to delete in the string
    if (frame.editsRemaining > 0 && frame.str.length > 1) {
      var char = frame.str.charAt(1),
          deletionNode

      if (char in frame.node.edges) {
        deletionNode = frame.node.edges[char]
      } else {
        deletionNode = new lunr.TokenSet
        frame.node.edges[char] = deletionNode
      }

      if (frame.str.length <= 2) {
        deletionNode.final = true
      } else {
        stack.push({
          node: deletionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(2)
        })
      }
    }

    // deletion
    // just removing the last character from the str
    if (frame.editsRemaining > 0 && frame.str.length == 1) {
      frame.node.final = true
    }

    // substitution
    // can only do a substitution if we have enough edits remaining
    // and if there are characters left to substitute
    if (frame.editsRemaining > 0 && frame.str.length >= 1) {
      if ("*" in frame.node.edges) {
        var substitutionNode = frame.node.edges["*"]
      } else {
        var substitutionNode = new lunr.TokenSet
        frame.node.edges["*"] = substitutionNode
      }

      if (frame.str.length == 1) {
        substitutionNode.final = true
      } else {
        stack.push({
          node: substitutionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str.slice(1)
        })
      }
    }

    // insertion
    // can only do insertion if there are edits remaining
    if (frame.editsRemaining > 0) {
      if ("*" in frame.node.edges) {
        var insertionNode = frame.node.edges["*"]
      } else {
        var insertionNode = new lunr.TokenSet
        frame.node.edges["*"] = insertionNode
      }

      if (frame.str.length == 0) {
        insertionNode.final = true
      } else {
        stack.push({
          node: insertionNode,
          editsRemaining: frame.editsRemaining - 1,
          str: frame.str
        })
      }
    }

    // transposition
    // can only do a transposition if there are edits remaining
    // and there are enough characters to transpose
    if (frame.editsRemaining > 0 && frame.str.length > 1) {
      var charA = frame.str.charAt(0),
          charB = frame.str.charAt(1),
          transposeNode

      if (charB in frame.node.edges) {
        transposeNode = frame.node.edges[charB]
      } else {
        transposeNode = new lunr.TokenSet
        frame.node.edges[charB] = transposeNode
      }

      if (frame.str.length == 1) {
        transposeNode.final = true
      } else {
        stack.push({
          node: transposeNode,
          editsRemaining: frame.editsRemaining - 1,
          str: charA + frame.str.slice(2)
        })
      }
    }
  }

  return root
}

/**
 * Creates a TokenSet from a string.
 *
 * The string may contain one or more wildcard characters (*)
 * that will allow wildcard matching when intersecting with
 * another TokenSet.
 *
 * @param {string} str - The string to create a TokenSet from.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromString = function (str) {
  var node = new lunr.TokenSet,
      root = node,
      wildcardFound = false

  /*
   * Iterates through all characters within the passed string
   * appending a node for each character.
   *
   * As soon as a wildcard character is found then a self
   * referencing edge is introduced to continually match
   * any number of any characters.
   */
  for (var i = 0, len = str.length; i < len; i++) {
    var char = str[i],
        final = (i == len - 1)

    if (char == "*") {
      wildcardFound = true
      node.edges[char] = node
      node.final = final

    } else {
      var next = new lunr.TokenSet
      next.final = final

      node.edges[char] = next
      node = next

      // TODO: is this needed anymore?
      if (wildcardFound) {
        node.edges["*"] = root
      }
    }
  }

  return root
}

/**
 * Converts this TokenSet into an array of strings
 * contained within the TokenSet.
 *
 * @returns {string[]}
 */
lunr.TokenSet.prototype.toArray = function () {
  var words = []

  var stack = [{
    prefix: "",
    node: this
  }]

  while (stack.length) {
    var frame = stack.pop(),
        edges = Object.keys(frame.node.edges),
        len = edges.length

    if (frame.node.final) {
      /* In Safari, at this point the prefix is sometimes corrupted, see:
       * https://github.com/olivernn/lunr.js/issues/279 Calling any
       * String.prototype method forces Safari to "cast" this string to what
       * it's supposed to be, fixing the bug. */
      frame.prefix.charAt(0)
      words.push(frame.prefix)
    }

    for (var i = 0; i < len; i++) {
      var edge = edges[i]

      stack.push({
        prefix: frame.prefix.concat(edge),
        node: frame.node.edges[edge]
      })
    }
  }

  return words
}

/**
 * Generates a string representation of a TokenSet.
 *
 * This is intended to allow TokenSets to be used as keys
 * in objects, largely to aid the construction and minimisation
 * of a TokenSet. As such it is not designed to be a human
 * friendly representation of the TokenSet.
 *
 * @returns {string}
 */
lunr.TokenSet.prototype.toString = function () {
  // NOTE: Using Object.keys here as this.edges is very likely
  // to enter 'hash-mode' with many keys being added
  //
  // avoiding a for-in loop here as it leads to the function
  // being de-optimised (at least in V8). From some simple
  // benchmarks the performance is comparable, but allowing
  // V8 to optimize may mean easy performance wins in the future.

  if (this._str) {
    return this._str
  }

  var str = this.final ? '1' : '0',
      labels = Object.keys(this.edges).sort(),
      len = labels.length

  for (var i = 0; i < len; i++) {
    var label = labels[i],
        node = this.edges[label]

    str = str + label + node.id
  }

  return str
}

/**
 * Returns a new TokenSet that is the intersection of
 * this TokenSet and the passed TokenSet.
 *
 * This intersection will take into account any wildcards
 * contained within the TokenSet.
 *
 * @param {lunr.TokenSet} b - An other TokenSet to intersect with.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.prototype.intersect = function (b) {
  var output = new lunr.TokenSet,
      frame = undefined

  var stack = [{
    qNode: b,
    output: output,
    node: this
  }]

  while (stack.length) {
    frame = stack.pop()

    // NOTE: As with the #toString method, we are using
    // Object.keys and a for loop instead of a for-in loop
    // as both of these objects enter 'hash' mode, causing
    // the function to be de-optimised in V8
    var qEdges = Object.keys(frame.qNode.edges),
        qLen = qEdges.length,
        nEdges = Object.keys(frame.node.edges),
        nLen = nEdges.length

    for (var q = 0; q < qLen; q++) {
      var qEdge = qEdges[q]

      for (var n = 0; n < nLen; n++) {
        var nEdge = nEdges[n]

        if (nEdge == qEdge || qEdge == '*') {
          var node = frame.node.edges[nEdge],
              qNode = frame.qNode.edges[qEdge],
              final = node.final && qNode.final,
              next = undefined

          if (nEdge in frame.output.edges) {
            // an edge already exists for this character
            // no need to create a new node, just set the finality
            // bit unless this node is already final
            next = frame.output.edges[nEdge]
            next.final = next.final || final

          } else {
            // no edge exists yet, must create one
            // set the finality bit and insert it
            // into the output
            next = new lunr.TokenSet
            next.final = final
            frame.output.edges[nEdge] = next
          }

          stack.push({
            qNode: qNode,
            output: next,
            node: node
          })
        }
      }
    }
  }

  return output
}
lunr.TokenSet.Builder = function () {
  this.previousWord = ""
  this.root = new lunr.TokenSet
  this.uncheckedNodes = []
  this.minimizedNodes = {}
}

lunr.TokenSet.Builder.prototype.insert = function (word) {
  var node,
      commonPrefix = 0

  if (word < this.previousWord) {
    throw new Error ("Out of order word insertion")
  }

  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
    if (word[i] != this.previousWord[i]) break
    commonPrefix++
  }

  this.minimize(commonPrefix)

  if (this.uncheckedNodes.length == 0) {
    node = this.root
  } else {
    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child
  }

  for (var i = commonPrefix; i < word.length; i++) {
    var nextNode = new lunr.TokenSet,
        char = word[i]

    node.edges[char] = nextNode

    this.uncheckedNodes.push({
      parent: node,
      char: char,
      child: nextNode
    })

    node = nextNode
  }

  node.final = true
  this.previousWord = word
}

lunr.TokenSet.Builder.prototype.finish = function () {
  this.minimize(0)
}

lunr.TokenSet.Builder.prototype.minimize = function (downTo) {
  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
    var node = this.uncheckedNodes[i],
        childKey = node.child.toString()

    if (childKey in this.minimizedNodes) {
      node.parent.edges[node.char] = this.minimizedNodes[childKey]
    } else {
      // Cache the key for this node since
      // we know it can't change anymore
      node.child._str = childKey

      this.minimizedNodes[childKey] = node.child
    }

    this.uncheckedNodes.pop()
  }
}
/*!
 * lunr.Index
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * An index contains the built index of all documents and provides a query interface
 * to the index.
 *
 * Usually instances of lunr.Index will not be created using this constructor, instead
 * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be
 * used to load previously built and serialized indexes.
 *
 * @constructor
 * @param {Object} attrs - The attributes of the built search index.
 * @param {Object} attrs.invertedIndex - An index of term/field to document reference.
 * @param {Object<string, lunr.Vector>} attrs.fieldVectors - Field vectors
 * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.
 * @param {string[]} attrs.fields - The names of indexed document fields.
 * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.
 */
lunr.Index = function (attrs) {
  this.invertedIndex = attrs.invertedIndex
  this.fieldVectors = attrs.fieldVectors
  this.tokenSet = attrs.tokenSet
  this.fields = attrs.fields
  this.pipeline = attrs.pipeline
}

/**
 * A result contains details of a document matching a search query.
 * @typedef {Object} lunr.Index~Result
 * @property {string} ref - The reference of the document this result represents.
 * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.
 * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.
 */

/**
 * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple
 * query language which itself is parsed into an instance of lunr.Query.
 *
 * For programmatically building queries it is advised to directly use lunr.Query, the query language
 * is best used for human entered text rather than program generated text.
 *
 * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported
 * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'
 * or 'world', though those that contain both will rank higher in the results.
 *
 * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can
 * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding
 * wildcards will increase the number of documents that will be found but can also have a negative
 * impact on query performance, especially with wildcards at the beginning of a term.
 *
 * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term
 * hello in the title field will match this query. Using a field not present in the index will lead
 * to an error being thrown.
 *
 * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term
 * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported
 * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.
 * Avoid large values for edit distance to improve query performance.
 *
 * Each term also supports a presence modifier. By default a term's presence in document is optional, however
 * this can be changed to either required or prohibited. For a term's presence to be required in a document the
 * term should be prefixed with a '+', e.g. `+foo bar` is a search for documents that must contain 'foo' and
 * optionally contain 'bar'. Conversely a leading '-' sets the terms presence to prohibited, i.e. it must not
 * appear in a document, e.g. `-foo bar` is a search for documents that do not contain 'foo' but may contain 'bar'.
 *
 * To escape special characters the backslash character '\' can be used, this allows searches to include
 * characters that would normally be considered modifiers, e.g. `foo\~2` will search for a term "foo~2" instead
 * of attempting to apply a boost of 2 to the search term "foo".
 *
 * @typedef {string} lunr.Index~QueryString
 * @example <caption>Simple single term query</caption>
 * hello
 * @example <caption>Multiple term query</caption>
 * hello world
 * @example <caption>term scoped to a field</caption>
 * title:hello
 * @example <caption>term with a boost of 10</caption>
 * hello^10
 * @example <caption>term with an edit distance of 2</caption>
 * hello~2
 * @example <caption>terms with presence modifiers</caption>
 * -foo +bar baz
 */

/**
 * Performs a search against the index using lunr query syntax.
 *
 * Results will be returned sorted by their score, the most relevant results
 * will be returned first.  For details on how the score is calculated, please see
 * the {@link https://lunrjs.com/guides/searching.html#scoring|guide}.
 *
 * For more programmatic querying use lunr.Index#query.
 *
 * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.
 * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.search = function (queryString) {
  return this.query(function (query) {
    var parser = new lunr.QueryParser(queryString, query)
    parser.parse()
  })
}

/**
 * A query builder callback provides a query object to be used to express
 * the query to perform on the index.
 *
 * @callback lunr.Index~queryBuilder
 * @param {lunr.Query} query - The query object to build up.
 * @this lunr.Query
 */

/**
 * Performs a query against the index using the yielded lunr.Query object.
 *
 * If performing programmatic queries against the index, this method is preferred
 * over lunr.Index#search so as to avoid the additional query parsing overhead.
 *
 * A query object is yielded to the supplied function which should be used to
 * express the query to be run against the index.
 *
 * Note that although this function takes a callback parameter it is _not_ an
 * asynchronous operation, the callback is just yielded a query object to be
 * customized.
 *
 * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.query = function (fn) {
  // for each query clause
  // * process terms
  // * expand terms from token set
  // * find matching documents and metadata
  // * get document vectors
  // * score documents

  var query = new lunr.Query(this.fields),
      matchingFields = Object.create(null),
      queryVectors = Object.create(null),
      termFieldCache = Object.create(null),
      requiredMatches = Object.create(null),
      prohibitedMatches = Object.create(null)

  /*
   * To support field level boosts a query vector is created per
   * field. An empty vector is eagerly created to support negated
   * queries.
   */
  for (var i = 0; i < this.fields.length; i++) {
    queryVectors[this.fields[i]] = new lunr.Vector
  }

  fn.call(query, query)

  for (var i = 0; i < query.clauses.length; i++) {
    /*
     * Unless the pipeline has been disabled for this term, which is
     * the case for terms with wildcards, we need to pass the clause
     * term through the search pipeline. A pipeline returns an array
     * of processed terms. Pipeline functions may expand the passed
     * term, which means we may end up performing multiple index lookups
     * for a single query term.
     */
    var clause = query.clauses[i],
        terms = null,
        clauseMatches = lunr.Set.complete

    if (clause.usePipeline) {
      terms = this.pipeline.runString(clause.term, {
        fields: clause.fields
      })
    } else {
      terms = [clause.term]
    }

    for (var m = 0; m < terms.length; m++) {
      var term = terms[m]

      /*
       * Each term returned from the pipeline needs to use the same query
       * clause object, e.g. the same boost and or edit distance. The
       * simplest way to do this is to re-use the clause object but mutate
       * its term property.
       */
      clause.term = term

      /*
       * From the term in the clause we create a token set which will then
       * be used to intersect the indexes token set to get a list of terms
       * to lookup in the inverted index
       */
      var termTokenSet = lunr.TokenSet.fromClause(clause),
          expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()

      /*
       * If a term marked as required does not exist in the tokenSet it is
       * impossible for the search to return any matches. We set all the field
       * scoped required matches set to empty and stop examining any further
       * clauses.
       */
      if (expandedTerms.length === 0 && clause.presence === lunr.Query.presence.REQUIRED) {
        for (var k = 0; k < clause.fields.length; k++) {
          var field = clause.fields[k]
          requiredMatches[field] = lunr.Set.empty
        }

        break
      }

      for (var j = 0; j < expandedTerms.length; j++) {
        /*
         * For each term get the posting and termIndex, this is required for
         * building the query vector.
         */
        var expandedTerm = expandedTerms[j],
            posting = this.invertedIndex[expandedTerm],
            termIndex = posting._index

        for (var k = 0; k < clause.fields.length; k++) {
          /*
           * For each field that this query term is scoped by (by default
           * all fields are in scope) we need to get all the document refs
           * that have this term in that field.
           *
           * The posting is the entry in the invertedIndex for the matching
           * term from above.
           */
          var field = clause.fields[k],
              fieldPosting = posting[field],
              matchingDocumentRefs = Object.keys(fieldPosting),
              termField = expandedTerm + "/" + field,
              matchingDocumentsSet = new lunr.Set(matchingDocumentRefs)

          /*
           * if the presence of this term is required ensure that the matching
           * documents are added to the set of required matches for this clause.
           *
           */
          if (clause.presence == lunr.Query.presence.REQUIRED) {
            clauseMatches = clauseMatches.union(matchingDocumentsSet)

            if (requiredMatches[field] === undefined) {
              requiredMatches[field] = lunr.Set.complete
            }
          }

          /*
           * if the presence of this term is prohibited ensure that the matching
           * documents are added to the set of prohibited matches for this field,
           * creating that set if it does not yet exist.
           */
          if (clause.presence == lunr.Query.presence.PROHIBITED) {
            if (prohibitedMatches[field] === undefined) {
              prohibitedMatches[field] = lunr.Set.empty
            }

            prohibitedMatches[field] = prohibitedMatches[field].union(matchingDocumentsSet)

            /*
             * Prohibited matches should not be part of the query vector used for
             * similarity scoring and no metadata should be extracted so we continue
             * to the next field
             */
            continue
          }

          /*
           * The query field vector is populated using the termIndex found for
           * the term and a unit value with the appropriate boost applied.
           * Using upsert because there could already be an entry in the vector
           * for the term we are working with. In that case we just add the scores
           * together.
           */
          queryVectors[field].upsert(termIndex, clause.boost, function (a, b) { return a + b })

          /**
           * If we've already seen this term, field combo then we've already collected
           * the matching documents and metadata, no need to go through all that again
           */
          if (termFieldCache[termField]) {
            continue
          }

          for (var l = 0; l < matchingDocumentRefs.length; l++) {
            /*
             * All metadata for this term/field/document triple
             * are then extracted and collected into an instance
             * of lunr.MatchData ready to be returned in the query
             * results
             */
            var matchingDocumentRef = matchingDocumentRefs[l],
                matchingFieldRef = new lunr.FieldRef (matchingDocumentRef, field),
                metadata = fieldPosting[matchingDocumentRef],
                fieldMatch

            if ((fieldMatch = matchingFields[matchingFieldRef]) === undefined) {
              matchingFields[matchingFieldRef] = new lunr.MatchData (expandedTerm, field, metadata)
            } else {
              fieldMatch.add(expandedTerm, field, metadata)
            }

          }

          termFieldCache[termField] = true
        }
      }
    }

    /**
     * If the presence was required we need to update the requiredMatches field sets.
     * We do this after all fields for the term have collected their matches because
     * the clause terms presence is required in _any_ of the fields not _all_ of the
     * fields.
     */
    if (clause.presence === lunr.Query.presence.REQUIRED) {
      for (var k = 0; k < clause.fields.length; k++) {
        var field = clause.fields[k]
        requiredMatches[field] = requiredMatches[field].intersect(clauseMatches)
      }
    }
  }

  /**
   * Need to combine the field scoped required and prohibited
   * matching documents into a global set of required and prohibited
   * matches
   */
  var allRequiredMatches = lunr.Set.complete,
      allProhibitedMatches = lunr.Set.empty

  for (var i = 0; i < this.fields.length; i++) {
    var field = this.fields[i]

    if (requiredMatches[field]) {
      allRequiredMatches = allRequiredMatches.intersect(requiredMatches[field])
    }

    if (prohibitedMatches[field]) {
      allProhibitedMatches = allProhibitedMatches.union(prohibitedMatches[field])
    }
  }

  var matchingFieldRefs = Object.keys(matchingFields),
      results = [],
      matches = Object.create(null)

  /*
   * If the query is negated (contains only prohibited terms)
   * we need to get _all_ fieldRefs currently existing in the
   * index. This is only done when we know that the query is
   * entirely prohibited terms to avoid any cost of getting all
   * fieldRefs unnecessarily.
   *
   * Additionally, blank MatchData must be created to correctly
   * populate the results.
   */
  if (query.isNegated()) {
    matchingFieldRefs = Object.keys(this.fieldVectors)

    for (var i = 0; i < matchingFieldRefs.length; i++) {
      var matchingFieldRef = matchingFieldRefs[i]
      var fieldRef = lunr.FieldRef.fromString(matchingFieldRef)
      matchingFields[matchingFieldRef] = new lunr.MatchData
    }
  }

  for (var i = 0; i < matchingFieldRefs.length; i++) {
    /*
     * Currently we have document fields that match the query, but we
     * need to return documents. The matchData and scores are combined
     * from multiple fields belonging to the same document.
     *
     * Scores are calculated by field, using the query vectors created
     * above, and combined into a final document score using addition.
     */
    var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]),
        docRef = fieldRef.docRef

    if (!allRequiredMatches.contains(docRef)) {
      continue
    }

    if (allProhibitedMatches.contains(docRef)) {
      continue
    }

    var fieldVector = this.fieldVectors[fieldRef],
        score = queryVectors[fieldRef.fieldName].similarity(fieldVector),
        docMatch

    if ((docMatch = matches[docRef]) !== undefined) {
      docMatch.score += score
      docMatch.matchData.combine(matchingFields[fieldRef])
    } else {
      var match = {
        ref: docRef,
        score: score,
        matchData: matchingFields[fieldRef]
      }
      matches[docRef] = match
      results.push(match)
    }
  }

  /*
   * Sort the results objects by score, highest first.
   */
  return results.sort(function (a, b) {
    return b.score - a.score
  })
}

/**
 * Prepares the index for JSON serialization.
 *
 * The schema for this JSON blob will be described in a
 * separate JSON schema file.
 *
 * @returns {Object}
 */
lunr.Index.prototype.toJSON = function () {
  var invertedIndex = Object.keys(this.invertedIndex)
    .sort()
    .map(function (term) {
      return [term, this.invertedIndex[term]]
    }, this)

  var fieldVectors = Object.keys(this.fieldVectors)
    .map(function (ref) {
      return [ref, this.fieldVectors[ref].toJSON()]
    }, this)

  return {
    version: lunr.version,
    fields: this.fields,
    fieldVectors: fieldVectors,
    invertedIndex: invertedIndex,
    pipeline: this.pipeline.toJSON()
  }
}

/**
 * Loads a previously serialized lunr.Index
 *
 * @param {Object} serializedIndex - A previously serialized lunr.Index
 * @returns {lunr.Index}
 */
lunr.Index.load = function (serializedIndex) {
  var attrs = {},
      fieldVectors = {},
      serializedVectors = serializedIndex.fieldVectors,
      invertedIndex = {},
      serializedInvertedIndex = serializedIndex.invertedIndex,
      tokenSetBuilder = new lunr.TokenSet.Builder,
      pipeline = lunr.Pipeline.load(serializedIndex.pipeline)

  if (serializedIndex.version != lunr.version) {
    lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '" + lunr.version + "' does not match serialized index '" + serializedIndex.version + "'")
  }

  for (var i = 0; i < serializedVectors.length; i++) {
    var tuple = serializedVectors[i],
        ref = tuple[0],
        elements = tuple[1]

    fieldVectors[ref] = new lunr.Vector(elements)
  }

  for (var i = 0; i < serializedInvertedIndex.length; i++) {
    var tuple = serializedInvertedIndex[i],
        term = tuple[0],
        posting = tuple[1]

    tokenSetBuilder.insert(term)
    invertedIndex[term] = posting
  }

  tokenSetBuilder.finish()

  attrs.fields = serializedIndex.fields

  attrs.fieldVectors = fieldVectors
  attrs.invertedIndex = invertedIndex
  attrs.tokenSet = tokenSetBuilder.root
  attrs.pipeline = pipeline

  return new lunr.Index(attrs)
}
/*!
 * lunr.Builder
 * Copyright (C) 2018 Oliver Nightingale
 */

/**
 * lunr.Builder performs indexing on a set of documents and
 * returns instances of lunr.Index ready for querying.
 *
 * All configuration of the index is done via the builder, the
 * fields to index, the document reference, the text processing
 * pipeline and document scoring parameters are all set on the
 * builder before indexing.
 *
 * @constructor
 * @property {string} _ref - Internal reference to the document reference field.
 * @property {string[]} _fields - Internal reference to the document fields to index.
 * @property {object} invertedIndex - The inverted index maps terms to document fields.
 * @property {object} documentTermFrequencies - Keeps track of document term frequencies.
 * @property {object} documentLengths - Keeps track of the length of documents added to the index.
 * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.
 * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.
 * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.
 * @property {number} documentCount - Keeps track of the total number of documents indexed.
 * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.
 * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.
 * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.
 * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.
 */
lunr.Builder = function () {
  this._ref = "id"
  this._fields = Object.create(null)
  this._documents = Object.create(null)
  this.invertedIndex = Object.create(null)
  this.fieldTermFrequencies = {}
  this.fieldLengths = {}
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
  this.searchPipeline = new lunr.Pipeline
  this.documentCount = 0
  this._b = 0.75
  this._k1 = 1.2
  this.termIndex = 0
  this.metadataWhitelist = []
}

/**
 * Sets the document field used as the document reference. Every document must have this field.
 * The type of this field in the document should be a string, if it is not a string it will be
 * coerced into a string by calling toString.
 *
 * The default ref is 'id'.
 *
 * The ref should _not_ be changed during indexing, it should be set before any documents are
 * added to the index. Changing it during indexing can lead to inconsistent results.
 *
 * @param {string} ref - The name of the reference field in the document.
 */
lunr.Builder.prototype.ref = function (ref) {
  this._ref = ref
}

/**
 * A function that is used to extract a field from a document.
 *
 * Lunr expects a field to be at the top level of a document, if however the field
 * is deeply nested within a document an extractor function can be used to extract
 * the right field for indexing.
 *
 * @callback fieldExtractor
 * @param {object} doc - The document being added to the index.
 * @returns {?(string|object|object[])} obj - The object that will be indexed for this field.
 * @example <caption>Extracting a nested field</caption>
 * function (doc) { return doc.nested.field }
 */

/**
 * Adds a field to the list of document fields that will be indexed. Every document being
 * indexed should have this field. Null values for this field in indexed documents will
 * not cause errors but will limit the chance of that document being retrieved by searches.
 *
 * All fields should be added before adding documents to the index. Adding fields after
 * a document has been indexed will have no effect on already indexed documents.
 *
 * Fields can be boosted at build time. This allows terms within that field to have more
 * importance when ranking search results. Use a field boost to specify that matches within
 * one field are more important than other fields.
 *
 * @param {string} fieldName - The name of a field to index in all documents.
 * @param {object} attributes - Optional attributes associated with this field.
 * @param {number} [attributes.boost=1] - Boost applied to all terms within this field.
 * @param {fieldExtractor} [attributes.extractor] - Function to extract a field from a document.
 * @throws {RangeError} fieldName cannot contain unsupported characters '/'
 */
lunr.Builder.prototype.field = function (fieldName, attributes) {
  if (/\//.test(fieldName)) {
    throw new RangeError ("Field '" + fieldName + "' contains illegal character '/'")
  }

  this._fields[fieldName] = attributes || {}
}

/**
 * A parameter to tune the amount of field length normalisation that is applied when
 * calculating relevance scores. A value of 0 will completely disable any normalisation
 * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b
 * will be clamped to the range 0 - 1.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.b = function (number) {
  if (number < 0) {
    this._b = 0
  } else if (number > 1) {
    this._b = 1
  } else {
    this._b = number
  }
}

/**
 * A parameter that controls the speed at which a rise in term frequency results in term
 * frequency saturation. The default value is 1.2. Setting this to a higher value will give
 * slower saturation levels, a lower value will result in quicker saturation.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.k1 = function (number) {
  this._k1 = number
}

/**
 * Adds a document to the index.
 *
 * Before adding fields to the index the index should have been fully setup, with the document
 * ref and all fields to index already having been specified.
 *
 * The document must have a field name as specified by the ref (by default this is 'id') and
 * it should have all fields defined for indexing, though null or undefined values will not
 * cause errors.
 *
 * Entire documents can be boosted at build time. Applying a boost to a document indicates that
 * this document should rank higher in search results than other documents.
 *
 * @param {object} doc - The document to add to the index.
 * @param {object} attributes - Optional attributes associated with this document.
 * @param {number} [attributes.boost=1] - Boost applied to all terms within this document.
 */
lunr.Builder.prototype.add = function (doc, attributes) {
  var docRef = doc[this._ref],
      fields = Object.keys(this._fields)

  this._documents[docRef] = attributes || {}
  this.documentCount += 1

  for (var i = 0; i < fields.length; i++) {
    var fieldName = fields[i],
        extractor = this._fields[fieldName].extractor,
        field = extractor ? extractor(doc) : doc[fieldName],
        tokens = this.tokenizer(field, {
          fields: [fieldName]
        }),
        terms = this.pipeline.run(tokens),
        fieldRef = new lunr.FieldRef (docRef, fieldName),
        fieldTerms = Object.create(null)

    this.fieldTermFrequencies[fieldRef] = fieldTerms
    this.fieldLengths[fieldRef] = 0

    // store the length of this field for this document
    this.fieldLengths[fieldRef] += terms.length

    // calculate term frequencies for this field
    for (var j = 0; j < terms.length; j++) {
      var term = terms[j]

      if (fieldTerms[term] == undefined) {
        fieldTerms[term] = 0
      }

      fieldTerms[term] += 1

      // add to inverted index
      // create an initial posting if one doesn't exist
      if (this.invertedIndex[term] == undefined) {
        var posting = Object.create(null)
        posting["_index"] = this.termIndex
        this.termIndex += 1

        for (var k = 0; k < fields.length; k++) {
          posting[fields[k]] = Object.create(null)
        }

        this.invertedIndex[term] = posting
      }

      // add an entry for this term/fieldName/docRef to the invertedIndex
      if (this.invertedIndex[term][fieldName][docRef] == undefined) {
        this.invertedIndex[term][fieldName][docRef] = Object.create(null)
      }

      // store all whitelisted metadata about this token in the
      // inverted index
      for (var l = 0; l < this.metadataWhitelist.length; l++) {
        var metadataKey = this.metadataWhitelist[l],
            metadata = term.metadata[metadataKey]

        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {
          this.invertedIndex[term][fieldName][docRef][metadataKey] = []
        }

        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)
      }
    }

  }
}

/**
 * Calculates the average document length for this index
 *
 * @private
 */
lunr.Builder.prototype.calculateAverageFieldLengths = function () {

  var fieldRefs = Object.keys(this.fieldLengths),
      numberOfFields = fieldRefs.length,
      accumulator = {},
      documentsWithField = {}

  for (var i = 0; i < numberOfFields; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        field = fieldRef.fieldName

    documentsWithField[field] || (documentsWithField[field] = 0)
    documentsWithField[field] += 1

    accumulator[field] || (accumulator[field] = 0)
    accumulator[field] += this.fieldLengths[fieldRef]
  }

  var fields = Object.keys(this._fields)

  for (var i = 0; i < fields.length; i++) {
    var fieldName = fields[i]
    accumulator[fieldName] = accumulator[fieldName] / documentsWithField[fieldName]
  }

  this.averageFieldLength = accumulator
}

/**
 * Builds a vector space model of every document using lunr.Vector
 *
 * @private
 */
lunr.Builder.prototype.createFieldVectors = function () {
  var fieldVectors = {},
      fieldRefs = Object.keys(this.fieldTermFrequencies),
      fieldRefsLength = fieldRefs.length,
      termIdfCache = Object.create(null)

  for (var i = 0; i < fieldRefsLength; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        fieldName = fieldRef.fieldName,
        fieldLength = this.fieldLengths[fieldRef],
        fieldVector = new lunr.Vector,
        termFrequencies = this.fieldTermFrequencies[fieldRef],
        terms = Object.keys(termFrequencies),
        termsLength = terms.length


    var fieldBoost = this._fields[fieldName].boost || 1,
        docBoost = this._documents[fieldRef.docRef].boost || 1

    for (var j = 0; j < termsLength; j++) {
      var term = terms[j],
          tf = termFrequencies[term],
          termIndex = this.invertedIndex[term]._index,
          idf, score, scoreWithPrecision

      if (termIdfCache[term] === undefined) {
        idf = lunr.idf(this.invertedIndex[term], this.documentCount)
        termIdfCache[term] = idf
      } else {
        idf = termIdfCache[term]
      }

      score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[fieldName])) + tf)
      score *= fieldBoost
      score *= docBoost
      scoreWithPrecision = Math.round(score * 1000) / 1000
      // Converts 1.23456789 to 1.234.
      // Reducing the precision so that the vectors take up less
      // space when serialised. Doing it now so that they behave
      // the same before and after serialisation. Also, this is
      // the fastest approach to reducing a number's precision in
      // JavaScript.

      fieldVector.insert(termIndex, scoreWithPrecision)
    }

    fieldVectors[fieldRef] = fieldVector
  }

  this.fieldVectors = fieldVectors
}

/**
 * Creates a token set of all tokens in the index using lunr.TokenSet
 *
 * @private
 */
lunr.Builder.prototype.createTokenSet = function () {
  this.tokenSet = lunr.TokenSet.fromArray(
    Object.keys(this.invertedIndex).sort()
  )
}

/**
 * Builds the index, creating an instance of lunr.Index.
 *
 * This completes the indexing process and should only be called
 * once all documents have been added to the index.
 *
 * @returns {lunr.Index}
 */
lunr.Builder.prototype.build = function () {
  this.calculateAverageFieldLengths()
  this.createFieldVectors()
  this.createTokenSet()

  return new lunr.Index({
    invertedIndex: this.invertedIndex,
    fieldVectors: this.fieldVectors,
    tokenSet: this.tokenSet,
    fields: Object.keys(this._fields),
    pipeline: this.searchPipeline
  })
}

/**
 * Applies a plugin to the index builder.
 *
 * A plugin is a function that is called with the index builder as its context.
 * Plugins can be used to customise or extend the behaviour of the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied when building the index.
 *
 * The plugin function will be called with the index builder as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index builder as its context.
 *
 * @param {Function} plugin The plugin to apply.
 */
lunr.Builder.prototype.use = function (fn) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.unshift(this)
  fn.apply(this, args)
}
/**
 * Contains and collects metadata about a matching document.
 * A single instance of lunr.MatchData is returned as part of every
 * lunr.Index~Result.
 *
 * @constructor
 * @param {string} term - The term this match data is associated with
 * @param {string} field - The field in which the term was found
 * @param {object} metadata - The metadata recorded about this term in this field
 * @property {object} metadata - A cloned collection of metadata associated with this document.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData = function (term, field, metadata) {
  var clonedMetadata = Object.create(null),
      metadataKeys = Object.keys(metadata || {})

  // Cloning the metadata to prevent the original
  // being mutated during match data combination.
  // Metadata is kept in an array within the inverted
  // index so cloning the data can be done with
  // Array#slice
  for (var i = 0; i < metadataKeys.length; i++) {
    var key = metadataKeys[i]
    clonedMetadata[key] = metadata[key].slice()
  }

  this.metadata = Object.create(null)

  if (term !== undefined) {
    this.metadata[term] = Object.create(null)
    this.metadata[term][field] = clonedMetadata
  }
}

/**
 * An instance of lunr.MatchData will be created for every term that matches a
 * document. However only one instance is required in a lunr.Index~Result. This
 * method combines metadata from another instance of lunr.MatchData with this
 * objects metadata.
 *
 * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData.prototype.combine = function (otherMatchData) {
  var terms = Object.keys(otherMatchData.metadata)

  for (var i = 0; i < terms.length; i++) {
    var term = terms[i],
        fields = Object.keys(otherMatchData.metadata[term])

    if (this.metadata[term] == undefined) {
      this.metadata[term] = Object.create(null)
    }

    for (var j = 0; j < fields.length; j++) {
      var field = fields[j],
          keys = Object.keys(otherMatchData.metadata[term][field])

      if (this.metadata[term][field] == undefined) {
        this.metadata[term][field] = Object.create(null)
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k]

        if (this.metadata[term][field][key] == undefined) {
          this.metadata[term][field][key] = otherMatchData.metadata[term][field][key]
        } else {
          this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key])
        }

      }
    }
  }
}

/**
 * Add metadata for a term/field pair to this instance of match data.
 *
 * @param {string} term - The term this match data is associated with
 * @param {string} field - The field in which the term was found
 * @param {object} metadata - The metadata recorded about this term in this field
 */
lunr.MatchData.prototype.add = function (term, field, metadata) {
  if (!(term in this.metadata)) {
    this.metadata[term] = Object.create(null)
    this.metadata[term][field] = metadata
    return
  }

  if (!(field in this.metadata[term])) {
    this.metadata[term][field] = metadata
    return
  }

  var metadataKeys = Object.keys(metadata)

  for (var i = 0; i < metadataKeys.length; i++) {
    var key = metadataKeys[i]

    if (key in this.metadata[term][field]) {
      this.metadata[term][field][key] = this.metadata[term][field][key].concat(metadata[key])
    } else {
      this.metadata[term][field][key] = metadata[key]
    }
  }
}
/**
 * A lunr.Query provides a programmatic way of defining queries to be performed
 * against a {@link lunr.Index}.
 *
 * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method
 * so the query object is pre-initialized with the right index fields.
 *
 * @constructor
 * @property {lunr.Query~Clause[]} clauses - An array of query clauses.
 * @property {string[]} allFields - An array of all available fields in a lunr.Index.
 */
lunr.Query = function (allFields) {
  this.clauses = []
  this.allFields = allFields
}

/**
 * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.
 *
 * This allows wildcards to be added to the beginning and end of a term without having to manually do any string
 * concatenation.
 *
 * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.
 *
 * @constant
 * @default
 * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour
 * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists
 * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with trailing wildcard</caption>
 * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })
 * @example <caption>query term with leading and trailing wildcard</caption>
 * query.term('foo', {
 *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
 * })
 */

lunr.Query.wildcard = new String ("*")
lunr.Query.wildcard.NONE = 0
lunr.Query.wildcard.LEADING = 1
lunr.Query.wildcard.TRAILING = 2

/**
 * Constants for indicating what kind of presence a term must have in matching documents.
 *
 * @constant
 * @enum {number}
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with required presence</caption>
 * query.term('foo', { presence: lunr.Query.presence.REQUIRED })
 */
lunr.Query.presence = {
  /**
   * Term's presence in a document is optional, this is the default value.
   */
  OPTIONAL: 1,

  /**
   * Term's presence in a document is required, documents that do not contain
   * this term will not be returned.
   */
  REQUIRED: 2,

  /**
   * Term's presence in a document is prohibited, documents that do contain
   * this term will not be returned.
   */
  PROHIBITED: 3
}

/**
 * A single clause in a {@link lunr.Query} contains a term and details on how to
 * match that term against a {@link lunr.Index}.
 *
 * @typedef {Object} lunr.Query~Clause
 * @property {string[]} fields - The fields in an index this clause should be matched against.
 * @property {number} [boost=1] - Any boost that should be applied when matching this clause.
 * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.
 * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.
 * @property {number} [wildcard=lunr.Query.wildcard.NONE] - Whether the term should have wildcards appended or prepended.
 * @property {number} [presence=lunr.Query.presence.OPTIONAL] - The terms presence in any matching documents.
 */

/**
 * Adds a {@link lunr.Query~Clause} to this query.
 *
 * Unless the clause contains the fields to be matched all fields will be matched. In addition
 * a default boost of 1 is applied to the clause.
 *
 * @param {lunr.Query~Clause} clause - The clause to add to this query.
 * @see lunr.Query~Clause
 * @returns {lunr.Query}
 */
lunr.Query.prototype.clause = function (clause) {
  if (!('fields' in clause)) {
    clause.fields = this.allFields
  }

  if (!('boost' in clause)) {
    clause.boost = 1
  }

  if (!('usePipeline' in clause)) {
    clause.usePipeline = true
  }

  if (!('wildcard' in clause)) {
    clause.wildcard = lunr.Query.wildcard.NONE
  }

  if ((clause.wildcard & lunr.Query.wildcard.LEADING) && (clause.term.charAt(0) != lunr.Query.wildcard)) {
    clause.term = "*" + clause.term
  }

  if ((clause.wildcard & lunr.Query.wildcard.TRAILING) && (clause.term.slice(-1) != lunr.Query.wildcard)) {
    clause.term = "" + clause.term + "*"
  }

  if (!('presence' in clause)) {
    clause.presence = lunr.Query.presence.OPTIONAL
  }

  this.clauses.push(clause)

  return this
}

/**
 * A negated query is one in which every clause has a presence of
 * prohibited. These queries require some special processing to return
 * the expected results.
 *
 * @returns boolean
 */
lunr.Query.prototype.isNegated = function () {
  for (var i = 0; i < this.clauses.length; i++) {
    if (this.clauses[i].presence != lunr.Query.presence.PROHIBITED) {
      return false
    }
  }

  return true
}

/**
 * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}
 * to the list of clauses that make up this query.
 *
 * The term is used as is, i.e. no tokenization will be performed by this method. Instead conversion
 * to a token or token-like string should be done before calling this method.
 *
 * The term will be converted to a string by calling `toString`. Multiple terms can be passed as an
 * array, each term in the array will share the same options.
 *
 * @param {object|object[]} term - The term(s) to add to the query.
 * @param {object} [options] - Any additional properties to add to the query clause.
 * @returns {lunr.Query}
 * @see lunr.Query#clause
 * @see lunr.Query~Clause
 * @example <caption>adding a single term to a query</caption>
 * query.term("foo")
 * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>
 * query.term("foo", {
 *   fields: ["title"],
 *   boost: 10,
 *   wildcard: lunr.Query.wildcard.TRAILING
 * })
 * @example <caption>using lunr.tokenizer to convert a string to tokens before using them as terms</caption>
 * query.term(lunr.tokenizer("foo bar"))
 */
lunr.Query.prototype.term = function (term, options) {
  if (Array.isArray(term)) {
    term.forEach(function (t) { this.term(t, lunr.utils.clone(options)) }, this)
    return this
  }

  var clause = options || {}
  clause.term = term.toString()

  this.clause(clause)

  return this
}
lunr.QueryParseError = function (message, start, end) {
  this.name = "QueryParseError"
  this.message = message
  this.start = start
  this.end = end
}

lunr.QueryParseError.prototype = new Error
lunr.QueryLexer = function (str) {
  this.lexemes = []
  this.str = str
  this.length = str.length
  this.pos = 0
  this.start = 0
  this.escapeCharPositions = []
}

lunr.QueryLexer.prototype.run = function () {
  var state = lunr.QueryLexer.lexText

  while (state) {
    state = state(this)
  }
}

lunr.QueryLexer.prototype.sliceString = function () {
  var subSlices = [],
      sliceStart = this.start,
      sliceEnd = this.pos

  for (var i = 0; i < this.escapeCharPositions.length; i++) {
    sliceEnd = this.escapeCharPositions[i]
    subSlices.push(this.str.slice(sliceStart, sliceEnd))
    sliceStart = sliceEnd + 1
  }

  subSlices.push(this.str.slice(sliceStart, this.pos))
  this.escapeCharPositions.length = 0

  return subSlices.join('')
}

lunr.QueryLexer.prototype.emit = function (type) {
  this.lexemes.push({
    type: type,
    str: this.sliceString(),
    start: this.start,
    end: this.pos
  })

  this.start = this.pos
}

lunr.QueryLexer.prototype.escapeCharacter = function () {
  this.escapeCharPositions.push(this.pos - 1)
  this.pos += 1
}

lunr.QueryLexer.prototype.next = function () {
  if (this.pos >= this.length) {
    return lunr.QueryLexer.EOS
  }

  var char = this.str.charAt(this.pos)
  this.pos += 1
  return char
}

lunr.QueryLexer.prototype.width = function () {
  return this.pos - this.start
}

lunr.QueryLexer.prototype.ignore = function () {
  if (this.start == this.pos) {
    this.pos += 1
  }

  this.start = this.pos
}

lunr.QueryLexer.prototype.backup = function () {
  this.pos -= 1
}

lunr.QueryLexer.prototype.acceptDigitRun = function () {
  var char, charCode

  do {
    char = this.next()
    charCode = char.charCodeAt(0)
  } while (charCode > 47 && charCode < 58)

  if (char != lunr.QueryLexer.EOS) {
    this.backup()
  }
}

lunr.QueryLexer.prototype.more = function () {
  return this.pos < this.length
}

lunr.QueryLexer.EOS = 'EOS'
lunr.QueryLexer.FIELD = 'FIELD'
lunr.QueryLexer.TERM = 'TERM'
lunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE'
lunr.QueryLexer.BOOST = 'BOOST'
lunr.QueryLexer.PRESENCE = 'PRESENCE'

lunr.QueryLexer.lexField = function (lexer) {
  lexer.backup()
  lexer.emit(lunr.QueryLexer.FIELD)
  lexer.ignore()
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexTerm = function (lexer) {
  if (lexer.width() > 1) {
    lexer.backup()
    lexer.emit(lunr.QueryLexer.TERM)
  }

  lexer.ignore()

  if (lexer.more()) {
    return lunr.QueryLexer.lexText
  }
}

lunr.QueryLexer.lexEditDistance = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexBoost = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.BOOST)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexEOS = function (lexer) {
  if (lexer.width() > 0) {
    lexer.emit(lunr.QueryLexer.TERM)
  }
}

// This matches the separator used when tokenising fields
// within a document. These should match otherwise it is
// not possible to search for some tokens within a document.
//
// It is possible for the user to change the separator on the
// tokenizer so it _might_ clash with any other of the special
// characters already used within the search string, e.g. :.
//
// This means that it is possible to change the separator in
// such a way that makes some words unsearchable using a search
// string.
lunr.QueryLexer.termSeparator = lunr.tokenizer.separator

lunr.QueryLexer.lexText = function (lexer) {
  while (true) {
    var char = lexer.next()

    if (char == lunr.QueryLexer.EOS) {
      return lunr.QueryLexer.lexEOS
    }

    // Escape character is '\'
    if (char.charCodeAt(0) == 92) {
      lexer.escapeCharacter()
      continue
    }

    if (char == ":") {
      return lunr.QueryLexer.lexField
    }

    if (char == "~") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexEditDistance
    }

    if (char == "^") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexBoost
    }

    // "+" indicates term presence is required
    // checking for length to ensure that only
    // leading "+" are considered
    if (char == "+" && lexer.width() === 1) {
      lexer.emit(lunr.QueryLexer.PRESENCE)
      return lunr.QueryLexer.lexText
    }

    // "-" indicates term presence is prohibited
    // checking for length to ensure that only
    // leading "-" are considered
    if (char == "-" && lexer.width() === 1) {
      lexer.emit(lunr.QueryLexer.PRESENCE)
      return lunr.QueryLexer.lexText
    }

    if (char.match(lunr.QueryLexer.termSeparator)) {
      return lunr.QueryLexer.lexTerm
    }
  }
}

lunr.QueryParser = function (str, query) {
  this.lexer = new lunr.QueryLexer (str)
  this.query = query
  this.currentClause = {}
  this.lexemeIdx = 0
}

lunr.QueryParser.prototype.parse = function () {
  this.lexer.run()
  this.lexemes = this.lexer.lexemes

  var state = lunr.QueryParser.parseClause

  while (state) {
    state = state(this)
  }

  return this.query
}

lunr.QueryParser.prototype.peekLexeme = function () {
  return this.lexemes[this.lexemeIdx]
}

lunr.QueryParser.prototype.consumeLexeme = function () {
  var lexeme = this.peekLexeme()
  this.lexemeIdx += 1
  return lexeme
}

lunr.QueryParser.prototype.nextClause = function () {
  var completedClause = this.currentClause
  this.query.clause(completedClause)
  this.currentClause = {}
}

lunr.QueryParser.parseClause = function (parser) {
  var lexeme = parser.peekLexeme()

  if (lexeme == undefined) {
    return
  }

  switch (lexeme.type) {
    case lunr.QueryLexer.PRESENCE:
      return lunr.QueryParser.parsePresence
    case lunr.QueryLexer.FIELD:
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expected either a field or a term, found " + lexeme.type

      if (lexeme.str.length >= 1) {
        errorMessage += " with value '" + lexeme.str + "'"
      }

      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }
}

lunr.QueryParser.parsePresence = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  switch (lexeme.str) {
    case "-":
      parser.currentClause.presence = lunr.Query.presence.PROHIBITED
      break
    case "+":
      parser.currentClause.presence = lunr.Query.presence.REQUIRED
      break
    default:
      var errorMessage = "unrecognised presence operator'" + lexeme.str + "'"
      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    var errorMessage = "expecting term or field, found nothing"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.FIELD:
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expecting term or field, found '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseField = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  if (parser.query.allFields.indexOf(lexeme.str) == -1) {
    var possibleFields = parser.query.allFields.map(function (f) { return "'" + f + "'" }).join(', '),
        errorMessage = "unrecognised field '" + lexeme.str + "', possible fields: " + possibleFields

    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.fields = [lexeme.str]

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    var errorMessage = "expecting term, found nothing"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expecting term, found '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseTerm = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  parser.currentClause.term = lexeme.str.toLowerCase()

  if (lexeme.str.indexOf("*") != -1) {
    parser.currentClause.usePipeline = false
  }

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    case lunr.QueryLexer.PRESENCE:
      parser.nextClause()
      return lunr.QueryParser.parsePresence
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseEditDistance = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var editDistance = parseInt(lexeme.str, 10)

  if (isNaN(editDistance)) {
    var errorMessage = "edit distance must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.editDistance = editDistance

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseBoost = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var boost = parseInt(lexeme.str, 10)

  if (isNaN(boost)) {
    var errorMessage = "boost must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.boost = boost

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.lunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return lunr
  }))
})();

},{}],24:[function(require,module,exports){
(function (global){
"use strict";

//Gunjan
if (global.rh === undefined) {
  global.rh = {};
}

module.exports = global.rh;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],25:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CountingSeamaphore = function () {
  function CountingSeamaphore(callback) {
    _classCallCheck(this, CountingSeamaphore);

    this._callback = callback;
    this._count = 0;
  }

  _createClass(CountingSeamaphore, [{
    key: "signal",
    value: function signal() {
      this._count++;
      if (this._count >= 0 && this._callback) {
        this._callback();
      }
    }
  }, {
    key: "wait",
    value: function wait(count) {
      var dec_count = count || 1;
      this._count -= dec_count;
    }
  }]);

  return CountingSeamaphore;
}();

module.exports = CountingSeamaphore;

},{}],26:[function(require,module,exports){
"use strict";

require("../lib/rh");
require("../../lenient_src/utils/shim");
require("../../lenient_src/robohelp/layout/url_utils");
require("../../lenient_src/robohelp/layout/init");
require("../../lenient_src/robohelp/layout/mp");
require("../../lenient_src/robohelp/layout/expression_builder");
require("../../lenient_src/robohelp/layout/browsesequence_builder");
require("../../lenient_src/robohelp/layout/event_handlers");
require("../../lenient_src/robohelp/layout/search_filed");
require("../../lenient_src/robohelp/layout/layoutfix");
require("../../lenient_src/robohelp/layout/filter_controller");
require("../../lenient_src/robohelp/layout/modern_layout_controller");
require("../../lenient_src/robohelp/layout/js_loading_controller");
require("../../lenient_src/robohelp/layout/index_controller");
require("../../lenient_src/robohelp/layout/glossary_controller");
require("../../lenient_src/robohelp/layout/filter_handler");
require("../../lenient_src/robohelp/layout/load_projects");
require("./layout/ui/carousel");
require("./layout/home_controller");
require("../../lenient_src/layout/search_util");
require("./layout/search/suggestion/search_controller");
require("./layout/favorites_controller");
require("./layout/toc_breadcrumbs_controller.js");
require("../../lenient_src/layout/toc_order");
require("../../lenient_src/layout/toc_controller");
require("../../lenient_src/layout/index_controller");
require("../../lenient_src/layout/glossary_controller");
require("../../lenient_src/layout/event_handlers");
require("./layout/rh2017layoutcontroller");
require("./layout/modal_dialog");
require("./layout/search_result_controller.js");
require("../../lenient_src/robohelp/layout/filter_handler");
require("./layout/custom_buttons");
require("./layout/expand_all");

},{"../../lenient_src/layout/event_handlers":1,"../../lenient_src/layout/glossary_controller":2,"../../lenient_src/layout/index_controller":3,"../../lenient_src/layout/search_util":4,"../../lenient_src/layout/toc_controller":5,"../../lenient_src/layout/toc_order":6,"../../lenient_src/robohelp/layout/browsesequence_builder":7,"../../lenient_src/robohelp/layout/event_handlers":8,"../../lenient_src/robohelp/layout/expression_builder":9,"../../lenient_src/robohelp/layout/filter_controller":10,"../../lenient_src/robohelp/layout/filter_handler":11,"../../lenient_src/robohelp/layout/glossary_controller":12,"../../lenient_src/robohelp/layout/index_controller":13,"../../lenient_src/robohelp/layout/init":14,"../../lenient_src/robohelp/layout/js_loading_controller":15,"../../lenient_src/robohelp/layout/layoutfix":16,"../../lenient_src/robohelp/layout/load_projects":17,"../../lenient_src/robohelp/layout/modern_layout_controller":18,"../../lenient_src/robohelp/layout/mp":19,"../../lenient_src/robohelp/layout/search_filed":20,"../../lenient_src/robohelp/layout/url_utils":21,"../../lenient_src/utils/shim":22,"../lib/rh":24,"./layout/custom_buttons":27,"./layout/expand_all":28,"./layout/favorites_controller":29,"./layout/home_controller":30,"./layout/modal_dialog":31,"./layout/rh2017layoutcontroller":32,"./layout/search/suggestion/search_controller":49,"./layout/search_result_controller.js":63,"./layout/toc_breadcrumbs_controller.js":64,"./layout/ui/carousel":65}],27:[function(require,module,exports){
'use strict';

var rh = require("../../lib/rh"),
    consts = rh.consts,
    model = rh.model,
    _ = rh._;

model.subscribe(consts('KEY_CUSTOM_BUTTONS_CONFIG'), function (config) {
  var buttons = _.map(config, function (item, index) {
    return _.extend({ class: 'custom-button-' + index }, item);
  });
  model.publish(consts('KEY_CUSTOM_BUTTONS'), buttons);
});

},{"../../lib/rh":24}],28:[function(require,module,exports){
'use strict';

var rh = require("../../lib/rh");

rh.model.csubscribe('EVT_EXPAND_COLLAPSE_ALL', function () {
  var currentState = rh.model.cget('ALL_ARE_EXPANDED');
  if (currentState) {
    rh.model.cpublish('EVT_COLLAPSE_ALL');
  } else {
    rh.model.cpublish('EVT_EXPAND_ALL');
  }
});

rh.model.csubscribe('EVT_COLLAPSE_ALL', function () {
  rh.model.cpublish('ALL_ARE_EXPANDED', false);
});

rh.model.csubscribe('EVT_EXPAND_ALL', function () {
  rh.model.cpublish('ALL_ARE_EXPANDED', true);
});

},{"../../lib/rh":24}],29:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var consts = rh.consts;

var FavoritesController = function () {
  function FavoritesController(widget) {
    var _this = this;

    _classCallCheck(this, FavoritesController);

    this.widget = widget;
    this.favStorage = new rh.Storage();
    /* Internal functions and variables */
    this._loadFromStorage = false; /* Favorites already loaded from storage? */

    this._favMemoryStore = undefined; /* Variable to hold favorites object */
    rh.model.subscribeOnce(consts('EVT_PROJECT_LOADED'), function () {
      _this.init();
    });
  }

  _createClass(FavoritesController, [{
    key: "_getUniqueId",
    value: function _getUniqueId() {
      function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
      }
      return _p8() + _p8(true) + _p8(true) + _p8();
    }
  }, {
    key: "numberOfItems",
    value: function numberOfItems(JSON) {
      /* Count the number of items in an object */
      return Object.keys(JSON).length;
    }
  }, {
    key: "_getFavHTMLElements",
    value: function _getFavHTMLElements(type) {
      /* Find all elements in the HTML that can hold a favorite widget */

      var allElements = document.getElementsByTagName("div"); /* Only divs can be favorite holders */
      var elements = [];

      for (var i = 0; i < allElements.length; i++) {
        if (allElements[i].getAttribute(rh.consts('FAVATTRIBUTE')) === type) {
          elements.push(allElements[i]);
        }
      }

      return elements;
    }
  }, {
    key: "getLinkTitle",
    value: function getLinkTitle(isFavorite) {
      var lng = rh.model.get(consts('KEY_LNG'));
      if (isFavorite) {
        return lng && lng.unsetAsFavorite || '';
      } else {
        return lng && lng.setAsFavorite || '';
      }
    }
  }, {
    key: "_loadFavoritesFromStorage",
    value: function _loadFavoritesFromStorage() {
      /* Load setting from storage */
      var storageObject = void 0;
      var loadString = this.favStorage.fetch(consts('FAVSTORAGE'));

      if (typeof loadString === "undefined" || loadString === null) {
        /* No settings yet, create new object. */
        storageObject = {};
      } else {
        storageObject = JSON.parse(loadString); /* Parse string to object */
      }
      return storageObject;
    }
  }, {
    key: "_loadFavorites",
    value: function _loadFavorites() {
      if (this._loadFromStorage === false) {
        /* Only load once, then use object in memory. Saves a few parsings. */
        this._favMemoryStore = this._loadFavoritesFromStorage();
      }
      return this._favMemoryStore;
    }
  }, {
    key: "_saveFavorites",
    value: function _saveFavorites() {
      var favoritesString = void 0;
      favoritesString = JSON.stringify(this._favMemoryStore);
      this.favStorage.persist(rh.consts('FAVSTORAGE'), favoritesString);
    }
  }, {
    key: "_unFavoriteTopic",
    value: function _unFavoriteTopic(topic) {
      for (var i in this._favMemoryStore) {
        var current = this._favMemoryStore[i];
        if (current.topic === topic) {
          delete this._favMemoryStore[i];
          break;
        }
      }
      this._saveFavorites();
      rh.model.publish(rh.consts('EVENTFAVCHANGE'), null); /* Publish so favorites subscribers are notified of changes */
    }
  }, {
    key: "_favoriteTopic",
    value: function _favoriteTopic(url, title) {
      //let id;
      this._favMemoryStore[this._getUniqueId()] = { "topic": url, "title": title };
      this._saveFavorites();
      rh.model.publish(rh.consts('EVENTFAVCHANGE'), null); /* Publish so favorites subscribers are notified of changes */
    }

    /* Public functions: for use in other scripts */

  }, {
    key: "getStorageId",
    value: function getStorageId() {
      return "fav-" + rh._.getHostFolder();
    }
  }, {
    key: "getTopicURL",
    value: function getTopicURL() {
      /* Get the URL of the current topic */
      return rh.model.get(rh.consts('KEY_TOPIC_URL'));
    }
  }, {
    key: "getTopicTitle",
    value: function getTopicTitle() {
      /* Get title of currently opened topic */
      return rh.model.get(rh.consts('KEY_TOPIC_TITLE'));
    }
  }, {
    key: "isTopicFavorite",
    value: function isTopicFavorite(topic) {
      /* Is the current topic a favorite topic? */
      var favorites = void 0;
      var isFavorite = void 0;
      if (!topic) {
        topic = this.getTopicURL();
      }
      favorites = this._loadFavorites();

      isFavorite = false;
      for (var i in favorites) {
        var current = favorites[i];
        if (current.topic === topic) {
          isFavorite = true;
          break;
        }
      }

      return isFavorite;
    }
  }, {
    key: "setfavoritesTitle",
    value: function setfavoritesTitle(isFavorite) {
      var title = this.getLinkTitle(isFavorite);
      rh.model.publish(consts('FAVORITES_BUTTON_TITLE'), title);
    }
  }, {
    key: "setTopicFavoriteState",
    value: function setTopicFavoriteState() {
      rh.model.publish(consts('TOPIC_FAVORITE'), this.isTopicFavorite());
    }
  }, {
    key: "setFavoritesList",
    value: function setFavoritesList() {
      /* Write the favorites list */
      //let favholders;
      var favorites = [];
      var id = void 0;
      var favorites_map = this._loadFavorites();
      for (id in favorites_map) {
        favorites.push(favorites_map[id]);
      }
      rh.model.publish(consts('KEY_FAVORITES'), favorites);
    }
  }, {
    key: "toggleFavorite",
    value: function toggleFavorite(topicURL) {
      /* Toggle whether the page is a favorite */
      if (!topicURL) {
        topicURL = this.getTopicURL();
      }
      if (this.isTopicFavorite(topicURL)) {
        this._unFavoriteTopic(topicURL); /* Because the favorites list can remove topics, removing a topic can be a different URL than the current topic. */
      } else {
        this._favoriteTopic(topicURL, this.getTopicTitle()); /* This can only be the current topic */
      }
      this.setTopicFavoriteState();
    }
  }, {
    key: "init",
    value: function init() {
      /* Initialise the favorites */

      this.favStorage.init(rh._.getRootUrl());

      /* Subscribe to topic events */
      rh.model.subscribe(rh.consts('KEY_TOPIC_URL'), this.setTopicFavoriteState.bind(this));
      rh.model.subscribe(rh.consts('EVENTFAVCHANGE'), this.setFavoritesList.bind(this));
      rh.model.subscribe(rh.consts('TOPIC_FAVORITE'), this.setfavoritesTitle.bind(this));

      this.setFavoritesList();
      rh.model.publish(consts('TOPIC_FAVORITE'), this.isTopicFavorite());
    }
  }]);

  return FavoritesController;
}();

rh.controller('FavoritesController', FavoritesController);

},{"../../lib/rh":24}],30:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var _ = rh._;

var HomeController = function () {
  function HomeController(widget) {
    _classCallCheck(this, HomeController);

    this.widget = widget;
  }

  _createClass(HomeController, [{
    key: 'goToHome',
    value: function goToHome(tocId) {
      if (rh.consts('HOME_FILEPATH') === rh._.getFileName()) {
        return this.changeToDefaultTopic(tocId);
      }
      var hashMap = void 0;
      if (tocId !== undefined && tocId !== '') {
        hashMap = { rhtocid: tocId };
      }
      _.goToHome(hashMap);
      return true;
    }
  }, {
    key: 'changeToDefaultTopic',
    value: function changeToDefaultTopic(tocId) {
      var hashMap = { t: window.gDefaultTopic.substring(1) };
      if (tocId !== undefined && tocId !== '') {
        hashMap.rhtocid = tocId;
      }
      _.queueUpdateHashMap(hashMap, true);
      return true;
    }
  }]);

  return HomeController;
}();

rh.controller('HomeController', HomeController);

},{"../../lib/rh":24}],31:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var nodeUtils = require("../utils/node_utils");
var $ = rh.$;
var _ = rh._;

var ModalDialog = function () {
  function ModalDialog() {
    _classCallCheck(this, ModalDialog);
  }

  _createClass(ModalDialog, [{
    key: "createChildWidget",
    value: function createChildWidget() {
      this.node = $.createElement('div', this.template);
      nodeUtils.appendChild(document.body, this.node);
      this.widget = new rh.Widget({ node: this.node });
      this.widget.init();
    }
  }, {
    key: "setOnImageLoad",
    value: function setOnImageLoad() {
      var modalContent = $.find(this.node, '.rh-modal-content')[0];
      if (!modalContent) {
        return;
      }
      this.modalContent = modalContent;
      var img = $.find(modalContent, 'img')[0];
      if (img) {
        this.img = img;
        img.addEventListener('load', this.setModalSize.bind(this));
        img.addEventListener('error', this.setModalSize.bind(this));
      }
    }
  }, {
    key: "setModalSize",
    value: function setModalSize() {
      this.imageWidth = this.img.naturalWidth;
      this.imageHeight = this.img.naturalHeight;
      var position = this.calculatePosition(this.imageWidth, this.imageHeight);
      var modalContainer = $.find(this.node, '.rh-modal-container')[0];
      if (modalContainer) {
        this.setContainerStyle(modalContainer, position);
      }
    }
  }, {
    key: "setContainerStyle",
    value: function setContainerStyle(modalContainer, position) {
      var top = Math.round(position.top);
      var left = Math.round(position.left);

      $.css(modalContainer, 'left', left.toString() + 'px');
      $.css(modalContainer, 'top', top.toString() + 'px');

      if (this.modalContent) {
        this.setImageSize(position.width, position.height);
      }
      $.css(modalContainer, 'display', "block");
    }
  }, {
    key: "calculateImageSize",
    value: function calculateImageSize(size) {
      var aspect = size.imageWidth / size.imageHeight;
      if (size.imageWidth < size.pageWidth && size.imageHeight < size.pageHeight) {
        return { width: size.imageWidth, height: size.imageHeight };
      }

      if (size.imageWidth >= size.pageWidth && size.imageHeight <= size.pageHeight) {
        return { height: size.pageWidth / aspect, width: size.pageWidth };
      }
      if (size.imageWidth <= size.pageWidth && size.imageHeight >= size.pageHeight) {
        return { height: size.pageHeight, width: size.pageHeight * aspect
        };
      }
      if (size.imageWidth >= size.pageWidth && size.imageHeight >= size.pageHeight) {
        return this._calculateFullyExceedSize(size, aspect);
      }
    }
  }, {
    key: "_calculateFullyExceedSize",
    value: function _calculateFullyExceedSize(size, aspect) {
      var pageAspect = size.pageWidth / size.pageHeight;
      if (aspect < pageAspect) {
        return { height: size.pageHeight, width: size.pageHeight * aspect };
      } else {
        return { height: size.pageWidth / aspect, width: size.pageWidth };
      }
    }
  }, {
    key: "calculatePosition",
    value: function calculatePosition(imageWidth, imageHeight) {
      var pageWidth = window.innerWidth || document.body.clientWidth;
      var pageHeight = window.innerHeight || document.body.clientHeight;
      pageWidth -= 70;
      pageHeight -= 70;
      pageWidth = pageWidth >= 0 ? pageWidth : 0;
      pageHeight = pageHeight >= 0 ? pageHeight : 0;

      var size = { imageWidth: imageWidth, imageHeight: imageHeight, pageWidth: pageWidth, pageHeight: pageHeight };
      var image_size = this.calculateImageSize(size);
      imageWidth = image_size.width;
      imageHeight = image_size.height;
      var left = Math.max(5, (pageWidth - imageWidth) / 2);
      var top = Math.max(5, (pageHeight - imageHeight) / 2);

      return {
        left: left,
        top: top,
        width: imageWidth,
        height: imageHeight,
        pageWidth: pageWidth,
        pageHeight: pageHeight
      };
    }
  }, {
    key: "initialStyle",
    value: function initialStyle() {
      return this.isImage ? "style=\"display:none\"" : '';
    }
  }, {
    key: "ShowModal",
    value: function ShowModal(config) {
      this.isImage = config.isImage;
      this.createChildWidget();
      this.widget.subscribe('close', this._close.bind(this));
      this.widget.publish('content', config.content);
      _.defer(this.setOnImageLoad.bind(this));
    }
  }, {
    key: "setImageSize",
    value: function setImageSize(maxWidth, maxHeight) {
      if (this.imageWidth > maxWidth) {
        $.css(this.img, 'width', Math.round(maxWidth) + "px");
      }
      if (this.imageHeight > maxHeight) {
        $.css(this.img, 'height', Math.round(maxHeight) + "px");
      }
    }
  }, {
    key: "_close",
    value: function _close() {
      this.widget.destruct();
      this.widget = undefined;
      nodeUtils.removeChild(this.node);
      this.node = undefined;
    }
  }, {
    key: "template",
    get: function get() {
      var initialStyle = this.initialStyle();

      return "\n    <div class=\"rh-modal\">\n        <div class=\"rh-modal-container\" " + initialStyle + ">\n          <div class=\"rh-modal-content\" data-html=\"content\"></div>\n          <div class=\"rh-modal-close\" data-click=\"@close(true)\"> </div>\n        </div>\n    </div>";
    }
  }]);

  return ModalDialog;
}();

rh.model.csubscribe('SHOW_MODAL', function (config) {
  var model = new ModalDialog();
  model.ShowModal(config);
});

},{"../../lib/rh":24,"../utils/node_utils":66}],32:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var $ = rh.$;
var _ = rh._;
var consts = rh.consts;

var RH2017LayoutController = function () {
  function RH2017LayoutController(widget) {
    _classCallCheck(this, RH2017LayoutController);

    this.widget = widget;
    this.topicFrame = '.topic-container iframe';
    this.initLayout();
    this.initModal();
  }

  _createClass(RH2017LayoutController, [{
    key: 'isLayoutMode',
    value: function isLayoutMode(hashMap) {
      var hash = hashMap || _.hashParams();
      var topicMode = hash[rh.consts('HASH_KEY_TOPIC')];
      return hash[rh.consts('HASH_KEY_UIMODE')] !== consts('HELP_SEARCH_MODE') && (!topicMode || hash[rh.consts('HASH_HOMEPAGE_MODE')] === 'true' || hash[rh.consts('HASH_KEY_RH_TOCID')]);
    }
  }, {
    key: 'initLayout',
    value: function initLayout() {
      var _this = this;

      rh.model.subscribe(consts('EVT_HASH_CHANGE'), function (obj) {
        var hashMap = obj.newMap,
            oldHashMap = obj.oldMap;
        if (_this.isLayoutMode()) {
          _this.widget.publish(rh.consts('KEY_VIEW_MODE'), rh.consts('HELP_LAYOUT_MODE'));
        } else if (hashMap[rh.consts('HASH_KEY_UIMODE')] === 'search') {
          _this.widget.publish(rh.consts('KEY_VIEW_MODE'), rh.consts('HELP_SEARCH_MODE'));
          _.queueUpdateHashMap(_defineProperty({}, consts('HASH_HOMEPAGE_MODE'), false), false);
        } else {
          _this.widget.publish(rh.consts('KEY_VIEW_MODE'), rh.consts('HELP_TOPIC_MODE'));
        }

        var feature = rh.model.get(rh.consts('KEY_FEATURE'));
        if (feature && feature.showDefTopic === false && !hashMap[rh.consts('HASH_KEY_RH_TOCID')] && !oldHashMap[rh.consts('HASH_KEY_TOPIC')] && hashMap[rh.consts('HASH_KEY_TOPIC')]) {
          _.queueUpdateHashMap(_defineProperty({}, consts('HASH_HOMEPAGE_MODE'), 'false'), false);
        } else if (oldHashMap[rh.consts('HASH_KEY_TOPIC')] && !hashMap[rh.consts('HASH_KEY_RH_TOCID')] && oldHashMap[rh.consts('HASH_KEY_TOPIC')] !== hashMap[rh.consts('HASH_KEY_TOPIC')] && hashMap[rh.consts('HASH_HOMEPAGE_MODE')] === 'true' && oldHashMap[rh.consts('HASH_HOMEPAGE_MODE')] === hashMap[rh.consts('HASH_HOMEPAGE_MODE')]) {
          _.queueUpdateHashMap(_defineProperty({}, consts('HASH_HOMEPAGE_MODE'), 'false'), false);
        }
      });

      var hashMap = _.hashParams();
      if (this.isLayoutMode() && hashMap[rh.consts('HASH_HOMEPAGE_MODE')] !== 'true') {
        _.queueUpdateHashMap(_defineProperty({}, consts('HASH_HOMEPAGE_MODE'), true), false);
      }
      rh.model.subscribe('EVT_TOC_LOADEDgototab', function (bookData) {
        if (bookData.key) {
          rh.model.subscribe(bookData.key, function (bookTOC, key, unsub) {
            unsub();
            if (bookData.item && bookData.item.url && !bookTOC[0].added) {
              bookTOC.unshift({ 'type': 'item', 'url': bookData.item.url,
                'name': bookData.item.name, 'added': true });
              rh.model.publish(bookData.key, bookTOC);
            }
          });
        }
        if (bookData.item.url) {
          _this.viewTopicInLayoutMode(bookData.item.url);
        }
      });
    }
  }, {
    key: 'viewTopicInLayoutMode',
    value: function viewTopicInLayoutMode(topicUrl) {
      var paramMap = _defineProperty({ 'homepage': 'true'
      }, rh.consts('HASH_KEY_RH_TOCID'), true);
      if (topicUrl && topicUrl !== '#') {
        paramMap.t = topicUrl;
      }
      _.queueUpdateHashMap(paramMap, false);
    }
  }, {
    key: 'initModal',
    value: function initModal() {
      var bHandled = false;
      document.addEventListener("keydown", function (e) {
        if (e.keyCode === 27) {
          // ESC
          rh._.each($.find('.modal'), function (item) {
            $.addClass(item, 'rh-hide');
          });
        }
      }, false);
      document.addEventListener('click', function () {
        if (!bHandled) {
          rh._.each($.find('.modal'), function (item) {
            $.addClass(item, 'rh-hide');
          });
        }
        bHandled = false;
      });
      rh._.each($.find('.modal-content'), function (item) {
        _.addEventListener(item, 'click', function () {
          bHandled = true;
        });
      });
    }
  }]);

  return RH2017LayoutController;
}();

rh.controller('RH2017LayoutController', RH2017LayoutController);

},{"../../lib/rh":24}],33:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;

var Merger = function () {
  function Merger(items) {
    var max_items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

    _classCallCheck(this, Merger);

    this._items = items;
    this._max_items = max_items;
  }

  _createClass(Merger, [{
    key: "merge",
    value: function merge(newItems) {
      var _this = this;

      _.each(newItems, function (item) {
        _this.mergeItem(item);
      });
      this._sort();
      this._purge();
    }
  }, {
    key: "clear",
    value: function clear() {
      this._items = [];
    }
  }, {
    key: "_purge",
    value: function _purge() {
      if (this._items.length > this._max_items) {
        this._items.splice(this._max_items);
      }
    }
  }, {
    key: "mergeItem",
    value: function mergeItem(item) {
      var existing_item = this.find_item(item);
      if (existing_item) {
        existing_item.merge(item);
      } else {
        this._items.push(item);
      }
    }
  }, {
    key: "find_item",
    value: function find_item(match_item) {
      return _.find(this._items, function (item) {
        return item.match(match_item);
      });
    }
  }, {
    key: "merge_item",
    value: function merge_item(existing_item, new_item) {
      existing_item.probability += new_item.probability;
      existing_item.count = Math.max(existing_item.count, new_item.count);
    }
  }, {
    key: "_sort",
    value: function _sort() {
      this.items.sort(this.compare_items);
    }
  }, {
    key: "compare_items",
    value: function compare_items(p1, p2) {
      return p1.compare(p2);
    }
  }, {
    key: "items",
    get: function get() {
      return this._items;
    }
  }]);

  return Merger;
}();

module.exports = Merger;

},{"../../../../lib/rh":24}],34:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var consts = rh.consts;

var Paths = function () {
  function Paths(path) {
    _classCallCheck(this, Paths);

    this._path = path || "";
    this.initPath();
  }

  _createClass(Paths, [{
    key: "initPath",
    value: function initPath() {
      if (this._path === ".") {
        this._path = "";
      }
      if (this._path[0] === '.' && this._path[1] === '/') {
        this._path = this._path.slice(2);
      }
    }
  }, {
    key: "_getModelFileName",
    value: function _getModelFileName(fileNo) {
      return consts("SEARCH_MODEL_ADDR") + fileNo.toString() + ".js";
    }
  }, {
    key: "getModelFilePath",
    value: function getModelFilePath(fileno) {
      var fileName = this._getModelFileName(fileno);
      return this._getRelativePath(fileName);
    }
  }, {
    key: "_getRelativePath",
    value: function _getRelativePath(filepath) {
      var path = this._path === "" ? filepath : this._path + '/' + filepath;

      return path;
    }
  }, {
    key: "_getPathKey",
    value: function _getPathKey() {
      return this._path === "" ? "" : '_' + this._path + '_';
    }
  }, {
    key: "getModelKey",
    value: function getModelKey(fileNo) {
      return consts('SEARCH_MODEL_KEY') + this._getPathKey() + fileNo.toString();
    }
  }, {
    key: "_getMapFileName",
    value: function _getMapFileName() {
      return consts("SEARCH_MAP_ADDR");
    }
  }, {
    key: "getMapFilePath",
    value: function getMapFilePath() {
      var fileName = this._getMapFileName();
      return this._getRelativePath(fileName);
    }
  }, {
    key: "getIndexFilePath",
    value: function getIndexFilePath() {
      var fileName = consts("SEARCH_INDEX_FILE");
      return this._getRelativePath(fileName);
    }
  }, {
    key: "getTopicUrl",
    value: function getTopicUrl(url) {
      return this._getRelativePath(url);
    }
  }, {
    key: "getSearchDbFilePath",
    value: function getSearchDbFilePath() {
      var fileName = consts("SEARCH_DB_FILE");
      return this._getRelativePath(fileName);
    }
  }, {
    key: "getMetadataFilePath",
    value: function getMetadataFilePath() {
      var fileName = consts("SEARCH_METADATA_FILE");
      return this._getRelativePath(fileName);
    }
  }, {
    key: "getTextFilePath",
    value: function getTextFilePath(id) {
      var folderPath = consts("SEARCH_TEXT_FILE");
      var relFolderPath = this._getRelativePath(folderPath);
      return relFolderPath + "/" + id + ".js";
    }
  }]);

  return Paths;
}();

module.exports = Paths;

},{"../../../../lib/rh":24}],35:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;
module.exports = function () {
  function Synonymns(synonymns) {
    _classCallCheck(this, Synonymns);

    this.synonymns = synonymns || [];
    this.rootWords = {};
    this.merge();
  }

  _createClass(Synonymns, [{
    key: "merge",
    value: function merge() {
      var _this = this;

      this.rootWords = {};
      _.each(this.synonymns, function (item) {
        var synonymns = item.words;
        var word = item.name;
        _.each(synonymns, function (syn) {
          _this._add(word, syn);
        });
      });
    }
  }, {
    key: "_add",
    value: function _add(word, syn) {
      syn = syn.toLowerCase();
      word = word.toLowerCase();
      this.rootWords[syn] = this.rootWords[word] || word;
    }
  }, {
    key: "getRoot",
    value: function getRoot(word) {
      return this.rootWords[word] || word;
    }
  }]);

  return Synonymns;
}();

},{"../../../../lib/rh":24}],36:[function(require,module,exports){
"use strict";

var _exports = {
  minPreviousThreshold: 0.2,
  previousnGram: 1,
  max_predictions: 5,
  PREDICTOR_SOURCE_ID: {
    HISTORY_PREDICTOR: 0,
    NGRAM_PREDICTOR: 1,
    GENERAL_PREDICTOR: 2,
    CORRECTOR: 3
  }
};

module.exports = _exports;

},{}],37:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var INDEX = require('./indices');
var rh = require("../../../../lib/rh");
var _ = rh._;
var Prediction = require('./prediction');
var search_consts = require('./consts');
var search_utils = require('./utils');
var PredictionList = require('./prediction_list');

var Corrector = function () {
  function Corrector(loader, callback) {
    var max_predictions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

    _classCallCheck(this, Corrector);

    this._loader = loader;
    this.predictions = [];
    this.max_predictions = max_predictions;
    this._callback = callback;
  }

  _createClass(Corrector, [{
    key: 'getCorrections',
    value: function getCorrections(parsed_input) {
      this._parsed_input = parsed_input;
      this.predictions = [];
      this._computePredictions();
      var hashes = this._loader.getHashes(this._parsed_input._partial);
      if (hashes) {
        var hash_count = hashes.length;
        for (var i = 0; i < hash_count && this.predictions.length < this.max_predictions; i++) {
          var hash = hashes[i];
          this._addCorrection(hash);
        }
      }
      this.onResultCalculated();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.predictions = [];
    }
  }, {
    key: '_computePredictions',
    value: function _computePredictions() {

      var word_hashes = this._loader.getHashes(this._parsed_input._partial);
      if (word_hashes) {
        this._addCorrection(word_hashes);
      }
    }
  }, {
    key: 'onResultCalculated',
    value: function onResultCalculated() {
      if (this._callback) {
        this._callback(new PredictionList(this.predictions, this._parsed_input), this._loader);
      }
    }
  }, {
    key: '_matchCorrection',
    value: function _matchCorrection(word) {
      this._hamming_dist = this._getDistance(word);
      if (this._hamming_dist <= 2 && !this._loader.isStopWord(word)) {
        return true;
      }
      return false;
    }
  }, {
    key: '_addCorrection',
    value: function _addCorrection(word_hash) {
      if (!word_hash) {
        return;
      }
      var word = search_utils.getSafeElement(word_hash, INDEX.MAP.WORD);
      if (!word) {
        return;
      }

      if (this._matchCorrection(word)) {
        var complete_word = this._parsed_input.replaceLastWord(word);
        var term = this._parsed_input.completeSuggestion(complete_word);
        var prediction = new Prediction(term, 1 / this._hamming_dist, 2, search_consts.PREDICTOR_SOURCE_ID.CORRECTOR);
        this.predictions.push(prediction);
      }
    }
  }, {
    key: '_getDistance',
    value: function _getDistance(word) {
      return _.findEditDist(this._parsed_input._partial, word);
    }
  }]);

  return Corrector;
}();

module.exports = Corrector;

},{"../../../../lib/rh":24,"./consts":36,"./indices":41,"./prediction":45,"./prediction_list":47,"./utils":52}],38:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PredictionList = require('./prediction_list');
var PredictonCreator = require('./prediction_creator');
var search_consts = require('./consts');
var INDEX = require('./indices');
var rh = require("../../../../lib/rh");
var _ = rh._;
var PredictonMerger = require('../common/merger');

var GeneralPredictor = function () {
  function GeneralPredictor(callback, loader) {
    var max_predictions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

    _classCallCheck(this, GeneralPredictor);

    this._max_predictions = max_predictions;
    this._loader = loader;
    this.total_count = this._loader.getTotalCount();
    this._callback = callback;
    this._source = search_consts.PREDICTOR_SOURCE_ID.GENERAL_PREDICTOR;
    this.prediction_merger = new PredictonMerger([], this.total_count * 5);
  }

  _createClass(GeneralPredictor, [{
    key: 'clear',
    value: function clear() {
      this.prediction_merger.clear();
      this.parsed_input = undefined;
    }
  }, {
    key: 'getPredictions',
    value: function getPredictions(parsed_input) {

      this._init(parsed_input);
      this._computePredictions();

      this._onResultComputed();
    }
  }, {
    key: '_computePredictions',
    value: function _computePredictions() {

      var word_hashes = this._getWordHashes();
      if (word_hashes) {
        this._addPredictions(word_hashes);
      }
    }
  }, {
    key: '_isWholeWordInput',
    value: function _isWholeWordInput() {
      return this.parsed_input.isWholeWord;
    }
  }, {
    key: '_getWordHashes',
    value: function _getWordHashes() {
      return this.parsed_input.isWholeWord ? this._loader.top_words : this._loader.getHashes(this.parsed_input._partial);
    }
  }, {
    key: '_init',
    value: function _init(parsed_input) {
      this.prediction_merger = new PredictonMerger([], this.total_count * 5);
      this.parsed_input = parsed_input;
    }
  }, {
    key: '_onResultComputed',
    value: function _onResultComputed() {
      if (this._callback) {
        this._callback(new PredictionList(this.predictions, this.parsed_input), this._loader);
      }
    }
  }, {
    key: '_addPredictions',
    value: function _addPredictions(hashes) {
      if (!hashes) {
        return;
      }

      var hash_count = hashes.length;
      for (var i = 0; i < hash_count && this.predictions.length < this.max_predictions; i++) {
        var hash = hashes[i];
        this._addWordPrediction(hash);
      }
    }
  }, {
    key: '_addWordPrediction',
    value: function _addWordPrediction(word_hash, matchFn) {
      matchFn = matchFn || this._matches_partially.bind(this);
      var model_data = this._loader.getModelData(word_hash);
      var total_count = this._loader.total_count;
      if (matchFn(word_hash)) {
        var word = word_hash[INDEX.MAP.WORD];
        if (this._should_add_prediction(word)) {
          this._create_predictions(word_hash, total_count, model_data);
        }
      }
    }
  }, {
    key: '_continueFn',
    value: function _continueFn() {
      return true;
    }
  }, {
    key: '_should_add_prediction',
    value: function _should_add_prediction(word) {
      return !this._loader.isStopWord(word) && !this.parsed_input.equalLastWord(word);
    }
  }, {
    key: '_matches_partially',
    value: function _matches_partially(word_hash) {
      if (this.parsed_input.isWholeWord) {
        return true;
      }

      var word = word_hash[INDEX.MAP.WORD];
      return this.parsed_input.comparePartial(word);
    }
  }, {
    key: '_create_predictions',
    value: function _create_predictions(word_hash, model_count, model_item) {
      var _this = this;

      var creator = new PredictonCreator({ loader: this._loader, model_item: model_item, total_count: model_count, parsed_input: this.parsed_input, continueFn: this._continueFn });
      var predictions = creator.getMultiPredictions(word_hash, true, undefined, this._source);
      _.each(predictions, function (prediction) {
        if (prediction !== undefined) {
          _this.prediction_merger.mergeItem(prediction);
        }
      });
    }
  }, {
    key: '_calculate_probability',
    value: function _calculate_probability(count) {
      return count / this.total_count;
    }
  }, {
    key: 'predictions',
    get: function get() {
      return this.prediction_merger.items;
    }
  }, {
    key: 'max_predictions',
    set: function set(newValue) {
      this._max_predictions = newValue;
    },
    get: function get() {
      return this._max_predictions;
    }
  }]);

  return GeneralPredictor;
}();

module.exports = GeneralPredictor;

},{"../../../../lib/rh":24,"../common/merger":33,"./consts":36,"./indices":41,"./prediction_creator":46,"./prediction_list":47}],39:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;
var Prediction = require('./prediction');
var Parser = require('./input_parser');
var PredictionList = require('./prediction_list');
var search_consts = require('./consts');

var HistoryPredictor = function () {
  function HistoryPredictor(reader, callback) {
    _classCallCheck(this, HistoryPredictor);

    this._reader = reader;
    this._predictions = [];
    this._callback = callback;
    this._source = search_consts.PREDICTOR_SOURCE_ID.HISTORY_PREDICTOR;
    this._max_predictions = search_consts._max_history_predictions === undefined ? 2 : search_consts._max_history_predictions;
  }

  _createClass(HistoryPredictor, [{
    key: 'getPredictions',
    value: function getPredictions(parsed_input) {
      this._predictions = [];
      this._parsed_input = parsed_input;
      this._computePredictions();
      if (this._callback) {
        this._callback(new PredictionList(this._predictions, this._parsed_input));
      }
      return this._predictions;
    }
  }, {
    key: 'init',
    value: function init() {}
  }, {
    key: 'clear',
    value: function clear() {
      this._predictions = [];
    }
  }, {
    key: '_computePredictions',
    value: function _computePredictions() {
      var _this = this;

      if (this._parsed_input.trimmedText !== "") {
        _.each(this._reader._list, function (item) {
          if (_this._match(item.text)) {
            _this._predictions.push(_this._createPrediction(item));
          }
        });
        this._purge();
      }
    }
  }, {
    key: '_purge',
    value: function _purge() {
      this._predictions.splice(this._max_predictions);
    }
  }, {
    key: '_createPrediction',
    value: function _createPrediction(item) {
      var newPrediction = new Prediction(item.text, 1, item.count, this._source);
      return newPrediction;
    }
  }, {
    key: '_match',
    value: function _match(text) {
      if (this._parsed_input.original_text.length > text.length) {
        return false;
      }
      var parsed_text = new Parser(text, true);
      return this._parsed_input.compare(parsed_text);
    }
  }]);

  return HistoryPredictor;
}();

module.exports = HistoryPredictor;

},{"../../../../lib/rh":24,"./consts":36,"./input_parser":42,"./prediction":45,"./prediction_list":47}],40:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;
var search_utils = require('./utils');

var HistoryReader = function () {
  function HistoryReader() {
    _classCallCheck(this, HistoryReader);
  }

  _createClass(HistoryReader, [{
    key: "initHistory",
    value: function initHistory(list) {
      if (this._list === undefined) {
        this._list = list || [];
      }
    }
  }, {
    key: "getHistory",
    value: function getHistory() {
      return this._list || [];
    }
  }, {
    key: "_updateText",
    value: function _updateText(text, index) {
      this.getHistory().splice(index, 1);
      this.getHistory().unshift(text);
    }
  }, {
    key: "_addNewText",
    value: function _addNewText(newText) {
      this.getHistory().push(newText);
    }
  }, {
    key: "add",
    value: function add(newText) {
      var nIndex = _.findIndex(this.getHistory(), function (item) {
        return search_utils.compareNoCase(newText.text, item.text) === 0;
      });
      if (nIndex >= 0) {
        this._updateText(newText, nIndex);
      } else {
        this._addNewText(newText);
      }
    }
  }, {
    key: "delete",
    value: function _delete(searchText) {
      var nIndex = _.findIndex(this.getHistory(), function (item) {
        return search_utils.compareNoCase(searchText, item.text) === 0;
      });
      if (nIndex >= 0) {
        this.getHistory().splice(nIndex);
      }
    }
  }]);

  return HistoryReader;
}();

module.exports = new HistoryReader();

},{"../../../../lib/rh":24,"./utils":52}],41:[function(require,module,exports){
"use strict";

var _exports = {
  MAP: {
    WORD: 0,
    HASH: 1,
    COUNT: 2,
    MODEL_FILE_NO: 3,
    MODEL_INDEX: 4,
    TOPICS: 5
  },

  MODEL: {
    WORD_HASH: 0,
    COUNT: 1,
    NEXT_MODEL: 2
  },

  FIRST_PREDICTION: {
    NEXT: 0,
    PREVIOUS: 1
  }
};

module.exports = _exports;

},{}],42:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var search_utils = require('./utils');
var rh = require("../../../../../src/lib/rh");
var _ = rh._;

var InputParser = function () {
  function InputParser(text, isWholeWord, selection, isPrevious) {
    _classCallCheck(this, InputParser);

    this.isPrevious = isPrevious;
    this.selection = selection === undefined ? text.length : selection;
    var separator = this._calculateSeparator(text);
    if (!this.isPrevious) {
      this.isWholeWord = isWholeWord || this._isWholeWord(text, separator);
    }
    this.initText(text, separator);
  }

  _createClass(InputParser, [{
    key: "initText",
    value: function initText(text, separator) {
      this._computeText(text, separator);
      this.trimmedText = this.original_text.trim();
      this.words = _.compact(this.trimmedText.split(" ") || []);
      this._reverseIfPrevious();
      if (!this.isWholeWord && this.words.length > 0) {
        this._partial = this.words.splice(-1)[0];
      }
    }
  }, {
    key: "_computeText",
    value: function _computeText(text, separator) {
      this._right_text = "";
      this._left_text = "";

      if (separator === undefined) {
        separator = text.length;
      }
      this.isSplitText = !(separator === 0 || separator === text.length);
      var left_text = text.substring(0, separator);
      var right_text = text.substring(separator);

      if (this.isPrevious) {
        this.original_text = right_text;
        this._left_text = left_text.trim();
      } else {
        this.original_text = left_text;
        this._right_text = right_text.trim();
      }
    }
  }, {
    key: "equalRemaingWord",
    value: function equalRemaingWord(word) {
      if (this._left_text !== "" || this._right_text !== "") {
        var remainingWord = this._getRemainigWord();
        if (remainingWord) {
          return search_utils.compareNoCase(remainingWord, word) === 0;
        }
      }
      return false;
    }
  }, {
    key: "_getRemainigWord",
    value: function _getRemainigWord() {
      var words = this.isPrevious ? this._left_text.split(" ") : this._right_text.split(" ");

      words = words || [];
      words = _.compact(words);
      if (words.length > 0) {
        return this.isPrevious ? words[words.length - 1] : words[0];
      }
    }
  }, {
    key: "completeSuggestion",
    value: function completeSuggestion(text) {
      if (this.isPrevious) {
        return this._left_text.length === 0 ? text : this._left_text + " " + text;
      } else {
        return this._right_text.length === 0 ? text : text + " " + this._right_text;
      }
    }
  }, {
    key: "_calculateSeparator",
    value: function _calculateSeparator(text) {

      if (this.isPrevious) {
        if (this.selection === 0) {
          this.isWholeWord = true;
          return 0;
        }
        if (text.length > this.selection && text[this.selection - 1] !== " ") {
          var previousSpaceIndex = text.lastIndexOf(" ", this.selection - 1);
          this.isWholeWord = false;
          return previousSpaceIndex >= 0 ? previousSpaceIndex + 1 : 0;
        }
        this.isWholeWord = true;
      }
      return this.selection;
    }
  }, {
    key: "_reverseIfPrevious",
    value: function _reverseIfPrevious() {
      if (this.isPrevious) {
        this.words.reverse();
      }
    }
  }, {
    key: "_isWholeWord",
    value: function _isWholeWord(text, separator) {
      if (this.isPrevious) {
        if (separator === 0) {
          return true;
        }
        return text.length > separator && text[separator - 1] === " ";
      }

      return separator > 0 && text[separator - 1] === " ";
    }
  }, {
    key: "compare",
    value: function compare(other_input) {
      var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      end = end === undefined ? this.words.length - 1 : end;
      if (this.words.length > other_input.words.length) {
        return false;
      }
      var i = start;
      for (; i <= end; i++) {
        var word1 = this.words[i];
        var word2 = other_input.words[i];
        if (search_utils.compareNoCase(word1, word2) !== 0) {
          return false;
        }
      }
      return this.matchPartial(other_input, i);
    }
  }, {
    key: "matchPartial",
    value: function matchPartial(other_input, index) {
      if (this._partial === undefined) {
        return true;
      }
      if (other_input.words.length <= index) {
        return false;
      }
      var other_word = other_input.words[index];
      return this.comparePartial(other_word);
    }
  }, {
    key: "comparePartial",
    value: function comparePartial(word) {
      this._matchExp = new RegExp('^' + this._partial, 'i');
      return this._matchExp.test(word);
    }
  }, {
    key: "completeWord",
    value: function completeWord(next_word) {
      if (this.isWholeWord || this._partial === undefined || this._partial.length === 0) {
        return this.getTermForCompleteWord(next_word, this.trimmedText);
      } else {
        return this.getTermForPartialText(next_word);
      }
    }
  }, {
    key: "getTermForPartialText",
    value: function getTermForPartialText(next_word) {
      var partial_next_word = next_word.substring(this._partial.length, next_word.length);
      if (this.isPrevious) {
        var trimmedText = "";
        var firstSpaceIndex = this.trimmedText.indexOf(' ');
        if (firstSpaceIndex >= 0) {
          trimmedText = this.trimmedText.substring(firstSpaceIndex);
        }
        return this._partial + partial_next_word + trimmedText;
      } else {
        return this.trimmedText + partial_next_word;
      }
    }
  }, {
    key: "getTermForCompleteWord",
    value: function getTermForCompleteWord(next_word) {
      if (this.isPrevious) {
        return next_word + " " + this.trimmedText;
      } else {
        return this.trimmedText + " " + next_word;
      }
    }
  }, {
    key: "replaceLastWord",
    value: function replaceLastWord(next_word) {
      var text = this.trimmedText;
      if (this._partial !== undefined && !this.isWholeWord) {
        var index = this.trimmedText.length - this._partial.length;
        text = this.trimmedText.substring(0, index);
        text = text.trim();
      }
      return text + " " + next_word;
    }
  }, {
    key: "equalLastWord",
    value: function equalLastWord(word) {
      if (this.words.length === 0) {
        return false;
      }
      var last_word = this.words[this.words.length - 1];
      return search_utils.compareNoCase(last_word, word) === 0;
    }
  }]);

  return InputParser;
}();

module.exports = InputParser;

},{"../../../../../src/lib/rh":24,"./utils":52}],43:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;
var model = rh.model;
var search_utils = require('./utils');
var INDEX = require('./indices');
var SEARCH_CONSTS = require('./consts');
var Paths = require('../common/paths');

var Loader = function () {
  function Loader() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    _classCallCheck(this, Loader);

    this._paths = new Paths(path);
  }

  _createClass(Loader, [{
    key: 'init',
    value: function init(callbackFn) {
      this.loadIndex(callbackFn);
      this.loadMap(callbackFn);
    }
  }, {
    key: '_isIndexLoaded',
    value: function _isIndexLoaded() {
      return this.index_data !== undefined;
    }
  }, {
    key: 'getModelCount',
    value: function getModelCount() {
      return this.index_data.Model.length;
    }
  }, {
    key: 'getMapHash',
    value: function getMapHash(hash_key) {
      return this._hash_to_word[hash_key];
    }
  }, {
    key: 'getHashes',
    value: function getHashes(input) {
      if (input !== undefined && input.length > 0) {
        return this.getAplhabetHashes(input[0]);
      }
    }
  }, {
    key: 'getAplhabetHashes',
    value: function getAplhabetHashes(alphabet) {
      if (this.map_data && alphabet.length === 1) {
        var lalphabet = alphabet.toLowerCase();
        return this.map_data[lalphabet];
      }
    }
  }, {
    key: 'getWordModel',
    value: function getWordModel(word, model_data) {
      var word_model = void 0;
      var word_hash = this._getHashForWord(word);
      if (word_hash && model_data) {
        word_model = model_data[word_hash[INDEX.MAP.MODEL_INDEX]];
      }
      return word_model;
    }
  }, {
    key: 'getCount',
    value: function getCount(word) {
      var word_hash = this._getHashForWord(word);
      if (word_hash) {
        return word_hash[INDEX.MAP.COUNT];
      }
    }
  }, {
    key: 'getModelData',
    value: function getModelData(word_hash) {
      // async call if not loaded return empty array
      var fileno = word_hash[INDEX.MAP.MODEL_FILE_NO];
      var model_index = word_hash[INDEX.MAP.MODEL_INDEX];
      var data = model.get(this._paths.getModelKey(fileno));
      if (!data) {
        this.loadModel(fileno);
      }
      return data && data[model_index];
    }
  }, {
    key: '_compareWordCount',
    value: function _compareWordCount(hash_item1, hash_item2) {
      var count1 = search_utils.getSafeElement(hash_item1, INDEX.MAP.COUNT);
      var count2 = search_utils.getSafeElement(hash_item2, INDEX.MAP.COUNT);
      if (count1 && count2) {
        return count2 - count1;
      }
      return 0;
    }
  }, {
    key: '_buildTopWords',
    value: function _buildTopWords(words) {
      words.sort(this._compareWordCount);
      words.splice(SEARCH_CONSTS.max_predictions * 100);
      this._top_words = words;
    }
  }, {
    key: 'getModelFileNo',
    value: function getModelFileNo(word) {
      var word_hash = this._getHashForWord(word);
      if (word_hash) {
        return word_hash[INDEX.MAP.MODEL_FILE_NO];
      }
    }
  }, {
    key: '_getHashForWord',
    value: function _getHashForWord(word) {
      var hash = void 0;
      var word_key = this.getHashKey(word);
      if (word_key) {
        hash = this._hash_to_word[word_key];
      }
      return hash;
    }
  }, {
    key: 'getHashKey',
    value: function getHashKey(word) {
      if (word && word.length > 0) {
        var lWord = word.toLowerCase();
        return this._word_hash[lWord];
      }
    }
  }, {
    key: 'loadIndex',
    value: function loadIndex(callbackFn) {
      var _this = this;

      if (this._isIndexLoaded() === false) {
        _.loadScript(this._paths.getIndexFilePath(), true, function () {
          _this.index_data = _.exports();
          _this.onIndexLoaded(callbackFn);
        }, true);
      } else {
        this.onIndexLoaded(callbackFn);
      }
    }
  }, {
    key: 'loadModel',
    value: function loadModel(fileNo, callbackFn) {
      var data = [];
      if (fileNo !== undefined) {
        var key = this._paths.getModelKey(fileNo);
        var _data = model.get(key);
        if (_data === undefined) {
          model.publish(key, null);

          var filepath = this._paths.getModelFilePath(fileNo);
          _.loadScript(filepath, true, this.getOnModelLoadFn(fileNo, callbackFn), true);
        } else if (_data === null && callbackFn !== undefined) {

          model.subscribe(key, callbackFn);
        } else {
          this.doCallback(callbackFn, _data, fileNo);
        }
      } else {
        this.doCallback(callbackFn, data, fileNo);
      }
    }
  }, {
    key: 'doCallback',
    value: function doCallback(callbackFn, data, fileno) {
      if (callbackFn) {
        callbackFn(data, fileno);
      }
    }
  }, {
    key: 'getOnModelLoadFn',
    value: function getOnModelLoadFn(fileNo, callbackFn) {
      var _this2 = this;

      return function () {
        var data = _.exports();
        model.publish(_this2._paths.getModelKey(fileNo), data);
        if (callbackFn) {
          callbackFn(data, fileNo);
        }
      };
    }
  }, {
    key: 'onMapLoaded',
    value: function onMapLoaded(callbackFn) {
      this.parseMap();
      if (this.index_data && callbackFn) {
        callbackFn(this);
      }
    }
  }, {
    key: 'onIndexLoaded',
    value: function onIndexLoaded(callbackFn) {
      if (this.map_data && callbackFn) {
        callbackFn(this);
      }
    }
  }, {
    key: 'parseMap',
    value: function parseMap() {
      var data = this.map_data;
      this._word_hash = {};
      this._hash_to_word = {};
      var words = [];
      for (var letter in data) {
        var words_data = data[letter];
        this._parseWordsData(words_data);
        words = words.concat(words_data);
      }
      this._buildTopWords(words);
    }
  }, {
    key: '_parseWordsData',
    value: function _parseWordsData(words_data) {
      var _this3 = this;

      _.each(words_data, function (word_data) {
        var hash_key = parseInt(word_data[INDEX.MAP.HASH]);
        if (word_data[INDEX.MAP.WORD]) {
          var word = word_data[INDEX.MAP.WORD].toString();
          _this3._word_hash[word] = hash_key;
        }
        _this3._hash_to_word[hash_key] = word_data;
      });
    }
  }, {
    key: 'isStopWord',
    value: function isStopWord(word) {
      var index = _.find(this.index_data.stopWords, function (stop_word) {
        return search_utils.compareNoCase(word, stop_word) === 0;
      });
      return index !== undefined;
    }
  }, {
    key: 'getTotalCount',
    value: function getTotalCount() {
      return this.index_data.totalCount;
    }
  }, {
    key: 'wordHashfromIndexKey',
    value: function wordHashfromIndexKey(index_key, fileno) {
      return _.find(this._hash_to_word, function (map_item) {
        return map_item[INDEX.MAP.MODEL_INDEX] === index_key && map_item[INDEX.MAP.MODEL_FILE_NO] === fileno;
      });
    }
  }, {
    key: 'loadMap',
    value: function loadMap(callbackFn) {
      var _this4 = this;

      if (this.map_data === undefined) {
        _.loadScript(this._paths.getMapFilePath(), true, function () {
          _this4.map_data = _.exports();
          _this4.onMapLoaded(callbackFn);
        }, true);
      } else {
        this.onMapLoaded(callbackFn);
      }
    }
  }, {
    key: 'top_words',
    get: function get() {
      return this._top_words;
    }
  }, {
    key: 'nGram',
    get: function get() {
      return this.index_data.nGram;
    }
  }, {
    key: 'search_model',
    get: function get() {
      return this.index_data.Model;
    }
  }, {
    key: 'search_map',
    get: function get() {
      return this.index_data.Map;
    }
  }, {
    key: 'total_count',
    get: function get() {
      return this.index_data.totalCount;
    }
  }, {
    key: 'stop_words',
    get: function get() {
      return this.index_data.stopWords;
    }
  }]);

  return Loader;
}();

module.exports = Loader;

},{"../../../../lib/rh":24,"../common/paths":34,"./consts":36,"./indices":41,"./utils":52}],44:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;
var PredictonCreator = require('./prediction_creator');
//let search_utils = require('./utils');
//let Prediction = require('./prediction');
var PredictionList = require('./prediction_list');
var search_consts = require('./consts');
var INDEX = require('./indices');

var NGramPredictor = function () {
  function NGramPredictor(_ref) {
    var loader = _ref.loader,
        level = _ref.level,
        callback = _ref.callback,
        previous = _ref.previous,
        _ref$max_predictions = _ref.max_predictions,
        max_predictions = _ref$max_predictions === undefined ? 20 : _ref$max_predictions;

    _classCallCheck(this, NGramPredictor);

    this.level = level;
    this.previous = previous;
    this._max_predictions = max_predictions;
    this.predictions = [];
    this._callback = callback;
    this._loader = loader;
    this._source = search_consts.PREDICTOR_SOURCE_ID.NGRAM_PREDICTOR;
  }

  _createClass(NGramPredictor, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'clear',
    value: function clear() {
      this._word_model = undefined;
      this._prediction_array = undefined;
      this.parsed_input = undefined;
      this.predictions = [];
    }
  }, {
    key: 'getPredictions',
    value: function getPredictions(parsed_input) {
      this.parsed_input = parsed_input;
      this.predictions = [];
      if (parsed_input !== undefined && parsed_input.words.length >= this.level) {
        this.word_index = parsed_input.words.length - this.level;
        this._word = parsed_input.words[this.word_index];
        this._loadInputModel(this._word, this._compute_word_predictions.bind(this));
      } else {
        this._onResultsComputed();
      }
    }
  }, {
    key: '_compute_word_predictions',
    value: function _compute_word_predictions(model_data) {
      this.predictions = [];
      var level = this.level;
      var word = this._word;
      var total_count = this._loader.getCount(word);
      this._word_model = this._loader.getWordModel(word, model_data);
      if (this._word_model) {
        this._prediction_array = this._get_prediction_array();
        this._compute_prediction_from_model(word, level, total_count);
      }
      this._onResultsComputed();
    }
  }, {
    key: '_onResultsComputed',
    value: function _onResultsComputed() {
      if (this._callback) {
        this._callback(new PredictionList(this.predictions, this.parsed_input), this._loader);
      }
    }
  }, {
    key: '_compute_prediction_from_model',
    value: function _compute_prediction_from_model(word, level, total_count) {
      if (this._prediction_array === undefined) {
        return;
      }

      if (this._is_my_level(level)) {
        this._compute_next_words(total_count);
      } else {
        level--;
        var next_index = this._get_word_index(level);
        var next_word = this.parsed_input.words[next_index];
        var next_word_key = this._loader.getHashKey(next_word);
        var next_word_model = this._get_next_model(this._prediction_array, next_word_key);
        if (next_word_model) {
          total_count = next_word_model[INDEX.MODEL.COUNT];
          this._prediction_array = next_word_model[INDEX.MODEL.NEXT_MODEL];
          this._compute_prediction_from_model(next_word, level, total_count);
        }
      }
    }
  }, {
    key: '_get_next_model',
    value: function _get_next_model(model_data, word_hash_key) {
      if (!word_hash_key) {
        return undefined;
      }
      var next_word_prediction = _.find(model_data, function (item) {
        return item.length > 1 && item[INDEX.MODEL.WORD_HASH] === word_hash_key;
      });
      if (next_word_prediction && next_word_prediction.length > INDEX.MODEL.NEXT_MODEL && Array.isArray(next_word_prediction)) {
        return next_word_prediction; // TODO may be needs a fix
      }
    }
  }, {
    key: '_get_word_index',
    value: function _get_word_index(level) {
      return this.parsed_input.words.length - level;
    }
  }, {
    key: '_is_my_level',
    value: function _is_my_level(level) {
      return level === 1;
    }
  }, {
    key: '_continueFn',
    value: function _continueFn() {
      return true;
    }
  }, {
    key: '_compute_next_words',
    value: function _compute_next_words(total_count) {
      var prediction_array = this._prediction_array;
      if (!(prediction_array && prediction_array.length > 0)) {
        return;
      }

      for (var i = 0; this.predictions.length < this.max_predictions && i < prediction_array.length && prediction_array[i].length > 1; i++) {
        if (!this._matches_partially(prediction_array[i])) {
          continue;
        }
        var predictions = this._create_predictions(prediction_array[i], total_count);
        this._compute_next_multi_words(predictions);
      }
    }
  }, {
    key: '_compute_next_multi_words',
    value: function _compute_next_multi_words(predictions) {
      var _this = this;

      _.each(predictions, function (prediction) {
        if (prediction !== undefined) {
          _this.predictions.push(prediction);
        }
      });
    }
  }, {
    key: '_get_word_hash',
    value: function _get_word_hash(model_item) {
      return this._loader.getMapHash(model_item[INDEX.MODEL.WORD_HASH]);
    }
  }, {
    key: '_matches_partially',
    value: function _matches_partially(prediction) {
      if (this.parsed_input.isWholeWord) {
        return true;
      }
      var word_hash = this._loader.getMapHash(prediction[INDEX.MODEL.WORD_HASH]);
      // TODO what if not a word hash ?
      if (!word_hash) {
        return false;
      }
      var word = word_hash[INDEX.MAP.WORD];
      return this.parsed_input.comparePartial(word);
    }
  }, {
    key: '_create_predictions',
    value: function _create_predictions(next_array, total_count) {
      var creator = new PredictonCreator({ loader: this._loader, model_item: next_array, total_count: total_count, parsed_input: this.parsed_input, continueFn: this._continueFn });
      return creator.getMultiPredictions(undefined, undefined, undefined, this._source);
    }
  }, {
    key: '_get_prediction_array',
    value: function _get_prediction_array() {
      // returns an array from which predictions are to be calculates
      if (this.parsed_input.isPrevious && this._word_model.length > 1) {
        return this._word_model[1];
      } else {
        return this._word_model[0];
      }
    }
  }, {
    key: '_loadInputModel',
    value: function _loadInputModel(word, callbackFn) {
      var nFileIndex = this._findFileIndex(word);
      this._loader.loadModel(nFileIndex, callbackFn);
    }
  }, {
    key: '_findFileIndex',
    value: function _findFileIndex(word) {
      return this._loader.getModelFileNo(word);
    }
  }, {
    key: 'max_predictions',
    set: function set(newValue) {
      this.max_predictions = newValue;
    },
    get: function get() {
      return this._max_predictions;
    }
  }]);

  return NGramPredictor;
}();

module.exports = NGramPredictor;

},{"../../../../lib/rh":24,"./consts":36,"./indices":41,"./prediction_creator":46,"./prediction_list":47}],45:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Prediction = function () {
  function Prediction(term, probability, count, source) {
    _classCallCheck(this, Prediction);

    this.probability = probability;
    this.term = term;
    this.count = count;
    this.source = source;
  }

  _createClass(Prediction, [{
    key: 'merge',
    value: function merge(new_item) {
      this.probability += new_item.probability;
      this.count = Math.max(this.count, new_item.count);
    }
  }, {
    key: 'compare',
    value: function compare(other) {
      return other.probability - this.probability;
    }
  }, {
    key: 'match',
    value: function match(other) {
      return _utils2.default.compareNoCase(other.term, this.term) === 0;
    }
  }]);

  return Prediction;
}();

module.exports = Prediction;

},{"./utils":52}],46:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Prediction = require('./prediction');
var search_utils = require('./utils');
var INDEX = require('./indices');
var InputParser = require('./input_parser');
var search_consts = require('./consts');

var PredictonCreator = function () {
  function PredictonCreator(_ref) {
    var loader = _ref.loader,
        model_item = _ref.model_item,
        total_count = _ref.total_count,
        parsed_input = _ref.parsed_input,
        continueFn = _ref.continueFn;

    _classCallCheck(this, PredictonCreator);

    this._model_item = model_item;
    this.parsed_input = parsed_input || new InputParser("");
    this._init();
    this._total_count = total_count;
    this._continueFn = continueFn || this._isStopWord;
    this._nextModelFn = this._nextModel;
    this._predictions = [];
    this._multi_prediction = false;
    this._loader = loader;
  }

  _createClass(PredictonCreator, [{
    key: '_init',
    value: function _init() {
      this.term = "";
      this.probability = 1;
      this._first_word = true;
      this.isFirstLevel = false;
      this._level = 0;
    }
  }, {
    key: 'getPrediction',
    value: function getPrediction(word_hash, isFirstLevel, previous, source) {
      this.word_hash = word_hash;
      this.isFirstLevel = isFirstLevel;
      this.previous = previous;
      this.source = source;
      if (this.isFirstLevel) {
        this._appendPreviousPredictions(this._model_item);
      }
      this._appendPrediction(this._model_item, word_hash);
      return this._createPrediction();
    }
  }, {
    key: 'getMultiPredictions',
    value: function getMultiPredictions(word_hash, isFirstLevel, previous, source) {
      this._multi_prediction = true;
      this.word_hash = word_hash;
      this.isFirstLevel = isFirstLevel;
      this.previous = previous;
      this.source = source;
      if (this.isFirstLevel) {
        this._appendPreviousPredictions(this._model_item);
      }
      this._appendPrediction(this._model_item, word_hash);
      return this._predictions;
    }
  }, {
    key: 'equalRemaingWord',
    value: function equalRemaingWord(model_item) {
      var word = this._getword(model_item, this.word_hash);
      if (word) {
        if (this.parsed_input.equalRemaingWord(word)) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: '_appendPreviousPredictions',
    value: function _appendPreviousPredictions(model_item) {
      var previous_item = this._getPreviousItem(model_item);
      if (!previous_item) {
        return;
      }
      var previous_probaility = this._getPreviousProbability(previous_item);
      if (previous_probaility > search_consts.minPreviousThreshold) {
        this._appendPreviousTerm(previous_item);
      }
    }
  }, {
    key: '_getPreviousItem',
    value: function _getPreviousItem(model_item) {
      var previous_items = search_utils.getFirstLevelNextModel(model_item, true);
      if (previous_items) {
        var previous_item = search_utils.getSafeElement(previous_items, 0);
        return previous_item;
      }
    }
  }, {
    key: '_appendPreviousTerm',
    value: function _appendPreviousTerm(model_item) {
      var word = this._getword(model_item);
      if (word) {
        if (this.parsed_input.equalLastWord(word)) {
          return;
        }
        this.term = this.parsed_input.replaceLastWord(word);
        this._first_word = false;
      }
    }
  }, {
    key: '_createPrediction',
    value: function _createPrediction() {
      if (this.term !== "") {
        var suggestion_text = this.parsed_input.completeSuggestion(this.term);
        return new Prediction(suggestion_text, this.probability, 1, this.source);
      }
    }
  }, {
    key: '_appendPrediction',
    value: function _appendPrediction(model_item) {
      this.probability = this.probability * this._calculateProbability(model_item);
      this._update_term(model_item);
      if (this._shouldCreatePrediction(model_item)) {
        this._predictions.push(this._createPrediction());
      }
      if (this._continueFn(model_item)) {
        var next_model = this._nextModel(model_item);
        this._total_count = this._getCount(model_item);
        this._level++;
        this._first_word = false;
        this.isFirstLevel = false;
        this.word_hash = undefined;
        if (next_model) {
          this._appendPrediction(next_model);
        }
      }
    }
  }, {
    key: '_getPreviousProbability',
    value: function _getPreviousProbability(previous_item) {
      var total_count = this._getCount(this.model_item);
      var count = search_utils.getCountfromModel(previous_item);
      return count / total_count;
    }
  }, {
    key: '_update_term',
    value: function _update_term(model_item) {
      if (this.parsed_input.isPrevious) {
        this.term = this._nextTerm(model_item) + this.term;
      } else {
        this.term = this.term + this._nextTerm(model_item);
      }
    }
  }, {
    key: '_getword',
    value: function _getword(model_item, word_hash) {
      word_hash = word_hash || this._get_word_hash(model_item);
      return search_utils.getSafeElement(word_hash, INDEX.MAP.WORD);
    }
  }, {
    key: '_get_word_hash',
    value: function _get_word_hash(model_item) {
      return this._loader.getMapHash(model_item[INDEX.MODEL.WORD_HASH]);
    }
  }, {
    key: '_nextModel',
    value: function _nextModel(model_item) {
      var next_model = void 0;
      if (this.isFirstLevel) {
        next_model = search_utils.getFirstLevelNextModel(model_item, this.previous);
      } else {
        next_model = search_utils.getNextModel(model_item);
      }
      if (next_model && next_model.length > 0) {
        return search_utils.getFirstPrediction(next_model);
      }
    }
  }, {
    key: '_nextTerm',
    value: function _nextTerm(model_item) {
      var word = this._getword(model_item, this.word_hash);
      if (word) {
        return this._first_word ? this.parsed_input.completeWord(word) : " " + word;
      }
      return "";
    }
  }, {
    key: '_calculateProbability',
    value: function _calculateProbability(model_item) {
      var count = this._getCount(model_item);
      return count / this._total_count;
    }
  }, {
    key: '_getCount',
    value: function _getCount(model_item) {
      if (this.word_hash) {
        return search_utils.getCountfromWordHash(this.word_hash);
      } else {
        return search_utils.getCountfromModel(model_item);
      }
    }
  }, {
    key: '_shouldCreatePrediction',
    value: function _shouldCreatePrediction(model_item) {

      return this._multi_prediction && !this._isStopWord(model_item) && !this.equalRemaingWord(model_item);
    }
  }, {
    key: '_isStopWord',
    value: function _isStopWord(model_item) {
      var word = this._getword(model_item, this.word_hash);
      if (!word) {
        return false;
      }
      return this._loader.isStopWord(word);
    }
  }]);

  return PredictonCreator;
}();

module.exports = PredictonCreator;

},{"./consts":36,"./indices":41,"./input_parser":42,"./prediction":45,"./utils":52}],47:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PredictionList = function () {
  function PredictionList(list, parsed_input) {
    _classCallCheck(this, PredictionList);

    this.parsed_input = parsed_input;
    this._list = list || [];
  }

  _createClass(PredictionList, [{
    key: "isForInput",
    value: function isForInput(input, previous_input) {
      if (this.parsed_input.isPrevious) {
        return previous_input !== undefined && this.parsed_input.original_text === previous_input.original_text;
      } else {
        return this.parsed_input.original_text === input.original_text;
      }
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this._list.length === 0;
    }
  }, {
    key: "predictions",
    get: function get() {
      return this._list;
    }
  }]);

  return PredictionList;
}();

module.exports = PredictionList;

},{}],48:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loader = require('./loader');
var rh = require("../../../../lib/rh");
var _ = rh._;
var HistoryPredictor = require('./history_predictor');
var NgramPredictor = require('./ngram_predictor');
var GeneralPredictor = require('./general_predictor');
var Corrector = require('./corrector');
var search_consts = require('./consts');

//this.processResult.bind(this)

var PredictorsCreator = function () {
  function PredictorsCreator(history_reader, processResultFn) {
    _classCallCheck(this, PredictorsCreator);

    this._history_reader = history_reader;
    this._processResultFn = processResultFn;
  }

  _createClass(PredictorsCreator, [{
    key: '_createLoaders',
    value: function _createLoaders() {
      return _.map(this.projectPaths, function (path) {
        return new Loader(path);
      });
    }
  }, {
    key: 'createPredictors',
    value: function createPredictors(addFn, prevAddFn, addCorrectorFn) {
      var _this = this;

      this._addFn = addFn;
      this._prevaddFn = prevAddFn;
      this._addCorrectorFn = addCorrectorFn;
      var history_predictor = new HistoryPredictor(this._history_reader, this._processResultFn);
      this._addFn(history_predictor);

      var loaders = this._createLoaders();
      _.each(loaders, function (loader) {
        loader.init(_this.addPredictors.bind(_this));
      });
    }
  }, {
    key: 'addPredictors',
    value: function addPredictors(loader) {
      for (var i = 1; i <= loader.nGram; i++) {

        var ngp = new NgramPredictor({ loader: loader, level: i, callback: this._processResultFn });
        ngp.init();
        this._addFn(ngp);
      }
      for (var _i = 1; _i <= search_consts.previousnGram; _i++) {
        var _ngp = new NgramPredictor({ loader: loader, level: _i, callback: this._processResultFn, previous: true });
        _ngp.init();
        this._prevaddFn(_ngp);
      }

      var general_predictor = new GeneralPredictor(this._processResultFn, loader);
      this._addFn(general_predictor);

      var corrector = new Corrector(loader, this._processResultFn);
      this._addCorrectorFn(corrector);
    }
  }, {
    key: 'projectPaths',
    get: function get() {
      return rh.model.get(rh.consts('KEY_PROJECT_LIST'));
    }
  }]);

  return PredictorsCreator;
}();

module.exports = PredictorsCreator;

},{"../../../../lib/rh":24,"./consts":36,"./corrector":37,"./general_predictor":38,"./history_predictor":39,"./loader":43,"./ngram_predictor":44}],49:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;
var consts = rh.consts;
var history_reader = require('./history_reader');
var InputParser = require('./input_parser');
var PredictonMerger = require('../common/merger');
var TopicCounter = require('./topic_counter');
var search_utils = require('./utils');
var search_consts = require('./consts');
var Seamaphore = require('./../../../common/counting_seamaphore');
var PredictorCreator = require('./predictors_creator');
var SearchHandler = require('../topic/handler');

var max_predictions = 5;

var SearchController = function () {
  function SearchController(widget) {
    var _this = this;

    _classCallCheck(this, SearchController);

    this.widget = widget;
    this._predictors = [];
    this._correctors = [];
    this._previous_predictors = [];
    this.initHandleKeyHash();
    this.max_predictions = max_predictions;
    this.predicton_merger = new PredictonMerger([]);
    widget.model.subscribe(consts('KEY_PROJECT_LIST'), function () {
      _this.init();
    });
    this.search_handler = new SearchHandler(widget);
  }

  _createClass(SearchController, [{
    key: 'init',
    value: function init() {
      var history_list = rh.storage.fetch(consts('PREV_SEARCH_KEY'));
      history_reader.initHistory(history_list);
      this.create_predictors();
      this.widget.model.csubscribe('EVT_CLOSE_SEARCH_SUGGESTION', this.closeSuggestions.bind(this));
      this.widget.model.csubscribe('EVT_SEARCH_TERM', this.search.bind(this));
    }
  }, {
    key: 'search',
    value: function search() {
      var text = this.widget.get(consts('KEY_SEARCH_TERM'));
      this.search_handler.showSearchResults(text);
    }
  }, {
    key: 'create_predictors',
    value: function create_predictors() {
      this._predictors = [];
      var predictor_creator = new PredictorCreator(history_reader, this.processResult.bind(this));
      predictor_creator.createPredictors(this.addPredictor.bind(this), this.addPrevPredictor.bind(this), this.addCorrector.bind(this));
    }
  }, {
    key: 'addPredictor',
    value: function addPredictor(predictor) {
      this._predictors.push(predictor);
    }
  }, {
    key: 'addPrevPredictor',
    value: function addPrevPredictor(predictor) {
      this._previous_predictors.push(predictor);
    }
  }, {
    key: 'addCorrector',
    value: function addCorrector(corrector) {
      this._correctors.push(corrector);
    }
  }, {
    key: 'showSuggestions',
    value: function showSuggestions(keyEvt) {
      this._initSuggestions(keyEvt);
      this._calculateSugguestions();
    }
  }, {
    key: '_initSuggestions',
    value: function _initSuggestions(keyEvt) {
      this._initResult();
      this._initInputs(keyEvt);
      this._resutSeamaphore = new Seamaphore(this.onResultComplete.bind(this));
    }
  }, {
    key: '_initInputs',
    value: function _initInputs(keyEvt) {
      this.parsed_input = new InputParser(keyEvt.text, false, keyEvt.selStart, false);
      if (search_utils.isPrevious(keyEvt)) {
        this._previous_input = new InputParser(keyEvt.text, false, keyEvt.selStart, true);
      }
    }
  }, {
    key: '_calculateSugguestions',
    value: function _calculateSugguestions() {
      var _this2 = this;

      this._resutSeamaphore.wait(this._predictorCount());
      _.each(this._predictors, function (predictor) {
        predictor.getPredictions(_this2.parsed_input);
      });
      if (this._previous_input) {
        _.each(this._previous_predictors, function (predictor) {
          predictor.getPredictions(_this2._previous_input);
        });
      }
    }
  }, {
    key: '_clearPredictors',
    value: function _clearPredictors() {
      _.each(this._predictors, function (predictor) {
        predictor.clear();
      });
      _.each(this._previous_predictors, function (predictor) {
        predictor.clear();
      });
      _.each(this._correctors, function (corrector) {
        corrector.clear();
      });
    }
  }, {
    key: '_predictorCount',
    value: function _predictorCount() {
      var count = this._predictors.length;
      if (this._previous_input) {
        count += this._previous_predictors.length;
      }
      return count;
    }
  }, {
    key: '_initResult',
    value: function _initResult() {
      if (this.predicton_merger) {
        this.predicton_merger.clear();
      }
      this.widget.publish("selected", undefined);
      this._previous_input = undefined;
      this._computing_correction = false;
    }
  }, {
    key: '_clearResult',
    value: function _clearResult() {
      this._resetMovement();
      this._previous_input = undefined;
      this.parsed_input = undefined;
      this._resutSeamaphore = undefined;
      this._clearPredictors();
    }
  }, {
    key: 'isSuggestionsOpen',
    value: function isSuggestionsOpen() {
      var predictions = this.widget.get(consts("SEARCH_RESULTS_KEY"));
      return predictions && predictions.length > 0;
    }
  }, {
    key: 'processResult',
    value: function processResult(predictionList, loader) {
      if (!predictionList.isForInput(this.parsed_input, this._previous_input)) {
        return;
      }
      if (!predictionList.isEmpty()) {
        this.predicton_merger.merge(predictionList.predictions);
        var counter = new TopicCounter(loader);
        this.predictions = counter.computeCounts(this.predictions, this.parsed_input);
      }
      this._resutSeamaphore.signal();
    }
  }, {
    key: 'onResultComplete',
    value: function onResultComplete() {
      if (this.needCorrection()) {
        this.doCorrection();
      } else {
        this.predictions.splice(this.max_predictions);
        this.widget.publish(consts("SEARCH_RESULTS_KEY"), this.predictions);
        this._clearResult();
      }
    }
  }, {
    key: 'needCorrection',
    value: function needCorrection() {
      return !this._computing_correction && this.predictions.length === 0 && this.parsed_input.trimmedText !== "";
    }
  }, {
    key: 'doCorrection',
    value: function doCorrection() {
      var _this3 = this;

      this._computing_correction = true;
      this._resutSeamaphore = new Seamaphore(this.onResultComplete.bind(this));
      this._resutSeamaphore.wait(this._correctors.length);
      _.each(this._correctors, function (corrector) {
        corrector.getCorrections(_this3.parsed_input);
      });
    }
  }, {
    key: 'canDelete',
    value: function canDelete(id) {
      var prediction = this.predictions[id];
      if (prediction === undefined) {
        return false;
      }
      return prediction.source === search_consts.PREDICTOR_SOURCE_ID.HISTORY_PREDICTOR;
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(id) {
      var prediction = this.predictions[id];
      this._deleteFromHistory(prediction.term);
      this._removePrediction(id);
      this.widget.publish("history_deleted", true);
    }
  }, {
    key: '_removePrediction',
    value: function _removePrediction(id) {
      this.predictions.splice(id, 1);
      this.widget.publish(consts("SEARCH_RESULTS_KEY"), this.predictions);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(id) {
      var history_deleted = this.widget.get("history_deleted");
      if (history_deleted) {
        return;
      }
      var prediction = this.predictions[id];
      if (prediction === undefined) {
        return;
      }

      var new_text = prediction.term;
      this._addToHistory(new_text);
      this.widget.publish(consts('KEY_SEARCH_TERM'), new_text);
      this.widget.publish(rh.consts('EVT_SEARCH_TERM'), true);
    }
  }, {
    key: 'handleFocusOut',
    value: function handleFocusOut(key, focus_key) {
      var history_deleted = this.widget.get("history_deleted");
      if (!history_deleted) {
        this.widget.publish(key, false);
      } else {
        this.widget.publish("history_deleted", false);
        this.widget.publish(focus_key, true);
      }
    }
  }, {
    key: 'getFirstSuggestionIndex',
    value: function getFirstSuggestionIndex(length, down) {
      return down ? 0 : length - 1;
    }
  }, {
    key: 'getNextSuggestionIndex',
    value: function getNextSuggestionIndex(curr_selected, length, down) {
      var move = down ? 1 : length - 1;
      curr_selected = curr_selected === undefined ? 0 : curr_selected;
      curr_selected = (curr_selected + move) % length;
      return curr_selected;
    }
  }, {
    key: 'handleArrowKey',
    value: function handleArrowKey(keyEvt) {
      var curr_selected = this.widget.get("selected");
      var down = keyEvt.keyCode === 40;
      var length = this.getPredictionsLength();
      if (length > 0) {
        if (curr_selected === undefined) {
          curr_selected = this.getFirstSuggestionIndex(length, down);
        } else {
          curr_selected = this.getNextSuggestionIndex(curr_selected, length, down);
        }
        this.widget.publish("selected", curr_selected);
        var new_text = this.getNewInputText(this.results[curr_selected]);
        this.widget.publish(consts('KEY_SEARCH_TERM'), new_text);
      }
    }
  }, {
    key: 'getNewInputText',
    value: function getNewInputText(prediction) {
      return prediction.term;
    }
  }, {
    key: 'getPredictionsLength',
    value: function getPredictionsLength() {
      var length = void 0;
      this.results = this.widget.get(consts("SEARCH_RESULTS_KEY"));
      if (this.results) {
        length = this.results.length;
      }
      return length;
    }
  }, {
    key: 'closeSuggestions',
    value: function closeSuggestions() {
      this._clearResult();
      this.widget.publish("selected", undefined);
      this.original_parsed_input = undefined;
      this.widget.publish(consts("SEARCH_RESULTS_KEY"), []);
    }
  }, {
    key: '_deleteFromHistory',
    value: function _deleteFromHistory(text) {
      history_reader.delete(text);
      this._saveHistory();
    }
  }, {
    key: '_addToHistory',
    value: function _addToHistory(text) {
      if (text && text !== "") {
        history_reader.add({
          text: text.trim(),
          count: 10
        }); // TODO change
        this._saveHistory();
      }
    }
  }, {
    key: '_saveHistory',
    value: function _saveHistory() {
      rh.storage.persist(consts('PREV_SEARCH_KEY'), history_reader.getHistory());
    }
  }, {
    key: 'handleShowSuggestion',
    value: function handleShowSuggestion(keyEvt) {
      if (keyEvt.text === "" || search_utils.shouldShowSuggestion(keyEvt) === false) {
        this.closeSuggestions();
      } else {
        this.showSuggestions(keyEvt);
      }
    }
  }, {
    key: 'handleReturn',
    value: function handleReturn(keyEvt) {
      if (keyEvt.text !== "") {
        this._addToHistory(keyEvt.text);
        this.closeSuggestions();
        this.widget.publish(consts('KEY_SEARCH_TERM'), keyEvt.text);
        this.widget.publish(consts('EVT_SEARCH_TERM'), true);
      }
    }
  }, {
    key: '_isMovementKey',
    value: function _isMovementKey(keyCode) {
      return [38, 39, 40].indexOf(keyCode) >= 0;
    }
  }, {
    key: '_resetMovement',
    value: function _resetMovement() {
      this.original_parsed_input = undefined;
      this.widget.publish("selected", undefined);
    }
  }, {
    key: '_isHandlingCursorMove',
    value: function _isHandlingCursorMove() {
      var curr_selected = this.widget.get("selected");
      return curr_selected !== undefined;
    }
  }, {
    key: 'initHandleKeyHash',
    value: function initHandleKeyHash() {
      this.handle_key_hash = {
        up: this.handleArrowKey.bind(this),
        down: this.handleArrowKey.bind(this),
        backspace: this.handleBackSpace.bind(this),
        return: this.handleReturn.bind(this),
        default: this.handleShowSuggestion.bind(this),
        escape: this.handleEscape.bind(this),
        right: this.handleRight.bind(this)
      };
    }
  }, {
    key: 'handleRight',
    value: function handleRight(keyEvt) {
      if (!this._isHandlingCursorMove()) {
        this._resetMovement();
        return this.handleShowSuggestion(keyEvt);
      }
      if (search_utils.shouldAppendSpace(keyEvt)) {
        keyEvt.text += " ";
        keyEvt.selStart += 1;
        this.widget.publish(consts('KEY_SEARCH_TERM'), keyEvt.text);
      }
      this._resetMovement();
      this.handleShowSuggestion(keyEvt);
      return false;
    }
  }, {
    key: 'handleBackSpace',
    value: function handleBackSpace(keyEvt) {
      return this.handleShowSuggestion(keyEvt);
    }
  }, {
    key: 'handleEscape',
    value: function handleEscape() {
      this.closeSuggestions();
    }
  }, {
    key: 'handleKey',
    value: function handleKey(event) {

      var keyCode = event.keyCode;
      var keyEvt = {
        keyCode: keyCode,
        selStart: event.target.selectionStart,
        text: event.target.value
      };
      if (!this._isMovementKey(keyCode)) {
        this._resetMovement();
      }
      var index = _.getKeyIndex(keyCode);

      if (index === undefined) {
        return true;
      }
      var handleFn = this.handle_key_hash[index];
      if (handleFn) {
        return handleFn(keyEvt);
      }
    }
  }, {
    key: 'predictions',
    get: function get() {
      return this.predicton_merger.items;
    },
    set: function set(predictions) {
      this.predicton_merger = new PredictonMerger(predictions);
    }
  }]);

  return SearchController;
}();

rh.controller('SearchController', SearchController);

},{"../../../../lib/rh":24,"../common/merger":33,"../topic/handler":53,"./../../../common/counting_seamaphore":25,"./consts":36,"./history_reader":40,"./input_parser":42,"./predictors_creator":48,"./topic_counter":51,"./utils":52}],50:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SortedSet = function () {
  function SortedSet(set) {
    _classCallCheck(this, SortedSet);

    this._set = set || [];
    this._initialised = false;
  }

  _createClass(SortedSet, [{
    key: "intersect",
    value: function intersect(other) {
      if (!Array.isArray(other)) {
        other = other.set;
      }
      var new_set = [];
      var count = 0;
      var i = 0;var j = 0;
      for (; i < this._set.length && j < other.length;) {
        if (this._set[i] < other[j]) {
          i++;
        } else if (this._set[i] > other[j]) {
          j++;
        } else {
          new_set[count++] = this._set[i];
          i++;j++;
        }
      }
      this._set = new_set;
    }
  }, {
    key: "intersectOrSet",
    value: function intersectOrSet(other) {
      if (this._initialised) {
        this.intersect(other);
      } else {
        if (!Array.isArray(other)) {
          other = other.set;
        }
        this.set = other;
        this._initialised = true;
      }
    }
  }, {
    key: "intersectCount",
    value: function intersectCount(other) {
      if (!Array.isArray(other)) {
        other = other.set;
      }
      var count = 0;
      var i = 0;
      var j = 0;
      for (; i < this._set.length && j < other.length;) {
        if (this._set[i] < other[j]) {
          i++;
        } else if (this._set[i] > other[j]) {
          j++;
        } else {
          count++;
          i++;j++;
        }
      }
      return count;
    }
  }, {
    key: "set",
    set: function set(_set) {
      this._set = _set || [];
    },
    get: function get() {
      return this._set;
    }
  }, {
    key: "length",
    get: function get() {
      return this._set.length;
    }
  }]);

  return SortedSet;
}();

module.exports = SortedSet;

},{}],51:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SortedSet = require('./sorted_set');
var Parser = require('./input_parser');
var Prediction = require('./prediction');
var rh = require("../../../../lib/rh");
var _ = rh._;
var INDEX = require("./indices");

var TopicCounter = function () {
  function TopicCounter(loader) {
    _classCallCheck(this, TopicCounter);

    this.newPredictions = [];
    this.predictionSet = new SortedSet();
    this.inputSet = new SortedSet();
    this._loader = loader;
  }

  _createClass(TopicCounter, [{
    key: 'computeCounts',
    value: function computeCounts(predictions, parsed_input) {
      var _this = this;

      this.newPrediction = [];
      this.parsed_input = parsed_input;
      _.each(predictions, function (prediction) {
        _this.addUpdatedPrediction(prediction);
      });
      return this.newPredictions;
    }
  }, {
    key: 'addUpdatedPrediction',
    value: function addUpdatedPrediction(prediction) {
      var count = 1;
      if (this._loader !== undefined) {
        this.createPredictionSet(prediction);
        count = this.computeTopicCount();
      }
      if (count > 0) {
        var newPrdiction = new Prediction(prediction.term, prediction.probability, count, prediction.source);
        this.newPredictions.push(newPrdiction);
      }
    }
  }, {
    key: 'computeTopicCount',
    value: function computeTopicCount() {
      return this.predictionSet.set.length;
    }
  }, {
    key: 'createPredictionSet',
    value: function createPredictionSet(prediction) {
      var _this2 = this;

      this.predictionSet = new SortedSet();
      var parsed_prediction = new Parser(prediction.term, true);
      _.each(parsed_prediction.words, function (word, index) {
        _this2._addWordToSet(word, _this2.predictionSet, index);
      });
    }
  }, {
    key: 'initInput',
    value: function initInput(parsed_input) {
      var _this3 = this;

      this.inputSet = new SortedSet();
      _.each(parsed_input.words, function (word) {
        _this3._addWordToSet(word, _this3.inputSet);
      });
    }
  }, {
    key: '_addWordToSet',
    value: function _addWordToSet(word, set) {
      if (this._loader.isStopWord(word)) {
        return;
      }
      var wordHash = this._loader._getHashForWord(word);
      if (wordHash && wordHash.length > INDEX.MAP.TOPICS) {
        set.intersectOrSet(wordHash[INDEX.MAP.TOPICS]);
      }
    }
  }]);

  return TopicCounter;
}();

module.exports = TopicCounter;

},{"../../../../lib/rh":24,"./indices":41,"./input_parser":42,"./prediction":45,"./sorted_set":50}],52:[function(require,module,exports){
(function (global){
'use strict';

var INDEX = require('./indices');

var _exports = {
  getNextModel: function getNextModel(model_item) {

    if (model_item && Array.isArray(model_item) && model_item.length > INDEX.MODEL.NEXT_MODEL) {
      return model_item[INDEX.MODEL.NEXT_MODEL];
    }
  },
  getFirstLevelNextModel: function getFirstLevelNextModel(model_item, bprevious) {
    if (model_item && Array.isArray(model_item)) {
      if (!bprevious && model_item.length > INDEX.FIRST_PREDICTION.NEXT) {
        return model_item[INDEX.FIRST_PREDICTION.NEXT];
      }
      if (bprevious && model_item.length > INDEX.FIRST_PREDICTION.PREVIOUS) {
        return model_item[INDEX.FIRST_PREDICTION.PREVIOUS];
      }
    }
  },

  getFirstPrediction: function getFirstPrediction(model_item) {
    if (model_item && Array.isArray(model_item) && model_item.length > 0 && Array.isArray(model_item[0])) {
      return model_item[0];
    }
  },
  compareNoCase: function compareNoCase(word1, word2) {
    if (global.compare !== undefined) {
      return global.compare(word1, word2);
    } else {
      return word1 === word2 ? 0 : -1;
    }
  },
  hammingDistance: function hammingDistance(word1, word2) {
    var minLength = Math.min(word1.length, word2.length);
    var hammingDistance = 0;
    for (var i = 0; i < minLength; i++) {
      if (word1[i] !== word2[i]) {
        hammingDistance++;
      }
    }
    if (word1.length > minLength) {
      hammingDistance += word1.length - minLength;
    }
    return hammingDistance;
  },
  isPrevious: function isPrevious(keyEvt) {
    return keyEvt.selStart < keyEvt.text.length;
  },
  shouldShowSuggestion: function shouldShowSuggestion(keyEvt) {
    var text = keyEvt.text;
    var selStart = keyEvt.selStart;
    if (selStart === 0 || selStart === text.length) {
      return true;
    }
    if (text.length > 0) {
      // if cursor is before the end
      return text[selStart] === ' ' || text[selStart - 1] === ' ';
    }
    return false;
  },
  shouldAppendSpace: function shouldAppendSpace(keyEvt) {
    var text = keyEvt.text;
    var selStart = keyEvt.selStart;
    if (text.length > 0 && selStart === text.length) {
      //cusror at last
      return text[text.length - 1] !== " ";
    }
    return false;
  },
  getSafeElement: function getSafeElement(arr, index) {
    if (arr && Array.isArray(arr) && arr.length > index) {
      return arr[index];
    }
  },
  getCountfromModel: function getCountfromModel(model_item) {
    if (Array.isArray(model_item) && model_item.length > INDEX.MODEL.COUNT) {
      return model_item[INDEX.MODEL.COUNT];
    }
    return 0;
  },
  getCountfromWordHash: function getCountfromWordHash(word_hash) {
    if (Array.isArray(word_hash) && word_hash.length > INDEX.MAP.COUNT) {
      return word_hash[INDEX.MAP.COUNT];
    }
    return 0;
  }
};

module.exports = _exports;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./indices":41}],53:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryProcessor = require('./query/processor');
var rh = require("../../../../lib/rh");
var _ = rh._;
var consts = rh.consts;
var Loader = require('./query/loader');
var ResultMerger = require('../common/merger');
var Seamaphore = require('../../../common/counting_seamaphore');
var SearchResult = require('./result');

module.exports = function () {
  function SearchHandler(widget) {
    var _this = this;

    var max_results = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

    _classCallCheck(this, SearchHandler);

    this.widget = widget;
    this.initDone = false;
    this.max_results = max_results;
    this.queryProcessors = [];
    this.merger = new ResultMerger([]);
    this._resutSeamaphore = new Seamaphore(this.onResultComplete.bind(this));
    this.widget.model.subscribe(consts('KEY_PROJECT_LIST'), function () {
      _this.init();
    });
  }

  _createClass(SearchHandler, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      if (!this.initDone) {
        var loaders = this._createLoaders();
        _.each(loaders, function (loader, id) {
          loader.init(id, _this2.addProcessors.bind(_this2));
        });
        this.initDone = true;
      }
    }
  }, {
    key: 'addProcessors',
    value: function addProcessors(loader) {
      this.queryProcessors.push(new QueryProcessor(loader));
    }
  }, {
    key: '_createLoaders',
    value: function _createLoaders() {
      return _.map(this.projectPaths, function (path) {
        return new Loader(path);
      });
    }
  }, {
    key: 'showSearchResults',
    value: function showSearchResults(text) {
      var _this3 = this;

      var isNewQuery = _.find(this.queryProcessors, function (processor) {
        return processor.isNewQuery(text, _this3.searchOpts);
      });
      if (isNewQuery) {
        this.merger = new ResultMerger([]);
        this._resutSeamaphore = new Seamaphore(this.onResultComplete.bind(this));
        this._resutSeamaphore.wait(this.processorCount);
        //rh.model.publish(rh.consts('EVT_SEARCH_IN_PROGRESS'), true, {sync: true});
        //rh.model.publish(rh.consts('KEY_SEARCH_PROGRESS'), 0, {sync: true});
        _.each(this.queryProcessors, function (processor) {
          processor.search(text, _this3.searchOpts, _this3.topicCallback.bind(_this3), _this3.onSearchResults.bind(_this3));
          var glossaryResult = processor.searchGlossary(text);
          _this3.processGlossaryResults(text, glossaryResult);
        });
      }
    }
  }, {
    key: 'onSearchResults',
    value: function onSearchResults(text, searchResult) {
      this.processTopicsResults(text, searchResult);
      this._resutSeamaphore.signal();
    }
  }, {
    key: 'onResultComplete',
    value: function onResultComplete() {
      this.widget.publish(rh.consts('EVT_SEARCH_IN_PROGRESS'), false, {
        sync: true
      });
      var resultsParams = _.mapToEncodedString(_.extend({
        rhsearch: this.text /*, { rhsyns: searchResults.syns }*/ }));
      this.widget.publish(consts('KEY_SEARCH_RESULT_PARAMS'), resultsParams);
      this.widget.publish('.p.searchresults', this.merger.items);
    }
  }, {
    key: 'topicCallback',
    value: function topicCallback(id, summary, url) {
      this.widget.publish('.p.searchsummary' + id, summary);
      this.widget.publish('.p.searchurl' + id, url);
    }
  }, {
    key: 'processGlossaryResults',
    value: function processGlossaryResults(text, glossary_result) {
      var term = glossary_result && Object.keys(glossary_result)[0];
      this.widget.publish(consts('KEY_GLOSSARY_RESULT_TERM'), term);
      this.widget.publish(consts('KEY_GLOSSARY_RESULT'), glossary_result[term]);
    }
  }, {
    key: 'processTopicsResults',
    value: function processTopicsResults(text, topicResults) {
      this.text = text;
      var processedResult = _.map(topicResults, function (result) {
        return new SearchResult(result);
      });
      this.merger.merge(processedResult);
    }
  }, {
    key: 'projectPaths',
    get: function get() {
      return rh.model.get(rh.consts('KEY_PROJECT_LIST'));
    }
  }, {
    key: 'processorCount',
    get: function get() {
      return this.queryProcessors.length;
    }
  }, {
    key: 'searchOpts',
    get: function get() {
      return {
        andSearch: rh.model.get(rh.consts('KEY_AND_SEARCH')) === '1',
        cbt: rh.model.cget('KEY_TAG_EXPRESSION'),
        origin: rh.model.cget('KEY_TOPIC_ORIGIN')
      };
    }
  }]);

  return SearchHandler;
}();

},{"../../../../lib/rh":24,"../../../common/counting_seamaphore":25,"../common/merger":33,"./query/loader":57,"./query/processor":58,"./result":61}],54:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function SearchMetadata(data) {
    _classCallCheck(this, SearchMetadata);

    this.data = JSON.parse(data);
  }

  _createClass(SearchMetadata, [{
    key: "getTopicData",
    value: function getTopicData(id) {
      return this.topicData[id];
    }
  }, {
    key: "getTopicSummary",
    value: function getTopicSummary(id) {
      return this.topicData[id] && this.topicData[id].summary;
    }
  }, {
    key: "getTopicNextId",
    value: function getTopicNextId(id) {
      return this.topicData[id] && this.topicData[id].next;
    }
  }, {
    key: "settings",
    get: function get() {
      return this.data.settings;
    }
  }, {
    key: "topicData",
    get: function get() {
      return this.data.metadata;
    }
  }, {
    key: "context",
    get: function get() {
      return this.settings.context;
    }
  }, {
    key: "fields",
    get: function get() {
      return this.settings.fields;
    }
  }]);

  return SearchMetadata;
}();

},{}],55:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../../lib/rh");
var _ = rh._;

module.exports = function () {
  function CbtFilter(fields, origin, tagExprs) {
    _classCallCheck(this, CbtFilter);

    this.fileds = fields;
    this.origin = origin;
    this.tagExprs = tagExprs;
  }

  _createClass(CbtFilter, [{
    key: "filter",
    value: function filter(itemList) {
      var _this = this;

      return _.reduce(itemList, function (filtered, item) {
        return filtered || _this._isFilterd(item);
      }, false);
    }
  }, {
    key: "_isFilterd",
    value: function _isFilterd(item) {
      var cbt = this.getCbt(item);
      return cbt && this._isFilteredCbt(cbt);
    }
  }, {
    key: "_isFilteredCbt",
    value: function _isFilteredCbt(cbt) {
      var _this2 = this;

      var ids = cbt.split(';');
      return !_.any(ids, function (id) {
        return _.evalTagExpression(id, _this2.tagExprs, _this2.origin);
      });
    }
  }, {
    key: "getCbt",
    value: function getCbt(item) {
      return item && item.attributes && item.attributes.length > 0 && _.map(item.attributes, function (attr) {
        return attr.value;
      }).join(";");
    }
  }]);

  return CbtFilter;
}();

},{"../../../../../lib/rh":24}],56:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lunr = require('lunr');
var Synonymns = require('../../common/synonymns');
var rh = require("../../../../../lib/rh");
var _ = rh._;

module.exports = function () {
  function SearchDb(content, settings) {
    _classCallCheck(this, SearchDb);

    this.init(content, settings);
  }

  _createClass(SearchDb, [{
    key: 'init',
    value: function init(content) {
      var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.settings = settings;
      this.processSyn();
      this.registerFunctions();
      this.setTokenizer();
      this.db = lunr.Index.load(content);
    }
  }, {
    key: 'registerFunctions',
    value: function registerFunctions() {
      var pipelineFunction = this.replaceSynonymn.bind(this);
      var addQueryFunction = this.addQuery.bind(this);

      lunr.Pipeline.registerFunction(pipelineFunction, 'replaceSynonymn');
      lunr.Pipeline.registerFunction(addQueryFunction, 'addQuery');
    }
  }, {
    key: 'setTokenizer',
    value: function setTokenizer() {
      lunr.tokenizer.separator = /[\s\.\-\'\,\n;\:\\\/\"]+/;
    }
  }, {
    key: 'processSyn',
    value: function processSyn() {
      var synonymns_words = this.settings && this.settings.synonyms || {};
      var synonyms = new Synonymns(synonymns_words);
      this.settings.rootWords = synonyms.rootWords;
    }
  }, {
    key: 'addQuery',
    value: function addQuery(token) {
      var word = token.toString();
      this.queryWords.push(word);
      this.queryWords = _.unique(this.queryWords);
      return token;
    }
  }, {
    key: 'replaceSynonymn',
    value: function replaceSynonymn(token) {
      var _this = this;

      var word = token.toString();
      var root = this.settings && this.settings.rootWords && this.settings.rootWords[word];
      if (root && root !== word) {
        return token.update(function () {
          return _this.settings.rootWords[word];
        });
      } else {
        return token;
      }
    }
  }, {
    key: 'addStopWords',
    value: function addStopWords(index, stopWords) {
      if (stopWords) {
        var stopWordFilter = lunr.generateStopWordFilter(stopWords);
        index.pipeline.before(lunr.stopWordFilter, stopWordFilter);
        index.pipeline.remove(lunr.stopWordFilter);
      }
    }
  }, {
    key: 'search',
    value: function search(query) {
      var _this2 = this;

      this.queryWords = [];
      var params = query.getParams(this.isStopWord.bind(this)).trim();
      var search_results = rh._.isEmptyString(params) ? [] : this.db.search(params);
      return query.opts ? _.filter(search_results, function (result) {
        return _this2.match(result, query.opts);
      }) : search_results;
    }
  }, {
    key: 'match',
    value: function match(result, opts) {
      var _this3 = this;

      var retVal = true;
      if (opts.andSearch) {
        var matchingWords = result && result.matchData.metadata || [];
        _.each(this.queryWords, function (word) {
          if (!matchingWords[word] && !_this3.isStopWord(word)) {
            retVal = false;
          }
        });
      }
      return retVal;
    }
  }, {
    key: 'isStopWord',
    value: function isStopWord(word) {
      return this.settings.stopWords.indexOf(word.toLowerCase()) !== -1;
    }
  }, {
    key: 'searchGlossary',
    value: function searchGlossary(query) {
      var _this4 = this;

      var glossary = this.settings && this.settings.glossary || {};
      var queryTokens = this.getRootTokens(query);
      var gossaryResults = _.reduce(glossary, function (result, definition, term) {
        var gloTokens = _this4.getRootTokens(term);
        if (queryTokens.length === gloTokens.length && _this4.matchTokens(queryTokens, gloTokens)) {
          result[term] = definition;
        }
        return result;
      }, {});
      return gossaryResults;
    }
  }, {
    key: 'matchTokens',
    value: function matchTokens(set1, set2) {
      var matched = true;
      _.each(set1, function (term1, index) {
        if (term1 !== set2[index]) {
          matched = false;
        }
      });
      return matched;
    }
  }, {
    key: 'getRootTokens',
    value: function getRootTokens(text) {
      var _this5 = this;

      var tokens = lunr.tokenizer(text);
      return _.map(tokens, function (token) {
        var word = token.toString();
        return _this5.settings.rootWords[word] || word;
      });
    }
  }, {
    key: 'export',
    value: function _export() {
      return this.db.toJSON();
    }
  }]);

  return SearchDb;
}();

},{"../../../../../lib/rh":24,"../../common/synonymns":35,"lunr":23}],57:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../../lib/rh");
var _ = rh._;
var Paths = require('../../common/paths');
module.exports = function () {
  function SearchLoader() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    _classCallCheck(this, SearchLoader);

    this._paths = new Paths(path);
  }

  _createClass(SearchLoader, [{
    key: "init",
    value: function init(id, callbackFn) {
      this.id = id;
      callbackFn(this);
    }
  }, {
    key: "loadDB",
    value: function loadDB(callbackFn) {
      var path = this._paths.getSearchDbFilePath();
      _.loadScript(path, true, function () {
        var data = _.exports();
        if (callbackFn) {
          callbackFn(data);
        }
      }, true);
    }
  }, {
    key: "getId",
    value: function getId(id) {
      return this.id + "_" + id;
    }
  }, {
    key: "getUrl",
    value: function getUrl(url) {
      return this._paths._getRelativePath(url);
    }
  }, {
    key: "loadMetaData",
    value: function loadMetaData(callbackFn) {
      var path = this._paths.getMetadataFilePath();
      _.loadScript(path, true, function () {
        var data = _.exports();
        if (callbackFn) {
          callbackFn(data);
        }
      }, true);
    }
  }, {
    key: "loadTextData",
    value: function loadTextData(query, id, callbackFn) {
      var path = this._paths.getTextFilePath(id);
      _.loadScript(path, true, function () {
        var data = _.exports();
        if (callbackFn) {
          callbackFn(query, id, data);
        }
      }, true);
    }
  }]);

  return SearchLoader;
}();

},{"../../../../../lib/rh":24,"../../common/paths":34}],58:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchDb = require('./db');
var Query = require('./query');
var Summary = require('./summary');
var rh = require("../../../../../lib/rh");
var _ = rh._;
var Seamaphore = require('../../../../common/counting_seamaphore');
var TextMerger = require('../text_merger');
var SearchMetadata = require('../metadata');
var CbtFilter = require("./cbt");

module.exports = function () {
  function SearchProcessor(loader) {
    var _this = this;

    _classCallCheck(this, SearchProcessor);

    this.loader = loader;
    this.metadataLoaded = this.dbLoaded = false;
    this.loader.loadDB(function (dbContent) {
      _this.initDB(dbContent);
    });
    this.loader.loadMetaData(function (metadata) {
      _this.initMetadata(metadata);
    });
  }

  _createClass(SearchProcessor, [{
    key: 'initMetadata',
    value: function initMetadata(metadata) {
      this.metadataLoaded = true;
      this.metadata = new SearchMetadata(metadata);

      if (!this.init && this.dbContent) {
        this.initDB(this.dbContent);
        this.dbContent = null;
      }
    }
  }, {
    key: 'initDB',
    value: function initDB(dbContent) {
      if (this.metadataLoaded) {
        this.db = new SearchDb(dbContent, this.metadata.settings);
        this.init = true;
        if (this.waiting) {
          this.waiting = false;
          this.getResults();
        }
      } else {
        this.dbContent = dbContent;
      }
    }
  }, {
    key: 'topicsLoaded',
    value: function topicsLoaded() {
      if (this.exactSearch) {
        this.filter();
      }
    }
  }, {
    key: 'isNewQuery',
    value: function isNewQuery(text, opts) {
      var query = this.buildQuery(text, opts);
      return !this.query || !this.query.isEqual(query);
    }
  }, {
    key: 'search',
    value: function search(text, opts, callback, resultsCallback) {
      var query = this.buildQuery(text, opts);
      if (this.isNewQuery(text, opts)) {
        this.text = text;
        this.seamaphore = new Seamaphore(this.topicsLoaded.bind(this));
        this.query = query;
        this.topicCallback = callback;
        this.opts = opts;
        this.summaries = {};
        this.resultsCallback = resultsCallback;
        this.exactSearch = this.query.exactMatch;
        this.getResults();
      }
    }
  }, {
    key: 'filter',
    value: function filter() {
      var _this2 = this;

      var terms = this.query.exaxctTerms;
      this.results = _.filter(this.results, function (result) {
        var topicText = _this2.resultsMetadata[result.id].topicText;
        return _this2.matchesExact(terms, topicText, result.id);
      });
      this.resultsCallback(this.query.text, this.results);
      this.processSummary();
    }
  }, {
    key: 'processSummary',
    value: function processSummary() {
      var _this3 = this;

      _.each(this.results, function (result) {
        var id = result.id;
        _this3.topicCallback(_this3.loader.getId(id), _this3.summaries[id], _this3.createUrl(id, _this3.query.exaxctTerms));
      });
    }
  }, {
    key: 'matchesExact',
    value: function matchesExact(terms, text, id) {
      var _this4 = this;

      var found = false;
      _.each(terms, function (term) {
        var idx = text.toLowerCase().indexOf(term);
        if (idx !== -1) {
          _this4.addSummary(id, text, idx, term);
          found = true;
        }
      });
      return found;
    }
  }, {
    key: 'addSummary',
    value: function addSummary(id, text, idx, term) {
      var summary = this.metadata.getTopicSummary(id);
      if (this.metadata.context && summary) {
        this.summaries[id] = summary;
      } else {
        var summaryExtractor = new Summary(this.metadata.topicData, this.metadata.context);
        this.summaries[id] = summaryExtractor.getSummaryText(text, idx, term.length, term);
      }
    }
  }, {
    key: 'getResults',
    value: function getResults() {
      if (!this.init) {
        this.waiting = true;
        return;
      }
      this.results = this.process();
      if (this.needsCorrection) {
        this.doCorrection();
      }

      if (!this.exactSearch) {
        this.resultsCallback(this.query.text, this.results);
      }
      if (this.exactSearch && this.results.length === 0) {
        this.resultsCallback(this.query.text, this.results);
      }
    }
  }, {
    key: 'doCorrection',
    value: function doCorrection() {
      this.query = this.buildQuery(this.query.text, _.extend(this.opts, { fuzzy: true }));
      this.results = this.process();
    }
  }, {
    key: 'searchGlossary',
    value: function searchGlossary(text) {
      var query = this.buildQuery(text);
      return this.processGlossary(query);
    }
  }, {
    key: 'buildQuery',
    value: function buildQuery(text, opts) {
      return new Query(text, this.metadata.settings, opts, this.filterItem.bind(this));
    }
  }, {
    key: 'process',
    value: function process() {
      var _this5 = this;

      this.resultsMetadata = {};
      var searchResults = this.db.search(this.query);
      this.seamaphore.wait(searchResults.length);
      _.each(searchResults, function (result) {
        var topicData = _this5.metadata.getTopicData(result.ref);
        _this5.resultsMetadata[result.ref] = result.matchData.metadata;
        _this5.loader.loadTextData(_this5.query, result.ref, _this5.processTopicData.bind(_this5));
        _.extend(result, topicData);
        result.id = result.ref;
        result.ref = _this5.loader.getId(result.ref);
      });
      return searchResults;
    }
  }, {
    key: 'processGlossary',
    value: function processGlossary(query) {
      return this.db.searchGlossary(query.text);
    }
  }, {
    key: 'processTopicData',
    value: function processTopicData(query, id, data) {
      if (!this.query.isEqual(query)) {
        return;
      }
      var matchResult = this.resultsMetadata[id];
      if (matchResult) {
        var wordlist = [];
        var summaryExtractor = new Summary(this.metadata.topicData, this.metadata.context);
        var summary = summaryExtractor.getSummary(id, matchResult, wordlist, data);
        summary = summary.replace(/\t+/gi, ' ').trim();
        this.resultsMetadata[id].topicText = this.createText(id, data);
        if (!this.exactSearch) {
          this.topicCallback(this.getId(id), summary, this.createUrl(id, wordlist));
        }
      }
      this.seamaphore.signal();
    }
  }, {
    key: 'createText',
    value: function createText(topicId, texts) {
      var nextTexts = this.metadata.getTopicNextId(topicId);
      var merger = new TextMerger(nextTexts, texts, this.filterId.bind(this));
      return merger.getText();
    }
  }, {
    key: 'filterId',
    value: function filterId(id) {
      var fields = this.metadata.fields;
      var fieldItem = fields[id];
      return this.filterItem(fieldItem);
    }
  }, {
    key: 'filterItem',
    value: function filterItem(fieldItem) {
      var fields = this.metadata.fields;
      var filter = new CbtFilter(fields, this.opts.origin, this.opts.cbt);
      return fieldItem && filter.filter(fieldItem);
    }
  }, {
    key: 'getId',
    value: function getId(id) {
      return this.loader.getId(id);
    }
  }, {
    key: 'createUrl',
    value: function createUrl(id, wordlist) {
      var data = this.metadata.getTopicData(id);
      var hlTerm = this.exactSearch ? '"' + wordlist[0] + '"' : wordlist;
      if (data) {
        var resultsParams = '?' + _.mapToEncodedString({
          rhsearch: this.query.originalText,
          rhhlterm: hlTerm
        });
        return '' + this.loader.getUrl(data.relUrl) + resultsParams;
      }
    }
  }, {
    key: 'needsCorrection',
    get: function get() {
      return this.results.length === 0 && this.metadata.settings.fuzzy && !this.query.exactMatch;
    }
  }]);

  return SearchProcessor;
}();

},{"../../../../../lib/rh":24,"../../../../common/counting_seamaphore":25,"../metadata":54,"../text_merger":62,"./cbt":55,"./db":56,"./query":59,"./summary":60}],59:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../../lib/rh");
var _ = rh._;
var CbtFilter = require("./cbt");
var lunr = require("lunr");
module.exports = function () {
  function SearchQuery(text, settings, opts) {
    _classCallCheck(this, SearchQuery);

    this.originalText = text.trim();
    this.text = this.originalText.toLowerCase();
    this.settings = settings || {};
    this.opts = opts || {};
    this.checkExactMatch();
  }

  _createClass(SearchQuery, [{
    key: "filter",
    value: function filter(itemList) {
      var filter = new CbtFilter(this.settings.fields, this.opts.origin, this.opts.cbt);
      return filter.filter(itemList);
    }
  }, {
    key: "getParams",
    value: function getParams(isStopWordFn) {
      this.isStopWord = isStopWordFn;
      return "" + this.fieldsParam;
    }
  }, {
    key: "isEqual",
    value: function isEqual(other) {
      if (this.text !== other.text || this._bExactMatch !== other._bExactMatch) {
        return false;
      }
      return _.isEqual(this.opts, other.opts);
    }
  }, {
    key: "getFuzzyText",
    value: function getFuzzyText(id, token, boost) {
      if (this.isStopWord(token)) {
        return '';
      }
      return this.opts.fuzzy ? id + ":" + token + "~1^" + boost : id + ":" + token + "^" + boost;
    }
  }, {
    key: "checkExactMatch",
    value: function checkExactMatch() {
      if (this._isExactMatch) {
        this._bExactMatch = true;
        this.text = this.text.substring(1, this.text.length - 1);
      }
    }
  }, {
    key: "getFieldBoost",
    value: function getFieldBoost(field) {
      return _.reduce(field, function (max, rule) {
        return rule && rule.boost && rule.boost > max ? rule.boost : max;
      }, 1);
    }
  }, {
    key: "_isExactMatch",
    get: function get() {
      return this.text.length > 2 && this.quotesChar.indexOf(this.text[0]) !== -1 && this.quotesChar.indexOf(this.text[this.text.length - 1]) !== -1;
    }
  }, {
    key: "exactMatch",
    get: function get() {
      return this._bExactMatch;
    }
  }, {
    key: "exaxctTerms",
    get: function get() {
      return [this.text];
    }
  }, {
    key: "quotesChar",
    get: function get() {
      return ["\"", "\'"];
    }
  }, {
    key: "fieldsParam",
    get: function get() {
      var _this = this;

      var fieldquery = '';
      _.each(this.settings.fields, function (item, id) {
        if (!_this.filter(item)) {
          var tokens = _.map(lunr.tokenizer(_this.text), function (token) {
            return token.str;
          });
          var boost = _this.getFieldBoost(item);
          _.each(tokens, function (token) {
            fieldquery = fieldquery + " " + _this.getFuzzyText(id, token, boost);
          });
        }
      });
      return fieldquery;
    }
  }]);

  return SearchQuery;
}();

},{"../../../../../lib/rh":24,"./cbt":55,"lunr":23}],60:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../../lib/rh");
var TextMerger = require('../text_merger');
var _ = rh._;
module.exports = function () {
  function SearchSummary(topicData, context) {
    _classCallCheck(this, SearchSummary);

    this.topicData = topicData;
    this.context = context;
  }

  _createClass(SearchSummary, [{
    key: 'minDistance',
    value: function minDistance() {
      //_.each()
    }
  }, {
    key: 'getSummary',
    value: function getSummary(id, matchResult, wordlist, data) {
      var _this = this;

      if (this.context) {
        var _summary = this.topicData[id] && this.topicData[id].summary;
        if (_summary) {
          return _summary;
        }
      }
      var summaries = _.map(matchResult, function (metadata) {
        return _.union(metadata, function (posData, fieldId) {
          return _.union(posData.position, function (fistrPos) {
            var texts = data[fieldId];
            var merger = new TextMerger();
            var text = merger.getIndexText(texts);
            var word = text.substring(fistrPos[0], fistrPos[0] + fistrPos[1]);
            word = word.toLowerCase();
            if (wordlist.indexOf(word) === -1) {
              wordlist.push(word);
            }
            return _this.getSummaryText(text, fistrPos[0], fistrPos[1], word);
          });
        });
      });
      var summary = '';
      _.each(summaries[0] || [], function (s) {
        if (s.length > summary.length) {
          summary = s;
        }
      });
      return summary;
    }
  }, {
    key: 'getSummaryText',
    value: function getSummaryText(text, idx, length, word) {
      var leftText = text.substring(0, idx);
      var rightText = text.substring(idx + length);

      return this.trimLeft(leftText) + '<b>' + word + '</b>\n              ' + this.trimRight(rightText);
    }
  }, {
    key: 'trimLeft',
    value: function trimLeft(leftText) {
      var leftIdx = leftText.indexOf(" ", leftText.length - 30);
      leftText = leftText.substring(leftIdx, leftText.length);
      return leftText.trimStart();
    }
  }, {
    key: 'trimRight',
    value: function trimRight(rightText) {
      var rightIdx = rightText.indexOf(" ", 70);
      rightIdx = rightIdx === -1 ? rightText.length : rightIdx;
      rightText = rightText.substring(0, rightIdx);
      return rightText.trimEnd();
    }
  }]);

  return SearchSummary;
}();

},{"../../../../../lib/rh":24,"../text_merger":62}],61:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../suggestion/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function SearchResult(result) {
    _classCallCheck(this, SearchResult);

    this.fRanking = result.score;
    this.nIndex = 1;
    this.strSummary = '.p.searchsummary' + result.ref;
    this.strTitle = result.title;
    this.strUrl = '.p.searchurl' + result.ref;
    this.strBreadcrumbs = result.relUrl;
  }

  _createClass(SearchResult, [{
    key: 'merge',
    value: function merge(new_item) {
      this.fRanking += new_item.fRanking;
    }
  }, {
    key: 'compare',
    value: function compare(other) {
      return other.fRanking - this.fRanking;
    }
  }, {
    key: 'match',
    value: function match(other) {
      return _utils2.default.compareNoCase(other.strUrl, this.strUrl) === 0;
    }
  }]);

  return SearchResult;
}();

},{"../suggestion/utils":52}],62:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../../lib/rh");
var _ = rh._;
module.exports = function () {
  function SearchTextMerger(nextTexts, texts, filter) {
    _classCallCheck(this, SearchTextMerger);

    this.nextTexts = nextTexts;
    this.texts = texts;
    this.separator = " ";
    this.filter = filter || this.defaultFilter;
  }

  _createClass(SearchTextMerger, [{
    key: "join",
    value: function join(id, start, end) {
      var texts = [];
      for (var i = start; i <= end; i++) {
        if (this.texts[id][i]) {
          texts.push(this.texts[id][i]);
        }
      }
      return texts.join(this.separator);
    }
  }, {
    key: "defaultFilter",
    value: function defaultFilter() {
      return false;
    }
  }, {
    key: "getIndexText",
    value: function getIndexText(texts) {
      return texts.join(this.separator).replace(/\n/gi, this.separator).trim();
    }
  }, {
    key: "getText",
    value: function getText() {
      var _this = this;

      var texts = [];
      _.each(this.nextTexts, function (item) {
        if (!_this.filter(item[0])) {
          texts.push(_this.join(item[0], item[1], item[2]));
        }
      });
      return texts.join(this.separator);
    }
  }]);

  return SearchTextMerger;
}();

},{"../../../../lib/rh":24}],63:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var _ = rh._;
var consts = rh.consts;

var SearchResultController = function () {
  function SearchResultController(widget) {
    _classCallCheck(this, SearchResultController);

    this.widget = widget;
  }

  _createClass(SearchResultController, [{
    key: 'getLink',
    value: function getLink(url) {
      var searchUrl = url;
      var highlightParam = this.widget.get(consts('KEY_SEARCH_RESULT_PARAMS'));
      var searchTerm = this.widget.get(consts('KEY_SEARCH_TERM'));
      var searchTermParam = '';
      if (searchTerm && searchTerm !== '') {
        var key = consts('HASH_KEY_RH_SEARCH');
        var searchTermMap = {};
        searchTermMap[key] = searchTerm;
        searchTermParam = _.mapToEncodedString(searchTermMap);
      }
      if (highlightParam !== undefined && highlightParam !== '') {
        searchUrl = searchUrl + highlightParam + '&' + searchTermParam;
      } else if (searchTermParam !== '') {
        searchUrl = searchUrl + '?' + searchTermParam;
      }
      return searchUrl;
    }
  }]);

  return SearchResultController;
}();

rh.controller('SearchResultController', SearchResultController);

},{"../../lib/rh":24}],64:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../lib/rh");
var _ = rh._;
var consts = rh.consts;
//const KEY_ACTIVE_BOOKID = 'active_bookid';

var TocBreadcrumbsController = function () {
  function TocBreadcrumbsController(widget) {
    _classCallCheck(this, TocBreadcrumbsController);

    this.widget = widget;
    //this.widget.model.subscribe(KEY_ACTIVE_BOOKID, this.updateBreadcrumbs)
  }

  _createClass(TocBreadcrumbsController, [{
    key: 'select',
    value: function select(id, url) {
      this.widget.publish(consts('KEY_TOC_SELECT_ITEM'), { 'id': id, 'url': url });
    }
  }, {
    key: 'getLink',
    value: function getLink(id) {
      if (id) {
        var breadcrumbs = this.widget.get(consts('KEY_TOC_BREADCRUMBS'));
        var item = breadcrumbs[id];
        if (item && item.hasUrl) {
          return item.url;
        }
      }
    }
  }, {
    key: 'goToHome',
    value: function goToHome(index) {
      if (index) {
        var breadcrumbs = this.widget.get(consts('KEY_TOC_BREADCRUMBS'));
        var item = breadcrumbs[index];
        if (item && !item.hasUrl) {
          _.goToHome({ rhtocid: item.id });
        }
      }
    }
  }]);

  return TocBreadcrumbsController;
}();

rh.controller('TocBreadcrumbsController', TocBreadcrumbsController);

},{"../../lib/rh":24}],65:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rh = require("../../../lib/rh");
var $ = rh.$;
var CAROUSEL_CHANGE = 'change';
var CAROUSEL_ITEM = '.carousel-item:not(.hide):not(.rh-hide)';

var Carousel = function () {
  function Carousel(widget, opts) {
    var _this = this;

    _classCallCheck(this, Carousel);

    this.widget = widget;
    this.node = this.widget.node;
    this.tab = 0;
    rh.model.subscribeOnce(rh.consts(opts.key), function () {
      _this.widget.publish(CAROUSEL_CHANGE, true);
    });
    rh.model.subscribe(rh.consts('KEY_SCREEN'), function () {
      _this.goto(_this.tab, 0);
    });
    rh.model.subscribe(opts.key + 'gototab', function (bookData) {
      _this.goto(_this.pagecount(), bookData.tab);
    });
  }

  _createClass(Carousel, [{
    key: 'goto',
    value: function goto(from, to) {
      var _this2 = this;

      this.tab = to;
      this.carouselnode = $.find(this.node, '.carousel')[0];
      this.animateLeft(from);
      rh._.delay(function () {
        _this2.widget.publish(CAROUSEL_CHANGE, true);
      }, 1000);
    }
  }, {
    key: 'hasNext',
    value: function hasNext() {
      this.carouselnode = $.find(this.node, '.carousel')[0];
      var lastItem = $.find($.find(this.node, '.carousel')[0], CAROUSEL_ITEM);
      lastItem = lastItem && lastItem.length > 0 ? lastItem[lastItem.length - 1] : null;
      return lastItem.offsetLeft + this.carouselnode.offsetLeft > this.carouselnode.offsetWidth;
    }
  }, {
    key: 'animateLeft',
    value: function animateLeft() {
      var leftVal = 'calc(-' + this.tab * 14 + 'px - ' + this.tab * 100 + '%)';
      $.css(this.carouselnode, 'left', leftVal);
    }
  }, {
    key: 'next',
    value: function next() {
      this.goto(this.tab, this.tab + 1);
    }
  }, {
    key: 'pagecount',
    value: function pagecount() {
      return this.tab;
    }
  }, {
    key: 'previous',
    value: function previous() {
      this.goto(this.tab, this.tab - 1);
    }
  }, {
    key: 'ensureVisible',
    value: function ensureVisible() {}
  }]);

  return Carousel;
}();

rh.controller('Carousel', Carousel);

},{"../../../lib/rh":24}],66:[function(require,module,exports){
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

},{"../../lib/rh":24}]},{},[26])