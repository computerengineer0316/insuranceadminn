import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
AdminsList.propTypes = {
  lob: PropTypes.string.isRequired,
};

function AdminsList({ userType, sendData, sendUsertype, lob }) {
  const [admins, setAdmins] = useState([]);
  const [assigned_agent, setAssigned_agent] = useState('');
  const usertype = userType;
  const userdata = JSON.parse(localStorage.getItem('user'));

  console.log('usertype data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', userdata)

  const assignedagentdata = (e) => {
    setAssigned_agent(e.target.value);
    sendData(e.target.value)
    sendUsertype(usertype)
  }

  useEffect(() => {
    if (userdata?.usertype == '64622470b201a6f07b2dff22') {
      fetch('https://insuranceapi-3o5t.onrender.com/api/adminlist', {
        method: 'POST',
        body: JSON.stringify({ usertype, lob }),
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            console.log(data.data, "admins data >>>>>>>>>>>>>>>>>>>>>>>>>>> ")
            setAdmins(data.data);
          }
          else {
            console.error('Invalid data format for admins:', data);
          };
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    } else if (userdata?.usertype == '646224deb201a6f07b2dff32' || userdata?.usertype == "6462250eb201a6f07b2dff3a"
      || userdata?.usertype == "646224eab201a6f07b2dff36" || userdata?.usertype == "646224deb201a6f07b2dff32" ||
      userdata?.usertype == '64622526b201a6f07b2dff3e') {
      fetch('https://insuranceapi-3o5t.onrender.com/api/get_assigned_staff', {
        method: 'POST',
        body: JSON.stringify({ usertype, lob }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            let dt = data.data
            let dtaArr = []
            for (let i = 0; i < dt.length; i++) {
              dtaArr.push(dt[i].filteredSA);
            }
            console.log(data.data, "supervisor assigined staff data >>>>>>>>>>>>>>||||||||||||||||||||||||>>>>>>>>>>>>>>> ")
            setAdmins(dtaArr);
          }
          else {
            console.error('Invalid data format for admins:', data);
          };
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    }
  }, [userType]);

  console.log('admins>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', admins)

  return (
    <select onChange={assignedagentdata}>
      <option hidden>select</option>
      {admins.map((admin) => (
        <option key={admin._id} value={admin._id}>{admin.name}</option>
      ))}
    </select>
  );
};

AdminsList.propTypes = {
  userType: PropTypes.string.isRequired,
  leadid: PropTypes.string.isRequired,
  sendData: PropTypes.func.isRequired,
  sendUsertype: PropTypes.func.isRequired,
};
export default AdminsList;