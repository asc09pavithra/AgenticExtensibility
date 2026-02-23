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
import { ScanJobsTabContent } from './ScanJobs';

function ScanJobAgentTabs(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="scan job agents" {...baseTabStyles}>
                            <Tab label="Scan Job Agent" {...a11yProps(0)} />
                            <Tab label="Scan Jobs" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <ScanJobAgent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <ScanJobsTabContent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />  
                    </ViewTabPanel>
                </Paper>
            </Grid>
        </Grid>
    );
}

function ScanJobAgentDetails({ scanJobAgent }) {
    if (scanJobAgent) {
        return (
            <List data-testid="scan-job-agentdetails-list" component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={scanJobAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="solutionId" secondary={scanJobAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="name" secondary={scanJobAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={scanJobAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={scanJobAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function ScanJobAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const scanJobService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentScanJobAgent, setCurrentScanJobAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadScanJobAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadScanJobAgent(props.agentId);
    }

    async function loadScanJobAgent(agentId) {
        let response;

        console.log("loadScanJobAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await scanJobService.getScanJobAgent(agentId);
            console.log("getScanJobAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentScanJobAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve ScanJobAgent ' + agentId + ' - ' + error.cause.message);
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
        <Card data-testid="scan-job-agent-card">
            <CardContent>
                <Typography variant="h5" component="h2">Scan Job Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentScanJobAgent && <ScanJobAgentDetails scanJobAgent={currentScanJobAgent} />)
                }
                <ApiResponseDialog title="Scan Job Agent API Response" open={state.showApiResponse} apiResponse={currentScanJobAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="scan-job-agent-loadrefresh" onClick={handleLoadClicked} isLoading={currentScanJobAgent === null} location="Scan Job Agent" />
                <ApiResponseButton data-testid="scan-job-agent-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}


export {
    ScanJobAgent,
    ScanJobAgentDetails,
    ScanJobAgentTabs
};

