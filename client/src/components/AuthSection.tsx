import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import DefaultBtn from "./DefaultBtn";
import PasswordInput from "./PasswordInput";

interface AuthSectionProps {
  isLogin?: boolean;
  message: string;
  id: string;
  password: string;
  passwordConfirm?: string;
  handleMove: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePasswordConfirm?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthSection = ({
  isLogin = true,
  id,
  password,
  passwordConfirm = "",
  message,
  onChangeId,
  onChangePassword,
  onChangePasswordConfirm = onChangePassword,
  handleSubmit,
  handleMove,
}: AuthSectionProps) => {
  return (
    <Box position="relative" h="100vh" w="100vw" background="#254DC0">
      <AbsoluteCenter
        borderRadius="1rem"
        background="white"
        w="65%"
        h="80%"
        axis="both"
        alignContent="center"
      >
        <HStack
          display="grid"
          gridTemplateColumns="2fr .5fr 2fr"
          padding="0 55px"
        >
          <Heading textAlign="center" size="3xl" color="gray">
            FEMS<br></br>시스템
          </Heading>
          <Divider orientation="vertical" />
          <form
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
            onSubmit={handleSubmit}
          >
            <Heading size="lg" padding="1.5rem">
              로그인
            </Heading>
            <Input
              w="100%"
              variant="outline"
              placeholder="아이디"
              borderRadius="50px"
              value={id}
              margin={3}
              onChange={onChangeId} // ID 상태 업데이트
            />
            <PasswordInput password={password} onChange={onChangePassword} />
            {!isLogin && (
              <PasswordInput
                password={passwordConfirm}
                onChange={onChangePasswordConfirm}
              />
            )}
            <DefaultBtn btnContent={isLogin ? "로그인" : "회원가입하기"} />
            {message && <p>{message}</p>}{" "}
            {/* 오류 메시지 또는 성공 메시지 표시 */}
            <Divider />
            <Text margin={3}>
              {isLogin ? "회원이 아니신가요?" : "회원이신가요?"}
              <Button variant="plain" onClick={handleMove}>
                {isLogin ? "회원가입하기" : "로그인하기"}
              </Button>
            </Text>
          </form>
        </HStack>
      </AbsoluteCenter>
    </Box>
  );
};

export default AuthSection;
