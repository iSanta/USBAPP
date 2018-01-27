import React from 'react';
import { StyleSheet, Keyboard, TouchableHighlight } from 'react-native';
import { Text, Button, View, Form, Item, Input, Icon, List, ListItem, Body, Card, CardItem, H1 } from 'native-base';
import { encode, decode, encodeComponents, decodeComponents } from 'firebase-encode';
import firebase from 'react-native-firebase';


var dataBaseRef;

class reminder extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      user: null,
      openForm: false,
      categoryName: null,
      categoryDescription: null,
      selectedCategory: [],
      openFormRemind: false,
      remindTitle: null,
      remindContent: null,
      hasSelectedCategory: false,
      allCategoryReminds: [],
      singleRemindSelected: null,
      editView: false,
      deleteOptionS:false,
      reload: false
    }
  }
  componentWillMount(){
    var userInfo = this.props.user;
    this.setState({
      user: userInfo,
      allReminders: []
    })
    this.props.title('Recordatorios')


    dataBaseRef = firebase.database().ref('reminder/'+this.props.user.uid+'/');
    dataBaseRef.on('child_added', snapchot => {
      this.setState({
        allReminders: this.state.allReminders.concat(snapchot.val())
      })
    })


  }





  ////////////////////////////////////////////////
  //Guarda en la base de datos una categotia nueva
  ////////////////////////////////////////////////
  saveCategory = () => {

    let categoryName = this.state.categoryName;
    let categoryDescription = this.state.categoryDescription;

    let userUid = this.state.user.uid;

    if (categoryName != '' && categoryName != null) {
      let categoryUid = encode(categoryName) + Math.floor((Math.random() * 10000) + 1);
      var record = {
        categoryName: categoryName,
        categoryDescription: categoryDescription,
        userUid: userUid,
        categoryUid: categoryUid,
      }
      dataBaseRef = firebase.database().ref('reminder/'+userUid+'/')
      dataBaseRef.child(categoryUid).set(record);
      this.setState({
        openForm: false
      })

      this.props.showToast('La categoría ha sido creada correctamente.')
    }
    else{
      this.props.showToast('Asegúrese de llenar el campo de nombre.')
    }
    Keyboard.dismiss()

  }


  saveRemind = () => {
    let remindTitle = this.state.remindTitle;
    let remindContent = this.state.remindContent;
    let userUid = this.state.user.uid;
    let categoryUid = this.state.selectedCategory.categoryUid;
    if (remindTitle != '' && remindContent != ''){
      let remindUid = encode(remindTitle) + Math.floor((Math.random() * 10000) + 1);
      var record = {
        remindTitle: remindTitle,
        remindContent: remindContent,
        userUid: userUid,
        remindUid: remindUid,
        categoryUid: categoryUid,
      }
      var record2 = {record}

      var allRemi = this.state.allCategoryReminds;
      var allRemi2 =  Object.assign({}, allRemi, record2)

      dataBaseRef = firebase.database().ref('reminder/'+userUid+'/'+categoryUid+'/reminds')
      dataBaseRef.child(remindUid).set(record);
      this.setState({
        openFormRemind: false,
        allCategoryReminds: allRemi2,
        reload: true
      })
      this.props.showToast('El recordatorio ha sido creada correctamente.')

    }
    else{
      this.props.showToast('Asegúrese de llenar los campos de titulo y contenido.')
    }

  }

  /////////////////////////////////////////////////////
  //Abre y cierra sa seccion de crear un nuevo recuerdo
  /////////////////////////////////////////////////////
  newCategory = () => {
    if (this.state.hasSelectedCategory) {
      if (this.state.openFormRemind) {
        return(
          <Form>
          <Text style={styles.texts}>Crea un nuevo recordatorio.</Text>
            <Item>
              <Input placeholder="Titulo" onChangeText={(data) => {this.setState({remindTitle: data})}} />
            </Item>
            <Item>
              <Input  style={{paddingTop: 10, paddingBottom: 10}} multiline= {true} numberOfLines = {1} placeholder="Contenido" onChangeText={(data) => {this.setState({remindContent: data})}} />
            </Item>

            <Button block style={styles.buttons} onPress={this.saveRemind}>
              <Text>Crear</Text>
            </Button>
            <Button block style={styles.cancelButtons} onPress={() => { this.setState({openFormRemind: false})}}>
              <Text>Cancelar</Text>
            </Button>
          </Form>
        )
      }
      else{
        return(
          <View>
            <Text style={styles.texts}>
              Crea un nuevo recordatorio.
            </Text>
            <Button transparent onPress={() => { this.setState({openFormRemind: true})}}>
              <Text>Click Aqui</Text>
            </Button>
          </View>
        )
      }
    }
    else{

      if (this.state.openForm) {
        return(
          <Form>
          <Text style={styles.texts}>Crea una nuevo categoria. </Text>
            <Item>
              <Input placeholder="Nombre" onChangeText={(data) => {this.setState({categoryName: data})}} />
            </Item>
            <Item>
              <Input placeholder="Descripción" onChangeText={(data) => {this.setState({categoryDescription: data})}} />
            </Item>

            <Button block style={styles.buttons} onPress={this.saveCategory}>
              <Text>Crear</Text>
            </Button>
            <Button block style={styles.cancelButtons} onPress={() => { this.setState({openForm: false})}}>
              <Text>Cancelar</Text>
            </Button>
          </Form>
        )
      }
      else{
        return(
          <View>
            <Text style={styles.texts}>
              Crea una nueva categoria.
            </Text>
            <Button transparent onPress={() => { this.setState({openForm: true})}}>
              <Text>Click Aqui</Text>
            </Button>
          </View>
        )
      }
    }
  }






  saveEditRemind = () => {
    let remindTitle = this.state.remindTitle;
    let remindContent = this.state.remindContent;
    let remindUid = this.state.singleRemindSelected.remindUid;
    let userUid = this.state.user.uid;
    let categoryUid = this.state.singleRemindSelected.categoryUid;

    if (remindTitle != "" && remindContent != "") {
      var record = {
        remindTitle: remindTitle,
        remindContent: remindContent,
        userUid: userUid,
        remindUid: remindUid,
        categoryUid: categoryUid,
      }
      dataBaseRef = firebase.database().ref('reminder/'+userUid+'/'+categoryUid+'/reminds/'+remindUid)
      dataBaseRef.update(record);

      this.props.showToast('El recordatorio ha sido editado correctamente.');





      this.setState({
        editView: false,
        singleRemindSelected: record,
      })



    }
    else{
      this.props.showToast('Asegúrese de llenar ambos campos.')
    }
  }

  deleteRemind = () => {

    this.setState({
      allReminders: []
    })

    let actualCategory = this.state.singleRemindSelected.categoryUid;
    dataBaseRef = firebase.database().ref('reminder/'+this.state.user.uid+'/'+this.state.singleRemindSelected.categoryUid+'/reminds/'+this.state.singleRemindSelected.remindUid);
    dataBaseRef.remove()
    this.setState({
      deleteOptionS: false,
      editView: false,
      singleRemindSelected: null
    })
    this.props.showToast('El recordatorio ha sido eliminada correctamente.')


    dataBaseRef = firebase.database().ref('reminder/'+this.props.user.uid+'/');
    dataBaseRef.on('child_added', snapchot => {
      this.setState({
        allReminders: this.state.allReminders.concat(snapchot.val())
      })
    })
    /*setTimeout(()=>{
      var allRem = this.state.allReminders.actualCategory;
      this.setState({
        allCategoryReminds: allRem
      })
    },100)*/

  }


  deleteOption = () => {
    if (this.state.deleteOptionS) {
      return(
        <View style={styles.row}>
          <Text>{'¿Estás seguro que quieres eliminar este recordatorio ?'}</Text>
          <Button style={styles.buttons} onPress={() => {this.setState({deleteOptionS: false})} }>
            <Text>No</Text>
          </Button>
          <Button style={styles.cancelButtons} onPress={this.deleteRemind}>
            <Icon style={{color: "#fff"}} name='trash' />
            <Text>Si</Text>
          </Button>
        </View>
      )
    }
    else{
      return(
        <Button style={styles.cancelButtons} onPress={()=>{this.setState({deleteOptionS: true})} }>
          <Icon style={{color: "#fff"}} name='trash' />
          <Text>Eliminar</Text>
        </Button>
      )
    }
  }


  loadCategorys= () => {
    if (this.state.hasSelectedCategory) {
      if (this.state.selectedCategory.reminds) {
        if (this.state.singleRemindSelected) {
          if (this.state.editView) {

            return(
              <Form>
                <Text style={styles.texts}>Edita este recordatorio.</Text>
                <Item>
                  <Input defaultValue={this.state.singleRemindSelected.remindTitle} placeholder="Titulo" onChangeText={(data) => {this.setState({remindTitle: data})}} />
                </Item>
                <Item>
                  <Input style={{paddingTop: 10, paddingBottom: 10}} multiline= {true} numberOfLines = {1} defaultValue={this.state.singleRemindSelected.remindContent} placeholder="Contenido" onChangeText={(data) => {this.setState({remindContent: data})}} />
                </Item>

                <Button block style={styles.buttons} onPress={this.saveEditRemind}>
                  <Text>Editar</Text>
                </Button>
                <Button block style={styles.cancelButtons} onPress={() => { this.setState({editView: null})}}>
                  <Text>Cancelar</Text>
                </Button>
              </Form>
            )
          }
          else{
            return(
              <View>
                <Card>
                  <CardItem header>
                    <H1>{this.state.singleRemindSelected.remindTitle}</H1>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>
                         {this.state.singleRemindSelected.remindContent}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
                <View style={styles.row}>
                  <Button style={styles.cancelButtons} onPress={() => {this.setState({singleRemindSelected: null })}}>
                    <Icon style={{color: "#fff"}} name='undo' />
                    <Text>Atras</Text>
                  </Button>

                  <Button style={styles.buttons} onPress={() => { this.setState({editView: true, remindTitle: this.state.singleRemindSelected.remindTitle, remindContent: this.state.singleRemindSelected.remindContent,})  }}>
                    <Icon style={{color: "#fff"}} name='create' />
                    <Text>Editar</Text>
                  </Button>

                  {
                    this.deleteOption()
                  }

                </View>

              </View>
            )
          }

        }
        else{

          var allCategoryReminds = this.state.allCategoryReminds;
          return(
            <View>
            {
              Object.keys(allCategoryReminds).map((remind, i) =>
              <TouchableHighlight key={i} onPress={()=>{this.setState({singleRemindSelected: allCategoryReminds[remind]})}}>
                <Card>
                  <CardItem header>
                    <H1>{allCategoryReminds[remind].remindTitle}</H1>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>
                         {allCategoryReminds[remind].remindContent}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableHighlight>
              )
              }

              <Button style={styles.cancelButtons} onPress={() => {this.setState({hasSelectedCategory: null })}}>
                <Icon style={{color: "#fff"}} name='undo' />
                <Text>Atras</Text>
              </Button>

            </View>
          )
        }
      }
      else {
        return(
          <View>
            <Text>Actualmente no tienes recordatorios.</Text>

            <Button style={styles.cancelButtons} onPress={() => {this.setState({hasSelectedCategory: null })}}>
              <Icon style={{color: "#fff"}} name='undo' />
              <Text>Atras</Text>
            </Button>
          </View>

        )
      }

    }
    else{
      return(
        <List>
        {
          this.state.allReminders.map((remind, i) =>
            <ListItem key={i}>
              <Body>
                <TouchableHighlight onPress={()=>{ this.setState({selectedCategory: remind, hasSelectedCategory: true, allCategoryReminds: remind.reminds}) }}>
                  <Text>{remind.categoryName}</Text>
                </TouchableHighlight>
              </Body>
            </ListItem>
          )
        }
        </List>
      )
    }
  }

  render(){
    return(
      <View>
        {
          this.newCategory()
        }

        <View>
          {
            this.loadCategorys()
          }
        </View>


      </View>
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
    margin: 5,
    backgroundColor: '#4CAF50',
  },
  cancelButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: '#F44336',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default reminder;
