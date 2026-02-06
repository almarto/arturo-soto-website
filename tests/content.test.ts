import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Content Tests', () => {
  let html: string;

  beforeAll(() => {
    const indexPath = join(process.cwd(), 'dist', 'index.html');
    html = readFileSync(indexPath, 'utf-8');
  });

  describe('Header Section', () => {
    it('should contain the cover image', () => {
      expect(html).toContain('<header');
      expect(html).toContain('portada.jpg');
      expect(html).toContain('alt="Arturo Soto SA"');
    });
  });

  describe('About Section', () => {
    it('should contain the about section', () => {
      expect(html).toContain('id="about"');
      expect(html).toContain('Sobre Nosotros');
    });

    it('should contain company description', () => {
      expect(html).toContain('Arturo Soto SA es una empresa líder');
      expect(html).toContain('patatas y cebollas');
    });
  });

  describe('Contact Section', () => {
    it('should contain contact information', () => {
      expect(html).toContain('id="contact"');
      expect(html).toContain('Contacto');
    });

    it('should contain the address', () => {
      expect(html).toContain('Vía Camino, 51');
      expect(html).toContain('46229 Picassent, Valencia');
    });

    it('should contain the phone number', () => {
      expect(html).toContain('961 27 28 55');
    });

    it('should contain business hours', () => {
      expect(html).toContain('Horario Comercial');
      expect(html).toContain('Lunes a Viernes');
      expect(html).toContain('7:00');
    });
  });

  describe('Map Section', () => {
    it('should contain embedded Google Maps iframe', () => {
      expect(html).toContain('id="map"');
      expect(html).toContain('Ubicación');
      expect(html).toContain('<iframe');
      expect(html).toContain('google.com/maps/embed');
    });

    it('should have proper iframe attributes', () => {
      expect(html).toContain('width="100%"');
      expect(html).toContain('height="450"');
      expect(html).toContain('loading="lazy"');
    });
  });

  describe('Subsidies Section', () => {
    it('should contain subsidies section', () => {
      expect(html).toContain('id="subsidies"');
      expect(html).toContain('Subvenciones');
    });

    it('should contain subsidy image', () => {
      expect(html).toContain('avalem.webp');
      expect(html).toContain('Programa de fomento');
    });
  });

  describe('Footer Section', () => {
    it('should contain footer with copyright', () => {
      expect(html).toContain('<footer');
      // Copyright symbol can be encoded as &copy; or ©
      expect(html).toMatch(/(&copy;|©)\s*2024\s*Arturo Soto SA/);
      expect(html).toContain('Todos los derechos reservados');
    });
  });

  describe('Styling', () => {
    it('should contain inline styles', () => {
      expect(html).toContain('--primary-color');
      expect(html).toContain('--secondary-color');
      expect(html).toContain('--text-color');
      expect(html).toContain('--background-color');
    });

    it('should contain responsive media queries', () => {
      expect(html).toContain('@media');
      expect(html).toContain('max-width: 600px');
    });
  });

  describe('Accessibility', () => {
    it('should have lang attribute on html tag', () => {
      expect(html).toMatch(/<html[^>]*lang="es"/);
    });

    it('should have alt attributes on images', () => {
      // Cover image
      expect(html).toContain('alt="Arturo Soto SA"');
      // Subsidy image has multiline alt text
      expect(html).toContain('alt="Programa de fomento');
    });

    it('should have proper heading hierarchy', () => {
      // H2 for main sections (with potential Astro attributes)
      expect(html).toMatch(/<h2[^>]*>Sobre Nosotros<\/h2>/);
      expect(html).toMatch(/<h2[^>]*>Contacto<\/h2>/);
      // H3 for subsections
      expect(html).toMatch(/<h3[^>]*>Horario Comercial<\/h3>/);
    });
  });

  describe('SEO', () => {
    it('should have meta charset', () => {
      expect(html).toMatch(/<meta[^>]*charset="utf-8"/);
    });

    it('should have viewport meta tag', () => {
      expect(html).toMatch(/<meta[^>]*name="viewport"/);
    });

    it('should have descriptive title', () => {
      expect(html).toContain('Arturo Soto SA - Patatas y Cebollas');
    });

    it('should have favicon', () => {
      expect(html).toContain('favicon.ico');
    });
  });
});
