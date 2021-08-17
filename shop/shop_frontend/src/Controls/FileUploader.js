import React, {useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types'

export default function FileUploader(props) {
    const fileInput = useRef(null)
    const [fileName, setFileName] = useState('');

    const handleFileInput = (e) => {
        // handle validations
        if (props.onFileSelect)
            props.onFileSelect(e.target.files[0]);
        if (e.target.files[0] !== undefined)
            setFileName(e.target.files[0].name);
    }

    return (
        <div>
            <input type="file" onChange={handleFileInput} hidden ref={fileInput}/>
            <Button onClick={e => fileInput.current.click()}>
                {props.text}
            </Button>
            {" "}
            {fileName}
        </div>
    )
}

FileUploader.defaultProps = {
    text: "Выбрать файл",
}

FileUploader.propTypes = {
    text: PropTypes.string,
    onFileSelect: PropTypes.func,
}
