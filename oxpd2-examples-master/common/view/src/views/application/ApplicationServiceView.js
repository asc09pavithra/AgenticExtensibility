import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { ApplicationAccessPointsTabContent } from './ApplicationAccessPoints';
import { ApplicationCapabilities } from './ApplicationCapabilities';
import { ApplicationRuntimeTabContent } from './ApplicationRuntime';
import ApplicationService from '../../services/ApplicationService';
import { ApplicationTabContent } from './ApplicationAgents';
import { MessageCenterTabContent } from './MessageCenterAgents';
import { Homescreen } from './Homescreen';
import Grid from '@mui/material/Grid';
import { I18nAssetTabContent } from './I18nAssets';
import Paper from '@mui/material/Paper';
import { Tab, Tabs } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useStyles, baseTabStyles } from '../../common/commonStyles';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import AppAlert from '../../common/AppAlert';

function ApplicationsTabs(props) {
    let applicationService = new ApplicationService('http://localhost:5000/oxpd2-examples/api');
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [value, setValue] = React.useState(0);
    const [currentAppCapabilities, setAppCapabilities] = React.useState(null);

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

    return (
        <div>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <Grid style={{ marginTop: 10 }} container>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <AppBar position="static" color="inherit">
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
                                variant="scrollable"
                                scrollButtons="auto"
                                {...baseTabStyles}>
                                <Tab label="Capabilities" {...a11yProps(0)} />
                                <Tab label="Application Agents" {...a11yProps(1)} />
                                <Tab label="Application Access Points" {...a11yProps(2)} />
                                <Tab data-testid='application-runtime-tab' label="Application Runtime" {...a11yProps(3)} />
                                <Tab label="Homescreen" {...a11yProps(4)} />
                                <Tab label="I18nAssets" {...a11yProps(5)} />
                                <Tab label="Message Center Agents" {...a11yProps(6)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <ApplicationCapabilities
                                serviceName="Application Service"
                                service={applicationService}
                                capabilities={currentAppCapabilities}
                                setCapabilities={setAppCapabilities}
                                setInitialLoad={setInitialLoad}
                                initialLoad={initialLoad}
                                postAlert={postAlert}
                            />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <ApplicationTabContent service={applicationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2}>
                            <ApplicationAccessPointsTabContent service={applicationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={3}>
                            <ApplicationRuntimeTabContent service={applicationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={4}>
                            <Homescreen service={applicationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={5}>
                            <I18nAssetTabContent service={applicationService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={6}>
                            <MessageCenterTabContent service={applicationService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function ApplicationServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='application-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Application Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Application Service
            </Typography>
            <ApplicationsTabs classes={classes} />
        </div>
    );
}
