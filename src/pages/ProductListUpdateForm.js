import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap'
import { API_BASE_URL } from '../config/config';
import { useNavigate, useParams } from 'react-router-dom';
/*
상품수정페이지입니다.

기본키인 상품의 id 정보가 넘어옵니다. 
id를 사용하여 기존에 입력햇던 상품에 대한 정보를 미리 보여주어야 합니다. (useEffect 훅 사용)

step01
기존 등록 폼 양식을 복사합니다.
기존상품 정보 읽기
 ㄴ get방식을 사용하여 해당 상품의 정보를 읽어옵니다. 

테스트 시나리오
 특정상품에 대하여 수정버튼을 클릭하면 이전 상품 정보들을 입력란에 보여야합니다.
 
 다음 함수들은 상품 등록과 동일합니다.
    - ControlChange 함수
        각 컨트롤에 대한 change 이벤트 함수를 구현합니다.
        컨트롤(input type) : 이름, 가격, 재고, 상품설명
        컨트롤(combo type) : 카테고리

    - FileSelect 함수
        업로드할 이미지 선택에 대한 이벤트함수를 구현합니다.
        FileReader API를 사용하여 해당 이미지를 Base64 인코딩 문자열로 변환작업을 합니다.

insert->update 로 변경
컨트롤에 입력된내용 전송하기  
axios.post-> axios.put 으로 변경합니다. 

파일 업로드시 유의사항
    전송 방식은 post로 전송합니다.
    input 양식의type='file'로 작성하셔야합니다.

테스트 시나리오
    이미지 폴더에 product_로 시작하는 새로운 이미지가 추가되어야한다
    데이터 베이스에 이전 행의 정보가 수정 되어야한다
    상품목록 수정된 정보가 보여야합니다.

미결사항
    과거에 업로드했던 이전 이미지를 삭제하여야합니다.



*/

function App({ user }) {

    const { id } = useParams();
    console.log(`수정할 상품번호 :${id}`)


    const comment = "상품 수정"

    const initialValue = { name: "", price: "", category: "", stock: "", image: "", description: "" };// 상품 객체 정보

    //product는 백엔드에게 넘겨줄 상품 등록 정보를 담고 있습니다.
    const [product, setProduct] = useState(initialValue);

    //id를 이용하여 기존에 입력한 상품정보 가져오기
    useEffect(() => {
        const url = `${API_BASE_URL}/product/update/${id}`;

        axios
            .get(url)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.log(`상품번호 ${id}번 오류발생:${error}`);
                alert(`해당상품을 읽어올수 없습니다.`);
            })

    }, [id]);

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

        if (product.category === "-") {
            alert("카테고리 선택해주세요");
            return; //수정 중단 ;
        }
        try {
            const url = `${API_BASE_URL}/product/update/${id}`

            //깊은 복사 : 왼쪽이 오른쪽의 복사본을 가집니다.
            const parameters = product;
            // 얕은 복사 : 두 변수가 동일한 곳을 참조합니다.
            // const parameters = {...product};

            //'Content-Type(Mime Type) : 문서의 종류가 어떠한 종류인지를 알려주는 항목
            //이 문서는 json 형식의 파일 입니다.
            const config = { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.put(url, parameters, config);
            //axios가 자동으로 제이슨으로 변환해서 보냄
            //수정하고자할때 put 사용  

            console.log(`${comment}:[${response.data}]`)
            alert(`${comment} 완료`);
            //상품등록후 입력컨트롤은 모두 초기화 되어야합니다.
            setProduct(initialValue);
            //등록후 상품목록 페이지로 이동합니다.
            navigate(`/product/list`);

        } catch (error) {

            console.log(`${error.response?.data}`)
            console.log(`${error.response.status}`)

            console.log(`오류내용:${error}`)
            alert(`${comment} 실패`);

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