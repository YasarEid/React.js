import React from "react";
import { Navbar, Container, ButtonGroup, Button } from 'react-bootstrap';
import app from '../../base';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalUpload from '../HomeComponents/ModalUpload';

const Header = ({onUploadComplete, photos}) => {
    


    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Logo</Navbar.Brand>
                    <ButtonGroup aria-label="Basic example">
                        <Button variant="primary" onClick={() => app.auth().signOut()}>Log out</Button>
                        <ModalUpload  onUploadComplete={onUploadComplete} photos={photos} />
                    </ButtonGroup>
                </Container>
            </Navbar>
        </>
    )
}
export default Header;
