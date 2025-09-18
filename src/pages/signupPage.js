import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function App() {

    //파라미터 관련 state 변수 선언
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');

    return (<>
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md="6">
                    <Card>
                        <Card.Body>
                            <h2>회원가입</h2>
                            <Form className="p-4">
                                <Form.Group >
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        className="mb-4"
                                        type="text"
                                        placeholder="이름을 입력해주세요."
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required

                                    />
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        className="mb-4"

                                        type="text"
                                        placeholder="이름을 입력해주세요."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required

                                    />
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        className="mb-4"

                                        type="password"
                                        placeholder="이름을 입력해주세요."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required

                                    />
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control
                                        className="mb-4"

                                        type="text"
                                        placeholder="이름을 입력해주세요."
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        required

                                    />
                                    <Button className="mt-4" style={{ width: '100%' }}>등록</Button>
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