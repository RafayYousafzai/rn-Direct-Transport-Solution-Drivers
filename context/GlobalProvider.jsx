import { createContext, useContext, useEffect, useState } from "react";
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

const GlobalContext = createContext();

const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const db = getFirestore(app);

  const listenUser = (email) => {
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
  };

  const listenBookings = (email) => {
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

        if (selectedBooking) {
          const updatedBooking = documents.find(
            (booking) => booking.docId === selectedBooking.docId
          );
          if (updatedBooking) {
            setSelectedBooking(updatedBooking);
          }
        }
      },
      (error) => {
        console.error("Error fetching bookings:", error);
      }
    );
  };

  const initializeListeners = async () => {
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
  };

  useEffect(() => {
    initializeListeners();
  }, []);
  useEffect(() => {
    initializeListeners();
  }, [isLoggedIn]);

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider };
export default useGlobalContext;
