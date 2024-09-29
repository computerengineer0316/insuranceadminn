import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button } from 'react-bootstrap';

MotorPlans.propTypes =
{
    companyId: PropTypes.string,
};

function MotorPlans({ companyId }) {
    const [motorPlans, setMotorPlans] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [uploadid, setUploadid] = useState('');
    const [viewfile, setViewfile] = useState('');
    const [file, setFile] = useState('');

    useEffect(() => {
        getMotorPlans(companyId, page, perPage);
    }, []);

    const getMotorPlans = (companyId, page, perPage) => {
        setMotorPlans([]);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyId: companyId,
                page: page,
                perPage: perPage
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMotorPlans`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    const total = data.total;
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    console.log(data.data)
                    const list = data.data;
                    setMotorPlans(list);
                }
            });
    }

    const deactivatePlan = (id, status) => {
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusMotorPlan/${id}/${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getMotorPlans(companyId, page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getMotorPlans(companyId, page, perPage);
                    });
                }
            });
    }

    const handlemodal = (id, policywording) => {
        setShowModal(true);
        setUploadid(id);
        setViewfile(policywording);
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getMotorPlans(companyId, selectedPage + 1, perPage);
    };

    const handleFileuploads = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('policywordings_file', file);
        formData.append('id', uploadid);

        const requestOptions = {
            method: 'POST',
            body: formData,
        };

        await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_policywordings_file", requestOptions)
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
                                <th>Policy Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                motorPlans.map((plan, index) => (
                                    <tr key={index}>
                                        <td>{startFrom + index + 1}</td>
                                        <td>{plan.plan_name}</td>
                                        <td>{plan.policy_type[0]['policy_type_name']}</td>
                                        <td>
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <a href={`/EditMotorPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                            </div>&nbsp;&nbsp;
                                            {
                                                plan.status === 1 ?
                                                    <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                                    <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                            }&nbsp;&nbsp;
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                            </div>
                                            &nbsp;&nbsp;
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <a href={`/ViewStandardCover?id=${plan._id}&type=motor`} className="btn btn-info">Standard Cover</a>
                                            </div>&nbsp;&nbsp;
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <a href={`/ViewAdditionalCover?id=${plan._id}&type=motor`} className="btn btn-warning">Additional Cover</a>
                                            </div>&nbsp;&nbsp;
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <a href={`/Nonapplicablenationality?id=${plan._id}`} className="btn btn-dark">Nationality (Plan Non-Applicable)</a>
                                            </div>&nbsp;&nbsp;
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <a href={`/blacklistvehicle?id=${plan._id}`} className="btn btn-secondary">Black List vehicle</a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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

export default MotorPlans
