import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const ViewBank = () => {
    let textInput1 = React.createRef();
    let textInput2 = React.createRef();
    let textInput3 = React.createRef();
    let textInput4 = React.createRef();
    let textInput5 = React.createRef();
    const navigate = useNavigate();
    const [listBank, setListBank] = useState([]);
    const [perPage] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [company_id, setCompanyId] = useState('');
    const [bank_name, setBankName] = useState('');
    const [bank_account_number, setBankAccountNumber] = useState('');
    const [iban_number, setIbanNumber] = useState('');
    const [swift_code, setSwiftCode] = useState('');
    const [bank_id, setBankId] = useState('');
    const [LineOfBusiness, setLineOfBusiness] = useState([]);
    const [line_of_business, setLineOfBusinessId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setCompanyId(id);
            getlistBank(page, perPage);
            getlistLineOfBusiness();
        }
    }, []);

    const getlistLineOfBusiness = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const line_of_businessdt = data.data;
                const line_of_business_len = line_of_businessdt.length;
                const line_of_business_list = [];
                for (let i = 0; i < line_of_business_len; i++) {
                    const line_of_business_obj = { label: line_of_businessdt[i].line_of_business_name, value: line_of_businessdt[i]._id };
                    line_of_business_list.push(line_of_business_obj);
                }
                setLineOfBusiness(line_of_business_list);
            });
    }

    const getlistBank = (page, perPage) => {
        setListBank([]);
        const url = window.location.href;
        const url1 = url.split("/")[3];
        const url2 = url1.split("?")[1];
        const id = url2.split("=")[1];
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: id
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getBank/${page}/${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setListBank(data.data);
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setPage(selectedPage);
        getlistBank(selectedPage, perPage);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const bank_name = data.get('bank_name');
        const bank_account_number = data.get('bank_account_number');
        const iban_number = data.get('iban_number');
        const swift_code = data.get('swift_code');
        const line_of_business = data.get('line_of_business');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bank_name: bank_name,
                bank_account_number: bank_account_number,
                iban_number: iban_number,
                swift_code: swift_code,
                line_of_business: line_of_business,
                company_id: company_id
            })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addBank', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "OK",
                    }).then(function () {
                        textInput1.current.value = '';
                        textInput2.current.value = '';
                        textInput3.current.value = '';
                        textInput4.current.value = '';
                        textInput5.current.value = '';
                        window.location.reload();
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "OK",
                    }).then(function () {
                        textInput1.current.value = '';
                        textInput2.current.value = '';
                        textInput3.current.value = '';
                        textInput4.current.value = '';
                        textInput5.current.value = '';
                        window.location.reload();
                    });
                }
            });
    }

    const editbank = (bankid) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: bankid
            })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getBankDetailsbyid', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    console.log(data.data)
                    setBankName(data.data.bankname);
                    setBankAccountNumber(data.data.accountnumber);
                    setIbanNumber(data.data.ibannumber);
                    setSwiftCode(data.data.swiftcode);
                    setBankId(data.data._id);
                    setLineOfBusinessId(data.data.line_of_business_id);
                }
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const bank_name = data.get('bank_name');
        const bank_account_number = data.get('bank_account_number');
        const iban_number = data.get('iban_number');
        const swift_code = data.get('swift_code');
        const line_of_business = data.get('line_of_business');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bank_name: bank_name,
                bank_account_number: bank_account_number,
                iban_number: iban_number,
                swift_code: swift_code,
                line_of_business: line_of_business,
                bank_id: bank_id
            })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/updateBank', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "OK",
                    }).then(function () {
                        textInput1.current.value = '';
                        textInput2.current.value = '';
                        textInput3.current.value = '';
                        textInput4.current.value = '';
                        textInput5.current.value = '';
                        setBankId('');
                        window.location.reload();
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "OK",
                    }).then(function () {
                        textInput1.current.value = '';
                        textInput2.current.value = '';
                        textInput3.current.value = '';
                        textInput4.current.value = '';
                        textInput5.current.value = '';
                        setBankId('');
                        window.location.reload();
                    });
                }
            });
    }

    const updateStatus = (bankid, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: status
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_bank_status/${bankid}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getlistBank(page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getlistBank(page, perPage);
                    });
                }
            });
    }

    return (

        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="card card-default">
                        <div className="card-header justify-content-center">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Bank Details</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/insurance-company" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={bank_id != "" ? updateSubmit : handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Bank Name</label>
                                            <input type="text" className="form-control" placeholder="Bank Name" name="bank_name" autoComplete="off" defaultValue={bank_name} ref={textInput1} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Bank Account Number</label>
                                            <input type="text" className="form-control" placeholder="Bank Account Number" name="bank_account_number" autoComplete="off" defaultValue={bank_account_number} ref={textInput2} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>IBAN Number</label>
                                            <input type="text" className="form-control" placeholder="IBAN Number" name="iban_number" autoComplete="off" defaultValue={iban_number} ref={textInput3} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Swift Code</label>
                                            <input type="text" className="form-control" placeholder="Swift Code" name="swift_code" autoComplete="off" defaultValue={swift_code} ref={textInput5} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Line Of Business</label>
                                            <select className="form-control" name="line_of_business" ref={textInput4} required>
                                                <option value="">Select Line Of Business</option>
                                                {
                                                    LineOfBusiness.map((item, index) => (
                                                        <option key={index} value={item.value} selected={line_of_business == item.value ? true : false}>{item.label}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>{bank_id != "" ? "Update" : "Submit"}</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Bank Name</th>
                                                <th>Bank Account Number</th>
                                                <th>IBAN Number</th>
                                                <th>Swift Code</th>
                                                <th>Line Of Business</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (listBank.length > 0) ?
                                                    listBank.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.bankname}</td>
                                                            <td>{item.accountnumber}</td>
                                                            <td>{item.ibannumber}</td>
                                                            <td>{item.swiftcode}</td>
                                                            <td>{item.line_of_business[0]['line_of_business_name']}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm" onClick={() => editbank(item._id)}>Edit</button>&nbsp;&nbsp;
                                                                {
                                                                    item.bankstatus === 1 ?
                                                                        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updateStatus(item._id, 0) }}>Deactivate</button> :
                                                                        <button className="btn btn-success btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updateStatus(item._id, 1) }}>Activate</button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )) : <tr><td colSpan="5" style={{ textAlign: "center" }}>No Data Found</td></tr>
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
        </div>
    )
}

export default ViewBank
