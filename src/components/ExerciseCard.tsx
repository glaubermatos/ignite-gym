import { HStack, Heading, VStack, Text, Image, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons"
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";

type Props = TouchableOpacityProps & {
  data: ExerciseDTO
}

export function ExerciseCard( {data, ...rest }: Props) {
    return (
        <TouchableOpacity
          {...rest}
        >
            <HStack bg="gray.500" p={2} pr={4} rounded="md" alignItems="center" mb={2}>
              <Image 
                source={{uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`}}
                alt="Imagem exercicio puxada frontal"
                resizeMode="cover"
                h={16}
                w={16}
                rounded="sm"
                mr={4}
              />

              <VStack flex={1}>
                <Heading color="white" fontFamily="heading" fontSize="lg">
                    {data.name}
                </Heading>

                <Text color="gray.200" fontFamily="body" fontSize="sm" mt={1} numberOfLines={2}>
                    {data.series} séries x {data.repetitions} repetições
                </Text>
              </VStack>

              <Icon 
                as={Entypo}
                name="chevron-thin-right" 
                size={5} 
                color="gray.300"
              />

            </HStack>
        </TouchableOpacity>
    );
}