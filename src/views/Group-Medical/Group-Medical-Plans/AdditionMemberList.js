import React, { useEffect, useState } from 'react'
import { Accordion } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { ColorRing } from 'react-loader-spinner';

const AdditionMemberList = () => {
    const navigate = useNavigate();
    const [activeMembers, setActiveMembers] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedcompany, setSelectedCompany] = useState('');
    const [insurancecompany, setCompanyList] = useState([]);
    const [emailfilter, setEmailFilter] = useState('');
    const [tpa, setTPA] = useState([]);
    const [selectedtpa, setSelectedTPA] = useState('');
    const [networkList, setNetworkList] = useState([]);
    const [networkListFilter, setNetworkListFilter] = useState('');
    const [filterByPolicyNo, setFilterByPolicyNo] = useState('')
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [companyId, setCompanyId] = useState('')
    const [planId, setPlanId] = useState('')
    const [companyAndPlan, setCompanyAndPlanName] = useState({})
    const [spinner, setLoader] = useState(false)

    useEffect(() => {
        const url = window.location.href;
        const filter1 = url.split("?")
        const filter2 = filter1[1].split("&")
        const compid = filter2[0]?.split("=")[1]
        const planid = filter2[1]?.split("=")[1]
        getCompanyAndPlanName(planid)
        setCompanyId(compid)
        setPlanId(planId)
        console.log(compid, " : company", planid, " :plan id")
        getActiveMembers(page, perPage, compid, planid)
        company_list();
        tpa_list();
        GetNetwork_List();
    }, [])
    useEffect(() => {
        const url = window.location.href;
        const filter1 = url.split("?")
        const filter2 = filter1[1].split("&")
        const compid = filter2[0]?.split("=")[1]
        const planid = filter2[1]?.split("=")[1]
        getActiveMembers(page, perPage, compid, planid)
    }, [selectedcompany, emailfilter, selectedtpa, networkListFilter, filterByPolicyNo])
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
                console.log("company and name data ", data.data)
                setCompanyAndPlanName(data.data[0])
            });
    }
    const tpa_list = () => {
        const reqOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA', reqOption)
            .then(response => response.json())
            .then(data => {
                setTPA(data.data);
            });
    }
    const GetNetwork_List = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/medicalNetwork', requestOptions)
            .then(response => response.json()
                .then(data => {
                    setNetworkList(data.data);
                }))
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
    const getActiveMembers = (page, limit, compid, planid) => {
        setLoader(true)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAdminHrUserLeads?page=${page}&limit=${limit}&leadType=Active&company=${selectedcompany}&email=${emailfilter}&tpa=${selectedtpa}&network=${networkListFilter}&policyNumber=${filterByPolicyNo}&planId=${planid}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setLoader(false)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setActiveMembers(data.data)
            });
    }

    const handlePageClick = (data) => {
        const selected = data.selected;
        setPage(selected + 1);
        getActiveMembers(selected + 1, perPage, companyId, planId);
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
        console.log(stateValue, "state value")
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
                leadId: selectedMembers
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteGroupMedicalLeads`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal("Members Added Successfully", {
                        icon: "success",
                    });
                    setSelectedMembers([])
                    getActiveMembers(page, perPage, companyId, planId)

                } else {
                    swal("Something went wrong", {
                        icon: "error",
                    });
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
                                    <h4 className="card-title">Addition Member List</h4>
                                </div>
                                <div className="col-md-4">

                                    <button disabled={selectedMembers.length > 0 ? false : true} className='btn btn-danger' onClick={() => ApproveMembersPolicy()}>Delete Members</button>

                                </div>
                                <div className="col-md-4">
                                    <button className='btn btn-primary' onClick={() => navigate('/ViewGroupMedicalPlans')} style={{ float: 'right' }}>Back</button>
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
                                                        value={selectedcompany}
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
                                                    <label><strong>Filter By TPA</strong></label>
                                                    <select className='form-control'
                                                        onChange={(e) => setSelectedTPA(e.target.value)}
                                                    >
                                                        <option value=''>-- All --</option>
                                                        {tpa?.map((item, index) =>
                                                            <option key={index} value={item._id}>{item.name}</option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Network List</strong></label>
                                                    <select className='form-control'
                                                        onChange={(e) => setNetworkListFilter(e.target.value)}
                                                    >
                                                        <option value=''>-- All --</option>
                                                        {networkList?.map((item, index) => (
                                                            <option key={index} value={item._id}>{item.name}</option>
                                                        ))}
                                                    </select>

                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Policy No.</strong></label>
                                                    <input type='text'
                                                        className='form-control'
                                                        placeholder='Search Policy No.'
                                                        onChange={(e) => setFilterByPolicyNo(e.target.value)}
                                                    />
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
                                    {spinner ? <div className='row d-flex justify-content-center'>
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
                                            <tr className="table-info" >
                                                <th>Employee No.</th>
                                                <th>Tick</th>
                                                <th>Name</th>
                                                <th>Email ID</th>
                                                <th>Phone No.</th>
                                                <th>HR</th>
                                                <th>Request Date</th>
                                                <th>Approval Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                activeMembers && activeMembers.length > 0 ?
                                                    activeMembers.map((item, index) => (

                                                        <tr key={index}>
                                                            <td>{startFrom + index + 1}</td>
                                                            <td key={item._id}>
                                                                <div className="checkboxs">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="flexCheckDefault"
                                                                        defaultChecked={selectedMembers.includes(item._id) ? true : false}
                                                                        onChange={(e) => handleCheckboxChange(e, item._id)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>{item.firstName + " " + item.middleName + " " + item.lastnName}</td>
                                                            <td >{item.email}</td>
                                                            <td >{item.phoneno}</td>
                                                            <td >{item.HRUser[0]?.name}</td>
                                                            <td >{item.createdAt?.slice(0, 10)}</td>
                                                            <td >{item.updatedAt?.slice(0, 10)}</td>
                                                            <td >
                                                                <button className='btn btn-warning' onClick={() => navigate(`/MemberDetails?id=${item._id}`)}>View</button>
                                                                {/* <button className='btn btn-primary mx-2' onClick={() => navigate(`/EditMemberDetails?id=${item._id}`)}>Edit</button> */}
                                                            </td>
                                                            {/* <td> */}
                                                            {/* <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <a href={`/EditGroupMedicalPlans?id=${item._id}`} className="btn btn-primary">Edit</a>
                                                                </div>&nbsp;&nbsp; */}
                                                            {/* {
                                                                    item.status == 1 ?
                                                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                                                            onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}
                                                                        >Deactivate</button></div> :
                                                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                                                            onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}
                                                                        >Activate</button></div>
                                                                }&nbsp;&nbsp; */}



                                                            {/* <div className="btn-group" role="group" aria-label="Basic example">
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                                </div> */}


                                                            {/* </td> */}
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
        </div>
    )
}


export default AdditionMemberList
