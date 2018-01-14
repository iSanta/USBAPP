import React, { Component } from 'react';
import { Platform, StyleSheet, Keyboard } from 'react-native';
import { Text, Root, Header, Left, Button, Icon, Body, Title, Right, Content, Footer, FooterTab, Form, Item, Input, View, Container } from 'native-base';
import firebase from 'react-native-firebase';
import { encode, decode, encodeComponents, decodeComponents } from 'firebase-encode';

class logForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: null,
      email: null,
      pass: null,
      name: null,
      title: 'Inicia sesión'
    }
  }
  componentWillMount(){
    this.setState({
      page: "SessionInit"
    })
  }

  componentWillUnmount() {
    //dataBaseRef.off();
    this.setState({
      page: null,
      email: null,
      pass: null,
      name: null,
    })
  }




  ////////////////////////////////////////////////////
  //lleva a cabo los procesos de Registro con firebase
  ////////////////////////////////////////////////////
  regist = () => {
    Keyboard.dismiss()
    let name = this.state.name;
    let email = this.state.email;
    let pass = this.state.pass;

    if (name != null && email != null && pass != null) {


      //en caso de un espacio al final de correo, lo elimina
      while (/\s+$/.test(email)) {
        email = email.substring(0, email.length - 1);
      }


      //------------------------Crea la UID para el item, lo pone en mayuscula para mantener un estandar y lo codifica de la forma correcta para firebase
      var uid = email.toUpperCase();
      uid = encode(uid);


      //----------------------------------realiza una busqueda en la base de datos con la variable 'uid'
      firebase.database().ref('users').child(uid).once('value', (snapshot) => {

        //------------------------------Determina si el user existe
        if (snapshot.exists()) {
          this.props.showToast('Este usuario ya se encuentra registrado')
        }
        else{
          //------------------------- Crea el array que va a ser fuardado en firebase
          var record ={
            displayName: name,
            email: email,
            passWord: pass,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/universidad-41c49.appspot.com/o/profilePics%2Fno-photo-male.jpg?alt=media&token=65b5f92a-aab5-47c8-bcd5-dee6758335ba',
            uid: uid
          }
          //--------------------------Se hace el registro
          const dbRef = firebase.database().ref('users/' + uid);
          dbRef.set(record);
          this.props.showToast('El registro ha sido exitoso.')
          this.setState({
            page: 'SessionInit',
            title: 'Inicia sesión'
          })

        }





      })
    }
    else{
      this.props.showToast('Por favor asegúrese de llenar todos los campos.')

    }
  }




  ////////////////////////////////////////////////////////////
  //lleva a cabo los procesos de inicio de sesion con firebase
  ////////////////////////////////////////////////////////////
  sessionInit = () => {
    Keyboard.dismiss()
    var email =this.state.email;
    var password =this.state.pass;

    if (email != null && password != null) {

      //-------------------------Elimina los espacios en blanco al final del email, esto por que puede ser colocado de forma automatica en android si se selecciona de las sugerencias de autocompletado
      while (/\s+$/.test(email)) {
        email = email.substring(0, email.length - 1);
      }

      //------------------------Crea la UID para el item, lo pone en mayuscula para mantener un estandar y lo codifica de la forma correcta para firebase
      var uid = email.toUpperCase();
      uid = encode(uid);
      //----------------------------------------- Verifica si el email existe en la base de datos
      console.log(uid);
      //-----------------------ingreso a users de la DB de firebase
      firebase.database().ref('users').child(uid).once('value', (snapshot) => {
        //---------------------Determina si el UID existe en la DB
        if (snapshot.exists()) {
          var userEmail = snapshot.val().email;
          var userPass = snapshot.val().passWord;
          //------------------Ya que el UID si existe, compara el email y el pass de los input con la info de la DB de firebase
          if(userEmail === email && userPass === password){
            const userInfo = {
              displayName: snapshot.val().displayName,
              email: userEmail,
              photoURL: snapshot.val().photoURL,
              uid: uid,
            }
            this.props.userInfo(userInfo);
          }
          else{
            //--------------------- fracaso en el intento de comparar la info de los inputs con la info de la DB de firebase
            this.props.showToast('La contraseña ingresada es incorrecta.')
          }


        }
        else{
          //-------------------No existe el UID en la DB de firebase
          this.props.showToast('No se ha encontrado su correo en la base de datos.')
        }



      })

    }
    else{
      this.props.showToast('Por favor asegúrese de llenar todos los campos.')
    }


  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Determina que contenido va a mostrar al usuario, ya sea el formulario de inicio de sesion o el de registro
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  loadContent = () => {
        if(this.state.page === 'SessionInit'){
          return(
            <View style={styles.viewPadding}>
              <Text style={styles.texts}>Inicia sesión para acceder al contenido de la aplicación.</Text>
              <Form>
                <Item>
                  <Input id='email' placeholder="Correo electrónico" onChangeText={(email) => {this.setState({email})}} />
                </Item>
                <Item last>
                  <Input secureTextEntry={true} id='Pass' placeholder="Password" onChangeText={(pass) => {this.setState({pass})}} />
                </Item>
              </Form>
              <Button onPress={this.sessionInit} style={styles.buttons} block ><Text style={styles.buttonsText}> Iniciar sesion </Text></Button>
              <View style={{marginTop: 100, borderTopColor: '#e4e4e4', borderTopWidth: 1}}>
                <Text style={styles.texts}>Si no te encuentras registrado, puedes hacerlo a continuación. </Text>
                <Button onPress={() => {this.setState({ page: 'Register', title: 'Registrarse'})}} style={styles.buttons} block ><Text style={styles.buttonsText}>Registrarse</Text></Button>
              </View>
            </View>
          )
        }
        else if(this.state.page === 'Register'){
          return(
            <View style={styles.viewPadding}>
              <Text style={styles.texts}>Si no te encuentras registrado, puedes hacerlo a continuación.</Text>
              <Form>
                <Item>
                  <Input id='Name' placeholder="Nombre Completo" onChangeText={(name) => {this.setState({name})}} />
                </Item>
                <Item>
                  <Input id='email' placeholder="Correo electrónico" onChangeText={(email) => {this.setState({email})}} />
                </Item>
                <Item last>
                  <Input id='Pass' secureTextEntry={true} placeholder="Password" onChangeText={(pass) => {this.setState({pass})}} />
                </Item>

                <Button onPress={this.regist} style={styles.buttons} block ><Text style={styles.buttonsText}>Registrarse</Text></Button>
              </Form>
            </View>
          )
        }
  }

  render(){
    return(
      <Container>
        <Header style={styles.green}>
          <Left />
          <Body>
            <Title>{this.state.title}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.loadContent()}
        </Content>
        <Footer>
          <FooterTab style={styles.green}>
            <Button  style={styles.green} full onPress={() => {this.setState({ page: 'SessionInit', title: 'Inicia sesión'})  }} >
              <Icon name='home' style={{color: '#fff'}} />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  texts: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: '#4CAF50',
  },
  green: {
    backgroundColor: '#4CAF50'
  },
  viewPadding: {
    paddingTop: 10,
    paddingBottom: 10
  }
})


export default logForm;
