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
import { BuildLocalizedStringList, PropertyItem } from '../../common/ResponseTypes';
import SDKButton from '../../common/SDKButton';
import { DownloadToDownloadsFolder } from '../../common/Utilities';
import { a11yProps, ViewTabPanel } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';

function SolutionDiagnosticsAgentTabs(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" {...baseTabStyles}>
                            <Tab label="Solution Diagnostics Agent" {...a11yProps(0)} />
                            <Tab label="Log" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <SolutionDiagnosticsAgent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <SolutionDiagnosticsAgentLog service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId} />
                    </ViewTabPanel>
                </Paper>
            </Grid>
        </Grid>
    );
}

function SolutionDiagnosticsAgentDetails({ solutionDiagnosticsAgent }) {
    if (solutionDiagnosticsAgent) {
        return (
            <List data-testid="solution-diagnostics-agentdetails-list" component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={solutionDiagnosticsAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="solutionId" secondary={solutionDiagnosticsAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="name" secondary={solutionDiagnosticsAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={solutionDiagnosticsAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={solutionDiagnosticsAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function SolutionDiagnosticsAgentLog(props) {
    const solutionDiagnosticsService = props.service;
    const [log, setLog] = useState(null);
    const [showLog, setShowLog] = useState(false);

    async function handleRefresh() {
        loadSolutionDiagnsoticsAgentLog(props.agentId);
    }

    useEffect(() => {
        loadSolutionDiagnsoticsAgentLog(props.agentId);
    }, [props.agentId]);

    async function loadSolutionDiagnsoticsAgentLog(agentId) {
        let response;

        if (!agentId || agentId.length === 0) {
            setShowLog(false);
            return;
        } else {
            setShowLog(true);
        }

        try {
            response = await solutionDiagnosticsService.getSolutionDiagnosticsAgentLog(agentId);
            console.log("getSolutionDiagnosticsAgentLog response:" + JSON.stringify(response));

            if (null !== response) {
                setLog(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SolutionDiagnosticsAgentLog ' + agentId + ' - ' + error.cause.message);
        }
    }

    async function handleExportClicked() {
        let response;
        try {
            response = await solutionDiagnosticsService.getSolutionDiagnosticsAgentLog(props.agentId);
            console.log(JSON.stringify(response));
            let fileName = props.agentId + "_Log.tar.gz";
            DownloadToDownloadsFolder(response.item2, fileName);
            props.postAlert('success', 'Export request successful, Downloaded: ' + fileName);
        }
        catch (error) {
            props.postAlert('error', 'Failed to export solution diganostics agent log - ' + error.cause.message);
        }
    }

    return (
        <Card data-testid="solution-diagnostics-agent-log-card">
            <CardContent>
                <Typography variant="h5" component="h2">Solution Diagnostics Agent Log</Typography>
            </CardContent>
            <CardActions>
                <SDKButton
                    data-testid="solution-diagnostics-agent-log-loadrefresh"
                    size="medium"
                    color="primary"
                    disabled={!showLog}
                    onClick={handleRefresh}
                    buttonlabel="Load/Refresh"
                    primaryToolTip="Refresh Solution Diagnsotics Agent Log"
                    secondaryToolTip="Solution Diagnostics Agent Not Selected"
                    secondaryToolTipCondition={showLog}
                />
                <SDKButton
                    data-testid="solution-diagnostics-log-export-button"
                    disabled={log === null}
                    buttonlabel="Export Log"
                    primaryToolTip="Export Log Data"
                    secondaryToolTip="Log Not Available"
                    secondaryToolTipCondition={log !== null}
                    onClick={handleExportClicked}
                />
            </CardActions>
        </Card>
    );
}

function SolutionDiagnosticsAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const solutionDiagnosticsService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentSolutionDiagnosticsAgent, setCurrentSolutionDiagnosticsAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadSolutionDiagnosticsAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadSolutionDiagnosticsAgent(props.agentId);
    }

    async function loadSolutionDiagnosticsAgent(agentId) {
        let response;

        console.log("loadSolutionDiagnosticsAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await solutionDiagnosticsService.getSolutionDiagnosticsAgent(agentId);
            console.log("getSolutionDiagnosticsAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentSolutionDiagnosticsAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SolutionDiagnosticsAgent ' + agentId + ' - ' + error.cause.message);
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
        <Card data-testid="solution-diagnostics-agent-card">
            <CardContent>
                <Typography variant="h5" component="h2">Solution Diagnostics Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentSolutionDiagnosticsAgent && <SolutionDiagnosticsAgentDetails solutionDiagnosticsAgent={currentSolutionDiagnosticsAgent} />)
                }
                <ApiResponseDialog title="Solution Diagnostics Agent API Response" open={state.showApiResponse} apiResponse={currentSolutionDiagnosticsAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <SDKButton
                    data-testid="solution-diagnostics-agent-loadrefresh"
                    size="medium"
                    color="primary"
                    disabled={currentSolutionDiagnosticsAgent === null}
                    onClick={handleLoadClicked}
                    buttonlabel="Load/Refresh"
                    primaryToolTip="Refresh Solution Diagnsotics Agent"
                    secondaryToolTip="Solution Diagnostics Agent Not Selected"
                    secondaryToolTipCondition={currentSolutionDiagnosticsAgent !== null}
                />
                <ApiResponseButton data-testid="solution-diagnostics-agent-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}


export {
    SolutionDiagnosticsAgent,
    SolutionDiagnosticsAgentDetails,
    SolutionDiagnosticsAgentTabs,
    SolutionDiagnosticsAgentLog
};
