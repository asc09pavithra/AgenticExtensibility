import React, { useState, useContext, useEffect } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { ApplicationAgent } from './ApplicationAgent';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { DeviceContext } from '../../common/DeviceContext';
import Grid from '@mui/material/Grid';
import Loading from '../../common/Loading';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useStyles } from '../../common/commonStyles';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function ApplicationAgents(props) {
    const classes = useStyles();
    const deviceContext = useContext(DeviceContext);
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [applicationAgents, setApplicationAgents] = useState([]);
    const [applicationAgentsResponse, setApplicationAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Application Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadApplicationAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadApplicationAgents();
    }

    async function loadApplicationAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await applicationService.enumerateApplicationAgents();
            console.log("loadApplicationAgents - " + JSON.stringify(response));
            setApplicationAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setApplicationAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to list ApplicationAgents - ' + error.cause.message);
        }

        setIsLoading(false);
    }

    function handleRowClicked(e, applicationId) {
        props.setSelectedApplicationAgent(applicationId);
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
                <Typography variant="h5" component="h2">Application Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Application Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {applicationAgents.map((applicationAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={applicationAgent} hover onClick={(event) => handleRowClicked(event, applicationAgent)} selected={applicationAgent === props.selectedApplicationAgent}>
                                            <TableCell component="th" scope="applicationAgent">
                                                {applicationAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                < ApiResponseDialog title="Application Agents API Response" open={state.showApiResponse} apiResponse={applicationAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function ApplicationTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const applicationService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedApplicationAgent, setSelectedApplicationAgent] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ApplicationAgents service={applicationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedApplicationAgent={selectedApplicationAgent} setSelectedApplicationAgent={setSelectedApplicationAgent} />
            </Grid>
            <Grid item xs={12}>
                <ApplicationAgent service={applicationService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} applicationId={selectedApplicationAgent} />
            </Grid>
        </Grid>
    );
}

export {
    ApplicationTabContent
}
