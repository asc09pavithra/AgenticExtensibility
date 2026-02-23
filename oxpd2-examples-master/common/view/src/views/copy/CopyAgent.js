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
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { BuildLocalizedStringList, PropertyItem } from '../../common/ResponseTypes';
import { a11yProps, ViewTabPanel } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import { CopyJobsTabContent } from './CopyJobs';
import { StoredJobsTabContent } from './StoredJobs';

function CopyAgentTabs(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="copy job agents" {...baseTabStyles}>
                            <Tab label="Copy Agent" {...a11yProps(0)} />
                            <Tab label="Copy Jobs" {...a11yProps(1)} />
                            <Tab label="Stored Jobs" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <CopyAgent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <CopyJobsTabContent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />  
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={2}>
                        <StoredJobsTabContent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />
                    </ViewTabPanel>
                </Paper>
            </Grid>
        </Grid>
    );
}

function CopyAgentDetails({ copyAgent }) {
    if (copyAgent) {
        return (
            <List data-testid="copy-job-agentdetails-list" component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={copyAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="solutionId" secondary={copyAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="name" secondary={copyAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={copyAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={copyAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function CopyAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const copyJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentCopyAgent, setCurrentCopyAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadCopyAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadCopyAgent(props.agentId);
    }

    async function loadCopyAgent(agentId) {
        let response;

        console.log("loadCopyAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await copyJobService.getCopyAgent(agentId);
            console.log("getCopyAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentCopyAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve CopyAgent ' + agentId + ' - ' + error.cause.message);
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
        <Card data-testid="copy-job-agent-card">
            <CardContent>
                <Typography variant="h5" component="h2">Copy Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentCopyAgent && <CopyAgentDetails copyAgent={currentCopyAgent} />)
                }
                <ApiResponseDialog title="Copy Agent API Response" open={state.showApiResponse} apiResponse={currentCopyAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="copy-job-agent-loadrefresh" onClick={handleLoadClicked} isLoading={currentCopyAgent === null} location="Copy Agent" />
                <ApiResponseButton data-testid="copy-job-agent-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}


export {
    CopyAgent,
    CopyAgentDetails,
    CopyAgentTabs
};

