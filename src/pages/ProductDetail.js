/*
상품상세보기
    전체화면을 좌 우측을 1대2로 분리합니다. 
    왼쪽은 상품의 이미지 정보, 오른쪽은 상품의 정보 및 장바구니와 구매하기 버튼을 만듭니다.

    */

import { Container, Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function App({ user }) {

    //------------------------ 첫 화면 --------------------------------------

    const { id } = useParams(); //id 파라미터 챙기기
    const [product, setProduct] = useState(null); // 백엔드에서 넘어온 상품 정보

    const navigate = useNavigate();

    useEffect(() => {
        const url = `${API_BASE_URL}/product/detail/${id}`;

        //파라미터 id가 갱신이 되면 화면을 다시 rendering 시킵니다.
        axios.get(url)
            .then((response) => {
                setProduct(response.data)
                setLoding(false); // 상품 정보를 읽어왔습니다.
            })
            .catch((error) => {
                console.log("리액트 오류 내용" + error)
                alert("오류발생");
                navigate(-1) // 이전페이지로 이동하기
            })
    }, [id])



    //----------------------마우스-------------------------------------------------------------
    const [clicks, setClicks] = useState([]);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newClick = { id: Date.now(), x, y };

        setClicks(prev => [...prev, newClick]);

        setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== newClick.id));
        }, 500);
    };

    //---------------------장바구니 관련 코딩들----------------------------

    const [quantity, setQuantity] = useState(0);

    //수량 체인지 관련 이벤트 핸들러 함수 정의
    const QuantityChange = (event) => {
        //parseInt() 메소드는 정수형으로 생긴 문자열을 정수값으로 변환해줍니다.
        const newValue = parseInt(event.target.value);
        setQuantity(newValue);
    }

    //사용자가 수량을 입력하고 장바구니 버튼을 클릭하였씁니다.
    const addToCart = async () => {

        if (quantity < 1) {
            alert(`구매수량은 1개 이상이여야 합니다.`);
            return
        }

        try {
            //카트에 담을 내용은 회원 아이디, 상품아이디 , 수량입니다. 
            //backend 영역에서 cartproductDto 라는 클래스와 매치됩니다.

            const url = `${API_BASE_URL}/cart/insert`;
            const parameters = {
                memberId: user.id,
                productId: product.id,
                quantity: quantity
            };
            const response = await axios.post(url, parameters)

            alert(`${product.name} ${quantity}개를 장바구니에 담았습니다.`);
            navigate(`/product/detail/${product.id}`)
        } catch (error) {
            console.log('오류발생' + error);

            if (error.response) {
                alert('장바구니 추가 실패');
                console.log(error.response.data);
            }
        }


    }



    //------------------------로딩 ----------------------------------------

    //로딩 상태를 의미하는 state로, 값이 true이면 현재 로딩중입니다.
    const [loading, setLoding] = useState(true);

    //아직 backend 에서 읽어오지 못한 경우를 대비한 코딩입니다.
    if (loading === true) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 읽어오는 중입니다.
                </h3>
            </Container>
        )
    }

    //상품에 대한 정보가 없는 경우를 대비한 코딩입니다.
    if (!product) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 찾을 수 없습니다.
                </h3>
            </Container>
        )
    }

    //주문하기 버튼을 클릭하였습니다.
    const buyNow = async () => {
        if (quantity < 1) {
            alert('수량을 1개 이상 선택해주세요.')
            return;
        }
        console.log("성공");

        try {
            const url = `${API_BASE_URL}/order`
            //스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
            //주의) parameters 작성시 key의 이름은 OrderDto의 변수 이름과 동일하게 작성해야합니다.
            //상세보기 페이지에서는 무조건 1종류의 상품만 주문할수있습니다.
            const parameters = {
                memberId: user.id,
                status: "PENDING",
                orderItems: [{
                    productId: product.id,// 상품번호
                    quantity: quantity// 구매수량
                }]
            };
            console.log('주문할 데이터 정보');
            console.log(parameters);
            const response = await axios.post(url, parameters);
            console.log(response.data)
            alert(`${product.name} ${quantity} 개를 주문하였습니다.`)
            navigate("/product/list");

        } catch (error) {
            alert('주문실패' + error);
        }
    }


    return (<>
        <Container className="my-4">
            <Card onClick={handleClick} style={{ position: 'relative' }}>
                {clicks.map((click) => (
                    <span
                        key={click.id}
                        className="click-effect"
                        style={{ left: click.x, top: click.y }}
                    >🔆</span>
                ))}
                <Row className="g-0">
                    {/* 좌측상품 이미지 */}
                    <Col md={5}>
                        <Card.Img
                            src={`${API_BASE_URL}/images/${product.image}`}
                            alt={`${product.name}`}
                            variant="top"
                            style={{ width: "100%", height: "400px", padding: "20px" }}
                        />
                    </Col>
                    {/* 우측 상품 정보 및 구매 관련 버튼 이미지 */}
                    <Col md={7}>
                        <Card.Body>
                            <Card.Title className="fd-3"><h3>{product.name}</h3></Card.Title>
                            <Table striped>
                                <tbody>
                                    <tr>
                                        <td className="text-center">이름</td>
                                        <td>{product.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">가격</td>
                                        <td>{product.price}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">카테고리</td>
                                        <td>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">재고</td>
                                        <td>{product.stock}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">설명</td>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">등록일자</td>
                                        <td>{product.inputdate}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            {/* 구매 수량 입력란
                            as={Row}는 렌더링시 기본값인 <div>말고 Row로 렌더링하도록 도와줍니다. */}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Col xs={2} className="text-center">
                                    {/* 구매수량은 최소 1 이상으로 설정했고,user모드에 따라서 분기코딩했습니다. */}
                                    <strong>구매 수량</strong>
                                </Col>
                                <Col xs={2} className="text-center">
                                    <Form.Control
                                        type="number"
                                        min='1'
                                        disabled={!user}
                                        value={quantity}
                                        onChange={QuantityChange}>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            {/* 버튼 (이전 목록, 장바구니, 구매하기) */}
                            <div className="d-flex justify-content-center mt-3">
                                <Button
                                    style={{ height: '48px', display: 'inline-flex', cursor: 'url("/sora.png") 22 22, auto', alignItems: 'center', justifyContent: 'center' }}
                                    variant="outline-secondary"
                                    className="me-3 px-4"
                                    href="/product/list"
                                >이전 목록</Button>
                                <Button
                                    style={{ height: '48px', display: 'inline-flex', cursor: 'url("/sora.png") 22 22, auto', alignItems: 'center', justifyContent: 'center', backgroundColor: "#b1c74ea1", borderColor: "#9baf43a1", color: "#ffffffff" }}
                                    // variant="success"
                                    className="me-3 px-4"
                                    onClick={() => {
                                        if (!user) {
                                            alert('로그인이 필요한 서비스입니다.');
                                            navigate('/member/login')
                                        } else {
                                            addToCart();
                                        }
                                    }}
                                >장바구니</Button>
                                <Button
                                    style={{ height: '48px', display: 'inline-flex', cursor: 'url("/sora.png") 22 22, auto', alignItems: 'center', justifyContent: 'center', backgroundColor: "#68320ea1", borderColor: "#68320ea1", color: "#ffffffff" }}
                                    variant="warning"
                                    className="me-3 px-4"
                                    onClick={() => {
                                        if (!user) {
                                            alert('로그인이 필요한 서비스입니다.');
                                            return navigate('/member/login');
                                        } else {
                                            buyNow();
                                        }
                                    }}
                                >주문하기</Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    </>
    )
}

export default App;