import React from 'react';
import { StyleSheet} from 'react-native';
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
              <Text>Home</Text>
          </ListItem>
          <ListItem>
            <Text>asdasdasd</Text>
          </ListItem>
          <ListItem>
            <Text>asdasdasd</Text>
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
