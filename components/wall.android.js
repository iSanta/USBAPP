import React from 'react';
import { StyleSheet, Image, CameraRoll, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
import { Root, Text, View, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Right, H1, H3, Form, Item, Input } from 'native-base';
import firebase from 'react-native-firebase';
import ImagePicker from './imagePicker';
var dataBaseRef = null;
const { width } = Dimensions.get('window')

class Wall extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      user: null,
      pictures: [],
      image: null,
      toPost: false,
      postTitle: null,
      postSubTitle: null,
      postImgTitle: null,
      postImgSubTitle: null,
      postContent: null,
      completed: null,
      base64: null,
      photos: [],
      toPost: false,
      postTitle: null,
      postSubTitle: null,
      postImgTitle: null,
      postImgSubTitle: null,
      postContent: null,
    }
  }

  componentWillUnmount() {
    //-------- Es necesario desmontar la referencia de la base de datos, de no ser asi al volver a cargar el componente simplemente leera el primer registro de la base de datos por alguna razon
    dataBaseRef.off();
  }

  componentWillMount(){
    this.props.title('Noticias')
    this.setState({
      user: this.props.user
    })
    dataBaseRef = firebase.database().ref('wall');
    dataBaseRef.on('child_added', snapchot =>{
      this.setState({
        pictures: this.state.pictures.concat(snapchot.val())
      })
    })

  }

  showToast=(text)=>{
    this.props.showToast(text)
  }

  render(){
    let image = this.state.image;
    return(
      <View>

        <View>
          <ImagePicker showToast={this.showToast} user={this.state.user} />
        </View>
        {
          this.state.pictures.map((post, index) =>(
            <Card style={{flex: 0}} key={index}>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: post.userPicture}} />
                <Body>
                  <Text>{post.userName}</Text>
                  <Text note>{post.imageTitle}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{uri: post.photoUrl}} style={{height: 300, width: 320, flex: 1}}/>
                <H1 style={{marginTop:5}}>{post.title}</H1>
                <H3 style={{marginBottom: 20, color: '#969696'}}>{post.subtitle}</H3>
                <Text>
                  {post.content}
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="logo-github" />
                  <Text>1,926 stars</Text>
                </Button>
              </Left>
            </CardItem>
          </Card>
          )).reverse()
        }
      </View>
    )
  }




}











const styles = StyleSheet.create({
  texts: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  post: {
    paddingTop: 10,
    paddingBottom: 10,
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

export default Wall;
