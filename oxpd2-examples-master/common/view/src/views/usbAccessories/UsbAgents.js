import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';
import { indigo, grey } from '@mui/material/colors';
import Loading from '../../common/Loading';
import Grid from '@mui/material/Grid';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { UsbAgent } from './UsbAgent';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
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

function UsbAgents(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const usbService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [usbAgents, setUsbAgents] = useState([]);
    const [usbAgentsResponse, setUsbAgentsResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="USB Agents" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadUsbAgents();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadUsbAgents();
    }

    async function loadUsbAgents() {
        let response;
        setIsLoading(true);
        try {
            response = await usbService.enumerateUsbAgents();
            console.log("loadUsbAgents - " + JSON.stringify(response));
            setUsbAgentsResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setUsbAgents(response.memberIds);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate UsbAccessoriesAgents - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, agentId) {
        props.setSelectedUsbAgent(agentId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid="usb-accessories-agents-card">
            <CardContent>
                <Typography variant="h5" component="h2">USB Accessories Agents</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="USB Accessories Agents Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agent ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {usbAgents.map((usbAgent) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={usbAgent} hover onClick={(event) => handleRowClicked(event, usbAgent)} selected={usbAgent === props.selectedUsbAgent}>
                                            <TableCell component="th" scope="usbAgent">
                                                {usbAgent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="USB Accessories Agents API Response" open={state.showApiResponse} apiResponse={usbAgentsResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function UsbAgentsTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const usbService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedUsbAgent, setSelectedUsbAgent] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <UsbAgents service={usbService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedUsbAgent={selectedUsbAgent} setSelectedUsbAgent={setSelectedUsbAgent} />
            </Grid>
            <Grid item xs={12}>
                <UsbAgent service={usbService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} agentId={selectedUsbAgent} />
            </Grid>
        </Grid>
    );
}

export {
    UsbAgentsTabContent
}