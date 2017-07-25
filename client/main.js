import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import './main.html'

const colour = new ReactiveVar([0, 0, 0])

Template.pickColour.events({
  'change input' (event, instance) {
    var val = event.currentTarget.value
    val = val.substring(1, val.length)

    var r = parseInt('0x' + val.substring(0, 2), 16)
    var g = parseInt('0x' + val.substring(2, 4), 16)
    var b = parseInt('0x' + val.substring(4, 6), 16)

    colour.set([r, g, b])
    console.log(colour.get())
    Meteor.call('fadeTo', r * 0.25, g * 0.25, b * 0.25, 4000, function (e, res) {
      console.log(e, res)
    })
  }
})

Template.pickColour.helpers({
  colour () {
    console.log(colour.get().join(', '))
    return colour.get().join(', ')
  }
})
