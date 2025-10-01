
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row, Table } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function App({ user }) {

    const thStyle = { fontSize: '1.2rem' }; //테이블 헤더 스타일

    //보여주고자 하는 카트 상품 배열정보
    const [cartProducts, setCartProducts] = useState([]);

    const [orderTotalPrice, setOrderTotalPrice] = useState(0);


    //사용자의 정보가 바뀔때 화면을 렌더링 해주어야 합니다.
    // user? : Optional chaining (물음표를 적어주면 오류가 발생하지않고 undefined를 반환해 줍니다.)
    useEffect(() => {
        if (user && user?.id) {
            fetchCartProduct();
        }

    }, [user]);

    const navigate = useNavigate();


    //특정 고객이 장바구니에 담은 카트 상품 목록을 조회합니다.
    const fetchCartProduct = async () => {

        try {
            const url = `${API_BASE_URL}/cart/list/${user.id}`;
            const response = await
                axios.get(url);
            setCartProducts(response.data);
            console.log('카트상품 조회결과' + response.data);
            console.log(JSON.stringify(response.data, null, 2));

        } catch (error) {

            console.log('오류정보' + error);
            alert("");
            navigate('/product/list');
        }
    }

    //전체 선택 체크박스를 toggle 했습니다.
    //isAllCheck -> toggleAllCheckBox(event.target.checked) 함수호출시 매개변수 -> (true))
    const toggleAllCheckBox = (isAllCheck) => {
        setCartProducts((previous) => {
            //previous 현재 CartProducts 값을 의미합니다.
            const updatedProducts = previous.map((product) => ({
                ...product,
                checked: isAllCheck,
            }));

            //비동기적 렌더링 문제로 수정된  updatedProducts 항목을 매개변수로 넘겨야 정상적으로 동작합니다.
            refreshOrderTotalPrice(updatedProducts);

            return updatedProducts;
        });
    };

    //체크박스의 상태가 toggle 될때마다 전체요금을 다시 재 계산 하는 함수입니다. 
    const refreshOrderTotalPrice = (products) => {
        let total = 0;

        products.forEach((bean) => {
            if (bean.checked) {
                total += bean.price * bean.quantity
            }
        })

        setOrderTotalPrice(total);
    };

    //개별 체크박스를 클릭하였습니다.
    const toggleCheckBox = (cartProductId) => {
        console.log(`카트상품아이디: ${cartProductId}`);

        setCartProducts((prev) => {
            const updatedProducts = prev.map((product) =>
                product.cartProductId === cartProductId
                    ? { ...product, checked: !product.checked }
                    : product

            );

            refreshOrderTotalPrice(updatedProducts);
            return updatedProducts;
        });
    }

    //카트상품 목록 특정 상품의 구매 수량을 변경하였습니다.
    const changeQuantity = async (cartProductId, quantity) => {
        //NaN : Nat A Number
        if (isNaN(quantity)) {
            setCartProducts((prev) =>
                prev.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: 0 }
                        : product
                )
            );
        }
        try {
            //http://localhost:9000/cart/edit/235?quantity=10
            //스프링  wevconfig 클래스안의 addcorsMappings 메소드 참조
            const url = `${API_BASE_URL}/cart/edit/${cartProductId}?quantity=${quantity}`;
            //patch 동작은 전체가아닌 일부 데이터르 변경하고자 할때 사용됩니다.
            //put은 전체 덮어쓰기 patch는 일부만 변경
            const response = await axios.patch(url);

            console.log(response.data || "");
            //cartProducts의 수량정보를 갱신합니다.
            setCartProducts((prev) => {
                const updatedProducts = prev.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: quantity }
                        : product
                );

                refreshOrderTotalPrice(updatedProducts);
                return updatedProducts;
            });

        } catch (error) {
            console.log('카트 상품 수량 변경실패' + error);

        }
    }

    const deleteCartProduct = async (cartProductId) => {
        const isConfirmed = window.confirm('해당 카트 상품을 정말로 삭제하시겠습니까');

        if (isConfirmed) {
            console.log('삭제할 카트상품 아이디' + cartProductId)

            try {
                const url = `${API_BASE_URL}/cart/delete/${cartProductId}`;
                const response = await axios.delete(url);

                //카트상품 목록을 갱신하고, 요금을 다시 계산 합니다 .
                setCartProducts((prev) => {
                    const updatedProducts = prev.filter((bean) => bean.cartProductId !== cartProductId);

                    refreshOrderTotalPrice(updatedProducts)
                    return updatedProducts;
                })

                alert(response.data);

            } catch (error) {
                console.log('카트 상품 삭제 동작오류' + error);

            }
        } else {
            alert('상품 삭제를 취소하셨습니다.');
        }
    }

    //주문하기 버튼을 클릭하였습니다.
    const makeOrder = async () => {
        //체크박스가 on 상태인것만 필터링 합니다.
        const selectedProducts = cartProducts.filter((bean) => bean.checked);

        if (selectedProducts.length == 0) {
            alert('주문할 상품을 선택해주세요')
            return;
        }

        try {
            const url = `${API_BASE_URL}/order`
            //스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
            //주의) parameters 작성시 key의 이름은 OrderDto의 변수 이름과 동일하게 작성해야합니다.
            const parameters = {
                memberId: user.id,
                status: "PENDING",
                orderItems: selectedProducts.map((product) => ({
                    cartProductId: product.cartProductId,//카트상품번호
                    productId: product.productId,// 상품번호
                    quantity: product.quantity// 구매수량
                }))
            };
            console.log('주문할 데이터 정보');
            console.log(parameters);
            const response = await axios.post(url, parameters);
            alert(response.data)
            //방금 주문한 품목은 이제 장바구니 목록에서 제거 되어야합니다.


            setCartProducts((prev) => prev.filter((product) => !product.checked));

            /*
            setCartProducts((prevCartProducts) => {
                const updatedCart = prevCartProducts.filter((product) => {
                 return !product.checked; // 체크된 상품은 제거
                });

            return updatedCart; // 새로운 장바구니 배열로 상태 업데이트 });
            */

            alert('주문성공')


        } catch (error) {

        }


    }

    return (<>
        <Container className="mt-4">
            <h2 className="mt-4">
                <span style={{ color: '#805d12ff', fontSize: "2rem" }}>{user?.name}</span>
                <span style={{ fontSize: "1.3rem" }}>님의 장바구니</span>
            </h2>
            <Table striped bordered className="mt-4" >
                <thead>
                    <tr>
                        <th style={thStyle}>
                            <Form.Check
                                //체크박스의 체크상태를(boolean) toggleAllCheckBox 함수에 전달
                                type="checkbox"
                                label='전체 선택'
                                onChange={(event) => {
                                    toggleAllCheckBox(event.target.checked)
                                }}
                            />
                        </th>
                        <th style={thStyle}>상품 정보</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody >
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <tr >
                                {/* key={product.cartProductId} */}
                                <td className="text-center align-middle">
                                    <Form.Check
                                        type="checkbox"
                                        checked={product.checked}
                                        //어떤 체크인지 식별하기위해 cartProductsId를 넘깁니다.
                                        onChange={() => toggleCheckBox(product.cartProductId)} />
                                </td>
                                <td className="text-center align-middle">
                                    <Row>
                                        <Col xs={4}>
                                            <Image
                                                thumbnail
                                                src={`${API_BASE_URL}/images/${product.image}`}
                                                alt={product.name}
                                                width={`80`}
                                                height={`80`}
                                            ></Image>
                                        </Col>
                                        <Col xs={8} className="d-flex align-items-center"><span>{product.name}</span></Col>
                                    </Row>
                                </td>
                                <td className="text-center align-middle">
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        value={product.quantity}
                                        onChange={(event) => changeQuantity(product.cartProductId, parseInt(event.target.value))}
                                        style={{ width: '80px', margin: '0 auto' }}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    {(product.price * product.quantity).toLocaleString()}원</td>
                                <td className="text-center align-middle">
                                    <Button
                                        size="sm"
                                        style={{
                                            backgroundColor: " #b48355ff",
                                            borderColor: "#8b6643ff",
                                        }}
                                        onClick={() => deleteCartProduct(product.cartProductId)}
                                    >
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>장바구니가 비어 있습니다.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <h3 className="text-end mt-5 mb-4">총 주문금액 : {orderTotalPrice.toLocaleString()}원</h3>
            <div className="text-end">
                {/* 가운데정렬 text-center 우측정렬 text-end 좌측정렬 text-start */}
                <Button
                    size="lg"
                    style={{
                        backgroundColor: " #b1c74ea1",
                        borderColor: "#afc454a1",
                    }}
                    onClick={makeOrder}
                >주문하기</Button>
            </div>
        </Container>
    </>
    )
}

export default App;