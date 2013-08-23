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
                }
            }
        });
    }

    function createInLineVolume(colNumber, rowNumber){

    }

    function createOscillator(colNumber, rowNumber) {
        var ctrl = new OscillatorControl('oscCtrl' + idInc, idInc++);

        ctrl.oscillator = context.createOscillator();
        ctrl.oscillator.type= OscillatorType.sine;
        ctrl.oscillator.connect(mainVol);

        // add to control array for reference
        audioControls.push(ctrl);
        audioControlsByLine[colNumber].push(ctrl)

        var newUICtrl = $('<div>').addClass('web-audio-api-board-demo-control-ui-row').append(
            $('<h4>').text('Sine Wave Control')
        ).append($('<div>').html(ctrl.render()));


        $('[data-name=ui-wave-start]', newUICtrl).bind('click', function(e){
            ctrl.oscillator.start(0);
            //alert('here');
        });

        $('[data-name=ui-wave-stop]', newUICtrl).bind('click', function(e){
            ctrl.oscillator.stop(0);
            //alert('here');
        });


        $('.horizontal-slider', newUICtrl).slider({
            'min': 0,
            'max': 20000,
            'change': function(event) {
                ctrl.oscillator.frequency.value = $(this).slider("value");
            }

        });


        // append the control
        $('#web-audio-api-board-demo-control-ui').append(
            newUICtrl
        );
    }


})();
