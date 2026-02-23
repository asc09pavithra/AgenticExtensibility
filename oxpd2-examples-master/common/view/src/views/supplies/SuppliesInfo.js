import { Card, CardActions, CardContent, Collapse, Divider, Grid, ListItem, ListItemText, Paper } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { NestedObject } from '../../common/NestedObject';
import { PropertyItem } from '../../common/ResponseTypes';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function SupplyItem(props) {
    if (props.primary === undefined || props.primary === null || props.secondary === undefined || props.secondary === null) {
        return (
            <></>
        );
    } else {
        return (
            <>
                <PropertyItem primary={props.primary} secondary={props.secondary+""} />
                {props.includeDivider ? <Divider style={{ marginLeft: "40px" }} /> : <></>}
            </>
        )
    }
}

function SupplyInfoDetails({ selectedSlot }) {
    const [open, setOpen] = useState(true);
    const handleClick = () => {
        setOpen(!open);
    };

    if (selectedSlot) {
        return (
            <List component="nav" >
                <List component="div" disablePadding>
                    <SupplyItem primary="slotId" secondary={selectedSlot.slotId} includeDivider={true} />
                    <SupplyItem primary="approximatePagesRemaining" secondary={selectedSlot.approximatePagesRemaining} includeDivider={true} />
                    <SupplyItem primary="approximatePagesRemainingSymbol" secondary={selectedSlot.approximatePagesRemainingSymbol} includeDivider={true} />
                    <SupplyItem primary="batchId" secondary={selectedSlot.batchId} includeDivider={true} />
                    <SupplyItem primary="brand" secondary={selectedSlot.brand} includeDivider={true} />

                    {selectedSlot.capacity ?
                        <List disablePadding>
                            <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                                <ListItemText disableTypography
                                    primary={
                                        <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                            {"capacity"}
                                        </Typography>}
                                /> {open ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>

                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                    <SupplyItem primary="count" secondary={selectedSlot.capacity.count} includeDivider={true} />
                                    <SupplyItem primary="unit" secondary={selectedSlot.capacity.unit} includeDivider={false} />
                                </List>
                            </Collapse>
                        </List>
                    : <></>}

                    <SupplyItem primary="cartridgeApplication" secondary={selectedSlot.cartridgeApplication} includeDivider={false} />
                    
                    {selectedSlot.colors ?
                        <>
                            <NestedObject resource={selectedSlot.colors} name="colors" expanded={true}/>
                            <Divider style={{ marginLeft: "40px" }} />
                        </>
                    :selectedSlot.cartridgeApplication ? <Divider style={{ marginLeft: "40px" }} /> : <></>}

                    <SupplyItem primary="firstInstallDate" secondary={selectedSlot.firstInstallDate} includeDivider={true} />
                    <SupplyItem primary="group" secondary={selectedSlot.group} includeDivider={true} />
                    <SupplyItem primary="healthGaugeLevel" secondary={selectedSlot.healthGaugeLevel} includeDivider={true} />
                    <SupplyItem primary="installDate" secondary={selectedSlot.installDate} includeDivider={true} />
                    <SupplyItem primary="lastErrorCode" secondary={selectedSlot.lastErrorCode} includeDivider={true} />
                    <SupplyItem primary="lastErrorTimestamp" secondary={selectedSlot.lastErrorTimestamp} includeDivider={true} />
                    <SupplyItem primary="lastRecoveryDate" secondary={selectedSlot.lastRecoveryDate} includeDivider={true} />
                    <SupplyItem primary="lastUsedDate" secondary={selectedSlot.lastUsedDate} includeDivider={true} />
                    <SupplyItem primary="levelState" secondary={selectedSlot.levelState} includeDivider={true} />
                    <SupplyItem primary="manufactureDate" secondary={selectedSlot.manufactureDate} includeDivider={true} />
                    <SupplyItem primary="percentLifeRemaining" secondary={selectedSlot.percentLifeRemaining} includeDivider={true} />
                    <SupplyItem primary="percentLifeRemainingSymbol" secondary={selectedSlot.percentLifeRemainingSymbol} includeDivider={true} />
                    <SupplyItem primary="productNumber" secondary={selectedSlot.productNumber} includeDivider={true} />
                    <SupplyItem primary="serialNumber" secondary={selectedSlot.serialNumber} includeDivider={true} />
                    <SupplyItem primary="slotRole" secondary={selectedSlot.slotRole} includeDivider={false} />

                    {selectedSlot.slotsInGroup ?
                        <>
                            <NestedObject resource={selectedSlot.slotsInGroup} name="slotsInGroup" expanded={true}/>
                            <Divider style={{ marginLeft: "40px" }} />
                        </>
                    :selectedSlot.slotRole ? <Divider style={{ marginLeft: "40px" }} /> : <></>}

                    <SupplyItem primary="state" secondary={selectedSlot.state} includeDivider={false} />

                    {selectedSlot.stateReasons ?
                        <>
                            <NestedObject resource={selectedSlot.stateReasons} name="stateReasons" expanded={true}/>
                            <Divider style={{ marginLeft: "40px" }} />
                        </>
                    :selectedSlot.state ? <Divider style={{ marginLeft: "40px" }} /> : <></>}

                    <SupplyItem primary="supplyAgentType" secondary={selectedSlot.supplyAgentType} includeDivider={true} />
                    <SupplyItem primary="supplyColor" secondary={selectedSlot.supplyColor} includeDivider={true} />
                    <SupplyItem primary="supplyDescription" secondary={selectedSlot.supplyDescription} includeDivider={true} />
                    <SupplyItem primary="supplyType" secondary={selectedSlot.supplyType} includeDivider={true} />
                    <SupplyItem primary="supplyUniqueId" secondary={selectedSlot.supplyUniqueId} includeDivider={true} />
                    <SupplyItem primary="usageTimeHours" secondary={selectedSlot.usageTimeHours} includeDivider={false} />
                </List>
            </List>
        );
    }
    return(<></>);
}

function SupplyInfo(props) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding>
            <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[800], fontSize: "14px" }}>
                            {"Slot " + props.slot.slotId}
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <SupplyInfoDetails selectedSlot={props.slot} />
            </Collapse>
            <Divider/>
        </List>
    )
}

function SuppliesInfoDetails({ suppliesInfo }) {
    if (suppliesInfo) {
        return (
            <div>
                <PropertyItem primary="suppliesList"/>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        {suppliesInfo.suppliesList.map((slot) => (
                            <SupplyInfo slot={slot} />
                        ))}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default function SuppliesInfo(props) {
    const deviceContext = useContext(DeviceContext);
    const suppliesService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentSuppliesInfo, setCurrentSuppliesInfo] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadSuppliesInfo(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadSuppliesInfo(props.agentId);
    }

    async function loadSuppliesInfo(agentId) {
        let response;

        console.log("loadSuppliesInfo.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await suppliesService.getSuppliesInfo(agentId);
            console.log("getSuppliesInfo response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentSuppliesInfo(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SuppliesInfo ' + agentId + ' - ' + error.cause.message);
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
        <Grid container>
            <Grid item xs={12}>
                <Paper elevation={0}>
                    <Card data-testid="supplies-info-card">
                        <CardContent>
                            <Typography variant="h5" component="h2">Supplies Info</Typography>
                            {
                                isLoading ? <Loading message="Loading resource..." /> :
                                    (currentSuppliesInfo && <SuppliesInfoDetails suppliesInfo={currentSuppliesInfo} />)
                            }
                            <ApiResponseDialog title="Supplies Info API Response" open={state.showApiResponse} apiResponse={currentSuppliesInfo} handleClose={handleDialogClose} />
                        </CardContent>
                        <CardActions>
                            <LoadRefreshButton data-testid="supplies-info-loadrefresh" onClick={handleLoadClicked} isLoading={currentSuppliesInfo === null} location="Supplies Info" />
                            <ApiResponseButton data-testid="supplies-info-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                        </CardActions>
                    </Card>
                </Paper>
            </Grid>
        </Grid>
    );
}
