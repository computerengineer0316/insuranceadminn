import React from 'react'
import PropTypes from 'prop-types';
const PolicyTypeName = ({ data, type }) => {
    let policytype = type.toLowerCase(type)
    return (
        <div>
            {
                policytype.includes('motor') ? (
                    <span >{data && data.policy_type_name ? data.policy_type_name : "-"}</span>
                ) : policytype.includes('travel') ? (
                    <span>{data && data.travel_insurance_for ? data.travel_insurance_for : "-"}</span>
                ) : policytype.includes('medical') ? (
                    <span>{data && data.medical_plan_type ? data.medical_plan_type : "-"}</span>
                ) : policytype.includes('yacht') ? (
                    <span>{data && data.policy_type_name ? data.policy_type_name : "-"}</span>
                ) : policytype.includes('home') ? (
                    <span>{data && data.home_plan_type ? data.home_plan_type : "-"}</span>
                ) : <span>{""}</span>


            }
        </div>
    )
}
PolicyTypeName.propTypes = {
    data: PropTypes.object,
    type: PropTypes.string
};
export default PolicyTypeName
