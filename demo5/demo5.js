var ctx,
    buf,
    mainVol,
    analyser,
    ctxVisualization;
(function(){
    $(function(){
        initAudio();


        var c = document.getElementById("cvsVisualization");
        ctxVisualization = c.getContext("2d");

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
            ctx = new AudioContext();
            mainVol = ctx.createGain();
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
        analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        toastr.info('Play it');
        var src = ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate = 1.0;
        src.connect(analyser);
        analyser.connect(mainVol);
        src.start(0);
        toastr.info('Complete!!!');

        var barWidth = 10,
            spacing = 5;

        function draw () {

            ctxVisualization.clearRect(0,0,1000,500);
            analyser.getByteTimeDomainData(dataArray);

            var x = spacing,
                y = 0,
                freqInterVal = 3,
                len = Math.floor(dataArray.length/freqInterVal);

            for (var i = 0; i < len; i++) {
                y = dataArray[i*freqInterVal];
                x = i * barWidth + spacing;

                ctxVisualization.fillStyle = "#FF0000";
                ctxVisualization.fillRect(x,0,barWidth,y);
            }


            requestAnimationFrame(draw);
        }
        draw();
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