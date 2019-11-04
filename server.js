const DSPEngine = require('./index.js');
const MockAgent = require('./agents/mock.js');

const engine = new DSPEngine();
engine.addAgent(new MockAgent());
engine.listen(process.env.PORT || 8081);