import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/motor-make.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const ViewBusinessEntityDiscount = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [be_id, setBeId] = useState('');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [masterpermission, setMasterPermission] = useState([]);
    const [nodata, setNodata] = useState('');
    const [lob, setLob] = useState([]);
    const [selectedlob, setSelectedlob] = useState([]);
    const [be_description, setBeDescription] = useState('');
    const [be_rate, setBeRate] = useState('');
    const [insurancecompany, setInsuranceCompany] = useState([]);
    const [selectedcompany, setSelectedcompany] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistBecommission(page, perPage);
            lobList();
            locationList();
            getlistCompany()
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterPermission(master_permission);
        }
    }, [])

    const getlistBecommission = (page, perPage) => {

        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllBusinessEntityDiscounts?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // console.log("data???????????????????????????????????????????",data.data)
                setNodata(data.message)
                const total = data.count;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log(list, ">>>>> list")
                setData(list);

            });
    }

    const lobList = () => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        const lob = userdata.line_of_business;
        if (lob.length > 0) {
            const lobdt = lob;
            const lob_len = lobdt.length;
            const lob_list = [];
            for (let i = 0; i < lob_len; i++) {
                const lob_obj = { label: lobdt[i].lob_name, value: lobdt[i].lob_id };
                lob_list.push(lob_obj);
            }
            setLob(lob_list);
        }
        else {
            const requestOptions =
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const lobdt = data.data;
                    const lob_len = lobdt.length;
                    const lob_list = [];
                    for (let i = 0; i < lob_len; i++) {
                        const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
                        lob_list.push(lob_obj);
                    }
                    setLob(lob_list);
                });
        }
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
                const companydt = data.data;
                const companyArr = [];
                for (let i = 0; i < companydt.length; i++) {
                    const company_obj = { label: companydt[i].company_name, value: companydt[i]._id };
                    companyArr.push(company_obj);
                }
                setInsuranceCompany(companyArr);
            });
    }
    const locationList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    if (locationdt[i].location_name != 'Head Office') {
                        const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                        location_list.push(location_obj);
                    }
                }
                setLocation(location_list);
            });
    }

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            const data = new FormData(e.target);
            const description = data.get('description');
            const loc = data.get('loc');
            const rate = data.get('rate');
            const lob = selectedlob;
            const splitRate = rate.includes(",") ?
                rate.split(",") : [rate];


            if (lob.length == 0 || lob == [] || lob == undefined) {
                swal("Please select lob", "", "warning");
            }
            if (selectedcompany.length == 0 || selectedcompany == undefined) {
                swal("Please Select Company", "", "warning");
            }
            else if (selectedcompany.length != splitRate.length) {
                swal("rate must be equal to Companies selected", "", "warning");
            } else {
                console.log('ready to submit')
                // return false;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        desciption: description,
                        rate: rate,
                        // lob: lob?.map((item)=>({id:item.value,lob_name:item.label})),
                        lob: lob,
                        location: loc,
                        // company:selectedcompany?.map((item)=>(item.value)),
                        company: selectedcompany?.map((item) => ({ id: item.value, company_name: item.label }))
                    })
                };
                fetch(`https://insuranceapi-3o5t.onrender.com/api/addBusinessEntityDiscount`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 201) {
                            setShowModal(false);
                            swal({
                                text: data.message,
                                type: "success",
                                icon: "success",
                                button: false
                            })
                            getlistBecommission(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);

                        }
                        else {
                            setShowModal(false);
                            swal({
                                text: data.message,
                                type: "error",
                                icon: "error",
                                button: false
                            })
                            getlistBecommission(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);
                        }
                    });
            }
        } catch (error) {
            console.log(error)
        }

    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistBecommission(selectedPage + 1, perPage);
    };

    const UpdateStatus = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ be_status: status, id: id })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/UpdateBusinessEntityDiscountStatus`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistBecommission(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getlistBecommission(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");
                }
            });
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_make_motor_excel ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        console.log(result.success)
        if (result.success === true) {
            swal("Uploaded Succesfully", "", "success");
        } else {
            swal("Something went wrong", "", "failed");
        }
        getlistBecommission(page, perPage)
    }

    const becommissiondetails = (id) => {
        setBeId(id);
        setSelectedlob([])
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/getSingleBusinessEntityDiscount?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const be_commission_details = data.data;
                console.log(be_commission_details, ">>>>>>>>>>>>>>>>>>")
                // Populate the input fields with data from the API response
                setBeDescription(be_commission_details.desciption);
                setBeRate(be_commission_details.rate);
                setSelectedOption(be_commission_details.location)
                setSelectedlob(be_commission_details.lob);
                console.log(be_commission_details.company, ">>>>>>>>>>>>>>>>>>")
                const comps = be_commission_details.company?.map(data => ({
                    label: data.company_name,
                    value: data.company_id,
                }));

                setEditCompany(comps);
                setSelectedcompany(comps);



                // Now, set the visibleedit state to true
                setVisibleedit(true);
            });
    };

    const [editlobs, setEditlobs] = useState([]);
    const [editcompany, setEditCompany] = useState([]);

    const handleChange = (selectedOption) => {
        setEditlobs(selectedOption);
    };





    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const loc = data.get('loc');
        const lob = data.get('lob');
        const be_rate = data.get('be_rate');
        const be_desc = data.get('be_desc');

        const locationdata = selectedlob;

        const splitRate = be_rate.includes(",") ?
            be_rate.split(",") : [be_rate];
        console.log(locationdata.length, " : ", splitRate.length)
        if (locationdata.length == 0 || locationdata == [] || locationdata == undefined) {
            swal("Please select Line of business", "", "warning");
        }
        else if (selectedcompany.length == 0 || selectedcompany == undefined) {
            swal("Please Select Company", "", "warning");
        }
        else if (splitRate.length != selectedcompany.length) {
            swal("rate must be equal to Companies selected", "", "warning");
        } else {
            const requestOptions = {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    desciption: be_desc,
                    rate: be_rate,
                    lob: lob,
                    location: loc,
                    company: selectedcompany?.map((item) => ({ id: item.value, company_name: item.label }))

                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/UpdateBusinessEntityDiscount?id=${be_id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setVisibleedit(false);
                        swal({
                            text: data.message,
                            icon: "success",
                            button: false,
                        })
                        getlistBecommission(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                    else {
                        setVisibleedit(false);
                        swal({
                            title: "Error!",
                            text: data.message,
                            icon: "error",
                            button: false,
                        })
                        getlistBecommission(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });
        }
    }
    const Addbecommission = () => {
        setSelectedlob([])
        setShowModal(true);
    }
    const deleteItem = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData?id=${id}&type=bediscount`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistBecommission(page, perPage);
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
                    getlistBecommission(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }

    const startFrom = (page - 1) * perPage;


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">BE Discount</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {masterpermission.be_discount?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => Addbecommission()}>Add BE Discount</button>
                                            : ''}
                                    </div>

                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className=" text-primary">
                                            <tr>
                                                <th>#</th>
                                                <th>Location</th>
                                                <th>Description</th>
                                                <th>LOB</th>
                                                <th>Company</th>
                                                <th>Rate</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data && data.length > 0 ?
                                                <>
                                                    {
                                                        data?.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{startFrom + index + 1}</td>
                                                                <td>{item.locatins?.map((data) => data.location_name).join(", ")}</td>
                                                                <td>{item.desciption}</td>
                                                                <td>{item.lobDetails?.map((data) => data.line_of_business_name).join(", ")}</td>
                                                                <td>{item.company?.map((data) => data.company_name).join(", ")}</td>
                                                                <td>{item.rate}</td>
                                                                <td>
                                                                    {masterpermission.be_discount?.includes('edit') && (
                                                                        <button className="btn btn-primary" onClick={() => becommissiondetails(item._id)}>Edit</button>
                                                                    )}
                                                                    {' '}
                                                                    {masterpermission.be_discount?.includes('delete') && (
                                                                        <>
                                                                            {item.status === true ? (
                                                                                <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) UpdateStatus(item._id, false); }}>Deactivate</button>
                                                                            ) : (
                                                                                <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) UpdateStatus(item._id, true); }}>Activate</button>
                                                                            )}
                                                                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </>
                                                :
                                                <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
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
                        </div>
                    </div>
                </div>
            </div>
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
                    <CButton color="primary" onClick={collectExceldata} href={'/motor-make'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add BE Discount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Select Location</label>

                                                        <select
                                                            className='form-control'
                                                            name='loc'
                                                            required
                                                        >
                                                            <option value="" hidden>Select Location</option>
                                                            {
                                                                location?.map((item, index) => (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Description</label>
                                                        <input type="text" className="form-control" name="description" placeholder="Description" autoComplete="off" required />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Select Line Of Business</label>
                                                        {/* <Multiselect
                                                            options={lob}
                                                            displayValue="label"
                                                            onSelect={setSelectedlob}
                                                            onRemove={setSelectedlob}
                                                            placeholder="Select line of business"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        /> */}
                                                        <select
                                                            className='form-control'
                                                            name='lob'
                                                            required
                                                            onChange={(e) => setSelectedlob(e.target.value)}
                                                        >
                                                            <option value="" hidden>Select Line Of Business</option>
                                                            {
                                                                lob?.map((item, index) => (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Select Company</label>
                                                        <Multiselect
                                                            options={insurancecompany}
                                                            displayValue="label"
                                                            onSelect={setSelectedcompany}
                                                            onRemove={setSelectedcompany}
                                                            placeholder="Select line of business"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Rate(%)</label>
                                                        <input type="text" className="form-control" name="rate" placeholder="Rate" autoComplete="off" required />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit BE Discount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">

                                                        <label className="form-label">Location</label>
                                                        <select
                                                            className='form-control'
                                                            name='loc'
                                                            required
                                                        >
                                                            {
                                                                location?.map((item, index) => (
                                                                    <option key={index} selected={item.value == selectedOption ? true : false} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select>


                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Description</label>
                                                        <input type="text" className="form-control" name="be_desc" placeholder="Description" defaultValue={be_description} autoComplete="off" required />


                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Line Of Buisness</label>
                                                        {/* <Multiselect
                                                            options={lob}
                                                            selectedValues={editlobs}
                                                            displayValue="label"
                                                            onSelect={setSelectedlob}
                                                            onRemove={setSelectedlob}
                                                            placeholder="Select line of business"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        /> */}
                                                        <select
                                                            className='form-control'
                                                            name='lob'
                                                            required

                                                        >
                                                            <option value="" hidden>Select Line Of Business</option>
                                                            {
                                                                lob?.map((item, index) => (
                                                                    <option key={index} selected={item.value == selectedlob ? true : false} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select>

                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Select Company</label>
                                                        <Multiselect
                                                            options={insurancecompany}
                                                            selectedValues={editcompany}
                                                            displayValue="label"
                                                            onSelect={setSelectedcompany}
                                                            onRemove={setSelectedcompany}
                                                            placeholder="Select line of business"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Rate(%)</label>
                                                        <input type="text" className="form-control" name="be_rate" placeholder="Rate" defaultValue={be_rate} autoComplete="off" required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default ViewBusinessEntityDiscount;
