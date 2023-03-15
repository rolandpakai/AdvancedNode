const mongoose = require('mongoose');
const redis = require('redis');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || 'default');

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = Object.assign({}, this.Query, {
    collection: this.mongooseCollection.name
  });
 
  await client.connect().catch(console.error);
  const cacheValue = await client.hGet(this.hashKey, JSON.stringify(key));

  if (cacheValue) {
    console.log('CACHE', key);
    const doc = JSON.parse(cacheValue);

    await client.disconnect();

    return Array.isArray(doc) 
      ? doc.map(d => new this.model(d)) 
      : new this.model(doc);
  } 

  const result = await exec.apply(this, arguments);

  await client.hSet(
    this.hashKey,
    JSON.stringify(key), 
    JSON.stringify(result),
    'EX',
    10
  );

  await client.disconnect();

  return result;
};

module.exports = {
  async clearHash(hashKey) {
    await client.connect().catch(console.error);
    await client.del(JSON.stringify(hashKey));
    await client.disconnect();
  }
};
