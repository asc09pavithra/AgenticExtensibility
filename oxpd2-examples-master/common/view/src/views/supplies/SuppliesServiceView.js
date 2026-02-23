import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import AppAlert from '../../common/AppAlert';
import Capabilities from '../../common/Capabilities';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import SuppliesService from '../../services/SuppliesService';
import { SuppliesAgentsTabContent } from './SuppliesAgents';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    }
}), { defaultTheme: theme });

function SuppliesAgentsTabs(props) {
    let suppliesService = new SuppliesService('http://localhost:5000/oxpd2-examples/api');

    const [value, setValue] = React.useState(0);
    const [currentSuppliesCapabilities, setSuppliesCapabilities] = React.useState(null);
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

    function setSuppliesViewCapabilities(capabilities) {
        setSuppliesCapabilities(capabilities);
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
                                <Tab label="Supplies Agents" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <ViewTabPanel value={value} index={0}>
                            <Capabilities name="Supplies Service Capabilities" service={suppliesService} setParentCapabilities={setSuppliesViewCapabilities} capabilities={currentSuppliesCapabilities} setInitialLoad={setInitialLoad} initialLoad={initialLoad} postAlert={postAlert} />
                        </ViewTabPanel>
                        <ViewTabPanel value={value} index={1}>
                            <SuppliesAgentsTabContent service={suppliesService} postAlert={postAlert} />
                        </ViewTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default function SuppliesServiceView(props) {
    const classes = useStyles();

    return (
        <div data-testid='supplies-view' className={classes.root}>
            <Typography className={classes.viewTitle} variant="h4" paragraph={true}>
                Supplies Service
            </Typography>
            <Typography paragraph={true}>
                Example interaction with the OXPd2 Supplies Service
            </Typography>
            <SuppliesAgentsTabs classes={classes} />
        </div>
    );
}
