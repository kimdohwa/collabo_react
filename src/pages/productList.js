import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    //이함수는 관리자 모드일때 보여주는 수정과 삭제를 위한 버튼을 생성해주는 함수입니다.
    const makeAdminButtons = (item, user, navigate) => {
        if (user?.role === 'Admin')

            return (
                <div className="d-flex justify-content-center">
                    <Button
                        variant="warning"
                        className="mb-2"
                        size="sm"
                        onClick={(event) => {
                            event.stopPropagation();

                            alert('수정');
                        }}
                    >수정
                    </Button>
                    <Button
                        variant="danger"
                        className="mb-2"
                        size="sm"
                        onClick={async (event) => {
                            event.stopPropagation();

                            const isDelete = window.confirm(`'${item.name}' 상품 삭제를 하시겠습니까?`);


                            if (isDelete === false) {
                                alert(`'${item.name}' 상품 삭제를 취소하셨습니다.`);
                                return;
                            }

                            try {// 상품을 삭제후 다시 상품 목록 페이지를 보여줍니다.
                                await axios.delete(`${API_BASE_URL}/product/delete/${item.id}`);
                                alert(`${item.name} 상품이 삭제되었습니다.`)
                                //alert때문에 모달창생성되어 통신끊김
                                navigate(`/product/list`)
                                // //새로고침후 돌아가고싶은 페이지 입력
                                // window.location.reload();  // 페이지 강제 새로고침
                                // 전체 페이지를 새로고침하는거라 느릴수있음
                                setProducts(prev => prev.filter(p => p.id !== item.id));
                                //삭제된 id를 배제하고 상품 목록 state를 다시갱신합니다.

                            } catch (error) {
                                console.log(error);
                                alert(`상품삭제실패 : ${error.response?.data || error.message}`)
                            }
                        }}>삭제
                    </Button>
                </div>
            )
    }

    return (<>
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>
            {user?.role === 'Admin' && (
                <Link to={`/product/insert`}>
                    <Button variant="primary" className="mb-3">상품등록</Button>
                </Link>)}

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
                            <Card.Body>
                                <table style={{ width: "100%", borderCollapse: "collapse", border: "none" }}>
                                    {/* borderCollapse: "collapse 각셀의 테두리를 합칠것인지, 별개로 보여줄지를 설정하는 속성*/}
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "70%", padding: '4px', border: "none" }}><Card.Title>{item.name}({item.id})</Card.Title>
                                            </td>
                                            {/*textAlign 수평정렬방식 지정, verticalAlign 수직정렬 방식지정 rowSpan 속성은 행방향으로 병합시 사용 ↔ colspan */}
                                            {user?.role === 'Admin' && (
                                                <td rowSpan={2} style={{ padding: '4px', border: "none", textAlign: 'center', verticalAlign: 'middle' }}>{makeAdminButtons(item, user, navigate)}
                                                </td>
                                            )}
                                        </tr>
                                        <tr>
                                            <td style={{ width: "70%", padding: '4px', border: "none" }}>
                                                <Card.Text> 가격 : {item.price.toLocaleString()}원</Card.Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>


                            </Card.Body>
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