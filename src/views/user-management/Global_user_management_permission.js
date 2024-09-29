import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const ViewBank = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [permission, setPermission] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [user_type_id, setUsertypeid] = useState('');

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token === '' || token === null || token === undefined) {
      navigate('/login');
    }
    else {
      getModule();
      userTypeList();
    }
  }, []);

  const getPermission = (usertype) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllPermission/${usertype}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data)
        setPermission(data.data);
      });
  }


  const getModule = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/getmodule', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data)
        setData(data.data);
      });
  };

  const updatePermission = async (permissionData) => {

    console.log("permissionData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", permissionData)
    // return false;

    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissionData),
      };
      const response = await fetch(
        `https://insuranceapi-3o5t.onrender.com/api/update_model_permission`,
        requestOptions
      );
      const result = await response.json();
      if (result.status === 200) {
        swal({
          title: "Success!",
          text: result.message,
          type: "success",
          icon: "success"
        }).then(() => {
          // window.location.href = '/global-user-management-permissions';
          getModule();
          userTypeList();
        })
      }
      else {
        swal({
          title: "Error!",
          text: result.message,
          type: "error",
          icon: "error"
        }).then(() => {
          window.location.href = '/global-user-management-permissions';
        })
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleCheckboxChange = (moduleId, permissionType, event) => {
    const checked = event.target.checked;

    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        sub_module: item.sub_module.map((subItem) => {
          if (subItem.sub_module_name === moduleId) {
            return {
              ...subItem,
              [permissionType]: checked ? 1 : 0,
            };
          }
          return subItem;
        }),
      }))
    );

    setPermission((prevPermissions) =>
      prevPermissions.map((item) => {
        if (item.module_name === moduleId) {

          const updatedPermission = {
            ...item,
            permission: [
              {
                ...item.permission[0],
                [moduleId]: [permissionType],
              },
            ],
          };
          return updatedPermission;
        }
        return item;
      })
    );
  };

  const handleSubmit = () => {
    const payload = {};
    data.forEach((item) => {
      const modulePermissions = [];

      item.sub_module.forEach((subItem) => {
        const permissionObject = {
          [subItem.sub_module_name]: [],
        };

        Object.entries(subItem).forEach(([key, value]) => {
          if (key !== 'sub_module_name') {
            permissionObject[subItem.sub_module_name].push({
              key: key,
              value: value ? 1 : 0,
            });
          }
        });

        modulePermissions.push(permissionObject);
      });
      payload[item.module_name] = modulePermissions;
    });
    payload['user_type_id'] = user_type_id;
    updatePermission(payload);
  };

  const userTypeList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_user_type`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setUserTypes(data.data);
      });
  }

  const usertypedt = (usertype) => {
    setUsertypeid(usertype);
    getPermission(usertype);
  }

  console.log("permission>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", permission)
  console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data)


  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="card card-default">
            <div className="card-header justify-content-center">
              <div className='row'>
                <div className='col-md-6'>
                  <h4>Global User Management System</h4>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label>User Type</label>
                    <select className="form-control" name="usertype" onChange={(e) => usertypedt(e.target.value)} required>
                      <option hidden>Select User Type</option>
                      {
                        userTypes.length > 0 &&
                        userTypes.map((item, index) => (
                          <option key={index} value={item._id}>{item.usertype}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }} onClick={handleSubmit}>Submit</button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <table className="table table-bordered admin_abcdsd">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Task And Activity</th>
                        <th>Create</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>View</th>
                        <th>Download</th>
                        <th>Export</th>
                        <th>Upload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.flatMap((item, index) => (
                        <tr key={index}>
                          <td>{item.module_name}</td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                <li key={index1}>{item1.sub_module_name}</li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                console.log(
                                  permission
                                    .filter((item2) => item2.module_name === item.module_name)
                                    .flatMap((item2) => {
                                      const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                      console.log("subModuleName", subModuleName)
                                      const userPermission = item2.permission[0];
                                      console.log("userPermission", userPermission)
                                      if (userPermission && userPermission[subModuleName]) {
                                        return userPermission[subModuleName].includes('create');

                                      }
                                      return false;
                                    })[0], ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"),
                                <li key={index1}>

                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      permission
                                        .filter((item2) => item2.module_name === item.module_name)
                                        .flatMap((item2) => {
                                          const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                          const userPermission = item2.permission[0];
                                          if (userPermission && userPermission[subModuleName]) {
                                            return userPermission[subModuleName].includes('create');
                                          }
                                          return false;
                                        })[0]
                                    }
                                    onClick={(event) => handleCheckboxChange(item1.sub_module_name, 'create', event)}
                                  />
                                </li>
                              ))}


                            </ul>
                          </td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                <li key={index1}>
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      permission
                                        .filter((item2) => item2.module_name === item.module_name)
                                        .flatMap((item2) => {
                                          const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                          const userPermission = item2.permission[0];
                                          if (userPermission && userPermission[subModuleName]) {
                                            return userPermission[subModuleName].includes('edit');
                                          }
                                          return false;
                                        })[0]
                                    }
                                    onClick={(event) => handleCheckboxChange(item1.sub_module_name, 'edit', event)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                <li key={index1}>
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      permission
                                        .filter((item2) => item2.module_name === item.module_name)
                                        .flatMap((item2) => {
                                          const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                          const userPermission = item2.permission[0];
                                          if (userPermission && userPermission[subModuleName]) {
                                            return userPermission[subModuleName].includes('delete');
                                          }
                                          return false;
                                        })[0]
                                    }
                                    onClick={(event) => handleCheckboxChange(item1.sub_module_name, 'delete', event)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                <li key={index1}>
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      permission
                                        .filter((item2) => item2.module_name === item.module_name)
                                        .flatMap((item2) => {
                                          const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                          const userPermission = item2.permission[0];
                                          if (userPermission && userPermission[subModuleName]) {
                                            return userPermission[subModuleName].includes('view');
                                          }
                                          return false;
                                        })[0]
                                    }
                                    onClick={(event) => handleCheckboxChange(item1.sub_module_name, 'view', event)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                <li key={index1}>
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      permission
                                        .filter((item2) => item2.module_name === item.module_name)
                                        .flatMap((item2) => {
                                          const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                          const userPermission = item2.permission[0];
                                          if (userPermission && userPermission[subModuleName]) {
                                            return userPermission[subModuleName].includes('download');
                                          }
                                          return false;
                                        })[0]
                                    }
                                    onClick={(event) => handleCheckboxChange(item1.sub_module_name, 'download', event)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                <li key={index1}>
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      permission
                                        .filter((item2) => item2.module_name === item.module_name)
                                        .flatMap((item2) => {
                                          const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                          const userPermission = item2.permission[0];
                                          if (userPermission && userPermission[subModuleName]) {
                                            return userPermission[subModuleName].includes('export');
                                          }
                                          return false;
                                        })[0]
                                    }
                                    onClick={(event) => handleCheckboxChange(item1.sub_module_name, 'export', event)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {item.sub_module.map((item1, index1) => (
                                <li key={index1}>
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      permission
                                        .filter((item2) => item2.module_name === item.module_name)
                                        .flatMap((item2) => {
                                          const subModuleName = item1.sub_module_name.toLowerCase().split(' ').join('_');
                                          const userPermission = item2.permission[0];
                                          if (userPermission && userPermission[subModuleName]) {
                                            return userPermission[subModuleName].includes('upload');
                                          }
                                          return false;
                                        })[0]
                                    }
                                    onClick={(event) => handleCheckboxChange(item1.sub_module_name, 'upload', event)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewBank