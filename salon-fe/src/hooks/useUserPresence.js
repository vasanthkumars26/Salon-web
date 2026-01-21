import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const useUserPresence = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);

      // Mark user online
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          isOnline: true,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );

      // Mark offline on tab close / refresh
      const handleOffline = async () => {
        await setDoc(
          userRef,
          {
            isOnline: false,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      };

      window.addEventListener("beforeunload", handleOffline);

      return () => {
        handleOffline();
        window.removeEventListener("beforeunload", handleOffline);
      };
    });

    return () => unsubscribe();
  }, []);
};

export default useUserPresence;
