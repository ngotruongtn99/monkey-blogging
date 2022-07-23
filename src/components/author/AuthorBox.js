import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import React, { useState } from "react";
import { useEffect } from "react";

const AuthorBox = ({ userId = "" }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.data()) {
        setUser(docSnapshot.data());
      }
    }
    fetchData();
  }, [userId]);
  if (!userId || !user.username) return null;
  return (
    <div className="author">
      <div className="author-image">
        <img src={user?.avatar} alt="" />
      </div>
      <div className="author-content">
        <h3 className="author-name">{user?.fullname}</h3>
        <p className="author-desc">{user?.description}</p>
      </div>
    </div>
  );
};

export default AuthorBox;
