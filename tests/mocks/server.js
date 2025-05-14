import nock from 'nock';

nock('https://api.mapserv.utah.gov')
  .persist()
  .get(/\/api\/v1\/geocode\/.*/)
  .query(true)
  .delay(1100)
  .reply(200, {
    result: {
      location: { x: 301681.8180985777, y: 4168674.213765412 },
      score: 100,
      locator: 'Centerlines.StatewideRoads',
      matchAddress: '9083 W HIGHWAY 56, Cedar City',
      inputAddress: '9083 W Highway 56, 84720',
      standardizedAddress: '9083 west highway 56',
      addressGrid: 'Cedar City',
    },
    status: 200,
  });
