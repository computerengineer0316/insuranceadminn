
import React, { useEffect, useState } from 'react'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import planfilePath from '../../../webroot/sample-files/Member-addition-Sample-File.xlsx';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const ViewMemberRequests = () => {
    const navigate = useNavigate();
    const [requestList, setRequestList] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [companyList, setCompanyList] = useState([]);
    const [selectedcompany, setSelectedCompany] = useState('');
    const [filteremail, setFilterEmail] = useState('')
    const [showAddModal, SetShowAddModal] = useState(false);
    const [planList, setPlanList] = useState([]);
    const [TPAData, setTPAData] = useState([]);
    const [NetworkData, setNetworkData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [RateTPAdata, setRatesTPAData] = useState([]);
    const [companyData, setCompanyData] = useState({});
    const [planId, setPlanId] = useState('');
    const [policyNumber, SetpolicyNumber] = useState('');
    useEffect(() => {
        // activeMedicalTPAList();
        // activeMedicalNetwork();



        getMemberRequests(page, perPage)
        company_list();
        GetGroupMedicalPlans();
        getTPAData();
        // getNetworkData();
    }, [])
    useEffect(() => {
        getMemberRequests(page, perPage)
    }, [selectedcompany, filteremail])

    const Navigate = useNavigate();


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
    const getMemberRequests = (page, limit) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getgroupmedicalMemberRequets?page=${page}&limit=${limit}&company=${selectedcompany}&email=${filteremail}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setRequestList(data.data.data)
                const total = data.data?.totalCount[0]?.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
            });
    }
    const deactivatePlan = (id, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGroupMedicalStatus?id=${id}&status=${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal("Success", data.message, "success")
                    getMemberRequests(page, perPage)
                } else {
                    swal("Error", data.message, "error")
                }
            });

    }
    const handlePageClick = (data) => {
        let selected = data.selected;
        let page = Math.ceil(selected + 1);
        getMemberRequests(page, 10)
    };
    const goToViewDocument = (item) => {
        window.open(`https://insuranceapi-3o5t.onrender.com/Member_files/${item}`, '_blank');
    }
    const GetGroupMedicalPlans = () => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getActiveMedicalGroupPlan', reqOptions)
            .then(response => response.json())
            .then(data => {
                setPlanList(data.data);
                console.log("planList>>>>>>>>>>>>>>>>>>>>>>>>", data.data)
            });
    }
    const getTPAData = () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA", requestOptions)
            .then(response => response.json())
            .then((data) => {
                setTPAData(data.data)
                console.log("setTPADatal>>>>>>>>>>>>>>>>>>>>>>>>", data.data)

            })
    }
    const getNetworkData = () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork", requestOptions)
            .then(response => response.json())
            .then((data) => {
                setNetworkData(data.data)
                console.log("networkDatasetTPADatalllllllllllllllllllllllll", data.data)

            })
    }
    const AddMemberRequest = (e) => {
        e.preventDefault();
        setLoader(true)
        SetShowAddModal(false)
        const formdata = new FormData(e.target);
        const company_id = formdata.get('company_id');
        const plan = formdata.get('plan');
        const tpa = formdata.get('tpa');
        let network_list = formdata.get('network_list');
        network_list = network_list.split('-')[0]
        const policy_number = formdata.get('policy_number');
        const file = formdata.get('file');
        const data = new FormData();
        data.append('file', file);
        data.append('planCompanyId', company_id);
        data.append('planId', plan);
        data.append('TPAId', tpa);
        data.append('networkListId', network_list);
        data.append('policy_number', policy_number);


        const requestOptions = {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: data
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addBulkGroupMedicalLeadsByHr', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("data>>>>>>>>>>>>>", data)
                if (data.status == 201) {
                    swal("Success", data.message, "success")
                    getMemberRequests(page, perPage)
                    setLoader(false)
                } {
                    swal("Error", data.message, "error")
                    setLoader(false)
                }
            });

    }
    const handlePlanChange = (evnt) => {
        setRatesTPAData([])
        // setCompanyData('')
        setNetworkData([])
        SetpolicyNumber('')
        const { name, value } = evnt.target
        setPlanId(value)
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getRatesOfPlan?planId=${value}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                const ratesData = data.data
                const TPAdataARr = []
                for (let i = 0; i < ratesData.length; i++) {
                    TPAdataARr.push(ratesData[i]?.TPAs[0])
                }

                setRatesTPAData(TPAdataARr)
                // setCompanyData(data.company)
                setCompanyData(data.company[0].company_id[0])

            })
            .catch(error => console.log('error', error));
    }

    const handleChange = (evnt) => {
        const { name, value } = evnt.target
        if (name == "tpa") {
            getLinkListByTPAid(value)
        }
    }
    const getLinkListByTPAid = (id) => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNetworksOfPlanratebyTPA?tpaid=${id}&planid=${planId}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                const networkData = data.data
                console.log("networkData>>>>>>>>>>>>>>>>>>>>>>>>", networkData)
                const netwrokArr = []
                for (let i = 0; i < networkData.length; i++) {
                    let obj = networkData[i]?.networks[0]
                    obj['policy_number'] = networkData[i]?.policy_name
                    netwrokArr.push(obj)
                }
                console.log("this is network arr >>>>>>> ", netwrokArr)
                setNetworkData(netwrokArr)
            })
            .catch(error => console.log('error', error));
    }
    const GoToAddRequest = () => {
        setRatesTPAData([])
        setCompanyData({})
        setNetworkData([])
        SetShowAddModal(true)
    }
    const gotTosetPolicyNumber = (id) => {
        const policy_name = id.split('-')[1]
        SetpolicyNumber(policy_name)
    }
    const goToExportDocument = (id) => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/groupMedicalHrLeadToExcel?id=${id}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    const exportData = data.data
                    console.log(exportData)
                    const fileType = 'xlsx'
                    const updatedData = exportData?.map((item, index) => {
                        return {

                            'Sl No.': item?.SINumber,
                            'First Name ': item?.firstName,
                            'Middle Name': item?.middleName,
                            'Last Name': item?.lastnName,
                            'Email': item?.email,
                            'Mobile Number': item?.mobileNumber,
                            'Date Of Birth ': item?.dateOfBirth,
                            'Gender': item?.gender,
                            'Marital Status': item?.maritalStatus,
                            'Relation': item?.relation,
                            'Category': item?.category,
                            'Region': item?.region,
                            'LSB': item?.LSB,
                            'Nationality': item?.national,
                            'Passport Number': item?.passportNumber,
                            'Eid Number': item?.eidNumber,
                            'Uid Number': item?.uidNumber,
                            'Visa Issued Location': item?.visaIssuedLocation,
                            'Actual Salary Band': item?.actualSalaryBand,
                            'Person Commission': item?.personCommission,
                            'Residential Location': item?.residentialLocation,
                            'Work Location': item?.workLocation,
                            'Email': item?.email,
                            'Mobile Number': item?.mobileNumber,
                            'Photo File Name': item?.photoFileName,
                            'Sponsor Type ': item?.sponsorType,
                            'Sponsor Id': item?.sponsorId,
                            'Sponsor Contact Number': item?.sponsorContactNumber,
                            'Sponsor Contact Email ': item?.sponsorContactEmail,
                            'Occupation': item?.occupation,
                            'Addition Effective Date': item?.AdditionEffectiveDate,
                            'Visa File Number': item?.visaFileNumber,
                            'Birth Certificate Number': item?.birthCertificateNumber,

                        }
                    })
                    const ws = XLSX.utils.json_to_sheet(updatedData);
                    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
                    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
                    const newdata = new Blob([excelBuffer], { type: fileType });
                    FileSaver.saveAs(newdata, "EmployeeData" + ".xlsx")

                } else {
                    swal("Error", data.message, "error")
                }
            });
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
                                    <h4 className="card-title">New Member Requests</h4>
                                </div>
                                {/* <div className="col-md-8">
                                    <a href="/AddGroupMedicalPlans" className="btn btn-primary" style={{ float: "right" }}>Back</a>
                                </div> */}
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 my-1">
                                    <a className="btn btn-dark  btn-icon-text m-r-10" href={planfilePath} style={{ backgroundColor: "green", marginLeft: '4px', float: 'right' }} download>Download Sample File</a>&nbsp;
                                    <button className="btn btn-primary" onClick={() => GoToAddRequest()} style={{ float: "right" }}>Add Request</button>

                                    <button className="btn btn-primary" onClick={() => Navigate('/AddMembermanually')} style={{ float: "right", marginRight: '10px' }}>Add Member Manually</button>

                                </div>

                            </div>
                            <Accordion defaultActiveKey="0" >
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className='modifyaccordian'>Filters </Accordion.Header>
                                    <Accordion.Body>

                                        <div className='card-header'>
                                            <div className='row'>
                                                <div className='col-lg-3'>
                                                    <label><strong>Sort By Insurance co.</strong></label><br />
                                                    <select
                                                        className='form-control'
                                                        value={selectedcompany}
                                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                                    >
                                                        <option value="">-- All --</option>
                                                        {companyList?.map((item, index) => (
                                                            <option key={index} value={item._id}>{item.company_name}</option>
                                                        ))}

                                                    </select>
                                                </div>
                                                {/* <div className='col-lg-3'>
                                                    <label><strong>Filter By Email</strong></label><br />
                                                    <input type="text" className="form-control" placeholder="Search Plan" onChange={(e) => setFilterEmail(e.target.value)} />
                                                </div> */}
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
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr className="table-info">
                                                <th>Sr No.</th>
                                                <th>Company Name</th>
                                                <th>plan Name</th>
                                                <th>HR</th>
                                                <th>TPA</th>
                                                <th>Network</th>
                                                <th>Export Data to Excel</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loader == true ? (
                                                    <div className="loader-container">
                                                        <ClipLoader color="#000000" loading={loader} size={50} />
                                                    </div>
                                                ) : (

                                                    requestList && requestList.length > 0 ?
                                                        requestList.map((item, index) => (

                                                            <tr key={index}>
                                                                <td>{startFrom + index + 1}</td>
                                                                <td>{item.company_id[0]?.company_name}</td>
                                                                <td >{item.plan_id[0]?.plan_name}</td>
                                                                <td >{item.HRUser[0]?.name}</td>
                                                                <td >{item.tpa[0]?.name}</td>
                                                                <td >{item.network[0]?.name}</td>
                                                                <td >
                                                                    {/* <button className='btn btn-primary' onClick={() => goToViewDocument(item.file)}><i className="fa fa-file-excel" aria-hidden="true"></i></button> */}
                                                                    <button className='btn btn-success' onClick={() => goToExportDocument(item._id)}><i className="fa fa-file-excel" aria-hidden="true"></i></button>
                                                                </td>
                                                                <td>
                                                                    {/* <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <a href={`/EditGroupMedicalPlans?id=${item._id}`} className="btn btn-primary">Edit</a>
                                                                </div>&nbsp;&nbsp; */}
                                                                    {
                                                                        item.status == 1 ?
                                                                            <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-warning"
                                                                                onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}
                                                                            >Inprogress</button></div> :
                                                                            <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                                                                onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}
                                                                            >Approved</button></div>
                                                                    }&nbsp;&nbsp;


                                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                                        <button className="btn btn-info" onClick={() => navigate(`/ViewNewlyAddedMembers?id=${item._id}`)}>View Members</button>
                                                                    </div>
                                                                    {/* <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                                </div> */}


                                                                </td>
                                                            </tr>
                                                        )) : <tr><td colSpan="5">No data found</td></tr>)}
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
                            <Modal size='lg' show={showAddModal} onHide={() => SetShowAddModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add Request</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="card">

                                                    <div className="card-body">
                                                        <form method='POST' onSubmit={AddMemberRequest}>
                                                            <div className="row">
                                                                <div className='col-lg-3'>
                                                                    <label><strong>Plan</strong></label><br />
                                                                    <select
                                                                        className='form-control'
                                                                        name='plan'
                                                                        onChange={(e) => handlePlanChange(e)}
                                                                    >
                                                                        <option value="">Select Plans</option>
                                                                        {planList?.map((item, index) => (
                                                                            <option key={index} value={item._id}>{item.plan_name}</option>
                                                                        ))}

                                                                    </select>
                                                                </div>
                                                                {/* <div className='col-lg-6'> */}
                                                                {/* <label>Company Name : <strong>{companyData?.company_id[0]?.company_name}</strong></label><br /> */}

                                                                {/* <table className="table table-bordered">
                                                                    <thead className="thead-dark">
                                                                        <tr className="table-info">
                                                                            <th>No</th>
                                                                            <th>Select</th>
                                                                            <th>TPA</th>
                                                                            <th>Network</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {ratesdata?.map((item, index) => (
                                                                            <tr key={index}>
                                                                              <td>{index+1}</td>
                                                                            <td><input type='radio' /></td>
                                                                                <td>{item.TPAs[0]?.name}</td>
                                                                                <td>{item.networks[0]?.name}</td> 
                                                                             </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table> */}
                                                                {/* </div> */}
                                                                <div className='col-lg-6'>
                                                                    <label><strong>Insurance Company</strong></label><br />
                                                                    <select
                                                                        className='form-control'
                                                                        name='company_id'

                                                                    >
                                                                        {/* <option value="">Insurance Company</option> */}
                                                                        <option value={companyData._id} >{companyData.company_name}</option>
                                                                    </select>
                                                                </div>
                                                                <div className='col-lg-3'>
                                                                    <label><strong>TPA</strong></label><br />
                                                                    <select
                                                                        className='form-control'
                                                                        name='tpa'
                                                                        onChange={(e) => getLinkListByTPAid(e.target.value)}
                                                                    >
                                                                        {RateTPAdata?.length ? <option value="">Select TPA</option> : ""}
                                                                        {RateTPAdata?.map((item, index) => (
                                                                            <option key={index} value={item._id}>{item.name}</option>
                                                                        ))}

                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="row">

                                                                <div className='col-lg-3'>
                                                                    <label><strong>Network List</strong></label><br />
                                                                    <select
                                                                        className='form-control'
                                                                        name='network_list'
                                                                        onChange={(e) => gotTosetPolicyNumber(e.target.value)}
                                                                    >
                                                                        {NetworkData.length ? <option value="">Select Network List</option> : ""}
                                                                        {NetworkData?.map((item, index) => (
                                                                            <option key={index} value={item._id + "-" + item.policy_number}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className='col-lg-3'>
                                                                    <label><strong>Policy Number</strong></label><br />
                                                                    <input type="text" className="form-control" defaultValue={policyNumber} name="policy_number" />
                                                                </div>
                                                                <div className='col-lg-3'>
                                                                    <label><strong>File</strong></label><br />
                                                                    <input type="file" className="form-control" name="file" />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} >Submit</button>
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
                                    <Button variant="secondary" onClick={() => SetShowAddModal(false)}>
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

export default ViewMemberRequests
