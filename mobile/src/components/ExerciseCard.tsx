import { HStack, Heading, VStack, Text, Image, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons"

type Props = TouchableOpacityProps & {

}

export function ExerciseCard( {...rest }: Props) {
    return (
        <TouchableOpacity
          {...rest}
        >
            <HStack bg="gray.500" p={2} pr={4} rounded="md" alignItems="center" mb={2}>
              <Image 
                source={{uri: "https://williamcarvalhoamaral.files.wordpress.com/2020/01/dorsal-blog.jpg?w=640"}}
                alt="Imagem exercicio puxada frontal"
                resizeMode="cover"
                h={16}
                w={16}
                rounded="sm"
                mr={4}
              />

              <VStack flex={1}>
                <Heading color="white" fontFamily="heading" fontSize="lg">
                    Remada unilateral
                </Heading>

                <Text color="gray.200" fontFamily="body" fontSize="sm" mt={1} numberOfLines={2}>
                    3 séries x 12 repetições
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