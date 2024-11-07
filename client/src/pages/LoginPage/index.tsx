import {
  Button,
  Center,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import AuthContext from "../../context/AuthContext";

const LoginPage = () => {
  const [id, setId] = useState(""); // ID 상태 관리
  const [password, setPassword] = useState(""); // 비밀번호 상태 관리
  const [message, setMessage] = useState(""); // 오류 메시지 상태
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [show, setShow] = useState(false);

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

  // 회원가입 페이지로 이동
  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <Center>
      <Heading>FEMS 시스템</Heading>
      <form onSubmit={handleSubmit}>
        <Heading>로그인</Heading>
        <Input
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)} // ID 상태 업데이트
        />
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 상태 업데이트
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button type="submit">로그인</Button>
        {message && <p>{message}</p>} {/* 오류 메시지 또는 성공 메시지 표시 */}
      </form>
      <Button onClick={handleClick}>Sign Up</Button>
    </Center>
  );
};

export default LoginPage;
