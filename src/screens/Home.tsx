import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, HStack, Heading, Text, VStack, useToast } from "native-base";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  
    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const [exercises, setExercises] = useState<ExerciseDTO[]>([])
    const [groups, setGroups] = useState<string[]>([])
    const [groupSelected, setGroupSelected] = useState('antebraço') //pode melhorar

    async function fetchGroups() {
      try {
        const response = await api.get('/groups')

        setGroups(response.data)
      } catch (error) {
        const isAppError = error instanceof AppError

        const title = isAppError ? error.message : "Não foi possível carregar os grupos musculares."

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        })
      } 
    }

    async function fetchExercisesByGroup() {
      try {
        setIsLoading(true)
        const response = await api.get<ExerciseDTO[]>(`/exercises/bygroup/${groupSelected}`)

        setExercises(response.data)

      } catch (error) {
        const isAppError = error instanceof AppError

        const title = isAppError ? error.message : "Não foi possível carregar os exercícios."

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        })
      } finally {
        setIsLoading(false)
      }
    }

    function handleOpenExerciseDetails(exerciseId: number) {
      navigation.navigate("exercise", { exerciseId })
    }

    useFocusEffect(useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected]))

    useEffect(() => {
      fetchGroups()
    }, []) 

    return (
      <VStack flex={1}>
        <HomeHeader />

        <FlatList 
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({item}) => (
            <Group 
                name={item}
                isActive={String(groupSelected).toLocaleUpperCase() === item.toLocaleUpperCase()}
                onPress={() => setGroupSelected(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{
            px: 8,
          }}
          my={10}
          maxH={10}
          minH={10}
        />

        { isLoading ? <Loading /> : (
          <VStack flex={1} px={8}>
            <HStack justifyContent="space-between" mb={5}>
              <Heading color="gray.200" fontSize="md" fontFamily="heading">
                  Exercícios
              </Heading>

              <Text color="gray.200" fontSize="md">
                  {exercises.length}
              </Text>
            </HStack>

            <FlatList 
              data={exercises}
              keyExtractor={(item, index) => item.id + "_" + index}
              renderItem={({item}) => (
                <ExerciseCard
                  data={item}
                  onPress={() => handleOpenExerciseDetails(item.id)}
                />
              )}
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{
                paddingBottom: 20
              }}
            />

          </VStack>
        )}

      </VStack>
    );
}