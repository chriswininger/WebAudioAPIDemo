(function(){
    var context, mainVol, idInc = 0,
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
            mainVol = context.createGainNode();

        mainVol.connect(context.destination);
        mainVol.gain.value = 0.5;
    }

    function initUI(){
        $('.horizontal-slider').slider();
        $('.control-bin-item').draggable({
            helper: 'clone'
        });

        $('.table-cell', '#web-audio-api-board-demo-board').droppable({
            'drop': function(event, ui){
                //this.css({'background-image': "url('images/sin-icon.gif')"})
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
        for (var i = 0; i < audioControlsByLine[colNumber].length; i++) {
            if (audioControlsByLine[colNumber][i]) {
                if (prevCtrl !== null) {
                    prevCtrl.audiocontrol.disconnect();
                    prevCtrl.audiocontrol.connect(audioControlsByLine[colNumber][i].audiocontrol);
                }

                if (i == (audioControlsByLine[colNumber].length - 1)) {
                    audioControlsByLine[colNumber][i].audiocontrol.disconnect();
                    audioControlsByLine[colNumber][i].audiocontrol.connect(mainVol);
                }

                prevCtrl = audioControlsByLine[colNumber][i];
            }
        }
    }
    function createInLineVolume(colNumber, rowNumber){
        var ctrl = new InLineVolumeControl('inlineVol' + idInc, idInc++);

        ctrl.audiocontrol = context.createGainNode();
        ctrl.audiocontrol.gain.value = 0.5;

        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            $('.horizontal-slider', newUICtrl).slider({
                'min': 0,
                'max': 1,
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

        ctrl.audiocontrol = context.createBufferSource();

        // add to control array for reference
        audioControls.push(ctrl);
        audioControlsByLine[colNumber][rowNumber] = ctrl;

        connectInLine(colNumber);

        addCtrlToUI(ctrl, colNumber, function(newUICtrl){
            var onError = function(e){
              alert('error loading file');
            };

            // File Selected
            $("[data-name='ui-sample-file-chooser']", newUICtrl).bind('change', function(event) {
                var file = event.target.files[0];

                var reader = new FileReader();
                reader.onload = (function(loadedFile){
                    return function(e) {
                        //stopSoundClip();

                        context.decodeAudioData(e.target.result, function(buffer){
                            ctrl.audiocontrol.buffer = buffer;
                            //source.connect(mainVol);
                            ctrl.audiocontrol.playbackRate.value = 1;
                            ctrl.audiocontrol.start(0);
                        }, onError);


                    };
                })(file);

                // Read the file
                reader.readAsArrayBuffer(file);
            });
        });
    }
})();
