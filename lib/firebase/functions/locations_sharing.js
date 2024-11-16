import { uploadLocation } from "@/lib/firebase/functions/post";
import { GetUser } from "@/lib/firebase/functions/auth";

let user = null;

const fetchUser = async () => {
  user = await GetUser();
};
fetchUser();

async function handleLocationUpdate(location) {
  console.log("Location Update:", location);
  await uploadLocation(location, user);
}

export { handleLocationUpdate };
