import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import planfilePath from '../../../webroot/sample-files/Medical-Plan-sample-sheet.xlsx';
import formfilePath from '../../../webroot/sample-files/Member-addition-Sample-File.xlsx';
import { ColorRing } from 'react-loader-spinner';

const ViewGroupMedicalPlan = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState('');
    const [status, setStatus] = useState(1);
    const [visible, setVisible] = useState(false);
    const [excelfile, setExcelfile] = useState("");
    const [medicalpermission, setMedicalPermission] = useState([]);
    const [planname, setPlanName] = useState('');
    const [selectedcompany, setSelectedCompany] = useState('');
    const [insurancecompany, setInsuranceCompany] = useState([]);
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [requestList, setRequestList] = useState([]);
    const [showAddModal, SetShowAddModal] = useState(false);
    const [planList, setPlanList] = useState([]);
    const [TPAData, setTPAData] = useState([]);
    const [NetworkData, setNetworkData] = useState([]);
    const [RateTPAdata, setRatesTPAData] = useState([]);
    const [companyData, setCompanyData] = useState({});
    const [planId, setPlanId] = useState('');
    const [policyNumber, SetpolicyNumber] = useState('');
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getGroupMedicalPlans(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMedicalPermission(motor_permission);
            getlistCompany();
            GetGroupMedicalPlans();

        }
    }, [])
    useEffect(() => {
        getGroupMedicalPlans(page, perPage);
    }, [planname, status, selectedcompany, startDate, endDate])
    const getGroupMedicalPlans = (page, perPage) => {
        setLoader(true)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getgroupmedicalplan?page=${page}&perPage=${perPage}&status=${status}&company_id=${selectedcompany}&plan_name=${planname}&startDate=${startDate}&endDate=${endDate}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const plans = data.data;
                setPlans(plans);
                console.log(data, ">>>>>>>>>>>>>>>>> data");
                const total = data.totalCount;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setLoader(false)
            });
    }
    const getlistCompany = () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompany`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setInsuranceCompany(data.data);
            });
    }
    const deactivatePlan = (id, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusGroupMedicalPlan/${id}/${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                }
                getGroupMedicalPlans(page, perPage);
                setTimeout(() => {
                    swal.close()
                }, 1000);
            });
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteGroupMedicalMaster?id=${id}&type=groupMedicalPlan`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getGroupMedicalPlans(page, perPage);
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
                    getGroupMedicalPlans(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getGroupMedicalPlans(selectedPage + 1, perPage);
    };
    const startFrom = (page - 1) * perPage;


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


    const getMemberRequests = (page, limit) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getgroupmedicalMemberRequets?page=${page}&limit=${limit}&company=${selectedcompany}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setRequestList(data.data.data)
                const total = data.data?.totalCount[0]?.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
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


        console.log("data>>>>>>>>>>>>>", Array.from(data))

        const requestOptions = {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: data
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addBulkGroupMedicalLeadsByAdmin', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("data>>>>>>>>>>>>>", data)
                if (data.status == 201) {
                    swal("Success", data.message, "success")
                    getGroupMedicalPlans(page, perPage)
                    setLoader(false)
                } else {
                    swal("Error", data.message, "error")
                    getGroupMedicalPlans(page, perPage)
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
    useEffect(() => {
        if (showAddModal == false) {
            SetpolicyNumber('')
        }
    }, [showAddModal])

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4 className="card-title">Group Medical Plans</h4>
                                </div>
                                <div className="col-md-8">
                                    <a href="/AddGroupMedicalPlans" className="btn btn-primary" style={{ float: "right" }}>Add Group Medical Plan</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="card-header">
                                <div className="col-md-12" style={{ textAlign: 'right', color: 'white' }}>
                                    <a className="btn btn-info" style={{ color: 'white' }} onClick={() => navigate('/AddMembermanually')}>Add Manually</a>{' '}
                                    <a className="btn btn-success" style={{ color: 'white' }} href={formfilePath}>Download Form</a>{' '}
                                    <a className="btn btn-dark" style={{ color: 'white' }} onClick={() => GoToAddRequest()}>Upload Form</a>
                                </div>
                            </div>
                            <Accordion defaultActiveKey="0" >
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className='modifyaccordian'>Filters </Accordion.Header>
                                    <Accordion.Body>

                                        <div className='card-header'>
                                            <div className='row'>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter by Insurance co.</strong></label><br />
                                                    <select
                                                        className='form-control'
                                                        value={selectedcompany}
                                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                                    >
                                                        <option value="">-- All --</option>
                                                        {insurancecompany?.map((item, index) => (
                                                            <option key={index} value={item._id}>{item.company_name}</option>
                                                        ))}

                                                    </select>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter by Customer Name</strong></label><br />
                                                    <input type="text" className="form-control" placeholder="Search Plan" onChange={(e) => setPlanName(e.target.value)} />
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter by Start Date</strong></label><br />
                                                    <input type='date' className='form-control' onChange={(e) => setStartDate(e.target.value)} />
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter by End Date</strong></label><br />
                                                    <input type='date' className='form-control' onChange={(e) => setEndDate(e.target.value)} />

                                                </div>
                                            </div>
                                            <div className='row'>

                                                <div className='col-lg-3'>
                                                    <label><strong>Filter by Status</strong></label><br />
                                                    <select className='form-control'
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    >
                                                        {/* <option value={2}>-- All --</option> */}
                                                        <option value={1}>Active</option>
                                                        <option value={0}>Inactive</option>
                                                    </select>
                                                </div>
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
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr className="table-info">
                                                <th>Sr No.</th>
                                                <th>Company Name</th>
                                                <th>Customer Name</th>
                                                <th>Policy Issue Date</th>
                                                <th>Policy Expiry Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                plans && plans.length > 0 ?
                                                    plans.map((item, index) => (

                                                        <tr key={index}>
                                                            <td>{startFrom + index + 1}</td>
                                                            <td>{item.companyData[0]?.company_name}</td>
                                                            <td className={item.status == 1 ? 'text-success' : 'text-danger'}>{item.plan_name}</td>
                                                            <td>{item.from_date?.slice(0, 10)}</td>
                                                            <td>{item.to_date?.slice(0, 10)}</td>
                                                            <td>
                                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <a href={`/EditGroupMedicalPlans?id=${item._id}`} className="btn btn-primary">Edit</a>
                                                                </div>&nbsp;&nbsp;
                                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <a href={`/ViewGroupMedicalPlanPrice?id=${item._id}`} className="btn btn-secondary">Add TPA/Network</a>
                                                                </div>&nbsp;&nbsp;
                                                                <div className='btn-group' role='group' aria-label="Basic example">
                                                                    <button onClick={() => navigate(`/ViewActiveMembers?id=${item.companyData[0]?._id}&plan=${item._id}`)} className='btn btn-info'>Active Members</button>
                                                                </div>&nbsp;&nbsp;
                                                                <div className='btn-group' role='group' aria-label="Basic example">
                                                                    <button onClick={() => navigate(`/AdditionMemberList?id=${item.companyData[0]?._id}&plan=${item._id}`)} className='btn btn-success'>Addition Member List</button>
                                                                </div>&nbsp;&nbsp;
                                                                <div className='btn-group' style={{ position: 'relative' }} role='group' aria-label="Basic example">
                                                                    {item.newData > 0 ? <div className={item.newData < 10 ? 'bg-danger px-2' : 'bg-danger px-1'} style={{ position: 'absolute', color: 'white', borderRadius: '50%', zIndex: '5', top: '-8px', right: '-5px' }}>{item.newData}</div> : ''}
                                                                    <button onClick={() => navigate(`/ViewNewlyAddedMembers?id=${item._id}&type=newlyAdded`)} className='btn btn-primary'>Adding Request List</button>
                                                                </div>&nbsp;&nbsp;
                                                                <div className='btn-group'
                                                                    style={{ position: 'relative' }}
                                                                    role='group' aria-label="Basic example">

                                                                    {item.deleteRequesData > 0 ? <div className={item.deleteRequesData < 10 ? 'bg-danger px-2' : 'bg-danger px-1'} style={{ position: 'absolute', color: 'white', borderRadius: '50%', zIndex: '5', top: '-8px', right: '-5px' }}>{item.deleteRequesData >= 100 ? 99 + "+" : item.deleteRequesData}</div> : ''}
                                                                    <button onClick={() => navigate(`/ViewNewlyAddedMembers?id=${item._id}&type=deletedRequest`)} className='btn btn-warning'>Deletion Request List</button>
                                                                </div>&nbsp;&nbsp;
                                                                {/* &nbsp;&nbsp; */}

                                                                <div className='btn-group' role='group' aria-label="Basic example">
                                                                    <button onClick={() => navigate(`/ViewDeletedMembers?id=${item.companyData[0]?._id}&plan=${item._id}`)} className='btn btn-secondary'>Deleted Members</button>
                                                                </div>&nbsp;&nbsp;

                                                                {
                                                                    item.status == 1 ?
                                                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                                                            onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}
                                                                        >Deactivate</button></div> :
                                                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                                                            onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}
                                                                        >Activate</button></div>
                                                                }&nbsp;&nbsp;


                                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                                </div>


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
                        </div>
                    </div>
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

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div >
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    {/* <CButton color="primary" onClick={collectExceldata}>Upload</CButton> */}
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default ViewGroupMedicalPlan
