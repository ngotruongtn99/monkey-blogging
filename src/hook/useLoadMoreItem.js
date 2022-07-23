import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "firebaseConfig/firebase-config";
import { debounce } from "lodash";
import { useEffect, useState } from "react";

export default function useLoadMoreItem(
  item = "users",
  itemPerPage = 1,
  filterCondition
) {
  const [lastDoc, setLastDoc] = useState("");
  const [itemList, setItemList] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");

  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, item);
      const newRef = filter
        ? query(
            colRef,
            where(filterCondition, ">=", filter),
            where(filterCondition, "<=", filter + "utf8")
          )
        : query(colRef, limit(itemPerPage));

      const documentSnapshots = await getDocs(newRef);

      // Get the last visible document
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setItemList(results);
        // setTotal(snapshot.size);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter, filterCondition, item, itemPerPage]);

  const handleLoadMoreItem = async () => {
    const nextRef = query(
      collection(db, item),
      startAfter(lastDoc),
      limit(itemPerPage)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setItemList([...itemList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  return {
    handleLoadMoreItem,
    itemList,
    total,
    handleInputFilter,
  };
}
