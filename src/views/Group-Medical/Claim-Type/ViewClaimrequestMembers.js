import React, { useEffect, useState } from 'react'
import { Accordion, Col, Container, Row, Table } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import swal from 'sweetalert';



const ViewClaimrequestMembers = () => {
    const navigate = useNavigate()
    const [NewlyAddedMembers, setNewlyAddedMembers] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedcompany, setSelectedCompany] = useState('');
    const [insurancecompany, setCompanyList] = useState([]);
    const [emailfilter, setEmailFilter] = useState('');
    const [tpa, setTPAs] = useState([]);
    const [network, setNetwork] = useState([]);
    const [tipaFilter, setTIPAFIlter] = useState('');
    const [networkFilter, setNetworkFilter] = useState('');
    const [policyNumberFilter, setPolicyNumberFilter] = useState('');
    const [hrid, setHrid] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [payloadDocs, setPayloadDocs] = useState([]);
    const [showfileUpload, setShowfileUpload] = useState(false);
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    const [leadId, setLeadId] = useState('');
    const [viewFile, setViewFile] = useState('');
    const [viewFileModal, setViewFileModal] = useState(false);
    const [claimstatusfilter, setClaimStatus] = useState('')
    const [claimStatusData, setClaimStatusData] = useState([])
    const [companyAndPlan, setCompanyAndPlanName] = useState({})

    useEffect(() => {
        const url = window.location.href;
        // const url1 = url.split("/")[3];
        // const url2 = url1.split("?")[1];
        const id = url.split("=")[1];
        setHrid(id);
        getCompanyAndPlanName(id)
        getNewlyAddedMembers(page, perPage, id)
        company_list();
        tpa_list();
        get_Networks();
        getRequiredDocList();
        getClaimStatus();
    }, [])

    useEffect(() => {
        const url = window.location.href;
        const id = url.split("=")[1];
        getNewlyAddedMembers(page, perPage, id)
    }, [selectedcompany, emailfilter, tipaFilter, networkFilter, policyNumberFilter, claimstatusfilter])

    const get_Networks = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                setNetwork(locationdt)
            });
    }
    const getClaimStatus = () => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getActiveClaimStatus', reqOptions)
            .then(response => response.json())
            .then(data => {
                // console.log(data.data, "claim status data")
                setClaimStatusData(data.data)
            })
    }
    const tpa_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                setTPAs(locationdt)
            });
    }
    const gotToCloseFileModal = () => {
        setShowfileUpload(false)
        setFile('')
    }
    const handlewindow = (file) => {
        setViewFile(file)
        setViewFileModal(true)
    }
    const company_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/company_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCompanyList(data.data);
            });
    }
    const getNewlyAddedMembers = (page, limit, id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getClaimUserInAdmin?page=${page}&limit=${limit}&plan=${id}&email=${emailfilter}&claimstatus=${claimstatusfilter}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNewlyAddedMembers(data.data)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
            });
    }
    const getCompanyAndPlanName = (planid) => {
        const reqOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/GetPlanAndCompanyName?id=${planid}`, reqOption)
            .then(response => response.json())
            .then(data => {
                setCompanyAndPlanName(data.data[0])
            });
    }
    const handlePageClick = (data) => {
        const selected = data.selected;
        setPage(selected + 1);
        getNewlyAddedMembers(selected + 1, perPage, hrid)
    };

    const handleCheckboxChange = (e, id) => {
        const stateValue = [...selectedMembers]

        if (e.target.checked === true) {
            // id['checked'] = 'checked';
            stateValue.push(id)
        } else if (e.target.checked === false) {

            const indx = stateValue.indexOf(id)
            console.log(indx)
            stateValue.splice(indx, 1)
        }
        setSelectedMembers(stateValue)

    };
    const ApproveMembersPolicy = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                approvedBy: hrid,
                leadId: selectedMembers
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/approvedGroupMedicalMember`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 201) {
                    swal("Members Added Successfully", {
                        icon: "success",
                    });
                    setSelectedMembers([])
                    getNewlyAddedMembers(page, perPage, hrid)

                } else {
                    swal("Something went wrong", {
                        icon: "error",
                    });
                }
            });
    }
    const getRequiredDocList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getDocumentsLob?lob=groupMedical`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setDocuments(data.data)
            });
    }
    const GoToSeeDocs = (docs, id) => {
        setLeadId(id)
        const docArr = [];
        documents.map((item, index) => {
            docArr.push({
                name: item.document_type,
                file: false
            })
        })
        if (docs && docs.length > 0) {
            for (let i = 0; i < docArr.length; i++) {
                for (let j = 0; j < docs.length; j++) {
                    if (docArr[i].name == docs[j].name) {
                        docArr[i].file = docs[j].file
                        break;
                    }
                }
            }
        }

        setPayloadDocs(docArr)
        setShowModal(true)
    }
    const openUploadModal = (name) => {
        // alert(name)
        setFileName(name)
        setShowfileUpload(true)
    }
    const UpdateMembersDocuments = () => {

        const formdata = new FormData();
        formdata.append('file', file);
        formdata.append('name', fileName);
        console.log(file, fileName, "this is form data")
        const requestOptions = {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formdata
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGroupMedicalDoccument?id=${leadId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal("Document Uploaded Successfully", {
                        icon: "success",
                    });
                    getNewlyAddedMembers(page, perPage, hrid)
                    setShowfileUpload(false)
                    setShowModal(false)
                } else {
                    swal("Something went wrong", {
                        icon: "error",
                    });
                    setShowfileUpload(false)
                    setShowModal(false)
                }
            });
    }
    const deleteItem = (id) => {
        try {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },

            }
            fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteSingleLeadBYId?id=${id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })

                        getNewlyAddedMembers(page, perPage, hrid)
                        setTimeout(() => {
                            swal.close()
                        }, 2000);
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false
                        })
                        getNewlyAddedMembers(page, perPage, hrid)
                        setTimeout(() => {
                            swal.close()
                        }, 2000);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }

    const startFrom = (page - 1) * perPage;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4 className="card-title">Claim Request Members</h4>
                                </div>

                                <div className="col-md-8">

                                    <button className='btn btn-primary' onClick={() => navigate('/ViewClaimRequest')} style={{ float: 'right' }}>Back</button>

                                </div>
                            </div>
                            <div className='row'>
                                {/* <div className="col-md-8"> */}
                                {/* {
                                        selectedMembers.length > 0 ? <button className='btn btn-danger' onClick={()=>ApproveMembersPolicy()}>Add Members</button> : null
                                    } */}
                                <label><h6><strong>Company Name </strong>: {companyAndPlan?.companyData?.company_name}</h6></label>
                                {/* </div> */}
                                <label><h6><strong>Customer Name </strong>: {companyAndPlan?.plan_name}</h6></label>
                            </div>
                        </div>
                        <div className="card-body">
                            <Accordion defaultActiveKey="0" >
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className='modifyaccordian'>Filters </Accordion.Header>
                                    <Accordion.Body>

                                        <div className='card-header'>
                                            <div className='row'>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Email</strong></label><br />
                                                    <input type="text" className="form-control" placeholder="Search Plan" onChange={(e) => setEmailFilter(e.target.value)} />
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Claim Status</strong></label>
                                                    <select
                                                        className='form-control'
                                                        onChange={(e) => setClaimStatus(e.target.value)}
                                                    >
                                                        <option value=''>--All--</option>
                                                        {
                                                            claimStatusData?.map((item, index) => (
                                                                <option key={index} value={item.status_name}>{item.status_name}</option>
                                                            ))
                                                        }
                                                    </select>

                                                </div>

                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr className="table-info" >
                                                <th>No.</th>
                                                <th>Employee ID</th>
                                                <th>Employee Name</th>
                                                <th>Email</th>
                                                <th>Phone No.</th>
                                                <th>Claim No.</th>
                                                <th>Claim Date</th>
                                                <th>Treatement Date</th>
                                                <th>Claim Status</th>
                                                <th>Settled Date</th>
                                                <th>Claim Amount</th>
                                                <th>Settled Amount</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                NewlyAddedMembers && NewlyAddedMembers.length > 0 ?
                                                    NewlyAddedMembers?.map((item, index) => (

                                                        <tr key={index}>
                                                            <td>{startFrom + index + 1}</td>
                                                            <td>{item?.memberData[0]?.SINumber}</td>
                                                            <td>{item?.memberData[0]?.firstName + " " + item?.memberData[0]?.middleName + " " + item?.memberData[0]?.lastnName}</td>
                                                            <td >{item?.memberData[0]?.email}</td>
                                                            <td >{item?.memberData[0]?.phoneno}</td>
                                                            <td >{item?.claimNymber}</td>
                                                            <td >{item?.memberData[0]?.createdAt?.slice(0, 10)}</td>
                                                            <td >{item?.dateOfTreatment?.slice(0, 10)}</td>
                                                            <td >{item?.claimStatus}</td>
                                                            <td >{item?.settledDate?.slice(0, 10)}</td>
                                                            <td>{item?.claimAmountFromHr}</td>
                                                            <td>{item?.paidAmount}</td>
                                                            <td >
                                                                <button className='btn btn-primary mx-1' onClick={() => navigate(`/EditClaimrequestMemberdetails?id=${item._id}`)}>Edit</button>
                                                                <button className='btn btn-info mx-1' onClick={() => navigate(`/GroupMedicalClaim?id=${item._id}`)}>Claim</button>
                                                            </td>


                                                        </tr>
                                                    )) : <tr><td colSpan="5">No data found</td></tr>}
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
                            <Modal size='md' show={showfileUpload} onHide={() => gotToCloseFileModal()}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Upload Document</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                        <div>
                                            <Row>
                                                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                                            </Row>
                                        </div>
                                    </Container>
                                </Modal.Body>
                                <Modal.Footer>
                                    {file ?
                                        <Button variant="primary" onClick={() => UpdateMembersDocuments()}>
                                            Update
                                        </Button> : null
                                    }
                                    <Button variant="danger" onClick={() => gotToCloseFileModal()}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Upload Member Documents</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                        <div>
                                            <Row>
                                                <Col lg={12} style={{ width: '100%', overflowY: 'scroll', height: '300px' }}>
                                                    <Table bordered hover>
                                                        <thead>
                                                            <tr>
                                                                <th>Sr.</th>
                                                                <th>Document Name</th>
                                                                <th>View / Upload</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {payloadDocs.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.name}</td>
                                                                    <td>
                                                                        {item?.file != false ? (

                                                                            <button
                                                                                className="btn btn-warning "
                                                                                key={index}
                                                                                onClick={() => handlewindow(item.file)}
                                                                            >
                                                                                View
                                                                            </button>


                                                                        ) : ""

                                                                        }
                                                                        <button className='btn-primary border-primary text-primary mx-2' style={{ float: 'right' }} onClick={() => openUploadModal(item.name)}>Upload</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                    </Table>
                                                </Col>
                                            </Row>
                                        </div>
                                        {/* <Row>
                                            <Col lg={12}>
                                                <Button className='btn btn-primary mt-3 mb-3'
                                                    // onClick={uploadAllDocuments}
                                                >
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row> */}
                                    </Container>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal size='lg' show={viewFileModal} onHide={() => setViewFileModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>View Document</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                        <div>
                                            <Row>
                                                <Col lg={12}>
                                                    <img src={`https://insuranceapi-3o5t.onrender.com/documents/${viewFile}`} alt="file" style={{ width: '100%', height: '100%' }} />
                                                </Col>
                                            </Row>
                                        </div>
                                    </Container>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setViewFileModal(false)}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ViewClaimrequestMembers
