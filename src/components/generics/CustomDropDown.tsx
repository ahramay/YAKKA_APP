import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import ModalDropdown from 'react-native-modal-dropdown';
import MultiSelect from "react-native-multiple-select";
import { Toast } from "react-native-toast-message/lib/src/Toast";

type DropDownOptions = { id: number; name: string }[] | undefined;
interface DropdownProps {
  options: DropDownOptions;
  onSelect: (value: any) => void;
  placeHolder: string;
  maximumSelect: number;
}

const CustomDropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const { options, placeHolder, maximumSelect, onSelect } = props;
  const [selectedItems, setSelectedItems] = useState([]);
//   const [isListOpen, setIsListOpen] = useState(false);

//   const onToggleList = () => {
//     setIsListOpen(!isListOpen);
//   };
//   console.log("A",isListOpen)
//  const multiSelectContainerStyle = {
//     backgroundColor: isListOpen ? 'lightblue' : 'lightgrey',
//     borderRadius: isListOpen ? 0 : 10,
//   };

  const handleSelect = (value: any[]) => {
    if (value.length <= maximumSelect) {
      setSelectedItems(value);
      onSelect(value);
    } else {
      Toast.show({ text1: `Maximum Choices Allowed (${maximumSelect})` });
    }
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        hideTags
        items={options}
        uniqueKey="id"
        // styleMultiSelectContainer={multiSelectContainerStyle}
        onSelectedItemsChange={value => handleSelect(value)}
        selectedItems={selectedItems}
        showArrow={false}
        selectText={placeHolder}
        searchInputPlaceholderText=""
        onChangeInput={text => console.log("Ehhhh", text)}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedText={"Categories"}
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        hideSubmitButton={true}
        displayKey="name"
        searchInputStyle={{ color: "#CCC" }}
        submitButtonColor="black"
        textInputProps={{ editable: false }}
        searchIcon={false}
        submitButtonText="Done"
        // onToggleList={onToggleList} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dropdown: {
    // width: '93%', // Set the width to 100% for full width
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
    // backgroundColor: 'red',
    marginTop: -15
  },

  dropdownButton: {
    flexDirection: "row", // Display text and arrow side by side
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F9F9F9EF",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#F9F9F9EF"
  },
  buttonText: {
    flex: 1, // Allow text to take up available space
    color: "black"
  },

  arrow: {
    fontSize: 18,
    color: "black"
  },
});

export default CustomDropdown;
