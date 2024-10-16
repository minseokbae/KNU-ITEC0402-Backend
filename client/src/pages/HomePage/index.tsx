
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';



const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleClick = () => {

      if (isLoggedIn) {
        logout(); // 로그아웃
      } else {
        navigate('/login'); // 로그인 페이지로 이동
      }

  };
  

   

  return (
    <div>
      <h1>HomePage</h1>
      <button onClick={handleClick}>
        {isLoggedIn ? "로그아웃" : "로그인하기"}
      </button>
    </div>
  );
};

export default HomePage;
