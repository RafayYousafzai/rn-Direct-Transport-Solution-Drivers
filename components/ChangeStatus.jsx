import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useGlobalContext from "@/context/GlobalProvider";
import { updateBooking } from "@/lib/firebase/functions/post";
import { format } from "date-fns";

const ChangeStatus = () => {
  const { selectedBooking } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedStatus(selectedBooking?.currentStatus);
  }, [selectedBooking]);

  const statuses = [
    { val: "pickedup", label: "Picked Up" },
    { val: "returned", label: "Returned" },
    { val: "cancelled", label: "Cancelled" },
    { val: "arrivedAtDrop", label: "Arrived at Drop" },
    { val: "arrivedAtPickup", label: "Arrived at Pickup" },
  ];

  const updateStatus = async () => {
    if (!selectedStatus) return;
    setLoading(true);
    const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");
    try {
      const updatedData = {
        ...selectedBooking,
        progressInformation: {
          ...selectedBooking.progressInformation,
          [selectedStatus]: currentDateTime,
        },
        currentStatus: selectedStatus,
      };
      await updateBooking("place_bookings", selectedBooking.docId, updatedData);
      setModalVisible(false); // Close modal on success
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.actionButtonText}>Change Job Status</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Job Status</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#006fee" />
            ) : (
              <>
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status.val}
                    style={[
                      styles.statusOption,
                      selectedStatus === status.val && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedStatus(status.val)}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        selectedStatus === status.val && styles.selectedText,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.updateButton,
                    !selectedStatus && styles.disabledButton,
                  ]}
                  onPress={updateStatus}
                  disabled={!selectedStatus}
                >
                  <Text style={styles.updateButtonText}>Update Status</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  actionButton: {
    backgroundColor: "#006fee",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  statusOption: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#006fee",
  },
  statusText: {
    fontSize: 16,
    color: "#000",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#006fee",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangeStatus;
