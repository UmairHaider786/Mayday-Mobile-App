import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchProviders, type Provider } from "@/services/api";

function ProviderCard({ item }: { item: Provider }) {
  const initials = item.name
    .split(" ")
    .filter((_, i) => i < 2)
    .map((part) => part[0])
    .join("");

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.cardTitleBox}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.company}>{item.company.name}</Text>
        </View>
      </View>

      <Text style={styles.detail}>City: {item.address.city}</Text>
      <Text style={styles.detail}>Email: {item.email}</Text>
      <Text style={styles.detail}>Phone: {item.phone}</Text>
    </View>
  );
}

export default function ExploreScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProviders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const data = await fetchProviders();
      setProviders(data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.code === "ECONNABORTED") {
        setError("The request timed out. Please try again.");
      } else if (axios.isAxiosError(e) && !e.response) {
        setError("No internet connection. Check your network and retry.");
      } else {
        setError("Something went wrong while loading providers.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Service Providers</Text>
        <Text style={styles.heroSubtitle}>
          Trusted professionals, loaded live from the web.
        </Text>
      </View>

      <View style={styles.sheet}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#F26B21" />
            <Text style={styles.stateText}>Loading providers...</Text>
          </View>
        ) : error !== "" ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => loadProviders()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={providers}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ProviderCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={() => loadProviders(true)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f26b21" },

  hero: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "web" ? 100 : 24,
    paddingBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  heroSubtitle: { fontSize: 15, color: "#FFE8D6", marginTop: 4 },

  sheet: {
    flex: 1,
    backgroundColor: "#eef2f3",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContent: { paddingBottom: 120 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  stateText: { color: "#6B7280", fontSize: 15, marginTop: 12 },
  errorText: {
    color: "#B91C1C",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: "#F26B21",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  retryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#187564",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 17 },
  cardTitleBox: { flex: 1, marginLeft: 12 },
  name: { fontSize: 17, fontWeight: "700", color: "#25403B" },
  company: { fontSize: 13, color: "#F26B21", fontWeight: "600", marginTop: 2 },
  detail: { fontSize: 14, color: "#4B5563", marginTop: 3 },
});
