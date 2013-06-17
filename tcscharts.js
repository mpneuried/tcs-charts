(function() {
  var Gauge, _Gauge,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    this.d3 = require("d3");
  }

  _Gauge = Gauge = (function() {
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
      animationDuration: 500
    };

    Gauge.prototype._rad = 2 * Math.PI / 360;

    Gauge.prototype.getter = function(prop, fnGet, obj) {
      if (obj == null) {
        obj = this;
      }
      Object.defineProperty(obj, prop, {
        get: fnGet
      });
    };

    Gauge.prototype.setter = function(prop, fnGet, obj) {
      if (obj == null) {
        obj = this;
      }
      Object.defineProperty(obj, prop, {
        set: fnGet
      });
    };

    Gauge.prototype.define = function(prop, oDef, obj) {
      Object.defineProperty(obj, prop, oDef);
    };

    Gauge.prototype._extend = function() {
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

    function Gauge(target, startValue, options) {
      var oDef,
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
      this._extend = __bind(this._extend, this);
      this.define = __bind(this.define, this);
      this.setter = __bind(this.setter, this);
      this.getter = __bind(this.getter, this);
      this._initOptions(options, true);
      oDef = {
        get: function() {
          return _this._value * 100;
        },
        set: function(_v) {
          if (_v > 1) {
            _v = _v / 100;
          }
          _this._set(_v);
        }
      };
      this.define("value", oDef, this);
      this.value = startValue;
      this.create();
      return;
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
      this.svg = _tgrt.append("svg").attr("height", this.opt.height + this.opt.margin * 2).attr("width", this.opt.width + this.opt.margin * 2).style("fill", "#666").append("g").attr("transform", "translate(" + this.opt.margin + "," + this.opt.margin + ")");
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

  })();

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = _Gauge;
  } else {
    window.tcscharts || (window.tcscharts = {});
    window.tcscharts.Gauge = _Gauge;
  }

}).call(this);
