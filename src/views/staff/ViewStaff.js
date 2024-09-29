import React from 'react';
import { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Modal, Button } from 'react-bootstrap';
import Multiselect from "multiselect-react-dropdown";

const ViewStaff = () => {
    const navigate = useNavigate();
    const [listStaff, setListStaff] = useState([]);
    const [perPage] = useState(15);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [visibleedit, setVisibleedit] = useState(false);
    const [visibleSubuserEdit, setVisibleSubuserEdit] = useState(false);
    const [staff, setStaff] = useState([]);
    const [staff_id, setStaff_id] = useState([]);
    const [staffid, setStaffid] = useState('');
    const [masterpermission, setMasterpermission] = useState([]);
    const [salist, setSAlist] = useState([]);
    const [sa_id, setSA_id] = useState([]);
    const [dclist, setDclist] = useState([]);
    const [dc_id, setDC_id] = useState([]);
    const [pilist, setPIlist] = useState([]);
    const [pi_id, setPI_id] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [staffName, setStaffName] = useState('all');
    const [searchname, setSearchname] = useState('');
    const [searchemail, setSearchemail] = useState('');
    const [searchphone, setSearchphone] = useState('');
    const [subUserType, setSubuserType] = useState([])
    const [subusertypeId, setsubusertypeId] = useState('')
    const [selelctedSubuserType, setSelectedSubUserType] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistStaff(page, perPage);
            stafflist();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission[0] || {};
            setMasterpermission(master_permission);
            getsalist();
            getdclist();
            getpilist();
            getAllUserTypes();
        }
    }, []);

    useEffect(() => {
        getlistStaff(page, perPage);
    }, [searchname, searchemail, searchphone, staffName]);

    const getlistStaff = (page, perPage) => {

        setListStaff([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getStaff?page=${page}&limit=${perPage}&userType=${staffName}&name=${searchname}&email=${searchemail}&phone=${searchphone}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;

                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                const list_dt = list.length;
                const list_obj = [];
                for (let i = 0; i < list_dt; i++) {
                    const lob = list[i]['line_of_business'];
                    const lob_dt = lob?.length;
                    const lob_obj = [];
                    for (let i = 0; i < lob_dt; i++) {
                        const lob_obj1 = lob[i]['lob_name'];
                        lob_obj.push(lob_obj1);
                    }
                    var lobValues = lob_obj.join(',');

                    const loc = list[i]['location'];
                    const loc_dt = loc?.length;
                    const loc_obj = [];
                    for (let i = 0; i < loc_dt; i++) {
                        const loc_obj1 = loc[i]['loc_name'];
                        loc_obj.push(loc_obj1);
                    }
                    var locValues = loc_obj.join(',');

                    const business_type = list[i]['admin_business_type'];
                    const business_type_dt = business_type?.length;
                    const business_type_obj = [];
                    for (let i = 0; i < business_type_dt; i++) {
                        const business_type_obj1 = business_type[i]['type'];
                        business_type_obj.push(business_type_obj1);
                    }
                    var business_typeValues = business_type_obj.join(',');
                    const list_obj1 = {
                        id: list[i]['_id'],
                        name: list[i].name,
                        email: list[i].email,
                        phone: list[i].mobile,
                        lob: lobValues ? lobValues : "",
                        loc: locValues ? locValues : "",
                        status: list[i]['status'] ? list[i]['status'] : "",
                        admin_business_type: business_typeValues ? business_typeValues : "",
                        // usertype:list[i].usertype !='client' ? list[i].usertype[0].usertype : "Customer"
                        usertype: list[i].usertype[0]?.usertype



                    };
                    list_obj.push(list_obj1);
                }
                setListStaff(list_obj);

            });
    }


    const stafflist = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/stafflist`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const staff = data.data;
                const staff_dt = staff.length;
                const staff_obj = [];
                for (let i = 0; i < staff_dt; i++) {
                    const staff_arr_obj = { _id: staff[i]['_id'], name: staff[i]['name'] };
                    staff_obj.push(staff_arr_obj);
                }
                setStaff(staff_obj);
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setPage(selectedPage);
        getlistStaff(selectedPage, perPage);
    };

    const deactivateStaff = (id, status, usertype) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusStaff/${id}/${status}?usertype=${usertype}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getlistStaff(page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getlistStaff(page, perPage);
                    });
                }
            });
    }

    const assign_staff = (id) => {
        setStaffid(id)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getStaffDetailsbyid/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const staff = data.data;
                console.log('staff>>>>>>>>>>>>>>>>>>>>', staff)
                const sa_staff_dt = staff[0].assignSalesAdvisor;
                if (sa_staff_dt != undefined) {
                    const sa_staff_dt1 = sa_staff_dt.length;
                    const sa_staff_obj = [];
                    for (let i = 0; i < sa_staff_dt1; i++) {
                        const sa_staff_arr_obj = { _id: sa_staff_dt[i]['_id'], name: sa_staff_dt[i]['name'] };
                        sa_staff_obj.push(sa_staff_arr_obj);
                    }
                    setSA_id(sa_staff_dt);
                }
                // console.log('sa_id_id>>>>>>>>>>>>>>>>>>>>',sa_id)
                const dc_staff_dt = staff[0].assignDacumentChaser;
                if (dc_staff_dt != undefined) {
                    const dc_staff_dt1 = dc_staff_dt.length;
                    const dc_staff_obj = [];
                    for (let i = 0; i < dc_staff_dt1; i++) {
                        const dc_staff_arr_obj = { _id: dc_staff_dt[i]['_id'], name: dc_staff_dt[i]['name'] };
                        dc_staff_obj.push(dc_staff_arr_obj);
                    }
                    setDC_id(dc_staff_obj);
                }
                // console.log('dc_id_id>>>>>>>>>>>>>>>>>>>>',dc_id)
                const pi_staff_dt = staff[0].assignPolicyIssuer;
                if (pi_staff_dt != undefined) {
                    const pi_staff_dt1 = pi_staff_dt.length;
                    const pi_staff_obj = [];
                    for (let i = 0; i < pi_staff_dt1; i++) {
                        const pi_staff_arr_obj = { _id: pi_staff_dt[i]['_id'], name: pi_staff_dt[i]['name'] };
                        pi_staff_obj.push(pi_staff_arr_obj);
                    }
                    setPI_id(pi_staff_obj);
                }
                // console.log('pi_id_id>>>>>>>>>>>>>>>>>>>>',pi_id)
                setVisibleedit(true);
            });
    }


    // const updateSubmit = (e) => {
    //     e.preventDefault();
    //     const assign_staff_ids = staff_id;
    //     const id = staffid;
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             assign_staff_id: assign_staff_ids
    //         }),
    //     };
    //     fetch(`https://insuranceapi-3o5t.onrender.com/api/assignStaff/${id}`, requestOptions)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.status === 200)
    //             {
    //                 swal({
    //                     title: "Success",
    //                     text: data.message,
    //                     icon: "success",
    //                     button: "Ok",
    //                 }).then(() => {
    //                     setVisibleedit(false);
    //                     getlistStaff(page, perPage);
    //                 });
    //             }
    //             else
    //             {
    //                 swal({
    //                     title: "Error",
    //                     text: data.message,
    //                     icon: "error",
    //                     button: "Ok",
    //                 }).then(() => {
    //                     setVisibleedit(false);
    //                     getlistStaff(page, perPage);
    //                 });
    //             }
    //         }
    //     );
    // }

    const getsalist = async () => {
        await fetch('https://insuranceapi-3o5t.onrender.com/api/getAllPolicyIssuer?userType=saleAdvisor', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                const sa_obj = [];
                const sa_dt = data.data?.length;
                // for (let i = 0; i < sa_dt; i++) {
                //     const sa_arr_obj = { _id: data.data[i]['_id'], name: data.data[i]['name'] };
                //     sa_obj.push(sa_arr_obj);
                // }
                if (data.data != undefined) {
                    setSAlist(data.data);
                }

            });
    }

    // console.log('sa>>>>>>>>>>>>>>>>>>>>',salist);




    const getdclist = async () => {
        await fetch('https://insuranceapi-3o5t.onrender.com/api/getAllPolicyIssuer?userType=dacumentsChaser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                const dc_obj = [];
                const dc_dt = data.data.length;
                // for (let i = 0; i < dc_dt; i++) {
                //     const dc_arr_obj = { _id: data.data[i]['_id'], name: data.data[i]['name'] };
                //     dc_obj.push(dc_arr_obj);
                // }
                setDclist(data.data);
            });
    }

    // console.log('dc>>>>>>>>>>>>>>>>>>>>',dclist);

    const getpilist = async () => {
        await fetch('https://insuranceapi-3o5t.onrender.com/api/getAllPolicyIssuer?userType=policyIsuser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                const pi_obj = [];
                const pi_dt = data.data.length;
                for (let i = 0; i < pi_dt; i++) {
                    const pi_arr_obj = { _id: data.data[i]['_id'], name: data.data[i]['name'] };
                    pi_obj.push(pi_arr_obj);
                }
                setPIlist(pi_obj);
            });
    }

    // console.log('pi>>>>>>>>>>>>>>>>>>>>',pilist);

    const handlesaChange = (selectedOption) => {
        setSA_id(selectedOption);
    };

    const handledcChange = (selectedOption) => {
        setDC_id(selectedOption);
    };

    const handlepiChange = (selectedOption) => {
        setPI_id(selectedOption);
    };

    const update = (e) => {
        e.preventDefault();

        const sa_ids = sa_id?.map((item) => item._id);
        const dc_ids = dc_id?.map((item) => item._id);
        const pi_ids = pi_id?.map((item) => item._id);

        console.log('sa_ids>>>>>>>>>>>>>>>>>>>>', sa_ids == undefined ? sa_id?.map((item) => item._id) : sa_id?.map((item) => item._id));
        console.log('dc_ids>>>>>>>>>>>>>>>>>>>>', dc_ids == undefined ? dc_id?.map((item) => item._id) : dc_id?.map((item) => item._id));
        console.log('pi_ids>>>>>>>>>>>>>>>>>>>>', pi_ids == undefined ? pi_id?.map((item) => item._id) : pi_id?.map((item) => item._id));


        const id = staffid;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assignSalesAdvisor: sa_ids == undefined ? sa_id?.map((item) => item._id) : sa_id?.map((item) => item._id),
                assignDacumentChaser: dc_ids == undefined ? dc_id?.map((item) => item._id) : dc_id?.map((item) => item._id),
                assignPolicyIssuer: pi_ids == undefined ? pi_id?.map((item) => item._id) : pi_id?.map((item) => item._id)
            }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/assignStaff/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        setVisibleedit(false);
                        getlistStaff(page, perPage, staffName);
                    });
                }
                else {
                    swal({
                        title: "Error",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        setVisibleedit(false);
                        getlistStaff(page, perPage, staffName);
                    });
                }
            }
            )
    }
    const getAllUserTypes = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_user_type/1/100`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const staff = data.data;
                console.log(data.data, ">>>>>>userTypes")
                // const staff_dt = staff.length;
                // const staff_obj = [];
                setUserTypes(staff);
            });

    }
    // const setStaffuserType = (staffName) =>{
    //     setStaffName(staffName)
    //     getlistStaff(page, perPage,staffName)
    // }
    const AssignSubUserType = (usrtype, id) => {
        setsubusertypeId(id)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getSubUserTypes?usertype=${usrtype}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const subUsertypes = data.data;
                console.log(data.data, ">>>>>>userTypes")
                // const staff_dt = staff.length;
                const staff_obj = [];
                for (let i = 0; i < subUsertypes.length; i++) {
                    staff_obj.push({
                        _id: subUsertypes[i]._id,
                        usertype: subUsertypes[i].usertype
                    })

                }
                setSubuserType(staff_obj);
            });

        fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserMultiRole?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const subUsertypes = data.data;
                console.log(data.data, ">>>>>> default userTypes")
                // const staff_dt = staff.length;
                const staff_obj = [];
                // for (let i = 0; i < subUsertypes.length; i++) {
                //     staff_obj.push({
                //         _id: subUsertypes[i]._id,
                //         usertype: subUsertypes[i].usertype
                //     })

                // }
                setSelectedSubUserType(data.data[0]?.subusertypes);
            });
        setVisibleSubuserEdit(true)
    }
    const startFrom = (page - 1) * perPage;

    const UpdateSubstaff = () => {
        // 
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: subusertypeId,
                userTypeData: selelctedSubuserType
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateSubUserTypes`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data, "last data")
                if (data.status == 200) {
                    swal({
                        title: "success",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                } else {
                    swal({
                        title: "error",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });

    }

    return (
        <div className="container">

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Staff List</h4>
                                </div>

                                <div className="col-md-6">
                                    {masterpermission.staff?.includes('create') ?
                                        <a href="/AddStaff" className="btn btn-primary" style={{ float: 'right' }}>Add Staff</a>
                                        : ''}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                                <div className='col-lg-3'>
                                    <label><strong>Search By Name</strong></label><br />
                                    <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchname(e.target.value)} />
                                </div>
                                <div className='col-lg-3'>
                                    <label><strong>Search By Email</strong></label><br />
                                    <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchemail(e.target.value)} />
                                </div>
                                <div className='col-lg-3'>
                                    <label><strong>Search By Phone</strong></label><br />
                                    <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchphone(e.target.value)} />
                                </div>
                                <div className='col-lg-3'>
                                    <label><strong>Select User Type</strong></label><br />
                                    <select className='form-control'
                                        onChange={(e) => setStaffName(e.target.value)}
                                        value={staffName}
                                    >
                                        <option hidden>Select User Type</option>
                                        <option value="all">All</option>
                                        {
                                            userTypes?.map((item, index) => (
                                                <option key={index} value={item.usertype}>{item.usertype}</option>
                                            ))
                                        }
                                        {/* <option value="Customer">Customers</option> */}

                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sr No.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Line Of Business</th>
                                            <th>Location</th>
                                            <th>Usertype</th>
                                            <th>Business Type</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listStaff?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{startFrom + index + 1}</td>
                                                    <td>{item?.name != null ? item.name : '-'}</td>
                                                    <td>{item?.email}</td>
                                                    <td>{item?.phone}</td>
                                                    <td>{item?.lob}</td>
                                                    <td>{item.loc}</td>
                                                    <td>{item.usertype}</td>
                                                    <td>{item.admin_business_type}</td>
                                                    <td>
                                                        {masterpermission.staff?.includes('edit') && (
                                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                                <a href={`/EditStaff?id=${item.id}?usertype=${item.usertype}`} className="btn btn-primary">Edit</a>
                                                            </div>
                                                        )}
                                                        {' '}

                                                        {masterpermission.staff?.includes('edit') && (
                                                            item.usertype != "User" ? (
                                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <a href={`/User_management?id=${item.id}`} className="btn btn-info">User Management</a>
                                                                </div>) : ("")

                                                        )}
                                                        {' '}
                                                        {masterpermission.staff?.includes('delete') && (
                                                            <>
                                                                {
                                                                    item.status === 1 ?
                                                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivateStaff(item.id, 0, item.usertype) }}>Deactivate</button></div> :
                                                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivateStaff(item.id, 1, item.usertype) }}>Activate</button></div>
                                                                }
                                                            </>
                                                        )}
                                                        {' '}
                                                        {masterpermission.staff?.includes('edit') && (
                                                            <>
                                                                {
                                                                    item.usertype == "Supervisor" ?
                                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                                            <button onClick={() => { assign_staff(item.id); }} className="btn btn-primary">Assign Staff</button>
                                                                        </div> : ''
                                                                }
                                                            </>
                                                        )}
                                                        {masterpermission.staff?.includes('edit') && (
                                                            <>
                                                                {
                                                                    item.usertype == "Supervisor" || item.usertype == "Sales Advisor" || item.usertype == "Document Chaser" || item.usertype == "Policy Issuer" ?
                                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                                            <button onClick={() => AssignSubUserType(item.usertype, item.id)} className="btn btn-warning mx-1">Multi User</button>
                                                                        </div> : ''
                                                                }
                                                            </>
                                                        )}
                                                        {/* { masterpermission.staff?.includes('edit') && (
                                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                                        <a href={`/User_management?id=${item.id}`} className="btn btn-success">Change Password</a>
                                                                    </div>
                                                                    )}
                                                                    {' '} */}

                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={handlePageClick}
                                    containerClassName={"pagination justify-content-end"}
                                    pageClassName={"page-item"}
                                    pageLinkClassName={"page-link"}
                                    previousClassName={"page-item"}
                                    previousLinkClassName={"page-link"}
                                    nextClassName={"page-item"}
                                    nextLinkClassName={"page-link"}
                                    breakClassName={"page-item"}
                                    breakLinkClassName={"page-link"}
                                    activeClassName={"active"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Staff</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={update}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Sales Advisor</strong></label>
                                                        {/* <Multiselect
                                                        options={staff}
                                                        selectedValues={staff_id}
                                                        onSelect={handleChange}
                                                        onRemove={handleChange}
                                                        displayValue="name"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007BFF" } }}
                                                    /> */}
                                                        <Multiselect
                                                            options={salist}
                                                            selectedValues={sa_id}
                                                            onSelect={handlesaChange}
                                                            onRemove={handlesaChange}
                                                            displayValue="name"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007BFF" } }}
                                                            showArrow={true}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Document Chaser</strong></label>
                                                        <Multiselect
                                                            options={dclist}
                                                            selectedValues={dc_id}
                                                            onSelect={handledcChange}
                                                            onRemove={handledcChange}
                                                            displayValue="name"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007BFF" } }}
                                                            showArrow={true}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Policy Issuer</strong></label>
                                                        <Multiselect
                                                            options={pilist}
                                                            selectedValues={pi_id}
                                                            onSelect={handlepiChange}
                                                            onRemove={handlepiChange}
                                                            displayValue="name"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007BFF" } }}
                                                            showArrow={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size='lg' show={visibleSubuserEdit} onHide={() => setVisibleSubuserEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sub User Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Select Sub User</strong></label>

                                                        <Multiselect
                                                            options={subUserType}
                                                            selectedValues={selelctedSubuserType}
                                                            onSelect={(e) => setSelectedSubUserType(e)}
                                                            onRemove={(e) => setSelectedSubUserType(e)}
                                                            displayValue="usertype"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007BFF" } }}
                                                            showArrow={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div type="submit" onClick={() => UpdateSubstaff()} className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisibleSubuserEdit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ViewStaff
