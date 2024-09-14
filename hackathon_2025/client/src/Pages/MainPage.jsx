import React from "react";
import MainPageCSS from './MainPage.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaUpload } from "react-icons/fa";

const MainPage = () => {
    const triggerFileInput = () => {
        document.getElementById('fileUpload').click();
    };
    return(
        <>
            <div className={MainPageCSS['body-container']}>
                <Navbar style={{height: "50px"}}>
                    <Container>
                        <Navbar.Brand href="#home" style={{color: "black"}}>Navbar</Navbar.Brand>
                            <Nav className="me-auto">
                                <Nav.Link href="#home" style={{color: "black"}}>Home</Nav.Link>
                                <Nav.Link href="#features" style={{color: "black"}}>Features</Nav.Link>
                                <Nav.Link href="#pricing" style={{color: "black"}}>Pricing</Nav.Link>
                            </Nav>
                    </Container>
                </Navbar>
                <div class={MainPageCSS["landing-container"]}>
                    <div className={MainPageCSS["text-container"]}>
                        <p className={`text-center ${MainPageCSS['landing-text']}`}>
                            Please upload your excel file here.
                        </p>
                        <input
                            type="file"
                            accept=".csv"
                            style={{ display: 'none' }}
                            id="fileUpload"
                        />
                        
                        <button type="button" class="btn btn-info" style={{padding: "10px 20px"}} onClick={triggerFileInput}>Upload File<FaUpload style={{marginLeft: "10px"}} /></button>
                        
                    </div>    
                </div>
                {/* <img src={image} alt=""  style={{width: "50%"}}/>
                {isAboutVisible && (<About onClose={handleAboutClose} />)} */}
                
            </div>
        </>
    );
}  

export default MainPage