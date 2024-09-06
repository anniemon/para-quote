import fp from 'fastify-plugin';

async function dummyPlugin() {
  // XXX: dummy for prevent initialization error
  return;
}

export default fp(dummyPlugin, {
  name: 'dummyPlugin',
});
