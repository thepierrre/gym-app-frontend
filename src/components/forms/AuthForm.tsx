import React from "react";
import axios from "axios";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { FormControl, FormErrorMessage, Input, Flex } from "@chakra-ui/react";
import WideButton from "../UI/WideButton";

export interface FormValues {
  username: string;
  password: string;
  email?: string;
}

interface Props {
  initialUsername: string;
  initialPassword: string;
  initialEmail?: string;
  buttonText: string;
  onSubmit: (data: FormValues) => void;
  isRegistration?: boolean;
  setFormError?: (
    field: keyof FormValues,
    error: { type: string; message: string }
  ) => void; // Adjusted type for setting form errors
  errors?: any; // Accept errors prop
}

const AuthForm: React.FC<Props> = ({
  initialUsername,
  initialPassword,
  initialEmail,
  buttonText,
  onSubmit,
  isRegistration,
  setFormError,
  errors, // Receive errors prop
}) => {
  const resolver: Resolver<FormValues> = async (values) => {
    const errors = {
      ...(values.username
        ? {}
        : {
            username: {
              type: "required",
              message: "Username is required.",
            },
          }),
      ...(values.password
        ? {}
        : {
            password: {
              type: "required",
              message: "Password is required.",
            },
          }),
      ...(isRegistration && !values.email
        ? {
            email: {
              type: "required",
              message: "Email is required for registration.",
            },
          }
        : {}),
    };

    return {
      values: values.username && values.password ? values : {},
      errors: errors,
    };
  };

  const { register, handleSubmit } = useForm<FormValues>({
    resolver,
  });

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      if (setFormError) {
        if (axios.isAxiosError(error)) {
          setFormError("username", {
            type: "manual",
            message: error.response?.data.message || "An error occurred.",
          });
          setFormError("password", {
            type: "manual",
            message: error.response?.data.message || "An error occurred.",
          });
        } else {
          setFormError("username", {
            type: "manual",
            message: "Unexpected error occurred",
          });
          setFormError("password", {
            type: "manual",
            message: "Unexpected error occurred",
          });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            defaultValue={initialUsername}
          />
          <FormErrorMessage>
            {errors?.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>

        {isRegistration && (
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
              defaultValue={initialEmail}
            />
            <FormErrorMessage>
              {errors?.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
        )}

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
            defaultValue={initialPassword}
          />
          <FormErrorMessage>
            {errors?.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        <WideButton type="submit">{buttonText}</WideButton>
      </Flex>
    </form>
  );
};

export default AuthForm;
