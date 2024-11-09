import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

interface PasswordInputProps {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ password, onChange }: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <InputGroup margin={3}>
      <Input
        variant="outline"
        background="white"
        borderRadius="50px"
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="비밀번호"
        value={password}
        onChange={onChange} // 비밀번호 상태 업데이트
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          w="80%"
          borderRadius="50px"
          onClick={() => setShow(!show)}
        >
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
