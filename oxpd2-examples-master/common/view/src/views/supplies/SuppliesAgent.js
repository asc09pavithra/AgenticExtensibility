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
import SuppliesConfiguration from './SuppliesConfiguration';
import SuppliesInfo from './SuppliesInfo';
import SuppliesUsage from './SuppliesUsage';

function SuppliesAgentTabs(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="supplies agents" {...baseTabStyles}>
                            <Tab label="Supplies Agent" {...a11yProps(0)} />
                            <Tab label="Supplies Configuration" {...a11yProps(1)} />
                            <Tab label="Supplies Info" {...a11yProps(2)} />
                            <Tab label="Supplies Usage" {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <SuppliesAgent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <SuppliesConfiguration service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId} />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={2}>
                        <SuppliesInfo service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId} />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={3}>
                        <SuppliesUsage service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId} />
                    </ViewTabPanel>
                </Paper>
            </Grid>
        </Grid>
    );
}

function SuppliesAgentDetails({ suppliesAgent }) {
    if (suppliesAgent) {
        return (
            <List data-testid="supplies-agentdetails-list" component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={suppliesAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="solutionId" secondary={suppliesAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="name" secondary={suppliesAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={suppliesAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={suppliesAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function SuppliesAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const suppliesService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentSuppliesAgent, setCurrentSuppliesAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadSuppliesAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadSuppliesAgent(props.agentId);
    }

    async function loadSuppliesAgent(agentId) {
        let response;

        console.log("loadSuppliesAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await suppliesService.getSuppliesAgent(agentId);
            console.log("getSuppliesAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentSuppliesAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SuppliesAgent ' + agentId + ' - ' + error.cause.message);
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
        <Card data-testid="supplies-agent-card">
            <CardContent>
                <Typography variant="h5" component="h2">Supplies Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentSuppliesAgent && <SuppliesAgentDetails suppliesAgent={currentSuppliesAgent} />)
                }
                <ApiResponseDialog title="Supplies Agent API Response" open={state.showApiResponse} apiResponse={currentSuppliesAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="supplies-agent-loadrefresh" onClick={handleLoadClicked} isLoading={currentSuppliesAgent === null} location="Supplies Agent" />
                <ApiResponseButton data-testid="supplies-agent-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}


export {
    SuppliesAgent,
    SuppliesAgentDetails,
    SuppliesAgentTabs
};

