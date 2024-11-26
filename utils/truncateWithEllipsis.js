export default function truncateWithEllipsis(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

//   // Example usage:
//   const longText = "This is a very long string that needs to be truncated.";
//   const truncatedText = truncateWithEllipsis(longText, 20);
//   console.log(truncatedText); // Output: "This is a very long..."
