import { Card, CardActions, CardContent, Collapse, Divider, Grid, ListItem, ListItemText, Paper } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useContext, useEffect, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import Loading from '../../common/Loading';
import { NestedObject } from '../../common/NestedObject';
import { PropertyItem } from '../../common/ResponseTypes';

function SupplyUsageDetails({ selectedSlot }) {

    if (selectedSlot) {
        return (
            <>
                <List component="nav" style={{ marginTop: "-10px" }} >
                    <List component="div" disablePadding>
                        <NestedObject resource={selectedSlot.colors} excludeDivider={true} excludeTopBar={true} excludeSecondaryTopBar={true} name="colors"/>
                        <NestedObject resource={selectedSlot.compositeCounts} excludeDivider={true} excludeSecondaryTopBar={true} name="compositeCounts"/>
                        <NestedObject resource={selectedSlot.maintenancePrimeMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="maintenancePrimeMarkingAgent"/>
                        <NestedObject resource={selectedSlot.maintenanceServicingLdwMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="maintenanceServicingLdwMarkingAgent"/>
                        <NestedObject resource={selectedSlot.maintenanceServicingMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="maintenanceServicingMarkingAgent"/>
                        <NestedObject resource={selectedSlot.maintenanceWvlMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="maintenanceWvlMarkingAgent"/>
                        <Divider style={{ marginLeft: "40px" }} />

                        <PropertyItem primary="nonHpOverride" secondary={selectedSlot.nonHpOverride || ""} />

                        <NestedObject resource={selectedSlot.nonHpPrintMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="nonHpPrintMarkingAgent"/>
                        <Divider style={{ marginLeft: "40px" }} />

                        <PropertyItem primary="numberOfSupplies" secondary={selectedSlot.numberOfSupplies || ""} />

                        <NestedObject resource={selectedSlot.printLdwMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="printLdwMarkingAgent"/>
                        <NestedObject resource={selectedSlot.printMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="printMarkingAgent"/>
                        <Divider style={{ marginLeft: "40px" }} />

                        <PropertyItem primary="refillOccured" secondary={selectedSlot.refillOccured || ""} />

                        <NestedObject resource={selectedSlot.suppliesPageYield} excludeDivider={true} excludeSecondaryTopBar={true} name="suppliesPageYield"/>
                        <NestedObject resource={selectedSlot.printMarkingAgent} excludeDivider={true} excludeSecondaryTopBar={true} name="suppliesYield"/>
                        <Divider style={{ marginLeft: "40px" }} />

                        <PropertyItem primary="supplyColorCode" secondary={selectedSlot.supplyColorCode || ""} />
                        <Divider style={{ marginLeft: "40px" }} />
                        <PropertyItem primary="supplyType" secondary={selectedSlot.supplyType || ""} />
                    </List>
                </List>
            </>
        );
    }
    return(<></>);
}

function SupplyUsage(props) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List component="div" disablePadding style={{ paddingLeft: "40px"}}>
            <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                <ListItemText disableTypography
                    primary={
                        <Typography type="body1" style={{ color: grey[800], fontSize: "14px" }}>
                            {"SlotId " + props.slot.slotId}
                        </Typography>}
                /> {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <SupplyUsageDetails selectedSlot={props.slot} />
            </Collapse>
            <Divider/>
        </List>
    )
}

function SuppliesUsageDetails({ suppliesUsage }) {
    if (suppliesUsage) {
        return (
            <div>
                <PropertyItem primary="supplyUsageBySlotId"/>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        {suppliesUsage.supplyUsageBySlotId.map((slot) => (
                            <SupplyUsage slot={slot} />
                        ))}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default function SuppliesUsage(props) {
    const deviceContext = useContext(DeviceContext);
    const suppliesService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentSuppliesUsage, setCurrentSuppliesUsage] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadSuppliesUsage(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadSuppliesUsage(props.agentId);
    }

    async function loadSuppliesUsage(agentId) {
        let response;

        console.log("loadSuppliesUsage.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await suppliesService.getSuppliesUsage(agentId);
            console.log("getSuppliesUsage response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentSuppliesUsage(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SuppliesUsage ' + agentId + ' - ' + error.cause.message);
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
                    <Card data-testid="supplies-usage-card">
                        <CardContent>
                            <Typography variant="h5" component="h2">Supplies Usage</Typography>
                            {
                                isLoading ? <Loading message="Loading resource..." /> :
                                    (currentSuppliesUsage && <SuppliesUsageDetails suppliesUsage={currentSuppliesUsage} />)
                            }
                            <ApiResponseDialog title="Supplies Usage API Response" open={state.showApiResponse} apiResponse={currentSuppliesUsage} handleClose={handleDialogClose} />
                        </CardContent>
                        <CardActions>
                            <LoadRefreshButton data-testid="supplies-usage-loadrefresh" onClick={handleLoadClicked} isLoading={currentSuppliesUsage === null} location="Supplies Usage" />
                            <ApiResponseButton data-testid="supplies-usage-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                        </CardActions>
                    </Card>
                </Paper>
            </Grid>
        </Grid>
    );
}
