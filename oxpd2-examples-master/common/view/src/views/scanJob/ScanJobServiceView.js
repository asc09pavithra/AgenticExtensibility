import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import AppAlert from '../../common/AppAlert';
import Capabilities from '../../common/Capabilities';
import { a11yProps, ViewTabPanel } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import ScanJobService from '../../services/ScanJobService';
import { ScanJobAgentsTabContent } from './ScanJobAgents';
import { DefaultOptions } from './DefaultOptions';
import { ScanProfileTabContent } from './ScanProfile';
import { ScanJobAgentLogContent } from './ScanJobAgentLog'
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    }
}), { defaultTheme: theme });

function ScanJobAgentsTabs(props) {
    let scanJobService = new ScanJobService('http://localhost:5000/oxpd2-examples/api');

    const [value, setValue] = React.useState(0);
    const [currentScanCapabilities, setScanCapabilities] = React.useState(null);
    const [initialLoad, setInitialLoad] = React.useState(true);

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
        //Allows the capabilities to re-load when tab is clicked
        setInitialLoad(true);
    };

    function setScanJobViewCapabilities(capabilities) {
        setScanCapabilities(capabilities);
    }

    return (
        <div>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <Grid style={{ marginTop: 10 }} container>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <AppBar position="static" color="inherit">
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" {...baseTabStyles}>
                                <Tab label="Capabilities" {...a11yProps(0)} />
                                <Tab label="Default Options" {...a11yProps(1)} />
                                <Tab label="Profile" {...a11yProps(2)} />
                                <Tab label="Scan Job Agents" {...a11yProps(3)} />
                                <Tab label="Scan Job Agent Logs" {...a11yProps(4)} />
                                
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities name="Scan Job Service Capabilities" service={scanJobService} setParentCapabilities={setScanJobViewCapabilities} capabilities={currentScanCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <DefaultOptions service={scanJobService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2}>
                            <ScanProfileTabContent service={scanJobService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={3}>
                            <ScanJobAgentsTabContent service={scanJobService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={4}>
                            <ScanJobAgentLogContent service={scanJobService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function ScanJobServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='scan-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Scan Job Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Scan Job Service.
            </Typography>
            <ScanJobAgentsTabs classes={classes} />
        </div>
    );
}
