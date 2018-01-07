import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Spinner, View } from 'native-base';
import LogForm from './components/logForm';
import firebase from 'firebase';
import Main from './components/main';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


















export default class App extends Component<{}> {
  constructor (props){
    super(props)
    this.state = {
      user: null
    }
  }


  componentWillMount(){
    //---------------- Para no tener que loguearme cada vez durante el desarrollo
    this.setState({
      user: {
        displayName: 'Juan Carlos Santa Abreu',
        email: 'Jcarlossa120@hotmail.com',
        photoURL: "https://firebasestorage.googleapis.com/v0/b/universidad-41c49.appspot.com/o/profilePics%2Fno-photo-male.jpg?alt=media&token=65b5f92a-aab5-47c8-bcd5-dee6758335ba",
        uid: "JCARLOSSA120@HOTMAIL%2ECOM"
      }
    })
  }



  //////////////////////////////////////////////////////////////////////////////////////////////////
  //recibe la informacion de el formulario de inicio de sesion cuando el inicio de sesion es exitoso
  //////////////////////////////////////////////////////////////////////////////////////////////////
  loadUser = (userInfo) => {
    this.setState({
      user: userInfo
    })
  }

  ///////////////////////////////////////////////////////
  //Se encarga comprobar si el usuario esta loguado o no
  ///////////////////////////////////////////////////////
  loadContent = () => {
      //-----------------Verifica si el usuario esta logueado, si no lo esta, lo lleva al formunario de inicio de sesion
      if (this.state.user) {
        return(
          <Main user={this.state.user}/>
        )
      }
      else{
        return(<LogForm userInfo={this.loadUser} />)
      }
  }


  //////////////////////////////////////////
  //Renderisa el contenido de la aplicasion
  //////////////////////////////////////////
  render() {
    return (
      <Container>
        {this.loadContent()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


firebase.initializeApp({
  apiKey: "AIzaSyBgLjjtZysVtP8sbz4fdxF4EytRAoo3KVU",
  authDomain: "universidad-41c49.firebaseapp.com",
  databaseURL: "https://universidad-41c49.firebaseio.com",
  projectId: "universidad-41c49",
  storageBucket: "universidad-41c49.appspot.com",
  messagingSenderId: "130858667369"
});
