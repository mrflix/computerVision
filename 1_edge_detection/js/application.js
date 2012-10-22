var element = [
   -1, 0, 1,
   -2, 0, 2,
   -1, 0, 1
];
var structure = new Kernel(element);

//
// Init
// ----
//  
// initializes the program
//

function init(){
    // initialise the UI
    UI.init(structure);
    
    // start chained work
    /* imageData(canvas).convolve([
        0, 0, 0
        0, 1, 0
        0, 1, 0
      ]); */
  
  var run = document.querySelector('.run');
  run.onclick = startFakeProgress;
  
  vision = imageVision('img/360411_pixelio.png').grayscale().convolve([0,0,0,-0.5,0,0.5,0,0,0], false, 128).appendTo('.source');
}

var progress;

function startFakeProgress(){
  progress = 0;
  
  source.classList.add('progress');
  source.classList.remove('finished');
  result.classList.remove('finished');
  
  placeResult();
  
  work(function(i){
    indicator.style.top = i*100 + "%";
    curtain.style.height = i*100 + "%";
    
    if(i >= 1){
      source.classList.add('finished');
      result.classList.add('finished');
      source.classList.remove('progress');
      result.style.left = 0;
      result.style.top = 0;
      indicator.style.top = "";
      curtain.style.height = "";
    }
  });
}

function work(callback){
  progress += 0.005;
  callback(progress);
  if(progress < 1){
    setTimeout(work, 0, callback);
  }
}

// get the ball rollin'
init();