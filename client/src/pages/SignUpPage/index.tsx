import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthSection from "../../components/AuthSection";

const SignUpPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // 응답 메시지 표시
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지

    // 유효성 검사 (비밀번호와 확인 비밀번호 일치 여부)
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      // 회원가입 API 호출
      const response = await fetch("http://222.103.41.58:5326/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });

      // 응답 처리
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // 성공 메시지 설정
        navigate("/");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message); // 오류 메시지 설정
      }
    } catch (error) {
      setMessage("Failed to register. Please try again.");
    }
  };

  return (
    <AuthSection
      isLogin={false}
      message={message}
      id={id}
      password={password}
      passwordConfirm={confirmPassword}
      onChangePasswordConfirm={(e) => setConfirmPassword(e.target.value)}
      handleMove={() => navigate("/signup")}
      handleSubmit={handleSubmit}
      onChangeId={(e) => setId(e.target.value)}
      onChangePassword={(e) => setPassword(e.target.value)}
    />
  );
};

export default SignUpPage;
