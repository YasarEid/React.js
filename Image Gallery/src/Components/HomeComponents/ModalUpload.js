import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import Spinner from "react-bootstrap/Spinner";
import app from "../../base";

const ModalUpload = ({ onUploadComplete, photos }) => {
  const [show, setShow] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));

  const handleClose = () => {
    setShow(false)
    acceptedFiles.splice(0, acceptedFiles.length);

  };

  const handleShow = () => setShow(true);
  const handleUpload = () => {
    const promises = [];
    let images = [];
    if (acceptedFiles.length > 0) {
      setIsUploading(true);
      const filesToUpload = acceptedFiles.filter(image => !photos.includes(image.name))
      const filesToUploadName = filesToUpload.map(image => image.name)
      if (filesToUpload.length === 0) {
        handleClose();
        setIsUploading(false);
      }

      filesToUpload.forEach((image) => {
        const uploadTask = app.storage().ref(`images/${image.name}`).put(image);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
          },
          async () => {
            await app
              .storage()
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((urls) => {
                images.push(urls);
                if (filesToUpload.length === images.length) {
                  handleClose();
                  setIsUploading(false);
                  onUploadComplete(images, filesToUploadName);
                }
              });
          }
        );
        // }
      });
    } else {
      handleClose();
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Upload Image
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose an Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <React.StrictMode>
            <ChakraProvider>
              {!isUploading ? (
                <section className="container">
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                  <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                  </aside>
                </section>
              ) : (
                <Spinner animation="border" />
              )}
            </ChakraProvider>
          </React.StrictMode>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalUpload;
