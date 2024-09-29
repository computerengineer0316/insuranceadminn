import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Row, Modal, Button } from 'react-bootstrap';
import Multiselect from "multiselect-react-dropdown";
import filePath from '../../../webroot/sample-files/Additional-Cover.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const GetAdditionalCover = () => {
    const navigate = useNavigate();
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [lob, setLob] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [selectedOption1, setSelectedOption1] = useState([]);
    const [additionalcover, setAdditionalcover] = useState([]);
    const [additional_cover_label, setAdditional_cover_label] = useState();
    const [additional_cover_description, setAdditional_cover_description] = useState();
    const [additional_cover_status, setAdditional_cover_status] = useState();
    const [additional_cover_id, setAdditional_cover_id] = useState();
    const [editselectedoption, setEditSelectedOption] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editshowModal, setEditShowModal] = useState(false);
    const [excelfile, setExcelfile] = useState("");
    const [masterpermission, setMasterpermission] = useState([]);
    const [location, setLocation] = useState([]);
    const [location_id, setLocation_id] = useState([]);
    const [editselectedlocation, setEditSelectedLocation] = useState([]);
    const [searchvalue, setSearchvalue] = useState('');
    const [filterlob, setFilterLOB] = useState('');
    const [statusvalue, setStatusvalue] = useState(2);






    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getadditionalcover(page, perPage);
            lobList();
            locationList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterpermission(master_permission);
        }
    }, [])
    useEffect(() => {
        getadditionalcover(page, perPage);
    }, [searchvalue, filterlob, statusvalue])
    const getadditionalcover = async (page, perPage) => {
        setAdditionalcover([]);

        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_additional_covers?page=${page}&limit=${perPage}&name=${searchvalue}&lob=${filterlob}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log("additional cover data ", list)

                setAdditionalcover(list);
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
                handlelocationbefore(location_list);
            });
    }



    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getadditionalcover(selectedPage + 1, perPage);
    };

    const lobList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const lobdt = data.data;
                const lob_len = lobdt.length;
                const lob_list = [];
                for (let i = 0; i < lob_len; i++) {
                    const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
                    lob_list.push(lob_obj);
                }
                setLob(lob_list);
                handleChange(lob_list);
            });
    }
    const handlelocationbefore = (value) => {
        setSelectedOption1(value);
    }
    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    }

    const handleEditChange = (editselectedoption) => {
        setEditSelectedOption(editselectedoption);
    }
    const handleChange1 = (value) => {
        setEditSelectedLocation(value);
    };
    const updatestatus = async (id, additional_cover_status) => {
        let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_additional_cover_status',
            {
                method: 'post',
                body: JSON.stringify({ ParamValue: id, additional_cover_status: additional_cover_status }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        result = await result.json();
        swal("Updated Succesfully", "", "success");
        getadditionalcover(page, perPage)
    }


    const addadditionalcover = async (e) => {
        e.preventDefault();
        const additional_cover_label = e.target.additional_cover_label.value;
        const additional_cover_description = e.target.additional_cover_description.value;
        const additional_cover_lob = selectedOption.map(({ value }) => value);
        const additional_cover_location = selectedOption1.map(({ value }) => value);
        console.log(additional_cover_lob, "<<<<<<lob")


        if (additional_cover_lob.length === 0) {
            swal("Please Select lob", "", "error");
            return false;
        }
        if (additional_cover_location.length === 0) {
            swal("Please Select location", "", "error");
            return false;
        }

        const requestOptions =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                additional_cover_label,
                additional_cover_description,
                additional_cover_lob
                , additional_cover_location
            })
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/add_additional_cover', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setShowModal(false);
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    });

                    getadditionalcover(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal("Something Went Wrong", "", "error");
                }
            });
    }

    const detailsbyid = async (ParamValue) => {

        setAdditional_cover_id(ParamValue)
        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_additional_coverbyid`, requestOptions);
        result = await result.json();
        console.log(result.data, "<<<<<<<<<")
        setAdditional_cover_label(result.data[0].additional_cover_label);
        setAdditional_cover_description(result.data[0].additional_cover_description);
        setAdditional_cover_status(result.data[0].additional_cover_status);
        const lobid = result.data[0].lob_result;
        const locationdetails = result.data[0].locations;
        const lob_name_arr_obj = [];
        const location_name_arr_obj = [];
        for (let i = 0; i < lobid.length; i++) {
            const lob_name_arr_obj_obj = { label: lobid[i].line_of_business_name, value: lobid[i]._id };
            lob_name_arr_obj.push(lob_name_arr_obj_obj);
        }
        for (let i = 0; i < locationdetails.length; i++) {
            const location_name_arr_obj_obj = {
                label: locationdetails[i].location_name,
                value: locationdetails[i]._id
            };
            location_name_arr_obj.push(location_name_arr_obj_obj);

        }
        // const location_id = locationdetails?.map(data => ({
        //     label: data.location_name,
        //     value: data._id,
        //     }));
        setLocation_id(location_name_arr_obj)
        setEditSelectedOption(lob_name_arr_obj);
        setEditSelectedLocation(location_name_arr_obj)
        setEditShowModal(true);

        // lobList();
    }

    const editadditionalcover = async (e, id) => {
        e.preventDefault();
        const ParamValue = additional_cover_id;
        console.log(editselectedoption, ">>>>>>>>>>>>>")
        const additional_cover_label = e.target.additional_cover_label.value;
        const additional_cover_description = e.target.additional_cover_description.value;
        const additional_cover_lob = editselectedoption.map((value) => value.value);
        const additional_cover_loc = editselectedlocation.map((value) => value.value);

        if (additional_cover_lob.length === 0) {
            swal("Please Select Location", "", "error");
            return false;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ParamValue,
                additional_cover_label,
                additional_cover_description,
                additional_cover_lob,
                additional_cover_loc
            })
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/update_additional_cover', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    });

                    setEditShowModal(false);
                    getadditionalcover(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal("Something Went Wrong", "", "error");
                }
            });
    }

    const fileType = 'xlsx'
    const exporttocsv = () => {
        const ws = XLSX.utils.json_to_sheet(additionalcover);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Additional-Cover" + ".xlsx")
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_additional_cover_excel ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        swal("Uploaded Succesfully", "", "success");
        getadditionalcover(page, perPage)
    }


    const deleteadditionalcover = async (id) => {

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=additionalCover`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    });
                    getadditionalcover(page, perPage)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal("Something Went Wrong", "", "error");
                }

                getadditionalcover(page, perPage)
            });
    }


    const startFrom = (page - 1) * perPage;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Additional Covers</h4>
                                </div>
                                <div className="col-md-6">
                                    {masterpermission.additional_cover?.includes('create') ?
                                        <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Additional Cover</button>
                                        : ''}
                                </div>
                            </div>
                        </div>
                        <div className="card-header" style={{ textAlign: 'right' }}>
                            {masterpermission.additional_cover?.includes('download') ?
                                <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                : ''}
                            {masterpermission.additional_cover?.includes('upload') ?
                                <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                : ''}
                            {masterpermission.additional_cover?.includes('export') ?
                                <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                : ''}
                        </div>
                        <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                            <div className='col-lg-3'>
                                <label><strong>Search</strong></label><br />
                                <input type="text" className="form-control" placeholder="Search"
                                    onChange={(e) => setSearchvalue(e.target.value)}
                                />

                            </div>
                            <div className='col-lg-3'>
                                <label><strong>Select LOB</strong></label><br />
                                <select className='form-control'
                                    value={filterlob}
                                    onChange={(e) => setFilterLOB(e.target.value)}
                                >
                                    <option hidden>Select LOB</option>
                                    <option value=''>-- All --</option>

                                    {
                                        lob.map((item, index) =>
                                            <option key={index} value={item.value}>{item.label}</option>
                                        )}

                                </select>

                            </div>
                            <div className='col-lg-3'>
                                <label><strong>Status</strong></label><br />
                                <select className='form-control'
                                    value={statusvalue}
                                    onChange={(e) => setStatusvalue(e.target.value)}
                                >
                                    <option value={2}>-- All --</option>
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="card-body" style={{ overflow: 'scroll' }}>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Cover</strong></th>
                                        <th><strong>Description</strong></th>
                                        <th><strong>Location</strong></th>
                                        <th><strong>Line Of Business</strong></th>
                                        <th><strong>Status</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {additionalcover.length > 0 ?
                                        additionalcover.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.additional_cover_label}</td>
                                                <td>{item.additional_cover_description}</td>
                                                <td>{item.locations?.map((val) => val.location_name).join(", ")}</td>
                                                <td>{item.lob_result?.map((val) => val.line_of_business_name).join(", ")}</td>
                                                <td>
                                                    {masterpermission.additional_cover?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                                                    )}
                                                    {' '}
                                                    {masterpermission.additional_cover?.includes('delete') && (
                                                        <>
                                                            {
                                                                item.additional_cover_status === 1 ?
                                                                    <button className="btn btn-danger mr-5" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success mr-5" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                            }
                                                        </>
                                                    )}
                                                    {' '}
                                                    {masterpermission.additional_cover?.includes('delete') && (
                                                        <button className="btn btn-warning mr-5" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteadditionalcover(item._id) }}>Delete</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : <tr>
                                            <td colSpan="6">No Data Found</td>
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
                    <Modal.Title>Add Additional Cover</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={addadditionalcover}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Additional Cover Label</strong></label>
                                                        <input type='text' className="form-control" name='additional_cover_label' placeholder="Enter Additional Cover Label" defaultValue="" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Additional Cover Description</strong></label>
                                                        <input type='text' className="form-control" name='additional_cover_description' placeholder="Enter Additional Cover Description" defaultValue="" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Locations</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={setSelectedOption1}
                                                            onRemove={setSelectedOption1}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Line Of Business</strong></label>
                                                        <Multiselect
                                                            options={lob}
                                                            selectedValues={lob}
                                                            displayValue="label"
                                                            onSelect={setSelectedOption}
                                                            onRemove={setSelectedOption}
                                                            placeholder="Select Line Of Business"
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={editshowModal} onHide={() => setEditShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Additional Cover</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={editadditionalcover}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Additional Cover Label</strong></label>
                                                    <input type='text' className="form-control mb-3"
                                                        name='additional_cover_label'
                                                        placeholder='Name'
                                                        defaultValue={additional_cover_label}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Edit Additional Cover Description</strong></label>
                                                    <input type='text' className="form-control mb-3"
                                                        name='additional_cover_description'
                                                        placeholder='Description'
                                                        defaultValue={additional_cover_description}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Select Line Of business</strong></label>
                                                    <Multiselect
                                                        options={lob}
                                                        selectedValues={editselectedoption}
                                                        onSelect={handleEditChange}
                                                        onRemove={handleEditChange}
                                                        displayValue="label"
                                                        placeholder="Select Location"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                        required
                                                    />

                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Locations</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location_id}
                                                            displayValue="label"
                                                            onSelect={handleChange1}
                                                            onRemove={handleChange1}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
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
                    <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default GetAdditionalCover;