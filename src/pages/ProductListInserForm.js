import axios from 'axios';
import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap'
import { API_BASE_URL } from '../config/config';
import { useNavigate } from 'react-router-dom';
/*
상품등록이 회원가입과 다른 점은 "파일 업로드"를 한다는 것 입니다.

step01
폼양식을 만듭니다.
각 컨트롤에 대한 change 이벤트 함수를 구현합니다.(ControlChange 함수)
컨트롤(input type) : 이름, 가격, 재고, 상품설명
컨트롤(combo type) : 카테고리
FileSelect 함수
업로드할 이미지 선택에 대한 이벤트함수를 구현합니다.
FileReader API를 사용하여 해당 이미지를 Base64 인코딩 문자열로 변환작업을 합니다.

파일 업로드시 유의사항
전송 방식은 post로 전송합니다.
input 양식의type='file'로 작성하셔야합니다.
*/

function App() {
    const comment = "상품 등록"

    const initialValue = { name: "", price: "", category: "", stock: "", image: "", description: "" };// 상품 객체 정보

    //product는 백엔드에게 넘겨줄 상품 등록 정보를 담고 있습니다.
    const [product, setProduct] = useState(initialValue);

    //폼 양식에서 어떠한 컨트롤의 값이 변경되었습니다.
    const ControlChange = (event) => {
        //event객체는 change 이벤트를 발생시킨 폼 컨트롤 입니다.
        const { name, value } = event.target;
        //const name = event.target.name;
        // const value = event.target.value;

        console.log(`값이 바뀐 컨트롤:${name}값:${value}`);

        //전개 연산자를 사용하여 이전 컨트롤의 값들도 보존하도록 합니다.
        setProduct({ ...product, [name]: value });
        //예: name="price"이면 product.price만 변경됨
    }

    const fileSelect = (event) => {
        console.log("그림선택")
        const { name, files } = event.target;
        console.log(event.target.files)
        //자바 스크립트는 모든 항목들을 배열로 취급하는 성질을 가지고 있습니다.
        const file = files[0];

        //FileReader는 웹브라우저에서 제공해주는 내장 객체로, 파일 읽기에 사용가능합니다.
        //자바 스크립트에서 파일을 읽고 이를 데이터로 처리하는데 사용합니다.
        const reader = new FileReader();
        //readAsDataURL 함수는 file 객체를 문자열 형태로 반환하는 역할을 합니다
        //         | 메서드                       | 설명                                  |
        // | ------------------------- | ----------------------------------- |
        // | `readAsText(file)`        | 파일을 텍스트로 읽음 (txt, json 등)           |
        // | `readAsDataURL(file)`     | 파일을 Base64 문자열로 읽음 (이미지 미리보기 등에 사용) |
        // | `readAsArrayBuffer(file)` | 이진 데이터로 읽음 (바이너리 처리 등)              |

        reader.readAsDataURL(file);

        //읽기 작업이 성공하면 자동으로 동작하는 이벤트 핸들러 함수
        reader.onload = () => {
            const result = reader.result;
            console.log(result);

            //해당 이미지는 Base64 인코딩 문자열 형식으로 state에 저장합니다.
            setProduct({ ...product, [name]: result })
            //특정 속성만 바꾸고 나머지는 그대로 유지하는 코드
        }
    }

    const navigate = useNavigate();

    const SubmitAction = async (event) => {
        event.preventDefault();
        try {
            const url = `${API_BASE_URL}/product/insert`
            //깊은 복사 : 왼쪽이 오른쪽의 복사본을 가집니다.
            const parameters = product;
            // 얕은 복사 : 두 변수가 동일한 곳을 참조합니다.
            // const parameters = {...product};

            //'Content-Type(Mime Type) : 문서의 종류가 어떠한 종류인지를 알려주는 항목
            //이 문서는 json 형식의 파일 입니다.
            const config = { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.post(url, parameters, config);
            //axios가 자동으로 제이슨으로 변환해서 보냄

            console.log(`상품등록:[${response.data}]`)
            alert('상품 등록 완료');
            //상품등록후 입력컨트롤은 모두 초기화 되어야합니다.
            setProduct(initialValue);
            //등록후 상품목록 페이지로 이동합니다.
            navigate(`product/list`);

        } catch (error) {
            console.log(`오류내용:${error}`)
            alert("상품등록실패");

        }
    }


    return (
        <Container>
            <h1>{comment}</h1>
            <Form onSubmit={SubmitAction}>
                <Form.Group >
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                        className="mb-4"
                        type="text"
                        placeholder="이름을(를) 입력해주세요."
                        name="name"
                        value={product.name}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group >
                <Form.Group >
                    <Form.Label>가격</Form.Label>
                    <Form.Control
                        className="mb-4"
                        type="text"
                        placeholder="가격을(를) 입력해주세요."
                        name="price"
                        value={product.price}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group >
                <Form.Label>카테고리</Form.Label>
                <Form.Select
                    aria-label="Default select example"
                    className="mb-4"
                    name="category"
                    onChange={ControlChange}
                    required
                >
                    {/*주의) 자바의 Enum 열거형 타입에서 사용한 대문자를 반드시 사용해야 합니다.*/}
                    <option value="-">--카테고리를 선택해주세요</option>
                    <option value="BREAD">빵</option>
                    <option value="BEVERAGE">음료수</option>
                    <option value="CAKE">케이크</option>
                </Form.Select>
                <Form.Group >
                    <Form.Label>재고</Form.Label>
                    <Form.Control
                        className="mb-4"
                        type="text"
                        placeholder="재고을(를) 입력해주세요."
                        name="stock"
                        value={product.stock}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group >
                {/* 이미지는 type="file"이여야하고, 이벤트 처리 함수를 별개로 따로 만들도록합니다. */}
                <Form.Group >
                    <Form.Label>이미지</Form.Label>
                    <Form.Control
                        className="mb-4"
                        type="file"
                        name="image"
                        onChange={fileSelect}
                        required
                    />
                </Form.Group >
                <Form.Group >
                    <Form.Label>상품 설명</Form.Label>
                    <Form.Control
                        className="mb-4"
                        type="text"
                        placeholder="상품설명을(를) 입력해주세요."
                        name="description"
                        value={product.description}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group >
                <Button variant="primary" type='submit' size="lg">
                    {comment}
                </Button>
            </Form>
        </Container>
    )
}

export default App;