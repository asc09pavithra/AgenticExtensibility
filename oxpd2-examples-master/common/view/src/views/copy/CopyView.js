import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { ViewTabPanel, a11yProps } from "../../common/ViewTabPanel";
import CopyService from "../../services/CopyService";
import { Grid } from "@mui/material";
import Capabilities from '../../common/Capabilities';
import { useStyles, baseTabStyles } from "../../common/commonStyles";
import Paper from "@mui/material/Paper";
import AppAlert from '../../common/AppAlert';
import { CopyAgentsTabContent } from './CopyAgents';
import { CopyProfileTabContent } from './CopyProfile';
import { DefaultOptions } from './DefaultOptions';
import { CopyAgentLogContent } from './CopyAgentLog'

function CopyTabs(props) {
    let copyService = new CopyService('http://localhost:5000/oxpd2-examples/api');
    const [value, setValue] = React.useState(0);
    const [currentCopyCapabilities, setCopyCapabilities] = React.useState(null);
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
        setInitialLoad(true);
    };

    function setCopyViewCapabilities(capabilities) {
        setCopyCapabilities(capabilities);
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
                                <Tab label="Copy Agents" {...a11yProps(3)} />
                                <Tab label="Copy Agent Logs" {...a11yProps(4)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities name="Copy Service Capabilities" service={copyService} setParentCapabilities={setCopyViewCapabilities} capabilities={currentCopyCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <DefaultOptions service={copyService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2}>
                            <CopyProfileTabContent service={copyService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={3}>
                            <CopyAgentsTabContent service={copyService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={4}>
                            <CopyAgentLogContent service={copyService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function CopyServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='device-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Copy Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Copy Service
            </Typography>
            <CopyTabs classes={classes} />
        </div>
    );
}
