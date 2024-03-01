import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

const SeeInventory = () => {
  const [issuedItems, setIssuedItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);
  const [loading,setLoading]= useState(true)
  const [loadMessage,setLoadMessage]= useState("Loading...")
  const [cookies, setCookie, removeCookie] = useCookies();

 

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const response = await axios.get('http://localhost:5001/items/see', { params: { userID:  cookies.id} });
        const { issuedItems, returnedItems } = response.data;
        setIssuedItems(issuedItems);
        setReturnedItems(returnedItems);
        console.log(response);
        setLoadMessage("Loading...")
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user items:', error);
        setLoadMessage("Couldn't find data")
        setLoading(true)
      }
    };

    fetchUserItems();
  }, []);

  if(loading){
    return <div className='h-screen flex items-center justify-center'>
      <p className='text-5xl font-semibold'>{loadMessage}</p>
    </div>
  }

  return (
    <>
    <div className='px-12'>
      <h2 style={styles.header}>Issued Items</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Item Name</th>
            <th style={styles.tableHeader}>Quantity</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Updated Date</th>
          </tr>
        </thead>
        <tbody>
          {issuedItems.map((item) => (
            <tr key={item.item_id}>
              <td style={styles.tableData}>{item.itemName}</td>
              <td style={styles.tableData}>{item.quantity}</td>
              <td style={styles.tableData}>{item.date}</td>
              <td style={styles.tableData}>{item.updatedDate ? item.updatedDate: "Taken only once"}</td>

            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={styles.header}>Returned Items</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Item Name</th>
            <th style={styles.tableHeader}>Quantity</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Updated Date</th>
          </tr>
        </thead>
        <tbody>
          {returnedItems.map((item) => (
            <tr key={item.item_id}>
              <td style={styles.tableData}>{item.itemName}</td>
              <td style={styles.tableData}>{item.quantity}</td>
              <td style={styles.tableData}>{item.date}</td>
              <td style={styles.tableData}>{item.updatedDate ? item.updatedDate: "Taken only once"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p style={styles.accessInventory}>
          Access Inventory?{' '}
          <Link style={styles.link} to="/dashboard">
            Dashboard
          </Link>
        </p>
      </div>
    </div>
    </>

  );
};

const styles = {
  header: {
    marginBottom: '10px',
    color: '#333',
    fontSize:32,
    fontWeight:700
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  tableHeader: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  tableData: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  accessInventory: {
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
  link: {
    color: '#3498db',
    textDecoration: 'underline',
  },
};
SeeInventory.defaultProps = {
  userID: null,
};
export default SeeInventory;
