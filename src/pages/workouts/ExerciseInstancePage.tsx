import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { UserSettings } from "interfaces/userSettings.interface";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { AppDispatch, RootState } from "../../app/store";
import Container from "../../components/UI/Container";
import SpinnerComponent from "../../components/UI/SpinnerComponent";
import NotesForm from "../../components/forms/NotesForm";
import ThresholdForm from "../../components/forms/ThresholdForm";
import ExWorkingSet from "../../components/shared/ExWorkingSet";
import ThresholdHandler from "../../components/workouts/ThresholdHandler";
import { fetchUserSettings } from "../../features/settings/userSettingsSlice";
import { fetchWorkouts } from "../../features/workout/workoutSessionsSlice";
import { WorkingSet } from "../../interfaces/workingSet.interface";

const defaultUserSettings: UserSettings = {
    changeThreshold: 1,
    weightUnit: "kgs",
};

const WorkoutExerciseInstancePage = () => {
    const [threshold, setThreshold] = useState<number | undefined>(undefined);
    const [activeWorkingSet, setActiveWorkingSet] = useState<
        WorkingSet | undefined
    >(undefined);

    const navigate = useNavigate();

    const { workoutId, exerciseInstanceId } = useParams();

    const workoutSessions = useSelector(
        (state: RootState) => state.workoutSessions,
    );
    const { userSettings, loading: loadingUserSettings } = useSelector(
        (state: RootState) => state.userSettings,
    );

    const wrk = workoutSessions.workouts.find((w) => w.id === workoutId);
    const exerciseInstance = wrk?.exerciseInstances.find(
        (e) => e.id === exerciseInstanceId,
    );

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchWorkouts);
    }, [wrk]);

    useEffect(() => {
        dispatch(fetchUserSettings());
    }, [dispatch]);

    useEffect(() => {
        if (userSettings) {
            const fetchedThreshold = userSettings.changeThreshold;
            setThreshold(fetchedThreshold);
        }
    }, [userSettings]);

    useEffect(() => {
        if (exerciseInstance?.workingSets?.length === 0) {
            setActiveWorkingSet(undefined);
        }
    }, [exerciseInstance]);

    const handleActiveWorkingSet = (workingSet: WorkingSet) => {
        activeWorkingSet && activeWorkingSet.id === workingSet.id
            ? setActiveWorkingSet(undefined)
            : setActiveWorkingSet(workingSet);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loadingUserSettings) {
        return <SpinnerComponent />;
    }

    return (
        <Container>
            {exerciseInstance?.exerciseTypeName !== undefined && (
                <Flex direction="column" gap={5}>
                    <Flex align="center" w="100%">
                        <IconButton
                            aria-label="Go back"
                            variant="link"
                            color="white"
                            w="15%"
                            icon={<ChevronLeftIcon boxSize={8} />}
                            onClick={() => handleGoBack()}
                        />

                        <Heading
                            fontSize="md"
                            color="white"
                            textAlign="center"
                            w="70%"
                        >
                            {exerciseInstance?.exerciseTypeName.toUpperCase()}
                        </Heading>
                        <Box w="15%" />
                    </Flex>

                    <Flex w="100%" direction="column" gap={5} mt={2}>
                        <ThresholdHandler
                            threshold={threshold}
                            userSettings={userSettings || defaultUserSettings}
                        />

                        <ThresholdForm
                            threshold={threshold}
                            userSettings={userSettings || defaultUserSettings}
                            activeWorkingSet={activeWorkingSet || undefined}
                            setActiveWorkingSet={setActiveWorkingSet}
                            exerciseInstance={exerciseInstance}
                            exBlueprintOrInstance="instance"
                        />
                    </Flex>
                    <Flex
                        direction="column"
                        gap={2}
                        mt={3}
                        mb={3}
                        align="center"
                    >
                        {exerciseInstance?.workingSets?.length > 0 ? (
                            exerciseInstance?.workingSets?.map((set, index) => (
                                <ExWorkingSet
                                    workingSet={set}
                                    index={index}
                                    key={set.id}
                                    activeWorkingSet={activeWorkingSet}
                                    handleActiveWorkingSet={
                                        handleActiveWorkingSet
                                    }
                                    userSettings={
                                        userSettings || defaultUserSettings
                                    }
                                />
                            ))
                        ) : (
                            <Text>This exercise has no sets.</Text>
                        )}
                    </Flex>
                    <NotesForm />
                </Flex>
            )}
        </Container>
    );
};

export default WorkoutExerciseInstancePage;
