var canvas = document.getElementById("laserCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

// ================= Track the current level =================
let currentLevel = 1;

//Define mirrorsize and derive square dimensions.
var mirrorsize = 0.03;
var squarediameter = Math.sqrt(2 * Math.pow(mirrorsize, 2)) / 2;

var lasers = [
  { x: 0, y: 0.2, a: 90 }
];

// Square mirrors (movable)
var mirrorsquares = [
  { x: 0.9, y: 0.10, a:  0  },
  { x: 0.9, y: 0.12, a: -8 },
  { x: 0.9, y: 0.14, a: -1 },
  { x: 0.9, y: 0.16, a:  0 },
  { x: 0.9, y: 0.18, a: -16},
  { x: 0.9, y: 0.20, a: -26},
  { x: 0.9, y: 0.22, a:  0 }
];

// Blocks (grey) -- not movable
var blocks = [
  { x: 0.5,   y: 0.6,   w: 0.5,  h: 0.02, a: -6     },
  { x: 0.424, y: 0.882, w: 0.4,  h: 0.02, a: -28.5  }
];

// Sinks (green triangle) -- not movable
var sinks = [
  { x: 0.4, y: 0.99, a: 60 }
];

mirrorsquares.forEach(obj => obj.movable = true);
blocks.forEach(obj => obj.movable = false);
lasers.forEach(obj => obj.movable = false);
sinks.forEach(obj => obj.movable = false);

var objects = [];
mirrorsquares.forEach(obj => objects.push(obj));
blocks.forEach(obj => objects.push(obj));
lasers.forEach(obj => objects.push(obj));
sinks.forEach(obj => objects.push(obj));


Number.prototype.between = function(a, b) {
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  return this >= min && this <= max;
};

function round(x) {
  return Math.round(100000000*x)/100000000.0;
}

function getIntersection(l1, l2) {
  var m1,m2,b1,b2,xi,yi,a,d;

  if (round(l1.x2)==round(l1.x1)) {
    m1=NaN; b1=l1.x1;
  } else {
    m1=round((l1.y2-l1.y1)/(l1.x2-l1.x1));
    b1=l1.y1 - m1*l1.x1;
  }
  if (round(l2.x2)==round(l2.x1)) {
    m2=NaN; b2=l2.x1;
  } else {
    m2=round((l2.y2-l2.y1)/(l2.x2-l2.x1));
    b2=l2.y1 - m2*l2.x1;
  }

  if (isNaN(m1)&&!isNaN(m2)) {
    xi=b1; yi=m2*xi+b2;
    if (xi.between(l2.x1,l2.x2)&&xi.between(l1.x1,l1.x2)&&yi.between(l1.y1,l1.y2)) {
      a=Math.atan(1/m2);
      d=Math.sqrt(Math.pow(xi-l1.x1,2)+Math.pow(yi-l1.y1,2));
      return {x:xi,y:yi,a:a,d:d};
    }
    return null;
  }
  if (isNaN(m2)&&!isNaN(m1)) {
    xi=b2; yi=m1*xi+b1;
    if (yi.between(l2.y1,l2.y2)&&xi.between(l1.x1,l1.x2)) {
      a=Math.atan(m1)+Math.PI/2;
      d=Math.sqrt(Math.pow(xi-l1.x1,2)+Math.pow(yi-l1.y1,2));
      return {x:xi,y:yi,a:a,d:d};
    }
    return null;
  }
  if (m1==m2) {
    if (b1==b2) { return null; }
    return null;
  }
  xi=(b2-b1)/(m1-m2);
  yi=m1*xi+b1;
  if (xi.between(l2.x1,l2.x2)&&xi.between(l1.x1,l1.x2)) {
    a=Math.atan((m1-m2)/(1+m1*m2));
    d=Math.sqrt(Math.pow(xi-l1.x1,2)+Math.pow(yi-l1.y1,2));
    return {x:xi,y:yi,a:a,d:d};
  }
  return null;
}


function draw() {
  // 1) White background
  ctx.fillStyle='white';
  ctx.fillRect(0,0,width,height);

  // 2) Grey border
  ctx.strokeStyle='grey';
  ctx.strokeRect(0,0,width,height);

  // 3) Draw mirrors 
  ctx.fillStyle='lightgray';  
  for (let i=0; i<mirrorsquares.length; i++){
    let x1=mirrorsquares[i].x + squarediameter*Math.sin((mirrorsquares[i].a) /180*Math.PI);
    let y1=mirrorsquares[i].y + squarediameter*Math.cos((mirrorsquares[i].a) /180*Math.PI);
    let x2=mirrorsquares[i].x + squarediameter*Math.sin((mirrorsquares[i].a+90) /180*Math.PI);
    let y2=mirrorsquares[i].y + squarediameter*Math.cos((mirrorsquares[i].a+90) /180*Math.PI);
    let x3=mirrorsquares[i].x + squarediameter*Math.sin((mirrorsquares[i].a+180)/180*Math.PI);
    let y3=mirrorsquares[i].y + squarediameter*Math.cos((mirrorsquares[i].a+180)/180*Math.PI);
    let x4=mirrorsquares[i].x + squarediameter*Math.sin((mirrorsquares[i].a+270)/180*Math.PI);
    let y4=mirrorsquares[i].y + squarediameter*Math.cos((mirrorsquares[i].a+270)/180*Math.PI);

    ctx.beginPath();
    ctx.moveTo(x1*width,y1*height);
    ctx.lineTo(x2*width,y2*height);
    ctx.lineTo(x3*width,y3*height);
    ctx.lineTo(x4*width,y4*height);
    ctx.lineTo(x1*width,y1*height);
    ctx.fill();
    ctx.stroke();

    // Save points
    mirrorsquares[i].points=[
      {x:x1,y:y1},{x:x2,y:y2},{x:x3,y:x3},{x:x4,y:y4}
    ];
    mirrorsquares[i].lines=[
      {x1:x1,y1:y1,x2:x2,y2:y2},
      {x1:x2,y1:y2,x2:x3,y2:y3},
      {x1:x3,y1:y3,x2:x4,y2:y4},
      {x1:x4,y1:y4,x2:x1,y2:y1}
    ];
  }

  // 4) Blocks (grey)
  ctx.fillStyle='grey';
  for (let i=0; i<blocks.length; i++){
    let d=Math.sqrt(Math.pow(blocks[i].w,2)+Math.pow(blocks[i].h,2))/2;
    let a=Math.atan(blocks[i].w/blocks[i].h);
    let r=Math.PI*blocks[i].a/180;
    let bx1=blocks[i].x + d*Math.sin(a+r);
    let by1=blocks[i].y + d*Math.cos(a+r);
    let bx2=blocks[i].x + d*Math.sin(Math.PI-a+r);
    let by2=blocks[i].y + d*Math.cos(Math.PI-a+r);
    let bx3=blocks[i].x + d*Math.sin(Math.PI+a+r);
    let by3=blocks[i].y + d*Math.cos(Math.PI+a+r);
    let bx4=blocks[i].x + d*Math.sin(-a+r);
    let by4=blocks[i].y + d*Math.cos(-a+r);

    ctx.beginPath();
    ctx.moveTo(bx1*width,by1*height);
    ctx.lineTo(bx2*width,by2*height);
    ctx.lineTo(bx3*width,by3*height);
    ctx.lineTo(bx4*width,by4*height);
    ctx.lineTo(bx1*width,by1*height);
    ctx.fill();

    blocks[i].points=[
      {x:bx1,y:by1},{x:bx2,y:by2},{x:bx3,y:by3},{x:bx4,y:by4}
    ];
    blocks[i].lines=[
      {x1:bx1,y1:by1,x2:bx2,y2:by2},
      {x1:bx2,y1:by2,x2:bx3,y2:by3},
      {x1:bx3,y1:by3,x2:bx4,y2:by4},
      {x1:bx4,y1:by4,x2:bx1,y1:by1}
    ];
  }

  // 5) Sinks (green)
  ctx.fillStyle='green';
  for (let i=0; i<sinks.length; i++){
    let sx1=sinks[i].x + squarediameter*Math.sin((sinks[i].a+0)/180*Math.PI);
    let sy1=sinks[i].y + squarediameter*Math.cos((sinks[i].a+0)/180*Math.PI);
    let sx2=sinks[i].x + squarediameter*Math.sin((sinks[i].a+120)/180*Math.PI);
    let sy2=sinks[i].y + squarediameter*Math.cos((sinks[i].a+120)/180*Math.PI);
    let sx3=sinks[i].x + squarediameter*Math.sin((sinks[i].a+240)/180*Math.PI);
    let sy3=sinks[i].y + squarediameter*Math.cos((sinks[i].a+240)/180*Math.PI);

    ctx.beginPath();
    ctx.moveTo(sx1*width,sy1*height);
    ctx.lineTo(sx2*width,sy2*height);
    ctx.lineTo(sx3*width,sy3*height);
    ctx.lineTo(sx1*width,sy1*height);
    ctx.fill();
    ctx.stroke();

    sinks[i].points=[
      {x:sx1,y:sy1},{x:sx2,y:sy2},{x:sx3,y:sy3}
    ];
    sinks[i].lines=[
      {x1:sx1,y1:sy1,x2:sx2,y2:sy2},
      {x1:sx2,y1:sy2,x2:sx3,y2:sy3},
      {x1:sx3,y1:sy3,x2:sx1,y2:sy1}
    ];
  }

  // 6) Lasers 
  ctx.fillStyle='red';
  for (let l=0; l<lasers.length; l++){
    let lasera=lasers[l].a/180*Math.PI;
    let lx1=lasers[l].x + squarediameter*Math.sin((lasers[l].a+0)/180*Math.PI);
    let ly1=lasers[l].y + squarediameter*Math.cos((lasers[l].a+0)/180*Math.PI);
    let lx2=lasers[l].x + squarediameter*Math.sin((lasers[l].a+120)/180*Math.PI);
    let ly2=lasers[l].y + squarediameter*Math.cos((lasers[l].a+120)/180*Math.PI);
    let lx3=lasers[l].x + squarediameter*Math.sin((lasers[l].a+240)/180*Math.PI);
    let ly3=lasers[l].y + squarediameter*Math.cos((lasers[l].a+240)/180*Math.PI);

    ctx.beginPath();
    ctx.moveTo(lx1*width,ly1*height);
    ctx.lineTo(lx2*width,ly2*height);
    ctx.lineTo(lx3*width,ly3*height);
    ctx.lineTo(lx1*width,ly1*height);
    ctx.fill();
    ctx.stroke();

    let terminated=false;
    let sinked=false;
    let laserx2=lx1+2*Math.sin(lasera);
    let lasery2=ly1+2*Math.cos(lasera);
    let laser={x1:lx1,y1:ly1,a:lasera,x2:laserx2,y2:lasery2};
    ctx.beginPath();
    ctx.moveTo(lx1*width,ly1*height);

    let bounce=0;
    let lasthit=null;
    let newLasthit=null;

    while(!terminated){
      let earliestHit=null;
      let intersection;

      // Check mirrors
      for(let i2=0;i2<mirrorsquares.length;i2++){
        for(let j2=0;j2<mirrorsquares[i2].lines.length;j2++){
          if(lasthit===null||lasthit.t!=1||lasthit.i!=i2){
            intersection=getIntersection(laser,mirrorsquares[i2].lines[j2]);
            if(intersection){
              if(!earliestHit||intersection.d<earliestHit.d){
                earliestHit=intersection;
                newLasthit={t:1,i:i2,j:j2};
              }
            }
          }
        }
      }

      // Check blocks => stops beam
      for(let b2=0;b2<blocks.length;b2++){
        for(let k2=0;k2<blocks[b2].lines.length;k2++){
          if(lasthit===null||lasthit.t!=2||lasthit.i!=b2){
            intersection=getIntersection(laser,blocks[b2].lines[k2]);
            if(intersection){
              if(!earliestHit||intersection.d<earliestHit.d){
                earliestHit=intersection;
                newLasthit={t:2,i:b2,j:k2};
                terminated=true;
              }
            }
          }
        }
      }

      // Check sink => stops beam if hit
      for(let s2=0;s2<sinks.length;s2++){
        for(let s3=0;s3<sinks[s2].lines.length;s3++){
          if(lasthit===null||lasthit.t!=2||lasthit.i!=s2){
            intersection=getIntersection(laser,sinks[s2].lines[s3]);
            if(intersection){
              if(!earliestHit||intersection.d<earliestHit.d){
                earliestHit=intersection;
                newLasthit={t:2,i:s2,j:s3};
                terminated=true;
                sinked=true;
              }
            }
          }
        }
      }

      if(!earliestHit){
        terminated=true;
        ctx.lineTo(laser.x2*width,laser.y2*height);
      } else {
        let x2=earliestHit.x; let y2=earliestHit.y;
        let a2=laser.a+Math.PI*(earliestHit.a/(Math.PI/2));
        laserx2=x2+2*Math.sin(a2);
        lasery2=y2+2*Math.cos(a2);
        laser={x1:x2,y1:y2,a:a2,x2:laserx2,y2:lasery2};
        ctx.lineTo(x2*width,y2*height);
      }

      if(bounce++>100){
        terminated=true;
      }
      lasthit=newLasthit;
    }
    ctx.strokeStyle=sinked?'green':'red';
    ctx.stroke();

    if(sinked){
      document.getElementById("finishScreen").style.display="flex";
      document.getElementById("gameScreen").style.display="none";

      // ================= ADDED: Hide "Next Level" if we're on Level 2 =================
      if (currentLevel === 2) {
        const nextBtn = document.getElementById("btnNextLevel");
        if (nextBtn) {
          nextBtn.style.display = "none";
        }
      }
    }
  }
}


draw();




var mouseWheelHandler=function(event){
  let delta=event.detail||event.deltaY;
  let rect=canvas.getBoundingClientRect();
  let mx=event.clientX-rect.left;
  let my=event.clientY-rect.top;
  let minDist=0;
  let minI=-1;

  for(let i=0;i<objects.length;i++){
    if(objects[i].movable===false) continue;
    let xp=objects[i].x*width;
    let yp=objects[i].y*height;
    let dist=Math.sqrt((xp-mx)**2+(yp-my)**2);
    if((minI<0||dist<minDist)&&dist<50){
      minDist=dist; minI=i;
    }
  }
  if(minI>-1&&objects[minI].movable!==false){
    objects[minI].a+=Math.sign(delta)*0.5;
    draw();
  }
  return false;
};
canvas.addEventListener('DOMMouseScroll',mouseWheelHandler,false);
canvas.addEventListener('mousewheel',   mouseWheelHandler,false);
canvas.addEventListener('onwheel',      mouseWheelHandler,false);


let dragged=null;
canvas.addEventListener('mousedown',function(event){
  if(event.buttons==2){

    console.log(JSON.stringify(lasers));
    console.log(JSON.stringify(mirrorsquares));
    console.log(JSON.stringify(blocks));
    console.log(JSON.stringify(sinks));
  }
  let rect=canvas.getBoundingClientRect();
  let mx=event.clientX-rect.left;
  let my=event.clientY-rect.top;
  let minDist=100000;

  for(let i=0;i<objects.length;i++){
    if(objects[i].movable===false) continue;
    let xp=objects[i].x*width;
    let yp=objects[i].y*height;
    let dist=Math.sqrt((xp-mx)**2+(yp-my)**2);
    if(dist<minDist&&dist<50){
      minDist=dist; dragged=i;
    }
  }
  return false;
});

canvas.addEventListener('mouseup',function(){
  dragged=null;
});
canvas.addEventListener('mouseout',function(){
  dragged=null;
});
canvas.addEventListener('mousemove',function(event){
  if(dragged!==null){
    let rect=canvas.getBoundingClientRect();
    let mx=event.clientX-rect.left;
    let my=event.clientY-rect.top;
    if(objects[dragged].movable!==false){
      objects[dragged].x=mx/width;
      objects[dragged].y=my/width; 
      draw();
    }
  }
});


function resetPuzzle(){
  lasers=[
    {x:0,y:0.2,a:90}
  ];
  mirrorsquares=[
    {x:0.9,y:0.10,a:0},
    {x:0.9,y:0.12,a:-8},
    {x:0.9,y:0.14,a:-1},
    {x:0.9,y:0.16,a:0},
    {x:0.9,y:0.18,a:-16},
    {x:0.9,y:0.20,a:-26},
    {x:0.9,y:0.22,a:0}
  ];
  blocks=[
    {x:0.5,y:0.6,  w:0.5,h:0.02,a:-6},
    {x:0.424,y:0.882,w:0.4,h:0.02,a:-28.5}
  ];
  sinks=[
    {x:0.4,y:0.99,a:60}
  ];
  mirrorsquares.forEach(obj=>obj.movable=true);
  blocks.forEach(obj=>obj.movable=false);
  lasers.forEach(obj=>obj.movable=false);
  sinks.forEach(obj=>obj.movable=false);

  objects=[];
  mirrorsquares.forEach(obj=>objects.push(obj));
  blocks.forEach(obj=>objects.push(obj));
  lasers.forEach(obj=>objects.push(obj));
  sinks.forEach(obj=>objects.push(obj));

  // ============ ADDED: Reset to Level 1 & show Next Level button again ============
  currentLevel = 1;
  const nextBtn = document.getElementById("btnNextLevel");
  if (nextBtn) {
    nextBtn.style.display = "inline-block"; 
  }

  draw();
}





// The event listener that calls loadLevel2 after finishing screen
document.getElementById("btnNextLevel").addEventListener("click", ()=>{
  document.getElementById("finishScreen").style.display="none";
  document.getElementById("gameScreen").style.display="flex";
  loadLevel2();
});


// The second loadLevel2() (duplicate in your original code)
function loadLevel2() {

  lasers = [
    { x: 1, y: 0.2, a:220 } 
  ];

  mirrorsquares = [
    { x: 0.1, y: 0.1,  a: 10 },
    { x: 0.2, y: 0.15, a: -5 },
    { x: 0.3, y: 0.22, a: -12 },
    { x: 0.5, y: 0.25, a: 0 }
  ];


  blocks = [

    { x: 0.5,   y: 0.6,   w: 0.5, h: 0.02, a: -6     },
    { x: 0.424, y: 0.882, w: 0.4, h: 0.02, a: -28.5  },
    { x: 0.2,   y: 0.3,   w: 0.3, h: 0.02, a:  10    },
    { x: 0.7,   y: 0.65,  w: 0.3, h: 0.02, a: -15    }
  ];


  sinks = [
    { x: 0.2, y: 0.95, a: 60 }
  ];

  mirrorsquares.forEach(obj => obj.movable = true);
  blocks.forEach(obj => obj.movable = false);
  lasers.forEach(obj => obj.movable = false);
  sinks.forEach(obj => obj.movable = false);

  objects = [];
  mirrorsquares.forEach(obj => objects.push(obj));
  blocks.forEach(obj => objects.push(obj));
  lasers.forEach(obj => objects.push(obj));
  sinks.forEach(obj => objects.push(obj));

  
  currentLevel = 2;

  draw();
}
