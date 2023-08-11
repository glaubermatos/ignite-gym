import { HStack, Heading, Text, VStack } from "native-base";

export function HistoryCard() {
    return (
      <HStack  w="full" bg="gray.600" py={4} px={5} rounded="md" mb={3} alignItems="center" justifyContent="space-between">
        <VStack flex={1}>
          <Heading color="white" fontSize="md" fontFamily="heading" textTransform="capitalize" numberOfLines={1} >
            Costas
          </Heading>

          <Text color="gray.100" mt={1} numberOfLines={1} >
            Puxada frontal
          </Text>
        </VStack>  

        <Text color="gray.300" fontSize="md"  ml={1}>
            08:56
        </Text>
      </HStack>
    );
}