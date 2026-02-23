import Card from '@mui/material/Card';
import { CardActions } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import SDKButton from '../../common/SDKButton';


function SessionTabContent(props) {

    let actionButtons = (
        <CardActions>
            <SDKButton
                data-testid='session-force-logout'
                disabled={false}
                buttonlabel="Force Logout"
                primaryToolTip="Send A Force Logout Request"
                secondaryToolTip="Force Logout Unavailable"
                secondaryToolTipCondition={true}
                onClick={handleLogoutClicked}
            />
        </CardActions>
    );

    useEffect(() => {

    }, [props.loadEnabled]);

    async function handleLogoutClicked() {
        try {
            let response = await props.service.postSessionForceLogout();
            console.log("login response- " + JSON.stringify(response));

            if (null != response) {
                props.postAlert('success', 'Logout initiated');
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to force logout  - ' + error.cause.message);
        }
    }

    return (
        <Card data-testid='session-card'>
            <CardContent>
                <Typography variant="h5" component="h2">Session</Typography>
            </CardContent>
            <CardActions>
                <div>
                    {actionButtons}
                </div>
            </CardActions>
        </Card>
    );
}

export {
    SessionTabContent
};
