import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import app from "@/lib/firebase/firebaseConfig";
import { getValueFor, remove, save } from "@/lib/SecureStore/SecureStore";
import { useRouter } from "expo-router";
import { ref, onValue, getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
const GlobalContext = createContext();

const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState([]);
  const [user, setUser] = useState({});
  const [liveLocSharingBookings, setLiveLocSharingBookings] = useState([]);

  const router = useRouter();

  const db = getFirestore(app);
  const realtimeDb = getDatabase(app);

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      setSelectedBooking(
        bookings.find((booking) => booking.id === selectedBooking.id)
      );
    }
  }, [bookings]);

  const getLiveLocSharingBookings = () => {
    const sanitizedEmail = user?.email?.replace(/[.#$[\]]/g, "_");
    if (!sanitizedEmail) return;

    const dbRef = ref(realtimeDb, `driversLocations/${sanitizedEmail}`);

    let lastUpdateTime = 0;

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      AsyncStorage.setItem("user", JSON.stringify(user));
      AsyncStorage.setItem("liveLocSharingBookings", JSON.stringify(data));
      setLiveLocSharingBookings([...liveLocSharingBookings, data]);
    });
  };
  const listenUser = useCallback(
    (email) => {
      const docRef = doc(db, "users", email);

      return onSnapshot(
        docRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUser(userData);
            save("user", JSON.stringify(userData));
            setIsLoggedIn(true);
          } else {
            remove("user");
            router.navigate("signin");
            console.error("User document not found.");
            setIsLoggedIn(false);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching user:", error);
          remove("user");
          router.navigate("signin");
          setIsLoading(false);
          setIsLoggedIn(false);
        }
      );
    },
    [db, router]
  );

  const listenBookings = useCallback(
    (email) => {
      const collectionRef = collection(db, "place_bookings");
      const q = query(
        collectionRef,
        where("driverEmail", "==", email),
        orderBy("createdAt", "desc")
      );

      return onSnapshot(
        q,
        (querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBookings(documents);
        },
        (error) => {
          console.error("Error fetching bookings:", error);
        }
      );
    },
    [db]
  );

  const initializeListeners = useCallback(async () => {
    try {
      const value = await getValueFor("user");
      if (value) {
        const userData = JSON.parse(value);
        const userUnsubscribe = listenUser(userData.email);
        const bookingsUnsubscribe = listenBookings(userData.email);

        return () => {
          userUnsubscribe();
          bookingsUnsubscribe();
        };
      } else {
        router.push("/signin");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  }, [listenUser, listenBookings, router]);

  const refreshContext = useCallback(async () => {
    setIsLoading(true);
    const cleanup = await initializeListeners();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeListeners]);

  useEffect(() => {
    let cleanup;
    initializeListeners().then((result) => (cleanup = result));
    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeListeners]);

  useEffect(() => {
    if (user.email) {
      getLiveLocSharingBookings();
    }
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        bookings,
        user,
        selectedBooking,
        setSelectedBooking,
        setUser,
        refreshContext,
        liveLocSharingBookings,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider };
export default useGlobalContext;
