//
// canvasFilters UI
//
// by Felix Niklas @mrflix Oct 2011
//

// check for touch-based device to bind on 'touchstart' 
// instead of 'click' to speed up the responsivness
var touchSupport = "ontouchstart" in window ? true : false;
var clickOrTouch = touchSupport ? 'touchstart' : 'click';

//
// UI Object
//  
// responsible for the DOM Element bindings. 
// it listens to changes in the UI and triggers correpsonding functions
//

var UI = {
  init: function(structure){
    this.structure = structure;
    this.structuringElement = document.querySelector('.structuringElement');
    this.structureSize = document.querySelector('.structureSize');
    
    this.structuringElement.addEventListener(clickOrTouch, this.updateStructuringElement.bind(this));
    this.structureSize.addEventListener('change', this.updateStructureSize.bind(this));
    
    this.bindInputs();
  },
  bindInputs: function(){
    this.inputs = this.structuringElement.querySelectorAll('input');
    
    for(var i=0; i<this.inputs.length; i++)
      this.inputs[i].addEventListener('input', this.updateStructure.bind(this));
  },
  findElementPos: function(target){
    // find pos in structure element
    for(var i=0, l=this.structuringElement.children.length; i<l; i++) {
      if(this.structuringElement.children[i] === target){
        return i;
      }
    }
  },
  updateStructure: function(event){
    var pos = this.findElementPos(event.target);
    var value = parseFloat(event.target.value);
    
    this.structure.updatePos(pos, value);
    
    event.target.className = value === 0 ? "" : "checked";
  },
  updateStructureSize: function(event){
    var size = parseInt(event.target.value);
    
    this.structuringElement.classList[ size === 9 ? 'remove' : 'add' ]("five");
    this.structure.updateSize(size);
    
    // shell needed to place all the new elements in
    var structuringElements = document.createDocumentFragment();

    for ( var i = 0, l = this.structure.size; i < l; i++ ) {
      var el = document.createElement("input");
      var value = this.structure.element[i];
      
      if(value !== 0){
          el.className = "checked";
      }
      el.value = value;
      
      structuringElements.appendChild( el );
    }

    // remove all old elements
    while (this.structuringElement.hasChildNodes()) {
      this.structuringElement.removeChild(UI.structuringElement.lastChild);
    }
    
    // add new elements
    this.structuringElement.appendChild(structuringElements);
    
    this.bindInputs();
  },
  updateStructuringElement: function(event){
    var pos = this.findElementPos(event.target);
    var value = parseFloat(event.target.value);
    
    if(event.altKey || event.metaKey){
      value--;
    } else {
      value++;
    }
    
    structure.element[pos] = value;
    event.target.value = value;
    
    event.target.className = value === 0 ? "" : "checked";
    
    //render();
  }
}