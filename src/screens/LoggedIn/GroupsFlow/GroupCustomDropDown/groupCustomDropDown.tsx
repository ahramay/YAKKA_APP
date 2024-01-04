import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {Toast} from "react-native-toast-message/lib/src/Toast";

interface DropdownProps {
    options?: string[];
    onSelect?: (option: string, index: number) => void;
    height?:number;
    placeHolder?: string;
    width?:any;
    selectedValues?: any;
    // multiSelect?: boolean;
}

const GroupCustomDropDown: React.FC<DropdownProps> = (props: DropdownProps) => {
    const { options, onSelect, height = 150, placeHolder = 'Select option', width = '93%', multiSelect = false} = props
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSelect = (idx: number, value: string) => {
        const updatedSelections = [...selectedOptions];

        if (!multiSelect) {
            // Single-select mode, clear previous selections
            updatedSelections.length = 0;
        }

        if (updatedSelections.includes(value)) {
            // Deselect the option
            updatedSelections.splice(updatedSelections.indexOf(value), 1);
        } else {
            // Check if the maximum limit of selections is reached
            if (updatedSelections.length < 1) {
                // Select the option
                updatedSelections.push(value);
            } else {
                Toast.show({ text1: "Maximum 1 categories can be selected" });
            }
        }

        setSelectedOptions(updatedSelections);
        onSelect(updatedSelections);

    };

    return (
        <View style={styles.container}>
            <ModalDropdown
                options={options}
                onSelect={(idx, value) => handleSelect(idx, value)}
                dropdownStyle={[styles.dropdown, {maxHeight: height, width: width}]}
            >
                <View style={styles.dropdownButton}>
                    <Text style={styles.buttonText}>{selectedOptions.length > 0
                        ? selectedOptions.join(', ')
                        : placeHolder }</Text>
                    <Text style={styles.arrow}>▼</Text>
                </View>
            </ModalDropdown>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    dropdown: {
        // width: '93%', // Set the width to 100% for full width
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
        // backgroundColor: 'red',
         marginTop: -15,
    },

    dropdownButton: {
        flexDirection: 'row', // Display text and arrow side by side
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F9F9F9EF',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#F9F9F9EF'
    },
    buttonText: {
        flex: 1, // Allow text to take up available space
        color: 'black',
    },
    arrow: {
        fontSize: 18,
        color: 'black',
    },
});

export default GroupCustomDropDown;
