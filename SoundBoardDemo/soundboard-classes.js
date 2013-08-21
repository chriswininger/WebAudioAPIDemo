// objectMappings will map ui elements by name to controls
(function(){
    var _OscillatorControl;
    _OscillatorControl = function (id, index, objectMappings) {
        var _self = this;

        this.id = id;
        this.index = index;

        this.render = function () {
            for (var i = 0, out = '', ctrl = null; i < this.uiControls.length; i++) {
                ctrl = this.uiControls[i];
                out += ctrl.html
                    .replace(/(\{name\})/g, ctrl.name)
                    .replace(/(\{index\})/g, this.index)
                    .replace(/(\{id\})/g, this.id);
            }

            return '<div id = "' + _self.id + '">' + out + '</div>';
        };

        this.updateOscilator = function () {
            var div = $('#' + _self.id),
                pitch = $('[data-name=ui-wave-pitch-selector]', div);
            var str= '';
        }
    };


    _OscillatorControl.prototype = {
        'constructor': _OscillatorControl,
        'waveType': 'sine',
        'uiControls':[{
            'name': 'ui-wave-type-selector',
            'html': '<div>' +
                    '<input data-name="{name}" data-index="{index}" name="{id}-{name}" type="radio" value="sine" checked /> Sine ' +
                    '<input data-name="{name}" data-index="{index}" name="{id}-{name}" type="radio" value="square" /> Square ' +
                    '<input data-name="{name}" data-index="{index}" name="{id}-{name}" type="radio" value="sawtooth" /> Saw Tooth' +
                    '</div>' +
                    '<br />'
        },{
            'name': 'ui-wave-pitch-selector',
            'html': '<div><div data-name="{name}" data-index="{index}" class="horizontal-slider"></div></div><br />'
        },
        {
            'name': 'ui-wave-volume-selector',
            'html': '<div><div data-name="{name}" data-index="{index}" class="horizontal-slider"></div></div>'
        },
        {
            'name': 'ui-wave-start',
            'html': '<div><button data-name="{name}" data-index="{index}" name="{id}-{name}">State Tone</button></div>'

        }]
    };

    // Create global hooks
    this.OscillatorControl = _OscillatorControl;

})();
