import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

function App() {
    // call refresh endpoint
    const { loading } = useLoadingWithRefresh();

    return loading ? (
        <Loader message="Loading, please wait.." />
    ) : (
        <Router>
            <Navigation />
            <Routes>

                <Route exact path="/" element={<Home />} />

                <Route exact path="/authenticate" element={<Authenticate/>} />

                <Route exact path="/activate" element={<Activate/>} />

                <Route exact path="/rooms" element={<Rooms/>} />

                <Route exact path="/room/:id" element={<Room/>} />

            </Routes>
        </Router>
    );
}

{/* <Switch>
<GuestRoute path="/" exact>
    <Home />
</GuestRoute>
<GuestRoute path="/authenticate">
    <Authenticate />
</GuestRoute>
<SemiProtectedRoute path="/activate">
    <Activate />
</SemiProtectedRoute>
<ProtectedRoute path="/rooms">
    <Rooms />
</ProtectedRoute>
<ProtectedRoute path="/room/:id">
    <Room />
</ProtectedRoute>
</Switch> */}

const GuestRoute = ({ children, ...rest }) => {
    const { isAuth } = useSelector((state) => state.auth);
    return (
        <Route
            {...rest}
            render={({ location }) => {
                return isAuth ? (
                    <Navigate
                        to={{
                            pathname: '/rooms',
                            state: { from: location },
                        }}
                    />
                ) : (
                    children
                );
            }}
        ></Route>
    );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
    const { user, isAuth } = useSelector((state) => state.auth);
    return (
        <Route
            {...rest}
            render={({ location }) => {
                return !isAuth ? (
                    <Navigate
                        to={{
                            pathname: '/',
                            state: { from: location },
                        }}
                    />
                ) : isAuth && !user.activated ? (
                    children
                ) : (
                    <Navigate
                        to={{
                            pathname: '/rooms',
                            state: { from: location },
                        }}
                    />
                );
            }}
        ></Route>
    );
};

const ProtectedRoute = ({ children, ...rest }) => {
    const { user, isAuth } = useSelector((state) => state.auth);
    return (
        <Route
            {...rest}
            render={({ location }) => {
                return !isAuth ? (
                    <Navigate
                        to={{
                            pathname: '/',
                            state: { from: location },
                        }}
                    />
                ) : isAuth && !user.activated ? (
                    <Navigate
                        to={{
                            pathname: '/activate',
                            state: { from: location },
                        }}
                    />
                ) : (
                    children
                );
            }}
        ></Route>
    );
};

export default App;