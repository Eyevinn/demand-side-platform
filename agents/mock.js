const debug = require('debug')('agent-mock');
const uuidv1 = require('uuid/v1');

const MOCK_DEALS = [
  {
    id: 'mock-deal-1',
    price: 1.05,
    cid: '1000',
    clearPrice: 0.9,
  },
  {
    id: 'mock-deal-2',
    price: 1.35,
    cid: '2000',
    clearPrice: 0.9,
  },
  {
    id: 'mock-deal-3',
    price: 1.55,
    cid: '3000',
    clearPrice: 0.9,
  },
  {
    id: 'mock-deal-4',
    price: 1.55,
    cid: '4000',
    clearPrice: 0.9,
  },
];

const MOCK_CAMPAIGNS = [
  {
    id: '1000',
    adid: '1',
  },
  {
    id: '2000',
    adid: '2'
  },
  {
    id: '3000',
    adid: '3'
  },
  {
    id: '4000',
    adid: '4'
  }
];

const MOCK_ADS = [
  {
    id: '1',
    title: 'mock-ad-1',
    duration: 15,
    crid: '1',
  },
  {
    id: '2',
    title: 'mock-ad-2',
    duration: 15,
    crid: '2',
  },
  {
    id: '3',
    title: 'mock-ad-3',
    duration: 10,
    crid: '3',
  },
  {
    id: '4',
    title: 'mock-ad-4',
    duration: 15,
    crid: '4',
  }
]

const MOCK_CREATIVES = [
  {
    id: '1',
    mediaFile: "http://testcontent.eyevinn.technology/ads/stswe19-teaser-15sek.mp4",
    w: 1920, h: 1080,
  },
  {
    id: '2',
    mediaFile: "http://testcontent.eyevinn.technology/ads/apotea-15s.mp4",
    w: 1920, h: 1080,
  },
  {
    id: '3',
    mediaFile: "http://testcontent.eyevinn.technology/ads/grannyra-10s.mp4",
    w: 1920, h: 1080,
  },
  {
    id: '4',
    mediaFile: "http://testcontent.eyevinn.technology/ads/sff-15s.mp4",
    w: 1920, h: 1080,
  }
]

let agentId = 1;

class MockAgent {
  constructor(options) {
    this.bids = {};
    this.adServerUrl = 'http://localhost:8081'
    if (options) {
      if (options.adServerUrl) {
        this.adServerUrl = options.adServerUrl;
      }
    }
    this.agentId = agentId++;
  }

  type() {
    return 'MOCK';
  }

  name() {
    return 'mock-bid-agent-' + this.agentId;
  }

  getAdSystem() {
    return 'mock-ad-server';
  }

  getAdServerUrl() {
    return this.adServerUrl;
  }

  getAdByCampaignId(cid) {
    let campaign = MOCK_CAMPAIGNS.find(c => c.id === cid);
    return MOCK_ADS.find(ad => ad.id === campaign.adid);
  }

  getCreativeByAdId(adid) {
    let ad = MOCK_ADS.find(ad => ad.id === adid);
    let creative = MOCK_CREATIVES.find(cr => cr.id === ad.crid);
    return creative;
  }

  getBids(imps) {
    let bids = [];
    imps.forEach(imp => {
      let deal = MOCK_DEALS[Math.floor(Math.random() * MOCK_DEALS.length)];
      let campaign = MOCK_CAMPAIGNS.find(c => c.id === deal.cid);
      let ad = this.getAdByCampaignId(campaign.id);
      let creative = MOCK_CREATIVES.find(cr => cr.id === ad.crid);
      let bidId = uuidv1() + '_' + imp.id;
      let bid = {
        id: bidId,
        status: 1,
        deal: deal.id,
        clearPrice: deal.clearPrice,
        impid: imp.id,
        price: deal.price,
        adid: ad.id,
        cid: campaign.id, 
        crid: creative.id,
        nurl: `${this.getAdServerUrl()}/win?bid=${bidId}&agent=${this.name()}` + "&price=${AUCTION_PRICE}"
      };
      bids.push(bid);

      this.bids[bidId] = bid;
    });
    debug('getBids(): %O', this.bids);
    return bids;
  }

  getBidById(id) {
    debug('getBidById(): %O', this.bids);
    return this.bids[id];
  }
}

module.exports = MockAgent;