/*
    Kernel
    ======
    
*/
function Kernel(element){
  this.element = element;
  this.init();
}

Kernel.prototype = {
  init: function(){
    this.size = this.element.length,
    this.length = Math.sqrt(this.size);
    this.center = Math.floor(this.length/2);
    this.hotspot = Math.floor(this.size/2);
  },
  updatePos: function(pos, value){
    this.element[pos] = value;
  },
  updateSize: function(size){
    switch(size){
      case 9:
        // shrink the structure
        this.element = [
            this.element[6 ], this.element[7 ], this.element[8 ], 
            this.element[11], this.element[12], this.element[13], 
            this.element[16], this.element[17], this.element[18]
        ];
        break;
      case 25:
        // bloat up the structure
        this.element = [
            0, 0              , 0              , 0              , 0,
            0, this.element[0], this.element[1], this.element[2], 0,
            0, this.element[3], this.element[4], this.element[5], 0,
            0, this.element[6], this.element[7], this.element[8], 0,
            0, 0              , 0              , 0              , 0
        ];
        break;
    }
    this.init();
  },
  process : function(data){
    
  }
};