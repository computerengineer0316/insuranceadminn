import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/area-of-registration.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const AreaOfRegistration = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [area_of_registration_name, setAreaOfRegistrationName] = useState('');
    const [area_of_registration_status, setAreaOfRegistrationStatus] = useState('');
    const [area_of_registration_id, setAreaOfRegistrationId] = useState('');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [motorpermission, setMotorPermission] = useState([]);
    const [editlocation, setEditLocation] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistAreaOfRegistration(page, perPage);
            locationList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMotorPermission(motor_permission);
            exportlistdata()
        }
    }, []);

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
                // handleChange(location_list);
            });
    }


    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            const data = new FormData(e.target);
            const area_of_registration_name = data.get('area_of_registeration_name');
            const area_of_registration_location = selectedOption;
            const area_of_registration_location_len = area_of_registration_location.length;
            const area_of_registration_location_str = [];
            for (let i = 0; i < area_of_registration_location_len; i++) {
                area_of_registration_location_str.push(area_of_registration_location[i].value);
            }
            // const area_of_registration_status = data.get('status');

            if (area_of_registration_location_str.length === 0) {
                swal({
                    title: "Warning!",
                    text: "Please select location",
                    icon: "warning",
                })
                return false;
            }


            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    area_of_registration_name: area_of_registration_name,
                    area_of_registration_location: area_of_registration_location_str.toString(),
                    // area_of_registration_status: area_of_registration_status
                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/add_area_of_registeration`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setShowModal(false);
                        swal({
                            text: data.message,
                            icon: "success",
                            button: false,
                        })
                        getlistAreaOfRegistration(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                    else {
                        setShowModal(false);
                        swal({
                            title: "Error!",
                            text: data.message,
                            icon: "error",
                            button: false,
                        })
                        getlistAreaOfRegistration(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }

    const AreaOfRegistrationDetails = (id) => {
        setAreaOfRegistrationId(id);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const area_of_registration_details = data.data[0];
                setAreaOfRegistrationName(area_of_registration_details?.area_of_registration_name);
                const locationid = area_of_registration_details?.area_of_registration_location;
                const location_id = locationid.map((data) => ({ label: data.location_name, value: data._id }));
                setSelectedOption(location_id);
                handleChange(location_id)
                setAreaOfRegistrationStatus(area_of_registration_details.area_of_registration_status);
                setVisibleedit(true);
            });
    }

    const handleChange = (selectedOption) => {
        setEditLocation(selectedOption);
    };


    const updateSubmit = (e) => {
        try {
            e.preventDefault();
            const data = new FormData(e.target);
            const area_of_registeration_name = data.get('area_of_registeration_name');
            // const area_of_registration_location = editlocation;
            const area_of_registration_location_id = editlocation?.map((data) => data.value);

            console.log(area_of_registration_location_id)
            // return false;
            if (area_of_registration_location_id.length === 0) {
                swal({
                    title: "Warning!",
                    text: "Please select location",
                    icon: "warning",
                })
                return false;
            } else {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        area_of_registration_name: area_of_registeration_name,
                        area_of_registration_location: area_of_registration_location_id,
                        // area_of_registration_status: area_of_registration_status,
                        area_of_registration_id: area_of_registration_id
                    })
                };
                fetch(`https://insuranceapi-3o5t.onrender.com/api/update_area_of_registration`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 200) {
                            setVisibleedit(false);
                            swal({
                                text: data.message,
                                icon: "success",
                                button: false,
                            })
                            getlistAreaOfRegistration(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);
                        }
                        else {
                            setVisibleedit(false);
                            swal({
                                title: "Error!",
                                text: data.message,
                                icon: "error",
                                button: false
                            })
                            getlistAreaOfRegistration(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);
                        }
                    });
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getlistAreaOfRegistration = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                setData(list);
            });
    }

    const [exportlist, setExportlist] = useState([]);
    const exportlistdata = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration', requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }
    console.log(exportlist)


    const fileType = 'xlsx'
    const exporttocsv = () => {

        const updatedData = exportlist.map((item, index) => {
            return {
                'area_of_registration_name': item.area_of_registration_name,
                'area_of_registration_location': item.area_of_registration_location.map((item) => item.location_name).join(", "),
            }
        })


        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Area_of_Registration" + ".xlsx")
    }


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistAreaOfRegistration(selectedPage + 1, perPage);
    };

    const deleteAreaOfRegistration = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ area_of_registration_status: status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_area_of_registration_status/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false
                    })
                    getlistAreaOfRegistration(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false
                    })
                    getlistAreaOfRegistration(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_area_of_registeration_excel",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        if (result.status === 200) {
            swal("Uploaded Succesfully", "", "success");
        } else {
            swal("Something went wrong", "", "failed");
        }
        getlistAreaOfRegistration(page, perPage)
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=areaOfResitration`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistAreaOfRegistration(page, perPage)



                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getlistAreaOfRegistration(page, perPage)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
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
                                        <h4 className="card-title">Area Of Registration</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {motorpermission.area_of_registration?.includes('create') ?
                                            // <button className='btn btn-primary' style={ { float : "right" } } onClick={() => setShowModal(true)}>Add Area Of Registration</button>
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => navigate('/AddAreaOfRegistration')}>Add Area Of Registration</button>

                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-header" style={{ textAlign: 'right' }}>
                                {motorpermission.area_of_registration?.includes('download') ?
                                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                    : ''}
                                {motorpermission.area_of_registration?.includes('upload') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                    : ''}
                                {motorpermission.area_of_registration?.includes('export') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                    : ''}
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Area Of Registration Name</th>
                                            <th>Area Of Registration Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.area_of_registration_name}</td>
                                                <td>{item.area_of_registration_location.map((data) => data.location_name).join(", ")}</td>
                                                <td>
                                                    {motorpermission.area_of_registration?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => { AreaOfRegistrationDetails(item._id); }}>Edit</button>
                                                    )}
                                                    {' '}
                                                    {motorpermission.area_of_registration?.includes('delete') && (
                                                        <>
                                                            {
                                                                item.area_of_registration_status === 1 ?
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteAreaOfRegistration(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteAreaOfRegistration(item._id, 1) }}>Activate</button>
                                                            }
                                                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
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
            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" id="DHA" defaultValue="" required onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Area Of Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Area Of Registration Name</label>
                                                        <input type="text" className="form-control" placeholder="Area Of Registration Name" name="area_of_registeration_name" autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={setSelectedOption}
                                                            onRemove={setSelectedOption}
                                                            placeholder="Select Location"
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                <label className="form-label">Status</label>
                                                    <select className="form-control" name="status" required>
                                                        <option value="">Select Status</option>
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div> */}
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Area Of Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Area Of Registration Name</label>
                                                        <input type="text" className="form-control" placeholder="Area Of Registration Name" name="area_of_registeration_name" autoComplete="off" defaultValue={area_of_registration_name} required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedOption}
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
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
                                            {/* <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Status</label>
                                                <select className="form-control" name="status" required>
                                                    <option value="">Select Status</option>
                                                    <option value="1" selected={area_of_registration_status == 1 ? true : false}>Active</option>
                                                    <option value="0" selected={area_of_registration_status == 0 ? true : false}>Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div> */}
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
        </>
    )
}

export default AreaOfRegistration

