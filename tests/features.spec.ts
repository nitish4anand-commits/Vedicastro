import { test, expect } from "@playwright/test";

test.describe("Feature tests", () => {
  test("FEATURE-KUNDLI-001 Form submit and redirect flow", async ({ page }) => {
    await page.route("https://nominatim.openstreetmap.org/search**", async (route) => {
      const data = [
        {
          place_id: "1",
          display_name: "New Delhi, India",
          name: "New Delhi",
          lat: "28.6139",
          lon: "77.2090"
        }
      ];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data)
      });
    });

    await page.goto("/kundli");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Date of Birth").fill("1990-01-15");
    await page.getByLabel("Time of Birth").fill("12:00");

    const placeInput = page.getByPlaceholder("Start typing a city name...");
    await placeInput.fill("New Delhi");

    const suggestion = page.getByRole("button", { name: /New Delhi/i });
    await expect(suggestion).toBeVisible();
    await suggestion.click();

    await expect(page.getByText(/Location confirmed/i)).toBeVisible();

    await page.getByRole("button", { name: /Generate Kundli/i }).click();
    await page.waitForURL("**/kundli/processing");
    await expect(page.getByRole("heading", { name: /Your Kundli Dashboard/i })).toBeVisible({ timeout: 20000 });
  });

  test("FEATURE-CONTACT-001 Contact form submission", async ({ page }) => {
    await page.goto("/contact");
    await page.getByPlaceholder("Your name").fill("Test User");
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByPlaceholder("How can we help?").fill("Support Request");
    await page.getByPlaceholder("Tell us more about your inquiry...").fill("This is a test message with enough length.");
    await page.getByRole("button", { name: /Send Message/i }).click();
    await expect(page.getByText(/Message Sent!/i)).toBeVisible();
  });

  test("FEATURE-NUMEROLOGY-001 Calculate numerology profile", async ({ page }) => {
    await page.goto("/numerology");
    await page.getByPlaceholder("Enter your full name").fill("Test User");
    await page.locator("input[type=\"date\"]").fill("1990-01-15");
    await page.getByRole("button", { name: /Calculate My Numbers/i }).click();
    await expect(page.getByRole("heading", { name: /Your Numerology Profile/i })).toBeVisible();
  });

  test("FEATURE-MATCHING-001 Show compatibility results", async ({ page }) => {
    await page.goto("/matching");
    await page.getByRole("button", { name: /Check Compatibility/i }).click();
    await expect(page.getByRole("button", { name: /Check Another Match/i })).toBeVisible({ timeout: 15000 });
  });

  test("FEATURE-HOROSCOPE-001 Select sign and view details", async ({ page }) => {
    await page.goto("/horoscope");
    await page.locator("text=Aries").first().click({ force: true });
    await expect(page.getByRole("button", { name: /Back to All Signs/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("tab", { name: /General/i })).toBeVisible();
  });

  test("FEATURE-RASHIFAL-001 Toggle yearly view", async ({ page }) => {
    await page.goto("/rashifal");
    const yearlyTab = page.getByRole("tab", { name: /Yearly/i });
    await yearlyTab.click();
    await expect(yearlyTab).toHaveAttribute("data-state", "active");
  });

  test("FEATURE-PREMIUM-001 Toggle billing cycle pricing", async ({ page }) => {
    await page.goto("/premium");
    await page.getByRole("tab", { name: /Monthly/i }).click();
    await expect(page.getByText(/299/)).toBeVisible();
    await page.getByRole("tab", { name: /Yearly/i }).click();
    await expect(page.getByText(/2499/)).toBeVisible();
  });

  test("FEATURE-AUTH-SIGNUP-001 Password mismatch validation", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.getByPlaceholder("Your name").fill("Test User");
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    const passwordInputs = page.locator("input[type=\"password\"]");
    await passwordInputs.nth(0).fill("password123");
    await passwordInputs.nth(1).fill("password456");
    await page.getByRole("button", { name: /Create Account/i }).click();
    await expect(page.getByText(/Passwords don't match/i)).toBeVisible();
  });

  test("FEATURE-AUTH-LOGIN-001 Basic validation", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByPlaceholder("your@email.com").fill("user@example.com");
    await page.locator("input[type=\"password\"]").fill("short");
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(page.getByText(/Password must be at least 8 characters/i)).toBeVisible();
  });

  test("FEATURE-TRANSITS-001 Upcoming transits tab", async ({ page }) => {
    await page.goto("/transits");
    const upcomingTab = page.getByRole("tab", { name: /Upcoming/i });
    await upcomingTab.click();
    await expect(upcomingTab).toHaveAttribute("data-state", "active");
    const activePanel = page.locator('[role="tabpanel"][data-state="active"]');
    await expect(activePanel.getByText(/Transit/i)).toBeVisible({ timeout: 15000 });
  });
});
