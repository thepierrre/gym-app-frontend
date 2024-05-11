import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

interface SmallButtonProps extends ButtonProps {
  children: string;
}

const SmallButton: React.FC<SmallButtonProps> = (props) => {
  return (
    <Button
      bg="#404040"
      w={10}
      h={10}
      borderRadius={8}
      fontSize="3xl"
      textColor="white"
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default SmallButton;
