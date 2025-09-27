import { Route, Routes } from "react-router-dom";

import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';
import ElementOne from './../pages/elementOne';
import ElementList from './../pages/elementList';
import HomePage from './../pages/HomePage';
import SignupPage from './../pages/signupPage';
import LoginPage from './../pages/loginPage';
import ProductList from './../pages/productList';
import ProductListInserForm from './../pages/ProductListInserForm';
import ProductListUpdateForm from './../pages/ProductListUpdateForm';
import ProductDetail from './../pages/ProductDetail';
import CartList from './../pages/CartList';

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
            <Route path='/product/list' element={<ProductList user={user} />} />
            <Route path='/product/insert' element={<ProductListInserForm user={user} />} />
            <Route path='/product/update/:id' element={<ProductListUpdateForm />} />
            {/* 기호":id"는 변수 처럼 동작하는 매개변수이고, ProductUpdateForm.js 파일에서 참조합니다.*/}

            <Route path='/product/detail/:id' element={<ProductDetail user={user} />} />
            <Route path='/cart/list' element={<CartList user={user} />} />
            {/* 미로그인시 장바구니와 구매하기 기능은선택이 불가능해야하므로 유저를 프롭스로 넘겨줍니다. */}

            <Route path='/Fruit' element={<FruitOne />} />
            <Route path='/Fruit/list' element={<FruitList />} />
            <Route path='/element' element={<ElementOne />} />
            <Route path='/element/List' element={<ElementList />} />
        </Routes>
    )
}

export default App;