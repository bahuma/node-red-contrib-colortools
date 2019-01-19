function randomInteger(min, max) {
  return Math.floor(Math.random() * max) + min  
}


module.exports = function (RED) {
  function RamdomColorNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on('input', function (msg) {
      msg.payload = {
        r: randomInteger(0, 255),
        g: randomInteger(0, 255),
        b: randomInteger(0, 255)
      };

      node.send(msg);
    });
  }

  RED.nodes.registerType("hue-rotate", HueRotateNode);
}