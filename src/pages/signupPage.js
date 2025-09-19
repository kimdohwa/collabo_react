import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {

    //파라미터 관련 state 변수 선언
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');

    // 폼 유효성 검사(Form Validation Ceck) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState({
        name: '', email: '', password: '', address: '', general: ''
    });

    const navigate = useNavigate();

    const SignupAction = async (event) => {
        event.preventDefault();
        try {
            const url = `${API_BASE_URL}/member/signup`;
            const parameters = { name, email, password, address };
            //response는 응답받은 객체입니다.
            const response = await axios.post(url, parameters);

            if (response.status === 200) {
                // 스프링의 MemberController 파일참조
                alert('회원 가입 성공');
                navigate('member/login')
            }
        } catch (error) {
            if (error.response && error.response.data) {
                //서버에서 받은 오류정보를 객체로 저장합니다.
                setErrors(error.response.data);
            } else {//입력 값 이외에 발생하는 다른 오류와 관련됨
                setErrors((previous) => ({ ...previous, general: '회원 가입 중에 오류가 발생하였습니다.' }))
            }
        }
    };

    return (<>
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md="6">
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">회원가입</h2>
                            {/* 일반 오류 발생시 사용자에게 alert 메시지를 보여 줍니다. */}
                            {/* contextual : 상황에 맞는 적절한 스타일 색상을 지정함*/}
                            {errors.general && <Alert variant='danger'>{errors.general}</Alert>}

                            {/*
                            !!연산자는 어떠한 값을 강제로 boolean 형태로 변환해주는 자바스크립트 기법입니다. 
                            isInvalid 속성은 해당 control의 유효성을 검사하는 속성입니다.
                            값이 true이면 Form.Control.Feedback 에 오류 메시지를 보여줍니다. 
                            */}
                            <Form className="p-4" onSubmit={SignupAction}>
                                <Form.Group >
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        className="mb-4"
                                        type="text"
                                        placeholder="이름을 입력해주세요."
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        isInvalid={!!errors.name}
                                        required

                                    />
                                    <Form.Control.Feedback type="invalid">{!!errors.name}</Form.Control.Feedback>
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="E-mail을 입력해주세요."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        isInvalid={!!errors.email}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid" className="mb-4">{errors.email}</Form.Control.Feedback>
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        className="mb-4"
                                        type="password"
                                        placeholder="비밀번호를 입력해주세요."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        isInvalid={!!errors.password}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{!!errors.password}</Form.Control.Feedback>
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control
                                        className="mb-4"
                                        type="text"
                                        placeholder="주소를 입력해주세요."
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        isInvalid={!!errors.address}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{!!errors.address}</Form.Control.Feedback>
                                    <Button className="mt-4" variant="primary" type="submit" style={{ width: '100%' }}>회원가입</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>
    )
}

export default App;