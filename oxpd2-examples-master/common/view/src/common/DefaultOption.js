import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { PropertyHeader, PropertyItem } from './ResponseTypes';

function BuildOptionFileName({ value }) {
    if (value) {
        if (value.expression) {
            return (
                <React.Fragment>
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <PropertyItem style={{ paddingtop: "-40px" }} primary={"expressedValue"} secondary={value.expression.expressedValue || ""} />
                        <PropertyItem style={{ paddingtop: "-40px" }} primary={"expressionPattern"} secondary={value.expression.expressionPattern || ""} />
                    </List>
                </React.Fragment>
            );
        } else if (value.explicit) {
            return (
                <React.Fragment>
                    <PropertyItem style={{ paddingtop: "-40px" }} primary={"explicit"} secondary={value.explicit.explicitValue || ""} />
                </React.Fragment>
            );
        }
    }
    return null;
}

export default function DefaultOption({ key1, value }) {
    if (key1) {
        if (key1 == "fileName" && value != null) {
            return (
                <React.Fragment>
                    <PropertyHeader name={key1} />
                    <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                        <BuildOptionFileName value={value} />
                    </List>
                    <Divider style={{ marginLeft: "40px" }} />
                </React.Fragment>
            );
        } else if (value != null && (key1 == "$opMeta" || key1 == "links")) {
            return (
                <React.Fragment />
            )
        } else if (key1 != "fileName" && value != null) {
            return (
                <React.Fragment>
                <PropertyItem style={{ paddingtop: "-40px", paddingLeft:"40px"}} primary={key1} secondary={value.toString() || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                </React.Fragment>
            );
        }
    }
    return null;
}
