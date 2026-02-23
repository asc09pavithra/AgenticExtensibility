import React, { useState } from 'react';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';

import AppAlert from '../../common/AppAlert';
import AppBar from '@mui/material/AppBar';
import Capabilities from '../../common/Capabilities';
import Grid from '@mui/material/Grid';
import JobStatisticsService from '../../services/JobStatisticsService';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { JobStatisticsAgentLogContent } from './JobStatisticsAgentLog';
import { JobStatisticsAgentsTabContent } from './jobStatisticsAgents';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    }
}), { defaultTheme: theme });

function JobStatisticsAgentsTabs(props) {
    let jobStatisticsService = new JobStatisticsService('http://localhost:5000/oxpd2-examples/api');

    const [value, setValue] = React.useState(0);
    const [currentCapabilities, setCapabilities] = React.useState(null);
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

    function setJobStatisticsViewCapabilities(capabilities) {
        setCapabilities(capabilities);
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
                                <Tab label="Job Statistics Agents" {...a11yProps(0)} />
                                <Tab label="Job Statistics Agent Logs" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities name="Job Statistics Service Capabilities" service={jobStatisticsService} setParentCapabilities={setJobStatisticsViewCapabilities} capabilities={currentCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <JobStatisticsAgentsTabContent service={jobStatisticsService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2}>
                            <JobStatisticsAgentLogContent service={jobStatisticsService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function JobStatisticsServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='job-statistics-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Job Statistics Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Job Statistics Service
            </Typography>
            <JobStatisticsAgentsTabs classes={classes} />
        </div>
    );
}
