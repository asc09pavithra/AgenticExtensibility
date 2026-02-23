import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { Card, CardContent, CardActions } from '@mui/material';
import { PropertyItem } from '../../common/ResponseTypes';
import { makeStyles } from '@mui/styles';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

export const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    json: {
        borderRadius: '5px',
        border: '1px solid #0a0a0f',
        background: '#f0f0f5',
        padding: '5px',
        fontFamily: 'Monospace',
        fontSize: '10pt',
        overflowY: 'auto',
        overflowX: 'auto'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    status: {
        minHeight: '300px',
        maxHeight: '300px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    }
}), { defaultTheme: theme });

function StatusDetails({ status }) {
    if (status) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="status" secondary={status.status || ""} />
                </List>
            </List>
        );
    }
}

function Status(props) {
    const deviceContext = useContext(DeviceContext);
    const deviceService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadStatus(props.status);
    }, [props.status]);

    async function handleLoadClicked() {
        loadStatus(props.status);
    }

    async function loadStatus(status) {
        let response;

        console.log("loadStatus");

        setIsLoading(true);
        try {
            response = await deviceService.getStatus();
            console.log("getStatus response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentStatus(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Status - ' + error.cause.message);
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
                <Typography variant="h5" component="h2">
                    {props.name ? props.name : "Status"}
                </Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentStatus && <StatusDetails status={currentStatus} />)
                }
                <ApiResponseDialog title="Status API Response" open={state.showApiResponse} apiResponse={currentStatus} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Status" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    Status
}
