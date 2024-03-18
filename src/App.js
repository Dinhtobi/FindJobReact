import './assets/App.css';
import config from 'config.json';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SignInSide from './pages/SignInSide';
import SignUp from './pages/SignUp';
import { UserContextProvider, useUserContext } from 'contexts/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from 'pages/Home';
import CreateJob from 'pages/CreateJobs'
import './index.css'
import Main from 'pages/Main';
import MyJob from 'pages/MyJob';
import Salary from 'pages/Salary';
import UpdateJob from 'pages/UpdateJobs';
import DetailJob from 'pages/DetailJob';
// Router Protect layer

const client_id = "439847719014-pkff4061t2kdmokun7m3iggr6isgpea6.apps.googleusercontent.com"
const ProtectedRoute = ({
  user, // kiểm tra đăng nhập
  role, // kiểm tra vai trò
  // redirectPath = '',
  children
}) => {
  if (user === null) {
    alert('Chưa đăng nhập tài khoản. Điều hướng đến trang đăng nhập.');
    return <Navigate to={'/'} replace/>
  };
  if (role !== user.role) {
    alert('Không được phép truy cập.');
    window.history.back();
  }
  else
    return children ? children : <Outlet />;
};
// URL Router
const ReactRouter = () => {
  const [user,] = useUserContext();

  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập */}
        <Route index element={<SignInSide />} />
        <Route path='*' element={<h1>404 Not Found</h1>} />
        {/* Chưa đăng kí thì role = null */}
        <Route path='signup' element={<ProtectedRoute user={user} role={'null'}><SignUp /></ProtectedRoute>} />
        {/* Sau khi đăng nhập */}
        <Route path='/seeker' element={
          <ProtectedRoute user={user} role={'seeker'}>
              <Main/>
          </ProtectedRoute>
          
        }>
          <Route path='' element={
          <ProtectedRoute user={user} role={'seeker'}>
              <Home/>
          </ProtectedRoute>}/>
          <Route path='my-job' element={
          <ProtectedRoute user={user} role={'seeker'}>
              <MyJob/>
          </ProtectedRoute>}/>
          <Route path='salary' element={
          <ProtectedRoute user={user} role={'seeker'}>
              <Salary/>
          </ProtectedRoute>}/>
          <Route path=':id' element={
          <ProtectedRoute user={user} role={'seeker'}>
              <DetailJob/>
          </ProtectedRoute>}/>
        </Route>
            {/* employeer */}
        <Route path='/employeer' element={
          <ProtectedRoute user={user} role={'employer'}>
              <Main/>
          </ProtectedRoute>
        }>
          <Route path='' element={
          <ProtectedRoute user={user} role={'employer'}>
              <Home/>
          </ProtectedRoute>}/>
          <Route path='post-job' element={
          <ProtectedRoute user={user} role={'employer'}>
              <CreateJob/>
          </ProtectedRoute>}/>
          <Route path='my-job' element={
          <ProtectedRoute user={user} role={'employer'}>
              <MyJob/>
          </ProtectedRoute>}/>
          <Route path='salary' element={
          <ProtectedRoute user={user} role={'employer'}>
              <Salary/>
          </ProtectedRoute>}/>
          <Route path='edit-job/:id' element={
          <ProtectedRoute user={user} role={'employer'}>
              <UpdateJob/>
          </ProtectedRoute>}/>
          <Route path=':id' element={
          <ProtectedRoute user={user} role={'employer'}>
              <DetailJob/>
          </ProtectedRoute>}/>
        </Route>
            
        </Routes>
        
    </BrowserRouter>
  )
}

function App() {
  return (
    <GoogleOAuthProvider clientId={client_id}>
      <UserContextProvider>
        <ReactRouter/>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
