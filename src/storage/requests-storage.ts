import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ServiceRequest } from "@/types/request";

const STORAGE_KEY = "mayday:requests";

// Shown only on the very first launch, before anything is saved
const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: "seed-1",
    title: "Electrician visit",
    category: "Electrician",
    description: "Fix the flickering lights in the living room.",
    status: "In progress",
    createdAt: "2026-09-12T09:00:00.000Z",
  },
  {
    id: "seed-2",
    title: "Plumbing repair",
    category: "Plumbing",
    description: "Kitchen sink is leaking.",
    status: "Resolved",
    createdAt: "2026-09-03T09:00:00.000Z",
  },
  {
    id: "seed-3",
    title: "AC servicing",
    category: "AC Servicing",
    description: "Annual cleaning and gas check.",
    status: "Pending",
    createdAt: "2026-08-28T09:00:00.000Z",
  },
];

export async function loadRequests(): Promise<ServiceRequest[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    // null means "never saved" -> use seed. "[]" means the user deleted everything.
    if (raw === null) return SEED_REQUESTS;
    return JSON.parse(raw) as ServiceRequest[];
  } catch (error) {
    console.warn("Failed to load requests", error);
    return [];
  }
}

export async function saveRequests(requests: ServiceRequest[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.warn("Failed to save requests", error);
  }
}
