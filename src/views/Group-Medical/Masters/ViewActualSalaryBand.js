import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../../webroot/sample-files/medical-salary-range.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
const ViewActualSalaryBand = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState();
    const [actualSalaryBand, setMedicalsalaryrange] = useState('')
    const [actualSalaryBand_status, setMedicalsalaryrangestatus] = useState('')
    const [actualSalaryBand_id, setMedicalsalaryrangeid] = useState('')
    const [visible, setVisible] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [medicalpermission, setMedicalpermission] = useState([]);
    const [visaCountry, setVisaCountry] = useState([])
    const [selectedVisaCountry, setSelectedVisaCounty] = useState([])
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getmedicalsalaryrange(page, perPage);
            locationList();
            exportlistdata();
            getMedVisaCountry()
            const userdata = JSON.parse(localStorage.getItem('user'));
            const medical_permission = userdata?.medical_permission?.[0] || {};
            setMedicalpermission(medical_permission);
        }
    }, [])
    const getMedVisaCountry = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const visac = data.data;
                // console.log("data", visac)
                setVisaCountry(visac);
            });
    }


    const getmedicalsalaryrange = async (page, perPage) => {
        setData([]);

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_actualSalaryBand?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log("data", list)
                setData(list)
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
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_actualSalaryBand', requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getmedicalsalaryrange(selectedPage + 1, perPage);
    };

    const updatestatus = async (id, actualSalaryBand_status) => {
        let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_actualSalaryBand_status', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, actualSalaryBand_status })
        })
        result = await result.json();
        swal("Success!", "Status Updated Successfully!", "success");
        getmedicalsalaryrange(page, perPage);
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_actualSalaryBand_excel ",
            {
                method: "post",
                body: fd,
            })
        result = await result.json()
        if (result.status === 200) {
            setVisible(!visible)
            swal({
                text: result.message,
                type: "success",
                icon: "success",
                button: false,
            })
            getmedicalsalaryrange(page, perPage);

            setTimeout(() => {
                swal.close()
            }, 1000);
        }
        else {
            setVisible(!visible)
            swal({
                title: "Error!",
                text: result.message,
                type: "error",
                icon: "error",
                button: "ok",
            })
            getmedicalsalaryrange(page, perPage);

            setTimeout(() => {
                swal.close()
            }, 1000);
        }

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


                setLocation(locationdt);
                handleChange(locationdt);
            });
    }

    const addmedicalsalaryrange = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const actualSalaryBand = data.get('actualSalaryBand');
        const actualSalaryBand_location = selectedOption;
        const actualSalaryBand_location_len = actualSalaryBand_location.length;
        const actualSalaryBand_location_str = [];
        for (let i = 0; i < actualSalaryBand_location_len; i++) {
            actualSalaryBand_location_str.push(actualSalaryBand_location[i]._id);
        }

        let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_actualSalaryBand', {
            method: 'post',
            body: JSON.stringify({
                actualSalaryBand: actualSalaryBand,
                actualSalaryBand_location: actualSalaryBand_location_str
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    setShowModal(false);
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false,
                    })
                    getmedicalsalaryrange(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    setShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false,
                    })
                    getmedicalsalaryrange(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);;
                }
            });
    }


    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    }

    const detailsbyid = async (ParamValue) => {
        setMedicalsalaryrangeid(ParamValue);
        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_actualSalaryBand_detailsbyid`, requestOptions);
        result = await result.json();
        console.log(result.data, ">>>>>>>>> result data")
        setMedicalsalaryrange(result.data[0]?.actual_salary_band);
        setMedicalsalaryrangestatus(result.data[0]?.actual_salary_band_status);
        const locationid = result.data[0]?.salary_range_location;
        const visa_countries = result.data[0]?.visa_countries;
        console.log("visa_countries", visa_countries)
        setSelectedVisaCounty(visa_countries)
        setSelectedOption(locationid)
        setVisibleedit(true)
    }



    const updatemedicalsalaryrange = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const actualSalaryBand = data.get('actualSalaryBand');
        const actualSalaryBand_location = selectedOption;
        const actualSalaryBand_location_len = actualSalaryBand_location.length;
        const actualSalaryBand_location_str = [];
        for (let i = 0; i < actualSalaryBand_location_len; i++) {
            actualSalaryBand_location_str.push(actualSalaryBand_location[i]._id);
        }
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_actualSalaryBand_details`, {
            method: "POST",
            body: JSON.stringify({
                ParamValue: actualSalaryBand_id,
                actualSalaryBand: actualSalaryBand,
                medical_visa_country: selectedVisaCountry,
                actualSalaryBand_location: actualSalaryBand_location_str
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    setVisibleedit(false)
                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false,
                    })
                    getmedicalsalaryrange(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    setVisibleedit(false)
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false,
                    })
                    getmedicalsalaryrange(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMedicalMaster/?id=${id}&type=actualsalaryBand`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getmedicalsalaryrange(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getmedicalsalaryrange(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const AddSalaryRange = () => {
        navigate('/AddActualSalaryBand')
    }

    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Actual Salary Band</h4>
                            </div>
                            <div className="col-md-6">
                                {medicalpermission.salary_range?.includes('create') ?
                                    <button className='btn btn-primary' style={{ float: "right" }} onClick={() => AddSalaryRange()}>Add Salary Band</button>
                                    : ''}
                            </div>
                        </div>
                    </div>
                    {/* <div className="card-header" style={{ textAlign: 'right' }}>
            {medicalpermission.salary_range?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {medicalpermission.salary_range?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {medicalpermission.salary_range?.includes('export') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
              : ''}
          </div> */}
                    <div className="card-body" style={{ overflowX: 'scroll' }}>
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">Salary Band</th>
                                    <th scope="col">Emirates Issuing Visa</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.length > 0 ?
                                        data.map((item, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.actual_salary_band}</td>
                                                <td>{item.visa_countries?.map((val) => val.area_of_registration_name).join(", ")}</td>
                                                <td>{item.salary_range_location?.map((val) => val.location_name).join(", ")}</td>
                                                <td>
                                                    {medicalpermission.salary_range?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                                                    )}
                                                    {' '}
                                                    {medicalpermission.salary_range?.includes('delete') && (
                                                        <>
                                                            {
                                                                item.actual_salary_band_status === 1 ?
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                            }
                                                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
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

            </Container>

            <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div >
                        {/* <label className="form-label"><strong>Upload Excel File</strong></label> */}
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Salary range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={addmedicalsalaryrange}>
                                            <div className="row">
                                                <div className="col-md-6">

                                                    <label className="form-label"><strong>Add Actual Salary Band</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='actualSalaryBand'
                                                        placeholder='Enter Salary range'
                                                        defaultValue=""
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Select Location</strong></label>

                                                    <Multiselect
                                                        options={location}
                                                        selectedValues={location}
                                                        displayValue="location_name"
                                                        onSelect={setSelectedOption}
                                                        onRemove={setSelectedOption}
                                                        placeholder="Select Location"
                                                        showCheckbox={true}
                                                        required
                                                    />
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

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Salary Band</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updatemedicalsalaryrange}>
                                            <div className="row">
                                                <div className="col-md-4">

                                                    <label className="form-label"><strong>Edit Salary Band</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='actualSalaryBand'
                                                        placeholder='Enter Salary range'
                                                        defaultValue={actualSalaryBand}
                                                        required
                                                    />
                                                </div>
                                                <div className='col-md-4'>
                                                    <label>Medical Visa Country</label>
                                                    <Multiselect
                                                        style={{ overflow: 'visible' }}
                                                        options={visaCountry}
                                                        selectedValues={selectedVisaCountry}
                                                        displayValue="area_of_registration_name"
                                                        onSelect={(evnt) => setSelectedVisaCounty(evnt)}
                                                        onRemove={(evnt) => setSelectedVisaCounty(evnt)}
                                                        placeholder="Select Visa Country"
                                                        showCheckbox={true}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label"><strong>Select Location</strong></label>

                                                    <Multiselect
                                                        options={location}
                                                        selectedValues={selectedOption}
                                                        onSelect={handleChange}
                                                        onRemove={handleChange}
                                                        displayValue="location_name"
                                                        placeholder="Select Location"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                        required
                                                    />
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default ViewActualSalaryBand
