import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { fetchExercises } from "../../features/exercises/exercisesSlice";
import WideButton from "../../components/UI/WideButton";
import Container from "../../components/UI/Container";

import { Flex, Text, useToast, ToastId, Box } from "@chakra-ui/react";
import SingleExercise from "../../components/exercises/SingleExercise";

const ExercisesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>(undefined);
  const exercises = useSelector(
    (state: RootState) => state.exercises.exercises
  );

  useEffect(() => {
    dispatch(fetchExercises());
  }, [dispatch]);

  useEffect(() => {
    handleToast();
  }, [location.state]);

  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    };
  }, [location, toast]);

  const addToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
    toastIdRef.current = toast({
      position: "bottom",
      duration: 2500,
      render: () => (
        <Box
          color="white"
          bg="#2F855A"
          borderRadius={10}
          p={3}
          fontSize="lg"
          mb={10}
        >
          <Text textAlign="center">{handleToastText()}</Text>
        </Box>
      ),
    });
  };

  const handleToastText = () => {
    if (location.state) {
      if (location.state.exercise === "removed") {
        return "Exercise deleted";
      } else if (location.state.exercise === "created") {
        return "Exercise created";
      } else if (location.state.exercise === "updated") {
        return "Exercise updated";
      }
    }
  };

  const handleToast = () => {
    if (
      location.state &&
      ["removed", "created", "updated"].includes(location.state.exercise)
    ) {
      addToast();
    }
  };

  return (
    <Container>
      <Link to="/exercises/new-exercise">
        <WideButton type="submit">New exercise</WideButton>
      </Link>
      <Flex direction="column" gap={2} w="95vw" align="center" mt={3}>
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise) => (
            <Link key={exercise.id} to={`/exercises/${exercise.id}`}>
              <SingleExercise exercise={exercise} />
            </Link>
          ))
        ) : (
          <Text textAlign="center" mt={5}>
            No exercises yet. Add your first one!
          </Text>
        )}
      </Flex>
    </Container>
  );
};

export default ExercisesPage;
