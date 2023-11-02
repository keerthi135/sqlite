import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydb.db');

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Create the 'users' table if it doesn't exist
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists users (id integer primary key not null, name text, email text);'
      );
    });

    // Fetch data from the 'users' table
    fetchData();
  }, []);

  const fetchData = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from users', [], (_, { rows }) => {
          setUsers(rows._array);
        });
      },
      null,
      // You can add a success callback here
      () => console.log('Data fetched successfully')
    );
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSubmit = () => {
    db.transaction(
      tx => {
        tx.executeSql('insert into users (name, email) values (?, ?)', [name, email]);
      },
      null,
      // You can add a success callback here
      () => {
        console.log('Data inserted successfully');
        fetchData(); // Fetch updated data after insertion
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleNameChange}
        value={name}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleEmailChange}
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Button title="Submit" onPress={handleSubmit} />

      <Text style={styles.label}>Users:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>ID: ${item.id}, Name: ${item.name}, Email: ${item.email}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});