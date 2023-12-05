import React, { LegacyRef } from "react";
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  View,
  Text,
} from "react-native";
import { twMerge } from "tailwind-merge";

interface TextInputProps extends NativeTextInputProps {
  error?: string;
}

const TextInput = React.forwardRef(
  (props: TextInputProps, ref: LegacyRef<NativeTextInput>) => {
    const { error, className } = props;

    return (
      <View>
        <NativeTextInput
          ref={ref}
          {...props}
          className={twMerge(
            "my-2 rounded border border-gray-200 bg-white py-1.5 pl-3 shadow-lg",
            error && "border border-red-300 ",
            className,
          )}
        >
          {props.children}
        </NativeTextInput>
        {error && <Text className="text-sm text-red-400">{error}</Text>}
      </View>
    );
  },
);

export default TextInput;
