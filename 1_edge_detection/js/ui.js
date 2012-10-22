var imageList = document.querySelector('#image');

imageList.onchange = function(event){
  image = imageList.value;
  run();
};

var techniqueList = document.querySelector('#technique');

techniqueList.onchange = function(event){
  technique = techniqueList.value;
  run();
};

var compareButton = document.querySelector('#startComparison');
var compareOutput = document.querySelector('#output');

function initialiseUI(){
  imageList.value = image;
  techniqueList.value = technique;
  testImage = imageVision(folder + image);
  compareButton.onclick = compareSpeed;
}

//
// showSourceImage
// ---------------
//  
// displayes the picked image on the left
//

function showSourceImage(){
  var source = document.querySelector('.source');
  var img = document.createElement('img');
  
  img.src = folder + image;
  
  // remove all child elements
  while (source.hasChildNodes()) {
      source.removeChild(source.lastChild);
  }
  
  source.appendChild( img );
}