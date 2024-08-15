import { useState } from "react";
import SignatureComponent from "@/components/Signature";
import { ActivityIndicator, View, Text } from "react-native";
import useGlobalContext from "@/context/GlobalProvider";
import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";
import * as FileSystem from "expo-file-system";

export default function Signature() {
  const [loading, setLoading] = useState(false);
  const { selectedBooking, setSelectedBooking } = useGlobalContext();

  const handleSave = async (sign) => {
    setLoading(true);

    try {
      const base64ImageData = sign.split(",")[1];
      const fileUri = `${FileSystem.documentDirectory}signature.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64ImageData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const signUrl = await uploadImages(fileUri);

      if (signUrl) {
        const updatedData = {
          ...selectedBooking,
          signUrl,
        };
        await updateBooking(
          "place_bookings",
          selectedBooking.docId,
          updatedData
        );
        setSelectedBooking(updatedData);
        console.log("Image uploaded successfully:", signUrl);
      } else {
        console.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading...</Text>
        </View>
      ) : (
        <SignatureComponent
          handleSave={handleSave}
          currentSign={selectedBooking?.signUrl}
        />
      )}
    </View>
  );
}
