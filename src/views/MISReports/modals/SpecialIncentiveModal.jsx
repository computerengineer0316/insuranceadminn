import React from 'react';
import PropTypes from 'prop-types';
import PolicyTypeName from '../PolicyTypeName';
import { AgentrowsPanHook, countAgents, countSupervisors, SupervisorrowsPanHook } from 'src/hooks';

SpecialIncentiveModal.propTypes = {
    state: PropTypes.shape({
        newleaddata: PropTypes.array,
        indexnumberOfSupervisor: PropTypes.object
    })
};
function SpecialIncentiveModal({ state }) {
    return (
        <>
            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Sr. No.</th>
                        <th scope="col">Supervisor/Team</th>
                        <th scope="col">SA Name</th>
                        <th scope="col">Line of Business</th>
                        <th scope="col">Policy Type</th>
                        <th scope="col">Premium</th>
                        <th scope="col">Commission Earned by JdV</th>
                    </tr>
                </thead>
                <tbody>
                    {state.newleaddata[state.indexnumberOfSupervisor.index]?.completed_by?.map((item, ind) => {
                        return (
                            <React.Fragment key={ind}>
                                {item?.lead?.map((plan, pIndex, arr) => {


                                    return (
                                        <tr key={pIndex}>
                                            <td>{pIndex + 1}</td>
                                            <SupervisorrowsPanHook lead={item.lead} name="supervisor_id" pIndex={pIndex} arr={arr} />
                                            <AgentrowsPanHook lead={item.lead} name="assigned_agent" pIndex={pIndex} arr={arr} />
                                            <td>{plan.type_of_policy ? plan.type_of_policy.line_of_business_name : '-'}</td>
                                            <td>
                                                <PolicyTypeName data={plan.plan_id ? plan.plan_id : null} type={plan.type_of_policy ? plan.type_of_policy.line_of_business_name : '-'} />
                                            </td>
                                            <td>{plan.final_price ? plan.final_price.toFixed(2) : 0}</td>
                                            <td>{plan.jdvComission ? plan.jdvComission.toFixed(2) : 0}</td>
                                        </tr>
                                    );
                                })}

                                <tr className='totalcountss'>
                                    <td colSpan={5}>Total</td>
                                    <td>{item.totalPremium ? item.totalPremium.toFixed(2) : 0}</td>
                                    <td>{item.totalCommission ? item.totalCommission.toFixed(2) : 0}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};
export default SpecialIncentiveModal;