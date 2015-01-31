/*
 * soundboard javascript demo
 * Resources: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html, http://noisehack.com/generate-noise-web-audio-api/
 *
 * Copyright 2013 Chris Wininger
 * Released under the MIT license
 * https://github.com/chriswininger/jstar/blob/master/license.md
 *
 * Date: Sat Aug 29 2013
 */

(function(){
    var context, mainVol, idInc = 0,
        sampleBuffer,
        audioControls = [],
        audioControlsByLine = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];

    // Document Load
    $(function(){
        initUI();
        // Get the audio context and wire up the main volume
        initSound();
    });

    function initSound() {
        context = new webkitAudioContext(),
            mainVol = context.createGain();

        mainVol.connect(context.destination);
        mainVol.gain.value = 0.5;
    }

    function initUI(){
        //$('.horizontal-slider').slider();

        $('.control-bin-item').draggable({
            helper: 'clone',
            'start': function(e){
                e.stopPropagation();
            }
        });

        $('body>div').bind("dragstart", function(event, ui){
            event.stopPropagation();
        });


        $('#main-vol-control').slider({
            'value': 0.5,
            'min': 0,
            'max': 2,
            'step': 0.05,
            'change': function(event) {
               mainVol.gain.value = $(this).slider("value");
            }
        });

        $('.table-cell', '#web-audio-api-board-demo-board').droppable({
            'drop': function(event, ui){
                //this.toastr({'background-image': "url('images/sin-icon.gif')"})
                var targetElem = $(this).attr("id");
                $(ui.draggable).clone().appendTo(this);

                switch (ui.draggable[0].id) {
                    case 'control-bin-item-sin-wav':
                        createOscillator($(this).data('col'), $(this).data('row'));
                        break;
                    case 'control-bin-item-speaker-out':
                        createInLineVolume($(this).data('col'), $(this).data('row'));
                        break;
                    case 'control-bin-item-sample':
                        createSampleControl($(this).data('col'), $(this).data('row'));
                        break;
                    case 'control-bin-item-delay':
                        createDelayControl($(this).data('col'), $(this).data('row'));
                        break;
                    case 'control-bin-item-lp':
                        createLowPassControl($(this).data('col'), $(this).data('row'));
                        break;
                    case 'white-bin-item-white-noise':
                        createWhiteNoiseControl($(this).data('col'), $(this).data('row'));
                        break;
                }
            }
        });
    }

    function addCtrlToUI(ctrl, colNumber, additionalActions) {
        var newUICtrl =  $('<div>').addClass('web-audio-api-board-demo-control-ui-row').append(
            $('<h4>').text(ctrl.displayName + ' Line #' + colNumber)
        ).append($('<div>').html(ctrl.render()));

        additionalActions(newUICtrl);


        // append the control
        $('#web-audio-api-board-demo-control-ui').append(
            newUICtrl
        );
    }

    function connectInLine(colNumber) {
        var prevCtrl = null;
        var carryForwardCtrl = null; // Save this until we hit a non-delay control
        for (var i = 0; i < audioControlsByLine[colNumber].length; i++) {
            if (audioControlsByLine[colNumber][i]) {
                if (prevCtrl !== null && typeof prevCtrl.audiocontrol !== 'undefined') {
                    prevCtrl.audiocontrol.disconnect();
                    prevCtrl.audiocontrol.connect(audioControlsByLine[colNumber][i].audiocontrol);

                    if (carryForwardCtrl === null && audioControlsByLine[colNumber][i].displayName === 'Delay Control') {
                        carryForwardCtrl = prevCtrl;
                    } else if (carryForwardCtrl !== null && audioControlsByLine[colNumber][i].displayName !== 'Delay Control') {
                        carryForwardCtrl.audiocontrol.connect(audioControlsByLine[colNumber][i].audiocontrol);
                        carryForwardCtrl = null;
                    }
                }

                if (i == (audioControlsByLine[colNumber].length - 1)) {

                    if (typeof audioControlsByLine[colNumber][i].audiocontrol !== 'undefined'){
                        audioControlsByLine[colNumber][i].audiocontrol.disconnect();
                        audioControlsByLine[colNumber][i].audiocontrol.connect(mainVol);
                    }

                    if (carryForwardCtrl !== null) {
                        carryForwardCtrl.audiocontrol.connect(mainVol);
                    }
                }

                prevCtrl = audioControlsByLine[colNumber][i];
            }
        }
    }

    // Create a delay control
    function createDelayControl(colNumber, rowNumber) {
        var ctrl = new DelayControl('delayCtrl' + idInc, idInc++);

        ctrl.audiocontrol = context.createDelay(2.0);

        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            $('[data-name=ui-delay-time]', newUICtrl).bind('change', function(e){
                ctrl.audiocontrol.delayTime.value = $(this).val();
            });
        });
    }

    function createWhiteNoiseControl(colNumber, rowNumber) {
        var ctrl = new WhiteNoiseControl('whiteNoiseCtrl' + idInc, idInc++);

        var bufferSize = 2 * context.sampleRate,
            noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate),
            output = noiseBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        //whiteNoise.connect(audioContext.destination);

        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            $('[data-name=ui-white-start]', newUICtrl).click(function(e){
                ctrl.audiocontrol = context.createBufferSource();
                ctrl.audiocontrol.buffer = noiseBuffer;
                ctrl.audiocontrol.loop = true;

                audioControlsByLine[colNumber][rowNumber] = ctrl;

                connectInLine(colNumber);
                ctrl.audiocontrol.start(0);
            })

            $('[data-name=ui-white-stop]', newUICtrl).click(function(e){
                ctrl.audiocontrol.stop(0);
            })
        });
    }

    function createLowPassControl(colNumber, rowNumber) {
        var ctrl = new LowPassFilter('lpCtrl' + idInc, idInc++);

        ctrl.audiocontrol = context.createBiquadFilter();
        ctrl.audiocontrol.type.value  = 0;
        ctrl.audiocontrol.frequency.value = 0;
        ctrl.audiocontrol.Q.value = 0;

        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            $('[data-name=ui-lp-cutoff-freq]', newUICtrl).bind('change', function(e){
                ctrl.audiocontrol.frequency.value = parseInt($(this).val());
            });

            $('[data-name=ui-lp-q]', newUICtrl).bind('change', function(e){
                ctrl.audiocontrol.Q.value = parseInt($(this).val());
            });
        });
    }

    // Create an inline volume control
    function createInLineVolume(colNumber, rowNumber){
        var ctrl = new InLineVolumeControl('inlineVol' + idInc, idInc++);

        ctrl.audiocontrol = context.createGain();
        ctrl.audiocontrol.gain.value = 0.5;

        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            $('.horizontal-slider', newUICtrl).slider({
                'value': 0.5,
                'min': 0,
                'max': 2,
                'step': 0.05,
                'change': function(event) {
                    ctrl.audiocontrol.gain.value = $(this).slider("value");
                }
            });
        });
    }

    function createOscillator(colNumber, rowNumber) {
        var ctrl = new OscillatorControl('oscCtrl' + idInc, idInc++);

        ctrl.audiocontrol = context.createOscillator();
        ctrl.audiocontrol.type = OscillatorType.sine;
        //ctrl.audiocontrol.connect(mainVol);

        // add to control array for reference
        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            /* Start Tone */
            $('[data-name=ui-wave-start]', newUICtrl).bind('click', function(e){
                ctrl.audiocontrol.start(0);
                //alert('here');
            });

            /* Stop Tone */
            $('[data-name=ui-wave-stop]', newUICtrl).bind('click', function(e){
                ctrl.audiocontrol.stop(0);
                //alert('here');
            });

            /* Wave Type Selection */

            $("input[type='radio'][name='']")

            var selected = $("input[type='radio'][data-name='ui-wave-type-selector']", newUICtrl).change(function(e){
                ctrl.audiocontrol.type = parseInt($(this).val());
            });

            if (selected.length > 0)
                selectedValue = selected.val();

            /* Frequency Slider */
            $('.horizontal-slider', newUICtrl).slider({
                'min': 0,
                'max': 20000,
                'change': function(event) {
                    ctrl.audiocontrol.frequency.value = $(this).slider("value");
                }

            });
        });
    }

    function createSampleControl(colNumber, rowNumber) {
        var ctrl = new SampleControl('sampleCtrl' + idInc, idInc++);


        // add to control array for reference
        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        //connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            var onError = function(e){
              alert('error loading file');
            };

            var btnStart = $('[data-name=ui-sample-start]', newUICtrl);
            var btnStop = $('[data-name=ui-sample-stop]', newUICtrl);

            // File Selected
            $("[data-name='ui-sample-file-chooser']", newUICtrl).bind('change', function(event) {
                var file = event.target.files[0];
                var reader = new FileReader();

                reader.onload = (function(loadedFile){
                    return function(e) {
                        if (ctrl.audiocontrol){
                            ctrl.audiocontrol.stop(0);
                        }

                        context.decodeAudioData(e.target.result, function(buffer){
                            sampleBuffer = buffer;
                            //ctrl.audiocontrol.buffer = buffer;
                            //ctrl.audiocontrol.playbackRate.value = 1;

                            btnStart.removeAttr('disabled');
                            btnStop.removeAttr('disabled');
                        }, onError);

                    };
                })(file);

                // Read the file
                reader.readAsArrayBuffer(file);
            });

            // Sample speed
            $('[data-name=ui-sample-speed-control]', newUICtrl).bind('change', function(e){
                if (ctrl.audiocontrol) {
                    ctrl.audiocontrol.playbackRate.value = parseFloat($(this).val());
                }
            });

            // Sample Start
            btnStart.click(function(event){
                //if (ctrl.audiocontrol.buffer) {
                ctrl.audiocontrol = context.createBufferSource();

                audioControlsByLine[colNumber][rowNumber] = ctrl;

                ctrl.audiocontrol.buffer = sampleBuffer;
                connectInLine(colNumber);
                ctrl.audiocontrol.start(0);
                //}
            });

            // Stop the sample
            btnStop.click(function (event) {
                if (ctrl.audiocontrol.buffer) {
                    ctrl.audiocontrol.stop(0);
                }
            });
        });
    }
})();
