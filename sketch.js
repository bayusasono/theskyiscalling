let font;
let fontInterBold;
let data;
let table;
let tableLength;

let initZero;
let rowIter=0;
let currentRow;
let lineRef;

let maxDist;
let minDist;

var canvasDiv;

function preload() {
  svg_aircraft = loadImage("assets/aircraft-generic-simple.svg"); 
  svg_aircraft_decor = loadImage("assets/aircraft45-generic-light-simple.svg"); 
  svg_aircraft_placeholder = loadImage("assets/aircraft45-generic-dark-simple.svg"); 
  svg_aircraft_medium = loadImage("assets/silhouette45-medium-dark.svg");
  svg_aircraft_heavy = loadImage("assets/silhouette45-heavy-dark.svg"); 
  font = loadFont("fonts/Inter-Regular.otf");
  fontInterBold = loadFont("fonts/Inter-Bold.otf");
  // font = loadFont("fonts/Satoshi-Regular.ttf");
  table = loadTable('data/tdgp-fs-for_p5-v5.csv', 'csv', 'header');
}


function setup() {
  canvasDiv = document.getElementById('mySketch'); // accesses information about your div, which is named 'mySketch', in the HTML file
  let canvas = createCanvas(canvasDiv.offsetWidth, windowHeight*0.75); // "offsetWidth" returns the value of that specific div's width. the height here can also be customised
  canvas.parent('mySketch');
  extraCanvas = createGraphics(canvasDiv.offsetWidth, windowHeight*0.75);
  // extraCanvas = createGraphics(windowWidth, windowHeight);
  angleMode(DEGREES);
  ellipseMode(CENTER);
  imageMode(CENTER);
  
  // Parameter setup from loaded data
  tableLength = table.getRowCount();
  // print(tableLength + ' total rows in table');
  // print(table.getColumnCount() + ' total columns in table');
  // print("MAX DIST: "+max(table.getColumn("distance_travelled_km")));
  maxDist = max(table.getColumn("distance_travelled_km"));
  // print("MIN DIST: "+min(table.getColumn("distance_travelled_km")));
  minDist = min(table.getColumn("distance_travelled_km"));
  
  // noLoop(); // UTIL used to make draw() only run once
}

function draw() {
  // background("#09090b");
  background("#09090B8C");
  
  // Axis Setup
  xAxisHeight = height-64;
  xAxisPadding = 32;
  xAxisLabels = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  // xAxisLabelsWeek = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0};
  xAxisLabelsObj = [{day:"MON",xCoord:0},{day:"TUE",xCoord:0},{day:"WED",xCoord:0},{day:"THU",xCoord:0},{day:"FRI",xCoord:0},{day:"SAT",xCoord:0},{day:"SUN",xCoord:0}]
  stroke("white");
  line(0+xAxisPadding,xAxisHeight-8,width-xAxisPadding,xAxisHeight-8);
  increment = (width-xAxisPadding*  2)/xAxisLabels.length
  for (i=0;i<xAxisLabels.length;i++) {
    // console.log(xAxisLabels[i]);
    push();
    stroke("white");
    strokeWeight(0.5);
    fill("black");
    rect(xAxisPadding*1.075+i*increment,xAxisHeight+12,60,30,8);
    noStroke();
    fill("white");
    textAlign(CENTER);
    textFont(fontInterBold);
    textSize(14);
    xAxisLabelsObj[i].xCoord = (xAxisPadding*2+i*increment);
    text("● "+xAxisLabels[i],xAxisPadding*2+i*increment,xAxisHeight+32);
    // console.log("MANUAL",xAxisPadding*2+i*increment)
    // console.log("AUTO",xAxisLabelsObj[i].xCoord)
    pop();
  }
  infoTextArea=200;
  push();
  noStroke();
  fill("white")
  textAlign(LEFT);
  textFont(fontInterBold);
  textSize(24);
  text("The Sky is Calling",xAxisPadding,50);
  image(svg_aircraft_decor,xAxisPadding+212,32,16,16);
  textFont(font);
  textSize(12);
  text("A visualisation of the flights flown as a part of my flight simulation hobby since I started tracking it from 24APR2022 until 29APR2023, mapped against my daily schedule and activities.",xAxisPadding,74,288);
  fill("rgba(255,255,255,0.3)")
  textSize(8);
  text("Flights are flown in Microsoft Flight Simulator and tracked/logged using Volanta. Exported data is processed using Python and Excel, assets are made in Figma, everything is put together with p5js.",xAxisPadding,164,288);
  
  // Boarding Pass ghost
  textAlign(RIGHT);
  textFont(fontInterBold);
  textSize(24);
  fill("rgba(255,255,255,0.1)")
  text("Boarding\nPass",width-xAxisPadding-268,54);
  // rect(width-xAxisPadding-256, 22, 256, 80, 8);
  rect(width-xAxisPadding-256, 22, 256, 80, 8);
  fill("black");
  arc(width-xAxisPadding-176, 22, 16, 16, 0, 180);
  arc(width-xAxisPadding-176, 102, 16, 16, 180, 360);
  pop();
  
  
  
  dayMonCount = 0;
  dayTueCount = 0;
  dayWedCount = 0;
  dayThuCount = 0;
  dayFriCount = 0;
  daySatCount = 0;
  daySunCount = 0;
  totalTimeCount = 0;
  totalDistanceCount = 0;
  baseCircleSize = 28;
  baseSilhouetteSize = 24;
  columnPerGroup = 1;
  nodeSpacing = 40;
  nodePerCol = (xAxisHeight-infoTextArea)/(baseCircleSize+nodeSpacing/4);
  // console.log(nodePerCol);
  
  // Categorisation of day
  for (i=0;i<tableLength;i++) {
    // print(i); // THIS SLOWS DOWN WEB EDITOR A LOT
    currentRow=table.getRow(i);
    totalTimeCount += int(currentRow.get("realBlockTime"));
    totalDistanceCount += int(currentRow.get("distance_travelled_km"));
    
    // Render and group by Day of Week
    if (currentRow.get("dateDayOfWeek")=="Mon") {
      dayMonCount += 1;
    } else if (currentRow.get("dateDayOfWeek")=="Tue") {
      dayTueCount += 1;
    } else if (currentRow.get("dateDayOfWeek")=="Wed") {
      dayWedCount += 1;
    } else if (currentRow.get("dateDayOfWeek")=="Thu") {
      dayThuCount += 1;
    } else if (currentRow.get("dateDayOfWeek")=="Fri") {
      dayFriCount += 1;
    } else if (currentRow.get("dateDayOfWeek")=="Sat") {
      daySatCount +=1 ;
    } else if (currentRow.get("dateDayOfWeek")=="Sun") {
      daySunCount +=1 ;
    }
  }

  dayMonCount = 0;
  nodeMonCount = 0;
  xCoordMonShiftMult = 0;
  dayTueCount = 0;
  nodeTueCount = 0;
  xCoordTueShiftMult = 0;
  dayWedCount = 0;
  nodeWedCount = 0;
  xCoordWedShiftMult = 0;
  dayThuCount = 0;
  nodeThuCount = 0;
  xCoordThuShiftMult = 0;
  dayFriCount = 0;
  nodeFriCount = 0;
  xCoordFriShiftMult = 0;
  daySatCount = 0;
  nodeSatCount = 0;
  xCoordSatShiftMult = 0;
  daySunCount = 0;
  nodeSunCount = 0;
  xCoordSunShiftMult = 0;
  
  sketchAreaRoof = 224;
  
  // Actual displaying
  for (i=0;i<tableLength;i++) {
    // print(i); // THIS SLOWS DOWN WEB EDITOR A LOT
    currentRow=table.getRow(i);
    // Render and group by Day of Week
    if (currentRow.get("dateDayOfWeek")=="Mon") {
      dayMonCount += 1;
      nodeMonCount += 1;
      yCoordMonNode = xAxisHeight-nodeMonCount-nodeMonCount*nodeSpacing;
      // print("INIT",xCoordShiftMult,yCoordMonNode);
      if (yCoordMonNode < sketchAreaRoof) {
        nodeMonCount = 1;
        yCoordMonNode = xAxisHeight-nodeMonCount-nodeMonCount*nodeSpacing;
        xCoordMonShiftMult += 1;
        // print("CHANGED",xCoordShiftMult,yCoordMonNode);
      }
      // print("USED:",xAxisLabelsObj[0].xCoord+nodeSpacing*xCoordShiftMult,yCoordMonNode);
        flightNodeMon = new flightNode(xAxisLabelsObj[0].xCoord+nodeSpacing*xCoordMonShiftMult,yCoordMonNode,currentRow)
      // print(yCoordMonNode);
      flightNodeMon.hover(mouseX,mouseY);
      flightNodeMon.show();
    } else if (currentRow.get("dateDayOfWeek")=="Tue") {
      dayTueCount += 1;
      nodeTueCount += 1;
      yCoordTueNode = xAxisHeight-nodeTueCount-nodeTueCount*nodeSpacing;
      if (yCoordTueNode < sketchAreaRoof) {
        nodeTueCount = 1;
        yCoordTueNode = xAxisHeight-nodeTueCount-nodeTueCount*nodeSpacing;
        xCoordTueShiftMult += 1;
      }
        flightNodeTue = new flightNode(xAxisLabelsObj[1].xCoord+nodeSpacing*xCoordTueShiftMult,yCoordTueNode,currentRow)
      flightNodeTue.hover(mouseX,mouseY);
      flightNodeTue.show();
    } else if (currentRow.get("dateDayOfWeek")=="Wed") {
      dayWedCount += 1;
      nodeWedCount += 1;
      yCoordWedNode = xAxisHeight-nodeWedCount-nodeWedCount*nodeSpacing;
      if (yCoordWedNode < sketchAreaRoof) {
        nodeWedCount = 1;
        yCoordWedNode = xAxisHeight-nodeWedCount-nodeWedCount*nodeSpacing;
        xCoordWedShiftMult += 1;
      }
        flightNodeWed = new flightNode(xAxisLabelsObj[2].xCoord+nodeSpacing*xCoordWedShiftMult,yCoordWedNode,currentRow)
      flightNodeWed.hover(mouseX,mouseY);
      flightNodeWed.show();
    } else if (currentRow.get("dateDayOfWeek")=="Thu") {
      dayThuCount += 1;
      nodeThuCount += 1;
      yCoordThuNode = xAxisHeight-nodeThuCount-nodeThuCount*nodeSpacing;
      if (yCoordThuNode < sketchAreaRoof) {
        nodeThuCount = 1;
        yCoordThuNode = xAxisHeight-nodeThuCount-nodeThuCount*nodeSpacing;
        xCoordThuShiftMult += 1;
      }
        flightNodeThu = new flightNode(xAxisLabelsObj[3].xCoord+nodeSpacing*xCoordThuShiftMult,yCoordThuNode,currentRow)
      flightNodeThu.hover(mouseX,mouseY);
      flightNodeThu.show();
    } else if (currentRow.get("dateDayOfWeek")=="Fri") {
      dayFriCount += 1;
      nodeFriCount += 1;
      yCoordFriNode = xAxisHeight-nodeFriCount-nodeFriCount*nodeSpacing;
      if (yCoordFriNode < sketchAreaRoof) {
        nodeFriCount = 1;
        yCoordFriNode = xAxisHeight-nodeFriCount-nodeFriCount*nodeSpacing;
        xCoordFriShiftMult += 1;
      }
        flightNodeFri = new flightNode(xAxisLabelsObj[4].xCoord+nodeSpacing*xCoordFriShiftMult,yCoordFriNode,currentRow)
      flightNodeFri.hover(mouseX,mouseY);
      flightNodeFri.show();
    } else if (currentRow.get("dateDayOfWeek")=="Sat") {
      daySatCount += 1;
      nodeSatCount += 1;
      yCoordSatNode = xAxisHeight-nodeSatCount-nodeSatCount*nodeSpacing;
      if (yCoordSatNode < sketchAreaRoof) {
        nodeSatCount = 1;
        yCoordSatNode = xAxisHeight-nodeSatCount-nodeSatCount*nodeSpacing;
        xCoordSatShiftMult += 1;
      }
        flightNodeSat = new flightNode(xAxisLabelsObj[5].xCoord+nodeSpacing*xCoordSatShiftMult,yCoordSatNode,currentRow)
      flightNodeSat.hover(mouseX,mouseY);
      flightNodeSat.show();
    } else if (currentRow.get("dateDayOfWeek")=="Sun") {
      daySunCount += 1;
      nodeSunCount += 1;
      yCoordSunNode = xAxisHeight-nodeSunCount-nodeSunCount*nodeSpacing;
      if (yCoordSunNode < sketchAreaRoof) {
        nodeSunCount = 1;
        yCoordSunNode = xAxisHeight-nodeSunCount-nodeSunCount*nodeSpacing;
        xCoordSunShiftMult += 1;
      }
        flightNodeSun = new flightNode(xAxisLabelsObj[6].xCoord+nodeSpacing*xCoordSunShiftMult,yCoordSunNode,currentRow)
      flightNodeSun.hover(mouseX,mouseY);
      flightNodeSun.show();
    }
  }

  push();
  stroke("white");
  line(width-xAxisPadding-256, 116,width-xAxisPadding,116);
  noStroke();
  fill("white")
  textAlign(LEFT);
  textFont(fontInterBold);
  textSize(10);
  text("Flights flown: "+tableLength+" | Hours flown: "+round(totalTimeCount/3600)+"hrs\n | Distance travelled: "+totalDistanceCount+"Km",xAxisPadding,136,288);
  // text("Total hours flown:",xAxisPadding,152,160);
  // text("Total distance travelled:",xAxisPadding,168,160);
  pop();
  
  // DataViz Key/Legend
  push();
  noStroke();
  fill("white")
  textAlign(LEFT);
  textSize(10);
  textFont(font);
  text("● Hover Circle radius: Flight distance relative to shortest flight.",width-xAxisPadding-256,172,256)
  textFont(fontInterBold);
  text("KEY: ",width-xAxisPadding-256,140);
  fill("#dc2626");
  text("● Work",width-xAxisPadding-228,140);
  fill("#16a34a");
  text("● Holiday",width-xAxisPadding-184,140);
  fill("#FACC15");
  text("● University",width-xAxisPadding-128,140);
  fill("#0ea5e9");
  text("● Free/Flexible",width-xAxisPadding-228,156);
  fill("#fb923c");
  text("● Work & Uni",width-xAxisPadding-148,156);
  
  
  pop();
  
  translate(width/2,height/2);
}

// CLASS Composite function for flight data node visual representation
// TODO: Rest & Hover state
class flightNode {
  constructor(posX,posY,rowData) {
    this.posX = posX;
    this.posY = posY;
    this.rowData = rowData;
    this.colourParam = "#FACC15";
    this.colourInner = "#FACC15";
    this.outerCircleMultiplier = this.rowData.get("distance_travelled_km")/maxDist
    // this.baseCircleSize=32
    this.innerCircleDimension=[baseCircleSize,baseCircleSize];
    this.outerCircleDimension=[baseCircleSize+1,baseCircleSize+1];
    
    // Colour assignment, checking DOWactivity
    // console.log(this.rowData.get("DOWactivity").includes("H"));
    if (this.rowData.get("DOWactivity").includes("W")) {
      this.colourParam = "#dc2626";
      this.colourInner = "#dc2626";
    } else if (this.rowData.get("DOWactivity").includes("H")) {
      this.colourParam = "#16a34a";
      this.colourInner = "#16a34a";
    } else if (this.rowData.get("DOWactivity").includes("U")) {
      this.colourParam = "#FACC15";
      this.colourInner = "#FACC15";
    } else if (this.rowData.get("DOWactivity").includes("F")) {
      this.colourParam = "#0ea5e9";
      this.colourInner = "#0ea5e9";
    } else if (this.rowData.get("DOWactivity").includes("M")) {
      this.colourParam = "#fb923c";
      this.colourInner = "#fb923c";
    } else {
      this.colourParam = "#white";
      this.colourInner = "#white";
    }
    
  }
  show() {     
     // fill(255,255,255,100)
    // scale(0.95); // Cool effect but didn't achieve what I want lol
     stroke(this.colourParam);
     strokeWeight(1.5);
     fill(this.colourParam)
     ellipse(this.posX,this.posY,this.outerCircleDimension[0],this.outerCircleDimension[1]);
     // stroke("#09090b");
     fill(this.colourInner);
     ellipse(this.posX,this.posY,this.innerCircleDimension[0],this.innerCircleDimension[1]);
     
     noStroke();
     
     // Scaling/Swapping aicraft silhouette according to ICAO category
     if (this.rowData.get("aircraftCategory") == "Medium") {
      image(svg_aircraft_medium,this.posX,this.posY,baseSilhouetteSize,baseSilhouetteSize);
     } else if (this.rowData.get("aircraftCategory") == "Heavy") {
      image(svg_aircraft_heavy,this.posX,this.posY,baseSilhouetteSize,baseSilhouetteSize);
     } else {
     image(svg_aircraft_placeholder,this.posX,this.posY,baseSilhouetteSize,baseSilhouetteSize);
     }

  }
  hover(mX,mY) {
    // let withinDist = false;
    let distance = dist(mX,mY,this.posX,this.posY);
    // print("Distance",this.id,this.distance);
    if (distance < 20) {
      // print("fN within detection",this.id);
      this.outerCircleDimension=[baseCircleSize+1+this.outerCircleMultiplier*128,baseCircleSize+1+this.outerCircleMultiplier*128];
      
      fill("#white");
      // rect(this.posX-22, this.posY-22, 192, 44, 64);
      // rect(this.posX-22-40, this.posY-22, 224, 44, 8);
      rect(width-xAxisPadding-256, 22, 256, 80, 8);
      fill(this.colourInner);
      rect(width-xAxisPadding-184, 22, 16, 80);
      fill("#09090b") // Clipping — match with background
      arc(width-xAxisPadding-176, 22, 16, 16, 0, 180);
      arc(width-xAxisPadding-176, 102, 16, 16, 180, 360);
      image(svg_aircraft,width-xAxisPadding-176,62,16,16);
      circle(width-xAxisPadding-176, 38,4);
      circle(width-xAxisPadding-176, 46,4);
      circle(width-xAxisPadding-176, 78,4);
      circle(width-xAxisPadding-176, 86,4);
      
      if (this.rowData.get("DOWactivity").includes("W")) {
      this.colourParam = "rgba(220,38,38,0.1)";
    } else if (this.rowData.get("DOWactivity").includes("H")) {
      this.colourParam = "rgba(22,163,74,0.1)";
    } else if (this.rowData.get("DOWactivity").includes("U")) {
      this.colourParam = "rgba(250,204,21,0.1)";
    } else if (this.rowData.get("DOWactivity").includes("F")) {
      this.colourParam = "rgba(14,165,233,0.1)";
    } else if (this.rowData.get("DOWactivity").includes("M")) {
      this.colourParam = "rgba(251,146,60,0.1)";
    } else {
      this.colourParam = "#rgba(255,255,255,0.1)";
    }
      
      // TEXT NODES — DYNAMIC      
      fill("black");
      textAlign(RIGHT);
      textSize(10);
      textFont(font);
      text(this.rowData.get("dateTimeParseDate"),width-xAxisPadding-194, 38)
      text(this.rowData.get("dateTimeParseTime"),width-xAxisPadding-198, 92)
      textSize(18);
      textFont(fontInterBold);
      text(this.rowData.get("originIata"),width-xAxisPadding-196, 60)
      text(this.rowData.get("destinationIata"),width-xAxisPadding-196, 76)
      textAlign(LEFT);
      textSize(12);
      textFont(font);
      text(this.rowData.get("callsign")+" ◦ "+this.rowData.get("aircraftIcao")+" ◦ "+this.rowData.get("aircraftCategory"),width-xAxisPadding-158, 40); // AircraftICAO & Class
      text(secondsToTimeString(this.rowData.get("realBlockTime"))+" Hrs"+" ◦ "+round(this.rowData.get("distance_travelled_km"))+" km",width-xAxisPadding-158, 94); // FlightTime
      textSize(14);
      textFont("Arial");
      text(getFlagEmoji(this.rowData.get("countryOrigin"))+this.rowData.get("muniOrigin")+" \n➡ "+getFlagEmoji(this.rowData.get("countryDestination"))+this.rowData.get("muniDestination"), width-xAxisPadding-158, 58);
    } 
  }
}

// Helper function to convert seconds to HH:MM:SS
// Adapted code by Ayibatari Ibaba
// From https://codingbeautydev.com/blog/javascript-convert-seconds-to-hours-and-minutes/
function secondsToTimeString(totalSeconds) {
  const totalMs = totalSeconds * 1000;
  // const result = new Date(totalMs).toISOString().slice(11, 19); // HH:MM:SS
  const result = new Date(totalMs).toISOString().slice(11, 16); // HH:MM
  return result;
}

// Helper function to convert two-letter country code to flag emoji
// Adapted code by Jorik
// From https://dev.to/jorik/country-code-to-flag-emoji-a21
function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}


function windowResized () { // function to help your canvas stay responsive when browser window is dragged/resized
	resizeCanvas(canvasDiv.offsetWidth, windowHeight*0.75);
}
