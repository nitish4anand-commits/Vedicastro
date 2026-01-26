import { test, expect } from "@playwright/test";

const pageCases = [
  { id: "PAGE-HOME-001", name: "Home", path: "/", heading: /Cosmic Blueprint/i },
  { id: "PAGE-ABOUT-001", name: "About", path: "/about", heading: /Ancient Wisdom/i },
  { id: "PAGE-BLOG-001", name: "Blog", path: "/blog", heading: /VedicAstro Blog/i },
  { id: "PAGE-CONTACT-001", name: "Contact", path: "/contact", heading: /Hear From You/i },
  { id: "PAGE-FAQ-001", name: "FAQ", path: "/faq", heading: /Frequently Asked Questions/i },
  { id: "PAGE-TERMS-001", name: "Terms", path: "/terms", heading: /Terms of Service/i },
  { id: "PAGE-PRIVACY-001", name: "Privacy", path: "/privacy", heading: /Privacy Policy/i },
  { id: "PAGE-PREMIUM-001", name: "Premium", path: "/premium", heading: /Complete Cosmic Potential/i },
  { id: "PAGE-AUTH-LOGIN-001", name: "Login", path: "/auth/login", heading: /Welcome Back/i },
  { id: "PAGE-AUTH-SIGNUP-001", name: "Signup", path: "/auth/signup", heading: /Create Your Account/i },
  { id: "PAGE-KUNDLI-001", name: "Kundli", path: "/kundli", heading: /Generate Your Kundli/i },
  { id: "PAGE-KUNDLI-PROCESS-001", name: "Kundli Processing", path: "/kundli/processing", text: /prepare your personalized kundli/i },
  { id: "PAGE-KUNDLI-DASH-001", name: "Kundli Dashboard", path: "/kundli/dashboard", heading: /Your Kundli Dashboard/i },
  { id: "PAGE-MATCHING-001", name: "Matching", path: "/matching", heading: /Kundli Matching/i },
  { id: "PAGE-HOROSCOPE-001", name: "Horoscope", path: "/horoscope", heading: /Daily Horoscope/i },
  { id: "PAGE-RASHIFAL-001", name: "Rashifal", path: "/rashifal", heading: /Monthly & Yearly Horoscope/i },
  { id: "PAGE-PANCHANG-001", name: "Panchang", path: "/panchang", heading: /Panchang/i },
  { id: "PAGE-DASHA-001", name: "Dasha", path: "/dasha", heading: /Dasha Calculator/i },
  { id: "PAGE-TRANSITS-001", name: "Transits", path: "/transits", heading: /Planetary Transits/i },
  { id: "PAGE-NUMEROLOGY-001", name: "Numerology", path: "/numerology", heading: /Numerology Calculator/i },
];

test.describe("Page smoke tests", () => {
  for (const testCase of pageCases) {
    test(`${testCase.id} ${testCase.name} loads`, async ({ page }) => {
      await page.goto(testCase.path);
      if (testCase.heading) {
        await expect(page.getByRole("heading", { name: testCase.heading })).toBeVisible();
      } else if (testCase.text) {
        await expect(page.getByText(testCase.text)).toBeVisible();
      }
    });
  }
});
