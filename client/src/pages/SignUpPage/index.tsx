import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";

const SignUpPage = () => {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // 응답 메시지 표시
  const [show, setShow] = useState(false);


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
      } else {
        const errorData = await response.json();
        setMessage(errorData.message); // 오류 메시지 설정
      }
    } catch (error) {
      setMessage("Failed to register. Please try again.");
    }
  };


  return (
    <>
     <Heading>SignupPage</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>ID</FormLabel>
          <Input
            placeholder="Enter ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>

        <Button mt={4} type="submit" colorScheme="teal">
          Sign Up
        </Button>
      </form>

      {/* 서버 응답 메시지 출력 */}
      {message && <p>{message}</p>}
    </>
  );
};

export default SignUpPage;
