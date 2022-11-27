import React, {Suspense, lazy} from "react"
import { Link , Route,Routes} from "react-router-dom";

// import Home from '@/pages/home';
// import Test from '@/pages/test';

// 代替面的 引入  使用路由懒加载
const Home = lazy(() => import (/* webpackChunkName: 'home' */ "./pages/home"))
const Test = lazy(() => import (/* webpackChunkName: 'home' */ "./pages/test"))

function App() {
    return <>
    <h1>react webpack</h1>
    <ul>
        <li><Link to='/home'></Link></li>
        <li><Link to='/test'></Link></li>
    </ul>
    {/* <Routes>
        <Route path="/home" element={<Home/>}> </Route>
        <Route path="/test" element={<Test/>}> </Route>
    </Routes> */}
    <Suspense fallback={<div>loading...</div>}>
    <Routes>
        <Route path="/home" element={<Home/>}> </Route>
        <Route path="/test" element={<Test/>}> </Route>
    </Routes>
    </Suspense>
    
    </>
}


export default App