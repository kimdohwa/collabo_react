
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


function App({ user }) {

    const thStyle = { fontSize: '1.2m' }; //테이블 헤더 스타일


    return (<>
        <Container className="mt-4">
            <h2 className="mt-4">
                <span style={{ color: '#805d12ff', fontSize: "2rem" }}>{user?.name}</span>
                <span style={{ fontSize: "1.3rem" }}>님의 장바구니</span>
            </h2>
            <Table striped bordered className="mt-4">
                <thead>
                    <tr>
                        <th style={thStyle}>
                            <Form.Check
                                type="checkbox"
                                label='전체 선택'
                                onChange={``}
                            />
                        </th>
                        <th style={thStyle}>상품 정보</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ㅇ</td>
                        <td>ㅇ</td>
                        <td>ㅇ</td>
                        <td>ㅇ</td>
                        <td>ㅇ</td>
                    </tr>
                </tbody>
            </Table>
            <h3 className="text-end mt-5 mb-4">총 주문금액 : 0원</h3>
            <div className="text-end">
                <Button
                    size="lg"
                    style={{
                        backgroundColor: " #b1c74ea1",
                        borderColor: "#afc454a1",
                    }}
                    onClick={``}
                >주문</Button>
            </div>
        </Container>
    </>
    )
}

export default App;