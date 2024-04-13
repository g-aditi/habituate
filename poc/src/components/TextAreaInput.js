import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const TextAreaInput = ({onTextChange}) => {
  const [text, setText] = useState('');

  const handleTextChange = newText => {
    setText(newText);
    onTextChange(newText);
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        onChangeText={handleTextChange}
        value={text}
        placeholder="Enter your text here..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  textArea: {
    width: '90%',
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
});

export default TextAreaInput;
