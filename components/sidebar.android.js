import React from 'react';
import { StyleSheet, TouchableHighlight} from 'react-native';
import { Text, View, List, ListItem, Button, Left, Icon, Body, Thumbnail } from 'native-base';


class SideBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount(){
    var userInfo = this.props.user;

    this.setState({
      user: userInfo
    })
  }






  render(){
    return(
      <View style={styles.menuContainer}>
      <View style={styles.row}>
        <Thumbnail large source={{uri: this.state.user.photoURL}} />
        <View style={{marginTop:10}}>
          <Text style={styles.texts}>{this.state.user.displayName}</Text>
          <Text style={styles.texts}>{this.state.user.email}</Text>
        </View>
      </View>
        <List>
          <ListItem>
            <TouchableHighlight onPress={()=>{
              this.props.navigator('home')
            }}>
              <Text>Home</Text>
            </TouchableHighlight>
          </ListItem>
          <ListItem>
            <TouchableHighlight onPress={()=>{
              this.props.navigator('notes')
            }}>
              <Text>Notas</Text>
            </TouchableHighlight>
          </ListItem>

          <ListItem icon>

            <Left>
              <Icon style={{color: '#F44336'}} name="power" />
            </Left>
            <Body>
            <TouchableHighlight onPress={()=>{
              this.props.navigator('closeSession')
            }}>
              <Text>Cerrar Sesión</Text>
              </TouchableHighlight>
            </Body>

          </ListItem>

        </List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuContainer:{
    flex:1,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#4CAF50'
  },
  texts: {
    paddingLeft: 10,
    paddingRight: 10,
    color: '#fff'
  },
})

export default SideBar;
