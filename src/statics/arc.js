(function() {
  "use strict";
  var Arc;

  Arc = (function() {
    function Arc(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    }

    Arc.prototype.draw = function(direction, angle, distance, arrow) {
      var centerX, centerY, end, start, _ref;
      this.ctx.fillStyle = "#eee";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.save();
      this.ctx.translate(0.5, 0.5);
      this.drawBackground();
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = '#000000';
      this.ctx.fillStyle = 'rgba(255, 240, 240, 0.7)';
      _ref = this.coord(0, 0), centerX = _ref[0], centerY = _ref[1];
      start = direction - angle / 2;
      end = direction + angle / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, distance, this.radian(start), this.radian(end));
      this.ctx.lineTo(centerX, centerY);
      this.ctx.stroke();
      this.ctx.fill();
      this.drawDirection(direction, distance);
      this.drawArrow(arrow);
      return this.ctx.restore();
    };

    Arc.prototype.line = function(fromX, fromY, toX, toY) {
      var _ref, _ref1;
      _ref = this.coord(fromX, fromY), fromX = _ref[0], fromY = _ref[1];
      _ref1 = this.coord(toX, toY), toX = _ref1[0], toY = _ref1[1];
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#dddddd';
      this.ctx.beginPath();
      this.ctx.moveTo(fromX, fromY);
      this.ctx.lineTo(toX, toY);
      return this.ctx.stroke();
    };

    Arc.prototype.drawDirection = function(direction, distance) {
      this.ctx.save();
      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.rotate(this.radian(direction));
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#ff0000';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(distance, 0);
      this.ctx.stroke();
      return this.ctx.restore();
    };

    Arc.prototype.drawArrow = function(direction) {
      this.ctx.save();
      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.rotate(this.radian(-direction));
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#000000';
      this.ctx.fillStyle = '#8888ff';
      this.ctx.beginPath();
      this.ctx.moveTo(10, 0);
      this.ctx.lineTo(-10, 6);
      this.ctx.lineTo(-4, 0);
      this.ctx.lineTo(-10, -6);
      this.ctx.lineTo(10, 0);
      this.ctx.stroke();
      this.ctx.fill();
      return this.ctx.restore();
    };

    Arc.prototype.drawBackground = function() {
      var half, x, y, _i, _j, _ref, _ref1, _results;
      half = this.width / 2;
      for (x = _i = 0, _ref = this.width / 2; _i <= _ref; x = _i += 10) {
        this.line(x, half, x, -half);
        this.line(-x, half, -x, -half);
      }
      half = this.height / 2;
      _results = [];
      for (y = _j = 0, _ref1 = this.height / 2; _j <= _ref1; y = _j += 10) {
        this.line(half, y, -half, y);
        _results.push(this.line(half, -y, -half, -y));
      }
      return _results;
    };

    Arc.prototype.coord = function(x, y) {
      return [x + this.width / 2, -y + this.height / 2];
    };

    Arc.prototype.radian = function(degree) {
      return degree * Math.PI / 180;
    };

    return Arc;

  })();

  document.addEventListener('DOMContentLoaded', () => {
    let elements = document.querySelectorAll('canvas.arc');
    for(let i = 0; i < elements.length; i++ ) {
      let element = elements[i];
      new Arc(element).draw(
        element.getAttribute('data-direction') - 0,
        element.getAttribute('data-angle') - 0,
        element.getAttribute('data-distance') - 0,
        element.getAttribute('data-arrow') - 0 || 0);
    }
  });

}).call(this);
