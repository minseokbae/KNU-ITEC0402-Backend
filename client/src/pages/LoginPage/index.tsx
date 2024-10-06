import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful');
      navigate('/');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <>
      <Heading>LoginPage</Heading>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // 이메일 상태 업데이트
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
      </form>
      <Button onClick={handleClick}>회원가입하기</Button>
    </>
  );
};

export default LoginPage;
