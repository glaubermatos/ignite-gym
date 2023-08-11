import { useState } from "react";
import { Heading, VStack, SectionList, Text, Center } from "native-base";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";

export function History() {
    const [exercises, setExercises] = useState([{
        title: "07.08.23",
        data: ["Costas", "Ombros"]
    },
    {
        title: "06.08.23",
        data: ["Costas", "Ombros"]
    }])

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de exercícios" />

            <SectionList 
              sections={exercises}
              keyExtractor={(item) => item}
              renderSectionHeader={({section: {title}}) => (
                <Heading color="gray.200" fontSize="md" fontFamily="heading" mt={10} mb={3}>
                    {title}
                </Heading>
              )}
              renderItem={() => (
                <HistoryCard />
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

        </VStack>
    );
}