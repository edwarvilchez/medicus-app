const { Role, User, Patient, Doctor, Nurse, Staff, Specialty, Department, Organization } = require('../models');

/**
 * Seed test users for ALL environments (dev + production).
 * Runs automatically on every server start.
 *
 * Password convention:
 *   - All seed accounts use a single shared password so QA can
 *     switch roles quickly: process.env.TEST_PASSWORD || 'Med1cus!2026'
 *
 * Coverage matrix (9 users):
 *   SUPERADMIN  × HOSPITAL      → admin (owns the test org)
 *   DOCTOR      × PROFESSIONAL  → dr.cardenas (independent, no org)
 *   DOCTOR      × HOSPITAL      → dr.luna (inside org, team member)
 *   NURSE       × HOSPITAL      → enf.rios (inside org)
 *   RECEPTIONIST× HOSPITAL      → recep.vega (inside org)
 *   ADMINISTRATIVE × CLINIC     → staff.mora (inside org)
 *   PATIENT     × PATIENT       → pac.torres (with full patient profile)
 *   PATIENT     × PATIENT       → pac.rivas (second patient for multi-patient tests)
 *   DOCTOR      × PROFESSIONAL  → dr.beta (production/beta tester, independent)
 */

const SEED_PASSWORD = process.env.TEST_PASSWORD || 'Med1cus!2026';

const seedTestData = async () => {
  try {
    // ── 1. Load all roles ──────────────────────────────────────────────
    const roles = {};
    const roleNames = ['SUPERADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMINISTRATIVE', 'PATIENT'];

    for (const name of roleNames) {
      roles[name] = await Role.findOne({ where: { name } });
      if (!roles[name]) {
        console.warn(`⚠ Role ${name} not found — skipping related users.`);
      }
    }

    // ── 2. Upsert helper ──────────────────────────────────────────────
    const upsertUser = async (data) => {
      if (!roles[data.role]) return null;

      const [user, created] = await User.findOrCreate({
        where: { email: data.email },
        defaults: {
          username: data.username,
          email: data.email,
          password: SEED_PASSWORD,
          firstName: data.firstName,
          lastName: data.lastName,
          businessName: data.businessName || null,
          accountType: data.accountType || 'PATIENT',
          roleId: roles[data.role].id,
          organizationId: data.organizationId || null,
          gender: data.gender || null,
        },
      });

      if (!created) {
        await user.update({ password: SEED_PASSWORD });
      }

      console.log(`  ${created ? '✔ Created' : '↻ Updated'} ${data.role.padEnd(14)} ${data.email}`);
      return user;
    };

    // ── 3. Create SUPERADMIN + Organization ────────────────────────────
    const admin = await upsertUser({
      username: 'admin',
      email: 'admin@medicus.com',
      firstName: 'Admin',
      lastName: 'Medicus',
      role: 'SUPERADMIN',
      accountType: 'HOSPITAL',
      businessName: 'Hospital Central Medicus',
    });

    let org = null;
    if (admin) {
      [org] = await Organization.findOrCreate({
        where: { name: 'Hospital Central Medicus' },
        defaults: {
          name: 'Hospital Central Medicus',
          type: 'HOSPITAL',
          ownerId: admin.id,
        },
      });
      // Assign admin to org
      if (!admin.organizationId) {
        await admin.update({ organizationId: org.id });
      }
    }

    // ── 4. Users definition ────────────────────────────────────────────
    const users = [
      // Independent doctor (no org) — tests solo-professional flow
      {
        username: 'dr.cardenas',
        email: 'dr.cardenas@medicus.com',
        firstName: 'Andrés',
        lastName: 'Cárdenas',
        role: 'DOCTOR',
        accountType: 'PROFESSIONAL',
        profile: { type: 'DOCTOR', license: 'MED-1001', phone: '+58412-1001001', specialty: 'Cardiología' },
      },
      // Org doctor — tests team-member flow
      {
        username: 'dr.luna',
        email: 'dr.luna@medicus.com',
        firstName: 'Valeria',
        lastName: 'Luna',
        role: 'DOCTOR',
        accountType: 'HOSPITAL',
        organizationId: org?.id,
        profile: { type: 'DOCTOR', license: 'MED-1002', phone: '+58412-1002002', specialty: 'Pediatría' },
      },
      // Nurse inside org
      {
        username: 'enf.rios',
        email: 'enf.rios@medicus.com',
        firstName: 'Carolina',
        lastName: 'Ríos',
        role: 'NURSE',
        accountType: 'HOSPITAL',
        organizationId: org?.id,
        profile: { type: 'NURSE', license: 'ENF-2001', phone: '+58412-2001001', shift: 'Morning' },
      },
      // Receptionist inside org
      {
        username: 'recep.vega',
        email: 'recep.vega@medicus.com',
        firstName: 'Isabel',
        lastName: 'Vega',
        role: 'RECEPTIONIST',
        accountType: 'HOSPITAL',
        organizationId: org?.id,
        profile: { type: 'STAFF', employeeId: 'EMP-RECEP-01', position: 'RECEPTIONIST' },
      },
      // Administrative (clinic type) inside org
      {
        username: 'staff.mora',
        email: 'staff.mora@medicus.com',
        firstName: 'Ricardo',
        lastName: 'Mora',
        role: 'ADMINISTRATIVE',
        accountType: 'CLINIC',
        organizationId: org?.id,
        businessName: 'Clínica Salud Integral',
        profile: { type: 'STAFF', employeeId: 'EMP-ADM-01', position: 'ADMINISTRATIVE' },
      },
      // Patient 1 — full profile
      {
        username: 'pac.torres',
        email: 'pac.torres@email.com',
        firstName: 'Miguel',
        lastName: 'Torres',
        role: 'PATIENT',
        accountType: 'PATIENT',
        gender: 'Male',
        profile: { type: 'PATIENT', documentId: 'V-12345678', phone: '+58424-1234567', gender: 'Male' },
      },
      // Patient 2 — for multi-patient / appointment tests
      {
        username: 'pac.rivas',
        email: 'pac.rivas@email.com',
        firstName: 'Lucía',
        lastName: 'Rivas',
        role: 'PATIENT',
        accountType: 'PATIENT',
        gender: 'Female',
        profile: { type: 'PATIENT', documentId: 'V-87654321', phone: '+58424-7654321', gender: 'Female' },
      },
      // Beta/production tester — independent doctor for prod QA
      {
        username: 'dr.beta',
        email: 'beta@medicus.com',
        firstName: 'Beta',
        lastName: 'Tester',
        role: 'DOCTOR',
        accountType: 'PROFESSIONAL',
        profile: { type: 'DOCTOR', license: 'BETA-001', phone: '+58412-0000000', specialty: 'Medicina General' },
      },
    ];

    // ── 5. Create users + profiles ─────────────────────────────────────
    for (const data of users) {
      try {
        const user = await upsertUser(data);
        if (!user || !data.profile) continue;

        const p = data.profile;

        if (p.type === 'DOCTOR') {
          const [dept] = await Department.findOrCreate({
            where: { name: p.specialty },
            defaults: { name: p.specialty },
          });
          const [spec] = await Specialty.findOrCreate({
            where: { name: p.specialty, departmentId: dept.id },
            defaults: { name: p.specialty, departmentId: dept.id },
          });
          await Doctor.findOrCreate({
            where: { userId: user.id },
            defaults: { userId: user.id, licenseNumber: p.license, phone: p.phone, specialtyId: spec.id },
          });
        }

        if (p.type === 'NURSE') {
          await Nurse.findOrCreate({
            where: { userId: user.id },
            defaults: { userId: user.id, licenseNumber: p.license, phone: p.phone, shift: p.shift || 'Morning' },
          });
        }

        if (p.type === 'STAFF') {
          await Staff.findOrCreate({
            where: { userId: user.id },
            defaults: { userId: user.id, employeeId: p.employeeId, position: p.position },
          });
        }

        if (p.type === 'PATIENT') {
          await Patient.findOrCreate({
            where: { userId: user.id },
            defaults: { userId: user.id, documentId: p.documentId, phone: p.phone, gender: p.gender },
          });
        }
      } catch (err) {
        console.error(`  ❌ Failed to seed user ${data.email}:`, err.message);
      }
    }

    console.log(`\n✅ Seed complete — all accounts use password: ${SEED_PASSWORD}\n`);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  }
};

module.exports = seedTestData;
