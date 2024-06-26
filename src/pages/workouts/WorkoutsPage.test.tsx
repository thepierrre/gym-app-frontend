import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import workoutSessionsReducer from "../../features/workout/workoutSessionsSlice";
import chosenDayReducer from "../../features/workout/dayInCalendarSlice";
import activeExerciseInstanceReducer from "../../features/workout/activeExerciseInstanceSlice";
import authenticatedUserReducer from "../../features/auth/authenticatedUserSlice";
import exercisesReducer from "../../features/exercises/exercisesSlice";
import routinesReducer from "../../features/routines/routinesSlice";
import categoriesReducer from "../../features/exercises/categoriesSlice";
import { format } from "date-fns";
import {
  mockUser,
  mockCategories,
  mockExerciseTypes,
  mockRoutines,
  mockWorkouts,
} from "../../util/testData";
import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";
import WorkoutsPage from "./WorkoutsPage";

const store = configureStore({
  reducer: {
    workoutSessions: workoutSessionsReducer,
    chosenDay: chosenDayReducer,
    activeExerciseInstance: activeExerciseInstanceReducer,
    authenticatedUser: authenticatedUserReducer,
    exercises: exercisesReducer,
    routines: routinesReducer,
    categories: categoriesReducer,
  },
  preloadedState: {
    authenticatedUser: {
      user: mockUser,
      loading: false,
      error: null,
    },
    routines: {
      routines: mockRoutines,
      loading: false,
      error: null,
    },
    exercises: {
      exercises: mockExerciseTypes,
      loading: false,
      error: null,
    },
    workoutSessions: {
      workouts: mockWorkouts,
      loading: false,
      error: null,
    },
    categories: {
      categories: mockCategories,
      loading: false,
      error: null,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    </ChakraProvider>
  );
};

describe("WorkoutsPage", () => {
  test("renders the calendar and workouts for the current day", () => {
    renderWithProviders(<WorkoutsPage />);

    expect(screen.getByText(format(new Date(), "dd"))).toBeInTheDocument();
    expect(
      screen.getByText(format(new Date(), "EEE").toUpperCase())
    ).toBeInTheDocument();
    expect(screen.getByText("New workout")).toBeInTheDocument();
    expect(screen.getAllByText("Remove workout")).toHaveLength(3);

    expect(screen.getByText("routine1")).toBeInTheDocument();
    expect(screen.getByText("routine2")).toBeInTheDocument();
    expect(screen.getByText("routine3")).toBeInTheDocument();
    expect(screen.getAllByText("exercise1")).toHaveLength(3);
    expect(screen.getAllByText("exercise2")).toHaveLength(3);
    expect(screen.getAllByText("exercise3")).toHaveLength(3);
    expect(screen.getByText("exercise4")).toBeInTheDocument();
    expect(screen.getByText("exercise5")).toBeInTheDocument();
    expect(screen.getByText("exercise6")).toBeInTheDocument();
  });

  test("opens the sliding element with all routines when 'New workout' is clicked", () => {
    renderWithProviders(<WorkoutsPage />);

    fireEvent.click(screen.getByText("New workout"));
    expect(screen.getByText("Select a routine")).toBeInTheDocument();

    expect(screen.getByText("routine4")).toBeInTheDocument();
    expect(screen.getByText("routine5")).toBeInTheDocument();
    expect(screen.getByText("routine6")).toBeInTheDocument();
    expect(screen.getAllByText("routine1")).toHaveLength(2);
    expect(screen.getAllByText("routine2")).toHaveLength(2);
    expect(screen.getAllByText("routine3")).toHaveLength(2);
  });

  test("adds a new routine to the current day when a new routine is selected", () => {
    renderWithProviders(<WorkoutsPage />);

    fireEvent.click(screen.getByText("New workout"));
    expect(screen.getByText("Select a routine")).toBeInTheDocument();
    fireEvent.click(screen.getByText("routine4"));
    waitFor(() => expect(screen.queryByText("Select a routine")).toBeNull());
    expect(screen.getByText("routine4")).toBeInTheDocument();
  });

  test("removes a workout when 'Remove workout' is clicked", () => {
    renderWithProviders(<WorkoutsPage />);

    expect(screen.getByText("routine3")).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("Remove workout")[0]);
    waitFor(() => expect(screen.queryByText("routine3")).toBeNull());
  });
});
