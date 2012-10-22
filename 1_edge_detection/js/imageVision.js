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
    
      // read the image data from canvas
      this.imgData = this.ctx.getImageData(0, 0, this.image.width, this.image.height);
      
      // grayscale
      
      this.gray = [];
      
      for(var i=0, n=0, l=this.imgData.data.length; i<l; i+=4, n++){
        var r = this.imgData.data[i  ];
  			var g = this.imgData.data[i+1];
  			var b = this.imgData.data[i+2];
  			
  		  // weighted grayscale algorithm
  			this.gray[n] = Math.round(r * 0.3 + g * 0.59 + b * 0.11);
      }
      
      
      // put the image data in a 2d array
      this.data = [];
      
      for(var y=0, j=0; y<this.image.height; y++){
          this.data[y] = [];
          for(var x=0; x<this.image.width; x++, j++){
              this.data[y][x] = this.gray[j];
          }
      }
      
      // continue chain
      this.queue.flush(this);
      
      return this;
    },
    convolve: function( filterArray ) {
      this.queue.add( function( self ) {
        
        // single filter case
        if(typeof filterArray[0] !== "object"){
          filterArray = [ filterArray ];
        }
        
        for(var i=0; i<filterArray.length; i++){
          var newData = [];
        
          for(var y=0; y<self.image.height; y++){
            newData[y] = [];
            for(var x=0; x<self.image.width; x++){
              var value = self.fold(x, y, filterArray[i]);
        
              newData[y][x] = value;
            }
          }
        
          self.data = newData;
          if( i === 0 ) self.dx = newData;
          if( i === 1) self.dy = newData;
        }
      });
      return this;
    },
    fold: function( x, y, filter ) {
      var sum = 0;
      var count = 1;
      var width = Math.sqrt(filter.length);
      var center = Math.floor( filter.length/2 );
    
      for(var i=0, l=filter.length; i<l; i++){
        var multiplicator = filter[i];
        
        if( multiplicator !== 0 ){
          var filterX = x + ( i % width ) - center;
          var filterY = y + Math.floor( i/width ) - center;
          var value;
          
          filterX = Math.max(0, Math.min(this.image.width, filterX));
          filterY = Math.max(0, Math.min(this.image.height, filterY));
          
          value = this.data[filterY][filterX];
          
          sum += multiplicator * value;
        }
      }
    
      return count === 0 ? 0 : sum/count;
    },
    absolute: function(){
      this.queue.add(function(self){
        self.showAbsolute = true;
        for(var y=0; y<self.image.height; y++){
          for(var x=0; x<self.image.width; x++){
            self.data[y][x] = Math.sqrt(Math.pow(self.dx[y][x], 2) + Math.pow(self.dy[y][x], 2));
          }
        }
      });
      return this;
    },
    direction: function(){
      this.queue.add(function(self){
        self.showDirection = true;
        self.direction = [];
          
        for(var y=0; y<self.image.height; y++){
          
          self.direction[y] = [];
          
          for(var x=0; x<self.image.width; x++){
            var angle = Math.atan2(self.dy[y][x], self.dx[y][x]);
            
            angle *= 180 / Math.PI / 360;
            
            self.direction[y][x] = 255 * angle;
          }
        }
      });
      return this;
    },
    boost: function(amount){
      this.queue.add(function(self){
        for(var y=0; y<self.image.height; y++){
          for(var x=0; x<self.image.width; x++){
            self.data[y][x] += amount;
          }
        }
      });
      return this;
    },
    colorize: function(){
      this.queue.add(function(self){
        self.useColor = true;
      });
      return this;
    },
    render: function(){
      var imgData = this.ctx.createImageData(this.imgData);
      
      for(var y=0, i=0; y<this.image.height; y++){
          for(var x=0; x<this.image.width; x++, i+=4){
            var value = this.data[y][x];
            
            if(this.showDirection) value = this.direction[y][x];
            
            if(this.useColor){
              var hue = value/255 * 360;
              var brightness = 100;
              
              if(this.showDirection && this.showAbsolute)
                brightness = this.data[y][x]/255 * 100;
              
              var rgb = color.rgbFromHsb( [hue, 100, brightness] );
              
              imgData.data[i] = rgb[0];
              imgData.data[i+1] = rgb[1];
              imgData.data[i+2] = rgb[2];
            } else {
              imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = value;
            }
            
            imgData.data[i+3] = 255;
          }
      }
      
      this.ctx.putImageData(imgData, 0, 0);
      
      return this;
    },
    appendTo: function(selector, fill) {
      this.queue.add( function( self ) {
        var context;
    
        // DOMElement
        if(selector.nodeType){
          context = selector;
        } else {
          // selector
          context = document.querySelector(selector);
        }
      
        if(fill){
          // remove all child elements
          while (context.hasChildNodes()) {
              context.removeChild(context.lastChild);
          }
        }
        
        self.render();
        context.appendChild(self.canvas);
      });
      return this;
    },
    fill: function(selector){
      this.queue.add( function( self ) {
        self.appendTo(selector, true);
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