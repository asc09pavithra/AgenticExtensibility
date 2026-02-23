import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { ViewTabPanel, a11yProps } from "../../common/ViewTabPanel";
import UsbAccessoriesService from "../../services/UsbAccessoriesService";
import { Grid } from "@mui/material";
import { useStyles, baseTabStyles } from "../../common/commonStyles";
import Paper from "@mui/material/Paper";
import Capabilities from '../../common/Capabilities';
import { UsbAgentsTabContent } from './UsbAgents';
import { UsbAccessoriesTabContent } from './UsbAccessories';
import { UsbAccessoriesLogContent } from './UsbAccessoriesAgentLog';
import AppAlert from '../../common/AppAlert';

function UsbAccessoriesTabs(props) {
    let usbAccessoriesService = new UsbAccessoriesService(
        "http://localhost:5000/oxpd2-examples/api"
    );
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [value, setValue] = React.useState(0);
    const [currentUsbAccessoriesCapabilities, setUsbAccessoriesCapabilities] = React.useState(null);

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

    function setUsbAccessoriesViewCapabilities(capabilities) {
        setUsbAccessoriesCapabilities(capabilities);
    }

    return (
        <div>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <Grid style={{ marginTop: 10 }} container>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <AppBar position="static" color="inherit">
                            <Tabs value={value} onChange={handleChange} aria-label="USB Accessories Service Tabs" {...baseTabStyles}>
                                <Tab data-testid="usb-accessories-capabilities-tab" label="Capabilities" {...a11yProps(0)} />
                                <Tab data-testid="usb-accessories-agents-tab" label="USB Accessories Agents" {...a11yProps(1)} />
                                <Tab data-testid="usb-accessories-tab" label="USB Accessories" {...a11yProps(2)} />
                                <Tab data-testid="usb-accessories-agent-logs-tab" label="USB Acessories Logs" {...a11yProps(3)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities
                                name="USB Accessories Service Capabilities"
                                service={usbAccessoriesService}
                                setParentCapabilities={setUsbAccessoriesViewCapabilities}
                                capabilities={currentUsbAccessoriesCapabilities}
                                setInitialLoad={setInitialLoad}
                                initialLoad={initialLoad}
                                postAlert={postAlert}
                            />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <UsbAgentsTabContent service={usbAccessoriesService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2}>
                            <UsbAccessoriesTabContent service={usbAccessoriesService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={3}>
                            <UsbAccessoriesLogContent postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function UsbAccessoriesView(props) {
    const classes = useStyles();

    return (
        <div data-testid="usb-accessories-view" className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                USB Accessories Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 USB Accessories Service
            </Typography>
            <UsbAccessoriesTabs classes={classes} />
        </div>
    );
}
