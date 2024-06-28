import { useState } from "react";
import { Link } from "react-router-dom";
import WideButton from "../../components/UI/WideButton";
import Container from "../../components/UI/Container";
import {
  Heading,
  Flex,
  Text,
  FormControl,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import axiosInstance from "../../util/axiosInstance";
import Welcome from "./Welcome";

type FormValues = {
  username: string;
  email: string;
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    ...(values.username
      ? {}
      : {
          username: {
            type: "required",
            message: "Please enter a username.",
          },
        }),
    ...(values.password
      ? {}
      : {
          password: {
            type: "required",
            message: "Please enter a password.",
          },
        }),
    ...(values.email
      ? !emailPattern.test(values.email)
        ? {
            email: {
              type: "pattern",
              message: "Please enter a valid email address.",
            },
          }
        : {}
      : {
          email: {
            type: "required",
            message: "Please enter an email.",
          },
        }),
  };

  return {
    values: values.username && values.password && values.email ? values : {},
    errors: errors,
  };
};

const RegisterPage = () => {
  const [userRegistered, setUserRegistered] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/register", data);
      if (response.data === `User "${data.username}" registered.`) {
        setUserRegistered(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Welcome />
      <Heading fontSize="xl" mb={1}>
        Create an account
      </Heading>
      <Flex gap={1}>
        <Text fontSize="lg" mb={3}>
          Already a member?
        </Text>
        <Link to="/">
          <Text fontSize="lg" mb={3} color="lightblue" fontWeight="bold">
            Sign in!
          </Text>
        </Link>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap={3} mt={3}>
          <FormControl isInvalid={!!errors?.username}>
            <Input
              {...register("username")}
              w="95vw"
              bg="#404040"
              borderColor="transparent"
              _focusVisible={{
                borderWidth: "1px",
                borderColor: "lightblue",
              }}
              _placeholder={{ color: "#B3B3B3" }}
              placeholder="Username"
            />
            <FormErrorMessage>
              {errors?.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors?.email}>
            <Input
              {...register("email")}
              w="95vw"
              bg="#404040"
              borderColor="transparent"
              _focusVisible={{
                borderWidth: "1px",
                borderColor: "lightblue",
              }}
              _placeholder={{ color: "#B3B3B3" }}
              placeholder="Email"
            />
            <FormErrorMessage>
              {errors?.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors?.password}>
            <Input
              {...register("password")}
              w="95vw"
              bg="#404040"
              borderColor="transparent"
              _focusVisible={{
                borderWidth: "1px",
                borderColor: "lightblue",
              }}
              _placeholder={{ color: "#B3B3B3" }}
              placeholder="Password"
              type="password"
            />
            <FormErrorMessage>
              {errors?.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          {userRegistered && (
            <Flex justify="center" gap={1}>
              <Text>Registration complete!</Text>
              <Link to="/">
                <Text color="lightblue" fontWeight="bold">
                  Sign in.
                </Text>
              </Link>
            </Flex>
          )}
          <WideButton type="submit">Create account</WideButton>
        </Flex>
      </form>
    </Container>
  );
};

export default RegisterPage;
