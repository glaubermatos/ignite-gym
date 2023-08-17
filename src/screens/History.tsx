import { useCallback, useEffect, useState } from "react";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { AppError } from "@utils/AppError";
import { Loading } from "@components/Loading";
import { api } from "@services/api";
import { useFocusEffect } from "@react-navigation/native";
import { HistoryDTO } from "@dtos/HistoryDTO";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

export function History() {
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const toast = useToast()

    async function fetchHistory() {
      try {
        setIsLoading(true)

        const response = await api.get<HistoryByDayDTO[]>('/history')

        setExercises(response.data)
        
      } catch (error) {
        const isAppError = error instanceof AppError

        const title = isAppError ? error.message : "Não foi possível carregar o histórico"

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        })
      } finally {
        setIsLoading(false)
      }
    }

    useFocusEffect(useCallback(() => {
      fetchHistory()
    }, []))

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de exercícios" />

            {isLoading ? <Loading /> : (
              <SectionList 
                sections={exercises}
                keyExtractor={(item, index) => item + '_' + index}
                renderSectionHeader={({section: {title}}) => (
                  <Heading color="gray.200" fontSize="md" fontFamily="heading" mt={10} mb={3}>
                      {title}
                  </Heading>
                )}
                renderItem={({item}) => (
                  <HistoryCard data={item} />
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <Text color="gray.300" textAlign="center">
                      Não há exercícios registrados ainda. {'\n'}
                      Vamos fazer exercícios hoje?
                  </Text>
                )}
                contentContainerStyle={[
                  { paddingBottom: 20 },
                  exercises.length === 0 && { flex: 1, justifyContent: 'center' },
                ]}
                px={8}
              />
            )}

        </VStack>
    );
}