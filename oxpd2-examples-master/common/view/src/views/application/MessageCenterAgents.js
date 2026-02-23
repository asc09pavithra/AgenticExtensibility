import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { useStyles } from '../../common/commonStyles';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import { MessageCenterAgent } from './MessageCenterAgent';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function MessageCenterAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [messageCenterAgents, setMessageCenterAgents] = useState([]);
    const [messageCenterAgentsResponse, setMessageCenterAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Message Center Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadMessageCenterAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadMessageCenterAgents();
    }

    async function loadMessageCenterAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await applicationService.enumerateMessageCenterAgents();
            console.log("loadMessageCenterAgents - " + JSON.stringify(response));
            setMessageCenterAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setMessageCenterAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to list MessageCenterAgents - ' + error.cause.message);
        }

        setIsLoading(false);
    }

    function handleRowClicked(e, messageCenterAgentId) {
        props.setSelectedMessageCenterAgent(messageCenterAgentId);
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Message Center Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Message Center Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {messageCenterAgents.map((messageCenterAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={messageCenterAgent} hover onClick={(event) => handleRowClicked(event, messageCenterAgent)} selected={messageCenterAgent === props.selectedMessageCenterAgent}>
                                            <TableCell component="th" scope="messageCenterAgent">
                                                {messageCenterAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                < ApiResponseDialog title="Message Center Agents API Response" open={state.showApiResponse} apiResponse={messageCenterAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function MessageCenterTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const applicationService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedMessageCenterAgent, setSelectedMessageCenterAgent] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MessageCenterAgents service={applicationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedMessageCenterAgent={selectedMessageCenterAgent} setSelectedMessageCenterAgent={setSelectedMessageCenterAgent} />
            </Grid>
            <Grid item xs={12}>
                <MessageCenterAgent service={applicationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} messageCenterAgentId={selectedMessageCenterAgent} />
            </Grid>
        </Grid>
    );
}

export {
    MessageCenterTabContent
};

