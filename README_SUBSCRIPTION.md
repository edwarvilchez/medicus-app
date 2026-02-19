# Subscription System & Client Area

This document outlines the new subscription and payment features added to Medicus.

## Features

1.  **Pricing Plans Page**: Adapted from Nominus, available at `/subscription`.
    - Displays 4 plans: Consultorio, Clínica, Hospital, Enterprise.
    - Responsive pricing based on billing cycle (Monthly, Quarterly, Semester, Annual).
    - "Pay" button initiates the subscription payment flow.

2.  **Client Area / Payment Flow**:
    - Users can select a plan and payment method (Transfer, Zelle, etc.).
    - Payments are created with status `Pending` and type `SUBSCRIPTION`.
    - Payments are linked to the user's Organization.

3.  **Automatic Upgrades**:
    - Admins (or Organization Owners) can view these payments in the `Payments` module.
    - When an Admin marks a subscription payment as `Paid` (Collect/Cobrar), the system **automatically upgrades** the Organization's subscription status to `ACTIVE` and extends the `trialEndsAt` date based on the chosen billing cycle.

## How to Test

1.  **Login as an Organization Owner**:
    - Use `staff.mora@medicus.com` (Clinic, Trial) or register a new user.
    - Navigate to "Planes y Precios" in the sidebar.
    - Select a plan (e.g., Hospital, Anual).
    - Click "Elegir Plan" and simulate a payment (enter random reference).
    - Submit. You should see a success message.

2.  **Approve Payment (As Admin)**:
    - Login as `admin@medicus.com` (Password: `Med1cus!2026`).
    - Navigate to "Pagos" (`/payments`).
    - You will see the new payment. It might show organization name instead of patient name.
    - Click the "Cobrar" (Wallet) icon to approve it.
    - Confirm the action.

3.  **Verify Upgrade**:
    - The organization associated with the payment should now be `ACTIVE` and have an extended expiration date.
    - (You can verify this in the database or by logging in as the user and checking their dashboard/profile).

## database Changes

- Added `paymentType`, `billingCycle`, `planType`, `organizationId` to `Payments` table.
- Run `npm run reset-db` to apply schema changes and seed test data.
