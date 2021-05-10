import { Pattern, USER_PATTERNS } from "@devlights/types";
import React from "react";
import { StyleSheet } from "react-native";
import DropDownPicker, {
  DropDownPickerProps,
} from "react-native-dropdown-picker";
import { useTheme } from "react-native-paper";

export interface UniversalPickerProps {
  disabled?: boolean;
  pattern: Pattern;
  pickerOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  changePattern: (pattern: Pattern) => Promise<Pattern>;
}

export default function UniversalPicker(
  props: UniversalPickerProps,
): JSX.Element {
  // TODO
  const { pattern, pickerOpen, onOpen, onClose, disabled } = props;
  const theme = useTheme();
  const { colors } = theme;
  let dropdown: any = null;
  const getRightString = (newPattern?: Pattern): string => {
    switch (newPattern ?? pattern) {
      case "waking":
        return "Waking";
      case "blinking":
        return "Blinking";
      case "custom":
        return "Custom";
      default:
        return newPattern ?? pattern;
    }
  };
  const defaultItems = [
    {
      label: "Single Color",
      value: "plain",
    },
    {
      label: "Gradient",
      value: "gradient",
    },
    {
      label: "Running",
      value: "runner",
    },
    {
      label: "Rainbow",
      value: "rainbow",
    },
    {
      label: "Fading",
      value: "fading",
    },
  ];

  const getDropDownItems = (
    newPattern?: Pattern,
  ): DropDownPickerProps["items"] => {
    if ([USER_PATTERNS, "fading"].includes(newPattern ?? pattern)) {
      return defaultItems;
    }
    return [...defaultItems, { label: getRightString(), value: "unkown" }];
  };

  const [items, setItems] = React.useState<DropDownPickerProps["items"]>(
    getDropDownItems(),
  );

  const handlePatternChange = (newPattern?: Pattern) => {
    setItems(getDropDownItems(newPattern));
    dropdown.selectItem(
      [...USER_PATTERNS, "fading"].includes(newPattern ?? pattern)
        ? newPattern
        : "unkown",
    );
  };
  React.useEffect(() => {
    handlePatternChange(pattern);
  }, [pattern]);

  const changePattern = async (newPattern: string) => {
    if (newPattern !== "unkown" && newPattern !== undefined) {
      if (newPattern !== pattern) {
        const pat = await props.changePattern(newPattern as Pattern);
        handlePatternChange(pat);
      }
    }
  };

  const styles = StyleSheet.create({
    select: {
      marginLeft: 0,
      backgroundColor: colors.dark_grey,
      borderColor: "transparent",
    },
    selectDropdown: {
      marginLeft: 0,
      backgroundColor: colors.grey,
      borderColor: "transparent",
    },
    dropdownItems: {
      justifyContent: "flex-start",
    },
    dropdownLabel: {
      color: theme.colors.text,
      fontSize: 20,
      fontFamily: "TitilliumWeb-Regular",
      fontWeight: "normal",
    },
    dropdownContainer: {
      height: 45,
    },
  });
  return (
    <DropDownPicker
      disabled={disabled}
      items={items}
      controller={(instance: any) => (dropdown = instance)}
      containerStyle={styles.dropdownContainer}
      arrowColor={theme.colors.text}
      arrowSize={26}
      style={styles.select}
      dropDownStyle={styles.selectDropdown}
      labelStyle={styles.dropdownLabel}
      itemStyle={styles.dropdownItems}
      onOpen={onOpen}
      onClose={onClose}
      onChangeItem={(item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        pickerOpen ? changePattern(item.value) : undefined;
      }}
    />
  );
}
