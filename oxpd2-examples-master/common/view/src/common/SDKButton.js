import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { styled } from "@mui/material/styles";

// Enables tooltip to be visible even if child button is disabled
const Button = styled(MuiButton)({
    '&.Mui-disabled': {
        pointerEvents: 'auto'
    }
});

// Listener for props
const ButtonWithToolTip = React.forwardRef(({ primaryToolTip, secondaryToolTip, secondaryToolTipCondition, buttonlabel, disabled, ...other }, ref) => {
    let isDisabled = false;
    if (typeof disabled === 'boolean') {
        isDisabled = disabled;
    }
    else {
        isDisabled = disabled();
    }

    let currentCondition = true;
    if (typeof secondaryToolTipCondition === 'boolean') {
        currentCondition = secondaryToolTipCondition;
    }
    else {
        currentCondition = secondaryToolTipCondition();
    }

    const buttonProps = {
        variant: other.variant != null ? other.variant : "outlined",
        disabled: isDisabled,
        color: other.color != null ? other.color : "primary",
        size: other.size != null ? other.size : "medium",
    }
    const tooltipProps = {
        disabled: false,
        title: currentCondition ? <h3>{primaryToolTip}</h3> : <h3>{secondaryToolTip}</h3>
    }

    const [showTooltip, setShowTooltip] = useState(false);

    function HandleMouseIn() {
        setShowTooltip(true);
    }

    function HandleMouseOut() {
        setShowTooltip(false);
    }

    return (
        <div  onMouseOut={HandleMouseOut} onMouseOver={HandleMouseIn}>
            <Tooltip {...other} {...tooltipProps} ref={ref} open={showTooltip} size={"large"}>
                <Button {...other} {...buttonProps} ref={ref}>
                    {buttonlabel}
                </Button>
            </Tooltip>
        </div>
    );
});

export default function SDKButton(props) {
    return (
        <ButtonWithToolTip {...props} />
    );
}
