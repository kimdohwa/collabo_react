import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";



function App() {

    const [fruitList, setFruitList] = useState([]); // 넘어온 과일목록

    useEffect(() => {
        const url = `${API_BASE_URL}/Fruit/list`; //요청할 url
        axios
            .get(url, {})
            .then((response) => {
                setFruitList(response.data);
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
                    </tr>
                </thead>
                <tbody>
                    {fruitList.map((fruit) =>
                        <tr key={fruit.id}>
                            <td>{fruit.id}</td>
                            <td>{fruit.name}</td>
                            <td>{Number(fruit.price).toLocaleString()}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    )
}

export default App;