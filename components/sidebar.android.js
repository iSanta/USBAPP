import React from 'react';
import { StyleSheet, TouchableHighlight} from 'react-native';
import { Text, View, List, ListItem, Button } from 'native-base';


class SideBar extends React.Component {
  constructor(props) {
    super(props)

  }






  render(){
    return(
      <View style={styles.menuContainer}>
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
        </List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuContainer:{
    flex:1,
    backgroundColor: '#fff'
  }
})

export default SideBar;
