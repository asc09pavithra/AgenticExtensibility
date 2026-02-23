import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import AuthenticationService from '../../services/AuthenticationService';
import Capabilities from '../../common/Capabilities';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { AgentServiceLogTabContent } from "./AgentServiceLogs";
import { AuthenticationAgentsTabContent } from './AuthenticationAgents';
import { AuthenticationAccessPointsTabContent } from './AuthenticationAccessPoints';
import { SessionTabContent } from './Session';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import AppAlert from '../../common/AppAlert';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    }
}), { defaultTheme: theme });

function AuthenticationTabs(props) {
    let authenticationService = new AuthenticationService('http://localhost:5000/oxpd2-examples/api');

    const [value, setValue] = React.useState(0);
    const [currentAuthenticationCapabilities, setAuthenticationCapabilities] = React.useState(null);
    const [initialLoad, setInitialLoad] = React.useState(true);

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    function postAlert(severity, message) {
        setAlertState({ open: true, severity: severity, message: message });
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        //Allows the capabilities to re-load when tab is clicked
        setInitialLoad(true);
    };

    function setAuthenticationViewCapabilities(capabilities) {
        setAuthenticationCapabilities(capabilities);
    }

    return (
        <div>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <Grid style={{ marginTop: 10 }} container>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <AppBar position="static" color="inherit">
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
                                variant="scrollable" scrollButtons="auto"
                                {...baseTabStyles}>
                                <Tab label="Capabilities" {...a11yProps(0)} />
                                <Tab label="Authentication Access Points" {...a11yProps(1)} />
                                <Tab label="Authentication Agents" {...a11yProps(2)} />
                                <Tab label="Session" {...a11yProps(3)} />
                                <Tab data-testid="authentication-agent-log-tab" label="Agent Service Log" {...a11yProps(4)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities name="Authentication Service Capabilities" service={authenticationService} setParentCapabilities={setAuthenticationViewCapabilities} capabilities={currentAuthenticationCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <AuthenticationAccessPointsTabContent service={authenticationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2}>
                            <AuthenticationAgentsTabContent service={authenticationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={3}>
                            <SessionTabContent service={authenticationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={4}>
                            <AgentServiceLogTabContent service={authenticationService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function AuthenticationServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='authentication-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Authentication Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Authentication Service
            </Typography>
            <AuthenticationTabs classes={classes} />
        </div>
    );
}
