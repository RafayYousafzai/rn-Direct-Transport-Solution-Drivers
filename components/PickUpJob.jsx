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
  Pressable,
} from "react-native";
import PicturePicker from "./PicturePicker";
import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";
import { Entypo } from "@expo/vector-icons";
import { format } from "date-fns";

export default function PickUpJobModal({
  selectedBooking,
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
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {/* Close Icon */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Entypo name="cross" size={24} color="black" />
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

            {/* Status Message */}
            {selectedBooking?.progressInformation?.delivered && (
              <Text style={styles.deliveredText}>Booking Delivered</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: "#006fee",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  uploadedImagesContainer: {
    marginBottom: 16,
    width: "100%",
  },
  uploadedImagesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  deliveredText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#38a169",
    marginTop: 10,
  },
});
