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
                        var ctrl = new OscillatorControl(idInc++);
                        audioControls.push(ctrl);
                        $('#web-audio-api-board-demo-control-ui').append(
                            $('<div>').addClass('web-audio-api-board-demo-control-ui-row').append(
                                $('<h4>').text('Sine Wave Control')
                            ).append($('<div>').innerHTML(ctr.render()))
                        );

                        break;
                }
            }
        });
    }

})();
