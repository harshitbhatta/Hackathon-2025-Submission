import React from "react";
import MainPageCSS from './MainPage.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import image from "../assets/Dashboard_design_vector_illustration_concept_generated-removebg-preview.png";
import axios from 'axios';
import { useState, useEffect } from "react";

const MainPage = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const triggerFileInput = () => {
        document.getElementById('fileUpload').click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(`File selected: ${file.name}`);
            // After processing the file, redirect to another page
            const formData = new FormData();
            formData.append('file', file); // 'file' is the key expected by the backend

            try {
                // Send the file to the Django backend
                const response = await axios.post('http://127.0.0.1:8000/upload/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('File successfully uploaded:', response.data);

                // After successfully processing the file, redirect to another page
                navigate('/visuals'); // Redirect after successful upload
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
        
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
                    <div className={MainPageCSS["wrapper"]}>
                        <div className={MainPageCSS["text-container"]}>
                            <h1 style={{marginLeft: "5%", fontWeight: "bold"}}><span style={{color: "#18a3b5"}}>MANAGE</span> AND <span style={{color: "#18a3b5"}}>VISUALIZE</span> YOUR <span style={{color: "orange"}}>DATA</span> HERE.</h1>
                            <p className={MainPageCSS['landing-text']}>Please upload your excel file here.</p>
                            <input
                                type="file"
                                accept=".csv"
                                style={{ display: 'none' }}
                                id="fileUpload"
                                onChange={handleFileUpload}
                            />
                            
                            <button type="button" class="btn btn-info" style={{padding: "10px 20px"}} onClick={triggerFileInput}>Upload File<FaUpload style={{marginLeft: "10px"}} /></button>
                            
                        </div>    
                        <div className={MainPageCSS["img-wrapper"]} style={{display: "flex", justifyContent: "center"}}>
                            <img className={MainPageCSS["img"]} src={image} alt="" />
                        </div>
                        
                        
                    </div>
                    
                </div>
                {/* <img src={image} alt=""  style={{width: "50%"}}/>
                {isAboutVisible && (<About onClose={handleAboutClose} />)} */}
                
            </div>
        </>
    );
}  

export default MainPage