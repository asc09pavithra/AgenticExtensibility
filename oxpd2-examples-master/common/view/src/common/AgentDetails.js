import React from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { BuildLocalizedStringList, PropertyItem } from './ResponseTypes';

export default function AgentDetails({ agent }) {
    if (agent) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={agent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="solutionId" secondary={agent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="name" secondary={agent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={agent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={agent.localizedDescription} />
                </List>
            </List>
        );
    }
}
