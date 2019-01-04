'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var deepMerge = require('deepmerge'); // TODO: find a package that is bundled with more modern standards


exports.default = function (props) {
    var nextProxy = props.nextProxy,
        rest = _objectWithoutProperties(props, ['nextProxy']);

    var NextProxy = nextProxy.value,
        next = nextProxy.next;

    // Perfomance gainz when this proxy is loaded but no controllers fixture is present

    if (!props.fixture.controllers) {
        // Carry on
        return _react2.default.createElement(NextProxy, Object.assign({}, rest, { nextProxy: next() }));
    }

    // Extract controllers fixture props
    var controllers = rest.fixture.controllers;
    // Remove them from the "normal" props
    rest.fixture.controllers = undefined;

    // Wrap the component
    return _react2.default.createElement(Wrapper, Object.assign({}, rest.fixture.props, {
        controllers: controllers,
        update: props.onFixtureUpdate,
        Child: function Child(enrichedProps) {
            // inject enrichedprops in fixture.props
            var newProps = Object.assign({}, rest, {
                fixture: Object.assign({}, rest.fixture, {
                    props: deepMerge(rest.fixture.props, enrichedProps)

                })
            });
            return _react2.default.createElement(NextProxy, Object.assign({}, newProps, { nextProxy: next() }));
        }
    }));
};

var Wrapper = function (_React$Component) {
    _inherits(Wrapper, _React$Component);

    function Wrapper(props) {
        _classCallCheck(this, Wrapper);

        // Extract controller props and react-cosmos update function
        var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props));

        _this.deepMergeState = function (nextState) {
            _this.setState(function (s) {
                return deepMerge(s, nextState);
            });
        };

        var update = props.update,
            controllers = props.controllers;

        _this.state = Object.assign({}, _this.extractControllersFunctionsObject(controllers, update, function () {
            return _this.deepMergeState.apply(_this, arguments);
        }));
        return _this;
    }

    // To prevent overwriting nested props we set in a fixture


    _createClass(Wrapper, [{
        key: 'extractControllersFunctionsObject',


        // For recursively transforming controllers prop to state setting functions
        value: function extractControllersFunctionsObject(controllers, update, setState) {
            var _this2 = this;

            var transformedControllerObject = Object.entries(controllers).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    key = _ref2[0],
                    value = _ref2[1];

                // type == object: branch
                if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                    return _defineProperty({}, key, _this2.extractControllersFunctionsObject(value, update, setState));
                }
                // type == function: leaf
                else if (typeof value === 'function') {
                        return _defineProperty({}, key, function () {
                            // Pass in controller function args
                            // Set empty object as fallback when there is no return value provided by the user
                            var nextState = value.apply(undefined, arguments) || {};
                            // Update editor
                            update(nextState);
                            // Update state
                            setState(nextState);
                        });
                    }
                    // type == something else: user isn't making sense
                    else {
                            return _defineProperty({}, key, function () {
                                console.warn('Did you provide an object to \'controllers\' proxy that doesn\'t strictly have functions as object tree leaves?');
                            });
                        }
            });

            // Reduce to turn our mapped array into a flat object again
            return transformedControllerObject.reduce(function (acc, cur) {
                return Object.assign({}, acc, cur);
            }, {});
        }
    }, {
        key: 'render',
        value: function render() {
            // Get all props without Child, update and controllers
            var _props = this.props,
                Child = _props.Child,
                update = _props.update,
                controllers = _props.controllers,
                rest = _objectWithoutProperties(_props, ['Child', 'update', 'controllers']);
            // Prevent nested props from being overwritten when being merged with our generated state


            var props = deepMerge(rest, this.state);
            return _react2.default.createElement(Child, props);
        }
    }]);

    return Wrapper;
}(_react2.default.Component);

Wrapper.hoc = true;
