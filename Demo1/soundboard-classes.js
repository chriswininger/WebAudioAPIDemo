(function(){
    var _OscillatorControl = function(id) {
        this.id = id;
    };

    _OscillatorControl.prototype = {
        'constructor': _OscillatorControl(),
        'id': '0',
        'waveType': 'sine',
        'uiControls':[{
            'name': 'ui-wave-type-selector',
            'html': '<input name="' + id + this.name  + '" type="radio" value="sine" checked /> Sine ' +
                    '<input name="' + id + this.name  + '" type="radio" value="square" /> Square ' +
                    '<input name="' + id + this.name  + '" type="radio" value="sawtooth" /> Saw Tooth'
        },{
            'name': 'ui-wave-pitch-selector',
            'html': '<div class="horizontal-slider"></div>'
        },
        {
            'name': 'ui-wave-volume-selector',
            'html': '<div class="horizontal-slider"></div>'
        }],
        'render': function() {
            for (var i = 0, out = ''; i < uiControls.length; i++) {
                out += uiControls[i].html;
            }

            return out;
        }
    };

    // Create global hooks
    this.OscillatorControl = _OscillatorControl;

})();
