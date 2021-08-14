import React, {useRef, useState} from 'react'
import Button from 'react-bootstrap/Button';

export default function FileUploader({onFileSelect}) {
    const fileInput = useRef(null)
    const [fileName, setFileName] = useState('');

    const handleFileInput = (e) => {
        // handle validations
        if (onFileSelect)
            onFileSelect(e.target.files[0]);
        if (e.target.files[0] !== undefined)
            setFileName(e.target.files[0].name);
    }

    return (
        <div>
            <input type="file" onChange={handleFileInput} hidden ref={fileInput}/>
            <Button onClick={e => fileInput.current.click()}>
                {"Выбрать файл"}
            </Button>
            {" "}
            {fileName}
        </div>
    )
}
