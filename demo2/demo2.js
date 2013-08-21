(function(){
    var context = null, mainVol = null, clipBuffer = null, model = null, source = null;

    $(function(){
        model = new clipViewModel();
        ko.applyBindings(model);

        initAudio();
        initSoundClip();

        $('#fileSample').bind('change', function(event) {
            var file = event.target.files[0];

            var reader = new FileReader();
            reader.onload = (function(loadedFile){
                return function(e) {
                    stopSoundClip();

                    context.decodeAudioData(e.target.result, function(buffer){
                        clipBuffer = buffer;

                        playSoundClip(clipBuffer);


                        $('#btnStart').removeAttr('disabled');

                    }, onError);


                };
            })(file);


            reader.readAsArrayBuffer(file);
        });
    });


    function initAudio(){
        // get the audio context
        context = new webkitAudioContext(),
            // create a gain node to control the volume
            mainVol = context.createGainNode();
        mainVol.gain.value = 0.5;
        // connect to output
        mainVol.connect(context.destination);
    }

    function initSoundClip() {
        var request = new XMLHttpRequest();
        request.open('GET', 'test.mp3', true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer){
                clipBuffer = buffer;

                $('#btnStart').removeAttr('disabled');

            }, onError);
        };

        request.send();
    }

    function playSoundClip(buffer) {
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(mainVol);
        source.playbackRate.value = 2;
        source.start(0);
    }

    function stopSoundClip(){
        if (source !== null) {
            source.stop(0);
            source.disconnect();
        }
    }

    function onError(e) {
        alert('Error: ');
    }

    // Knockout view model
    var clipViewModel = function() {
        var _self = this;

        _self.mainVolume = ko.observable(0.5);
        _self.playbackRate = ko.observable(1);

        _self.playClip = function(){
            playSoundClip(clipBuffer);
            $('#btnStop').removeAttr('disabled');
        };

        _self.stopClip = function(){
            stopSoundClip();
        };

        _self.volumeChanged = function(data) {
            mainVol.gain.value= _self.mainVolume();
        };

        _self.playbackRateChanged = function(data){
            source.playbackRate.value = _self.playbackRate();
        };
    };

})();