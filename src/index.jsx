/** @jsx React.DOM */
var React = require('react');
var FieldTag = require('./views/FieldTag');
var Field = require('./core/Field');
var Sourcer = require('./core/Sourcer');

var ScreenTag = React.createClass({
  getInitialState: function(){
    var field = new Field();

    var sourcer1 = new Sourcer(field, 10, 50,
      "return function(ctrl) { if (ctrl.altitude() < 100) { ctrl.ascent(); } };");
    var sourcer2 = new Sourcer(field, 30, 50,
      "return function(ctrl) { if (ctrl.altitude() < 100) { ctrl.ascent(); } };");

    field.addSourcer(sourcer1);
    field.addSourcer(sourcer2);

    return {
      field : field
    };
  },
  render: function() {
    return (
      <svg width="512" height="512" viewBox="0 0 128 128">
        <FieldTag field={this.state.field} />
      </svg>
    );
  }
});

var output = document.getElementById("screen");

React.render( <ScreenTag width="512" height="512" /> , output);
