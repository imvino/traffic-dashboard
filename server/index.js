const fastify = require('fastify')({ logger: false });
const { process, mvMnt, tF } = require('./controller');
const cors = require('@fastify/cors');

fastify.register(cors, {
  origin: '*',
  methods: ['GET'],
});

fastify.get('/:movement/:timeFrame/:from/:to', (request, reply) => {
  let { movement, timeFrame, from, to } = request.params;

  if (Object.keys(tF[0]).includes(timeFrame) && mvMnt.includes(movement)) {
    try {
      reply.send(process(movement, timeFrame, from, to));
    } catch (error) {
      console.error(error);
    }
  } else {
    reply.send({ error: 'invalid url' });
  }
});

fastify.listen({ port: 3001 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
