import { Nav, NavDropdown } from "react-bootstrap";

//useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅 입니다.
import { useNavigate } from "react-router-dom";


function App() {
    const navigate = useNavigate();

    return (
        <>
            {/* 하이퍼링크 : Nav.Link는 다른 페이지로 이동할때 사용합니다. */}
            <Nav.Link>상품 보기</Nav.Link>
            <NavDropdown title={`기본 연습`}>
                <NavDropdown.Item onClick={() => navigate(`/Fruit`)}>과일 1개</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate(`/Fruit/list`)}>과일 목록</NavDropdown.Item>
            </NavDropdown>
        </>)
}

export default App;