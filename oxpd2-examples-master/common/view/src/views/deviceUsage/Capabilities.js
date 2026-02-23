import React, { useEffect, useContext } from 'react';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Loading from '../../common/Loading';
import Typography from '@mui/material/Typography';
import { BuildCommonCapabilities } from '../../common/Capabilities';
import { DeviceContext } from '../../common/DeviceContext';
import ApiResponseButton from '../../common/ApiResponseButton';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import { NestedObject } from '../../common/NestedObject';

function CapabilitiesDetails({ capabilities }) {
    if (capabilities) {
        return (
            <React.Fragment>
                <BuildCommonCapabilities capabilities={capabilities || {}} />
                <NestedObject resource={capabilities.availableUsageContent} name="availableUsageContent" expanded={true}/>
            </React.Fragment>
        )
    }
    return null;
}

function DeviceUsageCapabilities(props) {
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
                    Device Usage Service Capabilities
                </Typography>
                {isLoading ? <Loading message="Loading resource..." /> :
                    props.currentCapabilities && <CapabilitiesDetails capabilities={props.currentCapabilities} />
                }
                <ApiResponseDialog title="Capabilities API Response" open={state.showApiResponse} apiResponse={props.currentCapabilities} handleClose={handleDialogClose} />
            </CardContent>
            <CardActions>
                <LoadRefreshButton data-testid="smc-load-refresh" onClick={handleRefreshClicked} isLoading={isLoading} location="Device Usage Capabilities" />
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
    DeviceUsageCapabilities
}
