import React from 'react';
import { StyleSheet, Image, CameraRoll, ScrollView, TouchableHighlight, Dimensions, Platform } from 'react-native';
import { Text, View, Button, Form, Item, Input, Toast } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';

var imageDownloadUrl = "sin montar";
const { width } = Dimensions.get('window')
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
const randomNumer = Math.floor((Math.random() * 10000) + 1);

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob;




///////////////////////////////////////////////////////////////////////////////////////////////////////
//Recibe la ruta donde se encuentra la imagen dentro del dispositibo, hace un bolb y lo sube a firebase
///////////////////////////////////////////////////////////////////////////////////////////////////////
const uploadImage = (uri, imageName, mime = 'image/jpg') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    let uploadBlob = null
    const imageRef = firebase.storage().ref('wallImages').child(imageName)
    fs.readFile(uploadUri, 'base64').then((data) => {
      return Blob.build(data, {type: `${mime};BASE64`})
    }).then((blob) => {
      uploadBlob = blob
      return imageRef.put(blob, {contentType: mime})
    }).then(() => {
      uploadBlob.close()
      //-----------------Obtienen la ruta dondes esta la imagen en firebase y la guarda en una variable
      imageRef.getDownloadURL().then(function(url) {
        imageDownloadUrl = url;
      });
      Toast.show({
        text: 'La imagen ha sido cargada.',
        position: 'bottom',
        buttonText: 'Okay'
      })
      return imageRef.getDownloadURL()
    }).then((url) => {
      resolve(url)
    }).catch((error) => {
      reject(error)
    })

  })
}


class imagePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      photos: [],
      ScrollViewOpened: false,
      imageSelected: null,
      imageState: "Imagen sin ser elegida",
      user: null,
      toPost: false,
      postTitle: null,
      postSubTitle: null,
      postImgTitle: null,
      postImgSubTitle: null,
      postContent: null,
    }
  }
  componentWillMount(){
    this.setState({
      user: this.props.user
    })
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Con la informacion de las imagenens que estan en el state, hace un map y las muestra, permitiendo elejir alguna
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  loadImagesList = () => {
    if (this.state.ScrollViewOpened) {
      return(
        <ScrollView contentContainerStyle={styles.scrollContainer}>
           {this.state.photos.map((image, i) => {
             return (
              <TouchableHighlight
                key={i}
                onPress={() => this.saveToCameraRoll(image)}
                underlayColor='transparent'
              >
              <Image
               key={i}
               style={styles.image}
               source={{ uri: image.node.image.uri }}
             />
              </TouchableHighlight>
            )
         })}
         </ScrollView>
      )

    }


  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Se activa al elegir la imagen a subir, llama a la funcion UploadImage para que la guarde en el storage
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  saveToCameraRoll = (image) => {
    this.setState({
      imageSelected: image,
      imageState: "Imagen Elegida",
      ScrollViewOpened: false
    })
    uploadImage(image.node.image.uri, this.state.user.uid + randomNumer + '.jpg')
  }


  ///////////////////////////////////////////////////////////////////////////////////
  //Obtiene la informacion de las imagenes con CameraRoll y las almacena en el state
  ///////////////////////////////////////////////////////////////////////////////////
  selectAImage = () => {
    if (this.state.ScrollViewOpened) {
      this.setState({
        ScrollViewOpened: false
      })
    }
    else{
      this.setState({
        ScrollViewOpened: true
      })
      CameraRoll.getPhotos({
         first: 20,
         assetType: 'All',
       })
       .then(r => {
         this.setState({ photos: r.edges });
       })
       .catch((err) => {
          //Error Loading Images
       });
    }

  }


  /////////////////////////////////////////////////////////
  //muestra la imagen seleccionada de la lista de imagenes
  /////////////////////////////////////////////////////////
  imageSel = () => {
      if (this.state.imageSelected) {
        return(
          <Image style={styles.image} source={{ uri: this.state.imageSelected.node.image.uri }} />
        )
      }
  }



  //////////////////////////////////////////////////////////////////////////////////////////
  //Sube la informacion del formulario junto con la ruta donde esta la iamgen en el storage
  //////////////////////////////////////////////////////////////////////////////////////////
  upload = () =>{
    let title = this.state.postTitle;
    let subtitle = this.state.postSubTitle;
    let content = this.state.postContent;
    let imageTitle = this.state.postImgTitle;
    let imageSubtitle = this.state.postImgSubTitle;
    let userName = this.state.user.displayName;
    let userPicture = this.state.user.photoURL;

    if (title != null && subtitle != null && content != null && imageTitle != null && imageSubtitle != null && this.state.imageSelected != null) {

        var record = {
          title: title,
          subtitle: subtitle,
          content: content,
          imageTitle: imageTitle,
          imageSubtitle: imageSubtitle,
          photoUrl: imageDownloadUrl,
          userName: userName,
          userPicture: userPicture,
        }
        const dbRef = firebase.database().ref('wall');
        const newRegist = dbRef.push();
        newRegist.set(record);
        this.setState({
          toPost: false,
          imageSelected : null
        })
        Toast.show({
          text: 'Se ha publicado satisfactoriamente.',
          position: 'bottom',
          buttonText: 'Okay'
        })
    }
    else{
      Toast.show({
        text: 'Asegúrese de llenar todos los campos antes de enviar.',
        position: 'bottom',
        buttonText: 'Okay'
      })
    }


  }




  render(){
    if (this.state.toPost) {
      return(
        <View>
          <Form>
            <Text style={styles.texts}>
              Recuerde que la información que publique aquí podrá ser vista por los demás usuarios.
            </Text>
            <Item>
              <Input placeholder="Title" onChangeText={(data) => {this.setState({postTitle: data})}} />
            </Item>
            <Item>
              <Input placeholder="Subtitulo" onChangeText={(data) => {this.setState({postSubTitle:data})}} />
            </Item>


            <View style={{flex: 1}}>
              {this.imageSel()}
              <Button style={styles.buttons} onPress={this.selectAImage} full>
                <Text>Seleccionar imagen</Text>
              </Button>
              {
                this.loadImagesList()
              }
              <Text style={styles.texts}>Estado de la imagen: {this.state.imageState}</Text>
            </View>


            <Item>
              <Input placeholder="Titulo de la imagen" onChangeText={(data) => {this.setState({postImgTitle:data})}} />
            </Item>
            <Item>
              <Input placeholder="Subtitulo de la imagen" onChangeText={(data) => {this.setState({postImgSubTitle:data})}} />
            </Item>
            <Item>
              <Input style={{paddingTop: 10, paddingBottom: 10}} multiline= {true} numberOfLines = {4} placeholder="Contenido" onChangeText={(data) => {this.setState({postContent:data})}} />
            </Item>
            <Button style={styles.buttons} onPress={this.upload} full>
              <Text>Enviar</Text>
            </Button>
            <Button style={styles.cancelButtons} full onPress={()=>{this.setState({toPost: false})}}>
              <Text>Cancelar</Text>
            </Button>
          </Form>

        </View>
      )
    }
    else{
      return(
        <View>
          <Text style={styles.texts}>
            { '¿Quieres compartir algo?' }
          </Text>
          <Button transparent onPress={() => { this.setState({toPost: true})}}>
            <Text>Click Aqui</Text>
          </Button>
        </View>
      )
    }

  }
}


const styles = StyleSheet.create({
  texts: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
   width: width / 2,
   height: width / 2
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
  }
})

export default imagePicker;
