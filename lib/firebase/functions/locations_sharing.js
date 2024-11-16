import { uploadLocation } from "@/lib/firebase/functions/post";

async function handleLocationUpdate(location, user) {
  await uploadLocation(location, user);
}

export { handleLocationUpdate };
