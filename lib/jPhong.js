// Extend JavaScript API with useful functions
(function() {
    "use strict";

    /* ---Library Definition--- */
    if (typeof window.jPhong === 'undefined') {
        var _jPhong = {};

        _jPhong.rgbToHSV = rgbToHSV;

        window.jPhong = _jPhong;
    }


    // ---Web Audio API---
    window.OscillatorType = {
        'sine': 0,
        'square': 1,
        'sawtooth': 2,
        'triangle': 3,
        'custom': 4
    };

    if (typeof jPhong.NoteToFreq === 'undefined') {
        jPhong.NoteToFreq = function(note) {
            var a4 = 440;
            if (note >=0 && note <= 119) {
               return a4 * Math.pow(2, (note - 57)/12);
            } else {
                throw {message: 'Note outside of range (0-119)' };
            }
        }
    }

    /* Extend Math Functions--- */
    if (typeof window.Math !== 'undefined') {
        // Map val from a coordinate plane bounded by x1, x2 onto a coordinate plane bounded by y1, y2
        window.Math.map = function(val, x1, x2, y1, y2) {
            return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
        }
    }

    if (navigator.GetUserMedia === undefined) {
        if (navigator.webkitGetUserMedia !== undefined) {
            navigator.GetUserMedia = navigator.webkitGetUserMedia;
        }
    }

    if (typeof window.ImageData !== 'undefined') {
        /**
         * Set the color values for the pixel at the specified x, y index
         * @param c [r,g,b,a]
         * @param x
         * @param y
         */
        ImageData.prototype.setPixel = function (c /* Array Integers */, x, y) {
            var data = this.data;
            var r = 4 * (x + y * this.width);

            data[r] = c[0];
            data[r + 1] = c[1];
            data[r + 2] = c[2];
            data[r + 3] = c[3];
        };

        ImageData.prototype.getPixel = function (x, y) {
            var data = this.data;
            var r = 4 * (x + y * this.width);
            return [data[r], data[r + 1], data[r + 2], data[r + 3]];
        };
    }

    String.prototype.padRight = function(c, padWidth) {
        var len = padWidth - this.length, padding = '';
        for (var i = 0; i < len; i++) {
            padding += c;
        }

        return this + padding;
    };

    String.prototype.padLeft = function(c, padWidth) {
        var len = padWidth - this.length, padding = '';
        for (var i = 0; i < len; i++) {
            padding += c;
        }

        return padding + this;
    };


    function rgbToHSV(r, g, b)
    {
        var min, max, delta, h , s, v;

        /* Convert to ratio notation */
        var _r = r/255.0, _g = g/255.0, _b = b/255.0;
        /* find value of channel with the smallest value */
        min = Math.min(_r, Math.min(_g, _b));
        /* find value of channel with the largest value */
        max = Math.max(_r, Math.max(_g, _b));
        /* set v to max value */
        v = max;

        delta = max - min;

        if (max != 0) {
            s = delta/max;
        } else {
            /* all values are zero = black; h and s don't matter v is 0 or undefined */
            return {'h': 0, 's': 0, 'v': 0};
        }

        if (delta === 0) {
            h = 0; // perfect gray, h value doesn't matter but set it to 0 to avoid undefined
        } else if (_r == max) {
            h = (_g - _b) /delta; /* between yellow and magenta */
        } else if (_g == max) {
            h = 2 + (_b - _r) / delta;
        } else {
            h = 4 + (_r - _g) / delta;
        }

        // convert to degrees
        h *= 60.0;
        if (h < 0) {
            h += 360.0;
        }

        return {
            'h': Math.round(h),
            's': Math.round(s*100),
            'v': Math.round(v*100)
        };
    }
})();