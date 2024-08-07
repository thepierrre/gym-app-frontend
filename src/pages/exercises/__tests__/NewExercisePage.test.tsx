import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import ExercisesPage from "../ExercisesPage";
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
import { exerciseTypesForUser as mutableExerciseTypesForUser } from "../../../mockData/handlers/exerciseTypesForUserHandler";
import { categories as initialCategories } from "../../../mockData/handlers/categoriesHandler";
import { categories } from "../../../mockData/handlers/categoriesHandler";
import { initializedUser } from "../../../mockData/authHandlers/userHandler";
import NewExercisePage from "../NewExercisePage";
import { User } from "../../../interfaces/user.interface";
import { Workout } from "../../../interfaces/workout.interface";
import { Exercise } from "../../../interfaces/exercise.interface";
import { Category } from "../../../interfaces/category.interface";

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const initialExerciseTypesList = deepClone(mutableExerciseTypesForUser);

interface AuthenticatedUserState {
  user: User;
  loading: boolean;
  error: any;
}

interface WorkoutSessionsState {
  workouts: Workout[];
  loading: boolean;
  error: any;
}

interface ExercisesState {
  exercises: Exercise[];
  loading: boolean;
  error: any;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: any;
}

interface InitialState {
  authenticatedUser: AuthenticatedUserState;
  workoutSessions: WorkoutSessionsState;
  exercises: ExercisesState;
  categories: CategoriesState;
}

const createInitialState = () => ({
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
    exercises: deepClone(initialExerciseTypesList),
    loading: false,
    error: null,
  },
  categories: {
    categories: deepClone(initialCategories),
    loading: false,
    error: null,
  },
});

const createStore = (initialState: InitialState) => {
  return configureStore({
    reducer: {
      workoutSessions: workoutSessionsReducer,
      chosenDay: chosenDayReducer,
      activeExerciseInstance: activeExerciseInstanceReducer,
      authenticatedUser: authenticatedUserReducer,
      exercises: exercisesReducer,
      routines: routinesReducer,
      categories: categoriesReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (ui: React.ReactElement, store: any) => {
  return render(
    <ChakraProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={["/exercises/new-exercise"]}>
          <Routes>
            <Route path="/exercises/new-exercise" element={ui} />
            <Route path="/exercises" element={<ExercisesPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </ChakraProvider>
  );
};

describe("NewExercisePage", () => {
  let store: any;

  beforeEach(() => {
    mutableExerciseTypesForUser.length = 0;
    mutableExerciseTypesForUser.push(...deepClone(initialExerciseTypesList));

    const initialState = createInitialState();
    store = createStore(initialState);
  });

  test("renders the heading, inputs and categories correctly", () => {
    renderWithProviders(<NewExercisePage />, store);

    waitFor(() => {
      expect(screen.getByText("Add a new exercise")).toBeInTheDocument();
      expect(screen.getByText("Exercise name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter a name")).toBeInTheDocument();
      expect(screen.getByText("Filter categories")).toBeInTheDocument();
      expect(screen.getByText("Create")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });

    waitFor(() => {
      expect(screen.getAllByTestId(/^category-name-/)).toHaveLength(
        categories.length
      );
    });
  });

  test("renders only filtered categories when the filter input is used", async () => {
    renderWithProviders(<NewExercisePage />, store);

    await waitFor(() => {
      expect(screen.getByText("Add a new exercise")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "c" },
    });
    expect(screen.getByDisplayValue("c")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Chest")).toBeInTheDocument();
      expect(screen.getByText("Calves")).toBeInTheDocument();
      expect(screen.queryByText("Glutes")).toBeNull();
      expect(screen.queryByText("Hamstrings")).toBeNull();
      expect(screen.queryByText("Quadriceps")).toBeNull();
      expect(screen.queryByText("Lower back")).toBeNull();
      expect(screen.queryByText("Upper back")).toBeNull();
      expect(screen.queryByText("barbell rows")).toBeNull();
      expect(screen.queryByText("Triceps")).toBeNull();
      expect(screen.queryByText("Biceps")).toBeNull();
      expect(screen.queryByText("Abs")).toBeNull();
      expect(screen.queryByText("Front deltoids")).toBeNull();
      expect(screen.queryByText("Middle deltoids")).toBeNull();
    });
  });

  test("displays an error when an exercise with no name is submitted", async () => {
    renderWithProviders(<NewExercisePage />, store);

    await waitFor(() =>
      expect(screen.getByText("Add a new exercise")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Create"));
    await waitFor(() => {
      expect(
        screen.getByText("Exercise name cannot be empty.")
      ).toBeInTheDocument();
    });
  });

  test("displays an error when the exercise name coincides with another exercise", async () => {
    renderWithProviders(<NewExercisePage />, store);

    await waitFor(() =>
      expect(screen.getByText("Add a new exercise")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText("Enter a name"), {
      target: { value: "bench press" },
    });
    expect(screen.getByDisplayValue("bench press")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Create"));
    await waitFor(() => {
      expect(
        screen.getByText("An exercise with this name already exists!")
      ).toBeInTheDocument();
    });
  });

  test("renders the exercise page with a new exercise when a correct exercise is submitted", async () => {
    renderWithProviders(<NewExercisePage />, store);

    await waitFor(() =>
      expect(screen.getByText("Add a new exercise")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText("Enter a name"), {
      target: { value: "brand-new exercise" },
    });
    expect(screen.getByDisplayValue("brand-new exercise")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "test" },
    });
    expect(screen.getByText("Test category")).toBeInTheDocument();

    expect(screen.queryAllByRole("checkbox")).toHaveLength(1);
    await act(async () => {
      fireEvent.click(screen.getByRole("checkbox"));
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Create"));
    });

    await waitFor(() => {
      expect(screen.getByText("New exercise")).toBeInTheDocument();
      expect(screen.getByText("brand-new exercise")).toBeInTheDocument();
      expect(screen.getByText("TEST CATEGORY")).toBeInTheDocument();
    });
  });
});
