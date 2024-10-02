import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

const SignUpPage = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Heading>SignupPage</Heading>
      <form>
        <Input placeholder="Enter Name" />
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
    </>
  );
};

export default SignUpPage;
