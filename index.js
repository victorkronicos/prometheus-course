var express = require('express');
var prom = require('prom-client');
const register = prom.register;

var app = express();

const client = require('prom-client');

const counter = new client.Counter({
  name: 'aula_request_total',
  help: 'Contador de requests',
  labelNames: ['statusCode']
});

const gauge = new client.Gauge({
  name: 'aula_free_bytes',
  help: 'Exemplo de gauge'
});

const histogram = new client.Histogram({
  name: 'aula_request_time_seconds',
  help: 'Tempo de resposta da API',
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5]
});

const summary = new client.Summary({
  name: 'aula_summary_request_time_seconds',
  help: 'Tempo de res´psta da API',
  percentiles: [0.5, 0.9, 0.99]
})

app.get('/', function(req, res){
  counter.labels('200').inc();
  counter.labels('300').inc();
  const tempo = Math.random();

  gauge.set(tempo);
  histogram.observe(tempo);
  summary.observe(tempo);

  res.send("Hello World");
});

app.get('/metrics', async function(req, res){
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(3000);