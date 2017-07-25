import { Meteor } from 'meteor/meteor'

var usb = require('usb')
var dev = usb.findByIds(7476, 4)
dev.open()

var iface = dev.interfaces[0]
try {
  iface.detachKernelDriver(0)
  iface.claim(0)
} catch (ex) {
  console.error(ex)
}

function send (buffer) {
  dev.controlTransfer(0x21, 0x09, 0x200, 0x00, buffer, (e, r) => console.log(e, r))
}

send(new Buffer([ 0x1f, 0x02, 0x00, 0x2e, 0x00, 0x00, 0x2b, 0x03 ]))
send(new Buffer([ 0x00, 0x02, 0x00, 0x2e, 0x00, 0x00, 0x2b, 0x04 ]))
send(new Buffer([ 0x00, 0x02, 0x00, 0x2e, 0x00, 0x00, 0x2b, 0x05 ]))

send(new Buffer([0, 0, 0, 0, 0, 0, 0, 0x05]))

var currentColour = [0, 0, 0]
function setColour (r, g, b) {
  r = Math.min(64, r)
  g = Math.min(64, g)
  b = Math.min(64, b)

  currentColour = [r, g, b]
  send(new Buffer([r, g, b, 0, 0, 0, 0, 0x05]))
}

function fadeTo (r, g, b, speed) {
  var elapsed = 0
  var timer = setInterval(function () {
    elapsed += 43

    var newR = r - currentColour[0]
    var rDelta = Math.floor(newR / 43)

    var newG = g - currentColour[1]
    var gDelta = Math.floor(newG / 43)

    var newB = b - currentColour[2]
    var bDelta = Math.floor(newB / 43)

    setColour(currentColour[0] + rDelta, currentColour[1] + gDelta, currentColour[2] + bDelta)
    if (elapsed >= speed) {
      clearInterval(timer)
    }
  }, 43)
}

Meteor.methods({
  setColour,
  fadeTo
})
