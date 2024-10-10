
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth'; // Firebase signOut 함수 임포트
import { auth } from '../../firebase'; // Firebase 인증 객체 임포트

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); //Context에서 로그인 상태를 가져옴

   // 로그아웃 함수
   const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User has been logged out');
      navigate('/'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleClick = () => {
    if (user) {
      handleLogout(); // 로그아웃 처리
    } else {
      navigate("/login"); // 로그인 페이지로 이동
    }
  };

   

  return (
    <div>
      HomePage
      <button onClick={handleClick}>
        {user ? "로그아웃" : "로그인하기"}
      </button>
    </div>
  );
};

export default HomePage;
