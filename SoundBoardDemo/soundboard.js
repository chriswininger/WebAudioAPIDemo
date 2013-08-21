(function(){
    var context, mainVol, idInc = 0, audioControls = [];

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
                        var ctrl = new OscillatorControl('oscCtrl' + idInc, idInc++);

                        audioControls.push(ctrl);

                        var newUICtrl = $('<div>').addClass('web-audio-api-board-demo-control-ui-row').append(
                            $('<h4>').text('Sine Wave Control')
                        ).append($('<div>').html(ctrl.render()));


                        $('[data-name=ui-wave-start]', newUICtrl).bind('click', function(e){
                            alert('here');
                        });

                        $('#web-audio-api-board-demo-control-ui').append(
                            newUICtrl
                        );




                        $('.horizontal-slider', newUICtrl).slider({
                            'min': 0,
                            'max': 100,
                            'change': function(event) {
                                ctrl.updateOscilator();
                                /*var $ctrl = $(this),
                                    index = $ctrl.attr('data-index'),
                                    osc = audioControls[index];*/

                            }

                        });

                        break;
                }
            }
        });
    }

})();
