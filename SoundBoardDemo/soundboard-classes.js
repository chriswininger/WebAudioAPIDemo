/*
 * soundboard-classes javascript demo
 * Resources: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html, http://noisehack.com/generate-noise-web-audio-api/
 *
 * Copyright 2013 Chris Wininger
 * Released under the MIT license
 * https://github.com/chriswininger/jstar/blob/master/license.md
 *
 * Date: Sat Aug 29 2013
 */

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
           return renderHelper(this.uiControls, this.id);
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
            return renderHelper(this.uiControls, this.id);
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
                    '</div>' +
                    '</br>'
            },
            {
                'name': 'ui-sample-speed-control',
                'html': '<div>' +
                            '<input type="number" min="0" max="1024" step="0.05" data-name="{name}" data-index="{index}" />' +
                        '</div>'
            },
            {
                'name': 'ui-sample-start',
                'html': '<br /><div><button data-name="{name}" data-index="{index}" name="{id}-{name}" disabled>Start Sample</button>'
            },
            {
                'name': 'ui-sample-stop',
                'html': '<button data-name="{name}" data-index="{index}" name="{id}-{name}" disabled>Stop Sample</button></div>'
            }]
    };

    /* --- Delay Control --- */
    var _DelayControl;

    _DelayControl = function (id) {
        var _self = this;

        this.id = id;
        this.displayName = 'Delay Control';
        this.render = function () {
            return renderHelper(this.uiControls, this.id);
        };
    };

    _DelayControl.prototype = {
        'constructor': _DelayControl,
        'uiControls':[{
            'name': 'ui-delay-time',
            'html': '<div>' +
                        '<label>Delay: </label><input type="number" min="0" max="2" step="0.05" data-name="{name}" data-index="{index}"  id="{id}-{name}" />' +
                    '</div>' +
                    '<br />'
        }]
    };

    var _LowPassFilter = function(id){
        this.id = id;
        this.displayName = 'Low Pass Control';
        this.render = function () {
            return renderHelper(this.uiControls, this.id);
        };
    };

    _LowPassFilter.prototype = {
        'constructor': _DelayControl,
        'uiControls': [{
            'name': 'ui-lp-cutoff-freq',
            'html': '<div>' +
                        '<label>Cutoff Frequency: </label><input type="number" min="0" max="60000" step="1" data-name="{name}" data-index="{index}"  id="{id}-{name}" /> '

            },
            {
                'name': 'ui-lp-q',
                'html': '<label>Q (resonance in dB): </label><input type="number" min="0" max="12" step="1" data-name="{name}" data-index="{index}"  id="{id}-{name}" /></div>'
            }]
    };

    var _WhiteNoiseControl = function(id){
        this.id = id;
        this.displayName = 'White Noise Control';
        this.render = function () {
            return renderHelper(this.uiControls, this.id);
        };
    };

    _WhiteNoiseControl.prototype = {
        'constructor': _WhiteNoiseControl,
        'uiControls': [{
            'name': 'ui-white-start',
            'html': '<br /><div><button data-name="{name}" data-index="{index}" name="{id}-{name}">Start Tone</button>'

            },
            {
                'name': 'ui-white-stop',
                'html': '<button data-name="{name}" data-index="{index}" name="{id}-{name}">Stop Tone</button></div>'

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
    this.DelayControl = _DelayControl;
    this.LowPassFilter = _LowPassFilter;
    this.WhiteNoiseControl = _WhiteNoiseControl;

})();
