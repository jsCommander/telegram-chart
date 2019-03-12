/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Chart.ts":
/*!**********************!*\
  !*** ./src/Chart.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    canvas: {
        width: 600,
        height: 600
    },
    supportLine: {
        count: 6,
        color: "#a7a7a7",
        font: "serif",
        fontSize: 0.25
    }
};
var Chart = /** @class */ (function () {
    function Chart(canvas, data) {
        var _this = this;
        this.maxChartValue = 0;
        this.charts = [];
        canvas.width = config.canvas.width;
        canvas.height = config.canvas.height;
        var ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Can't create canvas 2d context");
        }
        this.ctx = ctx;
        data.columns.forEach(function (x) {
            if (x[0] === "x") {
                _this.axisXvalues = x.slice(1);
            }
            else {
                var name_1 = x[0];
                _this.charts.push({
                    name: data.names[name_1],
                    values: x.slice(1),
                    color: data.colors[name_1],
                    type: data.types[name_1]
                });
            }
        });
        this.maxChartValue = this.findMaxValueInArrays(this.charts.map(function (x) { return x.values; }));
    }
    Chart.prototype.draw = function (beginOffset, endOffset) {
        if (beginOffset === void 0) { beginOffset = 0; }
        if (endOffset === void 0) { endOffset = this.charts[0].values.length; }
        var subCharts = this.charts.map(function (x) {
            var subChart = __assign({}, x, { values: x.values.slice(beginOffset, endOffset) });
            return subChart;
        });
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        var view = {
            x: 5,
            y: 5,
            width: this.ctx.canvas.width - 5,
            height: this.ctx.canvas.height - Math.floor(this.ctx.canvas.height * 0.3)
        };
        var maxYvalue = this.findMaxValueInArrays(subCharts.map(function (x) { return x.values; }));
        this.drawSupportLines(maxYvalue, view);
        this.drawCharts(subCharts, maxYvalue, view);
        var control = {
            x: 5,
            y: Math.floor(this.ctx.canvas.height * (1 - 0.3)),
            width: this.ctx.canvas.width - 5,
            height: this.ctx.canvas.height
        };
        this.drawCharts(this.charts, this.maxChartValue, control);
        console.log(this.axisXvalues);
    };
    Chart.prototype.drawSupportLines = function (maxYvalue, view) {
        var viewRect = view ? view : {
            x: 0,
            y: 0,
            width: this.ctx.canvas.width,
            height: this.ctx.canvas.height
        };
        var supportLineHeightStep = Math.floor(viewRect.height / config.supportLine.count);
        var supportLineValueStep = Math.round(maxYvalue / config.supportLine.count);
        var legendFontSize = Math.floor((Math.min(viewRect.width - viewRect.x, viewRect.height - viewRect.y) / config.supportLine.count * config.supportLine.fontSize));
        this.ctx.save();
        this.ctx.strokeStyle = config.supportLine.color;
        this.ctx.fillStyle = config.supportLine.color;
        this.ctx.lineWidth = 1;
        this.ctx.font = legendFontSize + "px " + config.supportLine.font;
        for (var i = 0; i < config.supportLine.count; i++) {
            var height = viewRect.height - (supportLineHeightStep * i);
            var value = supportLineValueStep * i;
            this.ctx.beginPath();
            this.ctx.moveTo(viewRect.x, height);
            this.ctx.lineTo(viewRect.width, height);
            this.ctx.stroke();
            this.ctx.fillText(value.toString(), viewRect.x, height - 5);
        }
        this.ctx.restore();
    };
    Chart.prototype.drawCharts = function (charts, maxYValue, view) {
        var _this = this;
        var viewRect = view ? view : {
            x: 0,
            y: 0,
            width: this.ctx.canvas.width,
            height: this.ctx.canvas.height
        };
        var pointCount = charts[0].values.length;
        var axisXstep = Math.ceil(viewRect.width / pointCount);
        var axisYscale = (viewRect.height - viewRect.y) / maxYValue;
        this.ctx.save();
        this.ctx.lineWidth = 3;
        charts.forEach(function (chart) {
            _this.ctx.strokeStyle = chart.color;
            _this.ctx.fillStyle = chart.color;
            _this.ctx.beginPath();
            _this.ctx.moveTo(viewRect.x, Math.round(viewRect.height - chart.values[0] * axisYscale));
            chart.values.forEach(function (value, i) {
                _this.ctx.lineTo(Math.round(i * axisXstep), Math.round(viewRect.height - axisYscale * value));
                _this.ctx.fillText(value.toString(), Math.round(i * axisXstep) + 5, Math.round(viewRect.height - value * axisYscale) + 15);
            });
            _this.ctx.stroke();
        });
        this.ctx.restore();
    };
    Chart.prototype.findMaxValueInArrays = function (arrays) {
        var maxValue = arrays.reduce(function (max, valuesArray) { return max = Math.max.apply(Math, [max].concat(valuesArray)); }, 0);
        return maxValue;
    };
    return Chart;
}());
exports.Chart = Chart;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Chart_1 = __webpack_require__(/*! ./Chart */ "./src/Chart.ts");
var data = {
    "columns": [
        [
            "x",
            1542412800000,
            1542499200000,
            1542585600000,
            1542672000000,
            1542758400000,
            1542844800000,
            1542931200000,
            1543017600000,
            1543104000000,
            1543190400000,
            1543276800000,
            1543363200000,
            1543449600000,
            1543536000000,
            1543622400000,
            1543708800000,
            1543795200000,
            1543881600000,
            1543968000000,
            1544054400000,
            1544140800000,
            1544227200000,
            1544313600000,
            1544400000000,
            1544486400000,
            1544572800000,
            1544659200000,
            1544745600000,
            1544832000000,
            1544918400000,
            1545004800000,
            1545091200000,
            1545177600000,
            1545264000000,
            1545350400000,
            1545436800000,
            1545523200000,
            1545609600000,
            1545696000000,
            1545782400000,
            1545868800000,
            1545955200000,
            1546041600000,
            1546128000000,
            1546214400000,
            1546300800000,
            1546387200000,
            1546473600000,
            1546560000000,
            1546646400000,
            1546732800000,
            1546819200000,
            1546905600000,
            1546992000000,
            1547078400000,
            1547164800000,
            1547251200000,
            1547337600000,
            1547424000000,
            1547510400000,
            1547596800000,
            1547683200000,
            1547769600000,
            1547856000000,
            1547942400000,
            1548028800000,
            1548115200000,
            1548201600000,
            1548288000000,
            1548374400000,
            1548460800000,
            1548547200000,
            1548633600000,
            1548720000000,
            1548806400000,
            1548892800000,
            1548979200000,
            1549065600000,
            1549152000000,
            1549238400000,
            1549324800000,
            1549411200000,
            1549497600000,
            1549584000000,
            1549670400000,
            1549756800000,
            1549843200000,
            1549929600000,
            1550016000000,
            1550102400000,
            1550188800000,
            1550275200000,
            1550361600000,
            1550448000000,
            1550534400000,
            1550620800000,
            1550707200000,
            1550793600000,
            1550880000000,
            1550966400000,
            1551052800000,
            1551139200000,
            1551225600000,
            1551312000000,
            1551398400000,
            1551484800000,
            1551571200000,
            1551657600000,
            1551744000000,
            1551830400000,
            1551916800000,
            1552003200000
        ],
        [
            "y0",
            37,
            20,
            32,
            39,
            32,
            35,
            19,
            65,
            36,
            62,
            113,
            69,
            120,
            60,
            51,
            49,
            71,
            122,
            149,
            69,
            57,
            21,
            33,
            55,
            92,
            62,
            47,
            50,
            56,
            116,
            63,
            60,
            55,
            65,
            76,
            33,
            45,
            64,
            54,
            81,
            180,
            123,
            106,
            37,
            60,
            70,
            46,
            68,
            46,
            51,
            33,
            57,
            75,
            70,
            95,
            70,
            50,
            68,
            63,
            66,
            53,
            38,
            52,
            109,
            121,
            53,
            36,
            71,
            96,
            55,
            58,
            29,
            31,
            55,
            52,
            44,
            126,
            191,
            73,
            87,
            255,
            278,
            219,
            170,
            129,
            125,
            126,
            84,
            65,
            53,
            154,
            57,
            71,
            64,
            75,
            72,
            39,
            47,
            52,
            73,
            89,
            156,
            86,
            105,
            88,
            45,
            33,
            56,
            142,
            124,
            114,
            64
        ],
        [
            "y1",
            22,
            12,
            30,
            40,
            33,
            23,
            18,
            41,
            45,
            69,
            57,
            61,
            70,
            47,
            31,
            34,
            40,
            55,
            27,
            57,
            48,
            32,
            40,
            49,
            54,
            49,
            34,
            51,
            51,
            51,
            66,
            51,
            94,
            60,
            64,
            28,
            44,
            96,
            49,
            73,
            30,
            88,
            63,
            42,
            56,
            67,
            52,
            67,
            35,
            61,
            40,
            55,
            63,
            61,
            105,
            59,
            51,
            76,
            63,
            57,
            47,
            56,
            51,
            98,
            103,
            62,
            54,
            104,
            48,
            41,
            41,
            37,
            30,
            28,
            26,
            37,
            65,
            86,
            70,
            81,
            54,
            74,
            70,
            50,
            74,
            79,
            85,
            62,
            36,
            46,
            68,
            43,
            66,
            50,
            28,
            66,
            39,
            23,
            63,
            74,
            83,
            66,
            40,
            60,
            29,
            36,
            27,
            54,
            89,
            50,
            73,
            52
        ]
    ],
    "types": {
        "y0": "line",
        "y1": "line",
        "x": "x"
    },
    "names": {
        "y0": "#0",
        "y1": "#1"
    },
    "colors": {
        "y0": "#3DC23F",
        "y1": "#F34C44"
    }
};
var canvas = document.getElementById("chart1");
var chart = new Chart_1.Chart(canvas, data);
var start = document.getElementById("start");
var end = document.getElementById("end");
var btn = document.getElementById("btn");
if (btn && start && end) {
    btn.addEventListener("click", function (e) {
        chart.draw(parseInt(start.value), parseInt(end.value));
    });
}
chart.draw(0, 10);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NoYXJ0LnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQSxJQUFNLE1BQU0sR0FBRztJQUNiLE1BQU0sRUFBRTtRQUNOLEtBQUssRUFBRSxHQUFHO1FBQ1YsTUFBTSxFQUFFLEdBQUc7S0FDWjtJQUNELFdBQVcsRUFBRTtRQUNYLEtBQUssRUFBRSxDQUFDO1FBQ1IsS0FBSyxFQUFFLFNBQVM7UUFDaEIsSUFBSSxFQUFFLE9BQU87UUFDYixRQUFRLEVBQUUsSUFBSTtLQUNmO0NBQ0Y7QUFFRDtJQU1FLGVBQVksTUFBeUIsRUFBRSxJQUFnQjtRQUF2RCxpQkFzQkM7UUExQk8sa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFD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Ozs7Ozs7O0FDbENsQixtRUFBNEM7QUFFNUMsSUFBTSxJQUFJLEdBQWU7SUFDdkIsU0FBUyxFQUFFO1FBQ1Q7WUFDRSxHQUFHO1lBQ0gsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtZQUNiLGFBQWE7WUFDYixhQUFhO1lBQ2IsYUFBYTtTQUNkO1FBQ0Q7WUFDRSxJQUFJO1lBQ0osRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEdBQUc7WUFDSCxFQUFFO1lBQ0YsR0FBRztZQUNILEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixHQUFHO1lBQ0gsR0FBRztZQUNILEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixHQUFHO1lBQ0gsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEdBQUc7WUFDSCxHQUFHO1lBQ0gsR0FBRztZQUNILEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsR0FBRztZQUNILEdBQUc7WUFDSCxFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEdBQUc7WUFDSCxHQUFHO1lBQ0gsRUFBRTtZQUNGLEVBQUU7WUFDRixHQUFHO1lBQ0gsR0FBRztZQUNILEdBQUc7WUFDSCxHQUFHO1lBQ0gsR0FBRztZQUNILEdBQUc7WUFDSCxHQUFHO1lBQ0gsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsR0FBRztZQUNILEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixHQUFHO1lBQ0gsRUFBRTtZQUNGLEdBQUc7WUFDSCxFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsR0FBRztZQUNILEdBQUc7WUFDSCxHQUFHO1lBQ0gsRUFBRTtTQUNIO1FBQ0Q7WUFDRSxJQUFJO1lBQ0osRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsR0FBRztZQUNILEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEdBQUc7WUFDSCxFQUFFO1lBQ0YsRUFBRTtZQUNGLEdBQUc7WUFDSCxFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtZQUNGLEVBQUU7WUFDRixFQUFFO1lBQ0YsRUFBRTtTQUNIO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osR0FBRyxFQUFFLEdBQUc7S0FDVDtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7S0FDWDtJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFLFNBQVM7S0FDaEI7Q0FDRjtBQUVELElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakQsSUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsTUFBMkIsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztBQUNuRSxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBcUIsQ0FBQztBQUMvRCxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUU7SUFDdkIsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxXQUFDO1FBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQztDQUNIO0FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMiLCJmaWxlIjoidGVsZWdyYW0tY2hhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgSUNoYXJ0RGF0YSB7XG4gIGNvbHVtbnM6IGFueVtdW107XG4gIHR5cGVzOiB7IFtpZDogc3RyaW5nXTogXCJsaW5lXCIgfCBcInhcIiB9O1xuICBuYW1lczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuICBjb2xvcnM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuaW50ZXJmYWNlIElDaGFydCB7XG4gIG5hbWU6IHN0cmluZztcbiAgdmFsdWVzOiBudW1iZXJbXTtcbiAgdHlwZTogXCJsaW5lXCIgfCBcInhcIjtcbiAgY29sb3I6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElSZWN0IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5jb25zdCBjb25maWcgPSB7XG4gIGNhbnZhczoge1xuICAgIHdpZHRoOiA2MDAsXG4gICAgaGVpZ2h0OiA2MDBcbiAgfSxcbiAgc3VwcG9ydExpbmU6IHtcbiAgICBjb3VudDogNixcbiAgICBjb2xvcjogXCIjYTdhN2E3XCIsXG4gICAgZm9udDogXCJzZXJpZlwiLFxuICAgIGZvbnRTaXplOiAwLjI1XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENoYXJ0IHtcbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJpdmF0ZSBtYXhDaGFydFZhbHVlOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGNoYXJ0czogSUNoYXJ0W10gPSBbXTtcbiAgcHJpdmF0ZSBheGlzWHZhbHVlcz86IG51bWJlcltdXG5cbiAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGF0YTogSUNoYXJ0RGF0YSkge1xuICAgIGNhbnZhcy53aWR0aCA9IGNvbmZpZy5jYW52YXMud2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IGNvbmZpZy5jYW52YXMuaGVpZ2h0O1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBpZiAoIWN0eCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGNhbnZhcyAyZCBjb250ZXh0XCIpO1xuICAgIH1cbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICBkYXRhLmNvbHVtbnMuZm9yRWFjaCh4ID0+IHtcbiAgICAgIGlmICh4WzBdID09PSBcInhcIikge1xuICAgICAgICB0aGlzLmF4aXNYdmFsdWVzID0geC5zbGljZSgxKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHhbMF07XG4gICAgICAgIHRoaXMuY2hhcnRzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGRhdGEubmFtZXNbbmFtZV0sXG4gICAgICAgICAgdmFsdWVzOiB4LnNsaWNlKDEpLFxuICAgICAgICAgIGNvbG9yOiBkYXRhLmNvbG9yc1tuYW1lXSxcbiAgICAgICAgICB0eXBlOiBkYXRhLnR5cGVzW25hbWVdXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLm1heENoYXJ0VmFsdWUgPSB0aGlzLmZpbmRNYXhWYWx1ZUluQXJyYXlzKHRoaXMuY2hhcnRzLm1hcCh4ID0+IHgudmFsdWVzKSlcbiAgfVxuXG4gIHB1YmxpYyBkcmF3KGJlZ2luT2Zmc2V0OiBudW1iZXIgPSAwLCBlbmRPZmZzZXQ6IG51bWJlciA9IHRoaXMuY2hhcnRzWzBdLnZhbHVlcy5sZW5ndGgpIHtcbiAgICBjb25zdCBzdWJDaGFydHMgPSB0aGlzLmNoYXJ0cy5tYXAoeCA9PiB7XG4gICAgICBjb25zdCBzdWJDaGFydCA9IHsgLi4ueCwgdmFsdWVzOiB4LnZhbHVlcy5zbGljZShiZWdpbk9mZnNldCwgZW5kT2Zmc2V0KSB9O1xuICAgICAgcmV0dXJuIHN1YkNoYXJ0O1xuICAgIH0pXG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jdHguY2FudmFzLndpZHRoLCB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0KVxuICAgIGNvbnN0IHZpZXc6IElSZWN0ID0ge1xuICAgICAgeDogNSxcbiAgICAgIHk6IDUsXG4gICAgICB3aWR0aDogdGhpcy5jdHguY2FudmFzLndpZHRoIC0gNSxcbiAgICAgIGhlaWdodDogdGhpcy5jdHguY2FudmFzLmhlaWdodCAtIE1hdGguZmxvb3IodGhpcy5jdHguY2FudmFzLmhlaWdodCAqIDAuMylcbiAgICB9XG5cbiAgICBsZXQgbWF4WXZhbHVlID0gdGhpcy5maW5kTWF4VmFsdWVJbkFycmF5cyhzdWJDaGFydHMubWFwKHggPT4geC52YWx1ZXMpKVxuICAgIHRoaXMuZHJhd1N1cHBvcnRMaW5lcyhtYXhZdmFsdWUsIHZpZXcpXG4gICAgdGhpcy5kcmF3Q2hhcnRzKHN1YkNoYXJ0cywgbWF4WXZhbHVlLCB2aWV3KTtcblxuICAgIGNvbnN0IGNvbnRyb2w6IElSZWN0ID0ge1xuICAgICAgeDogNSxcbiAgICAgIHk6IE1hdGguZmxvb3IodGhpcy5jdHguY2FudmFzLmhlaWdodCAqICgxIC0gMC4zKSksXG4gICAgICB3aWR0aDogdGhpcy5jdHguY2FudmFzLndpZHRoIC0gNSxcbiAgICAgIGhlaWdodDogdGhpcy5jdHguY2FudmFzLmhlaWdodFxuICAgIH1cbiAgICB0aGlzLmRyYXdDaGFydHModGhpcy5jaGFydHMsIHRoaXMubWF4Q2hhcnRWYWx1ZSwgY29udHJvbCk7XG4gICAgY29uc29sZS5sb2codGhpcy5heGlzWHZhbHVlcylcbiAgfVxuXG4gIGRyYXdTdXBwb3J0TGluZXMobWF4WXZhbHVlOiBudW1iZXIsIHZpZXc/OiBJUmVjdCkge1xuICAgIGNvbnN0IHZpZXdSZWN0ID0gdmlldyA/IHZpZXcgOiB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIHdpZHRoOiB0aGlzLmN0eC5jYW52YXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuY3R4LmNhbnZhcy5oZWlnaHRcbiAgICB9XG5cbiAgICBjb25zdCBzdXBwb3J0TGluZUhlaWdodFN0ZXAgPSBNYXRoLmZsb29yKHZpZXdSZWN0LmhlaWdodCAvIGNvbmZpZy5zdXBwb3J0TGluZS5jb3VudCk7XG4gICAgY29uc3Qgc3VwcG9ydExpbmVWYWx1ZVN0ZXAgPSBNYXRoLnJvdW5kKG1heFl2YWx1ZSAvIGNvbmZpZy5zdXBwb3J0TGluZS5jb3VudCk7XG4gICAgY29uc3QgbGVnZW5kRm9udFNpemUgPSBNYXRoLmZsb29yKChNYXRoLm1pbih2aWV3UmVjdC53aWR0aCAtIHZpZXdSZWN0LngsIHZpZXdSZWN0LmhlaWdodCAtIHZpZXdSZWN0LnkpIC8gY29uZmlnLnN1cHBvcnRMaW5lLmNvdW50ICogY29uZmlnLnN1cHBvcnRMaW5lLmZvbnRTaXplKSk7XG5cbiAgICB0aGlzLmN0eC5zYXZlKCk7XG5cbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbmZpZy5zdXBwb3J0TGluZS5jb2xvcjtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb25maWcuc3VwcG9ydExpbmUuY29sb3I7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gMTtcbiAgICB0aGlzLmN0eC5mb250ID0gYCR7bGVnZW5kRm9udFNpemV9cHggJHtjb25maWcuc3VwcG9ydExpbmUuZm9udH1gO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25maWcuc3VwcG9ydExpbmUuY291bnQ7IGkrKykge1xuICAgICAgY29uc3QgaGVpZ2h0ID0gdmlld1JlY3QuaGVpZ2h0IC0gKHN1cHBvcnRMaW5lSGVpZ2h0U3RlcCAqIGkpXG4gICAgICBjb25zdCB2YWx1ZSA9IHN1cHBvcnRMaW5lVmFsdWVTdGVwICogaVxuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgIHRoaXMuY3R4Lm1vdmVUbyh2aWV3UmVjdC54LCBoZWlnaHQpO1xuICAgICAgdGhpcy5jdHgubGluZVRvKHZpZXdSZWN0LndpZHRoLCBoZWlnaHQpO1xuICAgICAgdGhpcy5jdHguc3Ryb2tlKClcblxuICAgICAgdGhpcy5jdHguZmlsbFRleHQodmFsdWUudG9TdHJpbmcoKSwgdmlld1JlY3QueCwgaGVpZ2h0IC0gNSk7XG4gICAgfVxuICAgIHRoaXMuY3R4LnJlc3RvcmUoKVxuICB9XG5cbiAgZHJhd0NoYXJ0cyhjaGFydHM6IElDaGFydFtdLCBtYXhZVmFsdWU6IG51bWJlciwgdmlldz86IElSZWN0KSB7XG4gICAgY29uc3Qgdmlld1JlY3QgPSB2aWV3ID8gdmlldyA6IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgd2lkdGg6IHRoaXMuY3R4LmNhbnZhcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5jdHguY2FudmFzLmhlaWdodFxuICAgIH1cblxuICAgIGNvbnN0IHBvaW50Q291bnQgPSBjaGFydHNbMF0udmFsdWVzLmxlbmd0aDtcblxuICAgIGNvbnN0IGF4aXNYc3RlcCA9IE1hdGguY2VpbCh2aWV3UmVjdC53aWR0aCAvIHBvaW50Q291bnQpO1xuICAgIGNvbnN0IGF4aXNZc2NhbGUgPSAodmlld1JlY3QuaGVpZ2h0IC0gdmlld1JlY3QueSkgLyBtYXhZVmFsdWU7XG5cbiAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gMztcblxuICAgIGNoYXJ0cy5mb3JFYWNoKGNoYXJ0ID0+IHtcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY2hhcnQuY29sb3I7XG4gICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjaGFydC5jb2xvcjtcbiAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jdHgubW92ZVRvKHZpZXdSZWN0LngsIE1hdGgucm91bmQodmlld1JlY3QuaGVpZ2h0IC0gY2hhcnQudmFsdWVzWzBdICogYXhpc1lzY2FsZSkpO1xuXG4gICAgICBjaGFydC52YWx1ZXMuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKE1hdGgucm91bmQoaSAqIGF4aXNYc3RlcCksIE1hdGgucm91bmQodmlld1JlY3QuaGVpZ2h0IC0gYXhpc1lzY2FsZSAqIHZhbHVlIGFzIG51bWJlcikpXG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KHZhbHVlLnRvU3RyaW5nKCksIE1hdGgucm91bmQoaSAqIGF4aXNYc3RlcCkgKyA1LCBNYXRoLnJvdW5kKHZpZXdSZWN0LmhlaWdodCAtIHZhbHVlICogYXhpc1lzY2FsZSkgKyAxNSk7XG4gICAgICB9KVxuICAgICAgdGhpcy5jdHguc3Ryb2tlKClcbiAgICB9KVxuICAgIHRoaXMuY3R4LnJlc3RvcmUoKVxuICB9XG5cbiAgcHJpdmF0ZSBmaW5kTWF4VmFsdWVJbkFycmF5cyhhcnJheXM6IG51bWJlcltdW10pOiBudW1iZXIge1xuICAgIGNvbnN0IG1heFZhbHVlID0gYXJyYXlzLnJlZHVjZSgobWF4LCB2YWx1ZXNBcnJheSkgPT4gbWF4ID0gTWF0aC5tYXgobWF4LCAuLi52YWx1ZXNBcnJheSksIDApXG4gICAgcmV0dXJuIG1heFZhbHVlO1xuICB9XG59IiwiaW1wb3J0IHsgQ2hhcnQsIElDaGFydERhdGEgfSBmcm9tIFwiLi9DaGFydFwiO1xuXG5jb25zdCBkYXRhOiBJQ2hhcnREYXRhID0ge1xuICBcImNvbHVtbnNcIjogW1xuICAgIFtcbiAgICAgIFwieFwiLFxuICAgICAgMTU0MjQxMjgwMDAwMCxcbiAgICAgIDE1NDI0OTkyMDAwMDAsXG4gICAgICAxNTQyNTg1NjAwMDAwLFxuICAgICAgMTU0MjY3MjAwMDAwMCxcbiAgICAgIDE1NDI3NTg0MDAwMDAsXG4gICAgICAxNTQyODQ0ODAwMDAwLFxuICAgICAgMTU0MjkzMTIwMDAwMCxcbiAgICAgIDE1NDMwMTc2MDAwMDAsXG4gICAgICAxNTQzMTA0MDAwMDAwLFxuICAgICAgMTU0MzE5MDQwMDAwMCxcbiAgICAgIDE1NDMyNzY4MDAwMDAsXG4gICAgICAxNTQzMzYzMjAwMDAwLFxuICAgICAgMTU0MzQ0OTYwMDAwMCxcbiAgICAgIDE1NDM1MzYwMDAwMDAsXG4gICAgICAxNTQzNjIyNDAwMDAwLFxuICAgICAgMTU0MzcwODgwMDAwMCxcbiAgICAgIDE1NDM3OTUyMDAwMDAsXG4gICAgICAxNTQzODgxNjAwMDAwLFxuICAgICAgMTU0Mzk2ODAwMDAwMCxcbiAgICAgIDE1NDQwNTQ0MDAwMDAsXG4gICAgICAxNTQ0MTQwODAwMDAwLFxuICAgICAgMTU0NDIyNzIwMDAwMCxcbiAgICAgIDE1NDQzMTM2MDAwMDAsXG4gICAgICAxNTQ0NDAwMDAwMDAwLFxuICAgICAgMTU0NDQ4NjQwMDAwMCxcbiAgICAgIDE1NDQ1NzI4MDAwMDAsXG4gICAgICAxNTQ0NjU5MjAwMDAwLFxuICAgICAgMTU0NDc0NTYwMDAwMCxcbiAgICAgIDE1NDQ4MzIwMDAwMDAsXG4gICAgICAxNTQ0OTE4NDAwMDAwLFxuICAgICAgMTU0NTAwNDgwMDAwMCxcbiAgICAgIDE1NDUwOTEyMDAwMDAsXG4gICAgICAxNTQ1MTc3NjAwMDAwLFxuICAgICAgMTU0NTI2NDAwMDAwMCxcbiAgICAgIDE1NDUzNTA0MDAwMDAsXG4gICAgICAxNTQ1NDM2ODAwMDAwLFxuICAgICAgMTU0NTUyMzIwMDAwMCxcbiAgICAgIDE1NDU2MDk2MDAwMDAsXG4gICAgICAxNTQ1Njk2MDAwMDAwLFxuICAgICAgMTU0NTc4MjQwMDAwMCxcbiAgICAgIDE1NDU4Njg4MDAwMDAsXG4gICAgICAxNTQ1OTU1MjAwMDAwLFxuICAgICAgMTU0NjA0MTYwMDAwMCxcbiAgICAgIDE1NDYxMjgwMDAwMDAsXG4gICAgICAxNTQ2MjE0NDAwMDAwLFxuICAgICAgMTU0NjMwMDgwMDAwMCxcbiAgICAgIDE1NDYzODcyMDAwMDAsXG4gICAgICAxNTQ2NDczNjAwMDAwLFxuICAgICAgMTU0NjU2MDAwMDAwMCxcbiAgICAgIDE1NDY2NDY0MDAwMDAsXG4gICAgICAxNTQ2NzMyODAwMDAwLFxuICAgICAgMTU0NjgxOTIwMDAwMCxcbiAgICAgIDE1NDY5MDU2MDAwMDAsXG4gICAgICAxNTQ2OTkyMDAwMDAwLFxuICAgICAgMTU0NzA3ODQwMDAwMCxcbiAgICAgIDE1NDcxNjQ4MDAwMDAsXG4gICAgICAxNTQ3MjUxMjAwMDAwLFxuICAgICAgMTU0NzMzNzYwMDAwMCxcbiAgICAgIDE1NDc0MjQwMDAwMDAsXG4gICAgICAxNTQ3NTEwNDAwMDAwLFxuICAgICAgMTU0NzU5NjgwMDAwMCxcbiAgICAgIDE1NDc2ODMyMDAwMDAsXG4gICAgICAxNTQ3NzY5NjAwMDAwLFxuICAgICAgMTU0Nzg1NjAwMDAwMCxcbiAgICAgIDE1NDc5NDI0MDAwMDAsXG4gICAgICAxNTQ4MDI4ODAwMDAwLFxuICAgICAgMTU0ODExNTIwMDAwMCxcbiAgICAgIDE1NDgyMDE2MDAwMDAsXG4gICAgICAxNTQ4Mjg4MDAwMDAwLFxuICAgICAgMTU0ODM3NDQwMDAwMCxcbiAgICAgIDE1NDg0NjA4MDAwMDAsXG4gICAgICAxNTQ4NTQ3MjAwMDAwLFxuICAgICAgMTU0ODYzMzYwMDAwMCxcbiAgICAgIDE1NDg3MjAwMDAwMDAsXG4gICAgICAxNTQ4ODA2NDAwMDAwLFxuICAgICAgMTU0ODg5MjgwMDAwMCxcbiAgICAgIDE1NDg5NzkyMDAwMDAsXG4gICAgICAxNTQ5MDY1NjAwMDAwLFxuICAgICAgMTU0OTE1MjAwMDAwMCxcbiAgICAgIDE1NDkyMzg0MDAwMDAsXG4gICAgICAxNTQ5MzI0ODAwMDAwLFxuICAgICAgMTU0OTQxMTIwMDAwMCxcbiAgICAgIDE1NDk0OTc2MDAwMDAsXG4gICAgICAxNTQ5NTg0MDAwMDAwLFxuICAgICAgMTU0OTY3MDQwMDAwMCxcbiAgICAgIDE1NDk3NTY4MDAwMDAsXG4gICAgICAxNTQ5ODQzMjAwMDAwLFxuICAgICAgMTU0OTkyOTYwMDAwMCxcbiAgICAgIDE1NTAwMTYwMDAwMDAsXG4gICAgICAxNTUwMTAyNDAwMDAwLFxuICAgICAgMTU1MDE4ODgwMDAwMCxcbiAgICAgIDE1NTAyNzUyMDAwMDAsXG4gICAgICAxNTUwMzYxNjAwMDAwLFxuICAgICAgMTU1MDQ0ODAwMDAwMCxcbiAgICAgIDE1NTA1MzQ0MDAwMDAsXG4gICAgICAxNTUwNjIwODAwMDAwLFxuICAgICAgMTU1MDcwNzIwMDAwMCxcbiAgICAgIDE1NTA3OTM2MDAwMDAsXG4gICAgICAxNTUwODgwMDAwMDAwLFxuICAgICAgMTU1MDk2NjQwMDAwMCxcbiAgICAgIDE1NTEwNTI4MDAwMDAsXG4gICAgICAxNTUxMTM5MjAwMDAwLFxuICAgICAgMTU1MTIyNTYwMDAwMCxcbiAgICAgIDE1NTEzMTIwMDAwMDAsXG4gICAgICAxNTUxMzk4NDAwMDAwLFxuICAgICAgMTU1MTQ4NDgwMDAwMCxcbiAgICAgIDE1NTE1NzEyMDAwMDAsXG4gICAgICAxNTUxNjU3NjAwMDAwLFxuICAgICAgMTU1MTc0NDAwMDAwMCxcbiAgICAgIDE1NTE4MzA0MDAwMDAsXG4gICAgICAxNTUxOTE2ODAwMDAwLFxuICAgICAgMTU1MjAwMzIwMDAwMFxuICAgIF0sXG4gICAgW1xuICAgICAgXCJ5MFwiLFxuICAgICAgMzcsXG4gICAgICAyMCxcbiAgICAgIDMyLFxuICAgICAgMzksXG4gICAgICAzMixcbiAgICAgIDM1LFxuICAgICAgMTksXG4gICAgICA2NSxcbiAgICAgIDM2LFxuICAgICAgNjIsXG4gICAgICAxMTMsXG4gICAgICA2OSxcbiAgICAgIDEyMCxcbiAgICAgIDYwLFxuICAgICAgNTEsXG4gICAgICA0OSxcbiAgICAgIDcxLFxuICAgICAgMTIyLFxuICAgICAgMTQ5LFxuICAgICAgNjksXG4gICAgICA1NyxcbiAgICAgIDIxLFxuICAgICAgMzMsXG4gICAgICA1NSxcbiAgICAgIDkyLFxuICAgICAgNjIsXG4gICAgICA0NyxcbiAgICAgIDUwLFxuICAgICAgNTYsXG4gICAgICAxMTYsXG4gICAgICA2MyxcbiAgICAgIDYwLFxuICAgICAgNTUsXG4gICAgICA2NSxcbiAgICAgIDc2LFxuICAgICAgMzMsXG4gICAgICA0NSxcbiAgICAgIDY0LFxuICAgICAgNTQsXG4gICAgICA4MSxcbiAgICAgIDE4MCxcbiAgICAgIDEyMyxcbiAgICAgIDEwNixcbiAgICAgIDM3LFxuICAgICAgNjAsXG4gICAgICA3MCxcbiAgICAgIDQ2LFxuICAgICAgNjgsXG4gICAgICA0NixcbiAgICAgIDUxLFxuICAgICAgMzMsXG4gICAgICA1NyxcbiAgICAgIDc1LFxuICAgICAgNzAsXG4gICAgICA5NSxcbiAgICAgIDcwLFxuICAgICAgNTAsXG4gICAgICA2OCxcbiAgICAgIDYzLFxuICAgICAgNjYsXG4gICAgICA1MyxcbiAgICAgIDM4LFxuICAgICAgNTIsXG4gICAgICAxMDksXG4gICAgICAxMjEsXG4gICAgICA1MyxcbiAgICAgIDM2LFxuICAgICAgNzEsXG4gICAgICA5NixcbiAgICAgIDU1LFxuICAgICAgNTgsXG4gICAgICAyOSxcbiAgICAgIDMxLFxuICAgICAgNTUsXG4gICAgICA1MixcbiAgICAgIDQ0LFxuICAgICAgMTI2LFxuICAgICAgMTkxLFxuICAgICAgNzMsXG4gICAgICA4NyxcbiAgICAgIDI1NSxcbiAgICAgIDI3OCxcbiAgICAgIDIxOSxcbiAgICAgIDE3MCxcbiAgICAgIDEyOSxcbiAgICAgIDEyNSxcbiAgICAgIDEyNixcbiAgICAgIDg0LFxuICAgICAgNjUsXG4gICAgICA1MyxcbiAgICAgIDE1NCxcbiAgICAgIDU3LFxuICAgICAgNzEsXG4gICAgICA2NCxcbiAgICAgIDc1LFxuICAgICAgNzIsXG4gICAgICAzOSxcbiAgICAgIDQ3LFxuICAgICAgNTIsXG4gICAgICA3MyxcbiAgICAgIDg5LFxuICAgICAgMTU2LFxuICAgICAgODYsXG4gICAgICAxMDUsXG4gICAgICA4OCxcbiAgICAgIDQ1LFxuICAgICAgMzMsXG4gICAgICA1NixcbiAgICAgIDE0MixcbiAgICAgIDEyNCxcbiAgICAgIDExNCxcbiAgICAgIDY0XG4gICAgXSxcbiAgICBbXG4gICAgICBcInkxXCIsXG4gICAgICAyMixcbiAgICAgIDEyLFxuICAgICAgMzAsXG4gICAgICA0MCxcbiAgICAgIDMzLFxuICAgICAgMjMsXG4gICAgICAxOCxcbiAgICAgIDQxLFxuICAgICAgNDUsXG4gICAgICA2OSxcbiAgICAgIDU3LFxuICAgICAgNjEsXG4gICAgICA3MCxcbiAgICAgIDQ3LFxuICAgICAgMzEsXG4gICAgICAzNCxcbiAgICAgIDQwLFxuICAgICAgNTUsXG4gICAgICAyNyxcbiAgICAgIDU3LFxuICAgICAgNDgsXG4gICAgICAzMixcbiAgICAgIDQwLFxuICAgICAgNDksXG4gICAgICA1NCxcbiAgICAgIDQ5LFxuICAgICAgMzQsXG4gICAgICA1MSxcbiAgICAgIDUxLFxuICAgICAgNTEsXG4gICAgICA2NixcbiAgICAgIDUxLFxuICAgICAgOTQsXG4gICAgICA2MCxcbiAgICAgIDY0LFxuICAgICAgMjgsXG4gICAgICA0NCxcbiAgICAgIDk2LFxuICAgICAgNDksXG4gICAgICA3MyxcbiAgICAgIDMwLFxuICAgICAgODgsXG4gICAgICA2MyxcbiAgICAgIDQyLFxuICAgICAgNTYsXG4gICAgICA2NyxcbiAgICAgIDUyLFxuICAgICAgNjcsXG4gICAgICAzNSxcbiAgICAgIDYxLFxuICAgICAgNDAsXG4gICAgICA1NSxcbiAgICAgIDYzLFxuICAgICAgNjEsXG4gICAgICAxMDUsXG4gICAgICA1OSxcbiAgICAgIDUxLFxuICAgICAgNzYsXG4gICAgICA2MyxcbiAgICAgIDU3LFxuICAgICAgNDcsXG4gICAgICA1NixcbiAgICAgIDUxLFxuICAgICAgOTgsXG4gICAgICAxMDMsXG4gICAgICA2MixcbiAgICAgIDU0LFxuICAgICAgMTA0LFxuICAgICAgNDgsXG4gICAgICA0MSxcbiAgICAgIDQxLFxuICAgICAgMzcsXG4gICAgICAzMCxcbiAgICAgIDI4LFxuICAgICAgMjYsXG4gICAgICAzNyxcbiAgICAgIDY1LFxuICAgICAgODYsXG4gICAgICA3MCxcbiAgICAgIDgxLFxuICAgICAgNTQsXG4gICAgICA3NCxcbiAgICAgIDcwLFxuICAgICAgNTAsXG4gICAgICA3NCxcbiAgICAgIDc5LFxuICAgICAgODUsXG4gICAgICA2MixcbiAgICAgIDM2LFxuICAgICAgNDYsXG4gICAgICA2OCxcbiAgICAgIDQzLFxuICAgICAgNjYsXG4gICAgICA1MCxcbiAgICAgIDI4LFxuICAgICAgNjYsXG4gICAgICAzOSxcbiAgICAgIDIzLFxuICAgICAgNjMsXG4gICAgICA3NCxcbiAgICAgIDgzLFxuICAgICAgNjYsXG4gICAgICA0MCxcbiAgICAgIDYwLFxuICAgICAgMjksXG4gICAgICAzNixcbiAgICAgIDI3LFxuICAgICAgNTQsXG4gICAgICA4OSxcbiAgICAgIDUwLFxuICAgICAgNzMsXG4gICAgICA1MlxuICAgIF1cbiAgXSxcbiAgXCJ0eXBlc1wiOiB7XG4gICAgXCJ5MFwiOiBcImxpbmVcIixcbiAgICBcInkxXCI6IFwibGluZVwiLFxuICAgIFwieFwiOiBcInhcIlxuICB9LFxuICBcIm5hbWVzXCI6IHtcbiAgICBcInkwXCI6IFwiIzBcIixcbiAgICBcInkxXCI6IFwiIzFcIlxuICB9LFxuICBcImNvbG9yc1wiOiB7XG4gICAgXCJ5MFwiOiBcIiMzREMyM0ZcIixcbiAgICBcInkxXCI6IFwiI0YzNEM0NFwiXG4gIH1cbn1cblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFydDFcIik7XG5jb25zdCBjaGFydCA9IG5ldyBDaGFydChjYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQsIGRhdGEpO1xuY29uc3Qgc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5jb25zdCBlbmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuZFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuY29uc3QgYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5cIik7XG5pZiAoYnRuICYmIHN0YXJ0ICYmIGVuZCkge1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgIGNoYXJ0LmRyYXcocGFyc2VJbnQoc3RhcnQudmFsdWUpLCBwYXJzZUludChlbmQudmFsdWUpKVxuICB9KVxufVxuXG5jaGFydC5kcmF3KDAsIDEwKTsiXSwic291cmNlUm9vdCI6IiJ9