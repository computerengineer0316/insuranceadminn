import React, { useEffect, useState } from 'react'
import { Accordion } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
const ViewDeletedMembers = () => {
    const navigate = useNavigate();
    const [DeletedMembers, setDeletedMembers] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedcompany, setSelectedCompany] = useState('');
    const [insurancecompany, setCompanyList] = useState([]);
    const [emailfilter, setEmailFilter] = useState('');
    const [tpa, setTPA] = useState([]);
    const [tpafilter, setTPAFilter] = useState('')
    const [networklist, setNetworkList] = useState([])
    const [netlistFilter, setNetListFilter] = useState('')
    const [policyNofilter, setPolicyNumberFilter] = useState('')
    const [companyId, setCompanyId] = useState('')
    const [planId, setPlanId] = useState('')
    const [companyAndPlan, setCompanyAndPlanName] = useState({})
    const [loader, setLoader] = useState(false)
    useEffect(() => {
        const url = window.location.href;
        const filter1 = url.split("?")
        const filter2 = filter1[1].split("&")
        const compid = filter2[0]?.split("=")[1]
        const planid = filter2[1]?.split("=")[1]
        getCompanyAndPlanName(planid)

        setCompanyId(compid)
        setPlanId(planid)
        getDeletedMembers(page, perPage, companyId, planid)
        company_list();
        Get_TPA_List();
        GetNetworkList();
    }, [])

    useEffect(() => {
        const url = window.location.href;
        const filter1 = url?.split("?")
        const filter2 = filter1[1].split("&")
        const compid = filter2[0]?.split("=")[1]
        const planid = filter2[1]?.split("=")[1]
        getDeletedMembers(page, perPage, companyId, planid)
    }, [selectedcompany, emailfilter, tpafilter, netlistFilter, policyNofilter])
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
    const Get_TPA_List = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA', requestOptions)
            .then(response => response.json()
                .then(data => {
                    setTPA(data.data)
                })
            )
    }
    const GetNetworkList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork', requestOptions)
            .then(response => response.json()
                .then(data => {
                    setNetworkList(data.data)
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
    const getDeletedMembers = (page, limit, companyId, planid) => {
        setLoader(true)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAdminHrUserLeads?page=${page}&limit=${limit}&leadType=deleted&company=${selectedcompany}&email=${emailfilter}&tpa=${tpafilter}&network=${netlistFilter}&policyNumber=${policyNofilter}&planId=${planid}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setDeletedMembers(data.data)
                setLoader(false)
            });
    }


    const handlePageClick = (data) => {
        const selected = data.selected;
        setPage(selected + 1);

        getDeletedMembers(selected + 1, perPage, planId)
    };

    const startFrom = (page - 1) * perPage;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4 className="card-title">Deleted Members</h4>
                                </div>
                                <div className="col-md-8">
                                    <a href="/ViewGroupMedicalPlans" className="btn btn-primary" style={{ float: "right" }}>Back</a>
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
                                                        onChange={(e) => setTPAFilter(e.target.value)}
                                                    >
                                                        <option value="">-- All --</option>
                                                        {
                                                            tpa?.map((item, index) => (

                                                                <option key={index} value={item._id} >{item.name}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Network List</strong></label>
                                                    <select className='form-control'
                                                        onChange={(e) => setNetListFilter(e.target.value)}>
                                                        <option value="">-- All --</option>
                                                        {
                                                            networklist?.map((item, index) => (
                                                                <option key={index} value={item._id}>{item.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label><strong>Filter By Policy No.</strong></label>
                                                    <input className='form-control'
                                                        type='text'
                                                        placeholder='Search Policy No.'
                                                        onChange={(e) => setPolicyNumberFilter(e.target.value)}
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
                                            <tr className="table-info" >
                                                <th>Employee No.</th>
                                                <th>Name</th>
                                                <th>Email ID</th>
                                                <th>Phone No.</th>
                                                <td >HR</td>
                                                <th>Request Date</th>
                                                <th>Approval Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                DeletedMembers && DeletedMembers.length > 0 ?
                                                    DeletedMembers.map((item, index) => (

                                                        <tr key={index}>
                                                            <td>{startFrom + index + 1}</td>

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
export default ViewDeletedMembers
