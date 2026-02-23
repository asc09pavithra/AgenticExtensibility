import React, { Fragment, useState, useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Loading from '../../common/Loading';
import { Card, CardActions, CardContent, Collapse, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { BuildLocalizedStringList, PropertyItemWithDivider, PropertyHeader } from '../../common/ResponseTypes';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function UsbAgentDetails({ usbAgent }) {
    const [state, setState] = useState({
        items: []
    });

    async function handleClick(index, event) {
        state.items[index] = !state.items[index];
        setState({ items: state.items });
    }

    if (usbAgent) {

        return (
            <List data-testid="usb-accessories-agentdetails-list" style={{ paddingLeft: "40px" }}>
                <PropertyItemWithDivider primary="agentId" secondary={usbAgent.agentId || ""} />
                <PropertyHeader name="Registrations by Product Id"></PropertyHeader>

                <List data-testid="usb-accessories-agentregistrations-list" style={{ paddingLeft: "40px" }}>
                    {
                        usbAgent.registrations.map((registration, index) => {
                            return (
                                <Fragment>
                                    <ListItem button onClick={(event) => handleClick(index, event)} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                                        <ListItemText disableTypography
                                            primary={<Typography type="body1" style={{ color: grey[600], fontSize: "14px", marginBottom: "-20px" }}>{registration.productId}</Typography>} />
                                        {state.items[index] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={state.items[index]} timeout="auto" >
                                        <List style={{ paddingLeft: "40px" }}>
                                            <PropertyItemWithDivider primary="registrationKind" secondary={registration.registrationKind} />
                                            <PropertyItemWithDivider primary="serialNumber" secondary={registration.serialNumber} />
                                            <PropertyItemWithDivider primary="vendorId" secondary={registration.vendorId} />
                                        </List>
                                    </Collapse>
                                    <Divider style={{ marginLeft: "40px" }} />
                                </Fragment>
                            )
                        })
                    }
                </List>

                <PropertyItemWithDivider primary="solutionId" secondary={usbAgent.solutionId || ""} />

                <PropertyItemWithDivider primary="name" secondary={usbAgent.name || ""} />

                <BuildLocalizedStringList name="localizedName" localizedString={usbAgent.localizedName} />
                <Divider style={{ marginLeft: "40px" }} />

                <BuildLocalizedStringList name="localizedDescription" localizedString={usbAgent.localizedDescription} />
            </List>
        );
    }
}

function UsbAgent(props) {
    const deviceContext = useContext(DeviceContext);
    const usbService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentUsbAgent, setCurrentUsbAgent] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadUsbAgent(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadUsbAgent(props.agentId);
    }

    async function loadUsbAgent(agentId) {
        let response;

        console.log("loadUsbAgent.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await usbService.getUsbAgent(agentId);
            console.log("getUsbAgent response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentUsbAgent(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve UsbAgent ' + agentId + ' - ' + error.cause.message);
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
        <Card data-testid="usb-accessories-agent-card">
            <CardContent>
                <Typography variant="h5" component="h2">USB Agent</Typography>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (currentUsbAgent && <UsbAgentDetails usbAgent={currentUsbAgent} />)
                }
                <ApiResponseDialog title="USB Agent API Response" open={state.showApiResponse} apiResponse={currentUsbAgent} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="usb-accessories-agent-loadrefresh" onClick={handleLoadClicked} isLoading={currentUsbAgent === null} location="USB Agent" />
                <ApiResponseButton data-testid="usb-accessories-agent-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
            </CardActions>
        </Card>
    );
}

export {
    UsbAgent,
    UsbAgentDetails
}