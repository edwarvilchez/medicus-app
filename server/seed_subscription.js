const { Organization, Payment } = require('./src/models');

async function seedSubscription() {
  try {
    // 1. Find a suitable organization (e.g. 'Clinic')
    const org = await Organization.findOne({ where: { type: 'CLINIC' } });
    if (!org) {
      console.log('No CLINIC organization found. Trying to find ANY organization...');
    }
    
    const targetOrg = org || await Organization.findOne();

    if (!targetOrg) {
      console.error('No organizations found in database. Cannot seed payment.');
      return;
    }

    console.log(`Creating subscription payment for Organization: ${targetOrg.name} (ID: ${targetOrg.id})`);
    console.log(`Current Status: ${targetOrg.subscriptionStatus}, Trial Ends: ${targetOrg.trialEndsAt}`);

    // 2. Create Payment
    const payment = await Payment.create({
      amount: 49.00,
      currency: 'USD',
      method: 'Transferencia',
      status: 'Pending',
      reference: 'REF-SEED-12345',
      concept: 'Suscripción Mensual - Seeded',
      paymentType: 'SUBSCRIPTION',
      billingCycle: 'Mensual',
      planType: 'CLINIC',
      organizationId: targetOrg.id,
      patientId: null,
      appointmentId: null
    });

    console.log('Payment created successfully!');
    console.log(JSON.stringify(payment.toJSON(), null, 2));
    
  } catch (error) {
    console.error('Error creating seed payment:', error);
  } finally {
    process.exit();
  }
}

seedSubscription();
