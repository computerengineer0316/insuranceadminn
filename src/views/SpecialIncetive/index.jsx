import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ValidatreAddSpecialIntive } from 'src/utils/validators';
const Index = () => {
    const [state, setState] = useState({
        perPage: 10,
        pageCount: 0,
        page: 1,
        showAddModal: false,
        locationlist: [],
        SpecialIncentive: [],
        showEditModal: false,
        editData: {},
        lob: [],
        selectedlob: [],
        rolelist: [],
        userlist: [],
        selectedroles: [],
        selectedUsers: [],
        policytypes: ["Close", "Amount"],
        policy_type: "Close",
        incetivetypes: ["Value", "Percentage"],
        selectedlocation: [],
        discountType: [{ name: 'New', Value: "New" }, { name: 'Renewal', Value: "Renewal" }],
        selectedItem: null,
        showSelecteddata: false,
        start_time: new Date(),
        end_time: new Date()
    });

    const setStateValue = (key, value) => {
        console.log("key", key);
        if (key === "editData.start_time" || key === "editData.end_time") {
            setState((prevState) => ({ ...prevState, editData: { ...prevState.editData, [key.split('.')[1]]: value } }));
            return;
        }
        setState((prevState) => ({ ...prevState, [key]: value }));
    };
    const handleShow = (selected) => {
        setState((prevState) => ({ ...prevState, selectedItem: selected, showSelecteddata: !state.showSelecteddata }));
    };
    const handleClose = () => {
        setState((prevState) => ({ ...prevState, selectedItem: null, showSelecteddata: false }));
    };
    const pad = (number) => number.toString().padStart(2, '0');

    const formatDateTimeLocal = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // getMonth() is zero-based
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getCurrentDateTimeLocal = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getLocationList = async () => {
        const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locData = data.data.map(loc => ({ label: loc.location_name, value: loc._id }));
                setStateValue('locationlist', locData);
            });
    };

    const lobList = () => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        const lob = userdata.line_of_business;
        if (lob.length > 0) {
            const lobList = lob.map(l => ({ label: l.lob_name, value: l.lob_id }));
            setStateValue('lob', lobList);
        } else {
            const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const lobList = data.data.map(l => ({ label: l.line_of_business_name, value: l._id }));
                    setStateValue('lob', lobList);
                });
        }
    };

    const getSpecialIncentives = async (page, perPage) => {
        const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getSpecialIncentives?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setStateValue('SpecialIncentive', data.data);
                setStateValue('pageCount', Math.ceil(data.count / state.perPage));
            });
    };

    const AddSpecialIncentive = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const description = data.get('description');
        let obj = {}
        obj.description = description
        obj.locations = state.selectedlocation.map(item => item.value)
        obj.lobs = state.selectedlob.map(item => item.value)
        obj.roles = state.selectedroles.map(item => item.value)
        obj.users = state.selectedUsers.map(item => item.value)
        obj.start_time = new Date(state.start_time)
        obj.end_time = new Date(state.end_time)
        obj.policy_type = data.get('policy_type')
        obj.policies_about = data.get('policies_about')
        obj.incentive_type = data.get('incentive_type')
        obj.incentive_amount = data.get('incentive_amount')
        let validateData = await ValidatreAddSpecialIntive(obj)
        if (!validateData.isValid) {
            swal({ text: validateData.errors[0], icon: "warning" });
            return false;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addSpecialIncentive', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 201) {

                    setStateValue('showAddModal', false);
                    swal({ type: "Success", message: 'Special incentive created!', icon: "success", button: false });
                    setTimeout(() => { getSpecialIncentives(state.page, state.perPage); swal.close(); }, 1000);
                } else {
                    setStateValue('showAddModal', false);
                    swal({ type: "Error", message: "Something is wrong", icon: "error", button: false });
                    setTimeout(() => { getSpecialIncentives(state.page, state.perPage); swal.close(); }, 1000);
                }
            });
    };

    const handlePageClick = (data) => {
        const selected = data.selected;
        setStateValue('page', selected + 1);
        getSpecialIncentives(selected + 1, state.perPage);
    };


    const deleteItem = (id) => {
        const requestOptions = { method: 'DELETE', headers: { 'Content-Type': 'application/json' } };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteSpecialIncentive/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal("Success", data.message, "success");
                    getSpecialIncentives(state.page, state.perPage);
                } else {
                    swal("Error", data.message, "error");
                }
            });
    };

    const goTosetShowEditModal = async (id) => {
        const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getSpecialIncentive/${id}`, requestOptions)
            .then(response => response.json())
            .then(async data => {

                let editData = data.data;
                const loc = removeDuplicates(editData.locations.map(item => ({ label: item.location_name, value: item._id })));
                const lobs = removeDuplicates(editData.lobs.map(item => ({ label: item.lob_name, value: item._id })));
                const role = removeDuplicates(editData.roles.map(item => ({ label: item.role_name, value: item._id })));
                const users = removeDuplicates(editData.users.map(item => ({ label: item.name, value: item._id })));

                // remove previous selected values
                setStateValue('selectedlocation', []);
                setStateValue('selectedlob', []);
                setStateValue('selectedroles', []);
                setStateValue('selectedUsers', []);

                await GETUsersList(role);
                delete editData.locations;
                delete editData.lobs;
                delete editData.roles;
                delete editData.users;
                editData.start_time = new Date(editData.start_time);
                editData.end_time = new Date(editData.end_time);

                setStateValue('editData', editData);
                setStateValue('selectedUsers', users);
                setStateValue('selectedlocation', loc);
                setStateValue('selectedroles', role);
                setStateValue('selectedlob', lobs);
                setStateValue('showEditModal', true);
            });
    };

    const removeDuplicates = (array) => {
        const uniqueArray = array.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.value === item.value
            ))
        );
        return uniqueArray;
    };

    const GETrolelist = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_user_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let rolelist = data.data;
                if (rolelist.length > 0) {
                    rolelist = rolelist.filter(item => item._id == '646224eab201a6f07b2dff36' || item._id == '6462250eb201a6f07b2dff3a' || item._id == '64622526b201a6f07b2dff3e')
                    rolelist = rolelist.map(item => ({ label: item.usertype, value: item._id }))
                    setStateValue('rolelist', rolelist);
                }

            });
    }
    const GETUsersList = async (value) => {

        setStateValue('selectedroles', value)
        if (value.length === 0) {
            setStateValue('selectedUsers', [])
            setStateValue('userlist', []);
            return;
        }
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
        };


        let userstypes = value.length > 0 ? value.map(item => item.value).join(',') : '';

        if (!userstypes) {
            return;
        }

        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserTypeList?userType=${userstypes}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let userlist = data.data;
                if (userlist.length > 0) {
                    userlist = userlist.map(item => ({ label: item.name, value: item._id }));
                    userlist = userlist.filter(item => item.label !== 'User')
                    userlist = removeDuplicates(userlist)
                    setStateValue('userlist', userlist);
                    setStateValue('selectedUsers', userlist)

                }

            });
    }
    const EditSpecialIncentive = async (e) => {
        e.preventDefault();

        let data = new FormData(e.target);
        let description = data.get('description');
        let obj = {}
        obj.description = description
        obj.locations = state.selectedlocation.map(item => item.value)
        obj.lobs = state.selectedlob.map(item => item.value)
        obj.roles = state.selectedroles.map(item => item.value)
        obj.users = state.selectedUsers.map(item => item.value)
        obj.start_time = new Date(state.editData?.start_time)
        obj.end_time = new Date(state.editData?.end_time)
        obj.policy_type = data.get('policy_type')
        obj.policies_about = data.get('policies_about')
        obj.incentive_type = data.get('incentive_type')
        obj.incentive_amount = data.get('incentive_amount')
        console.log("start of update", obj.start_time);
        console.log("end of update", obj.end_time);
        let validateData = await ValidatreAddSpecialIntive(obj)
        if (!validateData.isValid) {
            swal({ text: validateData.errors[0], icon: "warning" });
            return false;
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateSpecialIncentive/${state.editData._id}`, requestOptions)

            .then(response => response.json())
            .then(data => {
                setStateValue("editData", {})
                setStateValue("selectedlocation", [])
                setStateValue("selectedlob", [])
                setStateValue("selectedroles", [])
                setStateValue("selectedUsers", [])

                if (data.status === 200) {
                    setStateValue('showEditModal', false);
                    swal({ type: "Success", message: 'Updated Successfully', icon: "success", button: false });
                    setTimeout(() => { getSpecialIncentives(state.page, state.perPage); swal.close(); }, 1000);
                } else {
                    setStateValue('showEditModal', false);
                    swal({ type: "Error", message: 'Something is Wrong', icon: "error", button: false });
                    setTimeout(() => { getSpecialIncentives(state.page, state.perPage); swal.close(); }, 1000);
                }

            });
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location = '/login';
        } else {
            getLocationList();
            lobList();
            GETrolelist()
            getSpecialIncentives(state.page, state.perPage);
        }
    }, []);


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <h4>Special incentive</h4>
                                </div>
                                <div className='col-md-8'>
                                    <button className='btn btn-primary' onClick={() => setStateValue('showAddModal', true)} style={{ float: 'right' }}>Add Special Incentive</button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr className="table-info">
                                            <th>Sr No.</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.SpecialIncentive?.length ? state.SpecialIncentive?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    <Button variant="primary" className="btn-group" onClick={() => handleShow(item)}>
                                                        View
                                                    </Button>&nbsp;&nbsp;
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button className="btn btn-info" onClick={() => goTosetShowEditModal(item._id)}>Edit</button>
                                                    </div>&nbsp;&nbsp;

                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan='5'>No Data Found</td></tr>}
                                    </tbody>
                                </table>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={state.pageCount}
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
                        <Modal size='lg' show={state.showAddModal} onHide={() => setStateValue('showAddModal', false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Special incentive</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <form method='POST' onSubmit={AddSpecialIncentive}>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Description</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Add Description' name='description' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Location</strong></label><br />
                                                                <Multiselect
                                                                    options={state.locationlist}
                                                                    displayValue="label"
                                                                    onSelect={(selectedList) => setStateValue('selectedlocation', selectedList)}
                                                                    onRemove={(selectedList) => setStateValue('selectedlocation', selectedList)}
                                                                    placeholder="Select Locations"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Line Of Business</strong></label><br />
                                                                <Multiselect
                                                                    options={state.lob}
                                                                    displayValue="label"
                                                                    onSelect={(selectedList) => setStateValue('selectedlob', selectedList)}
                                                                    onRemove={(selectedList) => setStateValue('selectedlob', selectedList)}
                                                                    placeholder="Select line of business"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-lg-4'>
                                                                <label><strong>User Types</strong></label><br />
                                                                <Multiselect
                                                                    options={state.rolelist}
                                                                    displayValue="label"
                                                                    onSelect={(role) => GETUsersList(role)}
                                                                    onRemove={(selectedList) => GETUsersList(selectedList)}
                                                                    placeholder="Select User Types"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Users</strong></label><br />
                                                                <Multiselect
                                                                    options={state.userlist}
                                                                    displayValue="label"
                                                                    onSelect={(selectedList) => setStateValue('selectedUsers', selectedList)}
                                                                    onRemove={(selectedList) => setStateValue('selectedUsers', selectedList)}
                                                                    placeholder="Select Users"
                                                                    selectedValues={state.selectedUsers}
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>

                                                            <div className='col-lg-4'>
                                                                <label><strong>Start Time</strong></label><br />
                                                                <DatePicker
                                                                    selected={state.start_time}
                                                                    onChange={date => setStateValue('start_time', date)}
                                                                    className='form-control'
                                                                    min={new Date()}
                                                                    showTimeSelect
                                                                    timeFormat="HH:mm"
                                                                    timeIntervals={10}
                                                                    timeCaption="Time"
                                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                                    placeholderText="Select Date and Time"
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-lg-4'>
                                                                <label><strong>End Time</strong></label><br />
                                                                <DatePicker
                                                                    selected={state.end_time}
                                                                    onChange={date => setStateValue('end_time', date)}
                                                                    className='form-control'
                                                                    min={new Date()}
                                                                    showTimeSelect
                                                                    timeFormat="HH:mm"
                                                                    timeIntervals={10}
                                                                    timeCaption="Time"
                                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                                    placeholderText="Select Date and Time"
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Policy Type</strong></label><br />
                                                                <select className='form-control' name='policy_type' onChange={(e) => setStateValue("policy_type", e.target.value)}>
                                                                    <option value=''>Select Policy Type</option>
                                                                    {state.policytypes.map((item, index) => (
                                                                        <option key={index} value={item}>{item}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                    <Form.Label>Policy Closed</Form.Label>
                                                                    <Form.Control type="number" placeholder="Enter Number Of Policies Closed" name='policies_about' />
                                                                </Form.Group>
                                                            </div>
                                                        </div>
                                                        <div className='row'>


                                                            <div className='col-lg-4'>
                                                                <label><strong>Incentive Types</strong></label><br />
                                                                <select className='form-control' name='incentive_type'>
                                                                    <option value=''>Select Incentive Type</option>
                                                                    {state.incetivetypes.map((item, index) => (
                                                                        <option key={index} value={item}>{item}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                    <Form.Label>Incentive Amount</Form.Label>
                                                                    <Form.Control type="text" placeholder="Enter Incentive Amount" name='incentive_amount' />
                                                                </Form.Group>
                                                            </div>
                                                        </div>


                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
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
                                <Button variant="secondary" onClick={() => setStateValue('showAddModal', false)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal size='lg' show={state.showEditModal} onHide={() => setStateValue('showEditModal', false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Special incentive</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <form method='POST' onSubmit={EditSpecialIncentive}>

                                                        <div className='row'>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Description</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Add Description' name='description' defaultValue={state.editData.description} />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Location</strong></label><br />
                                                                <Multiselect
                                                                    options={state.locationlist}
                                                                    displayValue="label"
                                                                    onSelect={(selectedList) => setStateValue('selectedlocation', selectedList)}
                                                                    onRemove={(selectedList) => setStateValue('selectedlocation', selectedList)}
                                                                    placeholder="Select Locations"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                    selectedValues={state.selectedlocation}
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Line Of Business</strong></label><br />
                                                                <Multiselect
                                                                    options={state.lob}
                                                                    displayValue="label"
                                                                    onSelect={(selectedList) => setStateValue('selectedlob', selectedList)}
                                                                    onRemove={(selectedList) => setStateValue('selectedlob', selectedList)}
                                                                    placeholder="Select line of business"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                    selectedValues={state.selectedlob}
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>User Types</strong></label><br />
                                                                <Multiselect
                                                                    options={state.rolelist}
                                                                    displayValue="label"
                                                                    onSelect={(role) => GETUsersList(role)}
                                                                    onRemove={(selectedList) => GETUsersList(selectedList)}
                                                                    placeholder="Select User Types"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                    selectedValues={state.selectedroles}
                                                                />

                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Users</strong></label><br />
                                                                <Multiselect
                                                                    options={state.userlist}
                                                                    displayValue="label"
                                                                    onSelect={(selectedList) => setStateValue('selectedUsers', selectedList)}
                                                                    onRemove={(selectedList) => setStateValue('selectedUsers', selectedList)}
                                                                    placeholder="Select Users"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                    selectedValues={state.selectedUsers}
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Start Time</strong></label><br />
                                                                <DatePicker
                                                                    selected={state.editData.start_time}
                                                                    onChange={date => setStateValue('editData.start_time', date)}
                                                                    className='form-control'
                                                                    min={new Date()}
                                                                    showTimeSelect
                                                                    timeFormat="HH:mm"
                                                                    timeIntervals={10}
                                                                    timeCaption="Time"
                                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                                    placeholderText="Select Date and Time"
                                                                />
                                                            </div>

                                                            <div className='col-lg-4'>
                                                                <label><strong>End Time</strong></label><br />
                                                                <DatePicker
                                                                    selected={state.editData.end_time}
                                                                    onChange={date => setStateValue('editData.end_time', date)}
                                                                    className='form-control'
                                                                    min={new Date()}
                                                                    showTimeSelect
                                                                    timeFormat="HH:mm"
                                                                    timeIntervals={10}
                                                                    timeCaption="Time"
                                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                                    placeholderText="Select Date and Time"
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Policy Type</strong></label><br />
                                                                <select className='form-control' name='policy_type' onChange={(e) => setStateValue("policy_type", e.target.value)} defaultValue={state.editData.policy_type}>
                                                                    <option value=''>Select Policy Type</option>
                                                                    {state.policytypes.map((item, index) => (
                                                                        <option key={index} value={item}>{item}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                    <Form.Label>Policy Closed</Form.Label>
                                                                    <Form.Control type="number" placeholder="Enter Number Of Policies Closed" name='policies_about' defaultValue={state.editData.policies_about} />
                                                                </Form.Group>
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Incentive Type</strong></label><br />
                                                                <select className='form-control' name='incentive_type' defaultValue={state.editData.incentive_type}>
                                                                    <option value=''>Select Incentive Type</option>
                                                                    {state.incetivetypes.map((item, index) => (
                                                                        <option key={index} value={item}>{item}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                    <Form.Label>Incentive Amount</Form.Label>
                                                                    <Form.Control type="text" placeholder="Enter Incentive Amount" name='incentive_amount' defaultValue={state.editData.incentive_amount} />
                                                                </Form.Group>
                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
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
                                <Button variant="secondary" onClick={() => setStateValue('showEditModal', false)}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={state.showSelecteddata} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Special Incentive Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {state.selectedItem && (
                                    <>
                                        <div>
                                            <strong>Locations:</strong> {state.selectedItem.locations?.map(l => l.location_name).join(", ")}
                                        </div>
                                        <div>
                                            <strong>LOBs:</strong> {state.selectedItem.lobs?.map(l => l.lob_name).join(', ')}
                                        </div>
                                        <div>
                                            <strong>Roles:</strong> {state.selectedItem.roles?.map(l => l.role_name).join(', ')}
                                        </div>
                                        <div>
                                            <strong>Users:</strong> {state.selectedItem.users?.map(l => l.name).join(', ')}
                                        </div>
                                        <div>
                                            <strong>Start Time:</strong> {state.selectedItem.start_time ? new Date(state.selectedItem.start_time).toLocaleString() : ''}
                                        </div>
                                        <div>
                                            <strong>End Time:</strong> {state.selectedItem.end_time ? new Date(state.selectedItem.end_time).toLocaleString() : ''}
                                        </div>
                                        <div>
                                            <strong>Policy Type:</strong> {state.selectedItem.policy_type}
                                        </div>
                                        <div>
                                            <strong>Policies Closed:</strong> {state.selectedItem.policies_about}
                                        </div>
                                        <div>
                                            <strong>Incentive Type:</strong> {state.selectedItem.incentive_type}
                                        </div>
                                        <div>
                                            <strong>Incentive Amount:</strong> {state.selectedItem.incentive_amount}
                                        </div>
                                    </>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </div>
            </div>
        </div>

    )
};
export default Index;


