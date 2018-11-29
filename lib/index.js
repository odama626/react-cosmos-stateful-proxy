'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (props) {
  var nextProxy = props.nextProxy,
      rest = _objectWithoutProperties(props, ['nextProxy']);

  var NextProxy = nextProxy.value,
      next = nextProxy.next;

  console.log(props);
  if (!props.fixture.controllers) {
    // Carry on
    return _react2.default.createElement(NextProxy, Object.assign({}, rest, { nextProxy: next() }));
  }

  // Wrap the component
  return _react2.default.createElement(Wrapper, Object.assign({}, props.fixture.controllers, {
    update: props.onFixtureUpdate,
    Child: function Child(state) {
      return _react2.default.createElement(NextProxy, Object.assign({}, addInnerProps(rest, state), { nextProxy: next() }));
    }
  }));
};

function addInnerProps(props, add) {
  return Object.assign({}, props, {
    fixture: Object.assign({}, props.fixture, {
      props: Object.assign({}, props.fixture.props, add)
    })
  });
}

var Wrapper = function (_React$Component) {
  _inherits(Wrapper, _React$Component);

  function Wrapper(props) {
    _classCallCheck(this, Wrapper);

    var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props));

    var Child = props.Child,
        update = props.update,
        controllers = _objectWithoutProperties(props, ['Child', 'update']);

    _this.state = Object.keys(controllers).map(function (key) {
      return _defineProperty({}, key, function () {
        // update editor
        var nextState = controllers[key].apply(controllers, arguments);
        props.update(nextState);
        // update state
        _this.setState(nextState);
      });
    }).reduce(function (acc, cur) {
      return Object.assign({}, acc, cur);
    }, {});
    return _this;
  }

  _createClass(Wrapper, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Child = _props.Child,
          update = _props.update,
          rest = _objectWithoutProperties(_props, ['Child', 'update']);

      var props = Object.assign({}, rest, this.state);
      return _react2.default.createElement(Child, props);
    }
  }]);

  return Wrapper;
}(_react2.default.Component);

Wrapper.hoc = true;
