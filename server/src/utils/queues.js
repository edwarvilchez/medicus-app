const logger = require('./logger');

/**
 * MOCKED Queues - Redis/Bull disabled
 */

class MockQueue {
  constructor(name) {
    this.name = name;
    logger.info(`Mock Queue [${name}] initialized (Redis disabled)`);
  }

  async add(name, data, options) {
    logger.info({ name, queue: this.name }, 'Mock Queue: Job added (not processed)');
    return { id: 'mock-id' };
  }

  process(name, callback) {
    // Do nothing - jobs won't be added to this mock
  }

  on(event, callback) {
    // Do nothing
  }
}

const emailQueue = new MockQueue('emails');
const notificationQueue = new MockQueue('notifications');
const reportQueue = new MockQueue('reports');

module.exports = {
  emailQueue,
  notificationQueue,
  reportQueue
};
