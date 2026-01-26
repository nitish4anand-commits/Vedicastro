import { test, expect } from "@playwright/test";

test.describe("API tests", () => {
  test("API-HOROSCOPE-001 Signs list", async ({ request }) => {
    const response = await request.get("/api/horoscope");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data.signs)).toBeTruthy();
  });

  test("API-HOROSCOPE-002 Daily horoscope", async ({ request }) => {
    const response = await request.get("/api/horoscope?sign=aries&type=daily");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.sign).toBeTruthy();
    expect(data.predictions).toBeTruthy();
  });

  test("API-HOROSCOPE-003 Monthly horoscope", async ({ request }) => {
    const response = await request.get("/api/horoscope?sign=aries&type=monthly&month=1&year=2026");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.month).toBeTruthy();
    expect(data.overallScore).toBeTruthy();
  });

  test("API-MATCHING-001 Matching endpoint", async ({ request }) => {
    const response = await request.post("/api/matching", {
      data: {
        maleBirthDate: "1990-01-15",
        maleBirthTime: "12:00",
        femaleBirthDate: "1992-06-20",
        femaleBirthTime: "08:30",
        maleTimezone: 5.5,
        femaleTimezone: 5.5
      }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.totalScore).toBeTruthy();
    expect(Array.isArray(data.kootas)).toBeTruthy();
  });

  test("API-PANCHANG-001 Panchang endpoint", async ({ request }) => {
    const response = await request.get("/api/panchang?date=2026-01-24&lat=28.6139&lng=77.2090&timezone=5.5");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.tithi).toBeTruthy();
    expect(data.nakshatra).toBeTruthy();
    expect(data.yoga).toBeTruthy();
  });

  test("API-TRANSITS-001 Transits endpoint", async ({ request }) => {
    const response = await request.get("/api/transits?date=2026-01-24&timezone=5.5");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.current).toBeTruthy();
    expect(data.upcoming).toBeTruthy();
  });

  test("API-DASHA-001 Dasha endpoint", async ({ request }) => {
    const response = await request.post("/api/dasha", {
      data: {
        birthDate: "1990-01-15",
        birthTime: "12:00",
        timezone: 5.5
      }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.mahadashas).toBeTruthy();
    expect(data.antardashas).toBeTruthy();
  });

  test("API-KUNDLI-001 Kundli endpoint", async ({ request }) => {
    const response = await request.post("/api/kundli", {
      data: {
        dateOfBirth: "1990-01-15",
        timeOfBirth: "12:00",
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: 5.5
      }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("success");
  });

  test("API-AUTH-001 Register endpoint", async ({ request }) => {
    const email = `codex-test-${Date.now()}@example.com`;
    const response = await request.post("/api/auth/register", {
      data: {
        email,
        password: "testpass123",
        name: "Codex Test"
      }
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.message).toBe("User created successfully");
  });
});
