// objectMappings will map ui elements by name to controls
(function(){
    /* ---- Oscillator Control ---- */
    var _OscillatorControl;

    _OscillatorControl = function (id, index, objectMappings) {
        var _self = this;

        this.id = id;
        this.index = index;
        this.displayName = 'Oscillator Control';

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
    };


    _OscillatorControl.prototype = {
        'constructor': _OscillatorControl,
        'waveType': 'sine',
        'uiControls':[{
            'name': 'ui-wave-type-selector',
            'html': '<div>' +
                    '<input data-name="{name}" data-index="{index}" name="{id}-{name}" type="radio" value="0" checked /> Sine ' +
                    '<input data-name="{name}" data-index="{index}" name="{id}-{name}" type="radio" value="1" /> Square ' +
                    '<input data-name="{name}" data-index="{index}" name="{id}-{name}" type="radio" value="2" /> Saw Tooth' +
                    '<input data-name="{name}" data-index="{index}" name="{id}-{name}" type="radio" value="3" /> Saw Tooth' +
                    '</div>' +
                    '<br />'
        },{
            'name': 'ui-wave-pitch-selector',
            'html': '<div><div data-name="{name}" data-index="{index}" class="horizontal-slider"></div></div><br />'
        },
        {
            'name': 'ui-wave-start',
            'html': '<br /><div><button data-name="{name}" data-index="{index}" name="{id}-{name}">Start Tone</button>'

        },
        {
            'name': 'ui-wave-stop',
            'html': '<button data-name="{name}" data-index="{index}" name="{id}-{name}">Stop Tone</button></div>'

        }
        ]
    };

    /* ---- In Line Volume Control ---- */
    var _InLineVolumeControl;

    _InLineVolumeControl = function (id, index, objectMappings) {
        var _self = this;

        this.id = id;
        this.index = index;
        this.displayName = 'Inline Volume Control';
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
    };

    _InLineVolumeControl.prototype = {
        'constructor': _InLineVolumeControl,
        'waveType': 'sine',
        'uiControls':[{
            'name': 'ui-volume-slider',
            'html': '<div>' +
                        '<div data-name="{name}" data-index="{index}"  id="{id}-{name}" class="horizontal-slider">' +
                    '</div>' +
                    '<br />'
        }]
    };


    /* --- Sample Control ---- */
    var _SampleControl;

    _SampleControl = function (id) {
        var _self = this;
        this.id = id;
        this.displayName = 'Sample Control';
        this.render = function() {
            return renderHelper(this.uiControls, _self.id);
        }
    }

    _SampleControl.prototype = {
        'constructor': _SampleControl,
        'uiControls':[{
            'name': 'ui-sample-file-chooser',
            'html': '<div>' +
                        '<input type="file" data-name="{name}" data-index="{index}"  id="{id}-{name}" />' +
                    '</div>'
        }]
    };

    /* --- Shared Functions ---- */
    function renderHelper(uiControls, id) {
        for (var i = 0, out = '', ctrl = null; i < uiControls.length; i++) {
            ctrl = uiControls[i];
            out += ctrl.html
                .replace(/(\{name\})/g, ctrl.name)
                .replace(/(\{index\})/g, this.index)
                .replace(/(\{id\})/g, this.id);
        }

        return '<div id = "' + id + '">' + out + '</div>';
    }

    // --- Create global hooks ---
    this.OscillatorControl = _OscillatorControl;
    this.InLineVolumeControl = _InLineVolumeControl;
    this.SampleControl = _SampleControl;

})();
