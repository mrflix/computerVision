//(function( window, undefined ) {
  var document = window.document;
  var imgRegex = /.+\.(?:jpg|gif|png)$/;
  
  var imageVision = function(src) {
    return new imageVision.fn.init(src);
  };

  imageVision.fn = imageVision.prototype = {
    constructor: imageVision,
    load: function() {      
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height;
    
      this.ctx.drawImage(this.image, 0, 0);
    
      this.imgData = this.originalImgData = this.ctx.getImageData(0, 0, this.image.width, this.image.height);
      this.queue.flush(this);
      
      return this;
    },
    convolve: function( structure, progressCallback, boost ) {
      this.queue.add( function( self ) {
        var resultImgData = self.ctx.createImageData(self.imgData);
        var sample = [];
        
        for(var i=0, l=self.imgData.data.length; i<l; i++){
          var value = self.fold(self.imgData.data, i, structure);
          
          if(boost) value += boost;
          
          resultImgData.data[i] = value;
          
          if(i < 100) sample.push(value);
          // progress callback
          // if(progressCallback) progressCallback(i % structure.length*4);
        }
        console.log(JSON.stringify(sample));

        // draw imgData to canvas
        self.ctx.putImageData(resultImgData, 0, 0);

        // save new imgData
        self.imgData = resultImgData;
        
      });
      return this;
    },
    fold: function( data, position, structure ) {
      var sum = 0;
      var count = 1;
      var center = Math.floor( Math.sqrt(structure.length)/2);
    
      for(var i=0, l=structure.length; i<l; i++){
        var multiplicator = structure[i];
        
        if(multiplicator !== 0){
          var x = Math.ceil(position/4) % this.image.width;
          var y = Math.floor(position/data.length);
          var structureX = ( i % structure.length ) - center;
          var structureY = Math.ceil( i/structure.length ) - center;
          var offset, value = 255;
          
          if( ( x + structureX ) >= 0 && ( x + structureX ) < this.image.width  && 
              ( y + structureY ) >= 0 && ( y + structureY ) < this.image.height ){
            offset = structureY * (this.image.width*4) + (structureX*4);
            value = data[position + offset];
          }
          
          if(position >= 0 && position < 473){ console.log(x+structureX,( x + structureX ) >= 0 && ( x + structureX ) < this.image.width  && 
              ( y + structureY ) >= 0 && ( y + structureY ) < this.image.height ); };
          //if(position > 427 && position < 500){ console.log("x %i, y %i, sx %i, sy %i, offset %i, pos %i, = %i", x, y, structureX,structureY, offset, position, value) };
          //count += Math.abs(multiplicator);
        }
      }
    
      return count === 0 ? 0 : sum/count;
      //return count === 0 ? 0 : sum/count;
    },
    grayscale: function(){
      this.queue.add( function( self ) {
        var grayImgData = self.ctx.createImageData(self.imgData);

        for(var i=0, n=0, l=self.imgData.data.length; i<l; i+=4, n++){
          var r = self.imgData.data[i  ];
    			var g = self.imgData.data[i+1];
    			var b = self.imgData.data[i+2];
    			var gray = Math.round(r * 0.3 + g * 0.59 + b * 0.11);

    		  // weighted grayscale algorithm
    		  grayImgData.data[i  ] = gray;
    		  grayImgData.data[i+1] = gray;
    		  grayImgData.data[i+2] = gray;
    		  grayImgData.data[i+3] = 255;
        }
        
        self.imgData = grayImgData;
        
        // draw imgData to canvas
        self.ctx.putImageData(self.imgData, 0, 0);
      });
      return this;
    },
    appendTo: function(selector) {
      this.queue.add( function( self ) {
        var context;
    
        // DOMElement
        if(selector.nodeType){
          context = selector;
        } else {
          // selector
          context = document.querySelector(selector);
        }
    
        context.appendChild(self.canvas);
      });
      return this;
    }
  };
  
  imageVision.fn.init = function(source) {
    var newImage = false;
    /* 
      source can either be an img-element, a selector for an image or an url
    */    
    if ( !source ) {
      return this;
    }
    else if ( imgRegex.exec(source) ) {
      // π(source)
      this.image = new Image();
      newImage = true;
    }
    else if ( source.nodeType ) {
      // π(img DOMElement)
      this.image = source;
    } 
    else {
      // π('img')
      this.image = document.querySelector(source); 
    }
    
    this.queue = new Queue;
    
    if(this.image.complete && !newImage){
      this.load();
    } else {
      this.image.onload = this.load.bind(this);
    }
    
    if(newImage) this.image.src = source;
    
    return this.canvas;
  };

  imageVision.fn.init.prototype = imageVision.fn;
  window.π = window.imageVision = imageVision;
//})( window );