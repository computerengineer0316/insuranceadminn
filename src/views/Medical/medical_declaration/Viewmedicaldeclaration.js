import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../../webroot/sample-files/maternity-condition.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
// import filePath from '../../../../webroot/sample-files/Maternity-Condition';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from "react-datepicker";  //https://www.npmjs.com/package/react-datepicker
import "react-datepicker/dist/react-datepicker.css";

const Viewmedicaldeclaration = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [usertype, setUsertype] = useState('');
    const [usertype_status, setUsertypestatus] = useState('');
    const [id, setId] = useState('');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [masterpermission, setMasterpermission] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [location, setLocation] = useState([]);
    const [medicaldeclaration, setMedicalDeclaration] = useState('');
    const [medicaldeclarationstatus, setMedicaldeclarationstatus] = useState('');
    const [medicaldeclarationid, setMedicaldeclarationid] = useState('');
    const [medicaldeclarationedit, setMedicaldeclarationedit] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getdeclaration(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterpermission(master_permission);
            exportlistdata();
            locationList();
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
                setLocation(locationdt);
                handleChange(locationdt);
            });
    }




    const [maternitycondition, setMaternitycondition] = useState('');
    const [details, setDetails] = useState([]);


    const getdeclaration = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalDeclarations?limit=${perPage}&page=${page}`, requestOptions)
            .then(response => response.json())
            .then(
                data => {
                    const total = data.count;
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    const list = data.data;
                    setData(list)
                }
            );
    }

    console.log(data)
    const [exportlist, setExportlist] = useState([]);
    const exportlistdata = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_maternity', requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }
    const fileType = 'xlsx'
    const exporttocsv = () => {
        const updatedData = exportlist.map((item, index) => {
            return {

                'Condition': item.condition,
            }
        })
        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Maternity-conditions" + ".xlsx")
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getdeclaration(selectedPage + 1, perPage);
    };


    const updatestatus = async (id, status) => {

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalDeclaration?id=${id}`, {
            method: 'put',
            body: JSON.stringify({ status: status }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        swal("Updated Succesfully", "", "success");
        getdeclaration(page, perPage)
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_maternity_excel ",
            {
                method: "post",
                body: fd,
            })
        result = await result.json();
        if (result.status == 200) {
            setVisible(!visible)
            swal({
                text: result.message,
                type: "success",
                icon: "success",
                button: false,
            })
            getdeclaration(page, perPage);
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
            getdeclaration(page, perPage);
            setTimeout(() => {
                swal.close()
            }, 1000);
        }
    }


    const addmaternitycondition = async (e) => {
        e.preventDefault();

        await fetch('https://insuranceapi-3o5t.onrender.com/api/maternity', {
            method: 'post',
            body: JSON.stringify({ condition: maternitycondition }),
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
                    getdeclaration(page, perPage);
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
                    getdeclaration(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }




    const getdetails = async (ParamValue) => {
        setId(ParamValue);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalDeclaration?id=${ParamValue}`, requestOptions);
        result = await result.json();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result.data)
        setMedicalDeclaration(result.data[0]?.name);
        setMedicaldeclarationstatus(result.data[0]?.status);
        const locationid = result.data[0]?.locations;
        console.log(locationid)
        setSelectedOption(locationid);
        setVisibleedit(true);
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    }



    const [editmaternitycondition, setEdittermscondition] = useState('');

    const updatedeclaration = async (e) => {
        e.preventDefault();
        if (medicaldeclaration == '') {
            swal({

                text: "Please enter declaration",
                type: "warning",
                icon: "warning",
                button: false,
            })
            getdeclaration(page, perPage);
            setTimeout(() => {
                swal.close()
            }, 1000);
            return false;
        }
        if (selectedOption == '') {
            swal({

                text: "Please select location",
                type: "warning",
                icon: "warning",
                button: false,
            })
            getdeclaration(page, perPage);
            setTimeout(() => {
                swal.close()
            }, 1000);
            return false;
        }
        const data = new FormData(e.target);
        const declaration = data.get("name");
        const declaration_location = selectedOption;
        const declaration_location_len = declaration_location.length;
        const declaration_location_str = [];
        for (let i = 0; i < declaration_location_len; i++) {
            declaration_location_str.push(declaration_location[i]._id);
        }
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalDeclaration?id=${id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: declaration,
                location: declaration_location_str
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
                    getdeclaration(page, perPage);
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
                    getdeclaration(page, perPage);
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMedicalMaster/?id=${id}&type=maternityConditions`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getdeclaration(page, perPage);
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
                    getdeclaration(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const AddCondition = () => {
        navigate("/Addmedicaldeclaration")
    }
    const startFrom = (page - 1) * perPage;

    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Declaration</h4>
                            </div>
                            <div className="col-md-6">
                                {masterpermission.usertype?.includes('create') ?
                                    <button className='btn btn-primary' style={{ float: "right" }} onClick={() => AddCondition(true)}>Add Declaration</button>
                                    : ''}
                            </div>
                        </div>
                    </div>
                    {/* <div className="card-header" style={{ textAlign: 'right' }}>
                        {masterpermission.usertype?.includes('download') ?
                            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }}
                                href={filePath}
                                download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                            : ''}
                        {masterpermission.usertype?.includes('upload') ?
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                            : ''}
                        {masterpermission.usertype?.includes('export') ?
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                            : ''}
                    </div> */}
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th scope="col">#</th>
                                        {/* <th scope="col">userId</th> */}
                                        <th scope="col">name</th>
                                        <th scope="col">location</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.length > 0 ?
                                            data.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{startFrom + index + 1}</td>
                                                    {/* <td>{item.userId}</td> */}
                                                    <td className="text-wrap">{item.name}</td>
                                                    {/* <td>{new Date(item.startDate).toLocaleString()}</td> */}
                                                    <td>{item.locations.map((val) => val.location_name).join(", ")}</td>
                                                    <td>
                                                        {masterpermission.usertype?.includes('edit') && (
                                                            <button className="btn btn-primary" onClick={() => getdetails(item._id)}>Edit</button>
                                                        )}
                                                        {' '}
                                                        {masterpermission.usertype?.includes('delete') && (
                                                            <>
                                                                {
                                                                    item.status === true ?
                                                                        <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, false) }}>Deactivate</button> :
                                                                        <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, true) }}>Activate</button>
                                                                }
                                                                {/* <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button> */}
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
                </div>

            </Container>
            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
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
                    <Modal.Title>Add Maternity Conditions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">

                                    <div className="card-body">
                                        <form>
                                            <div className="row">

                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Add Maternity Condition</strong></label>

                                                    <textarea className="form-control" rows="3" cols="10" name="terms_constions" placeholder="Enter Maternity Condition" onChange={(e) => setMaternitycondition(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={addmaternitycondition}>Submit</button>
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
                    <Modal.Title>Edit Declaration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updatedeclaration} >
                                            <div className="row">
                                                <div className="col-md-6">

                                                    <label className="form-label"><strong>Edit Declaration</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='name'
                                                        placeholder='Name'
                                                        defaultValue={medicaldeclaration}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
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

export default Viewmedicaldeclaration;