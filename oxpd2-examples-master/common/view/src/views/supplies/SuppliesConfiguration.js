import { Card, CardActions, CardContent, Collapse, Grid, ListItem, ListItemText, Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
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
import { PropertyItem } from '../../common/ResponseTypes';

function SuppliesConfigurationDetails({ suppliesConfiguration }) {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    
    if (suppliesConfiguration) {
        return (
            <List data-testid="supplies-configurationdetails-list" component="nav" >
                <List component="div" disablePadding>
                    <PropertyItem primary="antiTheftEnabled" secondary={suppliesConfiguration.antiTheftEnabled || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="antiTheftFleetId" secondary={suppliesConfiguration.antiTheftFleetId+"" || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="antiTheftMode" secondary={suppliesConfiguration.antiTheftMode || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="blackVeryLowAction" secondary={suppliesConfiguration.blackVeryLowAction || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <PropertyItem primary="colorVeryLowAction" secondary={suppliesConfiguration.colorVeryLowAction || ""} />
                    <Divider style={{ marginLeft: "40px" }} />
                    <List disablePadding>
                        <ListItem button onClick={handleClick} style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px" }}>
                            <ListItemText disableTypography
                                primary={
                                    <Typography type="body1" style={{ color: grey[600], fontSize: "14px" }}>
                                        {"supplyLowThresholds"}
                                    </Typography>}
                            /> {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding={true} style={{ paddingLeft: "40px" }}>
                                {suppliesConfiguration.supplyLowThresholds.map((slot) => (
                                    <>
                                        <PropertyItem primary="slotId" secondary={slot.slotId+"" || ""} />
                                        <PropertyItem primary="threshold" secondary={slot.threshold+"" || ""} />
                                        <Divider style={{ marginLeft: "40px" }} />
                                    </>
                                ))}
                            </List>
                        </Collapse>
                    </List>
                </List>
            </List>
        );
    }
}

export default function SuppliesConfiguration(props) {
    const deviceContext = useContext(DeviceContext);
    const suppliesService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [currentSuppliesConfiguration, setCurrentSuppliesConfiguration] = useState(null);

    const [state, setState] = useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        loadSuppliesConfiguration(props.agentId);
    }, [props.agentId]);

    async function handleLoadClicked() {
        loadSuppliesConfiguration(props.agentId);
    }

    async function loadSuppliesConfiguration(agentId) {
        let response;

        console.log("loadSuppliesConfiguration.agentId: " + agentId);

        if (!agentId || agentId.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            response = await suppliesService.getSuppliesConfiguration(agentId);
            console.log("getSuppliesConfiguration response:" + JSON.stringify(response));

            if (null !== response) {
                setCurrentSuppliesConfiguration(response);
                setState({ ...state, showButtons: true });
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve SuppliesConfiguration ' + agentId + ' - ' + error.cause.message);
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
                    <Card data-testid="supplies-configuration-card">
                        <CardContent>
                            <Typography variant="h5" component="h2">Supplies Configuration</Typography>
                            {
                                isLoading ? <Loading message="Loading resource..." /> :
                                    (currentSuppliesConfiguration && <SuppliesConfigurationDetails suppliesConfiguration={currentSuppliesConfiguration} />)
                            }
                            <ApiResponseDialog title="Supplies Configuration API Response" open={state.showApiResponse} apiResponse={currentSuppliesConfiguration} handleClose={handleDialogClose} />
                        </CardContent>
                        <CardActions>
                            <LoadRefreshButton data-testid="supplies-configuration-loadrefresh" onClick={handleLoadClicked} isLoading={currentSuppliesConfiguration === null} location="Supplies Configuration" />
                            <ApiResponseButton data-testid="supplies-configuration-showapiresponse" onClick={handleShowApiResponse} deviceContext={deviceContext} disabled={!state.showButtons} />
                        </CardActions>
                    </Card>
                </Paper>
            </Grid>
        </Grid>
    );
}
