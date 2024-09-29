import React, { useState, useEffect } from 'react'
import { Container, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import axios from 'axios';

const ViewTemplateTypes = () => {
    const navigate = useNavigate();
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [templateType, setTemplateType] = useState([]);
    const [typeDetails, setTypeDetails] = useState([]);
    const [id, setId] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [location, setLocation] = useState([]);
    const [defaultlocation, setDefaultLocation] = useState([]);
    const [masterpermission, setMasterPermission] = useState([]);
    useEffect(() => {

        getTemplatetypes(page, perPage);

    }, [])



    const getTemplatetypes = async (page, perPage) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getEmailTypes?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data, "result");
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log(list, "list");
                setTemplateType(list);
                // const list_len = list.length;
                // for (let i = 0; i < list_len; i++) {
                //   setTemplateType(list[i]);
                // }
            });
    }

    const handlesubmit = async (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const template_type = data.get('template_type');
        await fetch('https://insuranceapi-3o5t.onrender.com/api/addEmailType', {
            method: 'POST',
            body: JSON.stringify({
                name: template_type,
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then(response => {
            const status = response.status; // Extract status here
            return response.json().then((data) => ({
                status: status, // Add status to the data object
                data: data
            }));
        })
            .then(data => {
                console.log(data);
                if (data.status == 201) {

                    swal({
                        text: "Template Type Updated Successfully!",
                        type: "success",
                        icon: "success",
                        button: false,
                    });
                    setShowModal(false);
                    getTemplatetypes(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 2000);
                } else {
                    swal({
                        text: data.message,
                        type: "error",
                        icon: "error",
                    });
                }
            })

    }

    const detailsbyid = (ParamValue) => {
        setId(ParamValue);
        const requestOptions = {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/getEmailType/${ParamValue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data, "result by id");
                setTypeDetails(data.data);
                setVisible(true);
            });
    }



    const updateReasonType = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const template_type = data.get('template_type');

        console.log(template_type);
        console.log(id);
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/editEmailType/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                oldname: typeDetails.name,
                name: template_type,
                _id: id
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == 200) {
                    swal({
                        text: "Template Type Updated Successfully!",
                        type: "success",
                        icon: "success",
                        button: false,
                    });
                    setVisible(false);
                    getTemplatetypes(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }
                        , 1000);
                } else {
                    swal({
                        text: "Something went wrong!",
                        type: "error",
                        icon: "error",
                        button: false,
                    });
                    setTimeout(() => {
                        swal.close();
                    }
                        , 1000);
                }
            })
    }


    const updatestatus = async (id, status) => {
        try {
            await fetch('https://insuranceapi-3o5t.onrender.com/api/update_templateType', {
                method: 'POST',
                body: JSON.stringify({
                    reason_status: status,
                    ParamValue: id,
                }),
                headers: {

                    "Content-Type": "application/json"
                }
            }).then((data) => {
                if (data.status == 200) {
                    console.log(data, "response data>>>>>>>>>>")
                    setShowModal(false)
                    swal({
                        title: "Status Updated Successfully!",
                        type: 'success',
                        icon: 'success',
                        button: false,
                    })
                    getTemplatetypes(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                } else {
                    setShowModal(false)
                    swal({
                        title: "Something went wrong!",
                        type: 'error',
                        icon: 'error',
                        button: false,
                    })
                    getTemplatetypes(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteEmailType/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getTemplatetypes(page, perPage);
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
                    getTemplatetypes(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getTemplatetypes(selectedPage + 1, perPage);
    };

    const startFrom = (page - 1) * perPage + 1;

    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Template Types</h4>
                            </div>
                            <div className="col-md-6">

                                <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Types</button>

                            </div>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: 'right' }}>

                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    templateType?.length > 0 ?
                                        templateType.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>
                                                    <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>{' '}
                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
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
            <CModal size='lg' visible={showModal} onHide={() => setShowModal(false)}>
                <CModalHeader onClose={() => setShowModal(false)} >
                    <CModalTitle>Add Template Type</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={handlesubmit}>
                                            <div className="row">
                                                <div className="col-md-6">

                                                    <label className="form-label"><strong>Add Type</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='template_type'
                                                        placeholder="Enter Template Type"
                                                        defaultValue=""
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
                </CModalBody>
                <CModalFooter>
                    <CButton variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={visible} onHide={() => setVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Template Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateReasonType}>
                                            <div className="row">
                                                <div className="col-md-6">

                                                    <label className="form-label"><strong>Edit Type</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='template_type'
                                                        placeholder='Template Type'
                                                        defaultValue={typeDetails?.name}
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
                    <Button variant="secondary" onClick={() => setVisible(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewTemplateTypes