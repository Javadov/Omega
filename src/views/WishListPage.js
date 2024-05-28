// src/WishListPage.js
import React, { useEffect, useState, useRef } from "react";
import { database } from "../components/firebase";
import { ref, onValue, remove } from "firebase/database";
import FooterView from "../sections/FooterView";


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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getUrgencyClassName = (urgency) => {
    switch (urgency) {
      case 'ASAP':
        return 'urgency-asap';
      case 'om 15 min':
        return 'urgency-15min';
      case 'om 30 min':
        return 'urgency-30min';
      case 'om 1 timme':
        return 'urgency-1timme';
      case 'om 2 timme':
        return 'urgency-1timme';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <h1>ÖNSKELISTA</h1>

      <ul className="wishlist">
        {wishes.map((wish) => (
          <li key={wish.id} className="wish-item">
            <div className="wish-material">{wish.material}</div> <div className={`wish-urgency ${getUrgencyClassName(wish.urgency)}`}>{wish.urgency} <span>{formatTimestamp(wish.timestamp)}</span></div> <i className="fa-solid fa-arrow-right"></i> <div className="wish-machine">{wish.machine}</div> <i className="fa-solid fa-angle-right"></i> <div className="wish-pipe">{wish.pipe}</div>  
            <button onClick={() => handleDelete(wish.id)} className="delete-button btn btn-success"><i class="fa-solid fa-check"></i></button>
          </li>
        ))}
      </ul>
      
      <FooterView />
    </div>
  );
};

export default WishListPage;
