import { CloseCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Divider,
    message,
    Modal,
    notification,
    Row,
    Tag,
    Typography,
} from 'antd';
import loginApi from 'api/loginApi';
import IMAGE_ACCOUNT_PAGE from 'assets/images/account/account-bg.png';
import color from 'constants/color';
import InputField from 'customfield/InputField';
import { setLoading } from 'features/Account/accountSlice';
import { otpCode, registryValues } from 'features/Account/initValues';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const RESEND_OTP_TIME_LIMIT = 60;
const { Text, Title } = Typography;
function RegistryPage(props) {
    const dispatch = useDispatch();
    let resendOTPTimerInterval;
    const [isError, setError] = useState('');
    const [email, setEmail] = useState('');
    const history = useHistory();
    //set time counter
    const [counter, setCounter] = useState(0);
    //set OTP value
    const [otp, setOtp] = useState(0);
    const [isSubmit, setIsSubmit] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        try {
            
            const result = loginApi.confirmAccount(email,otp);
            console.log('email :>> ', email);
             success();
        } catch (error) {
            message.error(JSON.stringify(error.response.data.message));
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const openNotification = (mes) => {
        const args = {
            message: mes ? mes : 'Xác thực OTP để hoàn tất việc đăng ký',
        };
        notification.info(args);
    };

    function success() {
        Modal.success({
            content: 'Đăng ký thành công !',
            onOk: () => {
                history.push('/account/login');
            },
            onCancel: () => {
                history.push('/account/login');
            },
        });
    }

    const handleRegistry = async (values) => {
        const { name, email, password, otpValue } = values;
        console.log('isSubmit :>> ', isSubmit);
        dispatch(setLoading(true));

        try {
            const result = await loginApi.registry(name, email, password);
            showModal();
        } catch (error) {
            message.error(JSON.stringify(error.response.data.message));
            //Thông báo lỗi
        }

        dispatch(setLoading(false));
    };

    //start time from 30 to '0'
    const startResendOTPTimer = () => {
        if (resendOTPTimerInterval) {
            clearInterval(resendOTPTimerInterval);
        }
        resendOTPTimerInterval = setInterval(() => {
            if (counter <= 0) {
                clearInterval(resendOTPTimerInterval);
            } else {
                setCounter(counter - 1);
            }
        }, 1000);
    };

    const handleResendOTP = async (email) => {
        setCounter(RESEND_OTP_TIME_LIMIT);
        startResendOTPTimer();

        dispatch(setLoading(true));
        try {
            await loginApi.forgot(email);
            openNotification(`Đã gửi lại mã OTP đến  ${email}`);
        } catch (error) {}
        dispatch(setLoading(false));
    };

    //useEffect khi counter thay đổi
    useEffect(() => {
        startResendOTPTimer();
        return () => {
            if (resendOTPTimerInterval) {
                clearInterval(resendOTPTimerInterval);
            }
        };
    }, [counter]);

    return (
        <div className="account-common-page">
            <div className="account-wrapper">
                <div className="account_right">
                    <Title level={2} style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#a64bf4' }}>Đăng Ký</Text>
                    </Title>
                    <Divider />
                    <div className="form-account">
                        <Formik
                            initialValues={{ ...registryValues.initial }}
                            onSubmit={(values) => handleRegistry(values)}
                            validationSchema={
                                isSubmit
                                    ? registryValues.validationSchemaWithOTP
                                    : registryValues.validationSchema
                            }
                            enableReinitialize={true}
                        >
                            {(formikProps) => {
                                return (
                                    <Form>
                                        <Row gutter={[0, 16]}>
                                            {isSubmit ? (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="otpValue"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Xác nhận OTP"
                                                            placeholder="Mã OTP có 6 kí tự"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <Button
                                                            onClick={() =>
                                                                handleResendOTP(
                                                                    formikProps
                                                                        .values
                                                                        .email
                                                                )
                                                            }
                                                            type="primary"
                                                            block
                                                            disabled={
                                                                counter > 0
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            Gửi lại OTP{' '}
                                                            {`${
                                                                counter > 0
                                                                    ? `sau ${counter}`
                                                                    : ''
                                                            }`}
                                                        </Button>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="name"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Tên "
                                                            placeholder="Ví dụ: Đỗ Tường Vi"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="email"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Tài khoản"
                                                            placeholder="Nhập email/SĐT đăng ký"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                            onChange={(e)=>setEmail(e.target.value)}
                                                            
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="password"
                                                            component={
                                                                InputField
                                                            }
                                                            type="password"
                                                            title="Mật khẩu"
                                                            placeholder="Mật khẩu ít nhất 8 kí tự"
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="passwordconfirm"
                                                            component={
                                                                InputField
                                                            }
                                                            type="password"
                                                            title=" Xác nhận mật khẩu"
                                                            placeholder="Gõ lại mật khẩu vừa nhập"
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                </>
                                            )}

                                            {isError ? (
                                                <Col span={24}>
                                                    <Tag
                                                        color="error"
                                                        style={{
                                                            fontWeight: 'bold',
                                                        }}
                                                        icon={
                                                            <CloseCircleOutlined />
                                                        }
                                                    >
                                                        {isError}
                                                    </Tag>
                                                </Col>
                                            ) : (
                                                ''
                                            )}

                                            <Col span={24}>
                                                {/* <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                    block
                                                >
                                                    Xác nhận
                                                </Button> */}
                                                <div className="form-bgbtn">
                                                    <button
                                                        className="btn-login"
                                                        type="submit"
                                                        onClick={() =>
                                                            console.log(
                                                                'clicked'
                                                            )
                                                        }
                                                    >
                                                        Xác nhận
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>

                    <Divider />

                    <div className="addtional-link">
                        <Link to="/">Trang chủ</Link>
                        <Link to="/account/login">Đăng nhập</Link>
                        <Link to="/account/forgot">Quên mật khẩu ?</Link>
                    </div>
                </div>
            </div>
            <Modal
                title="Nhập mã OTP"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
               
            >
                {/* Đổi thành thẻ input tạo 1 state cho value input */}
                <input type="number" name="otp" id="" maxLength={8} onChange={(e)=>setOtp(e.target.value)}/>
            </Modal>
        </div>
    );
}

export default RegistryPage;
