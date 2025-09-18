import { Route, Routes } from "react-router-dom";

import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';
import ElementOne from './../pages/elementOne';
import ElementList from './../pages/elementList';
import HomePage from './../pages/HomePage';
import SignupPage from './../pages/signupPage';

//이 파일은 라우팅 정보를 담고 있는 파일 입니다.
//이러한 파일을 네트워크에서는 routing table 이라고 합니다.
function App() {
    return (
        <Routes>
            {/*path 프롭스는 요청정보 url / element 프롭스는 컴포넌트 이름*/}
            <Route path='/' element={<HomePage />} />
            <Route path='/member/signup' element={<SignupPage />} />
            <Route path='/Fruit' element={<FruitOne />} />
            <Route path='/Fruit/list' element={<FruitList />} />
            <Route path='/element' element={<ElementOne />} />
            <Route path='/element/List' element={<ElementList />} />
        </Routes>
    )
}

export default App;