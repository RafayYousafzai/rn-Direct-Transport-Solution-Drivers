import { Image } from "react-native";

export default function ImageViewer({
  placeholderImageSource,
  selectedImage,
  styles,
}) {
  console.log(
    selectedImage ? { uri: selectedImage } : { uri: placeholderImageSource }
  );

  const imageSource = selectedImage
    ? { uri: selectedImage }
    : { uri: placeholderImageSource };

  if (!selectedImage && placeholderImageSource === "") return null;

  return (
    <Image
      source={imageSource}
      className={`rounded-xl  ${styles}`}
      style={{ minWidth: 100, minHeight: 100 }}
    />
  );
}
