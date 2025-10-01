import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

//useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅 입니다.
import { useNavigate } from "react-router-dom";


function App({ appName, user, handleLogout }) {

    const navigate = useNavigate();

    //user 프롭스를 사용하여 상단에 보이는 풀다운 메뉴를 적절히 분기 처리합니다.
    const renderMenu = () => {
        // user?.role : 자바스크립트의 optional chaining 문법입니다.
        // user가 null이면 undefined로 변환해주고 오류메세지를 별도로 반환하지않습니다.

        switch (user?.role) {
            case 'Admin':
                return (
                    <>
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={() => navigate(`/product/insert`)}>상품등록</Nav.Link>
                        {/* 관리자는 모든사람의 주문내역을 확인 */}
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={() => navigate(`/order/orderList`)}>주문내역</Nav.Link>
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={handleLogout}>로그아웃</Nav.Link>
                    </>
                )
            case 'User':
                return (
                    <>
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={() => navigate(`/cart/list`)}>장바구니</Nav.Link>
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={() => navigate(`/order/orderList`)}>주문내역</Nav.Link>
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={handleLogout}>로그아웃</Nav.Link>
                    </>
                )
            default:
                return (
                    <>
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={() => navigate(`/member/signup`)}>회원가입</Nav.Link>
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={() => navigate(`/member/login`)}>로그인</Nav.Link>
                    </>
                )
        }
    }

    return (
        <div>

            <Navbar style={{ backgroundColor: "#9e794183", cursor: 'url("/sora.png") 22 22, auto' }} variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand style={{ cursor: 'url("/sora.png") 22 22, auto' }} href='/' >{appName} {user?.name}</Navbar.Brand>
                    <Nav className="me-auto">
                        {/* 하이퍼링크 : Nav.Link는 다른 페이지로 이동할 때 사용됩니다.  */}
                        <Nav.Link style={{ cursor: 'url("/sora.png") 22 22, auto' }} onClick={() => {
                            navigate(`/product/list`, { state: { user } })
                        }}>상품 보기</Nav.Link>
                        {/* user에 따른 분기된 메뉴를 렌더링 */}
                        {renderMenu()}
                        <NavDropdown
                            title={`기본 연습`}
                        >
                            <NavDropdown.Item onClick={() => navigate(`/fruit`)} style={{ cursor: 'url("/sora.png") 22 22, auto' }}>과일 1개</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(`/fruit/list`)} style={{ cursor: 'url("/sora.png") 22 22, auto' }}>과일 목록</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(`/element`)} style={{ cursor: 'url("/sora.png") 22 22, auto' }}>품목 1개</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(`/element/list`)} style={{ cursor: 'url("/sora.png") 22 22, auto' }}>품목 여러개</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        </div>)
}

export default App;