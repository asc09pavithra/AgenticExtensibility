import { Card, CardActions, CardContent } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { BuildLocalizedStringList, PropertyItem } from '../../common/ResponseTypes';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import LifetimeCounters from './LifetimeCounters';

function DeviceUsageAgentTabs(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="device usage agents" {...baseTabStyles}>
                            <Tab label="Device Usage Agent" {...a11yProps(0)} />
                            <Tab label="Lifetime Counters" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <DeviceUsageAgent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <LifetimeCounters service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId} />
                    </ViewTabPanel>
                </Paper>
            </Grid>
        </Grid>
    );
}

function DeviceUsageAgentDetails({ deviceUsageAgent }) {
    if (deviceUsageAgent) {
        return (
            <List data-testid="deviceusage-agentdetails-list" component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={deviceUsageAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="solutionId" secondary={deviceUsageAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="name" secondary={deviceUsageAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={deviceUsageAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={deviceUsageAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function DeviceUsageAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const deviceUsagesService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentDeviceUsageAgent, setCurrentDeviceUsageAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadDeviceUsageAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadDeviceUsageAgent(props.agentId);
    }

    async function loadDeviceUsageAgent(agentId) {
        let response;

        console.log("loadDeviceUsageAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await deviceUsagesService.getDeviceUsageAgent(agentId);
            console.log("getDeviceUsageAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentDeviceUsageAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve DeviceUsageAgent ' + agentId + ' - ' + error.cause.message);
        }
        setIsLoading(false);
    }


    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    return (
        <Card data-testid="deviceusage-agent-card">
            <CardContent>
                <Typography variant="h5" component="h2">Device Usage Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentDeviceUsageAgent && <DeviceUsageAgentDetails deviceUsageAgent={currentDeviceUsageAgent} />)
                }
                <ApiResponseDialog title="Device Usage Agent API Response" open={state.showApiResponse} apiResponse={currentDeviceUsageAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="deviceusage-agent-loadrefresh" onClick={handleLoadClicked} isLoading={currentDeviceUsageAgent === null} location="Device Usage Agent" />
                <ApiResponseButton data-testid="deviceusage-agent-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}


export {
    DeviceUsageAgent,
    DeviceUsageAgentDetails,
    DeviceUsageAgentTabs
};
