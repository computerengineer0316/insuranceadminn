import React from 'react';
import PropTypes from 'prop-types';
import PolicyTypeName from '../PolicyTypeName';
import { AgentrowsPanHook } from 'src/hooks';

PerformanceGraphModal.propTypes = {
    state: PropTypes.shape({
        newleaddata: PropTypes.array,
        indexnumberOfSupervisor: PropTypes.object
    })
};
export default function PerformanceGraphModal({ state }) {
    return (
        <div className="modal-body">
            {state.newleaddata.length > 0 && state.indexnumberOfSupervisor.show && state.indexnumberOfSupervisor.index !== undefined && (
                <>
                    <table className="table table-bordered">
                        <tbody>
                            {state.newleaddata[state.indexnumberOfSupervisor.index].lobs.length > 0 ? (
                                state.newleaddata[state.indexnumberOfSupervisor.index].lobs.map((lob, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div style={{ textAlign: "left" }}>
                                                <strong>Line Of Business</strong> :{lob.lob_name}
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-12' style={{ display: "grid" }}>
                                                    <table className="table table-bordered">
                                                        <thead className="thead-dark">
                                                            <tr className="">
                                                                <th>Sr. No.</th>
                                                                <th scope="col">SA Name</th>
                                                                <th scope="col">Policy Type</th>
                                                                <th scope="col">Premium</th>
                                                                <th scope="col">JDV Comm</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {lob.plans.length > 0 ? (
                                                                lob.plans.map((plan, pIndex, arr) => {
                                                                    return <tr key={pIndex}>
                                                                        <td>{pIndex + 1}</td>
                                                                        <AgentrowsPanHook lead={lob.plans} name='agent_name' pIndex={pIndex} arr={arr} />
                                                                        <td>
                                                                            <PolicyTypeName data={plan.planDetails ? plan.planDetails : null} type={lob.lob_name} />
                                                                        </td>
                                                                        <td>{plan.premium ? plan.premium.toFixed(2) : 0}</td>
                                                                        <td>{plan.jdvCommission ? plan.jdvCommission.toFixed(2) : "-"}</td>   </tr>
                                                                }

                                                                )


                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="5" className="text-center">
                                                                        <strong>No Records Found</strong>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                        {lob.plans.length > 0 && (
                                                            <>
                                                                <tr className='totalcountss'>
                                                                    <td colSpan={3} className='text-center'>
                                                                        {"Total"}
                                                                    </td>
                                                                    <td>
                                                                        {lob?.totalPremium?.toFixed(2)}
                                                                    </td>
                                                                    <td>
                                                                        {lob?.totalJdvCommission?.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        <strong>No Records Found</strong>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}
