import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Build Tests', () => {
  const distDir = join(process.cwd(), 'dist');
  const indexPath = join(distDir, 'index.html');

  it('should successfully build the project', () => {
    expect(existsSync(distDir)).toBe(true);
  });

  it('should generate index.html', () => {
    expect(existsSync(indexPath)).toBe(true);
  });

  it('should copy public assets to dist', () => {
    const faviconPath = join(distDir, 'favicon.ico');
    const portadaPath = join(distDir, 'portada.jpg');
    const avalemPath = join(distDir, 'avalem.webp');

    expect(existsSync(faviconPath)).toBe(true);
    expect(existsSync(portadaPath)).toBe(true);
    expect(existsSync(avalemPath)).toBe(true);
  });

  it('should generate valid HTML with proper structure', () => {
    const html = readFileSync(indexPath, 'utf-8');

    // Check for essential HTML structure (with potential attributes)
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toMatch(/<html[^>]*>/);
    expect(html).toMatch(/<head[^>]*>/);
    expect(html).toMatch(/<body[^>]*>/);
    expect(html).toContain('</html>');
  });

  it('should include meta tags', () => {
    const html = readFileSync(indexPath, 'utf-8');

    expect(html).toContain('charset="utf-8"');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('name="generator"');
  });

  it('should include the page title', () => {
    const html = readFileSync(indexPath, 'utf-8');

    expect(html).toContain('<title>Arturo Soto SA - Patatas y Cebollas</title>');
  });

  it('should minify HTML in production build', () => {
    const html = readFileSync(indexPath, 'utf-8');

    // Production builds should have less whitespace
    const unnecessaryWhitespace = html.match(/\n\s+\n/g);
    expect(unnecessaryWhitespace).toBeNull();
  });
});
