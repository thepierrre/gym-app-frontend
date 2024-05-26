import { Link } from "react-router-dom";
import WideButton from "../../components/UI/WideButton";
import Container from "../../components/UI/Container";
import { Heading } from "@chakra-ui/react";
import AuthForm, { FormValues } from "../../components/forms/AuthForm";
import axiosInstance from "../../util/axiosInstance";

const RegisterPage = () => {
  const onSubmit = (data: FormValues) => {
    axiosInstance
      .post("auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Container>
      <Heading fontSize="lg">Create an account</Heading>
      <AuthForm
        onSubmit={onSubmit}
        initialUsername=""
        initialPassword=""
        buttonText="Register"
        isRegistration={true}
      />
      <Link to="/profile">
        <WideButton>Existing member? Sign in</WideButton>
      </Link>
    </Container>
  );
};

export default RegisterPage;
