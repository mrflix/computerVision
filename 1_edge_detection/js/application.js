var folder = 'img/';
var image = '360411_pixelio.png';
var technique = 'gradientDirection';
var filters = {
  xGradient: [0, 0, 0, 0.5, 0, -0.5, 0, 0, 0],
  yGradient: [0, 0.5, 0, 0, 0, 0, 0, -0.5, 0],
  xGradientSobel: [0.125, 0, -0.125, 0.25, 0, -0.25, 0.125, 0, -0.125],
  yGradientSobel: [0.125, 0.25, 0.125, 0, 0, 0, -0.125, -0.25, -0.125]
};

//
// run
// ===
//  
// main function, gets called when parameters change
//

function run(){
  showSourceImage();
  
  var edgeImage = imageVision(folder + image);
  
  switch(technique){
    case 'gradientValue': 
      edgeImage.convolve([filters.xGradientSobel, filters.yGradientSobel]).absolute().boost(20);
      break;
    case 'gradientDirection':
      edgeImage.convolve([filters.xGradientSobel, filters.yGradientSobel]).direction();
      break;
    case 'gradientDirectionColoured':
      edgeImage.convolve([filters.xGradientSobel, filters.yGradientSobel]).direction().colorize();
      break;
    case 'gradientValueAndAngle':
      edgeImage.convolve([filters.xGradientSobel, filters.yGradientSobel]).absolute().direction().colorize();
      break;
    default:
      edgeImage.convolve(filters[technique]).boost(128);
      break;
  }
  
  edgeImage.fill('.result');
}

//
// compareSpeed
// ------------
//  
// used to compare the speed of seperated and combined sobel-filter
//

function compareSpeed(){
  var start = +new Date;
  testImage.convolve([[0, 1, 0, 0, 2, 0, 0, 1, 0], [0, 0, 0, -1, 0, 1, 0, 0, 0]]);
  
  start2 = +new Date;
  var separately = start2 - start;
  
  testImage.convolve([[-1, 0, 1, -2, 0, 2, -1, 0, 1]]);
  var combined = +new Date - start2;
  
  output.innerHTML = "<code>separately: "+ separately +"ms, combined: "+ combined +"ms</code>" + output.innerHTML;
}

//
// init
// ====
//  
// initialise the ui and the app
//

function init(){
  initialiseUI();
  run();
}

// get the ball rollin'
init();