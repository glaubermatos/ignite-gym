import { Box, Center, HStack, Heading, Icon, Image, ScrollView, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"

import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Button } from "@components/Button";

export function Exercise() {
    const navigation = useNavigation<AppNavigatorRoutesProps>()

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
                        Puxada frontal
                    </Heading>

                    <HStack alignItems="center">
                        {/* <Icon as={BodySvg} color="gray.300" size={4} /> */}
                        <BodySvg />
                        <Text color="gray.200" fontSize="md" ml={1} textTransform="capitalize">
                            Costas
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            <ScrollView contentContainerStyle={{ paddingBottom: 36}}>
                <VStack px={8} mt={8}>
                    <Image 
                        source={{ uri: "https://williamcarvalhoamaral.files.wordpress.com/2020/01/dorsal-blog.jpg?w=640"}}
                        alt="Foto do exercício"
                        h={80}
                        w="full"
                        rounded="lg"
                        mb={3}
                        resizeMode="cover"
                        overflow="hidden"
                    />

                    <Box px={4} pt={5} pb={4} bg="gray.600" rounded="md">
                        <HStack alignItems="center" justifyContent="space-around" mb={6}>
                            <HStack alignItems="center">
                                <SeriesSvg />

                                <Text color="gray.200" fontSize="md" ml={2}>
                                    3 séries
                                </Text>
                            </HStack>

                            <HStack alignItems="center">
                                <RepetitionsSvg />
                                
                                <Text color="gray.200" fontSize="md" ml={2}>
                                    12 repetições
                                </Text>
                            </HStack>
                        </HStack>

                        <Button 
                        title="Marcar como realizado"
                        />
                    </Box>
                </VStack>
            </ScrollView>

        </VStack>
    );
} 