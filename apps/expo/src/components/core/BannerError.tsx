import React, { LegacyRef } from "react";
import { Text, type TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface TextInputProps extends TextProps {
  error?: string;
}

const BannerError = React.forwardRef(
  (props: TextInputProps, ref: LegacyRef<Text>) => {
    const { error, className } = props;

    return (
      <Text
        ref={ref}
        {...props}
        className={twMerge(
          "rounded border border-red-200 bg-red-50 p-2 text-center text-sm font-medium text-red-800",
          className,
        )}
      >
        {error}
      </Text>
    );
  },
);

export default BannerError;
