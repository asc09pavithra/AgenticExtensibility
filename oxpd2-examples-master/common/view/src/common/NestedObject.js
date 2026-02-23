import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { PropertyItem } from './ResponseTypes';
import { Grid } from '@mui/material';

// Function is used recursively
function NestedChild({ key1, value, expanded, i, length, excludeDivider, excludeSecondaryTopBar, reducedSpacing }) {
    const [open, setOpen] = useState(expanded);
    const handleClick = () => {
        setOpen(!open);
    };

    if(value === null || value === undefined) {
        return null;
    }

    // Checks if a key comes in as an index of an array
    if (!isNaN(key1)) {
        if (typeof value === "string" || typeof value === "number") {
            return (
                <React.Fragment>
                    <PropertyItem style={{ paddingtop: "-40px" }} secondary={value+"" || ""} />
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {Object.entries(value).map(([key, value], i, {length}) => (
                        <React.Fragment >
                            <NestedChild key1={key} value={value} i={i} length={length} expanded={expanded} excludeDivider={excludeDivider} excludeSecondaryTopBar={excludeSecondaryTopBar} reducedSpacing={reducedSpacing}/>
                        </React.Fragment>
                    ))
                }
            </React.Fragment>
        );
    }

    // // First Object
    else if (typeof value === 'object' && i === 0) {
        return (
            <List component="div" disablePadding={true}>
                {excludeSecondaryTopBar !== undefined && excludeSecondaryTopBar === true ? <></> : <Divider /> }
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {key1.toString()}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {Object.entries(value).map(([key, value], i, {length}) => (
                            <React.Fragment >
                                <NestedChild key1={key} value={value} i={i} length={length} expanded={expanded} excludeDivider={excludeDivider} excludeSecondaryTopBar={excludeSecondaryTopBar} reducedSpacing={reducedSpacing}/>
                            </React.Fragment>
                        ))
                        }
                    </List>
                </Collapse>
            </List>
        );
    } 
    else if (typeof value === 'object') {
        return (
            <List component="div" disablePadding={true}>
                <Divider style={{ marginLeft: "40px" }} />
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {key1.toString()}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {Object.entries(value).map(([key, value], i, {length}) => (
                            <React.Fragment >
                                <NestedChild key1={key} value={value} i={i} length={length} expanded={expanded} excludeDivider={excludeDivider} excludeSecondaryTopBar={excludeSecondaryTopBar} reducedSpacing={reducedSpacing}/>
                            </React.Fragment>
                        ))
                        }
                    </List>
                </Collapse>
            </List>
        );
    } 

    // First Value
    else if (i === 0)
    {
        return (
            <React.Fragment>
            {excludeDivider !== undefined && excludeDivider === true ? <></> : <Divider />}
                {reducedSpacing !== undefined && reducedSpacing === true ?
                    <Grid style={{marginTop: "-20px"}}>
                        <PropertyItem style={{ paddingtop: "-40px" }} primary={key1} secondary={value.toString() || ""} />
                    </Grid>
                    :
                    <PropertyItem style={{ paddingtop: "-40px" }} primary={key1} secondary={value.toString() || ""} />
                }
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment>
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem style={{ paddingtop: "-40px" }} primary={key1} secondary={value.toString() || ""} />
            </React.Fragment>
        );
    }
}


export function NestedObject({ resource, name, expanded, excludeDivider, excludeTopBar, excludeSecondaryTopBar, reducedSpacing }) {
    const [open, setOpen] = useState(expanded);
    const handleClick = () => {
        setOpen(!open);
    };
    if (resource) {
        return (
            <List component="div" disablePadding={true}>
                {excludeTopBar !== undefined && excludeTopBar === true ? <></> : <Divider style={{ marginLeft: "40px" }} /> }
                <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                    <ListItemText disableTypography
                        primary={
                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                {name}
                            </Typography>}
                    /> {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                        {Object.entries(resource).map(([key, value], i, {length}) => (
                            <React.Fragment>
                                <NestedChild key1={key} value={value} i={i} length={length} expanded={expanded} excludeDivider={excludeDivider} excludeSecondaryTopBar={excludeSecondaryTopBar} reducedSpacing={reducedSpacing} />
                            </React.Fragment>
                        ))
                        }
                    </List>
                </Collapse>
            </List>
        );
    }
    return null
} 
