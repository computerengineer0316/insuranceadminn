import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import filePath from '../../../../webroot/sample-files/Additional_Underwritiong_condition_sample.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';

const ViewCopayment = () => {
    const url = new URLSearchParams(window.location.search)
    const navigate = useNavigate();

    const [excelfile, setExcelfile] = useState("");
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [copaymentlist, setCopaymentlist] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editshowModal, setEditShowModal] = useState(false);
    const [additionalConditionId, setAdditionalConditionId] = useState('');
    const [coPaymentValues, setcoPaymentValues] = useState({});
    const [lob, setLob] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [location, setLocation] = useState([]);
    const [PlanType, setPlanType] = useState([]);
    const [defMedicalPlanType, setDefMedicalPlanType] = useState([]);
    const [planCategory, setPlanCategory] = useState([]);
    const [defaultPlancategory, setDefaultPlanCategory] = useState([]);
    const [company, setCompany] = useState([]);
    const [companyid, setCompanyid] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            geTableBenefits(page, perPage);
            exportlistdata();
            lobList();
            locationList();
            MedicalPlanType();
            Plancategory();
            getCompanylist();

        }
    }, [showModal]);


    const geTableBenefits = async (page, perPage) => {
        setCopaymentlist([]);
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/MedicalCopaymentTypes?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setCopaymentlist(data.data);
            });
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        geTableBenefits(selectedPage + 1, perPage);
    };

    const updatestatus = async (id, status) => {
        console.log("status", status)
        let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/MedicalCopaymentType?id=' + id, {
            method: 'put',
            body: JSON.stringify({ status }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        swal("Updated Succesfully", "", "success");
        geTableBenefits(page, perPage)
    }

    const Addcopayemnts = async (e) => {
        e.preventDefault();

        if (url.get("id")) {
            const { name, value } = e.target

            if (defMedicalPlanType.length === 0) {
                swal({
                    title: "Warning!",
                    text: "Plese Select Medical Plan Type",
                    type: "warning",
                    icon: "warning",
                    button: false,
                })
            }
            else if (defaultPlancategory.length === 0) {
                swal({
                    title: "Warning!",
                    text: "Plese Select  Plan Type",
                    type: "warning",
                    icon: "warning",
                    button: false,
                })
            }
            else if (companyid.length === 0) {
                swal({
                    title: "Warning!",
                    text: "Plese Select Company",
                    type: "warning",
                    icon: "warning",
                    button: false,
                })
            }
            else if (selectedOption.length === 0) {
                swal({
                    title: "Warning!",
                    text: "Plese Select  Locations",
                    type: "warning",
                    icon: "warning",
                    button: false,
                })
            } else {
                let payloadbody = {};
                const Name = e.target.Name.value;
                const description = e.target.description.value;
                const PlanCategory = defaultPlancategory;
                const Company = companyid;
                const Locations = selectedOption;
                const MedicalPlanType = defMedicalPlanType;
                payloadbody = {
                    description: description,
                    medicalCopaymentId: url.get("id"),
                    name: Name,
                    planCategory: PlanCategory.length > 0 ? PlanCategory.map((item) => item.value) : [],
                    company: Company.length > 0 ? Company.map((item) => item.value) : [],
                    location: Locations.length > 0 ? Locations.map((item) => item.value) : [],
                    medicalPlanType: MedicalPlanType.length > 0 ? MedicalPlanType.map((item) => item.value) : [],
                }
                console.log("payloadbody", payloadbody)
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payloadbody),
                };
                fetch(`https://insuranceapi-3o5t.onrender.com/api/MedicalCopaymentType`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log("data", data)
                        if (data.status === 201) {
                            setShowModal(false);
                            swal({
                                title: "Success!",
                                text: data.message,
                                type: "success",
                                icon: "success",
                                button: false,
                            })
                            geTableBenefits(page, perPage);
                            setEditShowModal(false)
                            setTimeout(() => {
                                swal.close()
                            }, 1000);
                        }
                        else {
                            setEditShowModal(false)
                            swal({
                                title: "Error!",
                                text: data.message,
                                type: "error",
                                icon: "error",
                                button: false,
                            })
                            geTableBenefits(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);
                        }
                    });
            }


        } else {
            swal({
                title: "Warning!",
                text: "id not found",
                type: "warning",
                icon: "warning",
                button: false,
            })
        }
    }
    const updateSubmit = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        if (defMedicalPlanType.length === 0) {
            swal({
                title: "Warning!",
                text: "Plese Select Medical Plan Type",
                type: "warning",
                icon: "warning",
                button: false,
            })
        }
        else if (defaultPlancategory.length === 0) {
            swal({
                title: "Warning!",
                text: "Plese Select  Plan Type",
                type: "warning",
                icon: "warning",
                button: false,
            })
        }
        else if (companyid.length === 0) {
            swal({
                title: "Warning!",
                text: "Plese Select Company",
                type: "warning",
                icon: "warning",
                button: false,
            })
        }
        else if (selectedOption.length === 0) {
            swal({
                title: "Warning!",
                text: "Plese Select  Locations",
                type: "warning",
                icon: "warning",
                button: false,
            })
        } else {
            let payloadbody = {};
            const Name = e.target.Name.value;
            const description = e.target.description.value;
            const PlanCategory = defaultPlancategory;
            const Company = companyid;
            const Locations = selectedOption;
            const MedicalPlanType = defMedicalPlanType;
            payloadbody = {
                description: description,
                name: Name,
                planCategory: PlanCategory.length > 0 ? PlanCategory.map((item) => item.value) : [],
                company: Company.length > 0 ? Company.map((item) => item.value) : [],
                location: Locations.length > 0 ? Locations.map((item) => item.value) : [],
                medicalPlanType: MedicalPlanType.length > 0 ? MedicalPlanType.map((item) => item.value) : [],
            }
            console.log("payloadbody", payloadbody)
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadbody),
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/MedicalCopaymentType?id=${coPaymentValues?._id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setShowModal(false);
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false,
                        })
                        geTableBenefits(page, perPage);
                        setEditShowModal(false)
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                    else {
                        setEditShowModal(false)
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false,
                        })
                        geTableBenefits(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });
        }
    }
    const [exportlist, setExportlist] = useState([]);
    const exportlistdata = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_additional_Underwriting_condition', requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }
    const fileType = 'xlsx'
    const exporttocsv = () => {
        const updatedData = exportlist.map((item, index) => {
            return {

                'Feature': item.feature,
                'Description': item.description,
            }
        })
        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Additional-underwriting-conditions" + ".xlsx")
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_additional_condition_status_excel",
            {
                method: "POST",
                body: fd,
            });
        result = await result.json();
        if (result.status == 200) {
            setVisible(!visible)
            swal({
                text: result.message,
                type: "success",
                icon: "success",
                button: false,
            })
            geTableBenefits(page, perPage)

            setTimeout(() => {
                swal.close()
            }, 1000);
        }
        else {
            setVisible(!visible)
            swal({
                title: "Error!",
                text: result.message,
                type: "error",
                icon: "error",
                button: "ok",
            })
            geTableBenefits(page, perPage)

            setTimeout(() => {
                swal.close()
            }, 1000);
        }
    }

    const detailsbyid = async (ParamValue) => {
        setAdditionalConditionId(ParamValue)
        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/MedicalCopaymentType?id=${ParamValue}`);
        result = await result.json();
        if (result.data && result.data.length > 0) {
            result = result.data[0]
            console.log("result>>>>", result)
            setcoPaymentValues(result);
            setDefaultPlanCategory(result.planCategories.length > 0 ? result.planCategories.map((data) => ({ label: data.plan_category_name, value: data._id })) : [])
            setCompanyid(result.companies.length > 0 ? result.companies.map((data) => ({ label: data.company_name, value: data._id })) : [])
            setSelectedOption(result.locations.length > 0 ? result.locations.map((data) => ({ label: data.location_name, value: data._id })) : [])
            setDefMedicalPlanType(result.planTypes.length > 0 ? result.planTypes.map((data) => ({ label: data.medical_plan_type, value: data._id })) : [])
            setEditShowModal(true);
        }
    };
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMedicalMaster/?id=${id}&type=copaymentType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    geTableBenefits(page, perPage);
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
                    geTableBenefits(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }

    const lobList = () => {
        try {
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
                    //   handleChange(lob_list);
                });
        } catch (error) {
            console.log(error)
        }
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
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
                setSelectedOption(location_list);
            });
    }

    const MedicalPlanType = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalPlanTypeList`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                const listdata = list.map((data) => ({ label: data.medical_plan_type, value: data._id }));
                setPlanType(listdata);
            });
    }

    const Plancategory = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanCategory`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                const listdata = list.map((data) => ({ label: data.plan_category_name, value: data._id }));
                setPlanCategory(listdata);
            });
    }

    const getCompanylist = async (e) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/getCompany', requestOptions)
            .then(response => response.json())
            .then(data => {
                let company = data.data;
                const company_list = company.map((data) => ({ label: data.company_name, value: data._id }));
                setCompany(company_list);
            });
    }

    console.log("coPaymentValues", coPaymentValues)



    const startFrom = (page - 1) * perPage;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Co-Payments type</h4>
                                </div>
                                <div className="col-md-6">
                                    <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add  Co-Payment type</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-header" style={{ textAlign: 'right' }}>
                            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Feature</strong></th>
                                        <th><strong>Description</strong></th>
                                        <th><strong>Action</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {copaymentlist.length > 0 ?
                                        copaymentlist.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>&nbsp;&nbsp;
                                                    {
                                                        item.status === 1 ?
                                                            <button className="btn btn-danger mr-5" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                            <button className="btn btn-success mr-5" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                    }
                                                    <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>

                                                </td>
                                            </tr>
                                        ) : <tr>
                                            <td colSpan="4">No Data Found</td>
                                        </tr>
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

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" onChange={(e) => setExcelfile(e.target.files[0])} required />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Co-Payments type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={Addcopayemnts}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Name</strong></label>
                                                        <input type='text' className="form-control"
                                                            name='Name'
                                                            placeholder="Enter Name"
                                                            autoComplete='off'
                                                            defaultValue=""
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Description</strong></label>
                                                        <input type='text' className="form-control"
                                                            name='description'
                                                            placeholder="Enter description"
                                                            autoComplete='off'
                                                            defaultValue=""
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Plan Category</strong></label>

                                                        <Multiselect
                                                            options={planCategory}
                                                            selectedValues={defaultPlancategory}
                                                            displayValue="label"
                                                            onSelect={setDefaultPlanCategory}
                                                            onRemove={setDefaultPlanCategory}
                                                            placeholder="Select Plan Category"
                                                            showCheckbox={true}
                                                            showArrow={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Company</strong></label>

                                                        <Multiselect
                                                            options={company}
                                                            selectedValues={companyid}
                                                            displayValue="label"
                                                            onSelect={setCompanyid}
                                                            onRemove={setCompanyid}
                                                            placeholder="Select Company"
                                                            showCheckbox={true}
                                                            showArrow={true}
                                                            required
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <strong><label>Medical Plan Type</label></strong>
                                                        <Multiselect
                                                            name="PlanType"
                                                            options={PlanType}
                                                            selectedValues={defMedicalPlanType}
                                                            displayValue="label"
                                                            onSelect={setDefMedicalPlanType}
                                                            onRemove={setDefMedicalPlanType}
                                                            placeholder="Select Medical Plan Type"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Locations</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={setSelectedOption}
                                                            onRemove={setSelectedOption}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Submit</button>
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

            <Modal size='lg' show={editshowModal} onHide={() => setEditShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Co-Payment Type</Modal.Title>
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
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Co-Payment Type</strong></label>
                                                        <input type='text' className="form-control" name='Name' placeholder='Enter Condition Label' defaultValue={coPaymentValues.name} autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Co-Payment Description</strong></label>
                                                        <input type='text' className="form-control" name='description' placeholder='Enter Condition Description' defaultValue={coPaymentValues.description} autoComplete='off' required />

                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Plan Category</strong></label>
                                                        <Multiselect
                                                            options={planCategory}
                                                            selectedValues={defaultPlancategory}
                                                            displayValue="label"
                                                            onSelect={setDefaultPlanCategory}
                                                            onRemove={setDefaultPlanCategory}
                                                            placeholder="Select Plan Category"
                                                            showCheckbox={true}
                                                            showArrow={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Company</strong></label>

                                                        <Multiselect
                                                            options={company}
                                                            selectedValues={companyid}
                                                            displayValue="label"
                                                            onSelect={setCompanyid}
                                                            onRemove={setCompanyid}
                                                            placeholder="Select Company"
                                                            showCheckbox={true}
                                                            showArrow={true}
                                                            required
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <strong><label>Medical Plan Type</label></strong>
                                                        <Multiselect
                                                            options={PlanType}
                                                            selectedValues={defMedicalPlanType}
                                                            name="PlanType"
                                                            displayValue="label"
                                                            onSelect={setDefMedicalPlanType}
                                                            onRemove={setDefMedicalPlanType}
                                                            placeholder="Select Medical Plan Type"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Locations</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedOption}
                                                            displayValue="label"
                                                            onSelect={setSelectedOption}
                                                            onRemove={setSelectedOption}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Update</button>
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
                    <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default ViewCopayment