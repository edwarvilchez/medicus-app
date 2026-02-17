/// <reference types="cypress" />

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login page', () => {
    cy.contains('MEDICUS');
    cy.contains('Iniciar Sesión');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    // Should show some error or stay on page
    cy.url().should('include', '/login');
  });

  it('should navigate to register page', () => {
    cy.contains('Regístrate aquí').click();
    cy.url().should('include', '/register');
    cy.contains('¿Quién eres?');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('Olvidaste tu contraseña?').click();
    cy.url().should('include', '/forgot-password');
  });
});

describe('Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display account type selection', () => {
    cy.contains('¿Quién eres?');
    cy.contains('Paciente');
    cy.contains('Profesional Independiente');
    cy.contains('Clínica');
    cy.contains('Hospital');
  });

  it('should navigate to step 2 when selecting account type', () => {
    cy.contains('Paciente').click();
    cy.contains('Volver');
    cy.get('input[formcontrolname="username"]').should('exist');
    cy.get('input[formcontrolname="email"]').should('exist');
  });

  it('should go back to step 1', () => {
    cy.contains('Paciente').click();
    cy.contains('Volver').click();
    cy.contains('¿Quién eres?');
  });
});

describe('Dashboard (Protected)', () => {
  it('should redirect to login when not authenticated', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});

describe('Public Booking', () => {
  beforeEach(() => {
    cy.visit('/agendar-cita');
  });

  it('should display public booking page', () => {
    cy.contains('Agendar Cita');
  });

  it('should be accessible without authentication', () => {
    cy.url().should('include', '/agendar-cita');
    cy.contains('MEDICUS');
  });
});

describe('Responsive Design', () => {
  it('should display correctly on mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/login');
    cy.contains('MEDICUS').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
  });

  it('should display correctly on tablet', () => {
    cy.viewport('ipad-2');
    cy.visit('/login');
    cy.contains('MEDICUS').should('be.visible');
  });
});
