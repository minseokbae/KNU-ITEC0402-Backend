
import { useNavigate } from "react-router-dom";



const HomePage = () => {
  const navigate = useNavigate();


  

  const handleClick = () => {
      navigate("/login"); // 로그인 페이지로 이동
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
