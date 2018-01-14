import React from 'react';
import { StyleSheet} from 'react-native';
import {Root, Header, Left, Body, Title, Right, Content, Footer, FooterTab, Icon, Text, Button, Drawer} from 'native-base';
import SideBar from './sidebar';
import Wall from './wall';
import Notes from './notes';

class main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: null,
      title: null,
      user: null
    }
  }
  componentWillMount(){
    this.setState({
      page: 'home',
      //title: 'Noticias',
      user: this.props.user
    })
  }

  componentWillUnmount(){
    this.setState({
      user: null
    })
  }

  changeTitle = (title) => {
    this.setState({
      title,
    })
  }
  showToast= (textShow) =>{
    this.props.showToast(textShow)
  }

  loadContent = () => {
    switch (this.state.page) {
      case 'home':
          return(<Wall showToast={this.showToast} title={this.changeTitle} user={this.state.user}/>)
        break;
      case 'notes':
          return(
            <Notes showToast={this.showToast} title={this.changeTitle} user={this.state.user}/>
          )
        break;
      case 'closeSession':
          this.props.logOff;
          return(<Text>Pseudosesioncerrada</Text>)
        break;
      default:
          return(<Text>Hola</Text>)
    }

  }

  changePage = (page) => {
    this.setState({
      page: page
    })
  };




  /////////////////////////////////////////
  //Funciones que abren y cierran el Drawer
  /////////////////////////////////////////
  closeDrawer = () => {
    this.drawer._root.close()
  };
  openDrawer = () => {
    this.drawer._root.open()
  };


  navigator = (page) =>{
    if (page == 'closeSession') {
      this.props.logOff();
    }
    else{
      this.setState({
        page,
      })
      this.closeDrawer()
    }


  }

  render(){
    return(
        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<SideBar navigator={this.navigator} />}
          onClose={() => this.closeDrawer()} >


        <Header style={styles.green}>
          <Left>
            <Button transparent onPress={this.openDrawer}>
              <Icon name='menu' />
            </Button>
          </Left>
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
            <Button  style={styles.green} full onPress={() => {this.setState({ page: 'home', title: 'Noticias'})  }} >
              <Icon name='home' style={{color: '#fff'}} />
            </Button>
          </FooterTab>
        </Footer>

        </Drawer>
    )
  }
}

const styles = StyleSheet.create({
  green: {
    backgroundColor: '#4CAF50'
  }
})

export default main;
