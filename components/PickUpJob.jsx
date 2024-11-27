import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import PicturePicker from "./PicturePicker";
import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";
import { Entypo } from "@expo/vector-icons";
import { format } from "date-fns";

const statuses = [
  { val: "pickedup", status: "Picked Up" },
  { val: "returned", status: "Returned" },
  { val: "cancelled", status: "Cancelled" },
  { val: "Arrived At Drop", status: "Arrived at Drop" },
  { val: "Arrived At Pickup", status: "Arrived at Pickup" },
];

export default function PickUpJobModal({
  selectedBooking,
  updateStatus,
  loading,
  setLoading,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const handlePickupImages = async () => {
    setLoading(true);

    try {
      const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");
      const pickupImages = await Promise.all(
        selectedImages.map(async (image) => {
          const url = await uploadImages(image);
          return url;
        })
      );

      const updatedData = {
        ...selectedBooking,
        progressInformation: {
          ...selectedBooking.progressInformation,
          pickedup: currentDateTime,
        },
        currentStatus: "pickedup",
        pickupImages:
          selectedBooking?.pickupImages?.length > 0
            ? [...selectedBooking?.pickupImages, ...pickupImages]
            : pickupImages,
      };

      await updateBooking("place_bookings", selectedBooking.docId, updatedData);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedImages?.length > 0) {
      handlePickupImages();
    }
  }, [selectedImages]);

  const renderUploadedImages = () => {
    return (
      <View style={styles.uploadedImagesContainer}>
        {!selectedBooking?.pickupImages?.length > 0 ? (
          <Text style={styles.uploadedImagesTitle}>
            {loading && <ActivityIndicator color={"#2b6cb0"} />}
          </Text>
        ) : (
          <Text style={styles.uploadedImagesTitle}>
            {loading && <ActivityIndicator color={"#2b6cb0"} />} Uploaded Images
            ({selectedBooking.pickupImages.length}):
          </Text>
        )}

        {selectedBooking?.pickupImages?.length > 0 && (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={selectedBooking.pickupImages}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
            )}
          />
        )}
      </View>
    );

    return null;
  };

  return (
    <View>
      {/* Button to Open the Modal */}
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Pickup Job</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Icon */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Entypo
                style={{ marginTop: 4, marginRight: 4 }}
                name="cross"
                size={24}
                color="black"
              />
            </TouchableOpacity>

            {/* Display Uploaded Images */}
            {renderUploadedImages()}

            {/* Picture Picker */}
            {!selectedBooking?.progressInformation?.delivered && (
              <PicturePicker
                title={
                  selectedBooking?.pickupImages?.length > 0
                    ? "You can upload more images if needed."
                    : "Please Add Pick Up Images To Continue."
                }
                setSelectedImages={setSelectedImages}
              />
            )}

            {/* Status Buttons */}
            {selectedBooking?.progressInformation?.delivered && (
              <Text style={styles.deliveredText}>Booking Delivered</Text>
            )}
            {!selectedBooking?.progressInformation?.delivered &&
              selectedBooking?.progressInformation?.pickedup &&
              statuses.map((status) => (
                <TouchableOpacity
                  key={status.val}
                  style={[
                    styles.statusButton,
                    selectedBooking?.currentStatus === status.val && {
                      backgroundColor: "#2b6cb0",
                    },
                  ]}
                  disabled={status.val === selectedBooking?.currentStatus}
                  activeOpacity={0.8}
                  onPress={() => updateStatus(status.val)}
                >
                  <Text style={styles.statusText}>{status.status}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: "#2b6cb0",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    elevation: 4,
  },
  buttonText: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    height: "100%",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  uploadedImagesContainer: {
    marginBottom: 16,
    width: "100%",
    alignItems: "flex-start",
  },
  uploadedImagesTitle: {
    fontWeight: "bold",
    marginBottom: 35,
    fontSize: 18,
    color: "#333",
    marginTop: -4,
    marginLeft: 4,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  statusButton: {
    backgroundColor: "#457b9d",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: "100%",
    elevation: 3,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
  },
  deliveredText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#38a169",
    marginTop: 10,
  },
});
