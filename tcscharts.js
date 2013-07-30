(function() {
  var Base, _Base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  _Base = Base = (function() {
    Base.prototype.defaults = {};

    Base.prototype.getter = function(prop, fnGet, obj) {
      if (obj == null) {
        obj = this;
      }
      Object.defineProperty(obj, prop, {
        get: fnGet
      });
    };

    Base.prototype.setter = function(prop, fnGet, obj) {
      if (obj == null) {
        obj = this;
      }
      Object.defineProperty(obj, prop, {
        set: fnGet
      });
    };

    Base.prototype.define = function(prop, oDef, obj) {
      Object.defineProperty(obj, prop, oDef);
    };

    Base.prototype._extend = function() {
      var key, object, objects, value, _i, _len;
      objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          value = object[key];
          objects[0][key] = value;
        }
      }
      return objects[0];
    };

    function Base(target) {
      var _e;
      this.target = target;
      this._extend = __bind(this._extend, this);
      this.define = __bind(this.define, this);
      this.setter = __bind(this.setter, this);
      this.getter = __bind(this.getter, this);
      try {
        Object.defineProperty(this, "testIE", {
          get: function() {
            return false;
          }
        });
      } catch (_error) {
        _e = _error;
        return new Error("browser-outdated", "tcs-charts not availible on IE8 and lower.");
      }
      return;
    }

    return Base;

  })();

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = _Base;
  } else {
    window.tcscharts || (window.tcscharts = {});
    window.tcscharts.Base = _Base;
  }

}).call(this);

(function() {
  var Gauge, _Base, _Gauge,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    _Base = require("./base.js");
    this.d3 = require("d3");
  } else {
    _Base = window.tcscharts.Base;
  }

  _Gauge = Gauge = (function(_super) {
    __extends(Gauge, _super);

    Gauge.prototype.defaults = {
      width: 500,
      margin: 0,
      startAngle: -75,
      endAngle: 75,
      thicknessFactor: .8,
      needleLengthFactor: null,
      bgColor: "#ddd",
      needleColor: "#333",
      fixedColor: null,
      startColor: "#B4EB57",
      endColor: "#D10000",
      animationDuration: 500,
      useFloat: false
    };

    Gauge.prototype._rad = 2 * Math.PI / 360;

    function Gauge(target, startValue, options) {
      var oDef, _ret,
        _this = this;
      this.target = target;
      if (startValue == null) {
        startValue = 0;
      }
      this.tweenNeedle = __bind(this.tweenNeedle, this);
      this.tween = __bind(this.tween, this);
      this._set = __bind(this._set, this);
      this._getColorByFactor = __bind(this._getColorByFactor, this);
      this._getAngleByFactor = __bind(this._getAngleByFactor, this);
      this._calcNeedle = __bind(this._calcNeedle, this);
      this.create = __bind(this.create, this);
      this._arc = __bind(this._arc, this);
      this._radToAngle = __bind(this._radToAngle, this);
      this._angleToRad = __bind(this._angleToRad, this);
      this._initOption = __bind(this._initOption, this);
      this._initOptions = __bind(this._initOptions, this);
      _ret = Gauge.__super__.constructor.call(this, this.target);
      this._initOptions(options, true);
      oDef = {
        get: function() {
          return _this._value * 100;
        },
        set: function(_v) {
          if (!_this.useFloat) {
            _v = _v / 100;
          }
          if (_v >= 1) {
            _v = 1;
          }
          _this._set(_v);
        }
      };
      this.define("value", oDef, this);
      this.value = startValue;
      this.create();
      return _ret;
    }

    Gauge.prototype._initOptions = function(options, def) {
      var _k;
      if (def == null) {
        def = false;
      }
      if (def) {
        this._extend(this.opt = {}, this.defaults, options);
      }
      this.opt.height = this.opt.width / 2;
      if (def) {
        for (_k in this.opt) {
          this._initOption(_k);
        }
      }
    };

    Gauge.prototype._initOption = function(key) {
      var odef,
        _this = this;
      odef = {
        get: function() {
          if (key === "needleLengthFactor" && (_this.opt[key] == null)) {
            return _this.opt["thicknessFactor"];
          } else {
            return _this.opt[key];
          }
        },
        set: function(_v) {
          _this.opt[key] = _v;
          switch (key) {
            case "width":
            case "needleLengthFactor":
            case "thicknessFactor":
              _this._initOptions(null);
              _this.create();
              break;
            case "animationDuration":
            case "startColor":
            case "endColor":
              break;
            default:
              _this.create();
          }
        }
      };
      return this.define(key, odef, this);
    };

    Gauge.prototype._angleToRad = function(angl) {
      return this._rad * angl;
    };

    Gauge.prototype._radToAngle = function(rad) {
      return rad / this._rad;
    };

    Gauge.prototype._arc = function(end) {
      var arc;
      arc = d3.svg.arc().outerRadius(this.opt.width / 2.05).innerRadius(this.opt.width / 6 / this.opt.thicknessFactor).startAngle(this._angleToRad(this.opt.startAngle));
      if (end != null) {
        arc.endAngle(this._angleToRad(end));
      }
      return arc;
    };

    Gauge.prototype.create = function() {
      var _tgrt;
      _tgrt = d3.select(this.target);
      _tgrt.select("svg").remove();
      this.svg = _tgrt.append("svg").attr("height", this.opt.height + this.opt.margin * 2).attr("width", this.opt.width + this.opt.margin * 2).append("g").attr("transform", "translate(" + this.opt.margin + "," + this.opt.margin + ")");
      this.bg = this.svg.append("path").style("fill", this.opt.bgColor).attr("class", "bg").attr("transform", "translate(" + this.opt.height + "," + this.opt.height + ")").attr("d", this._arc(this.opt.endAngle));
      this.color = this.svg.append("path").attr("class", "color").attr("transform", "translate(" + this.opt.height + "," + this.opt.height + ")").datum({
        endAngle: this._angleToRad(this._getAngleByFactor(this._value)),
        fill: this._getColorByFactor(this._value)
      }).attr("d", (this.arc = this._arc()));
      if (this.opt.fixedColor != null) {
        this.color.attr("fill", this.opt.fixedColor);
      }
      if (!this.opt.neelde) {
        this.needle = this.svg.append("path").style("fill", this.opt.needleColor).attr("class", "needle").datum({
          angle: this._getAngleByFactor(this._value)
        }).attr("d", this._calcNeedle()).attr("transform", "rotate(" + (this._getAngleByFactor(0)) + " " + this.opt.height + " " + this.opt.height + ")");
      }
      this._set(this._value);
    };

    Gauge.prototype._calcNeedle = function() {
      var _h, _w;
      _w = this.opt.width;
      _h = this.opt.height;
      return "M" + (_w * 0.495) + " 0 L" + (_w * 0.505) + " 0 L" + (_w * 0.52) + " " + (_h * .73 * this.needleLengthFactor) + " L" + (_w * 0.48) + " " + (_h * .73 * this.needleLengthFactor) + " Z";
    };

    Gauge.prototype._getAngleByFactor = function(factor) {
      return d3.interpolate(this.opt.startAngle, this.opt.endAngle)(factor);
    };

    Gauge.prototype._getColorByFactor = function(factor) {
      return d3.interpolateRgb(this.opt.startColor, this.opt.endColor)(factor);
    };

    Gauge.prototype._set = function(_value, duration) {
      this._value = _value;
      if (duration == null) {
        duration = this.opt.animationDuration;
      }
      if (this.color != null) {
        this.color.transition().duration(duration).call(this.tween, this._value);
      }
      if (!this.opt.neelde && (this.needle != null)) {
        this.needle.transition().duration(duration).call(this.tweenNeedle, this._value);
      }
    };

    Gauge.prototype.tween = function(transition, factor) {
      var _angle, _color,
        _this = this;
      _angle = this._getAngleByFactor(factor);
      transition.attrTween("d", function(d) {
        var interpolate;
        interpolate = d3.interpolate(_this.color.datum().endAngle, _this._angleToRad(_angle));
        return function(t) {
          d.endAngle = interpolate(t);
          return _this.arc(d);
        };
      });
      if (this.opt.fixedColor != null) {
        return;
      }
      _color = this._getColorByFactor(factor);
      transition.attrTween("fill", function(d) {
        var interpolate;
        interpolate = d3.interpolate(_this.color.datum().fill, _color);
        return function(t) {
          _color = interpolate(t);
          _this.color.datum().fill = _color;
          return _color;
        };
      });
    };

    Gauge.prototype.tweenNeedle = function(transition, factor) {
      var newAngle,
        _this = this;
      newAngle = this._getAngleByFactor(factor);
      transition.attrTween("transform", function(rotate) {
        var interpolate;
        interpolate = d3.interpolate(_this.needle.datum().angle, newAngle);
        return function(t) {
          var _newAngle;
          _newAngle = interpolate(t);
          _this.needle.datum().angle = _newAngle;
          return "rotate(" + _newAngle + " " + _this.opt.height + " " + _this.opt.height + ")";
        };
      });
    };

    return Gauge;

  })(_Base);

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = _Gauge;
  } else {
    window.tcscharts || (window.tcscharts = {});
    window.tcscharts.Gauge = _Gauge;
  }

}).call(this);

(function() {
  var TimeBars, _Base, _TimeBars,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    _Base = require("./base.js");
    this.d3 = require("d3");
  } else {
    _Base = window.tcscharts.Base;
  }

  _TimeBars = TimeBars = (function(_super) {
    __extends(TimeBars, _super);

    TimeBars.prototype.defaults = {
      timeKey: "ts",
      countKey: "count",
      width: 700,
      height: 300,
      margin: {
        top: 20,
        right: 20,
        bottom: 10,
        left: 40
      },
      spacing: 3,
      barsColor: null,
      showCount: false,
      countColorIn: "#fff",
      countColorOut: "#666",
      ticks: "minutes",
      timeFormat: null,
      timeDomain: null,
      smallBarWidth: 20,
      animationDuration: 600
    };

    function TimeBars(target, data, options) {
      var _ret;
      this.target = target;
      this.data = data != null ? data : [];
      this._update = __bind(this._update, this);
      this.reset = __bind(this.reset, this);
      this.rem = __bind(this.rem, this);
      this.add = __bind(this.add, this);
      this.getData = __bind(this.getData, this);
      this._calcBarWidth = __bind(this._calcBarWidth, this);
      this.create = __bind(this.create, this);
      this._leaveRect = __bind(this._leaveRect, this);
      this._enterRect = __bind(this._enterRect, this);
      this.fnRect = __bind(this.fnRect, this);
      this._initOption = __bind(this._initOption, this);
      this._initOptions = __bind(this._initOptions, this);
      this._calcMetrics = __bind(this._calcMetrics, this);
      _ret = TimeBars.__super__.constructor.call(this, this.target);
      this._initOptions(options, true);
      this._calcMetrics();
      this.create();
      return _ret;
    }

    TimeBars.prototype._calcMetrics = function() {
      var times, _d, _dt,
        _this = this;
      if (this.domainX != null) {
        this._oldDomainX = this.domainX;
      }
      if (this.opt.timeDomain != null) {
        this.domainX = this.opt.timeDomain;
        this.data = (function() {
          var _i, _len, _ref, _results;
          _ref = this.data;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _dt = _ref[_i];
            if (_dt[this.opt.timeKey] > this.domainX[0] && _dt[this.opt.timeKey] < this.domainX[1]) {
              _results.push(_dt);
            }
          }
          return _results;
        }).call(this);
      } else {
        times = (function() {
          var _i, _len, _ref, _results;
          _ref = this.data;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _d = _ref[_i];
            _results.push(_d[this.opt.timeKey]);
          }
          return _results;
        }).call(this);
        this.domainX = [d3.min(times), d3.max(times)];
      }
      this.domainY = [
        d3.max(this.data, (function(d) {
          return d[_this.opt.countKey];
        })), 0
      ];
      this.interpolateX = d3.time.scale().domain(this.domainX);
      this.interpolateY = d3.scale.linear().range([0, this.opt.height - 25]).domain(this.domainY);
      this._barWidth = this._calcBarWidth();
      this.interpolateX.range([0, this.opt.width - this._barWidth]);
      this.xAxis = d3.svg.axis().scale(this.interpolateX).orient("bottom");
      this.yAxis = d3.svg.axis().scale(this.interpolateY).tickSize(this.opt.width).orient("left");
      if (this.opt.tickCount != null) {
        this.xAxis.ticks(this.opt.tickCount);
      }
      if (this.opt.timeFormat != null) {
        if (typeof this.opt.timeFormat === "function") {
          this.xAxis.tickFormat(this.opt.timeFormat);
        } else {
          this.xAxis.tickFormat(function(date) {
            return d3.time.format(_this.opt.timeFormat)(date);
          });
        }
      }
    };

    TimeBars.prototype._initOptions = function(options, def) {
      var _k;
      if (def == null) {
        def = false;
      }
      if (def) {
        this._extend(this.opt = {}, this.defaults, options);
      }
      this.opt._width = this.opt.width + this.opt.margin.left + this.opt.margin.right;
      this.opt._height = this.opt.height + this.opt.margin.top + this.opt.margin.bottom;
      if (def) {
        for (_k in this.opt) {
          this._initOption(_k);
        }
      }
    };

    TimeBars.prototype._initOption = function(key) {
      var odef,
        _this = this;
      odef = {
        get: function() {
          return _this.opt[key];
        },
        set: function(_v) {
          _this.opt[key] = _v;
          switch (key) {
            case "width":
            case "height":
              _this.create();
              break;
            default:
              _this.create();
          }
        }
      };
      return this.define(key, odef, this);
    };

    TimeBars.prototype.fnRect = function(update, remove) {
      var _this = this;
      if (update == null) {
        update = false;
      }
      if (remove == null) {
        remove = false;
      }
      return function(_el) {
        var _rect, _txt, _txtg;
        _el.attr("class", function(d) {
          var _classes;
          _classes = ["bar"];
          if (_this._barWidth > _this.opt.smallBarWidth) {
            _classes.push("normal");
          } else {
            _classes.push("small");
          }
          if (d[_this.opt.countKey] < _this.domainY[0] * .2) {
            _classes.push("low");
          } else {
            _classes.push("high");
          }
          return _classes.join(" ");
        });
        if (update) {
          _el.transition().duration(_this.opt.animationDuration).attrTween("transform", function(d, i, current) {
            var interX, interY, _h, _ref, _tx, _ty, _x, _y;
            _ref = current.slice(10, -1).split(","), _tx = _ref[0], _ty = _ref[1];
            if (remove) {
              _h = 0;
            } else {
              _h = _this.interpolateY(d[_this.opt.countKey]);
            }
            _x = _this.interpolateX(new Date(d.ts));
            _y = _h;
            interX = d3.interpolate(d._x || parseFloat(_tx), _x);
            interY = d3.interpolate(d._y || parseFloat(_ty), _y);
            d._x = _x;
            d._y = _y;
            d._h = _h;
            return function(_t) {
              return "translate(" + (interX(_t)) + "," + (interY(_t)) + ")";
            };
          });
        } else {
          _this = _this;
          _el.on("mouseenter", function(datum) {
            return _this._enterRect(this, datum);
          });
          _el.on("mouseleave", function(datum) {
            return _this._leaveRect(this, datum);
          });
          _el.datum(function(d) {
            var _h;
            _h = _this.interpolateY(d[_this.opt.countKey]);
            d._x = _this.interpolateX(new Date(d.ts));
            d._y = _h;
            d._h = _h;
            return d;
          }).attr("transform", function(d, i) {
            return "translate(" + d._x + "," + d._y + ")";
          });
        }
        if (update) {
          _rect = _el.select("rect");
        } else {
          _rect = _el.append("rect");
        }
        if (_this.opt.barsColor != null) {
          _rect.attr("fill", _this.opt.barsColor);
        }
        if (update) {
          _rect.transition().duration(_this.opt.animationDuration).attr("width", function() {
            return _this._barWidth;
          }).attr("height", function(d, i) {
            if (remove) {
              return 1e-6;
            } else {
              return _this.opt.height - 25 - _this.interpolateY(d[_this.opt.countKey]);
            }
          });
        } else {
          _rect.attr("width", function() {
            return _this._barWidth;
          }).attr("height", function(d, i) {
            if (remove) {
              return 1e-6;
            } else {
              return _this.opt.height - 25 - _this.interpolateY(d[_this.opt.countKey]);
            }
          });
        }
        if (_this.opt.showCount) {
          if (update) {
            _el.select(".count").attr("class", function(d) {
              var _classes;
              _classes = ["count"];
              if (_this._barWidth > _this.opt.smallBarWidth) {
                _classes.push("normal");
              } else {
                _classes.push("small");
              }
              if (d[_this.opt.countKey] < _this.domainY[0] * .2) {
                _classes.push("low");
              } else {
                _classes.push("high");
              }
              return _classes.join(" ");
            });
            _txt = _el.select("text");
          } else {
            _el.append("rect").attr("class", "count").attr("height", 20).attr("width", function() {
              return _this._barWidth - 8;
            });
            _txtg = _el.append("g").attr("transform", function() {
              return "translate(" + (_this._barWidth / 2) + ",19)";
            });
            _txt = _txtg.append("text");
          }
          _txt.text(function(d) {
            return d[_this.opt.countKey];
          });
        }
        return _el;
      };
    };

    TimeBars.prototype._enterRect = function(el, datum) {};

    TimeBars.prototype._leaveRect = function(el, datum) {};

    TimeBars.prototype.create = function() {
      var _tgrt;
      _tgrt = d3.select(this.target);
      _tgrt.select("svg").remove();
      this.svg = _tgrt.append("svg").attr("height", this.opt._height).attr("width", this.opt._width).append("g").attr("transform", "translate(" + this.opt.margin.left + "," + this.opt.margin.top + ")");
      this.gxAxis = this.svg.append("g").attr("class", "x axis").attr("transform", ("translate(" + (this._barWidth / 2) + ",") + (this.opt.height - 20) + ")").call(this.xAxis);
      this.gyAxis = this.svg.append("g").attr("class", "y axis").attr("transform", "translate(" + (this.opt.width - 12) + ", 0)").call(this.yAxis);
      this._update();
    };

    TimeBars.prototype._calcBarWidth = function() {
      var _l;
      _l = this.interpolateX.ticks(d3.time[this.opt.ticks]).length;
      return (this.opt.width - (_l * this.opt.spacing)) / _l;
    };

    TimeBars.prototype.getData = function() {
      return this.data;
    };

    TimeBars.prototype.add = function(_data) {
      this.data.push(_data);
      this._calcMetrics();
      this._update(true);
    };

    TimeBars.prototype.rem = function(id) {
      var idx, _data, _i, _len, _ref, _removed;
      _removed = false;
      _ref = this.data;
      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
        _data = _ref[idx];
        if (!(_data[this.opt.timeKey] === id)) {
          continue;
        }
        this.data.splice(idx, 1);
        _removed = true;
        break;
      }
      if (_removed) {
        this._calcMetrics();
        this._update(true);
      }
    };

    TimeBars.prototype.reset = function(data) {
      this.data = data;
      this._calcMetrics();
      this._update(true);
    };

    TimeBars.prototype._update = function(update) {
      var _rems,
        _this = this;
      if (update == null) {
        update = false;
      }
      this.bars = this.svg.selectAll(".bar").data(this.data, function(_d) {
        return _d[_this.opt.timeKey];
      });
      if (update) {
        this.gxAxis.transition().duration(this.opt.animationDuration).attr("transform", ("translate(" + (this._barWidth / 2) + ",") + (this.opt.height - 20) + ")").call(this.xAxis);
        this.gyAxis.transition().duration(this.opt.animationDuration).call(this.yAxis);
        this.bars.transition().duration(this.opt.animationDuration);
      }
      this.bars.enter().append("g").call(this.fnRect(false));
      this.bars.call(this.fnRect(true));
      _rems = this.bars.exit().call(this.fnRect(true, true)).remove();
    };

    return TimeBars;

  })(_Base);

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = _TimeBars;
  } else {
    window.tcscharts || (window.tcscharts = {});
    window.tcscharts.TimeBars = _TimeBars;
  }

}).call(this);
