import { useNavigate } from "react-router-dom";
import { generateRandomString } from "../util/DUMMY_DATA";
import { useForm, Resolver } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { Exercise } from "../interfaces/exercise.interface";
import { Category } from "../interfaces/category.interface";
import { categories } from "../util/DUMMY_DATA";
import { addExercise } from "../features/exercises/exercisesSlice";
import React, { useState } from "react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { categories as catts } from "../util/DUMMY_DATA";

import {
  Flex,
  Button,
  Heading,
  FormControl,
  Input,
  FormErrorMessage,
  Text,
  Card,
  CardBody,
  Checkbox,
  IconButton,
  Box,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

type FormValues = {
  name: string;
  categories: string[];
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.name ? values : {},
    errors: !values.name
      ? {
          name: {
            type: "required",
            message: "Exercise name is required.",
          },
        }
      : {},
  };
};

const NewExercise = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const [searchCategories, setSearchCategories] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const usr = useSelector((state: RootState) => state.authenticatedUser.user);
  const initialCategories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const dispatch = useDispatch();

  const convertFormDataToExercise = (formData: FormValues): Exercise => {
    return {
      id: generateRandomString(5),
      name: formData.name,
      categories: selectedCategories,
      userId: usr.id,
    };
  };

  const onSubmit = (data: FormValues) => {
    console.log(data.name);
    const exerciseToAdd = {
      id: generateRandomString(5),
      name: data.name,
      categories: selectedCategories,
      userId: usr.id,
    };

    dispatch(addExercise(exerciseToAdd));
    navigate("/exercises");
  };

  const handleCheck = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setTimeout(() => {
        setSelectedCategories((prevSelectedCategories) =>
          prevSelectedCategories.filter((cat) => cat.id !== category.id)
        );
        setCategories([...categories, category]);
      }, 250);
    } else {
      setTimeout(() => {
        setSelectedCategories([...selectedCategories, category]);
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== category.id)
        );
      }, 250);
    }
  };

  const handleFilterCategories = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchCategories(value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.startsWith(searchCategories.toLowerCase())
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Flex
      align="center"
      w="100vw"
      color="white"
      direction="column"
      gap={7}
      padding={2}
      marginTop={5}
    >
      <Flex align="center" w="100%">
        <IconButton
          aria-label="Go back"
          variant="link"
          color="white"
          w="15%"
          icon={<ChevronLeftIcon boxSize={8} />}
          onClick={() => handleGoBack()}
        />

        <Heading w="70%" fontSize="lg" textAlign="center">
          New exercise
        </Heading>
        <Box w="16%" />
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <Input
            {...register("name")}
            w="95vw"
            bg="#404040"
            borderColor="transparent"
            _focusVisible={{
              borderWidth: "1px",
              borderColor: "lightblue",
            }}
            _placeholder={{ color: "#B3B3B3" }}
            placeholder="Exercise name"
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <Heading fontSize="lg" textAlign="center" mt={4} mb={4}>
          Categories
        </Heading>
        <Wrap w="90vw" mt={4} mb={4} ml={2} mr={2}>
          {selectedCategories.map((category) => (
            <Flex gap={5} w="48%" key={category.name}>
              <Checkbox
                defaultChecked={true}
                onChange={() => handleCheck(category)}
              ></Checkbox>
              <Text textColor="white">
                {category.name.charAt(0).toLocaleUpperCase() +
                  category.name.slice(1)}
              </Text>
            </Flex>
          ))}
        </Wrap>
        <Flex direction="column" w="100%" gap={2}>
          <Input
            w="95vw"
            bg="#404040"
            borderColor="transparent"
            _focusVisible={{
              borderWidth: "1px",
              borderColor: "lightblue",
            }}
            _placeholder={{ color: "#B3B3B3" }}
            placeholder="Type to filter categories"
            onChange={(event) => handleFilterCategories(event)}
          />
          <Wrap w="90vw" mt={4} mb={4} ml={2} mr={2}>
            {filteredCategories.map((category) => (
              <Flex gap={5} w="48%" key={category.name}>
                <Checkbox onChange={() => handleCheck(category)}></Checkbox>
                <Text textColor="white">
                  {category.name.charAt(0).toLocaleUpperCase() +
                    category.name.slice(1)}
                </Text>
              </Flex>
            ))}
          </Wrap>
        </Flex>
        <Button
          w="95vw"
          bg="lightblue"
          textColor="#353935"
          type="submit"
          mt={4}
        >
          Add
        </Button>
      </form>
    </Flex>
  );
};

export default NewExercise;