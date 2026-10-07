import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.hero}>
          <ThemedText style={styles.brand}>Mayday</ThemedText>
          <ThemedText style={styles.tagline}>
            Everything you need, right when you need it.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sheet}>
          <ThemedText style={styles.heading}>About Mayday</ThemedText>
          <ThemedText style={styles.body}>
            Mayday is built to keep your day simple and organized. It brings
            your important tasks together in one calm, clear place, so you can
            spend less time searching and more time getting things done.
          </ThemedText>

          <ThemedView style={styles.divider} />

          <ThemedText style={styles.heading}>Our promise</ThemedText>
          <ThemedText style={styles.body}>
            Clean design, fast performance, and help that is always one tap
            away. We keep improving Mayday with every update, because your time
            matters.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f26b21",
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: "transparent",
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 32,
  },
  brand: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 18,
    lineHeight: 26,
    color: "#FFE8D6",
    marginTop: 10,
    maxWidth: 300,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 120,
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: "#25403B",
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    color: "#4B5563",
  },
  divider: {
    height: 3,
    backgroundColor: "#0bbaf0c7",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
});
