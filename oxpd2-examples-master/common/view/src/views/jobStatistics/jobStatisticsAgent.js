import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Divider from '@mui/material/Divider';
import Loading from '../../common/Loading';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { AppBar, Card, CardActions, CardContent, Grid, Paper, Tab, Tabs } from '@mui/material';
import { BuildLocalizedStringList, PropertyItem } from '../../common/ResponseTypes';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import { JobsTabContent } from './Jobs';

function JobStatisticsAgentTabs(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <AppBar position="static" color="inherit">
                        <Tabs value={value} onChange={handleChange} aria-label="job statistics agents" {...baseTabStyles}>
                            <Tab label="Job Statistics Agent" {...a11yProps(0)} />
                            <Tab label="Jobs" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <ViewTabPanel value={value} index={0}>
                        <JobStatisticsAgent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />
                    </ViewTabPanel>
                    <ViewTabPanel value={value} index={1}>
                        <JobsTabContent service={props.service} loadEnabled={props.loadEnabled} postAlert={props.postAlert} agentId={props.agentId}  />  
                    </ViewTabPanel>
                </Paper>
            </Grid>
        </Grid>
    );
}

function JobStatisticsAgentDetails({ jobStatisticsAgent }) {
    if (jobStatisticsAgent) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="agentId" secondary={jobStatisticsAgent.agentId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="solutionId" secondary={jobStatisticsAgent.solutionId || ""} />
                    <Divider style={{ marginLeft: "40px" }} />

                    <PropertyItem primary="name" secondary={jobStatisticsAgent.name || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedName" localizedString={jobStatisticsAgent.localizedName} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <BuildLocalizedStringList name="localizedDescription" localizedString={jobStatisticsAgent.localizedDescription} />
                </List>
            </List>
        );
    }
}

function JobStatisticsAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const jobStatisticsService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentJobStatisticsAgent, setCurrentJobStatisticsAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadJobStatisticsAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadJobStatisticsAgent(props.agentId);
    }

    async function loadJobStatisticsAgent(agentId) {
        let response;

        console.log("loadJobStatisticsAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await jobStatisticsService.getJobStatisticsAgent(agentId);
            console.log("getJobStatisticsAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentJobStatisticsAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve JobStatisticsAgent ' + agentId + ' - ' + error.cause.message);
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
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Job Statistics Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentJobStatisticsAgent && <JobStatisticsAgentDetails jobStatisticsAgent={currentJobStatisticsAgent} />)
                }
                <ApiResponseDialog title="Job Statistics Agent API Response" open={state.showApiResponse} apiResponse={currentJobStatisticsAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading || !currentJobStatisticsAgent} location="Job Statistics Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}


export {
    JobStatisticsAgent,
    JobStatisticsAgentTabs
}
