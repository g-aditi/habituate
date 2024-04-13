import {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import {DOWNLOAD_URL, POLL_INTERVAL} from '../constants';

export default function ImageDataDisplayScreen() {
  const [messageText, setMessageText] = useState('Waiting...');

  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData()');
      try {
        const response = await axios.get(DOWNLOAD_URL);
        if (response.status === 200) {
          console.log(JSON.stringify(response.data, null, 4));
          setMessageText(JSON.stringify(response.data, null, 4));
          clearInterval(intervalRef.current); // Clear interval when data is fetched
        } else {
          console.error('pollit(): Unexpected status code:', response.status);
        }
      } catch (error) {
        console.error('pollit():', error);
      }
    };

    const startPolling = async () => {
      console.log('startPolling()');
      intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
      // await fetchData(); // Initial fetch on component mount
    };

    startPolling();

    // Cleanup function to clear interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{messageText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column',
  },
  flatlist: {
    paddingHorizontal: 10,
    // backgroundColor: 'orange',
    minHeight: 300,
    maxHeight: '40%',
  },
  symptomListButton: {
    backgroundColor: '#eee',
    height: 50,
  },
  symptomListButtonSelected: {
    backgroundColor: '#777',
    color: 'white',
    height: 50,
  },
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },
});
