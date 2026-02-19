const { Organization } = require('./src/models');

async function checkStatus() {
  try {
    const orgs = await Organization.findAll();
    console.table(orgs.map(o => ({
      id: o.id,
      name: o.name,
      status: o.subscriptionStatus,
      trialEnds: o.trialEndsAt,
      type: o.type
    })));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

checkStatus();
