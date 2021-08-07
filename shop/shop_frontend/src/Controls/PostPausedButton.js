import { postBackend } from '../Backend/Backend';
import PausedButton from './PausedButton';
import PropTypes from 'prop-types'

export default function PostPausedButton(props) {
    if (!props.show)
        return "";
    return (
        <PausedButton
            variant={props.variant}
            onClick={() => {
                postBackend(props.actionUrl, {}, {id:props.actionId},
                    () => {
                        if (props.onChange)
                            props.onChange();
                    })
                }}
            disabled={props.disabled}>
            {props.children}
        </PausedButton>
    );
}

PostPausedButton.defaultProps = {
    show: true,
}

PostPausedButton.propTypes = {
    show: PropTypes.bool,
    pause: PropTypes.number,
    disabled: PropTypes.bool,
    variant: PropTypes.string,
    actionUrl: PropTypes.string,
    actionId: PropTypes.number,
    onChange: PropTypes.func,
}
