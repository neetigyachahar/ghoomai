function normalizeCity(value: string): string {
  return value.trim().toLowerCase();
}

function cityMatches(value: string, query: string): boolean {
  const normalized = normalizeCity(value);
  const normalizedQuery = normalizeCity(query);

  return (
    normalized.includes(normalizedQuery) || normalizedQuery.includes(normalized)
  );
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  if (hours === undefined || minutes === undefined) {
    return 0;
  }

  return hours * 60 + minutes;
}

export { cityMatches, normalizeCity };

export function matchesTimeWindow(
  time: string,
  afterTime?: string,
  beforeTime?: string,
): boolean {
  const value = parseTimeToMinutes(time);

  if (afterTime && value < parseTimeToMinutes(afterTime)) {
    return false;
  }

  if (beforeTime && value > parseTimeToMinutes(beforeTime)) {
    return false;
  }

  return true;
}

export function getBudgetMaxPrice(budgetTier: string): number | undefined {
  switch (budgetTier) {
    case "budget":
      return 3000;
    case "mid":
      return 5000;
    case "premium":
      return undefined;
    default:
      return undefined;
  }
}
