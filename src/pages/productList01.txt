import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";

/*
step 01
단순히 모든 상품 목록을 상품 아이디 역순으로 읽어서 화면에 전체를 보여줍니다.
하나의 행에 3개의 열씩 보여줍니다.
필드 검색과 페이징 기능은 구현하지않았습니다.

*/

function App({ user }) {

    //스프링에서 넘겨받은 상품목록
    const [products, setProducts] = useState([]);

    //스프링 부트에 상품 목록을 요청하기
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`
        axios.get(url, {})
            .then((response) => {
                console.log("응답받은 데이터 :" + response);
                setProducts(response.data);
            })
            .catch(error => {
                console.error('데이터 가져오기 실패:', error);
            })

    }, []);


    return (<>
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>

            {/* 필드 검색 영역 */}

            {/* 자료 보여주는 영역 */}
            <Row>
                {/* products는 상품배열, item은 상품 1개를 의미 */}
                {products.map((item) => (
                    <Col key={item.id} md={4} className="mb-4">
                        <Card style={{ cursor: 'pointer' }}>
                            <Card.Img
                                variant="top"
                                src={`${API_BASE_URL}/images/${item.image}`}
                                alt={item.name}
                                style={{ width: '100%', height: '200px' }}
                            />
                            <Card.Title style={{ margin: '20px' }}>{item.name}({item.id})</Card.Title>
                            <Card.Text style={{ marginLeft: '20px' }} > 가격 : {item.price.toLocaleString()}원</Card.Text>
                            <Card.Body></Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* 페이징 처리 영역 */}

        </Container >
    </>
    )
}

export default App;