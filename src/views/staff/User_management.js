import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const User_management = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [permission, setPermission] = useState([]);
    const [staffid, setStaffid] = useState('');
    const [selectAll, setSelectAll] = useState({})

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (token === '' || token === null || token === undefined) {
            navigate('/login');
        }
        else {
            getModule();
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            copypermission(id);
            setStaffid(id);
        }
    }, []);

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
                setData(data.data);
            });
    };

    const copypermission = (id) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_user_permission/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const result = convertResponse(data.data);
                let moduleObj = {}
                result?.map((permissionItem) => {
                    const collection = []
                    const permissionData = permissionItem?.permission[0]
                    for (const key in permissionData) {
                        if (!(key == '__v' || key == "_id" || key == "user_type_id")) {
                            permissionData[key].length == 7 ? collection.push(true) : collection.push(false)
                        }
                    }
                    if (collection.includes(false)) {
                        moduleObj[permissionItem.module_name] = false
                    } else {
                        moduleObj[permissionItem.module_name] = true
                    }
                })
                setSelectAll(moduleObj)

                const parsedPermission = JSON.stringify(result, null, 2);
                setPermission(JSON.parse(parsedPermission));
            });
    }

    const convertResponse = (response) => {
        const convertedResponse = [];

        for (const module in response[0]) {
            const permission = response[0][module][0];
            const moduleName = module.split('_')[0];

            const convertedModule =
            {
                module_name: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
                permission: [{ ...permission, _id: "64a3b25ba1f5ea6cfdbad390", __v: 0 }]
            };

            convertedResponse.push(convertedModule);
        }

        return convertedResponse;
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
        updatePermission(payload);
    };

    const updatePermission = async (permissionData) => {
        try {
            const requestOptions =
            {
                method: 'PUT',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(permissionData),
            };
            const response = await fetch(
                `https://insuranceapi-3o5t.onrender.com/api/update_user_permission_manually/${staffid}`,
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
                    navigate('/User_management?id=' + staffid);
                })
            }
            else {
                swal({
                    title: "Error!",
                    text: result.message,
                    type: "error",
                    icon: "error"
                }).then(() => {
                    navigate('/User_management?id=' + staffid);
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    };


    // const handleSelectAllPermission = () => {
    //     setPermission((prev) => {
    //         const data = [...prev]

    //         const allPermission = [
    //             "create",
    //             "edit",
    //             "delete",
    //             "view",
    //             "download",
    //             "export",
    //             "upload"
    //         ]

    //         const permissions = data.map((item) => item.permission[0])
    //         const checkPermission = permissions.map((item, index) => {
    //             //  Object.keys(item).map((ele, ind) => console.log("permissions:",item[ele] =allPermission, ind) ) 
    //            return item = Object.keys(item).map(ele => {
    //                 if (!["_id", "__v", "user_type_id"].includes(ele)){
    //                     return item[ele] = allPermission
    //                 }
    //            }) 
    //         })

    //         const setPermissionAgain = data.map((item,index) => item.permission[0] = permissions[index])

    //         const setDataAgain = data.map((item,index) =>  {
    //             return {
    //                 module_name : item.module_name,
    //                 permission : [setPermissionAgain[index]]
    //             }
    //         })


    //         return setDataAgain
    //     })
    // }

    const handleSelectAllPermission = () => {
        setPermission((prevPermissions) => {
            const allPermission = ["create", "edit", "delete", "view", "download", "export", "upload"];

            return prevPermissions.map((module) => {
                const updatedPermission = { ...module.permission[0] };

                for (const key in updatedPermission) {
                    if (!["_id", "__v", "user_type_id"].includes(key)) {
                        updatedPermission[key] = allPermission;
                    }
                }

                return {
                    ...module,
                    permission: [updatedPermission],
                };
            });
        });
    };

    const selectAllSubModule = (item, e) => {

        let submodules = item.sub_module
        const allPermission = ["create", "edit", "delete", "view", "download", "export", "upload"];
        const event = {
            target: {
                checked: e.target.checked
            }
        }
        let id = item._id
        for (let j = 0; j < submodules?.length; j++) {
            const element = submodules[j];

            let create = document.getElementById(id + j + 'create')
            create.checked = e.target.checked

            let edit = document.getElementById(id + j + 'edit')
            edit.checked = e.target.checked

            let delet = document.getElementById(id + j + 'delete')
            delet.checked = e.target.checked

            let view = document.getElementById(id + j + 'view')
            view.checked = e.target.checked

            let download = document.getElementById(id + j + 'download')
            download.checked = e.target.checked

            let exportss = document.getElementById(id + j + 'export')
            exportss.checked = e.target.checked

            let upload = document.getElementById(id + j + 'upload')
            upload.checked = e.target.checked

            for (let i = 0; i < allPermission.length; i++) {
                handleCheckboxChange(element.sub_module_name, allPermission[i], event)
            }

        }
    }

    return (
        <div className='table-container'>
            <div className='table-container'>

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
                                <td>
                                    <p>{item.module_name}</p>
                                    Select All
                                    <input
                                        className='mx-2'
                                        defaultChecked={selectAll[item.module_name]}
                                        onClick={(e) => selectAllSubModule(item, e)}
                                        type='checkbox' />
                                </td>
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
                                            <li key={index1}>
                                                <input
                                                    type="checkbox"
                                                    id={item._id + index1 + 'create'}
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
                                                    id={item._id + index1 + 'edit'}
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
                                                    id={item._id + index1 + 'delete'}
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
                                                    id={item._id + index1 + 'view'}
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
                                                    id={item._id + index1 + 'download'}
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
                                                    id={item._id + index1 + 'export'}
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
                                                    id={item._id + index1 + 'upload'}
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
                <button className="btn btn-primary" onClick={handleSubmit} style={{ float: 'right', marginTop: '10px' }}>Submit</button>
            </div>
        </div>
    )
}

export default User_management;
