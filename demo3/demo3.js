var ctx,
    buf,
    mainVol;

(function(){



    $(function(){
        initAudio();

        $('#btnPlay').click(function(){
            try {
                toastr.info('loading file');
                loadFile();
            } catch (ex){
                toastr.error('Load File Error: ' + ex.message);
            }
        });
    });

    function initAudio() {
        console.log("in init");
        toastr.info('Initializing audio');

        try {
            ctx = new webkitAudioContext();
            mainVol = ctx.createGainNode();
            mainVol.gain.value = 0.95;
            mainVol.connect(ctx.destination);
        } catch (e) {
            console.log('you need webaudio support');
            toastr.error('You need WebAduio support');
        }
    }

    function loadFile() {
        var req = new XMLHttpRequest();
        req.open("GET", "BumpinTheTeaParty.mp3", true);
        req.responseType = 'arraybuffer';
        req.onload = function() {

            ctx.decodeAudioData(req.response, function(buffer){
                toastr.info('decode audio: ' + buffer.length + ', ' + buffer.duration);
                buf = buffer;
                play();
            });
        };
        req.send();
    }

    function play(){
        toastr.info('Play it');
        var src = ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate = 1.0;
        src.connect(mainVol);
        src.start(0);
        toastr.info('Complete!!!');
    }
})();

function activateAudioForIOS() {
    toastr.info('!!!!activating IPHONE SOUND!!!!');
    // create empty buffer
    var buffer = ctx.createBuffer(1, 1, 22050);
    var source = ctx.createBufferSource();
    source.buffer = buffer;

    // connect to output (your speakers)
    source.connect(ctx.destination);

    // play the file
    source.noteOn(0);

    toastr.info('active');
}