import React from 'react';
import { StyleSheet} from 'react-native';
import {Root, Header, Left, Body, Title, Right, Content, Footer, FooterTab, Icon, Text, Button, Drawer} from 'native-base';
import SideBar from './sidebar';
import Wall from './wall';

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
      title: 'Noticias',
      user: this.props.user
    })
  }



  loadContent = () => {
    switch (this.state.page) {
      case 'home':
          return(<Wall user={this.state.user}/>)
        break;
      default:

    }
    return(
      <Text>Hola</Text>
    )
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




  render(){
    return(
      <Root>
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
      </Root>
    )
  }
}

const styles = StyleSheet.create({
  green: {
    backgroundColor: '#4CAF50'
  }
})

export default main;
