import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import workoutSessionsReducer from "../../../features/workout/workoutSessionsSlice";
import chosenDayReducer from "../../../features/workout/dayInCalendarSlice";
import activeExerciseInstanceReducer from "../../../features/workout/activeExerciseInstanceSlice";
import authenticatedUserReducer from "../../../features/auth/authenticatedUserSlice";
import exercisesReducer from "../../../features/exercises/exercisesSlice";
import routinesReducer from "../../../features/routines/routinesSlice";
import categoriesReducer from "../../../features/exercises/categoriesSlice";
import { workoutsForUser } from "../../../mockData/handlers/workoutsForUserHandler";
import { categories } from "../../../mockData/handlers/categoriesHandler";
import { initializedUser } from "../../../mockData/authHandlers/initializeUserHandler";
import { exerciseTypesForUser } from "../../../mockData/handlers/exerciseTypesForUserHandler";
import SingleExercisePage from "../SingleExercisePage";

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
      user: initializedUser,
      loading: false,
      error: null,
    },
    workoutSessions: {
      workouts: workoutsForUser,
      loading: false,
      error: null,
    },
    exercises: {
      exercises: exerciseTypesForUser,
      loading: false,
      error: null,
    },
    categories: {
      categories: categories,
      loading: false,
      error: null,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const route = "/exercises/a6647d9c-a926-499e-9a5f-e9f16690bfdg";
  return render(
    <ChakraProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/exercises/:exerciseId" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </ChakraProvider>
  );
};

describe("SingleExercisePage", () => {
  test("renders the correct exercise with the UI elements", () => {
    renderWithProviders(<SingleExercisePage />);

    waitFor(() => {
      expect(screen.getByText("Edit exercise")).toBeInTheDocument();
      expect(screen.getByDisplayValue("barbell rows")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Filter categories")
      ).toBeInTheDocument();
      expect(screen.getByText("Update")).toBeInTheDocument();
      expect(screen.getByText("Delete exercise")).toBeInTheDocument();

      const checkedCheckbox = screen.getByLabelText("Upper back");
      expect(checkedCheckbox).toBeChecked();

      const allCheckboxes = screen.getAllByRole("checkbox");
      const uncheckedCheckboxes = allCheckboxes.filter(
        (checkbox) => checkbox != checkedCheckbox
      );
      uncheckedCheckboxes.forEach((checkbox) =>
        expect(checkbox).not.toBeChecked()
      );
    });
  });

  test("throws an error when the name for a submitted exercise is empty", async () => {
    renderWithProviders(<SingleExercisePage />);

    await waitFor(() => {
      expect(screen.getByText("Edit exercise")).toBeInTheDocument();
      expect(screen.getByDisplayValue("barbell rows")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue("barbell rows"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Update"));
    waitFor(() => {
      expect(
        screen.getByText("Exercise name cannot be empty.")
      ).toBeInTheDocument();
    });
  });

  test("throws an error when the name for a submitted exercise coincides with another exercise's name", async () => {
    renderWithProviders(<SingleExercisePage />);

    await waitFor(() => {
      expect(screen.getByText("Edit exercise")).toBeInTheDocument();
      expect(screen.getByDisplayValue("barbell rows")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue("barbell rows"), {
      target: { value: "bench press" },
    });

    fireEvent.click(screen.getByText("Update"));
    waitFor(() => {
      expect(
        screen.getByText("An exercise with this name already exists!")
      ).toBeInTheDocument();
    });
  });

  test("render's the exercises page with the edited exercise if a correct exercise is submitted", async () => {
    renderWithProviders(<SingleExercisePage />);

    await waitFor(() => {
      expect(screen.getByText("Edit exercise")).toBeInTheDocument();
      expect(screen.getByDisplayValue("barbell rows")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue("barbell rows"), {
      target: { value: "standing barbell rows" },
    });

    fireEvent.click(screen.getByText("Update"));
    waitFor(() => {
      expect(screen.getByText("New exercise")).toBeInTheDocument();
      expect(screen.getByText("standing barbell rows")).toBeInTheDocument();
    });
  });
});
