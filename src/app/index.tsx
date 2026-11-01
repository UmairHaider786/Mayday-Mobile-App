import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRequests } from "@/context/requests-context";
import {
  CATEGORIES,
  STATUSES,
  type Category,
  type RequestInput,
  type RequestStatus,
  type ServiceRequest,
} from "@/types/request";

const STATUS_COLORS: Record<RequestStatus, { bg: string; text: string }> = {
  Resolved: { bg: "#DCFCE7", text: "#166534" },
  "In progress": { bg: "#FFEDD5", text: "#C2410C" },
  Pending: { bg: "#E5E7EB", text: "#374151" },
};

const CATEGORY_OPTIONS: (Category | "All")[] = ["All", ...CATEGORIES];
const STATUS_OPTIONS: (RequestStatus | "All")[] = ["All", ...STATUSES];

/* ---------- Small reusable chip ---------- */

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- Add / Edit form (modal) ---------- */

type FormProps = {
  visible: boolean;
  initial?: ServiceRequest;
  onSave: (input: RequestInput) => void;
  onClose: () => void;
};

function RequestFormModal({ visible, initial, onSave, onClose }: FormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [status, setStatus] = useState<RequestStatus>("Pending");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Fill the form with the record being edited (or clear it for a new one)
  useEffect(() => {
    if (visible) {
      setTitle(initial?.title ?? "");
      setCategory(initial?.category ?? CATEGORIES[0]);
      setStatus(initial?.status ?? "Pending");
      setDescription(initial?.description ?? "");
      setError("");
    }
  }, [visible, initial]);

  const handleSave = () => {
    if (title.trim() === "") {
      setError("Please enter a title.");
      return;
    }
    onSave({
      title: title.trim(),
      category,
      status,
      description: description.trim(),
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalCard}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalTitle}>
              {initial ? "Edit request" : "New request"}
            </Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Fix kitchen tap"
              placeholderTextColor="#9CA3AF"
            />
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.label}>Category</Text>
            <View style={styles.chipWrap}>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={category === c}
                  onPress={() => setCategory(c)}
                />
              ))}
            </View>

            <Text style={styles.label}>Status</Text>
            <View style={styles.chipWrap}>
              {STATUSES.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={status === s}
                  onPress={() => setStatus(s)}
                />
              ))}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the problem (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {initial ? "Update" : "Save"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------- Home screen ---------- */

export default function HomeScreen() {
  const { requests, loading, addRequest, updateRequest, deleteRequest } =
    useRequests();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">(
    "All",
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // find(): the record currently being edited (undefined when creating)
  const editing = requests.find((r) => r.id === editingId);

  // filter() + some(): search text AND category AND status must all match
  const q = query.trim().toLowerCase();
  const filtered = requests.filter((r) => {
    const matchesSearch =
      q === "" ||
      [r.title, r.description, r.category].some((field) =>
        field.toLowerCase().includes(q),
      );
    const matchesCategory =
      categoryFilter === "All" || r.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleSave = (input: RequestInput) => {
    if (editingId) {
      updateRequest(editingId, input);
    } else {
      addRequest(input);
    }
    setFormOpen(false);
  };

  const confirmDelete = (request: ServiceRequest) => {
    Alert.alert("Delete request", `Delete "${request.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteRequest(request.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: ServiceRequest }) => {
    const colors = STATUS_COLORS[item.status];
    const date = new Date(item.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={[styles.pill, { backgroundColor: colors.bg }]}>
            <Text style={[styles.pillText, { color: colors.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.cardMeta}>
          {item.category} · {date}
        </Text>

        {item.description !== "" && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.cardActions}>
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEdit(item.id)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => confirmDelete(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>My Requests</Text>
          <Text style={styles.heroSubtitle}>
            {filtered.length} of {requests.length} shown
          </Text>
        </View>
        <Pressable style={styles.addButton} onPress={openCreate}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {/* White sheet */}
      <View style={styles.sheet}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by title, category or description"
          placeholderTextColor="#9CA3AF"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={categoryFilter === c}
              onPress={() => setCategoryFilter(c)}
            />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {STATUS_OPTIONS.map((s) => (
            <Chip
              key={s}
              label={s}
              selected={statusFilter === s}
              onPress={() => setStatusFilter(s)}
            />
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#F26B21"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {requests.length === 0
                  ? "No requests yet. Tap + Add to create one."
                  : "No requests match your search or filters."}
              </Text>
            }
          />
        )}
      </View>

      <RequestFormModal
        visible={formOpen}
        initial={editing}
        onSave={handleSave}
        onClose={() => setFormOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f26b21" },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroText: { flex: 1 },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  heroSubtitle: { fontSize: 15, color: "#FFE8D6", marginTop: 4 },
  addButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: { color: "#F26B21", fontWeight: "800", fontSize: 15 },

  sheet: {
    flex: 1,
    backgroundColor: "#eef2f3",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#25403B",
  },
  filterRow: { flexGrow: 0, flexShrink: 0, marginTop: 12 },
  loader: { marginTop: 40 },

  listContent: { paddingTop: 16, paddingBottom: 120 },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    marginTop: 40,
  },

  chip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 8,
  },
  chipSelected: { backgroundColor: "#F26B21", borderColor: "#F26B21" },
  chipText: { color: "#374151", fontSize: 13, fontWeight: "600" },
  chipTextSelected: { color: "#FFFFFF" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#25403B",
    paddingRight: 10,
  },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  pillText: { fontSize: 12, fontWeight: "700" },
  cardMeta: { color: "#6B7280", fontSize: 13, marginTop: 4 },
  cardDescription: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  cardActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editButton: { backgroundColor: "#E0F2FE" },
  editButtonText: { color: "#0369A1", fontWeight: "700", fontSize: 13 },
  deleteButton: { backgroundColor: "#FEE2E2" },
  deleteButtonText: { color: "#B91C1C", fontWeight: "700", fontSize: 13 },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#25403B",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#25403B",
  },
  textArea: { minHeight: 90, textAlignVertical: "top" },
  errorText: { color: "#B91C1C", fontSize: 13, marginTop: 6 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", rowGap: 8 },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 24 },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#E5E7EB" },
  cancelButtonText: { color: "#374151", fontWeight: "700", fontSize: 15 },
  saveButton: { backgroundColor: "#F26B21" },
  saveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
});
