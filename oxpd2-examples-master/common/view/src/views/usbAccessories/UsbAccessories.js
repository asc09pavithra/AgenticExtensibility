import React, { useState, useContext, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';
import Loading from '../../common/Loading';
import Grid from '@mui/material/Grid';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { UsbAccessory } from './UsbAccessory';
import { useStyles } from "../../common/commonStyles";
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function UsbAccessories(props) {
    const deviceContext = useContext(DeviceContext);
    const classes = useStyles();
    const usbService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [usbAccessories, setUsbAccessories] = useState([]);
    const [usbAccessoriesResponse, setUsbAccessoriesResponse] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    let actionButtons = (
        <CardActions>
            <LoadRefreshButton onClick={handleLoadClicked} isLoading={isLoading} location="USB Accessories" />
            <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
        </CardActions>
    );

    useEffect(() => {
        loadUsbAccessories();
    }, [props.loadEnabled]);

    async function handleLoadClicked() {
        loadUsbAccessories();
    }

    async function loadUsbAccessories() {
        let response;
        setIsLoading(true);
        try {
            response = await usbService.enumerateUsbAccessories();
            console.log("loadUsbAccessories - " + JSON.stringify(response));
            setUsbAccessoriesResponse(response);

            if (null !== response && 'memberIds' in response && null !== response.memberIds) {
                setUsbAccessories(response.memberIds);

                // Clean the HID Accessories map
                var HIDmap
                if (deviceContext.HIDAccessories != null) {
                    HIDmap = new Map(JSON.parse(JSON.stringify(Array.from(deviceContext.HIDAccessories))));
                } else {
                    HIDmap = new Map()
                    deviceContext.HIDAccessories = new Map();
                }

                for (let accessory in response.memberIds) {
                    const currentUsbId = response.memberIds[accessory];
                    if (HIDmap.get(currentUsbId) != null) {
                        HIDmap.delete(currentUsbId);
                    } else {
                        deviceContext.HIDAccessories.set(currentUsbId, null);
                    }
                }
                // Remove old accessories
                for (let key of HIDmap.keys()) {
                    deviceContext.HIDAccessories.delete(key);
                }

                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to enumerate UsbAccessories  - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    function handleRowClicked(e, accessoryId) {
        props.setSelectedUsbAccessory(accessoryId);
    }
    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    return (
        <Card data-testid="usb-accessories-accessories-card">
            <CardContent>
                <Typography variant="h5" component="h2">USB Accessories</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                            <Table className={classes.table} size='small' stickyHeader aria-label="USB Accessories Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Accessory ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody deselectOnClickaway={false}>
                                    {usbAccessories.map((usbAccessory) => (
                                        <TableRow classes={{ root: classes.row, hover: classes.hover, selected: classes.selected }} key={usbAccessory} hover onClick={(event) => handleRowClicked(event, usbAccessory)} selected={usbAccessory === props.setSelectedUsbAccessory}>
                                            <TableCell component="th" scope="usbAccessory">
                                                {usbAccessory}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <ApiResponseDialog title="USB Accessories API Response" open={state.showApiResponse} apiResponse={usbAccessoriesResponse} handleClose={handleDialogClose} />
            </CardContent>
            <div>
                {actionButtons}
            </div>
        </Card>
    );
}

function UsbAccessoriesTabContent(props) {
    const deviceContext = useContext(DeviceContext);
    const currentDevice = deviceContext.currentDevice;
    const currentAccessToken = deviceContext.currentAccessToken;
    const loadEnabled = (null !== currentDevice && null !== currentAccessToken) ? true : false
    const usbService = props.service;

    const [state] = useState({
        loadEnabled: loadEnabled,
    });

    const [selectedUsbAccessory, setSelectedUsbAccessory] = useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <UsbAccessories service={usbService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} selectedUsbAccessory={selectedUsbAccessory} setSelectedUsbAccessory={setSelectedUsbAccessory} />
            </Grid>
            <Grid item xs={12}>
                <UsbAccessory service={usbService} loadEnabled={state.loadEnabled} postAlert={props.postAlert} accessoryId={selectedUsbAccessory} />
            </Grid>
        </Grid>
    );
}

export {
    UsbAccessoriesTabContent
}
