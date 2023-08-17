import { useCallback, useEffect, useState } from "react";
import { Box, Center, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base";
import { TouchableOpacity } from "react-native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons"
import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";

type RouteParamsProps = {
    exerciseId: string;
}

export function Exercise() {
    const [sendingRegister, setSendingRegister] = useState(false)
    const [isLoadind, setIsLoading] = useState(true)
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

    const { user } = useAuth()

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const toast = useToast()

    const route = useRoute()

    const { exerciseId } = route.params as RouteParamsProps;

    useEffect(() => {
        fetchExerciseDetails()
    }, [exerciseId])

    async function fetchExerciseDetails() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/${exerciseId}`)
            setExercise(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : "Não foi possível carregar os dados do exercício"

            toast.show({
              title,
              placement: 'top',
              bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleExerciseHistoryRegister() {
        try{
            setSendingRegister(true)
            await api.post(`/history`, { exercise_id: exerciseId })

            toast.show({
                title: "Parabéns! Exercício registrado no seu histórico",
                placement: 'top',
                bgColor: 'green.500'
            })

            navigation.navigate('history')
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : "Não foi possível marcar o exercício como realizado."

            toast.show({
              title,
              placement: 'top',
              bgColor: 'red.500'
            })
        } finally {
            setSendingRegister(false)
        }
    }

    function handleGoBack() {
        navigation.goBack();
    }

    return (
        <VStack flex={1}>
            <VStack px={8} bg="gray.600" pt={12} pb={8}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon 
                      as={Feather}
                      name="arrow-left"
                      color="green.500"
                      size={6}
                    />
                </TouchableOpacity>

                <HStack mt={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100" fontSize="xl" fontFamily="heading" flexShrink={1}>
                        {exercise.name}
                    </Heading>

                    <HStack alignItems="center">
                        {/* <Icon as={BodySvg} color="gray.300" size={4} /> */}
                        <BodySvg />
                        <Text color="gray.200" fontSize="md" ml={1} textTransform="capitalize">
                            {exercise.group}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            {isLoadind ? <Loading /> : (
                <ScrollView contentContainerStyle={{ paddingBottom: 36}}>
                    <VStack px={8} mt={8}>

                        <Box rounded="lg" mb={3} overflow="hidden">
                            <Image 
                                source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                                alt="Foto do exercício"
                                h={80}
                                w="full"
                                rounded="lg"
                                resizeMode="cover"
                            />
                        </Box>

                        <Box px={4} pt={5} pb={4} bg="gray.600" rounded="md">
                            <HStack alignItems="center" justifyContent="space-around" mb={6}>
                                <HStack alignItems="center">
                                    <SeriesSvg />

                                    <Text color="gray.200" fontSize="md" ml={2}>
                                        {exercise.series} séries
                                    </Text>
                                </HStack>

                                <HStack alignItems="center">
                                    <RepetitionsSvg />
                                    
                                    <Text color="gray.200" fontSize="md" ml={2}>
                                        {exercise.repetitions} repetições
                                    </Text>
                                </HStack>
                            </HStack>

                            <Button 
                                onPress={handleExerciseHistoryRegister}
                                title="Marcar como realizado"
                                isLoading={sendingRegister}
                            />
                        </Box>
                    </VStack>
                </ScrollView>
            )}

        </VStack>
    );
} 