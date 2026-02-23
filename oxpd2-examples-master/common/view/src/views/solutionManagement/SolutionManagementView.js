import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { ViewTabPanel, a11yProps } from "../../common/ViewTabPanel";
import Installer from "./Installer";
import { SolutionTabContent } from "./Solutions";
import { SolutionAgentContent } from "./SolutionAgent";
import SolutionManagerService from "../../services/SolutionManagerService";
import { Grid } from "@mui/material";
import { SolutionManagerCapabilities } from "./Capabilities";
import { useStyles, baseTabStyles } from "../../common/commonStyles";
import Paper from "@mui/material/Paper";
import AppAlert from '../../common/AppAlert';

function SolutionManagementTabs(props) {
    let solutionManagerService = new SolutionManagerService(
        "http://localhost:5000/oxpd2-examples/api"
    );
    const [capabilities, setCapabilities] = React.useState(null);
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        //Allows the capabilities to re-load when tab is clicked
        setInitialLoad(true);
    };

    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'error',
        message: ''
    });

    function postAlert(severity, message) {
        setAlertState({ open: true, severity: severity, message: message });
    }

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    return (
        <div>
            <AppAlert open={alertState.open} handleClose={handleAlertClose} severity={alertState.severity} message={alertState.message} />
            <Grid style={{ marginTop: 10 }} container>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <AppBar position="static" color="inherit">
                            <Tabs 
                                value={value} 
                                onChange={handleChange} 
                                aria-label="Solution Manager Service Tabs"
                                {...baseTabStyles}
                            >
                                <Tab data-testid="solution-management-capabilities-tab" label="Capabilities" {...a11yProps(0)} />
                                <Tab data-testid="solution-management-installer-tab" label="Installer" {...a11yProps(1)} />
                                <Tab data-testid="solution-management-solutions-tab" label="Solutions" {...a11yProps(2)} />
                                <Tab data-testid="solution-management-solutions-agent-tab" label="Solution Agent" {...a11yProps(3)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <SolutionManagerCapabilities
                                service={solutionManagerService}
                                currentCapabilities={capabilities}
                                setCapabilities={setCapabilities}
                                setInitialLoad={setInitialLoad}
                                initialLoad={initialLoad}
                                postAlert={postAlert}
                            />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <Installer service={solutionManagerService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={2}>
                            <SolutionTabContent service={solutionManagerService} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={3}>
                            <SolutionAgentContent service={solutionManagerService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function SolutionManagementView(props) {
    const classes = useStyles();

    return (
        <div data-testid="solution-view" className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Solution Manager Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Solution Manager Service
            </Typography>
            <SolutionManagementTabs classes={classes} />
        </div>
    );
}
