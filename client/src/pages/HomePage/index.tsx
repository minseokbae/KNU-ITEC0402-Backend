
import { useNavigate } from "react-router-dom";
import React from "react";


const HomePage = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const handleClick = () => {
      navigate("/login"); // 로그인 페이지로 이동
  };
  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token');
    // isLoggedIn 상태 false로 설정
    setIsLoggedIn(false);
    // 로그아웃 후 메인 페이지로 이동
    navigate('/');
  };

   

  return (
    <div>
      HomePage
      <button onClick={handleClick}>
        {"로그인하기"}
      </button>
    </div>
  );
};

export default HomePage;
