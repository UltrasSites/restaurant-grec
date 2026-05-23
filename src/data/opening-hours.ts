// ════════════════════════════════════════════════════════════════════════════
// OPENING HOURS — Kalamaki Trouba (Piraeus, Greece, Europe/Athens)
// 24h format. Use empty array if closed all day.
// Multiple slots possible (lunch + dinner). Each slot: { open, close }.
// "close" can roll past midnight (e.g. "00:30" means 00:30 next day).
// ════════════════════════════════════════════════════════════════════════════

export type HoursSlot = { open: string; close: string };
export type DayHours = HoursSlot[]; // can be empty (closed)

// Days indexed Sun=0..Sat=6 (matches JS Date.getDay())
export const KALAMAKI_HOURS: Record<number, DayHours> = {
  0: [{ open: "12:00", close: "00:30" }], // Sunday
  1: [{ open: "11:00", close: "23:30" }], // Monday
  2: [{ open: "11:00", close: "23:30" }], // Tuesday
  3: [{ open: "11:00", close: "23:30" }], // Wednesday
  4: [{ open: "11:00", close: "23:30" }], // Thursday
  5: [{ open: "11:00", close: "00:30" }], // Friday
  6: [{ open: "11:00", close: "00:30" }], // Saturday
};

export const SHOP_TZ = "Europe/Athens";

// Day labels — EL + EN
export const DAY_LABELS = {
  el: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

// Display labels by lang
export const HOURS_I18N = {
  el: {
    open_now: "Ανοιχτά τώρα",
    closes_at: "Κλείνει στις",
    closes_in: "Κλείνει σε",
    closed_now: "Κλειστά τώρα",
    reopens_today_at: "Άνοιγμα σήμερα στις",
    reopens_tomorrow_at: "Άνοιγμα αύριο στις",
    reopens_at: "Άνοιγμα την",
    cant_order_closed: "Δεν δεχόμαστε παραγγελίες αυτή τη στιγμή",
    cant_order_reopens: "Οι online παραγγελίες ξεκινούν ξανά",
    opens_soon: "Ανοίγουμε σε λίγο",
    min: "λεπτά",
    hour: "ώρα",
  },
  en: {
    open_now: "Open now",
    closes_at: "Closes at",
    closes_in: "Closes in",
    closed_now: "Closed right now",
    reopens_today_at: "Reopens today at",
    reopens_tomorrow_at: "Reopens tomorrow at",
    reopens_at: "Reopens on",
    cant_order_closed: "We are not taking orders right now",
    cant_order_reopens: "Online orders resume",
    opens_soon: "Opening soon",
    min: "min",
    hour: "hour",
  },
};
