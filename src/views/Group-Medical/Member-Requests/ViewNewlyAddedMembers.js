import React, { useEffect, useState } from 'react'
import { Accordion, Col, Container, Row, Table } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ColorRing } from 'react-loader-spinner';


const ViewNewlyAddedMembers = () => {
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
    const [typE, setType] = useState('')
    const [companyAndPlan, setCompanyAndPlanName] = useState({})
    const [exportData, setExportData] = useState([])
    const [loader, setLoader] = useState(false)
    // const [selectAll, setSelectAll] = useState(false)
    // const [clearAll,setClearAll] = useState(false)

    useEffect(() => {
        const url = window.location.href;

        const url1 = url.split("?")[1];
        const url2 = url1.split("&");
        const id = url2[0]?.split('=')[1];
        const type = url2[1]?.split('=')[1];

        setHrid(id);
        setType(type)
        getCompanyAndPlanName(id)

        getNewlyAddedMembers(page, perPage, id, type)
        company_list();
        tpa_list();
        get_Networks();
        getRequiredDocList();
    }, [])

    useEffect(() => {
        const url = window.location.href;
        const url1 = url.split("?")[1];
        const url2 = url1.split("&");
        const id = url2[0]?.split('=')[1];
        const type = url2[1]?.split("=")[1]
        getNewlyAddedMembers(page, perPage, id, type)
    }, [selectedcompany, emailfilter, tipaFilter, networkFilter, policyNumberFilter])
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
    const getNewlyAddedMembers = (page, limit, id, type) => {
        setLoader(true)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAdminHrUserLeads?page=${page}&limit=${limit}&leadType=${type}&company=${selectedcompany}&email=${emailfilter}&tpa=${tipaFilter}&network=${networkFilter}&policyNumber=${policyNumberFilter}&planId=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNewlyAddedMembers(data.data)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setLoader(false)
            });
    }

    const handlePageClick = (data) => {
        const selected = data.selected;
        setPage(selected + 1);
        getNewlyAddedMembers(selected + 1, perPage, hrid, typE)
    };

    const handleCheckboxChange = (e, id) => {
        const stateValue = [...selectedMembers]
        const exportValue = [...exportData]
        if (e.target.checked === true) {

            stateValue.push(id)
            const foundData = NewlyAddedMembers.find((item) => item._id == id)
            exportValue.push(foundData)
        } else if (e.target.checked === false) {

            const indx = stateValue.indexOf(id)
            const foundData = NewlyAddedMembers.find((item) => item._id == id)

            const exportIndx = exportValue.indexOf(foundData)

            stateValue.splice(indx, 1)
            exportValue.splice(exportIndx, 1)
        }

        setSelectedMembers(stateValue)
        setExportData(exportValue)


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
                        button: false
                    });
                    setSelectedMembers([])
                    setExportData([])
                    getNewlyAddedMembers(page, perPage, hrid, typE)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);

                } else {
                    swal("Something went wrong", {
                        icon: "error",
                        button: false
                    });
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalDocuments?category=new`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setDocuments(data.data)
                console.log(data.data, "this is doc list")
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

        // if (docs && docs.length > 0) {
        //     for (let i = 0; i < docArr.length; i++) {
        //         for(let j=0;j<docs.length;j++){
        //             if (docArr[i].name == docs[j].name) {
        //                 docArr.push({
        //                     name: docArr[i].name,
        //                     file: docs[j].file
        //                 })
        //                 break;
        //             }else{
        //                 docArr.push({
        //                     name: docArr[i].name,
        //                     file: false
        //                 })
        //                 break;
        //             }
        //         }
        //     }
        // } else {
        //     for (let i = 0; i < documents.length; i++) {
        //         docArr.push({
        //             name: documents[i].document_type,
        //             file: false
        //         })

        //     }
        // }
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
                    swal({
                        text: "Document Uploaded Successfully",
                        type: 'success',
                        icon: "success",
                        button: false
                    });
                    getNewlyAddedMembers(page, perPage, hrid, typE)
                    setShowfileUpload(false)
                    setShowModal(false)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                } else {
                    swal({
                        text: "Something went wrong",
                        type: 'success',
                        icon: "error",
                        button: false
                    });
                    setShowfileUpload(false)
                    setShowModal(false)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
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

                        getNewlyAddedMembers(page, perPage, hrid, typE)
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
                        getNewlyAddedMembers(page, perPage, hrid, typE)
                        setTimeout(() => {
                            swal.close()
                        }, 2000);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }

    const fileType = 'xlsx'
    const exportDataToExcel = () => {
        const updatedExportData = exportData.map((item, index) => {
            return {
                'Sl No.': item?.SINumber,
                'First Name': item?.firstName,
                'Middle Name': item?.middleName,
                'Last Name': item?.lastnName,
                'Employee Number': item?.employeeNumber,
                'Date Of Birth': item?.dateOfBirth,
                'Gender': item?.gender,
                'Marital Status': item?.maritalStatus,
                'Relation': item?.relation,
                'Category': item?.category,
                'Region': item?.regino,
                'LSB': item?.LSB,
                'Nationality': item?.nationality,
                'Passport Number': item?.passportNumber,
                'Eid Number': item?.EidNumber,
                'Uid Number': item?.UidNumber,
                'Visa Issued Location': item?.visaIssuedLocation,
                'Actual Salary Band': item?.actualSalryBand,
                'Person Commission': item?.personCommission,
                'Residential Location': item?.residentialLocation,
                'Work Location': item?.workLocation,
                'Mobile Number': item?.phoneno,
                'Email': item?.email,
                'Photo File Name': item?.photoFileName,
                'Sponsor Type': item?.sponsorType,
                'Sponsor Id': item?.sponsorId,
                'Sponsor Contact Number': item?.sponsorContactNumber,
                'Sponsor Contact Email': item?.sponsorContactEmail,
                'Occupation': item?.occupation,
                'Additional Effective Date': item?.AdditionEffectiveDate,
                'Visa File Number': item?.visaFileNumber,
                'Birth Certeficate Number': item?.birthCertificateNumber,
            }
        })

        const ws = XLSX.utils.json_to_sheet(updatedExportData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "MemberList" + ".xlsx")

        selectedMembers?.map((item, index) => {
            const a = document.getElementById(item)
            a.checked = false;
        })
        setExportData([])
        setSelectedMembers([])
    }
    const getAllLeads = (e) => {
        if (e.target.checked == true) {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/getAdminHrUserLeads?leadType=${typE}&company=${selectedcompany}&email=${emailfilter}&tpa=${tipaFilter}&network=${networkFilter}&policyNumber=${policyNumberFilter}&planId=${hrid}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const idarr = data.data?.map((item) => item._id)
                    setSelectedMembers(idarr)
                    idarr?.map((item, index) => {
                        let found = NewlyAddedMembers?.find((val) => val._id == item)
                        if (found) {
                            const a = document.getElementById(item)
                            a.checked = true;
                            console.log(a)
                        }
                    })
                });
        } else {
            selectedMembers?.map((item, index) => {
                let found = NewlyAddedMembers?.find((val) => val._id == item)
                if (found) {
                    const a = document.getElementById(item)
                    a.checked = false;
                    console.log(a)
                }
            })
            setSelectedMembers([])
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
                                    <h4 className="card-title">{typE == 'newlyAdded' ? 'Member Requests' : 'Delete Requests'}</h4>
                                </div>
                                <div className="col-md-4">

                                    <button disabled={selectedMembers.length > 0 ? false : true} className='btn btn-danger text-white' onClick={() => ApproveMembersPolicy()}>{typE == 'newlyAdded' ? "Add Members" : "Delete Members"}</button>

                                </div>
                                <div className="col-md-4">
                                    <button className='btn btn-primary mx-2' onClick={() => navigate('/ViewGroupMedicalPlans')} style={{ float: 'right' }}>Back</button>
                                    <button disabled={selectedMembers.length > 0 ? false : true} className='btn btn-success text-white' style={{ float: 'right' }} onClick={() => exportDataToExcel()}>Export to Excel</button>

                                </div>
                            </div>
                            <div className='row'>
                                <label><h6><strong>Company Name </strong>: {companyAndPlan?.companyData?.company_name}</h6></label>
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
                                                {/* <div className='col-lg-3'>
                                                    <label><strong>Filter By Insurance co.</strong></label><br />
                                                    <select
                                                        className='form-control'
                                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                                    >
                                                        <option value="">-- All --</option>
                                                        {insurancecompany?.map((item, index) => (
                                                            <option key={index} value={item._id}>{item.company_name}</option>
                                                        ))}

                                                    </select>
                                                </div> */}
                                                {/* <div className='col-lg-3'>
                                                    <label><strong>Filter By Email</strong></label><br />
                                                    <input type="text" className="form-control" placeholder="Search Plan" onChange={(e) => setEmailFilter(e.target.value)} />
                                                </div> */}
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By TPA</strong></label><br />
                                                    <select
                                                        className='form-control'
                                                        // value={selectedcompany}
                                                        onChange={(e) => setTIPAFIlter(e.target.value)}
                                                    >
                                                        <option value="">-- All --</option>
                                                        {tpa?.map((item, index) => (
                                                            <option key={index} value={item._id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Network</strong></label><br />
                                                    <select
                                                        className='form-control'
                                                        onChange={(e) => setNetworkFilter(e.target.value)}
                                                    >
                                                        <option value="">-- All --</option>
                                                        {network?.map((item, index) => (
                                                            <option key={index} value={item._id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Policy Number</strong></label><br />
                                                    <input type="text" className="form-control" placeholder="Enter policy Number" onChange={(e) => setPolicyNumberFilter(e.target.value)} />
                                                </div>
                                                {/* <div className='col-lg-3'>
                                                    <label><strong>Select Status</strong></label><br />
                                                    <select className='form-control'
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    >
                                                        <option value={2}>-- All --</option>
                                                        <option value={1}>Active</option>
                                                        <option value={0}>Inactive</option>
                                                    </select>
                                                </div> */}
                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <div className="card-body">
                                <div className="table-responsive">
                                    {loader ? <div className='row d-flex justify-content-center'>
                                        <ColorRing
                                            visible={true}
                                            height="80"
                                            width="80"
                                            ariaLabel="color-ring-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="color-ring-wrapper"
                                            colors={['#e70808', '#003399', '#e70808', '#e70808', '#fff']}
                                        />
                                    </div> : ""}
                                    <div className='radio-square m-2'>
                                        <td>
                                            <label><strong>Select All</strong></label>
                                            <input className='form-check-input mx-2' onClick={(e) => getAllLeads(e)} type='checkbox' name='selectall' />
                                        </td>
                                    </div>
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr className="table-info" >
                                                <th>No.</th>
                                                <th>Tick</th>
                                                <th>Request Type</th>
                                                <th>Name</th>
                                                <th>Email ID</th>
                                                <th>Phone No.</th>
                                                <th>HR</th>
                                                <th>Request Date</th>
                                                {/* <th>Approval Date</th> */}
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                NewlyAddedMembers && NewlyAddedMembers.length > 0 ?
                                                    NewlyAddedMembers?.map((item, index) => (

                                                        <tr key={index}>
                                                            <td>{startFrom + index + 1}</td>
                                                            <td key={item._id}>
                                                                <div className="checkboxs">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={item._id}
                                                                        defaultChecked={selectedMembers?.includes(item._id) ? true : false}
                                                                        onChange={(e) => handleCheckboxChange(e, item._id)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            < td >{item.requestType == 'Newly Added' ? 'New' : item.requestType == "DeLete Request" ? 'Delete' : '-'}</td>
                                                            <td>{item.firstName && item.middleName && item.lastnName ? item.firstName + " " + item.middleName + " " + item.lastnName : "-"}</td>
                                                            <td >{item.email}</td>
                                                            <td >{item.phoneno}</td>
                                                            <td >{item.HRUser[0]?.name}</td>
                                                            <td >{item.sentToJdvDate && item.sentToJdvDate != '' ? item.sentToJdvDate?.slice(0, 10) : '-'}</td>
                                                            {/* <td >{item.updatedAt?.slice(0, 10)}</td> */}
                                                            <td >
                                                                <button className='btn btn-info mx-1' onClick={() => GoToSeeDocs(item.documents, item._id)}>Documents</button>
                                                                <button className='btn btn-warning mx-1' onClick={() => navigate(`/MemberDetails?id=${item._id}`)}>View</button>
                                                                <button className='btn btn-primary mx-1' onClick={() => navigate(`/EditMemberDetails?id=${item._id}`)}>Edit</button>
                                                                <button className='btn btn-danger mx-1'
                                                                    onClick={() => {
                                                                        if (window.confirm('Are you sure you wish to delete this item?'))
                                                                            deleteItem(item._id)
                                                                    }}>Delete</button>
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
export default ViewNewlyAddedMembers
