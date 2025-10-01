import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App({ user }) {

    //데이터읽어오는중에 표시할 스테이트
    const [loading, setLoading] = useState();
    //오류정보저장
    const [error, setError] = useState();

    const [orders, setOrders] = useState([]);


    useEffect(() => {

        if (user && user?.id) {
            fetchOderList();
        }
    }, [user]);

    const deleteOrder = (deleteId) => {
        alert('삭제할 주문번호' + deleteId);
    }

    // 관리자를 위한 컴포넌트 / 함수
    const makeAdminButton = (bean) => {
        if (user?.role !== "Admin") return null;
        return (
            <div className=" d-flex justify-content-end">
                <Button style={{ backgroundColor: '#9baf43a1', borderColor: 'transparent' }}
                    size="sm" className="me-2 " onClick={() => {// navigate()에 URL을 넣으면 기본적으로 현재 SPA(root) 경로를 기준으로 상대 경로를 계산해줍니다.
                        // 따라서, 자바 스크립트의 location 객체의 href 속성을 이용하면 해결 가능합니다.
                        window.location.href = `${API_BASE_URL}/order/update/${bean.orderId}`;
                    }} >
                    수정
                </Button>
                <Button style={{ backgroundColor: '#ff8686ff', borderColor: 'transparent' }}
                    size="sm" className="me-2" onClick={() => deleteOrder(bean.orderId)}>
                    삭제
                </Button>
            </div>
        )
    }


    const fetchOderList = async () => {
        console.log(user);
        const url = `${API_BASE_URL}/order/list/${user.id}`;
        const response = await
            axios.get(url, {
                params: {
                    role: user.role
                }
            });
        setOrders(response.data);
        console.log('카트상품 조회결과' + response.data);
        console.log(JSON.stringify(response.data, null, 2));
    }


    return (<>
        <Container className="mt-4">
            <h2 className="mt-4 mb-4">
                <span style={{ fontSize: "2rem" }}>📋 주문 내역</span></h2>
            {orders.length === 0 ? (
                <Alert variant="warning ">주문내역이 없습니다.</Alert>
            ) : (
                <Row>
                    {orders.map((bean) => (
                        <Col key={bean.orderId} md={12} className="mb-4">
                            <Card className="h-100 shadow-sm card-hover">
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <Card.Title>주문번호: {bean.orderId}</Card.Title>
                                        <span className="text-muted text-end">{bean.orderDate}<br />(주문자번호 :{bean.memberName}) </span>

                                    </div>
                                    <h6 style={{ margin: "10px", color: "#745252ff" }}>주문상태 : {bean.status}</h6>
                                    <ul style={{ margin: "10px" }}>
                                        {
                                            bean.orderItems.map((item, index) => (
                                                <li key={index}>
                                                    {item.productName} x {item.quantity}개
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {makeAdminButton(bean)}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container >

    </>
    )
}

export default App;