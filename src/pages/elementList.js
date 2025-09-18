import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";



function App() {

    const [elementList, setElementList] = useState([]); // 넘어온 과일목록

    useEffect(() => {
        const url = `${API_BASE_URL}/element/list`; //요청할 url
        axios
            .get(url, {})
            .then((response) => {
                setElementList(response.data);
            });

    }, []);





    return (
        <>
            <Table hover style={{ margin: '15px' }}>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>단가</th>
                        <th>카테고리</th>
                        <th>재고</th>
                        <th>이미지</th>
                        <th>설명</th>
                    </tr>
                </thead>
                <tbody>
                    {elementList.map((element) =>
                        <tr key={element.id}>
                            <td width="5%">{element.id}</td>
                            <td>{element.name}</td>
                            <td>{Number(element.price).toLocaleString()}</td>
                            <td width="10%">{element.category}</td>
                            <td width="5%">{element.stock}</td>
                            <td><img className="a" src={`/${element.image}`} /></td>
                            <td>{element.description}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    )
}

export default App;