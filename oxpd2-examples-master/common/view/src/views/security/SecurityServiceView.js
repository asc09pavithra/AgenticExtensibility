import { AppBar, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import AppAlert from '../../common/AppAlert';
import Capabilities from '../../common/Capabilities';
import { useStyles, baseTabStyles } from '../../common/commonStyles';
import { a11yProps, ViewTabPanel } from '../../common/ViewTabPanel';
import SecurityService from '../../services/SecurityService';
import { SecurityAgentsTabContent } from './SecurityAgents';

export default function SecurityServiceView(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Security Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Security Service
            </Typography>
            <SecurityServiceTabs classes={classes} />
        </div>
    );
}

function SecurityServiceTabs(props) {
    let securityService = new SecurityService('http://localhost:5000/oxpd2-examples/api');
    const [value, setValue] = React.useState(0);
    const [securityCapabilities, setSecurityCapabilities] = React.useState(null);
    const [initialLoad, setInitialLoad] = React.useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setInitialLoad(true);
    };

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    function postAlert(severity, message) {
        setAlertState({ open: true, severity: severity, message: message });
    }

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    return (
        <div>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <Grid style={{ marginTop: 10 }} container>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <AppBar position="static" color="inherit">
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" {...baseTabStyles}>
                                <Tab label="Capabilities" {...a11yProps(0)} />
                                <Tab label="Security Agents" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities name="Security Service Capabilities" service={securityService} setParentCapabilities={setSecurityCapabilities} capabilities={securityCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <SecurityAgentsTabContent service={securityService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
