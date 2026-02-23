import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import React from 'react';
import { PropertyHeader, PropertyItem } from './ResponseTypes';

export default function ActivityStatus({ object, name }) {
    if(object === null || object === undefined) {
        return null;
    }

    return (
        <React.Fragment>
            <PropertyHeader name={name}/>
            <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                {Object.entries(object).map(([key, value]) => (
                    <React.Fragment>
                        <PropertyItem primary="activity" secondary={value.activity} />
                        <PropertyItem primary="timestamp" secondary={value.timestamp} />
                    </React.Fragment>
                ))
                }
            </List>
            <Divider style={{ marginLeft: "40px" }} />
        </React.Fragment>
    )
}
