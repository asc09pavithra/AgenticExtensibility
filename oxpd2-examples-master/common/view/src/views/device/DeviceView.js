import React, { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { ViewTabPanel, a11yProps } from "../../common/ViewTabPanel";
import DeviceService from "../../services/DeviceService";
import { Grid } from "@mui/material";
import Capabilities from '../../common/Capabilities';
import { Identity } from './Identity';
import { Status } from './Status';
import { Email } from './Email';
import { Scanner } from './Scanner';
import { useStyles, baseTabStyles } from "../../common/commonStyles";
import Paper from "@mui/material/Paper";
import AppAlert from '../../common/AppAlert';
import { DeviceContext } from "../../common/DeviceContext";
import { DeploymentInformation } from "./DeploymentInformation";

function DeviceTabs(props) {
    let deviceService = new DeviceService('http://localhost:5000/oxpd2-examples/api');
    const deviceContext = useContext(DeviceContext);
    const [value, setValue] = React.useState(0);
    const [currentDeviceCapabilities, setDeviceCapabilities] = React.useState(null);
    const [currentDeviceIdentity, setDeviceIdentity] = React.useState(null);
    const [currentDeviceStatus, setDeviceStatus] = React.useState(null);
    const [currentDeviceEmail, setDeviceEmail] = React.useState(null);
    const [currentDeviceScanner, setDeviceScanner] = React.useState(null);
    const [currentDeviceDeploymentInformation, setDeviceDeploymentInformation] = React.useState(null);
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [loadEnabled] = useState(null !== deviceContext && null !== deviceContext.currentDevice);

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

    function setDeviceViewCapabilities(capabilities) {
        setDeviceCapabilities(capabilities);
    }

    function setDeviceViewIdentity(identity) {
        setDeviceIdentity(identity);
    }

    function setDeviceViewStatus(status) {
        setDeviceStatus(status);
    }

    function setDeviceViewEmail(email) {
        setDeviceEmail(email);
    }

    function setDeviceViewScanner(scanner) {
        setDeviceScanner(scanner);
    }

    function setDeviceViewDeploymentInformation(deploymentInformation) {
        setDeviceDeploymentInformation(deploymentInformation);
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
                                <Tab label="Deployment Information" {...a11yProps(1)} />
                                <Tab label="Identity" {...a11yProps(2)} />
                                <Tab label="Status" {...a11yProps(3)} />
                                <Tab label="Email" {...a11yProps(4)} />
                                <Tab label="Scanner" {...a11yProps(5)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities name="Device Service Capabilities" service={deviceService} setParentCapabilities={setDeviceViewCapabilities} capabilities={currentDeviceCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1} disabled={!loadEnabled}>
                            <DeploymentInformation name="Device Service Deployment Information" service={deviceService} setParentDeploymentInformation={setDeviceViewDeploymentInformation} DeploymentInformation={currentDeviceDeploymentInformation} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2} disabled={!loadEnabled}>
                            <Identity name="Device Service Identity" service={deviceService} setParentIdentity={setDeviceViewIdentity} Identity={currentDeviceIdentity} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={3} disabled={!loadEnabled}>
                            <Status name="Device Service Status" service={deviceService} setParentStatus={setDeviceViewStatus} Status={currentDeviceStatus} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={4} disabled={!loadEnabled}>
                            <Email name="Device Service Email" service={deviceService} setParentEmail={setDeviceViewEmail} Email={currentDeviceEmail} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={5} disabled={!loadEnabled}>
                            <Scanner name="Device Service Scanner" service={deviceService} setParentScanner={setDeviceViewScanner} Scanner={currentDeviceScanner} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function DeviceServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='device-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Device Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Device Service
            </Typography>
            <DeviceTabs classes={classes} />
        </div>
    );
}
