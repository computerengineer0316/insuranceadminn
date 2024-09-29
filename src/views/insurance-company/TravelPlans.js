import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button } from 'react-bootstrap';

TravelPlans.propTypes =
{
    companyId: PropTypes.string,
};

function TravelPlans({ companyId }) {
    const [travelPlans, setTravelPlans] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [uploadid, setUploadid] = useState('');
    const [viewfile, setViewfile] = useState('');
    const [file, setFile] = useState('');

    useEffect(() => {
        getTravelPlans(companyId, page, perPage);
    }, []);

    const getTravelPlans = (companyId, page, perPage) => {
        setTravelPlans([]);
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelPlans`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                setTravelPlans(list);
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setPage(selectedPage);
        getTravelPlans(companyId, selectedPage, perPage);
    };

    const deactivatePlan = (id, status) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusTravelPlan/${id}/${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getTravelPlans(companyId, page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getTravelPlans(companyId, page, perPage);
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

        await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_travel_plan_policywordings_file", requestOptions)
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

    return (
        <div>
            <div>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr className="table-info">
                                <th>Sr No.</th>
                                <th>Travel Insurance For</th>
                                <th>Travel Type</th>
                                <th>Plan Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {travelPlans?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.travel_insurance_for[0]['travel_insurance_for']}</td>
                                    <td>{item.travel_type[0]['travel_type']}</td>
                                    <td>{item.plan_name}</td>
                                    <td>
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <a href={`/EdittravelPlan?id=${item._id}`} className="btn btn-primary">Edit</a>
                                        </div>&nbsp;&nbsp;
                                        {
                                            item.status === 1 ?
                                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}>Deactivate</button></div> :
                                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}>Activate</button></div>
                                        }&nbsp;&nbsp;
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <a href={`/ViewPlanPrice?id=${item._id}`} className="btn btn-dark">Add Plan Price</a>
                                        </div>&nbsp;&nbsp;
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button className="btn btn-success" onClick={() => handlemodal(item._id, item.policywordings_file)}>T & C</button>
                                        </div>&nbsp;&nbsp;
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <a href={`/ViewStandardCover?id=${item._id}&type=travel`} className="btn btn-info">Standard Cover</a>
                                        </div>&nbsp;&nbsp;
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <a href={`/ViewAdditionalCover?id=${item._id}&type=travel`} className="btn btn-warning">Additional Cover</a>
                                        </div>
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

export default TravelPlans
