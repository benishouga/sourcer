var SourcerAi = (function () {
    function SourcerAi() {
        var _this = this;
        this.port = function (ctrl) { return _this.think(ctrl); };
    }
    SourcerAi.prototype.think = function (ctrl) {
        if (ctrl.altitude() < 100) {
            ctrl.ascent();
        }
    };
    return SourcerAi;
})();
module.exports = new SourcerAi().port;
