import { Carousel, Container } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {

    //products 메인화면에 보여주고자하는 상품정보들 (파일이름에 빅사이즈 문자열이 들어있음)
    const [products, setProducts] = useState([]);

    const navigator = useNavigate();

    useEffect(
        () => {
            const url = `${API_BASE_URL}/product?filter=bigs`;
            axios
                .get(url)
                .then((response) => setProducts(response.data))
                .catch((error) => error);
        }, []);

    console.log("상품" + products);

    const detailView = (id) => {
        navigator(`/product/detail/${id}`);
    }

    return (
        <Container className="mt-4">
            <Carousel>
                {products.map(
                    (bean) =>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={`${API_BASE_URL}/images/${bean.image}`}
                                alt={bean.name}
                                onClick={() => { detailView(bean.id) }}
                            />
                            <Carousel.Caption>
                                <h3>{bean.name}</h3>
                                <p>{bean.description}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                )}
            </Carousel>
        </Container>
    )
}

export default App;