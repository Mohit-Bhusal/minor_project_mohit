import React, { useState, useEffect } from "react";
import axios from "axios";

const SeeInventory = () => {
  const [issuedItems, setIssuedItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issuedResponse = await axios.get("http://localhost:5001/items/getIssuedItems");
        console.log(issuedResponse);
        const returnedResponse = await axios.get("http://localhost:5001/items/getReturnedItems");
        setIssuedItems(issuedResponse.data);
        setReturnedItems(returnedResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Issued Items:</h2>
      <ul>
        {issuedItems.map((item) => (
          <li key={item._id}>
            UserID: {item.userID}, Item ID: {item.item_id}, Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <h2>Returned Items:</h2>
      <ul>
        {returnedItems.map((item) => (
          <li key={item._id}>
            UserID: {item.userID}, Item ID: {item.item_id}, Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeeInventory
