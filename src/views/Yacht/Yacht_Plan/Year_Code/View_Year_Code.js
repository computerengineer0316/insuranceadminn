import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { CProgress } from '@coreui/react';
import { Modal, Button } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { setYear } from 'date-fns';


const ViewYearCode = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [motorpermission, setMotorPermission] = useState([]);
    const [nodata, setNodata] = useState('');
    const [loading, setLoading] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [yearCode, setYearCode] = useState('');
    const [updatId, setUpdatId] = useState('');




    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistYearCode(page, perPage);
            locationList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMotorPermission(motor_permission);
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
    const UpdateYearCode = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                yearCode: yearCode,
                location: selectedOption
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateYatchYear?id=${updatId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setVisibleedit(false)
                    swal({

                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false

                    })
                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
                else {
                    setVisibleedit(false)
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false

                    })
                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
            });
    }

    const getlistYearCode = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getYatchYear?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNodata(data.message)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data?.data;
                setData(list);

            });
    }
    const updatestatus = (id, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status, id: id })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateYatchYear?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal("Success!", data.message, {
                        icon: "success",
                        button: false
                    });
                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal("Error !", data.message, {
                        icon: "error",
                        button: false
                    });
                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            }
            );
    }

    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteYachtMaster?id=${id}&type=${'yachtYearCode'}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal("Poof! Your plan price has been deleted!", {
                        icon: "success",
                        button: false
                    });

                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal("Oops! Something went wrong.", {
                        icon: "error",
                        button: false
                    });
                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            }
            );
    }

    const detailsbyid = async (id) => {
        setUpdatId(id);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/getYatchYearById?id=${id}`, requestOptions);
        result = await result.json();
        setYearCode(result.data[0].yearDesc);
        const locationid = result.data[0].location;

        const location_name_arr_obj = [];
        for (let i = 0; i < locationid?.length; i++) {
            const location_name_arr_obj_obj = { label: locationid[i].location_name, value: locationid[i]._id };
            location_name_arr_obj.push(location_name_arr_obj_obj);
        }
        setSelectedOption(location_name_arr_obj);
        setVisibleedit(true);
    }


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistYearCode(selectedPage + 1, perPage);
    };

    const AddYachtYear = () => {
        navigate('/AddYachtYearCode')
    }
    const startFrom = (page - 1) * perPage;

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Year Code</h4>
                                    </div>
                                    <div className="col-md-6">
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>


                                    <div className="col-lg-6" style={{ textAlign: 'right' }}>
                                        {motorpermission.body_type?.includes('upload') ?
                                            <button className="btn btn-primary btn-sm btn-icon-text m-r-10" onClick={() => AddYachtYear()}>Add Year Code</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">

                                {loading && (
                                    <div className="overlay">
                                        <div className="loader-container">
                                            <CProgress color="primary" variant="striped" animated value={100} />
                                            <div>Uploading, please wait...</div>
                                            <div className="loader-text">Do Not Refresh The Page</div>
                                            {/* <ClipLoader color="green" loading={loading} size={100} /> */}
                                        </div>
                                    </div>
                                )}
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr className="table-info">
                                            <th>#</th>
                                            <th>Year Code</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data.length > 0 ?
                                            <>

                                                {data?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{startFrom + index + 1}</td>
                                                        <td>{item.yearDesc}</td>
                                                        <td>{item.location?.map((data) => data.location_name).join(", ")}</td>
                                                        <td>
                                                            <button className="btn btn-primary" onClick={() => { detailsbyid(item._id); }}>Edit</button>
                                                            {
                                                                item.status === true ?
                                                                    <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, false) }}>Deactivate</button> :
                                                                    <button className="btn btn-success mx-1" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, true) }}>Activate</button>
                                                            }
                                                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}

                                            </>
                                            :
                                            <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
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
                    <Modal.Title>Edit Yacht Year Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="PUT" onSubmit={UpdateYearCode}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Year Code</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='YearCode'
                                                        onChange={(e) => setYearCode(e.target.value)}
                                                        placeholder='Enter Travel Type'
                                                        autoComplete="off"
                                                        defaultValue={yearCode}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Select Location</strong></label>
                                                    <Multiselect
                                                        options={location}
                                                        selectedValues={selectedOption}
                                                        onSelect={setSelectedOption}
                                                        onRemove={setSelectedOption}
                                                        displayValue="label"
                                                        placeholder="Select Location"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div onClick={UpdateYearCode} className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</div>
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

export default ViewYearCode
