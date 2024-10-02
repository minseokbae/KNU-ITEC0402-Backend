import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div>
      HomePage
      <button onClick={handleClick}>로그인하기</button>
    </div>
  );
};

export default HomePage;
