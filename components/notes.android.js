import React from 'react';
import { StyleSheet, TouchableHighlight} from 'react-native';
import { Text, View, Form, Item, Input, List, Button, Icon, Toast, ListItem, Body, Right, Left} from 'native-base';
import firebase from 'firebase';


class Notes extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      formOpened: false,
      user: null,
      signatureName: null,
      signatureNote1: 0,
      signaturePercent1: 0,
      signatureNote2: 0,
      signaturePercent2: 0,
      signatureNote3: 0,
      signaturePercent3: 0,
      signatureNote4: 0,
      signaturePercent4: 0,
      signatureNote5: 0,
      signaturePercent5: 0,
      signatureNote6: 0,
      signaturePercent6: 0,
      signatureNote7: 0,
      signaturePercent7: 0,
      totalPercent: 0,
      allNotes: [],
      notesEmpty: null,
      selectedSignature: [],
      signatureOpened: false,
      editingSignature: false,
      boredArray: []
    }
  }

  componentWillMount(){
    this.setState({
      user: this.props.user
    })

    this.props.title("Notas")
    var userUid = this.props.user.uid;


    dataBaseRef = firebase.database().ref('notes/'+userUid+'/');
    dataBaseRef.on('child_added', snapchot =>{
      this.setState({
        allNotes: this.state.allNotes.concat(snapchot.val())
      })
    })

    var thisHere = this;


    firebase.database().ref('notes').child(userUid).once('value', function(snapshot) {
      if (snapshot.exists()) {
        thisHere.setState({
          notesEmpty: false
        })
      }
      else {
        thisHere.setState({
          notesEmpty: true
        })
      }
    })
  }

  componentWillUnmount() {
    //-------- Es necesario desmontar la referencia de la base de datos, de no ser asi al volver a cargar el componente simplemente leera el primer registro de la base de datos por alguna razon
    dataBaseRef.off();
  }

  upload = () => {
    let signatureName = this.state.signatureName;
    let signatureNote1 = this.state.signatureNote1;
    let signaturePercent1 = this.state.signaturePercent1;
    let signatureNote2 = this.state.signatureNote2;
    let signaturePercent2 = this.state.signaturePercent2;
    let signatureNote3 = this.state.signatureNote3;
    let signaturePercent3 = this.state.signaturePercent3;
    let signatureNote4 = this.state.signatureNote4;
    let signaturePercent4 = this.state.signaturePercent4;
    let signatureNote5 = this.state.signatureNote5;
    let signaturePercent5 = this.state.signaturePercent5;
    let signatureNote6 = this.state.signatureNote6;
    let signaturePercent6 = this.state.signaturePercent6;
    let signatureNote7 = this.state.signatureNote7;
    let signaturePercent7 = this.state.signaturePercent7;
    let randomNumber = Math.floor((Math.random() * 1000) + 1);
    let uid = signatureName+randomNumber;

    if (signatureName != null) {
      if (signatureNote1) {signatureNote1 = signatureNote1.replace(",", ".");}
      if (signatureNote2) {signatureNote2 = signatureNote2.replace(",", ".");}
      if (signatureNote3) {signatureNote3 = signatureNote3.replace(",", ".");}
      if (signatureNote4) {signatureNote4 = signatureNote4.replace(",", ".");}
      if (signatureNote5) {signatureNote5 = signatureNote5.replace(",", ".");}
      if (signatureNote6) {signatureNote6 = signatureNote6.replace(",", ".");}
      if (signatureNote7) {signatureNote7 = signatureNote7.replace(",", ".");}
      if (signaturePercent1) {signaturePercent1 = signaturePercent1.replace("%", "");}
      if (signaturePercent2) {signaturePercent2 = signaturePercent2.replace("%", "");}
      if (signaturePercent3) {signaturePercent3 = signaturePercent3.replace("%", "");}
      if (signaturePercent4) {signaturePercent4 = signaturePercent4.replace("%", "");}
      if (signaturePercent5) {signaturePercent5 = signaturePercent5.replace("%", "");}
      if (signaturePercent6) {signaturePercent6 = signaturePercent6.replace("%", "");}
      if (signaturePercent7) {signaturePercent7 = signaturePercent7.replace("%", "");}

      let totalPercent = parseInt(signaturePercent1) + parseInt(signaturePercent2) + parseInt(signaturePercent3) + parseInt(signaturePercent4) + parseInt(signaturePercent5) + parseInt(signaturePercent6) + parseInt(signaturePercent7);

      if (totalPercent <= 100) {
        var record ={
          name: signatureName,
          nota0: signatureNote1,
          nota1: signatureNote2,
          nota2: signatureNote3,
          nota3: signatureNote4,
          nota4: signatureNote5,
          nota5: signatureNote6,
          nota6: signatureNote7,
          percent0: signaturePercent1,
          percent1: signaturePercent2,
          percent2: signaturePercent3,
          percent3: signaturePercent4,
          percent4: signaturePercent5,
          percent5: signaturePercent6,
          percent6: signaturePercent7,
          asignatureId: uid
        }


        let userId =this.state.user.uid;


        const dbRef = firebase.database().ref('notes/'+userId+'/'+uid);
        dbRef.set(record);
        this.setState({
          formOpened: false
        })
        Toast.show({
          text: 'La asignatura ha sido registrada correctamente.',
          position: 'bottom',
          buttonText: 'Okay'
        })
      }
      else{
        Toast.show({
          text: 'El total de porcentaje de la asignatura debe ser menor a 100.',
          position: 'bottom',
          buttonText: 'Okay'
        })
      }
    }
    else{
      Toast.show({
        text: 'Asegúrese de llenar el campo de nombrer antes de enviar.',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }
  }

  notesForm = () => {
    if (this.state.formOpened) {
      return(
        <Form>
          <Text style={styles.texts}>
            Recuerde que la información que publique aquí podrá ser vista por los demás usuarios.
          </Text>
          <Item>
            <Input placeholder="Nombre" onChangeText={(data) => {this.setState({signatureName: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Nota #1"} onChangeText={(data) => {this.setState({signatureNote1: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Porcentaje Nota #1"} onChangeText={(data) => {this.setState({signaturePercent1: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Nota #2"} onChangeText={(data) => {this.setState({signatureNote2: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Porcentaje Nota #2"} onChangeText={(data) => {this.setState({signaturePercent2: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Nota #3"} onChangeText={(data) => {this.setState({signatureNote3: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Porcentaje Nota #3"} onChangeText={(data) => {this.setState({signaturePercent3: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Nota #4"} onChangeText={(data) => {this.setState({signatureNote4: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Porcentaje Nota #4"} onChangeText={(data) => {this.setState({signaturePercent4: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Nota #5"} onChangeText={(data) => {this.setState({signatureNote5: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Porcentaje Nota #5"} onChangeText={(data) => {this.setState({signaturePercent5: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Nota #6"} onChangeText={(data) => {this.setState({signatureNote6: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Porcentaje Nota #6"} onChangeText={(data) => {this.setState({signaturePercent6: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Nota #7"} onChangeText={(data) => {this.setState({signatureNote7: data})}} />
          </Item>
          <Item>
            <Input numeric placeholder={"Porcentaje Nota #7"} onChangeText={(data) => {this.setState({signaturePercent7: data})}} />
          </Item>
          <Button style={styles.buttons} onPress={this.upload} full>
            <Text>Enviar</Text>
          </Button>
          <Button style={styles.cancelButtons} full onPress={()=>{this.setState({formOpened: false})}}>
            <Text>Cancelar</Text>
          </Button>

        </Form>
      )
    }
    else{
      return(
        <View>
          <Text style={styles.texts}>{'¿Quieres agregar una asignatura nueva?'}</Text>
          <Button transparent onPress={() => { this.setState({formOpened: true})}}>
            <Text>Click Aqui</Text>
          </Button>
        </View>
      )
    }

  }

  calcule = (n1,p1,n2,p2,n3,p3,n4,p4,n5,p5,n6,p6,n7,p7,) => {

    let notaN1 = n1 * (p1/100)
    let notaN2 = n2 * (p2/100)
    let notaN3 = n3 * (p3/100)
    let notaN4 = n4 * (p4/100)
    let notaN5 = n5 * (p5/100)
    let notaN6 = n6 * (p6/100)
    let notaN7 = n7 * (p7/100)
    let prom = notaN1+notaN2+notaN3+notaN4+notaN5+notaN6+notaN7;
    return( prom.toFixed(2) )
  }


  saveEdit = () =>{
    let signatureName = this.state.signatureName;
    let signatureNote1 = this.state.signatureNote1;
    let signaturePercent1 = this.state.signaturePercent1;
    let signatureNote2 = this.state.signatureNote2;
    let signaturePercent2 = this.state.signaturePercent2;
    let signatureNote3 = this.state.signatureNote3;
    let signaturePercent3 = this.state.signaturePercent3;
    let signatureNote4 = this.state.signatureNote4;
    let signaturePercent4 = this.state.signaturePercent4;
    let signatureNote5 = this.state.signatureNote5;
    let signaturePercent5 = this.state.signaturePercent5;
    let signatureNote6 = this.state.signatureNote6;
    let signaturePercent6 = this.state.signaturePercent6;
    let signatureNote7 = this.state.signatureNote7;
    let signaturePercent7 = this.state.signaturePercent7;
    let randomNumber = Math.floor((Math.random() * 1000) + 1);
    let uid = this.state.selectedSignature.asignatureId;

    if (signatureName != null) {
      if (signatureNote1) {signatureNote1 = signatureNote1.replace(",", ".");}
      if (signatureNote2) {signatureNote2 = signatureNote2.replace(",", ".");}
      if (signatureNote3) {signatureNote3 = signatureNote3.replace(",", ".");}
      if (signatureNote4) {signatureNote4 = signatureNote4.replace(",", ".");}
      if (signatureNote5) {signatureNote5 = signatureNote5.replace(",", ".");}
      if (signatureNote6) {signatureNote6 = signatureNote6.replace(",", ".");}
      if (signatureNote7) {signatureNote7 = signatureNote7.replace(",", ".");}
      if (signaturePercent1) {signaturePercent1 = signaturePercent1.replace("%", "");}
      if (signaturePercent2) {signaturePercent2 = signaturePercent2.replace("%", "");}
      if (signaturePercent3) {signaturePercent3 = signaturePercent3.replace("%", "");}
      if (signaturePercent4) {signaturePercent4 = signaturePercent4.replace("%", "");}
      if (signaturePercent5) {signaturePercent5 = signaturePercent5.replace("%", "");}
      if (signaturePercent6) {signaturePercent6 = signaturePercent6.replace("%", "");}
      if (signaturePercent7) {signaturePercent7 = signaturePercent7.replace("%", "");}

    let totalPercent = parseInt(signaturePercent1) + parseInt(signaturePercent2) + parseInt(signaturePercent3) + parseInt(signaturePercent4) + parseInt(signaturePercent5) + parseInt(signaturePercent6) + parseInt(signaturePercent7);

    if (totalPercent <= 100) {
      var record ={
        name: signatureName,
        nota0: signatureNote1,
        nota1: signatureNote2,
        nota2: signatureNote3,
        nota3: signatureNote4,
        nota4: signatureNote5,
        nota5: signatureNote6,
        nota6: signatureNote7,
        percent0: signaturePercent1,
        percent1: signaturePercent2,
        percent2: signaturePercent3,
        percent3: signaturePercent4,
        percent4: signaturePercent5,
        percent5: signaturePercent6,
        percent6: signaturePercent7,
        asignatureId: uid
      }
      let userId =this.state.user.uid;
      const dbRef = firebase.database().ref('notes/'+userId+'/'+uid);
      dbRef.update(record);


      this.setState({
        selectedSignature: record,
        allNotes: []
      })

      dataBaseRef.off();

      setTimeout(()=>{
        dataBaseRef = firebase.database().ref('notes/'+userId+'/');
        dataBaseRef.on('child_added', snapchot =>{
          this.setState({
            allNotes: this.state.allNotes.concat(snapchot.val())
          })
        })
      },100)


      dataBaseRef.off();


      this.setState({
        editingSignature:false
      })
      Toast.show({
        text: 'La asignatura ha sido editada correctamente.',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }
    else{
      Toast.show({
        text: 'El total de porcentaje de la asignatura debe ser menor a 100.',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }
  }
  else{
    Toast.show({
      text: 'Asegúrese de llenar el campo de nombrer antes de enviar.',
      position: 'bottom',
      buttonText: 'Okay'
    })
  }
  }

  allNotes = () => {
    if (this.state.notesEmpty) {
      return(
        <Text style={styles.texts}>No hay notas</Text>
      )
    }
    else{
      if (this.state.signatureOpened) {



        if (this.state.editingSignature) {
          var item = this.state.selectedSignature;
          return(
            <Form>
              <Text style={styles.texts}>
                Editar la asignatura {item.name}
              </Text>
              <Item>
                <Input defaultValue={item.name} placeholder="Nombre" onChangeText={(data) => {this.setState({signatureName: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.nota0} numeric placeholder={"Nota #1"} onChangeText={(data) => {this.setState({signatureNote1: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.percent0} numeric placeholder={"Porcentaje Nota #1"} onChangeText={(data) => {this.setState({signaturePercent1: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.nota1} numeric placeholder={"Nota #2"} onChangeText={(data) => {this.setState({signatureNote2: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.percent1} numeric placeholder={"Porcentaje Nota #2"} onChangeText={(data) => {this.setState({signaturePercent2: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.nota2} numeric placeholder={"Nota #3"} onChangeText={(data) => {this.setState({signatureNote3: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.percent2} numeric placeholder={"Porcentaje Nota #3"} onChangeText={(data) => {this.setState({signaturePercent3: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.nota3} numeric placeholder={"Nota #4"} onChangeText={(data) => {this.setState({signatureNote4: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.percent3} numeric placeholder={"Porcentaje Nota #4"} onChangeText={(data) => {this.setState({signaturePercent4: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.nota4} numeric placeholder={"Nota #5"} onChangeText={(data) => {this.setState({signatureNote5: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.percent4} numeric placeholder={"Porcentaje Nota #5"} onChangeText={(data) => {this.setState({signaturePercent5: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.nota5} numeric placeholder={"Nota #6"} onChangeText={(data) => {this.setState({signatureNote6: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.percent5} numeric placeholder={"Porcentaje Nota #6"} onChangeText={(data) => {this.setState({signaturePercent6: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.nota6} numeric placeholder={"Nota #7"} onChangeText={(data) => {this.setState({signatureNote7: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Item>
                <Input defaultValue={item.percent6} numeric placeholder={"Porcentaje Nota #7"} onChangeText={(data) => {this.setState({signaturePercent7: data})}} />
                <Icon style={styles.icon} name='create' />
              </Item>
              <Button style={styles.buttons} onPress={this.saveEdit} full>
                <Text>Enviar</Text>
              </Button>
              <Button style={styles.cancelButtons} full onPress={()=>{this.setState({editingSignature: false})}}>
                <Text>Cancelar</Text>
              </Button>

            </Form>
          )
        }
        else{
          var item = this.state.selectedSignature;
          return(
            <List>
              <ListItem>
                <Left>
                  <Text>Nombre:</Text>
                </Left>
                <Body>
                  <Text>{item.name}</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>{'Nota 1'}</Text>
                </Left>
                <Body>
                  <Text>{item.nota0}</Text>
                </Body>
                <Right>
                <Text>{item.percent0}%</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>{'Nota 2'}</Text>
                </Left>
                <Body>
                  <Text>{item.nota1}</Text>
                </Body>
                <Right>
                <Text>{item.percent1}%</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>{'Nota 3'}</Text>
                </Left>
                <Body>
                  <Text>{item.nota2}</Text>
                </Body>
                <Right>
                <Text>{item.percent2}%</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>{'Nota 4'}</Text>
                </Left>
                <Body>
                  <Text>{item.nota3}</Text>
                </Body>
                <Right>
                <Text>{item.percent3}%</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>{'Nota 5'}</Text>
                </Left>
                <Body>
                  <Text>{item.nota4}</Text>
                </Body>
                <Right>
                <Text>{item.percent4}%</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>{'Nota 6'}</Text>
                </Left>
                <Body>
                  <Text>{item.nota5}</Text>
                </Body>
                <Right>
                <Text>{item.percent5}%</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>{'Nota 7'}</Text>
                </Left>
                <Body>
                  <Text>{item.nota6}</Text>
                </Body>
                <Right>
                <Text>{item.percent6}%</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Body>
                  <Text>Total:</Text>
                </Body>
                <Right>
                <Text>{this.calcule(item.nota0,item.percent0,item.nota1,item.percent1,item.nota2,item.percent2,item.nota3,item.percent3,item.nota4,item.percent4,item.nota5,item.percent5,item.nota6,item.percent6)}</Text>
                </Right>
              </ListItem>
              <View style={styles.row}>
                <Button style={styles.cancelButtons} onPress={() => {this.setState({signatureOpened: false, selectedSignature: []})}}>
                  <Icon style={{color: "#fff"}} name='undo' />
                  <Text>Atras</Text>
                </Button>
                <Button style={styles.buttons} onPress={() => {
                  this.setState({
                    editingSignature: true,
                    signatureName: this.state.selectedSignature.name,
                    signatureNote1: this.state.selectedSignature.nota0,
                    signaturePercent1: this.state.selectedSignature.percent0,
                    signatureNote2: this.state.selectedSignature.nota1,
                    signaturePercent2: this.state.selectedSignature.percent1,
                    signatureNote3: this.state.selectedSignature.nota2,
                    signaturePercent3: this.state.selectedSignature.percent2,
                    signatureNote4: this.state.selectedSignature.nota3,
                    signaturePercent4: this.state.selectedSignature.percent3,
                    signatureNote5: this.state.selectedSignature.nota4,
                    signaturePercent5: this.state.selectedSignature.percent4,
                    signatureNote6: this.state.selectedSignature.nota5,
                    signaturePercent6: this.state.selectedSignature.percent5,
                    signatureNote7: this.state.selectedSignature.nota6,
                    signaturePercent7: this.state.selectedSignature.percent6,
                  })
                }}>
                  <Icon style={{color: "#fff"}} name='create' />
                  <Text>Editar</Text>
                </Button>
              </View>
            </List>
          )
        }
      }
      else{
        return(
          <List>

            <ListItem icon>
              <Body>
                <Text>Nombre</Text>
              </Body>
              <Right>
              <Text>Prom</Text>
              </Right>
            </ListItem>
            {
              this.state.allNotes.map((signature, i) =>
                <ListItem icon  key={i} onPress={() => {this.setState({selectedSignature: signature, signatureOpened: true })}}>
                  <Left>
                    <Icon style={styles.icon} name="school" />
                  </Left>
                  <Body>
                    <Text>{signature.name}</Text>
                  </Body>
                  <Right>
                  <Text>{this.calcule(signature.nota0, signature.percent0, signature.nota1, signature.percent1, signature.nota2, signature.percent2, signature.nota3, signature.percent3, signature.nota4, signature.percent4, signature.nota5, signature.percent5, signature.nota6, signature.percent6)}</Text>
                  </Right>
                </ListItem>
              )
            }
          </List>
        )
      }
    }

  }


  loadContent = () => {
    return(
      <View>
        <View>
          {this.notesForm()}
        </View>
        <View>
          {this.allNotes()}
        </View>
      </View>
    )
  }


  render(){
    return(
      <View>
        {this.loadContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  green: {
    backgroundColor: '#4CAF50'
  },
  texts: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundedButtonAdd: {
    margin: 5,
    width: 48,
    height: 48,
    backgroundColor: '#4CAF50',
  },
  roundedButtonRemove: {
    margin: 5,
    width: 48,
    height: 48,
    backgroundColor: '#F44336',
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: '#4CAF50',
  },
  cancelButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: '#F44336',
  },
  icon: {
    color: '#4CAF50',
  }
})


export default Notes;
