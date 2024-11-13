import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import AuthContext from "../../context/AuthContext";
import AuthSection from "../../components/AuthSection";

const LoginPage = () => {
  const [id, setId] = useState(""); // ID 상태 관리
  const [password, setPassword] = useState(""); // 비밀번호 상태 관리
  const [message, setMessage] = useState(""); // 오류 메시지 상태
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 로그인 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지

    try {
      // axios로 API 요청
      const response = await axios.post(
        "http://222.103.41.58:5326/auth/login",
        {
          id,
          password,
        }
      );

      // 서버 응답이 성공적일 경우
      if (response.status === 200) {
        const token = response.data.token; // 백엔드에서 받은 JWT 토큰
        // 로그인 성공 시 JWT 토큰을 로컬 스토리지에 저장
        login(token);
        setMessage("Login successful");
        navigate("/"); // 로그인 후 보호된 페이지로 이동
      }
    } catch (error) {
      // AxiosError 타입으로 단언하여 처리
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 서버에서 반환된 오류 메시지를 처리
          setMessage(error.response.data.message || "Login failed");
        } else if (error.request) {
          // 요청이 전송되었지만 응답이 없을 때 처리
          setMessage("No response from the server");
        } else {
          // 요청 설정 중에 발생한 오류 처리
          setMessage("Error: " + error.message);
        }
      } else {
        // Axios 외의 일반적인 오류 처리
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <AuthSection
      message={message}
      id={id}
      password={password}
      handleMove={() => navigate("/signup")}
      handleSubmit={handleSubmit}
      onChangeId={(e) => setId(e.target.value)}
      onChangePassword={(e) => setPassword(e.target.value)}
    />
  );
};

export default LoginPage;
