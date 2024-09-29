import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button } from 'react-bootstrap';

MedicalPlans.propTypes =
{
    companyId: PropTypes.string,
};

function MedicalPlans({ companyId }) {
    const [medicalPlans, setMedicalPlans] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [uploadid, setUploadid] = useState('');
    const [viewfile, setViewfile] = useState('');
    const [file, setFile] = useState('');

    useEffect(() => {
        getMedicalPlans(companyId, page, perPage);
    }, []);

    const getMedicalPlans = async (companyId, page, perPage) => {
        setMedicalPlans([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getmedicalplansinsurance?companyId=${companyId}&page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.data[0].data);
                const maindata = data.data;
                const total1 = maindata[0]?.totalCount;
                const total = total1[0]?.total ? total1[0]?.total : 0;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data?.data[0]?.data;
                setMedicalPlans(list);
            });

    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setPage(selectedPage);
        getMedicalPlans(companyId, selectedPage, perPage);
    };


    const deactivatePlan = async (id, status) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusMedicalPlan/${id}/${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getMedicalPlans(companyId, page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getMedicalPlans(companyId, page, perPage);
                    });
                }
            });
    }

    const handlemodal = (id, policywording) => {
        setShowModal(true);
        setUploadid(id);
        setViewfile(policywording);
    }

    const handleFileuploads = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('policywordings_file', file);
        formData.append('id', uploadid);

        const requestOptions = {
            method: 'POST',
            body: formData,
        };

        await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_medical_plan_policywordings_file", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        setShowModal(false);
        swal({
            title: "Success!",
            text: "Policy Wordings File Uploaded Successfully",
            icon: "success",
            button: "Ok",
        })
    }

    console.log(medicalPlans);

    const startFrom = (page - 1) * perPage;

    return (
        <div>
            <div>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr className="table-info">
                                <th>Sr No.</th>
                                <th>Plan Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalPlans?.map((item, index) => (
                                <tr key={index}>
                                    <td>{startFrom + index + 1}</td>

                                    <td>{item.plan_name}</td>
                                    <td>
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <a href={`/EditMedicalPlan?id=${item._id}`} className="btn btn-primary">Edit</a>
                                        </div>&nbsp;&nbsp;
                                        {
                                            item.status === 1 ?
                                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}>Deactivate</button></div> :
                                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}>Activate</button></div>
                                        }&nbsp;&nbsp;
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button className="btn btn-success" onClick={() => handlemodal(item._id, item.policywordings_file)}>T & C</button>
                                        </div>&nbsp;&nbsp;
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <a href={`/ViewStandardCover?id=${item._id}&type=medical`} className="btn btn-info">Standard Cover</a>
                                        </div>&nbsp;&nbsp;
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <a href={`/ViewAdditionalCover?id=${item._id}&type=medical`} className="btn btn-warning">Additional Cover</a>
                                        </div>&nbsp;&nbsp;
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
            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="name">Policy Wordings/T&C</label>
                                    <input type="file" className="form-control" id="file" name="file" onChange={(event) => setFile(event.target.files[0])} />
                                </div>
                            </div>
                            {viewfile == '' || viewfile == null
                                || viewfile == undefined ||
                                viewfile == 'undefined' || viewfile.length == 0 ?
                                "" :
                                <div className="col-md-6">
                                    <a className="btn btn-warning" href={`https://insuranceapi-3o5t.onrender.com/uploads/${viewfile}`} style={{ position: 'relative', top: '23px' }} rel="noreferrer" target='_blank'>view</a>
                                </div>
                            }
                        </Row>
                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleFileuploads}>
                        Upload
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MedicalPlans