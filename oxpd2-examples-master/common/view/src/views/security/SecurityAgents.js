import { Card, CardActions, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { grey, indigo } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import Loading from '../../common/Loading';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { SecurityAgent } from './SecurityAgent';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    viewTitle: {
    },
    loading: {
        marginTop: 10,
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        }
    },
    table: {
        minWidth: 450,
    },
    row: {
        cursor: "pointer",
    },
    selected: {
        backgroundColor: indigo[50] + '!important',
        color: "#fff !important",
        "&:hover": {
            backgroundColor: "transparent !important",
        },
    },
    hoverx: {
        "&:hover": {
            backgroundColor: grey[50] + "!important",
            color: " #fff !important",
        },
    },
    column: {
        color: "inherit !important",
    },
}), { defaultTheme: theme });


function SecurityAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const securityService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [securityAgents, setSecurityAgents] = useState([]);
    const [securityAgentsResponse, setSecurityAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Security Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadSecurityAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadSecurityAgents();
    }

    async function loadSecurityAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await securityService.enumerateSecurityAgents();
            console.log("loadSecurityAgents - " + JSON.stringify(response));
            setSecurityAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setSecurityAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate SecurityAgents  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedSecurityAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid="security-agents-card">
            <CardContent>
                <Typography variant="h5" component="h2">Security Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="Security Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {securityAgents.map((securityAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={securityAgent} hover onClick={(event) => handleRowClicked(event, securityAgent)} selected={securityAgent === props.selectedSecurityAgent}>
                                            <TableCell component="th" scope="securityAgent">
                                                {securityAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="Security Agents API Response" open={state.showApiResponse} apiResponse={securityAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function SecurityAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const securityService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedSecurityAgent, setSelectedSecurityAgent] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <SecurityAgents service={securityService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedSecurityAgent={selectedSecurityAgent} setSelectedSecurityAgent={setSelectedSecurityAgent} />
            </Grid>
            <Grid item xs={12}>
                <SecurityAgent service={securityService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} agentId={selectedSecurityAgent} />
            </Grid>
        </Grid>
    );
}

export {
    SecurityAgentsTabContent
};

