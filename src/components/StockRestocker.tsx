function updateCountdown() {
  const RESET_HOURS = [0, 6, 12, 18];

  // Current time in ms (UTC-based)
  const now = new Date();

  // Get "current hour in London" safely via Intl
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const getPart = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const currentHour = Number(getPart("hour"));
  const currentMinute = Number(getPart("minute"));
  const currentSecond = Number(getPart("second"));

  // Find next reset hour
  let nextHour = RESET_HOURS.find((h) => h > currentHour);
  let addDays = 0;

  if (nextHour === undefined) {
    nextHour = 0;
    addDays = 1;
  }

  // Compute seconds until next reset in "London clock time"
  const secondsNow = currentHour * 3600 + currentMinute * 60 + currentSecond;
  const secondsTarget = (nextHour * 3600) + 0; // at :00:00

  let diffSeconds = (addDays * 86400) + (secondsTarget - secondsNow);
  if (diffSeconds < 0) diffSeconds += 86400; // safety

  const h = Math.floor(diffSeconds / 3600);
  const m = Math.floor((diffSeconds % 3600) / 60);
  const s = diffSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
}
