export interface ScamLog {
  id: string;
  robloxId: string;
  discordId: string | null;
  reason: string;
  evidenceUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
