const { User, Organization } = require('../models');

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Skip for PATIENT role as they don't have subscriptions usually
    if (req.user.role === 'PATIENT') {
      return next();
    }

    const user = await User.findByPk(req.user.id, {
      include: [Organization]
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // If user is not part of an organization (e.g. superadmin not linked), skip
    if (!user.Organization) {
      return next();
    }

    const org = user.Organization;
    const now = new Date();

    // Check Status
    if (org.subscriptionStatus === 'CANCELLED') {
      return res.status(403).json({ 
        message: 'Su suscripción ha sido cancelada. Contacte a soporte.',
        code: 'SUBSCRIPTION_CANCELLED'
      });
    }

    if (org.subscriptionStatus === 'TRIAL') {
      if (org.trialEndsAt && new Date(org.trialEndsAt) < now) {
        return res.status(403).json({ 
          message: 'Su periodo de prueba de 7 días ha finalizado. Por favor actualice su plan.',
          code: 'TRIAL_EXPIRED',
          trialEnded: true
        });
      }
    }

    if (org.subscriptionStatus === 'PAST_DUE') {
      return res.status(403).json({ 
        message: 'Su suscripción está vencida.',
        code: 'SUBSCRIPTION_PAST_DUE'
      });
    }

    // Attach org to request for easy access in controllers
    req.organization = org;
    next();

  } catch (error) {
    console.error('Subscription Middleware Error:', error);
    res.status(500).json({ message: 'Error verificando estado de la cuenta' });
  }
};
