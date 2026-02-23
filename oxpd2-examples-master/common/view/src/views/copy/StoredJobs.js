import { Card, CardActions, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { useStyles } from '../../common/commonStyles';
import StoredJob from './StoredJob';


function StoredJobs(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [storedJobs, setStoredJobs] = useState([]);
    const [apiResponse, setApiResponse] = useState(null)
    const copyJobService = props.service;
    const agentId = props.agentId;
    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadStoredJobs();
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadStoredJobs();
    }

    async function loadStoredJobs() {
        let response;

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await copyJobService.enumerateStoredJobs(agentId)
            console.log(JSON.stringify(response));

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setStoredJobs(response.memberIds);
                setApiResponse(response);
                setState({ ...state, showButtons: true });
            }
            else {
                setStoredJobs([]);
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate Stored Jobs - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, storedJobId) {
        console.log("handleRowClicked: " + storedJobId);
        props.setSelectedStoredJob(storedJobId);
    }

    async function handleApiDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">Stored Jobs</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="StoredJobs Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Stored Job ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {storedJobs.map((storedJob) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={storedJob} hover selected={storedJob === props.selectStoredJob}>
                                            <TableCell className={classes.tableIdCell} component="th" scope="solution" onClick={(event) => handleRowClicked(event, storedJob)} >
                                                {storedJob}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Stored Jobs API Response" open={state.showApiResponse} apiResponse={apiResponse} handleClose={handleApiDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={storedJobs === null} location="Stored Jobs" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

function StoredJobsTabContent(props) {
    const agentId = props.agentId;
    const [selectStoredJob, setSelectedStoredJob] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <StoredJobs agentId={agentId} service={props.service} loadEnabled={true} postAlert={props.postAlert} selectStoredJob={selectStoredJob} setSelectedStoredJob={setSelectedStoredJob} />
            </Grid>
            <Grid item xs={12}>
                <StoredJob service={props.service} loadEnabled={true} postAlert={props.postAlert} agentID={agentId} storedJobID={selectStoredJob} />
            </Grid>
        </Grid>
    )
}

export {
    StoredJobsTabContent
};
