import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('mock products data', () => {
  it('loads sample-products.json and has expected shape', () => {
    const p = path.join(process.cwd(), 'data', 'sample-products.json');
    const raw = fs.readFileSync(p, 'utf-8');
    const data = JSON.parse(raw);

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    const first = data[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('variants');
    expect(Array.isArray(first.variants)).toBe(true);

    // there should be at least one low-stock variant (<5)
    const anyLow = data.some((p: any) => p.variants.some((v: any) => v.stock < 5));
    expect(anyLow).toBe(true);
  });
});
