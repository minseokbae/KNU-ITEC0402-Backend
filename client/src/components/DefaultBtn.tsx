import { Button } from "@chakra-ui/react";

interface DefaultBtn {
  btnContent: string;
}

const DefaultBtn = ({ btnContent }: DefaultBtn) => {
  return (
    <Button
      margin={4}
      w="100%"
      background="#4E73DF"
      type="submit"
      color="white"
      borderRadius="50px"
    >
      {btnContent}
    </Button>
  );
};

export default DefaultBtn;
