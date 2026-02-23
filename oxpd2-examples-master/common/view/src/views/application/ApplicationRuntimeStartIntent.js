import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Loading from '../../common/Loading';
import { Card, CardActions, CardContent } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useStyles } from '../../common/commonStyles';
import LoadRefreshButton from '../../common/LoadRefreshButton';
import SDKButton from '../../common/SDKButton';

export default function ApplicationRuntimeStartIntent(props) {
    const applicationService = props.service;
    const [isLoading, setIsLoading] = useState(false);
    const [startIntent, setStartIntent] = useState(null);

    useEffect(() => {
        loadCurrentContextStartIntent();
    }, []);

    async function onLoadClicked() {
        loadCurrentContextStartIntent();
    }

    async function loadCurrentContextStartIntent() {
        let response;

        setIsLoading(true);
        try {
            response = await applicationService.getApplicationRuntimeCurrentContextStartIntent();
            console.log(JSON.stringify(response));

            if (null !== response) {
                setStartIntent(response);
            }
        }
        catch (error) {
            setStartIntent(null);
            props.postAlert('error', 'Unable to retrieve Start Intent  - ' + error.message);
        }
        setIsLoading(false);
    }

    return (
        <Card>
            <CardContent>
                {
                    isLoading ? <Loading message="Loading resource..." /> :
                        (startIntent && <CurrentContextStartIntentDetails startIntent={startIntent} />)
                }
            </CardContent>
            <CardActions>
                <LoadRefreshButton onClick={onLoadClicked} isLoading={isLoading} location="Application Runtime Start Intent" />
            </CardActions>
        </Card>
    );
}

function CurrentContextStartIntentDetails(props) {
    const classes = useStyles();
    var contextString = JSON.stringify(props.startIntent.intent, undefined, 2);

    return (
        <>
            <Box className={classes.json} m={1}><pre className={classes.fit}>{contextString}</pre></Box>
            <CopyToClipboard text={contextString}>
                <SDKButton
                    disabled={false}
                    buttonlabel="Copy to clipboard"
                    primaryToolTip="Copy start intent api response to clipboard"
                    secondaryToolTip="Device must be bound"
                    secondaryToolTipCondition={true}
                />
            </CopyToClipboard>
        </>
    );
}

export {
    ApplicationRuntimeStartIntent
}
