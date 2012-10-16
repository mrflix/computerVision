//
// canvasFilters utilities
//
// by Felix Niklas @mrflix Oct 2011
//

var utilities = {
    threshold: 128,
    histogram: [],
    counter: 0,
    //
    // Median
    // ------
    //  
    // returns the median of a section of the histogram
    //
    median: function(start, stop){
        var p = 0;
        var x = 0;

        // start and stop might be floats
        start = parseInt(start, 10);
        stop = parseInt(stop, 10);

        for(var j = start; j <= stop; j++){
            var value = this.histogram[j];
            p += value;
            x += j*value;
        }

        // exceptions
        if( p === 0 ) {
            return start === 0 ? stop : start;
        }

        return x/p;
    },
    //
    // Iso Data Algorithm
    // ==================
    //  
    // starts with a default threshold to determine a good threshold
    // by spliting up the histogram in two equal weighted areas
    //
    // this function is recursive - it calls itself until the perfect threshold is found
    //
    isoDataAlgorithm: function(t){
        // default to 128 if no t is given
        if( t === undefined ){
            this.counter = 0;
            t = 128;
        }

        var m1 = this.median(0, t-1);
        var m2 = this.median(t, 255);

        // calculate new threshold
        tk = ( m1 + m2 ) / 2;

        if( this.counter > 100 ){
            window.alert("Error 101: too much recursion.");
            return false;
        }

        if( t === tk ){
            this.threshold = Math.round( tk );
        } else {    
            this.counter ++;
            this.isoDataAlgorithm(tk);
        }
    },
    //
    // Calculate Histogram
    // ==================
    //  
    // creates a (non-normalised) histogram by adding up 
    // the occurence of every gray shade.
    //
    calculateHistogram: function(graytones){  
        this.histogram = [];

        // set histogram initially to 0
        for(var i=0; i<256; i++){
            this.histogram[i] = 0;
        }

        for(var i=0, l=graytones.length; i<l; i++){
            var value = graytones[i];
            this.histogram[value] += 1;
        }
    },
    //
    // Grayscale
    // ---------
    //  
    // reduces the input image data to an array of gray shades.
    //
    grayscale: function(imgData){
        var gray = [];

        for(var i=0, n=0, l=imgData.length; i<l; i+=4, n++){
            var r = imgData[i],
    			g = imgData[i+1],
    			b = imgData[i+2];

    		// weighted grayscale algorithm
    		gray[n] = Math.round(r * 0.3 + g * 0.59 + b * 0.11);
        }
        return gray;
    },
    //
    // binarizer
    // ---------
    //
    binarize: function(imgData){
        var gray = [];
    	var binarizedData = [];
        
        // grayscale
        gray = this.grayscale(imgData);

        // calculate the histogram
    	this.calculateHistogram(gray);

    	// calculate the threshold
    	this.isoDataAlgorithm();
    	
        for(var i = 0, l = gray.length; i<l; i++){
            binarizedData[i] = gray[i] < this.threshold ? 1 : 0;
        }
        
        // pack the array into a 2-dimensional array for easier x,y control
        return this.dimensionise(binarizedData);
    },
    //
    // dimensionise
    // ------------
    //
    // split the array up into a 2-dimensional array (with image-width and height as boundarys)
    //
    dimensionise: function(imageData){
        var dimensional = [];
        for(var y=0, i=0; y<image.height; y++){
            dimensional[y] = [];
            for(var x=0; x<image.width; x++, i++){
                dimensional[y][x] = imageData[i];
            }
        }
        return dimensional;
    },
    //
    // list helper
    // ===========
    //
    inList: function(list, array){
        for(var i = 0; i<list.length; i++){
            if(list[i][0] === array[0] && list[i][1] === array[1]){
                return true;
            }
        }
        return false;
    },
}; 