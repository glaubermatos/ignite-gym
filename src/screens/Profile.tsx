import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import { Controller, useForm } from 'react-hook-form'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"

import defaultUserPhotoImg from "@assets/userPhotoDefault.png"

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";


const PHOTO_SIZE = 33

type FormDataProps = {
  name: string;
  email:string;
  old_password: string;
  password: string;
  confirm_password: string;
}

const profileSchema = yup.object({
  name: yup
  .string()
  .required('Informe o nome'),
  password: yup
  .string()
  .min(6, 'A senha deve ter pelo menos 6 dígitos.')
  .nullable()
  .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: () => yup
        .string()
        .nullable()
        .required('Informe a confirmação da senha')
        .transform((value) => !!value ? value : null),
    })
})

// type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const { user, updateUserProfile } = useAuth()
  const toast = useToast()

  const { control, handleSubmit, formState: { errors }} = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema),
  })

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso.',
        placement: 'top',
        bgColor: 'green.500'
      })

    } catch (error) {
      const isAppError = error instanceof AppError
        
      const title = isAppError ? error.message : "Não foi possível atualizar os dados."

      toast.show({
        title,
        placement: 'top',
        bgColor: "red.500"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri, {size: true});

        if (photoInfo.exists && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB",
            placement: "top",
            bgColor: "red.500"
          })
        }

        //obtem a estenção da imagem
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        //cria um objeto que o backend espera
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any

        //formuário para envio da foto, o backend espera a foto pelo parametro avatar
        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        await updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500'
        })

        console.log(photoFile)

        // setUserPhoto(photoSelected.assets[0].uri)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
      <VStack flex={1}>
        <ScreenHeader title="Perfil" />

        <ScrollView contentContainerStyle={{paddingBottom: 36}}>
          <Center mt={6} px={10}>

            { 
              photoIsLoading ? 
                <Skeleton 
                  h={PHOTO_SIZE}
                  w={PHOTO_SIZE}
                  rounded="full"
                  startColor="gray.500"
                  endColor="gray.400"
                />
              :
                <UserPhoto
                source={
                  user.avatar 
                  ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
                  : defaultUserPhotoImg}
                  alt="Foto do usuário"
                  size={PHOTO_SIZE}
                />
            }

            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <Text color="green.500" fontWeight="bold" fontSize="md" mt={3} mb={8}>
                  Alterar foro
              </Text>
            </TouchableOpacity>

            <Controller 
              name="name"
              control={control}
              render={({field: { onChange, value }}) => (
                <Input 
                  bg="gray.600"
                  placeholder="Nome"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller 
              name="email"
              control={control}
              render={({field: { onChange, value }}) => (
                <Input 
                  bg="gray.600"
                  placeholder="E-mail"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Heading color="gray.200" mt={12} mb={2} fontSize="md" fontFamily="heading" alignSelf="flex-start">
              Alterar senha
            </Heading>

            <Controller 
              control={control}
              name="old_password"
              render={({field: {onChange}}) => (
                <Input 
                  bg="gray.600"
                  placeholder="Senha antiga"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.old_password?.message}
                />
              )}
            />

            <Controller 
              control={control}
              name="password"
              render={({field: {onChange}}) => (
                <Input 
                  bg="gray.600"
                  placeholder="Nova senha"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller 
              control={control}
              name="confirm_password"
              render={({field: {onChange}}) => (
                <Input 
                  bg="gray.600"
                  placeholder="Confirme a nova senha"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button 
              onPress={handleSubmit(handleProfileUpdate)}
              title="Atualizar"
              mt={4}
              isLoading={isUpdating}
            />
          </Center>
        </ScrollView>
      </VStack>
  );
}