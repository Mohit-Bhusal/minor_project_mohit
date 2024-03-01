import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const SeeInventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMessage, setLoadMessage] = useState('Loading...');

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/users/getUsers'
        );

        setData(response.data);

        setLoadMessage('Loading...');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user items:', error);
        setLoadMessage("Couldn't find data");
        setLoading(true);
      }
    };

    fetchUserItems();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-5xl font-semibold">{loadMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-12 py-2">
        <h2 className="text-3xl font-medium py-4">Items Taken From Website</h2>
        {data.map((user) => (
          <div key={user.userID} className="px-12">
            <h2 style={styles.header}>User {user.userID} Items</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>UserID</th>
                  <th style={styles.tableHeader}>Item Name</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Date</th>
                  <th style={styles.tableHeader}>Updated Date</th>
                  <th style={styles.tableHeader}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {user.itemsTakenFromWebsite.map((item) => (
                  <tr key={item.item_id}>
                    <td style={styles.tableData}>{user.userID}</td>
                    <td style={styles.tableData}>{item.itemName}</td>
                    <td style={styles.tableData}>{item.quantity}</td>
                    <td style={styles.tableData}>{item.date}</td>
                    <td style={styles.tableData}>
                      {item.updatedDate ? item.updatedDate : 'Taken only once'}
                    </td>
                    <td style={styles.tableData}>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-500 hover:underline"
                      >
                        {user.email}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div className="w-full h-0.5 my-10 bg-gray-300"></div>

        <h2 className="text-3xl font-medium pb-4">
          Items Taken From Inventory
        </h2>
        {data.map((user) => (
          <div key={user.userID} className="px-12">
            <h2 style={styles.header}>User {user.userID} Items</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>UserID</th>
                  <th style={styles.tableHeader}>Item Name</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Date</th>
                  <th style={styles.tableHeader}>Updated Date</th>
                  <th style={styles.tableHeader}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {user.itemsTakenFromInventory.map((item) => (
                  <tr key={item.item_id}>
                    <td style={styles.tableData}>{item.userID}</td>
                    <td style={styles.tableData}>{item.itemName}</td>
                    <td style={styles.tableData}>{item.quantity}</td>
                    <td style={styles.tableData}>{item.date}</td>
                    <td style={styles.tableData}>
                      {item.updatedDate ? item.updatedDate : 'Taken only once'}
                    </td>
                    <td style={styles.tableData}>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-500 hover:underline"
                      >
                        {user.email}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

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
    fontSize: 24,
    fontWeight: 500
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px'
  },
  tableHeader: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    textAlign: 'left',
    width: 'calc(100% / 6)'
  },
  tableData: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    width: 'calc(100% / 6)'
  },
  accessInventory: {
    marginTop: '20px',
    color: '#666',
    fontSize: '14px'
  },
  link: {
    color: '#3498db',
    textDecoration: 'underline'
  }
};
SeeInventory.defaultProps = {
  userID: null
};
export default SeeInventory;
