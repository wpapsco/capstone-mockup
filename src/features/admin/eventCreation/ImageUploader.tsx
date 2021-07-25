import { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import BackupIcon from "@material-ui/icons/Backup";

export default function ImageUploader({setImageObj} : {setImageObj: (f: File | undefined) => void}) {
    const [fileObj, setFile] = useState<File>();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files === null) {
            alert("File is not valid");
        } else {
            setFile(e.currentTarget.files[0]);
        }
    }

    const fileUpload = () => {
        if (fileObj !== null)
            setImageObj(fileObj);
    }
    
    return (
        <Grid container>
            <Grid item xs={6}>
                <p>Upload an image</p>
            </Grid>
            <Grid item xs={12}>
                <input
                    accept="image/*"
                    name="newImage"
                    id="file-input"
                    type="file"
                    onChange={onFileChange}
                />
                <label htmlFor="file-input">
                    <Button
                        color="primary"
                        endIcon={<BackupIcon />}
                        onClick={fileUpload}
                    >
                        Upload
                    </Button>
                </label>
            </Grid>
        </Grid>
    )
}