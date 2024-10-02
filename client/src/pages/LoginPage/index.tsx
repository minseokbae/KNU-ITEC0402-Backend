import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <>
      <Heading>LoginPage</Heading>
      <form>
        <Input placeholder="Enter Email" />
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
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
