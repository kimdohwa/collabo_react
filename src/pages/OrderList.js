import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


function App({ user }) {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        if (user && user?.id) {
            fetchOderList();
        }
    }, [user]);


    // 관리자를 위한 컴포넌트 / 함수
    const makeAdminButton = (bean) => {

        const changeStatus = async (newStatus) => {//완료버튼을 클릭하여 대기->완료 로 바꿉니다.

            try {
                const url = `${API_BASE_URL}/order/update/status/${bean.orderId}?status=${newStatus}`;
                await axios.put(url);
                alert(`주문번호 ${bean.orderId}의 ${newStatus}로 주문상태가 변경되었습니다.`)
                //변경되고 나면 화면에 보이지않습니다.
                setOrders((previous) =>
                    previous.filter((orders) => orders.orderId !== bean.orderId)
                )

            } catch (error) {
                alert(`상태변경에 실패했습니다.`)
            }
        }

        const orderCancel = async () => { //주문대기인 내역을 취소합니다.
            try {
                const url = `${API_BASE_URL}/order/delete/${bean.orderId}`;
                await axios.delete(url);
                alert(`주문번호 ${bean.orderId}의 주문이 취소되었습니다.`)

                //변경되고 나면 화면에 보이지않습니다.
                setOrders((previous) =>
                    previous.filter((orders) => orders.orderId !== bean.orderId)
                )
                fetchOderList();

            } catch (error) {
                alert(`주문취소에 실패했습니다.`)
            }
        }



        return (
            <div className=" d-flex justify-content-end">
                {user?.role === 'Admin' && (<Button style={{ backgroundColor: '#9baf43a1', borderColor: 'transparent' }}
                    size="sm" className="me-2 " onClick={() => changeStatus('COMPLELTED')} >
                    완료
                </Button>)}

                <Button style={{ backgroundColor: '#ff8686ff', borderColor: 'transparent' }}
                    size="sm" className="me-2" onClick={() => orderCancel()}>
                    취소
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

    const [key, setKey] = useState("PENDING");


    return (<>
        <Container className="mt-4">
            <h2 className="mt-4 mb-4">
                <span style={{ fontSize: "2rem" }}>📋 주문 내역</span></h2>

            <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k)} // k는 event.key를 말함
                id="fill-tab-example"
                className="mb-3"
                fill
            >
                <Tab eventKey="PENDING" title="주문대기">
                    {orders.length === 0 ? (
                        <Alert variant="warning ">주문내역이 없습니다.</Alert>
                    ) : (
                        <Row>
                            {orders
                                .filter((order) => order.status === "PENDING")
                                .map((bean) => (
                                    <Col key={bean.orderId} md={6} className="mb-4">
                                        <Card className="h-100 shadow-sm card-hover">
                                            <Card.Body>

                                                <div className="d-flex justify-content-between mb-2">
                                                    <Card.Title>주문번호: {bean.orderId}</Card.Title>
                                                    <span className="text-muted text-end">{bean.orderDate}<br />(주문자번호 :{bean.memberName}) </span>
                                                </div>
                                                <h6 style={{ margin: "10px", color: "#927a55ff" }}>주문상태 : {bean.status}</h6>
                                                <ul style={{ margin: "10px" }}>
                                                    {bean.orderItems.map((item, index) => (
                                                        <li key={index}>
                                                            {item.productName} x {item.quantity}개
                                                        </li>
                                                    ))}
                                                </ul>
                                                {makeAdminButton(bean)}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    )}
                </Tab>
                <Tab eventKey="COMPLELTED" title="주문완료">
                    {orders.length === 0 ? (
                        <Alert variant="warning ">주문내역이 없습니다.</Alert>
                    ) : (
                        <Row>
                            {orders
                                .filter((order) => order.status === "COMPLELTED")
                                .map((bean) => (
                                    <Col key={bean.orderId} md={6} className="mb-4">
                                        <Card className="h-100 shadow-sm"
                                            style={{ backgroundColor: "#fffadeff" }}>
                                            <Card.Body>

                                                <div className="d-flex justify-content-between mb-2">
                                                    <Card.Title>주문번호: {bean.orderId}</Card.Title>
                                                    <span className="text-muted text-end">{bean.orderDate}<br />(주문자번호 :{bean.memberName}) </span>
                                                </div>
                                                <h6 style={{ margin: "10px", color: "#927a55ff" }}>주문상태 : {bean.status}</h6>
                                                <ul style={{ margin: "10px" }}>
                                                    {bean.orderItems.map((item, index) => (
                                                        <li key={index}>
                                                            {item.productName} x {item.quantity}개
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    )}
                </Tab>

            </Tabs>
        </Container >

    </>
    )
}

export default App;