import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Signature from "react-native-signature-canvas";

const SignatureComponent = () => {
  const [signature, setSignature] = useState(null);
  const ref = useRef();

  const handleOK = (signature) => {
    setSignature(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };

  return (
    <View className="flex-1 justify-center items-center bg-primary p-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-6">
        Sign Below
      </Text>
      <Signature
        ref={ref}
        onOK={handleOK}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={`
          .m-signature-pad { border: 2px solid #e2e8f0; border-radius: 12px; }
          .m-signature-pad--body { border: none; }
          .m-signature-pad--footer { display: none; margin: 0; }
        `}
        className="w-full h-64 bg-white rounded-lg shadow-lg"
      />
      <View className="flex-row mt-6 space-x-4">
        <TouchableOpacity
          className="bg-red-500 px-6 w-[47%] py-3 rounded-lg"
          onPress={handleClear}
        >
          <Text className="text-white text-center text-base font-medium">Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-secondary px-6 w-[47%] py-3 rounded-lg"
          onPress={handleConfirm}
        >
          <Text className="text-white text-center text-base font-medium">Save</Text>
        </TouchableOpacity>
      </View>
      {signature && (
        <View className="mt-8 items-center">
          <Text className="text-lg font-medium text-gray-700 mb-4">
            Your Signature:
          </Text>
          <Image
            className="w-64 h-32 border border-gray-300 rounded-lg"
            resizeMode="contain"
            source={{ uri: signature }}
          />
        </View>
      )}
    </View>
  );
};

export default SignatureComponent;
