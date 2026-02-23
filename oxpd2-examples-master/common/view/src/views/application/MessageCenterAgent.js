import { Tab, Tabs } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles, baseTabStyles } from '../../common/commonStyles';
import Loading from '../../common/Loading';
import { BuildLocalizedStringList, PropertyItem } from '../../common/ResponseTypes';
import { a11yProps, ViewTabPanel } from '../../common/ViewTabPanel';
import { MessagesTabContent } from './Messages';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';


function BuildGeneralMessageCenterAgentDisplay({ messageCenterAgent }) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.root}>
            <List component="div" disablePadding>
                <PropertyItem primary="agentId" secondary={messageCenterAgent.agentId || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="solutionId" secondary={messageCenterAgent.solutionId || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <PropertyItem primary="name" secondary={messageCenterAgent.name || ""} />
                <Divider style={{ marginLeft: "40px" }} />
                <BuildLocalizedStringList name="localizedName" localizedString={messageCenterAgent.localizedName} />
                <Divider style={{ marginLeft: "40px" }} />
                <BuildLocalizedStringList name="localizedDescription" localizedString={messageCenterAgent.localizedDescription} />
            </List>
        </List>
    );
}

function MessageCenterDetails(props) {
    const classes = useStyles();
    const messageCenterAgent = props.messageCenterAgent || {};
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid style={{ marginTop: 10 }} container><Grid item xs={12}><Paper elevation={3}>
            <AppBar position="static" color="inherit" className={classes.appBar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="MessageCenter Agent Tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    {...baseTabStyles}
                >
                    <Tab style={{ fontStyle: "italic" }} label="General Info" {...a11yProps(0)} />
                    <Tab style={{ fontStyle: "italic" }} label="Messages" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <ViewTabPanel value={value} index={0}>
                <BuildGeneralMessageCenterAgentDisplay messageCenterAgent={messageCenterAgent || {}} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={1}>
                <MessagesTabContent service={props.service} postAlert={props.postAlert} agentId={messageCenterAgent.agentId} />
            </ViewTabPanel>
        </Paper></Grid></Grid>
    );
}

function MessageCenterAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentMessageCenterAgent, setCurrentMessageCenterAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadMessageCenterAgent(props.messageCenterAgentId);
    }, [props.messageCenterAgentId]);

    async function handleLoadClicked() {
        loadMessageCenterAgent(props.messageCenterAgentId);
    }

    async function loadMessageCenterAgent(messageCenterAgentId) {
        if (messageCenterAgentId && messageCenterAgentId.length !== 0) {
            console.log("loadMessageCenterAgent.messageCenterAgentId: " + messageCenterAgentId);
            setIsLoading(true);
            try {
                let response = await applicationService.getMessageCenterAgent(messageCenterAgentId);
                console.log("getMessageCenterAgent response:" + JSON.stringify(response));

                if (null !== response) {
                    setCurrentMessageCenterAgent(response);
                    setState({ ...state, showButtons: true });
                }
            }
            catch (error) {
                props.postAlert('error', 'Unable to retrieve Message Center Agent with id ' + messageCenterAgentId + ' - ' + error.cause.message);
            }
            setIsLoading(false);
        }
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
                <Typography variant="h5" component="h2">Message Center Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentMessageCenterAgent && <MessageCenterDetails service={applicationService} messageCenterAgent={currentMessageCenterAgent} postAlert={props.postAlert} />)
                }
                <ApiResponseDialog title="Message Center Agent API Response" open={state.showApiResponse} apiResponse={currentMessageCenterAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={!state.showButtons} location="Message Center Agent" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    MessageCenterAgent
};

