// src/WishListPage.js
import React, { useEffect, useState, useRef } from "react";
import { database } from "../components/firebase";
import { ref, onValue, remove } from "firebase/database";

const urgencyPriority = {
  "ASAP": 1,
  "om 15 min": 2,
  "om 30 min": 3,
  "om 1 timme": 4,
  "om 2 timme": 5
};

const WishListPage = () => {
  const [wishes, setWishes] = useState([]);
  const prevWishesRef = useRef([]);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const wishesRef = ref(database, 'wishes');
    onValue(wishesRef, (snapshot) => {
      const data = snapshot.val();
      const wishesList = data ? Object.entries(data).map(([id, wish]) => ({ id, ...wish })) : [];
      wishesList.sort((a, b) => urgencyPriority[a.urgency] - urgencyPriority[b.urgency]);
      setWishes(wishesList);

      // Check for new wishes and send notification
      const prevWishes = prevWishesRef.current;
      if (wishesList.length > prevWishes.length) {
        const newWish = wishesList.find(wish => !prevWishes.some(prevWish => prevWish.id === wish.id));
        if (newWish && Notification.permission === "granted") {
          const notification = new Notification("New Wish Added", {
            body: `${newWish.material} -> ${newWish.machine} > ${newWish.pipe} (${newWish.urgency})`,
            requireInteraction: true
          });

          notification.onclick = () => {
            window.open('/wishlist');
          };
        }
      }
      prevWishesRef.current = wishesList;
    });
  }, []);


  const handleDelete = (wishId) => {
    const wishRef = ref(database, `wishes/${wishId}`);
    remove(wishRef);
  };

  return (
    <div className="container">
      <h1>Wish List</h1>
      <ul className="wishlist">
        {wishes.map((wish) => (
          <li key={wish.id} className="wish-item">
            {wish.material} --- {wish.machine} - {wish.pipe} ({wish.urgency})
            <button onClick={() => handleDelete(wish.id)} className="delete-button">X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishListPage;
