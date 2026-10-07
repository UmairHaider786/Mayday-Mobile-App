import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type Status = "Resolved" | "In progress" | "Pending";

const STATS = [
  { value: "8", label: "Requests" },
  { value: "5", label: "Resolved" },
  { value: "2", label: "Active" },
];

const ACCOUNT = [
  { label: "Phone", value: "+92 317 4016795" },
  { label: "Email", value: "umairhaiderlhr@gmail.com" },
  { label: "City", value: "Lahore" },
  { label: "Address", value: "Awan Town , Lahore" },
  { label: "Member since", value: "Feb 2026" },
];

const REQUESTS: { id: string; title: string; date: string; status: Status }[] =
  [
    {
      id: "1",
      title: "Electrician visit",
      date: "12 Sep 2026",
      status: "In progress",
    },
    {
      id: "2",
      title: "Plumbing repair",
      date: "03 Sep 2026",
      status: "Resolved",
    },
    { id: "3", title: "AC servicing", date: "28 Aug 2026", status: "Pending" },
  ];

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  Resolved: { bg: "#DCFCE7", text: "#166534" },
  "In progress": { bg: "#FFEDD5", text: "#C2410C" },
  Pending: { bg: "#E5E7EB", text: "#374151" },
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.hero}>
          <ThemedView style={styles.avatar}>
            <ThemedText style={styles.avatarText}>UH</ThemedText>
          </ThemedView>
          <ThemedText style={styles.name}>Umair Haider</ThemedText>
          <ThemedView style={styles.badge}>
            <ThemedText style={styles.badgeText}>Mayday Member</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Body */}
        <ThemedView style={styles.sheet}>
          {/* Stats */}
          <ThemedView style={styles.statsRow}>
            {STATS.map((s) => (
              <ThemedView key={s.label} style={styles.statCard}>
                <ThemedText style={styles.statValue}>{s.value}</ThemedText>
                <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          {/* Account details */}
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Account details</ThemedText>
            {ACCOUNT.map((d, i) => (
              <ThemedView
                key={d.label}
                style={[styles.row, i < ACCOUNT.length - 1 && styles.rowBorder]}
              >
                <ThemedText style={styles.rowLabel}>{d.label}</ThemedText>
                <ThemedText style={styles.rowValue}>{d.value}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          {/* Recent requests */}
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Recent requests</ThemedText>
            {REQUESTS.map((r, i) => (
              <ThemedView
                key={r.id}
                style={[
                  styles.row,
                  i < REQUESTS.length - 1 && styles.rowBorder,
                ]}
              >
                <ThemedView style={styles.requestInfo}>
                  <ThemedText style={styles.requestTitle}>{r.title}</ThemedText>
                  <ThemedText style={styles.requestDate}>{r.date}</ThemedText>
                </ThemedView>
                <ThemedView
                  style={[
                    styles.pill,
                    { backgroundColor: STATUS_COLORS[r.status].bg },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.pillText,
                      { color: STATUS_COLORS[r.status].text },
                    ]}
                  >
                    {r.status}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>

          {/* Support */}
          <ThemedView style={styles.supportCard}>
            <ThemedText style={styles.supportTitle}>Need help?</ThemedText>
            <ThemedText style={styles.supportText}>
              Our Mayday support team is ready to assist you with any request.
            </ThemedText>
            <ThemedText style={styles.supportContact}>
              Helpline: +92 317 4016795
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f26b21" },

  hero: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 52,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#187564",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 42,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginTop: 16,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  sheet: {
    backgroundColor: "#eef2f3",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },

  statsRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  statValue: {
    color: "#F26B21",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  statLabel: { color: "#6B7280", fontSize: 13, marginTop: 2 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#25403B",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 8,
  },

  row: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F1E4DA" },
  rowLabel: { color: "#6B7280", fontSize: 15 },
  rowValue: { color: "#25403B", fontSize: 15, fontWeight: "600" },

  requestInfo: { backgroundColor: "transparent", flex: 1, paddingRight: 12 },
  requestTitle: {
    color: "#25403B",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  requestDate: { color: "#6B7280", fontSize: 13, marginTop: 2 },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  pillText: { fontSize: 12, fontWeight: "700", lineHeight: 16 },

  supportCard: {
    backgroundColor: "#25403B",
    borderRadius: 20,
    padding: 20,
  },
  supportTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  supportText: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 6,
  },
  supportContact: {
    color: "#FFB27A",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
  },
});
