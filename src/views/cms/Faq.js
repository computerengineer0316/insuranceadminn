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

const Faq = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqContent, setFaqContent] = useState('');
    const [faqId, setFaqId] = useState('');
    const [editquestion, setEditquestion] = useState([]);
    const [editanswer, setEditanswer] = useState([]);


    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(faqQuestion, faqContent);
            if (faqQuestion == '') {
                swal("Please Enter Question", {
                    icon: "warning",
                });
                return;
            }
            else if (faqContent == '') {
                swal("Please Enter Answer", {
                    icon: "warning",
                });
                return;
            }

            await fetch(`https://insuranceapi-3o5t.onrender.com/api/addfaqContent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    faqQuestion: faqQuestion,
                    faqContent: faqContent
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if (data.status == 200) {
                        swal({
                            text: "FAQ Added Successfully!",
                            icon: "success",
                        });
                        setShowModal(false);
                        getfaqdata();
                    } else {
                        swal({
                            text: data.message,
                            icon: "error",
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getfaqdata();
    }, []);


    const getfaqdata = async () => {
        try {

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };

            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getfaqContent`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if (data.status == 200) {
                        setData(data.data);
                    } else {
                        swal({
                            text: data.message,
                            icon: "error",
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log(error);
        }
    }

    console.log(data);

    const getfaqbyid = async (id) => {
        try {
            setFaqId(id);
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };

            const result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/getfaqContentById?id=${id}`, requestOptions)
            const data = await result.json();
            setEditquestion(data.data.faqQuestion);
            setEditanswer(data.data.faqContent);
            setVisible(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleupdate = async (e) => {
        e.preventDefault();
        try {
            console.log(editquestion, editanswer);
            if (editquestion == '') {
                swal("Please Enter Question", {
                    icon: "warning",
                });
                return;
            }
            else if (editanswer == '') {
                swal("Please Enter Answer", {
                    icon: "warning",
                });
                return;
            }

            await fetch(`https://insuranceapi-3o5t.onrender.com/api/editfaqContent?id=${faqId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    faqQuestion: editquestion,
                    faqContent: editanswer,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if (data.status == 200) {
                        swal({
                            text: "FAQ Updated Successfully!",
                            icon: "success",
                        });
                        setVisible(false);
                        getfaqdata();
                    } else {
                        swal({
                            text: data.message,
                            icon: "error",
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log(error);
        }
    }

    const deleteItem = async (id) => {
        try {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/deletefaqContent?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if (data.status == 200) {
                        swal({
                            text: "FAQ Deleted Successfully!",
                            icon: "success",
                        });
                        getfaqdata();
                    } else {
                        swal({
                            text: data.message,
                            icon: "error",
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title"></h4>
                            </div>
                            <div className="col-md-6">

                                <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add FAQ</button>

                            </div>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: 'right' }}>
                        {/* <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a> */}
                        {/* <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button> */}
                        {/* <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button> */}
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">Question</th>
                                    <th scope="col">Answer</th>
                                    <th scope="col">Action</th>


                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.length > 0 ?
                                        data?.map((item, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className='text-wrap'>{item.faqQuestion}</td>
                                                <td className='text-wrap'>{item.faqContent}</td>
                                                <td>
                                                    <button className="btn btn-primary" onClick={() => getfaqbyid(item._id)}>Edit</button>
                                                    {' '}
                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                </td>
                                                {/* <td>
                                                  {masterpermission?.reason_type.includes('edit') ?
                                                      <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                                                      : ""}
                                                  {' '}
                                                  {masterpermission?.reason_type?.includes('delete') && (
                                                      <>
                                                          {
                                                              item.status == 1 ?
                                                                  <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                  <button className="btn btn-success mx-1" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                          }
                                                          <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to Delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                      </>
                                                  )}
                                              </td> */}
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
            <CModal size='lg' visible={showModal} onClick={() => setShowModal(false)}>
                <CModalHeader onClose={() => setShowModal(false)} >
                    <CModalTitle>Add FAQ</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={handlesubmit}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="form-label"><strong>Add Question</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='reason_type'
                                                        placeholder="Enter Question"
                                                        defaultValue=""
                                                        required
                                                        onChange={(e) => setFaqQuestion(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Add Answer</strong></label>
                                                        <textarea type='text' className="form-control"
                                                            name='reason_type'
                                                            placeholder="Enter Answer"
                                                            defaultValue=""
                                                            required
                                                            onChange={(e) => setFaqContent(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={handlesubmit}>Submit</button>{' '}

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

            <Modal size='lg' show={visible} onClick={() => setVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit FAQ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST">
                                            <div className="row">
                                                <div className="col-md-6">

                                                    <label className="form-label"><strong>Edit Question</strong></label>
                                                    <input type='text' className="form-control"
                                                        name='reason_type'
                                                        placeholder='Reason'
                                                        defaultValue={editquestion}
                                                        required
                                                        onChange={(e) => setEditquestion(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Edit Answer</strong></label>
                                                        <textarea type='text' className="form-control"
                                                            name='reason_type'
                                                            placeholder='Reason'
                                                            defaultValue={editanswer}
                                                            required
                                                            onChange={(e) => setEditanswer(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={handleupdate}>Submit</button>
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
        </div>
    )
}

export default Faq;