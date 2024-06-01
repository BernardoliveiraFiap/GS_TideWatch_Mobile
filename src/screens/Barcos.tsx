import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Barcos() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [boats, setBoats] = useState([]);
  const [task, setTask] = useState('');
  const [boatId, setBoatId] = useState('');
  const [date, setDate] = useState('');
  const [selectedBoat, setSelectedBoat] = useState(null);

  const loadBoats = async () => {
    try {
      const storedBoats = await AsyncStorage.getItem('boats');
      if (storedBoats) {
        setBoats(JSON.parse(storedBoats));
      }
    } catch (error) {
      console.error('Failed to load boats from storage', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadBoats();
    }
  }, [isFocused]);

  const addBoat = async () => {
    if (boats.length >= 3) {
      Alert.alert('Limite Atingido', 'Limite máximo de 3 barcos');
      return;
    }
    const newBoat = { id: Date.now().toString(), task, boatId, date };
    const updatedBoats = [...boats, newBoat];
    setBoats(updatedBoats);
    try {
      await AsyncStorage.setItem('boats', JSON.stringify(updatedBoats));
      navigation.navigate('Home', { addingBoat: true });
    } catch (error) {
      console.error('Failed to save boat to storage', error);
    }
  };

  const updateBoat = async () => {
    const updatedBoats = boats.map(boat => 
      boat.id === selectedBoat.id ? { ...boat, task, boatId, date } : boat
    );
    setBoats(updatedBoats);
    try {
      await AsyncStorage.setItem('boats', JSON.stringify(updatedBoats));
      setSelectedBoat(null);
      setTask('');
      setBoatId('');
      setDate('');
    } catch (error) {
      console.error('Failed to update boat in storage', error);
    }
  };

  const removeBoat = async (id) => {
    const updatedBoats = boats.filter(boat => boat.id !== id);
    setBoats(updatedBoats);
    try {
      await AsyncStorage.setItem('boats', JSON.stringify(updatedBoats));
    } catch (error) {
      console.error('Failed to remove boat from storage', error);
    }
  };

  const renderBoat = ({ item }) => (
    <View style={styles.boatItem}>
      <Image source={require('../../assets/barco.png')} style={styles.boatImage} />
      <View style={styles.boatInfo}>
        <Text style={styles.boatText}>Task: {item.task}</Text>
        <Text style={styles.boatText}>ID: {item.boatId}</Text>
        <Text style={styles.boatText}>Date: {item.date}</Text>
      </View>
      <TouchableOpacity onPress={() => removeBoat(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        setSelectedBoat(item);
        setTask(item.task);
        setBoatId(item.boatId);
        setDate(item.date);
      }} style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Barcos⛵</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task"
          value={task}
          onChangeText={setTask}
        />
        <TextInput
          style={styles.input}
          placeholder="Boat ID"
          value={boatId}
          onChangeText={setBoatId}
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={date}
          onChangeText={setDate}
        />
        {selectedBoat ? (
          <TouchableOpacity onPress={updateBoat} style={styles.addButton}>
            <Text style={styles.addButtonText}>Atualizar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={addBoat} style={styles.addButton}>
            <Text style={styles.addButtonText}>Adicionar Barco</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={boats}
        renderItem={renderBoat}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
          <Text style={styles.footerText}>Home🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Coleta')} style={styles.footerButton}>
          <Text style={styles.footerText}>Coleta♻️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Barcos')} style={styles.footerButton}>
          <Text style={styles.footerText}>Barcos⛵</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011633',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#1c4e80',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#ede8fb',
    color: '#000000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    width: '100%',
    backgroundColor: '#5eacff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
  },
  boatItem: {
    width: '100%',
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boatImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  boatInfo: {
    flex: 1,
  },
  boatText: {
    color: '#ffffff',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#f39c12',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 9,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  footerButton: {
    padding: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#ffffff',
  },
});
