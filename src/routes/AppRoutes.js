import { Route, Routes } from "react-router-dom";

import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';
import ElementOne from './../pages/elementOne';
import ElementList from './../pages/elementList';
import HomePage from './../pages/HomePage';
import SignupPage from './../pages/signupPage';
import LoginPage from './../pages/loginPage';
import ProductList from './../pages/productList';

//이 파일은 라우팅 정보를 담고 있는 파일 입니다.
//이러한 파일을 네트워크에서는 routing table 이라고 합니다.
function App({ user, handleLoginSuccess }) {
    //user : 사용자 정보를 저장하고있는객체
    //handleLoginSuccess : 로그인 성공시 동작할 액션
    return (
        <Routes>
            {/*path 프롭스는 요청정보 url / element 프롭스는 컴포넌트 이름*/}
            <Route path='/' element={<HomePage />} />
            <Route path='/member/signup' element={<SignupPage />} />
            <Route path='/member/login' element={<LoginPage setUser={handleLoginSuccess} />} />

            {/*로그인여부에따라서 상품목록 페이지가 다르게 보여야하므로 , user 프롭스를 넘겨 줍니다.*/}
            <Route path='/product/list' user={user} element={<ProductList />} />


            <Route path='/Fruit' element={<FruitOne />} />
            <Route path='/Fruit/list' element={<FruitList />} />
            <Route path='/element' element={<ElementOne />} />
            <Route path='/element/List' element={<ElementList />} />
        </Routes>
    )
}

export default App;