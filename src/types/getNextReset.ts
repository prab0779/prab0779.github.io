export function getNextReset() {
  const now = new Date();
  const uk = new Date(
    now.toLocaleString("en-GB", { timeZone: "Europe/London" })
  );

  const hours = uk.getHours();
  const next = [0, 6, 12, 18].find((h) => h > hours) ?? 24;

  uk.setHours(next, 0, 0, 0);

  return uk.toISOString();
}
