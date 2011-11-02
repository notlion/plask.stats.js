var plask = require('plask');

exports.Stats = function(width, height){
    var _time = Date.now()
    ,   _timeLastFrame = _time
    ,   _timeLastSecond = _time
    ,   _fps, _fpsMin = 30, _fpsMax = 60
    ,   _frames = 0, _ms = 0
    ,   _padding = 3, _fontSize = 11
    ,   _canvas = new plask.SkCanvas(width, height)
    ,   _paint = new plask.SkPaint()
    ,   _fpsLog = new Array(width - _padding * 2)
    ,   _window = null;

    _paint.setFontFamily("Helvetica");
    _paint.setTextSize(_fontSize);
    _canvas.drawColor(24, 12, 36, 255);

    this.canvas = _canvas;
    this.width  = _canvas.width;
    this.height = _canvas.height;

    this.update = function(){
        _time = Date.now();
        _ms = _time - _timeLastFrame;
        _timeLastFrame = _time;

        _frames += 1;

        if(_time > _timeLastSecond + 1000){
            _fps = Math.round((_frames * 1000) / (_time - _timeLastSecond));
            _fpsMin = Math.min(_fpsMin, _fps);
            _fpsMax = Math.max(_fpsMax, _fps);
            _fpsLog.shift();
            _fpsLog.push(_fps);

            _canvas.drawColor(24, 12, 36, 255);

            var yPos = Math.floor(_padding + (_fontSize * 0.75));
            _paint.setColor(0, 255, 255, 255);
            _paint.setStyle(_paint.kFillStyle);
            _paint.setFlags(_paint.kAntiAliasFlag);
            _canvas.drawText(_paint, _fps + " FPS", _padding, yPos);

            _canvas.save();
            _canvas.translate(_padding, _canvas.height - _padding);
            _canvas.scale(1, -(height - (yPos + _padding * 2)));
            _paint.setColor(36, 16, 48, 255);
            _paint.setStyle(_paint.kFillStyle);
            _paint.setFlags();
            _canvas.drawRect(_paint, 0, 0, _fpsLog.length, 1);
            _paint.setColor(0, 255, 255, 255);
            _paint.setStyle(_paint.kStrokeStyle);
            for(var i = 0, n = _fpsLog.length; i < n; i++){
                _canvas.drawLine(_paint, i, 0, i, (_fpsLog[i] - _fpsMin) / (_fpsMax - _fpsMin));
            }
            _canvas.restore();

            _timeLastSecond = _time;
            _frames = 0;

            if(_window){
                _window.redraw();
                _window.setTitle(_fps + " FPS");
            }
        }
    };

    this.open = function(settings){
        if(!settings)
            settings = {};

        settings.width = _canvas.width;
        settings.height = _canvas.height;

        if(!_window){
            _window = plask.simpleWindow({
                settings: settings,
                draw: function(){
                    this.canvas.drawCanvas(this.paint, _canvas, 0, 0, _canvas.width, _canvas.height);
                }
            });
        }

        return this;
    };
};
