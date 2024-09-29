import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import filePath from '../../../webroot/sample-files/yacht-condition-sample-sheet.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";


const ViewYachtConditions = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getYachtcondition(page, perPage);
            locationList();
            exportlistdata();
        }
    }, []);

    const [excelfile, setExcelfile] = useState("");
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [yachtcondition, setYachtCondition] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editshowModal, setEditShowModal] = useState(false);
    const [yachtconditionid, setYachtconditionid] = useState('');
    const [yacht_condition_label, setYacht_condition_label] = useState('');
    const [home_condition_description, sethome_condition_description] = useState('');
    const [home_condition_status, sethome_condition_status] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [editLocation, setEditLocation] = useState([]);
    const [location, setLocation] = useState([]);

    const getYachtcondition = async (page, perPage) => {
        setYachtCondition([]);
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_yacht_condition?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setYachtCondition(data.data);

            });
    }


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


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getYachtcondition(selectedPage + 1, perPage);
    };

    const updatestatus = async (id, yacht_condition_status) => {
        let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_yacht_condition_status', {
            method: 'post',
            body: JSON.stringify({ id, yacht_condition_status }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        swal("Updated Succesfully", "", "success");
        getYachtcondition(page, perPage)
    }

    const addyachtcondition = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const yacht_condition_label = formData.get('condition_label');

        const yacht_condition_description = formData.get('condition_description');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                yacht_condition_label,
                yacht_condition_description
            }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_yacht_conditions`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setShowModal(false);
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        getYachtcondition(page, perPage);
                    });
                }
                else {
                    setShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        getYachtcondition(page, perPage);
                    });
                }
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const yacht_condition_label = formData.get('condition_label');
        const yacht_condition_description = formData.get('condition_description');

        const location = editLocation;
        const location_id = location.map((data) => data.value);

        if (editLocation.length === 0) {
            swal({
                title: "warning!",
                text: "Please Select Location",
                icon: "warning",
                button: "OK",
            });
            return false;
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                yacht_condition_label: yacht_condition_label,
                yacht_condition_description: yacht_condition_description,
                ParamValue: yachtconditionid,
                location: location_id,
            }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_yacht_condition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setEditShowModal(false);
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getYachtcondition(page, perPage);
                    });
                }
                else {
                    setEditShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getYachtcondition(page, perPage);
                    });
                }
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
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_yacht_condition', requestOptions)
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

                'yacht_condition_label': item.yacht_condition_label,
                'yacht_condition_description': item.yacht_condition_description == 1 ? "Yes" : "No",
                'yacht_condition_location': item.yacht_condition_location.map((data) => data.location_name).join(", "),
            }
        })
        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Yacht-Conditions" + ".xlsx")
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_yacht_condition_excel",
            {
                method: "POST",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        swal("Uploaded Succesfully", "", "success");
        getYachtcondition(page, perPage)
    }

    const detailsbyid = async (ParamValue) => {
        setYachtconditionid(ParamValue)
        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_yacht_conditionbyid`, requestOptions);
        result = await result.json();
        const details = result.data[0];
        setYacht_condition_label(details.yacht_condition_label);
        sethome_condition_description(details.yacht_condition_description);
        sethome_condition_status(details.yacht_condition_status);
        const location = details.yacht_condition_location;
        const locationid = location.map((data) => ({ label: data.location_name, value: data._id }));
        setSelectedOption(locationid);
        handleChange(locationid)
        setEditShowModal(true);
    };

    const handleChange = (selectedOption) => {
        setEditLocation(selectedOption);
    };

    const startFrom = (page - 1) * perPage;

    const AddyachtConditions = () => {
        navigate("/AddYachtConditions")
    }

    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteYachtMaster/?id=${id}&type=yachtconditions`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getYachtcondition(page, perPage);
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
                    getYachtcondition(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }



    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Yacht Conditions</h4>
                                </div>
                                <div className="col-md-6">
                                    <button className='btn btn-primary' style={{ float: "right" }} onClick={() => AddyachtConditions()}>Add Yacht Condition</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-header" style={{ textAlign: 'right' }}>
                            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th><strong>#</strong></th>
                                            <th><strong>Condition</strong></th>
                                            <th><strong>Description</strong></th>
                                            <th><strong>Location</strong></th>
                                            <th><strong>Status</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {yachtcondition?.length > 0 ?
                                            yachtcondition?.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{startFrom + index + 1}</td>
                                                    <td>{item.yacht_condition_label}</td>
                                                    {/* <td>{item.yacht_condition_description == 1 ? "Yes" : "No"}</td> */}
                                                    <td>{item.yacht_condition_location.map((data) => data.location_name).join(", ")}</td>

                                                    <td>
                                                        <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>&nbsp;&nbsp;
                                                        {
                                                            item.yacht_condition_status === 1 ?
                                                                <button className="btn btn-danger mr-5" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                <button className="btn btn-success mr-5" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                        }
                                                        {' '}
                                                        <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                    </td>
                                                </tr>
                                            ) : <tr>
                                                <td colSpan="4">No Data Found</td>
                                            </tr>
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

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" onChange={(e) => setExcelfile(e.target.files[0])} required />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Yacht Condition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={addyachtcondition}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Label</strong></label>
                                                        <input type='text' className="form-control" name='condition_label' placeholder="Enter Condition Label" autoComplete='off' required />
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Description</strong></label>
                                                        <select className="form-control" name="condition_description" required>
                                                            <option value="" hidden>Select Condition Description</option>
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    </div>
                                                </div> */}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Submit</button>
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

            <Modal size='lg' show={editshowModal} onHide={() => setEditShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Yacht Condition</Modal.Title>
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
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Label</strong></label>
                                                        <input type='text' className="form-control" name='condition_label' placeholder='Enter Condition Label' defaultValue={yacht_condition_label} autoComplete='off' required />
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Description</strong></label>
                                                        <select className="form-control" name="condition_description" required>
                                                            <option value="" hidden>Select Condition Description</option>
                                                            <option value="1" selected={home_condition_description == 1 ? true : false}>Yes</option>
                                                            <option value="0" selected={home_condition_description == 0 ? true : false}>No</option>
                                                        </select>
                                                    </div>
                                                </div> */}
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Description</strong></label>
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
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Update</button>
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
                    <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default ViewYachtConditions
