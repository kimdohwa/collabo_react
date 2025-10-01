import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useEffect, useState } from "react";

function App({ user }) {

    //데이터읽어오는중에 표시할 스테이트
    const [loading, setLoading] = useState();
    //오류정보저장
    const [error, setError] = useState();

    const [orders, setOrders] = useState();


    useEffect((user) => {
        if (!user) {
            setError('로그인필요');
            setLoading(false);
        }

        const fetchOrder = async () => {
            try {
                const url = `${API_BASE_URL}/order/list/${user.id}`;
                // get방식 파라미터 넘기느 방법과 포스트와 다름
                const parameters = { params: { memberId: user.id } };
                const response = await axios.get(url);
                setOrders(response.data);
            } catch (error) {
                setError('주문목록 불러오기 실패' + error);

            } finally { setLoading(false); }

            fetchOrder();
            console.log(orders);



        };
    }, [user])


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">주문 목록을 불러오는 중입니다.</span>
                </Spinner>
            </div>
        );
    }

    return (<>
        <Container className="mt-4">
            <h2 className="mt-4 mb-4">
                <span style={{ fontSize: "2rem" }}>📋 주문 내역</span></h2>
            {/* {orders.length === 0 ? (
                <Alert variant="secondary">주문내역이 없습니다.</Alert>
            ) : (
                <Row>
                    {orders.map((bean) => (
                        <Col key={bean.orderId} md={6} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>주문번호 : {bean.orderId}</Card.Title>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                    ))}
                </Row>
            )} */}
        </Container>

    </>
    )
}

export default App;