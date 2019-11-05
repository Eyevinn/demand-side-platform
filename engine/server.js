const restify = require('restify');
const errs = require('restify-errors');
const debug = require('debug')('dsp-engine');
const openrtb = require('openrtb');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const ResponseBuilder = openrtb.getBuilder({ builderType: 'bidResponse'} );

const SwaggerUI = require('swagger-ui-restify');
const apiDocument = require('./api-docs.json');

class DSPEngine {
  constructor(options) {
    this.server = restify.createServer();
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());


    this.server.post('/dsp', this._handleBidRequest.bind(this));
    this.server.get('/win', this._handleBidWin.bind(this));
    this.server.get('/healthcheck', this._handleHealthCheck.bind(this));
    this.server.get('/schema/*', restify.plugins.serveStaticFiles('./engine/schema'));

    this.server.get('/*', ...SwaggerUI.serve);
    this.server.get('/', SwaggerUI.setup(apiDocument));

    this.agents = [];
  }

  listen(port, myip) {
    this.server.listen(port, myip, () => {
      debug('%s listening at %s', this.server.name, this.server.url);
    });
  }

  addAgent(agent) {
    this.agents.push(agent);
  }

  _handleBidRequest(req, res, next) {
    debug('req.url=' + req.url);
    debug('req.body=%o', req.body);
    debug('req.query=%o', req.query);

    let agent;
    if (req.query['mock']) {
      agent = this.agents.find(a => a.type() === 'MOCK');
    }

    if (req.body) {
      try {
        let bids = agent.getBids(req.body.imp);
        let bidResponse = ResponseBuilder
        .timestamp(moment.utc().format())
        .status(1)
        .id(uuidv1())
        .bidderName(agent.name())
        .seatbid([
          {
            bid: bids
          }
        ])
        .build();
        res.send(bidResponse, { 'x-openrtb-version': '2.3' });
        next();  
      }
      catch (errObj) {
        debug('error: %o', errObj);
        const err = new errs.InternalServerError(errObj.message);
        next(err);
      }
    } else {
      next(new errs.InvalidContentError('Missing BidRequest body'));
    }
  }

  _handleBidWin(req, res, next) {
    debug('req.url=' + req.url);
    debug('req.query=%o', req.query);

    let agentName = req.query['agent'];
    let agent = this.agents.find(a => a.name() === agentName);
    let winBid = agent.getBidById(req.query['bid']);
    let ad = agent.getAdByCampaignId(winBid.cid);
    let creative = agent.getCreativeByAdId(ad.id);
    debug('creative: %o', creative);
  
    let mediaFile = `<MediaFile delivery="progressive" type="video/mp4" width="${creative.w}" height="${creative.h}" scalable="true"><![CDATA[${creative.mediaFile}]]></MediaFile>`;
    let tracking = `<Impression><![CDATA[${agent.getAdServerUrl()}/track/?price=${req.query.price}]]></Impression>`;
    let adSystem = `<AdSystem>${agent.getAdSystem()}</AdSystem><AdTitle>${ad.title}</AdTitle>`;
    let videoAdMarkup = `<VAST version="2.0"><Ad id="${ad.id}"><InLine>${adSystem}<Creatives><Creative id="video"><Linear><Duration>00:00:15</Duration><MediaFiles>${mediaFile}</MediaFiles></Linear></Creative></Creatives>${tracking}</InLine></Ad></VAST>`;
    res.setHeader('content-type', 'application/xml');
    res.sendRaw(videoAdMarkup);
    next();  
  }

  _handleHealthCheck(req, res, next) {
    debug('req.url=' + req.url);
    res.send(200);
    next();
  }
}

module.exports = DSPEngine;