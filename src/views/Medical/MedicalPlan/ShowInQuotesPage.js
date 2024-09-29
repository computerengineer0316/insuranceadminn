import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';

const ShowInQuotesPage = () => {
    const [quotesData, setQuotesData] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token == null || token == undefined || token == '') {
            window.location = '/login';
        } else {
            GetQuotesData();
        }

    }, []);
    const GetQuotesData = () => {
        const reqOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getMedicalQoutesPageStatus', reqOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setQuotesData(data.data);
                console.log("<>>>>> quotes data >>><>>> ", data.data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const captureAction = (e, id) => {
        let value = e.target.value;
        const reqOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: value })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateMedicalQoutesPageStatus?id=${id}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    GetQuotesData();
                    swal("Success", "Updated Successfully", "success");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    {quotesData?.map((item, index) => {
                        return (
                            <div key={index} className='card'>
                                <div className='card-header'>
                                    <div className='card-title'>
                                        <h4>{item.name}</h4>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <h4> <input type='radio' defaultChecked={item.status == true ? true : false} onClick={(e) => captureAction(e, item._id)} value='yes' name='yesno' className='btn btn-primary m-2' /><label><strong>Yes</strong></label></h4>

                                            <h4><input type='radio' value='no' name='yesno' defaultChecked={item.status == false ? true : false} onClick={(e) => captureAction(e, item._id)} className='btn btn-warning m-2' /><label><strong>No</strong></label></h4>

                                        </div>
                                    </div>
                                </div>

                            </div>)
                    })}

                    {/* <h1>Show In Quotes Page?</h1>
                   */}
                </div>
            </div>

        </div>
    )
}

export default ShowInQuotesPage
