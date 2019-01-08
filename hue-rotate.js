function RGB2HSV(rgb) {
  hsv = {};
  max=max3(rgb.r,rgb.g,rgb.b);
  dif=max-min3(rgb.r,rgb.g,rgb.b);
  hsv.saturation=(max===0.0)?0:(100*dif/max);
  if (hsv.saturation===0) hsv.hue=0;
  else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
  else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
  else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
  if (hsv.hue<0.0) hsv.hue+=360.0;
  hsv.value=Math.round(max*100/255);
  hsv.hue=Math.round(hsv.hue);
  hsv.saturation=Math.round(hsv.saturation);
  return hsv;
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
function HSV2RGB(hsv) {
  var rgb={};
  if (hsv.saturation===0) {
      rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
  } else {
      hsv.hue/=60;
      hsv.saturation/=100;
      hsv.value/=100;
      i=Math.floor(hsv.hue);
      f=hsv.hue-i;
      p=hsv.value*(1-hsv.saturation);
      q=hsv.value*(1-hsv.saturation*f);
      t=hsv.value*(1-hsv.saturation*(1-f));
      switch(i) {
      case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
      case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
      case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
      case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
      case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
      default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
      }
      rgb.r=Math.round(rgb.r*255);
      rgb.g=Math.round(rgb.g*255);
      rgb.b=Math.round(rgb.b*255);
  }
  return rgb;
}

//Adding HueShift via Jacob (see comments)
function HueShift(h,s) { 
  h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; 
}

//min max via Hairgami_Master (see comments)
function min3(a,b,c) { 
  return (a<b)?((a<c)?a:c):((b<c)?b:c); 
} 
function max3(a,b,c) { 
  return (a>b)?((a>c)?a:c):((b>c)?b:c); 
}



module.exports = function (RED) {
  function HueRotateNode(config) {
    RED.nodes.createNode(this, config);
    this.rotation = config.rotation;
    var node = this;
    node.on('input', function (msg) {
      // extract rgb from payload
      temprgb = msg.payload;

      // convert to complementary color
      temphsv = RGB2HSV(temprgb);
      temphsv.hue = HueShift(temphsv.hue, node.rotation);
      temprgb = HSV2RGB(temphsv);

      // store complementary color in payload
      msg.payload = temprgb;

      node.send(msg);
    });
  }

  RED.nodes.registerType("hue-rotate", HueRotateNode);
}