import React, { Fragment, useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import { AppBar, Card, CardContent, CardActions, Collapse, Divider, List, ListItem, ListItemText, Tab, Tabs, Typography } from '@mui/material';
import { PropertyItemWithDivider, PropertyItem } from '../../common/ResponseTypes';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';
import { HID } from './HID';
import { ViewTabPanel, a11yProps } from '../../common/ViewTabPanel';
import { baseTabStyles } from '../../common/commonStyles';
import ApiResponseButton from '../../common/ApiResponseButton';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function UsbAccessoryDetails({ usbAccessory, accessoryId }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    if (usbAccessory) {
        return (
            <Card>
                <CardContent>
                    <List data-testid="usb-accessories-accessorydetails-list" style={{ paddingLeft: "40px" }}>
                        <PropertyItemWithDivider primary="accessoryId" secondary={accessoryId || ""} />
                        <PropertyItemWithDivider primary="activeConfiguration" secondary={usbAccessory.activeConfiguration+"" || ""} />
                        <PropertyItemWithDivider primary="deviceClass" secondary={usbAccessory.deviceClass+"" || ""} />
                        <PropertyItemWithDivider primary="deviceProtocol" secondary={usbAccessory.deviceProtocol+"" || ""} />
                        <PropertyItemWithDivider primary="deviceSubclass" secondary={usbAccessory.deviceSubclass+"" || ""} />
                        <PropertyItemWithDivider primary="deviceVersion" secondary={usbAccessory.deviceVersion+"" || ""} />

                        <Fragment>
                            <List style={{ paddingLeft: "40px" }} component="div"  >
                                <ListItem button onClick={handleClick} style={{ paddingLeft: "0px", paddingTop: "8px", paddingBottom: "8px" }}>
                                    <ListItemText disableTypography
                                        primary={
                                            <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                                languagesSupported
                                            </Typography>
                                        }
                                    />
                                    {open ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                {
                                    usbAccessory.languagesSupported && usbAccessory.languagesSupported.length > 0 &&
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" style={{ marginTop: "-20px", marginBottom: "-20px" }}>
                                            {usbAccessory.languagesSupported.map(
                                                language => (
                                                    <PropertyItem secondary={language+"" || ""} />
                                                )
                                            )}
                                        </List>
                                    </Collapse>
                                }
                            </List>
                        </Fragment>
                        <Divider style={{ marginLeft: "40px" }} />

                        <PropertyItemWithDivider primary="manufacturerName" secondary={usbAccessory.manufacturerName || ""} />
                        <PropertyItemWithDivider primary="productId" secondary={usbAccessory.productId+"" || ""} />
                        <PropertyItemWithDivider primary="productName" secondary={usbAccessory.productName || ""} />
                        <PropertyItemWithDivider primary="registration" secondary={usbAccessory.registration || ""} />
                        <PropertyItemWithDivider primary="resourceId" secondary={usbAccessory.resourceId || ""} />
                        <PropertyItemWithDivider primary="serialNumber" secondary={usbAccessory.serialNumber || ""} />
                        <PropertyItemWithDivider primary="usbVersion" secondary={usbAccessory.usbVersion+"" || ""} />
                        <PropertyItemWithDivider primary="vendorId" secondary={usbAccessory.vendorId+"" || ""} />
                    </List>
                </CardContent>
            </Card>
        );
    }
}

function UsbAccessory(props) {
    const usbService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentUsbAccessory, setCurrentUsbAccessory] = useState(null);
    const deviceContext = useContext(DeviceContext);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadUsbAccessory(props.accessoryId);
    }, [props.accessoryId]);

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    }

    async function handleLoadClicked() {
        loadUsbAccessory(props.accessoryId);
    }

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    }

    async function loadUsbAccessory(accessoryId) {
        let response;

        console.log("loadUsbAccessory.accessoryId: " + accessoryId);

        if (!accessoryId || accessoryId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await usbService.getUsbAccessory(accessoryId);
            console.log("getUsbAccessory response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentUsbAccessory(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve UsbAccessory ' + accessoryId + ' - ' + error.cause.message);
        }
        setIsLoading(false);
    }

    return (
        <Card data-testid="usb-accessories-accessory-card">
            <CardContent>
                <Typography variant="h5" component="h2">USB Accessory</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentUsbAccessory && <UsbAccessoryCardContent service={usbService} postAlert={props.postAlert} usbAccessory={currentUsbAccessory} accessoryId={props.accessoryId} />)
                }
                <ApiResponseDialog title="USB Accessory API Response" open={state.showApiResponse} apiResponse={currentUsbAccessory} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="security-agent-loadrefresh" onClick={handleLoadClicked} isLoading={isLoading || !currentUsbAccessory} location="USB Accessory" />
                <ApiResponseButton onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

function UsbAccessoryCardContent(props) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{ marginTop: 10 }}>
            <AppBar position="static" color="inherit">
                <Tabs value={value} onChange={handleChange} aria-label="USB Tabs" {...baseTabStyles}>
                    <Tab label="Accessory Details" {...a11yProps(0)} />
                    <Tab label="HID" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <ViewTabPanel value={value} index={0}>
                <UsbAccessoryDetails usbAccessory={props.usbAccessory} accessoryId={props.accessoryId} service={props.service} postAlert={props.postAlert} />
            </ViewTabPanel>
            <ViewTabPanel value={value} index={1}>
                <HID usbAccessory={props.usbAccessory} service={props.service} postAlert={props.postAlert} />
            </ViewTabPanel>
        </div>
    );
}

export {
    UsbAccessory,
    UsbAccessoryDetails
}
