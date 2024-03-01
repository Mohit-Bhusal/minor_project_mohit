import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Dashboard = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/items/getItems"
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = async () => {
    removeCookie("refreshToken", { path: "/", domain: "localhost" });
    removeCookie("accessToken", { path: "/", domain: "localhost" });
    removeCookie("id", { path: "/", domain: "localhost" });

    navigate("/");
  };

  const onSubmitForm = async (data) => {
    const updatedQuantities = {};
    console.log(data);

    for (const item of items) {
      const enteredQuantity = parseInt(data[item.item_id] || 0);
      console.log(data);
      console.log("ENTER", enteredQuantity);

      if (enteredQuantity > 0) {
        const totalQuantity = item.quantity;

        if (enteredQuantity > totalQuantity) {
          alert(`Entered quantity is greater than total available quantity.`);
          return;
        }

        updatedQuantities[item.item_id] = totalQuantity - enteredQuantity;
      } else if (enteredQuantity < 0) {
        alert("Please enter valid quantity");
      }
    }

    setLoading(true); // Set loading to true during update

    // Update quantities
    try {
      await axios.post("http://localhost:5001/items/updateQuantity", {
        data: updatedQuantities,
      });

      // Add total
      for (const itemId in data) {
        const enteredQuantity = parseInt(data[itemId] || 0);
        if (enteredQuantity > 0) {
          await axios.post("http://localhost:5001/items/addTotal", {
            userId: cookies.id,
            itemId: itemId,
            quantity: enteredQuantity,
          });
        }
      }
      reset();
    } catch (error) {
      console.error("Error updating quantities:", error);
    } finally {
      setLoading(false); // Set loading to false after update
    }
  };

  // Fetch updated items after quantities have been updated
  useEffect(() => {
    const fetchUpdatedItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/items/getItems"
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching updated items:", error);
      }
    };

    // Fetch updated items only when the loading state changes
    if (!loading) {
      fetchUpdatedItems();
    }
  }, [loading]);

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="bg-yellow-500 p-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>
      <div className="container mx-auto mt-4 bg-white p-4 rounded-md shadow-md">
        <form noValidate onSubmit={handleSubmit(onSubmitForm)}>
          <div className="grid grid-cols-3 gap-4">
            {/* Table for Name, Quantity Input, and Total Quantity */}
            {items.map((item) => (
              <div key={item.item_id} className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  {item.itemName} - Enter Quantity:
                </label>
                <input
                  className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                  type="number"
                  id={item.item_id}
                  {...register(item.item_id)}
                />
                <p className="mt-2">Total Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded-md mt-4"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Updating..." : "Submit All Quantities"}
          </button>
        </form>
        <div>
          <p className="text-gray-600 text-sm">
            See access history?{" "}
            <Link className="text-blue-500 underline" to="/see">
              seee
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-2xl absolute bottom-8 right-8"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
