import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import Signature from "react-native-signature-canvas";
import { Dimensions } from "react-native";

const SignatureComponent = ({ handleSave, currentSign }) => {
  const [signature, setSignature] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const ref = useRef();
  const screenHeight = Dimensions.get("window").height;

  const handleOK = (signature) => {
    if (signature) {
      const base64Data = signature.split(",")[1];
      const pngImage = `data:image/png;base64,${base64Data}`;

      // Save the PNG image
      handleSave(pngImage);

      // Close the modal after saving the signature
      setSignature(signature);
      setIsFullscreen(false);
    } else {
      console.warn("No signature data found.");
    }
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };

  const img =
    "https://img.freepik.com/free-vector/hand-drawn-essay-illustration_23-2150268421.jpg?t=st=1723626153~exp=1723629753~hmac=4625206d373b5f731691c2cbb177e96d2f2b040040ec0beccb02e09bfaa9e2b0&w=740";

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-6">
        Sign Below
      </Text>

      <View className="mt-8 items-center">
        <Text className="text-lg font-medium text-gray-700 mb-4">
          {signature ? "Your Signature:" : "Please click to add new signature"}
        </Text>
        <TouchableOpacity
          onPress={() => setIsFullscreen(true)}
          className="border border-gray-300 rounded-lg "
        >
          <Image
            className="aspect-square w-full border border-slate-200  rounded-lg"
            resizeMode="contain"
            source={{
              uri: signature ? signature : currentSign ? currentSign : img,
            }}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={isFullscreen} animationType="slide">
        <View className="flex-1 bg-white justify-center items-center p-4">
          <Text className="text-xl font-semibold text-gray-800 mb-6">
            New Signature
          </Text>

          <Signature
            ref={ref}
            onOK={handleOK}
            descriptionText="Sign"
            webStyle={`
              .m-signature-pad { border: none; border-radius: 12px; height: ${
                screenHeight * 0.65
              }px; }
              .m-signature-pad--body { border: none; }
              .m-signature-pad--footer { display: none; margin: 0; }
            `}
            className="mt-2 w-full flex-1 bg-white rounded-lg shadow-lg"
          />

          <View className="flex-row my-6 gap-1 w-full">
            <TouchableOpacity
              className="bg-secondary-100 px-6 w-2/4 py-3 rounded-lg"
              onPress={handleClear}
            >
              <Text className="text-white text-center text-base font-medium">
                Clear
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-secondary px-6 w-2/4 py-3 rounded-lg"
              onPress={handleConfirm}
            >
              <Text className="text-white text-center text-base font-medium">
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setIsFullscreen(false)}
            className="bg-red-500 w-full p-3 rounded-lg"
          >
            <Text className="text-white text-center text-base font-medium">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SignatureComponent;
