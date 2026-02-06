import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Arturo Soto SA - Patatas y Cebollas');
  });

  test('should display cover image', async ({ page }) => {
    const coverImage = page.locator('header img.cover');
    await expect(coverImage).toBeVisible();
    await expect(coverImage).toHaveAttribute('src', '/portada.jpg');
    await expect(coverImage).toHaveAttribute('alt', 'Arturo Soto SA');
  });

  test('should display all main sections', async ({ page }) => {
    // Check that all sections are present
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('#map')).toBeVisible();
    await expect(page.locator('#subsidies')).toBeVisible();
  });

  test('should display about section with correct content', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await expect(aboutSection.locator('h2')).toHaveText('Sobre Nosotros');
    await expect(aboutSection).toContainText('Arturo Soto SA es una empresa líder');
    await expect(aboutSection).toContainText('patatas y cebollas');
  });

  test('should display contact information', async ({ page }) => {
    const contactSection = page.locator('#contact');

    // Check section heading
    await expect(contactSection.locator('h2')).toHaveText('Contacto');

    // Check address
    await expect(contactSection).toContainText('Vía Camino, 51');
    await expect(contactSection).toContainText('46229 Picassent, Valencia');

    // Check phone
    await expect(contactSection).toContainText('961 27 28 55');

    // Check business hours
    await expect(contactSection.locator('h3')).toHaveText('Horario Comercial');
    await expect(contactSection).toContainText('Lunes a Viernes');
    await expect(contactSection).toContainText('7:00–14:00');
    await expect(contactSection).toContainText('16:00–18:00');
  });

  test('should display Google Maps embed', async ({ page }) => {
    const mapSection = page.locator('#map');
    await expect(mapSection.locator('h2')).toHaveText('Ubicación');

    const iframe = mapSection.locator('iframe');
    await expect(iframe).toBeVisible();

    const src = await iframe.getAttribute('src');
    expect(src).toContain('google.com/maps/embed');
  });

  test('should display subsidy image', async ({ page }) => {
    const subsidiesSection = page.locator('#subsidies');
    await expect(subsidiesSection.locator('h2')).toHaveText('Subvenciones');

    const subsidyImage = subsidiesSection.locator('img.subsidy');
    await expect(subsidyImage).toBeVisible();
    await expect(subsidyImage).toHaveAttribute('src', '/avalem.webp');
  });

  test('should display footer with copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('© 2024 Arturo Soto SA');
    await expect(footer).toContainText('Todos los derechos reservados');
  });

  test('should have correct page structure and semantic HTML', async ({ page }) => {
    // Check header
    await expect(page.locator('header')).toBeVisible();

    // Check main
    await expect(page.locator('main')).toBeVisible();

    // Check all sections use proper heading hierarchy
    const h2Headings = page.locator('h2');
    await expect(h2Headings).toHaveCount(4);

    const h3Headings = page.locator('h3');
    await expect(h3Headings).toHaveCount(1);
  });

  test('should load all images successfully', async ({ page }) => {
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    // Verify each image loads successfully
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();

      // Check if image is actually loaded (naturalWidth > 0)
      const isLoaded = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && el.naturalWidth > 0;
      });
      expect(isLoaded).toBe(true);
    }
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    // Check that main content is visible on mobile
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check that images scale properly
    const coverImage = page.locator('header img.cover');
    const imageWidth = await coverImage.evaluate((el: HTMLImageElement) => {
      return el.getBoundingClientRect().width;
    });

    const viewportWidth = page.viewportSize()?.width || 0;
    // Image should not exceed viewport width
    expect(imageWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('should have proper color scheme applied', async ({ page }) => {
    const body = page.locator('body');

    // Check computed styles
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const color = await body.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Should have background and text colors set
    expect(bgColor).toBeTruthy();
    expect(color).toBeTruthy();
    expect(bgColor).not.toBe(color); // Ensure contrast
  });

  test('should have Google Maps iframe with proper attributes', async ({ page }) => {
    const iframe = page.locator('#map iframe');

    await expect(iframe).toHaveAttribute('width', '100%');
    await expect(iframe).toHaveAttribute('height', '450');
    await expect(iframe).toHaveAttribute('loading', 'lazy');

    const allowfullscreen = await iframe.getAttribute('allowfullscreen');
    expect(allowfullscreen).not.toBeNull();
  });

  test('should pass basic accessibility checks', async ({ page }) => {
    // Check that html has lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('es');

    // Check that all images have alt text
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);

    // Check that page has a main landmark
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Page Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    expect(consoleErrors).toHaveLength(0);
  });

  test('should not have failed network requests', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedRequests).toHaveLength(0);
  });
});
