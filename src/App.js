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
import MainRecruiter from 'pages/MainRecruiter';
import MyJob from 'pages/MyJob';
import Salary from 'pages/MyFavourite';
import UpdateJob from 'pages/UpdateJobs';
import DetailJob from 'pages/DetailJob';
import Company from 'pages/Company';
import DetailCompany from 'pages/DetailCompany';
import Profile from 'pages/Profile';
import HomeRecruiter from 'pages/HomeRecruiter';
import MyJobRecruiter from 'pages/MyJobRecruiter';
import JobApply from 'pages/JobApply';
import CvApply from 'pages/CvApply';
import RecommendJob from 'pages/RecommendJob';
import RecommendCandidate from 'pages/RecommendCandidate';
import MainAdmin from 'pages/MainAdmin';
import Statistic from 'pages/statistic';
import CandidateManager from 'pages/CandidateManager';
import RecruiterManager from 'pages/RecruiterManager';
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
    return <Navigate to={'/home'} replace/>
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
        {/* Trang chính */}
        <Route path='/home' element={<Main/>}>
            <Route path='' element={
              <Home/>
            }/>
            <Route path='profile' element={
            <ProtectedRoute user={user} role={'candidate'}>
                <Profile/>
            </ProtectedRoute>}/>
            <Route path='my-job' element={
            <ProtectedRoute user={user} role={'candidate'}>
                <MyJob/>
            </ProtectedRoute>}/>
            <Route path='my-favourite' element={
            <ProtectedRoute user={user} role={'candidate'}>
                <Salary/>
            </ProtectedRoute>}/>
            <Route path='job/:id' element={
           
                <DetailJob/>}
            />
            <Route path='job-recommend' element={
            <ProtectedRoute user={user} role={'candidate'}>
                <RecommendJob/>
            </ProtectedRoute>}/>
            <Route path='company' element={
                <Company/>
            }/>
            <Route path='company/:id' element={
                <DetailCompany/>
            }/>
            <Route path='company/top/:size' element={
                <Company/>
          }/>
        </Route>
        <Route path='*' element={<h1>404 Not Found</h1>} />

        {/* Chưa đăng kí thì role = null */}
        <Route path='signup' element={<ProtectedRoute user={user} role={'null'}><SignUp /></ProtectedRoute>} />

        {/* Sau khi đăng nhập */}

            {/* employeer */}
        <Route path='/recruiter' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <MainRecruiter/>
          </ProtectedRoute>
        }>
          <Route path='' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <HomeRecruiter/>
          </ProtectedRoute>}/>
          <Route path='post-job' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <CreateJob/>
          </ProtectedRoute>}/>
          <Route path='my-job/:isShow' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <MyJobRecruiter/>
          </ProtectedRoute>}/>
          <Route path='edit-job/:id' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <UpdateJob/>
          </ProtectedRoute>}/>
          <Route path='cv-apply' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <JobApply/>
          </ProtectedRoute>}/>
          <Route path='cv-apply/:id' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <CvApply/>
          </ProtectedRoute>}/>
          <Route path='recommend-candidate/:id' element={
          <ProtectedRoute user={user} role={'recruiter'}>
              <RecommendCandidate/>
          </ProtectedRoute>}/>
        </Route>
            

        <Route path='/admin' element={
          <ProtectedRoute user={user} role={'admin'}>
              <MainAdmin/>
          </ProtectedRoute>
        }>
          <Route path='' element={
          <ProtectedRoute user={user} role={'admin'}>
              <Statistic/>
          </ProtectedRoute>}/>
          
          <Route path='candidate' element={
          <ProtectedRoute user={user} role={'admin'}>
              <CandidateManager/>
          </ProtectedRoute>}/>
          <Route path='recruiter' element={
          <ProtectedRoute user={user} role={'admin'}>
              <RecruiterManager/>
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
