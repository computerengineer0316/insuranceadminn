import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { json, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'
import axios from 'axios'
import { tr } from 'date-fns/locale'

const ViewPreferred_Days = () => {
    const navigate = useNavigate()
    const [masterPermission, setMasterpermission] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [visibleedit, setVisibleedit] = useState(false)
    const [defaultlocation, setDefaultLocation] = useState([]);
    const [location, setLocation] = useState([]);
    const [prefDay, setPrefDay] = useState([])
    const [updateData, setUpdateData] = useState({})
    const [timeOption, setTimeOption] = useState([])
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token == null || token == undefined || token == '') {
            navigate('/login')
        } else {
            const userdata = JSON.parse(localStorage.getItem('user'))
            const master_permission = userdata?.master_permission?.[0] || {}
            setMasterpermission(master_permission)
            get_all_days()
            locationList()
            generateTimeOptions()
        }
    }, [])
    const locationList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }

                setLocation(location_list);
            });
    }
    const get_all_days = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPreferredDays?type=admin`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    console.log(data.data, 'data')
                    setPrefDay(data.data)
                }
            });
    }

    const getSingleBest_Plan = async (id) => {
        axios.get(`https://insuranceapi-3o5t.onrender.com/api/getPreferredDaysById?id=${id}`)
            .then((data) => {
                if (data.status == 200) {
                    console.log(data.data, 'data')
                    const data_update = data.data?.data[0]
                    const loc_data = data_update?.location
                    let location_list = [];
                    for (let i = 0; i < loc_data?.length; i++) {
                        const location_obj = { label: loc_data[i]?.location_name, value: loc_data[i]?._id };
                        location_list.push(location_obj);
                    }

                    setDefaultLocation(location_list)
                    setUpdateData(data_update)
                    setVisibleedit(true)
                } else {
                    swal({
                        title: 'Error!',
                        text: data.data?.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                        get_all_days()
                    }
                    )
                }
            })
    }


    const updatestatus = async (id, status) => {

        const data = { status }
        axios.put(`https://insuranceapi-3o5t.onrender.com/api/updatePreferredDay?id=${id}`, data)
            .then((data) => {
                if (data.status == 201) {
                    setShowModal(false)
                    if (status == 0) {
                        swal({
                            text: "Preferred Day Deactivated Successfully",
                            type: 'success',
                            icon: 'success',
                            buttons: false
                        })
                    } else {
                        swal({
                            text: "Preferred Day Activated Successfully",
                            type: 'success',
                            icon: 'success',
                            buttons: false
                        })
                    }
                    get_all_days()
                    setTimeout(() => {
                        swal.close()
                    }, 1000);


                } else {
                    setShowModal(false)
                    swal({
                        title: 'Error!',
                        text: data.data?.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                        get_all_days()
                    })
                }
            })
        // gettestimonials(page, perPage)
    }
    const handleUpdate = (e) => {
        try {
            e.preventDefault();
            const formdata = new FormData(e.target);
            const name = formdata.get('name');
            const start_time = formdata.get('start_time');
            const end_time = formdata.get('end_time');
            console.log(start_time, ":", end_time, 'start_time, end_time')
            if (start_time >= end_time) {
                swal({
                    title: 'Error!',
                    text: 'Start time should be less than End time',
                    type: 'error',
                    icon: 'error',
                })
                return false
            }
            const data = {
                name,
                start_time,
                end_time,
                location: defaultlocation
            }
            axios.put(`https://insuranceapi-3o5t.onrender.com/api/updatePreferredDay?id=${updateData?._id}`, data)
                .then((data) => {
                    if (data.status == 201) {
                        setVisibleedit(false)
                        swal({
                            text: data.data.message,
                            type: 'success',
                            icon: 'success',
                            buttons: false
                        })
                        get_all_days()
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    } else {
                        swal({
                            title: 'Error!',
                            text: data.data?.message,
                            type: 'error',
                            icon: 'error',
                        }).then(function () {
                            get_all_days()
                        })
                    }
                })
        }
        catch (error) {
            console.log(error)
        }
    }
    const generateTimeOptions = () => {

        const options = [];

        for (let hour = 0; hour <= 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                // Generate options in 15-minute intervals
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                const timeValue = `${formattedHour}:${formattedMinute}`;
                if (formattedMinute != 60) {
                    options.push({
                        value: timeValue,
                        label: timeValue,
                    });
                }
            }
        }
        for (let i = 0; i < 4; i++) {
            options.pop()
        }
        options.push({
            value: '00:00',
            label: '00:00',
        });
        setTimeOption(options)
    }
    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Preferred Days</h4>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered table-responsive ">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Start Time</th>
                                    <th scope="col">End Time</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    prefDay?.length > 0 ?
                                        prefDay.map((item, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item?.name}</td>
                                                <td>{item?.start_time}</td>
                                                <td>{item?.end_time}</td>
                                                <td>{item?.location?.map((Val) => Val.location_name)?.join(", ")}</td>
                                                <td>
                                                    {masterPermission.preferred_days?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => getSingleBest_Plan(item._id)} >Edit</button>
                                                    )}
                                                    {' '}
                                                    {masterPermission.preferred_days?.includes('edit') && (
                                                        <>
                                                            {
                                                                item.status == 1 ?
                                                                    <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success mx-1" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                            }
                                                            {/* <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to Delete this item?')) deleteItem(item._id) }}>Delete</button> */}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : <tr>
                                            <td colSpan="6">No Data Found</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>


            <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Preferred Day</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form method="PUT"
                                            onSubmit={handleUpdate}
                                        >
                                            <div className='row'>

                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Day</strong></label>
                                                        <input type='text' className="form-control" name='name' placeholder='Enter Best plan price Description'
                                                            defaultValue={updateData?.name}
                                                            autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Start Time</strong></label>
                                                        {/* <input type='time' className="form-control" name='start_time' placeholder='Enter Best plan price Description'
                                                            defaultValue={updateData?.start_time}
                                                            step={900}
                                                            autoComplete='off' required /> */}
                                                        <select
                                                            id="form11"
                                                            className="form-control"
                                                            name="start_time"
                                                            // value={updateData?.start_time}
                                                            required
                                                        >
                                                            {timeOption?.map((val, index) => (
                                                                <option selected={updateData?.start_time == val.value ? true : false} key={index} value={val.value}>{val.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>End Time</strong></label>
                                                        {/* <input type='time' className="form-control" name='end_time' placeholder='Enter Best plan price Description'
                                                            defaultValue={updateData?.end_time}
                                                            step={900}
                                                            autoComplete='off' required /> */}
                                                        <select
                                                            id="form11"
                                                            className="form-control"
                                                            name="end_time"
                                                            // value={updateData?.start_time}
                                                            required
                                                        >
                                                            {timeOption?.map((val, index) => (
                                                                <option selected={updateData?.end_time == val.value ? true : false} key={index} value={val.value}>{val.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={defaultlocation}
                                                            onSelect={(evnt) => (setDefaultLocation(evnt))}
                                                            onRemove={(evnt) => (setDefaultLocation(evnt))}
                                                            displayValue="label"
                                                            placeholder="Select Location"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button className='btn btn-primary my-2 mx-2' type="submit">Update</button>
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
        </>
    )
}

export default ViewPreferred_Days
