const path = require('path');
const { describe, it, expect } = require('vitest');
const { parseCsv, parseXlsx, validateRecord } = require('../src/services/importService');

describe('importService', () => {
  it('parses CSV file correctly', async () => {
    const file = path.resolve(__dirname, 'fixtures', 'sample.csv');
    const records = await parseCsv(file);
    expect(records.length).toBeGreaterThan(0);
    expect(records[0]).toHaveProperty('username');
    expect(records[0]).toHaveProperty('email');
  });

  it('parses XLSX file correctly', async () => {
    const file = path.resolve(__dirname, 'fixtures', 'sample.xlsx');
    const records = await parseXlsx(file);
    expect(records.length).toBeGreaterThan(0);
    expect(records[0]).toHaveProperty('username');
    expect(records[0]).toHaveProperty('email');
  });

  it('validates records', () => {
    const errs = validateRecord('patients', { username: '', email: 'bad' });
    expect(errs.length).toBeGreaterThan(0);
  });
});
