import { HistoryDTO } from "@dtos/HistoryDTO";
import { HStack, Heading, Text, VStack } from "native-base";

type Props = {
  data: HistoryDTO
}

export function HistoryCard({ data }: Props) {
    return (
      <HStack  w="full" bg="gray.600" py={4} px={5} rounded="md" mb={3} alignItems="center" justifyContent="space-between">
        <VStack flex={1}>
          <Heading color="white" fontSize="md" fontFamily="heading" textTransform="capitalize" numberOfLines={1} >
            {data.group}
          </Heading>

          <Text color="gray.100" mt={1} numberOfLines={1} >
            {data.name}
          </Text>
        </VStack>  

        <Text color="gray.300" fontSize="md"  ml={1}>
            {data.hour}
        </Text>
      </HStack>
    );
}