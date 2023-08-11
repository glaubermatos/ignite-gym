import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base'

type Props = IButtonProps & {
    title: string;
    variant?: "outline" | "solid";
}

export function Button({title, variant = "solid", ...rest}: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      borderWidth={1}
      bg={variant === "outline" ? "transparent" : "green.700"}
      borderColor={variant === "outline" ? "green.500": "transparent"}
      _pressed={{
        bg: variant === "outline" ? "gray.500" : "green.500",
      }}
      {...rest}
    >
      <Text
        color={variant === "outline" ? "green.500" : "white"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}