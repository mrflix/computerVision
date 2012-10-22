var source = document.querySelector('.source');
var sourceImage = source.querySelector('img');
var indicator = source.querySelector('.indicator');
var resultArea = document.querySelector('.resultArea');
var result = resultArea.querySelector('.result');
var curtain = result.querySelector('.curtain');

sourceImage.onload = function(){
  var width = sourceImage.clientWidth;
  var height = sourceImage.clientHeight;
  var ratio;
  
  if(width > source.clientWidth){
    height = source.clientWidth/width * source.clientHeight;
    width = source.clientWidth;
    sourceImage.width = width;
  }
  
  resultArea.style.width = source.style.width = width + "px";
  resultArea.style.height = source.style.height = height + "px";
}

function placeResult(){
  result.classList.remove('loaded');
  
  var dx = resultArea.offsetLeft - source.offsetLeft;
  var dy = resultArea.offsetTop - source.offsetTop;
  result.style.left = -dx +"px";
  result.style.top = -dy +"px";
  
  document.redraw();
  
  result.classList.add('loaded');
}