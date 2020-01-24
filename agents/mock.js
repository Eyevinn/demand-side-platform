const debug = require('debug')('agent-mock');
const uuidv1 = require('uuid/v1');

const MOCK_DEALS = [
  {
    id: 'mock-deal-1',
    price: 2.05,
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
  {
    id: 'mock-deal-5',
    price: 1.85,
    cid: '5000',
    clearPrice: 0.9,
  },
  {
    id: 'mock-deal-6',
    price: 1.55,
    cid: '6000',
    clearPrice: 0.9,
  },
  {
    id: 'mock-deal-7',
    price: 1.95,
    cid: '7000',
    clearPrice: 0.9,
  },
  {
    id: 'mock-deal-8',
    price: 1.25,
    cid: '8000',
    clearPrice: 0.9,
  },
  {
    id: 'mock-deal-9',
    price: 1.08,
    cid: '9000',
    clearPrice: 0.9,
  }
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
  },
  {
    id: '5000',
    adid: '5'
  },
  {
    id: '6000',
    adid: '6'
  },
  {
    id: '7000',
    adid: '7'
  },
  {
    id: '8000',
    adid: '8'
  },
  {
    id: '9000',
    adid: '9'
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
  },
  {
    id: '5',
    title: 'mock-ad-5',
    duration: 10,
    crid: '5',
  },
  {
    id: '6',
    title: 'mock-ad-6',
    duration: 15,
    crid: '6',
  },
  {
    id: '7',
    title: 'mock-ad-7',
    duration: 15,
    crid: '7',
  },
  {
    id: '8',
    title: 'mock-ad-8',
    duration: 15,
    crid: '8',
  },
  {
    id: '9',
    title: 'mock-ad-9',
    duration: 20,
    crid: '9',
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
  },
  {
    id: '5',
    mediaFile: "http://testcontent.eyevinn.technology/ads/alvedon-10s.mp4",
    w: 1920, h: 1080,
  },
  {
    id: '6',
    mediaFile: "http://testcontent.eyevinn.technology/ads/bromwel-15s.mp4",
    w: 1920, h: 1080,
  },
  {
    id: '7',
    mediaFile: "http://testcontent.eyevinn.technology/ads/mio-15s.mp4",
    w: 1920, h: 1080,
  },
  {
    id: '8',
    mediaFile: "http://testcontent.eyevinn.technology/ads/volvo-15s.mp4",
    w: 1920, h: 1080,
  },
  {
    id: '9',
    mediaFile: "http://testcontent.eyevinn.technology/ads/willys-20s.mp4",
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
        debug('Using ad server url: ' + options.adServerUrl);
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