This is an open source implementation of a Demand-Side Platform (DSP) to serve for testing and educational purpose.
It provides an Open RTB interface to receive BidRequests from an SSP. Default implementation contains a mockup agent.

## Get Started

Install the dependencies

```
$ npm install
```

Startup the DSP server. By default it listens on port 8081 and this can be changed by setting the environment variable `PORT`.

```
$ DEBUG=* node server.js
```

It is by default configured with one mockup agent as specified in the file `server.js`

```
const DSPEngine = require('./index.js');
const MockAgent = require('./agents/mock.js');

const engine = new DSPEngine();
engine.addAgent(new MockAgent());
engine.listen(process.env.PORT || 8081);
```
