/*
  This code is designed to generate an island formation using perlin noise. So far, it's awful.


 */




var gSeed = Math.random();
var size = 1024;
var mapSize = 512;
var num = 0;
var level = 0;
var g, m;
var width = size+1;
var height = size+1;
var depth = 1;
var startSpacing = 2;
var ctx, ctb;
var imgData,imgBata;
generate();
console.log("Finished Generation");
drawFrame();

function generate(){
	noise.seed(gSeed);
	var c = document.getElementById("canvass");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
  while(c.width > size)
    size += startSpacing;
  while(c.height > size)
    size += startSpacing;
  width = size+1;
  height = size+1;
	ctx = c.getContext("2d");
  ctb = document.getElementById("canvas2").getContext("2d");
	imgData=ctx.createImageData(width,height);
  imgBata=ctb.createImageData(mapSize,mapSize);
  console.log(width)

	g = new Array(width);
 	for (var i = 0; i < width; i++) {
		g[i] = new Array(height);
  }

  m = new Array(mapSize+1);
  for (var i = 0; i <= mapSize; i++) {
    m[i] = new Array(mapSize+1);
  }

  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      g[x][y] = 0;
    }
  }

	for(var x = 0; x <= width; x+=startSpacing){
		for(var y = 0; y <= height; y+=startSpacing){
			g[x][y] = noise.perlin2(x/200, y/200)*196 + 128;
		}
	}
  // width--;
  // height--;
  expand(startSpacing,g);
}



function expand(spacing, map){
  var newSpacing = spacing / 2;
  //console.log("expanding level " + spacing);
  for(var y = 0; y < map[0].length; y+=spacing){
    for(var x = newSpacing; x < map.length; x+=spacing){
      map[x][y] = (map[x-newSpacing][y] + map[x+newSpacing][y]) / 2;
    }
  }

  for(var x = 0; x < map.length; x+=spacing){
    for(var y = newSpacing; y < map[x].length; y+=spacing){
      map[x][y] = (map[x][y-newSpacing] + map[x][y+newSpacing]) / 2;
    }
  }

  for(var x = newSpacing; x < map.length; x += spacing){
    for(var y = newSpacing; y < map[x].length; y += spacing){
      map[x][y] = (map[x-newSpacing][y] + map[x+newSpacing][y] + map[x][y-newSpacing] + map[x][y+newSpacing]) / 4;
    }
  }
  if(newSpacing > 1)
    expand(newSpacing,map);
}

function drawFrame(){
  console.log("drawing frame")
	level = level % depth;
	for(var x = 0; x < width; x++){
		for(var y = 0; y < height; y++){
			var t = g[x][y];
			var r, gx, b;
			if(t < 100){
				r = 0; gx = 30; b = t+150;
      }
      else if(t < 120){
        r = t+120; gx = t+120; b = 150;
      }
      else if(t < 200){
        r = 40; gx = 300-t; b = 40;
      }
      else if(t < 255){
        r = t/2; gx = t/2; b = t/2;
      }
			sp(imgData, x, y, r,gx,b);
		}
	}
	ctx.putImageData(imgData,0,0);

}
function sp(img, x, y, r, g, b){
  var i = (y * img.width + x) * 4;
  img.data[i]   = r;
  img.data[i+1] = g;
  img.data[i+2] = b;
  img.data[i+3] = 256;
}



function magnify(x,y){
  var maxX = x + mapSize;
  var maxY = y + mapSize;

  for(var i = 0; i <= mapSize; i+= startSpacing){
    for(var j = 0; j <= mapSize; j+= startSpacing){
      m[i][j] = noise.perlin2((i)/800 + x/200, (j)/800 + y/200)*196 + 128;
    }
  }
  expand(startSpacing, m);
}


function drawChunk(){
  for(var x = 0; x < m.length; x++){
    for(var y = 0; y < m[0].length; y++){
      var t = m[x][y];
      var r, gx, b;
      if(t < 100){
        r = 0; gx = 30; b = t+150;
      }
      else if(t < 120){
        r = t+120; gx = t+120; b = 150;
      }
      else if(t < 200){
        r = 40; gx = 300-t; b = 40;
      }
      else if(t < 255){
        r = t/2; gx = t/2; b = t/2;
      }
      sp(imgBata, x, y, r,gx,b);
    }
  }
  ctb.putImageData(imgBata,0,0);
}

var zoom = function(event){
  var x = event.clientX;
  var y = event.clientY;
  magnify(x-40, y-10);
  drawChunk();
}

function pick(event) {
  var x = event.pageX;
  var y = event.pageY;
  var s = document.getElementById("canvasHolder");
  s.style.left = x - 80;
  s.style.top = y - 80;
}


document.getElementById("canvass").addEventListener('mousemove', zoom);
document.getElementById("canvass").addEventListener('mousemove', pick);
document.getElementById("canvas2").addEventListener('mousemove', zoom);
document.getElementById("canvas2").addEventListener('mousemove', pick);