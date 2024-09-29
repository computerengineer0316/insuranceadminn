import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'

const View_Yacht_Experience = () => {
    const navigate = useNavigate()
    const [YachtExperience, setYachtExperience] = useState([])
    const [visibleedit, setVisibleedit] = useState(false)
    const [masterPermission, setMasterpermission] = useState([])
    const [location, setLocation] = useState([])
    const [editData, setEditData] = useState([])
    const [formdata, setFormdata] = useState({})
    const API = 'https://insuranceapi-3o5t.onrender.com/api'
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            getYacht_Experience_List()
            locationList()
            const userdata = JSON.parse(localStorage.getItem('user'))
            const master_permission = userdata?.master_permission?.[0] || {}
            setMasterpermission(master_permission)
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
    const getYacht_Experience_List = async () => {
        await fetch(`${API}/getYachtExperience`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setYachtExperience(res.data)
                console.log("Experience Data >>>>>>>>>>>>>>>>>>> ", res.data)
            })
            .catch((e) => console.log(e))
    }
    const editYachtExperience = (id) => {
        try {
            fetch(`${API}/getYachtExperiencebyid?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log("Edit Experience Data >>>>>>>>>>>>>>>>>>> ", res.data)
                    setEditData(res.data[0])
                    setVisibleedit(true)
                })
                .catch((e) => console.log(e))

        } catch (error) {
            console.log(error)
        }
    }
    const UpdateYachtExperience = async () => {
        try {
            console.log("Update Experience Id >>>>>>>>>>>>>>>>>>> ", editData._id)
            console.log("Update Experience Data >>>>>>>>>>>>>>>>>>> ", formdata)
            // return false;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            };
            fetch(`${API}/updateYachtExperience?id=${editData._id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("Update Experience Data >>>>>>>>>>>>>>>>>>> ", data)
                    swal({
                        title: "Data Updated Successfully!",
                        icon: "success",
                        button: "Okay",
                    });
                    getYacht_Experience_List()
                    setVisibleedit(false)
                });
        } catch (error) {
            console.log(error)
        }
    }
    const setEditClaimQuestionYear = (val) => {
        setFormdata({ ...formdata, number: val.target.value })
    }
    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Yacht Experience</h4>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>

                                    <th scope="col">Experience</th>
                                    <th scope="col">Number of Years</th>
                                    {/* <th scope="col">Location</th> */}
                                    {/* <th scope="col">Status</th> */}
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {YachtExperience?.length > 0 ? (
                                    YachtExperience.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.number}</td>
                                            {/* <td>{item.location?.map((Val)=>Val.location_name).join(", ")}</td> */}

                                            {/* <td>{item.status == true ? 'Active' : 'Inactive'}</td> */}
                                            <td>
                                                {/* {masterPermission.motor_claim_question?.includes('edit') && ( */}
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => editYachtExperience(item._id)}
                                                >
                                                    Edit
                                                </button>
                                                {/* )} */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No Data Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>

            <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Yacht Experience </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form
                                        //   method="PUT"
                                        // onSubmit={(e) => UpdateYachtExperience(editData?._id, e)}
                                        >
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        <strong>Edit Yacht Experience</strong>
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="number"
                                                        type="text"
                                                        defaultValue={editData?.number}
                                                        onChange={(e) => setEditClaimQuestionYear(e)}
                                                        required
                                                    />
                                                </div>
                                                {/* <div className="col-md-6">
                                                  <label className="form-label">
                                                      <strong>Locations</strong>
                                                  </label>
                                                  <Multiselect
                                                      options={location}
                                                      selectedValues={location}
                                                      displayValue="label"
                                                      onSelect={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                      onRemove={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                      placeholder="Select Location"
                                                      showCheckbox={true}
                                                      closeOnSelect={false}
                                                      required
                                                  />
                                              </div> */}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div
                                                        type="submit"
                                                        onClick={() => UpdateYachtExperience()}
                                                        className="btn btn-primary mt-2 submit_all"
                                                        style={{ float: 'right' }}
                                                    >
                                                        Submit
                                                    </div>
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
        </>
    )
}

export default View_Yacht_Experience
