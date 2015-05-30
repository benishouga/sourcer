/** @jsx React.DOM */
var React = require('react');

var ScreenTag = React.createClass({
  render: function() {
    return (
      <svg width="512" height="512" viewBox="0 0 128 128">
        <g id="aaa" transform="translate(16, 16) rotate(45, 8, 8) scale(1, 1)">
          <rect class="b" fill="#fff" width="14" height="4" x="1" y="6" ry="2" />
          <rect class="m" fill="#000" width="12" height="2" x="2" y="7" ry="1" />
        </g>
        <g id="bbb">
          <rect class="b" fill="#fff" width="14" height="4" x="1" y="6" ry="2" />
          <rect class="m" fill="#000" width="12" height="2" x="2" y="7" ry="1" />
        </g>
        <g id="ship" transform="translate(48, 48) rotate(45, 8, 8)">
          <rect class="b" transform="rotate(45, 16, 16)" ry="2" y="14" x="0" height="4" width="18" fill="#fff" />
          <rect class="m" transform="rotate(45, 16, 16)" ry="1" y="15" x="1" height="2" width="16" fill="#000" />
          <rect class="b" transform="rotate(-45, 16, 16)" ry="2" y="14" x="0" height="4" width="18" fill="#fff" />
          <rect class="m" transform="rotate(-45, 16, 16)" ry="1" y="15" x="1" height="2" width="16" fill="#000" />
          <circle class="b" r="12" cy="16" cx="16" fill="#fff" />
          <circle class="m" r="11" cy="16" cx="16" id="path4136" fill="#000" />
          <circle class="b" r="9" cy="16" cx="16" id="path4140" fill="#fff" />
          <rect class="b" ry="2" y="14" x="0" height="4" width="31" fill="#fff" />
          <rect class="m" ry="1" y="15" x="1" height="2" width="29" fill="#000" />
          <circle class="b" r="4" cy="16" cx="20" fill="#fff" />
          <circle class="m" r="3" cy="16" cx="20" fill="#000" />
          <circle class="b" r="1" cy="16" cx="20" fill="#fff" />
        </g>
      </svg>
    );
  }
});

var output = document.getElementById("screen");

React.render( <ScreenTag width="512" height="512" /> , output);
