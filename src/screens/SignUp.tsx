import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from 'native-base'
import { useForm, Controller } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png';

import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { api } from '@services/api';



const SignUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  password: yup.string().required('Informe a senha').min(6, "A senha deve ter pelo menos 6 digitos"),
  password_confirm: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], "A confirmação da senha não confere"),
})

type FormDataProps = yup.InferType<typeof SignUpSchema>;
// type FormDataProps = {
//   name: string;
//   email: string;
//   password: string;
//   password_confirm: string;
// }

export function SignUp() {
    const navigation = useNavigation()
    const toast = useToast()

    const { control, handleSubmit, reset, formState: {errors}} = useForm<FormDataProps>({
      resolver: yupResolver(SignUpSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        password_confirm: ""
      }
    })

    async function handleSignUp({name, email, password}: FormDataProps) {
      try {
        const response = await api.post("/users", {name, email, password})
        console.log(response)
        
        reset()
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError ? error.message : "Não foi possível criar a conta. Tente novamente mais tarde."

        toast.show({
          title,
          bgColor: "red.500",
          placement: "top",
        })
      }
    }

    function handleGoBack() {
      navigation.goBack()
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
          <VStack flex={1} px={10} pb={16}>
            <Image
              source={BackgroundImg}
              defaultSource={BackgroundImg}
              alt="Pessoas treinando"
              resizeMode="contain"
              position={"absolute"}
            />

            <Center my={24}>
              <LogoSvg />

              <Text color={"gray.100"} fontSize={"sm"}>
                  Treine sua mente e o seu corpo
              </Text>
            </Center>

            <Center>
              <Heading fontSize={"xl"} color={"gray.100"} mb={6} fontFamily="heading">
                  Crie sua conta
              </Heading>

              <Controller 
                control={control}
                name="name"
                render={({field: {onChange, value}}) => (
                  <Input 
                      placeholder="Nome"
                      onChangeText={onChange}
                      value={value}
                      errorMessage={errors.name?.message}
                  />
                )}
              />

              <Controller 
                control={control}
                name="email"
                render={({field: {onChange, value}}) => (
                  <Input 
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              <Controller 
                control={control}
                name="password"
                render={({field: {onChange, value}}) => (
                  <Input 
                    placeholder="Senha"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Controller 
                control={control}
                name="password_confirm"
                render={({field: {onChange, value}}) => (
                  <Input 
                    placeholder="Confirmação da senha"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={handleSubmit(handleSignUp)}
                    returnKeyType="send"
                    errorMessage={errors.password_confirm?.message}
                  />
                )}
              />

              <Button 
                title="Criar e acessar"
                onPress={handleSubmit(handleSignUp)}
              />
            </Center>

            <Button 
              onPress={handleGoBack}
              title="Voltar para o login"
              variant="outline"
              mt={12}
            />
        </VStack>
        </ScrollView>
    );
}