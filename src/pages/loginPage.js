import axios from "axios";
import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";

function App({ setUser }) {
    // setUser 사용자 정보를 저장하기 위한 setter 메소드

    //로그인 관련 스테이트 정의
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //오류 메시지 관련 스테이트 정의
    const [errors, setErrors] = useState("");

    const navigate = useNavigate();

    const LoginAction = async (event) => {//로그인과 관련된 이벤트 처리함수
        event.preventDefault();
        try {
            const url = `${API_BASE_URL}/member/login`;
            const parameters = { email, password };

            //스프링 부트가 넘겨주는 정보는 Map<String, Object> 타입입니다.
            const response = await axios.post(url, parameters);

            //message에는 로그인성공여부를 알리는 내용 , member에는 로그인 한 사람의 객체정보가 반환됩니다.
            const { message, member } = response.data;

            if (message === 'success') {// 자바에서 맵.put("message","success") 식으로 코딩을 했습니다. 
                console.log("로그인 한 사람의 정보");
                console.log(member);
                //로그인 성공시 사용자정보를 저장해야합니다.
                setUser(member);

                navigate(`/`); //로그인 성공 후 홈페이지로 이동

            } else {//로그인 실패
                setErrors(message)

            }
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.message || "로그인실패")
            } else {
                setErrors("Sever Error")
            }
        }
    }


    return (<>
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md="6">
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">로그인</h2>
                            {errors && <Alert variant='danger'>{errors}</Alert>}

                            <Form className="p-4" onSubmit={LoginAction}>
                                <Form.Group >

                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        className="mb-4"
                                        type="text"
                                        placeholder="E-mail을 입력해주세요."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        className="mb-4"
                                        type="password"
                                        placeholder="비밀번호를 입력해주세요."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                    <Row className="g-2">
                                        <Col xs={8}>
                                            <Button variant="primary" type="submit" style={{ width: '100%' }}>로그인</Button>
                                        </Col>
                                        <Col xs={4}>
                                            <Link to={`/member/signup`} className="btn btn-outline-secondary">회원가입</Link>
                                        </Col>
                                    </Row>
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