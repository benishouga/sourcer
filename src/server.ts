import * as express from 'express';
import * as fs from 'fs';
import * as Handlebars  from  'handlebars';
import * as React from 'react';
import * as Router from 'react-router';
import Routes from './routes';

var routes = Routes();
var app = express();

var data = {
  aaa: [
    { id: 'XxVg_s8xAms', title: 'Introduction to React.js' },
    { id: '-DX3vJiqxm4', title: 'Pete Hunt - The Secrets of React\'s Virtual DOM (FutureJS 2014)', },
    { id: 'lAn7GVoGlKU', title: 'Building UIs with ReactJS' },
    { id: 'i__969noyAM', title: 'React and Flux: Building Applications with a Unidirectional Data Flow' }
  ]
};

var template = Handlebars.compile(fs.readFileSync('./index.hbs').toString());

app.use(express.static('dist'));

app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
    res.send(template({
      initialData: JSON.stringify(data),
      markup: React.renderToString(React.createElement(Handler, { datas: data }))
    }));
  });
});

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);
