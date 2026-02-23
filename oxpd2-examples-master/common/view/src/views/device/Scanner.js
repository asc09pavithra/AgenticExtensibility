import React, { useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Divider from '@mui/material/Divider';
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
    scanner: {
        minHeight: '300px',
        maxHeight: '300px'
    },
    fit: {
        whiteSpace: 'pre-wrap'
    }
}), { defaultTheme: theme });

function ScannerDetails({ scanner }) {
    if (scanner) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="adfOutputBinIsFull" secondary={(scanner.adfOutputBinIsFull).toString() || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="hasPaperInAdf" secondary={(scanner.hasPaperInAdf).toString() || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="hasPaperOnFlatbed" secondary={(scanner.hasPaperOnFlatbed).toString() || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="isBusy" secondary={(scanner.isBusy).toString() || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="isOnline" secondary={(scanner.isOnline).toString() || ""} />
                </List>
            </List>
        );
    }
}

function Scanner(props) {
    const deviceContext = useContext(DeviceContext);
    const deviceService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentScanner, setCurrentScanner] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadScanner(props.scanner);
    }, [props.scanner]);

    async function handleLoadClicked() {
        loadScanner(props.scanner);
    }

    async function loadScanner(scanner) {
        let response;

        console.log("loadScanner");

        setIsLoading(true);
        try {
            response = await deviceService.getScanner();
            console.log("getScanner response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentScanner(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve Scanner - ' + error.cause.message);
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
                    {props.name ? props.name : "Scanner"}
                </Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentScanner && <ScannerDetails scanner={currentScanner} />)
                }
                <ApiResponseDialog title="Scanner API Response" open={state.showApiResponse} apiResponse={currentScanner} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="Scanner" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    Scanner
}
