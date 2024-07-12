import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkouts,
  removeWorkout,
} from "../../features/workout/workoutSessionsSlice";
import Datepicker from "../../components/workouts/Datepicker";
import NewWorkout from "../../components/workouts/NewWorkout";
import WorkoutSession from "../../components/workouts/WorkoutSession";
import { RootState, AppDispatch } from "../../app/store";
import { format } from "date-fns";
import Container from "../../components/UI/Container";
import { Text, useToast, ToastId, Box } from "@chakra-ui/react";
import SpinnerComponent from "../../components/UI/SpinnerComponent";

export const WorkoutsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>(undefined);
  const { workouts, loading: loadingWorkouts } = useSelector(
    (state: RootState) => state.workoutSessions
  );
  const [localWorkouts, setLocalWorkouts] = useState(workouts);
  const chosenDay = useSelector((state: RootState) => state.chosenDay.day);

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  useEffect(() => {
    setLocalWorkouts(workouts);
  }, [workouts]);

  const filteredWorkouts = localWorkouts?.filter(
    (wrk) => format(new Date(wrk.creationDate), "dd/MM/yyyy") === chosenDay
  );

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
          <Text textAlign="center">Workout deleted</Text>
        </Box>
      ),
    });
  };

  const handleRemoveWorkout = async (id: string) => {
    try {
      await dispatch(removeWorkout(id)).unwrap();
      setLocalWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== id)
      );
      addToast();
    } catch (error) {
      console.error("Failed to delete workout:", error);
    }
  };

  if (loadingWorkouts) {
    return <SpinnerComponent />;
  }

  return (
    <Container>
      <Datepicker />
      <NewWorkout />
      {filteredWorkouts?.length > 0 ? (
        filteredWorkouts.map((workout) => (
          <WorkoutSession
            key={workout.id}
            workout={workout}
            onRemoveWorkout={handleRemoveWorkout}
          />
        ))
      ) : (
        <Text textColor="white" mt={5}>
          You don't have any workouts for this day!
        </Text>
      )}
    </Container>
  );
};

export default WorkoutsPage;
