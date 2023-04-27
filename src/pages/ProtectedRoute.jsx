import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children, requireAdmin}){
    const { user } = useAuthContext();
   console.log(user,'나 라우터페이지임 유저정보 뜨는지 좀')
   if(user===undefined){
    return <>로딩중</>;
 } else if (user === null || (requireAdmin && user.isAdmin===false)) {
    return <Navigate to={"/"} replace={true} />;
 } else {
    return children;
 }
}

//로그인한 사용자가 있는지확인
//사용자가 어드민 권한이 있는지 확인
//requireAdmin이 true인 경우에는 로그인도 되어있어야하고, 어드민 권한도 가지고 있어야함\
//조건이 불충족할경우 / 상위 경로로 이동
//조건이 충족된경우 전달된 chidren을 보여줌