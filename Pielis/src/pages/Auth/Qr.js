import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Card, CardBody, Alert, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactLoading from 'react-loading';
//i18n
import { useTranslation } from 'react-i18next';

//redux store
import { loginUser, apiError } from '../../redux/actions';

//Import Images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";


import QRCode from'qrcode.react';

import {base_url, ApiWhatsapp} from '../../Env'

import socketIOClient from "socket.io-client";
const ENDPOINT = `${ApiWhatsapp}/`;





/**
 * Login component
 * @param {*} props 
 */
const Login = (props) => {

    const [Qr, setQr] = useState(false)

    

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const clearError = () => {
        props.apiError("");
    }



    useEffect(() => {

        const socket = socketIOClient(ENDPOINT);
        socket.emit("setAvailable");
        socket.on("ShowQr", data => {
            setQr(data.qr)
            console.log(data)
        });

        socket.on("LoginSuccess", data => {
            console.log("LOGIN")
            localStorage.setItem("authUser", true)
            Home()
        });

      }, []);

      

      function Home(){
        console.log("HOME")
        window.location.href = "/";
      }
    
    useEffect(clearError, []);

    // validation
    const formik = useFormik({
        initialValues: {
            email: 'admin@themesbrand.com',
            password: '123456'
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Please Enter Your Username'),
            password: Yup.string().required('Please Enter Your Password')
        }),
        onSubmit: values => {
            props.loginUser(values.email, values.password, props.history);
       // console.log("JAHAHA")
        },
    });

    if (localStorage.getItem("authUser")) {
        return <Redirect to="/" />;
    } 

    return (
        <React.Fragment>

        <div className="account-pages my-5 pt-sm-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5} >
                        <div className="text-center mb-4">
                            <Link to="/" className="auth-logo mb-5 d-block">
                                <img src={logodark} alt="" height="30" className="logo logo-dark"/>
                                <img src={logolight} alt="" height="30" className="logo logo-light" />
                            </Link>

                            <h4>{t('Sign in')}</h4>
                            <p className="text-muted mb-4">{t('Sign in to continue to Chatvia')}.</p>
                            
                        </div>

                        <Card>
                            <CardBody className="p-4">
                                        {
                                            props.error && <Alert color="danger">{props.error}</Alert>
                                        }
                                <div className="p-3">
                                        
                                    <Form onSubmit={formik.handleSubmit} >
                                        
                                        {!Qr &&
                                            <ReactLoading className="ml-5" type={"spin"} color={"#7269ef"} height={200} width={200}/>
                                        }

                                        {Qr &&
                                           <QRCode value={`${Qr}`} size = "180"/>
                                        }
                                        
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>

                        

                        <div className="mt-5 text-center">
                            <p>© {t('2020 Chatvia')}. {t('Crafted with')} <i className="mdi mdi-heart text-danger"></i> {t('by Themesbrand')}</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default withRouter(connect(mapStateToProps, { loginUser, apiError })(Login));