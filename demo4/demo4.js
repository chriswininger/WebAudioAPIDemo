(function(){

	$(function(){
		var context = new AudioContext(),
			mainVol = context.createGain();
		mainVol.gain.value = 0.5;
		mainVol.connect(context.destination);

		var bufferSize = 4096;
		var pinkNoise = (function() {
			var b0, b1, b2, b3, b4, b5, b6;
			b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
			var node = context.createScriptProcessor(bufferSize, 1, 1);
			node.onaudioprocess = function(e) {
				var output = e.outputBuffer.getChannelData(0);
				for (var i = 0; i < bufferSize; i++) {
					var white = Math.random() * 2 - 1;
					b0 = 0.99886 * b0 + white * 0.0555179;
					b1 = 0.99332 * b1 + white * 0.0750759;
					b2 = 0.96900 * b2 + white * 0.1538520;
					b3 = 0.86650 * b3 + white * 0.3104856;
					b4 = 0.55000 * b4 + white * 0.5329522;
					b5 = -0.7616 * b5 - white * 0.0168980;
					output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
					output[i] *= 0.11; // (roughly) compensate for gain
					b6 = white * 0.115926;
				}
			}
			return node;
		})();

		var filter = context.createBiquadFilter();
		filter.connect(mainVol);
		filter.type = 0; // Low-pass filter. See BiquadFilterNode docs

		$('#btnStart').click(function(event){
			// start the sound
			pinkNoise.connect(filter);
			runLPLoop = true;
			runVolLoop = true;
		});

		$('#btnStop').click(function(event){
			pinkNoise.disconnect(mainVol);
			runLPLoop = false;
			runVolLoop = false;
		});


		var interval = 10;
		var floor = 30;
		var ceiling = 2000;
		var intervalSpeed = 600;
		var runLPLoop = false;
		var waveMinSpeed = 100,
			waveMaxSpeed = 200;
		filter.frequency.value = floor;
		var cnt = 0;
		function _lpLoop () {
			if (runLPLoop) {
				var inc = Math.floor((Math.random() * interval) + 1);

				filter.frequency.value += inc; // Set cutoff to 440 HZ

				cnt++;
				if (filter.frequency.value > ceiling || filter.frequency.value < floor) {
					interval = -1*interval;
					if (interval > 0) cnt = 0;

					intervalSpeed = 600;
					if (cnt > 500) intervalSpeed = 100;
					waveMaxSpeed = Math.random() * (intervalSpeed - 50) + 50;
					waveMaxSpeed = waveMaxSpeed - (Math.random() *100 + 1);
				}
			}


			setTimeout(_lpLoop, Math.floor((Math.random() * (waveMaxSpeed - waveMinSpeed)) + waveMinSpeed));
		}
		_lpLoop();

		var runVolLoop = false;
		function _volLoop () {
			if (runVolLoop) {
				var coin = Math.random();
				if (coin > 0.5) {
					mainVol.gain.value += 0.1
				} else {
					mainVol.gain.value -= 0.1
				}
				setTimeout(_volLoop, 20);
			}
		}

	});


})();