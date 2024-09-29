import React from 'react';
import PropTypes from 'prop-types';

countSupervisors.propTypes = {
    leads: PropTypes.array
};
countAgents.propTypes = {
    leads: PropTypes.array,
    name: PropTypes.string
};
AgentrowsPanHook.propTypes = {
    lead: PropTypes.array,
    name: PropTypes.string,
    pIndex: PropTypes.number,
    arr: PropTypes.array
}
SupervisorrowsPanHook.propTypes = {
    lead: PropTypes.array,
    name: PropTypes.string,
    pIndex: PropTypes.number,
    arr: PropTypes.array
}

// Function to count occurrences of each assigned_agent
function countAgents(leads, name, startIndex) {
    const agentName = leads[startIndex][name] ? leads[startIndex][name]["name"] : '-';
    let count = 0;

    for (let i = startIndex; i < leads.length; i++) {
        const currentAgentName = leads[i][name] ? leads[i][name]["name"] : '-';
        if (currentAgentName === agentName) {
            count++;
        } else {
            break;
        }
    }

    return count;
};
function countSupervisors(leads, name, startIndex) {
    const supervisorName = leads[startIndex][name] ? leads[startIndex][name]["name"] : '-';
    let count = 0;

    for (let i = startIndex; i < leads.length; i++) {
        const currentSupervisorName = leads[i][name] ? leads[i][name]["name"] : '-';
        if (currentSupervisorName === supervisorName) {
            count++;
        } else {
            break;
        }
    }

    return count;

}
function AgentrowsPanHook({ lead, name, pIndex, arr }) {
    console.log("lead", lead);
    console.log("name", name);
    console.log("pIndex", pIndex);
    console.log("arr", arr);

    const agentName = lead[pIndex][name] ? lead[pIndex][name]["name"] : '-';
    console.log("agentName", agentName);

    // Get the rowspan based on consecutive occurrences of the same agent name
    const agentRowspan = countAgents(lead, name, pIndex);

    // Only show the agent name in the first occurrence
    const isFirstAgent = pIndex === 0 || arr[pIndex - 1][name]?.name !== agentName;
    console.log("isFirstAgent", isFirstAgent);

    return isFirstAgent && (
        <td rowSpan={agentRowspan}>
            {agentName}
        </td>
    );
}
function SupervisorrowsPanHook({ lead, name, pIndex, arr }) {
    console.log("lead", lead);
    console.log("name", name);
    console.log("pIndex", pIndex);
    console.log("arr", arr);

    const supervisorName = lead[pIndex][name] ? lead[pIndex][name]["name"] : '-';
    console.log("supervisorName", supervisorName);

    // Get the rowspan based on consecutive occurrences of the same agent name
    const supervisorRowspan = countSupervisors(lead, name, pIndex);

    // Only show the agent name in the first occurrence
    const isFirstSupervisor = pIndex === 0 || arr[pIndex - 1][name]?.name !== supervisorName;
    console.log("isFirstSupervisor", isFirstSupervisor);

    return isFirstSupervisor && (
        <td rowSpan={supervisorRowspan}>
            {supervisorName}
        </td>
    );
}

export { AgentrowsPanHook, countAgents, countSupervisors, SupervisorrowsPanHook };
