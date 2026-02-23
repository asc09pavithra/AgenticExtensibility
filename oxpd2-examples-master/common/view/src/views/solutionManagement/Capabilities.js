import React, { useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Loading from '../../common/Loading';
import Typography from '@mui/material/Typography';
import { BuildCommonCapabilities } from '../../common/Capabilities';
import { PropertyHeader, PropertyItem, PropertyItemNoStyle } from '../../common/ResponseTypes';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';

function BuildSolutionPlatforms({ platforms }) {
    if (platforms) {
        return (
            <React.Fragment>
                <PropertyHeader name="solutionPlatforms" />
                <List style={{ paddingLeft: "40px" }} component="div" disablePadding >
                    {platforms.map((platform, i, arr) => (
                        <React.Fragment key={i}>
                            <PropertyItem primary="platformType" secondary={platform.platformType || ""} />
                            <PropertyItemNoStyle style={{ marginTop: "-20px", margingLeft: "0px", paddingLeft: "40px" }} primary="platformStatus" secondary={platform.platformStatus || ""} />
                            <Divider style={{ marginLeft: "40px" }} />
                        </React.Fragment>
                    ))}
                </List>
            </React.Fragment>
        )
    }
    return null;
}

function CapabilitiesDetails({ capabilities }) {
    if (capabilities) {
        return (
            <React.Fragment>
                <BuildCommonCapabilities capabilities={capabilities || {}} />
                <Divider style={{ marginLeft: "40px" }} />
                <BuildSolutionPlatforms platforms={capabilities.solutionPlatforms} />
            </React.Fragment>
        )
    }
    return null;
}

function SolutionManagerCapabilities(props) {
    const deviceContext = useContext(DeviceContext);
    const [isLoading, setIsLoading] = React.useState(false);
    const [state, setState] = React.useState({
        showApiResponse: false,
        showButtons: false
    });

    useEffect(() => {
        if (props.initialLoad || props.initialLoad == null) {
            handleRefreshClicked();
        }
    }, [props.initialLoad]);

    async function handleRefreshClicked() {
        setIsLoading(true);
        try {
            var result = await props.service.getCapabilities();
            if (null !== result) {
                props.setCapabilities(result);
                setState({ ...state, showButtons: true });
            }

        }
        catch (error) {
            props.postAlert('error', 'Unable to retrieve the Capabilities - ' + error.cause.message);
        }
        props.setInitialLoad(false);
        setIsLoading(false);
    };

    async function handleShowApiResponse() {
        setState({ ...state, showApiResponse: true });
    };

    async function handleDialogClose() {
        setState({ ...state, showApiResponse: false });
    };

    return (
        <Card style={{ border: "none", boxShadow: "none" }}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    Solution Manager Service Capabilities
                </Typography>
                {isLoading ? <Loading message="Loading resource..." /> :
                    props.currentCapabilities && <CapabilitiesDetails capabilities={props.currentCapabilities} />
                }
                <ApiResponseDialog title="Capabilities API Response" open={state.showApiResponse} apiResponse={props.currentCapabilities} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="smc-load-refresh" onClick={handleRefreshClicked} isLoading={isLoading} location="Solution Manager Capabilities" />
                <ApiResponseButton
                    data-testid="smc-show-api-response"
                    onClick={handleShowApiResponse}
                    deviceContext={deviceContext}
                    disabled={!state.showButtons}
                />
            </CardActions>
        </Card>
    );
}

export {
    SolutionManagerCapabilities
}
