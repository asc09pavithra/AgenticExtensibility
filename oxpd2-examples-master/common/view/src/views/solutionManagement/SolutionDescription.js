import { List } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import { PropertyItem } from '../../common/ResponseTypes';

export default function SolutionDescription({ description }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (description) {
        return (
            <React.Fragment>
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                        <ListItemText disableTypography
                            primary={
                                <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                    description
                                </Typography>}
                        /> {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding={true}>
                            <PropertyItem primary="name" secondary={description.name || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="version" secondary={description.version || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="versionNumber" secondary={description.versionNumber || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="vendor" secondary={description.vendor || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supportEmail" secondary={description.supportEmail || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supportPhone" secondary={description.supportPhone || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                            <PropertyItem primary="supportUrl" secondary={description.supportUrl || ""} />
                        </List>
                    </Collapse>
                </List>
            </React.Fragment> 
        );
    }
    return null;
}
