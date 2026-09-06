import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Az MKSZ csapatonként/szezononként eltérően írja a nevünket
// ("Ácsi Kinizsi SC", "Ácsi Kinizsi S.C.", "Ácsi Kinizsi SC.", "Ácsi Kinizsi"),
// ezért sem pontos egyezés, sem laza "tartalmazza a Kinizsi szót" nem
// megbízható (pl. a "Sárvári Kinizsi SE" is tartalmazza). A pontokat és
// szóközöket levágva, "ácsikinizsi"-vel kezdődésre vizsgálunk.
export function isKinizsiTeam(name) {
  if (!name) return false;
  const normalized = name.toLowerCase().replace(/[.\s]/g, "");
  return normalized.startsWith("ácsikinizsi");
}
